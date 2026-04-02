"use client";
import { useState } from "react";
import Sidebar from "./Sidebar";
import AppBar from "./AppBar";

/**
 * AdminLayout — wraps all admin pages.
 *
 * @param {object}   props
 * @param {React.ReactNode} props.children    — page content
 * @param {Array}    props.menu              — MenuItem[] config
 * @param {string}   props.userRole         — current user's role
 * @param {object}   props.user             — { name, email, role }
 */
export default function AdminLayout({ children, menu, userRole, user }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className={`min-h-screen bg-gray-50 ${darkMode ? "dark" : ""}`}>
      {/* Sidebar */}
      <Sidebar
        menu={menu}
        userRole={userRole}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Main content — offset by sidebar width on desktop */}
      <div
        className={`flex flex-col min-h-screen transition-all duration-300 ${
          collapsed ? "lg:ml-16" : "lg:ml-64"
        }`}
      >
        {/* App Bar */}
        <AppBar
          onMenuToggle={() => setMobileOpen(true)}
          user={user}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
        />

        {/* Page content */}
        <main className="flex-1 px-4 md:px-6 py-6">
          {children}
        </main>

        {/* Footer */}
        <footer className="px-6 py-4 border-t border-gray-100 bg-white">
          <p className="text-xs text-gray-400 text-center">
            © {new Date().getFullYear()} PISO Admin Portal • Version 1.0.0 • Progress Intellectual School
          </p>
        </footer>
      </div>
    </div>
  );
}
