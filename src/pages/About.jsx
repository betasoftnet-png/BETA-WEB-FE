import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Target,
  Compass,
  Award,
  Calendar,
  Shield,
  Activity,
  Users,
  Clock,
  Cpu,
  Layers,
  Globe,
  User,
  Mail,
  ChevronDown,
  UserCheck,
  ArrowRight
} from 'lucide-react';

// Custom high-fidelity Count Up animation helper component
function CountUpNumber({ value }) {
  const numericValue = parseFloat(value);
  const suffix = value.replace(/^[0-9.]+/, ''); // Extracts '%', 'K+', '+', '/7', etc.
  const [displayValue, setDisplayValue] = React.useState(() => isNaN(numericValue) ? value : '0');

  React.useEffect(() => {
    if (isNaN(numericValue)) {
      const timer = setTimeout(() => setDisplayValue(value), 0);
      return () => clearTimeout(timer);
    }
    let startTimestamp = null;
    const duration = 1800; // 1.8 seconds transition
    const startValue = 0;

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const currentVal = progress * (numericValue - startValue) + startValue;

      if (numericValue % 1 !== 0) {
        setDisplayValue(currentVal.toFixed(1) + suffix);
      } else {
        setDisplayValue(Math.floor(currentVal) + suffix);
      }

      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };

    window.requestAnimationFrame(step);
  }, [value, numericValue, suffix]);

  return <span>{displayValue}</span>;
}

export default function About() {
  const leadership = [
    {
      name: 'Mr.B',
      role: 'Founder & CEO',
      avatar: "/MR.B.png",
      desc: 'Former Engineering Director at AWS. Guiding enterprise software scaling and corporate direction.',
      infoLink: 'https://www.mr-b.info/'
    }
  ];

  const milestones = [
    {
      year: '2022',
      title: 'Company Founded',
      desc: 'Beta was established in Tiruvallur, India, by a core team of 5 engineers aiming to redefine enterprise software.'
    },
    {
      year: '2023',
      title: 'BNX Mail Launch',
      desc: 'Released our collaborative email dashboard concept, securing our first 100 enterprise clients.'
    },
    {
      year: '2024',
      title: 'Series A Funding',
      desc: 'Secured $12M in Series A funding to expand our security-first auth frameworks and database clustering.'
    },
    {
      year: '2026',
      title: 'Global Footprint',
      desc: 'Now powering 1.2M+ active corporate connections globally across 500+ major companies.'
    }
  ];

  const coreValues = [
    {
      title: 'Security',
      desc: 'Bulletproof JWT validation, active role-based controls, and absolute AES-256 data protection at rest.',
      icon: Shield,
      color: 'text-[#0E0F89]',
      bg: 'bg-[#0E0F89]/10 border-[#0E0F89]/20'
    },
    {
      title: 'Innovation',
      desc: 'Continuous research in collaborative workflows, real-time STOMP engines, and interface rendering optimizations.',
      icon: Cpu,
      color: 'text-[#FF6325]',
      bg: 'bg-[#FF6325]/10 border-[#FF6325]/20'
    },
    {
      title: 'Trust',
      desc: 'Building transparent relationships with clients by adhering to rigorous SLAs and auditing frameworks.',
      icon: UserCheck,
      color: 'text-[#135029]',
      bg: 'bg-[#135029]/10 border-[#135029]/20'
    },
    {
      title: 'Growth',
      desc: 'Enabling scaling capabilities for our customers\' databases and mail operations, growing alongside their team demands.',
      icon: Activity,
      color: 'text-[#0E0F89]',
      bg: 'bg-[#0E0F89]/10 border-[#0E0F89]/20'
    },
    {
      title: 'Excellence',
      desc: 'A commitment to clean code, modular microservices architecture, and responsive, modern user experience design.',
      icon: Award,
      color: 'text-[#FF6325]',
      bg: 'bg-[#FF6325]/10 border-[#FF6325]/20'
    }
  ];

  const stats = [
    { label: 'Uptime', value: '99.9%', icon: Activity, color: 'text-[#135029]', bg: 'bg-[#135029]/10 border-[#135029]/20' },
    { label: 'Active Users', value: '10K+', icon: Users, color: 'text-[#0E0F89]', bg: 'bg-[#0E0F89]/10 border-[#0E0F89]/20' },
    { label: 'Integrations', value: '50+', icon: Layers, color: 'text-[#0A3161]', bg: 'bg-[#0A3161]/10 border-[#0A3161]/20' },
    { label: 'Support SLA', value: '24/7', icon: Clock, color: 'text-[#FF6325]', bg: 'bg-[#FF6325]/10 border-[#FF6325]/20' }
  ];

  return (
    <div className="about-light-theme min-h-screen relative overflow-hidden pb-20">
      <style>{`
        .about-light-theme {
          background: linear-gradient(135deg, #F2FAF5 0%, #E7EFFB 33%, #EAEBFA 66%, #FFEAE2 100%) !important;
          color: #334155 !important;
          position: relative;
          z-index: 10;
        }
        .about-light-theme h1, 
        .about-light-theme h2, 
        .about-light-theme h3, 
        .about-light-theme h4, 
        .about-light-theme h5, 
        .about-light-theme h6 {
          color: #0A3161 !important;
        }
        .about-light-theme p {
          color: #475569 !important; /* Slate 600 */
        }
        .about-light-theme span {
          color: inherit;
        }
        .about-light-theme a {
          color: inherit;
        }

        /* Custom animated gradient backgrounds */
        @keyframes gradientShiftLight {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animated-gradient-bg-light {
          background: linear-gradient(-45deg, #F2FAF5, #E7EFFB, #FFEAE2, #F2FAF5);
          background-size: 400% 400%;
          animation: gradientShiftLight 15s ease infinite;
        }

        /* Floating particles */
        @keyframes floatCircle1 {
          0% { transform: translate(0px, 0px) scale(1); }
          50% { transform: translate(30px, -50px) scale(1.1); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        @keyframes floatCircle2 {
          0% { transform: translate(0px, 0px) scale(1); }
          50% { transform: translate(-40px, 40px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .particle-glow-1 {
          animation: floatCircle1 12s ease-in-out infinite;
        }
        .particle-glow-2 {
          animation: floatCircle2 15s ease-in-out infinite;
        }

        /* Zoho-style clean light glass cards */
        .about-light-theme .glass-card {
          background: rgba(255, 255, 255, 0.75) !important;
          backdrop-filter: blur(12px) !important;
          border: 1px solid rgba(10, 49, 97, 0.12) !important;
          box-shadow: 0 8px 32px 0 rgba(10, 49, 97, 0.04) !important;
        }

        .about-light-theme .glass-card-hover {
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1) !important;
        }

        .about-light-theme .glass-card-hover:hover {
          background: rgba(255, 255, 255, 0.95) !important;
          border-color: rgba(255, 99, 37, 0.45) !important; /* Brand orange glow */
          box-shadow: 0 12px 40px 0 rgba(10, 49, 97, 0.08) !important;
          transform: translateY(-4px);
        }
        .founder-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
        }
        @media (min-width: 768px) {
          .founder-grid {
            grid-template-columns: 11rem 1fr;
            grid-template-rows: 11rem auto;
            column-gap: 2.5rem;
            row-gap: 1.5rem;
          }
        }
      `}</style>

      {/* SECTION 1: HERO BANNER */}
      <div className="animated-gradient-bg-light relative overflow-hidden min-h-[90vh] flex items-center justify-center py-24 px-4 sm:px-6 lg:px-8 border-b border-[#0A3161]/10">
        {/* Floating Particles and Glows */}
        <div className="absolute top-[20%] left-[10%] w-[350px] h-[350px] bg-[#FF6325]/5 rounded-full blur-[130px] pointer-events-none particle-glow-1" />
        <div className="absolute bottom-[20%] right-[10%] w-[400px] h-[400px] bg-[#0E0F89]/5 rounded-full blur-[130px] pointer-events-none particle-glow-2" />
        <div className="absolute inset-0 bg-mesh-pattern bg-mesh opacity-5 pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center space-y-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-[#FF6325]/10 border border-[#FF6325]/20 text-[#FF6325] text-xs font-bold uppercase tracking-widest select-none"
          >
            <Compass className="h-3.5 w-3.5 text-[#FF6325] animate-spin-slow" />
            <span>Beta Ecosystem</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-tight text-[#0A3161]"
          >
            Building Secure
            <span className="block bg-gradient-to-r from-[#FF6325] via-[#0E0F89] to-[#0A3161] bg-clip-text text-transparent mt-2">
              Digital Solutions
            </span>
            for Modern Businesses
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-slate-650 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed"
          >
            Beta designs high-performance enterprise tech suites. From secure SMTP shared conversational messaging to single sign-on validations, we help businesses protect and coordinate their workloads.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <a
              href="#story"
              className="w-full sm:w-auto px-8 py-4 rounded-xl text-base font-bold bg-[#FF6325] hover:bg-[#e0531b] text-black shadow-xl shadow-[#FF6325]/25 border border-[#FF6325] transition-all duration-300 flex items-center justify-center space-x-2 group hover:scale-[1.02]"
            >
              <span>Explore Our Story</span>
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="#timeline"
              className="w-full sm:w-auto px-8 py-4 rounded-xl text-base font-bold bg-white hover:bg-slate-50 text-[#0A3161] border border-[#0A3161]/15 hover:border-[#0A3161]/35 transition-all duration-300 hover:scale-[1.02] flex items-center justify-center"
            >
              Launch Timeline
            </a>
          </motion.div>

          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="pt-12 flex justify-center"
          >
            <ChevronDown className="h-6 w-6 text-slate-400" />
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24 space-y-32">

        {/* SECTION 2: OUR STORY */}
        <div id="story" className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6 text-left"
          >
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#0E0F89]/10 border border-[#0E0F89]/20 text-[#0E0F89] text-xs font-semibold uppercase tracking-wider">
              <Compass className="h-3.5 w-3.5" />
              <span>Our Story</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">Innovating with Passion</h2>
            <p className="text-slate-400 leading-relaxed text-base">
              Founded in 2022, Beta set out to build a platform that respects developer focus and enterprise scale. We believe that enterprise software doesn't need to be sluggish or fragmented.
            </p>
            <p className="text-slate-400 leading-relaxed text-base">
              Over the years, we have scaled our modules from a basic SMTP group inbox to a complete suite of services including **BNX Mail** for collaborative messaging, **B2 Auth Security** for multi-factor validations, and **Cliks** for sprint workflow collaboration.
            </p>
            <div className="pt-2 flex items-center space-x-8">
              <div>
                <span className="text-2xl font-extrabold text-white">2022</span>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Founded</p>
              </div>
              <div className="h-8 w-px bg-slate-200" />
              <div>
                <span className="text-2xl font-extrabold text-white">10K+</span>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Active Users</p>
              </div>
              <div className="h-8 w-px bg-slate-200" />
              <div>
                <span className="text-2xl font-extrabold text-white">50+</span>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Integrations</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl glass-card p-4 border border-[#0A3161]/12 shadow-2xl flex items-center justify-center group"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 to-sky-500/5 opacity-50 pointer-events-none group-hover:opacity-80 transition duration-500" />
            <img
              src="/bnx_product_showcase.png"
              alt="BNX Product Showcase"
              className="w-full h-auto object-cover rounded-2xl relative z-10 transition-transform duration-700 group-hover:scale-[1.03]"
            />
          </motion.div>
        </div>

        {/* SECTION 3: COMPANY TIMELINE */}
        <div id="timeline" className="space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#FF6325]/10 border border-[#FF6325]/20 text-[#FF6325] text-xs font-semibold uppercase tracking-wider">
              <Calendar className="h-3.5 w-3.5" />
              <span>Interactive Timeline</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold text-white">Growth History</h2>
            <p className="text-slate-400 text-sm">Key milestones that defined our trajectory as an enterprise ecosystem.</p>
          </div>

          <div className="relative max-w-4xl mx-auto pt-6">
            {/* Timeline center line */}
            <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[2px] bg-slate-200 hidden md:block" />

            <div className="space-y-12 md:space-y-20">
              {milestones.map((milestone, idx) => {
                const isLeft = idx % 2 === 0;
                return (
                  <div
                    key={milestone.year}
                    className={`flex flex-col md:flex-row items-center justify-between relative ${isLeft ? 'md:flex-row-reverse' : ''
                      }`}
                  >
                    {/* Content Card */}
                    <motion.div
                      initial={{ opacity: 0, x: isLeft ? 45 : -45 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{ duration: 0.6, type: 'spring', stiffness: 80 }}
                      className="w-full md:w-[45%] glass-card glass-card-hover p-8 rounded-3xl text-left border border-[#0A3161]/12 shadow-lg"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="px-3 py-1 rounded-lg bg-[#FF6325]/10 border border-[#FF6325]/20 text-[#FF6325] text-xs font-extrabold tracking-widest">
                          {milestone.year}
                        </span>
                        <Calendar className="h-4.5 w-4.5 text-slate-500" />
                      </div>
                      <h3 className="text-lg font-extrabold text-white">{milestone.title}</h3>
                      <p className="text-slate-400 text-xs leading-relaxed font-medium mt-2">{milestone.desc}</p>
                    </motion.div>

                    {/* Timeline Node Dot */}
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      viewport={{ once: true, margin: "-100px" }}
                      className="hidden md:flex h-8 w-8 rounded-full bg-white border-2 border-[#0A3161] items-center justify-center z-10 shadow-md absolute left-1/2 -translate-x-1/2"
                    >
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ repeat: Infinity, duration: 3 }}
                        className="h-3 w-3 rounded-full bg-[#FF6325]"
                      />
                    </motion.div>

                    {/* Spacer placeholder */}
                    <div className="hidden md:block w-[45%]" />
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* SECTION 4: MISSION & VISION */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card glass-card-hover p-10 rounded-3xl border border-[#0A3161]/12 flex flex-col items-start text-left relative overflow-hidden group shadow-lg"
          >
            {/* Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-[#0A3161]/5 to-transparent opacity-0 group-hover:opacity-100 transition duration-500 pointer-events-none" />

            <div className="p-4 bg-[#0A3161]/10 rounded-2xl border border-[#0A3161]/20 text-[#0A3161] mb-6 flex-shrink-0">
              <Target className="h-8 w-8" />
            </div>
            <h3 className="text-2xl font-extrabold text-white mb-3">Our Mission</h3>
            <p className="text-slate-400 text-sm leading-relaxed font-medium">
              To design secure, lightweight, and unified SaaS products that enable corporate teams to communicate, sync databases, and manage mailboxes without friction or security boundaries.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="glass-card glass-card-hover p-10 rounded-3xl border border-[#0A3161]/12 flex flex-col items-start text-left relative overflow-hidden group shadow-lg"
          >
            {/* Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-[#FF6325]/5 to-transparent opacity-0 group-hover:opacity-100 transition duration-500 pointer-events-none" />

            <div className="p-4 bg-[#FF6325]/10 rounded-2xl border border-[#FF6325]/20 text-[#FF6325] mb-6 flex-shrink-0">
              <Compass className="h-8 w-8" />
            </div>
            <h3 className="text-2xl font-extrabold text-white mb-3">Our Vision</h3>
            <p className="text-slate-400 text-sm leading-relaxed font-medium">
              To set the global standard for next-generation workspace communications, protected by absolute auth protocols and real-time state synchronization.
            </p>
          </motion.div>
        </div>

        {/* SECTION 5: CORE VALUES */}
        <div className="space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#0E0F89]/10 border border-[#0E0F89]/20 text-[#0E0F89] text-xs font-semibold uppercase tracking-wider">
              <UserCheck className="h-3.5 w-3.5" />
              <span>Core Guidelines</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold text-white">Our Core Values</h2>
            <p className="text-slate-400 text-sm">The principles driving our technology architectures and product engineering.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {coreValues.map((val, idx) => {
              const Icon = val.icon;
              return (
                <motion.div
                  key={val.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.08 }}
                  className="glass-card glass-card-hover p-6 rounded-3xl border border-[#0A3161]/12 text-left space-y-4 shadow-sm flex flex-col justify-between"
                >
                  <div>
                    <div className={`h-11 w-11 rounded-xl flex items-center justify-center border ${val.bg} mb-4`}>
                      <Icon className={`h-5.5 w-5.5 ${val.color}`} />
                    </div>
                    <h3 className="text-base font-bold text-white mb-2">{val.title}</h3>
                    <p className="text-slate-400 text-xs leading-relaxed font-medium">{val.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* SECTION 6: COMPANY STATISTICS WITH ANIMATED COUNT-UP */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08 }}
                className="glass-card glass-card-hover p-8 rounded-3xl border border-[#0A3161]/12 text-center space-y-3 relative overflow-hidden group shadow-lg"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition duration-500 pointer-events-none" />

                <div className="flex flex-col items-center justify-center">
                  <div className={`h-12 w-12 rounded-2xl flex items-center justify-center border ${stat.bg} mb-3`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <span className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                    <CountUpNumber value={stat.value} />
                  </span>
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mt-1">{stat.label}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* SECTION 7: TEAM SECTION WITH PROFILES */}
        <div className="space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#0E0F89]/10 border border-[#0E0F89]/20 text-[#0E0F89] text-xs font-semibold uppercase tracking-wider">
              <Users className="h-3.5 w-3.5" />
              <span>Leadership</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold text-white">Leadership Team</h2>
            <p className="text-slate-400 text-sm">Meet the innovators guiding our engineering and product vision.</p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mr-auto founder-grid pt-4 text-left md:-ml-8 lg:-ml-12"
          >
            {/* Left Column: Image (Row 1, Col 1) */}
            <div className="md:col-start-1 md:row-start-1 md:self-start flex flex-col items-center shrink-0">
              <div className="h-44 w-44 rounded-2xl overflow-hidden border-2 border-slate-200/80 shadow-md relative group">
                <img
                  src={leadership[0].avatar}
                  alt={leadership[0].name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            </div>

            {/* Left Column: Metadata (Name, Title, Info Button) stacked & centered below the image (Row 2, Col 1) */}
            <div className="md:col-start-1 md:row-start-2 flex flex-col items-center text-center space-y-3 w-44">
              <div className="space-y-1">
                <h3 className="text-xl font-black text-slate-800">{leadership[0].name}</h3>
                <p className="text-xs font-bold text-[#FF6325] uppercase tracking-widest">
                  Founder & CEO
                </p>
              </div>
              <div>
                <a
                  href={leadership[0].infoLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-6 py-2 rounded-full bg-[#0E0F89] hover:bg-[#FF6325] text-white text-xs font-bold transition duration-300 select-none cursor-pointer"
                >
                  Info
                </a>
              </div>
            </div>

            {/* Right Column: Envisioned content (Row 1, Col 2 - centered vertically with the image) */}
            <div className="md:col-start-2 md:row-start-1 md:self-center flex-grow flex flex-col justify-center max-w-4xl">
              <p className="text-base md:text-lg text-slate-650 leading-relaxed font-semibold">
                Our founder envisioned Beta as a platform that empowers businesses through innovative and reliable technology solutions. With a strong focus on quality, simplicity, and customer success, the company was built to solve real-world business challenges. Today, that vision continues to drive our products, culture, and commitment to excellence.
              </p>
            </div>
          </motion.div>

          {/* Vision Statement Section */}
          <div className="glass-card p-8 md:p-12 rounded-3xl border border-[#0A3161]/12 shadow-xl max-w-4xl mx-auto mt-16 relative overflow-hidden group">
            {/* Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-[#FF6325]/5 to-transparent opacity-30 pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row gap-8 items-stretch justify-between text-left">
              {/* Left Column */}
              <div className="md:w-1/2 flex flex-col justify-center space-y-4 border-b md:border-b-0 md:border-r border-[#0A3161]/10 pb-6 md:pb-0 md:pr-8">
                <p className="text-slate-400 text-sm leading-relaxed font-medium">
                  My work is driven by the belief that progress has meaning only when it uplifts people across borders, cultures, and communities. I am committed to building organizations that operate with purpose—where innovation, responsibility, and humanity go hand in hand.
                </p>
              </div>

              {/* Right Column */}
              <div className="md:w-1/2 flex flex-col justify-center space-y-6 md:pl-8">
                <p className="text-slate-400 text-sm leading-relaxed font-medium">
                  Through my ventures, I strive to create a society where individuals from every country are treated with dignity and equality, free from discrimination and division.
                </p>
                <div className="border-l-4 border-[#FF6325] pl-4 py-2 italic font-semibold text-black text-sm bg-[#FF6325]/5 rounded-r-lg">
                  "This vision is not just an idea; it is the foundation on which every company I lead is built."
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 8: CALL TO ACTION */}
        <div className="relative overflow-hidden rounded-3xl p-8 md:p-16 border border-[#0A3161]/15 text-center shadow-2xl" style={{ background: 'linear-gradient(135deg, #F2FAF5 0%, #E7EFFB 33%, #EAEBFA 66%, #FFEAE2 100%)' }}>
          <div className="absolute inset-0 bg-mesh-pattern bg-mesh opacity-5 pointer-events-none" />
          <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px] pointer-events-none" />

          <div className="relative z-10 space-y-6 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-extrabold text-white leading-tight">
              Ready to Transform Your Business?
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto text-sm md:text-base leading-relaxed">
              Consolidate your inbox threads, database states, and agile boards under one centralized tech platform today.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
              <Link
                to="/support"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl text-sm font-bold bg-[#FF6325] hover:bg-[#e0531b] text-black transition-all duration-300 hover:scale-[1.02] shadow-lg shadow-[#FF6325]/15"
              >
                Contact Us
              </Link>
              <Link
                to="/partners"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl text-sm font-bold bg-white hover:bg-slate-50 text-[#0A3161] border border-[#0A3161]/15 hover:border-[#0A3161]/35 transition-all duration-300 hover:scale-[1.02]"
              >
                Request Demo
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
