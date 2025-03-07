"use client";

import { useState, useEffect } from "react";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { useRouter } from "next/navigation";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.replace("/home");
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.replace("/home");
    } catch (error: unknown) {
      setPassword("");
      if (error instanceof Error && "code" in error && typeof error.code === "string") {
        if (
          error.code === "auth/user-not-found" || 
          error.code === "auth/wrong-password" || 
          error.code === "auth/invalid-credential"
        ) {
          setError("Invalid email or password. Please try again.");
        } else {
          setError("An unexpected error occurred. Please try again later.");
        }
      }
      console.error("Login Error:", error);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <form className="p-6 bg-white rounded shadow-md" onSubmit={handleLogin}>
        <h2 className="text-xl font-semibold mb-4 text-black">Login</h2>
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 mb-2 border rounded text-black"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <div className="relative w-full mb-4">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="w-full p-2 border rounded pr-10 text-black"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-2 top-2 text-gray-500"
          >
            {showPassword ? <FaEye className="w-5 h-5" /> : <FaEyeSlash className="w-5 h-5" /> }
          </button>
        </div>
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded mb-2">
          Login
        </button>
        <p className="text-center text-sm text-black">
          Don&apos;t have an account? 
          <button 
            type="button" 
            onClick={() => router.push("/register")} 
            className="text-blue-500 hover:underline ml-1"
          >
            Register
          </button>
        </p>
        <p className="text-center text-sm text-black">
          Forgot your password? 
          <button 
            type="button" 
            onClick={() => router.push("/forgot")} 
            className="text-blue-500 hover:underline ml-1"
          >
            Reset Password
          </button>
        </p>
      </form>
    </div>
  );
}
