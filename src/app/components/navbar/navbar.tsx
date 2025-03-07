"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../../firebaseConfig";

import Link from "next/link";
import { XMarkIcon, Bars3Icon } from "@heroicons/react/24/outline";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.replace("/login");
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  return (
    <div className="flex fixed">
      {/* Sidebar for desktop */}
      <nav className="hidden lg:flex flex-col bg-customColor4 w-64 h-screen p-6 space-y-4">
        <Link href="/" className="hidden sm:hidden md:hidden lg:block text-white text-2xl font-bold">
          MyApp
        </Link>
        <Link href="/home" className="text-white hover:text-gray-700">Home</Link>
        <Link href="/history" className="text-white hover:text-gray-700">History</Link>
        <Link href="/trash" className="text-white hover:text-gray-700">Trash</Link>
        <Link href="/settings" className="text-white hover:text-gray-700">Settings</Link>
        <Link href="/account" className="text-white hover:text-gray-700">Account</Link>
        <button
          onClick={handleLogout}
          className="mt-4 bg-customColor2 text-white p-2 rounded"
        >
          Logout
        </button>
      </nav>

      {/* Hamburger menu for mobile */}
      <nav className="lg:hidden bg-customColor4 w-full p-4">
        <div className="flex justify-between items-center">
          <button onClick={() => setIsOpen(!isOpen)} className="text-white focus:outline-none">
            {isOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
          </button>
        </div>
        {/* Mobile Menu */}
        {isOpen && (
          <div className="flex flex-col mt-4 space-y-2">
            <Link href="/home" className="text-white hover:text-gray-700">Home</Link>
            <Link href="/history" className="text-white hover:text-gray-700">History</Link>
            <Link href="/trash" className="text-white hover:text-gray-700">Trash</Link>
            <Link href="/settings" className="text-white hover:text-gray-700">Settings</Link>
            <Link href="/account" className="text-white hover:text-gray-700">Account</Link>
            <button
              onClick={handleLogout}
              className="mt-4 bg-customColor2 text-white p-2 rounded"
            >
              Logout
            </button>
          </div>
        )}
      </nav>
    </div>
  );
};

export default Navbar;