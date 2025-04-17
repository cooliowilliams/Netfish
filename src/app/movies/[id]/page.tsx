"use client";

import React, { useEffect, useState, use } from "react";
import { useSearchParams } from "next/navigation";
import { getTvShowDetails, getMovieDetails } from "@/tmdbApi";
import {
  saveToWatchLater,
  getPlaylists,
  addToPlaylist,
  createPlaylist as createNewPlaylist,
} from "@/userStorage";
import { useDarkMode } from "@/context/DarkModeContext";
import Navbar from "@/components/Navbar";
import Image from "next/image";

interface MovieDetails {
  id: string;
  title?: string;
  name?: string;
  type?: string;
  overview?: string;
  poster_path?: string;
}

export default function MovieDetails({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params); // ✅ unwrap the promise using React.use()
  const { darkmode, setDarkMode } = useDarkMode();
  const searchParams = useSearchParams();
  const type = searchParams.get("type");

  const [details, setDetails] = useState<MovieDetails | null>(null);
  const [playlists, setPlaylists] = useState<string[]>([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState("");
  const [newPlaylistName, setNewPlaylistName] = useState("");

  // Fetch movie or TV details
  useEffect(() => {
    if (id && type) {
      const fetchDetails = async () => {
        try {
          const fetchedDetails =
            type === "movie"
              ? await getMovieDetails(id)
              : await getTvShowDetails(id);
          setDetails(fetchedDetails);
        } catch (error) {
          console.error("Error fetching details:", error);
        }
      };
      fetchDetails();
    }
  }, [id, type]);

  // Load user playlists
  useEffect(() => {
    setPlaylists(Object.keys(getPlaylists()));
  }, []);

  const handleAddToPlaylist = () => {
    if (!selectedPlaylist || !details) return;

    const movie: MovieDetails = {
      id: id!,
      type: type || undefined,
      title: details.title,
      name: details.name,
      poster_path: details.poster_path,
    };

    addToPlaylist(selectedPlaylist, movie);
    setPlaylists(Object.keys(getPlaylists()));
  };

  const handleCreatePlaylist = () => {
    if (!newPlaylistName.trim()) return;

    createNewPlaylist(newPlaylistName);
    setPlaylists(Object.keys(getPlaylists()));
    setNewPlaylistName("");
  };

  if (!details) return <p className="text-white">Loading...</p>;

  return (
    <div className={`${darkmode ? "bg-black text-white" : "bg-white text-black"} min-h-screen p-6`}>
      <Navbar darkMode={darkmode} setDarkMode={setDarkMode} />

      <h1 className="text-3xl font-bold mb-4 text-center tracking-wide">
        {details.title || details.name}
      </h1>

      <div className="flex justify-center">
        <Image
          src={`https://image.tmdb.org/t/p/w400${details.poster_path}`}
          alt={details.title || details.name || "No title available"}
          className="rounded-lg shadow-md w-full max-w-xs"
          width={200}
          height={300}
        />
      </div>

      <p className="mt-4 text-center">{details.overview}</p>

      <div className="mt-6 space-y-3 max-w-sm mx-auto">
        <button
          onClick={() =>
            saveToWatchLater(id!, type!, details.title || details.name || "")
          }
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg shadow-md transition-transform transform hover:scale-105"
        >
          📌 Save to Watch Later
        </button>

        {/* Playlist Selector */}
        <div className="mt-4">
          <select
            className="w-full bg-gray-800 bg-opacity-70 text-white py-3 px-4 rounded-lg outline-none shadow-md backdrop-blur-md"
            onChange={(e) => setSelectedPlaylist(e.target.value)}
            value={selectedPlaylist}
          >
            <option value="">🎵 Select a Playlist</option>
            {playlists.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>

          <button
            onClick={handleAddToPlaylist}
            className="w-full mt-2 bg-gradient-to-r from-green-500 to-teal-600 text-white py-3 rounded-lg shadow-md transition-transform transform hover:scale-105"
          >
            ➕ Add to Playlist
          </button>
        </div>

        {/* Create New Playlist */}
        <div className="mt-6 space-y-2">
          <input
            type="text"
            placeholder="📝 New Playlist Name"
            className="w-full bg-gray-800 bg-opacity-70 text-white py-3 px-4 rounded-lg outline-none shadow-md backdrop-blur-md"
            value={newPlaylistName}
            onChange={(e) => setNewPlaylistName(e.target.value)}
          />
          <button
            onClick={handleCreatePlaylist}
            className="w-full bg-gradient-to-r from-yellow-500 to-orange-600 text-white py-3 rounded-lg shadow-md transition-transform transform hover:scale-105"
          >
            🎶 Create Playlist
          </button>
        </div>
      </div>
    </div>
  );
}



// Note: This code is a React component that fetches and displays movie or TV show details based on the provided ID and type.
// Note: The above code assumes that the functions getMovieDetails, getTvShowDetails, saveToWatchLater, getPlaylists, addToPlaylist, and createNewPlaylist are defined in the respective imported modules.