"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();

  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // 🔹 Handle input change
  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔹 Handle form submission
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      // ✅ Send login credentials
      const res = await fetch("http://127.0.0.1:8000/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.detail || "Login failed");

      // ✅ Save token & user info
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("user", JSON.stringify(data.user)); // 👈 new line

      setMessage("✅ Login successful! Redirecting...");
      setTimeout(() => router.push("/"), 1500);
    } catch (err: any) {
      setMessage(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFF8E1] text-[#550000]">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md space-y-4 border border-[#550000]/20"
      >
        <h2 className="text-3xl font-bold text-center mb-4 text-[#550000]">
          Welcome Back to Breate
        </h2>

        {/* Email Input */}
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          required
          className="w-full border border-[#550000]/40 p-2 rounded focus:ring-1 focus:ring-[#550000]"
        />

        {/* Password Input with Toggle */}
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
            className="w-full border border-[#550000]/40 p-2 rounded focus:ring-1 focus:ring-[#550000]"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#550000]/70 hover:text-[#550000] text-sm"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#550000] text-white p-2 rounded hover:bg-[#770000] transition-all"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {message && (
          <p className="text-center mt-2 font-medium text-[#550000]/80">
            {message}
          </p>
        )}

        <p className="text-center text-sm mt-3">
          Don’t have an account?{" "}
          <a
            href="/signup"
            className="font-semibold text-[#550000] hover:underline"
          >
            Sign up
          </a>
        </p>
      </form>
    </div>
  );
}

