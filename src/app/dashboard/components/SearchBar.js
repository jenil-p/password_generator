"use client";
export default function SearchBar({ query, setQuery }) {
    return (
        <input
            type="text"
            placeholder="Search vault..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full mb-4 p-2 border border-card rounded background text-theme"
        />
    );
}
