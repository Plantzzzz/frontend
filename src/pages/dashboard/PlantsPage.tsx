import React, { useState } from 'react';
import PlantList from "../../components/dashboard/PlantList.tsx";
import PlantProfileModal from "../../components/dashboard/PlantProfileModal";
import SavePlantModal from "../../components/dashboard/SavePlantModal";
import { FiPlus } from 'react-icons/fi';  // Feather Icons, elegantna minimalistična plus ikona

interface GroupedPlant {
    id: string;
    name: string;
    // ... other properties
}

const PlantsPage: React.FC = () => {
    const [selectedPlant, setSelectedPlant] = useState<GroupedPlant | null>(null);
    const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);

    // Stanja za SavePlantModal (prazna ob odprtju)
    const [customName, setCustomName] = useState("");
    const [location, setLocation] = useState("");
    const [notes, setNotes] = useState("");
    const [scientificName, setScientificName] = useState("");
    const [description, setDescription] = useState("");
    const [family, setFamily] = useState("");
    const [growthRate, setGrowthRate] = useState("");
    const [watering, setWatering] = useState("");

    const handleSave = () => {
      // Tukaj implementiraj shranjevanje
      console.log("Save clicked with data:", {
        customName, location, notes, scientificName, description, family, growthRate, watering
      });
      setIsSaveModalOpen(false);
      // Po potrebi počisti polja ali jih pusti, da ostanejo v poljih modal-a
    };

    return (
        <div className="max-w-5xl mx-auto p-6 relative">
            {/* Plus ikona v zgornjem desnem kotu */}
            <button
              onClick={() => setIsSaveModalOpen(true)}
              aria-label="Add new plant"
              className="absolute bottom-1 right-1 bg-green-600 hover:bg-green-500 text-white rounded-full p-3 shadow-lg transition-colors"
              title="Add new plant"
            >
              <FiPlus size={24} />
            </button>

            <PlantList selected={selectedPlant} onSelect={setSelectedPlant} />
            {selectedPlant && (
                <PlantProfileModal
                    plant={selectedPlant}
                    onClose={() => setSelectedPlant(null)}
                />
            )}

            <SavePlantModal
              isOpen={isSaveModalOpen}
              onClose={() => setIsSaveModalOpen(false)}
              onSave={handleSave}
              customName={customName}
              setCustomName={setCustomName}
              location={location}
              setLocation={setLocation}
              notes={notes}
              setNotes={setNotes}
              scientificName={scientificName}
              setScientificName={setScientificName}
              description={description}
              setDescription={setDescription}
              family={family}
              setFamily={setFamily}
              growthRate={growthRate}
              setGrowthRate={setGrowthRate}
              watering={watering}
              setWatering={setWatering}
            />
        </div>
    );
};

export default PlantsPage;
