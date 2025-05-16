import React from "react";

interface Space {
    id: string;
    name: string;
}

interface Props {
    spaces: Space[];
    onView: (id: string) => void;
}

const SpaceList: React.FC<Props> = ({ spaces, onView }) => {
    if (spaces.length === 0)
        return <p className="text-gray-400 italic">No spaces found.</p>;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {spaces.map(space => (
                <div
                    key={space.id}
                    className="bg-gray-800 p-4 rounded shadow-md flex justify-between items-center"
                >
                    <div>
                        <h2 className="text-lg font-semibold">{space.name}</h2>
                        <p className="text-sm text-gray-400">ID: {space.id.slice(0, 8)}...</p>
                    </div>
                    <button
                        onClick={() => onView(space.id)}
                        className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white text-sm"
                    >
                        View
                    </button>
                </div>
            ))}
        </div>
    );
};

export default SpaceList;
