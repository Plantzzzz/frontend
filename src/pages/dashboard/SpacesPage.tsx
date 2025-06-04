import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    collection,
    addDoc,
    getDocs,
    query,
    where,
    deleteDoc,
    doc,
} from "firebase/firestore";
import { db } from "../../firebase";
import { Trash2, Plus } from "lucide-react";
import TutorialModal from "../../components/dashboard/TutorialModal";

interface Space {
    id: string;
    name: string;
    tableData: {
        rows: number;
        cols: number;
        plantAssignments: { [key: string]: string };
        cellLocations: { [key: string]: "inside" | "outside" };
    };
}

const SpacesPage: React.FC = () => {
    const [spaces, setSpaces] = useState<Space[]>([]);
    const [newSpaceName, setNewSpaceName] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const user = JSON.parse(sessionStorage.getItem("user") || "{}");

    const fetchSpaces = async () => {
        if (!user?.uid) return;
        const q = query(collection(db, "spaces"), where("userId", "==", user.uid));
        const snapshot = await getDocs(q);
        const fetched = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...(doc.data() as Omit<Space, "id">),
        }));
        setSpaces(fetched);
    };

    const handleCreateSpace = async () => {
        if (!newSpaceName.trim() || !user?.uid) return;

        setLoading(true);
        const newDoc = await addDoc(collection(db, "spaces"), {
            userId: user.uid,
            name: newSpaceName.trim(),
            createdAt: Date.now(),
            tableData: {
                rows: 3,
                cols: 4,
                plantAssignments: {},
                cellLocations: {},
            },
        });

        setSpaces((prev) => [
            ...prev,
            {
                id: newDoc.id,
                name: newSpaceName.trim(),
                tableData: {
                    rows: 3,
                    cols: 4,
                    plantAssignments: {},
                    cellLocations: {},
                },
            },
        ]);

        setNewSpaceName("");
        setLoading(false);
    };

    const handleDelete = async (id: string) => {
        await deleteDoc(doc(db, "spaces", id));
        setSpaces((prev) => prev.filter((s) => s.id !== id));
    };

    const handleView = (id: string) => {
        navigate("/dashboard/areas", { state: { spaceId: id } });
    };

    const filteredSpaces = spaces.filter((space) =>
        space.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    useEffect(() => {
        fetchSpaces();
    }, []);

    return (
        <div className="max-w-7xl mx-auto px-4 py-10 text-white">
            {/* Create & Search */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="flex gap-2 items-center">
                    <input
                        type="text"
                        placeholder="New space name"
                        value={newSpaceName}
                        onChange={(e) => setNewSpaceName(e.target.value)}
                        className="flex-grow px-4 py-2 rounded-lg border border-gray-700 bg-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
                    />
                    <button
                        onClick={handleCreateSpace}
                        disabled={!newSpaceName.trim() || loading}
                        className={`flex items-center gap-1 px-4 py-2 rounded-lg font-medium transition duration-200 ${
                            !newSpaceName.trim() || loading
                                ? "bg-green-600/50 text-gray-400 cursor-not-allowed"
                                : "bg-green-600 hover:bg-green-700 text-white"
                        }`}
                    >
                        <Plus className="w-4 h-4" /> Add
                    </button>
                </div>
                <div className="md:col-span-2">
                    <input
                        type="text"
                        placeholder="Search spaces..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border border-gray-700 bg-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
                    />
                </div>
            </div>

            {/* Spaces List */}
            {filteredSpaces.length === 0 ? (
                <div className="text-center py-20 text-gray-400 border border-gray-700 rounded-lg animate-fade-in">
                    <p className="text-lg font-semibold">No spaces found.</p>
                    <p className="text-sm">Try creating one or adjusting your search.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
                    {filteredSpaces.map((space) => (
                        <div
                            key={space.id}
                            className="bg-gray-800 rounded-xl p-5 flex flex-col justify-between shadow-md hover:shadow-green-500/20 transform hover:scale-[1.02] transition-all duration-300 border border-gray-700"
                        >
                            <div>
                                <h2 className="text-xl font-semibold mb-1 text-white">{space.name}</h2>
                                <p className="text-xs text-gray-400">
                                    ID: {space.id.slice(0, 8)}...
                                </p>
                            </div>
                            <div className="flex justify-between gap-2 mt-6">
                                <button
                                    onClick={() => handleView(space.id)}
                                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded-lg transition duration-200"
                                >
                                    View
                                </button>
                                <button
                                    onClick={() => handleDelete(space.id)}
                                    className="bg-red-600 hover:bg-red-700 text-white font-medium px-4 py-2 rounded-lg transition duration-200"
                                    title="Delete Space"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <TutorialModal />
        </div>
    );
};

export default SpacesPage;
