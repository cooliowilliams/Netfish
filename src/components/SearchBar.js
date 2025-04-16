"use client"; // Required for client-side hooks

import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import { searchMovies } from "@/tmdbApi";


export default function SearchBar(onResults) {
    const [query, setQuery] = useState("");
    const router = useRouter();

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!query.trim()) return;

        const results = await searchMovies(query);
        if (typeof onResults === "function") {
            onResults(results);
        } else {
            console.log("onResults is not a function:", onResults);
        };
        const encodedResult = encodeURIComponent(JSON.stringify(results));
        
        router.push(`/search?results=${encodedResult}&query=${encodeURIComponent(query)}`);
    };

    return (
        <form onSubmit={handleSearch} className="flex items-center space-x-4 w-full max-w-md mx-auto mt-8">
            <input
                type="text"
                placeholder="Search for movies"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full p-3 border border-gray-700 rounded-md bg-gray-800 text-white"
            />
            <button type="submit" className="bg-red-600 hover:bg-red-700 p-2 rounded-md">
                Search
            </button>
        </form>
    );
}