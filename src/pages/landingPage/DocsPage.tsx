import {DocsHeroSection} from "../../components/landingPage/DocsHeroSection.tsx";
import {DocsContentSection} from "../../components/landingPage/DocsContentSection.tsx";


export default function DocsPage() {
    return (
        <div className="min-h-screen bg-white">
            <DocsHeroSection />
            <DocsContentSection />
        </div>
    );
}
