"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { getParentIcon } from "./iconMap";

export default function ParentNavItem({ item, collapsed }) {
  const pathname = usePathname();
  const hasChildren = item.children && item.children.length > 0;

  const isActive       = pathname === item.path;
  const isParentActive = hasChildren && item.children.some((c) => pathname.startsWith(c.path));

  const [open, setOpen] = useState(isParentActive);

  const Icon = getParentIcon(item.icon);

  if (hasChildren) {
    return (
      <div>
        <button
          onClick={() => setOpen((p) => !p)}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group
            ${isParentActive
              ? "bg-teal-600 text-white shadow-sm"
              : "text-gray-600 hover:bg-teal-50 hover:text-teal-700"
            }`}
        >
          <span className={`flex-shrink-0 transition-colors
            ${isParentActive ? "text-white" : "text-gray-400 group-hover:text-teal-600"}`}>
            <Icon size={18} />
          </span>
          {!collapsed && (
            <>
              <span className="flex-1 text-left truncate">{item.name}</span>
              <span className={`transition-transform duration-200 flex-shrink-0 ${open ? "rotate-180" : ""}
                ${isParentActive ? "text-white/80" : "text-gray-400"}`}>
                <ChevronDown size={14} />
              </span>
            </>
          )}
        </button>

        {!collapsed && open && (
          <div className="mt-1 ml-4 pl-3 border-l-2 border-teal-100 space-y-0.5">
            {item.children.map((child) => {
              const childActive = pathname === child.path;
              return (
                <Link key={child.path} href={child.path}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all duration-150
                    ${childActive
                      ? "text-teal-700 font-semibold bg-teal-50"
                      : "text-gray-500 hover:text-teal-700 hover:bg-teal-50/80"
                    }`}>
                  <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 transition-colors
                    ${childActive ? "bg-teal-500" : "bg-gray-300"}`} />
                  {child.name}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  return (
    <Link href={item.path} title={collapsed ? item.name : undefined}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group
        ${isActive
          ? "bg-teal-600 text-white shadow-sm"
          : "text-gray-600 hover:bg-teal-50 hover:text-teal-700"
        }`}>
      <span className={`flex-shrink-0 transition-colors
        ${isActive ? "text-white" : "text-gray-400 group-hover:text-teal-600"}`}>
        <Icon size={18} />
      </span>
      {!collapsed && <span className="truncate">{item.name}</span>}
    </Link>
  );
}
