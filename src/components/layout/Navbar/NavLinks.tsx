"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export interface NavItem {
  label: string;
  href: string;
}

export const NAV_ITEMS: NavItem[] = [
  { label: "Overview", href: "/dashboard" },
  { label: "Datasets", href: "/datasets" },
  { label: "Data Explorer", href: "/explorer" },
  { label: "Advanced Search", href: "/search" },
  { label: "Saved Views", href: "/views" },
];

interface NavLinksProps {
  className?: string;
  onItemClick?: () => void;
}

export function NavLinks({ className = "", onItemClick }: NavLinksProps) {
  const pathname = usePathname();

  return (
    <ul className={`flex items-center gap-1 sm:gap-2 ${className}`}>
      {NAV_ITEMS.map((item) => {
        const isActive = pathname === item.href;
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              onClick={onItemClick}
              aria-current={isActive ? "page" : undefined}
              className={`relative px-3.5 py-1.5 text-sm font-medium transition-all rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                isActive
                  ? "text-white font-bold bg-slate-800/80 shadow-sm"
                  : "text-slate-300 hover:text-white hover:bg-slate-800/50"
              }`}
            >
              {item.label}
              {isActive && (
                <span
                  className="absolute bottom-0 left-3 right-3 h-0.5 bg-primary rounded-full shadow-[0_0_8px_rgba(0,214,154,0.6)]"
                  aria-hidden="true"
                />
              )}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
