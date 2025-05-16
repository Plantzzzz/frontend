import React from "react";

interface PlantPickerModalProps {
    plantOptions: string[];
    searchTerm: string;
    setSearchTerm: (val: string) => void;
    setCurrentPlant: (plant: string) => void;
    setIsPlantingMode: (val: boolean) => void;
    onClose: () => void;
}

const PlantPickerModal: React.FC<PlantPickerModalProps> = ({
                                                               plantOptions,
                                                               searchTerm,
                                                               setSearchTerm,
                                                               setCurrentPlant,
                                                               setIsPlantingMode,
                                                               onClose,
                                                           }) => {
    const filteredPlants = plantOptions.filter((p) =>
        p.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded shadow-lg space-y-4 text-black w-96">
                <h2 className="text-lg font-bold">Choose a plant to assign</h2>
                <input
                    type="text"
                    placeholder="Search plants..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-1"
                />
                <ul className="max-h-48 overflow-y-auto space-y-2">
                    {filteredPlants.length > 0 ? (
                        filteredPlants.map((plant) => (
                            <li key={plant}>
                                <button
                                    onClick={() => {
                                        setCurrentPlant(plant);
                                        setIsPlantingMode(true);
                                        setSearchTerm("");
                                        onClose();
                                    }}
                                    className="w-full text-left bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                                >
                                    {plant}
                                </button>
                            </li>
                        ))
                    ) : (
                        <li className="text-gray-500 italic">No plants found.</li>
                    )}
                </ul>
                <div className="flex justify-end">
                    <button
                        onClick={onClose}
                        className="mt-4 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 text-white"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PlantPickerModal;