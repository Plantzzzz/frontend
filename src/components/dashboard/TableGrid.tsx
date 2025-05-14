import React from "react";

// Notes: add plants by clicking and dragging, make it a separate button (for example) and make maarking easy

interface TableGridProps {
    rows: number;
    cols: number;
    selectedCells: Set<string>;
    editMode: boolean;
    plantAssignments: { [key: string]: string };
    cellLocations: { [key: string]: 'inside' | 'outside' };
    onCellClick: (row: number, col: number) => void;
}

const TableGrid: React.FC<TableGridProps> = ({
                                                 rows,
                                                 cols,
                                                 selectedCells,
                                                 editMode,
                                                 plantAssignments,
                                                 cellLocations,
                                                 onCellClick,
                                             }) => {
    return (
        <table className="table-auto border-collapse border border-gray-400 text-black">
            <tbody>
            {Array.from({ length: rows }).map((_, rowIndex) => (
                <tr key={rowIndex}>
                    {Array.from({ length: cols }).map((_, colIndex) => {
                        const key = `${rowIndex}-${colIndex}`;
                        const isSelected = selectedCells.has(key);

                        const location = cellLocations[key];
                        const baseColor = isSelected ? (editMode ? 'bg-yellow-300' : 'bg-blue-300') : 'bg-white';
                        const locationColor = location === 'inside' ? 'bg-green-100' : location === 'outside' ? 'bg-red-100' : '';
                        const cellClasses = `${baseColor} ${locationColor}`;

                        return (
                            <td
                                key={colIndex}
                                className={`border border-gray-400 px-4 py-2 text-center ${editMode || isSelected ? 'cursor-pointer' : ''} ${cellClasses}`}
                                onClick={() => onCellClick(rowIndex, colIndex)}
                            >
                                <div>{`R${rowIndex + 1}C${colIndex + 1}`}</div>
                                <div className="text-sm text-green-700">
                                    {plantAssignments[key] || ''}
                                </div>
                            </td>
                        );
                    })}
                </tr>
            ))}
            </tbody>
        </table>
    );
};

export default TableGrid;
