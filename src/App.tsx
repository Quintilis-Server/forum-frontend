import * as React from "react";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import {HomePage} from "./pages/HomePage.tsx";

class App extends React.Component {
    render() {
        return (
            <>
                <Router>
                    <Routes>
                        <Route path="/" element={<HomePage/>}/>
                    </Routes>
                </Router>
            </>
        )
    }
}

export default App
