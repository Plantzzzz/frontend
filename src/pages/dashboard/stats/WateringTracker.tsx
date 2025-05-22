import React, { useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../../../firebase";
import dayjs from "dayjs";

const WateringTracker: React.FC = () => {
    const [userId, setUserId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [wateringStreak, setWateringStreak] = useState(0);
    const [lastWateredDate, setLastWateredDate] = useState<string | null>(null);
    const [buttonDisabled, setButtonDisabled] = useState(false);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (user) {
                setUserId(user.uid);
                const userRef = doc(db, "users", user.uid);
                const userSnap = await getDoc(userRef);

                if (userSnap.exists()) {
                    const data = userSnap.data();
                    setWateringStreak(data.wateringStreak || 0);
                    setLastWateredDate(data.lastWateredDate || null);

                    const today = dayjs().format("YYYY-MM-DD");
                    if (data.lastWateredDate === today) {
                        setButtonDisabled(true);
                    }
                }
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleWater = async () => {
        if (!userId) return;

        const today = dayjs().format("YYYY-MM-DD");
        const yesterday = dayjs().subtract(1, "day").format("YYYY-MM-DD");

        let newStreak = 1;
        if (lastWateredDate === yesterday) {
            newStreak = wateringStreak + 1;
        }

        await setDoc(doc(db, "users", userId), {
            wateringStreak: newStreak,
            lastWateredDate: today,
        });

        setWateringStreak(newStreak);
        setLastWateredDate(today);
        setButtonDisabled(true);
    };

    if (loading) {
        return <p className="text-center text-gray-400">Loading watering status...</p>;
    }

    return (
        <div className="bg-gray-800 rounded-lg p-6 shadow-lg text-center mt-6">
            <h2 className="text-xl font-semibold mb-4 text-white">Zalivanje rastlin</h2>
            <p className="text-white mb-2">
                🌱 Zaporednih dni zalivanja: <strong>{wateringStreak}</strong>
            </p>
            <button
                onClick={handleWater}
                disabled={buttonDisabled}
                className={`px-4 py-2 rounded-lg text-white font-medium transition ${
                    buttonDisabled ? "bg-gray-500 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
                }`}
            >
                {buttonDisabled ? "Danes že zalito!" : "Zalil sem rože!"}
            </button>
        </div>
    );
};

export default WateringTracker;
