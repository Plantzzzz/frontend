// src/components/dashboard/SecondaryNavbar.tsx

import React, { useState, useEffect } from "react";
import { Eraser, Leaf, MapPin, Save } from "lucide-react";
import TableGrid from "./TableGrid";
import PlanterModal from "../../pages/dashboard/PlanterModal.tsx";
import PlantEventModal from "../dashboard/PlantEventModal.tsx";
import GridModal from "../../pages/dashboard/GridModal.tsx";
import { collection, getDocs, addDoc, serverTimestamp, doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { generateWateringEventsForSpace } from "../../scripts/wateringService";
import { getPlantRecommendations } from "../../scripts/recommendationService.ts";
import PlantEditingMenu from "./PlantingEditingMenu.tsx";

interface SecondaryNavbarProps {
    spaceId?: string;
    initialRows?: number;
    initialCols?: number;
    initialAssignments?: { [key: string]: string };
    initialLocations?: { [key: string]: "inside" | "outside" };
    onSave?: (data: {
        rows: number;
        cols: number;
        plantAssignments: { [key: string]: string };
        cellLocations: { [key: string]: "inside" | "outside" };
    }) => void;
    onPlantCareInfo: (info: string) => void;
}

const SecondaryNavbar: React.FC<SecondaryNavbarProps> = ({
                                                             spaceId,
                                                             initialRows = 3,
                                                             initialCols = 4,
                                                             initialAssignments = {},
                                                             initialLocations = {},
                                                             onSave,
                                                             onPlantCareInfo,
                                                         }) => {
    const [rows, setRows] = useState(initialRows);
    const [cols, setCols] = useState(initialCols);
    const [plantOptions, setPlantOptions] = useState<string[]>([]);
    const [plantAssignments, setPlantAssignments] = useState(initialAssignments);
    const [cellLocations, setCellLocations] = useState(initialLocations);
    const [editMode, setEditMode] = useState(false);
    const [isPlantingMode, setIsPlantingMode] = useState(false);
    const [currentPlant, setCurrentPlant] = useState<string | null>(null);
    const [locationMode, setLocationMode] = useState<"inside" | "outside" | null>(null);
    const [isErasing, setIsErasing] = useState(false);
    const [eraseLocation] = useState(true);
    const [erasePlant] = useState(true);
    const [showPopup, setShowPopup] = useState(false);
    const [plantPickerOpen, setPlantPickerOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [inputRows, setInputRows] = useState(rows);
    const [inputCols, setInputCols] = useState(cols);
    const [resizeDirection, setResizeDirection] = useState<'top' | 'bottom' | 'left' | 'right'>('bottom');
    const [selectedCell, setSelectedCell] = useState<string | null>(null);
    const [eventModalOpen, setEventModalOpen] = useState(false);
    const [recommendations, setRecommendations] = useState<string[]>([]);
    const [recModalOpen, setRecModalOpen] = useState(false);
    const [spaceData, setSpaceData] = useState<{ latitude?: number; longitude?: number }>({});

    useEffect(() => {
        const fetchSpaceData = async () => {
            if (!spaceId) return;
            const ref = doc(db, "spaces", spaceId);
            const snap = await getDoc(ref);
            if (snap.exists()) {
                setSpaceData(snap.data());
            }
        };
        fetchSpaceData();
    }, [spaceId]);

    const handleRecommendations = async () => {
        const recs = await getPlantRecommendations(spaceId!);
        setRecommendations(recs);
        setRecModalOpen(true);
    };

    const handleApply = () => {
        let newAssignments: { [key: string]: string } = {};
        let newLocations: { [key: string]: "inside" | "outside" } = {};

        Object.entries(plantAssignments).forEach(([key, value]) => {
            const [r, c] = key.split("-").map(Number);
            let newKey = key;

            if (resizeDirection === "top") {
                newKey = `${r + (inputRows - rows)}-${c}`;
            } else if (resizeDirection === "left") {
                newKey = `${r}-${c + (inputCols - cols)}`;
            }

            newAssignments[newKey] = value;
        });

        Object.entries(cellLocations).forEach(([key, value]) => {
            const [r, c] = key.split("-").map(Number);
            let newKey = key;

            if (resizeDirection === "top") {
                newKey = `${r + (inputRows - rows)}-${c}`;
            } else if (resizeDirection === "left") {
                newKey = `${r}-${c + (inputCols - cols)}`;
            }

            newLocations[newKey] = value;
        });

        const safeRows = Math.max(inputRows, 1);
        const safeCols = Math.max(inputCols, 1);

        setRows(safeRows);
        setCols(safeCols);
        setPlantAssignments(newAssignments);
        setCellLocations(newLocations);
        setShowPopup(false);
        setLocationMode(null);
        setIsPlantingMode(false);
        setCurrentPlant(null);
    };

    const handlePlantCareInfo = (info: string) => {
        onPlantCareInfo(info);
    };

    useEffect(() => {
        const fetchPlants = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "plants"));
                const names: string[] = [];
                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    if (data.name) names.push(data.name);
                });
                setPlantOptions(names);
            } catch (error) {
                console.error("Napaka pri pridobivanju rastlin:", error);
            }
        };
        fetchPlants();
    }, []);

    const toggleCell = (row: number, col: number) => {
        const key = `${row}-${col}`;
        if (!editMode && plantAssignments[key]) {
            setSelectedCell(key);
            setEventModalOpen(true);
            return;
        }
        if (isErasing) {
            if (erasePlant) setPlantAssignments(prev => {
                const updated = { ...prev };
                delete updated[key];
                return updated;
            });
            if (eraseLocation) setCellLocations(prev => {
                const updated = { ...prev };
                delete updated[key];
                return updated;
            });
        } else if (isPlantingMode && currentPlant && cellLocations[key]) {
            setPlantAssignments(prev => ({ ...prev, [key]: currentPlant }));
        } else if (editMode && locationMode) {
            setCellLocations(prev => ({ ...prev, [key]: locationMode }));
        }
    };

    const handleEventSubmit = async ({ eventType, notes }: { eventType: string; notes: string }) => {
        if (!selectedCell || !plantAssignments[selectedCell] || !spaceId) return;
        const plantName = plantAssignments[selectedCell];
        try {
            await addDoc(collection(db, `spaces/${spaceId}/plantEvents`), {
                cellId: selectedCell,
                plantName,
                eventType,
                notes,
                timestamp: serverTimestamp(),
            });
            alert("Dogodek uspešno shranjen.");
        } catch (error) {
            console.error("Napaka pri shranjevanju dogodka:", error);
            alert("Napaka pri shranjevanju.");
        }
        setEventModalOpen(false);
        setSelectedCell(null);
    };

    return (
        <>
            <nav className="bg-gray-800 text-white px-6 py-4 flex flex-col gap-3 md:flex-row md:justify-between md:items-center shadow-md">
                <div className="flex flex-wrap justify-between items-center w-full text-sm">
                    <div className="flex flex-wrap gap-3"></div>
                    <div className="ml-auto flex gap-3">
                        <button
                            onClick={() => setShowPopup(true)}
                            className="bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded flex items-center gap-1 font-semibold transition"
                        >
                            <MapPin className="w-4 h-4" /> Set Grid
                        </button>
                        <button
                            onClick={() => {
                                const data = { rows, cols, plantAssignments, cellLocations };
                                if (onSave) {
                                    onSave(data);
                                } else {
                                    console.log("Save clicked:", data);
                                    alert("No save handler provided. Data logged to console.");
                                }
                            }}
                            className="bg-green-600 hover:bg-green-700 px-2 py-1 rounded flex items-center gap-1 font-semibold transition"
                        >
                            <Save className="w-4 h-4" /> Save Table
                        </button>

                        {!editMode && (
                            <>
                                <button
                                    onClick={() => {
                                        if (!spaceId) {
                                            alert("Manjka spaceId.");
                                            return;
                                        }
                                        generateWateringEventsForSpace(spaceId);
                                    }}
                                    className="bg-indigo-600 hover:bg-indigo-700 px-2 py-1 rounded flex items-center gap-1 font-semibold transition"
                                >
                                    💧 Create watering events
                                </button>
                                <button
                                    onClick={handleRecommendations}
                                    className="bg-purple-600 hover:bg-purple-700 px-2 py-1 rounded font-semibold transition"
                                >
                                    💡 Recommendations
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </nav>

            {plantPickerOpen && (
                <PlanterModal
                    plantOptions={plantOptions}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    setCurrentPlant={setCurrentPlant}
                    setIsPlantingMode={setIsPlantingMode}
                    onClose={() => setPlantPickerOpen(false)}
                    onPlantCareInfo={handlePlantCareInfo}
                />
            )}

            {showPopup && (
                <GridModal
                    spaceId={spaceId}
                    inputRows={inputRows}
                    inputCols={inputCols}
                    rows={rows}
                    cols={cols}
                    resizeDirection={resizeDirection}
                    setInputRows={setInputRows}
                    setInputCols={setInputCols}
                    setResizeDirection={setResizeDirection}
                    onApply={handleApply}
                    onClose={() => setShowPopup(false)}
                />
            )}

            {eventModalOpen && selectedCell && (
                <PlantEventModal
                    cellId={selectedCell}
                    plantName={plantAssignments[selectedCell]}
                    onClose={() => setEventModalOpen(false)}
                    onSubmit={handleEventSubmit}
                />
            )}

            <div className="p-6 flex justify-center">
                <TableGrid
                    spaceId={spaceId!}
                    rows={rows}
                    cols={cols}
                    plantAssignments={plantAssignments}
                    cellLocations={cellLocations}
                    onCellClick={toggleCell}
                    isPlantingMode={isPlantingMode}
                    currentPlant={currentPlant}
                    isErasing={isErasing}
                    erasePlant={erasePlant}
                    eraseLocation={eraseLocation}
                />
                <PlantEditingMenu
                    editMode={editMode}
                    setEditMode={setEditMode}
                    plantPickerOpen={plantPickerOpen}
                    setPlantPickerOpen={setPlantPickerOpen}
                    setIsPlantingMode={setIsPlantingMode}
                    setCurrentPlant={setCurrentPlant}
                    setLocationMode={setLocationMode}
                    setIsErasing={setIsErasing}
                    isErasing={isErasing}
                    locationMode={locationMode}
                />
            </div>

            {recModalOpen && (
                <div className="fixed top-1/4 left-1/2 transform -translate-x-1/2 bg-black text-white p-4 shadow-xl rounded-xl max-w-md z-50">
                    <h2 className="text-lg font-bold mb-2">🌿 Priporočila</h2>
                    <ul className="text-sm list-disc pl-5">
                        {recommendations.map((r, idx) => (
                            <li key={idx}>{r}</li>
                        ))}
                    </ul>
                    <button
                        onClick={() => setRecModalOpen(false)}
                        className="mt-4 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                    >
                        Zapri
                    </button>
                </div>
            )}
        </>
    );
};

export default SecondaryNavbar;
