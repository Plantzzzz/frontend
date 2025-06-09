import React, { useEffect, useRef, useState } from "react";
import { auth, db, storage } from "../../firebase";
import {
    collection,
    query,
    where,
    onSnapshot,
    doc,
    getDoc,
    setDoc,
    updateDoc,
} from "firebase/firestore";
import {
    ref,
    uploadBytes,
    getDownloadURL,
    deleteObject
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
    const [loadingGallery, setLoadingGallery] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        const unsubscribeAuth = auth.onAuthStateChanged((user) => {
            if (!user) return;
            const q = query(collection(db, "spaces"), where("userId", "==", user.uid));
            const unsubscribeSnap = onSnapshot(q, (snap) => {
                const allGroups: Record<string, GroupedPlant> = {};

                snap.forEach((docSnap) => {
                    const data = docSnap.data();
                    const plantAssignments = (data.tableData?.plantAssignments || {}) as Record<string, string>;
                    const cellLocations = (data.tableData?.cellLocations || {}) as Record<string, string>;

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
        setLoadingGallery(true);
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
        setLoadingGallery(false);
    };

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        setLoading(true);
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
        setLoading(false);
    };

    const handlePlantSelect = (plant: GroupedPlant) => {
        setSelectedPlant(plant);
        fetchGallery(plant);
    };

    function urlToStoragePath(url: string, uid: string) {
        // URL je v formatu: https://firebasestorage.googleapis.com/v0/b/<bucket>/o/users%2F{uid}%2FplantImages%2F{plantKey}%2F{filename}?alt=media&token=...
        // Potrebujemo del med "users%2F" in "?alt=media..."
        try {
            const baseUrl = decodeURIComponent(url.split("/o/")[1].split("?")[0]);
            // baseUrl je npr: users/{uid}/plantImages/{plantKey}/{filename}
            return baseUrl;
        } catch {
            // fallback
            return `users/${uid}/plantImages/${selectedPlant?.key}/${url.split("/").pop()}`;
        }
    }

    const handleDeleteImage = async (url: string) => {
    const user = auth.currentUser;
    if (!user || !selectedPlant) return;

    try {
        // Izbriši sliko iz Storage
        const imageRef = ref(storage, urlToStoragePath(url, user.uid));
        await deleteObject(imageRef);

        // Posodobi Firestore meta podatke in odstrani URL
        const metaRef = doc(db, "users", user.uid, "plantMeta", selectedPlant.key);
        const snap = await getDoc(metaRef);
        if (snap.exists()) {
            const data = snap.data();
            const gallery = (data.gallery || []).filter((imgUrl: string) => imgUrl !== url);
            await updateDoc(metaRef, { gallery });
            setGallery(gallery);
        }
    } catch (error) {
        console.error("Error deleting image:", error);
    }
};

    return (
        <div className="text-white">

            <div className="mb-6">
                <label className="block mb-2 font-semibold text-lg">Select a plant:</label>
                <select
                value={selectedPlant?.key || ""}
                onChange={(e) => {
                    const found = plants.find((p) => p.key === e.target.value);
                    if (found) handlePlantSelect(found);
                }}
                className="
                    w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white shadow-md 
                    transition duration-300 
                    hover:border-green-400 active:border-green-600
                    focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50
                    cursor-pointer
                "
                >
                <option value="" disabled hidden> Choose a plant </option>
                {plants.map((plant) => (
                    <option
                    key={plant.key}
                    value={plant.key}
                    className="bg-gray-900 text-white hover:bg-green-700"
                    >
                    {plant.plant} ({plant.location})
                    </option>
                ))}
                </select>
            </div>

            {selectedPlant && (
                <>
                    <div className="mb-6 flex justify-center">
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="bg-green-600 hover:bg-green-700 animate-pulse hover:animate-none px-6 py-3 rounded-full text-white font-semibold shadow-lg transition duration-300"
                            title="Upload new image"
                        >
                            📤 Upload Image
                        </button>
                        <input
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            className="hidden"
                            onChange={handleUpload}
                        />
                    </div>

                    {loadingGallery ? (
                        <div className="flex justify-center my-8">
                            <svg
                                className="animate-spin -ml-1 mr-3 h-10 w-10 text-green-500"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                ></circle>
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8v8H4z"
                                ></path>
                            </svg>
                        </div>
                    ) : (
                        <div
                            className="transition-opacity duration-700 ease-in"
                            style={{ opacity: gallery.length > 0 ? 1 : 0 }}
                        >
                            <ImageGrid
                                images={gallery}
                                columns={3}
                                height="h-36"
                                onDeleteImage={handleDeleteImage}
                                loading={loading}
                            />
                            {gallery.length === 0 && (
                                <p className="text-center text-gray-400 mt-4">No images uploaded yet.</p>
                            )}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default PlantImageUploader;
