"use client";
import { useEffect, useState } from "react";
import { db, auth } from "@/app/firebaseConfig";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { Timestamp } from "firebase/firestore";
import Navbar from "../components/navbar/navbar";

interface Task {
  id: string;
  name: string;
  createdAt: Timestamp | null;
  updatedAt: Timestamp | null;
  done: boolean;
}

export default function History() {
  const [completedTasks, setCompletedTasks] = useState<Task[]>([]);
  const user = auth.currentUser;

  useEffect(() => {
    if (user) {
      const unsubscribe = onSnapshot(
        query(collection(db, "tasks"), where("userId", "==", user.uid)),
        (snapshot) => {
          const taskData: Task[] = snapshot.docs.map((doc) => ({
            id: doc.id,
            name: doc.data().name,
            createdAt: doc.data().createdAt instanceof Timestamp ? doc.data().createdAt : null,
            updatedAt: doc.data().updatedAt instanceof Timestamp ? doc.data().updatedAt : null,
            done: doc.data().done,
          }));
          setCompletedTasks(taskData.filter((task) => task.done));
        }
      );
      return () => unsubscribe();
    }
  }, [user]);

  return (
    <div className="flex-1 bg-customColor1 text-black overflow-y-auto">
      <Navbar />
      <div className="p-8 bg-customColor1 min-h-screen overflow-auto lg:ml-64">
        <h1 className="text-2xl font-bold text-center mb-6">Completed Tasks History</h1>
        <div className="max-w-md mx-auto">
          <ul className="bg-white rounded-md shadow-md divide-y divide-gray-200">
            {completedTasks.map((task) => (
              <li key={task.id} className="p-4">
                <div>
                  <span className="line-through text-gray-500">{task.name}</span>
                  <div className="text-sm text-gray-500">
                    <span>
                      Created: {task.createdAt ? task.createdAt.toDate().toLocaleString() : "N/A"}
                    </span>
                    <br />
                    <span>
                      Completed: {task.updatedAt ? task.updatedAt.toDate().toLocaleString() : "N/A"}
                    </span>
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
    </div>
  );
}
