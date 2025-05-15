import {useState} from "react";
import {Route, Routes} from "react-router-dom";
// Layouts
import DashboardLayout from "./layouts/DashboardLayout.tsx";
import LandingPageLayout from "./layouts/LandingPageLayout.tsx";
// Pages
import RegisterPage from "./pages/landingPage/RegisterPage.tsx";
import HomePage from "./pages/landingPage/HomePage.tsx";
import SpacesPage from "./pages/dashboard/SpacesPage.tsx";
import DashboardPage from "./pages/dashboard/DashboardPage.tsx";
import PlantsPage from "./pages/dashboard/PlantsPage.tsx";
import FeedingSchedulePage from "./pages/dashboard/FeedingSchedulePage.tsx";
import ToDoPage from "./pages/dashboard/ToDoPage.tsx";
import NotesPage from "./pages/dashboard/NotesPage.tsx";
// Stylesheets
import "./App.css";
import SecondaryNavbar from "./components/dashboard/SecondaryNavbar.tsx";
import TableGrid from "./components/dashboard/TableGrid.tsx";
import ImagesPage from "./pages/dashboard/ImagesPage.tsx";

function App() {
    const [count, setCount] = useState(0);

    return (
        <Routes>
            <Route path="/dashboard" element={<DashboardLayout/>}>
                <Route index element={<DashboardPage/>}/>
                <Route path="spaces" element={<SpacesPage/>}/>
                <Route path="plants" element={<PlantsPage/>}/>
                <Route path="schedule" element={<FeedingSchedulePage/>}/>
                <Route path="todo" element={<ToDoPage/>}/>
                <Route path="notes" element={<NotesPage/>}/>
                <Route path="images" element={<ImagesPage/>}/>

                <Route path="areas" element={<SecondaryNavbar/>}/>
                <Route path="areas" element={<TableGrid/>}/>
            </Route>

            <Route path="/landingPage" element={<LandingPageLayout/>}>
                <Route path="" element={<HomePage/>}/>
                <Route path="register" element={<RegisterPage/>}/>
            </Route>
        </Routes>
    );
}

export default App;
