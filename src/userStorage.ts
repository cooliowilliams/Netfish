// userStorage.ts

interface Movie {
    id: string;
    title?: string;
    name?: string;
    type?: string;
    poster_path?: string;
  }
  
  // Save to Watch Later
  export function saveToWatchLater(id: string, type: string, title: string) {
    const watchLater: any[] = JSON.parse(localStorage.getItem("watchLater") || "[]");
    if (!watchLater.some(item => item.id === id)) {
      watchLater.push({ id, type, title });
      localStorage.setItem("watchLater", JSON.stringify(watchLater));
    }
  }
  
  // Get user's Watch Later list
  export function getWatchLater(): any[] {
    return JSON.parse(localStorage.getItem("watchLater") || "[]");
  }
  
  // Create a Playlist
  export function createPlaylist(name: string) {
    const playlists: Record<string, Movie[]> = JSON.parse(localStorage.getItem("playlists") || "{}");
    if (!playlists[name]) {
      playlists[name] = [];
      localStorage.setItem("playlists", JSON.stringify(playlists));
    }
  }
  
  // Get all Playlist Names
  export function getPlaylists(): Record<string, Movie[]> {
    if (typeof window === "undefined") {
      return {};
    }
    return JSON.parse(localStorage.getItem("playlists") || "{}");
  }
  
  // Add Movie/TV Show to a Playlist
  export function addToPlaylist(name: string, movie: Movie) {
    const playlists: Record<string, Movie[]> = JSON.parse(localStorage.getItem("playlists") || "{}");
    if (!playlists[name]) {
      playlists[name] = [];
    }
    if (!playlists[name].some(item => item.id === movie.id)) {
      playlists[name].push(movie); // Save the full movie object
      localStorage.setItem("playlists", JSON.stringify(playlists));
    } else {
      console.warn(`"${movie.title || movie.name}" is already in playlist "${name}".`);
    }
  }
  
  // Get Movies/TV Shows in a Specific Playlist
  export function getPlaylist(name: string): Movie[] {
    const playlists: Record<string, Movie[]> = JSON.parse(localStorage.getItem("playlists") || "{}");
    return playlists[name] || [];
  }
  
  export const savePlaylists = (playlists: Record<string, Movie[]>) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("playlists", JSON.stringify(playlists));
    }
    return playlists;
  }
