"use client";

import React, { useEffect, useState } from "react";
import { getTrending, getMovieTrailer } from "../../tmdbApi";
import SearchBar from "@/components/SearchBar";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Image from "next/image";


export default function MoviesPage() {
    const [movies, setMovies] = useState<{ id: number; title?: string; name?: string; poster_path: string; overview: string; }[]>([]);
    const [loadingMovies, setLoadingMovies] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [trailer, setTrailer] = useState<string | null>(null);
    const [darkMode, setDarkMode] = useState(false);
    const [tvShows, setTvShows] = useState<{ id: number; title?: string; name?: string; poster_path: string; overview: string; }[]>([]);
    const [loadingTvShows, setLoadingTvShows] = useState(true);
    const [ showMovies, setShowMovies ] = useState(true);

    // Fetch Trending Movies
    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const trendingMovies = await getTrending();
                setMovies(trendingMovies);
            } catch (error) {
                setError("Failed to fetch movies");
                console.error("Error fetching movies:", error);
            } finally {
                setLoadingMovies(false);
            }
        };
        fetchMovies();
    }, []);

    // Fetch Trending TV Shows
    useEffect(() => {
        const fetchTvShows = async () => {
            try {
                const trendingTvShows = await getTrending();
                setTvShows(trendingTvShows);
            } catch (error) {
                setError("Failed to fetch TV Shows");
                console.error("Error fetching TV Shows:", error);
            } finally {
                setLoadingTvShows(false);
            }
        };
        fetchTvShows();
    }, []);

    // Fetch and Show Trailer
    const handleShowTrailer = async (id: number) => {
        console.log("Fetching trailer for movie ID:", id);
        try {
            const trailerUrl = await getMovieTrailer(id);
            console.log("Fetched Trailer URL:", trailerUrl);
            if (trailerUrl) {
                setTrailer(trailerUrl);
            } else {
                console.error("No trailer found.");
                alert("No trailer available for this movie.");
            }
        } catch (error) {
            console.error("Failed to fetch trailer:", error);
        }
    };
    // Retrieve darkmode preference from local storage
    useEffect(() => {
        const storedDarkMode = localStorage.getItem("darkMode");
        if (storedDarkMode) {
            setDarkMode(storedDarkMode === "true");
        }
    }, []);

    // Save darkmode preference to local storage
    useEffect(() => {
        localStorage.setItem("darkMode", darkMode.toString());
    }, [darkMode]);
    

    const router = useRouter();
    const handleMovieClick = (id: number, type: string) => {
        router.push(`/movies/${id}?type=${type}`);
    }

    return (
        <div className={`${darkMode ? "bg-black text-white" : "bg-white text-black"} min-h-screen p-6`}>
            <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
            
            {/* Dark Mode Toggle Button */}
            {/* <button 
                className="absolute top-4 right-4 px-4 py-2 rounded-md bg-gray-700 hover:bg-gray-600 text-white"
                onClick={() => setDarkMode(!darkMode)}
            >
                {darkMode ? "Light Mode" : "Dark Mode"}
            </button> */}

            {/* Toggle Between Movies & TV Shows */}
            <div className="text-center mb-6 mt-6">
    <button 
        className={`px-4 py-2 mx-2 rounded-lg ${showMovies ? "bg-green-500 text-white" : "bg-blue-600"}`}
        onClick={() => setShowMovies(!showMovies)}  // Toggle between Movies and TV Shows
    >
        {showMovies ? "Movies" : "TV Shows"}
    </button>
</div>


            {/* Search Bar */}
            <SearchBar onResults={setMovies} />

            {/* Title */}
            <h1 className="text-4xl font-bold mb-8 text-center">
                {showMovies ? "Trending Movies" : "Trending TV Shows"}
            </h1>

            {/* Error and Loading Handling */}
            {(showMovies ? loadingMovies : loadingTvShows) && <p className="text-center">Loading...</p>}
            {error && <p className="text-red-500 text-center">{error}</p>}
            {!loadingMovies && showMovies && movies.length === 0 && !error && <p className="text-center">No movies found.</p>}
            {!loadingTvShows && !showMovies && tvShows.length === 0 && !error && <p className="text-center">No TV Shows found.</p>}

            {/* Movies or TV Shows Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {(showMovies ? movies : tvShows).map((item) => (
                    <div 
                        key={item.id} 
                        className="relative group bg-gray-800 p-4 rounded-lg shadow-lg text-center transition-transform duration-300 hover:scale-105" 
                    >
                        <Image 
                            src={`https://image.tmdb.org/t/p/w500${item.poster_path}`} 
                            alt={item.title || item.name || "No title available"} 
                            className="w-full h-60 object-cover rounded-lg mb-4 cursor-pointer"
                            onClick={() => handleMovieClick(item.id, showMovies ? "movie" : "tv")}
                            width={300}
                            height={300}
                        />
                        <h2 className="text-lg font-bold text-white">
                            {item.title || item.name}
                        </h2>
                        <p className="text-sm text-gray-400 mt-2">
    {item.overview ? item.overview.slice(0, 80) + "..." : "No overview available."}
</p>

                        {/* Trailer Button (only for movies) */}
                        {showMovies && (
                           <button 
                           className="mt-3 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                           onClick={(e) => { 
                            e.stopPropagation(); 
                            console.log("Clicked on movie ID:", item.id);  // Prevents navigation
                            handleShowTrailer(item.id);
                        }}>
                            Watch Trailer
                        </button>
                        
                        )}
                    </div>
                ))}
            </div>

            {/* Trailer Popup */}
            {trailer && (
                <div 
                    className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-80 z-50 flex items-center justify-center"
                    onClick={() => setTrailer(null)}
                >
                    <div className="relative w-3/4 h-3/4" onClick={(e) => e.stopPropagation()}>
                    <iframe 
                        src={trailer} 
                        className="w-3/4 h-3/4 rounded-lg" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowFullScreen
                    />
                    <button 
                        className="absolute top-4 right-4 text-white bg-red-500 px-4 py-2 rounded-lg" 
                        onClick={() => setTrailer(null)}
                    >
                        Close
                    </button>
                    </div>
                </div>
            )}
            
        </div>
    );
}
