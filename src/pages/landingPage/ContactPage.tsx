import { ContactFormSection } from "../../components/landingPage/ContactFormSection";
import {ContactHeroSection} from "../../components/landingPage/ContactHero.tsx";

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-white">
            <ContactHeroSection />
            <ContactFormSection />
        </div>
    );
}
