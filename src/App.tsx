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
import AreasPage from "./pages/dashboard/AreasPage.tsx";
import ImagesPage from "./pages/dashboard/ImagesPage.tsx";
import AboutPage from "./pages/landingPage/AboutPage.tsx";
import ContactPage from "./pages/landingPage/ContactPage.tsx";
// Stylesheets
import "./App.css";

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

                <Route path="areas" element={<AreasPage/>}/>
            </Route>

            <Route path="/landingPage" element={<LandingPageLayout/>}>
                <Route index element={<HomePage/>}/>

                <Route path="about" element={<AboutPage/>}/>
                <Route path="register" element={<RegisterPage/>}/>
                <Route path="contact" element={<ContactPage/>}/>
            </Route>
        </Routes>
    );
}

export default App;
