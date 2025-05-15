export const AssistantSection = () => (
    <section className="py-20 px-6 md:px-12 bg-gray-50">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-10 text-center">Petty - Your AI Assistant</h2>
        <div className="flex flex-col gap-6 items-center">
            {[...Array(2)].map((_, i) => (
                <div key={i} className="w-full max-w-3xl h-14 bg-gray-300 rounded-md animate-pulse"></div>
            ))}
        </div>
    </section>
);