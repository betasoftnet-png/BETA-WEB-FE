import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useReducedMotion } from 'framer-motion';
import {
  Handshake,
  Award,
  CheckCircle2,
  AlertCircle,
  Users,
  Layers,
  Globe,
  Building,
  ArrowRight,
  Code2,
  Cpu,
  Zap,
  FileText,
  ChevronLeft,
  ChevronRight,
  Compass,
  BarChart2
} from 'lucide-react';
import api from '../api';

// Statistics Section with live count-up animation and IntersectionObserver
function StatisticsSection() {
  const [ecosystemPartners, setEcosystemPartners] = useState(1);
  const [integrationsBuilt, setIntegrationsBuilt] = useState(1);
  const [countriesServed, setCountriesServed] = useState(1);
  const [platformSla, setPlatformSla] = useState(1);
  const [isComplete, setIsComplete] = useState(false);

  const sectionRef = useRef(null);
  const hasAnimated = useRef(false);
  const animFrameRef = useRef(null);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    const startAnimation = () => {
      if (hasAnimated.current) return;
      hasAnimated.current = true;

      const duration = 2000; // 2 seconds
      const startTime = performance.now();

      // Ease-out cubic calculation: starts fast and gradually slows near final value
      const easeOut = (t) => 1 - Math.pow(1 - t, 3);

      const animate = (currentTime) => {
        const elapsed = currentTime - startTime;
        const linearProgress = Math.min(elapsed / duration, 1);
        const progress = easeOut(linearProgress);

        // Update animated values every frame
        setEcosystemPartners(1 + progress * (100 - 1));
        setIntegrationsBuilt(1 + progress * (50 - 1));
        setCountriesServed(1 + progress * (20 - 1));
        setPlatformSla(1 + progress * (99.9 - 1));

        if (linearProgress < 1) {
          animFrameRef.current = requestAnimationFrame(animate);
        } else {
          // Reached target: exact values and complete flag
          setEcosystemPartners(100);
          setIntegrationsBuilt(50);
          setCountriesServed(20);
          setPlatformSla(99.9);
          setIsComplete(true);
        }
      };

      animFrameRef.current = requestAnimationFrame(animate);
    };

    // Trigger animation when the section enters the viewport
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0] && entries[0].isIntersecting) {
          startAnimation();
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={sectionRef}
      className="relative py-14 sm:py-20 my-6 border-t border-b border-[#D6E6F8] overflow-hidden -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8"
    >
      {/* Subtle Decorative Background Elements */}
      {/* Left Large Translucent Blur & Circular Accents */}
      <div className="absolute -left-20 top-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-blue-300/25 blur-3xl pointer-events-none" />
      <div className="absolute -left-10 bottom-0 w-52 h-52 rounded-full bg-cyan-200/20 blur-2xl pointer-events-none" />
      <div className="absolute left-6 top-1/2 -translate-y-1/2 w-48 h-48 rounded-full border border-blue-200/50 pointer-events-none hidden sm:block" />

      {/* Left Low-opacity Dotted Grid */}
      <div className="absolute left-10 top-8 pointer-events-none opacity-20 hidden md:block">
        <div className="grid grid-cols-4 gap-2">
          {[...Array(16)].map((_, i) => (
            <div key={`dot-l-${i}`} className="w-1.5 h-1.5 rounded-full bg-[#004AAD]" />
          ))}
        </div>
      </div>

      {/* Right Large Translucent Blur & Circular Accents */}
      <div className="absolute -right-20 top-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-blue-300/25 blur-3xl pointer-events-none" />
      <div className="absolute -right-10 top-0 w-52 h-52 rounded-full bg-indigo-200/20 blur-2xl pointer-events-none" />
      <div className="absolute right-6 top-1/2 -translate-y-1/2 w-48 h-48 rounded-full border border-blue-200/50 pointer-events-none hidden sm:block" />

      {/* Right Low-opacity Dotted Grid */}
      <div className="absolute right-10 bottom-8 pointer-events-none opacity-20 hidden md:block">
        <div className="grid grid-cols-4 gap-2">
          {[...Array(16)].map((_, i) => (
            <div key={`dot-r-${i}`} className="w-1.5 h-1.5 rounded-full bg-[#004AAD]" />
          ))}
        </div>
      </div>

      {/* Statistics Grid */}
      <div className="relative z-10 max-w-5xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0 text-center items-center">
          {/* Stat 1: Ecosystem Partners (100+) */}
          <div className="relative px-4 py-2">
            <div className="relative inline-block">
              <div className="text-4xl sm:text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FF2B44] to-[#FF4E6B] tracking-tight leading-none">
                {Math.floor(ecosystemPartners)}+
              </div>
              <div className="w-16 sm:w-20 h-3 bg-rose-400/25 blur-md rounded-full mx-auto -mt-1 pointer-events-none" />
            </div>
            <p className="text-[11px] sm:text-xs text-[#475569] font-bold uppercase tracking-widest mt-3 leading-snug">
              Ecosystem Partners
            </p>
            <div className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 h-14 w-[1px] bg-slate-200" />
          </div>

          {/* Stat 2: Integrations Built (50+) */}
          <div className="relative px-4 py-2">
            <div className="relative inline-block">
              <div className="text-4xl sm:text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#0E6237] to-[#10B981] tracking-tight leading-none">
                {Math.floor(integrationsBuilt)}+
              </div>
              <div className="w-14 sm:w-16 h-3 bg-emerald-400/25 blur-md rounded-full mx-auto -mt-1 pointer-events-none" />
            </div>
            <p className="text-[11px] sm:text-xs text-[#475569] font-bold uppercase tracking-widest mt-3 leading-snug">
              Integrations Built
            </p>
            <div className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 h-14 w-[1px] bg-slate-200" />
          </div>

          {/* Stat 3: Countries Served (20+) */}
          <div className="relative px-4 py-2">
            <div className="relative inline-block">
              <div className="text-4xl sm:text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#581C87] to-[#7C3AED] tracking-tight leading-none">
                {Math.floor(countriesServed)}+
              </div>
              <div className="w-12 sm:w-14 h-3 bg-purple-400/25 blur-md rounded-full mx-auto -mt-1 pointer-events-none" />
            </div>
            <p className="text-[11px] sm:text-xs text-[#475569] font-bold uppercase tracking-widest mt-3 leading-snug">
              Countries Served
            </p>
            <div className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 h-14 w-[1px] bg-slate-200" />
          </div>

          {/* Stat 4: Platform SLA (99.9%) */}
          <div className="relative px-4 py-2">
            <div className="relative inline-block">
              <div className="text-4xl sm:text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#0A3161] to-[#0D9488] tracking-tight leading-none">
                {platformSla.toFixed(1)}%
              </div>
              <div className="w-16 sm:w-20 h-3 bg-cyan-400/25 blur-md rounded-full mx-auto -mt-1 pointer-events-none" />
            </div>
            <p className="text-[11px] sm:text-xs text-[#475569] font-bold uppercase tracking-widest mt-3 leading-snug">
              Platform SLA
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

const benefits = [
  { id: 1, title: 'Revenue Growth', desc: 'Co-selling, referral fees, revenue splits, and tier-based commission networks.', icon: Zap, color: 'text-[#FF6325]', bg: 'bg-[#FF6325]/10 border-[#FF6325]/20' },
  { id: 2, title: 'Technical Support', desc: 'Direct access to core engineering support slack and dedicated partner sandbox portals.', icon: Cpu, color: 'text-[#3B82F6]', bg: 'bg-[#0E0F89]/20 border-[#0E0F89]/30' },
  { id: 3, title: 'Joint Marketing', desc: 'Co-branded campaigns, featured ecosystem catalog spots, and shared event sponsorships.', icon: Handshake, color: 'text-[#10B981]', bg: 'bg-[#135029]/20 border-[#135029]/30' },
  { id: 4, title: 'Product Training', desc: 'In-depth engineering masterclasses, partner certifications, and cloud sandbox credits.', icon: Award, color: 'text-[#FF6325]', bg: 'bg-[#FF6325]/10 border-[#FF6325]/20' },
  { id: 5, title: 'Early Access Programs', desc: 'Beta SDK availability, draft RFC reviews, and early releases of the unified database layer.', icon: Layers, color: 'text-[#3B82F6]', bg: 'bg-[#0E0F89]/20 border-[#0E0F89]/30' },
  { id: 6, title: 'Dedicated Partner Manager', desc: 'Personal alliance lead to navigate integrations, coordinate updates, and monitor tier health.', icon: Users, color: 'text-[#10B981]', bg: 'bg-[#135029]/20 border-[#135029]/30' }
];

const categories = [
  { 
    title: 'Technology Partner', 
    desc: 'Build plugins, widgets, and connected integrations on top of the BNX Mail and Cliks platforms.', 
    icon: Code2, 
    color: 'text-[#FF6325]', 
    iconBg: 'bg-[#FF6325]/10', 
    iconHoverBg: 'group-hover:bg-[#FF6325]/20', 
    iconBorder: 'border-[#FF6325]/20 group-hover:border-[#FF6325]/40',
    accentBg: 'bg-[#FF6325]',
    arrowColor: 'text-[#FF6325]'
  },
  { 
    title: 'Integration Partner', 
    desc: 'Provide migrations, security auditing, and systems deployment syncs for enterprise clients.', 
    icon: Cpu, 
    color: 'text-[#3B82F6]', 
    iconBg: 'bg-[#3B82F6]/10', 
    iconHoverBg: 'group-hover:bg-[#3B82F6]/20', 
    iconBorder: 'border-[#3B82F6]/20 group-hover:border-[#3B82F6]/40',
    accentBg: 'bg-[#3B82F6]',
    arrowColor: 'text-[#3B82F6]'
  },
  { 
    title: 'Reseller Partner', 
    desc: 'Distribute licenses, support local regional accounts, and coordinate market sales packages.', 
    icon: Users, 
    color: 'text-[#10B981]', 
    iconBg: 'bg-[#10B981]/10', 
    iconHoverBg: 'group-hover:bg-[#10B981]/20', 
    iconBorder: 'border-[#10B981]/20 group-hover:border-[#10B981]/40',
    accentBg: 'bg-[#10B981]',
    arrowColor: 'text-[#10B981]'
  },
  { 
    title: 'Consulting Partner', 
    desc: 'Deliver strategic advisory, business process re-engineering, and product adoption modules.', 
    icon: Compass, 
    color: 'text-[#FF6325]', 
    iconBg: 'bg-[#FF6325]/10', 
    iconHoverBg: 'group-hover:bg-[#FF6325]/20', 
    iconBorder: 'border-[#FF6325]/20 group-hover:border-[#FF6325]/40',
    accentBg: 'bg-[#FF6325]',
    arrowColor: 'text-[#FF6325]'
  },
  { 
    title: 'Strategic Alliance Partner', 
    desc: 'Co-engineer core infrastructure services, network protocols, and auth gateways.', 
    icon: Handshake, 
    color: 'text-[#8B5CF6]', 
    iconBg: 'bg-[#8B5CF6]/10', 
    iconHoverBg: 'group-hover:bg-[#8B5CF6]/20', 
    iconBorder: 'border-[#8B5CF6]/20 group-hover:border-[#8B5CF6]/40',
    accentBg: 'bg-[#8B5CF6]',
    arrowColor: 'text-[#8B5CF6]'
  }
];

const successStories = [
  {
    id: 1,
    name: 'Amazon Web Services',
    category: 'CLOUD INFRASTRUCTURE',
    desc: 'Pazcare Data databases cloud deployments with ultra-low latency across our business globally.',
    logo: 'AWS',
    logoBg: 'bg-[#0066FF]'
  },
  {
    id: 2,
    name: 'NowaCore Cyber',
    category: 'SECURITY ENHANCEMENT',
    desc: 'Co-development partner for S2 Auth Secuir by protocaby, assisting and hardening, S256 ZIRA gateway.',
    logo: 'NOW',
    logoBg: 'bg-[#00B4D8]'
  },
  {
    id: 3,
    name: 'TeraCloud Systems',
    category: 'SYSTEM INTEGRATION',
    desc: 'Spetab free consulting partner contcrnithip mogenate a Flagtrabon migntbane crint tra Click Cloud now rube.',
    logo: 'TERA',
    logoBg: 'bg-[#7C3AED]'
  },
  {
    id: 4,
    name: 'Vanguard Networks',
    category: 'NETWORK SERVICES',
    desc: 'Collaborator on encrypted transport pipes ensuring secure and private network routing for BNXmail nodes.',
    logo: 'VANG',
    logoBg: 'bg-[#0284C7]'
  }
];

const journeyRoadmap = [
  { step: '1', title: 'Apply', desc: 'Submit organization profile details via multi-step portal.' },
  { step: '2', title: 'Review', desc: 'Partnership alignment review by our ecosystem alliance board.' },
  { step: '3', title: 'Onboarding', desc: 'Access sandboxes, partner guides, and sandbox developer credits.' },
  { step: '4', title: 'Training', desc: 'Receive hands-on training workshops with domain engineers.' },
  { step: '5', title: 'Certification', desc: 'Achieve formal alliance integration verification certificates.' },
  { step: '6', title: 'Launch', desc: 'Featured release in our global ecosystem platform directory.' },
  { step: '7', title: 'Growth', desc: 'Engage in quarterly joint pipeline reviews and co-selling drives.' }
];

const resources = [
  { title: 'Documentation', desc: 'Full API guides, protocol specs, and developer toolkits.', icon: FileText },
  { title: 'APIs', desc: 'Instant WebSocket syncs, Auth payloads, and BNX Mail sync points.', icon: Code2 },
  { title: 'Training Materials', desc: 'Video masterclasses, integration walk-throughs, and code repos.', icon: Award },
  { title: 'Integration Guides', desc: 'Step-by-step migration maps and container setups.', icon: Cpu },
  { title: 'Partner Toolkit', desc: 'Branding kits, joint marketing templates, and pricing boards.', icon: Handshake }
];

const getRoadmapColor = (index) => {
  const colorMap = [
    { border: 'border-[#FF6325]', text: 'text-[#FF6325]', shadow: 'shadow-[#FF6325]/10', hoverBg: 'group-hover:bg-[#FF6325]', hoverText: 'group-hover:text-white', focusText: 'group-hover:text-[#FF6325]' },
    { border: 'border-[#3B82F6]', text: 'text-[#3B82F6]', shadow: 'shadow-[#0E0F89]/10', hoverBg: 'group-hover:bg-[#0E0F89]', hoverText: 'group-hover:text-white', focusText: 'group-hover:text-[#3B82F6]' },
    { border: 'border-[#10B981]', text: 'text-[#10B981]', shadow: 'shadow-[#135029]/10', hoverBg: 'group-hover:bg-[#135029]', hoverText: 'group-hover:text-white', focusText: 'group-hover:text-[#10B981]' },
    { border: 'border-[#FF6325]', text: 'text-[#FF6325]', shadow: 'shadow-[#FF6325]/10', hoverBg: 'group-hover:bg-[#FF6325]', hoverText: 'group-hover:text-white', focusText: 'group-hover:text-[#FF6325]' },
  ];
  return colorMap[index % colorMap.length];
};

// Section 8: Partner Resources with Continuous Auto-Scrolling Marquee (LEFT -> RIGHT)
function PartnerResourcesMarqueeSection() {
  // 4 sets of the 5 cards ensures a wide, seamless infinite loop across all viewports
  const marqueeCards = [
    ...resources,
    ...resources,
    ...resources,
    ...resources
  ];

  return (
    <div className="space-y-10 sm:space-y-14 w-full py-4 select-none">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3 px-4">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#FF6325]/10 border border-[#FF6325]/20 text-[#FF6325] text-xs font-semibold uppercase tracking-wider">
          <FileText className="h-3.5 w-3.5" />
          <span>Developer Resources</span>
        </div>
        <h2 className="text-3xl md:text-5xl font-extrabold text-[#0A3161]">
          Partner Resources
        </h2>
        <p className="text-slate-600 text-sm">
          Access core developer documentation, APIs, and partner marketing kits.
        </p>
      </div>

      {/* Continuous Horizontal Marquee Container with Subtle Edge Masks */}
      <div className="w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_4%,black_96%,transparent)] [-webkit-mask-image:linear-gradient(to_right,transparent,black_4%,black_96%,transparent)] py-4">
        <div className="resource-marquee-lr flex gap-6 w-max will-change-transform">
          {marqueeCards.map((res, idx) => {
            const Icon = res.icon;
            return (
              <div
                key={`${res.title}-${idx}`}
                className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-7 text-center flex flex-col justify-between shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_16px_40px_rgb(0,0,0,0.08)] transition-all duration-300 group cursor-pointer w-[235px] sm:w-[260px] md:w-[275px] shrink-0 min-h-[250px]"
              >
                <div className="h-11 w-11 mx-auto rounded-xl bg-cyan-50/80 border border-cyan-100/60 flex items-center justify-center text-cyan-500 group-hover:scale-105 group-hover:bg-cyan-50 transition-all duration-300">
                  <Icon className="h-5 w-5" />
                </div>

                <div className="space-y-1.5 flex-1 flex flex-col justify-center my-4">
                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-cyan-600 transition-colors">
                    {res.title}
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed font-normal line-clamp-3">
                    {res.desc}
                  </p>
                </div>

                <div className="flex items-center justify-center text-[10px] font-bold text-slate-400 group-hover:text-cyan-600 uppercase tracking-wider border-t border-slate-100 pt-3 transition-colors">
                  <span>Download</span>
                  <ArrowRight className="h-3 w-3 ml-1 transform group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Minimal, elegant technology-inspired side accents (thin subtle curves & geometric details)
function BlueSideFrame({ side = 'left' }) {
  const isRight = side === 'right';

  return (
    <div
      className="w-full h-full"
      style={{
        transform: isRight ? 'scaleX(-1)' : 'none',
        transformOrigin: 'center center'
      }}
    >
      <svg
        className="w-full h-full"
        viewBox="0 0 120 700"
        preserveAspectRatio="none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Subtle Primary Tech Line Gradient */}
          <linearGradient id={`techLineGrad_${side}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#004AAD" stopOpacity="0.08" />
            <stop offset="25%" stopColor="#0284C7" stopOpacity="0.38" />
            <stop offset="50%" stopColor="#004AAD" stopOpacity="0.48" />
            <stop offset="75%" stopColor="#38BDF8" stopOpacity="0.32" />
            <stop offset="100%" stopColor="#004AAD" stopOpacity="0.08" />
          </linearGradient>

          {/* Very Soft Secondary Guide Gradient */}
          <linearGradient id={`techSubtleGrad_${side}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#60A5FA" stopOpacity="0.04" />
            <stop offset="30%" stopColor="#93C5FD" stopOpacity="0.22" />
            <stop offset="70%" stopColor="#60A5FA" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#93C5FD" stopOpacity="0.04" />
          </linearGradient>
        </defs>

        {/* 1. Primary Gentle Tech Curve Line (Near edge) */}
        <path
          d="M 18,0 C 42,180 48,320 26,440 C 12,530 38,630 20,700"
          stroke={`url(#techLineGrad_${side})`}
          strokeWidth="1.25"
          fill="none"
        />

        {/* 2. Secondary Delicate Dashed Curve */}
        <path
          d="M 8,0 C 24,190 28,340 14,460 C 4,550 24,640 10,700"
          stroke={`url(#techSubtleGrad_${side})`}
          strokeWidth="1"
          strokeDasharray="4 6"
          fill="none"
        />

        {/* 3. Subtle Outer Boundary Accent Segment */}
        <path
          d="M 52,140 C 66,230 64,360 44,480"
          stroke={`url(#techSubtleGrad_${side})`}
          strokeWidth="0.85"
          fill="none"
        />

        {/* 4. Small Outlined Geometric Accent Circles */}
        {/* Top geometric node */}
        <circle cx="36" cy="190" r="3" fill="#FFFFFF" stroke="#004AAD" strokeWidth="1" opacity="0.6" />
        <circle cx="36" cy="190" r="1.2" fill="#004AAD" opacity="0.65" />

        {/* Center geometric satellite ring */}
        <circle cx="34" cy="350" r="4.5" fill="none" stroke="#0284C7" strokeWidth="0.9" opacity="0.45" />
        <circle cx="34" cy="350" r="1.5" fill="#0284C7" opacity="0.55" />

        {/* Lower geometric node */}
        <circle cx="22" cy="520" r="2.5" fill="#FFFFFF" stroke="#004AAD" strokeWidth="1" opacity="0.5" />

        {/* 5. Minimal Tech Details: Short tick lines & subtle arcs */}
        {/* Short technical tick lines */}
        <line x1="26" y1="180" x2="44" y2="180" stroke="#0284C7" strokeWidth="0.9" opacity="0.3" />
        <line x1="14" y1="360" x2="26" y2="360" stroke="#004AAD" strokeWidth="0.9" opacity="0.25" />
        <line x1="28" y1="510" x2="40" y2="510" stroke="#0284C7" strokeWidth="0.9" opacity="0.3" />

        {/* Small delicate arc accents */}
        <path
          d="M 48,245 A 16 16 0 0 1 58,272"
          stroke="#004AAD"
          strokeWidth="0.9"
          strokeDasharray="2 3"
          fill="none"
          opacity="0.3"
        />
        <path
          d="M 38,420 A 12 12 0 0 0 46,446"
          stroke="#0284C7"
          strokeWidth="0.9"
          fill="none"
          opacity="0.25"
        />
      </svg>
    </div>
  );
}

export default function Partners() {
  const shouldReduceMotion = useReducedMotion();

  // Scroll-reveal animation variants for Section 7 (Partnership Journey Roadmap)
  const journeyContainerVariants = {
    hidden: shouldReduceMotion ? { opacity: 1, y: 0, scale: 1 } : {
      opacity: 0,
      y: 120,
      scale: 0.97,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: shouldReduceMotion ? { duration: 0 } : {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
        staggerChildren: 0.08,
        delayChildren: 0.04,
      },
    },
  };

  const journeyItemVariants = {
    hidden: shouldReduceMotion ? { opacity: 1, y: 0 } : {
      opacity: 0,
      y: 16,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: shouldReduceMotion ? { duration: 0 } : {
        duration: 0.75,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const journeyStepsContainerVariants = {
    hidden: {},
    visible: {
      transition: shouldReduceMotion ? { duration: 0 } : {
        staggerChildren: 0.06,
        delayChildren: 0.04,
      },
    },
  };

  const journeyStepVariants = {
    hidden: shouldReduceMotion ? { opacity: 1, y: 0 } : {
      opacity: 0,
      y: 12,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: shouldReduceMotion ? { duration: 0 } : {
        duration: 0.65,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  // Scroll-reveal animation variants for Section 9 (Partner Application Portal)
  const portalContainerVariants = {
    hidden: shouldReduceMotion ? { opacity: 1, y: 0, scale: 1 } : {
      opacity: 0,
      y: 120,
      scale: 0.97,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: shouldReduceMotion ? { duration: 0 } : {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
        staggerChildren: 0.08,
        delayChildren: 0.04,
      },
    },
  };

  const portalItemVariants = {
    hidden: shouldReduceMotion ? { opacity: 1, y: 0 } : {
      opacity: 0,
      y: 16,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: shouldReduceMotion ? { duration: 0 } : {
        duration: 0.75,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  // Multi-step Application Wizard State
  const [currentStep, setCurrentStep] = useState(1);
  const [companyName, setCompanyName] = useState('');
  const [website, setWebsite] = useState('');
  const [companySize, setCompanySize] = useState('1-10');
  const [partnerType, setPartnerType] = useState('Technology Partner');
  const [proposal, setProposal] = useState('');
  const [marketFocus, setMarketFocus] = useState('Global');
  const [fullName, setFullName] = useState('');
  const [workEmail, setWorkEmail] = useState('');
  const [phone, setPhone] = useState('');

  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [statusMsg, setStatusMsg] = useState('');

  // Horizontal Success Story Carousel State
  const carouselRef = useRef(null);

  const scrollCarousel = (direction) => {
    if (carouselRef.current) {
      const { scrollLeft, clientWidth } = carouselRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth / 2 : scrollLeft + clientWidth / 2;
      carouselRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  const handleNextStep = () => {
    if (currentStep < 4) setCurrentStep(prev => prev + 1);
  };

  const handlePrevStep = () => {
    if (currentStep > 1) setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (currentStep < 4) {
      handleNextStep();
      return;
    }

    setStatus('loading');
    const constructedMessage = `
      [Futuristic Partner Request]
      Partner Type: ${partnerType}
      Website: ${website}
      Company Size: ${companySize}
      Market Focus: ${marketFocus}
      Proposal Summary: ${proposal}
      Phone: ${phone}
    `;

    try {
      await api.post('/api/contact', {
        name: fullName,
        email: workEmail,
        company: companyName,
        message: constructedMessage
      });
      setStatus('success');
      setStatusMsg('Thank you! Your strategic partner request has been recorded. Our alliance engineers will connect shortly.');
      // Reset state
      setCompanyName('');
      setWebsite('');
      setProposal('');
      setFullName('');
      setWorkEmail('');
      setPhone('');
      setCurrentStep(1);
    } catch (err) {
      console.error(err);
      setStatus('error');
      setStatusMsg(err.response?.data?.message || 'Submission failed. Please try again.');
    }
  };

  return (
    <div className="partners-futuristic-theme min-h-screen relative overflow-hidden pb-20 pt-4">
      <style>{`
        .partners-futuristic-theme {
          background: linear-gradient(135deg, #F5F7FB 0%, #E2EDFA 50%, #C8DCF7 100%) !important;
          color: #334155 !important;
          position: relative;
          z-index: 10;
        }
        .partners-futuristic-theme h1, 
        .partners-futuristic-theme h2, 
        .partners-futuristic-theme h3, 
        .partners-futuristic-theme h4, 
        .partners-futuristic-theme h5, 
        .partners-futuristic-theme h6 {
          color: #0A3161 !important;
        }
        .partners-futuristic-theme p {
          color: #475569 !important; /* Secondary text - Slate 600 */
        }
        .partners-futuristic-theme span {
          color: inherit;
        }
        .partners-futuristic-theme a {
          color: inherit;
        }
        .partners-futuristic-theme label {
          color: #475569 !important;
        }

        /* Input fields overrides for light theme */
        .partners-futuristic-theme input,
        .partners-futuristic-theme select,
        .partners-futuristic-theme textarea {
          background-color: rgba(255, 255, 255, 0.9) !important;
          color: #0F172A !important;
          border: 1px solid rgba(10, 49, 97, 0.15) !important;
        }
        .partners-futuristic-theme input::placeholder,
        .partners-futuristic-theme textarea::placeholder {
          color: #94A3B8 !important;
        }
        .partners-futuristic-theme input:focus,
        .partners-futuristic-theme select:focus,
        .partners-futuristic-theme textarea:focus {
          border-color: #FF6325 !important;
          box-shadow: 0 0 0 2px rgba(255, 99, 37, 0.15) !important;
        }

        /* Dropdown options styling */
        .partners-futuristic-theme select option {
          background-color: #FFFFFF !important;
          color: #0F172A !important;
        }

        /* Wizard navigation & scroll buttons */
        .partners-futuristic-theme button.bg-slate-900\\/80,
        .partners-futuristic-theme button.bg-white\\/5 {
          background-color: #FFFFFF !important;
          color: #0A3161 !important;
          border: 1px solid rgba(10, 49, 97, 0.15) !important;
        }
        .partners-futuristic-theme button.bg-slate-900\\/80:hover,
        .partners-futuristic-theme button.bg-white\\/5:hover {
          background-color: #F8FAFC !important;
          border-color: #FF6325 !important;
        }

        /* Timeline and progress indicator overrides */
        .partners-futuristic-theme .h-9.w-9.rounded-full.bg-slate-900 {
          background-color: #FFFFFF !important;
        }
        .partners-futuristic-theme .bg-slate-900.border-slate-800.text-slate-500 {
          background-color: #FFFFFF !important;
          border: 1px solid rgba(10, 49, 97, 0.15) !important;
          color: #64748B !important;
        }
        .partners-futuristic-theme .bg-slate-800 {
          background-color: rgba(10, 49, 97, 0.1) !important;
        }

        /* Hero top pill override */
        .partners-futuristic-theme .bg-white\/5.border-white\/10.text-\[\#10B981\],
        .partners-futuristic-theme .bg-white\/5.border-white\/10.text-\[\#10B981\] span,
        .partners-futuristic-theme .bg-white\/5.border-white\/10.text-\[\#10B981\] svg {
          color: #10B981 !important;
        }
        .partners-futuristic-theme .bg-white\/5.border-white\/10 {
          background-color: rgba(10, 49, 97, 0.05) !important;
          border-color: rgba(10, 49, 97, 0.15) !important;
        }

        /* Hero primary action button */
        .partners-futuristic-theme .shadow-cyan-500\\/25 {
          background-color: #FF6325 !important;
          border-color: #FF6325 !important;
          color: #FFFFFF !important;
          box-shadow: 0 10px 25px rgba(255, 99, 37, 0.25) !important;
        }
        .partners-futuristic-theme .shadow-cyan-500\\/25:hover {
          background-color: #e0531b !important;
          border-color: #e0531b !important;
        }

        /* Hero secondary action button */
        .partners-futuristic-theme a[href="#partner-categories"] {
          background-color: #FFFFFF !important;
          color: #0A3161 !important;
          border: 1px solid rgba(10, 49, 97, 0.15) !important;
        }
        .partners-futuristic-theme a[href="#partner-categories"]:hover {
          background-color: #F8FAFC !important;
          border-color: #FF6325 !important;
        }

        /* Network SVG backgrounds */
        .partners-futuristic-theme svg line[stroke="#00E5FF"] { stroke: rgba(255, 99, 37, 0.25) !important; }
        .partners-futuristic-theme svg line[stroke="#7C3AED"] { stroke: rgba(14, 15, 137, 0.25) !important; }
        .partners-futuristic-theme svg line[stroke="#00FFB2"] { stroke: rgba(19, 80, 41, 0.25) !important; }
        .partners-futuristic-theme svg circle[fill="#00E5FF"] { fill: #FF6325 !important; }
        .partners-futuristic-theme svg circle[fill="#7C3AED"] { fill: #0E0F89 !important; }
        .partners-futuristic-theme svg circle[fill="#00FFB2"] { fill: #135029 !important; }

        /* Animated blobs on light bg */
        @keyframes floatCyan {
          0% { transform: translate(0px, 0px) scale(1); }
          50% { transform: translate(40px, -60px) scale(1.1); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        @keyframes floatPurple {
          0% { transform: translate(0px, 0px) scale(1); }
          50% { transform: translate(-30px, 50px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .blob-cyan-pulse {
          animation: floatCyan 14s ease-in-out infinite;
          background-color: rgba(255, 99, 37, 0.05) !important;
        }
        .blob-purple-pulse {
          animation: floatPurple 18s ease-in-out infinite;
          background-color: rgba(14, 15, 137, 0.05) !important;
        }

        /* Orbit rotation */
        @keyframes orbitRotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .orbit-connection-path {
          stroke-dasharray: 8;
          animation: orbitRotate 45s linear infinite;
        }

        /* Pulsing line stroke */
        @keyframes flowPulse {
          to { stroke-dashoffset: -20; }
        }
        .flow-vector-line {
          stroke-dasharray: 6;
          animation: flowPulse 2s linear infinite;
        }

        /* Zoho-style clean light glass cards */
        .glass-card-neon {
          background: rgba(255, 255, 255, 0.75) !important;
          backdrop-filter: blur(16px) !important;
          border: 1px solid rgba(10, 49, 97, 0.12) !important;
          box-shadow: 0 8px 32px 0 rgba(10, 49, 97, 0.04) !important;
          transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1) !important;
        }
        .glass-card-neon:hover {
          background: rgba(255, 255, 255, 0.95) !important;
          border-color: rgba(255, 99, 37, 0.45) !important; /* Brand orange border */
          box-shadow: 0 12px 40px 0 rgba(10, 49, 97, 0.08) !important;
          transform: translateY(-5px);
        }

        /* Borders override for light theme */
        .partners-futuristic-theme .border-white\\/5 {
          border-color: rgba(10, 49, 97, 0.1) !important;
        }

        /* Custom scrollbar hidden */
        .scrollbar-none::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-none {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        /* Benefits float cycles */
        @keyframes floatPerkEven {
          0% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-12px) scale(1.02); }
          100% { transform: translateY(0) scale(1); }
        }
        @keyframes floatPerkOdd {
          0% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-16px) scale(0.98); }
          100% { transform: translateY(0) scale(1); }
        }
        .float-perk-even {
          animation: floatPerkEven 6s ease-in-out infinite;
        }
        .float-perk-odd {
          animation: floatPerkOdd 7s ease-in-out infinite;
        }

        /* Connected nodes timeline indicators */
        .roadmap-line-glowing {
          position: relative;
        }
        .roadmap-line-glowing::after {
          content: '';
          position: absolute;
          background: linear-gradient(90deg, #FF6325, #0E0F89);
          box-shadow: 0 0 10px rgba(255, 99, 37, 0.3);
        }

        /* Partner Benefits Marquee Animations */
        @keyframes partnerMarqueeLR {
          0% {
            transform: translateX(-50%);
          }
          100% {
            transform: translateX(0%);
          }
        }
        @keyframes partnerMarqueeRL {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .partner-marquee-lr {
          display: flex;
          width: max-content;
          animation: partnerMarqueeLR 35s linear infinite;
          will-change: transform;
        }
        .partner-marquee-rl {
          display: flex;
          width: max-content;
          animation: partnerMarqueeRL 35s linear infinite;
          will-change: transform;
        }
        .partner-marquee-lr:hover,
        .partner-marquee-rl:hover {
          animation-play-state: paused;
        }
        @media (prefers-reduced-motion: reduce) {
          .partner-marquee-lr,
          .partner-marquee-rl {
            animation: none !important;
            transform: none !important;
          }
        }

        /* Partner Resources Continuous Horizontal Marquee (LEFT -> RIGHT) */
        @keyframes resourceMarqueeLR {
          0% {
            transform: translateX(-50%);
          }
          100% {
            transform: translateX(0%);
          }
        }
        .resource-marquee-lr {
          display: flex;
          width: max-content;
          animation: resourceMarqueeLR 32s linear infinite;
          will-change: transform;
        }
        .resource-marquee-lr:hover {
          animation-play-state: paused;
        }
        @media (prefers-reduced-motion: reduce) {
          .resource-marquee-lr {
            animation: none !important;
            transform: none !important;
          }
        }

        /* Partner Categories Modern SaaS Cards */
        .partner-category-card {
          width: 100%;
          background: #FFFFFF !important;
          border: 1px solid #DCE5F0 !important;
          border-radius: 20px !important;
          box-shadow: 0 4px 20px -2px rgba(10, 49, 97, 0.05);
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          position: relative;
          overflow: hidden;
        }
        .partner-category-card:hover {
          transform: translateY(-4px);
          border-color: #0A3161 !important;
          box-shadow: 0 12px 28px -4px rgba(10, 49, 97, 0.12) !important;
        }
        @media (min-width: 768px) {
          .partner-category-card {
            width: calc(50% - 16px);
          }
        }
        @media (min-width: 1024px) {
          .partner-category-card {
            width: calc(33.3333% - 21.34px);
            max-width: calc(33.3333% - 21.34px);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .partner-category-card:hover {
            transform: none !important;
          }
        }
      `}</style>

      {/* SECTION 1: Futurisic Hero with Floating Network */}
      <div className="relative overflow-hidden flex flex-col items-center justify-center pt-8 pb-16 px-4 sm:px-6 lg:px-8 border-b border-purple-950/20">
        {/* Global Network Dot Matrix Map Background matching reference image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat pointer-events-none z-0 opacity-90"
          style={{ 
            backgroundImage: "url('/partners_bg.jpg')",
            backgroundPosition: 'center center',
            backgroundSize: 'cover'
          }}
        />
        {/* Soft light gradient overlays for seamless blending */}
        <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-white/60 to-transparent pointer-events-none z-0" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#E2EDFA] via-[#E2EDFA]/80 to-transparent pointer-events-none z-0" />

        {/* Shifting blobs */}
        <div className="absolute top-[10%] left-[5%] w-[450px] h-[450px] bg-[#00E5FF]/10 rounded-full blur-[140px] pointer-events-none blob-cyan-pulse" />
        <div className="absolute bottom-[10%] right-[5%] w-[500px] h-[500px] bg-[#7C3AED]/10 rounded-full blur-[140px] pointer-events-none blob-purple-pulse" />

        {/* Animated Connected Network background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none opacity-15">
          <svg className="absolute w-full h-full" viewBox="0 0 1000 800" xmlns="http://www.w3.org/2000/svg">
            <line x1="100" y1="150" x2="300" y2="250" stroke="#00E5FF" strokeWidth="1" className="flow-vector-line" />
            <line x1="300" y1="250" x2="500" y2="150" stroke="#7C3AED" strokeWidth="1" />
            <line x1="500" y1="150" x2="700" y2="300" stroke="#00FFB2" strokeWidth="1" className="flow-vector-line" style={{ animationDuration: '4s' }} />
            <line x1="300" y1="250" x2="600" y2="450" stroke="#00E5FF" strokeWidth="1" />
            <line x1="600" y1="450" x2="800" y2="250" stroke="#7C3AED" strokeWidth="1" className="flow-vector-line" />
            <line x1="800" y1="250" x2="900" y2="500" stroke="#00FFB2" strokeWidth="1" />

            <circle cx="100" cy="150" r="4" fill="#00E5FF" className="animate-ping" />
            <circle cx="300" cy="250" r="5" fill="#7C3AED" />
            <circle cx="500" cy="150" r="4" fill="#00FFB2" />
            <circle cx="700" cy="300" r="6" fill="#00E5FF" />
            <circle cx="600" cy="450" r="5" fill="#7C3AED" className="animate-pulse" />
            <circle cx="800" cy="250" r="4" fill="#00FFB2" />
            <circle cx="900" cy="500" r="5" fill="#00E5FF" />
          </svg>
        </div>

        <div className="max-w-4xl mx-auto text-center space-y-10 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[#10B981] text-xs font-bold uppercase tracking-widest select-none"
          >
            <Handshake className="h-3.5 w-3.5 text-[#10B981] animate-pulse" />
            <span>Beta Partner Network</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-6xl md:text-8xl font-extrabold tracking-tight leading-none"
          >
            Grow Together Through Strategic Partnerships
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-[#CBD5E1] text-base md:text-xl max-w-3xl mx-auto leading-relaxed"
          >
            Join our global ecosystem of technology, integration, reseller, and solution partners. Integrate features, coordinate sales pipelines, and scale enterprise solutions.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <a
              href="#apply-wizard"
              className="w-full sm:w-auto px-8 py-4 rounded-xl text-sm font-black text-slate-950 bg-[#00E5FF] hover:bg-[#00c5db] transition-all duration-300 shadow-xl shadow-cyan-500/25 flex items-center justify-center space-x-2 group hover:scale-[1.02] border border-[#00E5FF]"
            >
              <span>Become a Partner</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="#partner-categories"
              className="w-full sm:w-auto px-8 py-4 rounded-xl text-sm font-black text-white bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all duration-300 flex items-center justify-center space-x-2 hover:scale-[1.02]"
            >
              <span>Explore Opportunities</span>
            </a>
          </motion.div>
        </div>
      </div>

      {/* SECTION 2: PARTNER ECOSYSTEM VISUALIZATION */}
      <section className="relative w-full py-16 md:py-24 bg-[#EDF4F9] overflow-hidden select-none">
        {/* Minimal Technology Side Accents (Subtle thin lines & geometric details on extreme edges) */}
        {/* Left Side Accent */}
        <div className="absolute left-0 top-0 bottom-0 w-10 sm:w-16 md:w-24 lg:w-32 max-w-[130px] pointer-events-none z-0 overflow-hidden select-none">
          <BlueSideFrame side="left" />
        </div>

        {/* Right Side Accent (Mirrored) */}
        <div className="absolute right-0 top-0 bottom-0 w-10 sm:w-16 md:w-24 lg:w-32 max-w-[130px] pointer-events-none z-0 overflow-hidden select-none">
          <BlueSideFrame side="right" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#0B2545] tracking-tight">
              Partner Ecosystem Visualization
            </h2>
            <p className="mt-3 text-[#475569] text-sm sm:text-base md:text-lg">
              Visualizing structural connections between our core suite and our global alliance layers.
            </p>
          </div>

          {/* Ecosystem Visual Canvas Area */}
          <div className="relative w-full max-w-5xl mx-auto h-[480px] sm:h-[540px] md:h-[600px] lg:h-[620px] flex items-center justify-center">
            {/* Concentric Subtle Circular Rings (Behind cards and hub, no connecting lines) */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              viewBox="0 0 1000 620"
              preserveAspectRatio="xMidYMid meet"
            >
              {/* Concentric circular rings around center (500, 310) */}
              <circle
                cx="500"
                cy="310"
                r="115"
                fill="none"
                stroke="rgba(255, 255, 255, 0.95)"
                strokeWidth="2"
              />
              <circle
                cx="500"
                cy="310"
                r="195"
                fill="none"
                stroke="rgba(255, 255, 255, 0.8)"
                strokeWidth="1.8"
              />
              <circle
                cx="500"
                cy="310"
                r="305"
                fill="none"
                stroke="rgba(255, 255, 255, 0.45)"
                strokeWidth="1.5"
              />
            </svg>

            {/* Central Station: Larger BETA HUB circle with orange/red outline & glow */}
            <div
              className="absolute z-20 rounded-full bg-white flex flex-col items-center justify-center text-center select-none"
              style={{
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                width: 'clamp(120px, 17vw, 175px)',
                height: 'clamp(120px, 17vw, 175px)',
                border: '3.5px solid #FF4D15',
                boxShadow: '0 0 40px rgba(255, 77, 21, 0.38), 0 0 18px rgba(255, 77, 21, 0.25), 0 10px 25px rgba(11, 37, 69, 0.08)'
              }}
            >
              <Building
                className="text-[#FF4D15] mb-1 sm:mb-1.5"
                strokeWidth={2}
                style={{ width: 'clamp(28px, 4vw, 42px)', height: 'clamp(28px, 4vw, 42px)' }}
              />
              <span
                className="font-extrabold text-[#0B2545] tracking-wider uppercase"
                style={{ fontSize: 'clamp(11px, 1.6vw, 15px)' }}
              >
                BETA HUB
              </span>
            </div>

            {/* Five spacious rounded white cards with soft shadows & pastel circular icons */}
            {/* 1. Top Card: Internet */}
            <div
              className="absolute rounded-[20px] sm:rounded-[24px] md:rounded-[28px] bg-white flex flex-col items-center justify-center text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_42px_rgba(15,23,42,0.09)] z-10 cursor-default"
              style={{
                left: '50%',
                top: '15%',
                transform: 'translate(-50%, -50%)',
                width: 'clamp(150px, 22vw, 245px)',
                height: 'clamp(95px, 13vw, 136px)',
                boxShadow: '0 12px 32px rgba(15, 23, 42, 0.06), 0 2px 8px rgba(15, 23, 42, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.9)'
              }}
            >
              <div
                className="rounded-full flex items-center justify-center mb-2 sm:mb-2.5"
                style={{
                  width: 'clamp(38px, 5.2vw, 56px)',
                  height: 'clamp(38px, 5.2vw, 56px)',
                  backgroundColor: '#FFF0E5'
                }}
              >
                <Globe
                  className="text-slate-800"
                  strokeWidth={2}
                  style={{ width: 'clamp(18px, 2.6vw, 26px)', height: 'clamp(18px, 2.6vw, 26px)' }}
                />
              </div>
              <span
                className="font-bold text-[#0B2545] tracking-tight"
                style={{ fontSize: 'clamp(12px, 1.7vw, 17px)' }}
              >
                Internet
              </span>
            </div>

            {/* 2. Left Card: Application */}
            <div
              className="absolute rounded-[20px] sm:rounded-[24px] md:rounded-[28px] bg-white flex flex-col items-center justify-center text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_42px_rgba(15,23,42,0.09)] z-10 cursor-default"
              style={{
                left: '19%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                width: 'clamp(150px, 22vw, 245px)',
                height: 'clamp(95px, 13vw, 136px)',
                boxShadow: '0 12px 32px rgba(15, 23, 42, 0.06), 0 2px 8px rgba(15, 23, 42, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.9)'
              }}
            >
              <div
                className="rounded-full flex items-center justify-center mb-2 sm:mb-2.5"
                style={{
                  width: 'clamp(38px, 5.2vw, 56px)',
                  height: 'clamp(38px, 5.2vw, 56px)',
                  backgroundColor: '#E0F2FE'
                }}
              >
                <Layers
                  className="text-[#0284C7]"
                  strokeWidth={2}
                  style={{ width: 'clamp(18px, 2.6vw, 26px)', height: 'clamp(18px, 2.6vw, 26px)' }}
                />
              </div>
              <span
                className="font-bold text-[#0B2545] tracking-tight"
                style={{ fontSize: 'clamp(12px, 1.7vw, 17px)' }}
              >
                Application
              </span>
            </div>

            {/* 3. Right Card: Development */}
            <div
              className="absolute rounded-[20px] sm:rounded-[24px] md:rounded-[28px] bg-white flex flex-col items-center justify-center text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_42px_rgba(15,23,42,0.09)] z-10 cursor-default"
              style={{
                left: '81%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                width: 'clamp(150px, 22vw, 245px)',
                height: 'clamp(95px, 13vw, 136px)',
                boxShadow: '0 12px 32px rgba(15, 23, 42, 0.06), 0 2px 8px rgba(15, 23, 42, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.9)'
              }}
            >
              <div
                className="rounded-full flex items-center justify-center mb-2 sm:mb-2.5"
                style={{
                  width: 'clamp(38px, 5.2vw, 56px)',
                  height: 'clamp(38px, 5.2vw, 56px)',
                  backgroundColor: '#F3E8FF'
                }}
              >
                <Code2
                  className="text-[#9333EA]"
                  strokeWidth={2}
                  style={{ width: 'clamp(18px, 2.6vw, 26px)', height: 'clamp(18px, 2.6vw, 26px)' }}
                />
              </div>
              <span
                className="font-bold text-[#0B2545] tracking-tight"
                style={{ fontSize: 'clamp(12px, 1.7vw, 17px)' }}
              >
                Development
              </span>
            </div>

            {/* 4. Bottom-Left Card: Users */}
            <div
              className="absolute rounded-[20px] sm:rounded-[24px] md:rounded-[28px] bg-white flex flex-col items-center justify-center text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_42px_rgba(15,23,42,0.09)] z-10 cursor-default"
              style={{
                left: '31%',
                top: '84%',
                transform: 'translate(-50%, -50%)',
                width: 'clamp(150px, 22vw, 245px)',
                height: 'clamp(95px, 13vw, 136px)',
                boxShadow: '0 12px 32px rgba(15, 23, 42, 0.06), 0 2px 8px rgba(15, 23, 42, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.9)'
              }}
            >
              <div
                className="rounded-full flex items-center justify-center mb-2 sm:mb-2.5"
                style={{
                  width: 'clamp(38px, 5.2vw, 56px)',
                  height: 'clamp(38px, 5.2vw, 56px)',
                  backgroundColor: '#FFE4E6'
                }}
              >
                <Users
                  className="text-[#E11D48]"
                  strokeWidth={2}
                  style={{ width: 'clamp(18px, 2.6vw, 26px)', height: 'clamp(18px, 2.6vw, 26px)' }}
                />
              </div>
              <span
                className="font-bold text-[#0B2545] tracking-tight"
                style={{ fontSize: 'clamp(12px, 1.7vw, 17px)' }}
              >
                Users
              </span>
            </div>

            {/* 5. Bottom-Right Card: Infrastructure */}
            <div
              className="absolute rounded-[20px] sm:rounded-[24px] md:rounded-[28px] bg-white flex flex-col items-center justify-center text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_42px_rgba(15,23,42,0.09)] z-10 cursor-default"
              style={{
                left: '69%',
                top: '84%',
                transform: 'translate(-50%, -50%)',
                width: 'clamp(150px, 22vw, 245px)',
                height: 'clamp(95px, 13vw, 136px)',
                boxShadow: '0 12px 32px rgba(15, 23, 42, 0.06), 0 2px 8px rgba(15, 23, 42, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.9)'
              }}
            >
              <div
                className="rounded-full flex items-center justify-center mb-2 sm:mb-2.5"
                style={{
                  width: 'clamp(38px, 5.2vw, 56px)',
                  height: 'clamp(38px, 5.2vw, 56px)',
                  backgroundColor: '#DCFCE7'
                }}
              >
                <Cpu
                  className="text-[#059669]"
                  strokeWidth={2}
                  style={{ width: 'clamp(18px, 2.6vw, 26px)', height: 'clamp(18px, 2.6vw, 26px)' }}
                />
              </div>
              <span
                className="font-bold text-[#0B2545] tracking-tight"
                style={{ fontSize: 'clamp(12px, 1.7vw, 17px)' }}
              >
                Infrastructure
              </span>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24 space-y-36">

        {/* SECTION 3: PARTNER BENEFITS SECTION */}
        <div className="space-y-12 overflow-hidden">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#FF6325]/10 border border-[#FF6325]/20 text-[#FF6325] text-xs font-semibold uppercase tracking-wider">
              <Award className="h-3.5 w-3.5" />
              <span>Program Benefits</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold text-white">Partner Program Benefits</h2>
            <p className="text-[#CBD5E1] text-sm">We provide technical support, joint marketing, and early access code resources.</p>
          </div>

          {/* DUAL-DIRECTION CONTINUOUS HORIZONTAL MARQUEE */}
          <div className="space-y-6 w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_4%,black_96%,transparent)] [-webkit-mask-image:linear-gradient(to_right,transparent,black_4%,black_96%,transparent)] py-2">
            {/* TOP ROW: LEFT -> RIGHT */}
            <div className="w-full overflow-hidden">
              <div className="partner-marquee-lr flex gap-6">
                {[...benefits.slice(0, 3), ...benefits.slice(0, 3), ...benefits.slice(0, 3), ...benefits.slice(0, 3)].map((ben, idx) => {
                  const Icon = ben.icon;
                  return (
                    <div
                      key={`top-${ben.id}-${idx}`}
                      className="glass-card-neon p-8 rounded-3xl border text-left space-y-4 shadow-sm w-[340px] sm:w-[380px] md:w-[410px] flex-shrink-0"
                    >
                      <div className={`h-11 w-11 rounded-xl flex items-center justify-center border ${ben.bg}`}>
                        <Icon className={`h-5.5 w-5.5 ${ben.color}`} />
                      </div>
                      <h3 className="text-lg font-bold text-white">{ben.title}</h3>
                      <p className="text-[#CBD5E1] text-xs leading-relaxed font-medium">{ben.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* BOTTOM ROW: RIGHT -> LEFT */}
            <div className="w-full overflow-hidden">
              <div className="partner-marquee-rl flex gap-6">
                {[...benefits.slice(3, 6), ...benefits.slice(3, 6), ...benefits.slice(3, 6), ...benefits.slice(3, 6)].map((ben, idx) => {
                  const Icon = ben.icon;
                  return (
                    <div
                      key={`bottom-${ben.id}-${idx}`}
                      className="glass-card-neon p-8 rounded-3xl border text-left space-y-4 shadow-sm w-[340px] sm:w-[380px] md:w-[410px] flex-shrink-0"
                    >
                      <div className={`h-11 w-11 rounded-xl flex items-center justify-center border ${ben.bg}`}>
                        <Icon className={`h-5.5 w-5.5 ${ben.color}`} />
                      </div>
                      <h3 className="text-lg font-bold text-white">{ben.title}</h3>
                      <p className="text-[#CBD5E1] text-xs leading-relaxed font-medium">{ben.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 4: PARTNER CATEGORIES */}
        <div id="partner-categories" className="relative space-y-12 sm:space-y-14">
          {/* Subtle decorative background shapes and small dotted pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(rgba(10,49,97,0.035)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none -mx-4 sm:-mx-6 lg:-mx-8 rounded-3xl" />
          <div className="absolute -top-16 -left-16 w-80 h-80 rounded-full bg-blue-300/10 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 -right-16 w-80 h-80 rounded-full bg-indigo-300/10 blur-3xl pointer-events-none" />

          {/* Hero Header */}
          <div className="relative z-10 text-center max-w-2xl mx-auto space-y-3.5">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#FF6325]/10 border border-[#FF6325]/20 text-[#FF6325] text-xs font-semibold uppercase tracking-wider">
              <Users className="h-3.5 w-3.5" />
              <span>Alliance Tiers</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold text-[#0A3161] tracking-tight">Partner Categories</h2>
            <p className="text-[#475569] text-sm sm:text-base leading-relaxed max-w-xl mx-auto">
              Discover where your business fits inside the Beta Strategic network.
            </p>
          </div>

          {/* 5 CARDS: DESKTOP (3 IN FIRST ROW, 2 CENTERED IN SECOND ROW), TABLET (2 PER ROW), MOBILE (1 PER ROW) */}
          <div className="relative z-10 flex flex-wrap justify-center gap-8">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <div
                  key={cat.title}
                  className="partner-category-card p-7 sm:p-8 group cursor-pointer"
                >
                  {/* Subtle translucent circular accent shape in bottom-right corner */}
                  <div className={`absolute -bottom-8 -right-8 w-24 h-24 rounded-full pointer-events-none opacity-[0.08] ${cat.accentBg} blur-xl`} />
                  <div className={`absolute -bottom-5 -right-5 w-16 h-16 rounded-full pointer-events-none opacity-[0.05] ${cat.accentBg}`} />

                  <div className="relative z-10 space-y-5">
                    {/* Card Header: Icon top-left, Arrow button top-right */}
                    <div className="flex items-center justify-between">
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center border ${cat.iconBorder} ${cat.iconBg} ${cat.iconHoverBg} transition-all duration-300`}>
                        <Icon className={`h-5 w-5 ${cat.color}`} />
                      </div>
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 group-hover:text-slate-600 group-hover:bg-slate-50 transition-all duration-300">
                        <ArrowRight className="h-4.5 w-4.5 transform group-hover:translate-x-1.5 transition-transform duration-300 ease-out" />
                      </div>
                    </div>

                    {/* Title & Description */}
                    <div className="space-y-2 text-left">
                      <h3 className="text-xl font-bold text-[#0A3161] tracking-tight">{cat.title}</h3>
                      <p className="text-sm text-[#475569] leading-relaxed font-normal">{cat.desc}</p>
                    </div>
                  </div>

                  {/* Thin horizontal divider & Action with small colored arrow */}
                  <div className="relative z-10 border-t border-[#DCE5F0] pt-4 mt-6 text-left">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#64748B] group-hover:text-[#0A3161] transition-colors duration-300">
                      <span>EXPLORE PROGRAM SPECS</span>
                      <ArrowRight className={`h-3.5 w-3.5 ${cat.arrowColor || cat.color} transform group-hover:translate-x-1 transition-transform duration-300`} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* SECTION 5: SUCCESS METRICS SECTION */}
        <StatisticsSection />

        </div>

        {/* SECTION 6: PARTNER SUCCESS STORIES */}
        <section className="relative w-full py-16 sm:py-20 md:py-24 bg-[#D5EEFE] overflow-hidden select-none">
          {/* Top-Right Blue Halftone / Dotted Pattern */}
          <div className="absolute top-0 right-0 w-64 sm:w-80 md:w-[440px] h-64 sm:h-80 md:h-[440px] pointer-events-none z-0">
            <svg className="w-full h-full" viewBox="0 0 400 400" fill="none">
              <defs>
                <pattern id="halftoneTR" x="0" y="0" width="14" height="14" patternUnits="userSpaceOnUse">
                  <circle cx="2" cy="2" r="1.8" fill="#0055CC" opacity="0.65" />
                  <circle cx="9" cy="7" r="2.2" fill="#0066EE" opacity="0.55" />
                  <circle cx="5" cy="12" r="1.5" fill="#0284C7" opacity="0.6" />
                  <circle cx="12" cy="3" r="1.2" fill="#0044BB" opacity="0.7" />
                </pattern>
                <mask id="halftoneMaskTR">
                  <path d="M 400,0 L 180,0 C 240,90 290,170 400,260 Z" fill="white" />
                  <path d="M 400,0 C 160,70 190,230 400,370 Z" fill="white" opacity="0.7" />
                </mask>
              </defs>
              <rect width="400" height="400" fill="url(#halftoneTR)" mask="url(#halftoneMaskTR)" />
              <path d="M 210,0 C 260,110 300,190 400,240" stroke="#0055CC" strokeWidth="2.5" strokeDasharray="3 4" strokeOpacity="0.8" />
              <path d="M 170,0 C 230,140 280,240 400,300" stroke="#0077EE" strokeWidth="2" strokeDasharray="2 5" strokeOpacity="0.65" />
              <path d="M 130,0 C 200,170 260,290 400,360" stroke="#0284C7" strokeWidth="1.5" strokeDasharray="1 4" strokeOpacity="0.5" />
            </svg>
          </div>

          {/* Bottom-Left Blue Halftone / Dotted Pattern */}
          <div className="absolute bottom-0 left-0 w-64 sm:w-80 md:w-[440px] h-64 sm:h-80 md:h-[440px] pointer-events-none z-0">
            <svg className="w-full h-full" viewBox="0 0 400 400" fill="none">
              <defs>
                <pattern id="halftoneBL" x="0" y="0" width="14" height="14" patternUnits="userSpaceOnUse">
                  <circle cx="2" cy="2" r="1.8" fill="#0055CC" opacity="0.65" />
                  <circle cx="9" cy="7" r="2.2" fill="#0066EE" opacity="0.55" />
                  <circle cx="5" cy="12" r="1.5" fill="#0284C7" opacity="0.6" />
                  <circle cx="12" cy="3" r="1.2" fill="#0044BB" opacity="0.7" />
                </pattern>
                <mask id="halftoneMaskBL">
                  <path d="M 0,400 L 0,180 C 90,240 170,290 260,400 Z" fill="white" />
                  <path d="M 0,400 C 70,160 230,190 370,400 Z" fill="white" opacity="0.7" />
                </mask>
              </defs>
              <rect width="400" height="400" fill="url(#halftoneBL)" mask="url(#halftoneMaskBL)" />
              <path d="M 0,210 C 110,260 190,300 240,400" stroke="#0055CC" strokeWidth="2.5" strokeDasharray="3 4" strokeOpacity="0.8" />
              <path d="M 0,170 C 140,230 240,280 300,400" stroke="#0077EE" strokeWidth="2" strokeDasharray="2 5" strokeOpacity="0.65" />
              <path d="M 0,130 C 170,200 290,260 360,400" stroke="#0284C7" strokeWidth="1.5" strokeDasharray="1 4" strokeOpacity="0.5" />
            </svg>
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Heading, Subtitle & Button */}
            <div className="lg:col-span-4 text-left space-y-4 pt-2">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-white text-[#0066FF] border border-white/80 shadow-sm text-xs font-bold uppercase tracking-wider">
                <BarChart2 className="h-3.5 w-3.5" />
                <span>SUCCESS STORIES</span>
              </div>
              <h2 className="text-4xl sm:text-5xl font-black text-[#0B2545] tracking-tight leading-[1.1]">
                Partner<br />Success Stories
              </h2>
              <p className="text-[#1B3E68] text-sm sm:text-base leading-relaxed max-w-sm font-medium">
                Real-world metrics and smart partnerships from organizations across industries worldwide.
              </p>
              <div className="pt-2">
                <button className="px-7 py-3 rounded-full text-sm font-bold text-white bg-[#0066FF] hover:bg-[#0052CC] shadow-md shadow-blue-700/20 transition-all duration-200 cursor-pointer inline-flex items-center justify-center">
                  See all stories
                </button>
              </div>
            </div>

            {/* Right Column: Navigation Arrows & Story Cards Carousel */}
            <div className="lg:col-span-8 space-y-4 w-full min-w-0">
              {/* Slider Buttons Aligned Top-Right */}
              <div className="flex justify-end space-x-2.5">
                <button
                  onClick={() => scrollCarousel('left')}
                  className="w-10 h-10 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-white/80 transition-all duration-200 flex items-center justify-center cursor-pointer shadow-sm hover:scale-105 active:scale-95"
                  aria-label="Previous story"
                >
                  <ChevronLeft className="h-4.5 w-4.5" />
                </button>
                <button
                  onClick={() => scrollCarousel('right')}
                  className="w-10 h-10 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-white/80 transition-all duration-200 flex items-center justify-center cursor-pointer shadow-sm hover:scale-105 active:scale-95"
                  aria-label="Next story"
                >
                  <ChevronRight className="h-4.5 w-4.5" />
                </button>
              </div>

              {/* Horizontal Scroll Story Grid (White Cards standing out on #9DD1F5) */}
              <div
                ref={carouselRef}
                className="flex space-x-5 overflow-x-auto pb-4 scrollbar-none snap-x snap-mandatory text-left"
              >
                {successStories.map((story) => (
                  <div
                    key={story.id}
                    className="relative flex-shrink-0 w-[295px] sm:w-[325px] md:w-[335px] snap-start rounded-[24px] bg-white p-6 sm:p-7 flex flex-col justify-between shadow-[0_10px_30px_rgba(0,50,120,0.08)] border border-white/80 group select-none min-h-[370px]"
                  >
                    <div className="relative z-10 space-y-5">
                      {/* Category Pill Outline */}
                      <div className="inline-block">
                        <span className="px-3.5 py-1 rounded-full border border-[#BFDBFE] text-[#0066FF] text-[10px] font-bold uppercase tracking-wider bg-[#EAF4FF]">
                          {story.category}
                        </span>
                      </div>

                      {/* Quote */}
                      <p className="text-slate-800 text-sm sm:text-[15px] font-medium leading-relaxed">
                        “{story.desc}”
                      </p>
                    </div>

                    {/* Divider and Partner info (No 'Read story' or arrow) */}
                    <div className="relative z-10 pt-5 mt-4 border-t border-slate-100">
                      <div className="flex items-center space-x-3.5">
                        <div className={`w-10 h-10 rounded-xl ${story.logoBg || 'bg-[#0066FF]'} flex items-center justify-center font-black text-xs text-white shadow-sm flex-shrink-0`}>
                          {story.logo}
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-sm font-bold text-[#0B2545] tracking-tight truncate">{story.name}</h4>
                          <p className="text-[11px] text-slate-500 font-medium">Strategic Partner</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24 space-y-36">

        {/* SECTION 7: PARTNERSHIP JOURNEY ROADMAP */}
        <motion.div
          variants={journeyContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
          className="space-y-16 will-change-transform"
        >
          <div className="text-center max-w-2xl mx-auto space-y-3">
            {/* 1. PROGRESSION ROADMAP badge */}
            <motion.div
              variants={journeyItemVariants}
              className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#FF6325]/10 border border-[#FF6325]/20 text-[#FF6325] text-xs font-semibold uppercase tracking-wider"
            >
              <Zap className="h-3.5 w-3.5" />
              <span>Progression Roadmap</span>
            </motion.div>

            {/* 2. Partnership Journey heading */}
            <motion.h2
              variants={journeyItemVariants}
              className="text-3xl md:text-5xl font-extrabold text-white"
            >
              Partnership Journey
            </motion.h2>

            {/* 3. Subtitle */}
            <motion.p
              variants={journeyItemVariants}
              className="text-[#CBD5E1] text-sm"
            >
              Visualizing the integration milestones from application submission to launching growth programs.
            </motion.p>
          </div>

          {/* 4. Main roadmap container */}
          <motion.div
            variants={journeyItemVariants}
            className="glass-card-neon p-8 rounded-3xl border border-white/10 shadow-xl text-left relative overflow-hidden"
          >
            {/* Horizontal Timeline flow */}
            <motion.div
              variants={journeyStepsContainerVariants}
              className="relative flex flex-col md:flex-row items-start md:items-stretch justify-between gap-8 md:gap-4 overflow-x-auto pb-4 scrollbar-none"
            >
              {journeyRoadmap.map((node, idx) => {
                const colorSet = getRoadmapColor(idx);
                return (
                  <motion.div
                    key={node.step}
                    variants={journeyStepVariants}
                    className="flex-1 min-w-[140px] space-y-4 relative group"
                  >
                    {/* glowing step number node circle */}
                    <div className="flex items-center space-x-3">
                      <div className={`h-9 w-9 rounded-full bg-slate-900 border ${colorSet.border} flex items-center justify-center font-black text-xs ${colorSet.text} shadow-md ${colorSet.shadow} ${colorSet.hoverBg} ${colorSet.hoverText} transition duration-300`}>
                        {node.step}
                      </div>
                      {/* Connecting line */}
                      {idx < journeyRoadmap.length - 1 && (
                        <div className="hidden md:block h-[1px] flex-grow bg-gradient-to-r from-[#FF6325]/40 via-[#0E0F89]/40 to-[#135029]/40" />
                      )}
                    </div>

                    <div className="space-y-1 pr-4">
                      <h4 className={`text-sm font-black text-white ${colorSet.focusText} transition-colors`}>{node.title}</h4>
                      <p className="text-[10px] text-[#CBD5E1] leading-relaxed font-medium">{node.desc}</p>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.div>
        </motion.div>

        {/* SECTION 8: RESOURCES SECTION (CONTINUOUS AUTO-SCROLLING MARQUEE) */}
        <PartnerResourcesMarqueeSection />

        {/* SECTION 9: MULTI-STEP PARTNER APPLICATION SECTION */}
        <motion.div
          id="apply-wizard"
          variants={portalContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
          className="max-w-2xl mx-auto space-y-8 will-change-transform"
        >
          <div className="text-center space-y-3">
            <motion.h2 variants={portalItemVariants} className="text-3xl md:text-4xl font-extrabold text-white">
              Partner Application Portal
            </motion.h2>
            <motion.p variants={portalItemVariants} className="text-[#CBD5E1] text-sm">
              Submit strategic details. Step through our forms to register your organization.
            </motion.p>
          </div>

          {/* Step Progress indicators */}
          <motion.div
            variants={portalItemVariants}
            className="flex items-center justify-between max-w-md mx-auto select-none"
          >
            {[1, 2, 3, 4].map((stepNum) => (
              <div key={stepNum} className="flex items-center flex-1 last:flex-none">
                <div
                  className={`h-8 w-8 rounded-full border flex items-center justify-center text-xs font-black transition-all duration-300 ${currentStep === stepNum
                    ? 'bg-[#FF6325] border-[#FF6325] text-white shadow-md shadow-[#FF6325]/20 scale-105'
                    : currentStep > stepNum
                      ? 'bg-[#0E0F89] border-[#0E0F89] text-white'
                      : 'bg-slate-900 border-slate-800 text-slate-500'
                    }`}
                >
                  {stepNum}
                </div>
                {stepNum < 4 && (
                  <div className={`h-[2px] flex-grow mx-2 ${currentStep > stepNum ? 'bg-[#0E0F89]' : 'bg-slate-800'}`} />
                )}
              </div>
            ))}
          </motion.div>

          {/* Form container */}
          <motion.div
            variants={portalItemVariants}
            className="glass-card-neon p-8 rounded-3xl border border-white/10 shadow-2xl relative"
          >
            <form onSubmit={handleSubmit} className="space-y-6 text-left">
              <AnimatePresence mode="wait">
                {currentStep === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -15 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-4"
                  >
                    <h3 className="text-lg font-bold text-white border-b border-white/5 pb-2 mb-4">Step 1: Company Profile</h3>

                    <div className="space-y-1">
                      <label className="text-xs font-extrabold text-slate-400 uppercase">Company Name</label>
                      <input
                        type="text"
                        required
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="e.g. Acme Corporation"
                        className="w-full bg-[#0A3161]/50 text-white placeholder-slate-450 border border-white/10 rounded-xl py-2.5 px-4 focus:outline-none focus:border-[#FF6325] text-sm transition"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-extrabold text-slate-400 uppercase">Website URL</label>
                        <input
                          type="url"
                          required
                          value={website}
                          onChange={(e) => setWebsite(e.target.value)}
                          placeholder="e.g. https://acme.com"
                          className="w-full bg-[#0A3161]/50 text-white placeholder-slate-450 border border-white/10 rounded-xl py-2.5 px-4 focus:outline-none focus:border-[#FF6325] text-sm transition"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-extrabold text-slate-400 uppercase">Company Size</label>
                        <select
                          value={companySize}
                          onChange={(e) => setCompanySize(e.target.value)}
                          className="w-full bg-[#0A3161]/50 text-white border border-white/10 rounded-xl py-2.5 px-4 focus:outline-none focus:border-[#FF6325] text-sm transition"
                        >
                          <option value="1-10" className="bg-slate-900">1-10 Employees</option>
                          <option value="11-50" className="bg-slate-900">11-50 Employees</option>
                          <option value="51-200" className="bg-slate-900">51-200 Employees</option>
                          <option value="201-500" className="bg-slate-900">201-500 Employees</option>
                          <option value="500+" className="bg-slate-900">500+ Employees</option>
                        </select>
                      </div>
                    </div>
                  </motion.div>
                )}

                {currentStep === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -15 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-4"
                  >
                    <h3 className="text-lg font-bold text-white border-b border-white/5 pb-2 mb-4">Step 2: Partnership Details</h3>

                    <div className="space-y-1">
                      <label className="text-xs font-extrabold text-slate-400 uppercase">Partnership Type</label>
                      <select
                        value={partnerType}
                        onChange={(e) => setPartnerType(e.target.value)}
                        className="w-full bg-[#0A3161]/50 text-white border border-white/10 rounded-xl py-2.5 px-4 focus:outline-none focus:border-[#FF6325] text-sm transition"
                      >
                        <option value="Technology Partner" className="bg-slate-900">Technology Partner</option>
                        <option value="Integration Partner" className="bg-slate-900">Integration Partner</option>
                        <option value="Reseller Partner" className="bg-slate-900">Reseller Partner</option>
                        <option value="Consulting Partner" className="bg-slate-900">Consulting Partner</option>
                        <option value="Strategic Alliance Partner" className="bg-slate-900">Strategic Alliance Partner</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-extrabold text-slate-400 uppercase">Regional Market Focus</label>
                      <select
                        value={marketFocus}
                        onChange={(e) => setMarketFocus(e.target.value)}
                        className="w-full bg-[#0A3161]/50 text-white border border-white/10 rounded-xl py-2.5 px-4 focus:outline-none focus:border-[#FF6325] text-sm transition"
                      >
                        <option value="Global" className="bg-slate-900">Global / Multi-region</option>
                        <option value="North America" className="bg-slate-900">North America (US/CA)</option>
                        <option value="Europe" className="bg-slate-900">Europe (EMEA)</option>
                        <option value="Asia Pacific" className="bg-slate-900">Asia Pacific (APAC)</option>
                        <option value="Latin America" className="bg-slate-900">Latin America (LATAM)</option>
                      </select>
                    </div>
                  </motion.div>
                )}

                {currentStep === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -15 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-4"
                  >
                    <h3 className="text-lg font-bold text-white border-b border-white/5 pb-2 mb-4">Step 3: Partnership Proposal</h3>

                    <div className="space-y-1">
                      <label className="text-xs font-extrabold text-slate-400 uppercase">Proposal Summary</label>
                      <textarea
                        required
                        rows="4"
                        value={proposal}
                        onChange={(e) => setProposal(e.target.value)}
                        placeholder="Briefly describe how we can co-sell, build integrated APIs, or distribute software solutions together..."
                        className="w-full bg-[#0A3161]/50 text-white placeholder-slate-450 border border-white/10 rounded-xl py-2.5 px-4 focus:outline-none focus:border-[#FF6325] text-sm transition resize-none"
                      />
                    </div>
                  </motion.div>
                )}

                {currentStep === 4 && (
                  <motion.div
                    key="step4"
                    initial={{ opacity: 0, x: 15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -15 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-4"
                  >
                    <h3 className="text-lg font-bold text-white border-b border-white/5 pb-2 mb-4">Step 4: Contact Point</h3>

                    <div className="space-y-1">
                      <label className="text-xs font-extrabold text-slate-400 uppercase">Contact Full Name</label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Bruce Wayne"
                        className="w-full bg-[#0A3161]/50 text-white placeholder-slate-450 border border-white/10 rounded-xl py-2.5 px-4 focus:outline-none focus:border-[#FF6325] text-sm transition"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-extrabold text-slate-400 uppercase">Corporate Email</label>
                        <input
                          type="email"
                          required
                          value={workEmail}
                          onChange={(e) => setWorkEmail(e.target.value)}
                          placeholder="e.g. bruce@waynecorp.com"
                          className="w-full bg-[#0A3161]/50 text-white placeholder-slate-450 border border-white/10 rounded-xl py-2.5 px-4 focus:outline-none focus:border-[#FF6325] text-sm transition"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-extrabold text-slate-400 uppercase">Phone Number</label>
                        <input
                          type="text"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="e.g. +1 555-0199"
                          className="w-full bg-[#0A3161]/50 text-white placeholder-slate-450 border border-white/10 rounded-xl py-2.5 px-4 focus:outline-none focus:border-[#FF6325] text-sm transition"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Navigation buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-white/5">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className={`px-5 py-2 rounded-xl text-xs font-bold bg-white/5 text-[#CBD5E1] border border-white/10 hover:border-white/20 transition cursor-pointer select-none ${currentStep === 1 ? 'opacity-30 pointer-events-none' : ''
                    }`}
                >
                  Previous Step
                </button>

                {currentStep < 4 ? (
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl text-xs font-black text-white bg-[#FF6325] hover:bg-[#e0531b] transition shadow-md cursor-pointer select-none"
                  >
                    Next Step
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="px-6 py-2.5 rounded-xl text-xs font-black text-white bg-gradient-to-r from-[#FF6325] to-[#0E0F89] hover:from-[#e0531b] hover:to-[#0c0d75] border border-[#FF6325]/50 transition shadow-md cursor-pointer select-none disabled:bg-slate-800 disabled:text-slate-500"
                  >
                    {status === 'loading' ? 'Submitting Details...' : 'Submit Application'}
                  </button>
                )}
              </div>
            </form>

            {/* Success and Error Alerts */}
            <AnimatePresence>
              {status === 'success' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-450 flex items-center space-x-2 text-left"
                >
                  <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-emerald-450" />
                  <span>{statusMsg}</span>
                </motion.div>
              )}
              {status === 'error' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-400 flex items-center space-x-2 text-left"
                >
                  <AlertCircle className="h-5 w-5 flex-shrink-0 text-rose-400" />
                  <span>{statusMsg}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>

        {/* SECTION 10: FINAL CTA SECTION */}
        <div className="relative overflow-hidden rounded-3xl p-10 md:p-16 border border-[#0A3161]/15 text-center shadow-2xl" style={{ background: 'linear-gradient(135deg, #F2FAF5 0%, #E7EFFB 33%, #EAEBFA 66%, #FFEAE2 100%)' }}>
          {/* Floating blur circles */}
          <div className="absolute top-[-40px] left-[-40px] w-52 h-52 bg-white/40 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute bottom-[-40px] right-[-40px] w-64 h-64 bg-white/40 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 space-y-6 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-black text-white leading-tight">
              Let's Build the Future Together
            </h2>
            <p className="text-white/80 max-w-xl mx-auto text-sm md:text-base leading-relaxed font-medium">
              Consolidate API capabilities, co-sell integrations, and scaling software solutions on top of the Beta platform.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
              <a
                href="#apply-wizard"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl text-sm font-black bg-[#FF6325] hover:bg-[#e0531b] text-white transition-all duration-300 hover:scale-[1.02] shadow-md shadow-[#FF6325]/15"
              >
                Become a Partner
              </a>
              <a
                href="/support"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl text-sm font-black bg-white hover:bg-slate-50 text-[#0A3161] border border-[#0A3161]/15 hover:border-[#0A3161]/35 transition-all duration-300 hover:scale-[1.02]"
              >
                Schedule a Meeting
              </a>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
