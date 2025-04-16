"use client";

import { useState, useEffect } from "react";
import { getPlaylists, savePlaylists } from "@/userStorage";

interface User {
  name: string;
  email: string;
  profilePicture: string;
}

interface Movie {
  id: string; 
  title?: string;
  name?: string;
  type?: string; 
  poster_path?: string;
}

const ProfilePage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [playlists, setPlaylists] = useState<Record<string, Movie[]>>({});
  const [expandedPlaylists, setExpandedPlaylists] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));

    const storedPlaylists = getPlaylists();
    console.log("Loaded Playlists in Profile:", storedPlaylists);
    setPlaylists(storedPlaylists);
    setLoading(false);
  }, []);

  const togglePlaylist = (playlistName: string) => {
    setExpandedPlaylists(prev => ({
      ...prev,
      [playlistName]: !prev[playlistName]
    }));
  };

  const deletePlaylist = (playlistName: string) => {
    const updated = { ...playlists };
    delete updated[playlistName];
    setPlaylists(updated);
    savePlaylists(updated);
  };

  const removeMovieFromPlaylist = (playlistName: string, movieId: string) => { // Updated to string
    const updatedMovies = playlists[playlistName].filter(movie => movie.id !== movieId);
    const updated = { ...playlists, [playlistName]: updatedMovies };
    setPlaylists(updated);
    savePlaylists(updated);
  };

  if (loading) {
    return <p className="text-center text-white">Loading...</p>;
  }

  return (
    <div className="min-h-screen bg-black text-white p-6 flex flex-col items-center">
      {/* Profile Section */}
      <div className="bg-gray-800 p-4 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-4 flex items-center">
          {user?.name ?? "User"}&apos;s Profile
          <img
            src={user?.profilePicture ?? "/default-profile.png"}
            alt="Profile"
            className="w-10 h-10 rounded-full ml-3"
          />
        </h2>
        <p className="text-lg">
          Username: <span className="font-semibold">{user?.name ?? "N/A"}</span>
        </p>
        <p className="text-lg">
          Email: <span className="font-semibold">{user?.email ?? "N/A"}</span>
        </p>
      </div>

      {/* Playlists Section */}
      <div className="bg-gray-800 p-4 rounded-lg shadow-md w-full max-w-md mt-6">
        <h2 className="text-2xl font-semibold mb-4">Playlists</h2>
        {Object.keys(playlists).length === 0 ? (
          <p className="text-gray-400">No Playlists Created Yet</p>
        ) : (
          Object.entries(playlists).map(([playlistName, movies]) => (
            <div key={playlistName} className="mb-4">
              <div className="flex justify-between items-center">
                <button
                  onClick={() => togglePlaylist(playlistName)}
                  className="w-full bg-gray-700 text-left px-4 py-2 rounded-lg shadow-md flex justify-between items-center"
                >
                  <span className="font-semibold">{playlistName}</span>
                  <span>{expandedPlaylists[playlistName] ? "▼" : "▶"}</span>
                </button>
                <button
                  onClick={() => deletePlaylist(playlistName)}
                  className="ml-2 text-sm text-red-400 hover:text-red-600"
                >
                  Delete
                </button>
              </div>

              {expandedPlaylists[playlistName] && (
                <div className="bg-gray-800 p-4 mt-2 rounded-lg shadow-md">
                  <div className="grid grid-cols-2 gap-4">
                    {movies.length > 0 ? (
                      movies.map(movie => (
                        <div key={movie.id} className="bg-gray-700 p-3 rounded-lg text-center relative">
                          {movie.poster_path ? (
                            <img
                              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                              alt={movie.title ?? movie.name ?? "Movie Poster"}
                              className="w-32 h-48 object-cover rounded-lg mb-2 mx-auto"
                              onError={() => console.log("Image failed to load:", `https://image.tmdb.org/t/p/w500${movie.poster_path}`)}
                            />
                          ) : (
                            <div className="w-32 h-48 bg-gray-600 flex items-center justify-center text-gray-300 text-sm rounded-lg mb-2 mx-auto">
                              No Image
                            </div>
                          )}
                          <p className="text-sm">{movie.title ?? movie.name ?? "Untitled"}</p>
                          <button
                            onClick={() => removeMovieFromPlaylist(playlistName, movie.id)}
                            className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center"
                          >
                            ×
                          </button>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-400">No movies added yet</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProfilePage;


