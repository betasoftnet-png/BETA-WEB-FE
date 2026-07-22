import React, { useState, useContext, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Box, LogOut, LayoutDashboard, LogIn, ChevronDown, ChevronRight, Mail, Shield, User, Briefcase, Search, UserPlus, Lock, CheckCircle2, AlertCircle, HelpCircle, MessageSquare, Download, Phone, Activity, MapPin, Check, Copy, Clock, Send, RefreshCw, Plus, Sparkles, Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import api from '../api';

const SEARCH_INDEX = [
  // Products
  {
    title: 'BNXmail',
    description: 'Real time mail, always in sync. Collaborative email client.',
    category: 'Products',
    type: 'Product',
    url: 'https://www.bnxmail.com/login',
    isExternal: true,
    keywords: ['mail', 'email', 'bnxmail', 'smtp', 'imap', 'inbox', 'messages', 'communication']
  },
  {
    title: 'B2Auth Security',
    description: 'MFA & SSO Security Gateway for enterprise single sign-on.',
    category: 'Products',
    type: 'Product',
    url: 'https://www.b2auth.com/',
    isExternal: true,
    keywords: ['b2auth', 'auth', 'mfa', 'sso', 'security', 'gateway', 'login', 'authentication', '2fa']
  },
  {
    title: 'Bit-Tool',
    description: 'Daily utility assistant for user productivity & daily tools.',
    category: 'Products',
    type: 'Product',
    url: 'https://bit-tool.beta-softnet.com/',
    isExternal: true,
    keywords: ['bit-tool', 'bit', 'tool', 'utility', 'assistant', 'productivity', 'calculator', 'daily']
  },
  {
    title: 'Cliks',
    description: 'Manage your personal finance, expense tracking & money.',
    category: 'Products',
    type: 'Product',
    url: 'https://cliks.beta-softnet.com/',
    isExternal: true,
    keywords: ['cliks', 'money', 'finance', 'expenses', 'personal', 'budget', 'tracking']
  },
  {
    title: 'CliksBusiness',
    description: 'One Stop Financial Solution for businesses & enterprise teams.',
    category: 'Products',
    type: 'Product',
    url: 'https://www.cliksbusiness.com/',
    isExternal: true,
    keywords: ['cliksbusiness', 'cliks business', 'business finance', 'enterprise', 'teams', 'billing']
  },

  // Pages & Navigation
  {
    title: 'Home Portal',
    description: 'Beta Softnet unified software platform main portal.',
    category: 'Pages',
    type: 'Page',
    url: '/',
    isExternal: false,
    keywords: ['home', 'main', 'portal', 'landing', 'welcome', 'beta', 'unified']
  },
  {
    title: 'About Us',
    description: 'Learn about Beta Softnet vision, mission, story & leadership.',
    category: 'Pages',
    type: 'Page',
    url: '/about',
    isExternal: false,
    keywords: ['about', 'company', 'vision', 'mission', 'story', 'culture', 'team', 'who we are']
  },
  {
    title: 'Careers & Job Openings',
    description: 'Explore active job openings, career paths & apply online.',
    category: 'Pages',
    type: 'Page',
    url: '/careers',
    isExternal: false,
    keywords: ['careers', 'jobs', 'hiring', 'openings', 'vacancies', 'apply', 'work', 'positions', 'employment']
  },
  {
    title: 'Partners & Sales',
    description: 'Join futuristic partnership programs & business collaborations.',
    category: 'Pages',
    type: 'Page',
    url: '/partners',
    isExternal: false,
    keywords: ['partners', 'partnership', 'collaborate', 'sales', 'contact', 'enquiry', 'reach us', 'partner request']
  },
  {
    title: 'Admin Portal Login',
    description: 'HR Admin & candidate management portal login.',
    category: 'Pages',
    type: 'Page',
    url: '/login',
    isExternal: false,
    keywords: ['login', 'admin', 'portal', 'dashboard', 'signin', 'hr', 'management', 'candidate management']
  },
  {
    title: 'Saved Jobs',
    description: 'View bookmarked job openings saved for later.',
    category: 'Pages',
    type: 'Page',
    url: '/careers/saved-jobs',
    isExternal: false,
    keywords: ['saved', 'bookmarks', 'saved jobs', 'favorite jobs', 'saved positions']
  },

  // Careers & Job Roles
  {
    title: 'Software Engineer Positions',
    description: 'Engineering openings in Full Stack, Java, React & Cloud.',
    category: 'Career Openings',
    type: 'Job Openings',
    url: '/careers',
    isExternal: false,
    keywords: ['software engineer', 'developer', 'full stack', 'java', 'react', 'frontend', 'backend', 'code', 'programmer', 'engineering']
  },
  {
    title: 'UI/UX & Product Design',
    description: 'Create user interfaces and experience designs for web apps.',
    category: 'Career Openings',
    type: 'Job Openings',
    url: '/careers',
    isExternal: false,
    keywords: ['ui', 'ux', 'designer', 'design', 'figma', 'creative', 'user experience']
  },
  {
    title: 'Marketing & Business Roles',
    description: 'Digital marketing, growth strategies & sales opportunities.',
    category: 'Career Openings',
    type: 'Job Openings',
    url: '/careers',
    isExternal: false,
    keywords: ['marketing', 'sales', 'business development', 'growth', 'brand', 'strategy']
  },

  // Features
  {
    title: 'Test Round Assessment',
    description: 'Online test round candidate assessment portal.',
    category: 'Features',
    type: 'Feature',
    url: '/careers/assessment',
    isExternal: false,
    keywords: ['test', 'assessment', 'exam', 'aptitude', 'test round', 'candidate test', 'online test']
  },
  {
    title: 'Task Assessment Review',
    description: 'GitHub repository task submission for candidate review.',
    category: 'Features',
    type: 'Feature',
    url: '/careers/task-assessment',
    isExternal: false,
    keywords: ['task', 'task assessment', 'github', 'project submission', 'code review', 'practical task']
  }
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDropdownCategoryOpen, setIsDropdownCategoryOpen] = useState(true);
  const [isDropdownPublicOpen, setIsDropdownPublicOpen] = useState(true);
  const [isDropdownBusinessOpen, setIsDropdownBusinessOpen] = useState(true);
  const [activeCategory, setActiveCategory] = useState('base'); // 'base' or 'comingsoon'
  const [isMobileProductsOpen, setIsMobileProductsOpen] = useState(false);
  const [isMobileCategoryOpen, setIsMobileCategoryOpen] = useState(true);
  const [isMobilePublicOpen, setIsMobilePublicOpen] = useState(true);
  const [isMobileBusinessOpen, setIsMobileBusinessOpen] = useState(true);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [selectedCity, setSelectedCity] = useState('Tiruvallur');
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [isMobileLocationOpen, setIsMobileLocationOpen] = useState(false);
  const locationRef = useRef(null);
  const searchContainerRef = useRef(null);
  const searchInputRef = useRef(null);
  const cities = ['Tiruvallur', 'Vellore'];
  const { user, logout, redirectToSSO } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  const [isDetecting, setIsDetecting] = useState(false);
  const [detectionError, setDetectionError] = useState(null);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const notificationsRef = useRef(null);
  const [notifications, setNotifications] = useState([]);
  const [debugInfo, setDebugInfo] = useState({
    userEmail: '',
    localApps: '',
    backendApps: '',
    candId: '',
    fetchedNotifs: '',
    error: ''
  });

  const formatNotificationTime = (createdAtString) => {
    if (!createdAtString) return 'just now';
    try {
      const date = new Date(createdAtString);
      const now = new Date();
      const diffMs = now - date;
      const diffMins = Math.floor(diffMs / 60000);
      if (diffMins < 1) return 'just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return `${diffHours}h ago`;
      const diffDays = Math.floor(diffHours / 24);
      return `${diffDays}d ago`;
    } catch (e) {
      return 'some time ago';
    }
  };

  const getReadNotifIds = () => {
    try {
      const stored = localStorage.getItem('beta_read_notifications');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      const readIds = getReadNotifIds();
      if (!readIds.includes(String(notificationId))) {
        readIds.push(String(notificationId));
        localStorage.setItem('beta_read_notifications', JSON.stringify(readIds));
      }
      if (typeof notificationId === 'number' || (!isNaN(notificationId) && Number(notificationId) > 0)) {
        await api.put(`/api/notifications/${notificationId}/read`).catch(() => null);
      }
      setNotifications(prev => prev.map(n => String(n.id) === String(notificationId) ? { ...n, read: true } : n));
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const allIds = notifications.map(n => String(n.id));
      localStorage.setItem('beta_read_notifications', JSON.stringify(allIds));
      const numericUnread = notifications.filter(n => !n.read && (typeof n.id === 'number' || !isNaN(n.id)));
      await Promise.all(numericUnread.map(n => api.put(`/api/notifications/${n.id}/read`).catch(() => null)));
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (err) {
      console.error("Failed to mark all notifications as read:", err);
    }
  };

  useEffect(() => {
    const fetchDynamicNotifications = async () => {
      const readIds = getReadNotifIds();
      const dynamicList = [];
      const seenIds = new Set();

      // Determine user / candidate email
      let userEmail = (user?.email || user?.username || localStorage.getItem('candidateEmail') || '').toLowerCase().trim();
      if (!userEmail) {
        try {
          const betaUserStr = localStorage.getItem('beta_user');
          if (betaUserStr) {
            const parsed = JSON.parse(betaUserStr);
            userEmail = (parsed.email || parsed.username || '').toLowerCase().trim();
          }
        } catch (_) { }
      }

      // 1. DYNAMIC JOB OPENINGS & HIRINGS (For all candidates/visitors)
      try {
        const jobsRes = await api.get('/api/jobs').catch(() => null);
        const jobsList = jobsRes?.data?.data || jobsRes?.data || [];
        if (Array.isArray(jobsList)) {
          // Sort newest jobs first
          const sortedJobs = [...jobsList].sort((a, b) => (b.id || 0) - (a.id || 0));
          sortedJobs.slice(0, 5).forEach((job) => {
            const notifId = `job-opening-${job.id}`;
            if (!seenIds.has(notifId)) {
              seenIds.add(notifId);
              dynamicList.push({
                id: notifId,
                title: `🚀 New Opening: ${job.title || 'Role'}`,
                message: `Beta is hiring for ${job.title || 'Positions'} in ${job.location || 'Tiruvallur / Remote'} (${job.type || 'Full Time'}). Tap to explore opportunities.`,
                read: readIds.includes(notifId),
                time: 'Active Hiring',
                category: 'job_opening'
              });
            }
          });
        }
      } catch (e) {
        console.warn("Failed to fetch dynamic job openings:", e);
      }

      // 2. DYNAMIC CANDIDATE APPLICATION PIPELINE NOTIFICATIONS
      if (userEmail && (!user || user.role !== 'ROLE_ADMIN')) {
        try {
          const appsRes = await api.get(`/api/jobs/my-applications?email=${encodeURIComponent(userEmail)}`).catch(() => null);
          let candApps = appsRes?.data?.data || appsRes?.data || [];

          if (Array.isArray(candApps) && candApps.length > 0) {
            candApps.forEach((app) => {
              const statusLower = (app.status || '').toLowerCase();

              // Stage 6: Offer Proposal
              if (['accepted', 'selected', 'approved', 'joined'].includes(statusLower)) {
                const notifId = `offer-${app.id}`;
                if (!seenIds.has(notifId)) {
                  seenIds.add(notifId);
                  dynamicList.push({
                    id: notifId,
                    title: `🎉 Offer Issued for ${app.jobTitle || 'Role'}`,
                    message: `Congratulations! You cleared all selection rounds for ${app.jobTitle}. An onboarding specialist will contact you.`,
                    read: readIds.includes(notifId),
                    time: 'Selection Clear',
                    category: 'offer'
                  });
                }
              }

              // Stage 5: HR Interview Scheduled
              if (app.hrInterviewDate || statusLower.includes('hr')) {
                const notifId = `hr-interview-${app.id}`;
                if (!seenIds.has(notifId)) {
                  seenIds.add(notifId);
                  dynamicList.push({
                    id: notifId,
                    title: `🤝 HR Interview Scheduled`,
                    message: `HR Interview for ${app.jobTitle} is scheduled on ${app.hrInterviewDate || 'soon'} at ${app.hrInterviewTime || '11:00 AM'}.${app.hrInterviewLocation ? ` Venue: ${app.hrInterviewLocation}` : ''}`,
                    read: readIds.includes(notifId),
                    time: 'Interview Update',
                    category: 'hr_interview'
                  });
                }
              }

              // Stage 4: Task Assessment Assigned
              if (app.taskAssigned || app.githubLink || statusLower.includes('task')) {
                const notifId = `task-assessment-${app.id}`;
                if (!seenIds.has(notifId)) {
                  seenIds.add(notifId);
                  dynamicList.push({
                    id: notifId,
                    title: `🛠️ Task Assessment Assigned`,
                    message: app.githubLink
                      ? `Solution repository submitted for ${app.jobTitle}. Solution is under code review.`
                      : `Admin assigned a practical GitHub code review task for ${app.jobTitle}. Check My Applications to submit your repository.`,
                    read: readIds.includes(notifId),
                    time: 'Task Assessment',
                    category: 'task_assessment'
                  });
                }
              }

              // Stage 3: Technical Interview Scheduled
              if (app.interviewDate || statusLower.includes('interview')) {
                const notifId = `tech-interview-${app.id}`;
                if (!seenIds.has(notifId)) {
                  seenIds.add(notifId);
                  dynamicList.push({
                    id: notifId,
                    title: `💻 Technical Interview Scheduled`,
                    message: `Technical interview for ${app.jobTitle} scheduled on ${app.interviewDate || 'soon'} at ${app.interviewTime || '10:00 AM'}.${app.interviewLink ? ` Link: ${app.interviewLink}` : ''}`,
                    read: readIds.includes(notifId),
                    time: 'Interview Update',
                    category: 'tech_interview'
                  });
                }
              }

              // Stage 2: Assessment Sent
              if (app.aptitudeStatus === 'Assessment Sent' || statusLower.includes('assessment') || statusLower === 'shortlisted') {
                const notifId = `assessment-${app.id}`;
                if (!seenIds.has(notifId)) {
                  seenIds.add(notifId);
                  dynamicList.push({
                    id: notifId,
                    title: `📝 Screening Assessment Link Sent`,
                    message: `Screening assessment link for ${app.jobTitle} is generated. Link expires 24 hours after sending.`,
                    read: readIds.includes(notifId),
                    time: 'Assessment Update',
                    category: 'assessment'
                  });
                }
              }

              // Stage 1: Application Received
              const notifId = `app-received-${app.id}`;
              if (!seenIds.has(notifId)) {
                seenIds.add(notifId);
                dynamicList.push({
                  id: notifId,
                  title: `📋 Application Submitted: ${app.jobTitle || 'Role'}`,
                  message: `Your application for ${app.jobTitle} was received. Status: ${app.status || 'Under Review'}.`,
                  read: readIds.includes(notifId),
                  time: formatNotificationTime(app.createdAt || app.appliedDate),
                  category: 'application'
                });
              }

              // Also fetch backend notifications table for candidate
              if (app.id && !String(app.id).startsWith('local-')) {
                api.get(`/api/notifications/${app.id}`).then(backendNotifRes => {
                  const dbNotifs = backendNotifRes?.data || [];
                  if (Array.isArray(dbNotifs)) {
                    dbNotifs.forEach(dbN => {
                      const dbNotifId = `db-${dbN.id}`;
                      if (!seenIds.has(dbNotifId)) {
                        seenIds.add(dbNotifId);
                        dynamicList.push({
                          id: dbNotifId,
                          title: dbN.title,
                          message: dbN.message,
                          read: dbN.isRead || dbN.read || readIds.includes(dbNotifId),
                          time: formatNotificationTime(dbN.createdAt),
                          category: 'db_notification'
                        });
                      }
                    });
                  }
                }).catch(() => null);
              }
            });
          }
        } catch (e) {
          console.warn("Failed to fetch dynamic candidate application notifications:", e);
        }
      }

      setNotifications(dynamicList);
    };

    fetchDynamicNotifications();
    const interval = setInterval(fetchDynamicNotifications, 5000);
    return () => clearInterval(interval);
  }, [user]);

  const handleCurrentLocation = () => {
    if (!navigator.geolocation) {
      setDetectionError("Geolocation is not supported by your browser.");
      return;
    }

    setIsDetecting(true);
    setDetectionError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const response = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
          );
          if (!response.ok) throw new Error("Failed to fetch location data");
          const data = await response.json();
          const detectedCity = data.city || data.locality || data.principalSubdivision || "Unknown City";
          setSelectedCity(detectedCity);
          setIsDetecting(false);
          setIsLocationOpen(false);
          setIsMobileLocationOpen(false);
        } catch (error) {
          console.error("Error detecting city:", error);
          setDetectionError("Failed to resolve city name.");
          setIsDetecting(false);
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        let errorMsg = "Permission denied or location unavailable.";
        if (error.code === error.PERMISSION_DENIED) {
          errorMsg = "Location permission denied.";
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          errorMsg = "Location position unavailable.";
        } else if (error.code === error.TIMEOUT) {
          errorMsg = "Location detection timed out.";
        }
        setDetectionError(errorMsg);
        setIsDetecting(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const profileRef = useRef(null);
  const productsDropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
      if (productsDropdownRef.current && !productsDropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (locationRef.current && !locationRef.current.contains(event.target)) {
        setIsLocationOpen(false);
      }
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setIsSearchExpanded(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setIsNotificationsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (isSearchExpanded && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchExpanded]);

  const filteredSearchResults = searchQuery.trim()
    ? SEARCH_INDEX.filter(item => {
      const query = searchQuery.toLowerCase().trim();
      const matchTitle = item.title.toLowerCase().includes(query);
      const matchDesc = item.description.toLowerCase().includes(query);
      const matchCategory = item.category.toLowerCase().includes(query);
      const matchKeywords = item.keywords.some(k => k.toLowerCase().includes(query));
      return matchTitle || matchDesc || matchCategory || matchKeywords;
    })
    : [];

  const handleSelectSearchResult = (result) => {
    setIsSearchExpanded(false);
    setSearchQuery('');
    if (result.isExternal) {
      window.open(result.url, '_blank', 'noopener,noreferrer');
    } else {
      navigate(result.url);
    }
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      if (filteredSearchResults.length > 0) {
        handleSelectSearchResult(filteredSearchResults[0]);
      } else if (searchQuery.trim()) {
        navigate('/careers');
        setIsSearchExpanded(false);
        setSearchQuery('');
      }
    }
  };

  const navLinks = [
    { name: 'Products', path: '/' },
    { name: 'Partners', path: '/partners' },
    { name: 'Careers', path: '/careers' },
    { name: 'About', path: '/about' },
    { name: 'Support', path: '/support' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#e2f0e8] shadow-sm text-slate-800">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="relative flex items-center justify-between h-14">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center ml-4 sm:ml-12 space-x-2 flex-1 justify-start">
              <Link to="/" className="flex items-center select-none">
                <img src="/logo.png" alt="Beta Logo" className="h-14 w-auto object-contain" />
              </Link>

              <div className="relative animate-fadeIn ml-6" ref={locationRef}>
                <button
                  onClick={() => setIsLocationOpen(!isLocationOpen)}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-slate-100/90 border border-slate-200/80 hover:bg-slate-200/60 transition duration-300 text-xs font-bold text-slate-700 cursor-pointer focus:outline-none"
                >
                  <MapPin className="h-3.5 w-3.5 text-slate-500" />
                  <span className="text-slate-700">{selectedCity}</span>
                  <ChevronDown className={`h-3 w-3 text-slate-400 transform transition-transform ${isLocationOpen ? 'rotate-180' : ''}`} />
                </button>

                {isLocationOpen && (
                  <div className="absolute left-0 mt-2 w-44 rounded-2xl bg-white border border-slate-200 shadow-2xl p-2 z-50 text-left text-slate-800">
                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider px-3 py-1.5 border-b border-slate-100">
                      Select Location
                    </div>
                    <div className="py-1 max-h-60 overflow-y-auto">
                      {/* Current Location Option */}
                      <button
                        onClick={handleCurrentLocation}
                        disabled={isDetecting}
                        className="w-full text-left px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center space-x-1.5 hover:bg-slate-50 text-slate-700 hover:text-emerald-750 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isDetecting ? (
                          <RefreshCw className="h-3.5 w-3.5 text-emerald-600 animate-spin" />
                        ) : (
                          <MapPin className="h-3.5 w-3.5 text-emerald-600 animate-pulse" />
                        )}
                        <span>{isDetecting ? "Detecting Location..." : "Current Location"}</span>
                      </button>
                      {detectionError && (
                        <div className="px-3 py-1 text-[10px] text-rose-500 font-semibold leading-tight animate-fadeIn">
                          {detectionError}
                        </div>
                      )}
                      <div className="my-1.5 border-t border-slate-100/80" />

                      {/* Cities List */}
                      {cities.map((city) => (
                        <button
                          key={city}
                          onClick={() => {
                            setSelectedCity(city);
                            setIsLocationOpen(false);
                          }}
                          className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center justify-between ${selectedCity === city
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'hover:bg-slate-50 text-slate-700 hover:text-[#004AAD]'
                            }`}
                        >
                          <span>{city}</span>
                          {selectedCity === city && <Check className="h-3.5 w-3.5 text-emerald-600" />}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Desktop Nav Links (Absolutely centered) */}
            <div className="hidden md:flex items-center justify-center absolute left-1/2 -translate-x-1/2 z-30">
              {/* Desktop Nav Links */}
              <div className="flex items-center space-x-0.5 bg-slate-100/90 p-1 rounded-full border border-slate-200/80 shadow-inner nav-pill-container">
                {navLinks.map((link) => {
                  if (link.name === 'Products') {
                    return (
                      <div
                        key={link.name}
                        ref={productsDropdownRef}
                        className=""
                      >
                        <button
                          type="button"
                          onClick={() => {
                            setIsDropdownOpen(!isDropdownOpen);
                          }}
                          className={`flex items-center space-x-1 focus:outline-none cursor-pointer ${isActive('/products') || isDropdownOpen ? 'active-pill' : ''}`}
                        >
                          <span>Products</span>
                          <ChevronDown className={`h-3.5 w-3.5 text-slate-400 transform transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {isDropdownOpen && (
                          <div className="absolute left-1/2 -translate-x-1/2 top-full mt-1.5 w-[640px] rounded-2xl bg-white border border-slate-200 shadow-2xl pt-4 px-0 pb-0 overflow-hidden z-50 text-left text-slate-800">
                            <table className="w-full text-left border-collapse">
                              <thead>
                                <tr className="bg-white border-b border-slate-200 text-slate-700 text-xs uppercase tracking-wider font-extrabold select-none">
                                  <th
                                    className="py-2.5 pl-6 pr-2 rounded-l-lg text-slate-700 w-1/5 select-none"
                                  >
                                    <div className="flex items-center space-x-1">
                                      <span>Category</span>
                                    </div>
                                  </th>
                                  <th
                                    className="py-2.5 px-6 text-slate-700 w-2/5 select-none"
                                  >
                                    <div className="flex items-center space-x-1">
                                      <span>Public</span>
                                    </div>
                                  </th>
                                  <th
                                    className="py-2.5 pl-4 pr-6 rounded-r-lg text-slate-700 w-2/5 select-none"
                                  >
                                    <div className="flex items-center space-x-1">
                                      <span>Business</span>
                                    </div>
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="text-slate-750 text-xs">
                                {/* Row 1: Base */}
                                <tr className="bg-transparent hover:bg-slate-50/40 transition-colors">
                                  <td className="py-3 pl-6 pr-2 align-top pt-3 w-1/5 border-r border-slate-200">
                                    {isDropdownCategoryOpen && (
                                      <div className="flex flex-col gap-3 pt-1 pb-1">
                                        {/* Aligns with BNXmail */}
                                        <div className="h-[60px] flex items-center animate-fadeIn">
                                          <button
                                            type="button"
                                            onClick={() => setActiveCategory('base')}
                                            className="focus:outline-none cursor-pointer border-none bg-transparent p-0 flex items-center w-full text-left"
                                            title="Show Base products list"
                                          >
                                            {activeCategory === 'base' ? (
                                              <span className="inline-block px-2.5 py-1 rounded-full bg-white text-[#004AAD] border border-[#004AAD]/30 text-xs font-extrabold uppercase tracking-widest select-none text-left shadow-sm hover:bg-[#004AAD]/5 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer">
                                                Base
                                              </span>
                                            ) : (
                                              <span className="inline-block px-2.5 py-1 rounded-full bg-slate-50 border border-slate-200 text-slate-700 text-xs font-extrabold uppercase tracking-widest select-none text-left hover:bg-slate-200 hover:border-slate-300 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer">
                                                Base
                                              </span>
                                            )}
                                          </button>
                                        </div>

                                        {/* Divider Line below Base */}
                                        <hr className="border-t border-slate-200 -ml-6 -mr-2 opacity-80 -mt-2.5" />

                                        {/* Aligns with B2Auth */}
                                        <div className="h-[60px] flex items-center animate-fadeIn">
                                          <button
                                            type="button"
                                            onClick={() => setActiveCategory('comingsoon')}
                                            className="focus:outline-none cursor-pointer border-none bg-transparent p-0 flex items-center w-full text-left"
                                            title="Show Coming Soon products list"
                                          >
                                            {activeCategory === 'comingsoon' ? (
                                              <span
                                                className="inline-flex items-center justify-center text-[8px] font-extrabold uppercase tracking-wider px-2.5 py-1.5 rounded-md bg-amber-600 text-white border border-amber-700 shadow-sm hover:bg-amber-700 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
                                                style={{ lineHeight: 1 }}
                                              >
                                                Coming Soon
                                              </span>
                                            ) : (
                                              <span className="coming-soon-badge !ml-0 transition-all duration-200 cursor-pointer hover:scale-105 hover:shadow-md hover:!bg-amber-500/20 hover:!text-amber-800">
                                                Coming Soon
                                              </span>
                                            )}
                                          </button>
                                        </div>
                                        {/* Divider Line below Coming Soon */}
                                        <hr className="border-t border-slate-200 -ml-6 -mr-2 opacity-80" />
                                      </div>
                                    )}
                                  </td>
                                  <td
                                    colSpan={activeCategory === 'comingsoon' ? 2 : 1}
                                    className={`py-3 px-6 align-top ${activeCategory === 'comingsoon' ? 'w-4/5' : 'w-2/5 border-r border-slate-200'}`}
                                  >
                                    {/* Public Products */}
                                    {isDropdownPublicOpen && (
                                      <div className="flex flex-col gap-3 pt-1 pb-1">
                                        {/* Shown in Base view */}
                                        {activeCategory === 'base' && (
                                          <>
                                            <a
                                              href="https://www.bnxmail.com/login"
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className="flex items-center space-x-2.5 p-2 rounded-xl border border-slate-200 bg-slate-50/40 transition group hover:bg-slate-100 hover:border-slate-300 hover:shadow-sm cursor-pointer text-left block animate-fadeIn"
                                            >
                                              <div className="h-12 w-12 flex-shrink-0 flex items-center justify-center">
                                                <img src="/bnx_mail_logo.png" alt="BNX Mail" className="h-full w-full object-contain" />
                                              </div>
                                              <div>
                                                <p className="font-semibold text-slate-800 text-xs">BNXmail</p>
                                                <p className="text-[10px] text-slate-450 font-medium">
                                                  Real time mail, always in sync.
                                                </p>
                                              </div>
                                            </a>

                                            <a
                                              href="https://www.b2auth.com/"
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className="flex items-center space-x-2.5 p-2 rounded-xl border border-slate-200 bg-slate-50/40 transition group hover:bg-slate-100 hover:border-slate-300 hover:shadow-sm cursor-pointer text-left block animate-fadeIn"
                                            >
                                              <div className="h-12 w-12 flex-shrink-0 flex items-center justify-center">
                                                <img src="/b2auth_logo.png" alt="B2Auth Security" className="h-full w-full object-contain" />
                                              </div>
                                              <div>
                                                <p className="font-semibold text-slate-800 text-xs">B2Auth</p>
                                                <p className="text-[10px] text-slate-450 font-medium">MFA & SSO Gateway</p>
                                              </div>
                                            </a>

                                            <a
                                              href="https://bit-tool.beta-softnet.com/"
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className="flex items-center space-x-2.5 p-2 rounded-xl border border-slate-200 bg-slate-50/40 transition group hover:bg-slate-100 hover:border-slate-300 hover:shadow-sm cursor-pointer text-left block animate-fadeIn"
                                            >
                                              <div className="h-12 w-12 flex-shrink-0 flex items-center justify-center">
                                                <img src="/bit_tool_logo.png" alt="Bit Tool" className="h-full w-full object-contain" />
                                              </div>
                                              <div>
                                                <p className="font-semibold text-slate-800 text-xs text-left">Bit-Tool</p>
                                                <p className="text-[10px] text-slate-450 font-medium text-left">Daily Utility Assistant</p>
                                              </div>
                                            </a>

                                            <a
                                              href="https://cliks.beta-softnet.com/"
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className="flex items-center space-x-2.5 p-2 rounded-xl border border-slate-200 bg-slate-50/40 transition group hover:bg-slate-100 hover:border-slate-300 hover:shadow-sm cursor-pointer text-left block animate-fadeIn"
                                            >
                                              <div className="h-12 w-12 flex-shrink-0 flex items-center justify-center">
                                                <img src="/cliks_logo.png" alt="Cliks" className="h-full w-full object-contain" />
                                              </div>
                                              <div>
                                                <p className="font-semibold text-slate-800 text-xs">Cliks</p>
                                                <p className="text-[10px] text-slate-450 font-medium">Manage your Money</p>
                                              </div>
                                            </a>
                                          </>
                                        )}

                                        {/* Coming Soon card (Only shown in Coming Soon view) */}
                                        {activeCategory === 'comingsoon' && (
                                          <motion.div
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            className="h-[284px] min-h-[284px] rounded-xl bg-slate-50/80 border border-dashed border-slate-200/90 flex flex-col items-center justify-center p-6 text-center overflow-hidden relative select-none w-full"
                                          >
                                            {/* Glowing background */}
                                            <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 via-violet-500/5 to-emerald-500/5 animate-pulse pointer-events-none" />

                                            {/* Text container */}
                                            <motion.div
                                              animate={{
                                                scale: [1, 1.05, 1],
                                              }}
                                              transition={{
                                                repeat: Infinity,
                                                duration: 2,
                                                ease: "easeInOut"
                                              }}
                                              className="relative z-10 space-y-2 flex flex-col items-center justify-center my-auto"
                                            >
                                              <Sparkles className="h-7 w-7 text-amber-500 animate-pulse mb-1" />
                                              <h2 className="text-2xl font-extrabold tracking-widest bg-gradient-to-r from-amber-500 via-violet-600 to-emerald-500 bg-clip-text text-transparent uppercase animate-pulse">
                                                Coming Soon
                                              </h2>
                                              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                                                Beta Labs Release
                                              </p>
                                            </motion.div>

                                            {/* Bottom Shimmer line */}
                                            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-amber-400 via-indigo-500 to-emerald-400 opacity-60" />
                                          </motion.div>
                                        )}
                                      </div>
                                    )}
                                  </td>
                                  {activeCategory === 'base' && (
                                    <td className="py-3 pl-4 pr-6 align-top w-2/5">
                                      {/* Business Products */}
                                      {isDropdownBusinessOpen && (
                                        <div className="flex flex-col gap-3 pt-1 pb-1 animate-fadeIn">
                                          <a
                                            href="https://www.cliksbusiness.com/"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center space-x-2.5 p-2 rounded-xl border border-slate-200 bg-slate-50/40 transition group hover:bg-slate-100 hover:border-slate-300 hover:shadow-sm cursor-pointer text-left block"
                                          >
                                            <div className="h-12 w-12 flex-shrink-0 flex items-center justify-center">
                                              <img src="/cliks_business_logo.png" alt="Cliks Business" className="h-full w-full object-contain" />
                                            </div>
                                            <div>
                                              <p className="font-semibold text-slate-800 text-xs">CliksBusiness</p>
                                              <p className="text-[10px] text-slate-450 font-medium">One Stop Financial Solution</p>
                                            </div>
                                          </a>
                                        </div>
                                      )}
                                    </td>
                                  )}
                                </tr>
                                {/* Row 2: Beta Ecosystem footer bar */}
                                <tr className="border-t-0 border-none">
                                  <td className="bg-slate-50 border-r border-slate-200 border-t-0 rounded-bl-xl pl-6 pr-2"></td>
                                  <td colSpan={2} className="pt-4.5 pb-2.5 pr-0 text-center select-none bg-slate-50 border-t-0 rounded-br-xl">
                                    <span className="text-[10px] text-slate-500 font-extrabold uppercase tracking-widest">
                                      Beta Ecosystem
                                    </span>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    );
                  }


                  return (
                    <Link
                      key={link.name}
                      to={link.path}
                      className={isActive(link.path) ? 'active-pill' : ''}
                    >
                      {link.name}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Desktop Search, Profile & Auth CTA */}
            <div className="hidden md:flex items-center justify-end space-x-4 flex-1 z-20 pointer-events-none">

              {/* Header Search Bar */}
              <div ref={searchContainerRef} className="relative mr-2 flex items-center justify-center pointer-events-auto">
                {isSearchExpanded ? (
                  <div className="relative w-36 sm:w-44 lg:w-48 nav-search-container animate-fadeIn">
                    <button
                      type="button"
                      onClick={() => {
                        setIsSearchExpanded(false);
                        setSearchQuery('');
                      }}
                      className="absolute left-2.5 top-1/2 -translate-y-1/2 p-0.5 hover:bg-slate-200/30 rounded-full transition cursor-pointer z-10 flex items-center justify-center border-none bg-transparent"
                      title="Close Search"
                    >
                      <X className="h-3.5 w-3.5 text-blue-300 hover:text-white transition" />
                    </button>
                    <input
                      ref={searchInputRef}
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={handleSearch}
                      placeholder="Search..."
                      className="w-full bg-[#002b5c]/80 border border-blue-800/40 rounded-full py-1 pl-7 pr-3 text-xs text-white focus:outline-none focus:border-white focus:bg-[#002b5c]/95 transition shadow-inner nav-search-input"
                    />

                    {/* Live Search Results Dropdown */}
                    {searchQuery.trim().length > 0 && (
                      <div className="absolute right-0 top-full mt-2 w-80 lg:w-96 rounded-2xl bg-white border border-slate-200 shadow-2xl z-50 p-2 text-left animate-fadeIn max-h-96 overflow-y-auto text-slate-800">
                        <div className="px-3 py-2 border-b border-slate-100 flex items-center justify-between">
                          <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">
                            Search Results ({filteredSearchResults.length})
                          </span>
                          <span className="text-[10px] text-slate-400 font-semibold">
                            Click to navigate
                          </span>
                        </div>

                        {filteredSearchResults.length > 0 ? (
                          <div className="py-1 space-y-1">
                            {filteredSearchResults.map((result, idx) => (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => handleSelectSearchResult(result)}
                                className="w-full text-left p-2.5 rounded-xl hover:bg-slate-50 transition duration-150 flex items-start space-x-3 cursor-pointer group border border-transparent hover:border-slate-200/80"
                              >
                                <div className="h-8 w-8 rounded-lg bg-blue-50 border border-blue-100 text-[#004AAD] flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition">
                                  {result.category === 'Products' ? (
                                    <Box className="h-4 w-4 text-[#004AAD]" />
                                  ) : result.category === 'Pages' ? (
                                    <LayoutDashboard className="h-4 w-4 text-[#004AAD]" />
                                  ) : result.category === 'Career Openings' ? (
                                    <Briefcase className="h-4 w-4 text-[#004AAD]" />
                                  ) : (
                                    <Sparkles className="h-4 w-4 text-[#004AAD]" />
                                  )}
                                </div>

                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between gap-1">
                                    <span className="text-xs font-bold text-slate-900 group-hover:text-[#004AAD] transition truncate">
                                      {result.title}
                                    </span>
                                    <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 shrink-0">
                                      {result.category}
                                    </span>
                                  </div>
                                  <p className="text-[10px] text-slate-500 font-medium truncate mt-0.5">
                                    {result.description}
                                  </p>
                                </div>
                              </button>
                            ))}
                          </div>
                        ) : (
                          <div className="py-8 px-4 text-center space-y-1">
                            <p className="text-xs font-bold text-slate-700">No results found for "{searchQuery}"</p>
                            <p className="text-[10px] text-slate-400 font-medium">Try searching for Products, Careers, About Us, or Admin Login</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsSearchExpanded(true)}
                    className="p-2 rounded-full hover:bg-slate-100 text-slate-600 transition duration-300 focus:outline-none cursor-pointer flex items-center justify-center"
                    title="Search"
                  >
                    <Search className="h-5 w-5 text-slate-650 hover:text-[#004AAD]" />
                  </button>
                )}
              </div>

              {/* Header Notification Icon Bell Dropdown */}
              <div className="relative pointer-events-auto" ref={notificationsRef}>
                <button
                  type="button"
                  onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                  className="relative p-2 rounded-full hover:bg-slate-100 text-slate-600 transition duration-300 focus:outline-none cursor-pointer flex items-center justify-center border-none bg-transparent"
                  title="Notifications"
                >
                  <Bell className="h-5 w-5 text-slate-650 hover:text-[#004AAD] transition-colors" />
                  {/* Notification Count Badge */}
                  {notifications.filter(n => !n.read).length > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[8px] font-extrabold text-white">
                      {notifications.filter(n => !n.read).length}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown Panel */}
                <AnimatePresence>
                  {isNotificationsOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-80 rounded-2xl bg-white border border-slate-200 shadow-2xl z-50 overflow-hidden text-left"
                    >
                      <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                        <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">Notifications</span>
                        {notifications.filter(n => !n.read).length > 0 && (
                          <button
                            onClick={handleMarkAllAsRead}
                            className="text-[10px] text-[#004AAD] font-extrabold hover:underline border-none bg-transparent cursor-pointer p-0"
                          >
                            Mark all read
                          </button>
                        )}
                      </div>

                      <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                        {notifications.length > 0 ? (
                          notifications.map(notif => (
                            <div
                              key={notif.id}
                              onClick={() => {
                                if (!notif.read) {
                                  handleMarkAsRead(notif.id);
                                }
                                setIsNotificationsOpen(false);
                                navigate('/careers');
                              }}
                              className={`p-3.5 hover:bg-slate-50 transition-colors cursor-pointer flex items-start gap-3 ${!notif.read ? 'bg-blue-50/30' : ''}`}
                            >
                              <div className="mt-0.5 shrink-0">
                                {notif.category === 'job_opening' ? (
                                  <Briefcase className="h-4 w-4 text-purple-600" />
                                ) : notif.category === 'offer' ? (
                                  <Sparkles className="h-4 w-4 text-amber-500" />
                                ) : notif.category === 'tech_interview' || notif.category === 'hr_interview' ? (
                                  <Clock className="h-4 w-4 text-emerald-600" />
                                ) : notif.category === 'task_assessment' ? (
                                  <CheckCircle2 className="h-4 w-4 text-indigo-600" />
                                ) : notif.category === 'assessment' ? (
                                  <AlertCircle className="h-4 w-4 text-pink-600" />
                                ) : (
                                  <Bell className="h-4 w-4 text-[#004AAD]" />
                                )}
                              </div>
                              <div className="space-y-0.5 flex-grow min-w-0 text-left">
                                <div className="flex items-center justify-between gap-2">
                                  <p className={`text-xs font-bold truncate ${!notif.read ? 'text-slate-900 font-extrabold' : 'text-slate-700'}`}>{notif.title}</p>
                                  <span className="text-[9px] text-slate-400 font-bold flex-shrink-0">{notif.time}</span>
                                </div>
                                <p className="text-[11px] text-slate-600 leading-snug font-medium line-clamp-2">{notif.message}</p>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="py-8 text-center text-slate-400 italic text-xs">
                            No new notifications.
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {user ? (
                <div className="relative pointer-events-auto" ref={profileRef}>
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-slate-100/95 border border-slate-200/80 hover:bg-slate-200/60 transition duration-300 cursor-pointer text-slate-700 focus:outline-none"
                  >
                    <div className="h-6 w-6 rounded-full bg-[#004AAD] flex items-center justify-center text-white font-semibold text-xs select-none">
                      <User className="h-3.5 w-3.5" />
                    </div>
                    <span className="text-sm font-semibold tracking-wide pr-1 text-slate-700">
                      {(() => {
                        const name = user.fullName || user.firstName || (user.username ? user.username.split('@')[0] : 'User');
                        return name.length > 5 ? name.substring(0, 5) + '...' : name;
                      })()}
                    </span>
                    <ChevronDown className={`h-4 w-4 text-slate-400 transform transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white border border-slate-200 shadow-2xl p-5 z-50 text-left text-slate-800">
                      <div className="space-y-1">
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Logged In As</p>
                        <p className="text-sm font-extrabold text-slate-900 truncate">{user.fullName || (user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : user.username)}</p>
                        <p className="text-xs text-slate-500 font-medium truncate">{user.email || user.username}</p>
                      </div>

                      <div className="border-b border-slate-100 my-4" />

                      <div className="space-y-4">
                        <Link
                          to="/adminofcarrer"
                          onClick={() => setIsProfileOpen(false)}
                          className="block text-sm font-semibold text-slate-700 hover:text-[#004AAD] transition"
                        >
                          Account Profile
                        </Link>

                        <div className="flex justify-between items-center text-sm font-semibold">
                          <span className="text-slate-700">Language</span>
                          <span className="text-slate-400 font-medium">English</span>
                        </div>

                        <div className="flex justify-between items-center text-sm font-semibold">
                          <span className="text-slate-700">Currency</span>
                          <span className="text-slate-400 font-medium">INR (₹)</span>
                        </div>

                        <div className="flex justify-between items-center text-sm font-semibold">
                          <span className="text-slate-700">Country</span>
                          <span className="text-slate-400 font-medium">India</span>
                        </div>
                      </div>

                      <div className="border-b border-slate-100 my-4" />

                      <button
                        onClick={() => {
                          setIsProfileOpen(false);
                          handleLogout();
                        }}
                        className="w-full text-left text-sm font-bold text-red-500 hover:text-red-600 transition border-none bg-transparent cursor-pointer p-0"
                      >
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-2 flex-shrink-0 pointer-events-auto">
                  <button
                    onClick={() => redirectToSSO(location.pathname)}
                    className="flex items-center space-x-1.5 px-4 py-1.5 rounded-full bg-[#004AAD] border border-[#004AAD] text-white hover:bg-[#003882] hover:border-[#003882] transition duration-300 text-xs font-bold cursor-pointer header-signin-btn whitespace-nowrap flex-shrink-0 shadow-md shadow-blue-950/20"
                  >
                    <LogIn className="h-3.5 w-3.5 text-white flex-shrink-0" />
                    <span className="text-white whitespace-nowrap">Sign In</span>
                  </button>
                </div>
              )}

            </div>

            {/* Mobile Menu Button */}
            <div className="-mr-2 flex md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-slate-500 hover:text-[#004AAD] hover:bg-slate-100 focus:outline-none"
              >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Drawer */}
        {isOpen && (
          <div className="md:hidden bg-white border-b border-[#e2f0e8] shadow-lg">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {/* Mobile Location Selector */}
              <div className="px-3 py-1.5 border-b border-slate-100 mb-2">
                <div className="relative">
                  <button
                    onClick={() => setIsMobileLocationOpen(!isMobileLocationOpen)}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-md bg-slate-50 border border-slate-150 text-sm font-medium text-slate-700 focus:outline-none cursor-pointer"
                  >
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-slate-500" />
                      <span className="font-bold">{selectedCity}</span>
                    </div>
                    <ChevronDown className={`h-4 w-4 text-slate-400 transform transition-transform ${isMobileLocationOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isMobileLocationOpen && (
                    <div className="mt-1 w-full bg-white border border-slate-200 rounded-lg shadow-lg max-h-48 overflow-y-auto z-50 p-1 text-left">
                      {/* Current Location Option */}
                      <button
                        onClick={handleCurrentLocation}
                        disabled={isDetecting}
                        className="w-full text-left px-3 py-2 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition hover:bg-slate-50 text-slate-700 hover:text-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isDetecting ? (
                          <RefreshCw className="h-3.5 w-3.5 text-emerald-600 animate-spin" />
                        ) : (
                          <MapPin className="h-3.5 w-3.5 text-emerald-600" />
                        )}
                        <span>{isDetecting ? "Detecting..." : "Current Location"}</span>
                      </button>
                      {detectionError && (
                        <div className="px-3 py-1 text-[10px] text-rose-500 font-semibold leading-tight">
                          {detectionError}
                        </div>
                      )}
                      <div className="my-1 border-t border-slate-100" />

                      {/* Cities List */}
                      {cities.map((city) => (
                        <button
                          key={city}
                          onClick={() => {
                            setSelectedCity(city);
                            setIsMobileLocationOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-between transition cursor-pointer ${selectedCity === city
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'hover:bg-slate-50 text-slate-700'
                            }`}
                        >
                          <span>{city}</span>
                          {selectedCity === city && <Check className="h-3.5 w-3.5 text-emerald-600" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              {navLinks.map((link) => {
                if (link.name === 'Products') {
                  return (
                    <div key={link.name} className="space-y-1">
                      <button
                        onClick={() => {
                          setIsMobileProductsOpen(!isMobileProductsOpen);
                        }}
                        className="w-full flex items-center justify-between px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-100 hover:text-[#004AAD] focus:outline-none cursor-pointer"
                      >
                        <span>Products</span>
                        <ChevronDown className={`h-4 w-4 text-slate-400 transform transition-transform ${isMobileProductsOpen ? 'rotate-180' : ''}`} />
                      </button>
                      {isMobileProductsOpen && (
                        <div className="pl-4 pr-3 py-2 space-y-2 bg-slate-50 border border-slate-150/80 rounded-lg text-left">                        {/* Mobile Category */}
                          <div className="space-y-2 px-3 py-1 text-left">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Category</p>
                            <div className="py-1 pl-1">
                              <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-[10px] font-extrabold uppercase tracking-widest select-none">
                                Base
                              </span>
                            </div>
                          </div>

                          {/* Mobile Public */}
                          <div className="space-y-2.5 border-t border-slate-100 pt-3 px-3">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-left">Public</p>
                            <div className="space-y-2.5 pl-1">
                              <a
                                href="https://www.bnxmail.com/login"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center space-x-2.5 text-slate-700 text-xs py-1 hover:text-[#004AAD] transition cursor-pointer text-left block"
                              >
                                <img src="/bnx_mail_logo.png" alt="BNX Mail" className="h-4 w-4 object-contain" />
                                <span className="font-semibold">BNX Mail</span>
                              </a>
                              <a
                                href="https://www.b2auth.com/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center space-x-2.5 text-slate-700 text-xs py-1 hover:text-[#004AAD] transition cursor-pointer text-left block"
                              >
                                <img src="/b2auth_logo.png" alt="B2Auth Security" className="h-4 w-4 object-contain" />
                                <span className="font-semibold flex items-center">
                                  B2Auth Security
                                  <span className="coming-soon-badge">Coming Soon</span>
                                </span>
                              </a>

                              <a
                                href="https://cliks.beta-softnet.com/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center space-x-2.5 text-slate-700 text-xs py-1 hover:text-[#004AAD] transition cursor-pointer text-left block"
                              >
                                <img src="/cliks_logo.png" alt="Cliks" className="h-4 w-4 object-contain" />
                                <span className="font-semibold flex items-center">
                                  Cliks
                                  <span className="coming-soon-badge">Coming Soon</span>
                                </span>
                              </a>
                            </div>
                            <div className="border-t border-slate-100 pt-2 flex justify-center">
                              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider select-none">
                                Beta ecosystem
                              </span>
                            </div>
                          </div>

                          {/* Mobile Business */}
                          <div className="space-y-2.5 border-t border-slate-100 pt-3 px-3">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-left">Business</p>
                            <div className="space-y-2.5 pl-1">
                              <a
                                href="https://www.cliksbusiness.com/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center space-x-2.5 text-slate-700 text-xs py-1 hover:text-[#004AAD] transition cursor-pointer text-left block"
                              >
                                <img src="/cliks_business_logo.png" alt="Cliks Business" className="h-4 w-4 object-contain" />
                                <span className="font-semibold">Cliks Business</span>
                              </a>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className={`block px-3 py-2 rounded-md text-base font-medium ${isActive(link.path)
                      ? 'bg-blue-50 text-[#004AAD] font-semibold'
                      : 'text-slate-700 hover:bg-slate-100 hover:text-[#004AAD]'
                      }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
              <div className="border-t border-slate-100 my-2 pt-2">
                {user ? (
                  <div className="space-y-2 px-3">
                    <div className="flex items-center space-x-3 py-2 border-b border-slate-100 mb-2">
                      <div className="h-8 w-8 rounded-full bg-[#004AAD] flex items-center justify-center text-white font-semibold select-none">
                        <User className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Account</p>
                        <p className="text-sm font-bold text-slate-800 truncate">{user.fullName || (user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : user.username)}</p>
                        {user.email && <p className="text-xs text-slate-500 truncate">{user.email}</p>}
                      </div>
                    </div>
                    <Link
                      to="/adminofcarrer"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-100 hover:text-[#004AAD]"
                    >
                      <LayoutDashboard className="h-5 w-5 text-slate-400" />
                      <span>Admin Dashboard</span>
                    </Link>
                    <button
                      onClick={() => {
                        setIsOpen(false);
                        handleLogout();
                      }}
                      className="w-full flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50 text-left border-none bg-transparent cursor-pointer"
                    >
                      <LogOut className="h-5 w-5 text-red-500" />
                      <span>Logout</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2 px-3">
                    <button
                      onClick={() => {
                        setIsOpen(false);
                        redirectToSSO(location.pathname);
                      }}
                      className="flex items-center justify-center space-x-2 w-full px-4 py-2.5 rounded-lg text-sm font-semibold bg-[#004AAD] border border-[#004AAD] text-white hover:bg-[#003882] hover:border-[#003882] transition duration-300 cursor-pointer mobile-signin-btn shadow-md shadow-blue-950/20"
                    >
                      <LogIn className="h-4 w-4 text-white" />
                      <span className="text-white">Sign In</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      {window.location.search.includes('debug_notif=true') && (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          width: '450px',
          maxHeight: '80vh',
          overflowY: 'auto',
          backgroundColor: '#1e293b',
          color: '#f8fafc',
          padding: '20px',
          borderRadius: '12px',
          boxShadow: '0 20px 25px -5px rgba(0,0,0,0.5)',
          zIndex: 99999,
          fontSize: '11px',
          fontFamily: 'monospace',
          border: '1px solid #334155',
          textAlign: 'left'
        }}>
          <h3 style={{ margin: '0 0 10px 0', borderBottom: '1px solid #334155', paddingBottom: '5px', fontSize: '13px', color: '#38bdf8' }}>
            Notification System Debug Panel
          </h3>
          <div style={{ marginBottom: '10px' }}>
            <strong>Logged In User:</strong> {JSON.stringify(user)}
          </div>
          <div style={{ marginBottom: '10px' }}>
            <strong>Resolved User Email:</strong> {debugInfo.userEmail || 'None'}
          </div>
          <div style={{ marginBottom: '10px' }}>
            <strong>Resolved Candidate ID (candId):</strong> {debugInfo.candId || 'None'}
          </div>
          <div style={{ marginBottom: '10px' }}>
            <strong>Local Applications:</strong>
            <pre style={{ margin: '5px 0 0 0', padding: '5px', backgroundColor: '#0f172a', borderRadius: '4px', overflowX: 'auto', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
              {debugInfo.localApps}
            </pre>
          </div>
          <div style={{ marginBottom: '10px' }}>
            <strong>Backend Applications:</strong>
            <pre style={{ margin: '5px 0 0 0', padding: '5px', backgroundColor: '#0f172a', borderRadius: '4px', overflowX: 'auto', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
              {debugInfo.backendApps}
            </pre>
          </div>
          <div style={{ marginBottom: '10px' }}>
            <strong>Fetched Notifications:</strong>
            <pre style={{ margin: '5px 0 0 0', padding: '5px', backgroundColor: '#0f172a', borderRadius: '4px', overflowX: 'auto', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
              {debugInfo.fetchedNotifs}
            </pre>
          </div>
          {debugInfo.error && (
            <div style={{ color: '#f87171' }}>
              <strong>Errors Encountered:</strong>
              <pre style={{ margin: '5px 0 0 0', padding: '5px', backgroundColor: '#450a0a', borderRadius: '4px', color: '#fca5a5', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                {debugInfo.error}
              </pre>
            </div>
          )}
        </div>
      )}
    </>
  );
}
