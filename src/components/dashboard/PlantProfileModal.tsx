import React, { useEffect, useRef, useState } from "react";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import {
    doc,
    getDoc,
    setDoc,
    updateDoc,
    query,
    collection,
    where,
    getDocs
} from "firebase/firestore";
import { auth, db, storage } from "../../firebase";

interface GroupedPlant {
    key: string;
    plant: string;
    location: string;
    cells?: string[];
    image?: string;
    source: "spaces" | "saved";
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
    const [loading, setLoading] = useState(true);
    const [imageLoaded, setImageLoaded] = useState(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
const fetchData = async () => {
  try {
    if (plant.source === "saved") {
      if (!auth.currentUser) return;

      // Odstrani predpono 'saved_' iz plant.key, če obstaja
      const docId = plant.key.startsWith("saved_") ? plant.key.slice(6) : plant.key;

      const docRef = doc(db, "saved_plants", docId);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const data = snap.data();
        console.log("Firestore saved_plants document data:", data);

        const mappedData: ReferencePlant = {
          description: data.description || "No description.",
          image: data.perenualImage || "",
          watering: data.watering || "N/A",
          sunlight: data.sunlight || [],
          scientific_name: [data.scientificName || "N/A"],
          family: data.family || "N/A",
          growth_rate: data.growthRate || "N/A",
          care_level: "Unknown",
        };

        console.log("Mapped ReferencePlant data:", mappedData);
        setRefData(mappedData);
      } else {
        console.log("No document found in saved_plants for key:", docId);
      }
    } else {
      const q = query(collection(db, "plants"), where("common_name", "==", plant.plant));
      const snap = await getDocs(q);
      if (!snap.empty) {
        const data = snap.docs[0].data() as ReferencePlant;
        console.log("Firestore plants query data:", data);
        setRefData(data);
      } else {
        console.log("No plants found with common_name:", plant.plant);
      }
    }
  } catch (error) {
    console.error("Error fetching plant data:", error);
  } finally {
    setLoading(false);
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

        fetchData();
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

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) onClose();
    };

    return (
        <div
            className="fixed inset-0 md:left-64 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center px-4"
            onClick={handleBackdropClick}
        >
            <div className="bg-gray-900 text-white rounded-xl w-full max-w-3xl shadow-2xl relative overflow-hidden animate-fade-in max-h-[90vh] overflow-y-auto">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-3 right-4 text-gray-400 hover:text-white text-xl z-50"
                    aria-label="Close modal"
                >
                    ✕
                </button>

                {/* Featured Image */}
                <div className="relative w-full overflow-hidden">
                    {loading ? (
                        <div className="w-full h-[200px] bg-gray-700 flex items-center justify-center text-gray-400">
                            Loading...
                        </div>
                    ) : (
                        <img
                            src={refData?.image || plant.image || "/plant.jpg"}
                            alt={plant.plant}
                            className={`w-full max-h-[150px] object-cover transition-opacity duration-500 ${imageLoaded ? "opacity-100" : "opacity-0"}`}
                            onLoad={() => setImageLoaded(true)}
                            onError={(e) => {
                                e.currentTarget.src = "/plant.jpg";
                                setImageLoaded(true);
                            }}
                        />
                    )}
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
                <div className="p-4 sm:p-6 space-y-4">
                    <div>
                        <h2 className="text-xl sm:text-2xl font-bold">{plant.plant}</h2>
                        <p className="text-gray-400 text-sm">
                            {refData?.description || "No description available."}
                        </p>
                    </div>

                    {/* Extra info if from 'spaces' */}
                    {plant.source === "spaces" && plant.cells && (
                        <div className="text-sm text-gray-400">
                            Assigned to cells: {plant.cells.join(", ")}
                        </div>
                    )}

                    {/* Stats */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs sm:text-sm text-gray-300">
                        <div>
                            <p className="font-semibold text-white">Scientific Name</p>
                            <p>{refData?.scientific_name?.[0] || "N/A"}</p>
                        </div>
                        <div>
                            <p className="font-semibold text-white">Family</p>
                            <p>{refData?.family || "N/A"}</p>
                        </div>
                        <div>
                            <p className="font-semibold text-white">Growth Rate</p>
                            <p>{refData?.growth_rate || "N/A"}</p>
                        </div>
                        <div>
                            <p className="font-semibold text-white">Care Level</p>
                            <p>{refData?.care_level || "N/A"}</p>
                        </div>
                    </div>

                    {/* Image gallery */}
                    {gallery.length > 0 && (
                        <div>
                            <h4 className="text-white font-semibold">My Gallery</h4>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                {gallery.map((url, idx) => (
                                    <img
                                        key={idx}
                                        src={url}
                                        alt={`Gallery ${idx}`}
                                        className="w-full h-32 object-cover rounded"
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PlantProfileModal;
