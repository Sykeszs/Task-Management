"use client";
// src/app/inbox/page.tsx

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';  // Correct import for Next 13 and later
import { firestore } from '../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';

interface User {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
}

const ChatPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [users, setUsers] = useState<User[]>([]);
  const [isMounted, setIsMounted] = useState<boolean>(false); // Track if the component is mounted
  const [routerReady, setRouterReady] = useState<boolean>(false); // Track if router is ready

  // Ensuring the component is mounted on the client
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Ensure that router is only used on the client
  useEffect(() => {
    if (isMounted) {
      setRouterReady(true);
    }
  }, [isMounted]);

  const router = useRouter();  // Always call useRouter at the top

  // Fetch users from Firestore once mounted
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(firestore, 'users'));
        const usersData: User[] = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name,
          lastMessage: doc.data().lastMessage || 'No recent messages',
          time: doc.data().time || 'Just now',
        }));
        setUsers(usersData);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    if (isMounted) {
      fetchUsers();
    }
  }, [isMounted]);

  // Filter users based on search query
  const filteredUsers = users.filter((user) =>
    user.name && user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleUserClick = (userId: string) => {
    if (routerReady) {
      router.push(`/conversation?userId=${userId}`); // Navigate to the conversation page with the userId
    }
  };

  if (!isMounted) return null; // Only render the component after mount

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Search Bar */}
      <div className="flex items-center mb-4">
        <input
          type="text"
          placeholder="Search users..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-2 border rounded-lg"
        />
      </div>

      {/* User List */}
      <div className="bg-white shadow-md rounded-lg">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <div
              key={user.id}
              className="flex items-center justify-between p-4 border-b last:border-b-0 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleUserClick(user.id)} // On click, navigate to conversation page
            >
              <div>
                <h3 className="font-semibold text-lg">{user.name}</h3>
                <p className="text-gray-600 text-sm">{user.lastMessage}</p>
              </div>
              <span className="text-gray-500 text-xs">{user.time}</span>
            </div>
          ))
        ) : (
          <p className="text-center p-4 text-gray-500">No users found</p>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
