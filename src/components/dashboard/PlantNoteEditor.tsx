import React, { useEffect, useState } from "react";
import { auth, db } from "../../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";

interface GroupedPlant {
    key: string;
    plant: string;
    location: string;
    cells: string[];
}

interface Props {
    group: GroupedPlant;
}

const PlantNoteEditor: React.FC<Props> = ({ group }) => {
    const [note, setNote] = useState("");
    const [saved, setSaved] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const fetchNote = async () => {
            if (!auth.currentUser) return;
            const ref = doc(db, "users", auth.currentUser.uid, "plantNotes", group.key);
            const snap = await getDoc(ref);
            setNote(snap.exists() ? snap.data().note : "");
        };
        fetchNote();
    }, [group]);

    const saveNote = async () => {
        if (!auth.currentUser) return;
        setIsSaving(true);
        const ref = doc(db, "users", auth.currentUser.uid, "plantNotes", group.key);
        await setDoc(ref, { note });
        setIsSaving(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000); // Hide after 2s
    };

    return (
        <div>
            <h3 className="text-xl text-white font-semibold mb-4">
                ✏️ {group.plant} Notes
            </h3>
            <textarea
                className="w-full border border-gray-600 bg-gray-800 text-white rounded-lg px-4 py-3 min-h-[120px] resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Write your notes here..."
            />
            <motion.button
                onClick={saveNote}
                whileTap={{ scale: 0.95 }}
                className={`mt-4 px-5 py-2 rounded-lg font-semibold transition ${
                    isSaving ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
                } text-white flex items-center space-x-2`}
                disabled={isSaving}
            >
                <span>💾 Save Note</span>
            </motion.button>

            <AnimatePresence>
                {saved && (
                    <motion.div
                        key="saved"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="mt-3 text-green-400 font-medium"
                    >
                        ✔️ Note saved!
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default PlantNoteEditor;
