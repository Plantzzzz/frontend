import aboutImg from "../../assets/watering.jpg"; // adjust path as needed


export const ContactHeroSection = () => (
    <section className="relative w-full h-[500px] sm:h-[600px] md:h-[700px] overflow-hidden">
        <img
            src={aboutImg} // Place image in /public/assets or import if it's in src
            alt="Contact background"
            className="absolute w-full h-full object-cover z-0"
        />
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4 bg-black/50">
            <h1 className="text-white text-4xl md:text-5xl font-extrabold mb-4">
                Contact Us
            </h1>
            <p className="text-gray-300 max-w-2xl mb-6 text-lg leading-relaxed">
                Have a question or feedback about PetalBot? We’d love to hear from you.
            </p>
        </div>
    </section>
);