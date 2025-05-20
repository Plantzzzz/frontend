import React, { useState } from 'react';
import PlantList from "../../components/dashboard/PlantList.tsx";
import PlantProfileModal from "../../components/dashboard/PlantProfileModal";

interface GroupedPlant {
    // Add required properties based on your data structure
    id: string;
    name: string;
    // ... other properties
}

const PlantsPage: React.FC = () => {
    const [selectedPlant, setSelectedPlant] = useState<GroupedPlant | null>(null);

    return (
        <div className="max-w-5xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">Plants</h1>
            <PlantList selected={selectedPlant} onSelect={setSelectedPlant} />
            {selectedPlant && (
                <PlantProfileModal
                    plant={selectedPlant}
                    onClose={() => setSelectedPlant(null)}
                />
            )}
        </div>
    );
};

export default PlantsPage;
