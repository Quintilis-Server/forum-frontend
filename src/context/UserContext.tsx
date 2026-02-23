import type { BaseState } from "../types/PageTypes.ts";
import type { User } from "../types/User.ts";
import { createContext, type ReactNode } from "react";
import { BaseComponent } from "../components/BaseComponent.tsx";
import { AuthService } from "../service/AuthService.ts";
import { jwtDecode } from "jwt-decode";
import { AUTH_URL } from "../Consts.ts";

export interface UserContextProps {
    isLoggedIn: boolean
    isAdmin: boolean,
    user?: User,
    loading: boolean,
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
}

type UserContextState = BaseState & {
    isLoggedIn: boolean
    isAdmin: boolean,
    user?: User
}

export const UserContext = createContext<UserContextProps>({
    isLoggedIn: false,
    isAdmin: false,
    user: undefined,
    loading: true,
    login: async () => { },
    logout: () => { },
})

export class UserProvider extends BaseComponent<{ children: ReactNode }, UserContextState> {
    state: UserContextState = {
        isLoggedIn: false,
        isAdmin: false,
        user: undefined,
        loading: true
    }

    private worker: Worker | null = null;

    componentDidMount() {
        this.checkLoginStatus();
        this.startTokenRefreshWorker();
    }

    componentWillUnmount() {
        if (this.worker) {
            this.worker.postMessage({ type: 'STOP' });
            this.worker.terminate();
        }
    }

    private startTokenRefreshWorker() {
        // Inicializa o Web Worker para rodar na background thread
        this.worker = new Worker(new URL('../service/TokenWorker.ts', import.meta.url), { type: 'module' });

        this.worker.onmessage = (event: MessageEvent) => {
            const { type, payload } = event.data;

            if (type === 'CHECK_STORAGE') {
                // Worker precisa ler o localStorage (workers não têm acesso direto)
                const refreshToken = localStorage.getItem("refreshToken");
                const expiresAt = localStorage.getItem("expiresAt");
                this.worker?.postMessage({
                    type: 'STORAGE_DATA',
                    payload: { refreshToken, expiresAt }
                });
            } else if (type === 'TOKENS_REFRESHED') {
                // Worker conseguiu dar refresh, salvamos os tokens e atualizamos o estado
                AuthService.saveTokens(payload);
                this.updateUserFromToken();
            } else if (type === 'SESSION_EXPIRED_SILENT') {
                // Sessão expirou — limpa silenciosamente sem redirecionar nem mostrar modal.
                // O usuário continua navegando normalmente até tentar fazer algo que precise de auth.
                console.log("[UserContext] Session expired silently. User can still browse.");
                AuthService.clearSession();
                this.setState({
                    isLoggedIn: false,
                    isAdmin: false,
                    user: undefined
                });
            }
        };

        // Envia as configurações para o Worker começar a trabalhar
        this.worker.postMessage({
            type: 'INIT',
            payload: {
                AUTH_URL: AUTH_URL,
                CLIENT_ID: "forum-frontend",
                CLIENT_SECRET: "secret-forum",
                API_OAUTH2_ROUTES: `${AUTH_URL}/oauth2`
            }
        });
    }

    /**
     * Atualiza o estado do usuário a partir do token no localStorage.
     */
    private updateUserFromToken() {
        const token = AuthService.getAccessToken();
        if (!token) return;

        try {
            const decoded: any = jwtDecode(token);
            const roles = decoded.roles || [];
            const isAdmin = roles.includes('ADMIN');

            const user: User = {
                id: decoded.user_id || decoded.sub,
                username: decoded.username || decoded.preferred_username,
                role: isAdmin ? 'ADMIN' : 'USER',
                avatarPath: decoded.avatar_path || undefined,
                isVerified: decoded.email_verified || false
            };

            this.setState({
                isLoggedIn: true,
                user: user,
                isAdmin: isAdmin,
                loading: false
            });
        } catch (e) {
            console.error("Erro ao decodificar token", e);
        }
    }

    private checkLoginStatus = async () => {
        // Verifica se há um código de autorização na URL (callback do OAuth2)
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');

        if (code) {
            // Limpa a URL para não ficar com o código exposto
            window.history.replaceState({}, document.title, window.location.pathname);

            this.setState({ loading: true });
            const success = await AuthService.handleCallback(code);
            if (success) {
                // Se o callback foi bem sucedido, recarrega o status
                // O token já foi salvo no localStorage pelo handleCallback
            } else {
                console.error("Falha ao processar callback de login");
            }
        }

        const isAuthenticated = AuthService.isAuthenticated();
        if (isAuthenticated) {
            this.updateUserFromToken();
        } else {
            this.setState({ isLoggedIn: false, loading: false });
        }
    }

    private login = async () => {
        // Redireciona para o login do OAuth2
        window.location.href = AuthService.getLoginUrl();
    }

    private logout = () => {
        AuthService.logout();
        this.setState({
            isLoggedIn: false,
            isAdmin: false,
            user: undefined
        });
    }

    render() {
        return (
            <UserContext.Provider value={{
                isLoggedIn: this.state.isLoggedIn,
                isAdmin: this.state.isAdmin,
                user: this.state.user,
                loading: this.state.loading,
                login: this.login,
                logout: this.logout
            }}>
                {this.props.children}
            </UserContext.Provider>
        );
    }
}