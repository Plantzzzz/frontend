import React from "react";

interface PlantPickerModalProps {
    plantOptions: string[];
    searchTerm: string;
    setSearchTerm: (val: string) => void;
    setCurrentPlant: (plant: string) => void;
    setIsPlantingMode: (val: boolean) => void;
    onClose: () => void;
    onPlantCareInfo: (info: string) => void; // <-- dodaj to
}

const PlantPickerModal: React.FC<PlantPickerModalProps> = ({
                                                               plantOptions,
                                                               searchTerm,
                                                               setSearchTerm,
                                                               setCurrentPlant,
                                                               setIsPlantingMode,
                                                               onClose,
                                                               onPlantCareInfo
                                                           }) => {
    const filteredPlants = plantOptions.filter((p) =>
        p.toLowerCase().includes(searchTerm.toLowerCase())
    );
    

    const handlePlantSelect = (plantName: string) => {
        fetch('https://petalbot.onrender.com/get-plant-care', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ plant: plantName })
        })
        .then(res => res.json())
        .then(data => {
            setCurrentPlant(plantName);
            setIsPlantingMode(true);
            setSearchTerm("");
            onPlantCareInfo(data.care_instructions);  // <-- pošlje staršem
            onClose();
        });
    };



    return (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50">
            <div className="bg-gray-800 p-6 rounded-2xl shadow-xl space-y-4 text-white w-96 border border-gray-600">
                <h2 className="text-lg font-bold">Choose a plant to assign</h2>
                <input
                    type="text"
                    placeholder="Search plants..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full border border-gray-600 rounded px-3 py-2 bg-gray-700 text-white placeholder-gray-400"
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
                                        handlePlantSelect(plant);
                                        onClose();
                                    }}
                                    className="w-full text-left bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                                >
                                    {plant}
                                </button>
                            </li>
                        ))
                    ) : (
                        <li className="text-gray-400 italic">No plants found.</li>
                    )}
                </ul>
                <div className="flex justify-end">
                    <button
                        onClick={onClose}
                        className="mt-4 px-4 py-2 bg-gray-600 rounded hover:bg-gray-500 text-white"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>

    );
};

export default PlantPickerModal;


