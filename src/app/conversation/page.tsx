// src/app/conversation/page.tsx
"use client";
// src/app/conversation/page.tsx

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { firestore } from '../firebaseConfig';
import { doc, getDoc, setDoc, updateDoc, arrayUnion } from 'firebase/firestore';

interface Message {
  id: string;
  text: string;
  timestamp: string;
}

const ConversationPage: React.FC = () => {
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [user, setUser] = useState<{ name: string; id: string } | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>(''); // State for the new message input

  // Get the query params from the URL
  const searchParams = useSearchParams();
  const userId = searchParams.get('userId'); // Access query parameter by name

  // Ensure that the component is mounted on the client side
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Fetch user data and messages once the userId is available
  useEffect(() => {
    if (userId && isMounted) {
      const fetchUserData = async () => {
        try {
          // Fetch user data
          const userDoc = await getDoc(doc(firestore, 'users', userId));
          if (userDoc.exists()) {
            setUser({ id: userDoc.id, name: userDoc.data().name });
          }

          // Fetch messages
          const messagesDoc = await getDoc(doc(firestore, 'messages', userId));
          if (messagesDoc.exists()) {
            const messagesData = messagesDoc.data().messages || [];
            setMessages(messagesData);
          }
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };

      fetchUserData();
    }
  }, [userId, isMounted]);

  // Send a new message to Firestore
  const handleSendMessage = async () => {
    if (newMessage.trim() === '') return; // Don't send empty messages

    try {
      // Create a new message object
      const message: Message = {
        id: new Date().toISOString(), // Use a timestamp as a unique ID
        text: newMessage,
        timestamp: new Date().toISOString(),
      };

      const messagesDocRef = doc(firestore, 'messages', userId || '');

      // Check if the document exists
      const messagesDoc = await getDoc(messagesDocRef);

      if (!messagesDoc.exists()) {
        // If the document doesn't exist, create it with an initial empty messages array
        await setDoc(messagesDocRef, {
          messages: [message], // Start with the new message in the array
        });
      } else {
        // If the document exists, update it with the new message
        await updateDoc(messagesDocRef, {
          messages: arrayUnion(message),
        });
      }

      // Update local state to immediately show the new message
      setMessages((prevMessages) => [...prevMessages, message]);

      // Clear the message input
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  if (!isMounted) return null; // Prevent rendering before the component is mounted

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Conversation Header */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-semibold">{user?.name}</h2>
        <button
          onClick={() => window.history.back()}
          className="p-2 bg-gray-300 rounded-full hover:bg-gray-400"
        >
          Back
        </button>
      </div>

      {/* Messages */}
      <div className="bg-white shadow-md rounded-lg p-4 mb-4 max-h-[500px] overflow-y-auto">
        {messages.length > 0 ? (
          messages.map((message) => (
            <div key={message.id} className="mb-4">
              <p>{message.text}</p>
              <span className="text-gray-500 text-xs">{message.timestamp}</span>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No messages yet</p>
        )}
      </div>

      {/* Message Input and Send Button */}
      <div className="flex items-center gap-2">
        <input
          type="text"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="w-full p-2 border rounded-lg"
        />
        <button
          onClick={handleSendMessage}
          className="bg-blue-500 text-white p-2 rounded-lg"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ConversationPage;
