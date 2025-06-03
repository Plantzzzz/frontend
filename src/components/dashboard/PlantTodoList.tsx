import React, { useEffect, useState } from "react";
import { auth, db } from "../../firebase";
import {
    collection,
    getDocs,
    addDoc,
    deleteDoc,
    updateDoc,
    doc,
} from "firebase/firestore";
import { AnimatePresence, motion } from "framer-motion";

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

interface Props {
    group: GroupedPlant;
}

const PlantTodoList: React.FC<Props> = ({ group }) => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [newTask, setNewTask] = useState("");

    const fetchTasks = async () => {
        if (!auth.currentUser) return;
        const snap = await getDocs(
            collection(db, "users", auth.currentUser.uid, "plantTasks", group.key, "todos")
        );
        setTasks(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Task)));
    };

    useEffect(() => {
        fetchTasks();
    }, [group]);

    const addTask = async () => {
        if (!auth.currentUser || !newTask.trim()) return;
        await addDoc(
            collection(db, "users", auth.currentUser.uid, "plantTasks", group.key, "todos"),
            { text: newTask.trim(), done: false }
        );
        setNewTask("");
        fetchTasks();
    };

    const toggleDone = async (task: Task) => {
        const ref = doc(db, "users", auth.currentUser.uid, "plantTasks", group.key, "todos", task.id);
        await updateDoc(ref, { done: !task.done });
        fetchTasks();
    };

    const deleteTask = async (task: Task) => {
        const ref = doc(db, "users", auth.currentUser.uid, "plantTasks", group.key, "todos", task.id);
        await deleteDoc(ref);
        fetchTasks();
    };

    return (
        <div>
            <h3 className="text-xl text-white font-semibold mb-4">
                ✅ {group.plant} Tasks
            </h3>
            <div className="flex gap-2 mb-4">
                <input
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    className="flex-grow bg-gray-800 border border-gray-600 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                    placeholder="New task..."
                />
                <button
                    onClick={addTask}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                >
                    ➕ Add
                </button>
            </div>
            <ul className="space-y-3">
                <AnimatePresence>
                    {tasks.map((task) => (
                        <motion.li
                            key={task.id}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: 50 }}
                            transition={{ duration: 0.2 }}
                            className={`flex justify-between items-center px-4 py-3 border border-gray-600 rounded-lg ${
                                task.done ? "bg-green-200/10" : "bg-gray-800"
                            }`}
                        >
                            <span
                                className={`cursor-pointer flex-1 text-white ${
                                    task.done ? "line-through text-gray-400" : ""
                                }`}
                                onClick={() => toggleDone(task)}
                            >
                                {task.text}
                            </span>
                            <button
                                onClick={() => deleteTask(task)}
                                className="text-red-400 hover:text-red-600 transition ml-4"
                            >
                                🗑️
                            </button>
                        </motion.li>
                    ))}
                </AnimatePresence>
            </ul>
        </div>
    );
};

export default PlantTodoList;
