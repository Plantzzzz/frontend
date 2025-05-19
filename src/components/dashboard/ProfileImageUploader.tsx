import React, { useState } from "react";
import { auth, storage, db } from "../../firebase"; // Adjust path
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, updateDoc } from "firebase/firestore";

const ProfileImageUploader: React.FC = () => {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState("");

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !auth.currentUser) return;

        setUploading(true);
        setError("");

        try {
            const fileRef = ref(storage, `profileImages/${auth.currentUser.uid}`);
            await uploadBytes(fileRef, file);
            const imageUrl = await getDownloadURL(fileRef);

            const userRef = doc(db, "users", auth.currentUser.uid);
            await updateDoc(userRef, { profileImage: imageUrl });

            const stored = JSON.parse(sessionStorage.getItem("user") || "{}");
            stored.profileImage = imageUrl;
            sessionStorage.setItem("user", JSON.stringify(stored));

            window.location.reload(); // Force re-render with new image
        } catch (err) {
            setError("Failed to upload image.");
            console.error(err);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="mt-6">
            <label className="block mb-2 text-sm font-medium">Update Profile Picture</label>
            <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                disabled={uploading}
                className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0 file:font-semibold
                file:bg-indigo-100 file:text-indigo-800 hover:file:bg-indigo-200"
            />
            {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
        </div>
    );
};

export default ProfileImageUploader;
