"use client";
import { useEffect, useState } from "react";
import { db } from "@/app/firebaseConfig";
import { collection, onSnapshot } from "firebase/firestore";

interface Task {
  id: string;
  name: string;
  createdAt: any;
  updatedAt: any;
  done: boolean;
}

export default function History() {
  const [completedTasks, setCompletedTasks] = useState<Task[]>([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "tasks"), (snapshot) => {
      const taskData = snapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name,
        createdAt: doc.data().createdAt,
        updatedAt: doc.data().updatedAt,
        done: doc.data().done,
      }));
      // Filter tasks that are marked as done
      setCompletedTasks(taskData.filter((task) => task.done));
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen p-4 bg-gray-100">
      <h1 className="text-2xl font-bold text-center text-blue-600 mb-6">
        Completed Tasks History
      </h1>
      <div className="max-w-md mx-auto">
        <ul className="bg-white rounded-md shadow-md divide-y divide-gray-200">
          {completedTasks.map((task) => (
            <li key={task.id} className="p-4">
              <div>
                <span className="line-through text-gray-500">{task.name}</span>
                <div className="text-sm text-gray-500">
                  <span>Created: {task.createdAt?.toDate()?.toLocaleString()}</span>
                  <br />
                  <span>Completed: {task.updatedAt?.toDate()?.toLocaleString()}</span>
                </div>
              </div>
            </li>
          ))}
          {completedTasks.length === 0 && (
            <li className="p-4 text-center text-gray-500">No completed tasks</li>
          )}
        </ul>
      </div>
    </div>
  );
}