import {useState} from "react";
import {Route, Routes} from "react-router-dom";
// Layouts
import DashboardLayout from "./layouts/DashboardLayout.tsx";
import LandingPageLayout from "./layouts/LandingPageLayout.tsx";
// Pages
import RegisterPage from "./pages/landingPage/RegisterPage.tsx";
import LandingPage from "./pages/landingPage/LandingPage.tsx";
// Stylesheets
import "./App.css";

function App() {
    const [count, setCount] = useState(0);

    return (
        <Routes>
            <Route path="/dashboard" element={<DashboardLayout/>}>
                {/*<Route path="example" element={<ExamplePage/>}/>*/}
            </Route>

            <Route path="/landingPage" element={<LandingPageLayout/>}>
                <Route path="" element={<LandingPage/>}/>
                <Route path="register" element={<RegisterPage/>}/>
            </Route>
        </Routes>
    );
}

export default App;
