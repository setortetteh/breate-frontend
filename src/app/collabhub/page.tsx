"use client";

import React, { useState, useEffect } from "react";
import { Search, PlusCircle, User, Zap, Clock, MapPin, Tag, Loader2 } from "lucide-react";

const API_BASE_URL = "http://127.0.0.1:8000/api/v1"; // ✅ Backend connection

// --- TYPES ---
interface Project {
  id: number;
  title: string;
  objective: string;
  project_type: string;
  needed_archetypes: string[];
  open_roles: string;
  timeline: string;
  region: string;
  coalition_tags: string[];
  created_at: string;
}

interface ProjectFormInputs {
  title: string;
  objective: string;
  timeline: string;
  needed_archetypes: string[];
  open_roles: string;
  project_type: string;
  region: string;
  coalition_tags: string[];
}

// --- STATIC OPTIONS ---
const ARCHETYPES = ["Creator", "Creative", "Innovator", "Systems Thinker"];
const PROJECT_TYPES = ["Film", "Event", "Campaign", "Product", "General Project"];
const REGIONS = ["Accra", "Lagos", "Nairobi", "Cape Town"];
const COALITIONS = [
  "Ashesi University",
  "University of Ghana",
  "KNUST",
  "Academic City",
  "Competitions (Hackathons etc.)",
  "Design Hub",
];

// --- COMPONENT: Project Card ---
const ProjectCard: React.FC<{ project: Project }> = ({ project }) => (
  <div className="bg-white border border-gray-100 rounded-xl shadow-lg hover:shadow-xl transition duration-300 overflow-hidden">
    <div className="p-6">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-xl font-extrabold text-gray-800">{project.title}</h3>
        <span className="inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full text-amber-950 bg-yellow-100">
          <Tag className="w-3 h-3 mr-1" />
          {project.project_type}
        </span>
      </div>

      <p className="text-sm text-gray-600 mb-4">{project.objective}</p>

      <div className="text-sm text-gray-700 mb-4 border-t border-b py-3 space-y-3">
        <div className="flex">
          <User className="w-4 h-4 mr-2 text-amber-950" />
          <p>
            <span className="font-medium">Open Roles:</span> {project.open_roles}
          </p>
        </div>

        <div className="flex">
          <Zap className="w-4 h-4 mr-2 text-yellow-400" />
          <p>
            <span className="font-medium">Needed Archetypes:</span>{" "}
            {project.needed_archetypes.join(", ")}
          </p>
        </div>

        <div className="pt-2 border-t border-gray-100 space-y-2">
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-2 text-amber-600" />
            <p>
              <span className="font-medium">Timeline:</span> {project.timeline}
            </p>
          </div>
          <div className="flex items-center">
            <MapPin className="w-4 h-4 mr-2 text-amber-950" />
            <p>
              <span className="font-medium">Region:</span> {project.region}
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <button className="px-4 py-2 text-sm font-semibold bg-yellow-400 text-amber-950 rounded-lg shadow-md hover:bg-yellow-500 transition">
          Join Interest
        </button>
        <span className="text-xs text-gray-400">
          Posted: {new Date(project.created_at).toLocaleDateString()}
        </span>
      </div>
    </div>
  </div>
);

// --- COMPONENT: Post Project Modal ---
const PostProjectModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onPost: (data: ProjectFormInputs) => void;
}> = ({ isOpen, onClose, onPost }) => {
  const [formData, setFormData] = useState<ProjectFormInputs>({
    title: "",
    objective: "",
    timeline: "",
    needed_archetypes: [],
    open_roles: "",
    project_type: "General Project",
    region: "Accra",
    coalition_tags: [],
  });

  if (!isOpen) return null;

  const handleChange = (e: any) => {
    const { name, value, selectedOptions } = e.target;
    if (name === "needed_archetypes" || name === "coalition_tags") {
      const selected = Array.from(selectedOptions).map((o: any) => o.value);
      setFormData((prev) => ({ ...prev, [name]: selected }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    onPost(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl">
        <div className="p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Post a New Project</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Project Title"
              className="w-full p-3 border rounded-lg focus:ring-amber-950 focus:border-amber-950"
              required
            />
            <textarea
              name="objective"
              value={formData.objective}
              onChange={handleChange}
              placeholder="Objective"
              className="w-full p-3 border rounded-lg focus:ring-amber-950 focus:border-amber-950"
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <select
                name="project_type"
                value={formData.project_type}
                onChange={handleChange}
                className="p-3 border rounded-lg focus:ring-amber-950 focus:border-amber-950"
              >
                {PROJECT_TYPES.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>

              <input
                name="timeline"
                value={formData.timeline}
                onChange={handleChange}
                placeholder="Timeline (e.g., 2 weeks)"
                className="p-3 border rounded-lg focus:ring-amber-950 focus:border-amber-950"
                required
              />
            </div>

            <select
              multiple
              name="needed_archetypes"
              value={formData.needed_archetypes}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:ring-amber-950 focus:border-amber-950"
            >
              {ARCHETYPES.map((a) => (
                <option key={a}>{a}</option>
              ))}
            </select>

            <input
              name="open_roles"
              value={formData.open_roles}
              onChange={handleChange}
              placeholder="Open Roles"
              className="w-full p-3 border rounded-lg focus:ring-amber-950 focus:border-amber-950"
              required
            />

            <select
              multiple
              name="coalition_tags"
              value={formData.coalition_tags}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:ring-amber-950 focus:border-amber-950"
            >
              {COALITIONS.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 border rounded-lg text-gray-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-amber-950 text-white font-semibold rounded-lg"
              >
                <PlusCircle className="w-5 h-5 inline mr-2" />
                Post Project
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// --- MAIN COMPONENT ---
const CollabHub = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ✅ Fetch projects (with retry logic)
  const fetchProjects = async (retries = 3) => {
    try {
      console.log("⏳ Fetching projects...");
      const res = await fetch(`${API_BASE_URL}/projects`, { cache: "no-store" });
      if (!res.ok) throw new Error(`Fetch failed with ${res.status}`);
      const data = await res.json();
      console.log("✅ Projects loaded:", data);
      setProjects(data);
    } catch (err) {
      console.error("❌ Failed to fetch projects:", err);
      if (retries > 0) {
        console.log(`🔁 Retrying in 1s... (${retries} left)`);
        setTimeout(() => fetchProjects(retries - 1), 1000);
      }
    } finally {
      setLoading(false);
    }
  };

  // ✅ Post new project
  const handlePostProject = async (data: ProjectFormInputs) => {
    try {
      const res = await fetch(`${API_BASE_URL}/projects`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        console.log("✅ Project created successfully");
        fetchProjects();
      } else {
        console.error("❌ Failed to post project:", await res.text());
      }
    } catch (err) {
      console.error("Error posting project:", err);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => fetchProjects(), 700);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-stone-50 p-6 md:p-8">
      <header className="flex justify-between items-center mb-8 bg-white p-6 rounded-2xl shadow-lg">
        <h1 className="text-4xl font-black text-gray-900 flex items-center">
          💼 Collaboration Hub
        </h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center px-6 py-3 bg-amber-950 text-white font-bold rounded-xl shadow-xl hover:bg-amber-900"
        >
          <PlusCircle className="w-5 h-5 mr-2" /> Post New Project
        </button>
      </header>

      <main className="max-w-7xl mx-auto">
        {loading ? (
          <div className="flex justify-center items-center h-40 text-amber-950">
            <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading projects...
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center text-gray-500 p-10 bg-white rounded-xl shadow-lg">
            No projects yet. Be the first to post!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </main>

      <PostProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onPost={handlePostProject}
      />
    </div>
  );
};

export default CollabHub;

