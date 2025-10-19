"use client";
import { useState, useEffect } from "react";

export default function Signup() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    archetype_id: "",
    tier_id: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [archetypes, setArchetypes] = useState<any[]>([]);
  const [tiers, setTiers] = useState<any[]>([]);
  const [selectedArchetype, setSelectedArchetype] = useState<any>(null);
  const [selectedTier, setSelectedTier] = useState<any>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordMatch, setPasswordMatch] = useState(true);

  // 🔹 Fetch archetypes and tiers
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [aRes, tRes] = await Promise.all([
          fetch("http://127.0.0.1:8000/api/v1/archetypes/"),
          fetch("http://127.0.0.1:8000/api/v1/tiers/"),
        ]);
        const [aData, tData] = await Promise.all([aRes.json(), tRes.json()]);
        setArchetypes(aData);
        setTiers(tData);
      } catch (err) {
        console.error("Error fetching archetypes/tiers:", err);
      }
    };
    fetchData();
  }, []);

  // 🔹 Watch for password match
  useEffect(() => {
    if (form.confirmPassword.length > 0) {
      setPasswordMatch(form.password === form.confirmPassword);
    }
  }, [form.password, form.confirmPassword]);

  // 🔹 Handle input changes
  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });

    if (e.target.name === "archetype_id") {
      const archetype = archetypes.find(
        (a) => a.id === parseInt(e.target.value)
      );
      setSelectedArchetype(archetype || null);
    }

    if (e.target.name === "tier_id") {
      const tier = tiers.find((t) => t.id === parseInt(e.target.value));
      setSelectedTier(tier || null);
    }
  };

  // 🔹 Submit form
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (!passwordMatch) {
      setMessage("❌ Passwords do not match!");
      setLoading(false);
      return;
    }

    try {
      // ✅ Correct backend route
      const res = await fetch("http://127.0.0.1:8000/api/v1/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
          username: form.email.split("@")[0], // default username
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Signup failed");

      setMessage("✅ Account created successfully! You can now log in.");
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
          Join Breate
        </h2>

        {/* Email */}
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          required
          className="w-full border border-[#550000]/40 p-2 rounded focus:ring-1 focus:ring-[#550000]"
        />

        {/* Password */}
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

        {/* Confirm Password */}
        <div className="relative">
          <input
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            placeholder="Confirm Password"
            onChange={handleChange}
            required
            className={`w-full border p-2 rounded focus:ring-1 focus:ring-[#550000] ${
              form.confirmPassword
                ? passwordMatch
                  ? "border-green-500"
                  : "border-red-500"
                : "border-[#550000]/40"
            }`}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#550000]/70 hover:text-[#550000] text-sm"
          >
            {showConfirmPassword ? "Hide" : "Show"}
          </button>
          {form.confirmPassword && (
            <p
              className={`text-sm mt-1 ${
                passwordMatch ? "text-green-600" : "text-red-600"
              }`}
            >
              {passwordMatch
                ? "Passwords match ✅"
                : "Passwords do not match ❌"}
            </p>
          )}
        </div>

        {/* Archetype */}
        <div>
          <label className="block mb-1 font-semibold">Select Archetype</label>
          <select
            name="archetype_id"
            onChange={handleChange}
            required
            className="w-full border border-[#550000]/40 p-2 rounded focus:ring-1 focus:ring-[#550000]"
          >
            <option value="">-- Choose Archetype --</option>
            {archetypes.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
          {selectedArchetype && (
            <p className="text-sm text-[#550000]/70 mt-1 italic">
              {selectedArchetype.description}
            </p>
          )}
        </div>

        {/* Tier */}
        <div>
          <label className="block mb-1 font-semibold">Select Tier</label>
          <select
            name="tier_id"
            onChange={handleChange}
            required
            className="w-full border border-[#550000]/40 p-2 rounded focus:ring-1 focus:ring-[#550000]"
          >
            <option value="">-- Choose Tier --</option>
            {tiers.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
          {selectedTier && (
            <p className="text-sm text-[#550000]/70 mt-1 italic">
              {selectedTier.description}
            </p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#550000] text-white p-2 rounded hover:bg-[#770000] transition-all"
        >
          {loading ? "Creating..." : "Sign Up"}
        </button>

        {message && (
          <p className="text-center mt-2 font-medium text-[#550000]/80">
            {message}
          </p>
        )}

        <p className="text-center text-sm mt-3">
          Already have an account?{" "}
          <a
            href="/login"
            className="font-semibold text-[#550000] hover:underline"
          >
            Log in
          </a>
        </p>
      </form>
    </div>
  );
}
