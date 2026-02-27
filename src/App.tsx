import * as React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { HomePage } from "./pages/HomePage.tsx";
import "./stylesheet/BaseStyle.scss"
import { UserProvider } from "./context/UserContext.tsx";
import { CategoryHomeListPage } from "./pages/homePage/CategoryHomeListPage.tsx";
import CategoryTypePage from "./pages/typePage/CategoryTypePage.tsx";

import { NotFoundPage } from "./pages/NotFoundPage.tsx";
import {TopicCreationPage} from "./pages/creationPage/TopicCreationPage.tsx";

class App extends React.Component {
    render() {
        return (
            <UserProvider>
                <Router>
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/authorized" element={<HomePage />} /> {/* Rota de callback que renderiza a Home (o UserProvider vai capturar o code) */}

                        <Route path="/categories" element={<CategoryHomeListPage />} />
                        <Route path="/category/:id" element={<CategoryTypePage />} />

                        <Route path="/topic/new" element={<TopicCreationPage/>}/>

                        <Route path="*" element={<NotFoundPage />} />
                    </Routes>
                </Router>
            </UserProvider>
        )
    }
}

export default App
