import React, { useEffect, useState } from "react";
import { auth, db } from "../../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

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
        const ref = doc(db, "users", auth.currentUser.uid, "plantNotes", group.key);
        await setDoc(ref, { note });
    };

    return (
        <div>
            <h3 className="text-md font-semibold mb-2">{group.plant} Notes</h3>
            <textarea
                className="w-full border rounded px-3 py-2 min-h-[100px]"
                value={note}
                onChange={(e) => setNote(e.target.value)}
            />
            <button onClick={saveNote} className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                Save Note
            </button>
        </div>
    );
};

export default PlantNoteEditor;
