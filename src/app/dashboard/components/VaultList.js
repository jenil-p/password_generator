"use client";
import { useEffect, useState } from "react";
import { decryptData } from "@/utils/encryption";
import { FaEyeSlash } from "react-icons/fa";
import { FaEye } from "react-icons/fa";
import { IoCopyOutline } from "react-icons/io5";
import { MdDownloadDone } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import "../../../app/globals.css"

export default function VaultList({ vaults = [], refreshVaults, query = "", selectedTag = "", vaultKey, onEdit }) {
    const [revealId, setRevealId] = useState(null);
    const [decrypted, setDecrypted] = useState([]);
    const [copiedId, setCopiedId] = useState(null);

    useEffect(() => {
        let mounted = true;
        const doDecrypt = async () => {
            if (!vaultKey) return setDecrypted([]);
            const arr = await Promise.all(vaults.map(async v => {
                try {
                    const enc = v.encryptedData;
                    const data = await decryptData(vaultKey, enc.iv, enc.ciphertext);
                    return { _id: v._id, data };
                } catch (e) {
                    console.error("decrypt fail for", v._id, e);
                    return { _id: v._id, data: null };
                }
            }));
            if (mounted) setDecrypted(arr);
        };
        doDecrypt();
        return () => { mounted = false; };
    }, [vaults, vaultKey]);

    const filtered = decrypted.filter(item => {
        const d = item.data;
        if (!d) return false;
        const q = query?.trim().toLowerCase() || "";
        const matchesQuery = !q || (d.title?.toLowerCase().includes(q));
        const matchesTag = !selectedTag || (d.tags || []).includes(selectedTag);
        return matchesQuery && matchesTag;
    });

    const handleDelete = async (id) => {
        if (!confirm("Delete this entry?")) return;
        const res = await fetch("/api/vault/delete", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id }),
        });
        if (res.ok) refreshVaults();
        else alert("Delete failed");
    };

    const handleCopy = async (password, id) => {
        try {
            await navigator.clipboard.writeText(password);
            setCopiedId(id);
            setTimeout(() => setCopiedId(null), 10000);
        } catch (e) {
            console.error("Copy failed", e);
        }
    };

    return (
        <div className="space-y-3 mt-4">
            {filtered.map(item => {
                const d = item.data;
                return (
                    <div key={item._id} className="p-4 bg-card text-theme rounded shadow flex justify-between items-center">
                        <div>
                            <p className="font-semibold">{d.title}</p>
                            <p className="text-theme">{d.username}</p>
                            <p className="text-theme">{d.url || "—"}</p>
                            <p className="text-theme">{revealId === item._id ? d.password : "••••••••"}</p>
                            {d.notes && <p className="text-theme">{d.notes}</p>}
                            {d.tags?.length > 0 && <p className="text-theme">Tags: {d.tags.join(", ")}</p>}
                        </div>
                        <div className="flex space-x-1">
                            <button
                                onClick={() => setRevealId(revealId === item._id ? null : item._id)}
                                className="px-2 py-1 text-theme"
                            >
                                {revealId === item._id ? <FaEyeSlash/> : <FaEye/>}
                            </button>

                            <button
                                onClick={() => handleCopy(d.password, item._id)}
                                className="px-2 py-1 green"
                            >
                                {copiedId === item._id ? <MdDownloadDone/> : <IoCopyOutline/>}
                            </button>

                            <button
                                onClick={() => onEdit && onEdit(item._id, d)}
                                className="px-2 py-1 yellow"
                            >
                               <FaRegEdit/>
                            </button>

                            <button
                                onClick={() => handleDelete(item._id)}
                                className="px-2 py-1 red"
                            >
                                <MdDelete/>
                            </button>
                        </div>
                    </div>
                );
            })}
            {filtered.length === 0 && <p className="text-theme">No entries found.</p>}
        </div>
    );
}
