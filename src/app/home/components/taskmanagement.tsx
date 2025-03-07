"use client";
import { useEffect, useState } from "react";
import { db } from "@/app/firebaseConfig";
import { collection, addDoc, doc, onSnapshot, updateDoc, query, where, serverTimestamp, Timestamp } from "firebase/firestore";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";

interface Task {
  id: string;
  name: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  done: boolean;
  deleted: boolean;
}

export default function TaskManagementPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskName, setTaskName] = useState("");
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [editedTaskName, setEditedTaskName] = useState("");
  const [user, setUser] = useState<User | null>(null);

  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, [auth]);

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, "tasks"), where("userId", "==", user.uid), where("deleted", "==", false));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const taskData = snapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name,
        createdAt: doc.data().createdAt as Timestamp,
        updatedAt: doc.data().updatedAt as Timestamp,
        done: doc.data().done,
        deleted: doc.data().deleted,
      }));
      setTasks(taskData.filter((task) => !task.done));
    });
    return () => unsubscribe();
  }, [user]);

  const addTask = async () => {
    if (taskName.trim() && user) {
      await addDoc(collection(db, "tasks"), {
        name: taskName,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        done: false,
        deleted: false,
        userId: user.uid,
      });
      setTaskName("");
    }
  };

  const deleteTask = async (taskId: string) => {
    const taskDoc = doc(db, "tasks", taskId);
    await updateDoc(taskDoc, { deleted: true, updatedAt: serverTimestamp() });
  };

  const markAsDone = async (taskId: string, done: boolean) => {
    const taskRef = doc(db, "tasks", taskId);
    await updateDoc(taskRef, {
      done: !done,
      updatedAt: serverTimestamp(),
    });
  };

  const editTask = async (taskId: string) => {
    const taskRef = doc(db, "tasks", taskId);
    await updateDoc(taskRef, {
      name: editedTaskName,
      updatedAt: serverTimestamp(),
    });
    setIsEditing(null);
    setEditedTaskName("");
  };

  return (
    <div className="min-h-screen p-4 bg-customColor1 text-black">
      <h1 className="text-2xl font-bold text-center mb-6">Task Management</h1>
      {user && <p className="text-center mb-4">Welcome, {user.email}</p>}
      <div className="max-w-md mx-auto">
        <div className="flex mb-4">
          <input
            type="text"
            placeholder="Add a new task..."
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            className="flex-1 p-2 border rounded-l-md focus:outline-none text-black"
          />
          <button
            onClick={addTask}
            className="p-2 bg-customColor4 text-white rounded-r-md hover:opacity-90"
          >
            Add Task
          </button>
        </div>
        <div className="bg-white rounded-md shadow-md divide-y h-80 overflow-y-auto">
          <ul>
            {tasks.map((task) => (
              <li key={task.id} className="p-4 flex justify-between items-center">
                <div>
                  {isEditing === task.id ? (
                    <input
                      type="text"
                      value={editedTaskName}
                      onChange={(e) => setEditedTaskName(e.target.value)}
                      className="p-2 border rounded text-black"
                    />
                  ) : (
                    <span className={task.done ? "line-through" : ""} style={{ wordBreak: "break-word", whiteSpace: "normal" }}>
                      {task.name}
                    </span>
                  )}
                  <div className="text-sm text-gray-500">
                    <span>Created: {task.createdAt?.toDate().toLocaleString()}</span>
                    <br />
                    <span>Updated: {task.updatedAt?.toDate().toLocaleString()}</span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => markAsDone(task.id, task.done)}
                    className="p-2 bg-customColor4 text-white rounded hover:opacity-90"
                  >
                    {task.done ? "Undo" : "Done"}
                  </button>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Delete
                  </button>
                  {isEditing === task.id ? (
                    <button
                      onClick={() => editTask(task.id)}
                      className="p-2 bg-customColor4 text-white rounded"
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setIsEditing(task.id);
                        setEditedTaskName(task.name);
                      }}
                      className="p-2 bg-customColor4 text-white rounded"
                    >
                      Edit
                    </button>
                  )}
                </div>
              </li>
            ))}
            {tasks.length === 0 && <li className="p-4 text-center text-gray-500">No tasks available</li>}
          </ul>
        </div>
      </div>
    </div>
  );
}