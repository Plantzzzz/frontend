import React, { useState } from "react";
import TableGrid from "./TableGrid";

// PREDEFINED PLANTS (would eventually come from a DB or user input)
const plantOptions = ["Rosemary", "Thyme", "Basil"];

/**
 * SecondaryNavbar Component
 *
 * This component manages the interactive UI for creating and editing a table-based layout
 * where users can define “growth areas” (selected cells) and assign plants to each one.
 */
const SecondaryNavbar: React.FC = () => {
    // Initial number of rows and columns in the table
    const [rows, setRows] = useState(3);
    const [cols, setCols] = useState(4);

    // UI state toggles
    const [showPopup, setShowPopup] = useState(false);   // Show 'Set Table Size' modal
    const [editMode, setEditMode] = useState(false);     // Toggle cell selection mode

    // Inputs for modifying table size
    const [inputRows, setInputRows] = useState(rows);
    const [inputCols, setInputCols] = useState(cols);

    // Stores selected cell keys like '2-3' (row-col)
    const [selectedCells, setSelectedCells] = useState<Set<string>>(new Set());

    // Map of cell key -> plant name
    const [plantAssignments, setPlantAssignments] = useState<{ [key: string]: string }>({});

    // Which cell is currently being edited with a plant
    const [plantSelectionKey, setPlantSelectionKey] = useState<string | null>(null);

    // Search field for filtering plant names
    const [searchTerm, setSearchTerm] = useState("");

    /**
     * Apply button from popup.
     * Updates the table with new row/col values and resets selections.
     */
    const handleApply = () => {
        setRows(inputRows);
        setCols(inputCols);
        setShowPopup(false);
        setSelectedCells(new Set());
        setPlantAssignments({});
    };

    /**
     * Handles clicking a cell in the table:
     * - In edit mode: toggles selection and removes plant if unselected
     * - In view mode: if selected, opens plant selection popup
     */
    const toggleCell = (row: number, col: number) => {
        const key = `${row}-${col}`;
        if (editMode) {
            setSelectedCells(prev => {
                const newSet = new Set(prev);
                const wasSelected = newSet.has(key);
                wasSelected ? newSet.delete(key) : newSet.add(key);

                // If unselected, remove the assigned plant
                if (wasSelected) {
                    setPlantAssignments(prev => {
                        const updated = { ...prev };
                        delete updated[key];
                        return updated;
                    });
                }

                return newSet;
            });
        } else if (selectedCells.has(key)) {
            setPlantSelectionKey(key); // open assign popup
        }
    };

    /**
     * Assign a plant to a selected cell.
     */
    const assignPlant = (plant: string) => {
        if (!plantSelectionKey) return;
        setPlantAssignments(prev => ({ ...prev, [plantSelectionKey]: plant }));
        setPlantSelectionKey(null);
        setSearchTerm("");
    };

    /**
     * Removes any assigned plant from the selected cell.
     */
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

    /**
     * Filters the plant list for the assign-plant popup.
     */
    const filteredPlants = plantOptions.filter(plant =>
        plant.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <>
            {/* Top navbar for toggles and popups */}
            <nav className="bg-gray-800 text-white px-6 py-4 flex justify-between items-center">
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
                </div>
            </nav>

            {/* Table size configuration modal */}
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

            {/* Plant assignment popup */}
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

            {/* Table display with interaction logic */}
            <div className="p-6 flex justify-center">
                <TableGrid
                    rows={rows}
                    cols={cols}
                    selectedCells={selectedCells}
                    editMode={editMode}
                    plantAssignments={plantAssignments}
                    onCellClick={toggleCell}
                />
            </div>
        </>
    );
};

export default SecondaryNavbar;
