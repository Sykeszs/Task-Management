'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAuth, onAuthStateChanged, signOut, updateProfile } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import { app } from '../firebaseConfig';
import Navbar from '../components/navbar/navbar';
import Image from 'next/image';

const auth = getAuth(app);
const db = getFirestore(app);

const maleAvatars = Array.from({ length: 6 }, (_, i) => `/avatars/a${i + 1}.png`);
const femaleAvatars = Array.from({ length: 6 }, (_, i) => `/avatars/a${i + 7}.png`);

const getDefaultAvatar = (gender: string) => {
  console.log("Selected gender for avatar:", gender);
  return '/avatars/a0.png';
};

const Account = () => {
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; email: string; dob: string; gender: string; avatar: string; bio: string } | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', dob: '', gender: 'Male', avatar: '', bio: '' });

  // Rendering male and female avatars
  const maleAvatars = Array.from({ length: 6 }, (_, i) => `/avatars/a${i + 1}.png`);
  const femaleAvatars = Array.from({ length: 6 }, (_, i) => `/avatars/a${i + 7}.png`);

  const getDefaultAvatar = (gender: string) => {
    console.log("Selected gender for avatar:", gender);
    return '/avatars/a0.png';
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const userRef = doc(db, 'users', currentUser.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const userData = userSnap.data() as { name: string; email: string; dob: string; gender?: string; avatar?: string; bio: string };
          const defaultGender = userData.gender === 'Male' || userData.gender === 'Female' ? userData.gender : 'Male';
          const avatar = userData.avatar || getDefaultAvatar(defaultGender);

          if (!userData.avatar) {
            await setDoc(userRef, { avatar }, { merge: true });
          }

          setUser({ ...userData, gender: defaultGender, avatar });
          setFormData({ ...userData, gender: defaultGender, avatar });
        } else {
          const defaultGender = 'Male';
          const avatar = getDefaultAvatar(defaultGender);

          const newUser = {
            name: currentUser.displayName || '',
            email: currentUser.email || '',
            dob: '',
            gender: defaultGender,
            avatar,
            bio: '',
          };
          await setDoc(userRef, newUser);

          setUser(newUser);
          setFormData(newUser);
        }
      } else {
        router.push('/login');
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleEdit = () => setIsEditing(true);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      avatar: name === 'gender' ? getDefaultAvatar(value) : prev.avatar,
    }));
  };

  const handleAvatarSelect = (avatar: string) => {
    setFormData((prev) => ({ ...prev, avatar }));
  };

  const handleSave = async () => {
    if (auth.currentUser) {
      const gender = formData.gender === 'Male' || formData.gender === 'Female' ? formData.gender : 'Male';
      const updatedData = { ...formData, gender };

      await updateProfile(auth.currentUser, { displayName: updatedData.name });
      const userRef = doc(db, 'users', auth.currentUser.uid);
      await setDoc(userRef, updatedData, { merge: true });

      setUser(updatedData);
      setIsEditing(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/login');
  };

  return (
    <div className="flex-1 bg-customColor1 text-black overflow-y-auto">
      <Navbar />
      <div className="bg-customColor1 min-h-screen overflow-auto lg:ml-64 flex flex-col items-center justify-center">
        <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md text-center">
          <h2 className="text-2xl font-semibold mb-4">Account Details</h2>
          {user && (
            <>
              <Image
                src={user.avatar}
                alt="Avatar"
                width={96}
                height={96}
                className="mx-auto rounded-full mb-4 border"
              />
              {isEditing ? (
                <div className="space-y-4">
                  <div className="avatar-selection flex justify-around mb-4">
                    {formData.gender === 'Male'
                      ? maleAvatars.map((avatar, index) => (
                          <img
                            key={index}
                            src={avatar}
                            alt={`Male Avatar ${index + 1}`}
                            onClick={() => handleAvatarSelect(avatar)}
                            className={`w-16 h-16 rounded-full cursor-pointer ${formData.avatar === avatar ? 'border-4 border-customColor4' : ''}`}
                          />
                        ))
                      : femaleAvatars.map((avatar, index) => (
                          <img
                            key={index}
                            src={avatar}
                            alt={`Female Avatar ${index + 1}`}
                            onClick={() => handleAvatarSelect(avatar)}
                            className={`w-16 h-16 rounded-full cursor-pointer ${formData.avatar === avatar ? 'border-4 border-customColor4' : ''}`}
                          />
                        ))}
                  </div>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    placeholder="Describe yourself..."
                    className="w-full p-2 border rounded-lg mt-4"
                  />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-lg"
                  />
                  <input
                    type="email"
                    name="email"
                    disabled
                    value={formData.email}
                    className="w-full p-2 border rounded-lg bg-gray-200"
                  />
                  <input
                    type="text"
                    name="dob"
                    disabled
                    value={formData.dob}
                    className="w-full p-2 border rounded-lg"
                  />
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-lg"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>

                  <button onClick={handleSave} className="w-full bg-customColor4 text-white py-2 rounded-lg">
                    Save
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <p>{user.bio}</p>
                  <p><strong>Name:</strong> {user.name}</p>
                  <p><strong>Email:</strong> {user.email}</p>
                  <p><strong>Birthday:</strong> {user.dob}</p>
                  <p><strong>Gender:</strong> {user.gender}</p>
                  <button onClick={handleEdit} className="w-full bg-customColor4 text-white py-2 rounded-lg">
                    Edit Profile
                  </button>
                </div>
              )}
            </>
          )}
          <button onClick={handleLogout} className="mt-4 w-full bg-customColor4 text-white py-2 rounded-lg">
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Account;
