"use client"; // Required for client-side hooks

import { useState } from "react";
import { auth, provider } from "../firebase";  
import { signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";  
import { useRouter } from "next/navigation"; 
import { FcGoogle } from "react-icons/fc";

export default function AuthForm({ isSignup }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const router = useRouter();
    const [error, setError] = useState("");

    const handleAuth = async (e) => {
        e.preventDefault();
        setError(""); // Clear previous errors
        try {
            if (isSignup) {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                await updateProfile(userCredential.user, { displayName: name });
            } else {
                await signInWithEmailAndPassword(auth, email, password);
            }

            const user = userCredential.user;
        
            // Store user data in localStorage
            localStorage.setItem("user", JSON.stringify({
                name: user.displayName || name, 
                email: user.email, 
                profilePicture: user.photoURL || "/default-profile.png"
            })); 

            console.log("User stored:", user.displayName, user.email);
            router.push("/movies"); // Navigate to home after login/signup
        } catch (err) {
            setError(err.message);
        }
    };

    const handleGoogleAuth = async () => {
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            // store data in local storage
            localStorage.setItem("user", JSON.stringify({
                name: user.displayName,
                email: user.email,
                profilePicture: user.photoURL
            }));

            console.log("user Stored:", user.displayName, user.email)

            router.push("/movies")
        } catch (err) {
            setError(err.message); // Handle errors
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-black text-white px-4">
        <div className="w-full max-w-[400px] bg-gray-900 p-8 rounded-lg shadow-md">
          <h1 className="text-4xl font-bold text-center mb-6">Netfish</h1>
          <form onSubmit={handleAuth} className="flex flex-col space-y-4">
            {isSignup && (
              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 border border-gray-700 rounded-md bg-gray-800 text-white"
              />
            )}
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-700 rounded-md bg-gray-800 text-white"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-700 rounded-md bg-gray-800 text-white"
            />
            <button type="submit" className="w-full bg-red-600 hover:bg-red-700 p-3 rounded-md font-semibold">
              {isSignup ? "Sign Up" : "Sign In"}
            </button>
            <button
              type="button"
              onClick={handleGoogleAuth}
              className="w-full bg-gray-800 hover:bg-gray-700 p-3 rounded-md flex items-center justify-center font-semibold"
            >
              <FcGoogle size={24} className="mr-2" />
              Sign In with Google
            </button>
            {error && <p className="text-red-500 text-center">{error}</p>}
          </form>
        </div>
      </div>
      
    );
}
