"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import VaultList from "./components/VaultList";
import VaultForm from "./components/VaultForm";
import PasswordGenerator from "./components/PasswordGenerator";
import SearchBar from "./components/SearchBar";
import TagFilter from "./components/TagFilter";
import DarkModeToggle from "./components/DarkModeToggle";
import { deriveKeyFromUserId, decryptData } from "@/utils/encryption";
import "../globals.css"

export default function DashboardPage() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [vaultKey, setVaultKey] = useState(null);
    const [vaults, setVaults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [query, setQuery] = useState("");
    const [selectedTag, setSelectedTag] = useState("");
    const [editingEntry, setEditingEntry] = useState(null);


    const verify = async () => {
        const res = await fetch("/api/auth/verify");
        if (!res.ok) {
            router.push("/auth/login");
            return;
        }
        const data = await res.json();
        if (!data.ok) {
            router.push("/auth/login");
            return;
        }
        setUser({ userId: data.userId, email: data.email });
        const key = await deriveKeyFromUserId(data.userId);
        setVaultKey(key);
    };

    const fetchVaults = async () => {
        setLoading(true);
        const res = await fetch("/api/vault/get");
        if (!res.ok) {
            setVaults([]);
            setLoading(false);
            return;
        }
        const data = await res.json();
        setVaults(data.vaults || []);
        setLoading(false);
    };

    useEffect(() => {
        verify();
    }, []);

    useEffect(() => {
        if (vaultKey) fetchVaults();
    }, [vaultKey]);

    const handleLogout = async () => {
        await fetch("/api/auth/logout", { method: "POST" });
        setUser(null);
        setVaultKey(null);
        router.push("/auth/login");
    };

    const [tags, setTags] = useState([]);

    useEffect(() => {
        let mounted = true;
        const extractTags = async () => {
            if (!vaultKey || !Array.isArray(vaults) || vaults.length === 0) {
                if (mounted) setTags([]);
                return;
            }

            const tagSet = new Set();

            await Promise.all(
                vaults.map(async (v) => {
                    try {
                        const enc = v.encryptedData;
                        if (!enc?.iv || !enc?.ciphertext) return;

                        const data = await decryptData(vaultKey, enc.iv, enc.ciphertext);

                        if (data?.tags && Array.isArray(data.tags)) {
                            data.tags.forEach((t) => {
                                if (t && typeof t === "string") tagSet.add(t);
                            });
                        }
                    } catch (e) {
                        console.warn("Failed to decrypt item for tag extraction:", v._id);
                    }
                })
            );

            if (mounted) setTags(Array.from(tagSet));
        };

        extractTags();

        return () => {
            mounted = false;
        };
    }, [vaults, vaultKey]);



    return (
        <div className="p-6 body min-h-screen w-10/12 m-auto">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-3xl font-bold text-theme">Your Vault</h1>
                <div className="flex items-center space-x-2">
                    <DarkModeToggle />
                    <button onClick={handleLogout} className="px-3 py-1 bg-red-600 text-white rounded">Logout</button>
                </div>
            </div>

            {!vaultKey ? (
                <p className="text-gray-700 dark:text-gray-300">Initializing...</p>
            ) : (
                <>
                    <PasswordGenerator />
                    <VaultForm
                        onSave={fetchVaults}
                        vaultKey={vaultKey}
                        editingEntry={editingEntry}
                        clearEditing={() => setEditingEntry(null)}
                    />


                    <SearchBar query={query} setQuery={setQuery} />
                    <TagFilter tags={tags} selectedTag={selectedTag} setSelectedTag={setSelectedTag} />

                    {loading ? (
                        <p className="text-gray-700 dark:text-gray-300 mt-4">Loading...</p>
                    ) : (
                        <VaultList
                            vaults={vaults}
                            refreshVaults={fetchVaults}
                            query={query}
                            selectedTag={selectedTag}
                            vaultKey={vaultKey}
                            onEdit={(id, data) => setEditingEntry({ id, ...data })}
                        />

                    )}
                </>
            )}
        </div>
    );
}
