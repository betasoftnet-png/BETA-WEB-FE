import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import CtaEcosystemVisual from '../components/CtaEcosystemVisual';
import {
  ArrowRight,
  Shield,
  Activity,
  Users,
  Globe,
  Zap,
  Sparkles,
  UserCheck,
  Star,
  Cpu,
  Lock,
  Terminal,
  Workflow,
  Award,
  TrendingUp,
  Puzzle
} from 'lucide-react';

// ==========================================
// 3D FLOATING PHILOSOPHY SHOWCASE COMPONENT
// ==========================================
function Philosophy3DShowcase() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(() => typeof window !== 'undefined' ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : false);

  const cards = [
    {
      id: 'build',
      title: 'What We Build',
      desc: 'At Beta Softnet, we develop intelligent software products that help businesses improve efficiency, automate workflows, and accelerate digital transformation. Our products are designed with scalability, security, and user experience at their core, enabling organizations to adapt and grow in an ever-changing digital world.',
      icon: Cpu,
      iconBg: 'bg-blue-50 text-blue-600 border-blue-100',
      titleHover: 'group-hover:text-blue-600',
      glow: 'from-blue-500/10 to-cyan-500/10',
      actionText: 'View our products suite',
      actionColor: 'text-blue-600',
      badge: 'Product Suite',
      badgeBg: 'bg-blue-50 text-blue-700 border-blue-200/70',
      accentBorder: 'hover:border-blue-300',
      accentBg: 'bg-blue-500',
      link: '#products'
    },
    {
      id: 'engineering',
      title: 'Engineering Excellence',
      desc: 'We believe that great products are built with strong engineering practices. Our teams focus on clean architecture, modern technologies, continuous improvement, and high-quality code to deliver reliable and innovative software solutions.',
      icon: Terminal,
      iconBg: 'bg-amber-50 text-amber-600 border-amber-100',
      titleHover: 'group-hover:text-amber-600',
      glow: 'from-amber-500/10 to-orange-500/10',
      actionText: 'Explore our codebase standards',
      actionColor: 'text-amber-600',
      badge: 'Engineering Standards',
      badgeBg: 'bg-amber-50 text-amber-700 border-amber-200/70',
      accentBorder: 'hover:border-amber-300',
      accentBg: 'bg-amber-500',
      link: '#careers'
    },
    {
      id: 'innovation',
      title: 'Technology & Innovation',
      desc: 'Innovation drives everything we do. We continuously explore emerging technologies, modern development practices, and creative ideas to build products that solve real-world business challenges and create lasting value.',
      icon: Workflow,
      iconBg: 'bg-purple-50 text-purple-600 border-purple-100',
      titleHover: 'group-hover:text-purple-600',
      glow: 'from-purple-500/10 to-pink-500/10',
      actionText: 'See our roadmap',
      actionColor: 'text-purple-600',
      badge: 'Innovation & R&D',
      badgeBg: 'bg-purple-50 text-purple-700 border-purple-200/70',
      accentBorder: 'hover:border-purple-300',
      accentBg: 'bg-purple-500',
      link: '#about'
    },
    {
      id: 'grow',
      title: 'Grow With Us',
      desc: "We provide an environment where learning never stops. Through real-world projects, mentorship, and collaborative teamwork, you'll gain valuable experience, expand your technical expertise, and build a successful career in product development.",
      icon: Users,
      iconBg: 'bg-emerald-50 text-emerald-600 border-emerald-100',
      titleHover: 'group-hover:text-emerald-600',
      glow: 'from-emerald-500/10 to-teal-500/10',
      actionText: 'Explore active career roles',
      actionColor: 'text-emerald-600',
      badge: 'Culture & Careers',
      badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200/70',
      accentBorder: 'hover:border-emerald-300',
      accentBg: 'bg-emerald-500',
      link: '/careers'
    }
  ];

  const totalCards = cards.length;

  // Check prefers-reduced-motion
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = (e) => setReducedMotion(e.matches);
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    }
  }, []);

  const DISPLAY_TIME = 3000; // 3 seconds display time
  const TRANSITION_TIME = 800; // 800ms animation transition
  const isInitialMount = useRef(true);
  const wasHoveredRef = useRef(false);

  // Exact 3-second display time autoplay lifecycle
  useEffect(() => {
    if (isHovered) {
      wasHoveredRef.current = true;
      return;
    }

    // On initial load or after un-hovering, card is already in center, so wait DISPLAY_TIME (3000ms).
    // During automatic transition or manual navigation, wait TRANSITION_TIME (800ms) + DISPLAY_TIME (3000ms) = 3800ms.
    const isStationary = isInitialMount.current || wasHoveredRef.current;
    const delay = isStationary ? DISPLAY_TIME : (DISPLAY_TIME + TRANSITION_TIME);

    isInitialMount.current = false;
    wasHoveredRef.current = false;

    const timer = setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % totalCards);
    }, delay);

    return () => clearTimeout(timer);
  }, [currentIndex, isHovered, totalCards]);

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % totalCards);
  };

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + totalCards) % totalCards);
  };

  const goToCard = (idx) => {
    setCurrentIndex(idx);
  };

  // Touch swipe gestures for mobile
  const touchStartX = useRef(0);
  const touchDeltaX = useRef(0);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchDeltaX.current = 0;
  };

  const handleTouchMove = (e) => {
    touchDeltaX.current = e.touches[0].clientX - touchStartX.current;
  };

  const handleTouchEnd = () => {
    if (touchDeltaX.current > 45) {
      goToPrev();
    } else if (touchDeltaX.current < -45) {
      goToNext();
    }
    touchDeltaX.current = 0;
  };

  // Calculate 3D styling per card relative to currentIndex
  const getCardStyle = (index) => {
    let offset = (index - currentIndex) % totalCards;
    if (offset > totalCards / 2) offset -= totalCards;
    if (offset < -totalCards / 2) offset += totalCards;

    // Reduced motion fallback
    if (reducedMotion) {
      if (offset === 0) {
        return {
          transform: 'translateX(0) scale(1)',
          opacity: 1,
          zIndex: 30,
          pointerEvents: 'auto',
          visibility: 'visible',
          transition: 'opacity 300ms ease, transform 300ms ease'
        };
      }
      return {
        transform: `translateX(${offset * 80}%) scale(0.9)`,
        opacity: 0,
        zIndex: 10,
        pointerEvents: 'none',
        visibility: 'hidden',
        transition: 'opacity 300ms ease, transform 300ms ease'
      };
    }

    // Modern 3D Carousel Positioning
    if (offset === 0) {
      // Main Center Card
      return {
        transform: 'translateX(0%) translateZ(0px) rotateY(0deg) scale(1)',
        opacity: 1,
        zIndex: 30,
        pointerEvents: 'auto',
        visibility: 'visible',
        boxShadow: '0 25px 50px -12px rgba(0, 74, 173, 0.16), 0 0 0 1px rgba(0, 74, 173, 0.08)',
        transition: 'transform 800ms cubic-bezier(0.25, 1, 0.4, 1), opacity 800ms cubic-bezier(0.25, 1, 0.4, 1), box-shadow 800ms ease'
      };
    } else if (offset === -1) {
      // Left Card (partially visible, scaled down, angled outward)
      return {
        transform: 'translateX(-70%) translateZ(-80px) rotateY(16deg) scale(0.86)',
        opacity: 0.65,
        zIndex: 20,
        pointerEvents: 'auto',
        visibility: 'visible',
        boxShadow: '0 15px 30px -10px rgba(15, 23, 42, 0.08)',
        transition: 'transform 800ms cubic-bezier(0.25, 1, 0.4, 1), opacity 800ms cubic-bezier(0.25, 1, 0.4, 1), box-shadow 800ms ease'
      };
    } else if (offset === 1) {
      // Right Card (partially visible, scaled down, angled outward)
      return {
        transform: 'translateX(70%) translateZ(-80px) rotateY(-16deg) scale(0.86)',
        opacity: 0.65,
        zIndex: 20,
        pointerEvents: 'auto',
        visibility: 'visible',
        boxShadow: '0 15px 30px -10px rgba(15, 23, 42, 0.08)',
        transition: 'transform 800ms cubic-bezier(0.25, 1, 0.4, 1), opacity 800ms cubic-bezier(0.25, 1, 0.4, 1), box-shadow 800ms ease'
      };
    } else {
      // Back / Far Card (Smooth depth exit)
      const exitDir = offset > 0 ? 1 : -1;
      return {
        transform: `translateX(${exitDir * 110}%) translateZ(-180px) rotateY(${exitDir * -24}deg) scale(0.72)`,
        opacity: 0,
        zIndex: 10,
        pointerEvents: 'none',
        visibility: 'hidden',
        transition: 'transform 800ms cubic-bezier(0.25, 1, 0.4, 1), opacity 800ms cubic-bezier(0.25, 1, 0.4, 1)'
      };
    }
  };

  return (
    <div
      className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24 overflow-hidden py-6 bg-transparent"
      style={{ background: 'transparent' }}
    >

      {/* Section Header */}
      <div className="relative z-10 text-center max-w-3xl mx-auto mb-10 sm:mb-14 space-y-4">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-[#004AAD] text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Our Core Philosophy</span>
        </div>
        <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">
          How We Shape the Future
        </h2>
        <p className="text-slate-500 text-base sm:text-lg leading-relaxed font-medium">
          Driven by innovation, engineering excellence, clean code, and continuous growth.
        </p>
      </div>

      {/* 3D Floating Cards Carousel Stage */}
      <div
        className="relative z-10 w-full py-4 sm:py-8 select-none"
        style={{ perspective: '1200px' }}
        onPointerEnter={(e) => {
          if (e.pointerType !== 'touch') setIsHovered(true);
        }}
        onPointerLeave={() => setIsHovered(false)}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="relative h-[440px] sm:h-[400px] md:h-[390px] w-full flex items-center justify-center"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {cards.map((card, idx) => {
            const Icon = card.icon;
            const style = getCardStyle(idx);
            let offset = (idx - currentIndex) % totalCards;
            if (offset > totalCards / 2) offset -= totalCards;
            if (offset < -totalCards / 2) offset += totalCards;
            const isCenter = offset === 0;

            return (
              <div
                key={card.id}
                style={style}
                onClick={() => {
                  if (!isCenter) {
                    if (offset === -1) goToPrev();
                    if (offset === 1) goToNext();
                  }
                }}
                className={`absolute top-0 bottom-0 left-0 right-0 m-auto w-[90vw] max-w-[340px] sm:max-w-[440px] md:max-w-[480px] lg:max-w-[520px] h-[430px] sm:h-[390px] md:h-[380px] rounded-3xl p-7 sm:p-9 bg-white border border-slate-200/90 flex flex-col justify-between transition-colors duration-300 ${
                  isCenter ? 'cursor-default ring-1 ring-blue-500/10' : 'cursor-pointer hover:border-blue-300'
                }`}
              >
                {/* Ambient Glow Pill on Card Top Right */}
                <div className={`absolute -right-16 -top-16 w-40 h-40 rounded-full bg-gradient-to-br ${card.glow} blur-3xl opacity-80 pointer-events-none`} />

                {/* Top Section: Icon & Category Tag */}
                <div className="space-y-5 relative z-10">
                  <div className="flex items-center justify-between">
                    <div className={`h-12 w-12 rounded-2xl flex items-center justify-center border shadow-sm ${card.iconBg} transition-transform duration-300 ${isCenter ? 'scale-105' : ''}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${card.badgeBg}`}>
                      {card.badge}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <div className="space-y-2.5">
                    <h3 className="text-xl sm:text-2xl font-extrabold text-slate-950 tracking-tight">
                      {card.title}
                    </h3>
                    <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-normal">
                      {card.desc}
                    </p>
                  </div>
                </div>

                {/* Bottom Action Link */}
                <div className="relative z-10 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <Link
                    to={card.link}
                    className={`inline-flex items-center text-xs sm:text-sm font-bold ${card.actionColor} hover:underline group`}
                    onClick={(e) => {
                      if (!isCenter) e.preventDefault();
                    }}
                  >
                    <span>{card.actionText}</span>
                    <ArrowRight className="ml-1.5 h-3.5 w-3.5 transform group-hover:translate-x-1 transition-transform" />
                  </Link>

                  {!isCenter && (
                    <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider hidden sm:inline">
                      Click to focus
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* 4-Item Pill Navigation Bar (Matches Reference Design) */}
        <div className="flex items-center justify-center mt-10 relative z-20">
          <div className="inline-flex items-center p-1.5 rounded-full bg-slate-200/70 backdrop-blur-md border border-slate-300/40 shadow-sm max-w-full">
            {[
              { label: 'PRODUCT', cardIndex: 0, title: 'What We Build' },
              { label: 'ENGINEERING', cardIndex: 1, title: 'Engineering Excellence' },
              { label: 'R&D', cardIndex: 2, title: 'Technology & Innovation' },
              { label: 'CAREER', cardIndex: 3, title: 'Grow With Us' }
            ].map((item) => {
              const isActive = currentIndex === item.cardIndex;
              return (
                <button
                  key={item.label}
                  onClick={() => goToCard(item.cardIndex)}
                  aria-label={`Show ${item.title}`}
                  className={`relative px-4 sm:px-6 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-extrabold tracking-wider transition-colors duration-300 cursor-pointer select-none outline-none focus-visible:ring-2 focus-visible:ring-slate-900 ${
                    isActive ? 'text-white' : 'text-slate-700 hover:text-slate-950'
                  }`}
                >
                  {/* Sliding Dark Navy / Black Capsule behind Active Item */}
                  {isActive && (
                    <motion.div
                      layoutId="activePhilosophyPill"
                      className="absolute inset-0 bg-slate-950 rounded-full shadow-md pointer-events-none"
                      transition={{
                        type: 'spring',
                        stiffness: 420,
                        damping: 34
                      }}
                    />
                  )}
                  <span className="relative z-10">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [heroIntroDone, setHeroIntroDone] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setHeroIntroDone(true);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);





  const features = [
    {
      title: 'Security-First Architecture',
      description: 'All interactions, mailboxes, and databases are encrypted with AES-256 and verified through JWT claims.',
      icon: Shield,
      bg: 'bg-blue-50 text-[#004AAD] border-blue-100'
    },
    {
      title: 'Instant WebSocket Sync',
      description: 'Instant updates across devices — no reloads needed.',
      icon: Zap,
      bg: 'bg-amber-50 text-amber-600 border-amber-100'
    },
    {
      title: 'Unified Database Layer',
      description: 'A centralized data ecosystem. Shift mail threads directly into sprint tasks or team discussion boards.',
      icon: Sparkles,
      bg: 'bg-purple-50 text-purple-600 border-purple-100'
    }
  ];

  const stats = [
    { label: 'Active Users', value: '1000+', icon: Users, color: 'text-blue-600' },
    { label: 'Uptime SLA', value: '99.99%', icon: Activity, color: 'text-emerald-600' },
    { label: 'Enterprise Clients', value: '50+', icon: Globe, color: 'text-indigo-600' },
    { label: 'Data Protected', value: '25 PB', icon: Shield, color: 'text-cyan-600' },
  ];

  const testimonials = [
    {
      quote: "Switching our corporate authentication to B2 Auth Security was the best engineering decision we made this year. We achieved SSO with MFA compatibility within days, and the security audit was seamless.",
      author: "Jonathan Sterling",
      title: "VP of Security, CloudSphere Inc.",
      initials: "JS",
      gradient: "from-cyan-400 to-[#004AAD]"
    },
    {
      quote: "BNX Mail's collaborative workspace allowed our support agents to respond to high-priority client mail threads simultaneously. The shared conversations layout has reduced our response time by 40%.",
      author: "Miranda Rodes",
      title: "Operations Director, ApexLogistics",
      initials: "MR",
      gradient: "from-violet-400 to-indigo-600"
    }
  ];


  const principlesMarquee = [
    { title: 'Performance First', desc: 'Sub-millisecond latency', icon: Zap, color: 'text-amber-500', bg: 'bg-amber-50' },
    { title: 'Security by Default', desc: 'End-to-end encryption', icon: Lock, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { title: 'Designed to Scale', desc: 'Elastic infrastructure', icon: TrendingUp, color: 'text-blue-500', bg: 'bg-blue-50' },
    { title: 'Built for Simplicity', desc: 'Effortless user workflows', icon: Puzzle, color: 'text-purple-500', bg: 'bg-purple-50' },
    { title: 'High Availability', desc: '99.99% uptime SLA', icon: Activity, color: 'text-cyan-500', bg: 'bg-cyan-50' },
    { title: 'Zero-Trust Protocol', desc: 'Cryptographic SSO gates', icon: Shield, color: 'text-indigo-500', bg: 'bg-indigo-50' },
    { title: 'Real-Time Sync', desc: 'WebSocket live pipeline', icon: Workflow, color: 'text-rose-500', bg: 'bg-rose-50' },
    { title: 'Global Architecture', desc: 'Edge-distributed workloads', icon: Globe, color: 'text-sky-500', bg: 'bg-sky-50' }
  ];

  return (
    <div className="relative min-h-screen bg-transparent z-10 pt-0 pb-20">
      <style>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes auroraShift {
          0% { background-position: 0% 50%; filter: hue-rotate(0deg); }
          50% { background-position: 100% 50%; filter: hue-rotate(180deg); }
          100% { background-position: 0% 50%; filter: hue-rotate(360deg); }
        }
        .aurora-bg-animate {
          background: linear-gradient(135deg, #3b82f6, #06b6d4, #8b5cf6, #3b82f6);
          background-size: 300% 300%;
          animation: auroraShift 12s ease infinite;
        }
        .group:hover .aurora-bg-animate {
          animation-duration: 4s !important;
        }
        .animated-gradient-text {
          background: linear-gradient(90deg, #60a5fa, #2dd4bf, #c084fc, #60a5fa);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: borderGradientShift 3s linear infinite;
        }
        @keyframes borderGradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes floatQuote {
          0% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
          100% { transform: translateY(0); }
        }
        @keyframes gradientSwirl {
          0% { background-position: 0% 0%; }
          50% { background-position: 100% 100%; }
          100% { background-position: 0% 0%; }
        }
        @keyframes rotateOrbit1 {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes rotateOrbit2 {
          0% { transform: rotate(360deg); }
          100% { transform: rotate(0deg); }
        }
        @keyframes logoPulseGlow {
          0% { transform: scale(1); box-shadow: 0 0 20px rgba(59, 130, 246, 0.4), inset 0 0 15px rgba(59, 130, 246, 0.2); }
          50% { transform: scale(1.04); box-shadow: 0 0 45px rgba(6, 182, 212, 0.7), inset 0 0 25px rgba(6, 182, 212, 0.4); }
          100% { transform: scale(1); box-shadow: 0 0 20px rgba(59, 130, 246, 0.4), inset 0 0 15px rgba(59, 130, 246, 0.2); }
        }
        @keyframes floatParticle {
          0% { transform: translateY(0) scale(0.5); opacity: 0; }
          20% { opacity: 0.8; }
          80% { opacity: 0.8; }
          100% { transform: translateY(-160px) scale(1.2); opacity: 0; }
        }
        .animated-gradient-bg {
          background: linear-gradient(-45deg, #004AAD, #0b66c2, #1e3a8a, #4f46e5);
          background-size: 400% 400%;
          animation: gradientShift 15s ease infinite;
        }
        .hero-blue-banner h1, .hero-blue-banner h2, .hero-blue-banner h3 {
          color: #ffffff !important;
        }
        .hero-blue-banner p {
          color: rgba(241, 245, 249, 0.95) !important;
        }
        .cta-colored-section h2, .cta-colored-section h3, .cta-colored-section h4 {
          color: #ffffff !important;
        }
        .cta-colored-section p {
          color: rgba(241, 245, 249, 0.95) !important;
        }
        .showcase-white-text h3, 
        .showcase-white-text p, 
        .showcase-white-text span {
          color: #ffffff !important;
        }
        @keyframes marqueeLeftToRight {
          0% {
            transform: translateX(-50%);
          }
          100% {
            transform: translateX(0%);
          }
        }
        .marquee-track-lr {
          display: flex;
          width: max-content;
          animation: marqueeLeftToRight 30s linear infinite;
          will-change: transform;
        }
        .marquee-track-lr:hover {
          animation-play-state: paused;
        }
        @media (prefers-reduced-motion: reduce) {
          .marquee-track-lr {
            animation: none !important;
          }
        }

        /* 5-SECOND HIGH-PERFORMANCE 3-SCENE TYPOGRAPHY INTRO */
        .hero-intro-stage {
          perspective: 1200px;
          perspective-origin: center 40%;
          transform-style: preserve-3d;
        }

        /* SCENE 1 (0.0s - 1.5s): "Where Imagination Meets Innovation" */
        @keyframes animScene1 {
          0% {
            opacity: 0;
            transform: translate3d(0, 16px, 0) scale(0.96);
            visibility: visible;
          }
          9% { /* 0.45s: softly faded and settled in */
            opacity: 1;
            transform: translate3d(0, 0, 0) scale(1.0);
            visibility: visible;
          }
          26% { /* 1.3s: hold stable and readable */
            opacity: 1;
            transform: translate3d(0, 0, 0) scale(1.0);
            visibility: visible;
          }
          32% { /* 1.6s: smooth upward morph/reveal dissolve */
            opacity: 0;
            transform: translate3d(0, -12px, 0) scale(1.02);
            visibility: hidden;
          }
          100% {
            opacity: 0;
            transform: translate3d(0, -12px, 0) scale(1.02);
            visibility: hidden;
          }
        }

        /* SCENE 2 (1.5s - 3.2s): "Tomorrow’s Technology Turns Dreams Into Reality" */
        @keyframes animScene2 {
          0%, 26% {
            opacity: 0;
            transform: translate3d(0, 14px, 0) scale(0.97);
            visibility: hidden;
          }
          28% { /* 1.4s: begins unveiling as Scene 1 softly dissolves */
            opacity: 0;
            transform: translate3d(0, 14px, 0) scale(0.97);
            visibility: visible;
          }
          36% { /* 1.8s: fully arrived and crystal clear */
            opacity: 1;
            transform: translate3d(0, 0, 0) scale(1.0);
            visibility: visible;
          }
          58% { /* 2.9s: hold cleanly and readably */
            opacity: 1;
            transform: translate3d(0, 0, 0) scale(1.0);
            visibility: visible;
          }
          65% { /* 3.25s: smooth morph transition out */
            opacity: 0;
            transform: translate3d(0, -12px, 0) scale(1.02);
            visibility: hidden;
          }
          100% {
            opacity: 0;
            transform: translate3d(0, -12px, 0) scale(1.02);
            visibility: hidden;
          }
        }

        /* SCENE 3 (3.2s - 5.0s & Final Screen): "Where Technology Meets Possibility" */
        @keyframes animScene3 {
          0%, 62% {
            opacity: 0;
            transform: translate3d(0, 18px, 0) scale(0.96);
            visibility: hidden;
          }
          64% { /* 3.2s: grand entrance begins */
            opacity: 0;
            transform: translate3d(0, 18px, 0) scale(0.96);
            visibility: visible;
          }
          78% { /* 3.9s: arrived with smooth momentum */
            opacity: 1;
            transform: translate3d(0, -2px, 0) scale(1.005);
            visibility: visible;
          }
          92% { /* 4.6s: settles smoothly into permanent position */
            opacity: 1;
            transform: translate3d(0, 0, 0) scale(1.0);
            visibility: visible;
          }
          100% { /* 5.0s: locked and stable */
            opacity: 1;
            transform: translate3d(0, 0, 0) scale(1.0);
            visibility: visible;
          }
        }

        .hero-scene-1 {
          animation: animScene1 5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          will-change: transform, opacity;
        }
        .hero-scene-2 {
          animation: animScene2 5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          will-change: transform, opacity;
        }
        .hero-scene-3 {
          animation: animScene3 5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          will-change: transform, opacity;
        }

        /* SUBTLE FULL-SCREEN CORPORATE AMBIENT BACKGROUND MOTION */
        .hero-ambient-blob-1 {
          background: radial-gradient(ellipse at center, rgba(0, 74, 173, 0.08) 0%, rgba(56, 189, 248, 0.04) 50%, transparent 75%);
          animation: blobMotion1 22s ease-in-out infinite alternate;
          will-change: transform;
        }

        .hero-ambient-blob-2 {
          background: radial-gradient(ellipse at center, rgba(124, 58, 237, 0.08) 0%, rgba(236, 72, 153, 0.04) 50%, transparent 75%);
          animation: blobMotion2 26s ease-in-out infinite alternate;
          will-change: transform;
        }

        .hero-ambient-blob-3 {
          background: radial-gradient(ellipse at center, rgba(99, 102, 241, 0.06) 0%, rgba(124, 58, 237, 0.03) 45%, transparent 75%);
          animation: blobMotion3 20s ease-in-out infinite alternate;
          will-change: transform;
        }

        @keyframes blobMotion1 {
          0% {
            transform: translate3d(0, 0, 0) scale(1.0);
          }
          50% {
            transform: translate3d(6vw, 5vh, 0) scale(1.08);
          }
          100% {
            transform: translate3d(3vw, 10vh, 0) scale(0.96);
          }
        }

        @keyframes blobMotion2 {
          0% {
            transform: translate3d(0, 0, 0) scale(1.0);
          }
          50% {
            transform: translate3d(-6vw, -5vh, 0) scale(1.06);
          }
          100% {
            transform: translate3d(-4vw, -9vh, 0) scale(0.95);
          }
        }

        @keyframes blobMotion3 {
          0% {
            transform: translate3d(-50%, -50%, 0) scale(0.96);
          }
          50% {
            transform: translate3d(-48%, -52%, 0) scale(1.05);
          }
          100% {
            transform: translate3d(-52%, -48%, 0) scale(0.98);
          }
        }

        .hero-ambient-curves {
          will-change: transform;
          animation: fullScreenCurvesDrift 28s ease-in-out infinite alternate;
        }

        @keyframes fullScreenCurvesDrift {
          0% {
            transform: translate3d(0, 0, 0);
          }
          50% {
            transform: translate3d(14px, -14px, 0);
          }
          100% {
            transform: translate3d(-14px, 10px, 0);
          }
        }

        .hero-fullscreen-curve-1 {
          animation: fsCurveShift1 16s ease-in-out infinite alternate;
          transform-origin: center;
        }
        .hero-fullscreen-curve-2 {
          animation: fsCurveShift2 20s ease-in-out infinite alternate;
          transform-origin: center;
        }
        .hero-fullscreen-curve-3 {
          animation: fsCurveShift3 24s ease-in-out infinite alternate;
          transform-origin: center;
        }

        @keyframes fsCurveShift1 {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(24px, -18px, 0);
          }
        }

        @keyframes fsCurveShift2 {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(-22px, 16px, 0);
          }
        }

        @keyframes fsCurveShift3 {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(18px, 14px, 0);
          }
        }

        /* Post-5s Static Composition - Zero CPU/GPU animation load */
        .hero-intro-static .hero-scene-1,
        .hero-intro-static .hero-scene-2 {
          display: none !important;
          animation: none !important;
        }
        .hero-intro-static .hero-scene-3 {
          animation: none !important;
          opacity: 1 !important;
          transform: none !important;
          visibility: visible !important;
        }

        @media (prefers-reduced-motion: reduce) {
          .hero-scene-1,
          .hero-scene-2 {
            display: none !important;
            animation: none !important;
          }
          .hero-scene-3 {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
            visibility: visible !important;
          }
          .hero-ambient-blob-1,
          .hero-ambient-blob-2,
          .hero-ambient-blob-3,
          .hero-ambient-curves,
          .hero-fullscreen-curve-1,
          .hero-fullscreen-curve-2,
          .hero-fullscreen-curve-3 {
            animation: none !important;
          }
        }

        /* BETA LOGO SHOWCASE CARD ANIMATIONS */
        .beta-card-glow {
          background: radial-gradient(ellipse 70% 60% at 50% 50%, rgba(255, 255, 255, 0.95) 0%, rgba(224, 242, 254, 0.6) 45%, rgba(238, 242, 255, 0.35) 70%, transparent 100%);
          animation: betaCardGlowShift 10s ease-in-out infinite alternate;
          will-change: transform, opacity;
        }

        @keyframes betaCardGlowShift {
          0% {
            transform: translate3d(-50%, -50%, 0) scale(0.95);
            opacity: 0.8;
          }
          50% {
            transform: translate3d(-48%, -52%, 0) scale(1.05);
            opacity: 1;
          }
          100% {
            transform: translate3d(-52%, -48%, 0) scale(0.98);
            opacity: 0.85;
          }
        }

        .beta-card-curve-1 {
          animation: betaCardCurve1 12s ease-in-out infinite alternate;
          transform-origin: center;
        }
        .beta-card-curve-2 {
          animation: betaCardCurve2 15s ease-in-out infinite alternate;
          transform-origin: center;
        }

        @keyframes betaCardCurve1 {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(10px, -8px, 0);
          }
        }

        @keyframes betaCardCurve2 {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(-10px, 8px, 0);
          }
        }

        .beta-logo-animated {
          animation: betaLogoEntrance 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards, betaLogoFloat 6s ease-in-out 1.2s infinite alternate;
          will-change: transform, opacity;
        }

        @keyframes betaLogoEntrance {
          0% {
            opacity: 0;
            transform: translate3d(0, 12px, 0) scale(0.92);
          }
          100% {
            opacity: 1;
            transform: translate3d(0, 0, 0) scale(1.0);
          }
        }

        @keyframes betaLogoFloat {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(0, -6px, 0);
          }
        }

        /* TOP BRAND MARK BETA TEXT (Static Container - Only letters animate individually) */
        .top-beta-brand-text {
          font-family: 'Saira Stencil One', 'Plus Jakarta Sans', system-ui, sans-serif !important;
          color: #004AAD !important;
          letter-spacing: -0.03em !important;
          filter: drop-shadow(0 2px 6px rgba(0, 74, 173, 0.08));
        }

        /* INDIVIDUAL LETTER REVEAL ANIMATION (Left to Right: B -> E -> T -> A) */
        @keyframes betaLetterReveal {
          0% {
            opacity: 0;
            transform: translate3d(0, 16px, 0) scale(0.94);
            filter: drop-shadow(0 0 0 transparent);
          }
          68% {
            opacity: 1;
            transform: translate3d(0, -1px, 0) scale(1.008);
            filter: drop-shadow(0 0 6px rgba(56, 189, 248, 0.30)) drop-shadow(0 2px 4px rgba(0, 74, 173, 0.12));
          }
          100% {
            opacity: 1;
            transform: translate3d(0, 0, 0) scale(1);
            filter: drop-shadow(0 1px 2px rgba(0, 74, 173, 0.08));
          }
        }

        .beta-letter {
          display: inline-block;
          color: #004AAD !important;
          animation: betaLetterReveal 0.65s cubic-bezier(0.16, 1, 0.3, 1) both;
          will-change: transform, opacity, filter;
          cursor: pointer;
          position: relative;
        }

        .beta-letter:hover {
          z-index: 20;
        }

        /* INDEPENDENT SUBTLE 3D HOVER LIFT & SCALE PER LETTER */
        .beta-letter svg {
          transform: translate3d(0, 0, 0) scale(1);
          transition: transform 300ms cubic-bezier(0.25, 1, 0.5, 1),
                      filter 300ms cubic-bezier(0.25, 1, 0.5, 1);
          will-change: transform, filter;
        }

        .beta-letter:hover svg {
          transform: translate3d(0, -5px, 0) scale(1.045);
          filter: drop-shadow(0 6px 14px rgba(0, 74, 173, 0.18)) drop-shadow(0 2px 4px rgba(0, 74, 173, 0.10));
        }

        .beta-letter-b {
          animation-delay: 0.05s;
        }
        .beta-letter-e {
          animation-delay: 0.22s;
        }
        .beta-letter-t {
          animation-delay: 0.39s;
        }
        .beta-letter-a {
          animation-delay: 0.56s;
          margin-left: -0.095em;
        }

        @media (prefers-reduced-motion: reduce) {
          .beta-card-glow,
          .beta-card-curve-1,
          .beta-card-curve-2 {
            animation: none !important;
          }
          .beta-logo-animated,
          .top-beta-brand-text,
          .beta-letter {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
            filter: drop-shadow(0 2px 6px rgba(0, 74, 173, 0.08)) !important;
          }
        }
      `}</style>

      {/* HERO SECTION: FULL-VIEWPORT EDGE-TO-EDGE CONTAINER */}
      <div className="relative w-full min-h-screen mb-16 pt-6 pb-12 overflow-hidden flex flex-col justify-center">

        {/* Full-Screen Edge-to-Edge Corporate Ambient Background Motion Layer */}
        <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden z-0 select-none">
          {/* Subtle full-screen gradient movement blooms */}
          <div className="hero-ambient-blob-1 absolute -top-[10%] -left-[10%] w-[60vw] h-[60vh] min-w-[500px] min-h-[400px] rounded-full" />
          <div className="hero-ambient-blob-2 absolute -bottom-[10%] -right-[10%] w-[65vw] h-[65vh] min-w-[550px] min-h-[450px] rounded-full" />
          <div className="hero-ambient-blob-3 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85vw] h-[60vh] min-w-[650px] min-h-[400px] rounded-full" />
          {/* Large faint curved light shapes moving slowly across the ENTIRE screen */}
          <svg
            className="hero-ambient-curves absolute inset-0 w-full h-full"
            viewBox="0 0 1920 1080"
            preserveAspectRatio="xMidYMid slice"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="fullScreenCurveGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#004AAD" stopOpacity="0.08" />
                <stop offset="40%" stopColor="#7C3AED" stopOpacity="0.10" />
                <stop offset="80%" stopColor="#C026D3" stopOpacity="0.06" />
                <stop offset="100%" stopColor="#0284C7" stopOpacity="0.03" />
              </linearGradient>
              <linearGradient id="fullScreenCurveGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.08" />
                <stop offset="50%" stopColor="#6366F1" stopOpacity="0.09" />
                <stop offset="85%" stopColor="#A855F7" stopOpacity="0.06" />
                <stop offset="100%" stopColor="#EC4899" stopOpacity="0.04" />
              </linearGradient>
              <linearGradient id="fullScreenCurveGrad3" x1="0%" y1="50%" x2="100%" y2="50%">
                <stop offset="0%" stopColor="#60A5FA" stopOpacity="0.05" />
                <stop offset="50%" stopColor="#818CF8" stopOpacity="0.07" />
                <stop offset="100%" stopColor="#C084FC" stopOpacity="0.04" />
              </linearGradient>
            </defs>
            <path
              className="hero-fullscreen-curve-1"
              d="M -120,280 C 400,60 850,720 1380,300 C 1680,100 1880,480 2080,360"
              stroke="url(#fullScreenCurveGrad1)"
              strokeWidth="80"
              strokeLinecap="round"
            />
            <path
              className="hero-fullscreen-curve-2"
              d="M -120,780 C 350,960 760,360 1220,720 C 1580,940 1820,500 2080,640"
              stroke="url(#fullScreenCurveGrad2)"
              strokeWidth="70"
              strokeLinecap="round"
            />
            <path
              className="hero-fullscreen-curve-3"
              d="M -100,500 C 460,580 920,160 1480,540 C 1780,720 1940,400 2060,480"
              stroke="url(#fullScreenCurveGrad3)"
              strokeWidth="60"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* Hero Content Layer */}
        <div className="relative z-10 w-full">
          {/* Top Brand Mark: Refined Corporate BETA Wordmark (Taller, Cleaner, Lighter Stroke, Minimal Shadow) */}
          <div className="w-full flex items-center justify-center pt-1 pb-1 sm:pb-1.5 md:pb-2 select-none">
            <span
              className="top-beta-brand-text text-5xl sm:text-6xl md:text-[68px] lg:text-[78px] xl:text-[88px] 2xl:text-[98px] select-none uppercase tracking-[-0.03em] leading-none inline-flex items-center justify-center gap-0.5 sm:gap-1"
              style={{
                fontFamily: "'Saira Stencil One', 'Plus Jakarta Sans', system-ui, sans-serif"
              }}
            >
              <span className="beta-letter beta-letter-b inline-flex items-center">
                <svg viewBox="52 0 548 688" className="h-[1.08em] w-auto inline-block fill-current" fillRule="evenodd" aria-label="B">
                  <path d="M60,0 H225 V688 H60 Z M268,0 H392 Q585,0 585,168 Q585,242 558,280 Q530,316 472,332 V336 Q535,351 562,384 Q592,422 592,502 Q592,592 545,640 Q498,688 392,688 H268 Z M268,252 H285 Q305,252 316,250 Q325,248 331,242 Q336,236 338,227 Q340,218 340,206 Q340,193 338,184 Q336,175 331,169 Q325,163 316,161 Q305,159 285,159 H268 Z M268,520 H289 Q309,520 320,518 Q329,516 335,510 Q340,504 342,494 Q344,484 344,472 Q344,458 342,448 Q340,438 335,432 Q329,424 289,424 H268 Z" />
                </svg>
              </span>
              <span className="beta-letter beta-letter-e inline-flex items-center">
                <svg viewBox="52 0 476 688" className="h-[1.08em] w-auto inline-block fill-current" fillRule="evenodd" aria-label="E">
                  <path d="M60,0 H225 V688 H60 Z M268,0 H520 V184 H268 Z M268,230 H482 V432 H268 Z M268,478 H520 V688 H268 Z" />
                </svg>
              </span>
              <span className="beta-letter beta-letter-t inline-flex items-center">
                <svg viewBox="-2 0 544 688" className="h-[1.105em] w-auto inline-block fill-current" fillRule="evenodd" aria-label="T">
                  <path d="M6,0 H534 V188 H6 Z M170,204 H370 V688 H170 Z" />
                </svg>
              </span>
              <span className="beta-letter beta-letter-a inline-flex items-center -ml-[0.095em]">
                <svg viewBox="4 0 662 688" className="h-[1.08em] w-auto inline-block fill-current" fillRule="evenodd" aria-label="A">
                  <path d="M205,0 H252 L330,290 L204,688 H12 Z M455,535 H272 L315,360 H380 L272,0 H448 L658,688 H478 Z" />
                </svg>
              </span>
            </span>
          </div>

          {/* Central main title / 5-Second 3-Scene 3D Typography Intro Area */}
          <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 text-center pt-0 pb-1 relative select-none hero-intro-stage min-h-[110px] sm:min-h-[125px] md:min-h-[135px] flex items-center justify-center ${heroIntroDone ? 'hero-intro-static' : ''}`}>
            
            {/* SCENE 1 (0s to 1.5s): "Where Imagination Meets Innovation" */}
            <div className="hero-scene-1 absolute inset-0 flex items-center justify-center pointer-events-none z-10 px-4">
              <h2
                className="text-2xl sm:text-3xl md:text-4xl lg:text-[44px] xl:text-5xl font-black tracking-tight leading-tight select-none text-center"
                style={{
                  textShadow: '0 1px 2px rgba(0, 74, 173, 0.12)'
                }}
              >
                <span className="text-[#004AAD]">Where Imagination</span>{" "}
                <span className="text-[#7C3AED]">Meets Innovation</span>
              </h2>
            </div>

            {/* SCENE 2 (1.5s to 3.2s): "Tomorrow’s Technology Turns Dreams Into Reality" */}
            <div className="hero-scene-2 absolute inset-0 flex items-center justify-center pointer-events-none z-10 px-4">
              <h2
                className="text-2xl sm:text-3xl md:text-4xl lg:text-[44px] xl:text-5xl font-black tracking-tight leading-tight select-none text-center"
                style={{
                  textShadow: '0 1px 2px rgba(0, 74, 173, 0.12)'
                }}
              >
                <span className="text-[#004AAD]">Tomorrow’s Technology</span>{" "}
                <span className="text-[#7C3AED]">Turns Dreams Into Reality</span>
              </h2>
            </div>

            {/* SCENE 3 (3.2s to 5.0s & Final Screen): "Where Technology Meets Possibility" */}
            <div className="hero-scene-3 relative z-20 space-y-0.5 sm:space-y-1 py-0.5 w-full max-w-5xl mx-auto">
              {/* Line 1: Where Technology Meets */}
              <h1
                className="text-3xl sm:text-4xl md:text-5xl lg:text-[52px] xl:text-[58px] font-black tracking-tight leading-[1.1] text-[#004AAD] block"
                style={{
                  textShadow: '0 1px 0 #002266, 0 2px 0 #001b52, 0 3px 8px rgba(0, 74, 173, 0.14)'
                }}
              >
                Where Technology Meets
              </h1>

              {/* Line 2: Possibility */}
              <div className="pt-0 block">
                <span
                  className="inline-block text-3xl sm:text-4xl md:text-5xl lg:text-[52px] xl:text-[58px] font-black tracking-tight leading-[1.1] bg-gradient-to-r from-[#7C3AED] via-[#C026D3] to-[#EC4899] bg-clip-text text-transparent"
                  style={{
                    filter: 'drop-shadow(0 2px 8px rgba(124, 58, 237, 0.20))'
                  }}
                >
                  Possibility
                </span>
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center lg:items-end gap-6 w-full">
            {/* Left Column: Heading and description */}
            <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left space-y-6 lg:pb-16">
              <div className="space-y-6 w-full flex flex-col items-center lg:items-start text-center lg:text-left">
                <h2 className="w-full text-slate-900 leading-tight tracking-tight flex flex-col items-center lg:items-start text-center lg:text-left">
                  <span className="block text-3xl sm:text-4xl lg:text-[54px] font-black text-slate-900 tracking-wide">
                    Unified Software for
                  </span>

                  <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent text-3xl sm:text-4xl lg:text-[48px] font-extrabold mt-1 lg:whitespace-nowrap whitespace-normal">
                    Connected Generation
                  </span>
                </h2>

                <p className="mt-2 text-slate-700 text-lg leading-9 text-center lg:text-left w-full max-w-4xl tracking-wide font-medium">
                  Beta builds secure, real-time corporate applications. SMTP mail threads,
                  live authentication protocols, and agile sprints under one dashboard.
                </p>
              </div>
            </div>

            {/* Right Column: Enterprise suite */}
            <div className="w-full lg:w-1/2 h-full flex flex-col justify-center text-left">
              <div className="glass-card bg-white/90 hover:bg-white/95 backdrop-blur-md border border-slate-200/90 p-4 sm:p-5 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 w-full">
                <div className="border-b border-slate-100 pb-2.5 w-full mb-4">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-widest block">
                    Enterprise Suite
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
                  {/* Left Column: Circular Ecosystem Hub Visual (Clean empty center hub without BETA logo) */}
                  <div className="relative w-full h-full min-h-[350px] sm:min-h-[370px] rounded-2xl border border-blue-100/80 bg-gradient-to-br from-[#EFF6FF]/90 via-[#F8FAFC]/80 to-[#EEF2FF]/70 overflow-hidden flex items-center justify-center p-3 select-none">
                    {/* Soft background waves */}
                    <svg
                      className="absolute inset-0 w-full h-full pointer-events-none"
                      viewBox="0 0 340 370"
                      preserveAspectRatio="none"
                      fill="none"
                    >
                      <path
                        d="M -30,120 C 60,70 180,180 370,110 L 370,370 L -30,370 Z"
                        fill="rgba(219, 234, 254, 0.35)"
                      />
                      <path
                        d="M -30,200 C 80,140 200,240 370,170 L 370,370 L -30,370 Z"
                        fill="rgba(238, 242, 255, 0.45)"
                      />
                    </svg>

                    {/* Concentric thin blue connector rings and small connection nodes */}
                    <svg
                      className="absolute inset-0 w-full h-full pointer-events-none"
                      viewBox="0 0 340 370"
                      preserveAspectRatio="xMidYMid meet"
                    >
                      {/* Outer connector circle */}
                      <circle
                        cx="170"
                        cy="185"
                        r="105"
                        fill="none"
                        stroke="#3B82F6"
                        strokeWidth="1.5"
                        strokeOpacity="0.45"
                      />
                      {/* Inner decorative circle */}
                      <circle
                        cx="170"
                        cy="185"
                        r="62"
                        fill="none"
                        stroke="#3B82F6"
                        strokeWidth="1.2"
                        strokeOpacity="0.25"
                      />
                      {/* 4 Connection Node Dots at 45 degree angles on the outer ring */}
                      <circle cx="244" cy="111" r="3.5" fill="#FFFFFF" stroke="#3B82F6" strokeWidth="1.5" strokeOpacity="0.75" />
                      <circle cx="244" cy="259" r="3.5" fill="#FFFFFF" stroke="#3B82F6" strokeWidth="1.5" strokeOpacity="0.75" />
                      <circle cx="96" cy="259" r="3.5" fill="#FFFFFF" stroke="#3B82F6" strokeWidth="1.5" strokeOpacity="0.75" />
                      <circle cx="96" cy="111" r="3.5" fill="#FFFFFF" stroke="#3B82F6" strokeWidth="1.5" strokeOpacity="0.75" />
                    </svg>

                    {/* Clean Empty Circular Hub Center (Completely empty - NO BETA logo or text) */}
                    <div
                      className="absolute z-10 rounded-full border border-blue-200/50 bg-white/40 backdrop-blur-[2px] pointer-events-none"
                      style={{
                        left: '50%',
                        top: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 'clamp(90px, 12vw, 115px)',
                        height: 'clamp(90px, 12vw, 115px)',
                        boxShadow: '0 4px 18px rgba(0, 74, 173, 0.04)'
                      }}
                    />

                    {/* 1. Top Card: BNXmail */}
                    <div className="absolute top-2.5 sm:top-3 left-1/2 -translate-x-1/2 z-20">
                      <div className="w-20 sm:w-24 h-16 sm:h-18 bg-white rounded-2xl p-1.5 sm:p-2 shadow-[0_4px_16px_rgba(0,74,173,0.08)] border border-slate-100 flex flex-col items-center justify-center transition-transform duration-200 hover:scale-105">
                        <img src="/bnx_mail_logo.png" alt="BNXmail" className="h-7 w-7 sm:h-8 sm:w-8 object-contain mb-0.5" />
                        <span className="font-bold text-[10px] sm:text-[11px] text-slate-800 tracking-tight">BNXmail</span>
                      </div>
                    </div>

                    {/* 2. Right Card: Bit-Tool */}
                    <div className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 z-20">
                      <div className="w-20 sm:w-24 h-16 sm:h-18 bg-white rounded-2xl p-1.5 sm:p-2 shadow-[0_4px_16px_rgba(0,74,173,0.08)] border border-slate-100 flex flex-col items-center justify-center transition-transform duration-200 hover:scale-105">
                        <img src="/bit_tool_logo.png" alt="Bit-Tool" className="h-7 w-7 sm:h-8 sm:w-8 object-contain mb-0.5" />
                        <span className="font-bold text-[10px] sm:text-[11px] text-slate-800 tracking-tight">Bit-Tool</span>
                      </div>
                    </div>

                    {/* 3. Bottom Card: Cliks Business */}
                    <div className="absolute bottom-2.5 sm:bottom-3 left-1/2 -translate-x-1/2 z-20">
                      <div className="w-24 sm:w-28 h-16 sm:h-18 bg-white rounded-2xl p-1.5 sm:p-2 shadow-[0_4px_16px_rgba(0,74,173,0.08)] border border-slate-100 flex flex-col items-center justify-center transition-transform duration-200 hover:scale-105">
                        <img src="/cliks_business_logo.png" alt="Cliks Business" className="h-7 w-7 sm:h-8 sm:w-8 object-contain mb-0.5" />
                        <span className="font-bold text-[10px] sm:text-[11px] text-slate-800 tracking-tight whitespace-nowrap">Cliks Business</span>
                      </div>
                    </div>

                    {/* 4. Left Card: B2Auth */}
                    <div className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 z-20">
                      <div className="w-20 sm:w-24 h-16 sm:h-18 bg-white rounded-2xl p-1.5 sm:p-2 shadow-[0_4px_16px_rgba(0,74,173,0.08)] border border-slate-100 flex flex-col items-center justify-center transition-transform duration-200 hover:scale-105">
                        <img src="/b2auth_logo.png" alt="B2Auth" className="h-7 w-7 sm:h-8 sm:w-8 object-contain mb-0.5" />
                        <span className="font-bold text-[10px] sm:text-[11px] text-slate-800 tracking-tight">B2Auth</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: 4 Horizontal Product Cards (BNXmail, Cliks Business, B2Auth, Bit-Tool) */}
                  <div className="flex flex-col gap-2.5 justify-between h-full">
                    {/* 1. BNXmail */}
                    <a
                      href="https://www.bnxmail.com/login"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 rounded-2xl border border-slate-100 bg-white hover:bg-slate-50/80 shadow-sm hover:shadow-md transition-all duration-200 group text-left cursor-pointer"
                    >
                      <div className="h-11 w-11 flex-shrink-0 flex items-center justify-center rounded-xl p-1 transition-transform duration-200 group-hover:scale-105">
                        <img src="/bnx_mail_logo.png" alt="BNXmail" className="h-full w-full object-contain" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-slate-900 group-hover:text-[#004AAD] transition-colors duration-200">
                          BNXmail
                        </h4>
                        <p className="text-slate-500 text-xs font-medium leading-relaxed line-clamp-2">
                          Real time mail, always in sync. “Instant mail, Connected work.”
                        </p>
                      </div>
                    </a>

                    {/* 2. Cliks Business */}
                    <a
                      href="https://www.cliksbusiness.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 rounded-2xl border border-slate-100 bg-white hover:bg-slate-50/80 shadow-sm hover:shadow-md transition-all duration-200 group text-left cursor-pointer"
                    >
                      <div className="h-11 w-11 flex-shrink-0 flex items-center justify-center rounded-xl p-1 transition-transform duration-200 group-hover:scale-105">
                        <img src="/cliks_business_logo.png" alt="Cliks Business" className="h-full w-full object-contain" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-slate-900 group-hover:text-[#004AAD] transition-colors duration-200">
                          Cliks Business
                        </h4>
                        <p className="text-slate-500 text-xs font-medium leading-relaxed line-clamp-2">
                          Connecting businesses, creating opportunities, and enabling growth.
                        </p>
                      </div>
                    </a>

                    {/* 3. B2Auth */}
                    <a
                      href="https://b2auth.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 rounded-2xl border border-slate-100 bg-white hover:bg-slate-50/80 shadow-sm hover:shadow-md transition-all duration-200 group text-left cursor-pointer"
                    >
                      <div className="h-11 w-11 flex-shrink-0 flex items-center justify-center rounded-xl p-1 transition-transform duration-200 group-hover:scale-105">
                        <img src="/b2auth_logo.png" alt="B2Auth" className="h-full w-full object-contain" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-slate-900 group-hover:text-[#004AAD] transition-colors duration-200">
                          B2Auth
                        </h4>
                        <p className="text-slate-500 text-xs font-medium leading-relaxed line-clamp-2">
                          MFA & SSO Gateway for secure access.
                        </p>
                      </div>
                    </a>

                    {/* 4. Bit-Tool */}
                    <a
                      href="https://bit-tool.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 rounded-2xl border border-slate-100 bg-white hover:bg-slate-50/80 shadow-sm hover:shadow-md transition-all duration-200 group text-left cursor-pointer"
                    >
                      <div className="h-11 w-11 flex-shrink-0 flex items-center justify-center rounded-xl p-1 transition-transform duration-200 group-hover:scale-105">
                        <img src="/bit_tool_logo.png" alt="Bit-Tool" className="h-full w-full object-contain" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-slate-900 group-hover:text-[#004AAD] transition-colors duration-200">
                          Bit-Tool
                        </h4>
                        <p className="text-slate-500 text-xs font-medium leading-relaxed line-clamp-2">
                          Daily Utility Assistant.
                        </p>
                      </div>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 3: KEY FEATURES */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24 text-center">
        <div className="max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#E9F4FF] border border-[#004AAD]/20 text-[#004AAD] text-xs font-semibold uppercase tracking-wider">
            <UserCheck className="h-3.5 w-3.5" />
            <span>Key Advantages</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900">
            Engineered for High Performance
          </h2>
          <p className="text-slate-500 text-lg">
            A secure foundation optimized for modern companies that require high availability and compliance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="glass-card glass-card-hover p-8 rounded-3xl border border-slate-200 text-left flex flex-col items-start"
              >
                <div className={`p-3 rounded-2xl border mb-6 flex-shrink-0 ${feat.bg}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{feat.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{feat.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* SECTION 4: STATISTICS COUNTER */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="bg-[#F1F6FC] p-6 md:p-8 rounded-[32px]">
          <div className="bg-[#DFF1FF] rounded-3xl border border-[#DCE8F5] p-8 md:p-12 shadow-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, idx) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: idx * 0.1 }}
                    className="text-center space-y-2 flex flex-col items-center justify-center p-4 rounded-2xl hover:bg-white/40 transition-colors"
                  >
                    <div className="inline-flex p-3 bg-white/70 rounded-2xl mb-2 border border-[#DCE8F5]">
                      <Icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                    <div className="text-3xl md:text-4xl font-extrabold text-[#0753B8]">{stat.value}</div>
                    <div className="text-xs font-extrabold text-[#64748B] uppercase tracking-wider">{stat.label}</div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>



      {/* SECTION: INNOVATION & PHILOSOPHY (PREMIUM 3D FLOATING SHOWCASE) */}
      <Philosophy3DShowcase />

      {/* SECTION: WHY CHOOSE OUR PRODUCTS */}
      <div className="w-full bg-[#EAF6FF] py-20 mb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto mb-16 space-y-4">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#E9F4FF] border border-[#004AAD]/20 text-[#004AAD] text-xs font-semibold uppercase tracking-wider">
              <Award className="h-3.5 w-3.5" />
              <span>Product Highlights</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900">
              Why Choose Our Products?
            </h2>
            <p className="text-slate-500 text-lg">
              Engineered for low-latency synchronization, enterprise-grade security, and seamless workflow integration.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center text-left">
            {/* Left Column: Visual Growth Roadmap */}
            <div className="lg:col-span-5 w-full">
              <div
                className="relative p-6 sm:p-7 rounded-3xl border border-[#D5E5F9]/80 shadow-[0_20px_50px_rgba(30,58,138,0.08)] overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, #F7FBFF 0%, #EEF6FF 50%, #F5F1FF 100%)',
                }}
              >
                {/* Subtle soft bottom wave accent from the reference image */}
                <div className="absolute bottom-0 left-0 right-0 h-24 overflow-hidden rounded-b-3xl pointer-events-none opacity-40">
                  <svg viewBox="0 0 500 120" preserveAspectRatio="none" className="w-full h-full">
                    <path d="M0,60 C150,110 320,20 500,75 L500,120 L0,120 Z" fill="url(#bottomWaveGrad)" />
                    <defs>
                      <linearGradient id="bottomWaveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
                        <stop offset="60%" stopColor="#818cf8" stopOpacity="0.6" />
                        <stop offset="100%" stopColor="#c084fc" stopOpacity="0.5" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>

                <div className="relative z-10 space-y-5">
                  {/* Window Controls Header */}
                  <div className="flex items-center justify-between pb-1">
                    <div className="flex items-center space-x-2">
                      <div className="h-3 w-3 rounded-full bg-[#FF5F56]" />
                      <div className="h-3 w-3 rounded-full bg-[#FFBD2E]" />
                      <div className="h-3 w-3 rounded-full bg-[#27C93F]" />
                    </div>
                    <span className="text-[11px] font-mono text-slate-400">product_architecture.json</span>
                  </div>

                  {/* Pipeline visual steps */}
                  <div className="space-y-3.5">
                    {[
                      {
                        phase: 'Layer 1',
                        title: 'Secure SMTP & Real-Time Sync',
                        status: 'ACTIVE',
                        lineColor: 'bg-[#0088FF]',
                        dotColor: 'bg-emerald-500',
                        pillColor: 'text-emerald-600 bg-emerald-50 border border-emerald-200/60'
                      },
                      {
                        phase: 'Layer 2',
                        title: 'SSO & Multi-Factor Auth Gateway',
                        status: 'VERIFIED',
                        lineColor: 'bg-[#6366F1]',
                        dotColor: 'bg-blue-500',
                        pillColor: 'text-blue-600 bg-blue-50 border border-blue-200/60'
                      },
                      {
                        phase: 'Layer 3',
                        title: 'Live WebSocket Channels & Boards',
                        status: 'CONNECTED',
                        lineColor: 'bg-[#EC4899]',
                        dotColor: 'bg-pink-500',
                        pillColor: 'text-pink-600 bg-pink-50 border border-pink-200/60'
                      },
                      {
                        phase: 'Layer 4',
                        title: 'Centralized Scalable Workspace DB',
                        status: 'SYNCED',
                        lineColor: 'bg-[#F59E0B]',
                        dotColor: 'bg-amber-500',
                        pillColor: 'text-amber-600 bg-amber-50 border border-amber-200/60'
                      }
                    ].map((step, idx) => (
                      <motion.div
                        key={step.phase}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: idx * 0.12 }}
                        className="flex items-center justify-between p-3.5 rounded-2xl bg-white/80 hover:bg-white/95 backdrop-blur-sm border border-white/90 shadow-[0_2px_10px_rgba(0,0,0,0.02)] transition-all duration-200"
                      >
                        <div className="flex items-center space-x-3 overflow-hidden mr-2">
                          <div className={`w-1 h-5 rounded-full ${step.lineColor} flex-shrink-0`} />
                          <span className="text-xs font-medium text-slate-400 w-12 flex-shrink-0">{step.phase}</span>
                          <span className="text-xs sm:text-sm font-bold text-slate-800 truncate">{step.title}</span>
                        </div>
                        <span className={`text-[10px] font-bold tracking-wider px-2.5 py-1 rounded-full flex items-center space-x-1.5 flex-shrink-0 ${step.pillColor}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${step.dotColor}`} />
                          <span>{step.status}</span>
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Key Benefits */}
            <div className="lg:col-span-7 space-y-4">
              {[
                {
                  title: 'Real-Time Collaboration',
                  desc: 'Sync team messages, sprint boards, and document revisions instantly across teams using optimized bi-directional WebSocket protocols.',
                  icon: Zap,
                  bg: 'bg-amber-50 text-amber-600 border-amber-100'
                },
                {
                  title: 'Enterprise Security & SSO',
                  desc: 'Protect corporate workloads with cryptographically signed JSON Web Tokens (JWT) and multi-factor validation flows.',
                  icon: Users,
                  bg: 'bg-blue-50 text-blue-600 border-blue-100'
                },
                {
                  title: 'High Availability Relays',
                  desc: 'Our BNX mail relays feature a 99.99% uptime SLA with active load balancers and robust queue managers.',
                  icon: Workflow,
                  bg: 'bg-emerald-50 text-emerald-600 border-emerald-100'
                },
                {
                  title: 'Centralized Workspaces',
                  desc: 'Consolidate your business toolchain. Seamlessly bridge email threads into sprint tasks or live discussion boards.',
                  icon: Award,
                  bg: 'bg-purple-50 text-purple-600 border-purple-100'
                }
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: idx * 0.08 }}
                    className="glass-card hover:bg-white/90 p-5 rounded-2xl border border-slate-200/80 flex items-start space-x-4 shadow-sm hover:shadow-md transition-all duration-300 group cursor-default"
                  >
                    <div className={`p-3 rounded-xl border flex-shrink-0 mt-0.5 transition-colors ${item.bg}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="space-y-1 text-left">
                      <h3 className="text-sm font-extrabold text-slate-900 group-hover:text-[#004AAD] transition-colors duration-200">
                        {item.title}
                      </h3>
                      <p className="text-slate-500 text-xs leading-relaxed font-medium">
                        {item.desc}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

            {/* SECTION 5: CUSTOMER TESTIMONIALS */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24 text-center">
              <div className="max-w-3xl mx-auto mb-16 space-y-4">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#E9F4FF] border border-[#004AAD]/20 text-[#004AAD] text-xs font-semibold uppercase tracking-wider">
                  <Users className="h-3.5 w-3.5" />
                  <span>Success Stories</span>
                </div>
                <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900">
                  Trusted by Innovation Leaders
                </h2>
                <p className="text-slate-500 text-lg">
                  Hear from engineering and security leaders running critical corporate systems on our platform.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {testimonials.map((test, idx) => (
                  <motion.div
                    key={test.author}
                    initial={{ opacity: 0, x: idx % 2 === 0 ? -30 : 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="glass-card p-8 rounded-3xl border border-slate-200 text-left flex flex-col justify-between space-y-6 shadow-sm"
                  >
                    {/* Star rating */}
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>

                    {/* Quote */}
                    <p className="text-slate-650 italic text-sm md:text-base leading-relaxed">
                      "{test.quote}"
                    </p>

                    {/* User Info */}
                    <div className="flex items-center space-x-3 pt-4 border-t border-slate-100">
                      <div className={`h-11 w-11 rounded-full bg-gradient-to-tr ${test.gradient} flex items-center justify-center font-bold text-white text-sm shadow-sm`}>
                        {test.initials}
                      </div>
                      <div>
                        <h4 className="text-sm font-extrabold text-slate-900">{test.author}</h4>
                        <p className="text-xs text-slate-500">{test.title}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* SECTION 5.5: THE PRINCIPLES BEHIND EVERY PRODUCT */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24 text-center">
              <div className="max-w-3xl mx-auto text-center mb-12 space-y-4 animate-fadeIn">
                <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
                  The Principles Behind Every Product
                </h2>
                <p className="text-slate-500 text-sm md:text-base leading-relaxed font-semibold">
                  Discover the core foundations of performance, security, scaling, and simplicity that dictate our engineering standards.
                </p>
              </div>

              {/* CONTINUOUS HORIZONTAL MARQUEE (LEFT -> RIGHT) */}
              <div className="relative w-full overflow-hidden py-8 mb-12 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)] [-webkit-mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
                <div className="marquee-track-lr flex items-center">
                  {[...principlesMarquee, ...principlesMarquee].map((item, idx) => {
                    const Icon = item.icon;
                    return (
                      <div
                        key={`${item.title}-${idx}`}
                        className="flex items-center space-x-3.5 mx-8 flex-shrink-0 select-none cursor-default group"
                      >
                        <div className={`h-11 w-11 rounded-2xl ${item.bg} border border-slate-200/80 flex items-center justify-center ${item.color} shadow-xs transition-transform duration-300 group-hover:scale-110 flex-shrink-0`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="text-left">
                          <span className="block text-sm sm:text-base font-extrabold text-slate-900 tracking-tight group-hover:text-[#004AAD] transition-colors whitespace-nowrap">
                            {item.title}
                          </span>
                          <span className="block text-xs text-slate-500 font-medium whitespace-nowrap">
                            {item.desc}
                          </span>
                        </div>
                        <div className="h-1.5 w-1.5 rounded-full bg-slate-300 ml-8 flex-shrink-0" />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

      {/* SECTION 6: CALL TO ACTION */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="cta-colored-section animated-gradient-bg relative rounded-3xl p-8 sm:p-10 md:p-12 lg:p-14 border border-blue-500/20 overflow-hidden text-left shadow-2xl">
          {/* Decorative patterns */}
          <div className="absolute inset-0 bg-mesh-pattern bg-mesh opacity-10 pointer-events-none" />
          <div className="absolute inset-0 bg-white/5 backdrop-blur-[1px] pointer-events-none" />

          {/* 2-Column Grid: Left Content (Unchanged) + Right Animated Ecosystem Visual */}
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-6 xl:col-span-5 space-y-6">
              <h2 className="text-3xl md:text-5xl font-extrabold text-white leading-tight">
                Ready to Upgrade Your Corporate Software?
              </h2>
              <p className="text-slate-200 max-w-xl text-sm md:text-base">
                Unify your group mailbox, auth logs, dashboard notes, and project backlogs under one centralized and secure portal.
              </p>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-start gap-4 pt-4 sm:pt-6">
                <button
                  type="button"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl text-sm font-bold bg-white text-[#004AAD] cursor-pointer flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors"
                >
                  Browse Product Suites <span>→</span>
                </button>
                <Link
                  to="/support"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl text-sm font-bold bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/30 transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2"
                >
                  Contact Support <span>→</span>
                </Link>
              </div>
            </div>

            {/* Right Column: Unique Futuristic Software Ecosystem Animation */}
            <div className="lg:col-span-6 xl:col-span-7 flex items-center justify-center w-full overflow-hidden lg:overflow-visible pt-4 lg:pt-0">
              <CtaEcosystemVisual />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
