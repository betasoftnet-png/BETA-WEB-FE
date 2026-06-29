import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, Inbox, Send, Archive, Trash2, Search, ArrowLeft,
  CheckCircle, Clock, User, Reply, Users, Star, AlertCircle,
  FileText, Shield, Sparkles, X, ChevronRight, Settings, Coins
} from 'lucide-react';

const initialThreads = [
  {
    id: 1,
    sender: 'John Doe (Acme Corp)',
    email: 'john.doe@acme.com',
    subject: 'SMTP server latency issue',
    snippet: "Hey team, we've been noticing some delay in outgoing mail delivery...",
    date: '10:14 AM',
    status: 'ACTIVE',
    assignee: 'ashwin2911',
    messages: [
      { id: 101, sender: 'John Doe', content: "Hey team, we've been noticing some delay in outgoing mail delivery from the SMTP gateway. It takes around 15 seconds to receive the activation codes.", time: '10:14 AM', isClient: true },
      { id: 102, sender: 'Support Bot', content: 'Auto-reply: Ticket created and assigned to ashwin2911. Diagnostics are being gathered.', time: '10:15 AM', isClient: false }
    ]
  },
  {
    id: 2,
    sender: 'Sarah Connor (Cyberdyne)',
    email: 'sarah.c@cyberdyne.io',
    subject: 'MFA setup support & resetting keys',
    snippet: 'Can you help me reset the security keys for our team portal?',
    date: 'Yesterday',
    status: 'PENDING',
    assignee: 'Unassigned',
    messages: [
      { id: 201, sender: 'Sarah Connor', content: 'Can you help me reset the security keys for our team portal? One of our engineers lost their authentication device.', time: 'Yesterday', isClient: true }
    ]
  },
  {
    id: 3,
    sender: 'Bruce Wayne (Wayne Ent)',
    email: 'bruce@waynecorp.co',
    subject: 'Enterprise pricing inquiry for BNX Mail',
    snippet: 'We need to scale our email infrastructure to support 10k users...',
    date: '2 days ago',
    status: 'RESOLVED',
    assignee: 'ashwin2911',
    messages: [
      { id: 301, sender: 'Bruce Wayne', content: 'We need to scale our email infrastructure to support 10k users. Can you provide custom SLA tiers and pricing quotes?', time: '2 days ago', isClient: true },
      { id: 302, sender: 'ashwin2911', content: 'Hello Bruce, I have forwarded your enterprise request to our sales department. They will contact you with a custom quote within 2 hours.', time: '2 days ago', isClient: false }
    ]
  }
];

export default function BnxMailDashboard() {
  const [threads, setThreads] = useState(initialThreads);
  const [selectedThreadId, setSelectedThreadId] = useState(1);
  const [replyText, setReplyText] = useState('');
  const [activeFolder, setActiveFolder] = useState('Inbox');
  const [showcaseMessage, setShowcaseMessage] = useState(null);

  const selectedThread = threads.find(t => t.id === selectedThreadId) || threads[0];

  const handleSendReply = (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    const newReply = {
      id: Date.now(),
      sender: 'ashwin2911',
      content: replyText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isClient: false
    };

    setThreads(prevThreads => 
      prevThreads.map(t => {
        if (t.id === selectedThreadId) {
          return {
            ...t,
            snippet: replyText,
            status: 'ACTIVE',
            messages: [...t.messages, newReply]
          };
        }
        return t;
      })
    );

    setReplyText('');
  };

  const handleResolveThread = () => {
    setThreads(prevThreads =>
      prevThreads.map(t => {
        if (t.id === selectedThreadId) {
          return {
            ...t,
            status: 'RESOLVED'
          };
        }
        return t;
      })
    );
  };

  const handleAssignToMe = () => {
    setThreads(prevThreads =>
      prevThreads.map(t => {
        if (t.id === selectedThreadId) {
          return {
            ...t,
            assignee: 'ashwin2911'
          };
        }
        return t;
      })
    );
  };

  return (
    <div className="min-h-screen bg-[#f3f7f5] flex flex-col text-slate-800 antialiased font-sans select-none">
      
      {/* 1. TOP NAVBAR (Header) */}
      <header className="bg-[#004AAD] text-white px-4 h-16 flex items-center justify-between shadow-md z-40">
        
        {/* Brand Logo */}
        <div className="flex items-center space-x-3">
          <Link to="/" className="p-1.5 hover:bg-white/10 rounded-lg text-white transition">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center text-[#004AAD] font-black text-xl shadow-inner">
            <Mail className="h-5 w-5" />
          </div>
          <div>
            <span className="font-extrabold text-lg tracking-wider block leading-none">
              BNX Mail
            </span>
            <span className="text-[9px] text-blue-200 uppercase tracking-widest font-bold">
              Shared Inbox Gateway
            </span>
          </div>
        </div>

        {/* Central Brand Motto */}
        <div className="hidden md:flex items-center space-x-2 bg-[#002b5c] px-4 py-1.5 rounded-full border border-blue-950/20 text-xs font-bold text-blue-100">
          <Sparkles className="h-3.5 w-3.5 text-blue-300" />
          <span>Collaborative Inbox SMTP/IMAP Client</span>
        </div>

        {/* Right Info Widgets */}
        <div className="flex items-center space-x-4">
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              className="bg-[#002b5c]/80 border border-blue-800/40 rounded-full py-1.5 pl-9 pr-4 text-xs text-white placeholder-blue-300/45 focus:outline-none focus:border-white focus:bg-[#001f44] transition w-52"
            />
          </div>

          <div className="flex items-center space-x-1.5 bg-[#002b5c]/90 border border-blue-800/40 rounded-full px-3 py-1 text-xs font-bold text-yellow-400">
            <Coins className="h-3.5 w-3.5" />
            <span>1,000 Pts</span>
          </div>

          <div className="flex items-center space-x-2 bg-[#002b5c]/90 border border-blue-800/40 rounded-full px-3.5 py-1 text-xs font-bold hover:bg-[#001f44] transition cursor-pointer">
            <User className="h-3.5 w-3.5 text-slate-300" />
            <span>ashwin2911</span>
          </div>

          <div className="h-8 w-8 rounded-full bg-blue-700 flex items-center justify-center font-bold border border-blue-600 text-xs">
            AD
          </div>
        </div>
      </header>

      {/* 2. MAIN LAYOUT: Sidebar + Threads + Conversation View */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* SIDEBAR: Mail folders and Shared Channels */}
        <aside className="w-64 bg-white border-r border-[#e0e7e3] flex flex-col justify-between py-6 shrink-0 overflow-y-auto">
          <div className="space-y-6">
            
            {/* New Thread Button */}
            <div className="px-4">
              <button 
                onClick={() => setShowcaseMessage('Create New SMTP Box Integration')}
                className="w-full bg-[#004AAD] hover:bg-[#003c8a] text-white py-2.5 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 shadow shadow-blue-900/10 active:scale-[0.98] transition cursor-pointer"
              >
                <Mail className="h-4 w-4" />
                <span>Add Mailbox</span>
              </button>
            </div>

            {/* Folders list */}
            <div className="space-y-1">
              <p className="px-6 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Mailboxes</p>
              {[
                { name: 'Inbox', icon: Inbox, count: 2 },
                { name: 'Sent Mail', icon: Send, count: null },
                { name: 'Archived', icon: Archive, count: null },
                { name: 'Trash Bin', icon: Trash2, count: null },
              ].map(folder => {
                const Icon = folder.icon;
                return (
                  <button
                    key={folder.name}
                    onClick={() => setActiveFolder(folder.name)}
                    className={`w-full flex items-center justify-between px-6 py-2.5 text-xs font-bold transition-all ${
                      activeFolder === folder.name 
                        ? 'bg-blue-50/70 text-[#004AAD] border-r-4 border-[#004AAD]' 
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className={`h-4.5 w-4.5 ${activeFolder === folder.name ? 'text-[#004AAD]' : 'text-slate-400'}`} />
                      <span>{folder.name}</span>
                    </div>
                    {folder.count !== null && (
                      <span className="px-2 py-0.5 rounded-full bg-blue-100 text-[#004AAD] text-[10px] font-bold">
                        {folder.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Shared channels list */}
            <div className="space-y-1">
              <p className="px-6 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Shared Inboxes</p>
              {[
                { name: 'support@acme.com', active: true },
                { name: 'billing@cyberdyne.io', active: false },
                { name: 'inquiries@wayne.co', active: false }
              ].map(chan => (
                <button
                  key={chan.name}
                  onClick={() => setShowcaseMessage(`Switching to inbox mailbox: ${chan.name}`)}
                  className="w-full flex items-center space-x-3 px-6 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 text-left"
                >
                  <Users className="h-4 w-4 text-slate-400" />
                  <span className="truncate">{chan.name}</span>
                  {chan.active && <span className="h-2 w-2 rounded-full bg-green-500 flex-shrink-0" />}
                </button>
              ))}
            </div>

          </div>

          {/* Quick Stats Summary */}
          <div className="px-4 pt-6 border-t border-slate-100">
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 text-left space-y-2 text-xs">
              <p className="font-extrabold text-slate-700">Inbox Health Diagnostics</p>
              <div className="space-y-1 text-slate-500 font-medium">
                <p>SMTP Status: <span className="text-green-600 font-bold">Connected</span></p>
                <p>Response Latency: <span className="font-bold">2.4m</span></p>
                <p>Daily Volumes: <span className="font-bold">148 messages</span></p>
              </div>
            </div>
          </div>
        </aside>

        {/* MIDDLE: Conversations threads list */}
        <section className="w-80 bg-white border-r border-[#e0e7e3] flex flex-col shrink-0">
          <div className="p-4 border-b border-slate-100">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Filter index threads..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-9 pr-4 text-xs text-slate-900 focus:outline-none focus:border-[#004AAD] transition shadow-sm"
              />
            </div>
          </div>

          <div className="flex-grow overflow-y-auto divide-y divide-slate-100">
            {threads.map(thread => (
              <button
                key={thread.id}
                onClick={() => setSelectedThreadId(thread.id)}
                className={`w-full p-4 text-left transition-colors flex flex-col space-y-1.5 ${
                  selectedThreadId === thread.id 
                    ? 'bg-blue-50/30' 
                    : 'hover:bg-slate-50/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-xs text-slate-900 truncate max-w-[150px]">
                    {thread.sender}
                  </span>
                  <span className="text-[9px] text-slate-400 font-bold">
                    {thread.date}
                  </span>
                </div>
                
                <h4 className="text-xs font-bold text-slate-700 truncate leading-snug">
                  {thread.subject}
                </h4>
                
                <p className="text-[11px] text-slate-400 truncate leading-snug">
                  {thread.snippet}
                </p>

                <div className="flex items-center justify-between pt-1">
                  <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest ${
                    thread.status === 'ACTIVE' 
                      ? 'bg-emerald-100 text-emerald-800' 
                      : thread.status === 'PENDING'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-slate-100 text-slate-800'
                  }`}>
                    {thread.status}
                  </span>
                  
                  <span className="text-[9px] font-bold text-slate-400 italic">
                    Assigned: {thread.assignee}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* RIGHT: Selected Conversation detail viewing pane */}
        <section className="flex-1 bg-[#f8fafc] flex flex-col overflow-hidden">
          
          {/* Active Thread Title & Metadata */}
          <div className="bg-white border-b border-[#e0e7e3] p-4 flex items-center justify-between shrink-0 shadow-xs text-left">
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
                  {selectedThread.subject}
                </h2>
                <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest ${
                  selectedThread.status === 'ACTIVE' 
                    ? 'bg-emerald-100 text-emerald-800' 
                    : selectedThread.status === 'PENDING'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-slate-100 text-slate-800'
                }`}>
                  {selectedThread.status}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-bold mt-1">
                SENDER: <span className="text-slate-600">{selectedThread.email}</span>
              </p>
            </div>

            <div className="flex items-center space-x-2">
              {selectedThread.status !== 'RESOLVED' && (
                <button
                  onClick={handleResolveThread}
                  className="bg-emerald-50 text-emerald-700 border border-emerald-100 hover:bg-emerald-100 px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer"
                >
                  <CheckCircle className="h-3.5 w-3.5" />
                  <span>Resolve Thread</span>
                </button>
              )}
              {selectedThread.assignee === 'Unassigned' && (
                <button
                  onClick={handleAssignToMe}
                  className="bg-blue-50 text-[#004AAD] border border-blue-100 hover:bg-blue-100 px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer"
                >
                  <User className="h-3.5 w-3.5" />
                  <span>Assign to Me</span>
                </button>
              )}
            </div>
          </div>

          {/* Conversation history log */}
          <div className="flex-grow overflow-y-auto p-6 space-y-4">
            {selectedThread.messages.map(msg => (
              <div 
                key={msg.id} 
                className={`flex flex-col space-y-1.5 max-w-[80%] ${
                  msg.isClient ? 'mr-auto items-start' : 'ml-auto items-end'
                }`}
              >
                <div className="flex items-center space-x-2 text-[10px] text-slate-400 font-bold">
                  <span>{msg.sender}</span>
                  <span>•</span>
                  <span>{msg.time}</span>
                </div>
                <div className={`p-4 rounded-2xl text-xs leading-relaxed text-left border shadow-sm ${
                  msg.isClient 
                    ? 'bg-white text-slate-800 border-slate-200/80 rounded-tl-xs' 
                    : 'bg-blue-600 text-white border-[#004bbf] rounded-tr-xs'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
          </div>

          {/* Composing Area */}
          <div className="bg-white border-t border-[#e0e7e3] p-4 shrink-0">
            <form onSubmit={handleSendReply} className="flex space-x-3 items-end">
              <div className="flex-grow text-left">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Compose Email Reply (Collaborative SMTP Client)
                </label>
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder={`Write email response to ${selectedThread.sender.split(' ')[0]}...`}
                  rows={3}
                  className="w-full bg-slate-50 text-slate-900 border border-slate-200 rounded-xl py-2 px-3 focus:outline-none focus:border-[#004AAD] text-xs transition resize-none"
                />
              </div>
              <button
                type="submit"
                className="bg-[#004AAD] hover:bg-[#003c8a] text-white px-5 py-3 rounded-xl text-xs font-bold transition flex items-center space-x-2 shrink-0 h-10 shadow shadow-blue-900/10 cursor-pointer active:scale-[0.98]"
              >
                <Send className="h-4 w-4" />
                <span>Send Reply</span>
              </button>
            </form>
          </div>

        </section>

      </div>

      {/* Feature Showcase Overlay Dialogue */}
      <AnimatePresence>
        {showcaseMessage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl p-6 md:p-8 w-full max-w-md border border-slate-200 shadow-2xl text-left space-y-4"
            >
              <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                <div className="flex items-center space-x-2 text-[#004AAD]">
                  <Sparkles className="h-5 w-5" />
                  <h3 className="text-base font-black uppercase tracking-wide">Gateway Action</h3>
                </div>
                <button onClick={() => setShowcaseMessage(null)} className="p-1 hover:bg-slate-100 rounded-lg">
                  <X className="h-5 w-5 text-slate-400" />
                </button>
              </div>

              <div className="space-y-3">
                <p className="text-xs text-slate-650 leading-relaxed font-bold">
                  {showcaseMessage}
                </p>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  This action triggers a simulation protocol on the BNX Mail app demo console. All incoming and outgoing mail threads are handled by the mock mail gateway.
                </p>
              </div>

              <button
                onClick={() => setShowcaseMessage(null)}
                className="w-full bg-[#004AAD] hover:bg-[#003c8a] py-2.5 rounded-xl text-white text-xs font-bold transition flex items-center justify-center cursor-pointer"
              >
                <span>Dismiss</span>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
