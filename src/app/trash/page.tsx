"use client";
import { useEffect, useState } from "react";
import { db } from "@/app/firebaseConfig";
import { collection, onSnapshot, doc, deleteDoc, updateDoc } from "firebase/firestore";

interface Task {
  id: string;
  name: string;
  createdAt: any;
  updatedAt: any;
  deleted: boolean;
  deletedAt: any;
}

export default function RecentlyDeletedPage() {
  const [deletedTasks, setDeletedTasks] = useState<Task[]>([]);

  useEffect(() => {
    // Fetch deleted tasks and clean up old ones
    const unsubscribe = onSnapshot(collection(db, "tasks"), async (snapshot) => {
      const taskData = snapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name,
        createdAt: doc.data().createdAt,
        updatedAt: doc.data().updatedAt,
        deleted: doc.data().deleted,
        deletedAt: doc.data().deletedAt,
      }));

      // Filter out deleted tasks
      const filteredTasks = taskData.filter((task) => task.deleted);
      setDeletedTasks(filteredTasks);

      // Auto-delete tasks older than 30 days
      const now = new Date();
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(now.getDate() - 30);

      filteredTasks.forEach(async (task) => {
        if (task.deletedAt?.toDate() < thirtyDaysAgo) {
          await deleteDoc(doc(db, "tasks", task.id));
        }
      });
    });

    return () => unsubscribe();
  }, []);

  const permanentlyDeleteTask = async (taskId: string) => {
    await deleteDoc(doc(db, "tasks", taskId));
  };

  const restoreTask = async (taskId: string) => {
    const taskDoc = doc(db, "tasks", taskId);
    await updateDoc(taskDoc, { deleted: false, updatedAt: new Date() });
  };

  return (
    <div className="min-h-screen p-4 bg-gray-100">
      <h1 className="text-2xl font-bold text-center text-red-600 mb-6">
        Recently Deleted Tasks
      </h1>
      <div className="max-w-md mx-auto">
        <ul className="bg-white rounded-md shadow-md divide-y divide-gray-200">
          {deletedTasks.map((task) => (
            <li key={task.id} className="p-4 flex justify-between items-center">
              <div>
                <span className="line-through text-gray-500">{task.name}</span>
                <div className="text-sm text-gray-500">
                  <span>Deleted At: {task.deletedAt?.toDate()?.toLocaleString()}</span>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => restoreTask(task.id)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  Restore
                </button>
                <button
                  onClick={() => permanentlyDeleteTask(task.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Delete Permanently
                </button>
              </div>
            </li>
          ))}
          {deletedTasks.length === 0 && (
            <li className="p-4 text-center text-gray-500">No recently deleted tasks</li>
          )}
        </ul>
      </div>
    </div>
  );
}
