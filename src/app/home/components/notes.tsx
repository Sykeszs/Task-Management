"use client";
import { useState } from "react";

const NotesPage = () => {
  const [notes, setNotes] = useState<string[]>([]);
  const [newNote, setNewNote] = useState<string>("");

  const handleAddNote = () => {
    if (newNote.trim()) {
      setNotes([...notes, newNote]);
      setNewNote(""); // Clear input field after adding
    }
  };

  const handleRemoveNote = (index: number) => {
    const updatedNotes = notes.filter((_, i) => i !== index);
    setNotes(updatedNotes);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">My Notes</h1>
      
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
        <input
          type="text"
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          className="w-full p-2 mb-4 border border-gray-300 rounded"
          placeholder="Add a new note..."
        />
        <button
          onClick={handleAddNote}
          className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Add Note
        </button>

        <div className="mt-6 space-y-4">
          {notes.map((note, index) => (
            <div
              key={index}
              className="flex justify-between items-center p-4 bg-gray-200 rounded shadow"
            >
              <span>{note}</span>
              <button
                onClick={() => handleRemoveNote(index)}
                className="text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NotesPage;
