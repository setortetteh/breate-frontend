"use client";
import Link from "next/link";

export default function Home() {
  return (
    <div className="text-center">
      <h1 className="text-6xl font-bold text-[#550000]">Welcome to Breate</h1>
      <p className="mt-4 text-2xl text-[#550000]/90">
        Reshaping the Creative Industry
      </p>

      {/* Buttons */}
      <div className="mt-10 flex justify-center space-x-6">
        <Link
          href="/login"
          className="px-6 py-3 rounded-md text-lg font-semibold bg-[#550000] text-[#FFD700] hover:bg-[#7A0000] transition"
        >
          Log In
        </Link>
        <Link
          href="/signup"
          className="px-6 py-3 rounded-md text-lg font-semibold border-2 border-[#550000] text-[#550000] hover:bg-[#550000] hover:text-[#FFD700] transition"
        >
          Sign Up
        </Link>
      </div>
    </div>
  );
}














