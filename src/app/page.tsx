"use client";

import { DarkModeProvider, useDarkMode } from "../context/DarkModeContext"; // Make sure to import the provider and hook
import NavBar from "../components/Navbar.js";
import SearchBar from "../components/SearchBar.js";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    // Wrap the entire app with the DarkModeProvider
    <DarkModeProvider>
      <MainContent />
    </DarkModeProvider>
  );
}

function MainContent() {
  // Use darkMode from context instead of state here
  const { darkmode, setDarkMode } = useDarkMode();

  return (
    <div className={`flex flex-col items-center justify-center h-screen ${darkmode ? "bg-black text-white" : "bg-white text-black"}`}>
      <NavBar darkMode={darkmode} setDarkMode={setDarkMode} />
      <SearchBar />
      <Image src="/netflix.png" alt="Netflix Logo" width={200} height={100} />
      <h1 className="text-4xl font-bold">Welcome to Netflix</h1>
      <p className="mt-4 text-lg">Sign in to start watching your favorite shows.</p>

      <Link href="/movies">
        <button className="mt-6 px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition duration-300">
          Go to Movies
        </button>
      </Link>
    </div>
  );
}
