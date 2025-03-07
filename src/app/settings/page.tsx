"use client";
import { useState } from 'react';
import Navbar from '../components/navbar/navbar';

const Settings = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);

  return (
    <div className="flex-1 bg-customColor1 text-black overflow-y-auto">
      <Navbar/>
      <div className="p-8 bg-customColor1 min-h-screen overflow-auto lg:ml-64">
        
        <h1 className="text-2xl font-semibold mb-6">Settings</h1>

        {/* Theme Toggle */}
        <div className="flex justify-between items-center mb-4 ">
          <span>Dark Mode</span>
          <button 
            className={`w-12 h-6 flex items-center rounded-full p-1 transition duration-300 ${darkMode ? 'bg-green-500' : 'bg-gray-300'}`}
            onClick={() => setDarkMode(!darkMode)}
          >
            <div className={`w-5 h-5 bg-white rounded-full shadow-md transform ${darkMode ? 'translate-x-6' : ''}`}></div>
          </button>
        </div>

        {/* Notifications Toggle */}
        <div className="flex justify-between items-center mb-4">
          <span>Enable Notifications</span>
          <button 
            className={`w-12 h-6 flex items-center rounded-full p-1 transition duration-300 ${notifications ? 'bg-green-500' : 'bg-gray-300'}`}
            onClick={() => setNotifications(!notifications)}
          >
            <div className={`w-5 h-5 bg-white rounded-full shadow-md transform ${notifications ? 'translate-x-6' : ''}`}></div>
          </button>
        </div>

        {/* Save Button */}
        <button className="mt-4 w-full bg-customColor4 text-white py-2 rounded-lg hover:opacity-80 transition">Save Changes</button>
      </div>
    </div>
  );
};

export default Settings;
