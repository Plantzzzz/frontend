import React from 'react';

interface SavePlantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  customName: string;
  setCustomName: (value: string) => void;
  location: string;
  setLocation: (value: string) => void;
  notes: string;
  setNotes: (value: string) => void;
  scientificName: string;
  setScientificName: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  family: string;
  setFamily: (value: string) => void;
  growthRate: string;
  setGrowthRate: (value: string) => void;
  watering: string;
  setWatering: (value: string) => void;
}

const SavePlantModal: React.FC<SavePlantModalProps> = ({
  isOpen,
  onClose,
  onSave,
  customName,
  setCustomName,
  location,
  setLocation,
  notes,
  setNotes,
  scientificName,
  setScientificName,
  description,
  setDescription,
  family,
  setFamily,
  growthRate,
  setGrowthRate,
  watering,
  setWatering,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30">
      <div className="bg-gray-800 text-gray-100 p-6 rounded-2xl w-full max-w-lg shadow-2xl border border-gray-700">
        <h2 className="text-2xl font-bold mb-4 text-green-400">Save Plant</h2>

        <label className="block mb-2">
          Custom Name:
          <input
            type="text"
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
            className="mt-1 w-full bg-gray-700 text-white border border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </label>

        <label className="block mb-2">
          Location:
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="mt-1 w-full bg-gray-700 text-white border border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </label>

        <label className="block mb-2">
          Notes:
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="mt-1 w-full bg-gray-700 text-white border border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </label>

        <label className="block mb-2">
          Scientific Name:
          <input
            type="text"
            value={scientificName}
            onChange={(e) => setScientificName(e.target.value)}
            className="mt-1 w-full bg-gray-700 text-white border border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </label>

        <label className="block mb-2">
          Description:
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 w-full bg-gray-700 text-white border border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </label>

        <label className="block mb-2">
          Family:
          <input
            type="text"
            value={family}
            onChange={(e) => setFamily(e.target.value)}
            className="mt-1 w-full bg-gray-700 text-white border border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </label>

        <label className="block mb-2">
          Growth Rate:
          <select
            value={growthRate}
            onChange={(e) => setGrowthRate(e.target.value)}
            className="mt-1 w-full bg-gray-700 text-white border border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select</option>
            <option value="slow">Slow</option>
            <option value="medium">Medium</option>
            <option value="fast">Fast</option>
          </select>
        </label>

        <label className="block mb-4">
          Watering:
          <select
            value={watering}
            onChange={(e) => setWatering(e.target.value)}
            className="mt-1 w-full bg-gray-700 text-white border border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select</option>
            <option value="minimum">Minimum</option>
            <option value="average">Average</option>
            <option value="frequent">Frequent</option>
          </select>
        </label>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="bg-gray-600 hover:bg-gray-500 text-white font-semibold py-2 px-4 rounded"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            className="bg-green-600 hover:bg-green-500 text-white font-semibold py-2 px-4 rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default SavePlantModal;
