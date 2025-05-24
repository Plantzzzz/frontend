// src/components/dashboard/PlantEventModal.tsx
import React, { useState } from "react";

interface PlantEventModalProps {
    cellId: string;
    plantName: string;
    onClose: () => void;
    onSubmit: (eventData: {
        eventType: string;
        notes: string;
    }) => void;
}

const PlantEventModal: React.FC<PlantEventModalProps> = ({ cellId, plantName, onClose, onSubmit }) => {
    const [eventType, setEventType] = useState("watering");
    const [notes, setNotes] = useState("");

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded w-96 shadow-md text-black space-y-4">
                <h2 className="text-xl font-semibold">Dodaj dogodek za {plantName} ({cellId})</h2>

                <label className="block">
                    Vrsta dogodka:
                    <select
                        value={eventType}
                        onChange={(e) => setEventType(e.target.value)}
                        className="w-full mt-1 border p-2 rounded"
                    >
                        <option value="planting">Zasaditev</option>
                        <option value="watering">Zalivanje</option>
                        <option value="fertilizing">Gnojenje</option>
                        <option value="trimming">Obrezovanje</option>
                        <option value="harvest">Obiranje</option>
                    </select>
                </label>

                <label className="block">
                    Opombe:
                    <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="w-full mt-1 border p-2 rounded"
                    />
                </label>

                <div className="flex justify-end gap-2">
                    <button className="bg-gray-500 px-4 py-2 rounded text-white" onClick={onClose}>Prekliči</button>
                    <button
                        className="bg-green-600 px-4 py-2 rounded text-white"
                        onClick={() => onSubmit({ eventType, notes })}
                    >
                        Shrani
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PlantEventModal;
