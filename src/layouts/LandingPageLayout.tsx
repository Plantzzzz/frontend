import {Outlet} from "react-router-dom";

function LandingPageLayout() {
    return (
            <div className="LandingPageParent">
                <h1>This is a Landing Page placeholder.</h1>
                <Outlet/>
            </div>
    )
}

export default LandingPageLayout;