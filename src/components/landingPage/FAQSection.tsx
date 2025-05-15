export const FAQSection = () => (
    <section className="py-20 px-6 md:px-12 bg-gray-50 border-t border-gray-100">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-black">Frequently Asked Questions</h2>
        <div className="max-w-3xl mx-auto space-y-6">
            {[{
                q: "Is PetalBot free to use?",
                a: "Yes! It's completely free as part of our university project.",
            }, {
                q: "Does it work offline?",
                a: "Some tools work offline, but the assistant needs an internet connection.",
            }, {
                q: "Can I track multiple plants?",
                a: "Absolutely. You can manage as many plants as you like.",
            }].map((item, i) => (
                <div key={i}>
                    <h3 className="text-lg font-semibold text-gray-800">{item.q}</h3>
                    <p className="text-sm text-gray-600 mt-1">{item.a}</p>
                </div>
            ))}
        </div>
    </section>
);