import { Link } from "react-router-dom";

export const HeroSection = () => (
    <section className="relative w-full h-[500px] sm:h-[600px] md:h-[700px] overflow-hidden">
        <img
            src="./src/assets/hero.jpg"
            alt="Leaves background"
            className="absolute w-full h-full object-cover z-0"
        />
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4 bg-black/50">
            <h1 className="text-white text-4xl md:text-5xl font-extrabold mb-4">What is Petal Bot?</h1>
            <p className="text-gray-300 max-w-2xl mb-6 text-lg leading-relaxed">
                Petal Bot is your personalized AI-powered garden assistant designed to help your plants thrive. From tips to tracking, it's everything in one place.
            </p>
            <Link to="/landingPage/about" className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 transition">Learn More</Link>
        </div>
    </section>
);