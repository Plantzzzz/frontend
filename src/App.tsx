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
import SeasonalCalendar from "./pages/dashboard/SeasonalTips.tsx";
import ToDoPage from "./pages/dashboard/ToDoPage.tsx";
import NotesPage from "./pages/dashboard/NotesPage.tsx";
import AreasPage from "./pages/dashboard/AreasPage.tsx";
import ImagesPage from "./pages/dashboard/ImagesPage.tsx";
import AboutPage from "./pages/landingPage/AboutPage.tsx";
import ContactPage from "./pages/landingPage/ContactPage.tsx";
import DocsPage from "./pages/landingPage/DocsPage.tsx";
import PrivacyTerms from "./pages/landingPage/PrivacyTerms.tsx";
import {LoginForm} from "./components/landingPage/LoginForm.tsx";
import UserPage from "./pages/dashboard/UserPage.tsx";

// Scripts
import {ScrollToTop} from "./scripts/ScrollToTop"; // adjust path if needed
import ProtectedRoute from "./scripts/ProtectedRoute.tsx";

// Components from feature/plantRecognition
import PlantRecognizer from "./components/dashboard/PlantRecognizer.tsx";

// Stylesheets
import "./App.css";
import PlantStatsDashboard from "./pages/dashboard/PlantStats.tsx";

function App() {
    return (
        <>
            <ScrollToTop/>
            <Routes>
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <DashboardLayout/>
                        </ProtectedRoute>
                    }
                >
                    <Route index element={<DashboardPage/>}/>

                    <Route path="spaces" element={<SpacesPage/>}/>
                    <Route path="plants" element={<PlantsPage/>}/>
                    <Route path="tips" element={<SeasonalCalendar/>}/>
                    <Route path="todo" element={<ToDoPage/>}/>
                    <Route path="notes" element={<NotesPage/>}/>
                    <Route path="images" element={<ImagesPage/>}/>

                    <Route path="areas" element={<AreasPage/>}/>

                    <Route path="plantrecognition" element={<PlantRecognizer />} />

                    <Route path="user" element={<UserPage/>}/>
                    <Route path="stats" element={<PlantStatsDashboard />} />
                </Route>

                <Route path="/" element={<LandingPageLayout/>}>
                    <Route index element={<HomePage/>}/>
                    <Route path="about" element={<AboutPage/>}/>
                    <Route path="docs" element={<DocsPage/>}/>
                    <Route path="contact" element={<ContactPage/>}/>
                    <Route path="terms" element={<PrivacyTerms/>}/>
                    <Route path="register" element={<RegisterPage/>}/>
                    <Route path="login" element={<LoginForm/>}/>
                </Route>
            </Routes>
        </>
    );
}

export default App;
