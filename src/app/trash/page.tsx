"use client";
import { Timestamp, collection, onSnapshot, doc, deleteDoc, updateDoc, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db, auth } from "@/app/firebaseConfig"; // Ensure auth is imported for authentication
import Navbar from "../components/navbar/navbar";

interface Task {
  id: string;
  name: string;
  createdAt: Timestamp | null;
  updatedAt: Timestamp | null;
  deleted: boolean;
  deletedAt: Timestamp | null;
}

export default function RecentlyDeletedPage() {
  const [deletedTasks, setDeletedTasks] = useState<Task[]>([]);
  const user = auth.currentUser; // Get the current authenticated user

  useEffect(() => {
    if (user) {
      const unsubscribe = onSnapshot(
        query(collection(db, "tasks"), where("userId", "==", user.uid), where("deleted", "==", true)), // Filter tasks by userId and deleted flag
        async (snapshot) => {
          const taskData: Task[] = snapshot.docs.map((doc) => ({
            id: doc.id,
            name: doc.data().name,
            createdAt: doc.data().createdAt instanceof Timestamp ? doc.data().createdAt : null,
            updatedAt: doc.data().updatedAt instanceof Timestamp ? doc.data().updatedAt : null,
            deleted: doc.data().deleted,
            deletedAt: doc.data().deletedAt instanceof Timestamp ? doc.data().deletedAt : null,
          }));

          setDeletedTasks(taskData);

          // Auto-delete tasks older than 30 days
          const now = new Date();
          const thirtyDaysAgo = new Date(now);
          thirtyDaysAgo.setDate(now.getDate() - 30);

          taskData.forEach(async (task) => {
            if (task.deletedAt && task.deletedAt.toDate() < thirtyDaysAgo) {
              await deleteDoc(doc(db, "tasks", task.id));
            }
          });
        }
      );

      return () => unsubscribe();
    }
  }, [user]);

  const permanentlyDeleteTask = async (taskId: string) => {
    await deleteDoc(doc(db, "tasks", taskId));
  };

  const restoreTask = async (taskId: string) => {
    const taskDoc = doc(db, "tasks", taskId);
    await updateDoc(taskDoc, { deleted: false, updatedAt: Timestamp.now() });
  };

  return (
    <div className="flex-1 bg-customColor1 text-black overflow-y-auto">
      <Navbar />
      <div className="p-8 bg-customColor1 min-h-screen overflow-auto lg:ml-64">
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
                    <span>
                      Deleted At: {task.deletedAt ? task.deletedAt.toDate().toLocaleString() : "N/A"}
                    </span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => restoreTask(task.id)}
                    className="bg-customColor4 text-white px-4 py-2 rounded-md hover:opacity-80"
                  >
                    Restore
                  </button>
                  <button
                    onClick={() => permanentlyDeleteTask(task.id)}
                    className="bg-customColor4 text-white px-4 py-2 rounded-md hover:opacity-80"
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
    </div>
  );
}
