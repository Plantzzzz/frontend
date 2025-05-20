import React, { useEffect, useRef, useState } from "react";
import { auth, db } from "../../firebase";
import {
    collection,
    getDocs,
    query,
    where,
    doc,
    getDoc,
} from "firebase/firestore";
import PlantProfileModal from "./PlantProfileModal";

interface GroupedPlant {
    key: string;
    plant: string;
    location: string;
    cells: string[];
    image?: string;
}

const PlantList: React.FC = () => {
    const [groups, setGroups] = useState<GroupedPlant[]>([]);
    const [selected, setSelected] = useState<GroupedPlant | null>(null);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (!user) return;

            const q = query(collection(db, "spaces"), where("userId", "==", user.uid));
            const snap = await getDocs(q);

            const allGroups: Record<string, GroupedPlant> = {};

            for (const docSnap of snap.docs) {
                const data = docSnap.data();
                const plantAssignments = data.tableData?.plantAssignments || {};
                const cellLocations = data.tableData?.cellLocations || {};

                for (const [cell, plant] of Object.entries(plantAssignments)) {
                    const location = cellLocations[cell];
                    if (!location) continue;

                    const key = `${plant}_${location}`;
                    if (!allGroups[key]) {
                        const plantDocQuery = query(
                            collection(db, "plants"),
                            where("common_name", "==", plant)
                        );
                        const plantSnap = await getDocs(plantDocQuery);
                        const image = plantSnap.empty
                            ? "https://source.unsplash.com/300x200/?plant"
                            : plantSnap.docs[0].data().image;

                        allGroups[key] = { key, plant, location, cells: [], image };
                    }
                    allGroups[key].cells.push(cell);
                }
            }

            setGroups(Object.values(allGroups));
        });

        return () => unsubscribe();
    }, []);

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-w-6xl mx-auto px-4 py-6">
            {groups.map((group) => (
                <div
                    key={group.key}
                    className="bg-gray-800 rounded-lg overflow-hidden shadow hover:shadow-lg transition cursor-pointer"
                    onClick={() => setSelected(group)}
                >
                    <img
                        src={group.image || "https://source.unsplash.com/300x200/?plant"}
                        alt={group.plant}
                        className="w-full h-40 object-cover"
                    />
                    <div className="p-4">
                        <h3 className="text-lg font-semibold text-white">{group.plant}</h3>
                        <p className="text-sm text-gray-400">Location: {group.location}</p>
                        <p className="text-sm text-gray-500">Cells: {group.cells.length}</p>
                    </div>
                </div>
            ))}

            {selected && (
                <PlantProfileModal plant={selected} onClose={() => setSelected(null)} />
            )}
        </div>
    );
};

export default PlantList;
