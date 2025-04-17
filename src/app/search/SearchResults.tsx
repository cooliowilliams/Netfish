"use client";

import { useSearchParams } from "next/navigation";
import Image from "next/image";

type Movie = {
  id: number;
  title?: string;
  name?: string;
  poster_path?: string;
  overview: string;
};

export default function SearchResults() {
  const searchParams = useSearchParams();

  const query = searchParams.get("query") || "";
  const results = searchParams.get("results");
  let parsedResults: Movie[] = [];

  try {
    parsedResults = results ? JSON.parse(decodeURIComponent(results)) : [];
  } catch (error) {
    console.error("Error parsing search results:", error);
  }

  return (
    <>
      <h1 className="text-2xl font-bold mb-4 border-b border-gray-300 dark:border-gray-600 pb-2">
        {`Search Results for "${query}"`}
      </h1>

      {parsedResults.length > 0 ? (
        <ul className="space-y-4">
          {parsedResults.map((movie: Movie) => (
            <li key={movie.id} className="border p-4 rounded-md">
              <h2 className="text-lg font-semibold">{movie.title || movie.name}</h2>
              <p>{movie.overview}</p>
              {movie.poster_path && (
                <Image
                  src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                  alt={movie.title || movie.name || "Movie poster"}
                  className="mt-2 rounded-md"
                  width={120}
                  height={180}
                />
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No results found.</p>
      )}
    </>
  );
}
