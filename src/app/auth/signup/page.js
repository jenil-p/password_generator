"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignupPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        const res = await fetch("/api/auth/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        if (res.ok) router.push("/dashboard");
        else setError(data.error);
    };

    return (
        <div className="min-h-screen flex items-center justify-center background text-theme p-6">
            <form
                onSubmit={handleSubmit}
                className="bg-card p-6 rounded-xl shadow-md w-80 space-y-4"
            >
                <h2 className="text-2xl font-semibold text-center text-theme">
                    Sign Up
                </h2>

                <input
                    type="email"
                    className="w-full border border-card p-2 rounded text-theme background"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    className="w-full border border-card p-2 rounded text-theme background"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button
                    type="submit"
                    className="w-full button p-2 rounded hover-bg-theme transition"
                >
                    Create Account
                </button>

                {error && <p className="text-red text-sm">{error}</p>}

                <p className="text-sm text-theme text-center">
                    Already have an account?{" "}
                    <Link href="/auth/login" className="text-theme font-light hover:underline">
                        Login
                    </Link>
                </p>
            </form>
        </div>
    );
}
