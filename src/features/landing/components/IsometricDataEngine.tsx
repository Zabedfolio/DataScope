import React from "react";

interface IsometricDataEngineProps {
  className?: string;
}

export function IsometricDataEngine({ className = "" }: IsometricDataEngineProps) {
  return (
    <div
      aria-hidden="true"
      className={`relative w-full select-none pointer-events-none transition-all duration-500 ${className}`}
    >
      <svg
        viewBox="420 120 560 480"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto overflow-visible text-slate-800 dark:text-slate-200"
      >
        <defs>
          {/* Theme Gradients */}
          <linearGradient id="emeraldGlow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00F5A0" />
            <stop offset="100%" stopColor="#00D69A" />
          </linearGradient>

          <linearGradient id="corePlatter" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E2E8F0" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#CBD5E1" stopOpacity="0.4" />
          </linearGradient>

          <linearGradient id="coreDarkCover" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1E293B" />
            <stop offset="100%" stopColor="#0F172A" />
          </linearGradient>

          {/* Isometric Grid Pattern */}
          <pattern
            id="isoGridPattern"
            width="60"
            height="34.64"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M0 17.32 L30 0 L60 17.32 L30 34.64 Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.75"
              className="text-slate-300/40 dark:text-slate-700/25"
            />
          </pattern>

          {/* Subtle Drop Shadow */}
          <filter id="isoShadow" x="-15%" y="-15%" width="130%" height="130%">
            <feDropShadow
              dx="0"
              dy="16"
              stdDeviation="20"
              floodColor="#00D69A"
              floodOpacity="0.12"
            />
          </filter>
        </defs>

        {/* ======================================================== */}
        {/* 1. BACKGROUND ISOMETRIC GRID PLANE                        */}
        {/* ======================================================== */}
        <g opacity="0.85">
          {/* Main isometric grid plane framed over the elements */}
          <ellipse
            cx="700"
            cy="360"
            rx="360"
            ry="220"
            fill="url(#isoGridPattern)"
            className="mask-[radial-gradient(ellipse_at_center,black_50%,transparent_80%)]"
          />

          {/* Perspective grid coordinate lines extending outward */}
          <path
            d="M 430 460 L 700 230 L 970 460 M 500 170 L 920 480 M 900 170 L 480 480"
            stroke="currentColor"
            strokeWidth="0.75"
            strokeDasharray="4 4"
            className="text-slate-300/60 dark:text-slate-700/40"
          />
        </g>

        {/* ======================================================== */}
        {/* 2. ISOMETRIC CONNECTIVE CIRCUIT TRACES                   */}
        {/* ======================================================== */}
        <g className="circuit-traces">
          {/* Trace from Database Tower to Core Engine */}
          <path
            d="M 580 290 L 580 340 L 610 357 L 660 330"
            stroke="currentColor"
            strokeWidth="1.5"
            className="text-slate-400 dark:text-slate-600"
          />

          {/* Main Bus from Core to Data Table Sheet */}
          <path
            d="M 640 430 L 640 470 L 690 500 L 720 482"
            stroke="currentColor"
            strokeWidth="1.5"
            className="text-slate-400 dark:text-slate-600"
          />

          {/* Trace from Core to Barcode Card */}
          <path
            d="M 610 405 L 560 435 L 560 455 L 540 467"
            stroke="currentColor"
            strokeWidth="1.5"
            className="text-slate-400 dark:text-slate-600"
          />

          {/* Active #00D69A Pulse Path (Animated Data Packets) */}
          <path
            id="dataPacketPath1"
            d="M 580 280 L 580 330 L 630 360 L 630 380"
            stroke="#00D69A"
            strokeWidth="2"
            strokeDasharray="6 8"
            className="animate-[dash_12s_linear_infinite]"
          />

          <path
            id="dataPacketPath2"
            d="M 670 410 L 670 450 L 740 490 L 780 470"
            stroke="#00D69A"
            strokeWidth="2"
            strokeDasharray="6 8"
            className="animate-[dash_15s_linear_infinite]"
          />

          {/* Connection Solder Nodes with #00D69A Center */}
          <g className="solder-nodes">
            {/* Node near Database */}
            <circle cx="580" cy="285" r="4.5" fill="white" className="dark:fill-slate-900" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="580" cy="285" r="2" fill="#00D69A" />

            {/* Node near Core input */}
            <circle cx="610" cy="357" r="4.5" fill="white" className="dark:fill-slate-900" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="610" cy="357" r="2" fill="#00D69A" />

            {/* Node near Table */}
            <circle cx="720" cy="482" r="4.5" fill="white" className="dark:fill-slate-900" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="720" cy="482" r="2" fill="#00D69A" />

            {/* Node near Barcode */}
            <circle cx="540" cy="467" r="4.5" fill="white" className="dark:fill-slate-900" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="540" cy="467" r="2" fill="#00D69A" />

            {/* Far right node pin */}
            <circle cx="890" cy="445" r="4.5" fill="white" className="dark:fill-slate-900" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="890" cy="445" r="2" fill="#00D69A" />
            <path d="M 830 480 L 890 445" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" className="text-slate-400 dark:text-slate-600" />
          </g>
        </g>

        {/* ======================================================== */}
        {/* 3. COMPONENT A: DATABASE CLUSTER TOWER (UPPER LEFT)       */}
        {/* ======================================================== */}
        <g id="databaseCluster" transform="translate(540, 160)" className="transition-transform duration-300 hover:-translate-y-1">
          {/* Top Face */}
          <polygon
            points="40,0 75,20 40,40 5,20"
            fill="white"
            className="fill-slate-100 dark:fill-slate-800"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          {/* Left Face (Segmented Server Tiers) */}
          <polygon
            points="5,20 40,40 40,140 5,120"
            fill="white"
            className="fill-slate-200/90 dark:fill-slate-900"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          {/* Right Face */}
          <polygon
            points="40,40 75,20 75,120 40,140"
            fill="white"
            className="fill-slate-300/80 dark:fill-slate-850"
            stroke="currentColor"
            strokeWidth="1.5"
          />

          {/* Server Rack Tier Division Lines on Left Face */}
          <line x1="5" y1="45" x2="40" y2="65" stroke="currentColor" strokeWidth="1.5" />
          <line x1="5" y1="70" x2="40" y2="90" stroke="currentColor" strokeWidth="1.5" />
          <line x1="5" y1="95" x2="40" y2="115" stroke="currentColor" strokeWidth="1.5" />

          {/* Right Face Division Lines */}
          <line x1="40" y1="65" x2="75" y2="45" stroke="currentColor" strokeWidth="1.5" />
          <line x1="40" y1="90" x2="75" y2="70" stroke="currentColor" strokeWidth="1.5" />
          <line x1="40" y1="115" x2="75" y2="95" stroke="currentColor" strokeWidth="1.5" />

          {/* Emerald Status Indicators */}
          <circle cx="20" cy="53" r="1.75" fill="#00D69A" />
          <circle cx="20" cy="78" r="1.75" fill="#00D69A" />
          <circle cx="20" cy="103" r="1.75" fill="#00D69A" />
          <circle cx="20" cy="128" r="1.75" fill="#00D69A" />
        </g>

        {/* Small Data Chip near database */}
        <g id="miniTagChip" transform="translate(490, 260)">
          <polygon
            points="25,0 50,14 25,28 0,14"
            fill="white"
            className="fill-white dark:fill-slate-900"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          {/* 3 mini dots */}
          <circle cx="15" cy="14" r="3" fill="currentColor" />
          <circle cx="25" cy="14" r="3" fill="#00D69A" />
          <rect x="33" y="10" width="8" height="3" rx="1.5" fill="currentColor" transform="rotate(30 37 11)" />
          <rect x="30" y="16" width="8" height="3" rx="1.5" fill="currentColor" transform="rotate(30 34 17)" />
        </g>

        {/* ======================================================== */}
        {/* 4. COMPONENT B: MECHANICAL & SILICON DATA ENGINE (CENTER) */}
        {/* ======================================================== */}
        <g id="centralDataEngine" transform="translate(610, 240)" filter="url(#isoShadow)">
          {/* Bottom Substrate Layer */}
          <polygon
            points="110,0 220,63 110,126 0,63"
            fill="white"
            className="fill-slate-100 dark:fill-slate-900"
            stroke="currentColor"
            strokeWidth="2"
          />
          {/* Extruded Depth */}
          <polygon
            points="0,63 110,126 110,146 0,83"
            fill="#CBD5E1"
            className="fill-slate-300 dark:fill-slate-950"
            stroke="currentColor"
            strokeWidth="2"
          />
          <polygon
            points="110,126 220,63 220,83 110,146"
            fill="#94A3B8"
            className="fill-slate-400 dark:fill-slate-800"
            stroke="currentColor"
            strokeWidth="2"
          />

          {/* Drive Chassis Cavity */}
          <polygon
            points="108,12 205,67 108,122 12,67"
            fill="white"
            className="fill-white dark:fill-slate-900"
            stroke="currentColor"
            strokeWidth="1.5"
          />

          {/* Half Cover Plate (Dark Isometric Shield) */}
          <polygon
            points="108,12 205,67 155,95 60,40"
            fill="url(#coreDarkCover)"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          {/* Circular indentation on dark cover */}
          <ellipse
            cx="135"
            cy="52"
            rx="18"
            ry="10"
            fill="#0F172A"
            stroke="#334155"
            strokeWidth="1"
          />

          {/* Circular Magnetic Platter (Exposed in Lower Half) */}
          <g transform="translate(82, 70)">
            {/* Platter Outer Ring */}
            <ellipse
              cx="0"
              cy="0"
              rx="36"
              ry="21"
              fill="url(#corePlatter)"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            {/* Concentric Platter Groove */}
            <ellipse
              cx="0"
              cy="0"
              rx="24"
              ry="14"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              strokeDasharray="2 2"
            />
            {/* Center Spindle Motor */}
            <ellipse
              cx="0"
              cy="0"
              rx="12"
              ry="7"
              fill="white"
              className="fill-white dark:fill-slate-800"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            {/* Spindle Accent Glow Pin */}
            <ellipse
              cx="0"
              cy="0"
              rx="5"
              ry="3"
              fill="#00D69A"
            />
            {/* 6 Peripheral Screws on Spindle */}
            <circle cx="-8" cy="-2" r="0.75" fill="currentColor" />
            <circle cx="8" cy="2" r="0.75" fill="currentColor" />
            <circle cx="-4" cy="5" r="0.75" fill="currentColor" />
            <circle cx="4" cy="-5" r="0.75" fill="currentColor" />

            {/* Actuator Arm with Magnetic Head */}
            <path
              d="M 28 -12 L 0 0"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <circle cx="28" cy="-12" r="3" fill="#00D69A" stroke="currentColor" strokeWidth="1" />
          </g>

          {/* Corner Screw Fixings on Chassis */}
          <circle cx="22" cy="65" r="2" fill="currentColor" />
          <circle cx="108" cy="18" r="2" fill="currentColor" />
          <circle cx="196" cy="68" r="2" fill="currentColor" />
          <circle cx="108" cy="116" r="2" fill="currentColor" />
        </g>

        {/* ======================================================== */}
        {/* 5. COMPONENT C: BARCODE SENSOR CARD (CENTER-LEFT)         */}
        {/* ======================================================== */}
        <g id="barcodeCard" transform="translate(490, 390)">
          {/* Card Base */}
          <polygon
            points="60,0 120,34 60,68 0,34"
            fill="white"
            className="fill-white dark:fill-slate-900"
            stroke="currentColor"
            strokeWidth="1.5"
          />

          {/* Barcode Stripes */}
          <g transform="translate(24, 16)">
            {/* Diagonal parallel barcode stripes */}
            <line x1="10" y1="0" x2="3" y2="14" stroke="currentColor" strokeWidth="3" />
            <line x1="16" y1="3" x2="9" y2="17" stroke="currentColor" strokeWidth="1.5" />
            <line x1="22" y1="6" x2="15" y2="20" stroke="currentColor" strokeWidth="2.5" />
            <line x1="28" y1="9" x2="21" y2="23" stroke="currentColor" strokeWidth="1" />
            <line x1="36" y1="13" x2="29" y2="27" stroke="currentColor" strokeWidth="3.5" />
            <line x1="44" y1="17" x2="37" y2="31" stroke="currentColor" strokeWidth="1.5" />
            <line x1="50" y1="20" x2="43" y2="34" stroke="currentColor" strokeWidth="2" />
          </g>

          {/* 4 Sensor Status Squares on Lower Edge */}
          <polygon points="18,36 24,39 20,41 14,38" fill="none" stroke="currentColor" strokeWidth="1" />
          <polygon points="26,40 32,43 28,45 22,42" fill="#00D69A" stroke="currentColor" strokeWidth="1" />
          <polygon points="34,44 40,47 36,49 30,46" fill="none" stroke="currentColor" strokeWidth="1" />
          <polygon points="42,48 48,51 44,53 38,50" fill="none" stroke="currentColor" strokeWidth="1" />
        </g>

        {/* Small Data Packet Indicator Tag */}
        <g id="miniTagRect" transform="translate(850, 240)">
          <polygon
            points="35,0 70,20 35,40 0,20"
            fill="white"
            className="fill-white dark:fill-slate-900"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <line x1="15" y1="16" x2="55" y2="16" stroke="currentColor" strokeWidth="1.5" />
          <line x1="20" y1="23" x2="50" y2="23" stroke="currentColor" strokeWidth="1" />
        </g>

        {/* ======================================================== */}
        {/* 6. COMPONENT D: DATA EXPLORER WINDOW SHEET (FOREGROUND)   */}
        {/* ======================================================== */}
        <g id="dataExplorerSheet" transform="translate(680, 410)" filter="url(#isoShadow)">
          {/* Card Base (Large Isometric Dashboard Window) */}
          <polygon
            points="140,0 280,80 140,160 0,80"
            fill="white"
            className="fill-white dark:fill-slate-900"
            stroke="currentColor"
            strokeWidth="2"
          />
          {/* Card Extrusion Depth */}
          <polygon
            points="0,80 140,160 140,172 0,92"
            fill="#E2E8F0"
            className="fill-slate-300 dark:fill-slate-950"
            stroke="currentColor"
            strokeWidth="2"
          />
          <polygon
            points="140,160 280,80 280,92 140,172"
            fill="#CBD5E1"
            className="fill-slate-400 dark:fill-slate-800"
            stroke="currentColor"
            strokeWidth="2"
          />

          {/* Top Window Header Bar with Control Dots */}
          <polygon
            points="140,0 280,80 240,103 100,23"
            fill="url(#coreDarkCover)"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <circle cx="125" cy="27" r="3" fill="#00D69A" />
          <circle cx="137" cy="34" r="3" fill="#CBD5E1" />
          <circle cx="149" cy="41" r="3" fill="#94A3B8" />

          {/* Left Table Section: Bold "A" Column Header */}
          <g transform="translate(90, 75)">
            <text
              x="0"
              y="0"
              fill="currentColor"
              fontSize="24"
              fontWeight="900"
              fontFamily="system-ui, -apple-system, sans-serif"
              transform="matrix(1 0.577 -0.577 1 0 0)"
            >
              A
            </text>
            {/* Table Row Lines */}
            <line x1="20" y1="12" x2="60" y2="35" stroke="currentColor" strokeWidth="1.5" />
            <line x1="25" y1="20" x2="55" y2="37" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
          </g>

          {/* Center Chart Section: Isometric Donut / Pie Chart */}
          <g transform="translate(150, 115)">
            {/* Pie Outer Ellipse */}
            <ellipse
              cx="0"
              cy="0"
              rx="22"
              ry="13"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            {/* Highlighted Pie Segment in #00D69A */}
            <path
              d="M 0 0 L 16 9 A 22 13 0 0 1 -18 7 Z"
              fill="#00D69A"
              stroke="currentColor"
              strokeWidth="1"
            />
            <line x1="0" y1="0" x2="0" y2="-13" stroke="currentColor" strokeWidth="1.5" />
            <line x1="0" y1="0" x2="16" y2="9" stroke="currentColor" strokeWidth="1.5" />
            <line x1="0" y1="0" x2="-18" y2="7" stroke="currentColor" strokeWidth="1.5" />
          </g>

          {/* Right Section: Metric Grid Cells & Switches */}
          <g transform="translate(195, 75)">
            {/* 2x2 Isometric Cells */}
            <polygon points="20,0 40,11.5 20,23 0,11.5" fill="none" stroke="currentColor" strokeWidth="1" />
            <polygon points="40,11.5 60,23 40,34.5 20,23" fill="none" stroke="currentColor" strokeWidth="1" />
            <polygon points="20,23 40,34.5 20,46 0,34.5" fill="none" stroke="currentColor" strokeWidth="1" />
            <polygon points="40,34.5 60,46 40,57.5 20,46" fill="#00D69A" fillOpacity="0.25" stroke="currentColor" strokeWidth="1" />

            {/* Checkmark in cell */}
            <path d="M 28 8 L 33 13 L 42 5" stroke="#00D69A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        </g>
      </svg>
    </div>
  );
}

