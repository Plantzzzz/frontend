import React from "react";

type Direction = 'top' | 'bottom' | 'left' | 'right';

interface SetGridPopupProps {
    inputRows: number;
    inputCols: number;
    rows: number;
    cols: number;
    resizeDirection: Direction;
    setInputRows: (val: number) => void;
    setInputCols: (val: number) => void;
    setResizeDirection: (val: Direction) => void;
    onApply: () => void;
    onClose: () => void;
}

const SetGridPopup: React.FC<SetGridPopupProps> = ({
                                                       inputRows,
                                                       inputCols,
                                                       rows,
                                                       cols,
                                                       resizeDirection,
                                                       setInputRows,
                                                       setInputCols,
                                                       setResizeDirection,
                                                       onApply,
                                                       onClose,
                                                   }) => {
    const handleChange = (val: number) => {
        if (resizeDirection === 'top' || resizeDirection === 'bottom') {
            setInputRows(rows + val);
        } else {
            setInputCols(cols + val);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-gray-900 p-6 rounded shadow-lg text-white w-[28rem] space-y-5">
                <h2 className="text-2xl font-semibold text-center">Add Rows or Columns</h2>
                <p className="text-sm text-gray-300 text-center">
                    Choose how many rows or columns to add and from which side of the table.
                </p>
                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between gap-6">
                        <label className="flex flex-col text-sm font-medium w-1/2">
                            Amount
                            <input
                                type="number"
                                min={1}
                                onChange={(e) => handleChange(parseInt(e.target.value))}
                                className="mt-1 border px-3 py-2 rounded text-sm bg-white text-black"
                            />
                        </label>
                        <div className="flex flex-col gap-2 w-1/2">
                            <span className="font-medium text-sm">Add to:</span>
                            <div className="grid grid-cols-2 gap-2">
                                {['top', 'bottom', 'left', 'right'].map((dir) => (
                                    <button
                                        key={dir}
                                        onClick={() => setResizeDirection(dir as Direction)}
                                        className={`px-3 py-2 rounded text-sm transition font-semibold border shadow-sm ${
                                            resizeDirection === dir
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-gray-700 text-white hover:bg-gray-600'
                                        }`}
                                    >
                                        {dir.charAt(0).toUpperCase() + dir.slice(1)}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                        <button
                            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500"
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                        <button
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            onClick={onApply}
                        >
                            Apply
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SetGridPopup;