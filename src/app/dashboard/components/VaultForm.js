"use client";
import { useState, useEffect } from "react";
import { encryptData } from "@/utils/encryption";
import "../../globals.css"

export default function VaultForm({ onSave, vaultKey, editingEntry, clearEditing  }) {
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [url, setUrl] = useState("");
    const [notes, setNotes] = useState("");
    const [tags, setTags] = useState("");

    useEffect(() => {
        if (editingEntry) {
            setOpen(true);
            setTitle(editingEntry.title || "");
            setUsername(editingEntry.username || "");
            setPassword(editingEntry.password || "");
            setUrl(editingEntry.url || "");
            setNotes(editingEntry.notes || "");
            setTags(editingEntry.tags || []);
        }
    }, [editingEntry]);

    const reset = () => {
        setTitle(""); setUsername(""); setPassword(""); setUrl(""); setNotes(""); setTags("");
    };

    const handleSave = async (e) => {
        e?.preventDefault();
        if (!vaultKey) return alert("Vault not initialized");

        const normalizedTags = Array.isArray(tags)
            ? tags
            : tags.split(",").map(t => t.trim()).filter(Boolean);

        const entry = {
            title: title.trim(),
            username: username.trim(),
            password,
            url: url.trim() || "",
            notes: notes.trim() || "",
            tags: normalizedTags,
        };

        try {
            const { iv, ciphertext } = await encryptData(vaultKey, entry);

            const body = { encryptedData: { iv, ciphertext } };

            if (editingEntry?.id) {
                body.id = editingEntry.id;
            }

            const res = await fetch("/api/vault/save", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || "Save failed");
            }

            reset();
            setOpen(false);
            onSave();
        } catch (err) {
            console.error("save error:", err);
            alert("Save failed: " + err.message);
        }
    };

    return (
        <div className="mb-6">
            <button
                onClick={() => { setOpen(true); clearEditing?.(); }}
                className="px-3 py-1 button text-theme rounded"
            >
                Add Entry
            </button>

            {open && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
                    <form onSubmit={handleSave} className="bg-card p-6 rounded shadow w-96 space-y-2">
                        <h2 className="text-xl font-semibold text-theme">Add Vault Entry</h2>
                        <input className="w-full border border-card p-2 rounded background text-theme" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} required />
                        <input className="w-full border border-card p-2 rounded background text-theme" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} required />
                        <input className="w-full border border-card p-2 rounded background text-theme" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
                        <input className="w-full border border-card p-2 rounded background text-theme" placeholder="Website URL (optional)" value={url} onChange={e => setUrl(e.target.value)} />
                        <textarea className="w-full border border-card p-2 rounded background text-theme" placeholder="Notes (optional)" value={notes} onChange={e => setNotes(e.target.value)} />
                        <input className="w-full border border-card p-2 rounded background text-theme" placeholder="Tags (comma-separated)" value={tags} onChange={e => setTags(e.target.value)} />

                        <div className="flex justify-end space-x-2 mt-2">
                            <button type="button" onClick={() => { setOpen(false); reset(); }} className="px-3 py-1 red">Cancel</button>
                            <button type="submit" className="px-3 py-1 green">Save</button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}
