import {Outlet} from "react-router-dom";
import Navbar from "../components/landingPage/Navbar.tsx";

function LandingPageLayout() {
    return (
        <div className="LandingPageParent">
            {/*gotta override root styling here*/}
            <div className="w-full fixed top-0 left-0 z-50">
                <Navbar/>
                <Outlet/>
            </div>
        </div>
    )
}

export default LandingPageLayout;