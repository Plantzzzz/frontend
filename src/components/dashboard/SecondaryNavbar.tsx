// src/components/dashboard/SecondaryNavbar.tsx
import React, { useState } from "react";
import { Pencil, X, Eraser, Leaf, MapPin, Save } from "lucide-react";
import TableGrid from "./TableGrid";

interface SecondaryNavbarProps {
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
}

const plantOptions = ["Rosemary", "Thyme", "Basil"];

const SecondaryNavbar: React.FC<SecondaryNavbarProps> = ({
                                                             initialRows = 3,
                                                             initialCols = 4,
                                                             initialAssignments = {},
                                                             initialLocations = {},
                                                             onSave
                                                         }) => {
    const [rows, setRows] = useState(initialRows);
    const [cols, setCols] = useState(initialCols);
    const [plantAssignments, setPlantAssignments] = useState(initialAssignments);
    const [cellLocations, setCellLocations] = useState(initialLocations);
    const [editMode, setEditMode] = useState(false);
    const [isPlantingMode, setIsPlantingMode] = useState(false);
    const [currentPlant, setCurrentPlant] = useState<string | null>(null);
    const [locationMode, setLocationMode] = useState<"inside" | "outside" | null>(null);
    const [isErasing, setIsErasing] = useState(false);
    const [eraseLocation, setEraseLocation] = useState(true);
    const [erasePlant, setErasePlant] = useState(true);
    const [showPopup, setShowPopup] = useState(false);
    const [plantPickerOpen, setPlantPickerOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [inputRows, setInputRows] = useState(rows);
    const [inputCols, setInputCols] = useState(cols);
    const [resizeDirection, setResizeDirection] = useState<'top' | 'bottom' | 'left' | 'right'>('bottom');

    const handleApply = () => {
        let newAssignments: { [key: string]: string } = {};
        let newLocations: { [key: string]: "inside" | "outside" } = {};

        Object.entries(plantAssignments).forEach(([key, value]) => {
            const [r, c] = key.split("-").map(Number);
            let newKey = key;

            if (resizeDirection === "top") newKey = `${r + 1}-${c}`;
            if (resizeDirection === "left") newKey = `${r}-${c + 1}`;

            const [newR, newC] = newKey.split("-").map(Number);
            if (newR <= inputRows && newC <= inputCols) newAssignments[newKey] = value;
        });

        Object.entries(cellLocations).forEach(([key, value]) => {
            const [r, c] = key.split("-").map(Number);
            let newKey = key;

            if (resizeDirection === "top") newKey = `${r + 1}-${c}`;
            if (resizeDirection === "left") newKey = `${r}-${c + 1}`;

            const [newR, newC] = newKey.split("-").map(Number);
            if (newR <= inputRows && newC <= inputCols) newLocations[newKey] = value;
        });

        setRows(inputRows);
        setCols(inputCols);
        setPlantAssignments(newAssignments);
        setCellLocations(newLocations);
        setShowPopup(false);
        setLocationMode(null);
        setIsPlantingMode(false);
        setCurrentPlant(null);
    };

    const toggleCell = (row: number, col: number) => {
        const key = `${row}-${col}`;

        if (isErasing) {
            if (erasePlant) setPlantAssignments(prev => { const updated = { ...prev }; delete updated[key]; return updated; });
            if (eraseLocation) setCellLocations(prev => { const updated = { ...prev }; delete updated[key]; return updated; });
        } else if (isPlantingMode && currentPlant && cellLocations[key]) {
            setPlantAssignments(prev => ({ ...prev, [key]: currentPlant }));
        } else if (editMode && locationMode) {
            setCellLocations(prev => ({ ...prev, [key]: locationMode }));
        }
    };

    const buttonStyle = (active: boolean, base: string) =>
        `${base} px-2 py-1 rounded flex items-center gap-1 font-semibold transition ${
            active ? "ring-2 ring-white ring-offset-2 bg-opacity-100" : "bg-opacity-40"
        }`;

    return (
        <>
            <nav className="bg-gray-800 text-white px-6 py-4 flex flex-col gap-3 md:flex-row md:justify-between md:items-center shadow-md">
                <div className="flex flex-wrap justify-between items-center w-full text-sm">
                    <div className="flex flex-wrap gap-3">
                        <button className={buttonStyle(editMode, "bg-gray-600 hover:bg-red-600")} onClick={() => {
                            setEditMode(prev => !prev);
                            if (editMode) {
                                setLocationMode(null);
                                setIsErasing(false);
                                setIsPlantingMode(false);
                                setCurrentPlant(null);
                            }
                        }}>{editMode ? <X className="w-4 h-4" /> : <Pencil className="w-4 h-4" />} {editMode ? "Exit Edit Mode" : "Edit Mode"}</button>

                        {editMode && (
                            <>
                                <button onClick={() => setPlantPickerOpen(true)} className="bg-green-600 hover:bg-green-700 px-2 py-1 rounded flex items-center gap-1 font-semibold transition">
                                    <Leaf className="w-4 h-4" /> Add Plants
                                </button>
                                {isPlantingMode && <button onClick={() => { setIsPlantingMode(false); setCurrentPlant(null); }} className="bg-red-600 hover:bg-red-700 px-2 py-1 rounded flex items-center gap-1 font-semibold transition">
                                    <X className="w-4 h-4" /> Stop Planting
                                </button>}

                                <div className="flex items-center gap-2 ml-2">
                                    <span className="text-gray-300">Mark:</span>
                                    <button onClick={() => setLocationMode(prev => prev === "inside" ? null : "inside")} className={buttonStyle(locationMode === "inside", "bg-blue-600 hover:bg-blue-700")}>Inside</button>
                                    <button onClick={() => setLocationMode(prev => prev === "outside" ? null : "outside")} className={buttonStyle(locationMode === "outside", "bg-yellow-500 hover:bg-yellow-600")}>Outside</button>
                                </div>

                                <div className="flex items-center gap-2 ml-2">
                                    <button onClick={() => setIsErasing(prev => !prev)} className={buttonStyle(isErasing, "bg-red-500 hover:bg-red-600")}> <Eraser className="w-4 h-4" /> Eraser</button>
                                    {isErasing && (
                                        <>
                                            <label className="flex items-center gap-1"><input type="checkbox" checked={erasePlant} onChange={() => setErasePlant(prev => !prev)} /><span>Plants</span></label>
                                            <label className="flex items-center gap-1"><input type="checkbox" checked={eraseLocation} onChange={() => setEraseLocation(prev => !prev)} /><span>Marks</span></label>
                                        </>
                                    )}
                                </div>
                            </>
                        )}
                    </div>

                    <div className="ml-auto flex gap-3">
                        <button onClick={() => setShowPopup(true)} className="bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded flex items-center gap-1 font-semibold transition">
                            <MapPin className="w-4 h-4" /> Set Grid
                        </button>
                        {onSave && (
                            <button onClick={() => onSave({ rows, cols, plantAssignments, cellLocations })} className="bg-green-600 hover:bg-green-700 px-2 py-1 rounded flex items-center gap-1 font-semibold transition">
                                <Save className="w-4 h-4" /> Save Table
                            </button>
                        )}
                    </div>
                </div>
            </nav>

            {plantPickerOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded shadow-lg space-y-4 text-black w-96">
                        <h2 className="text-lg font-bold">Choose a plant to assign</h2>
                        <input type="text" placeholder="Search plants..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-1" />
                        <ul className="max-h-48 overflow-y-auto space-y-2">
                            {plantOptions.filter(p => p.toLowerCase().includes(searchTerm.toLowerCase())).map(plant => (
                                <li key={plant}><button onClick={() => { setCurrentPlant(plant); setIsPlantingMode(true); setPlantPickerOpen(false); setSearchTerm(""); }} className="w-full text-left bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">{plant}</button></li>
                            ))}
                            {plantOptions.filter(p => p.toLowerCase().includes(searchTerm.toLowerCase())).length === 0 && (
                                <li className="text-gray-500 italic">No plants found.</li>
                            )}
                        </ul>
                        <div className="flex justify-end"><button onClick={() => setPlantPickerOpen(false)} className="mt-4 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 text-white">Cancel</button></div>
                    </div>
                </div>
            )}

            {showPopup && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-gray-900 p-6 rounded shadow-lg text-white w-[28rem] space-y-5">
                        <h2 className="text-2xl font-semibold text-center">Add Rows or Columns</h2>
                        <p className="text-sm text-gray-300 text-center">Choose how many rows or columns to add and from which side of the table.</p>
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center justify-between gap-6">
                                <label className="flex flex-col text-sm font-medium w-1/2">
                                    Amount
                                    <input
                                        type="number"
                                        min={1}
                                        value={resizeDirection === 'top' || resizeDirection === 'bottom' ? inputRows - rows : inputCols - cols || 1}
                                        onChange={(e) => {
                                            const val = parseInt(e.target.value);
                                            if (resizeDirection === 'top' || resizeDirection === 'bottom') setInputRows(rows + val);
                                            else setInputCols(cols + val);
                                        }}
                                        className="mt-1 border px-3 py-2 rounded text-sm bg-white text-black"
                                    />
                                </label>
                                <div className="flex flex-col gap-2 w-1/2">
                                    <span className="font-medium text-sm">Add to:</span>
                                    <div className="grid grid-cols-2 gap-2">
                                        {['top', 'bottom', 'left', 'right'].map(dir => (
                                            <button
                                                key={dir}
                                                onClick={() => setResizeDirection(dir as any)}
                                                className={`px-3 py-2 rounded text-sm transition font-semibold border shadow-sm ${resizeDirection === dir ? 'bg-blue-600 text-white' : 'bg-gray-700 text-white hover:bg-gray-600'}`}
                                            >
                                                {dir.charAt(0).toUpperCase() + dir.slice(1)}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-end gap-2 pt-2">
                                <button className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500" onClick={() => setShowPopup(false)}>Cancel</button>
                                <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600" onClick={handleApply}>Apply</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="p-6 flex justify-center">
                <TableGrid
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
            </div>
        </>
    );
};

export default SecondaryNavbar;
