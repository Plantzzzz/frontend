import React, { useEffect, useRef, useState } from "react";
import { auth, db, storage } from "../../firebase";
import {
    collection,
    getDocs,
    query,
    where,
    addDoc,
    doc,
    getDoc,
    setDoc,
    updateDoc,
    onSnapshot
} from "firebase/firestore";
import {
    ref,
    uploadBytes,
    getDownloadURL,
} from "firebase/storage";
import ImageGrid from "./ImageGrid";

export interface GroupedPlant {
    key: string;
    plant: string;
    location: string;
    cells: string[];
}

const PlantImageUploader: React.FC = () => {
    const [plants, setPlants] = useState<GroupedPlant[]>([]);
    const [selectedPlant, setSelectedPlant] = useState<GroupedPlant | null>(null);
    const [gallery, setGallery] = useState<string[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const unsubscribeAuth = auth.onAuthStateChanged((user) => {
            if (!user) return;
            const q = query(collection(db, "spaces"), where("userId", "==", user.uid));
            const unsubscribeSnap = onSnapshot(q, (snap) => {
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

                setPlants(Object.values(allGroups));
            });

            return () => unsubscribeSnap();
        });

        return () => unsubscribeAuth();
    }, []);

    const fetchGallery = async (plant: GroupedPlant) => {
        const user = auth.currentUser;
        if (!user) return;

        const metaRef = doc(db, "users", user.uid, "plantMeta", plant.key);
        const snap = await getDoc(metaRef);
        if (snap.exists()) {
            const data = snap.data();
            setGallery(data.gallery || []);
        } else {
            setGallery([]);
        }
    };

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const user = auth.currentUser;
        if (!selectedPlant || !user || !e.target.files?.length) return;

        const file = e.target.files[0];
        const storageRef = ref(storage, `users/${user.uid}/plantImages/${selectedPlant.key}/${file.name}`);
        await uploadBytes(storageRef, file);
        const url = await getDownloadURL(storageRef);

        const metaRef = doc(db, "users", user.uid, "plantMeta", selectedPlant.key);
        const snap = await getDoc(metaRef);

        if (!snap.exists()) {
            await setDoc(metaRef, { gallery: [url] });
        } else {
            const existing = snap.data().gallery || [];
            await updateDoc(metaRef, { gallery: [...existing, url] });
        }

        fetchGallery(selectedPlant);
    };

    const handlePlantSelect = (plant: GroupedPlant) => {
        setSelectedPlant(plant);
        fetchGallery(plant);
    };

    return (
        <div className="text-white">
            <h1 className="text-2xl font-bold mb-4">Plant Images</h1>

            <div className="mb-6">
                <label className="block mb-1 font-semibold">Select a plant:</label>
                <select
                    value={selectedPlant?.key || ""}
                    onChange={(e) => {
                        const found = plants.find((p) => p.key === e.target.value);
                        if (found) handlePlantSelect(found);
                    }}
                    className="bg-gray-800 border border-gray-600 px-4 py-2 rounded w-full"
                >
                    <option value="">-- Choose a plant --</option>
                    {plants.map((plant) => (
                        <option key={plant.key} value={plant.key}>
                            {plant.plant} ({plant.location})
                        </option>
                    ))}
                </select>
            </div>

            {selectedPlant && (
                <>
                    <div className="mb-4">
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-white"
                        >
                            Upload Image
                        </button>
                        <input
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            className="hidden"
                            onChange={handleUpload}
                        />
                    </div>

                    <ImageGrid images={gallery} columns={3} height="h-24" />
                </>
            )}
        </div>
    );
};

export default PlantImageUploader;
