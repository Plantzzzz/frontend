import React, { useState, useEffect } from "react";
import { Pencil, X, Leaf, Eraser, CheckSquare, Sun, Save, MapPin } from "lucide-react";

interface PlantEditingMenuProps {
    editMode: boolean;
    setEditMode: React.Dispatch<React.SetStateAction<boolean>>;
    plantPickerOpen: boolean;
    setPlantPickerOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setIsPlantingMode: React.Dispatch<React.SetStateAction<boolean>>;
    setCurrentPlant: React.Dispatch<React.SetStateAction<string | null>>;
    setLocationMode: React.Dispatch<React.SetStateAction<"inside" | "outside" | null>>;
    setIsErasing: React.Dispatch<React.SetStateAction<boolean>>;
    isErasing: boolean;
    locationMode: "inside" | "outside" | null;
    rows: number;
    cols: number;
    plantAssignments: { [key: string]: string };
    cellLocations: { [key: string]: "inside" | "outside" };
    onSave?: (data: {
        rows: number;
        cols: number;
        plantAssignments: { [key: string]: string };
        cellLocations: { [key: string]: "inside" | "outside" };
    }) => void;
    onSetGrid: () => void;
}

const PlantEditingMenu: React.FC<PlantEditingMenuProps> = ({
                                                               editMode,
                                                               setEditMode,
                                                               plantPickerOpen,
                                                               setPlantPickerOpen,
                                                               setIsPlantingMode,
                                                               setCurrentPlant,
                                                               setLocationMode,
                                                               setIsErasing,
                                                               isErasing,
                                                               locationMode,
                                                               rows,
                                                               cols,
                                                               plantAssignments,
                                                               cellLocations,
                                                               onSave,
                                                               onSetGrid,
                                                           }) => {
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        if (menuOpen) {
            setEditMode(true);
            console.log(editMode);
        } else {
            setEditMode(false);
            setIsErasing(false);
            setLocationMode(null);
            setIsPlantingMode(false);
            setCurrentPlant(null);
        }
    }, [menuOpen]);

    const toggleMenu = () => {
        setMenuOpen((prev) => !prev);
    };

    const handleSave = () => {
        const data = { rows, cols, plantAssignments, cellLocations };
        if (onSave) {
            onSave(data);
        } else {
            console.log("Save clicked:", data);
            alert("No save handler provided. Data logged to console.");
        }
    };

    const buttonBase =
        "flex items-center gap-2 w-full px-4 py-2 text-white rounded-lg shadow transition duration-300 transform hover:scale-105";

    return (
        <div className="fixed bottom-6 left-6 md:left-72 z-50 flex flex-col items-start space-y-3">
            {/* Flyout Menu */}
            <div
                className={`flex flex-col items-start bg-gray-800 p-4 rounded-xl shadow-lg space-y-2 w-48 
                transition-all duration-500 ease-in-out transform ${
                    menuOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
                }`}
            >
                {/* Add Plant */}
                <button
                    className={`${plantPickerOpen ? "bg-green-600" : "bg-gray-700"} ${buttonBase}`}
                    onClick={() => {
                        setPlantPickerOpen(true);
                        setLocationMode(null);
                        setIsErasing(false);
                    }}
                    title="Add Plant"
                >
                    <Leaf className="w-5 h-5" />
                    <span className="text-sm font-semibold">Add Plant</span>
                </button>

                {/* Mark Inside */}
                <button
                    className={`${locationMode === "inside" ? "bg-blue-600" : "bg-gray-700"} ${buttonBase}`}
                    onClick={() => {
                        setLocationMode((prev) => (prev === "inside" ? null : "inside"));
                        setIsPlantingMode(false);
                        setCurrentPlant(null);
                        setIsErasing(false);
                    }}
                    title="Mark Inside"
                >
                    <CheckSquare className="w-5 h-5" />
                    <span className="text-sm font-semibold">Mark Inside</span>
                </button>

                {/* Mark Outside */}
                <button
                    className={`${locationMode === "outside" ? "bg-yellow-500" : "bg-gray-700"} ${buttonBase}`}
                    onClick={() => {
                        setLocationMode((prev) => (prev === "outside" ? null : "outside"));
                        setIsPlantingMode(false);
                        setCurrentPlant(null);
                        setIsErasing(false);
                    }}
                    title="Mark Outside"
                >
                    <Sun className="w-5 h-5" />
                    <span className="text-sm font-semibold">Mark Outside</span>
                </button>

                {/* Eraser */}
                <button
                    className={`${isErasing ? "bg-red-600" : "bg-gray-700"} ${buttonBase}`}
                    onClick={() => {
                        const newState = !isErasing;
                        setIsErasing(newState);
                        setLocationMode(null);
                        setIsPlantingMode(false);
                        setCurrentPlant(null);
                    }}
                    title="Eraser"
                >
                    <Eraser className="w-5 h-5" />
                    <span className="text-sm font-semibold">
                        {isErasing ? "Stop Erasing" : "Eraser"}
                    </span>
                </button>
            </div>

            {/* Main Toggle & Extra Actions */}
            <div className="flex items-center gap-3">
                <button
                    className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-all duration-300 transform hover:-rotate-12"
                    onClick={toggleMenu}
                    title={menuOpen ? "Close Editing Menu" : "Open Editing Menu"}
                >
                    {menuOpen ? <X className="w-5 h-5" /> : <Pencil className="w-5 h-5" />}
                </button>

                {menuOpen && (
                    <div className="flex gap-2">
                        <button
                            onClick={handleSave}
                            className="bg-green-600 hover:bg-green-700 text-white p-3 rounded-full shadow-lg transition duration-300"
                            title="Save Table"
                        >
                            <Save className="w-5 h-5" />
                        </button>
                        <button
                            onClick={onSetGrid}
                            className="bg-yellow-500 hover:bg-yellow-600 text-white p-3 rounded-full shadow-lg transition duration-300"
                            title="Set Grid"
                        >
                            <MapPin className="w-5 h-5" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PlantEditingMenu;
