"use client";
import { useState } from "react";
import Link from "next/link";
import { XMarkIcon, Bars3Icon } from "@heroicons/react/24/outline";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex fixed">
      {/* Sidebar for desktop */}
      <nav className="hidden lg:flex flex-col bg-green-500 w-64 h-screen p-6 space-y-4">
        <Link href="/" className="text-white text-2xl font-bold">
          MyApp
        </Link>
        <Link href="/home" className="text-white hover:text-gray-300">
          Home
        </Link>
        <Link href="/about" className="text-white hover:text-gray-300">
          Team Task
        </Link>
        <Link href="/contact" className="text-white hover:text-gray-300">
          History
        </Link>
      </nav>

      {/* Hamburger menu for mobile */}
      <nav className="lg:hidden bg-green-500 w-full p-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-white text-xl font-bold">
            MyApp
          </Link>
          <button onClick={() => setIsOpen(!isOpen)} className="text-white focus:outline-none">
            {isOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
          </button>
        </div>
        {/* Mobile Menu */}
        {isOpen && (
          <div className="flex flex-col mt-4 space-y-2">
            <Link href="/home" className="text-white hover:text-gray-300">
              Home
            </Link>
            <Link href="/about" className="text-white hover:text-gray-300">
              Team Task
            </Link>
            <Link href="/contact" className="text-white hover:text-gray-300">
              History
            </Link>
          </div>
        )}
      </nav>
    </div>
  );
};

export default Navbar;
