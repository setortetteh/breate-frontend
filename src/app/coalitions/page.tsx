"use client";

import React, { useState, useMemo, useEffect } from "react";
import axios from "axios";
import {
  Search,
  PlusCircle,
  Users,
  MapPin,
  Briefcase,
  ChevronRight,
  X,
} from "lucide-react";

// --- 1. TYPE DEFINITIONS ---
interface Coalition {
  id: number;
  name: string;
  location: string;
  focus: string;
  description: string;
  bannerEmoji?: string;
  memberCount?: number;
  activeProjects?: number;
}

interface FilterState {
  searchQuery: string;
  region: string | "All";
}

// --- 2. REGIONS ---
const REGIONS = [
  "All",
  "Accra, Ghana",
  "Lagos, Nigeria",
  "Nairobi, Kenya",
  "Cape Town, South Africa",
];

// --- 3. API CONFIG ---
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api/v1";

// --- 4. MAIN COMPONENT ---
const CoalitionsPage = () => {
  const [coalitions, setCoalitions] = useState<Coalition[]>([]);
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: "",
    region: "All",
  });
  const [showModal, setShowModal] = useState(false);
  const [newCoalition, setNewCoalition] = useState({
    name: "",
    description: "",
    focus: "",
    location: "",
  });

  // --- Fetch coalitions from backend ---
  useEffect(() => {
    const fetchCoalitions = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/coalitions`);
        setCoalitions(res.data);
      } catch (err: any) {
        console.error("❌ Error fetching coalitions:", err.message);
        alert(
          "Failed to connect to backend. Make sure FastAPI is running on port 8000."
        );
      }
    };
    fetchCoalitions();
  }, []);

  // --- Filters ---
  const handleFilterChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const filteredCoalitions = useMemo(() => {
    return coalitions.filter((coalition) => {
      const { searchQuery, region } = filters;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (
          !coalition.name.toLowerCase().includes(query) &&
          !coalition.focus.toLowerCase().includes(query)
        ) {
          return false;
        }
      }
      if (region !== "All" && coalition.location !== region) return false;
      return true;
    });
  }, [coalitions, filters]);

  // --- Create new coalition ---
  const handleCreateCoalition = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_BASE_URL}/coalitions`, newCoalition, {
        headers: { "Content-Type": "application/json" },
      });
      setCoalitions((prev) => [...prev, response.data]);
      setShowModal(false);
      setNewCoalition({
        name: "",
        description: "",
        focus: "",
        location: "",
      });
    } catch (err: any) {
      console.error("❌ Error creating coalition:", err.response?.data || err.message);
      alert("Failed to create coalition. " + (err.response?.data?.detail || err.message));
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 font-sans p-4 md:p-8">
      {/* Header */}
      <header className="mb-8 flex flex-col md:flex-row justify-between items-center bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
        <h1 className="text-4xl font-black text-gray-900 mb-4 md:mb-0 flex items-center">
          <span className="text-3xl mr-2">🤝</span> Coalitions Directory
        </h1>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center px-6 py-3 bg-yellow-400 text-amber-950 font-bold rounded-xl shadow-xl hover:bg-yellow-500 transition duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-yellow-400 focus:ring-opacity-50 w-full md:w-auto justify-center"
        >
          <PlusCircle className="w-5 h-5 mr-2" />
          Register New Coalition
        </button>
      </header>

      {/* Filters */}
      <main className="max-w-7xl mx-auto">
        <div className="mb-8 p-6 bg-white rounded-2xl shadow-lg border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <Search className="w-5 h-5 mr-2 text-gray-500" /> Find Your Community
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <input
              type="text"
              name="searchQuery"
              placeholder="Search by Name or Focus"
              value={filters.searchQuery}
              onChange={handleFilterChange}
              className="p-3 border border-gray-300 rounded-lg sm:col-span-2 focus:ring-amber-950 focus:border-amber-950 transition duration-150"
            />
            <select
              name="region"
              value={filters.region}
              onChange={handleFilterChange}
              className="p-3 border border-gray-300 rounded-lg focus:ring-amber-950 focus:border-amber-950 transition duration-150"
            >
              {REGIONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Coalition Feed */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCoalitions.length > 0 ? (
            filteredCoalitions.map((coalition) => (
              <div
                key={coalition.id}
                className="bg-white border border-gray-100 rounded-2xl shadow-lg hover:shadow-xl transition duration-300 overflow-hidden flex flex-col"
              >
                <div className="p-6 bg-stone-50 border-b border-gray-100 flex items-center">
                  <div className="text-4xl mr-4">🤝</div>
                  <div>
                    <h3 className="text-xl font-extrabold text-gray-800 leading-tight">
                      {coalition.name}
                    </h3>
                    <p className="text-sm text-amber-950 font-medium">
                      {coalition.focus}
                    </p>
                  </div>
                </div>
                <div className="p-6 flex-grow flex flex-col justify-between">
                  <div className="grid grid-cols-2 gap-4 mb-4 text-sm font-semibold">
                    <div className="flex items-center text-gray-700">
                      <Users className="w-4 h-4 mr-2 text-yellow-400" />
                      {coalition.memberCount || 0} Members
                    </div>
                    <div className="flex items-center text-gray-700">
                      <Briefcase className="w-4 h-4 mr-2 text-amber-950" />
                      {coalition.activeProjects || 0} Active Projects
                    </div>
                  </div>
                  <div className="flex items-center text-sm text-gray-600 mb-4 pb-4 border-b border-gray-100">
                    <MapPin className="w-4 h-4 mr-2 text-amber-600" />
                    {coalition.location}
                  </div>
                  <button className="mt-4 w-full flex justify-center items-center px-4 py-2 text-base font-semibold text-white bg-amber-950 rounded-lg shadow-md hover:bg-amber-900 transition duration-150">
                    View Coalition Profile
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="md:col-span-3 text-center p-12 bg-white rounded-xl shadow-lg">
              <p className="text-xl font-medium text-gray-500">
                No Coalitions match your search.
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-lg w-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Create New Coalition
              </h2>
              <button onClick={() => setShowModal(false)}>
                <X className="w-6 h-6 text-gray-600 hover:text-gray-800" />
              </button>
            </div>

            <form onSubmit={handleCreateCoalition} className="space-y-4">
              <input
                type="text"
                placeholder="Coalition Name"
                value={newCoalition.name}
                onChange={(e) =>
                  setNewCoalition({ ...newCoalition, name: e.target.value })
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-amber-950 focus:border-amber-950"
                required
              />
              <input
                type="text"
                placeholder="Focus Area"
                value={newCoalition.focus}
                onChange={(e) =>
                  setNewCoalition({ ...newCoalition, focus: e.target.value })
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-amber-950 focus:border-amber-950"
                required
              />
              <input
                type="text"
                placeholder="Location (e.g., Accra, Ghana)"
                value={newCoalition.location}
                onChange={(e) =>
                  setNewCoalition({ ...newCoalition, location: e.target.value })
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-amber-950 focus:border-amber-950"
                required
              />
              <textarea
                placeholder="Description"
                value={newCoalition.description}
                onChange={(e) =>
                  setNewCoalition({
                    ...newCoalition,
                    description: e.target.value,
                  })
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-amber-950 focus:border-amber-950"
                rows={3}
                required
              />

              <button
                type="submit"
                className="w-full py-3 bg-amber-950 text-white font-semibold rounded-lg hover:bg-amber-900 transition duration-200"
              >
                Create Coalition
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoalitionsPage;










