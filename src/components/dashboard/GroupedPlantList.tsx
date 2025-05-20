import React, { useEffect, useState } from "react";
import { auth, db } from "../../firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
    collection,
    getDocs,
    doc,
    getDoc,
    query,
    where
} from "firebase/firestore";
import NoteEditor from "./NoteEditor";


// Matches the structure in Firestore
interface TableData {
    plantAssignments: Record<string, string>;
    cellLocations: Record<string, "inside" | "outside">;
}

interface Space {
    tableData: TableData;
    userId: string;
}

interface GroupedPlant {
    key: string; // e.g. Rosemary_inside
    plant: string;
    location: string;
    cells: string[];
}

const GroupedPlantList: React.FC = () => {
    const [groups, setGroups] = useState<GroupedPlant[]>([]);
    const [selected, setSelected] = useState<GroupedPlant | null>(null);
    const [note, setNote] = useState("");


    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (!user) return;

            const q = query(
                collection(db, "spaces"),
                where("userId", "==", user.uid)
            );
            const snap = await getDocs(q);

            const allGroups: Record<string, GroupedPlant> = {};

            snap.forEach((docSnap) => {
                const space = docSnap.data() as Space;

                if (!space.tableData) return;
                const plantAssignments = space.tableData.plantAssignments || {};
                const cellLocations = space.tableData.cellLocations || {};

                for (const [cell, plant] of Object.entries(plantAssignments)) {
                    const location = cellLocations[cell];
                    if (!location) continue;

                    const key = `${plant}_${location}`;
                    if (!allGroups[key]) {
                        allGroups[key] = {
                            key,
                            plant,
                            location,
                            cells: [],
                        };
                    }
                    allGroups[key].cells.push(cell);
                }
            });

            setGroups(Object.values(allGroups));
        });

        return () => unsubscribe(); // Clean up the listener
    }, []);


    const loadNote = async (group: GroupedPlant) => {
        if (!auth.currentUser) return;
        const noteRef = doc(db, "users", auth.currentUser.uid, "plantNotes", group.key);
        const docSnap = await getDoc(noteRef);
        setNote(docSnap.exists() ? docSnap.data().note : "");
        setSelected(group);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto p-6">
            <div>
                <h2 className="text-lg font-semibold mb-4">Plants by Location</h2>
                {groups.length === 0 ? (
                    <p className="text-gray-500">No plants found.</p>
                ) : (
                    <ul className="space-y-2">
                        {groups.map((group) => (
                            <li key={group.key}>
                                <button
                                    onClick={() => loadNote(group)}
                                    className="w-full text-left px-4 py-2 border rounded-md"
                                >
                                    {group.plant} ({group.location})
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <div>
                {selected ? (
                    <NoteEditor plantGroup={selected} note={note} setNote={setNote} />
                ) : (
                    <p className="text-gray-500">Select a plant to view/add notes.</p>
                )}
            </div>
        </div>
    );
};

export default GroupedPlantList;
