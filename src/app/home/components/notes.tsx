"use client";
import { useEffect, useState } from "react";
import { db, auth } from "@/app/firebaseConfig"; // Ensure correct import
import { collection, addDoc, onSnapshot, query, where, serverTimestamp } from "firebase/firestore";
import { onAuthStateChanged, User } from "firebase/auth";

const NotesPage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [notes, setNotes] = useState<string[]>([]);
  const [newNote, setNewNote] = useState<string>("");

  // Fetch authenticated user
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  // Fetch notes only on the client side
  useEffect(() => {
    if (!user) {
      setNotes([]); // Clear notes when user logs out
      return;
    }

    const notesQuery = query(collection(db, "notes"), where("userId", "==", user.uid));

    const unsubscribe = onSnapshot(notesQuery, (snapshot) => {
      const fetchedNotes = snapshot.docs.map((doc) => doc.data()?.text || ""); // Avoid undefined issues
      setNotes(fetchedNotes);
    });

    return () => unsubscribe(); // Cleanup listener
  }, [user]);

  // Add note to Firestore
  const handleAddNote = async () => {
    if (!user || !newNote.trim()) return;

    await addDoc(collection(db, "notes"), {
      userId: user.uid,
      text: newNote,
      createdAt: serverTimestamp(),
    });

    setNewNote(""); // Clear input
  };

  return (
    <div className="min-h-screen h-auto bg-customColor1 text-black">
      <h1 className="text-3xl font-bold mb-6 text-center">My Notes</h1>

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
          className="w-full p-2 bg-customColor4 text-white rounded hover:opacity-90"
        >
          Add Note
        </button>

        {/* Scrollable notes container */}
        <div className="mt-6 space-y-2 max-h-[300px] overflow-y-auto">
          {notes.map((note, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-200 rounded shadow">
              <span className="w-4/5 whitespace-pre-wrap break-words">{note}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NotesPage;
