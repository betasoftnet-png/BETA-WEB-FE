import React, { useState, useEffect, useRef, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Briefcase,
  Award,
  Sparkles,
  Upload,
  CheckCircle2,
  AlertCircle,
  X,
  Quote,
  Code2,
  Search,
  User,
  Users,
  MapPin,
  CheckSquare,
  FileText,
  SlidersHorizontal
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import api from '../api';



const JOB_BOARD_API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:5000'
  : 'https://apply.beta-softnet.com';

const benefits = [
  { emoji: '💰', title: 'Bonus', desc: 'Competitive base package with performance bonuses tied to milestones.' },
  { emoji: '📚', title: 'Learning', desc: 'Annual education grant of $2,000 for courses and tech conferences.' },
  { emoji: '✈️', title: 'Trips', desc: 'Distributed team offsites and engineering hackathons worldwide.' },
  { emoji: '🎯', title: 'Mentorship', desc: 'Regular syncs with domain architects and technical roadmap reviews.' }
];

const processSteps = [
  { id: '1', title: 'Application', desc: 'Profile & PDF resume upload', icon: FileText, color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
  { id: '2', title: 'Assessment', desc: 'Async technical coding sprint', icon: Code2, color: 'text-pink-400', bg: 'bg-pink-500/10 border-pink-500/20' },
  { id: '3', title: 'Interview', desc: 'Systems architecture alignment', icon: User, color: 'text-amber-405', bg: 'bg-amber-500/10 border-amber-500/20' },
  { id: '4', title: 'Offer', desc: 'Proposal and equity breakdown', icon: Award, color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
  { id: '5', title: 'Welcome', desc: 'Developer bootcamp onboarding', icon: CheckCircle2, color: 'text-pink-400', bg: 'bg-pink-500/10 border-pink-500/20' }
];

const fallbackJobs = [
  {
    id: 'mock-1',
    title: 'Senior Full Stack Engineer',

    location: 'Chennai, India (Hybrid)',
    type: 'Full-Time',
    experience: '3+ Years',
    skills: ['React', 'Node.js', 'MongoDB', 'Express'],
    description: 'We are seeking a talented Senior Full Stack Engineer to lead development of our client-facing portal, APIs, and key features.'
  },
  {
    id: 'mock-2',
    title: 'UI/UX Designer & Developer',

    location: 'Chennai, India (Hybrid)',
    type: 'Full-Time',
    experience: '2+ Years',
    skills: ['Figma', 'React', 'Tailwind CSS', 'Framer Motion'],
    description: 'Join us to design beautiful user experiences and translate them into high-fidelity web components.'
  },
  {
    id: 'mock-3',
    title: 'DevOps & Infrastructure Lead',

    location: 'Chennai, India (Hybrid)',
    type: 'Full-Time',
    experience: '4+ Years',
    skills: ['AWS', 'Kubernetes', 'CI/CD Pipelines', 'Docker'],
    description: 'Own our deployment architecture, monitoring pipeline, database clustering, and security controls.'
  },
  {
    id: 'mock-4',
    title: 'QA Automation Engineer',

    location: 'Chennai, India (Hybrid)',
    type: 'Full-Time',
    experience: '2+ Years',
    skills: ['Selenium', 'Cypress', 'JavaScript', 'Postman'],
    description: 'Help build automated end-to-end testing scripts, integration tests, and performance benchmark suites.'
  }
];

export default function Careers() {
  const navigate = useNavigate();
  const { user, redirectToSSO } = useContext(AuthContext);

  const [jobsList, setJobsList] = useState(fallbackJobs);
  const [loadingJobs, setLoadingJobs] = useState(false);
  const [jobsError, setJobsError] = useState('');

  const [selectedJob, setSelectedJob] = useState(null);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [resume, setResume] = useState(null);

  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [message, setMessage] = useState('');

  // Live Job Search & Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Extract unique filter options dynamically from jobsList
  const teams = Array.from(new Set(jobsList.map(job => job.team).filter(Boolean)));
  const locations = Array.from(new Set(jobsList.map(job => job.location).filter(Boolean)));
  const types = Array.from(new Set(jobsList.map(job => job.type).filter(Boolean)));

  // Fetch active job openings from API
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setJobsError('');
        const response = await axios.get(`${JOB_BOARD_API_BASE}/api/jobs`);
        const data = response.data.data || response.data || [];
        const fetched = data.map(job => ({
          ...job,
          team: job.department || job.team || 'Engineering',
          experience: job.experience || '2+ Years',
          skills: Array.isArray(job.skills) ? job.skills : []
        }));
        if (fetched.length > 0) {
          setJobsList(fetched);
        }
      } catch (err) {
        console.error('Error fetching jobs silently:', err);
      }
    };
    fetchJobs();
  }, []);

  // Pre-populate fullName and email when user is logged in
  useEffect(() => {
    if (user) {
      const computedName = user.fullName || [user.firstName, user.lastName].filter(Boolean).join(' ') || localStorage.getItem('beta_fullName') || '';
      setFullName(computedName);
      setEmail(user.email || localStorage.getItem('beta_email') || user.username || '');
    } else {
      setFullName('');
      setEmail('');
    }
  }, [user]);


  // Filter logic
  const filteredJobs = jobsList.filter(job => {
    const matchesSearch = !searchQuery ||
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (job.skills && job.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()))) ||
      (job.team && job.team.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesTeam = !selectedTeam || job.team === selectedTeam;
    const matchesLocation = !selectedLocation || job.location === selectedLocation;
    const matchesType = !selectedType || job.type === selectedType;

    return matchesSearch && matchesTeam && matchesLocation && matchesType;
  });

  const handleApply = async (e, jobOverride = null) => {
    e.preventDefault();
    const activeJob = jobOverride || selectedJob;
    if (!fullName || !email || !phone || !resume || !activeJob) return;

    setStatus('loading');
    const formData = new FormData();
    formData.append('jobId', activeJob.id);
    formData.append('fullName', fullName);
    formData.append('email', email);
    formData.append('phone', phone);
    formData.append('coverLetter', coverLetter);
    formData.append('resume', resume);

    try {
      await axios.post(`${JOB_BOARD_API_BASE}/api/jobs/apply`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setStatus('success');
      setMessage(`Application for ${activeJob.title} submitted successfully!`);
      if (!user) {
        setFullName('');
        setEmail('');
      } else {
        const computedName = user.fullName || [user.firstName, user.lastName].filter(Boolean).join(' ') || localStorage.getItem('beta_fullName') || '';
        setFullName(computedName);
        setEmail(user.email || localStorage.getItem('beta_email') || user.username || '');
      }
      setPhone('');
      setCoverLetter('');
      setResume(null);
      setSelectedJobForGeneral(null);
    } catch (err) {
      console.error(err);
      setStatus('error');
      setMessage(err.response?.data?.message || 'Failed to submit application. Try again.');
    }
  };

  return (
    <div className="careers-purple-pink-theme min-h-screen relative overflow-hidden pb-20 pt-4">
      <style>{`
        .careers-purple-pink-theme {
          background: linear-gradient(135deg, #F5F3FF 0%, #EFF6FF 50%, #FDF2F8 100%) !important;
          color: #1E293B !important;
          position: relative;
          z-index: 10;
        }
        .careers-purple-pink-theme h1:not(.text-transparent), 
        .careers-purple-pink-theme h2:not(.text-transparent), 
        .careers-purple-pink-theme h3:not(.text-transparent), 
        .careers-purple-pink-theme h4:not(.text-transparent), 
        .careers-purple-pink-theme h5:not(.text-transparent), 
        .careers-purple-pink-theme h6:not(.text-transparent) {
          color: #0F172A !important;
        }
        .careers-purple-pink-theme h1.text-white:not(.text-transparent), 
        .careers-purple-pink-theme h2.text-white:not(.text-transparent), 
        .careers-purple-pink-theme h3.text-white:not(.text-transparent), 
        .careers-purple-pink-theme h4.text-white:not(.text-transparent), 
        .careers-purple-pink-theme h5.text-white:not(.text-transparent), 
        .careers-purple-pink-theme h6.text-white:not(.text-transparent),
        .careers-purple-pink-theme div.text-white {
          color: #0F172A !important;
        }
        .careers-purple-pink-theme p {
          color: #475569 !important;
        }
        .careers-purple-pink-theme span {
          color: inherit;
        }
        .careers-purple-pink-theme a {
          color: inherit;
        }
        .careers-purple-pink-theme label {
          color: #334155 !important;
        }
        .careers-purple-pink-theme input,
        .careers-purple-pink-theme textarea {
          background-color: #ffffff !important;
          color: #0F172A !important;
          border-color: rgba(139, 92, 246, 0.2) !important;
        }
        .careers-purple-pink-theme input::placeholder,
        .careers-purple-pink-theme textarea::placeholder {
          color: #94A3B8 !important;
        }
        .careers-purple-pink-theme .cta-block h2,
        .careers-purple-pink-theme .cta-block p,
        .careers-purple-pink-theme .cta-block a {
          color: #ffffff !important;
        }

        /* Animated gradient blobs */
        @keyframes floatBlobPink {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.95); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        @keyframes floatBlobPurple {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(-40px, 40px) scale(0.9); }
          66% { transform: translate(30px, -20px) scale(1.05); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .blob-pink {
          animation: floatBlobPink 16s ease-in-out infinite;
        }
        .blob-purple {
          animation: floatBlobPurple 20s ease-in-out infinite;
        }

        /* Floating geometric shapes */
        @keyframes spinSlow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .shape-spin-slow {
          animation: spinSlow 30s linear infinite;
        }

        /* Floating Benefits Circles */
        @keyframes benefitFloatEven {
          0% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-12px) scale(1.03); }
          100% { transform: translateY(0) scale(1); }
        }
        @keyframes benefitFloatOdd {
          0% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-18px) scale(0.98); }
          100% { transform: translateY(0) scale(1); }
        }
        .float-circle-even {
          animation: benefitFloatEven 6s ease-in-out infinite;
        }
        .float-circle-odd {
          animation: benefitFloatOdd 8s ease-in-out infinite;
        }

        /* Purple glowing cards */
        .glass-card-purple {
          background: rgba(255, 255, 255, 1) !important;
          backdrop-filter: blur(12px) !important;
          border: 1px solid rgba(139, 92, 246, 0.2) !important;
          box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.06) !important;
          transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1) !important;
        }
        .glass-card-purple:hover {
          background: rgba(255, 255, 255, 0.92) !important;
          border-color: rgba(236, 72, 153, 0.4) !important; /* Secondary border pink */
          box-shadow: 0 0 25px rgba(139, 92, 246, 0.15) !important; /* Purple glow */
          transform: translateY(-5px);
        }

        /* Scrollbar hidden */
        .scrollbar-none::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-none {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        /* Hacker-style double borders for jobs */
        // .hacker-layout-box {
        //   background: rgba(255, 255, 255, 0.75) !important;
        //   border: 1px solid rgba(139, 92, 246, 0.25) !important;
        //   position: relative;
        // }
        .hacker-layout-box::before {
          content: '';
          position: absolute;
          inset: 2px;
          border: 1px solid rgba(236, 72, 153, 0.12);
          pointer-events: none;
        }
        .unified-openings-box {
          background: white !important;
        }
      `}</style>



      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 space-y-32">
        {/* COMBINED HERO & OPEN ROLES GROUP */}
        <div className="space-y-12">
          {/* HERO SECTION */}
          <div className="text-center max-w-3xl mx-auto pt-8 pb-4 space-y-6">
            {/* <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-[#EC4899] text-xs font-semibold uppercase tracking-wider"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Join Our Team</span>
            </motion.div> */}

            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight text-slate-900"
            >
              Shape Tomorrow
              <span className="block bg-gradient-to-r from-[#8B5CF6] via-[#EC4899] to-purple-600 bg-clip-text text-transparent mt-1">
                With Us
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15 }}
              className="text-slate-600 text-base md:text-lg max-w-2xl mx-auto leading-relaxed"
            >
              At Beta, we design and deliver high-performance real-time enterprise software. We respect developer focus, async workflow, and premium user experience design.
            </motion.p>
          </div>

          {/* SECTION 3: OPEN ROLES SECTION */}
          <div id="search-roles" className="space-y-6">
            <div className="text-center max-w-2xl mx-auto flex flex-col items-center justify-center gap-4">




            </div>

            <div className="w-full max-w-5xl mx-auto hacker-layout-box unified-openings-box p-6 sm:p-8 rounded-2xl shadow-xl shadow-purple-500/5 text-left space-y-6">
              {/* Header inside Box with Centered Title, and Search Bar + Filter Button */}
              <div className="flex flex-col items-center justify-center gap-4 border-b border-purple-500/10 pb-6 w-full">
                <div className="text-center">
                  <h3 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900">
                    Open Roles
                  </h3>
                  <span className="text-xs md:text-sm font-extrabold text-[#F59E0B] uppercase tracking-widest block mt-1">
                    Explore Opportunities
                  </span>
                </div>

                <div className="flex items-center justify-center gap-3 w-full">
                  <div className="relative flex-grow max-w-md flex items-center">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search roles..."
                      className="w-full bg-white text-slate-900 placeholder-slate-400 border border-purple-500/20 rounded-xl py-2 pl-9 pr-8 focus:outline-none focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6] text-sm shadow-sm transition duration-300"
                    />
                    <Search className="absolute left-3 h-4 w-4 text-slate-400 pointer-events-none" />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery('')}
                        className="absolute right-3 p-0.5 hover:bg-slate-100 rounded-full transition text-slate-400 cursor-pointer"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowFilters(!showFilters)}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border transition-all duration-300 text-xs font-bold shadow-sm cursor-pointer whitespace-nowrap ${showFilters
                      ? 'bg-[#8B5CF6] border-transparent text-white shadow-[#8B5CF6]/20'
                      : 'bg-white border-purple-500/20 text-slate-700 hover:bg-slate-50 shadow-purple-500/5'
                      }`}
                  >
                    <SlidersHorizontal className="h-3.5 w-3.5" />
                    <span>Filters</span>
                    {(selectedTeam || selectedLocation || selectedType) && (
                      <span className="flex h-1.5 w-1.5 rounded-full bg-[#EC4899] animate-pulse"></span>
                    )}
                  </button>
                </div>
              </div>

              {/* Expandable Filter Panel inside Box */}
              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, marginTop: 0 }}
                    animate={{ opacity: 1, height: 'auto', marginTop: 0 }}
                    exit={{ opacity: 0, height: 0, marginTop: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="overflow-hidden w-full border-b border-purple-500/10 pb-6"
                  >
                    <div className="bg-white/80 border border-purple-500/10 rounded-xl p-4 shadow-sm flex flex-col gap-4">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {/* Department Filter */}
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Department</label>
                          <select
                            value={selectedTeam}
                            onChange={(e) => setSelectedTeam(e.target.value)}
                            className="w-full bg-white text-slate-800 border border-purple-200 rounded-xl py-2 px-3 focus:outline-none focus:border-[#8B5CF6] text-xs transition cursor-pointer"
                          >
                            <option value="">All Departments</option>
                            {teams.map(team => (
                              <option key={team} value={team}>{team}</option>
                            ))}
                          </select>
                        </div>

                        {/* Location Filter */}
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Location</label>
                          <select
                            value={selectedLocation}
                            onChange={(e) => setSelectedLocation(e.target.value)}
                            className="w-full bg-white text-slate-800 border border-purple-200 rounded-xl py-2 px-3 focus:outline-none focus:border-[#8B5CF6] text-xs transition cursor-pointer"
                          >
                            <option value="">All Locations</option>
                            {locations.map(loc => (
                              <option key={loc} value={loc}>{loc}</option>
                            ))}
                          </select>
                        </div>

                        {/* Job Type Filter */}
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Job Type</label>
                          <select
                            value={selectedType}
                            onChange={(e) => setSelectedType(e.target.value)}
                            className="w-full bg-white text-slate-800 border border-purple-200 rounded-xl py-2 px-3 focus:outline-none focus:border-[#8B5CF6] text-xs transition cursor-pointer"
                          >
                            <option value="">All Types</option>
                            {types.map(type => (
                              <option key={type} value={type}>{type}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Active Filter Pills and Clear Button */}
                      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-purple-500/10 pt-3">
                        <div className="flex flex-wrap gap-2">
                          {selectedTeam && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-700 text-[10px] font-semibold">
                              Dept: {selectedTeam}
                              <button onClick={() => setSelectedTeam('')} className="hover:text-purple-900 cursor-pointer">
                                <X className="h-3 w-3" />
                              </button>
                            </span>
                          )}
                          {selectedLocation && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-pink-500/10 text-pink-700 text-[10px] font-semibold">
                              Loc: {selectedLocation}
                              <button onClick={() => setSelectedLocation('')} className="hover:text-pink-900 cursor-pointer">
                                <X className="h-3 w-3" />
                              </button>
                            </span>
                          )}
                          {selectedType && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-700 text-[10px] font-semibold">
                              Type: {selectedType}
                              <button onClick={() => setSelectedType('')} className="hover:text-amber-900 cursor-pointer">
                                <X className="h-3 w-3" />
                              </button>
                            </span>
                          )}
                        </div>

                        {(selectedTeam || selectedLocation || selectedType) && (
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedTeam('');
                              setSelectedLocation('');
                              setSelectedType('');
                            }}
                            className="text-xs font-semibold text-[#EC4899] hover:underline cursor-pointer"
                          >
                            Clear All Filters
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Job list inside container */}
              <div className="flex flex-col gap-4 w-full">
                <AnimatePresence>
                  {filteredJobs.length > 0 ? (
                    filteredJobs.map((job) => (
                      <motion.div
                        key={job.id}
                        layout
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.3 }}
                        className="p-5 rounded-xl border border-amber-500/10 bg-[#FEFCE8]/70 hover:bg-[#FEFCE8]/90 hover:border-amber-500/25 hover:shadow-sm transition-all duration-300 text-left flex flex-col sm:flex-row sm:items-center justify-between gap-6 group"
                      >
                        <div className="space-y-4 flex-grow">
                          <div>
                            <h3 className="text-lg font-black tracking-tight group-hover:text-[#EC4899] transition-colors duration-300">
                              {job.title}
                            </h3>
                            <span className="text-[9px] font-extrabold text-[#F59E0B] uppercase tracking-widest block mt-0.5">
                              {job.team}
                            </span>
                          </div>

                          <div className="space-y-2 border-t border-b border-amber-500/10 py-3 text-xs text-slate-600 font-medium">
                            <div className="flex items-center space-x-2">
                              <span className="text-[#EC4899]">•</span>
                              <span>{job.location} • {job.type}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-[#EC4899]">•</span>
                              <span>{job.skills.slice(0, 2).join(' / ')} • {job.experience}</span>
                            </div>
                            {job.description && (
                              <div className="flex items-start space-x-2">
                                <span className="text-[#EC4899] select-none">•</span>
                                <span className="text-slate-500 leading-relaxed">{job.description}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex-shrink-0 w-full sm:w-auto">
                          <button
                            onClick={() => setSelectedJob(job)}
                            className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs font-black bg-purple-600/15 hover:bg-gradient-to-r hover:from-[#8B5CF6] hover:to-[#EC4899] text-[#8B5CF6] hover:text-white border border-[#8B5CF6]/30 hover:border-transparent transition-all duration-300 text-center cursor-pointer shadow-sm whitespace-nowrap"
                          >
                            Apply Now
                          </button>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center py-12 text-slate-400 italic text-sm">
                      No open positions found. Try adjusting filters or search keywords.
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 6: HIRING PROCESS */}
        <div className="space-y-16">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-[#EC4899] text-xs font-semibold uppercase tracking-wider">
              <CheckSquare className="h-3.5 w-3.5" />
              <span>Hiring Pipeline</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold">Our Hiring Process</h2>
            <p className="text-slate-500 text-sm">A quick outline of how we validate core competencies and welcome new team members.</p>
          </div>

          {/* Connected Glowing Nodes Timeline */}
          <div className="relative max-w-4xl mx-auto pt-6 flex flex-col md:flex-row flex-wrap md:flex-nowrap items-center justify-between gap-8 md:gap-4">
            {processSteps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <React.Fragment key={step.id}>
                  {/* Glowing Node Circle */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    className="glass-card-purple p-6 rounded-3xl border border-purple-500/20 text-center flex flex-col items-center justify-center shadow-md w-full md:w-[18%] group relative"
                  >
                    <div className={`h-12 w-12 rounded-full flex items-center justify-center border ${step.bg} mb-3 shadow-lg shadow-purple-500/10 transition-transform duration-500 group-hover:scale-105`}>
                      <Icon className={`h-5.5 w-5.5 ${step.color}`} />
                    </div>
                    <span className="text-[9px] font-extrabold text-[#F59E0B] uppercase tracking-widest mb-1">
                      Step {step.id}
                    </span>
                    <h4 className="text-xs font-black group-hover:text-[#EC4899] transition-colors">
                      {step.title}
                    </h4>
                    <p className="text-[10px] text-slate-500 leading-relaxed mt-1 font-medium">
                      {step.desc}
                    </p>
                  </motion.div>

                  {/* Node Connector Line */}
                  {idx < processSteps.length - 1 && (
                    <div className="hidden md:block h-[2px] flex-grow bg-gradient-to-r from-[#8B5CF6]/50 to-[#EC4899]/50 relative z-0 mx-2" />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* SECTION 4: TEAM CULTURE MASONRY */}
        <div className="space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-[#EC4899] text-xs font-semibold uppercase tracking-wider">
              <Users className="h-3.5 w-3.5" />
              <span>Team Culture</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold">Our Team Culture</h2>
            <p className="text-slate-500 text-sm">A look inside our technical sprints, hackathons, and global offsites.</p>
          </div>

          {/* Sequential Grid Layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {/* Box 1 (Text Quote) */}
            <div className="glass-card-purple p-6 rounded-3xl border border-purple-500/20 flex flex-col justify-between shadow-md relative overflow-hidden group">
              <Quote className="h-8 w-8 text-[#EC4899] opacity-40 mb-4" />
              <p className="text-sm font-medium italic text-slate-600 leading-relaxed text-left">
                "We don't build software to hit corporate metrics. We design and deliver real-time systems that solve actual production bottlenecks for customers globally."
              </p>
              <div className="flex items-center space-x-3 mt-6 border-t border-purple-500/10 pt-4">
                <img src="/marcus_avatar.png" alt="Marcus" className="h-9 w-9 rounded-full object-cover border border-purple-500/30" />
                <div className="text-left">
                  <h5 className="text-xs font-bold">Marcus Sterling</h5>
                  <p className="text-[10px] text-[#EC4899] font-semibold">Chief Technology Officer</p>
                </div>
              </div>
            </div>

            {/* Box 2 (Text Highlight Content) */}
            <div className="glass-card-purple p-6 rounded-3xl border border-purple-500/20 flex flex-col justify-between shadow-md relative overflow-hidden group">
              <Code2 className="h-8 w-8 text-[#8B5CF6] opacity-40 mb-4" />
              <div className="space-y-3 flex-grow text-left">
                <h4 className="text-sm font-bold text-slate-800">Interactive Technology</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  We develop premium user interfaces using React, Tailwind CSS, and custom WebSocket pipelines (STOMP). Our engineers focus on low-latency state synchronization, smooth keyframe animations, and highly responsive layouts that delight users.
                </p>
              </div>
              <div className="border-t border-purple-500/10 pt-4 mt-6 text-left">
                <span className="text-[10px] uppercase font-bold text-[#8B5CF6] tracking-wider">
                  Our Engineering Core
                </span>
              </div>
            </div>

            {/* Box 3 (Text Quote) */}
            <div className="glass-card-purple p-6 rounded-3xl border border-purple-500/20 flex flex-col justify-between shadow-md relative overflow-hidden group">
              <Quote className="h-8 w-8 text-[#8B5CF6] opacity-40 mb-4" />
              <p className="text-sm font-medium italic text-slate-600 leading-relaxed text-left">
                "Our designs prioritize aesthetics and responsiveness. Using HSL palettes and custom-built tokens, we create interfaces that look absolutely premium."
              </p>
              <div className="flex items-center space-x-3 mt-6 border-t border-purple-500/10 pt-4">
                <img src="/ananya_avatar.png" alt="Ananya" className="h-9 w-9 rounded-full object-cover border border-purple-500/30" />
                <div className="text-left">
                  <h5 className="text-xs font-bold">Ananya Nair</h5>
                  <p className="text-[10px] text-[#8B5CF6] font-semibold">Head of Design</p>
                </div>
              </div>
            </div>

            {/* Box 4 (Small Card) */}
            <div className="glass-card-purple p-6 rounded-3xl border border-purple-500/20 shadow-md relative overflow-hidden text-left flex flex-col justify-between group">
              <div>
                <h4 className="text-base font-bold mb-2">No-Meeting Wednesdays</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  We protect developers' deep focus. Mid-week days are dedicated purely to code, research, and flow.
                </p>
              </div>
              <div className="border-t border-purple-500/10 pt-4 mt-6">
                <span className="text-[10px] font-extrabold text-[#F59E0B] uppercase tracking-wider">Async Focus block</span>
              </div>
            </div>

            {/* Box 5 (Quote) */}
            <div className="glass-card-purple p-6 rounded-3xl border border-purple-500/20 flex flex-col justify-between shadow-md relative overflow-hidden group">
              <Quote className="h-8 w-8 text-[#EC4899] opacity-40 mb-4" />
              <p className="text-sm font-medium italic text-slate-600 leading-relaxed text-left">
                "Working asynchronously is our superpower. We pair program over codebases and communicate through design RFCs instead of sitting in long daily standups."
              </p>
              <div className="flex items-center space-x-3 mt-6 border-t border-purple-500/10 pt-4">
                <img src="/rohan_avatar.png" alt="Rohan" className="h-9 w-9 rounded-full object-cover border border-purple-500/30" />
                <div className="text-left">
                  <h5 className="text-xs font-bold">Rohan Sen</h5>
                  <p className="text-[10px] text-[#EC4899] font-semibold">Frontend Architect</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 5: BENEFITS SECTION */}
        <div className="space-y-16">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-[#EC4899] text-xs font-semibold uppercase tracking-wider">
              <Award className="h-3.5 w-3.5" />
              <span>Compensation & Benefits</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold">Perks & Benefits</h2>
            <p className="text-slate-500 text-sm">We provide everything you need to deliver high-quality work, grow your skillset, and stay healthy.</p>
          </div>

          {/* Floating Circular Cards Layout */}
          <div className="flex flex-wrap items-center justify-center gap-10 max-w-5xl mx-auto">
            {benefits.map((ben, idx) => {
              const isEven = idx % 2 === 0;
              return (
                <motion.div
                  key={ben.title}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className={`h-48 w-48 rounded-full border border-purple-200 bg-white/80 shadow-lg shadow-purple-500/5 flex flex-col items-center justify-center p-6 text-center space-y-2 relative group overflow-hidden ${isEven ? 'float-circle-even' : 'float-circle-odd'
                    }`}
                >
                  {/* Backdrop glow */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-[#8B5CF6]/10 to-[#EC4899]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                  <span className="text-3xl select-none" role="img" aria-label={ben.title}>
                    {ben.emoji}
                  </span>
                  <h4 className="text-sm font-extrabold group-hover:text-[#EC4899] transition-colors">
                    {ben.title}
                  </h4>
                  <p className="text-[10px] text-slate-500 leading-relaxed line-clamp-3 select-none">
                    {ben.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>



        {/* SECTION 8: CALL TO ACTION SECTION */}
        <div className="cta-block relative overflow-hidden rounded-3xl p-10 md:p-16 border border-purple-500/30 text-center shadow-2xl" style={{ background: 'linear-gradient(135deg, #8B5CF6, #EC4899)' }}>
          {/* Floating glow circles inside CTA */}
          <div className="absolute top-[-30px] left-[-30px] w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute bottom-[-30px] right-[-30px] w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 space-y-6 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-black text-white leading-tight">
              Ready to Build Something Amazing?
            </h2>
            <p className="text-white/80 max-w-xl mx-auto text-sm md:text-base leading-relaxed font-medium">
              Join a team of creators, system architects, and designers scaling software to thousands of businesses globally.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
              <a
                href="#search-roles"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl text-sm font-black bg-purple-950/20 hover:bg-purple-950/45 text-white border border-white/20 hover:border-white/40 transition-all duration-300 hover:scale-[1.02]"
              >
                Apply Now
              </a>
            </div>
          </div>
        </div>

      </div>

      {/* APPLICATION FORM MODAL (FEATURED JOBS TARGET) */}
      <AnimatePresence>
        {selectedJob && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg bg-white rounded-3xl p-6 md:p-8 border border-purple-100 shadow-2xl text-left"
            >
              <button
                onClick={() => setSelectedJob(null)}
                className="absolute right-4 top-4 p-1.5 rounded-lg hover:bg-purple-50 text-purple-400 hover:text-purple-600 transition cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
              <div className="mb-6 space-y-1">
                <span className="text-xs font-bold text-[#EC4899] uppercase tracking-widest">Apply for position</span>
                <h3 className="text-2xl font-black">{selectedJob.title}</h3>
                <p className="text-slate-500 text-xs font-medium">{selectedJob.team} &bull; {selectedJob.location}</p>
              </div>

              {!user ? (
                <div className="py-8 text-center space-y-6">
                  <div className="h-16 w-16 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center mx-auto text-[#EC4899] shadow-sm">
                    <AlertCircle className="h-8 w-8 animate-pulse" />
                  </div>
                  <h4 className="text-lg font-bold">Sign In Required</h4>
                  <p className="text-slate-500 text-xs leading-relaxed max-w-xs mx-auto">
                    You must be logged in to apply for active job openings. Please sign in to your account.
                  </p>
                  <button
                    onClick={() => {
                      setSelectedJob(null);
                      redirectToSSO('/careers');
                    }}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] hover:from-[#7c4ee6] hover:to-[#db3c8b] text-white text-xs font-extrabold transition cursor-pointer border-none shadow-md"
                  >
                    Sign In to Apply
                  </button>
                </div>
              ) : status === 'success' ? (
                <div className="py-8 text-center space-y-4">
                  <div className="h-12 w-12 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center mx-auto text-emerald-600">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                  <h4 className="text-lg font-bold">Application Received!</h4>
                  <p className="text-slate-500 text-xs leading-relaxed max-w-sm mx-auto">{message}</p>
                  <button
                    onClick={() => setSelectedJob(null)}
                    className="px-6 py-2.5 rounded-xl bg-purple-600/10 hover:bg-gradient-to-r hover:from-[#8B5CF6] hover:to-[#EC4899] text-[#8B5CF6] hover:text-white border border-purple-500/30 text-xs font-extrabold transition cursor-pointer"
                  >
                    Close Modal
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApply} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase">Full Name</label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Robert Downey"
                      className="w-full bg-white text-slate-800 placeholder-slate-400 border border-purple-200 rounded-xl py-2.5 px-4 focus:outline-none focus:border-[#EC4899] text-sm transition"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase">Email Address</label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. rob@domain.com"
                        className="w-full bg-white text-slate-800 placeholder-slate-400 border border-purple-200 rounded-xl py-2.5 px-4 focus:outline-none focus:border-[#EC4899] text-sm transition"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase">Phone Number</label>
                      <input
                        type="text"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="e.g. +1 555-0199"
                        className="w-full bg-white text-slate-800 placeholder-slate-400 border border-purple-200 rounded-xl py-2.5 px-4 focus:outline-none focus:border-[#EC4899] text-sm transition"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase">Cover Letter</label>
                    <textarea
                      required
                      rows="3"
                      value={coverLetter}
                      onChange={(e) => setCoverLetter(e.target.value)}
                      placeholder="Introduce yourself and state why you're a fit..."
                      className="w-full bg-white text-slate-800 placeholder-slate-400 border border-purple-200 rounded-xl py-2.5 px-4 focus:outline-none focus:border-[#EC4899] text-sm transition"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase">Resume Upload (PDF Only)</label>
                    <div className="relative border border-dashed border-purple-300 rounded-xl p-6 bg-slate-50 hover:bg-slate-100/60 transition flex flex-col items-center justify-center cursor-pointer">
                      <input
                        type="file"
                        accept=".pdf"
                        required
                        onChange={(e) => setResume(e.target.files[0])}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <Upload className="h-6 w-6 text-purple-400 mb-2" />
                      <span className="text-xs text-[#EC4899] font-bold">
                        {resume ? resume.name : 'Click or drag PDF resume here'}
                      </span>
                    </div>
                  </div>

                  {status === 'error' && (
                    <div className="flex items-center space-x-2 text-rose-600 text-xs p-3 rounded-xl bg-rose-50 border border-rose-100">
                      <AlertCircle className="h-4.5 w-4.5 flex-shrink-0" />
                      <span>{message}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] text-white text-xs font-black transition flex items-center justify-center space-x-2 disabled:from-slate-200 disabled:to-slate-300 disabled:text-slate-400 cursor-pointer"
                  >
                    {status === 'loading' ? (
                      <span>Submitting...</span>
                    ) : (
                      <>
                        <Briefcase className="h-4.5 w-4.5" />
                        <span>Submit Application</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
