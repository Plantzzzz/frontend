const HeroSection = () => {
    return (
        <section className="relative w-full">
            <div className="h-[400px] w-full bg-[url('./src/assets/hero.jpg')] bg-cover bg-center" />
            <div className="max-w-4xl mx-auto text-center px-4 py-12">
                <h1 className="text-4xl font-bold mb-4">What is Petal Bot?</h1>
                <p className="text-gray-600 mb-6">
                    Bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla
                </p>
                <button className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition">
                    Button
                </button>
            </div>
        </section>
    );
};

export default HeroSection;
