import React from "react";
import Link from "next/link";
import Image from "next/image";

export function NavBrand() {
  return (
    <Link
      href="/"
      className="group flex items-center gap-3 text-white hover:opacity-95 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg py-1 px-1.5"
      aria-label="DataScope Homepage"
    >
      <div className="relative w-9 h-9 flex-shrink-0 transition-transform group-hover:scale-105 duration-200">
        <Image
          src="/datascope.png"
          alt="DataScope Logo"
          width={36}
          height={36}
          priority
          className="w-full h-full object-contain drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]"
        />
      </div>
      <div className="flex items-center gap-1.5">
        <span className="font-extrabold text-xl tracking-tight text-white group-hover:text-primary transition-colors">
          DataScope
        </span>
      </div>
    </Link>
  );
}
