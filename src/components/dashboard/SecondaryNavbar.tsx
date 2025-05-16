import React, { useState, useEffect  } from "react";
import TableGrid from "./TableGrid";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase"; // pot do tvoje konfiguracije

//const plantOptions = ["Rosemary", "Thyme", "Basil"];

const SecondaryNavbar: React.FC = () => {
    const [rows, setRows] = useState(3);
    const [cols, setCols] = useState(4);
    const [plantOptions, setPlantOptions] = useState<string[]>([]);
    const [showPopup, setShowPopup] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [inputRows, setInputRows] = useState(rows);
    const [inputCols, setInputCols] = useState(cols);
    const [selectedCells, setSelectedCells] = useState<Set<string>>(new Set());
    const [plantAssignments, setPlantAssignments] = useState<{ [key: string]: string }>({});
    const [plantSelectionKey, setPlantSelectionKey] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [cellLocations, setCellLocations] = useState<{ [key: string]: "inside" | "outside" }>({});
    const [locationMode, setLocationMode] = useState<"inside" | "outside" | null>(null);

    const handleApply = () => {
        setRows(inputRows);
        setCols(inputCols);
        setShowPopup(false);
        setSelectedCells(new Set());
        setPlantAssignments({});
        setCellLocations({});
        setLocationMode(null);
    };

    // 🔥 Naloži rastline iz Firestore
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
        if (editMode) {
            setSelectedCells(prev => {
                const newSet = new Set(prev);
                const wasSelected = newSet.has(key);
                if (wasSelected) {
                    newSet.delete(key);
                    setPlantAssignments(prev => {
                        const updated = { ...prev };
                        delete updated[key];
                        return updated;
                    });
                } else {
                    newSet.add(key);
                }
                return newSet;
            });
        } else if (selectedCells.has(key)) {
            if (locationMode) {
                setCellLocations(prev => ({ ...prev, [key]: locationMode }));
            } else {
                setPlantSelectionKey(key);
            }
        }
    };

    const assignPlant = (plant: string) => {
        if (!plantSelectionKey) return;
        setPlantAssignments(prev => ({ ...prev, [plantSelectionKey]: plant }));
        setPlantSelectionKey(null);
        setSearchTerm("");
    };

    const clearPlant = () => {
        if (!plantSelectionKey) return;
        setPlantAssignments(prev => {
            const updated = { ...prev };
            delete updated[plantSelectionKey];
            return updated;
        });
        setPlantSelectionKey(null);
        setSearchTerm("");
    };

    const filteredPlants = plantOptions.filter(plant =>
        plant.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <>
            <nav className="bg-gray-800 text-white px-6 py-4 flex flex-col gap-2 md:flex-row md:justify-between md:items-center">
                <div className="text-lg font-bold">PetalBot</div>
                <div className="space-x-2">
                    <button
                        className={`px-4 py-2 rounded ${editMode ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-500 hover:bg-gray-600'}`}
                        onClick={() => setEditMode(!editMode)}
                    >
                        {editMode ? "Exit Edit Mode" : "Enter Edit Mode"}
                    </button>
                    <button
                        className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600"
                        onClick={() => setShowPopup(true)}
                    >
                        Set Table Size
                    </button>
                    <label className="ml-4 inline-flex items-center space-x-2">
                        <input
                            type="checkbox"
                            checked={locationMode === "inside"}
                            onChange={() => setLocationMode(prev => prev === "inside" ? null : "inside")}
                        />
                        <span>Mark as Inside</span>
                    </label>
                    <label className="inline-flex items-center space-x-2">
                        <input
                            type="checkbox"
                            checked={locationMode === "outside"}
                            onChange={() => setLocationMode(prev => prev === "outside" ? null : "outside")}
                        />
                        <span>Mark as Outside</span>
                    </label>
                </div>
            </nav>

            {showPopup && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded shadow-lg space-y-4 text-black">
                        <h2 className="text-xl font-semibold">Set Table Size</h2>
                        <div className="flex space-x-4">
                            <label>
                                Rows:
                                <input
                                    type="number"
                                    min={1}
                                    value={inputRows}
                                    onChange={(e) => setInputRows(parseInt(e.target.value))}
                                    className="border px-2 py-1 ml-2"
                                />
                            </label>
                            <label>
                                Columns:
                                <input
                                    type="number"
                                    min={1}
                                    value={inputCols}
                                    onChange={(e) => setInputCols(parseInt(e.target.value))}
                                    className="border px-2 py-1 ml-2"
                                />
                            </label>
                        </div>
                        <div className="flex justify-end space-x-2">
                            <button
                                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                                onClick={() => setShowPopup(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                onClick={handleApply}
                            >
                                Apply
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {plantSelectionKey && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded shadow-lg space-y-4 text-black w-96">
                        <h2 className="text-lg font-bold">Choose a plant for cell {plantSelectionKey}</h2>
                        <input
                            type="text"
                            placeholder="Search plants..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full border border-gray-300 rounded px-3 py-1"
                        />
                        <ul className="max-h-48 overflow-y-auto space-y-2">
                            {filteredPlants.map(plant => (
                                <li key={plant}>
                                    <button
                                        className="w-full text-left bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                                        onClick={() => assignPlant(plant)}
                                    >
                                        {plant}
                                    </button>
                                </li>
                            ))}
                            {filteredPlants.length === 0 && (
                                <li className="text-gray-500 italic">No plants found.</li>
                            )}
                        </ul>
                        <div className="flex gap-2">
                            <button
                                className="mt-4 w-full bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 text-white"
                                onClick={() => setPlantSelectionKey(null)}
                            >
                                Cancel
                            </button>
                            <button
                                className="mt-4 w-full bg-red-500 px-4 py-2 text-white rounded hover:bg-red-600"
                                onClick={clearPlant}
                            >
                                Remove Plant
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="p-6 flex justify-center">
                <TableGrid
                    rows={rows}
                    cols={cols}
                    selectedCells={selectedCells}
                    editMode={editMode}
                    plantAssignments={plantAssignments}
                    cellLocations={cellLocations}
                    onCellClick={toggleCell}
                />
            </div>
        </>
    );
};

export default SecondaryNavbar;
