import React from "react";
import {ToolsSection} from "../../components/landingPage/ToolsSection.tsx";
import {CTASection} from "../../components/landingPage/CTASection.tsx";
import {TestimonialsSection} from "../../components/landingPage/TestimonialsSection.tsx";
import {FAQSection} from "../../components/landingPage/FAQSection.tsx";
import { HeroSection } from "../../components/landingPage/HeroSection.tsx";

const HomePage: React.FC = () => {
    return (
        <>
            <HeroSection />
            <ToolsSection />
            {/*<AssistantSection />*/}
            <CTASection />
            <TestimonialsSection />
            <FAQSection />
        </>
    );
};

export default HomePage;
