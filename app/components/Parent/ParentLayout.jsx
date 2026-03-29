"use client";
import { useState } from "react";
import ParentSidebar from "./Sidebar";
import ParentAppBar  from "./AppBar";

/**
 * ParentLayout — wraps all parent portal pages.
 */
export default function ParentLayout({ children, menu }) {
  const [collapsed,   setCollapsed]   = useState(false);
  const [mobileOpen,  setMobileOpen]  = useState(false);
  const [darkMode,    setDarkMode]    = useState(false);

  return (
    <div className={`min-h-screen bg-gray-50 ${darkMode ? "dark" : ""}`}>
      <ParentSidebar
        menu={menu}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <div className={`flex flex-col min-h-screen transition-all duration-300 ${collapsed ? "lg:ml-16" : "lg:ml-64"}`}>
        <ParentAppBar
          onMenuToggle={() => setMobileOpen(true)}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
        />

        <main className="flex-1 px-4 md:px-6 py-6">
          {children}
        </main>

        <footer className="px-6 py-4 border-t border-gray-100 bg-white">
          <p className="text-xs text-gray-400 text-center">
            © {new Date().getFullYear()} Progress Intellectual School — Parent Portal
          </p>
        </footer>
      </div>
    </div>
  );
}
