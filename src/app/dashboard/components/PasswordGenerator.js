"use client";
import { useState } from "react";
import "../../globals.css"

export default function PasswordGenerator() {
    const [length, setLength] = useState(12);
    const [includeNumbers, setIncludeNumbers] = useState(true);
    const [includeSymbols, setIncludeSymbols] = useState(true);
    const [excludeLookAlikes, setExcludeLookAlikes] = useState(false);
    const [password, setPassword] = useState("");
    const [copied, setCopied] = useState(false);

    const generatePassword = () => {
        let chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
        if (includeNumbers) chars += "0123456789";
        if (includeSymbols) chars += "!@#$%^&*()_+[]{}<>?";
        if (excludeLookAlikes) chars = chars.replace(/[O0oIl1]/g, "");

        let pass = "";
        for (let i = 0; i < length; i++) {
            pass += chars[Math.floor(Math.random() * chars.length)];
        }
        setPassword(pass);
    };

    const copyToClipboard = async () => {
        if (!password) return;
        await navigator.clipboard.writeText(password);
        setCopied(true);
        setTimeout(() => setCopied(false), 10000);
    };

    return (
        <div className="mb-6 p-4 bg-card text-theme rounded shadow">
            <h2 className="font-semibold text-theme mb-2">Password Generator</h2>

            <div className="flex items-center space-x-4 mb-2">
                <label className="text-theme">
                    Length: {length}
                </label>
                <input
                    type="range"
                    min={6}
                    max={32}
                    value={length}
                    onChange={(e) => setLength(Number(e.target.value))}
                    className="w-64"
                />
            </div>

            <div className="flex items-center space-x-4 mb-2">
                <label className="text-theme">
                    <input type="checkbox" checked={includeNumbers} onChange={() => setIncludeNumbers(!includeNumbers)} /> Numbers
                </label>
                <label className="text-theme">
                    <input type="checkbox" checked={includeSymbols} onChange={() => setIncludeSymbols(!includeSymbols)} /> Symbols
                </label>
                <label className="text-theme">
                    <input type="checkbox" checked={excludeLookAlikes} onChange={() => setExcludeLookAlikes(!excludeLookAlikes)} /> Exclude Look-Alikes
                </label>
            </div>

            <div className="flex items-center space-x-2 mb-2">
                <button
                    onClick={generatePassword}
                    className="px-3 py-1 border border-black cursor-pointer rounded-sm"
                >
                    Generate
                </button>
                <button
                    onClick={copyToClipboard}
                    className="px-3 py-1 border border-black cursor-pointer rounded-sm"
                >
                    {copied ? "Copied!" : "Copy"}
                </button>
            </div>

            {password && (
                <p className="mt-2 font-mono text-theme break-all">{password}</p>
            )}
        </div>
    );
}
