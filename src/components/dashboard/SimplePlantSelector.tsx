import React, { useEffect, useState } from "react";
import { auth, db } from "../../firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

interface GroupedPlant {
    key: string;
    plant: string;
    location: string;
    cells: string[];
}

interface Props {
    onSelect: (plant: GroupedPlant) => void;
    selectedKey?: string;
}

const SimplePlantSelector: React.FC<Props> = ({ onSelect, selectedKey }) => {
    const [groups, setGroups] = useState<GroupedPlant[]>([]);

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

                for (const [cell, plant] of Object.entries(plantAssignments as Record<string, string>)) {
                    const location = cellLocations[cell];
                    if (!location) continue;

                    const key = `${plant}_${location}`;
                    if (!allGroups[key]) {
                        allGroups[key] = { key, plant, location, cells: [] };
                    }
                    allGroups[key].cells.push(cell);
                }
            }

            setGroups(Object.values(allGroups));
        });

        return () => unsubscribe();
    }, []);


    return (
        <div>
            <label className="block text-white text-lg font-semibold mb-3">Select a plant:</label>
            <select
                className="w-full bg-gray-800 text-white border border-gray-600 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                onChange={(e) => {
                    const selected = groups.find((g) => g.key === e.target.value);
                    if (selected) onSelect(selected);
                }}
                value={selectedKey || ""}
            >
                <option value="" disabled>-- Choose a plant --</option>
                {groups.map((group) => (
                    <option key={group.key} value={group.key}>
                        {group.plant} ({group.location})
                    </option>
                ))}
            </select>
        </div>

    );
};

export default SimplePlantSelector;
