import React, { useState } from "react";
import PlantNoteEditor from "../../components/dashboard/PlantNoteEditor";
import SimplePlantSelector from "../../components/dashboard/SimplePlantSelector";
import PlantTodoList from "../../components/dashboard/PlantTodoList";
import { motion, AnimatePresence } from "framer-motion";

interface GroupedPlant {
    key: string;
    plant: string;
    location: string;
    cells: string[];
}

const PlantNotesAndTodosPage: React.FC = () => {
    const [selected, setSelected] = useState<GroupedPlant | null>(null);
    const [activeTab, setActiveTab] = useState<"notes" | "tasks">("notes");

    return (
        <div className="max-w-5xl mx-auto p-6">
            <div className="mb-8">
                <SimplePlantSelector
                    onSelect={(plant) => setSelected(plant)}
                    selectedKey={selected?.key || ""}
                />
            </div>

            {selected && (
                <div className="flex justify-center mb-6 space-x-4">
                    <motion.button
                        onClick={() => setActiveTab("notes")}
                        whileTap={{ scale: 0.95 }}
                        className={`px-4 py-2 rounded-lg font-semibold transition ${
                            activeTab === "notes"
                                ? "bg-green-600 text-white"
                                : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                        }`}
                    >
                        📝 Notes
                    </motion.button>
                    <motion.button
                        onClick={() => setActiveTab("tasks")}
                        whileTap={{ scale: 0.95 }}
                        className={`px-4 py-2 rounded-lg font-semibold transition ${
                            activeTab === "tasks"
                                ? "bg-green-600 text-white"
                                : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                        }`}
                    >
                        ✅ Tasks
                    </motion.button>
                </div>
            )}

            <div className="min-h-[300px]">
                {selected ? (
                    <AnimatePresence mode="wait">
                        {activeTab === "notes" ? (
                            <motion.div
                                key="notes"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.1 }}
                            >
                                <PlantNoteEditor group={selected} />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="tasks"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.1 }}
                            >
                                <PlantTodoList group={selected} />
                            </motion.div>
                        )}
                    </AnimatePresence>
                ) : (
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-gray-500 text-center"
                    >
                        Select a plant to view notes and tasks.
                    </motion.p>
                )}
            </div>
        </div>
    );
};

export default PlantNotesAndTodosPage;
