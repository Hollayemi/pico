"use client";
import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  Menu, Bell, ChevronDown, LogOut,
  User, Settings, Moon, Sun,
} from "lucide-react";
import { useUserData } from "@/context/userContext";
import { logoutUser } from "@/redux/slices/authSlice";
import { useDispatch } from "react-redux";

const NOTIFS = [
  { id: 1, text: "New result published for JSS 2A",       time: "5m ago",  read: false },
  { id: 2, text: "Fee invoice sent for 2nd Term",         time: "2h ago",  read: false },
  { id: 3, text: "Attendance alert: Chioma absent today", time: "8h ago",  read: true  },
];

function getTitle(pathname) {
  const segs = pathname.split("/").filter(Boolean);
  if (!segs.length) return "Dashboard";
  return segs[segs.length - 1]
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export default function ParentAppBar({ onMenuToggle, darkMode, setDarkMode }) {
  const { userInfo } = useUserData();
  const pathname  = usePathname();
  const dispatch  = useDispatch();
  const title     = getTitle(pathname);

  console.log("ParentAppBar userInfo:", userInfo);

  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen,   setNotifOpen]   = useState(false);
  const profileRef = useRef(null);
  const notifRef   = useRef(null);
  const unread     = NOTIFS.filter((n) => !n.read).length;

  useEffect(() => {
    const close = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
      if (notifRef.current   && !notifRef.current.contains(e.target))   setNotifOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
      <div className="flex items-center gap-4 px-4 md:px-6 h-16">
        {/* mobile menu */}
        <button onClick={onMenuToggle}
          className="lg:hidden p-2 rounded-xl text-gray-500 hover:bg-gray-100 hover:text-teal-600 transition-colors">
          <Menu size={20} />
        </button>

        {/* title */}
        <div className="flex-1 min-w-0">
          <h1 className="text-base font-bold text-gray-800 truncate">{title}</h1>
          <p className="text-xs text-gray-400 hidden sm:block">
            {new Date().toLocaleDateString("en-NG", { weekday: "long", day: "numeric", month: "long" })}
          </p>
        </div>

        {/* actions */}
        <div className="flex items-center gap-2">
          {/* dark mode */}
          <button onClick={() => setDarkMode?.((p) => !p)}
            className="p-2 rounded-xl text-gray-400 hover:bg-gray-100 hover:text-teal-600 transition-colors">
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* notifications */}
          <div className="relative" ref={notifRef}>
            <button onClick={() => setNotifOpen((p) => !p)}
              className="relative p-2 rounded-xl text-gray-400 hover:bg-gray-100 hover:text-teal-600 transition-colors">
              <Bell size={18} />
              {unread > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
              )}
            </button>
            {notifOpen && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50">
                <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                  <span className="font-semibold text-gray-800 text-sm">Notifications</span>
                  {unread > 0 && (
                    <span className="text-xs bg-teal-100 text-teal-700 px-2 py-0.5 rounded-full font-medium">
                      {unread} new
                    </span>
                  )}
                </div>
                {NOTIFS.map((n) => (
                  <div key={n.id}
                    className={`px-4 py-3 flex gap-3 hover:bg-gray-50 transition-colors ${!n.read ? "bg-teal-50/40" : ""}`}>
                    <span className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${n.read ? "bg-gray-200" : "bg-teal-500"}`} />
                    <div className="min-w-0">
                      <p className="text-sm text-gray-700 leading-snug">{n.text}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{n.time}</p>
                    </div>
                  </div>
                ))}
                <div className="px-4 py-2.5 border-t border-gray-100">
                  <button className="text-xs text-teal-600 hover:text-teal-700 font-medium">
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* profile */}
          <div className="relative" ref={profileRef}>
            <button onClick={() => setProfileOpen((p) => !p)}
              className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-xl hover:bg-gray-100 transition-colors group">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center
                flex-shrink-0 text-white font-bold text-sm shadow-sm">
                {userInfo?.familyName?.charAt(0).toUpperCase() ?? "P"}
              </div>
              <div className="hidden md:block text-left min-w-0">
                <p className="text-xs font-semibold text-gray-800 truncate max-w-[90px]">
                  {userInfo?.familyName ?? "Parent"}
                </p>
                <p className="text-xs text-gray-400 truncate max-w-[90px]">Parent</p>
              </div>
              <ChevronDown size={14}
                className={`hidden md:block text-gray-400 flex-shrink-0 transition-transform duration-200 ${profileOpen ? "rotate-180" : ""}`} />
            </button>

            {profileOpen && (
              <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50">
                <div className="px-4 py-3 bg-gradient-to-br from-teal-50 to-white border-b border-gray-100">
                  <p className="text-sm font-semibold text-gray-800">{userInfo?.fullName ?? "Parent"}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{userInfo?.email ?? ""}</p>
                </div>
                <div className="py-1.5">
                  {[
                    { icon: User,     label: "My Profile", href: "/portals/parent/settings" },
                    { icon: Settings, label: "Settings",   href: "/portals/parent/settings" },
                  ].map(({ icon: Icon, label, href }) => (
                    <a key={href} href={href}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-teal-50 hover:text-teal-700 transition-colors">
                      <Icon size={15} className="text-gray-400" />{label}
                    </a>
                  ))}
                </div>
                <div className="border-t border-gray-100 py-1.5">
                  <button onClick={() => dispatch(logoutUser())}
                    className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors">
                    <LogOut size={15} /> Sign Out
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
