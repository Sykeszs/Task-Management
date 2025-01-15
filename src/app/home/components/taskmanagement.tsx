"use client";
import { useState } from 'react';

interface Task {
  id: number;
  name: string;
}

export default function TaskManagementPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskName, setTaskName] = useState('');

  const addTask = () => {
    if (taskName.trim()) {
      const newTask: Task = {
        id: Date.now(),
        name: taskName,
      };
      setTasks([...tasks, newTask]);
      setTaskName('');
    }
  };

  const deleteTask = (taskId: number) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  return (
    <div className="min-h-screen p-4 bg-gray-100">
      <h1 className="text-2xl font-bold text-center text-green-600 mb-6">Task Management</h1>
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
              <span>{task.name}</span>
              <button
                onClick={() => deleteTask(task.id)}
                className="text-red-500 hover:text-red-700"
              >
                Delete
              </button>
            </li>
          ))}
          {tasks.length === 0 && (
            <li className="p-4 text-center text-gray-500">No tasks available</li>
          )}
        </ul>
      </div>
    </div>
  );
}
