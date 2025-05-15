import { Outlet } from "react-router-dom";
import Navbar from "../components/landingPage/Navbar.tsx";
import {Footer} from "../components/landingPage/Footer.tsx";

function LandingPageLayout() {
    return (
        <div className="LandingPageParent min-h-screen flex flex-col">
            {/* Fixed navbar */}
            <div className="w-full fixed top-0 left-0 z-50">
                <Navbar />
            </div>

            {/* Content below navbar, with padding top to avoid overlap */}
            <main>
                <Outlet />
            </main>

                <Footer />
        </div>
    );
}

export default LandingPageLayout;
