import React, { useEffect, useState } from "react";
import { auth, db } from "../../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";

interface GroupedPlant {
    key: string;
    plant: string;
    location: string;
    cells: string[];
}

interface Props {
    selected: GroupedPlant | null;
    onSelect: (group: GroupedPlant) => void;
}

const PlantList: React.FC<Props> = ({ selected, onSelect }) => {
    const [groups, setGroups] = useState<GroupedPlant[]>([]);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (!user) return;

            const q = query(collection(db, "spaces"), where("userId", "==", user.uid));
            const snap = await getDocs(q);

            const allGroups: Record<string, GroupedPlant> = {};

            snap.forEach((docSnap) => {
                const data = docSnap.data();
                const plantAssignments = data.tableData?.plantAssignments || {};
                const cellLocations = data.tableData?.cellLocations || {};

                for (const [cell, plant] of Object.entries(plantAssignments)) {
                    const location = cellLocations[cell];
                    if (!location) continue;

                    const key = `${plant}_${location}`;
                    if (!allGroups[key]) {
                        allGroups[key] = { key, plant, location, cells: [] };
                    }
                    allGroups[key].cells.push(cell);
                }
            });

            setGroups(Object.values(allGroups));
        });

        return () => unsubscribe();
    }, []);

    return (
        <div>
            <h2 className="text-lg font-semibold mb-4">Plants by Location</h2>
            <ul className="space-y-2">
                {groups.map((group) => (
                    <li key={group.key}>
                        <button
                            onClick={() => onSelect(group)}
                            className={`w-full text-left px-4 py-2 border rounded-md ${
                                selected?.key === group.key ? "bg-green-100" : ""
                            }`}
                        >
                            {group.plant} ({group.location})
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default PlantList;
