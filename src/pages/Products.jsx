import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Shield, User, Briefcase, ChevronRight, ChevronDown, Check, Activity, RefreshCw, Lock } from 'lucide-react';
import api from '../api';

const iconMap = {
  Mail: Mail,
  Shield: Shield,
  User: User,
  Briefcase: Briefcase,
};

const defaultProducts = [
  {
    id: 1,
    name: 'BNX MAIL',
    description: 'WhatsApp-style collaborative email platform. Unify SMTP/IMAP boxes and resolve client threads together.',
    icon: 'Mail',
    status: 'ACTIVE',
    features: [
      { id: 1, featureName: 'SMTP & IMAP Integrations' },
      { id: 2, featureName: 'Shared Conversations' },
      { id: 3, featureName: 'Group Inboxes' },
      { id: 4, featureName: 'WebSocket Communication' }
    ]
  },
  {
    id: 2,
    name: 'B2AUTH SECURITY',
    description: 'Unified authentication and security platform. Manage SSO, roles, and session validations.',
    icon: 'Shield',
    status: 'ACTIVE',
    features: [
      { id: 5, featureName: 'Single Sign-On (SSO)' },
      { id: 6, featureName: 'Multi-Factor Auth (MFA)' },
      { id: 7, featureName: 'JWT Verification' },
      { id: 8, featureName: 'Admin Role Management' }
    ]
  },
  {
    id: 3,
    name: 'CLIKS',
    description: 'Personal productivity and organization suite. Manage notes, schedules, and daily milestones.',
    icon: 'User',
    status: 'ACTIVE',
    features: [
      { id: 9, featureName: 'Task Manager' },
      { id: 10, featureName: 'Google Calendar Sync' },
      { id: 11, featureName: 'Markdown Note Taking' },
      { id: 12, featureName: 'Personal Dashboard Widgets' }
    ]
  },
  {
    id: 4,
    name: 'CLIKS BUSINESS',
    description: 'Business collaboration and team sprint workflow engine. Fuel project releases and chat.',
    icon: 'Briefcase',
    status: 'ACTIVE',
    features: [
      { id: 13, featureName: 'Agile Board Sprints' },
      { id: 14, featureName: 'Team Workspace Chat' },
      { id: 15, featureName: 'Analytical Reporting' },
      { id: 16, featureName: 'Document Collaborator' }
    ]
  }
];

export default function Products() {
  const [products, setProducts] = useState(defaultProducts);
  const [loading, setLoading] = useState(true);
  const [isCategoryOpen, setIsCategoryOpen] = useState(true);
  const [isPublicOpen, setIsPublicOpen] = useState(true);
  const [isBusinessOpen, setIsBusinessOpen] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get('/api/products');
        if (response.data && response.data.length > 0) {
          setProducts(response.data);
        }
      } catch (err) {
        console.warn('Backend API not available, using default seeded products.', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    if (!loading) {
      const hash = window.location.hash;
      if (hash) {
        const id = hash.substring(1);
        const element = document.getElementById(id);
        if (element) {
          setTimeout(() => {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 150);
        }
      }
    }
  }, [loading, window.location.hash]);

  const renderProductCell = (product) => {
    if (!product) return <div className="text-slate-500 text-xs italic py-4">--</div>;
    const IconComponent = iconMap[product.icon] || Mail;
    const isCliksBusiness = product.name.toUpperCase().includes('CLIKS BUSINESS');

    return (
      <div 
        id={product.name.toLowerCase().replace(/\s+/g, '-')}
        className="space-y-4 p-6 rounded-2xl glass-card glass-card-hover border border-slate-200 shadow-sm transition-all duration-300 scroll-mt-24 text-left"
      >
        {/* Icon & Name */}
        <div className="flex items-center space-x-3">
          {product.name.toUpperCase().includes('BNX MAIL') ? (
            <div className="h-11 w-11 flex-shrink-0 flex items-center justify-center">
              <img src="/bnx_mail_logo.png" alt="BNX Mail" className="h-full w-full object-contain" />
            </div>
          ) : product.name.toUpperCase().includes('CLIKS BUSINESS') ? (
            <div className="h-11 w-11 flex-shrink-0 flex items-center justify-center">
              <img src="/cliks_business_logo.png" alt="Cliks Business" className="h-full w-full object-contain" />
            </div>
          ) : product.name.toUpperCase().includes('CLIKS') ? (
            <div className="h-11 w-11 flex-shrink-0 flex items-center justify-center">
              <img src="/cliks_logo.png" alt="Cliks" className="h-full w-full object-contain" />
            </div>
          ) : product.name.toUpperCase().includes('B2AUTH') || product.name.toUpperCase().includes('B2 AUTH') ? (
            <div className="h-11 w-11 flex-shrink-0 flex items-center justify-center">
              <img src="/b2auth_logo.png" alt="B2Auth Security" className="h-full w-full object-contain" />
            </div>
          ) : (
            <div className="h-11 w-11 bg-gradient-to-tr from-blue-50 to-indigo-50 rounded-xl border border-blue-250/60 flex-shrink-0 flex items-center justify-center text-[#004AAD]">
              <IconComponent className="h-5 w-5" />
            </div>
          )}
          <div>
            <h4 className="text-sm font-extrabold text-slate-900 tracking-tight">{product.name}</h4>
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
              {product.status === 'ACTIVE' ? 'Production' : 'Beta'}
            </span>
          </div>
        </div>

        {/* Description */}
        <p className="text-slate-650 text-xs leading-relaxed">{product.description}</p>

        {/* Bullet Features (Subtle & Compact) */}
        {product.features && product.features.length > 0 && (
          <div className="pt-3 border-t border-slate-200">
            <div className="flex flex-wrap gap-1.5">
              {product.features.map((feat, i) => (
                <span key={feat.id || i} className="px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 text-[#004AAD] text-[9px] font-bold uppercase tracking-wider">
                  {feat.featureName || feat}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="pt-2 flex justify-start">
          <a
            href={
              product.name.toUpperCase().includes('BNX MAIL') ? 'https://www.bnxmail.com/login' :
              product.name.toUpperCase().includes('CLIKS BUSINESS') ? 'https://www.cliksbusiness.com/' :
              product.name.toUpperCase().includes('CLIKS') ? 'https://cliks.beta-softnet.com/' :
              product.name.toUpperCase().includes('B2AUTH') || product.name.toUpperCase().includes('B2 AUTH') ? 'https://www.b2auth.com/' :
              '/partners'
            }
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 text-xs font-bold transition duration-300"
          >
            <span>{product.name.toUpperCase().includes('BNX MAIL') || product.name.toUpperCase().includes('CLIKS') || product.name.toUpperCase().includes('B2AUTH') || product.name.toUpperCase().includes('B2 AUTH') ? "Launch Platform" : "Request Integration"}</span>
            <ChevronRight className="h-3.5 w-3.5 text-slate-500" />
          </a>
        </div>
      </div>
    );
  };

  const bnxMail = products.find(p => p.name.toUpperCase().includes('BNX MAIL'));
  const b2Auth = products.find(p => p.name.toUpperCase().includes('B2AUTH') || p.name.toUpperCase().includes('B2 AUTH'));
  const cliksPersonal = products.find(p => 
    p.name.toUpperCase().includes('CLIKS') && !p.name.toUpperCase().includes('BUSINESS')
  );
  const cliksBusiness = products.find(p => p.name.toUpperCase().includes('CLIKS BUSINESS'));

  const coreIds = [bnxMail?.id, b2Auth?.id, cliksPersonal?.id, cliksBusiness?.id].filter(Boolean);
  const otherProducts = products.filter(p => !coreIds.includes(p.id));

  return (
    <div className="relative min-h-screen bg-transparent pt-4 pb-24 px-4 sm:px-6 lg:px-8 z-10">
      {/* Background radial highlights */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-teal-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#E9F4FF] border border-[#004AAD]/20 text-[#004AAD] text-xs font-semibold"
          >
            <motion.span
              animate={{ y: [0, -3, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className="flex items-center justify-center animate-pulse"
            >
              <Activity className="h-3.5 w-3.5" />
            </motion.span>
            <span>ENTERPRISE SUITE</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-extrabold text-slate-900"
          >
            Innovate with the Beta Ecosystem
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-slate-500 text-lg"
          >
            A suite of premium collaborative tools designed to solve communication, security, and productivity challenges.
          </motion.p>
        </div>

        {/* Loading Indicator */}
        {loading && (
          <div className="flex items-center justify-center space-x-2 text-slate-400 py-12">
            <RefreshCw className="h-5 w-5 animate-spin text-emerald-500" />
            <span>Loading active products...</span>
          </div>
        )}

        {/* Product Table */}
        {!loading && (
          <div className="overflow-x-auto bg-white rounded-3xl border border-slate-205 shadow-2xl">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider font-extrabold select-none">
                  <th 
                    className="py-5 px-6 md:px-8 text-slate-600 w-1/5 cursor-pointer hover:bg-slate-100/60 transition duration-200 rounded-tl-3xl"
                    onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                  >
                    <div className="flex items-center space-x-1.5">
                      <span>Category</span>
                      <ChevronDown className={`h-4 w-4 text-slate-400 transform transition-transform duration-200 ${isCategoryOpen ? 'rotate-180' : ''}`} />
                    </div>
                  </th>
                  <th 
                    className="py-5 px-6 md:px-8 text-slate-600 w-2/5 select-none"
                  >
                    <div className="flex items-center space-x-1.5">
                      <span>Public</span>
                    </div>
                  </th>
                  <th 
                    className="py-5 px-6 md:px-8 text-slate-600 w-2/5 rounded-tr-3xl select-none"
                  >
                    <div className="flex items-center space-x-1.5">
                      <span>Business</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-770">
                <tr className="hover:bg-slate-50/40 transition-colors">
                  <td className="py-6 px-6 md:px-8 align-top w-1/5">
                    {isCategoryOpen && (
                      <div
                        className="inline-block px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-extrabold uppercase tracking-widest select-none"
                      >
                        Base
                      </div>
                    )}
                  </td>
                  <td className="py-6 px-6 md:px-8 align-top w-2/5 border-r border-slate-100">
                    {/* Public Products */}
                    {isPublicOpen && (
                      <div className="flex flex-col gap-6 pt-2">
                        <div className="flex flex-col gap-2">
                          <span className="self-start px-2 py-0.5 rounded bg-blue-50 border border-blue-200 text-blue-700 text-[9px] font-extrabold uppercase tracking-widest">
                            Public Product
                          </span>
                          {renderProductCell(bnxMail)}
                        </div>
                        <div className="flex flex-col gap-2">
                          <span className="self-start px-2 py-0.5 rounded bg-blue-50 border border-blue-200 text-blue-700 text-[9px] font-extrabold uppercase tracking-widest">
                            Public Product
                          </span>
                          {renderProductCell(b2Auth)}
                        </div>
                        <div className="flex flex-col gap-2">
                          <span className="self-start px-2 py-0.5 rounded bg-blue-50 border border-blue-200 text-blue-700 text-[9px] font-extrabold uppercase tracking-widest">
                            Public Product
                          </span>
                          {renderProductCell(cliksPersonal)}
                        </div>
                      </div>
                    )}
                  </td>
                  <td className="py-6 px-6 md:px-8 align-top w-2/5">
                    {/* Business Products */}
                    {isBusinessOpen && (
                      <div className="flex flex-col gap-6 pt-2">
                        <div className="flex flex-col gap-2">
                          <span className="self-start px-2 py-0.5 rounded bg-purple-50 border border-purple-200 text-purple-700 text-[9px] font-extrabold uppercase tracking-widest">
                            Business Product
                          </span>
                          {renderProductCell(cliksBusiness)}
                        </div>
                      </div>
                    )}
                  </td>
                </tr>

                {/* Dynamic/Other custom products */}
                {otherProducts.map((p) => {
                  const isBiz = p.name.toUpperCase().includes('BUSINESS') || p.name.toUpperCase().includes('ENTERPRISE');
                  return (
                    <tr key={p.id} className="hover:bg-slate-50/40 transition-colors">
                      <td className="py-6 px-6 md:px-8 align-top w-1/5">
                        {isCategoryOpen && (
                          <span className="inline-block px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-extrabold uppercase tracking-widest">
                            Custom
                          </span>
                        )}
                      </td>
                      <td className="py-6 px-6 md:px-8 align-top w-2/5 border-r border-slate-100">
                        {!isBiz && isPublicOpen && (
                          <div className="flex flex-col gap-2">
                            <span className="self-start px-2 py-0.5 rounded bg-blue-50 border border-blue-200 text-blue-700 text-[9px] font-extrabold uppercase tracking-widest">
                              Public Product
                            </span>
                            {renderProductCell(p)}
                          </div>
                        )}
                      </td>
                      <td className="py-6 px-6 md:px-8 align-top w-2/5">
                        {isBiz && isBusinessOpen && (
                          <div className="flex flex-col gap-2">
                            <span className="self-start px-2 py-0.5 rounded bg-purple-50 border border-purple-200 text-purple-700 text-[9px] font-extrabold uppercase tracking-widest">
                              Business Product
                            </span>
                            {renderProductCell(p)}
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
