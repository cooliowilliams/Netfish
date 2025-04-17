import React from "react";
import { useRouter } from "next/router";
import Image from "next/image";


const MovieCard = ({ movie }) => {
    const router = useRouter();

    const handleClick = () => {
        router.push(`/movies/${movie.id}`);
    };
    return (
        <div className="cursor-pointer p-4 bg-gray-800 rounded-lg shadow-md hover:scale-105 transition-transform" onClick={handleClick}>
            <Image
                className="w-full h-[400px] object-cover rounded-lg"
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
            />
            <h1 className="text-xl font-bold mt-4">{movie.title}</h1>
            <p className="text-gray-400">{movie.release_date}</p>
        </div>
    );
}

export default MovieCard;