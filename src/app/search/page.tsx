import React, { Suspense } from "react";
import SearchResults from "./SearchResults"; // Client component

export default function SearchPage() {
  return (
    <div className="p-6 min-h-screen bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-white">
      <Suspense fallback={<div>Loading...</div>}>
        <SearchResults />
      </Suspense>
    </div>
  );
}
