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
  deleted: boolean; // Add the 'deleted' field
}

export default function TaskManagementPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskName, setTaskName] = useState("");
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [editedTaskName, setEditedTaskName] = useState("");
  const [user, setUser] = useState<User | null>(null);

  const auth = getAuth();

  // Track the logged-in user
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, [auth]);

  // Fetch tasks for the current user (only show active tasks where deleted is false)
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
        deleted: doc.data().deleted, // Ensure the 'deleted' field is included
      }));
      setTasks(taskData.filter((task) => !task.done)); // Show only incomplete tasks
    });

    return () => unsubscribe();
  }, [user]);

  // Add a new task
  const addTask = async () => {
    if (taskName.trim() && user) {
      await addDoc(collection(db, "tasks"), {
        name: taskName,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        done: false,
        deleted: false, // New tasks are not deleted
        userId: user.uid, // Save user ID
      });
      setTaskName("");
    }
  };

  // Soft delete task (mark it as deleted without removing it)
  const deleteTask = async (taskId: string) => {
    const taskDoc = doc(db, "tasks", taskId);
    await updateDoc(taskDoc, { deleted: true, updatedAt: serverTimestamp() });
  };

  // Mark task as done (completed)
  const markAsDone = async (taskId: string, done: boolean) => {
    const taskRef = doc(db, "tasks", taskId);
    await updateDoc(taskRef, {
      done: !done,
      updatedAt: serverTimestamp(),
    });
  };

  // Edit task name
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
    <div className="min-h-screen p-4 bg-gray-100">
      <h1 className="text-2xl font-bold text-center text-green-600 mb-6">Task Management</h1>

      {/* Show user email */}
      {user && <p className="text-center text-gray-600 mb-4">Welcome, {user.email}</p>}

      <div className="max-w-md mx-auto">
        <div className="flex mb-4">
          <input
            type="text"
            placeholder="Add a new task..."
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            className="flex-1 p-2 border rounded-l-md focus:outline-none focus:ring focus:ring-green-300"
          />
          <button
            onClick={addTask}
            className="p-2 bg-green-500 text-white rounded-r-md hover:bg-green-600"
          >
            Add Task
          </button>
        </div>
        <ul className="bg-white rounded-md shadow-md divide-y divide-gray-200">
          {tasks.map((task) => (
            <li key={task.id} className="p-4 flex justify-between items-center">
              <div>
                {isEditing === task.id ? (
                  <input
                    type="text"
                    value={editedTaskName}
                    onChange={(e) => setEditedTaskName(e.target.value)}
                    className="p-2 border rounded"
                  />
                ) : (
                  <span className={task.done ? "line-through text-gray-500" : ""}>{task.name}</span>
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
                  className={`${
                    task.done ? "bg-gray-300" : "bg-green-500"
                  } p-2 text-white rounded hover:bg-green-600`}
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
                    className="bg-blue-500 text-white p-2 rounded"
                  >
                    Save
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setIsEditing(task.id);
                      setEditedTaskName(task.name);
                    }}
                    className="bg-yellow-500 text-white p-2 rounded"
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
  );
}
