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
import { Trash2 } from "lucide-react";
import { Button } from "flowbite-react";

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
        <div className="max-w-screen-xl mx-auto px-4 py-8 text-white">
            <h1 className="text-4xl font-bold mb-6">My Garden Spaces</h1>

            <div className="flex flex-col md:flex-row gap-4 mb-8">
                <input
                    type="text"
                    placeholder="New space name"
                    value={newSpaceName}
                    onChange={(e) => setNewSpaceName(e.target.value)}
                    className="w-full md:w-1/3 px-4 py-2 rounded-md border border-gray-600 bg-gray-900 text-white"
                />
                <Button color="success" onClick={handleCreateSpace}>
                    + Add Space
                </Button>
                <input
                    type="text"
                    placeholder="Search spaces..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full md:w-1/3 px-4 py-2 rounded-md border border-gray-600 bg-gray-900 text-white"
                />
            </div>

            {filteredSpaces.length === 0 ? (
                <p className="text-gray-400 italic">No spaces found.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredSpaces.map((space) => (
                        <div
                            key={space.id}
                            className="bg-gray-800 rounded-lg p-5 flex flex-col justify-between shadow transition hover:shadow-lg"
                        >
                            <div>
                                <h2 className="text-xl font-semibold mb-1">{space.name}</h2>
                                <p className="text-sm text-gray-400 mb-4">
                                    ID: {space.id.slice(0, 8)}...
                                </p>
                            </div>
                            <div className="flex justify-end gap-2 mt-auto">
                                <Button color="blue" onClick={() => handleView(space.id)} size="sm">
                                    View
                                </Button>
                                <Button color="failure" onClick={() => handleDelete(space.id)} size="sm">
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SpacesPage;
