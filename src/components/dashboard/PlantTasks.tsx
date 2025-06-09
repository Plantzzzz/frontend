import React, { useEffect, useState } from "react";
import { auth, db } from "../../firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
    collection,
    getDocs,
    doc,
    addDoc,
    deleteDoc,
    updateDoc,
    query,
    where
} from "firebase/firestore";

interface TableData {
    plantAssignments: Record<string, string>;
    cellLocations: Record<string, "inside" | "outside">;
}

interface Space {
    tableData: TableData;
    userId: string;
}

interface GroupedPlant {
    key: string;
    plant: string;
    location: string;
    cells: string[];
}

interface Task {
    id: string;
    text: string;
    done: boolean;
}

const PlantTasks: React.FC = () => {
    const [groups, setGroups] = useState<GroupedPlant[]>([]);
    const [selected, setSelected] = useState<GroupedPlant | null>(null);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [newTask, setNewTask] = useState("");

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (!user) return;

            const q = query(collection(db, "spaces"), where("userId", "==", user.uid));
            const snap = await getDocs(q);

            const allGroups: Record<string, GroupedPlant> = {};

            snap.forEach((docSnap) => {
                const space = docSnap.data() as Space;

                if (!space.tableData) return;
                const plantAssignments = space.tableData.plantAssignments || {};
                const cellLocations = space.tableData.cellLocations || {};

                for (const [cell, plant] of Object.entries(plantAssignments)) {
                    const location = cellLocations[cell];
                    if (!location) continue;

                    const key = `${plant}_${location}`;
                    if (!allGroups[key]) {
                        allGroups[key] = {
                            key,
                            plant,
                            location,
                            cells: [],
                        };
                    }
                    allGroups[key].cells.push(cell);
                }
            });

            setGroups(Object.values(allGroups));
        });

        return () => unsubscribe();
    }, []);

    const loadTasks = async (group: GroupedPlant) => {
        if (!auth.currentUser) return;

        setSelected(group);
        const todosSnap = await getDocs(
            collection(db, "users", auth.currentUser.uid, "plantTasks", group.key, "todos")
        );
        const items: Task[] = todosSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Task));
        setTasks(items);
    };

    const addTask = async () => {
        if (!auth.currentUser || !selected || !newTask.trim()) return;
        await addDoc(
            collection(db, "users", auth.currentUser.uid, "plantTasks", selected.key, "todos"),
            { text: newTask.trim(), done: false }
        );
        setNewTask("");
        loadTasks(selected);
    };

    const toggleDone = async (task: Task) => {
        if (!auth.currentUser || !selected) return;
        const ref = doc(db, "users", auth.currentUser.uid, "plantTasks", selected.key, "todos", task.id);
        await updateDoc(ref, { done: !task.done });
        loadTasks(selected);
    };

    const deleteTask = async (task: Task) => {
        if (!auth.currentUser || !selected) return;
        const ref = doc(db, "users", auth.currentUser.uid, "plantTasks", selected.key, "todos", task.id);
        await deleteDoc(ref);
        loadTasks(selected);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto p-6">
            <div>
                <h2 className="text-lg font-semibold mb-4">Plants by Location</h2>
                {groups.length === 0 ? (
                    <p className="text-gray-500">No plants found.</p>
                ) : (
                    <ul className="space-y-2">
                        {groups.map((group) => (
                            <li key={group.key}>
                                <button
                                    onClick={() => loadTasks(group)}
                                    className={`w-full text-left px-4 py-2 border rounded-md ${
                                        selected?.key === group.key ? "bg-green-100" : ""
                                    }`}
                                >
                                    {group.plant} ({group.location})
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <div>
                {selected ? (
                    <div className="space-y-4">
                        <h3 className="text-md font-semibold">{selected.plant} Tasks</h3>
                        <div className="flex gap-2">
                            <input
                                value={newTask}
                                onChange={(e) => setNewTask(e.target.value)}
                                placeholder="New task..."
                                className="flex-grow border rounded px-3 py-2"
                            />
                            <button
                                onClick={addTask}
                                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                            >
                                Add
                            </button>
                        </div>

                        <ul className="space-y-2">
                            {tasks.map((task) => (
                                <li
                                    key={task.id}
                                    className={`flex justify-between items-center px-4 py-2 border rounded ${
                                        task.done ? "bg-green-100" : ""
                                    }`}
                                >
                                    <span
                                        onClick={() => toggleDone(task)}
                                        className={`cursor-pointer flex-1 ${
                                            task.done ? "line-through text-gray-500" : ""
                                        }`}
                                    >
                                        {task.text}
                                    </span>
                                    <button
                                        onClick={() => deleteTask(task)}
                                        className="text-red-500 hover:text-red-700 ml-4"
                                    >
                                        Delete
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                ) : (
                    <p className="text-gray-500">Select a plant to manage tasks.</p>
                )}
            </div>
        </div>
    );
};

export default PlantTasks;
