"use client";

export default function TagFilter({ tags, selectedTag, setSelectedTag }) {
    if (!tags || tags.length === 0) return null;

    return (
        <div className="mb-4 flex justify-end">
            <select
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
                className="p-2 border border-card rounded background text-theme"
            >
                <option value="">All Tags</option>
                {tags.map((tag) => (
                    <option key={tag} value={tag}>
                        {tag}
                    </option>
                ))}
            </select>
        </div>
    );
}
