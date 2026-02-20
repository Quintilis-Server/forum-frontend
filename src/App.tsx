import * as React from "react";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import {HomePage} from "./pages/HomePage.tsx";
import "./stylesheet/BaseStyle.scss"
import {CategoryCreationPage} from "./pages/creationPage/CategoryCreationPage.tsx";
import {UserProvider} from "./context/UserContext.tsx";

class App extends React.Component {
    render() {
        return (
            <UserProvider>
                <Router>
                    <Routes>
                        <Route path="/" element={<HomePage/>}/>
                        <Route path="/admin/category/new" element={<CategoryCreationPage/>}/>
                        <Route path="/authorized" element={<HomePage/>}/> {/* Rota de callback que renderiza a Home (o UserProvider vai capturar o code) */}
                    </Routes>
                </Router>
            </UserProvider>
        )
    }
}

export default App
