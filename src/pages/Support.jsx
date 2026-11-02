import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Search, ChevronDown, Check, Copy, Clock, Send, Shield, Activity, Download, MessageSquare, ExternalLink, HelpCircle, Code, Briefcase, FileText, CheckCircle2, AlertCircle, BookOpen, Settings, Key, Wrench, Sparkles, Award, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api';

export default function Support() {
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedText, setCopiedText] = useState('');
  const [activeFaq, setActiveFaq] = useState(null);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [product, setProduct] = useState('General Enquiry');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [feedbackMsg, setFeedbackMsg] = useState('');

  // Newsletter states
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState('idle'); // idle, loading, success, error
  const [newsletterFeedbackMsg, setNewsletterFeedbackMsg] = useState('');

  // Bottom-to-top scroll reveal with IntersectionObserver
  useEffect(() => {
    // Respect prefers-reduced-motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
      document
        .querySelectorAll('.support-reveal, .support-reveal-hero, .support-reveal-highlights, .support-reveal-card')
        .forEach((el) => {
          el.classList.add('is-visible');
        });
      return;
    }

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        } else {
          // Reset animation state when element leaves the viewport
          // so it replays smoothly when scrolled into view again
          entry.target.classList.remove('is-visible');
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, {
      threshold: 0.18, // Triggers when ~18% of the section enters the viewport
      rootMargin: '0px 0px -30px 0px',
    });

    const revealElements = document.querySelectorAll(
      '.support-reveal, .support-reveal-hero, .support-reveal-highlights'
    );
    revealElements.forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
    };
  }, []);

  const supportContactInfo = {
    phone: '+91 9444369625',
    email: 'betasoftnet2025@gmail.com',
    hours: 'Mon - Fri, 9:00 AM - 6:00 PM IST',
    address: 'Beta Towers, No. 12, Main Road, Tiruvallur, Tamil Nadu 602001, India'
  };

  const supportFaqs = [
    {
      q: 'How do I access my integrations and products?',
      a: 'Once your account is set up, navigate to the Products overview page to get API keys or click "Launch Demo App" inside Cliks Business to view your active dashboards.'
    },
    {
      q: 'Is my data secure with Beta?',
      a: 'Yes, all communication in transit is encrypted using 256-bit SSL, and stored data is fully encrypted at rest. We also support SSO and MFA through B2Auth Security.'
    },
    {
      q: 'What is the average response time for support tickets?',
      a: 'Our team maintains a strict SLA response time of under 15 minutes for all email inquiries and developer tickets, backed by our 24/7 dedicated engineering desk.'
    },
    {
      q: 'How can I submit feature requests or partner feedback?',
      a: 'We welcome suggestions and inquiries. Please use our Support Request form below, or visit our Partners portal to lodge proposals directly.'
    }
  ];

  const handleCopyText = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopiedText(type);
    setTimeout(() => {
      setCopiedText('');
    }, 2000);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    setStatus('loading');
    try {
      // Send selected product in the company field to reuse the contact message schema
      await api.post('/api/contact', {
        name,
        email,
        company: `Support Request - ${product}`,
        message
      });
      setStatus('success');
      setFeedbackMsg('Your support ticket has been lodged! Our engineering team will contact you shortly.');
      // Reset form fields
      setName('');
      setEmail('');
      setProduct('General Enquiry');
      setMessage('');
    } catch (err) {
      console.error(err);
      setStatus('error');
      setFeedbackMsg(err.response?.data?.message || 'Failed to submit request. Please try again.');
    }
  };

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    if (!newsletterEmail) return;

    setNewsletterStatus('loading');
    try {
      await api.post('/api/newsletter/subscribe', { email: newsletterEmail });
      setNewsletterStatus('success');
      setNewsletterFeedbackMsg('Successfully subscribed to updates!');
      setNewsletterEmail('');
    } catch (err) {
      console.error(err);
      setNewsletterStatus('error');
      setNewsletterFeedbackMsg(err.response?.data?.message || 'Subscription failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-transparent pb-16 relative z-10">
      {/* Scroll Reveal Animation Styles for Support Page */}
      <style>{`
        .support-reveal {
          opacity: 0;
          transform: translateY(90px) scale(0.985);
          transition: transform 800ms cubic-bezier(0.16, 1, 0.3, 1),
                      opacity 800ms cubic-bezier(0.16, 1, 0.3, 1);
          will-change: transform, opacity;
        }

        .support-reveal.is-visible {
          opacity: 1;
          transform: translateY(0) scale(1);
        }

        .support-reveal-hero {
          opacity: 0;
          transform: translateY(80px) scale(0.98);
          transition: transform 800ms cubic-bezier(0.16, 1, 0.3, 1),
                      opacity 800ms cubic-bezier(0.16, 1, 0.3, 1);
          will-change: transform, opacity;
        }

        .support-reveal-hero.is-visible {
          opacity: 1;
          transform: translateY(0) scale(1);
        }

        .support-reveal-highlights {
          opacity: 0;
          transform: translateY(100px) scale(0.98);
          transition: transform 850ms cubic-bezier(0.16, 1, 0.3, 1),
                      opacity 850ms cubic-bezier(0.16, 1, 0.3, 1);
          will-change: transform, opacity;
        }

        .support-reveal-highlights.is-visible {
          opacity: 1;
          transform: translateY(0) scale(1);
        }

        .support-reveal-card {
          opacity: 0;
          transform: translateY(80px) scale(0.98);
          transition: transform 800ms cubic-bezier(0.16, 1, 0.3, 1),
                      opacity 800ms cubic-bezier(0.16, 1, 0.3, 1);
          transition-delay: 0ms;
          will-change: transform, opacity;
        }

        .is-visible .support-reveal-card,
        .is-visible.support-reveal-card {
          opacity: 1;
          transform: translateY(0) scale(1);
          transition-delay: var(--reveal-delay, 0ms);
        }

        @media (prefers-reduced-motion: reduce) {
          .support-reveal,
          .support-reveal-hero,
          .support-reveal-highlights,
          .support-reveal-card {
            opacity: 1 !important;
            transform: none !important;
            transition: none !important;
            transition-delay: 0ms !important;
          }
        }
      `}</style>

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-tr from-[#EFF6FF] via-[#DBEAFE] to-[#BFDBFE] pt-8 pb-16 text-gray-900 text-center hero-blue-banner">
        {/* Glow grid mesh overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none opacity-40" />
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[60%] rounded-full bg-emerald-400/20 blur-[130px] pointer-events-none" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[60%] rounded-full bg-teal-400/20 blur-[130px] pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 relative z-10 space-y-6 support-reveal-hero">
          <span className="inline-block px-3 py-1 rounded-full bg-slate-100 border border-slate-300 text-xs font-bold uppercase tracking-widest text-black select-none">
            Help & Customer Desk
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight select-none text-[#0A3161]">
            How Can We Help You?
          </h1>
          <p className="text-slate-600 text-sm md:text-base max-w-xl mx-auto font-medium select-none">
            Search our knowledge base, browse core product resources, or lodge a direct developer request to our support engineering squad.
          </p>

          {/* Search bar widget */}
          <div className="max-w-xl mx-auto relative mt-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search articles, FAQs, guides..."
              className="w-full bg-white text-slate-800 placeholder-slate-400 border-none rounded-full py-3.5 pl-12 pr-6 text-sm shadow-xl focus:outline-none focus:ring-4 focus:ring-emerald-300/40 transition duration-300"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 space-y-16">
        {/* Help Center Resources Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 support-reveal">
          {/* Operational status */}
          <div
            className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-start space-x-4 support-reveal-card"
            style={{ '--reveal-delay': '0ms' }}
          >
            <div className="h-10 w-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 flex-shrink-0">
              <Activity className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">System Status</p>
              <div className="flex items-center space-x-1.5 mt-1 select-none">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-xs font-bold text-slate-800">All Systems Active</span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium mt-1">Average Latency: 42ms</p>
            </div>
          </div>

          {/* Response SLA */}
          <div
            className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-start space-x-4 support-reveal-card"
            style={{ '--reveal-delay': '100ms' }}
          >
            <div className="h-10 w-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#004AAD] flex-shrink-0">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Response SLA</p>
              <h4 className="text-xs font-bold text-slate-800 mt-1 select-none">&lt; 15 Minutes</h4>
              <p className="text-[10px] text-slate-500 font-medium mt-1">Direct support mail triage</p>
            </div>
          </div>

          {/* Documentation */}
          <div
            className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-start space-x-4 support-reveal-card"
            style={{ '--reveal-delay': '200ms' }}
          >
            <div className="h-10 w-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-650 flex-shrink-0">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Documentation</p>
              <a href="#sdk-console" className="text-xs font-bold text-[#004AAD] hover:underline flex items-center mt-1">
                <span>API References</span>
                <ExternalLink className="h-3 w-3 ml-1" />
              </a>
              <p className="text-[10px] text-slate-500 font-medium mt-1">V1.4.2 Integration docs</p>
            </div>
          </div>

          {/* Downloads */}
          <div
            className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-start space-x-4 support-reveal-card"
            style={{ '--reveal-delay': '300ms' }}
          >
            <div className="h-10 w-10 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 flex-shrink-0">
              <Download className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">App Clients</p>
              <Link to="#" className="text-xs font-bold text-[#004AAD] hover:underline flex items-center mt-1">
                <span>Downloads Portal</span>
                <ExternalLink className="h-3 w-3 ml-1" />
              </Link>
              <p className="text-[10px] text-slate-500 font-medium mt-1">Desktop & mobile packages</p>
            </div>
          </div>
        </div>

        {/* Support Highlights */}
        <div className="space-y-6 bg-slate-50/60 border border-slate-200/60 p-8 rounded-3xl text-left support-reveal-highlights">
          <div className="space-y-1">
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Support Highlights</h2>
            <p className="text-xs text-slate-500 font-semibold">Discover what makes our customer support reliable, responsive, and customer-focused.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mt-6">
            {/* Fast Response */}
            <div
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between hover:shadow-md transition duration-300 support-reveal-card"
              style={{ '--reveal-delay': '0ms' }}
            >
              <div className="space-y-3">
                <div className="h-9 w-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#004AAD]">
                  <Clock className="h-4.5 w-4.5" />
                </div>
                <h4 className="text-xs font-bold text-slate-800">Fast Response</h4>
                <p className="text-[10px] text-slate-555 leading-relaxed font-semibold">
                  Quick assistance for your product and technical queries.
                </p>
              </div>
            </div>

            {/* Expert Assistance */}
            <div
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between hover:shadow-md transition duration-300 support-reveal-card"
              style={{ '--reveal-delay': '80ms' }}
            >
              <div className="space-y-3">
                <div className="h-9 w-9 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
                  <Award className="h-4.5 w-4.5" />
                </div>
                <h4 className="text-xs font-bold text-slate-800">Expert Assistance</h4>
                <p className="text-[10px] text-slate-555 leading-relaxed font-semibold">
                  Get help from our experienced support team.
                </p>
              </div>
            </div>

            {/* Personalized Support */}
            <div
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between hover:shadow-md transition duration-300 support-reveal-card"
              style={{ '--reveal-delay': '160ms' }}
            >
              <div className="space-y-3">
                <div className="h-9 w-9 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-650">
                  <Sparkles className="h-4.5 w-4.5" />
                </div>
                <h4 className="text-xs font-bold text-slate-800">Personalized Support</h4>
                <p className="text-[10px] text-slate-555 leading-relaxed font-semibold">
                  Solutions tailored to your specific requirements.
                </p>
              </div>
            </div>

            {/* Reliable Service */}
            <div
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between hover:shadow-md transition duration-300 support-reveal-card"
              style={{ '--reveal-delay': '240ms' }}
            >
              <div className="space-y-3">
                <div className="h-9 w-9 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                  <Shield className="h-4.5 w-4.5" />
                </div>
                <h4 className="text-xs font-bold text-slate-800">Reliable Service</h4>
                <p className="text-[10px] text-slate-555 leading-relaxed font-semibold">
                  Consistent and dependable support you can trust.
                </p>
              </div>
            </div>

            {/* Customer First */}
            <div
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between hover:shadow-md transition duration-300 support-reveal-card"
              style={{ '--reveal-delay': '320ms' }}
            >
              <div className="space-y-3">
                <div className="h-9 w-9 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600">
                  <MessageSquare className="h-4.5 w-4.5" />
                </div>
                <h4 className="text-xs font-bold text-slate-800">Customer First</h4>
                <p className="text-[10px] text-slate-555 leading-relaxed font-semibold">
                  We prioritize your satisfaction and success.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Care Center */}
        <div className="space-y-6 support-reveal">
          <div className="text-left space-y-1.5 support-reveal-card" style={{ '--reveal-delay': '0ms' }}>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Customer Care Center</h2>
            <p className="text-sm text-slate-500">Your central hub for guidance, assistance, and resources to help you get the best experience with every Beta Softnet product.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
            {/* Product Assistance */}
            <div
              className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition duration-300 flex flex-col justify-between support-reveal-card"
              style={{ '--reveal-delay': '60ms' }}
            >
              <div className="space-y-3">
                <div className="h-10 w-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#004AAD]">
                  <BookOpen className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-slate-800 text-sm">Product Assistance</h3>
                <p className="text-xs text-slate-550 leading-relaxed font-medium">
                  Get help with product features, setup, and usage.
                </p>
              </div>
            </div>

            {/* Account Help */}
            <div
              className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition duration-300 flex flex-col justify-between support-reveal-card"
              style={{ '--reveal-delay': '120ms' }}
            >
              <div className="space-y-3">
                <div className="h-10 w-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-650">
                  <FileText className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-slate-800 text-sm">Account Help</h3>
                <p className="text-xs text-slate-550 leading-relaxed font-medium">
                  Manage your account, profile, and security settings with ease.
                </p>
              </div>
            </div>

            {/* Security Center */}
            <div
              className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition duration-300 flex flex-col justify-between support-reveal-card"
              style={{ '--reveal-delay': '180ms' }}
            >
              <div className="space-y-3">
                <div className="h-10 w-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
                  <Settings className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-slate-800 text-sm">Security Center</h3>
                <p className="text-xs text-slate-550 leading-relaxed font-medium">
                  Learn best practices to keep your account and data protected.
                </p>
              </div>
            </div>

            {/* Feature Discovery */}
            <div
              className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition duration-300 flex flex-col justify-between support-reveal-card"
              style={{ '--reveal-delay': '240ms' }}
            >
              <div className="space-y-3">
                <div className="h-10 w-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                  <Shield className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-slate-800 text-sm">Feature Discovery</h3>
                <p className="text-xs text-slate-555 leading-relaxed font-semibold">
                  Explore product capabilities and make the most of every feature.
                </p>
              </div>
            </div>

            {/* Product Updates */}
            <div
              className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition duration-300 flex flex-col justify-between support-reveal-card"
              style={{ '--reveal-delay': '300ms' }}
            >
              <div className="space-y-3">
                <div className="h-10 w-10 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600">
                  <HelpCircle className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-slate-800 text-sm">Product Updates</h3>
                <p className="text-xs text-slate-555 leading-relaxed font-semibold">
                  Stay informed about the latest improvements and new releases.
                </p>
              </div>
            </div>

            {/* Technical Guidance */}
            <div
              className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition duration-300 flex flex-col justify-between support-reveal-card"
              style={{ '--reveal-delay': '360ms' }}
            >
              <div className="space-y-3">
                <div className="h-10 w-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-650">
                  <Sparkles className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-slate-800 text-sm">Technical Guidance</h3>
                <p className="text-xs text-slate-550 leading-relaxed font-medium">
                  Access expert guidance for troubleshooting and technical questions.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Product Support Section */}
        <div className="space-y-6 bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-100 border border-blue-200/40 p-8 rounded-3xl shadow-sm support-reveal">
          <div className="text-left space-y-1.5 support-reveal-card" style={{ '--reveal-delay': '0ms' }}>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Ecosystem Product Support</h2>
            <p className="text-sm text-slate-955 font-semibold">Guides, diagnostic links, and configuration standards for our primary suites.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 1. BNX Mail Card */}
            <div
              className="relative overflow-hidden group bg-white rounded-3xl border border-slate-200 hover:border-blue-400/80 shadow-sm hover:shadow-[0_16px_36px_rgba(56,189,248,0.18)] p-6 space-y-4 flex flex-col justify-between transition-all duration-400 ease-out support-reveal-card"
              style={{ '--reveal-delay': '100ms' }}
            >
              {/* Soft text protection overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent pointer-events-none z-[1] opacity-0 group-hover:opacity-75 transition-opacity duration-300" />

              {/* Hover Background Illustration: Mail/Email Theme */}
              <div className="absolute -top-3 -right-3 w-56 h-48 pointer-events-none z-0 opacity-0 group-hover:opacity-100 translate-x-3 group-hover:translate-x-0 scale-95 group-hover:scale-100 transition-all duration-400 ease-out select-none">
                <svg viewBox="0 0 240 200" fill="none" className="w-full h-full">
                  <defs>
                    <linearGradient id="mailEnvGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
                      <stop offset="60%" stopColor="#E0F2FE" stopOpacity="0.9" />
                      <stop offset="100%" stopColor="#BAE6FD" stopOpacity="0.85" />
                    </linearGradient>
                    <linearGradient id="mailFlapGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#F0F9FF" stopOpacity="0.98" />
                      <stop offset="100%" stopColor="#7DD3FC" stopOpacity="0.75" />
                    </linearGradient>
                    <linearGradient id="mailShadowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#0284C7" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#0284C7" stopOpacity="0.05" />
                    </linearGradient>
                    <filter id="mailBloom" x="-30%" y="-30%" width="160%" height="160%">
                      <feGaussianBlur stdDeviation="8" result="blur" />
                      <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>

                  {/* Ambient radial glow */}
                  <circle cx="160" cy="85" r="75" fill="rgba(56, 189, 248, 0.22)" filter="url(#mailBloom)" />
                  <circle cx="170" cy="75" r="45" fill="rgba(255, 255, 255, 0.6)" filter="url(#mailBloom)" />

                  {/* Small floating envelope (Top left) */}
                  <g transform="translate(65, 30) rotate(-14) scale(0.42)" opacity="0.85">
                    <rect x="0" y="0" width="80" height="54" rx="8" fill="url(#mailEnvGrad)" stroke="#7DD3FC" strokeWidth="1.5" />
                    <path d="M 0 0 L 40 32 L 80 0" fill="none" stroke="#38BDF8" strokeWidth="2" strokeLinejoin="round" />
                    <path d="M 0 54 L 32 26" stroke="#93C5FD" strokeWidth="1.2" />
                    <path d="M 80 54 L 48 26" stroke="#93C5FD" strokeWidth="1.2" />
                  </g>

                  {/* Small floating envelope (Bottom right) */}
                  <g transform="translate(180, 115) rotate(16) scale(0.38)" opacity="0.75">
                    <rect x="0" y="0" width="80" height="54" rx="8" fill="url(#mailEnvGrad)" stroke="#7DD3FC" strokeWidth="1.5" />
                    <path d="M 0 0 L 40 32 L 80 0" fill="none" stroke="#38BDF8" strokeWidth="2" strokeLinejoin="round" />
                  </g>

                  {/* Main Large 3D Envelope */}
                  <g transform="translate(115, 35) rotate(-8) scale(1.15)">
                    {/* Soft drop shadow */}
                    <rect x="4" y="6" width="96" height="66" rx="10" fill="url(#mailShadowGrad)" />
                    {/* Envelope Base Body */}
                    <rect x="0" y="0" width="96" height="66" rx="10" fill="url(#mailEnvGrad)" stroke="#BAE6FD" strokeWidth="1.5" />
                    {/* Side folding lines */}
                    <path d="M 0 66 L 38 34" stroke="#7DD3FC" strokeWidth="1.2" strokeOpacity="0.7" />
                    <path d="M 96 66 L 58 34" stroke="#7DD3FC" strokeWidth="1.2" strokeOpacity="0.7" />
                    {/* Envelope Top V-Flap */}
                    <polygon points="0,0 48,40 96,0" fill="url(#mailFlapGrad)" stroke="#60A5FA" strokeWidth="1.6" strokeLinejoin="round" strokeOpacity="0.8" />
                  </g>

                  {/* Sparkle star dots */}
                  <circle cx="195" cy="30" r="2" fill="#38BDF8" opacity="0.9" />
                  <circle cx="105" cy="22" r="1.5" fill="#60A5FA" opacity="0.8" />
                  <circle cx="110" cy="85" r="1.5" fill="#38BDF8" opacity="0.7" />
                </svg>
              </div>

              {/* Card Content (relative z-10) */}
              <div className="relative z-10 space-y-3">
                <div className="h-12 w-12 flex-shrink-0 flex items-center justify-center">
                  <img src="/bnx_mail_logo.png" alt="BNX Mail" className="h-full w-full object-contain" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-extrabold text-slate-800 text-sm tracking-wide uppercase">BNXmail</h3>
                    <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-600 border border-blue-100 text-[8px] font-bold uppercase tracking-wider">Product Support</span>
                  </div>
                  <p className="text-xs text-slate-400 font-semibold mt-1">Shared Inbox & SMTP setup</p>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                  Integrate shared SMTP configurations or handle multi-agent mail delegation safely. Requires client certificate auth credentials.
                </p>
              </div>

              {/* Bottom Link with styled round arrow */}
              <div className="relative z-10 border-t border-slate-100 pt-4 flex items-center justify-between">
                <span className="text-xs font-bold text-[#004AAD] group-hover:text-[#1746FF] transition-colors select-none">
                  View SMTP/IMAP Setup Guide
                </span>
                <div className="w-8 h-8 rounded-full border-[1.5px] border-[#1746FF] flex items-center justify-center text-[#1746FF] bg-white group-hover:scale-105 transition-transform duration-300 shadow-xs relative flex-shrink-0">
                  <div className="absolute top-0.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#1746FF]" />
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform duration-300" />
                </div>
              </div>
            </div>

            {/* 2. B2Auth Security Card */}
            <div
              className="relative overflow-hidden group bg-white rounded-3xl border border-slate-200 hover:border-blue-400/80 shadow-sm hover:shadow-[0_16px_36px_rgba(56,189,248,0.18)] p-6 space-y-4 flex flex-col justify-between transition-all duration-400 ease-out support-reveal-card"
              style={{ '--reveal-delay': '200ms' }}
            >
              {/* Soft text protection overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent pointer-events-none z-[1] opacity-0 group-hover:opacity-75 transition-opacity duration-300" />

              {/* Hover Background Illustration: Cybersecurity Theme */}
              <div className="absolute -top-3 -right-3 w-56 h-48 pointer-events-none z-0 opacity-0 group-hover:opacity-100 translate-x-3 group-hover:translate-x-0 scale-95 group-hover:scale-100 transition-all duration-400 ease-out select-none">
                <svg viewBox="0 0 240 200" fill="none" className="w-full h-full">
                  <defs>
                    <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
                      <stop offset="50%" stopColor="#BAE6FD" stopOpacity="0.85" />
                      <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.75" />
                    </linearGradient>
                    <linearGradient id="shieldInnerGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#E0F2FE" stopOpacity="0.9" />
                      <stop offset="100%" stopColor="#0284C7" stopOpacity="0.7" />
                    </linearGradient>
                    <linearGradient id="lockBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.98" />
                      <stop offset="100%" stopColor="#F0F9FF" stopOpacity="0.9" />
                    </linearGradient>
                    <filter id="shieldBloom" x="-30%" y="-30%" width="160%" height="160%">
                      <feGaussianBlur stdDeviation="9" result="blur" />
                      <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>

                  {/* Ambient radial glow */}
                  <circle cx="165" cy="85" r="75" fill="rgba(56, 189, 248, 0.22)" filter="url(#shieldBloom)" />
                  <circle cx="165" cy="85" r="45" fill="rgba(255, 255, 255, 0.6)" filter="url(#shieldBloom)" />

                  {/* Security Circuit Ring Arc */}
                  <circle cx="165" cy="85" r="62" stroke="#7DD3FC" strokeWidth="1" strokeDasharray="4 6" strokeOpacity="0.6" />
                  <circle cx="165" cy="85" r="78" stroke="#38BDF8" strokeWidth="0.8" strokeDasharray="3 8" strokeOpacity="0.4" />

                  {/* Main Glowing Shield Container */}
                  <g transform="translate(130, 28) scale(1.15)">
                    {/* Outer Shield Plate */}
                    <path
                      d="M 30 0 C 46 8, 56 12, 60 16 C 60 44, 48 70, 30 84 C 12 70, 0 44, 0 16 C 4 12, 14 8, 30 0 Z"
                      fill="url(#shieldGrad)"
                      stroke="#7DD3FC"
                      strokeWidth="1.5"
                    />
                    {/* Inner Shield Plate */}
                    <path
                      d="M 30 6 C 43 13, 50 16, 54 20 C 54 42, 43 64, 30 76 C 17 64, 6 42, 6 20 C 10 16, 17 13, 30 6 Z"
                      fill="url(#shieldInnerGrad)"
                      opacity="0.8"
                    />

                    {/* Centered White Padlock */}
                    <path
                      d="M 23 38 L 23 30 C 23 26, 37 26, 37 30 L 37 38"
                      stroke="#FFFFFF"
                      strokeWidth="3.2"
                      strokeLinecap="round"
                      fill="none"
                    />
                    <rect x="18" y="36" width="24" height="20" rx="4" fill="url(#lockBodyGrad)" stroke="#BAE6FD" strokeWidth="1.2" />
                    <circle cx="30" cy="44" r="2.2" fill="#0284C7" />
                    <path d="M 30 44 L 30 50" stroke="#0284C7" strokeWidth="1.5" strokeLinecap="round" />
                  </g>

                  {/* Sparkle dots */}
                  <circle cx="115" cy="40" r="1.8" fill="#38BDF8" opacity="0.8" />
                  <circle cx="210" cy="65" r="1.5" fill="#60A5FA" opacity="0.8" />
                  <circle cx="125" cy="115" r="1.5" fill="#7DD3FC" opacity="0.7" />
                </svg>
              </div>

              {/* Card Content (relative z-10) */}
              <div className="relative z-10 space-y-3">
                <div className="h-12 w-12 flex-shrink-0 flex items-center justify-center">
                  <img src="/b2auth_logo.png" alt="B2Auth Security" className="h-full w-full object-contain" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-extrabold text-slate-800 text-sm tracking-wide uppercase">B2AUTH SECURITY</h3>
                    <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-600 border border-blue-100 text-[8px] font-bold uppercase tracking-wider">Product Support</span>
                  </div>
                  <p className="text-xs text-slate-400 font-semibold mt-1">MFA & Single Sign-On gateways</p>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                  Configure active directory synchronization, OAuth 2.1 authentication servers, and multi-factor token credentials for corporate teams.
                </p>
              </div>

              {/* Bottom Link with styled round arrow */}
              <div className="relative z-10 border-t border-slate-100 pt-4 flex items-center justify-between">
                <span className="text-xs font-bold text-[#004AAD] group-hover:text-[#1746FF] transition-colors select-none">
                  Open Gateway OAuth Specs
                </span>
                <div className="w-8 h-8 rounded-full border-[1.5px] border-[#1746FF] flex items-center justify-center text-[#1746FF] bg-white group-hover:scale-105 transition-transform duration-300 shadow-xs relative flex-shrink-0">
                  <div className="absolute top-0.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#1746FF]" />
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform duration-300" />
                </div>
              </div>
            </div>

            {/* 3. Cliks Business Card */}
            <div
              className="relative overflow-hidden group bg-white rounded-3xl border border-slate-200 hover:border-emerald-400/80 shadow-sm hover:shadow-[0_16px_36px_rgba(16,185,129,0.18)] p-6 space-y-4 flex flex-col justify-between transition-all duration-400 ease-out support-reveal-card"
              style={{ '--reveal-delay': '300ms' }}
            >
              {/* Soft text protection overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent pointer-events-none z-[1] opacity-0 group-hover:opacity-75 transition-opacity duration-300" />

              {/* Hover Background Illustration: Business/Accounting Theme */}
              <div className="absolute -top-3 -right-3 w-56 h-48 pointer-events-none z-0 opacity-0 group-hover:opacity-100 translate-x-3 group-hover:translate-x-0 scale-95 group-hover:scale-100 transition-all duration-400 ease-out select-none">
                <svg viewBox="0 0 240 200" fill="none" className="w-full h-full">
                  <defs>
                    <linearGradient id="barGrad1" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#A7F3D0" stopOpacity="0.95" />
                      <stop offset="100%" stopColor="#6EE7B7" stopOpacity="0.75" />
                    </linearGradient>
                    <linearGradient id="barGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#6EE7B7" stopOpacity="0.95" />
                      <stop offset="100%" stopColor="#34D399" stopOpacity="0.8" />
                    </linearGradient>
                    <linearGradient id="barGrad3" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#34D399" stopOpacity="0.95" />
                      <stop offset="100%" stopColor="#10B981" stopOpacity="0.85" />
                    </linearGradient>
                    <linearGradient id="barGrad4" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#10B981" stopOpacity="0.95" />
                      <stop offset="100%" stopColor="#059669" stopOpacity="0.9" />
                    </linearGradient>
                    <linearGradient id="coinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
                      <stop offset="60%" stopColor="#D1FAE5" stopOpacity="0.9" />
                      <stop offset="100%" stopColor="#A7F3D0" stopOpacity="0.8" />
                    </linearGradient>
                    <filter id="businessBloom" x="-30%" y="-30%" width="160%" height="160%">
                      <feGaussianBlur stdDeviation="8" result="blur" />
                      <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>

                  {/* Ambient radial glow */}
                  <circle cx="165" cy="85" r="75" fill="rgba(52, 211, 153, 0.2)" filter="url(#businessBloom)" />
                  <circle cx="165" cy="85" r="45" fill="rgba(255, 255, 255, 0.6)" filter="url(#businessBloom)" />

                  <g transform="translate(100, 30) scale(1.15)">
                    {/* Floating Invoice / Document (behind bars) */}
                    <g transform="translate(42, 6) rotate(6)" opacity="0.6">
                      <rect x="0" y="0" width="36" height="48" rx="4" fill="#FFFFFF" stroke="#A7F3D0" strokeWidth="1" />
                      <line x1="6" y1="10" x2="24" y2="10" stroke="#6EE7B7" strokeWidth="1.5" strokeLinecap="round" />
                      <line x1="6" y1="16" x2="30" y2="16" stroke="#A7F3D0" strokeWidth="1.2" strokeLinecap="round" />
                      <line x1="6" y1="22" x2="20" y2="22" stroke="#A7F3D0" strokeWidth="1.2" strokeLinecap="round" />
                    </g>

                    {/* Rising Bar Chart (4 Steps) */}
                    <rect x="10" y="52" width="10" height="24" rx="2" fill="url(#barGrad1)" stroke="#A7F3D0" strokeWidth="0.8" />
                    <rect x="24" y="38" width="10" height="38" rx="2" fill="url(#barGrad2)" stroke="#6EE7B7" strokeWidth="0.8" />
                    <rect x="38" y="24" width="10" height="52" rx="2" fill="url(#barGrad3)" stroke="#34D399" strokeWidth="0.8" />
                    <rect x="52" y="10" width="10" height="66" rx="2" fill="url(#barGrad4)" stroke="#10B981" strokeWidth="0.8" />

                    {/* Upward Growth Trend Arrow */}
                    <path
                      d="M 6 62 Q 30 36 68 8"
                      stroke="#10B981"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      fill="none"
                    />
                    {/* Arrowhead */}
                    <polygon points="68,4 72,14 62,10" fill="#10B981" />

                    {/* Stacked Coins at base (bottom right) */}
                    <g transform="translate(56, 56) scale(0.9)">
                      <ellipse cx="14" cy="20" rx="12" ry="5.5" fill="url(#coinGrad)" stroke="#34D399" strokeWidth="0.8" />
                      <ellipse cx="14" cy="18" rx="12" ry="5.5" fill="#A7F3D0" opacity="0.4" />
                      <ellipse cx="14" cy="14" rx="12" ry="5.5" fill="url(#coinGrad)" stroke="#34D399" strokeWidth="0.8" />
                      <ellipse cx="14" cy="12" rx="12" ry="5.5" fill="#A7F3D0" opacity="0.4" />
                      <ellipse cx="14" cy="8" rx="12" ry="5.5" fill="url(#coinGrad)" stroke="#34D399" strokeWidth="0.8" />
                    </g>
                  </g>

                  {/* Sparkle dots */}
                  <circle cx="100" cy="50" r="1.5" fill="#34D399" opacity="0.8" />
                  <circle cx="210" cy="35" r="2" fill="#10B981" opacity="0.85" />
                  <circle cx="195" cy="100" r="1.5" fill="#6EE7B7" opacity="0.7" />
                </svg>
              </div>

              {/* Card Content (relative z-10) */}
              <div className="relative z-10 space-y-3">
                <div className="h-12 w-12 flex-shrink-0 flex items-center justify-center">
                  <img src="/cliks_business_logo.png" alt="Cliks Business" className="h-full w-full object-contain" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-extrabold text-slate-800 text-sm tracking-wide uppercase">CLIKS BUSINESS</h3>
                    <span className="px-2 py-0.5 rounded bg-purple-50 text-purple-650 border border-purple-100 text-[8px] font-extrabold uppercase tracking-wider">Product Support</span>
                  </div>
                  <p className="text-xs text-slate-400 font-semibold mt-1">Team accounting & invoicing</p>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                  Track transactions, invoice templates, and tax audit logs. Contact support if GST calculators require localized rate adjustments.
                </p>
              </div>

              {/* Bottom Link with styled round arrow */}
              <div className="relative z-10 border-t border-slate-100 pt-4 flex items-center justify-between">
                <span className="text-xs font-bold text-[#004AAD] group-hover:text-[#1746FF] transition-colors select-none">
                  Launch Invoicing Manuals
                </span>
                <div className="w-8 h-8 rounded-full border-[1.5px] border-[#1746FF] flex items-center justify-center text-[#1746FF] bg-white group-hover:scale-105 transition-transform duration-300 shadow-xs relative flex-shrink-0">
                  <div className="absolute bottom-0.5 left-1.5 w-1.5 h-1.5 rounded-full bg-[#1746FF]" />
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform duration-300" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Two-Column Grid: Contacts (Left) vs Support Request Form (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Side: Contact Channels & Address */}
          <div className="lg:col-span-5 space-y-6 text-left support-reveal">
            <div className="space-y-1.5 support-reveal-card" style={{ '--reveal-delay': '0ms' }}>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Get in Touch Directly</h2>
              <p className="text-sm text-slate-500">Reach out through standard channels for immediate billing or operational assistance.</p>
            </div>

            <div className="space-y-4">
              {/* Phone Channel */}
              <div
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative group hover:border-[#004AAD]/20 transition duration-300 support-reveal-card"
                style={{ '--reveal-delay': '60ms' }}
              >
                <div className="flex items-center space-x-2 mb-2">
                  <Phone className="h-4.5 w-4.5 text-slate-500" />
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Phone Hotline</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold text-slate-800 select-all">{supportContactInfo.phone}</span>
                  <button
                    type="button"
                    onClick={() => handleCopyText(supportContactInfo.phone, 'phone')}
                    className="text-slate-400 hover:text-[#004AAD] transition cursor-pointer"
                    title="Copy hotline number"
                  >
                    {copiedText === 'phone' ? (
                      <Check className="h-4.5 w-4.5 text-emerald-655 animate-fadeIn" />
                    ) : (
                      <Copy className="h-4.5 w-4.5" />
                    )}
                  </button>
                </div>
                {copiedText === 'phone' && (
                  <span className="absolute -top-2 right-2 px-2.5 py-0.5 rounded bg-emerald-650 text-white text-[8px] font-bold uppercase tracking-widest animate-fadeIn select-none">Copied!</span>
                )}
              </div>

              {/* Email Channel */}
              <div
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative group hover:border-[#004AAD]/20 transition duration-300 support-reveal-card"
                style={{ '--reveal-delay': '120ms' }}
              >
                <div className="flex items-center space-x-2 mb-2">
                  <Mail className="h-4.5 w-4.5 text-slate-500" />
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Email Address</span>
                </div>
                <div className="flex items-center justify-between">
                  <a href={`mailto:${supportContactInfo.email}`} className="text-base font-bold text-[#004AAD] hover:underline truncate mr-2">
                    {supportContactInfo.email}
                  </a>
                  <button
                    type="button"
                    onClick={() => handleCopyText(supportContactInfo.email, 'email')}
                    className="text-slate-400 hover:text-[#004AAD] transition cursor-pointer"
                    title="Copy support email"
                  >
                    {copiedText === 'email' ? (
                      <Check className="h-4.5 w-4.5 text-emerald-655 animate-fadeIn" />
                    ) : (
                      <Copy className="h-4.5 w-4.5" />
                    )}
                  </button>
                </div>
                {copiedText === 'email' && (
                  <span className="absolute -top-2 right-2 px-2.5 py-0.5 rounded bg-emerald-650 text-white text-[8px] font-bold uppercase tracking-widest animate-fadeIn select-none">Copied!</span>
                )}
              </div>

              {/* Address HQ Channel */}
              <div
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-[#004AAD]/10 transition duration-300 flex items-start space-x-3 support-reveal-card"
                style={{ '--reveal-delay': '180ms' }}
              >
                <MapPin className="h-5 w-5 text-slate-400 mt-0.5 flex-shrink-0" />
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Corporate HQ</span>
                  <p className="text-xs text-slate-700 leading-relaxed font-semibold">{supportContactInfo.address}</p>
                </div>
              </div>

              {/* Operation Hours Card */}
              <div
                className="bg-slate-105 p-4 border border-slate-200 rounded-2xl flex items-center space-x-3 select-none support-reveal-card"
                style={{ '--reveal-delay': '240ms' }}
              >
                <Clock className="h-5 w-5 text-slate-500 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Support Business Hours</p>
                  <p className="text-[11px] font-bold text-slate-755 truncate">{supportContactInfo.hours}</p>
                </div>
              </div>

              {/* Feature Request Card */}
              <div
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative group hover:border-[#004AAD]/20 transition duration-300 space-y-4 support-reveal-card"
                style={{ '--reveal-delay': '300ms' }}
              >
                <div className="flex items-center space-x-2">
                  <Sparkles className="h-4.5 w-4.5 text-amber-500" />
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Feature Request</span>
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-extrabold text-slate-800">Have a Feature Idea?</h4>
                  <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                    We'd love to hear your suggestions! Help us shape the future of our communication, security, and team tools by submitting your product concept ideas.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setProduct('General Enquiry');
                    setMessage('Feature Request Details:\n\n- Proposed Idea:\n- Use Case / Business value:');
                    const element = document.getElementById('support-form-card');
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="w-full flex items-center justify-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2 rounded-xl text-xs transition duration-200 cursor-pointer border-none"
                >
                  <Send className="h-3.5 w-3.5 text-slate-750" />
                  <span className="text-slate-750">Submit Idea</span>
                </button>
              </div>

              {/* Follow Us Card */}
              <div
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-[#004AAD]/10 transition duration-300 space-y-3 support-reveal-card"
                style={{ '--reveal-delay': '360ms' }}
              >
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Follow Us</span>
                <div className="flex space-x-4 pt-1 justify-start">
                  <a
                    href="https://www.instagram.com/beta_softnet/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-transparent p-0 border-none outline-none hover:opacity-85 transition-opacity inline-flex items-center justify-center"
                  >
                    <img src="/instagram.png" alt="Instagram" className="h-6 w-6 object-contain bg-transparent border-none" />
                  </a>
                  <a
                    href="https://www.linkedin.com/in/balajir4619/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-transparent p-0 border-none outline-none hover:opacity-85 transition-opacity inline-flex items-center justify-center"
                  >
                    <img src="/linkedin.png" alt="LinkedIn" className="h-6 w-6 object-contain bg-transparent border-none" />
                  </a>
                  <a
                    href="https://x.com/BETA_SOFTNET"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-transparent p-0 border-none outline-none hover:opacity-85 transition-opacity inline-flex items-center justify-center"
                  >
                    <img src="/twitter.png" alt="X" className="h-6 w-6 object-contain bg-transparent border-none" style={{ mixBlendMode: 'multiply' }} />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Request Submission Form */}
          <div className="lg:col-span-7 text-left support-reveal" id="support-form-card" style={{ '--reveal-delay': '120ms' }}>
            <div className="bg-white rounded-3xl border border-slate-200 shadow-lg p-6 sm:p-8 relative support-reveal-card" style={{ '--reveal-delay': '100ms' }}>
              <div className="mb-6 space-y-1">
                <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">Submit a Support Request</h3>
                <p className="text-xs text-slate-500">Fill in critical details and our engineers will coordinate resolving diagnostics.</p>
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-5">
                {/* Two Column Name & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Your Name</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Jane Doe"
                      className="w-full bg-slate-50 text-slate-900 border border-slate-200 rounded-xl py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#004AAD]/20 focus:border-[#004AAD] text-sm transition"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Email Address</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="jane@company.com"
                      className="w-full bg-slate-50 text-slate-900 border border-slate-200 rounded-xl py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#004AAD]/20 focus:border-[#004AAD] text-sm transition"
                    />
                  </div>
                </div>

                {/* Product Dropdown Selector */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Select Product</label>
                  <div className="relative">
                    <select
                      value={product}
                      onChange={(e) => setProduct(e.target.value)}
                      className="w-full bg-slate-50 text-slate-900 border border-slate-200 rounded-xl py-2 px-3 pr-10 focus:outline-none focus:ring-2 focus:ring-[#004AAD]/20 focus:border-[#004AAD] text-sm transition appearance-none cursor-pointer"
                    >
                      <option value="BNX Mail">BNX Mail</option>
                      <option value="B2Auth Security">B2Auth Security</option>
                      <option value="Cliks Business">Cliks Business</option>
                      <option value="General Enquiry">General Inquiry</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                {/* Message Textarea */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Explain Issue / Request Details</label>
                  <textarea
                    required
                    rows="4"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Describe exactly what you were doing, error codes, logs..."
                    className="w-full bg-slate-50 text-slate-900 border border-slate-200 rounded-xl py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#004AAD]/20 focus:border-[#004AAD] text-sm transition"
                  />
                </div>

                {/* Submission button & status messages */}
                <div className="space-y-4">
                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="w-full flex items-center justify-center space-x-2 bg-[#004AAD] hover:bg-[#003882] text-white font-bold py-2.5 rounded-xl transition duration-300 cursor-pointer shadow-md shadow-blue-950/20 disabled:bg-slate-400 disabled:cursor-not-allowed text-sm uppercase tracking-wider"
                  >
                    {status === 'loading' ? (
                      <span className="h-4.5 w-4.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Send className="h-4 w-4 text-white" />
                        <span className="text-white">Submit Ticket</span>
                      </>
                    )}
                  </button>

                  <AnimatePresence>
                    {status === 'success' && (
                      <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="flex items-start space-x-2 p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-700 text-xs font-semibold leading-relaxed"
                      >
                        <CheckCircle2 className="h-4.5 w-4.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{feedbackMsg}</span>
                      </motion.div>
                    )}

                    {status === 'error' && (
                      <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="flex items-start space-x-2 p-3 bg-rose-50 border border-rose-100 rounded-xl text-rose-700 text-xs font-semibold leading-relaxed"
                      >
                        <AlertCircle className="h-4.5 w-4.5 text-rose-600 shrink-0 mt-0.5" />
                        <span>{feedbackMsg}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Business Enquiries Callout Banner */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between text-left gap-6 shadow-sm support-reveal">
          <div className="flex items-start space-x-4 min-w-0">
            <div className="h-12 w-12 rounded-2xl bg-white border border-blue-200 flex items-center justify-center text-blue-600 shrink-0 shadow-sm">
              <Briefcase className="h-6 w-6" />
            </div>
            <div className="space-y-1 max-w-2xl">
              <h4 className="text-base font-extrabold text-slate-800">Business & Enterprise Enquiries</h4>
              <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                Looking for localized volume licensing, private cloud deployments, or custom strategic agreements? Connect directly with our enterprise alliances division.
              </p>
            </div>
          </div>
          <Link
            to="/partners"
            className="bg-[#004AAD] hover:bg-[#003882] !text-white text-xs font-bold uppercase tracking-wider px-5 py-3 rounded-full transition duration-300 shadow-md shadow-blue-950/10 shrink-0 cursor-pointer text-center w-full md:w-auto"
          >
            Connect with Partner Desk
          </Link>
        </div>

        {/* Technical Support SDK Code Console */}
        <div id="sdk-console" className="space-y-6 support-reveal">
          <div className="text-left space-y-1.5 support-reveal-card" style={{ '--reveal-delay': '0ms' }}>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Developer Technical Support</h2>
            <p className="text-sm text-slate-500">Initialize our corporate authentication and group mail modules directly inside your terminal.</p>
          </div>

          <div
            className="relative bg-white rounded-3xl border border-[#D6E4F6] overflow-hidden shadow-[0_12px_40px_rgba(37,99,235,0.08)] text-left font-mono text-xs support-reveal-card"
            style={{ '--reveal-delay': '120ms' }}
          >
            {/* Top Editor Bar */}
            <div className="bg-white border-b border-slate-100 px-6 py-4 flex flex-wrap items-center justify-between gap-2 select-none relative z-10">
              <div className="flex items-center space-x-2.5">
                <Code className="h-4 w-4 text-[#1746FF]" />
                <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider font-mono">Beta Javascript Node-SDK</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="h-2.5 w-2.5 rounded-full bg-[#EF4444]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#F59E0B]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#10B981]" />
              </div>
            </div>

            {/* Code Body & Right Decorative Illustration */}
            <div className="relative p-6 md:p-8 overflow-hidden">
              {/* Minimal Developer-Themed Design (Right side background only, strictly behind code) */}
              <div className="absolute right-2 sm:right-6 md:right-10 top-1/2 -translate-y-1/2 pointer-events-none z-0 hidden sm:block select-none overflow-visible w-[340px] md:w-[380px] h-[260px]">
                <svg viewBox="0 0 380 260" fill="none" className="w-full h-full">
                  <defs>
                    <linearGradient id="devWindowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#FFFFFF" />
                      <stop offset="100%" stopColor="#F0F7FF" />
                    </linearGradient>
                    <linearGradient id="devHeaderGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#93C5FD" />
                      <stop offset="100%" stopColor="#BFDBFE" />
                    </linearGradient>
                    <linearGradient id="devShadowGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#1E40AF" stopOpacity="0.10" />
                      <stop offset="100%" stopColor="#1E40AF" stopOpacity="0.02" />
                    </linearGradient>
                    <filter id="devGlow" x="-30%" y="-30%" width="160%" height="160%">
                      <feGaussianBlur stdDeviation="20" result="blur" />
                      <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>

                  {/* Ambient soft glow */}
                  <circle cx="260" cy="130" r="100" fill="rgba(219, 234, 254, 0.75)" filter="url(#devGlow)" />
                  <circle cx="170" cy="110" r="60" fill="rgba(238, 242, 255, 0.85)" filter="url(#devGlow)" />

                  {/* Soft floating dots */}
                  <circle cx="95" cy="175" r="4.5" fill="#93C5FD" opacity="0.65" />
                  <circle cx="118" cy="190" r="2.5" fill="#60A5FA" opacity="0.75" />
                  <circle cx="345" cy="85" r="3" fill="#93C5FD" opacity="0.5" />
                  <circle cx="285" cy="35" r="2.5" fill="#60A5FA" opacity="0.6" />

                  {/* 1. Floating Isometric Code Card (Left </> card) */}
                  <g transform="translate(85, 100) rotate(-14)">
                    <rect x="2" y="4" width="56" height="56" rx="14" fill="url(#devShadowGrad)" />
                    <rect x="0" y="0" width="56" height="56" rx="14" fill="#FFFFFF" stroke="#DBEAFE" strokeWidth="1.5" />
                    <rect x="2" y="2" width="52" height="24" rx="11" fill="white" opacity="0.75" />
                    <path d="M 21 21 L 14 28 L 21 35" stroke="#2563EB" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M 35 21 L 42 28 L 35 35" stroke="#2563EB" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M 30 18 L 26 38" stroke="#3B82F6" strokeWidth="2.4" strokeLinecap="round" />
                  </g>

                  {/* 2. Main 3D Tilted Code Window */}
                  <g transform="translate(170, 40) rotate(7)">
                    <rect x="6" y="10" width="165" height="150" rx="16" fill="url(#devShadowGrad)" />
                    <rect x="0" y="0" width="165" height="150" rx="16" fill="url(#devWindowGrad)" stroke="#BFDBFE" strokeWidth="1.5" />
                    
                    {/* Header bar */}
                    <path d="M 0 16 C 0 7.16 7.16 0 16 0 L 149 0 C 157.84 0 165 7.16 165 16 L 165 28 L 0 28 Z" fill="url(#devHeaderGrad)" />
                    <circle cx="16" cy="14" r="3" fill="#FFFFFF" opacity="0.95" />
                    <circle cx="26" cy="14" r="3" fill="#FFFFFF" opacity="0.95" />
                    <circle cx="36" cy="14" r="3" fill="#FFFFFF" opacity="0.95" />

                    {/* Syntax Bars */}
                    <rect x="18" y="42" width="40" height="6" rx="3" fill="#60A5FA" opacity="0.85" />
                    <rect x="64" y="42" width="55" height="6" rx="3" fill="#93C5FD" opacity="0.7" />

                    <rect x="18" y="58" width="65" height="6" rx="3" fill="#A855F7" opacity="0.8" />
                    <rect x="88" y="58" width="45" height="6" rx="3" fill="#60A5FA" opacity="0.75" />

                    <rect x="18" y="74" width="80" height="6" rx="3" fill="#93C5FD" opacity="0.75" />

                    <rect x="18" y="90" width="30" height="6" rx="3" fill="#C084FC" opacity="0.85" />
                    <rect x="54" y="90" width="60" height="6" rx="3" fill="#60A5FA" opacity="0.8" />

                    <rect x="26" y="106" width="70" height="6" rx="3" fill="#93C5FD" opacity="0.7" />

                    <rect x="18" y="122" width="24" height="6" rx="3" fill="#60A5FA" opacity="0.85" />
                  </g>

                  {/* 3. Floating Settings / Gear Badge (Bottom Right) */}
                  <g transform="translate(295, 165) rotate(-6)">
                    <rect x="2" y="4" width="48" height="48" rx="12" fill="url(#devShadowGrad)" />
                    <rect x="0" y="0" width="48" height="48" rx="12" fill="#FFFFFF" stroke="#DBEAFE" strokeWidth="1.5" />
                    <svg x="12" y="12" width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"
                        fill="#3B82F6"
                        stroke="#2563EB"
                        strokeWidth="1.2"
                      />
                      <circle cx="12" cy="12" r="3.2" fill="#FFFFFF" stroke="#2563EB" strokeWidth="1.2" />
                    </svg>
                  </g>
                </svg>
              </div>

              {/* Code lines (Left side, relative z-10, clean dark syntax highlighting) */}
              <div className="relative z-10 overflow-x-auto text-slate-800 space-y-3 leading-relaxed max-w-xl font-mono text-[13px]">
                <div className="flex items-start">
                  <span className="text-slate-400 w-8 select-none shrink-0">1</span>
                  <span><span className="text-[#1D4ED8] font-bold">npm</span> <span className="text-slate-800 font-semibold">install @betasoftnet/core-sdk</span></span>
                </div>
                <div className="flex items-start">
                  <span className="text-slate-400 w-8 select-none shrink-0">2</span>
                  <span className="text-slate-400 italic font-mono">// Initialize authenticators gateway client</span>
                </div>
                <div className="flex items-start">
                  <span className="text-slate-400 w-8 select-none shrink-0">3</span>
                  <span><span className="text-[#9333EA] font-semibold">import</span> <span className="text-slate-800 font-semibold">BetaClient</span> <span className="text-[#9333EA] font-semibold">from</span> <span className="text-[#2563EB] font-semibold">'@betasoftnet/core-sdk'</span><span className="text-slate-700">;</span></span>
                </div>
                <div className="flex items-start">
                  <span className="text-slate-400 w-8 select-none shrink-0">4</span>
                  <span>&nbsp;</span>
                </div>
                <div className="flex items-start">
                  <span className="text-slate-400 w-8 select-none shrink-0">5</span>
                  <span><span className="text-[#9333EA] font-semibold">const</span> <span className="text-slate-800 font-medium">client =</span> <span className="text-[#9333EA] font-semibold">new</span> <span className="text-slate-900 font-semibold">BetaClient</span><span className="text-slate-800">&#40;&#123;</span></span>
                </div>
                <div className="flex items-start">
                  <span className="text-slate-400 w-8 select-none shrink-0">6</span>
                  <span>&nbsp;&nbsp;<span className="text-slate-700 font-medium">apiKey:</span> <span className="text-[#2563EB] font-semibold">'beta_pub_7294x_security_key'</span><span className="text-slate-700">,</span></span>
                </div>
                <div className="flex items-start">
                  <span className="text-slate-400 w-8 select-none shrink-0">7</span>
                  <span>&nbsp;&nbsp;<span className="text-slate-700 font-medium">region:</span> <span className="text-[#2563EB] font-semibold">'ap-south-1'</span></span>
                </div>
                <div className="flex items-start">
                  <span className="text-slate-400 w-8 select-none shrink-0">8</span>
                  <span className="text-slate-800 font-semibold">&#125;&#41;;</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Frequently Asked Questions */}
        <div className="space-y-6 support-reveal">
          <div className="text-left space-y-1.5 support-reveal-card" style={{ '--reveal-delay': '0ms' }}>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Frequently Asked Questions</h2>
            <p className="text-sm text-slate-500">Standard operational guidelines, account recoveries, and system encryption FAQs.</p>
          </div>

          <div className="max-w-4xl mx-auto space-y-3.5 text-left">
            {supportFaqs.map((faq, idx) => (
              <div
                key={idx}
                className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm transition hover:border-slate-300 support-reveal-card"
                style={{ '--reveal-delay': `${idx * 80 + 60}ms` }}
              >
                <button
                  type="button"
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between p-4 text-sm font-bold text-slate-800 hover:bg-slate-50 transition focus:outline-none cursor-pointer"
                >
                  <span className="pr-4">{faq.q}</span>
                  <ChevronDown className={`h-4.5 w-4.5 text-slate-400 shrink-0 transform transition-transform duration-200 ${activeFaq === idx ? 'rotate-180' : ''}`} />
                </button>
                {activeFaq === idx && (
                  <div className="px-4 pb-4 pt-0.5 text-xs text-slate-500 font-semibold leading-relaxed border-t border-slate-50 bg-slate-50/20 animate-fadeIn">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

