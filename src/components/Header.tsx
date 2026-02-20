import {BaseComponent} from "./BaseComponent.tsx";
import "../stylesheet/NavBarStyle.scss"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowRightToBracket, faRightFromBracket, faUser} from "@fortawesome/free-solid-svg-icons";
import {UserContext} from "../context/UserContext.tsx";
import * as React from "react";
import {AUTH_URL} from "../Consts.ts";
import {AuthService} from "../service/AuthService.ts";

export class Header extends BaseComponent {

    static contextType = UserContext;
    declare context: React.ContextType<typeof UserContext>;

    render() {
        const { isLoggedIn, isAdmin, user, logout } = this.context;

        return (
            <nav className="navbar">
                <div className="navbar-inner container">
                    <a className="nav-logo" href="/">
                        <span className="logo-letter">Q</span>
                        <span className="logo-text">uintilis</span>
                    </a>


                    <div className={`nav-links`}>
                        {isLoggedIn && isAdmin && (
                            <a href={"/admin/category/new"}>Criar Categorias</a>
                        )}
                        <a href="/categories">Categorias</a>
                        <a href="/topics">Top Posts</a>
                        <a href="/news">Notícias</a>
                    </div>

                    <div className="nav-actions">
                        {isLoggedIn ? (
                            <div className="user-menu">
                                <a href={`${AUTH_URL}/account`} className="user-profile-link">
                                    <span className="username">{user?.username}</span>
                                    {user?.avatarPath ? (
                                        <img src={user.avatarPath} alt="Avatar" className="user-avatar" />
                                    ) : (
                                        <FontAwesomeIcon icon={faUser} className="user-icon" />
                                    )}
                                </a>
                                <FontAwesomeIcon onClick={logout} icon={faRightFromBracket} />
                            </div>
                        ) : (
                            <a href={AuthService.getLoginUrl()} className="login-link">
                                <FontAwesomeIcon icon={faArrowRightToBracket} />
                                <span style={{marginLeft: '5px'}}>Entrar</span>
                            </a>
                        )}
                    </div>
                </div>
                {/* ${this.state.menuOpen ? 'open' : ''}*/}
            </nav>
        )
    }
}