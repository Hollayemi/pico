"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1).replace(/-/g, " ");
}

export default function Breadcrumb({ menu }) {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  // Build crumbs
  const crumbs = segments.map((seg, i) => {
    const path = "/" + segments.slice(0, i + 1).join("/");
    return { label: capitalize(seg), path };
  });

  return (
    <nav className="flex items-center gap-1.5 text-xs text-gray-400">
      <Link href="/admin/dashboard" className="hover:text-brand-600 transition-colors">
        <Home size={13} />
      </Link>
      {crumbs.slice(1).map((crumb, i) => (
        <span key={crumb.path} className="flex items-center gap-1.5">
          <ChevronRight size={12} className="text-gray-300" />
          {i === crumbs.length - 2 ? (
            <span className="text-gray-700 font-medium">{crumb.label}</span>
          ) : (
            <Link
              href={crumb.path}
              className="hover:text-brand-600 transition-colors"
            >
              {crumb.label}
            </Link>
          )}
        </span>
      ))}
    </nav>
  );
}
