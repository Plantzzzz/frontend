import React from "react";
import Navbar from "../../components/landingPage/Navbar.tsx";
import HeroSection from "../../components/landingPage/HeroSection.tsx";

const HomePage: React.FC = () => {
    return (
        <>
            {/*gotta override root styling here*/}
            <div className="w-full fixed top-0 left-0 z-50">
                <Navbar />
                <HeroSection />
            </div>
        </>
    );
};

export default HomePage;
