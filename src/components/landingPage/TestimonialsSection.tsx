export const TestimonialsSection = () => (
    <section className="py-20 px-6 md:px-12 bg-white border-t border-gray-200">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-black">What Users Are Saying</h2>
        <div className="max-w-4xl mx-auto grid gap-10 md:grid-cols-2">
            {["PetalBot reminded me to water my succulents just in time!", "I use it to track all my balcony herbs, super helpful.", "I love the clean design and how it keeps my plant notes organized.", "Petty suggested a better soil type that actually worked."].map((quote, i) => (
                <div key={i} className="bg-gray-100 p-6 rounded-lg shadow-sm">
                    <p className="text-sm text-gray-700 italic">“{quote}”</p>
                    <p className="mt-3 text-sm text-gray-500">– Student User #{i + 1}</p>
                </div>
            ))}
        </div>
    </section>
);