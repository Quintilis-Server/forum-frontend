import type { BaseProps, PageState } from "../types/PageTypes.ts";
import { BaseComponent } from "../components/BaseComponent.tsx";
import type { BaseException } from "../exceptions/BaseException.ts";
import { Header } from "../components/Header.tsx";
import { UserContext } from "../context/UserContext.tsx";
import "../stylesheet/LoadingStyle.scss"
import "../stylesheet/ErrorPopupStyle.scss"

export abstract class BasePage<P extends BaseProps, S extends PageState> extends BaseComponent<P, S> {

    static contextType = UserContext;
    declare context: React.ContextType<typeof UserContext>;

    public constructor(props: P, initialState: S);
    public constructor(initialState: S);

    public constructor(arg1: P | S, arg2?: S) {
        if (arg2) {
            super(arg1 as P);
            this.state = arg2;
        } else {
            super({} as P);
            this.state = arg1 as S;
        }
    }

    componentDidMount() {
        document.title = `${this.state.title} - Quintilis`
    }

    private dismissError = () => {
        this.setState({ err: undefined } as unknown as Pick<S, "err">);
    }

    private goHome = () => {
        window.location.href = "/";
    }

    protected renderErrorPopup(err: BaseException | null) {
        const errMessage = err?.message || "Ocorreu um erro desconhecido.";
        const errCode = err?.getErrCode?.();

        return (
            <div className="error-overlay" onClick={this.dismissError}>
                <div className="error-popup" onClick={(e) => e.stopPropagation()}>
                    <div className="error-popup-header">
                        <span className="error-popup-icon">⚠</span>
                        <h3 className="error-popup-title">Erro</h3>
                    </div>

                    <p className="error-popup-message">{errMessage}</p>

                    {errCode && (
                        <span className="error-popup-code">CODE: {errCode}</span>
                    )}

                    <div className="error-popup-actions">
                        <button className="error-popup-btn error-popup-btn-dismiss" onClick={this.dismissError}>
                            Fechar
                        </button>
                        <button className="error-popup-btn error-popup-btn-home" onClick={this.goHome}>
                            Ir para Início
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    protected renderLoading() {
        return (
            <div className="loading-wrapper">
                <div className="loading-spinner" />
                <p className="loading-text">Carregando...</p>
            </div>
        )
    }

    protected abstract renderContent(): React.ReactNode;

    render() {
        return (
            <>
                <Header />
                {this.state.err && this.renderErrorPopup(this.state.err)}
                {this.state.loading ? (
                    this.renderLoading()
                ) : this.renderContent()}
                {/*<Footer/>*/}
            </>
        )
    }
}