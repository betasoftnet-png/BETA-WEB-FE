import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart2, FileText, ShoppingBag, Briefcase, TrendingUp, ArrowUpRight,
  Plus, Search, Settings, HelpCircle, ChevronRight, X, Sparkles, Check,
  Coins, User, Calendar, CreditCard, Users, Shield, Receipt, DollarSign,
  Tag, Clock, Layers, Award, Percent, LayoutGrid, RotateCcw, Building2,
  MessageSquare, Send
} from 'lucide-react';

export default function CliksBusinessDashboard() {
  const location = useLocation();
  const [activeView, setActiveView] = useState(location.state?.activeView || 'dashboard');

  useEffect(() => {
    if (location.state?.activeView) {
      setActiveView(location.state.activeView);
    }
  }, [location.state]);
  // Financial States (Dynamic KPI values)
  const [salesRevenue, setSalesRevenue] = useState(0);
  const [purchases, setPurchases] = useState(0);
  const [expenses, setExpenses] = useState(0);
  const [customiseOpen, setCustomiseOpen] = useState(false);

  // Segmented Control State (Books, Payments, Social)
  const [activeSegment, setActiveSegment] = useState('Books');

  // Modal States
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [activeShowcaseModule, setActiveShowcaseModule] = useState(null);

  // Form inputs
  const [invoiceAmount, setInvoiceAmount] = useState('');
  const [invoiceClient, setInvoiceClient] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenseCategory, setExpenseCategory] = useState('Hosting & Cloud');
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');

  // Transactions list
  const [transactions, setTransactions] = useState([]);

  // Net Profit calculation
  const netProfit = salesRevenue - expenses;

  const handleCreateInvoice = (e) => {
    e.preventDefault();
    const amt = parseFloat(invoiceAmount);
    if (isNaN(amt) || amt <= 0) return;

    setSalesRevenue(prev => prev + amt);
    setTransactions(prev => [
      { id: Date.now(), type: 'INVOICE', desc: `Invoice to ${invoiceClient || 'Walk-in Client'}`, amount: amt, date: new Date().toLocaleDateString() },
      ...prev
    ]);

    setIsInvoiceModalOpen(false);
    setInvoiceAmount('');
    setInvoiceClient('');
  };

  const handleAddExpense = (e) => {
    e.preventDefault();
    const amt = parseFloat(expenseAmount);
    if (isNaN(amt) || amt <= 0) return;

    setExpenses(prev => prev + amt);
    setTransactions(prev => [
      { id: Date.now(), type: 'EXPENSE', desc: `Expense for ${expenseCategory}`, amount: -amt, date: new Date().toLocaleDateString() },
      ...prev
    ]);

    setIsExpenseModalOpen(false);
    setExpenseAmount('');
    setExpenseCategory('Hosting & Cloud');
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
    const price = parseFloat(productPrice);
    if (isNaN(price) || price <= 0 || !productName) return;

    setPurchases(prev => prev + price);
    setTransactions(prev => [
      { id: Date.now(), type: 'PRODUCT', desc: `Procured product: ${productName}`, amount: -price, date: new Date().toLocaleDateString() },
      ...prev
    ]);

    setIsProductModalOpen(false);
    setProductName('');
    setProductPrice('');
  };

  // Quick Action configuration mapping
  const quickActions = [
    { name: 'New Invoice', icon: FileText, color: 'text-emerald-500 bg-emerald-50 border-emerald-100 hover:bg-emerald-100/50', action: () => setIsInvoiceModalOpen(true) },
    { name: 'Sales Orders', icon: ShoppingBag, color: 'text-blue-500 bg-blue-50 border-blue-100 hover:bg-blue-100/50', action: () => setActiveShowcaseModule('Sales Orders') },
    { name: 'Add Product', icon: Plus, color: 'text-orange-500 bg-orange-50 border-orange-100 hover:bg-orange-100/50', action: () => setIsProductModalOpen(true) },
    { name: 'POS Billing', icon: CreditCard, color: 'text-teal-500 bg-teal-50 border-teal-100 hover:bg-teal-100/50', action: () => setActiveShowcaseModule('POS Billing Terminal') },
    { name: 'Add Expense', icon: TrendingUp, color: 'text-rose-500 bg-rose-50 border-rose-100 hover:bg-rose-100/50', action: () => setIsExpenseModalOpen(true) },
    { name: 'Attendance', icon: Clock, color: 'text-cyan-500 bg-cyan-50 border-cyan-100 hover:bg-cyan-100/50', action: () => setActiveShowcaseModule('Biometric Attendance Logs') },
    { name: 'Suppliers', icon: Users, color: 'text-purple-500 bg-purple-50 border-purple-100 hover:bg-purple-100/50', action: () => setActiveShowcaseModule('Supplier Registry') },
    { name: 'Add Customer', icon: User, color: 'text-pink-500 bg-pink-50 border-pink-100 hover:bg-pink-100/50', action: () => setActiveShowcaseModule('CRM Customer Hub') },
    { name: 'New Purchase PO', icon: Receipt, color: 'text-indigo-500 bg-indigo-50 border-indigo-100 hover:bg-indigo-100/50', action: () => setActiveShowcaseModule('Purchase Orders') },
    { name: 'Staff Claim', icon: DollarSign, color: 'text-rose-500 bg-rose-50 border-rose-100 hover:bg-rose-100/50', action: () => setActiveShowcaseModule('Reimbursement Claims') },
    { name: 'Onboard Staff', icon: User, color: 'text-emerald-500 bg-emerald-50 border-emerald-100 hover:bg-emerald-100/50', action: () => setActiveShowcaseModule('Employee Onboarding Pipeline') },
    { name: 'GST Records', icon: Percent, color: 'text-yellow-500 bg-yellow-50 border-yellow-100 hover:bg-yellow-100/50', action: () => setActiveShowcaseModule('Tax & GST Audit Desk') },
    { name: 'Marketing Hub', icon: Tag, color: 'text-red-500 bg-red-50 border-red-100 hover:bg-red-100/50', action: () => setActiveShowcaseModule('Marketing Campaigns') },
    { name: 'FIN-PRO Audit Hub', icon: Shield, color: 'text-blue-500 bg-blue-50 border-blue-100 hover:bg-blue-100/50', action: () => setActiveShowcaseModule('FIN-PRO Compliance Hub') },
    { name: 'Purchase Bills', icon: Layers, color: 'text-teal-500 bg-teal-50 border-teal-100 hover:bg-teal-100/50', action: () => setActiveShowcaseModule('Purchase Invoices & Bills') },
    { name: 'New Purchase Bill', icon: Plus, color: 'text-emerald-500 bg-emerald-50 border-emerald-100 hover:bg-emerald-100/50', action: () => setIsProductModalOpen(true) },
    { name: 'Purchase Returns', icon: RotateCcw, color: 'text-purple-500 bg-purple-50 border-purple-100 hover:bg-purple-100/50', action: () => setActiveShowcaseModule('Debit Notes & Returns') },
    { name: 'New Purchase Return', icon: X, color: 'text-red-500 bg-red-50 border-red-100 hover:bg-red-100/50', action: () => setActiveShowcaseModule('Add Return Items') },
  ];

  return (
    <div className="min-h-screen bg-[#f3f7f5] flex flex-col text-slate-800 antialiased font-sans select-none">

      {/* 1. TOP NAVBAR (Header) */}
      <header className="bg-[#004AAD] text-white px-4 h-16 flex items-center justify-between shadow-md z-40">

        {/* Brand Logo */}
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center text-[#004AAD] font-black text-xl shadow-inner">
            C
          </div>
          <span className="font-extrabold text-lg tracking-wider">
            Cliks Business
          </span>
        </div>

        {/* Central Segmented Controls */}
        <div className="bg-[#002b5c] p-1 rounded-full flex items-center space-x-0.5 border border-blue-950/20">
          {['Books', 'Payments', 'Social'].map(seg => (
            <button
              key={seg}
              onClick={() => setActiveSegment(seg)}
              className={`px-6 py-2 rounded-full text-xs font-bold transition-all duration-300 cursor-pointer ${activeSegment === seg
                  ? 'bg-[#003B8C] text-white shadow-inner'
                  : 'text-slate-300 hover:text-white'
                }`}
            >
              {seg}
            </button>
          ))}
        </div>

        {/* Right Search, Coins, Profile */}
        <div className="flex items-center space-x-4">
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-[#002b5c]/80 border border-blue-800/40 rounded-full py-1.5 pl-9 pr-4 text-xs text-white placeholder-blue-300/45 focus:outline-none focus:border-white focus:bg-[#001f44] transition w-44"
            />
          </div>

          {/* Points tracker */}
          <div className="flex items-center space-x-1.5 bg-[#002b5c]/90 border border-blue-800/40 rounded-full px-3 py-1 text-xs font-bold text-yellow-400">
            <Coins className="h-3.5 w-3.5" />
            <span>1,000 Pts</span>
          </div>

          {/* User profile dropdown button */}
          <div className="flex items-center space-x-2 bg-[#002b5c]/90 border border-blue-800/40 rounded-full px-3.5 py-1 text-xs font-bold hover:bg-[#001f44] transition cursor-pointer">
            <User className="h-3.5 w-3.5 text-slate-300" />
            <span>ashwin2911</span>
          </div>

          <div className="h-8 w-8 rounded-full bg-blue-700 flex items-center justify-center font-bold border border-blue-600">
            AD
          </div>
        </div>
      </header>

      {/* 2. MAIN LAYOUT: Sidebar + Content */}
      <div className="flex-1 flex overflow-hidden">

        {/* SIDEBAR */}
        <aside className="w-64 bg-white border-r border-[#e0e7e3] flex flex-col justify-between py-6 shrink-0 overflow-y-auto">

          <div className="space-y-6">

            <div className="px-4 space-y-2">
              <button
                onClick={() => {
                  setActiveView('dashboard');
                  setActiveShowcaseModule(null);
                }}
                className={`w-full px-4 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-3 border transition cursor-pointer ${activeView === 'dashboard'
                    ? 'bg-[#e2f0e8]/80 text-[#0f5132] border-emerald-100'
                    : 'bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900 border-transparent'
                  }`}
              >
                <LayoutGrid className={`h-4.5 w-4.5 ${activeView === 'dashboard' ? 'text-emerald-700' : 'text-slate-400'}`} />
                <span>Dashboard</span>
              </button>
              <button
                onClick={() => setIsInvoiceModalOpen(true)}
                className="w-full bg-[#004AAD] hover:bg-[#003c8a] text-white py-2.5 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 shadow shadow-blue-900/10 active:scale-[0.98] transition cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                <span>Generate Invoice</span>
              </button>
            </div>

            {/* Sidebar navigation categories */}
            <nav className="px-3 space-y-0.5">
              {[
                { name: 'Finance', hasChevron: true },
                { name: 'Sales', hasChevron: true },
                { name: 'Purchases', hasChevron: true },
                { name: 'Inventory', hasChevron: true },
                { name: 'HR', hasChevron: true },
                { name: 'POS Billing', hasChevron: false },
                { name: 'Reports', hasChevron: false },
                { name: 'FIN-PRO Audit Hub', hasChevron: false },
              ].map(item => (
                <button
                  key={item.name}
                  onClick={() => setActiveShowcaseModule(item.name)}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                >
                  <span className="tracking-wide">{item.name}</span>
                  {item.hasChevron && <ChevronRight className="h-3.5 w-3.5 text-slate-400" />}
                </button>
              ))}
            </nav>
          </div>

          {/* Premium Plan Banner + Bottom buttons */}
          <div className="px-4 space-y-4 pt-6 border-t border-slate-100">

            {/* Free Plan card */}
            <div className="bg-[#131e3d] text-white rounded-2xl p-4 relative overflow-hidden shadow-md">
              <div className="absolute -right-3 -bottom-3 w-16 h-16 bg-blue-500/10 rounded-full blur-xl" />
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-1.5 text-amber-400 font-bold text-xs">
                    <Award className="h-3.5 w-3.5" />
                    <span>Free Plan</span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-wider">Manage Plan</p>
                </div>
                <div className="bg-[#ffd23f]/10 border border-[#ffd23f]/30 rounded-full h-8 w-8 flex flex-col items-center justify-center text-amber-400 text-[9px] font-black leading-none">
                  <span>30</span>
                  <span className="text-[6px] uppercase">Days</span>
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <button
                onClick={() => setCustomiseOpen(true)}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer"
              >
                <div className="flex items-center space-x-3">
                  <Settings className="h-4.5 w-4.5 text-slate-400" />
                  <span>Settings</span>
                </div>
                <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
              </button>
              <button
                onClick={() => {
                  setActiveView('support');
                  setActiveShowcaseModule(null);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${activeView === 'support'
                    ? 'bg-[#e2f0e8]/80 text-[#0f5132] border-emerald-100'
                    : 'bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900 border-transparent'
                  }`}
              >
                <div className="flex items-center space-x-3">
                  <HelpCircle className={`h-4.5 w-4.5 ${activeView === 'support' ? 'text-emerald-700' : 'text-slate-400'}`} />
                  <span>Help & Support</span>
                </div>
                <ChevronRight className={`h-3.5 w-3.5 ${activeView === 'support' ? 'text-[#0f5132]' : 'text-slate-400'}`} />
              </button>
            </div>

          </div>
        </aside>

        {/* 3. MAIN DASHBOARD CONTENT AREA */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto space-y-8 max-w-6xl mx-auto w-full">

          {activeView === 'dashboard' ? (
            <>
              {/* Main Title Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="text-left">
                  <h1 className="text-3xl font-extrabold text-[#004AAD] tracking-tight">Business Overview</h1>
                  <p className="text-sm text-slate-500 mt-1">Monitor your enterprise performance and operations.</p>
                </div>

                {/* Customise Actions */}
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search analytics..."
                      className="bg-white border border-[#d2dcd6] rounded-xl py-2 pl-9 pr-4 text-xs text-slate-900 focus:outline-none focus:border-emerald-600 w-52 shadow-sm"
                    />
                  </div>
                  <button
                    onClick={() => setCustomiseOpen(true)}
                    className="bg-white border border-[#004AAD]/20 text-[#004AAD] hover:bg-blue-50 px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 shadow-sm active:scale-[0.98] transition cursor-pointer"
                  >
                    <Settings className="h-4 w-4" />
                    <span>Customise</span>
                  </button>
                </div>
              </div>

              {/* 4. KPI CARDS GRID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {[
                  { label: 'Total Sales Revenue', value: `₹${salesRevenue.toLocaleString()}`, icon: ShoppingBag, color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
                  { label: 'Total Purchases', value: `₹${purchases.toLocaleString()}`, icon: Briefcase, color: 'text-blue-600 bg-blue-50 border-blue-100' },
                  { label: 'Total Expenses', value: `₹${expenses.toLocaleString()}`, icon: TrendingUp, color: 'text-indigo-600 bg-indigo-50 border-indigo-100' },
                  { label: 'Est. Net Profit', value: `₹${netProfit.toLocaleString()}`, icon: ArrowUpRight, color: 'text-emerald-700 bg-emerald-50 border-emerald-100', isNetProfit: true },
                ].map((card, idx) => {
                  const IconComp = card.icon;
                  return (
                    <div
                      key={idx}
                      className="bg-white border border-[#e2e9e5] p-5 rounded-2xl shadow-sm flex flex-col justify-between items-start space-y-4 hover:shadow transition-shadow text-left relative overflow-hidden"
                    >
                      <div className="flex justify-between items-start w-full">
                        <div className={`p-2.5 rounded-xl ${card.color} border`}>
                          <IconComp className="h-5 w-5" />
                        </div>
                        <span className="text-[10px] font-bold bg-emerald-50 border border-emerald-100 text-[#0f5132] px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center space-x-1 shadow-sm">
                          <span className="h-1 w-1 bg-emerald-500 rounded-full animate-pulse" />
                          <span>Live</span>
                        </span>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{card.label}</p>
                        <h3 className={`text-2xl font-black mt-1 ${card.isNetProfit && netProfit < 0 ? 'text-rose-600' : 'text-slate-900'}`}>
                          {card.value}
                        </h3>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* 5. QUICK ACTION CENTER */}
              <div className="bg-white border border-[#e2e9e5] p-6 rounded-2xl shadow-sm space-y-6">
                <div className="text-left border-b border-slate-100 pb-4">
                  <h2 className="text-lg font-bold text-slate-900 tracking-tight">Quick Action Center</h2>
                  <p className="text-xs text-slate-500 mt-1">Direct access shortcuts to various business log operations.</p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {quickActions.map(act => {
                    const IconComp = act.icon;
                    return (
                      <button
                        key={act.name}
                        onClick={act.action}
                        className={`flex items-center space-x-2.5 px-3 py-2.5 border rounded-xl text-left transition duration-300 cursor-pointer ${act.color}`}
                      >
                        <IconComp className="h-4.5 w-4.5 shrink-0" />
                        <span className="text-xs font-bold tracking-tight whitespace-nowrap text-slate-800">{act.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 6. RECENT TRANSACTIONS TABLE */}
              {transactions.length > 0 && (
                <div className="bg-white border border-[#e2e9e5] rounded-2xl shadow-sm overflow-hidden text-left">
                  <div className="p-5 border-b border-slate-100 bg-slate-50/50">
                    <h3 className="font-bold text-slate-900 text-sm">Real-time Transaction Audit Log</h3>
                  </div>
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="bg-slate-50 text-slate-500 uppercase font-bold text-[10px] tracking-wider border-b border-slate-100">
                        <th className="py-3.5 px-5">Type</th>
                        <th className="py-3.5 px-5">Description</th>
                        <th className="py-3.5 px-5">Date</th>
                        <th className="py-3.5 px-5 text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-600 font-medium">
                      {transactions.map(tx => (
                        <tr key={tx.id} className="hover:bg-slate-50">
                          <td className="py-3 px-5">
                            <span className={`px-2 py-0.5 rounded font-bold text-[9px] uppercase ${tx.type === 'INVOICE'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                                : tx.type === 'EXPENSE'
                                  ? 'bg-rose-50 text-rose-700 border border-rose-100'
                                  : 'bg-blue-50 text-blue-700 border border-blue-100'
                              }`}>
                              {tx.type}
                            </span>
                          </td>
                          <td className="py-3 px-5">{tx.desc}</td>
                          <td className="py-3 px-5 text-slate-400">{tx.date}</td>
                          <td className={`py-3 px-5 text-right font-bold ${tx.amount > 0 ? 'text-emerald-600' : 'text-slate-900'}`}>
                            {tx.amount > 0 ? `+₹${tx.amount.toLocaleString()}` : `-₹${Math.abs(tx.amount).toLocaleString()}`}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          ) : (
            <HelpSupportView />
          )}

        </main>
      </div>

      {/* 7. MODALS AND INTERACTIVE OVERLAYS */}
      <AnimatePresence>

        {/* Generate Invoice Modal */}
        {isInvoiceModalOpen && (
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
              className="bg-white rounded-3xl p-6 md:p-8 w-full max-w-md border border-slate-200 shadow-2xl text-left"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-slate-900">Generate Business Invoice</h3>
                <button onClick={() => setIsInvoiceModalOpen(false)} className="p-1 hover:bg-slate-100 rounded-lg">
                  <X className="h-5 w-5 text-slate-400" />
                </button>
              </div>

              <form onSubmit={handleCreateInvoice} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Client / Debtor Name</label>
                  <input
                    type="text"
                    required
                    value={invoiceClient}
                    onChange={(e) => setInvoiceClient(e.target.value)}
                    placeholder="e.g. Acme Corp"
                    className="w-full bg-white text-slate-900 border border-slate-200 rounded-lg py-2.5 px-3 focus:outline-none focus:border-[#004AAD] text-xs transition"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Invoice Value (INR / ₹)</label>
                  <input
                    type="number"
                    required
                    value={invoiceAmount}
                    onChange={(e) => setInvoiceAmount(e.target.value)}
                    placeholder="e.g. 75000"
                    className="w-full bg-white text-slate-900 border border-slate-200 rounded-lg py-2.5 px-3 focus:outline-none focus:border-[#004AAD] text-xs transition"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-[#004AAD] hover:bg-[#003c8a] py-3 rounded-xl text-white text-xs font-bold transition flex items-center justify-center space-x-2"
                >
                  <Check className="h-4 w-4" />
                  <span>Generate & Record Invoice</span>
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}

        {/* Add Expense Modal */}
        {isExpenseModalOpen && (
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
              className="bg-white rounded-3xl p-6 md:p-8 w-full max-w-md border border-slate-200 shadow-2xl text-left"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-slate-900">Record Business Expense</h3>
                <button onClick={() => setIsExpenseModalOpen(false)} className="p-1 hover:bg-slate-100 rounded-lg">
                  <X className="h-5 w-5 text-slate-400" />
                </button>
              </div>

              <form onSubmit={handleAddExpense} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Expense Category</label>
                  <select
                    value={expenseCategory}
                    onChange={(e) => setExpenseCategory(e.target.value)}
                    className="w-full bg-white text-slate-900 border border-slate-200 rounded-lg py-2.5 px-3 focus:outline-none focus:border-[#004AAD] text-xs transition"
                  >
                    <option>Hosting & Cloud</option>
                    <option>Office Rent</option>
                    <option>Employee Payroll</option>
                    <option>Inventory Procurements</option>
                    <option>Marketing Hub Ad Spend</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Expense Value (INR / ₹)</label>
                  <input
                    type="number"
                    required
                    value={expenseAmount}
                    onChange={(e) => setExpenseAmount(e.target.value)}
                    placeholder="e.g. 15000"
                    className="w-full bg-white text-slate-900 border border-slate-200 rounded-lg py-2.5 px-3 focus:outline-none focus:border-[#0a5c36] text-xs transition"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-rose-600 hover:bg-rose-500 py-3 rounded-xl text-white text-xs font-bold transition flex items-center justify-center space-x-2"
                >
                  <Check className="h-4 w-4" />
                  <span>Log Expense Record</span>
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}

        {/* Add Product Modal */}
        {isProductModalOpen && (
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
              className="bg-white rounded-3xl p-6 md:p-8 w-full max-w-md border border-slate-200 shadow-2xl text-left"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-slate-900">Procure Product & Materials</h3>
                <button onClick={() => setIsProductModalOpen(false)} className="p-1 hover:bg-slate-100 rounded-lg">
                  <X className="h-5 w-5 text-slate-400" />
                </button>
              </div>

              <form onSubmit={handleAddProduct} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Product Name</label>
                  <input
                    type="text"
                    required
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    placeholder="e.g. SSD Server Storage Drives"
                    className="w-full bg-white text-slate-900 border border-slate-200 rounded-lg py-2.5 px-3 focus:outline-none focus:border-[#004AAD] text-xs transition"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Cost Value (INR / ₹)</label>
                  <input
                    type="number"
                    required
                    value={productPrice}
                    onChange={(e) => setProductPrice(e.target.value)}
                    placeholder="e.g. 50000"
                    className="w-full bg-white text-slate-900 border border-slate-200 rounded-lg py-2.5 px-3 focus:outline-none focus:border-[#004AAD] text-xs transition"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-orange-600 hover:bg-orange-500 py-3 rounded-xl text-white text-xs font-bold transition flex items-center justify-center space-x-2"
                >
                  <Check className="h-4 w-4" />
                  <span>Procure Product</span>
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}

        {/* Feature Showcase overlay desk */}
        {activeShowcaseModule && (
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
                  <h3 className="text-base font-black uppercase tracking-wide">{activeShowcaseModule}</h3>
                </div>
                <button onClick={() => setActiveShowcaseModule(null)} className="p-1 hover:bg-slate-100 rounded-lg">
                  <X className="h-5 w-5 text-slate-400" />
                </button>
              </div>

              <div className="space-y-3">
                <p className="text-xs text-slate-600 leading-relaxed">
                  This represents a live demo terminal module of **Cliks Business** built for the corporate website product showcase.
                </p>
                <div className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-xl text-left space-y-1.5 text-xs text-[#0f5132]">
                  <p className="font-bold">Module Diagnostics:</p>
                  <ul className="list-disc pl-4 space-y-1 text-slate-600">
                    <li>Gateway Status: <span className="font-bold text-emerald-600">Operational</span></li>
                    <li>Audit Compliance: <span className="font-bold text-emerald-600">Compliant</span></li>
                    <li>Dynamic Sandbox Node: Active</li>
                  </ul>
                </div>
              </div>

              <button
                onClick={() => setActiveShowcaseModule(null)}
                className="w-full bg-[#004AAD] hover:bg-[#003c8a] py-2.5 rounded-xl text-white text-xs font-bold transition flex items-center justify-center"
              >
                <span>Acknowledge</span>
              </button>
            </motion.div>
          </motion.div>
        )}

        {/* Customise Drawer popup */}
        {customiseOpen && (
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
                <h3 className="text-base font-black text-slate-900">Customise Layout Panels</h3>
                <button onClick={() => setCustomiseOpen(false)} className="p-1 hover:bg-slate-100 rounded-lg">
                  <X className="h-5 w-5 text-slate-400" />
                </button>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                Reorganise KPI cards or quick actions. Custom settings are synced with your company profiles.
              </p>

              <div className="space-y-2.5">
                {[
                  'Display Analytics Charts',
                  'Enable POS Billing Integrations',
                  'Sync Biometric Attendance to Payroll',
                  'Auto-Calculate GST filings'
                ].map(opt => (
                  <div key={opt} className="flex items-center space-x-2.5 text-xs text-slate-700">
                    <input type="checkbox" defaultChecked className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 rounded border-slate-300" />
                    <span>{opt}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setCustomiseOpen(false)}
                className="w-full bg-[#004AAD] hover:bg-[#003c8a] py-2.5 rounded-xl text-white text-xs font-bold transition"
              >
                <span>Save Layout Configurations</span>
              </button>
            </motion.div>
          </motion.div>
        )}

      </AnimatePresence>

    </div>
  );
}

function HelpSupportView() {
  const [expandedFaqIndex, setExpandedFaqIndex] = useState(null);
  const [supportSubject, setSupportSubject] = useState('');
  const [supportPriority, setSupportPriority] = useState('Medium - Performance/Glitch');
  const [supportExplanation, setSupportExplanation] = useState('');
  const [ticketSuccess, setTicketSuccess] = useState(false);

  const faqs = [
    {
      question: "How do I reset my password?",
      answer: "You can reset your password by going to the Settings page, clicking on Security, and selecting 'Reset Password'. We will send a secure password reset link to your registered email address."
    },
    {
      question: "Can I export my financial data?",
      answer: "Yes, you can export your financial data in CSV, Excel, or PDF formats. Go to the Reports tab or the Finance menu and click the export icon."
    },
    {
      question: "How do I add a new team member?",
      answer: "To add a new team member, navigate to the HR > Staff section in the sidebar. Click 'Add Staff Member' and enter their details and role permissions."
    },
    {
      question: "Is my data secure?",
      answer: "Absolutely. We use bank-grade 256-bit SSL encryption to protect your data both in transit and at rest. Multi-factor authentication is also supported."
    },
    {
      question: "Can I use the app offline?",
      answer: "Yes, Cliks Business has offline capability. You can record transactions, invoices, and expenses while offline, and they will automatically sync once your connection is restored."
    }
  ];

  const handleLodgeTicket = (e) => {
    e.preventDefault();
    if (!supportSubject || !supportExplanation) return;
    setTicketSuccess(true);
    setSupportSubject('');
    setSupportExplanation('');
    setTimeout(() => {
      setTicketSuccess(false);
    }, 4000);
  };

  return (
    <div className="space-y-8 text-left">
      {/* Title block */}
      <div className="space-y-3">
        <span className="bg-[#004AAD] text-white text-[10px] font-black uppercase px-3 py-1 rounded-full inline-block tracking-wider shadow-sm">
          HELP CENTER
        </span>
        <h1 className="text-3xl font-extrabold text-[#004AAD] tracking-tight">Help & Customer Support</h1>
        <p className="text-sm text-slate-500">Access common guides or log direct tickets to our dedicated customer support squad.</p>
      </div>

      {/* Grid container */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">

        {/* Left Column: Ticket Form */}
        <div className="bg-white border border-[#e2e9e5] p-6 rounded-3xl shadow-sm space-y-6 flex flex-col min-h-[460px]">
          <div className="flex items-center space-x-3 border-b border-slate-100 pb-4">
            <div className="p-2.5 rounded-xl text-emerald-600 bg-emerald-50 border border-emerald-100 shadow-sm">
              <MessageSquare className="h-5 w-5" />
            </div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">Open a Support Ticket</h2>
          </div>

          <AnimatePresence mode="wait">
            {ticketSuccess ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex-1 flex flex-col items-center justify-center py-12 px-4 text-center space-y-4"
              >
                <div className="h-16 w-16 bg-emerald-50 border border-emerald-100 rounded-full flex items-center justify-center text-emerald-600 shadow-sm">
                  <Check className="h-8 w-8 stroke-[3]" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-slate-900">Ticket Lodged Successfully!</h3>
                  <p className="text-xs text-slate-500 max-w-xs mx-auto">
                    Your request has been dispatched to our dedicated support specialist squad. We'll get back to you shortly.
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={handleLodgeTicket}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4 flex-1 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">ISSUE SUBJECT</label>
                    <input
                      type="text"
                      required
                      value={supportSubject}
                      onChange={(e) => setSupportSubject(e.target.value)}
                      placeholder="e.g. Invoicing tax breakdown looks wrong"
                      className="w-full bg-white text-slate-900 border border-slate-200 rounded-xl py-2.5 px-3.5 focus:outline-none focus:border-[#004AAD] text-xs transition duration-200"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">SEVERITY PRIORITY</label>
                    <div className="relative">
                      <select
                        value={supportPriority}
                        onChange={(e) => setSupportPriority(e.target.value)}
                        className="w-full bg-white text-slate-900 border border-slate-200 rounded-xl py-2.5 px-3.5 pr-10 focus:outline-none focus:border-[#004AAD] text-xs transition duration-200 appearance-none cursor-pointer"
                      >
                        <option>Low - Question/General</option>
                        <option>Medium - Performance/Glitch</option>
                        <option>High - Critical Outage</option>
                      </select>
                      <ChevronRight className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none transform rotate-90" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">DETAILED EXPLANATION</label>
                    <textarea
                      required
                      value={supportExplanation}
                      onChange={(e) => setSupportExplanation(e.target.value)}
                      placeholder="Please describe exactly what you were doing, what went wrong, and how our support specialists can assist you."
                      className="w-full bg-white text-slate-900 border border-slate-200 rounded-xl py-2.5 px-3.5 focus:outline-none focus:border-[#004AAD] text-xs transition duration-200 min-h-[120px] resize-y"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#004AAD] hover:bg-[#003c8a] py-3 rounded-xl text-white text-xs font-bold transition duration-200 flex items-center justify-center space-x-2 shadow shadow-blue-900/10 active:scale-[0.98] cursor-pointer mt-4"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>Lodge Support Ticket</span>
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>

        {/* Right Column: FAQ Accordion */}
        <div className="bg-white border border-[#e2e9e5] p-6 rounded-3xl shadow-sm space-y-6">
          <div className="flex items-center space-x-3 border-b border-slate-100 pb-4">
            <div className="p-2.5 rounded-xl text-blue-600 bg-blue-50 border border-blue-100 shadow-sm">
              <HelpCircle className="h-5 w-5" />
            </div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">Frequently Asked Questions</h2>
          </div>

          <div className="divide-y divide-slate-100">
            {faqs.map((faq, index) => {
              const isOpen = expandedFaqIndex === index;
              return (
                <div key={index} className="py-3.5 first:pt-0 last:pb-0">
                  <button
                    onClick={() => setExpandedFaqIndex(isOpen ? null : index)}
                    className="w-full flex justify-between items-center text-left py-2 focus:outline-none group cursor-pointer"
                  >
                    <span className="text-xs font-bold text-slate-700 group-hover:text-[#004AAD] transition-colors pr-4">
                      {faq.question}
                    </span>
                    <ChevronRight className={`h-4 w-4 text-slate-400 transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-90 text-[#004AAD]' : ''}`} />
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <p className="text-xs text-slate-500 pt-2 pb-1 pr-6 leading-relaxed">
                          {faq.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
