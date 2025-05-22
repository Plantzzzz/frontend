import React, { useEffect, useState } from "react";
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import { auth, db } from "../../../firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import type { User } from "firebase/auth";


const COLORS = ["#4ade80", "#60a5fa"]; // green, blue

const IndoorOutdoorPieChart: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [pieData, setPieData] = useState<{ name: string; value: number }[]>([]);
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            setUser(firebaseUser);
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            if (!user) return; // čakaj na uporabnika

            setLoading(true);

            const q = query(collection(db, "spaces"), where("userId", "==", user.uid));
            const snap = await getDocs(q);

            let indoorCount = 0;
            let outdoorCount = 0;

            for (const docSnap of snap.docs) {
                const data = docSnap.data();
                const cellLocations = data.tableData?.cellLocations || {};

                for (const cell in cellLocations) {
                    const location = cellLocations[cell].toLowerCase();
                    if (location.includes("inside")) {
                        indoorCount++;
                    } else if (location.includes("outside")) {
                        outdoorCount++;
                    }
                }
            }

            setPieData([
                { name: "Indoor", value: indoorCount },
                { name: "Outdoor", value: outdoorCount },
            ]);
            setLoading(false);
        };

        fetchData();
    }, [user]); // fetch data ko user ni null

    if (loading) return <p className="text-center text-gray-400">Loading...</p>;

    return (
        <div >
            <h2 className="text-xl font-semibold mb-4 text-white">Indoor vs Outdoor Cells</h2>
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                        data={pieData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        label
                    >
                        {pieData.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

export default IndoorOutdoorPieChart;
