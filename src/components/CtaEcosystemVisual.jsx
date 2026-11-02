import React from 'react';
import {
  Users,
  ShieldCheck,
  BarChart3,
  Calendar,
  Cloud,
  FileText,
} from 'lucide-react';

export default function CtaEcosystemVisual() {
  const cards = [
    {
      id: 1,
      name: 'Workspace / Tasks',
      icon: FileText,
      gradient: 'from-fuchsia-500 to-pink-600',
      duration: '10.5s',
    },
    {
      id: 2,
      name: 'Security',
      icon: ShieldCheck,
      gradient: 'from-emerald-400 to-teal-500',
      duration: '10s',
    },
    {
      id: 3,
      name: 'Collaboration',
      icon: Users,
      gradient: 'from-orange-500 to-rose-500',
      duration: '8s',
    },
    {
      id: 4,
      name: 'Analytics',
      icon: BarChart3,
      gradient: 'from-purple-500 to-indigo-600',
      duration: '9s',
    },
    {
      id: 5,
      name: 'Calendar',
      icon: Calendar,
      gradient: 'from-sky-400 to-blue-600',
      duration: '11s',
    },
    {
      id: 6,
      name: 'Cloud',
      icon: Cloud,
      gradient: 'from-cyan-400 to-blue-500',
      duration: '8.5s',
    },
  ];

  return (
    <div className="cta-ecosystem-wrapper relative w-full max-w-[560px] h-[380px] sm:h-[420px] md:h-[450px] mx-auto flex items-center justify-center select-none overflow-visible">
      {/* Component Styles & GPU-accelerated Keyframes */}
      <style>{`
        /* Central Cube Floating Animation */
        @keyframes hubFloat {
          0% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-9px);
          }
          100% {
            transform: translateY(0px);
          }
        }
        .animate-hub-float {
          animation: hubFloat 4.5s ease-in-out infinite;
        }

        /* Subtle Slow Rotating Ring */
        @keyframes ringSpin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        .animate-ring-spin {
          animation: ringSpin 35s linear infinite;
          transform-origin: 260px 225px;
        }

        /* Moving Energy Pulse Along Connection Lines */
        @keyframes dashPulse {
          0% {
            stroke-dashoffset: 80;
          }
          100% {
            stroke-dashoffset: 0;
          }
        }
        .animate-dash-pulse {
          animation: dashPulse 2.8s linear infinite;
        }

        /* Floating Glow Particle Pulsing */
        @keyframes particleGlow {
          0%, 100% {
            transform: scale(0.85);
            opacity: 0.6;
          }
          50% {
            transform: scale(1.3);
            opacity: 1;
          }
        }
        .animate-particle-glow {
          animation: particleGlow 3s ease-in-out infinite;
        }

        /* 6 Orbital Paths (Elliptical 3D perspective, smooth closed loops) */
        /* Card 1: Workspace / Tasks (Top-Left) */
        @keyframes orbit-card-1 {
          0.0% { transform: translate3d(-141.7px, -51.4px, 0) scale(0.95); z-index: 10; opacity: 0.88; }
          6.3% { transform: translate3d(-80.7px, -71.9px, 0) scale(0.93); z-index: 10; opacity: 0.84; }
          12.5% { transform: translate3d(-8.7px, -79.9px, 0) scale(0.92); z-index: 10; opacity: 0.82; }
          18.8% { transform: translate3d(64.7px, -74.9px, 0) scale(0.93); z-index: 10; opacity: 0.83; }
          25.0% { transform: translate3d(128.0px, -57.8px, 0) scale(0.94); z-index: 10; opacity: 0.87; }
          31.3% { transform: translate3d(170.8px, -30.6px, 0) scale(0.97); z-index: 10; opacity: 0.93; }
          37.5% { transform: translate3d(184.8px, 3.8px, 0) scale(1.00); z-index: 30; opacity: 1.00; }
          43.8% { transform: translate3d(170.2px, 37.7px, 0) scale(1.04); z-index: 30; opacity: 1.00; }
          50.0% { transform: translate3d(141.7px, 51.4px, 0) scale(1.05); z-index: 30; opacity: 1.00; }
          56.3% { transform: translate3d(80.7px, 71.9px, 0) scale(1.07); z-index: 30; opacity: 1.00; }
          62.5% { transform: translate3d(8.7px, 79.9px, 0) scale(1.08); z-index: 30; opacity: 1.00; }
          68.8% { transform: translate3d(-64.7px, 74.9px, 0) scale(1.07); z-index: 30; opacity: 1.00; }
          75.0% { transform: translate3d(-128.0px, 57.8px, 0) scale(1.06); z-index: 30; opacity: 1.00; }
          81.3% { transform: translate3d(-170.8px, 30.6px, 0) scale(1.03); z-index: 30; opacity: 1.00; }
          87.5% { transform: translate3d(-184.8px, -3.8px, 0) scale(1.00); z-index: 10; opacity: 0.99; }
          93.8% { transform: translate3d(-170.2px, -37.7px, 0) scale(0.96); z-index: 10; opacity: 0.92; }
          100.0% { transform: translate3d(-141.7px, -51.4px, 0) scale(0.95); z-index: 10; opacity: 0.88; }
        }

        /* Card 2: Security (Top-Right) */
        @keyframes orbit-card-2 {
          0.0% { transform: translate3d(167.9px, 51.6px, 0) scale(1.05); z-index: 30; opacity: 1.00; }
          6.3% { transform: translate3d(110.1px, 75.9px, 0) scale(1.07); z-index: 30; opacity: 1.00; }
          12.5% { transform: translate3d(35.6px, 88.6px, 0) scale(1.08); z-index: 30; opacity: 1.00; }
          18.8% { transform: translate3d(-44.4px, 87.9px, 0) scale(1.08); z-index: 30; opacity: 1.00; }
          25.0% { transform: translate3d(-117.6px, 73.7px, 0) scale(1.07); z-index: 30; opacity: 1.00; }
          31.3% { transform: translate3d(-172.9px, 48.4px, 0) scale(1.04); z-index: 30; opacity: 1.00; }
          37.5% { transform: translate3d(-201.9px, 15.6px, 0) scale(1.01); z-index: 30; opacity: 1.00; }
          43.8% { transform: translate3d(-200.1px, -19.5px, 0) scale(0.98); z-index: 10; opacity: 0.96; }
          50.0% { transform: translate3d(-167.9px, -51.6px, 0) scale(0.95); z-index: 10; opacity: 0.90; }
          56.3% { transform: translate3d(-110.1px, -75.9px, 0) scale(0.93); z-index: 10; opacity: 0.85; }
          62.5% { transform: translate3d(-35.6px, -88.6px, 0) scale(0.92); z-index: 10; opacity: 0.82; }
          68.8% { transform: translate3d(44.4px, -87.9px, 0) scale(0.92); z-index: 10; opacity: 0.82; }
          75.0% { transform: translate3d(117.6px, -73.7px, 0) scale(0.93); z-index: 10; opacity: 0.85; }
          81.3% { transform: translate3d(172.9px, -48.4px, 0) scale(0.96); z-index: 10; opacity: 0.90; }
          87.5% { transform: translate3d(201.9px, -15.6px, 0) scale(0.99); z-index: 10; opacity: 0.97; }
          93.8% { transform: translate3d(200.1px, 19.5px, 0) scale(1.02); z-index: 30; opacity: 1.00; }
          100.0% { transform: translate3d(167.9px, 51.6px, 0) scale(1.05); z-index: 30; opacity: 1.00; }
        }

        /* Card 3: Collaboration (Mid-Left) */
        @keyframes orbit-card-3 {
          0.0% { transform: translate3d(-219.2px, -8.3px, 0) scale(0.99); z-index: 10; opacity: 0.98; }
          6.3% { transform: translate3d(-195.1px, -43.9px, 0) scale(0.96); z-index: 10; opacity: 0.92; }
          12.5% { transform: translate3d(-141.4px, -72.8px, 0) scale(0.94); z-index: 10; opacity: 0.86; }
          18.8% { transform: translate3d(-66.2px, -90.6px, 0) scale(0.92); z-index: 10; opacity: 0.83; }
          25.0% { transform: translate3d(19.2px, -94.6px, 0) scale(0.92); z-index: 10; opacity: 0.82; }
          31.3% { transform: translate3d(101.6px, -84.3px, 0) scale(0.93); z-index: 10; opacity: 0.84; }
          37.5% { transform: translate3d(168.5px, -61.1px, 0) scale(0.95); z-index: 10; opacity: 0.88; }
          43.8% { transform: translate3d(209.8px, -28.6px, 0) scale(0.98); z-index: 10; opacity: 0.95; }
          50.0% { transform: translate3d(219.2px, 8.3px, 0) scale(1.01); z-index: 30; opacity: 1.00; }
          56.3% { transform: translate3d(195.1px, 43.9px, 0) scale(1.04); z-index: 30; opacity: 1.00; }
          62.5% { transform: translate3d(141.4px, 72.8px, 0) scale(1.06); z-index: 30; opacity: 1.00; }
          68.8% { transform: translate3d(66.2px, 90.6px, 0) scale(1.08); z-index: 30; opacity: 1.00; }
          75.0% { transform: translate3d(-19.2px, 94.6px, 0) scale(1.08); z-index: 30; opacity: 1.00; }
          81.3% { transform: translate3d(-101.6px, 84.3px, 0) scale(1.07); z-index: 30; opacity: 1.00; }
          87.5% { transform: translate3d(-168.5px, 61.1px, 0) scale(1.05); z-index: 30; opacity: 1.00; }
          93.8% { transform: translate3d(-209.8px, 28.6px, 0) scale(1.02); z-index: 30; opacity: 1.00; }
          100.0% { transform: translate3d(-219.2px, -8.3px, 0) scale(0.99); z-index: 10; opacity: 0.98; }
        }

        /* Card 4: Analytics (Bottom-Left) */
        @keyframes orbit-card-4 {
          0.0% { transform: translate3d(-125.3px, -65.1px, 0) scale(0.94); z-index: 10; opacity: 0.86; }
          6.3% { transform: translate3d(-58.6px, -81.1px, 0) scale(0.92); z-index: 10; opacity: 0.83; }
          12.5% { transform: translate3d(17.0px, -84.7px, 0) scale(0.92); z-index: 10; opacity: 0.82; }
          18.8% { transform: translate3d(90.0px, -75.4px, 0) scale(0.93); z-index: 10; opacity: 0.84; }
          25.0% { transform: translate3d(149.4px, -54.6px, 0) scale(0.95); z-index: 10; opacity: 0.88; }
          31.3% { transform: translate3d(186.0px, -25.6px, 0) scale(0.98); z-index: 10; opacity: 0.95; }
          37.5% { transform: translate3d(194.3px, 7.4px, 0) scale(1.01); z-index: 30; opacity: 1.00; }
          43.8% { transform: translate3d(173.0px, 39.2px, 0) scale(1.04); z-index: 30; opacity: 1.00; }
          50.0% { transform: translate3d(125.3px, 65.1px, 0) scale(1.06); z-index: 30; opacity: 1.00; }
          56.3% { transform: translate3d(58.6px, 81.1px, 0) scale(1.08); z-index: 30; opacity: 1.00; }
          62.5% { transform: translate3d(-17.0px, 84.7px, 0) scale(1.08); z-index: 30; opacity: 1.00; }
          68.8% { transform: translate3d(-90.0px, 75.4px, 0) scale(1.07); z-index: 30; opacity: 1.00; }
          75.0% { transform: translate3d(-149.4px, 54.6px, 0) scale(1.05); z-index: 30; opacity: 1.00; }
          81.3% { transform: translate3d(-186.0px, 25.6px, 0) scale(1.02); z-index: 30; opacity: 1.00; }
          87.5% { transform: translate3d(-194.3px, -7.4px, 0) scale(0.99); z-index: 10; opacity: 0.98; }
          93.8% { transform: translate3d(-173.0px, -39.2px, 0) scale(0.96); z-index: 10; opacity: 0.92; }
          100.0% { transform: translate3d(-125.3px, -65.1px, 0) scale(0.94); z-index: 10; opacity: 0.86; }
        }

        /* Card 5: Calendar (Mid-Right) */
        @keyframes orbit-card-5 {
          0.0% { transform: translate3d(224.1px, 8.7px, 0) scale(1.01); z-index: 30; opacity: 1.00; }
          6.3% { transform: translate3d(199.6px, 46.2px, 0) scale(1.04); z-index: 30; opacity: 1.00; }
          12.5% { transform: translate3d(144.6px, 76.6px, 0) scale(1.06); z-index: 30; opacity: 1.00; }
          18.8% { transform: translate3d(67.7px, 95.4px, 0) scale(1.08); z-index: 30; opacity: 1.00; }
          25.0% { transform: translate3d(-19.6px, 99.6px, 0) scale(1.08); z-index: 30; opacity: 1.00; }
          31.3% { transform: translate3d(-103.9px, 88.7px, 0) scale(1.07); z-index: 30; opacity: 1.00; }
          37.5% { transform: translate3d(-172.4px, 64.3px, 0) scale(1.05); z-index: 30; opacity: 1.00; }
          43.8% { transform: translate3d(-214.6px, 30.1px, 0) scale(1.02); z-index: 30; opacity: 1.00; }
          50.0% { transform: translate3d(-224.1px, -8.7px, 0) scale(0.99); z-index: 10; opacity: 0.98; }
          56.3% { transform: translate3d(-199.6px, -46.2px, 0) scale(0.96); z-index: 10; opacity: 0.92; }
          62.5% { transform: translate3d(-144.6px, -76.6px, 0) scale(0.94); z-index: 10; opacity: 0.86; }
          68.8% { transform: translate3d(-67.7px, -95.4px, 0) scale(0.92); z-index: 10; opacity: 0.83; }
          75.0% { transform: translate3d(19.6px, -99.6px, 0) scale(0.92); z-index: 10; opacity: 0.82; }
          81.3% { transform: translate3d(103.9px, -88.7px, 0) scale(0.93); z-index: 10; opacity: 0.84; }
          87.5% { transform: translate3d(172.4px, -64.3px, 0) scale(0.95); z-index: 10; opacity: 0.88; }
          93.8% { transform: translate3d(214.6px, -30.1px, 0) scale(0.98); z-index: 10; opacity: 0.95; }
          100.0% { transform: translate3d(224.1px, 8.7px, 0) scale(1.01); z-index: 30; opacity: 1.00; }
        }

        /* Card 6: Cloud (Bottom-Right) */
        @keyframes orbit-card-6 {
          0.0% { transform: translate3d(141.4px, -62.2px, 0) scale(0.94); z-index: 10; opacity: 0.87; }
          6.3% { transform: translate3d(184.8px, -33.7px, 0) scale(0.97); z-index: 10; opacity: 0.93; }
          12.5% { transform: translate3d(200.0px, -0.0px, 0) scale(1.00); z-index: 10; opacity: 1.00; }
          18.8% { transform: translate3d(184.8px, 33.7px, 0) scale(1.03); z-index: 30; opacity: 1.00; }
          25.0% { transform: translate3d(141.4px, 62.2px, 0) scale(1.06); z-index: 30; opacity: 1.00; }
          31.3% { transform: translate3d(76.5px, 81.3px, 0) scale(1.07); z-index: 30; opacity: 1.00; }
          37.5% { transform: translate3d(0.0px, 88.0px, 0) scale(1.08); z-index: 30; opacity: 1.00; }
          43.8% { transform: translate3d(-76.5px, 81.3px, 0) scale(1.07); z-index: 30; opacity: 1.00; }
          50.0% { transform: translate3d(-141.4px, 62.2px, 0) scale(1.06); z-index: 30; opacity: 1.00; }
          56.3% { transform: translate3d(-184.8px, 33.7px, 0) scale(1.03); z-index: 30; opacity: 1.00; }
          62.5% { transform: translate3d(-200.0px, 0.0px, 0) scale(1.00); z-index: 30; opacity: 1.00; }
          68.8% { transform: translate3d(-184.8px, -33.7px, 0) scale(0.97); z-index: 10; opacity: 0.93; }
          75.0% { transform: translate3d(-141.4px, -62.2px, 0) scale(0.94); z-index: 10; opacity: 0.87; }
          81.3% { transform: translate3d(-76.5px, -81.3px, 0) scale(0.93); z-index: 10; opacity: 0.83; }
          87.5% { transform: translate3d(-0.0px, -88.0px, 0) scale(0.92); z-index: 10; opacity: 0.82; }
          93.8% { transform: translate3d(76.5px, -81.3px, 0) scale(0.93); z-index: 10; opacity: 0.83; }
          100.0% { transform: translate3d(141.4px, -62.2px, 0) scale(0.94); z-index: 10; opacity: 0.87; }
        }

        /* Hover Pause to allow easy inspection */
        .cta-ecosystem-wrapper:hover .orbit-card-animated {
          animation-play-state: paused;
        }

        /* Respect prefers-reduced-motion */
        @media (prefers-reduced-motion: reduce) {
          .animate-hub-float,
          .animate-ring-spin,
          .animate-dash-pulse,
          .animate-particle-glow,
          .orbit-card-animated {
            animation: none !important;
          }
        }
      `}</style>

      {/* Layer 1: Ambient Radial Glow & Background Light Fields */}
      <div className="absolute w-72 sm:w-96 h-72 sm:h-96 rounded-full bg-cyan-400/20 blur-3xl pointer-events-none -z-10" />
      <div className="absolute w-60 sm:w-80 h-60 sm:h-80 rounded-full bg-blue-600/30 blur-2xl pointer-events-none -z-10" />
      <div className="absolute w-44 h-44 rounded-full bg-purple-500/20 blur-2xl pointer-events-none -z-10" />

      {/* Layer 2: SVG Graphics (Orbit Rings, Curved Connections, Pedestals, Cube) */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none z-10"
        viewBox="0 0 520 440"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {/* Glow Filters */}
          <filter id="hubGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="starGlow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="particleHalo" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Gradients */}
          <linearGradient id="lineGradCyan" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#818cf8" stopOpacity="0.25" />
          </linearGradient>

          <linearGradient id="lineGradPurple" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#c084fc" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.2" />
          </linearGradient>

          {/* 3D Isometric Cube Face Gradients */}
          <linearGradient id="cubeTopGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
            <stop offset="55%" stopColor="#bae6fd" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.4" />
          </linearGradient>

          <linearGradient id="cubeLeftGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#0284c7" stopOpacity="0.95" />
          </linearGradient>

          <linearGradient id="cubeRightGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#1e3a8a" stopOpacity="0.9" />
          </linearGradient>

          {/* Pedestal Gradients */}
          <linearGradient id="pedestalGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#1e40af" stopOpacity="0.6" />
          </linearGradient>
          <linearGradient id="pedestalGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7dd3fc" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#0284c7" stopOpacity="0.7" />
          </linearGradient>
        </defs>

        {/* --- ORBITAL TRACKS --- */}
        {/* Outer Orbit Path */}
        <ellipse
          cx="260"
          cy="225"
          rx="235"
          ry="105"
          fill="none"
          stroke="rgba(147, 197, 253, 0.2)"
          strokeWidth="1"
          strokeDasharray="4 6"
        />

        {/* Middle Orbit Path */}
        <ellipse
          cx="260"
          cy="225"
          rx="205"
          ry="92"
          fill="none"
          stroke="rgba(56, 189, 248, 0.3)"
          strokeWidth="1.2"
          strokeDasharray="6 8"
        />

        {/* Inner Orbit Path */}
        <ellipse
          cx="260"
          cy="225"
          rx="170"
          ry="78"
          fill="none"
          stroke="rgba(192, 132, 252, 0.2)"
          strokeWidth="1"
          strokeDasharray="3 5"
        />

        {/* Rotating Hub Outer Halo Ring */}
        <ellipse
          cx="260"
          cy="225"
          rx="125"
          ry="55"
          fill="none"
          stroke="#38bdf8"
          strokeWidth="1"
          strokeDasharray="16 12 4 12"
          strokeOpacity="0.4"
          className="animate-ring-spin"
        />

        {/* --- CURVED CONNECTION LINES WITH TRAVELING LIGHT PULSE --- */}
        {/* Base Faint Lines */}
        <path d="M 260 225 Q 185 195 118 150" fill="none" stroke="rgba(56,189,248,0.25)" strokeWidth="1" />
        <path d="M 260 225 Q 335 195 402 140" fill="none" stroke="rgba(56,189,248,0.25)" strokeWidth="1" />
        <path d="M 260 225 Q 155 225 55 225" fill="none" stroke="rgba(168,85,247,0.25)" strokeWidth="1" />
        <path d="M 260 225 Q 365 225 465 230" fill="none" stroke="rgba(56,189,248,0.25)" strokeWidth="1" />
        <path d="M 260 225 Q 185 275 125 310" fill="none" stroke="rgba(168,85,247,0.25)" strokeWidth="1" />
        <path d="M 260 225 Q 335 275 395 305" fill="none" stroke="rgba(56,189,248,0.25)" strokeWidth="1" />

        {/* Animated Pulsing Light Streams */}
        <path
          d="M 260 225 Q 185 195 118 150"
          fill="none"
          stroke="url(#lineGradCyan)"
          strokeWidth="1.8"
          strokeDasharray="10 70"
          className="animate-dash-pulse"
        />
        <path
          d="M 260 225 Q 335 195 402 140"
          fill="none"
          stroke="url(#lineGradCyan)"
          strokeWidth="1.8"
          strokeDasharray="10 70"
          className="animate-dash-pulse"
          style={{ animationDelay: '1.4s' }}
        />
        <path
          d="M 260 225 Q 155 225 55 225"
          fill="none"
          stroke="url(#lineGradPurple)"
          strokeWidth="1.8"
          strokeDasharray="10 70"
          className="animate-dash-pulse"
          style={{ animationDelay: '2.1s' }}
        />
        <path
          d="M 260 225 Q 365 225 465 230"
          fill="none"
          stroke="url(#lineGradCyan)"
          strokeWidth="1.8"
          strokeDasharray="10 70"
          className="animate-dash-pulse"
          style={{ animationDelay: '0.7s' }}
        />
        <path
          d="M 260 225 Q 185 275 125 310"
          fill="none"
          stroke="url(#lineGradPurple)"
          strokeWidth="1.8"
          strokeDasharray="10 70"
          className="animate-dash-pulse"
          style={{ animationDelay: '1.8s' }}
        />
        <path
          d="M 260 225 Q 335 275 395 305"
          fill="none"
          stroke="url(#lineGradCyan)"
          strokeWidth="1.8"
          strokeDasharray="10 70"
          className="animate-dash-pulse"
          style={{ animationDelay: '2.8s' }}
        />

        {/* --- GLOWING PARTICLES & NODES ON ORBITS --- */}
        <circle cx="118" cy="150" r="3.5" fill="#f472b6" filter="url(#particleHalo)" className="animate-particle-glow" />
        <circle cx="402" cy="140" r="3.5" fill="#34d399" filter="url(#particleHalo)" className="animate-particle-glow" style={{ animationDelay: '0.8s' }} />
        <circle cx="55" cy="225" r="3.5" fill="#fb923c" filter="url(#particleHalo)" className="animate-particle-glow" style={{ animationDelay: '1.5s' }} />
        <circle cx="465" cy="230" r="3.5" fill="#60a5fa" filter="url(#particleHalo)" className="animate-particle-glow" style={{ animationDelay: '2.2s' }} />
        <circle cx="125" cy="310" r="3.5" fill="#a78bfa" filter="url(#particleHalo)" className="animate-particle-glow" style={{ animationDelay: '0.5s' }} />
        <circle cx="395" cy="305" r="3.5" fill="#38bdf8" filter="url(#particleHalo)" className="animate-particle-glow" style={{ animationDelay: '2.5s' }} />

        {/* Extra Ambient Floating Sparkles */}
        <circle cx="210" cy="110" r="1.5" fill="#bae6fd" opacity="0.7" />
        <circle cx="330" cy="105" r="2" fill="#ffffff" opacity="0.8" />
        <circle cx="170" cy="350" r="1.5" fill="#c084fc" opacity="0.6" />
        <circle cx="340" cy="355" r="2" fill="#38bdf8" opacity="0.8" />

        {/* --- CENTRAL LAYERED ISOMETRIC PEDESTAL --- */}
        <g transform="translate(0, 18)">
          {/* Bottom Isometric Diamond Plate */}
          <polygon
            points="260,268 344,298 260,328 176,298"
            fill="url(#pedestalGrad1)"
            stroke="#38bdf8"
            strokeWidth="1.2"
            strokeOpacity="0.5"
            filter="url(#hubGlow)"
          />
          {/* Middle Plate */}
          <polygon
            points="260,250 326,276 260,302 194,276"
            fill="url(#pedestalGrad2)"
            stroke="#7dd3fc"
            strokeWidth="1.2"
            strokeOpacity="0.7"
          />
          {/* Top Platform Plate */}
          <polygon
            points="260,234 310,255 260,276 210,255"
            fill="rgba(56, 189, 248, 0.45)"
            stroke="#ffffff"
            strokeWidth="1"
            strokeOpacity="0.8"
          />
        </g>

        {/* --- FLOATING 3D TRANSLUCENT GLASS CUBE & UNIFIED PLATFORM SYMBOL --- */}
        <g className="animate-hub-float">
          {/* Core Ambient Bloom */}
          <circle cx="260" cy="178" r="48" fill="rgba(56, 189, 248, 0.28)" filter="url(#starGlow)" />
          <circle cx="260" cy="178" r="26" fill="rgba(255, 255, 255, 0.25)" filter="url(#hubGlow)" />

          {/* Cube Left Face (Isometric Skew) */}
          <polygon
            points="218,153 260,178 260,228 218,203"
            fill="url(#cubeLeftGrad)"
            stroke="#7dd3fc"
            strokeWidth="1.2"
            strokeOpacity="0.7"
          />

          {/* Cube Right Face (Isometric Skew) */}
          <polygon
            points="260,178 302,153 302,203 260,228"
            fill="url(#cubeRightGrad)"
            stroke="#93c5fd"
            strokeWidth="1.2"
            strokeOpacity="0.7"
          />

          {/* Cube Top Face (Isometric Skew) */}
          <polygon
            points="260,128 302,153 260,178 218,153"
            fill="url(#cubeTopGrad)"
            stroke="#ffffff"
            strokeWidth="1.5"
            strokeOpacity="0.9"
          />

          {/* Glass Top Sheen Corner Accent */}
          <polygon
            points="260,131 292,150 260,169 228,150"
            fill="rgba(255, 255, 255, 0.25)"
          />

          {/* Radiant Unified Platform Symbol (Abstract 4-Point Technology Star) */}
          <path
            d="M 260 163 Q 260 178 245 178 Q 260 178 260 193 Q 260 178 275 178 Q 260 178 260 163 Z"
            fill="#ffffff"
            filter="url(#starGlow)"
          />
          <circle cx="260" cy="178" r="3" fill="#ffffff" />
        </g>
      </svg>

      {/* Layer 3: The 6 Floating Glassmorphic Cards Orbiting Smoothly Around Center */}
      <div className="absolute inset-0 pointer-events-none z-20">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.id}
              className="orbit-card-animated absolute left-1/2 top-1/2 -ml-[68px] sm:-ml-[74px] -mt-[24px] sm:-mt-[26px] pointer-events-auto cursor-pointer"
              style={{
                animation: `orbit-card-${card.id} ${card.duration} linear infinite`,
              }}
              title={card.name}
            >
              <div className="group bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/35 hover:border-white/60 rounded-2xl px-2.5 sm:px-3 py-2 sm:py-2.5 shadow-[0_8px_32px_rgba(0,10,40,0.35)] flex items-center space-x-2.5 transition-all duration-300 hover:scale-110 hover:shadow-[0_0_24px_rgba(56,189,248,0.5)]">
                {/* Colored Icon Badge */}
                <div
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center text-white shadow-md bg-gradient-to-br ${card.gradient} flex-shrink-0 group-hover:rotate-6 transition-transform`}
                >
                  <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
                {/* Two Clean Placeholder Lines */}
                <div className="space-y-1 pr-1">
                  <div className="h-1.5 w-10 sm:w-12 bg-white/60 rounded-full group-hover:bg-white/90 transition-colors" />
                  <div className="h-1.5 w-6 sm:w-7 bg-white/30 rounded-full group-hover:bg-white/60 transition-colors" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
