"use client";

import "./globals.css";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import logo from "../../public/logo.jpg";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);

  // Temporary mock username (replace with logged-in user later)
  const username = "setor";

  // Auto-collapse sidebar on small screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) setCollapsed(true);
      else setCollapsed(false);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const tabs = [
    { name: "Home", href: "/", emoji: "🏠" },
    { name: "Collab Hub", href: "/collabhub", emoji: "💼" },
    { name: "Coalitions", href: "/coalitions", emoji: "🤝" },
    { name: "Collab Circle", href: "/collabcircle", emoji: "🌀" },
    // ✅ Fixed: changed /discovery → /discover
    { name: "Discover", href: "/discover", emoji: "🔍" },
    { name: "Profile", href: `/profile/${username}`, emoji: "👤" },
  ];

  return (
    <html lang="en">
      <body className="h-screen flex bg-gradient-to-br from-[#FFF8DC] to-[#FFD700]/90 text-[#550000] font-serif overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`fixed left-0 top-0 h-screen ${
            collapsed ? "w-20" : "w-64"
          } flex flex-col justify-between bg-[#550000]/80 text-[#FFD700] p-5 transition-all duration-300 ease-in-out shadow-2xl z-20 backdrop-blur-md border-r border-[#FFD700]/20`}
        >
          <div>
            <div
              className={`flex items-center justify-between ${
                collapsed ? "px-2" : "px-3"
              }`}
            >
              <Image
                src={logo}
                alt="Breate Logo"
                width={collapsed ? 40 : 60}
                height={collapsed ? 40 : 60}
                className="rounded-lg shadow-lg transition-all duration-300"
              />
              {!collapsed && (
                <h1 className="ml-2 text-xl font-bold text-[#FFD700]">Breate</h1>
              )}
              <button
                onClick={() => setCollapsed(!collapsed)}
                className="text-[#FFD700] text-xl ml-auto"
                title={collapsed ? "Expand" : "Collapse"}
              >
                {collapsed ? "›" : "‹"}
              </button>
            </div>

            <nav className="mt-10 flex flex-col space-y-10 text-lg">
              {tabs.map((tab) => (
                <Link
                  key={tab.name}
                  href={tab.href}
                  className="flex items-center space-x-3 hover:text-white transition-colors"
                >
                  <span className="text-2xl">{tab.emoji}</span>
                  {!collapsed && <span>{tab.name}</span>}
                </Link>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main
          className={`flex-1 overflow-y-auto h-screen px-6 py-8 text-[#550000] bg-gradient-to-br from-[#FFF8DC] to-[#FFD700]/90 transition-all duration-300`}
          style={{
            marginLeft: collapsed ? "5rem" : "16rem",
          }}
        >
          <div className="max-w-5xl mx-auto w-full">{children}</div>
        </main>
      </body>
    </html>
  );
}
