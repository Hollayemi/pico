"use client";
import { useEffect, useRef } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import ParentNavItem from "./NavItem";

export default function ParentSidebar({
  menu,
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen,
}) {
  const overlayRef = useRef(null);

  useEffect(() => {
    const stored = localStorage.getItem("parent_sidebar_collapsed");
    if (stored !== null) setCollapsed(stored === "true");
  }, []);

  const handleCollapse = () => {
    const next = !collapsed;
    setCollapsed(next);
    localStorage.setItem("parent_sidebar_collapsed", String(next));
  };

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-4 border-b border-teal-100/60">
        <Image src="/images/progressLogo.png" alt="logo" width={36} height={36}
          className="w-8 h-8 flex-shrink-0" />
        {!collapsed && (
          <div className="overflow-hidden">
            <p className="text-xs font-black text-teal-800 leading-tight">Progress</p>
            <p className="text-xs text-teal-600 leading-tight">Parent Portal</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1 scrollbar-thin">
        {menu.map((item) => (
          <ParentNavItem key={item.path} item={item} collapsed={collapsed} />
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-teal-100/60 px-3 py-3">
        <button onClick={handleCollapse}
          className="hidden lg:flex w-full items-center justify-center gap-2 py-2 px-3
            text-xs text-gray-400 hover:text-teal-600 hover:bg-teal-50 rounded-xl transition-colors duration-200">
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop */}
      <aside className={`hidden lg:flex flex-col fixed inset-y-0 left-0 z-30 bg-white border-r border-gray-100
        shadow-sm transition-all duration-300 ${collapsed ? "w-16" : "w-64"}`}>
        {sidebarContent}
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div ref={overlayRef} onClick={() => setMobileOpen(false)}
          className="lg:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity" />
      )}

      {/* Mobile drawer */}
      <aside className={`lg:hidden fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-100
        shadow-xl transform transition-transform duration-300 ease-in-out
        ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="absolute top-4 right-4">
          <button onClick={() => setMobileOpen(false)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
            <X size={18} />
          </button>
        </div>
        {sidebarContent}
      </aside>
    </>
  );
}
