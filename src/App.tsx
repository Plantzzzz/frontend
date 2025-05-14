import {useState} from "react";
import {Route, Routes} from "react-router-dom";
// Layouts
import DashboardLayout from "./layouts/DashboardLayout.tsx";
import LandingPageLayout from "./layouts/LandingPageLayout.tsx";
// Pages
import RegisterPage from "./pages/landingPage/RegisterPage.tsx";
import HomePage from "./pages/landingPage/HomePage.tsx";
// Stylesheets
import "./App.css";
import SecondaryNavbar from "./components/dashboard/SecondaryNavbar.tsx";
import TableGrid from "./components/dashboard/TableGrid.tsx";
import PlantRecognizer from "./components/dashboard/PlantRecognizer.tsx";

function App() {
    const [count, setCount] = useState(0);

    return (
        <Routes>
            <Route path="/dashboard" element={<DashboardLayout/>}>
                <Route path="areas" element={<SecondaryNavbar/>}/>
                {/*if you get any error on the line below, ignore it.*/}
                <Route path="areas" element={<TableGrid/>}/>
                <Route path="plantrecognition" element={<PlantRecognizer />} />
            </Route>

            <Route path="/" element={<LandingPageLayout/>}>
                <Route path="" element={<HomePage/>}/>
                <Route path="register" element={<RegisterPage/>}/>
            </Route>
        </Routes>
    );
}

export default App;
