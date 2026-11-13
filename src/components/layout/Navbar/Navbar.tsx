import React from "react";
import { NavBrand } from "./NavBrand";
import { NavLinks } from "./NavLinks";
import { NavActions } from "./NavActions";
import { MobileMenu } from "./MobileMenu";

export function Navbar() {
  return (
    <header
      role="banner"
      className="sticky top-4 z-40 w-full px-4 sm:px-6 lg:px-8 pointer-events-none"
    >
      <div className="max-w-7xl mx-auto bg-slate-900/95 backdrop-blur-md border border-slate-800/80 shadow-[0_8px_32px_-4px_rgba(0,0,0,0.3),0_2px_8px_rgba(0,0,0,0.15)] rounded-2xl px-4 sm:px-6 h-16 flex items-center justify-between gap-4 transition-all pointer-events-auto">
        {/* Brand Logo & Name */}
        <div className="flex-shrink-0">
          <NavBrand />
        </div>

        {/* Desktop Primary Navigation Links */}
        <nav
          className="hidden md:flex items-center justify-center flex-1"
          aria-label="Desktop Primary Navigation"
        >
          <NavLinks />
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center flex-shrink-0">
          <NavActions />
        </div>

        {/* Mobile Hamburger Menu & Actions */}
        <div className="md:hidden flex items-center">
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
