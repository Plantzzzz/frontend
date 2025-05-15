import aboutImg from "../../assets/about.jpg"; // adjust path as needed


export const AboutHeroSection = () => (
    <section className="relative w-full h-[500px] sm:h-[600px] md:h-[700px] overflow-hidden">
        <img
            src={aboutImg}
            alt="Leaves background"
            className="absolute w-full h-full object-cover z-0"
        />
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4 bg-black/50">
            <h1 className="text-white text-4xl md:text-5xl font-extrabold mb-4">
                Our Story
            </h1>
            <p className="text-gray-300 max-w-2xl mb-6 text-lg leading-relaxed">
                PetalBot was created by FERI students with a shared passion for technology and nature. It’s our contribution to smarter, simpler plant care — guided by data, designed with love.
            </p>
        </div>
    </section>
);
