"use client";
import { useRouter } from "next/navigation";
import { RiLockPasswordFill } from "react-icons/ri";
import { RiLockPasswordLine } from "react-icons/ri";
import "./globals.css"

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center background text-theme p-6">
      <div className="mb-8">
        <RiLockPasswordFill className="w-[120px] h-auto"/>
      </div>

      <h1 className="text-4xl font-bold mb-6 text-theme text-center">
        Welcome to Your passOP
      </h1>

      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => router.push("/auth/login")}
          className="px-6 py-3 bg-button bg-black rounded text-white cursor-pointer"
        >
          Login
        </button>

        <button
          onClick={() => router.push("/auth/signup")}
          className="px-6 py-3 bg-button bg-black rounded text-white cursor-pointer"
        >
          Signup
        </button>
      </div>

      <p className="mt-8 text-sm text-theme text-center">
        Your passwords are fully encrypted and secure at passOP...
      </p>
    </div>
  );
}
