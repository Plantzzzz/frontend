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
            <h3 className="text-md font-semibold mb-2">{group.plant} Tasks</h3>
            <div className="flex gap-2 mb-3">
                <input
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    className="flex-grow border px-3 py-2 rounded"
                    placeholder="New task..."
                />
                <button onClick={addTask} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
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
                            className={`cursor-pointer flex-1 ${task.done ? "line-through text-gray-500" : ""}`}
                            onClick={() => toggleDone(task)}
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
    );
};

export default PlantTodoList;
