"use client";

import React, { useState, useCallback, useEffect } from "react";
import {
  User,
  SearchIcon,
  MapPinIcon,
  BriefcaseIcon,
  StarIcon,
  BookmarkIcon,
  Loader2,
} from "lucide-react";

// --- TYPE DEFINITIONS ---
interface Peer {
  id: number;
  username: string;
  archetype: string;
  tier: string;
  region: string;
  bio: string;
  active_projects: number;
  is_saved: boolean;
}

interface FilterOption {
  id: number | string;
  name: string;
}

interface Filters {
  archetypeId: string;
  tierId: string;
  region: string;
  search: string;
}

// --- CONSTANTS ---
const REGIONS = ["All", "Accra", "Lagos", "Nairobi", "Global"];
const API_BASE_URL = "http://127.0.0.1:8000/api/v1";

// --- 🔁 Fetch Helper (auto-retry) ---
async function fetchWithRetry(url: string, retries = 3, delay = 800) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Status ${res.status}`);
      return await res.json();
    } catch (err) {
      if (i === retries - 1) throw err;
      console.warn(`Retrying ${url}... (${i + 1}/${retries})`);
      await new Promise((r) => setTimeout(r, delay));
    }
  }
}

// --- COMPONENT: PeerCard ---
const PeerCard: React.FC<{ peer: Peer; onToggleSave: (id: number) => void }> = ({
  peer,
  onToggleSave,
}) => (
  <div className="bg-white border border-amber-950/10 rounded-xl shadow-lg hover:shadow-xl transition-shadow p-6 flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
    <div className="flex items-center space-x-4">
      <div className="w-12 h-12 rounded-full bg-amber-950 flex items-center justify-center text-white text-xl font-bold">
        {peer.username.charAt(0).toUpperCase()}
      </div>
      <div>
        <h3 className="text-xl font-semibold text-amber-950">{peer.username}</h3>
        <p className="text-sm text-gray-600 font-medium">
          {peer.archetype || "N/A"} | {peer.tier || "N/A"} Tier
        </p>
        <p className="text-sm text-yellow-400 font-medium flex items-center">
          <StarIcon className="w-4 h-4 mr-1 fill-yellow-400" />
          {peer.active_projects || 0} Active Projects
        </p>
      </div>
    </div>

    <div className="flex flex-col md:w-3/5 space-y-3">
      <p className="text-sm text-gray-700 italic border-l-2 border-yellow-400 pl-3">
        {peer.bio || "No bio available."}
      </p>

      <div className="flex items-center justify-end space-x-4 pt-2">
        <span className="flex items-center text-sm font-medium text-amber-950 bg-amber-950/5 px-3 py-1 rounded-full">
          <MapPinIcon className="w-4 h-4 mr-1 text-yellow-400" />
          {peer.region}
        </span>

        <button
          onClick={() => onToggleSave(peer.id)}
          className={`p-2 rounded-full transition-colors ${
            peer.is_saved
              ? "bg-yellow-400 text-amber-950"
              : "bg-gray-100 text-gray-500 hover:bg-yellow-400/50"
          }`}
          title={peer.is_saved ? "Unsave Profile" : "Save Profile"}
        >
          <BookmarkIcon
            className={`w-5 h-5 ${
              peer.is_saved ? "fill-amber-950" : "fill-none"
            }`}
          />
        </button>

        <button className="px-4 py-2 text-sm font-semibold bg-amber-950 text-white rounded-lg shadow-md hover:bg-amber-800 transition-colors">
          View Profile
        </button>
      </div>
    </div>
  </div>
);

// --- MAIN COMPONENT ---
const PeerDirectory: React.FC = () => {
  const [archetypeOptions, setArchetypeOptions] = useState<FilterOption[]>([]);
  const [tierOptions, setTierOptions] = useState<FilterOption[]>([]);
  const [peers, setPeers] = useState<Peer[]>([]);
  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState<Filters>({
    archetypeId: "",
    tierId: "",
    region: "All",
    search: "",
  });

  const handleFilterChange = useCallback((key: keyof Filters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleToggleSave = useCallback((id: number) => {
    setPeers((prevPeers) =>
      prevPeers.map((p) =>
        p.id === id ? { ...p, is_saved: !p.is_saved } : p
      )
    );
  }, []);

  // Fetch filters
  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const [aData, tData] = await Promise.all([
          fetchWithRetry(`${API_BASE_URL}/archetypes/`),
          fetchWithRetry(`${API_BASE_URL}/tiers/`),
        ]);
        setArchetypeOptions(aData);
        setTierOptions(tData);
      } catch (err) {
        console.error("⚠️ Could not fetch archetypes/tiers:", err);
      }
    };
    fetchFilterOptions();
  }, []);

  // Fetch results
  const fetchResults = useCallback(async (currentFilters: Filters) => {
    if (
      !currentFilters.search &&
      !currentFilters.archetypeId &&
      !currentFilters.tierId &&
      currentFilters.region === "All"
    ) {
      setPeers([]);
      return;
    }

    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (currentFilters.search)
        params.append("name", currentFilters.search);
      if (currentFilters.archetypeId)
        params.append("archetype_id", currentFilters.archetypeId);
      if (currentFilters.tierId)
        params.append("tier_id", currentFilters.tierId);

      const res = await fetch(`${API_BASE_URL}/discover/?${params.toString()}`);
      if (!res.ok) throw new Error(`Bad response: ${res.status}`);
      setPeers(await res.json());
    } catch (err) {
      console.error("❌ Discover fetch failed:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => fetchResults(filters), 400);
    return () => clearTimeout(timeout);
  }, [filters, fetchResults]);

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-extrabold text-amber-950 flex items-center">
            <User className="w-8 h-8 mr-3 text-yellow-400" />
            Discover Creators
          </h1>
          <p className="text-lg text-gray-500 mt-2">
            Search for creators, innovators, and systems thinkers.
          </p>
        </header>

        {/* Filter Section */}
        <div className="bg-white p-6 rounded-xl shadow-lg mb-8 border-t-4 border-yellow-400">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4 lg:grid-cols-5">
            <div className="md:col-span-2 lg:col-span-2 relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or keywords..."
                className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-yellow-400 focus:border-yellow-400 transition-colors"
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
              />
            </div>

            <select
              className="p-3 border border-gray-300 rounded-lg text-gray-700"
              value={filters.archetypeId}
              onChange={(e) => handleFilterChange("archetypeId", e.target.value)}
            >
              <option value="">All Archetypes</option>
              {archetypeOptions.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>

            <select
              className="p-3 border border-gray-300 rounded-lg text-gray-700"
              value={filters.tierId}
              onChange={(e) => handleFilterChange("tierId", e.target.value)}
            >
              <option value="">All Tiers</option>
              {tierOptions.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>

            <select
              className="p-3 border border-gray-300 rounded-lg text-gray-700"
              value={filters.region}
              onChange={(e) => handleFilterChange("region", e.target.value)}
            >
              {REGIONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-6">
          {loading ? (
            <div className="text-center p-10 bg-white rounded-xl shadow-inner text-amber-950 flex items-center justify-center space-x-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              <p className="font-semibold">Searching the network...</p>
            </div>
          ) : peers.length === 0 ? (
            <div className="text-center p-10 bg-white rounded-xl shadow-inner text-gray-500">
              <BriefcaseIcon className="w-10 h-10 mx-auto mb-3" />
              <p className="font-semibold">
                No creators found matching your criteria.
              </p>
              <p className="text-sm">
                Try broadening your filters or search terms.
              </p>
            </div>
          ) : (
            peers.map((peer) => (
              <PeerCard key={peer.id} peer={peer} onToggleSave={handleToggleSave} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default PeerDirectory;
