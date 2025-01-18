"use client";

import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { useRouter } from "next/navigation";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const router = useRouter();

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    try {
      await sendPasswordResetEmail(auth, email);
      setSuccessMessage("Password reset email sent. Please check your inbox.");
      setEmail(""); // Clear email field
    } catch (error: unknown) {
      setSuccessMessage("");
      if (error instanceof Error && "code" in error && typeof error.code === "string") {
        if (error.code === "auth/invalid-email") {
          setError("Please enter a valid email address.");
        } else if (error.code === "auth/user-not-found") {
          setError("No account found with that email.");
        } else {
          setError("An unexpected error occurred. Please try again later.");
        }
      }
      console.error("Forgot Password Error:", error);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <form className="p-6 bg-white rounded shadow-md w-full max-w-sm" onSubmit={handleForgotPassword}>
        <h2 className="text-xl font-semibold mb-4">Forgot Password</h2>
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        {successMessage && <p className="text-green-500 text-sm mb-2">{successMessage}</p>}
        <input
          type="email"
          placeholder="Enter your email"
          className="w-full p-2 mb-4 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded mb-2">
          Send Password Reset Link
        </button>
        <p className="text-center text-sm">
          Remember your password? 
          <button 
            type="button" 
            onClick={() => router.push("/login")} 
            className="text-blue-500 hover:underline ml-1"
          >
            Login
          </button>
        </p>
      </form>
    </div>
  );
}
