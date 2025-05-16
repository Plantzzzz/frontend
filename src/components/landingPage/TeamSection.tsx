export const TeamSection = () => (
    <section className="py-20 px-6 md:px-12 bg-gray-50">
        <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-10">Meet the Team</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                {[
                    { name: "Tara Jakhel", role: "Frontend Developer", bio: "Focused on creating clean UI and UX using React and Tailwind." },
                    { name: "Marko Intihar", role: "Backend Engineer", bio: "Handles APIs, database, and integrations." },
                    { name: "Niko Ogrizek", role: "ML & AI Integration", bio: "Built the logic for Petty, our plant assistant." },
                ].map((member, i) => (
                    <div key={i} className="bg-white shadow-md p-6 rounded-md text-left">
                        <h3 className="text-lg font-semibold text-gray-800">{member.name}</h3>
                        <p className="text-sm text-green-600 mb-1">{member.role}</p>
                        <p className="text-sm text-gray-600">{member.bio}</p>
                    </div>
                ))}
            </div>
        </div>
    </section>
);