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
  Star
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
    { label: 'Active Users', value: '10', icon: Users, color: 'text-blue-600' },
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

  return (
    <div className="relative min-h-screen bg-transparent z-10 pt-0 pb-20">
      <style>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
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
      `}</style>

      {/* HERO SECTION: SIDE-BY-SIDE LAYOUT */}
      <div className="w-full mb-20 pt-8 md:pt-16 overflow-hidden">
        {/* Central main title */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 text-center">
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
            <h1 style={{ fontFamily: '"Saira Stencil One", sans-serif' }}
              className="text-3xl md:text-4xl font-black tracking-tight text-slate-900">
              BETA
            </h1>

            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-blue-700 tracking-tight leading-tight max-w-4xl mx-auto">
              Where Technology Meets{" "}
              <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                Possibility
              </span>

            </h1>

          </motion.div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Left Column: Heading, description */}
          <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left space-y-6">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-6"
            >
              {/* <motion.div variants={itemVariants} className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#E9F4FF] border border-[#004AAD]/20 text-[#004AAD] text-xs font-semibold uppercase tracking-wider">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Product Suite</span>
              </motion.div> */}

              <motion.h2 variants={itemVariants} className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight tracking-tight">
                Unified Software for a
                <span className="block text-black mt-1">
                  Connected Generation
                </span>
              </motion.h2>

              <motion.p variants={itemVariants} className="text-slate-600 text-base md:text-lg leading-relaxed max-w-2xl">
                Beta builds secure, real-time corporate applications. Consolidation is here: SMTP mail threads, live authentication protocols, and agile sprints under one dashboard.
              </motion.p>
            </motion.div>
          </div>

          {/* Right Column: Featured Apps Box */}
          <div className="w-full lg:w-1/2 flex flex-col justify-center text-left lg:pl-12">
            <div className="glass-card bg-white/70 hover:bg-white/90 border border-slate-200/80 p-8 rounded-3xl shadow-sm hover:shadow-md transition-all duration-300 w-full">
              <div className="border-b border-slate-100 pb-3.5 w-full mb-6">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">
                  Featured Apps
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                {/* Left Side inside Box: Styled BNX Showcase Card */}
                <div 
                  className="w-full rounded-2xl p-6 text-center overflow-hidden relative select-none flex flex-col items-center justify-between min-h-[300px] showcase-white-text"
                  style={{
                    background: 'linear-gradient(135deg, #180a30 0%, #0f0420 50%, #15072d 100%)',
                    backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(135deg, #180a30 0%, #0f0420 50%, #15072d 100%)',
                    backgroundSize: '24px 24px, 24px 24px, 100% 100%',
                    border: '1px solid rgba(139, 92, 246, 0.2)'
                  }}
                >
                  {/* Subtle top/bottom glowing gradients */}
                  <div className="absolute inset-0 bg-gradient-to-r from-violet-500/5 via-fuchsia-500/5 to-cyan-500/5 pointer-events-none" />
                   {/* Icon Block */}
                  <div className="relative mt-2">
                    <div className="bg-[#0e0620] border border-violet-500/40 w-16 h-16 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(139,92,246,0.3)] hover:shadow-[0_0_40px_rgba(139,92,246,0.5)] transition-all duration-300 relative overflow-hidden group">
                      <div className="absolute inset-0 bg-gradient-to-tr from-violet-600/20 to-cyan-400/10 pointer-events-none" />
                      <img src="/logo.png" alt="Beta Logo" className="h-10 w-10 object-contain relative z-10" />
                    </div>
                    {/* Small sparkles */}
                    <div className="absolute -top-2.5 -right-2.5 text-amber-300 animate-pulse">
                      <Sparkles className="h-4 w-4 fill-amber-300/30" />
                    </div>
                  </div>

                  {/* Text Stack */}
                  <div className="space-y-1.5 z-10 my-4">
                    <span className="text-[10px] uppercase tracking-widest text-white font-black">
                      Introducing
                    </span>
                    <h3 className="text-2xl font-black text-white tracking-wide">
                      Beta Products
                    </h3>
                    <p className="text-[10px] font-extrabold tracking-widest uppercase text-white mb-1">
                      Real-Time Enterprise Apps
                    </p>
                    <p className="text-[11px] text-white font-medium leading-relaxed px-2">
                      Consolidate your SMTP mail threads, live authentication protocols, and collaborative workspaces under a single unified dashboard.
                    </p>
                  </div>

                  {/* Explorable Button */}
                  <Link
                    to="/login"
                    className="inline-flex items-center px-6 py-2.5 rounded-full border border-violet-500/40 bg-violet-950/20 text-white text-[10px] font-extrabold uppercase tracking-wider hover:bg-violet-600 hover:border-violet-400 hover:shadow-[0_0_15px_rgba(139,92,246,0.4)] transition-all duration-300 mb-2 group cursor-pointer"
                  >
                    Explore Beta Apps
                    <ArrowRight className="ml-1.5 h-3.5 w-3.5 transform transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </div>

                {/* Right Side inside Box: vertical stack list */}
                <div className="flex flex-col gap-6">
                  {/* BNX MAIL Card */}
                  <a
                    href="https://www.bnxmail.com/login"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-4 group cursor-pointer"
                  >
                    <div className="h-10 w-10 flex-shrink-0 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                      <img src="/bnx_mail_logo.png" alt="BNX Mail" className="h-full w-full object-contain" />
                    </div>
                    <div className="space-y-1 flex-grow pt-1">
                      <h4 className="text-xl font-bold text-slate-900 group-hover:text-[#004AAD] transition-colors duration-200 leading-none">
                        BNXmail
                      </h4>
                      <p className="text-slate-500 text-xs leading-relaxed font-semibold">
                        Instant updates across devices — no reloads needed
                      </p>
                    </div>
                  </a>

                  {/* CLIKS BUSINESS Card */}
                  <a
                    href="https://www.cliksbusiness.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-4 group cursor-pointer"
                  >
                    <div className="h-10 w-10 flex-shrink-0 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                      <img src="/cliks_business_logo.png" alt="Cliks Business" className="h-full w-full object-contain" />
                    </div>
                    <div className="space-y-1 flex-grow">
                      <h4 className="text-xl font-bold text-slate-900 group-hover:text-violet-650 transition-colors duration-200 leading-none">
                        Cliks Business
                      </h4>
                      <p className="text-slate-500 text-xs leading-relaxed font-semibold">
                        All in one workspace for collaboration and agile tasks.
                      </p>
                    </div>
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
        <div className="cta-colored-section animated-gradient-bg relative rounded-3xl p-8 md:p-16 border border-blue-500/20 overflow-hidden text-center shadow-2xl">
          {/* Decorative patterns */}
          <div className="absolute inset-0 bg-mesh-pattern bg-mesh opacity-10 pointer-events-none" />
          <div className="absolute inset-0 bg-white/5 backdrop-blur-[1px] pointer-events-none" />

          <div className="relative z-10 space-y-6 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-extrabold text-white leading-tight">
              Ready to Upgrade Your Corporate Software?
            </h2>
            <p className="text-slate-200 max-w-xl mx-auto text-sm md:text-base">
              Unify your group mailbox, auth logs, dashboard notes, and project backlogs under one centralized and secure portal.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
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
