import {useState} from "react";
import "./App.css";
import RegisterPage from "./pages/dashboard/RegisterPage.tsx";
import {Route, Routes} from "react-router-dom";
import DashboardLayout from "./layouts/DashboardLayout.tsx";
import LandingPageLayout from "./layouts/LandingPageLayout.tsx";

function App() {
    const [count, setCount] = useState(0);

    return (
        <Routes>
            <Route path="/dashboard" element={<DashboardLayout/>}>
                <Route path="register" element={<RegisterPage/>}/>
            </Route>

            <Route path="/landingPage" element={<LandingPageLayout/>}>
                {/*<Route path="example" element={<ExamplePage/>}/>*/}
            </Route>
        </Routes>
    );
}

export default App;
