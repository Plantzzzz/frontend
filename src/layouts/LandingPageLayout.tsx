import {Outlet} from "react-router-dom";

function LandingPageLayout() {
    return (
            <div className="LandingPageParent">
                <Outlet/>
            </div>
    )
}

export default LandingPageLayout;