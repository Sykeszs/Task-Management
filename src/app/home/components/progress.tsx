"use client";
import { useEffect, useState } from "react";
import { db } from "@/app/firebaseConfig";
import { collection, onSnapshot } from "firebase/firestore";

interface Task {
  id: string;
  done: boolean;
  deleted: boolean;
}

const CircleProgress = ({ progress }: { progress: number }) => {
  const radius = 50; // radius of the circle
  const stroke = 10; // stroke width of the circle
  const circumference = 2 * Math.PI * radius; // circumference of the circle
  const offset = circumference - (progress / 100) * circumference; // offset based on progress

  return (
    <svg className="w-32 h-32" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
      <circle
        cx="60"
        cy="60"
        r={radius}
        stroke="gray"
        strokeWidth={stroke}
        fill="none"
        className="stroke-gray-300"
      />
      <circle
        cx="60"
        cy="60"
        r={radius}
        stroke="green"
        strokeWidth={stroke}
        fill="none"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        className="transition-all duration-500 ease-in-out"
      />
      <text x="50%" y="50%" textAnchor="middle" stroke="none" strokeWidth="0" fill="green" dy="7">
        {Math.round(progress)}%
      </text>
    </svg>
  );
};

export default function ProgressPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [completedTasks, setCompletedTasks] = useState<number>(0);
  const [totalTasks, setTotalTasks] = useState<number>(0);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "tasks"), (snapshot) => {
      const taskData = snapshot.docs.map((doc) => ({
        id: doc.id,
        done: doc.data().done,
        deleted: doc.data().deleted || false, // assuming a deleted field exists
      }));

      // Filter out deleted tasks
      const activeTasks = taskData.filter((task) => !task.deleted);
      setTasks(activeTasks);

      // Calculate completed tasks
      setCompletedTasks(activeTasks.filter((task) => task.done).length);
      setTotalTasks(activeTasks.length);
    });

    return () => unsubscribe();
  }, []);

  const progress = totalTasks === 0 ? 0 : (completedTasks / totalTasks) * 100;

  return (
    <div className="min-h-screen p-4 bg-gray-100">
      <h1 className="text-2xl font-bold text-center text-green-600 mb-6">
        Task Progress
      </h1>
      <div className="max-w-md mx-auto">
        <div className="bg-white p-4 rounded-md shadow-md">
          <h2 className="text-xl font-semibold mb-4">Progress Overview</h2>
          <div className="flex items-center justify-between mb-4">
            <span>{completedTasks} of {totalTasks} tasks completed</span>
          </div>
          <div className="flex justify-center mb-4">
            <CircleProgress progress={progress} />
          </div>
          <div className="text-center text-lg font-semibold">
            {Math.round(progress)}% Completed
          </div>
        </div>
      </div>
    </div>
  );
}