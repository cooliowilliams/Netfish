import axios from "axios";

const apiKey = "eee697bfe61f340d66449ab1d5a318cd";
const BASE_URL = "https://api.themoviedb.org/3";

export const getTrending = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/trending/all/day?api_key=${apiKey}`);
        return response.data.results.map((movie) => ({
            id: movie.id,
            title: movie.title || movie.name,
            poster_path: movie.poster_path,
            overview: movie.overview,
        }));
    } catch (err) {
        console.error(err);
            return [];
    }
};
export const getMovieTrailer = async (id, mediaType = "movie") => {
    const url = `${BASE_URL}/${mediaType}/${id}/videos?api_key=${apiKey}`;
    console.log("Fetching trailer from:", url); // Log request URL for debugging

    try {
        const response = await axios.get(url);
        console.log("API Response:", response.data);
        const trailers = response.data?.results ?? [];
        console.log("Trailers Array:", trailers);

        // Find the first available YouTube trailer
        const trailer = trailers.find((vid) => vid.site === "YouTube" && vid.type === "Trailer");
        console.log("Selected Trailer:", trailer);

        return trailer ? `https://www.youtube.com/embed/${trailer.key}?autoplay=1` : null;
    } catch (error) {
        console.error("Failed to fetch trailer:", error);
        return null;
    }
};
 export const searchMovies = async (query) => {
    try {
        const response = await axios.get(`${BASE_URL}/search/movie?api_key=${apiKey}&query=${query}`);
        return response.data.results.map((movie) => ({
            id: movie.id,
            title: movie.title,
            poster_path: movie.poster_path,
            overview: movie.overview,
        }));
    } catch (err) {
        console.error(err);
        return [];
    }
};

export const getTrendingMovies = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/trending/movie/day?api_key=${apiKey}`);
        return response.data.results.map((movie) => ({
            id: movie.id,
            title: movie.title,
            poster_path: movie.poster_path,
            overview: movie.overview,
        }));
    } catch (err) {
        console.error(err);
        return [];
    }
};

export const getTrendingTvShows = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/trending/tv/day?api_key=${apiKey}`);
        return response.data.results.map((show) => ({
            id: show.id,
            title: show.name,
            poster_path: show.poster_path,
            overview: show.overview,
        }));
    } catch (err) {
        console.error(err);
        return [];
    }
};
// Get movie details by ID
export const getMovieDetails = async (id) => {
    const movieId = typeof id === "string" ? parseInt(id, 10) : id
    if (!movieId || isNaN(movieId)) {
        console.error("Invalid movie ID:", id);
        return {};
    }
    try {
        const response = await axios.get(`${BASE_URL}/movie/${id}?api_key=${apiKey}`);
        return response.data;
    } catch (err) {
        console.error("Failed to fetch movie details:", err);
        return {};
    }
};

// Get TV show details by ID
export const getTvShowDetails = async (id) => {
    if (!id || typeof id !== "number") {
        console.error("Invalid TV show ID:", id);
        return null;
    }
    try {
        const response = await axios.get(`${BASE_URL}/tv/${id}?api_key=${apiKey}`);
        return response.data;
    } catch (err) {
        console.error("Failed to fetch TV show details:", err);
        return null;
    }
};