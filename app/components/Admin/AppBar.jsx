"use client";
import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  Menu,
  Bell,
  ChevronDown,
  LogOut,
  User,
  Settings,
  Sun,
  Moon,
  Search,
} from "lucide-react";
import Breadcrumb from "./Breadcrumb";

const NOTIFICATIONS = [
  { id: 1, text: "New admission application received", time: "2m ago", read: false },
  { id: 2, text: "Fee payment confirmed for JSS 2A", time: "1h ago", read: false },
  { id: 3, text: "Staff payroll processing complete", time: "3h ago", read: true },
];

function getPageTitle(pathname) {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 0) return "Dashboard";
  const last = segments[segments.length - 1];
  return last
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export default function AppBar({ onMenuToggle, user, darkMode, setDarkMode }) {
  const pathname = usePathname();
  const title = getPageTitle(pathname);

  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const profileRef = useRef(null);
  const notifRef = useRef(null);

  const unread = NOTIFICATIONS.filter((n) => !n.read).length;

  useEffect(() => {
    function handleClick(e) {
      if (profileRef.current && !profileRef.current.contains(e.target))
        setProfileOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target))
        setNotifOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
      <div className="flex items-center gap-4 px-4 md:px-6 h-16">
        {/* Mobile Menu Toggle */}
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 rounded-xl text-gray-500 hover:bg-gray-100 hover:text-brand-600 transition-colors"
        >
          <Menu size={20} />
        </button>

        {/* Title & Breadcrumb */}
        <div className="flex-1 min-w-0">
          <h1 className="text-base font-bold text-gray-800 leading-tight truncate">
            {title}
          </h1>
          <div className="hidden sm:block mt-0.5">
            <Breadcrumb />
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Search */}
           <div className="hidden sm:flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5">
                        <Search className="w-4 h-4 text-gray-400" />
                        <input placeholder="Quick search..." className="bg-transparent text-sm outline-none w-40 text-gray-700 placeholder-gray-400" />
                      </div>
          {/* <button className="hidden md:flex p-2 rounded-xl text-gray-400 hover:bg-gray-100 hover:text-brand-600 transition-colors">
            <Search size={18} />
          </button> */}

          {/* Dark Mode */}
          <button
            onClick={() => setDarkMode?.((p) => !p)}
            className="p-2 rounded-xl text-gray-400 hover:bg-gray-100 hover:text-brand-600 transition-colors"
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Notifications */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setNotifOpen((p) => !p)}
              className="relative p-2 rounded-xl text-gray-400 hover:bg-gray-100 hover:text-brand-600 transition-colors"
            >
              <Bell size={18} />
              {unread > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-orange-500 rounded-full ring-2 ring-white" />
              )}
            </button>

            {notifOpen && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50">
                <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                  <span className="font-semibold text-gray-800 text-sm">Notifications</span>
                  {unread > 0 && (
                    <span className="text-xs bg-brand-100 text-brand-700 px-2 py-0.5 rounded-full font-medium">
                      {unread} new
                    </span>
                  )}
                </div>
                <div className="divide-y divide-gray-50">
                  {NOTIFICATIONS.map((n) => (
                    <div
                      key={n.id}
                      className={`px-4 py-3 flex gap-3 hover:bg-gray-50 transition-colors ${
                        !n.read ? "bg-brand-50/40" : ""
                      }`}
                    >
                      <span
                        className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${
                          n.read ? "bg-gray-200" : "bg-brand-500"
                        }`}
                      />
                      <div className="min-w-0">
                        <p className="text-sm text-gray-700 leading-snug">{n.text}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{n.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="px-4 py-2.5 border-t border-gray-100">
                  <button className="text-xs text-brand-600 hover:text-brand-700 font-medium transition-colors">
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Profile */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setProfileOpen((p) => !p)}
              className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-xl hover:bg-gray-100 transition-colors group"
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center flex-shrink-0 text-white font-bold text-sm shadow-sm">
                {user?.name?.charAt(0) || "A"}
              </div>
              <div className="hidden md:block text-left min-w-0">
                <p className="text-xs font-semibold text-gray-800 truncate max-w-[90px]">
                  {user?.name || "Admin"}
                </p>
                <p className="text-xs text-gray-400 capitalize truncate max-w-[90px]">
                  {user?.role?.replace("_", " ") || "Super Admin"}
                </p>
              </div>
              <ChevronDown
                size={14}
                className={`hidden md:block text-gray-400 flex-shrink-0 transition-transform duration-200 ${
                  profileOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {profileOpen && (
              <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50">
                <div className="px-4 py-3 bg-gradient-to-br from-brand-50 to-white border-b border-gray-100">
                  <p className="text-sm font-semibold text-gray-800">
                    {user?.name || "Administrator"}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {user?.email || "admin@progressschool.com"}
                  </p>
                </div>
                <div className="py-1.5">
                  {[
                    { icon: User, label: "My Profile", href: "/admin/profile" },
                    { icon: Settings, label: "Settings", href: "/admin/settings" },
                  ].map(({ icon: Icon, label, href }) => (
                    <a
                      key={href}
                      href={href}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-brand-50 hover:text-brand-700 transition-colors"
                    >
                      <Icon size={15} className="text-gray-400" />
                      {label}
                    </a>
                  ))}
                </div>
                <div className="border-t border-gray-100 py-1.5">
                  <button className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors">
                    <LogOut size={15} />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
