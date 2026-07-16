import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Shield,
  Activity,
  Users,
  Globe,
  Zap,
  Sparkles,
  Mail,
  Briefcase,
  UserCheck,
  User,
  Star,
  Cpu,
  Database,
  Lock,
  Terminal,
  Code2,
  Workflow,
  Network,
  Award
} from 'lucide-react';

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } }
  };



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

  const techStack = [
    {
      name: 'React 18',
      description: 'Modern front-end framework rendering declarative, state-driven interfaces with high responsiveness.',
      icon: Code2,
      category: 'Frontend',
      bg: 'bg-cyan-50 text-cyan-600 border-cyan-100',
      gradient: 'from-cyan-400 to-blue-500'
    },
    {
      name: 'Vite',
      description: 'Ultra-fast bundler and dev server powering blazing fast builds and Hot Module Replacement.',
      icon: Terminal,
      category: 'Build System',
      bg: 'bg-amber-50 text-amber-600 border-amber-100',
      gradient: 'from-amber-400 to-orange-500'
    },
    {
      name: 'Tailwind CSS',
      description: 'Utility-first styling library supporting rich design systems and layouts natively.',
      icon: Globe,
      category: 'Styling',
      bg: 'bg-sky-50 text-sky-600 border-sky-100',
      gradient: 'from-sky-400 to-indigo-500'
    },
    {
      name: 'Node.js & Express',
      description: 'Robust server architecture supporting scalable RESTful APIs and rapid routing services.',
      icon: Cpu,
      category: 'Backend Server',
      bg: 'bg-emerald-50 text-emerald-600 border-emerald-100',
      gradient: 'from-emerald-400 to-teal-500'
    },
    {
      name: 'MongoDB',
      description: 'Scalable NoSQL database engine storage for flexible team workspaces, notes, and task backlogs.',
      icon: Database,
      category: 'Database',
      bg: 'bg-green-50 text-green-600 border-green-100',
      gradient: 'from-green-400 to-emerald-600'
    },
    {
      name: 'OAuth 2.0 & JWT',
      description: 'Cryptographically secure auth protocols powering SSO gateways and API access controls.',
      icon: Lock,
      category: 'Security',
      bg: 'bg-rose-50 text-rose-600 border-rose-100',
      gradient: 'from-rose-400 to-red-500'
    },
    {
      name: 'WebSockets',
      description: 'Bi-directional real-time channels syncing collaborative task boards and email clients.',
      icon: Network,
      category: 'Communication',
      bg: 'bg-indigo-50 text-indigo-600 border-indigo-100',
      gradient: 'from-indigo-400 to-violet-500'
    },
    {
      name: 'Framer Motion',
      description: 'High-performance layout transitions and fluid micro-animations for an interactive UX.',
      icon: Workflow,
      category: 'Animation',
      bg: 'bg-fuchsia-50 text-fuchsia-600 border-fuchsia-100',
      gradient: 'from-fuchsia-400 to-pink-500'
    }
  ];

  return (
    <div className="relative min-h-screen bg-transparent z-10 pt-0 pb-20">
      <style>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
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
        .swirling-showcase-bg {
          background: radial-gradient(circle at 50% 50%, #061033 0%, #01040f 70%, #000105 100%);
          background-size: 150% 150%;
          animation: gradientSwirl 10s ease infinite;
          position: relative;
        }
        .orbit-ring-1 {
          position: absolute;
          width: 130px;
          height: 130px;
          border: 1px dashed rgba(59, 130, 246, 0.2);
          border-radius: 50%;
          animation: rotateOrbit1 15s linear infinite;
        }
        .orbit-ring-2 {
          position: absolute;
          width: 170px;
          height: 170px;
          border: 1px dashed rgba(6, 182, 212, 0.15);
          border-radius: 50%;
          animation: rotateOrbit2 20s linear infinite;
        }
        .orbit-node-1 {
          position: absolute;
          top: -5px;
          left: 50%;
          margin-left: -5px;
          width: 10px;
          height: 10px;
          background: #3b82f6;
          border-radius: 50%;
          box-shadow: 0 0 8px #3b82f6, 0 0 16px #3b82f6;
        }
        .orbit-node-2 {
          position: absolute;
          bottom: -5px;
          left: 50%;
          margin-left: -5px;
          width: 10px;
          height: 10px;
          background: #06b6d4;
          border-radius: 50%;
          box-shadow: 0 0 8px #06b6d4, 0 0 16px #06b6d4;
        }
        .orbit-node-3 {
          position: absolute;
          right: -5px;
          top: 50%;
          margin-top: -5px;
          width: 9px;
          height: 9px;
          background: #a855f7;
          border-radius: 50%;
          box-shadow: 0 0 8px #a855f7, 0 0 16px #a855f7;
        }
        .bnx-logo-pulse-premium {
          animation: logoPulseGlow 3.5s ease-in-out infinite;
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
      `}</style>

      {/* HERO SECTION: SIDE-BY-SIDE LAYOUT */}
      <div className="w-full mb-20 pt-4 md:pt-8 overflow-hidden">
        {/* Central main title */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 text-center -mt-6 md:-mt-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            {/* <span className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#004AAD] text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Vision</span>
            </span> */}
            <motion.h1
              className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter cursor-pointer select-none flex items-center justify-center gap-0 my-4"
              style={{ fontFamily: '"Saira Stencil One", sans-serif' }}
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.15,
                  }
                }
              }}
              initial="hidden"
              animate="visible"
            >
              {['B', 'E', 'T', 'A'].map((letter, idx) => (
                <motion.span
                  key={idx}
                  variants={{
                    hidden: { opacity: 0, y: 50, scale: 0.3 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      scale: 1,
                      transition: { type: 'spring', damping: 8, stiffness: 100 }
                    }
                  }}
                  whileHover={{
                    scale: 1.25,
                    y: -12,
                    rotate: idx % 2 === 0 ? 6 : -6,
                    color: '#005be3',
                    filter: 'drop-shadow(0 12px 20px rgba(0, 74, 173, 0.4))'
                  }}
                  whileTap={{ scale: 0.9 }}
                  className="inline-block transition-all duration-300 ease-out"
                  style={{
                    color: '#004AAD',
                    textShadow: '0px 0px 30px rgba(0, 74, 173, 0.12)',
                    padding: '0',
                    marginLeft: letter === 'T' ? '5px' : '0px'
                  }}
                >
                  {letter}
                </motion.span>
              ))}
            </motion.h1>




            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-blue-700 tracking-tight leading-tight max-w-4xl mx-auto">
              Where Technology Meets{" "}
              <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                Possibility
              </span>

            </h1>

          </motion.div>
        </div>
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 lg:gap-12">

          {/* Left Column: Heading and description */}
          <div className="w-full md:w-[32%] flex flex-col items-start text-left space-y-6">

            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-6 w-full flex flex-col items-start text-left"
            >
              <motion.h2
                variants={itemVariants}
                className="text-3xl md:text-4xl lg:text-5xl font-extrabold 
             text-slate-900 leading-tight md:-ml-12"
              >
                Unified Software for <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent inline font-extrabold whitespace-nowrap">Connected Generation</span>
              </motion.h2>



              <motion.p
                variants={itemVariants}
                className="mt-1 text-slate-600 text-base md:text-lg leading-relaxed 
             text-left w-full md:-ml-8 max-w-xl 
             tracking-wide"
              >
                Beta builds secure, real-time corporate applications. SMTP mail threads, live authentication protocols, and agile sprints under one dashboard.
              </motion.p>

            </motion.div>
          </div>

          {/* Right Column: Enterprise suite */}


          <div className="w-full md:w-[62%] max-w-2xl h-full flex flex-col justify-center text-left md:translate-x-28">

            <div className="glass-card bg-white/70 hover:bg-white/90 border border-slate-200/80 p-6 rounded-3xl shadow-sm hover:shadow-md transition-all duration-300 w-full">
              <div className="border-b border-slate-100 pb-2.5 w-full mb-4">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">
                  Enterprise Suite
                </span>
                {/* Horizontal line below heading
                <div className="border-t border-slate-300 w-full my-4"></div> */}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch">
                {/* Left Side inside Box: Styled BNX Showcase Card */}
                <div className="lg:col-span-1 w-full h-80 text-center overflow-hidden relative select-none flex flex-col items-center justify-center swirling-showcase-bg rounded-2xl">
                  {/* Deep Glowing Tech Starfield Particles */}
                  <div className="absolute w-2 h-2 bg-blue-400/40 rounded-full blur-[1px]" style={{ bottom: '10%', left: '20%', animation: 'floatParticle 5s linear infinite', animationDelay: '0s' }} />
                  <div className="absolute w-1 h-1 bg-cyan-300/30 rounded-full blur-[0.5px]" style={{ bottom: '15%', left: '45%', animation: 'floatParticle 7s linear infinite', animationDelay: '2.5s' }} />
                  <div className="absolute w-2 h-2 bg-indigo-500/20 rounded-full blur-[1.5px]" style={{ bottom: '10%', left: '75%', animation: 'floatParticle 6s linear infinite', animationDelay: '1.2s' }} />

                  {/* Glowing Orbit Rings */}
                  <div className="orbit-ring-1 pointer-events-none">
                    <div className="orbit-node-1" />
                  </div>
                  <div className="orbit-ring-2 pointer-events-none">
                    <div className="orbit-node-2" />
                    <div className="orbit-node-3" />
                  </div>


                  {/* Tech Aura Glow behind Logo */}
                  <div className="absolute w-28 h-28 bg-blue-500/10 blur-xl pointer-events-none animate-pulse" />

                  {/* Pulsating Premium Logo Container */}
                  <div className="relative z-10 transition-transform duration-300 hover:scale-105">
                    <div className="bg-white border border-blue-500/45 w-24 h-24 rounded-2xl flex items-center justify-center bnx-logo-pulse-premium transition-all duration-300 relative overflow-hidden group">
                      <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/25 via-cyan-500/10 to-transparent pointer-events-none" />
                      <img src="/logo.png" alt="Beta Logo" className="h-14 w-14 object-contain relative z-10 animate-pulse" />
                    </div>
                  </div>
                </div>

                {/* Right Side: Vertical list of products (BNXmail and Cliks Business) */}
                <div className="lg:col-span-1 flex flex-col gap-4 h-full justify-between items-stretch lg:border-l lg:border-slate-200/80 lg:pl-4">
                  {/* BNXmail */}
                  <a
                    href="https://www.bnxmail.com/login"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex flex-col justify-center p-4 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50/50 hover:bg-slate-100 transition-all duration-300 group cursor-pointer text-left gap-1"
                  >
                    <div className="flex items-center gap-2.5">
                      {/* Logo */}

                      <div className="h-12 w-12 flex-shrink-0 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                        <img src="/bnx_mail_logo.png" alt="BNX Mail" className="h-14 w-14 object-contain" />
                      </div>

                      {/* Heading */}
                      <h4 className="text-sm font-bold text-slate-900 group-hover:text-[#004AAD] transition-colors duration-200">
                        BNXmail
                      </h4>
                    </div>

                    {/* Description below logo/heading */}
                    <p className="text-slate-500 text-xs font-medium leading-normal mt-0.5">
                      Real time mail, always <span className="whitespace-nowrap">in sync.</span> “Instant mail, Connected work.”
                    </p>
                  </a>

                  {/* Cliks Business */}
                  <a
                    href="https://www.cliksbusiness.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex flex-col justify-center p-4 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50/50 hover:bg-slate-100 transition-all duration-300 group cursor-pointer text-left gap-1"
                  >
                    <div className="flex items-center gap-2.5">
                      {/* Logo */}
                      <div className="h-12 w-12 flex-shrink-0 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                        <img src="/cliks_business_logo.png" alt="Cliks Business" className="h-12 w-12 object-contain" />
                      </div>

                      {/* Heading */}
                      <h4 className="text-sm font-bold text-slate-900 group-hover:text-[#004AAD] transition-colors duration-200">
                        Cliks Business
                      </h4>
                    </div>

                    {/* Description below logo/heading */}
                    <p className="text-slate-500 text-xs font-medium leading-normal mt-0.5">
                      "Connecting businesses, creating opportunities, and enabling growth."
                    </p>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 3: KEY FEATURES */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24 text-center">
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="glass-card rounded-3xl border border-slate-200 p-8 md:p-12 shadow-lg">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  className="text-center space-y-2 flex flex-col items-center justify-center p-4 rounded-2xl hover:bg-slate-50/50 transition-colors"
                >
                  <div className="inline-flex p-3 bg-blue-50 rounded-2xl mb-2 border border-blue-100">
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <div className="text-3xl md:text-4xl font-extrabold text-[#004AAD]">{stat.value}</div>
                  <div className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">{stat.label}</div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>



      {/* SECTION: INNOVATION & PHILOSOPHY */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-[#004AAD] text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Our Core Philosophy</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">
            How We Shape the Future
          </h2>
          <p className="text-slate-500 text-lg leading-relaxed font-medium">
            Driven by innovation, engineering excellence, clean code, and continuous growth.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {/* Card 1: What We Build */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="group relative rounded-3xl p-8 bg-white border border-slate-200/80 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between"
          >
            {/* Ambient Background Glow on Hover */}
            <div className="absolute -right-20 -top-20 w-48 h-48 rounded-full bg-gradient-to-br from-blue-500/10 to-cyan-500/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            <div className="space-y-6">
              <div className="h-12 w-12 rounded-2xl flex items-center justify-center bg-blue-50 text-blue-600 border border-blue-100 shadow-sm group-hover:scale-105 transition-transform duration-300">
                <Cpu className="h-6 w-6" />
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl font-extrabold text-slate-950 tracking-tight group-hover:text-blue-650 transition-colors">
                  What We Build
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed font-medium">
                  At Beta Softnet, we develop intelligent software products that help businesses improve efficiency, automate workflows, and accelerate digital transformation. Our products are designed with scalability, security, and user experience at their core, enabling organizations to adapt and grow in an ever-changing digital world.
                </p>
              </div>
            </div>
            <div className="mt-8 border-t border-slate-100 pt-4 flex items-center text-xs font-bold text-blue-600 select-none group-hover:translate-x-1 transition-transform">
              <span>View our products suite</span>
              <ArrowRight className="ml-1 h-3.5 w-3.5" />
            </div>
          </motion.div>

          {/* Card 2: Engineering Excellence */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="group relative rounded-3xl p-8 bg-white border border-slate-200/80 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between"
          >
            {/* Ambient Background Glow on Hover */}
            <div className="absolute -right-20 -top-20 w-48 h-48 rounded-full bg-gradient-to-br from-amber-500/10 to-orange-500/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            <div className="space-y-6">
              <div className="h-12 w-12 rounded-2xl flex items-center justify-center bg-amber-50 text-amber-600 border border-amber-100 shadow-sm group-hover:scale-105 transition-transform duration-300">
                <Terminal className="h-6 w-6" />
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl font-extrabold text-slate-950 tracking-tight group-hover:text-amber-650 transition-colors">
                  Engineering Excellence
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed font-medium">
                  We believe that great products are built with strong engineering practices. Our teams focus on clean architecture, modern technologies, continuous improvement, and high-quality code to deliver reliable and innovative software solutions.
                </p>
              </div>
            </div>
            <div className="mt-8 border-t border-slate-100 pt-4 flex items-center text-xs font-bold text-amber-600 select-none group-hover:translate-x-1 transition-transform">
              <span>Explore our codebase standards</span>
              <ArrowRight className="ml-1 h-3.5 w-3.5" />
            </div>
          </motion.div>

          {/* Card 3: Technology & Innovation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="group relative rounded-3xl p-8 bg-white border border-slate-200/80 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between"
          >
            {/* Ambient Background Glow on Hover */}
            <div className="absolute -right-20 -top-20 w-48 h-48 rounded-full bg-gradient-to-br from-purple-500/10 to-pink-500/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            <div className="space-y-6">
              <div className="h-12 w-12 rounded-2xl flex items-center justify-center bg-purple-50 text-purple-600 border border-purple-100 shadow-sm group-hover:scale-105 transition-transform duration-300">
                <Workflow className="h-6 w-6" />
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl font-extrabold text-slate-950 tracking-tight group-hover:text-purple-650 transition-colors">
                  Technology & Innovation
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed font-medium">
                  Innovation drives everything we do. We continuously explore emerging technologies, modern development practices, and creative ideas to build products that solve real-world business challenges and create lasting value.
                </p>
              </div>
            </div>
            <div className="mt-8 border-t border-slate-100 pt-4 flex items-center text-xs font-bold text-purple-600 select-none group-hover:translate-x-1 transition-transform">
              <span>See our roadmap</span>
              <ArrowRight className="ml-1 h-3.5 w-3.5" />
            </div>
          </motion.div>

          {/* Card 4: Grow With Us */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="group relative rounded-3xl p-8 bg-white border border-slate-200/80 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between"
          >
            {/* Ambient Background Glow on Hover */}
            <div className="absolute -right-20 -top-20 w-48 h-48 rounded-full bg-gradient-to-br from-emerald-500/10 to-teal-500/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            <div className="space-y-6">
              <div className="h-12 w-12 rounded-2xl flex items-center justify-center bg-emerald-50 text-emerald-600 border border-emerald-100 shadow-sm group-hover:scale-105 transition-transform duration-300">
                <Users className="h-6 w-6" />
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl font-extrabold text-slate-950 tracking-tight group-hover:text-emerald-650 transition-colors">
                  Grow With Us
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed font-medium">
                  We provide an environment where learning never stops. Through real-world projects, mentorship, and collaborative teamwork, you'll gain valuable experience, expand your technical expertise, and build a successful career in product development.
                </p>
              </div>
            </div>
            <div className="mt-8 border-t border-slate-100 pt-4 flex items-center text-xs font-bold text-emerald-600 select-none group-hover:translate-x-1 transition-transform">
              <span>Explore active career roles</span>
              <ArrowRight className="ml-1 h-3.5 w-3.5" />
            </div>
          </motion.div>
        </div>
      </div>

      {/* SECTION: WHY CHOOSE OUR PRODUCTS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24 text-center">
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
            <div className="relative p-6 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-2xl overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 via-transparent to-purple-900/30 opacity-60 pointer-events-none" />
              <div className="relative z-10 space-y-5">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center space-x-1.5">
                    <div className="h-2.5 w-2.5 rounded-full bg-rose-500" />
                    <div className="h-2.5 w-2.5 rounded-full bg-amber-500" />
                    <div className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  </div>
                  <span className="text-[9px] font-mono text-slate-500">product_architecture.json</span>
                </div>

                {/* Pipeline visual steps */}
                <div className="space-y-3">
                  {[
                    { phase: 'Layer 1', title: 'Secure SMTP & Real-Time Sync', status: 'Active', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
                    { phase: 'Layer 2', title: 'SSO & Multi-Factor Auth Gateway', status: 'Verified', color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
                    { phase: 'Layer 3', title: 'Live WebSocket Channels & Boards', status: 'Connected', color: 'text-purple-400 bg-purple-500/10 border-purple-500/20' },
                    { phase: 'Layer 4', title: 'Centralized Scalable Workspace DB', status: 'Synced', color: 'text-slate-400 bg-slate-800 border-slate-700' }
                  ].map((step, idx) => (
                    <motion.div
                      key={step.phase}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: idx * 0.12 }}
                      className="flex items-center justify-between p-3 rounded-xl bg-slate-955/85 border border-slate-800 hover:border-slate-700 transition-colors"
                    >
                      <div className="flex items-center space-x-3 overflow-hidden mr-2">
                        <span className="text-[10px] font-mono text-slate-500 w-14 flex-shrink-0">{step.phase}</span>
                        <span className="text-[11px] font-semibold text-slate-200 truncate">{step.title}</span>
                      </div>
                      <span className={`text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border flex-shrink-0 ${step.color}`}>
                        {step.status}
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

      {/* SECTION 6: CALL TO ACTION */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="cta-colored-section animated-gradient-bg relative rounded-3xl p-8 md:p-16 border border-blue-500/20 overflow-hidden text-left shadow-2xl">
          {/* Decorative patterns */}
          <div className="absolute inset-0 bg-mesh-pattern bg-mesh opacity-10 pointer-events-none" />
          <div className="absolute inset-0 bg-white/5 backdrop-blur-[1px] pointer-events-none" />

          <div className="relative z-10 space-y-6 max-w-2xl mr-auto">
            <h2 className="text-3xl md:text-5xl font-extrabold text-white leading-tight">
              Ready to Upgrade Your Corporate Software?
            </h2>
            <p className="text-slate-200 max-w-xl mr-auto text-sm md:text-base">
              Unify your group mailbox, auth logs, dashboard notes, and project backlogs under one centralized and secure portal.
            </p>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-start gap-4 pt-6">
              <button
                type="button"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl text-sm font-bold bg-white text-[#004AAD] cursor-pointer"
              >
                Browse Product Suites
              </button>
              <Link
                to="/support"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl text-sm font-bold bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/30 transition-all duration-300 hover:scale-[1.02]"
              >
                Contact Support
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
