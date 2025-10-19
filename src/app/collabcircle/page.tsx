"use client";

import React, { useState, useEffect } from 'react';
import { Users, Briefcase, ChevronRight, Star } from 'lucide-react';

// --- 1. TYPE DEFINITIONS ---

type Archetype = 'Creator' | 'Creative' | 'Innovator' | 'Systems Thinker';
type Tier = 'Base' | 'Standard' | 'Professional';

interface Collaborator {
  id: string;
  name: string;
  archetype: Archetype;
  tier: Tier;
  lastProjectTitle: string;
  lastProjectDate: string;
  profilePicUrl: string;
}

// --- 2. HELPERS ---

const getAvatarUrl = (seed: string) =>
  `https://placehold.co/100x100/A0522D/FFFF00?text=${seed}`;

const getTierColor = (tier: Tier) => {
  switch (tier) {
    case 'Professional':
      return 'bg-amber-950 text-yellow-400 border-yellow-400';
    case 'Standard':
      return 'bg-gray-200 text-gray-800 border-gray-400';
    case 'Base':
      return 'bg-gray-100 text-gray-600 border-gray-300';
  }
};

// --- 3. SUB-COMPONENTS ---

const CollaboratorCard: React.FC<{ collaborator: Collaborator }> = ({ collaborator }) => (
  <div className="bg-white border border-gray-100 rounded-2xl shadow-lg hover:shadow-xl transition duration-300 overflow-hidden p-6 flex items-center space-x-6">
    <img
      src={collaborator.profilePicUrl}
      alt={collaborator.name}
      className="w-16 h-16 rounded-full object-cover border-2 border-yellow-400 shadow-md"
      onError={(e: any) => {
        e.target.onerror = null;
        e.target.src = "https://placehold.co/100x100/A0522D/FFFF00?text=👤";
      }}
    />
    <div className="flex-grow">
      <div className="flex items-center mb-1">
        <h3 className="text-xl font-extrabold text-gray-800 leading-tight mr-3">
          {collaborator.name}
        </h3>
        <span
          className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full border ${getTierColor(
            collaborator.tier
          )}`}
        >
          {collaborator.archetype} - {collaborator.tier}
        </span>
      </div>

      <div className="text-sm text-gray-600 flex items-center mt-2">
        <Briefcase className="w-4 h-4 mr-2 text-amber-950" />
        <span className="font-medium mr-1">Last Collab:</span>
        <span className="truncate">{collaborator.lastProjectTitle}</span>
        <span className="text-xs ml-2 text-gray-400">
          ({collaborator.lastProjectDate})
        </span>
      </div>
    </div>

    <div className="flex space-x-3 flex-shrink-0">
      <button
        title="View Profile"
        className="p-3 rounded-full bg-amber-950 text-white hover:bg-amber-900 transition duration-150 shadow-md transform hover:scale-105"
        onClick={() => console.log(`View Profile for ${collaborator.name}`)}
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  </div>
);

// --- 4. MAIN COMPONENT ---

const CollabCirclePage = () => {
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [savedProfiles] = useState<Collaborator[]>([]);
  const [activeTab, setActiveTab] = useState<'circle' | 'saved'>('circle');

  // ✅ Get logged-in username from localStorage
  const storedUser =
    typeof window !== "undefined" ? localStorage.getItem("user") : null;
  const username = storedUser ? JSON.parse(storedUser)?.username : null;

  useEffect(() => {
    const fetchCollabCircle = async () => {
      if (!username) return; // Skip if not logged in
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/v1/collabcircle/${username}`
        );
        const data = await res.json();
        if (data.collab_circle) {
          const formatted = data.collab_circle.map((c: any, index: number) => ({
            id: `${index}`,
            name: c.collaborator_username,
            archetype: 'Creator' as Archetype, // Placeholder since backend doesn’t include this
            tier: 'Standard' as Tier,
            lastProjectTitle: c.project_name || 'Untitled Project',
            lastProjectDate: c.verified_at
              ? new Date(c.verified_at).toLocaleDateString()
              : 'N/A',
            profilePicUrl: getAvatarUrl(
              c.collaborator_username[0]?.toUpperCase() || 'U'
            ),
          }));
          setCollaborators(formatted);
        }
      } catch (err) {
        console.error("Error fetching collab circle:", err);
      }
    };

    fetchCollabCircle();
  }, [username]);

  const CollabCircleCount = collaborators.length;
  const SavedProfilesCount = savedProfiles.length;

  return (
    <div className="min-h-screen bg-stone-50 font-sans p-4 md:p-8">
      <header className="mb-8 flex flex-col md:flex-row justify-between items-center bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
        <h1 className="text-4xl font-black text-gray-900 mb-4 md:mb-0 flex items-center">
          <span className="text-3xl mr-2">🌀</span>
          My Collab Circle
        </h1>
        <p className="text-gray-600 text-lg">
          Your network of confirmed, verified collaborators.
        </p>
      </header>

      <main className="max-w-4xl mx-auto">
        <div className="flex border-b border-gray-200 mb-6 bg-white rounded-t-xl shadow-sm">
          <button
            className={`flex-1 py-3 text-center text-lg font-semibold transition duration-150 ${
              activeTab === 'circle'
                ? 'text-amber-950 border-b-4 border-amber-950'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('circle')}
          >
            <Users className="w-5 h-5 inline mr-2" />
            Collab Circle ({CollabCircleCount})
          </button>
          <button
            className={`flex-1 py-3 text-center text-lg font-semibold transition duration-150 ${
              activeTab === 'saved'
                ? 'text-amber-950 border-b-4 border-amber-950'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('saved')}
          >
            <Star className="w-5 h-5 inline mr-2" />
            Saved Profiles ({SavedProfilesCount})
          </button>
        </div>

        <div className="space-y-4">
          {activeTab === 'circle' &&
            (CollabCircleCount > 0 ? (
              collaborators.map((collaborator) => (
                <CollaboratorCard key={collaborator.id} collaborator={collaborator} />
              ))
            ) : (
              <div className="text-center p-12 bg-white rounded-xl shadow-lg">
                <p className="text-xl font-medium text-gray-500">
                  {username
                    ? "Your Collab Circle is empty! Start a project in the Hub to build your verified network."
                    : "Please log in to view your Collab Circle."}
                </p>
              </div>
            ))}

          {activeTab === 'saved' &&
            (SavedProfilesCount > 0 ? (
              savedProfiles.map((collaborator) => (
                <CollaboratorCard key={collaborator.id} collaborator={collaborator} />
              ))
            ) : (
              <div className="text-center p-12 bg-white rounded-xl shadow-lg">
                <p className="text-xl font-medium text-gray-500">
                  You haven't saved any profiles yet. Visit the Peer Directory to bookmark someone!
                </p>
              </div>
            ))}
        </div>
      </main>
    </div>
  );
};

export default CollabCirclePage;

