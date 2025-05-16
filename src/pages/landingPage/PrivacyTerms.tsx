import {PrivacyHeroSection} from "../../components/landingPage/PrivacyHero.tsx";
import {PrivacyTermsContent} from "../../components/landingPage/PrivacyTermsContent.tsx";

export default function PrivacyTerms() {
    return (
        <div className="min-h-screen bg-white">
            <PrivacyHeroSection />
            <PrivacyTermsContent />
        </div>
    );
}
