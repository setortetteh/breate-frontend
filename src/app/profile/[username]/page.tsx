"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

export default function EditProfilePage() {
  const { username } = useParams();
  const router = useRouter();

  const [form, setForm] = useState({
    full_name: "",
    username: "",
    bio: "",
    preferred_themes: "",
    portfolio_links: "",
    next_build: "",
    affiliations: "",
  });
  const [status, setStatus] = useState("");

  // Load current user data
  useEffect(() => {
    const token = localStorage.getItem("breate_token");
    if (!token) {
      alert("You must log in to edit your profile.");
      router.push("/login");
      return;
    }

    fetch(`http://127.0.0.1:8000/api/v1/profile/${username}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.detail) setStatus("Unable to load profile");
        else setForm({
          full_name: data.full_name || "",
          username: data.username || username,
          bio: data.bio || "",
          preferred_themes: data.preferred_themes || "",
          portfolio_links: data.portfolio_links || "",
          next_build: data.next_build || "",
          affiliations: data.affiliations || "",
        });
      })
      .catch(() => setStatus("Failed to load profile"));
  }, [username, router]);

  // Save profile updates
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("Saving...");
    const token = localStorage.getItem("breate_token");

    const res = await fetch(`http://127.0.0.1:8000/api/v1/profile/${username}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      setStatus("✅ Profile updated!");
      setTimeout(() => router.push(`/profile/${username}`), 1200);
    } else {
      const err = await res.json();
      setStatus(`❌ ${err.detail || "Update failed"}`);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-semibold text-center mb-6 text-[#550000]">
        Edit Profile
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {Object.entries({
          full_name: "Full Name",
          username: "Username",
          bio: "Bio",
          preferred_themes: "Preferred Project Themes",
          portfolio_links: "Portfolio Links",
          next_build: "What I Want To Build Next",
          affiliations: "Affiliations",
        }).map(([key, label]) => (
          <div key={key}>
            <label className="block text-[#550000] font-medium mb-1">
              {label}
            </label>
            <textarea
              value={form[key as keyof typeof form]}
              onChange={(e) =>
                setForm({ ...form, [key]: e.target.value })
              }
              className="w-full border border-[#550000]/40 rounded-md p-2"
              rows={key === "bio" ? 3 : 2}
            />
          </div>
        ))}

        <button
          type="submit"
          className="bg-[#550000] text-[#FFD700] px-4 py-2 rounded-lg w-full hover:bg-[#440000] transition"
        >
          Save Changes
        </button>

        {status && (
          <p className="text-center mt-3 text-[#550000] font-medium">{status}</p>
        )}
      </form>
    </div>
  );
}






