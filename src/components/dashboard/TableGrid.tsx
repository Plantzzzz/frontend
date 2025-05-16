import React, { useState } from "react";

interface TableGridProps {
    rows: number;
    cols: number;
    plantAssignments: { [key: string]: string };
    cellLocations: { [key: string]: "inside" | "outside" };
    onCellClick: (row: number, col: number) => void;
    isPlantingMode: boolean;
    currentPlant: string | null;
    isErasing: boolean;
    eraseLocation: boolean;
    erasePlant: boolean;
}

const TableGrid: React.FC<TableGridProps> = ({
                                                 rows,
                                                 cols,
                                                 plantAssignments,
                                                 cellLocations,
                                                 onCellClick,
                                             }) => {
    const [isMouseDown, setIsMouseDown] = useState(false);

    const handleMouseDown = (row: number, col: number) => {
        setIsMouseDown(true);
        onCellClick(row, col);
    };

    const handleMouseEnter = (row: number, col: number) => {
        if (isMouseDown) {
            onCellClick(row, col);
        }
    };

    const handleMouseUp = () => {
        setIsMouseDown(false);
    };

    const renderGrid = () => {
        const rowsArray = [];

        for (let r = 1; r <= rows; r++) {
            const colsArray = [];
            for (let c = 1; c <= cols; c++) {
                const key = `${r}-${c}`;
                const assignedPlant = plantAssignments[key];
                const location = cellLocations[key];

                let cellClass = "w-20 h-20 border flex items-center justify-center text-sm cursor-pointer ";
                if (location === "inside") cellClass += "bg-blue-300 ";
                else if (location === "outside") cellClass += "bg-yellow-300 ";
                else cellClass += "bg-gray-200 ";

                colsArray.push(
                    <div
                        key={key}
                        className={cellClass}
                        onMouseDown={() => handleMouseDown(r, c)}
                        onMouseEnter={() => handleMouseEnter(r, c)}
                        onMouseUp={handleMouseUp}
                        title={assignedPlant || location || ""}
                    >
                        {assignedPlant && (
                            <span className="text-black font-medium text-sm">{assignedPlant}</span>
                        )}
                    </div>
                );
            }
            rowsArray.push(
                <div key={r} className="flex">
                    {colsArray}
                </div>
            );
        }

        return rowsArray;
    };

    return (
        <div
            className="select-none"
            onMouseLeave={() => setIsMouseDown(false)}
        >
            {renderGrid()}
        </div>
    );
};

export default TableGrid;
