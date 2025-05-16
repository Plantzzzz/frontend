import {GiFlowerPot, GiBrain, GiWaterDrop, GiNotebook} from "react-icons/gi";

export const ToolsSection = () => {
    const tools = [
        {
            heading: "Track Growth",
            icon: <GiFlowerPot className="text-green-600 text-4xl mx-auto" />,
            description: "Use this tool to track your plant’s development. See how far your green friends have come.",
        },
        {
            heading: "Get Suggestions",
            icon: <GiBrain className="text-green-600 text-4xl mx-auto" />,
            description: "Receive smart, AI-powered advice for your garden's health, layout, and care routines.",
        },
        {
            heading: "Claim Care Goals",
            icon: <GiWaterDrop className="text-green-600 text-4xl mx-auto" />,
            description: "Set and achieve watering or sunlight goals with easy-to-manage targets.",
        },
        {
            heading: "Type Notes",
            icon: <GiNotebook className="text-green-600 text-4xl mx-auto" />,
            description: "Keep organized notes for each plant — perfect for research, reminders, or journaling.",
        },
    ];

    return (
        <section className="py-20 px-6 md:px-12 bg-white">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">Tools to Help You Grow</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 text-center">
                {tools.map((tool, i) => (
                    <div key={i} className="space-y-3">
                        {tool.icon}
                        <h3 className="font-semibold text-gray-800 text-lg">{tool.heading}</h3>
                        <p className="text-sm text-gray-600 leading-relaxed">{tool.description}</p>
                    </div>
                ))}
            </div>
        </section>
    );
};
