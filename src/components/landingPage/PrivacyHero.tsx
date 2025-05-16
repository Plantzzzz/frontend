import privacyImg from "../../assets/privacy.jpg"; // Replace with your actual image

export const PrivacyHeroSection = () => (
    <section className="relative w-full h-[500px] sm:h-[600px] md:h-[700px] overflow-hidden">
        <img
            src={privacyImg}
            alt="Privacy background"
            className="absolute w-full h-full object-cover z-0"
        />
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4 bg-black/50">
            <h1 className="text-white text-4xl md:text-5xl font-extrabold mb-4">
                Privacy & Terms
            </h1>
            <p className="text-gray-300 max-w-2xl mb-6 text-lg leading-relaxed">
                Learn how we collect, use, and protect your data — and what rules apply when using PetalBot.
            </p>
        </div>
    </section>
);
