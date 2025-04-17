import { useEffect, useState } from "react";
import { createPlaylist, getPlaylist, getPlaylists } from "@/userStorage";

import Image from "next/image";


interface Movie {
  id: string; // Update to match the type returned by getPlaylist
  title?: string;
  name?: string;
  poster_path?: string;
}

export default function PlaylistPage() {
  const [playlists, setPlaylists] = useState<string[]>([]);
  const [newPlaylist, setNewPlaylist] = useState("");
  const [selectedPlaylist, setSelectedPlaylist] = useState<string | null>(null);
  const [movies, setMovies] = useState<Movie[]>([]); // Update type from any[] to Movie[]

  useEffect(() => {
    const playlists = getPlaylists();
    console.log("Playlists:", playlists);
    if (playlists && typeof playlists === "object") {
      setPlaylists(Object.keys(playlists));
    } else {
      console.error("Error: getPlaylists() did not return a valid object.");
    }
  }, []);

  const handleCreatePlaylist = () => {
    createPlaylist(newPlaylist);
    setPlaylists(Object.keys(getPlaylists()));
    setNewPlaylist("");
  };

  useEffect(() => {
    if (selectedPlaylist) {
      const playlistMovies = getPlaylist(selectedPlaylist);
      console.log("Movies for", selectedPlaylist, ":", playlistMovies); // Debug log
      setMovies(playlistMovies || []); // Fallback to empty array if null/undefined
    }
  }, [selectedPlaylist]);

  return (
    <div className="p-6 max-w-lg mx-auto bg-gray-900 text-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Manage Playlists</h1>

      {/* Create Playlist */}
      <div className="mb-4">
        <input
          type="text"
          className="w-full p-2 border rounded bg-gray-800 text-white"
          placeholder="New playlist name"
          value={newPlaylist}
          onChange={(e) => setNewPlaylist(e.target.value)}
        />
        <button onClick={handleCreatePlaylist} className="mt-2 w-full bg-blue-500 p-2 rounded">
          Create Playlist
        </button>
      </div>

      {/* Select and View Playlist */}
      <div>
        <h2 className="text-xl font-bold">Your Playlists</h2>
        <select
          className="w-full p-2 rounded bg-gray-800 text-white mt-2"
          onChange={(e) => setSelectedPlaylist(e.target.value)}
        >
          <option value="">Select a Playlist</option>
          {playlists.map((name) => (
            <option key={name} value={name}>{name}</option>
          ))}
        </select>

        {/* Display Movies in Playlist */}
        <div className="mt-4">
          <h3 className="text-lg font-bold">{selectedPlaylist || "No Playlist Selected"}</h3>
          {movies.length > 0 ? (
            <ul className="space-y-4">
              {movies.map((movie) => (
                <li key={movie.id} className="p-2 border-b flex items-center space-x-4">
                  {/* Poster Image */}
                  {movie.poster_path ? (
                    <Image
                      src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`} // Smaller size for list view
                      alt={movie.title || movie.name || movie.poster_path}
                      className="w-20 h-30 object-cover rounded-lg"
                      onError={() => console.log("Failed to load image:", movie.poster_path)} // Debug image errors
                    />
                  ) : (
                    <div className="w-20 h-30 bg-gray-700 flex items-center justify-center text-gray-400 rounded-lg">
                      No Image
                    </div>
                  )}
                  {/* Movie Info */}
                  <div>
                    <p className="font-semibold">{movie.title || movie.name || "Untitled"}</p>
                    <p className="text-sm text-gray-400">ID: {movie.id}</p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400">No movies in this playlist.</p>
          )}
        </div>
      </div>
    </div>
  );
}
