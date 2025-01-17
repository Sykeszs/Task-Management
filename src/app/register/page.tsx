"use client";

import { useState } from "react";
import { 
  createUserWithEmailAndPassword, 
  updateProfile,
  fetchSignInMethodsForEmail
} from "firebase/auth";
import { collection, doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";
import { useRouter } from "next/navigation";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [reenterPassword, setReenterPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [verificationStep, setVerificationStep] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const [resendDisabled, setResendDisabled] = useState(true);
  const router = useRouter();

  // 🔹 Generate a 6-digit OTP
  const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

  // 🔹 Handle user registration
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
  
    if (password !== reenterPassword) {
      setError("Passwords do not match.");
      setPassword("");
      setReenterPassword("");
      return;
    }
  
    try {
      // 🔹 Check if the email is already registered
      const signInMethods = await fetchSignInMethodsForEmail(auth, email);
      if (signInMethods.length > 0) {
        setError("This email is already registered. Please log in.");
        return;
      }
  
      // 🔹 Create user account
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: username });
  
      // 🔹 Generate OTP
      const otpCode = generateOTP();
  
      // 🔹 Store OTP in Firestore
      await setDoc(doc(collection(db, "otpCodes"), email), {
        code: otpCode,
        createdAt: new Date(),
      });
  
      // 🔹 Send OTP email via Resend API
      await fetch("/api/sendOtp", {
        method: "POST",
        body: JSON.stringify({ email, otpCode }),
        headers: { "Content-Type": "application/json" },
      });
  
      setSuccess("OTP sent to your email. Please check your inbox.");
      setVerificationStep(true);
  
      // 🔹 Start 60s resend timer
      setResendDisabled(true);
      setResendTimer(60);
      const timer = setInterval(() => {
        setResendTimer((prev) => {
          if (prev === 1) {
            clearInterval(timer);
            setResendDisabled(false);
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Registration Error:", error);
        setError(error.message);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    }
  };

  // 🔹 Verify OTP
  const verifyOtp = async () => {
    setError("");
    setSuccess("");

    try {
      const otpDoc = await getDoc(doc(db, "otpCodes", email));
      if (!otpDoc.exists() || otpDoc.data().code !== otp) {
        setError("Invalid OTP. Please try again.");
        return;
      }

      setSuccess("OTP verified successfully! Redirecting...");
      setTimeout(() => router.replace("/login"), 2000);
    } catch (error) {
      console.error("OTP Verification Error:", error);  // ✅ Now it's used
      setError("Failed to verify OTP. Please try again.");
    }
    
  };

  // 🔹 Resend OTP
  const resendOtp = async () => {
    setError("");
    setSuccess("");

    try {
      const otpCode = generateOTP();
      await setDoc(doc(db, "otpCodes", email), { code: otpCode, createdAt: new Date() });

      await fetch("/api/sendOtp", {
        method: "POST",
        body: JSON.stringify({ email, otpCode }),
        headers: { "Content-Type": "application/json" },
      });

      setSuccess("New OTP sent. Check your inbox.");
      setResendDisabled(true);
      setResendTimer(60);
      const timer = setInterval(() => {
        setResendTimer((prev) => {
          if (prev === 1) {
            clearInterval(timer);
            setResendDisabled(false);
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error) {
      console.error("Resend OTP Error:", error);
      setError("Failed to resend OTP. Please try again.");
    }
    
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      {!verificationStep ? (
        <form className="p-6 bg-white rounded shadow-md" onSubmit={handleRegister}>
          <h2 className="text-xl font-semibold mb-4">Register</h2>
          {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

          <input
            type="text"
            placeholder="Username"
            className="w-full p-2 mb-2 border rounded"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full p-2 mb-2 border rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-2 mb-2 border rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Re-enter Password"
            className="w-full p-2 mb-4 border rounded"
            value={reenterPassword}
            onChange={(e) => setReenterPassword(e.target.value)}
            required
          />
          <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
            Register
          </button>
          
          <p className="text-center text-sm">
          Don`&apos;`t have an account? 
          <button 
            type="button" 
            onClick={() => router.push("/login")} 
            className="text-blue-500 hover:underline ml-1"
          >
            Log in
          </button>
        </p>
        </form>
      ) : (
        <div className="p-6 bg-white rounded shadow-md text-center">
          <h2 className="text-xl font-semibold mb-4">Enter OTP</h2>
          {success && <p className="text-green-500 text-sm mb-2">{success}</p>}
          {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

          <input
            type="text"
            placeholder="Enter OTP"
            className="w-full p-2 mb-2 border rounded text-center"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <button onClick={verifyOtp} className="w-full bg-green-500 text-white p-2 rounded">
            Verify OTP
          </button>
          
          <button 
            onClick={resendOtp} 
            className={`w-full mt-2 p-2 rounded ${
              resendDisabled ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 text-white"
            }`}
            disabled={resendDisabled}
          >
            {resendDisabled ? `Resend in ${resendTimer}s` : "Resend OTP"}
          </button>
        </div>
      )}
    </div>
  );
}
