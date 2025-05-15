import {TestimonialsSection} from "../../components/landingPage/TestimonialsSection.tsx";
import {FAQSection} from "../../components/landingPage/FAQSection.tsx";
import {CTASection} from "../../components/landingPage/CTASection.tsx";
import {AboutIntroSection} from "../../components/landingPage/AboutIntroSection.tsx";
import {TeamSection} from "../../components/landingPage/TeamSection.tsx";
import {AboutHeroSection} from "../../components/landingPage/AboutHeroSection.tsx";

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-white">
            <AboutHeroSection />
            <AboutIntroSection />
            <TeamSection />
            <CTASection />
            <TestimonialsSection />
            <FAQSection />
            {/*<div className="h-16 bg-white" />*/}
        </div>
    );
}
