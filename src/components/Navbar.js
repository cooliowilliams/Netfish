"use client";

import { useRouter } from "next/navigation";
import { auth, signOut } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { FaUserCircle, FaSun, FaMoon } from "react-icons/fa";



export default function Navbar({ darkMode, setDarkMode }) {
    const [user] = useAuthState(auth);
    const router = useRouter();

    const handleSignOut = async () => {
        await signOut(auth);
        router.push("/login");
    };

    return (
        <div className={`flex justify-between items-center p-4 ${darkMode ? "bg-gray-900 text-white" : "bg-white text-black"} transition-all`}>
        {/* Logo */}
        <h1 className="text-2xl font-bold cursor-pointer" onClick={() => router.push("/")}>
            Netfish
        </h1>

        {/* User Section */}
        <div className="flex items-center space-x-4">
            {/* Dark Mode Toggle */}
            <button onClick={() => setDarkMode((prev) => !prev)} className="p-2 rounded-md bg-gray-700 hover:bg-gray-600">
                {darkMode ? <FaSun className="text-yellow-400" /> : <FaMoon className="text-gray-300" />}
            </button>

            {user ? (
                <>
                    <p className="hidden sm:block">{user.displayName || user.email}</p>
                    <button 
                        onClick={handleSignOut} 
                        className={`p-2 rounded-md ${darkMode ? "bg-red-600 hover:bg-red-700" : "bg-red-500 hover:bg-red-600"}`}
                    >
                        Sign Out
                    </button>

                    {/* Profile Icon */}
                    <div className="relative cursor-pointer" onClick={() => router.push("/profile")}>
                        <FaUserCircle className={`text-2xl ${darkMode ? "text-white" : "text-gray-700"} transition`} />
                        <div className="absolute top-0 right-0 w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                </>
            ) : (
                <button 
                    onClick={() => router.push("/login")} 
                    className={`ml-4 p-2 rounded-md ${darkMode ? "bg-red-600 hover:bg-red-700" : "bg-red-500 hover:bg-red-600"}`}
                >
                    Sign In
                </button>
            )}
        </div>
    </div>
    );
}
