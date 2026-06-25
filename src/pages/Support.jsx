import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Search, ChevronDown, Check, Copy, Clock, Send, Shield, Activity, Download, MessageSquare, ExternalLink, HelpCircle, Code, Briefcase, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
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

  const supportContactInfo = {
    phone: '+1 (800) 555-0199',
    email: 'support@betasoftnet.com',
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

  return (
    <div className="min-h-screen bg-transparent pb-16 relative z-10">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-tr from-[#EFF6FF] via-[#DBEAFE] to-[#BFDBFE] pt-8 pb-16 text-gray-900 text-center hero-blue-banner">
        {/* Glow grid mesh overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none opacity-40" />
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[60%] rounded-full bg-emerald-400/20 blur-[130px] pointer-events-none" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[60%] rounded-full bg-teal-400/20 blur-[130px] pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 relative z-10 space-y-6">
          <span className="inline-block px-3 py-1 rounded-full bg-slate-100 border border-slate-300 text-xs font-bold uppercase tracking-widest text-black select-none">
            Help & Customer Desk
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight select-none text-[#0A3161]">
            How Can We Help You?
          </h1>
          <p className="text-emerald-100 text-sm md:text-base max-w-xl mx-auto font-medium select-none">
            Search our knowledge base, browse core product resources, or lodge a direct developer request to our support engineering squad.
          </p>

          {/* Search bar widget */}
          <div className="max-w-xl mx-auto relative mt-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search guides, setup configs, integration logs..."
              className="w-full bg-white text-slate-800 placeholder-slate-400 border-none rounded-full py-3.5 pl-12 pr-6 text-sm shadow-xl focus:outline-none focus:ring-4 focus:ring-emerald-300/40 transition duration-300"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 space-y-16">
        {/* Help Center Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Operational status */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-start space-x-4">
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
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-start space-x-4">
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
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-start space-x-4">
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
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-start space-x-4">
            <div className="h-10 w-10 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 flex-shrink-0">
              <Download className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">App Clients</p>
              <Link to="/products" className="text-xs font-bold text-[#004AAD] hover:underline flex items-center mt-1">
                <span>Downloads Portal</span>
                <ExternalLink className="h-3 w-3 ml-1" />
              </Link>
              <p className="text-[10px] text-slate-500 font-medium mt-1">Desktop & mobile packages</p>
            </div>
          </div>
        </div>

        {/* Product Support Section */}
        <div className="space-y-6 bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-100 border border-blue-200/40 p-8 rounded-3xl shadow-sm">
          <div className="text-left space-y-1.5">
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Ecosystem Product Support</h2>
            <p className="text-sm text-slate-955 font-semibold">Guides, diagnostic links, and configuration standards for our primary suites.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* BNX Mail Card */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="h-12 w-12 flex-shrink-0 flex items-center justify-center">
                  <img src="/bnx_mail_logo.png" alt="BNX Mail" className="h-full w-full object-contain" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-extrabold text-slate-800 text-sm tracking-wide uppercase">BNX MAIL</h3>
                    <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-600 border border-blue-100 text-[8px] font-bold uppercase tracking-wider">Product Support</span>
                  </div>
                  <p className="text-xs text-slate-400 font-semibold mt-1">Shared Inbox & SMTP setup</p>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                  Integrate shared SMTP configurations or handle multi-agent mail delegation safely. Requires client certificate auth credentials.
                </p>
              </div>
              <div className="border-t border-slate-100 pt-4">
                <div className="text-xs font-bold text-[#004AAD] flex items-center space-x-1.5 select-none">
                  <span>View SMTP/IMAP Setup Guide</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </div>
              </div>
            </div>

            {/* B2Auth Security Card */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
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
              <div className="border-t border-slate-100 pt-4">
                <div className="text-xs font-bold text-[#004AAD] flex items-center space-x-1.5 select-none">
                  <span>Open Gateway OAuth Specs</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </div>
              </div>
            </div>

            {/* Cliks Business Card */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
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
              <div className="border-t border-slate-100 pt-4">
                <div className="text-xs font-bold text-[#004AAD] flex items-center space-x-1.5 select-none">
                  <span>Launch Invoicing Manuals</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Two-Column Grid: Contacts (Left) vs Support Request Form (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Side: Contact Channels & Address */}
          <div className="lg:col-span-5 space-y-6 text-left">
            <div className="space-y-1.5">
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Get in Touch Directly</h2>
              <p className="text-sm text-slate-500">Reach out through standard channels for immediate billing or operational assistance.</p>
            </div>

            <div className="space-y-4">
              {/* Phone Channel */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative group hover:border-[#004AAD]/20 transition duration-300">
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
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative group hover:border-[#004AAD]/20 transition duration-300">
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
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-[#004AAD]/10 transition duration-300 flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-slate-400 mt-0.5 flex-shrink-0" />
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Corporate HQ</span>
                  <p className="text-xs text-slate-700 leading-relaxed font-semibold">{supportContactInfo.address}</p>
                </div>
              </div>

              {/* Operation Hours Card */}
              <div className="bg-slate-105 p-4 border border-slate-200 rounded-2xl flex items-center space-x-3 select-none">
                <Clock className="h-5 w-5 text-slate-500 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Operational Hours</p>
                  <p className="text-[11px] font-bold text-slate-755 truncate">{supportContactInfo.hours}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Request Submission Form */}
          <div className="lg:col-span-7 text-left">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-lg p-6 sm:p-8 relative">
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
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between text-left gap-6 shadow-sm">
          <div className="flex items-start space-x-4">
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
            className="bg-[#004AAD] hover:bg-[#003882] !text-white text-xs font-bold uppercase tracking-wider px-5 py-3 rounded-full transition duration-300 shadow-md shadow-blue-950/10 shrink-0 cursor-pointer text-center"
          >
            Connect with Partner Desk
          </Link>
        </div>

        {/* Technical Support SDK Code Console */}
        <div id="sdk-console" className="space-y-6">
          <div className="text-left space-y-1.5">
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Developer Technical Support</h2>
            <p className="text-sm text-slate-500">Initialize our corporate authentication and group mail modules directly inside your terminal.</p>
          </div>

          <div className="bg-slate-950 rounded-3xl border border-slate-900 overflow-hidden shadow-xl text-left font-mono text-xs">
            <div className="bg-slate-900 border-b border-slate-800 px-4 py-3.5 flex items-center justify-between select-none">
              <div className="flex items-center space-x-2">
                <Code className="h-4 w-4 text-[#004AAD]" />
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Beta Javascript Node-SDK</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-rose-500" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
              </div>
            </div>
            <div className="p-6 overflow-x-auto text-slate-355 space-y-3 leading-relaxed">
              <div className="flex items-start">
                <span className="text-slate-500 w-6 select-none shrink-0">1</span>
                <span><span className="text-[#38bdf8]">npm</span> install <span className="text-[#38bdf8]">@betasoftnet/core-sdk</span></span>
              </div>
              <div className="flex items-start">
                <span className="text-slate-500 w-6 select-none shrink-0">2</span>
                <span><span className="text-slate-500">// Initialize authenticators gateway client</span></span>
              </div>
              <div className="flex items-start">
                <span className="text-slate-500 w-6 select-none shrink-0">3</span>
                <span><span className="text-[#f472b6]">import</span> BetaClient <span className="text-[#f472b6]">from</span> <span className="text-emerald-400">'@betasoftnet/core-sdk'</span>;</span>
              </div>
              <div className="flex items-start">
                <span className="text-slate-500 w-6 select-none shrink-0">4</span>
                <span></span>
              </div>
              <div className="flex items-start">
                <span className="text-slate-500 w-6 select-none shrink-0">5</span>
                <span><span className="text-[#f472b6]">const</span> client = <span className="text-[#f472b6]">new</span> <span className="text-[#fbbf24]">BetaClient</span>(&#123;</span>
              </div>
              <div className="flex items-start">
                <span className="text-slate-500 w-6 select-none shrink-0">6</span>
                <span>  apiKey: <span className="text-emerald-400">'beta_pub_7294x_security_key'</span>,</span>
              </div>
              <div className="flex items-start">
                <span className="text-slate-500 w-6 select-none shrink-0">7</span>
                <span>  region: <span className="text-emerald-400">'ap-south-1'</span></span>
              </div>
              <div className="flex items-start">
                <span className="text-slate-500 w-6 select-none shrink-0">8</span>
                <span>&#125;);</span>
              </div>
            </div>
          </div>
        </div>

        {/* Frequently Asked Questions */}
        <div className="space-y-6">
          <div className="text-left space-y-1.5">
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Frequently Asked Questions</h2>
            <p className="text-sm text-slate-500">Standard operational guidelines, account recoveries, and system encryption FAQs.</p>
          </div>

          <div className="max-w-4xl mx-auto space-y-3.5 text-left">
            {supportFaqs.map((faq, idx) => (
              <div key={idx} className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm transition hover:border-slate-300">
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
