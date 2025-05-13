import React from "react";

interface TableGridProps {
    rows: number;
    cols: number;
    selectedCells: Set<string>;
    editMode: boolean;
    plantAssignments: { [key: string]: string };
    onCellClick: (row: number, col: number) => void;
}

const TableGrid: React.FC<TableGridProps> = ({
                                                 rows,
                                                 cols,
                                                 selectedCells,
                                                 editMode,
                                                 plantAssignments,
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
                        const bgColor = isSelected ? (editMode ? 'bg-yellow-300' : 'bg-blue-300') : 'bg-white';
                        return (
                            <td
                                key={colIndex}
                                className={`border border-gray-400 px-4 py-2 text-center ${editMode || isSelected ? 'cursor-pointer' : ''} ${bgColor}`}
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
