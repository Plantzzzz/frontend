import React from "react";
import { auth, db } from "../../firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

interface Props {
    plantGroup: { key: string; plant: string; location: string };
    note: string;
    setNote: (val: string) => void;
}

const NoteEditor: React.FC<Props> = ({ plantGroup, note, setNote }) => {
    const saveNote = async () => {
        if (!auth.currentUser) return;
        const ref = doc(db, "users", auth.currentUser.uid, "plantNotes", plantGroup.key);
        await setDoc(ref, {
            plant: plantGroup.plant,
            location: plantGroup.location,
            note,
            lastUpdated: serverTimestamp(),
        });
        alert("Note saved.");
    };

    return (
        <div>
            <h3 className="text-xl font-bold mb-2">
                Notes for {plantGroup.plant} ({plantGroup.location})
            </h3>
            <textarea
                className="w-full p-3 border rounded-md"
                rows={10}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Write your notes here..."
            />
            <button
                onClick={saveNote}
                className="mt-4 px-4 py-2 bg-green-600  rounded-md hover:bg-green-700"
            >
                Save
            </button>
        </div>
    );
};

export default NoteEditor;
