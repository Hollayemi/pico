"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, Users, Briefcase, GraduationCap,
  BookOpen, Calendar, BarChart3, Settings, LogOut,
  Menu, X, ChevronDown, ChevronRight, Bell, Search,
  DollarSign, UserPlus, FileText, Home
} from "lucide-react";
import Image from "next/image";

const navItems = [
  {
    name: "Dashboard",
    path: "/portals/admin/dashboard",
    icon: LayoutDashboard,
    roles: ["super_admin", "admin"],
  },
  {
    name: "Students",
    path: "/portals/admin/student",
    icon: GraduationCap,
    roles: ["super_admin", "admin"],
    children: [
      { name: "All Students", path: "/portals/admin/student/all", roles: ["super_admin", "admin"] },
      { name: "Add Student", path: "/portals/admin/student/add", roles: ["super_admin", "admin"] },
      { name: "Applications", path: "/portals/admin/student/applications", roles: ["super_admin", "admin"] },
    ],
  },
  {
    name: "Staff",
    path: "/portals/admin/staff",
    icon: Briefcase,
    roles: ["super_admin", "admin"],
    children: [
      { name: "All Staff", path: "/portals/admin/staff/all", roles: ["super_admin", "admin"] },
      { name: "Add Staff", path: "/portals/admin/staff/add", roles: ["super_admin", "admin"] },
      { name: "Payroll", path: "/portals/admin/staff/payroll", roles: ["super_admin", "accountant"] },
    ],
  },
  {
    name: "Academics",
    path: "/portals/admin/academics",
    icon: BookOpen,
    roles: ["super_admin", "admin"],
    children: [
      { name: "Classes", path: "/portals/admin/academics/classes" },
      { name: "Subjects", path: "/portals/admin/academics/subjects" },
      { name: "Results", path: "/portals/admin/academics/results" },
    ],
  },
  {
    name: "Finance",
    path: "/portals/admin/finance",
    icon: DollarSign,
    roles: ["super_admin", "accountant"],
    children: [
      { name: "Fees", path: "/portals/admin/finance/fees" },
      { name: "Payments", path: "/portals/admin/finance/payments" },
      { name: "Reports", path: "/portals/admin/finance/reports" },
    ],
  },
  {
    name: "Reports",
    path: "/portals/admin/reports",
    icon: BarChart3,
    roles: ["super_admin", "admin"],
  },
  {
    name: "Settings",
    path: "/portals/admin/settings",
    icon: Settings,
    roles: ["super_admin"],
  },
];

const NavItem = ({ item, collapsed }) => {
  const pathname = usePathname();
  const [open, setOpen] = useState(
    item.children?.some((c) => pathname.startsWith(c.path)) || pathname.startsWith(item.path)
  );
  const Icon = item.icon;
  const isActive = pathname.startsWith(item.path);

  if (item.children) {
    return (
      <div>
        <button
          onClick={() => setOpen(!open)}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all
            ${isActive ? "bg-brand-600 text-white" : "text-gray-600 hover:bg-brand-50 hover:text-brand-700"}`}
        >
          <Icon className="w-4 h-4 flex-shrink-0" />
          {!collapsed && (
            <>
              <span className="flex-1 text-left">{item.name}</span>
              {open ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
            </>
          )}
        </button>
        {open && !collapsed && (
          <div className="ml-4 mt-1 space-y-0.5 border-l-2 border-brand-100 pl-3">
            {item.children.map((child) => (
              <Link
                key={child.path}
                href={child.path}
                className={`block px-3 py-2 rounded-lg text-sm transition-all
                  ${pathname === child.path
                    ? "bg-brand-50 text-brand-700 font-semibold"
                    : "text-gray-500 hover:text-brand-600 hover:bg-brand-25"
                  }`}
              >
                {child.name}
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <Link
      href={item.path}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all
        ${isActive ? "bg-brand-600 text-white" : "text-gray-600 hover:bg-brand-50 hover:text-brand-700"}`}
    >
      <Icon className="w-4 h-4 flex-shrink-0" />
      {!collapsed && <span>{item.name}</span>}
    </Link>
  );
};

export default function AdminWrapper({ children, title, subtitle }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:flex flex-col bg-white border-r border-gray-200 transition-all duration-300 flex-shrink-0
          ${sidebarOpen ? "w-60" : "w-16"}`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-100">
          <Image src="/images/progressLogo.png" alt="logo" width={36} height={36} className="w-8 h-8 flex-shrink-0" />
          {sidebarOpen && (
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-brand-800 leading-tight">Progress</p>
              <p className="text-xs text-brand-600 leading-tight">Admin Portal</p>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavItem key={item.path} item={item} collapsed={!sidebarOpen} />
          ))}
        </nav>

        {/* Bottom */}
        <div className="p-3 border-t border-gray-100 space-y-1">
          <Link href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700">
            <Home className="w-4 h-4 flex-shrink-0" />
            {sidebarOpen && <span>Back to Site</span>}
          </Link>
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-500 hover:bg-red-50">
            <LogOut className="w-4 h-4 flex-shrink-0" />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-64 bg-white flex flex-col">
            <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Image src="/images/progressLogo.png" alt="logo" width={32} height={32} className="w-8 h-8" />
                <div>
                  <p className="text-xs font-bold text-brand-800">Progress</p>
                  <p className="text-xs text-brand-600">Admin Portal</p>
                </div>
              </div>
              <button onClick={() => setMobileOpen(false)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
              {navItems.map((item) => (
                <NavItem key={item.path} item={item} collapsed={false} />
              ))}
            </nav>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="bg-white border-b border-gray-200 px-4 md:px-6 py-3 flex items-center gap-4 flex-shrink-0">
          <button onClick={() => { setSidebarOpen(!sidebarOpen); setMobileOpen(true); }} className="text-gray-500 hover:text-gray-700">
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex-1">
            <h1 className="text-base font-bold text-gray-900">{title}</h1>
            {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5">
              <Search className="w-4 h-4 text-gray-400" />
              <input placeholder="Quick search..." className="bg-transparent text-sm outline-none w-40 text-gray-700 placeholder-gray-400" />
            </div>
            <button className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-lg">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <div className="w-8 h-8 rounded-full bg-brand-600 flex items-center justify-center text-white text-xs font-bold">
              AD
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
