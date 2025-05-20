// pages/dashboard/PlantNotesAndTodos.tsx
import React, { useState } from "react";
import PlantNoteEditor from "../../components/dashboard/PlantNoteEditor";
import SimplePlantSelector from "../../components/dashboard/SimplePlantSelector";
import PlantTodoList from "../../components/dashboard/PlantTodoList";

interface GroupedPlant {
    key: string;
    plant: string;
    location: string;
    cells: string[];
}

const PlantNotesAndTodosPage: React.FC = () => {
    const [selected, setSelected] = useState<GroupedPlant | null>(null);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto p-6">
            <SimplePlantSelector
                onSelect={(plant) => setSelected(plant)}
                selectedKey={selected?.key || ""}
            />
            <div className="space-y-6">
                {selected ? (
                    <>
                        <PlantNoteEditor group={selected} />
                        <PlantTodoList group={selected} />
                    </>
                ) : (
                    <p className="text-gray-500">Select a plant to view notes and tasks.</p>
                )}
            </div>
        </div>
    );
};

export default PlantNotesAndTodosPage;
