"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function EditProfilePage() {
  const router = useRouter();
  const loggedInUsername = "setor"; // temporary until auth connects

  const [form, setForm] = useState({
    name: "",
    username: "",
    bio: "",
    projectThemes: "",
    portfolioLinks: "",
    forwardIntent: "",
    coalitions: "",
  });

  // 🟢 Load saved profile data when the page mounts
  useEffect(() => {
    const savedProfile = localStorage.getItem("breate_profile");
    if (savedProfile) {
      setForm(JSON.parse(savedProfile));
    }
  }, []);

  // 🟢 Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // 🟢 Save profile to localStorage and redirect
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("breate_profile", JSON.stringify(form)); // save locally
    alert("✅ Profile saved successfully!");
    router.push(`/profile/${loggedInUsername}`); // redirect to profile
  };

  // 🟢 Back button (no save)
  const handleBack = () => {
    router.push(`/profile/${loggedInUsername}`);
  };

  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6 text-center text-[#550000]">
        Edit Profile
      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white/80 p-6 rounded-2xl shadow-md"
      >
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Enter your full name"
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          />
        </div>

        {/* Username */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Username
          </label>
          <input
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            placeholder="e.g. setor_t"
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          />
        </div>

        {/* Bio */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Bio
          </label>
          <textarea
            name="bio"
            value={form.bio}
            onChange={handleChange}
            placeholder="Write a short bio about yourself"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 h-24"
          />
        </div>

        {/* Project Themes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Preferred Project Themes
          </label>
          <input
            type="text"
            name="projectThemes"
            value={form.projectThemes}
            onChange={handleChange}
            placeholder="Separate multiple themes with commas"
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          />
        </div>

        {/* Portfolio Links */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Portfolio Links
          </label>
          <input
            type="text"
            name="portfolioLinks"
            value={form.portfolioLinks}
            onChange={handleChange}
            placeholder="Add URLs separated by commas (e.g. GitHub, Behance, Drive)"
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          />
        </div>

        {/* Forward Intent */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            What I Want to Build Next
          </label>
          <textarea
            name="forwardIntent"
            value={form.forwardIntent}
            onChange={handleChange}
            placeholder="Describe your next big idea or goal"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 h-20"
          />
        </div>

        {/* Coalitions */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Coalitions / Affiliations
          </label>
          <input
            type="text"
            name="coalitions"
            value={form.coalitions}
            onChange={handleChange}
            placeholder="e.g. University of Ghana, Bisa Collective"
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-between pt-4">
          <button
            type="button"
            onClick={handleBack}
            className="bg-gray-300 text-gray-800 font-medium px-6 py-2 rounded-lg hover:bg-gray-400 transition"
          >
            Back to Profile
          </button>

          <button
            type="submit"
            className="bg-[#550000] text-[#FFD700] font-medium px-6 py-2 rounded-lg hover:bg-[#440000] transition"
          >
            Save Profile
          </button>
        </div>
      </form>
    </main>
  );
}


