import React, { useEffect, useState } from "react";
import { auth, db } from "../../../firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
    Legend,
} from "recharts";

// Type-only import for User
import type { User } from "firebase/auth";

const PlantCountChart: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [plantData, setPlantData] = useState<{ name: string; count: number }[]>([]);

    useEffect(() => {
        let unsubscribe: (() => void) | undefined;

        const fetchPlantCounts = async (user: User) => {
            const q = query(collection(db, "spaces"), where("userId", "==", user.uid));
            const snap = await getDocs(q);

            const plantCountMap: Record<string, number> = {};

            for (const docSnap of snap.docs) {
                const data = docSnap.data();
                const plantAssignments = data.tableData?.plantAssignments || {};

                for (const cell in plantAssignments) {
                    const plantName = plantAssignments[cell];
                    if (!plantName) continue;

                    plantCountMap[plantName] = (plantCountMap[plantName] || 0) + 1;
                }
            }

            const result = Object.entries(plantCountMap).map(([name, count]) => ({
                name,
                count,
            }));

            setPlantData(result);
            setLoading(false);
        };

        unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                fetchPlantCounts(user);
            } else {
                setPlantData([]);
                setLoading(false);
            }
        });

        return () => {
            if (unsubscribe) unsubscribe();
        };
    }, []);

    return (
        <div>
            <h2 className="text-xl font-semibold mb-4 text-white">Plant Type Frequency</h2>
            {loading ? (
                <p className="text-gray-400 text-center">Loading...</p>
            ) : (
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={plantData} margin={{ top: 20, right: 20, left: 0, bottom: 40 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name"  textAnchor="end" interval={0} />
                        <YAxis allowDecimals={false} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="count" fill="#4ade80" />
                    </BarChart>
                </ResponsiveContainer>
            )}
        </div>
    );
};

export default PlantCountChart;
