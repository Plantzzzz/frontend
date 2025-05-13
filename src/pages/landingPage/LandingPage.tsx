import React from "react";
import Navbar from "../../components/landingPage/Navbar.tsx";

const LandingPage: React.FC = () => {
    return (
        <>
            {/*gotta override root styling here*/}
            <div className="w-full fixed top-0 left-0 z-50">
                <Navbar />
            </div>
        </>
    );
};

export default LandingPage;
