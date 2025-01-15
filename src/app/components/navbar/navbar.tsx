import Link from "next/link";

// components/Navbar.tsx
const Navbar = () => {
  return (
    <nav className="bg-green-500 p-4">
      <div className="flex justify-between items-center">
        <Link href="/" className="text-white text-lg font-semibold">
          MyApp
        </Link>
        <div className="space-x-4">
          <Link href="/home" className="text-white hover:text-gray-300">
            Home
          </Link>
          <Link href="/about" className="text-white hover:text-gray-300">
            About
          </Link>
          <Link href="/contact" className="text-white hover:text-gray-300">
            Contact
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; // Make sure this is the default export
