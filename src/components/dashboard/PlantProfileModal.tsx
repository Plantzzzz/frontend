import React, { useEffect, useRef, useState } from "react";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import {
    doc, getDoc, setDoc, updateDoc,
    query, collection, where, getDocs
} from "firebase/firestore";
import { auth, db, storage } from "../../firebase";
import ImageGrid from "./ImageGrid.tsx";

interface GroupedPlant {
    key: string;
    plant: string;
    location: string;
    cells: string[];
}

interface ReferencePlant {
    description: string;
    image: string;
    watering: string;
    sunlight: string[];
    scientific_name: string[];
    family: string;
    growth_rate: string;
    care_level: string;
}

interface Props {
    plant: GroupedPlant;
    onClose: () => void;
}

const PlantProfileModal: React.FC<Props> = ({ plant, onClose }) => {
    const [refData, setRefData] = useState<ReferencePlant | null>(null);
    const [gallery, setGallery] = useState<string[]>([]);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        const fetchReferencePlant = async () => {
            const q = query(collection(db, "plants"), where("common_name", "==", plant.plant));
            const snap = await getDocs(q);
            if (!snap.empty) {
                setRefData(snap.docs[0].data() as ReferencePlant);
            }
        };

        const fetchUserGallery = async () => {
            if (!auth.currentUser) return;
            const metaRef = doc(db, "users", auth.currentUser.uid, "plantMeta", plant.key);
            const snap = await getDoc(metaRef);
            if (snap.exists()) {
                const data = snap.data();
                setGallery(data.gallery || []);
            }
        };

        fetchReferencePlant();
        fetchUserGallery();
    }, [plant]);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !auth.currentUser) return;

        const storageRef = ref(storage, `users/${auth.currentUser.uid}/plantImages/${plant.key}/${file.name}`);
        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);

        const metaRef = doc(db, "users", auth.currentUser.uid, "plantMeta", plant.key);
        const snap = await getDoc(metaRef);

        if (!snap.exists()) {
            await setDoc(metaRef, { gallery: [downloadURL] });
        } else {
            const existing = snap.data().gallery || [];
            await updateDoc(metaRef, { gallery: [...existing, downloadURL] });
        }

        setGallery((prev) => [...prev, downloadURL]);
    };

    // 🟩 clicking the backdrop closes the modal
    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) onClose();
    };

    return (
        <div
            className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center px-4"
            onClick={handleBackdropClick}
        >
            <div className="bg-gray-900 text-white rounded-xl w-full max-w-3xl shadow-2xl relative overflow-hidden animate-fade-in">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-3 right-4 text-gray-400 hover:text-white text-xl z-50"
                    aria-label="Close modal"
                >
                    ✕
                </button>

                {/* Featured Image */}
                <div className="relative w-full h-56 overflow-hidden">
                    <img
                        src={refData?.image || "https://source.unsplash.com/featured/?plant"}
                        alt={plant.plant}
                        className="w-full h-full object-cover"
                    />
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute bottom-2 right-2 text-xs px-3 py-1 bg-black bg-opacity-60 rounded hover:bg-opacity-80"
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

                {/* Content */}
                <div className="p-6 space-y-4">
                    <div>
                        <h2 className="text-2xl font-bold">{plant.plant}</h2>
                        <p className="text-gray-400 text-sm">{refData?.description || "No description available."}</p>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-gray-300">
                        <div><p className="font-semibold text-white">Scientific Name</p><p>{refData?.scientific_name?.[0]}</p></div>
                        <div><p className="font-semibold text-white">Family</p><p>{refData?.family}</p></div>
                        <div><p className="font-semibold text-white">Growth Rate</p><p>{refData?.growth_rate}</p></div>
                        <div><p className="font-semibold text-white">Care Level</p><p>{refData?.care_level}</p></div>
                        <div><p className="font-semibold text-white">Watering</p><p>{refData?.watering}</p></div>
                        <div><p className="font-semibold text-white">Sunlight</p><p>{refData?.sunlight?.join(", ")}</p></div>
                        <div className="col-span-3"><p className="font-semibold text-white">Assigned Cells</p><p className="text-gray-400 text-sm">{plant.cells.join(", ")}</p></div>
                    </div>

                    {/* Gallery */}
                    {gallery.length > 0 && (
                        <div>
                            <p className="font-semibold text-white mb-2">Your Gallery</p>
                            <ImageGrid images={gallery} columns={3} height="h-24" />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PlantProfileModal;
