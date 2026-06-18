import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { 
  Plus, Edit, Trash, FileText, Mail, Users, Briefcase, Box, 
  LogOut, RefreshCw, CheckCircle, AlertCircle, X, Shield 
} from 'lucide-react';
import api from '../api';

export default function AdminDashboard() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('products');

  // Shared Data States
  const [products, setProducts] = useState([]);
  const [applications, setApplications] = useState([]);
  const [messages, setMessages] = useState([]);
  const [subscribers, setSubscribers] = useState([]);

  // Load States
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Modal States for Product Edit/Add
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null); // null if adding
  const [prodName, setProdName] = useState('');
  const [prodDesc, setProdDesc] = useState('');
  const [prodIcon, setProdIcon] = useState('Mail');
  const [prodStatus, setProdStatus] = useState('ACTIVE');
  const [prodFeatures, setProdFeatures] = useState(''); // Comma-separated
  const [isCustomName, setIsCustomName] = useState(false);


  // Redirect to login if user not authenticated
  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      if (activeTab === 'products') {
        const res = await api.get('/api/products');
        setProducts(res.data);
      } else if (activeTab === 'applications') {
        const res = await api.get('/api/careers/applications');
        setApplications(res.data);
      } else if (activeTab === 'messages') {
        const res = await api.get('/api/contact/messages');
        setMessages(res.data);
      } else if (activeTab === 'subscribers') {
        const res = await api.get('/api/newsletter/subscribers');
        setSubscribers(res.data);
      }
    } catch (err) {
      setError('Failed to fetch data from API server. Check if backend is active.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchData();
  }, [activeTab]);

  const openAddModal = () => {
    setEditingProduct(null);
    setProdName('');
    setProdDesc('');
    setProdIcon('Mail');
    setProdStatus('ACTIVE');
    setProdFeatures('');
    setIsCustomName(false);
    setIsModalOpen(true);
  };

  const openEditModal = (prod) => {
    setEditingProduct(prod);
    setProdName(prod.name);
    setProdDesc(prod.description);
    setProdIcon(prod.icon);
    setProdStatus(prod.status);
    setProdFeatures(prod.features.map(f => f.featureName).join(', '));
    const isStandard = ['BNX MAIL', 'B2AUTH SECURITY', 'CLIKS', 'CLIKS BUSINESS'].includes(prod.name);
    setIsCustomName(!isStandard);
    setIsModalOpen(true);
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    const featuresList = prodFeatures.split(',').map(f => f.trim()).filter(f => f.length > 0);

    const payload = {
      name: prodName,
      description: prodDesc,
      icon: prodIcon,
      status: prodStatus,
      features: featuresList
    };

    try {
      if (editingProduct) {
        // Edit
        await api.put(`/api/products/${editingProduct.id}`, payload);
        setSuccess('Product updated successfully.');
      } else {
        // Create
        await api.post('/api/products', payload);
        setSuccess('Product created successfully.');
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      setError('Product action failed.');
      console.error(err);
    }
  };

  const handleProductDelete = async (id) => {
    if (!window.confirm('Delete this product permanently?')) return;
    setError('');
    setSuccess('');
    try {
      await api.delete(`/api/products/${id}`);
      setSuccess('Product deleted.');
      fetchData();
    } catch (err) {
      setError('Deletion failed.');
    }
  };

  return (
    <div className="min-h-screen bg-dark-950 flex flex-col md:flex-row text-left">
      {/* Sidebar navigation */}
      <div className="w-full md:w-64 bg-slate-950 border-r border-slate-900 flex flex-col justify-between py-6">
        <div>
          <div className="px-6 mb-8 flex items-center space-x-2 text-white font-bold text-lg">
            <div className="p-1.5 bg-blue-600 rounded-lg">
              <Shield className="h-5 w-5" />
            </div>
            <span>BETA ADMIN</span>
          </div>

          <nav className="space-y-1 px-3">
            <button
              onClick={() => setActiveTab('products')}
              className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg text-sm font-semibold transition ${
                activeTab === 'products' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-900 hover:text-white'
              }`}
            >
              <Box className="h-4.5 w-4.5" />
              <span>Products Editor</span>
            </button>
            <button
              onClick={() => setActiveTab('applications')}
              className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg text-sm font-semibold transition ${
                activeTab === 'applications' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-900 hover:text-white'
              }`}
            >
              <Briefcase className="h-4.5 w-4.5" />
              <span>Job Applications</span>
            </button>
            <button
              onClick={() => setActiveTab('messages')}
              className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg text-sm font-semibold transition ${
                activeTab === 'messages' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-900 hover:text-white'
              }`}
            >
              <Mail className="h-4.5 w-4.5" />
              <span>Partner Inquiries</span>
            </button>
            <button
              onClick={() => setActiveTab('subscribers')}
              className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg text-sm font-semibold transition ${
                activeTab === 'subscribers' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-900 hover:text-white'
              }`}
            >
              <Users className="h-4.5 w-4.5" />
              <span>Subscribers</span>
            </button>
          </nav>
        </div>

        {/* User profile / Logout */}
        <div className="px-4 border-t border-slate-900 pt-6 space-y-4">
          <div className="flex items-center space-x-3">
            <div className="h-9 w-9 rounded-full bg-slate-800 flex items-center justify-center font-bold text-slate-300">
              AD
            </div>
            <div>
              <p className="text-sm font-bold text-white">Administrator</p>
              <p className="text-xs text-slate-500">{user?.username}</p>
            </div>
          </div>
          <button
            onClick={() => logout()}
            className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-bold bg-red-950/20 text-red-400 border border-red-900/40 hover:bg-red-900/30 transition"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Main Panel Content */}
      <div className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full">
        {/* Banner Alert messages */}
        {error && (
          <div className="mb-6 flex items-center space-x-2 text-rose-400 text-sm p-4 rounded-xl bg-rose-950/20 border border-rose-900/30">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="mb-6 flex items-center space-x-2 text-emerald-400 text-sm p-4 rounded-xl bg-emerald-950/20 border border-emerald-900/30">
            <CheckCircle className="h-5 w-5 flex-shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {/* Tab Headers */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              {activeTab === 'products' && 'Product Editor'}
              {activeTab === 'applications' && 'Job Applications'}
              {activeTab === 'messages' && 'Partnership Inquiries'}
              {activeTab === 'subscribers' && 'Newsletter Subscribers'}
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              {activeTab === 'products' && 'Manage Beta Softnet active products and listing features.'}
              {activeTab === 'applications' && 'Review incoming talent pools and download applicant resumes.'}
              {activeTab === 'messages' && 'Read prospective partner tracks and proposals.'}
              {activeTab === 'subscribers' && 'View subscribed company emails for marketing pushes.'}
            </p>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={fetchData}
              disabled={loading}
              className="p-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg text-slate-400 hover:text-white transition disabled:opacity-50"
            >
              <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
            </button>
            {activeTab === 'products' && (
              <button
                onClick={openAddModal}
                className="flex items-center space-x-2 px-4 py-2.5 rounded-lg text-sm font-semibold bg-blue-600 hover:bg-blue-500 text-white transition glow-btn-blue shadow-lg shadow-blue-500/10"
              >
                <Plus className="h-4 w-4" />
                <span>Add Product</span>
              </button>
            )}
          </div>
        </div>

        {/* Tab content bodies */}
        {loading ? (
          <div className="flex items-center justify-center py-20 text-slate-500 space-x-2">
            <RefreshCw className="h-5 w-5 animate-spin text-blue-500" />
            <span>Fetching database records...</span>
          </div>
        ) : (
          <>
            {/* 1. Products list view */}
            {activeTab === 'products' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {products.map(prod => (
                  <div key={prod.id} className="glass-card p-6 rounded-2xl border border-slate-850 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <span className="p-2 bg-slate-900 border border-slate-800 rounded-lg text-blue-400 font-bold text-xs">
                            {prod.icon}
                          </span>
                          <h3 className="text-lg font-bold text-white">{prod.name}</h3>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                          prod.status === 'ACTIVE' ? 'bg-emerald-950 text-emerald-400 border border-emerald-900' : 'bg-slate-900 text-slate-500'
                        }`}>
                          {prod.status}
                        </span>
                      </div>
                      <p className="text-slate-400 text-xs mb-4 leading-normal">{prod.description}</p>
                      
                      {/* Features */}
                      <div className="flex flex-wrap gap-1.5 mb-6">
                        {prod.features.map(f => (
                          <span key={f.id} className="px-2 py-0.5 rounded bg-slate-900 border border-slate-850 text-slate-300 text-[10px] font-medium">
                            {f.featureName}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-end space-x-2 border-t border-slate-900 pt-4">
                      <button
                        onClick={() => openEditModal(prod)}
                        className="flex items-center space-x-1.5 px-3 py-1.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 text-xs font-bold transition"
                      >
                        <Edit className="h-3.5 w-3.5" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleProductDelete(prod.id)}
                        className="flex items-center space-x-1.5 px-3 py-1.5 rounded bg-red-950/20 hover:bg-red-950/40 text-red-400 border border-red-900/30 text-xs font-bold transition"
                      >
                        <Trash className="h-3.5 w-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 2. Job applications view */}
            {activeTab === 'applications' && (
              <div className="glass-card rounded-2xl border border-slate-850 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-900/50 border-b border-slate-850 text-slate-400 text-xs uppercase tracking-wider font-bold">
                      <tr>
                        <th className="py-4 px-6">Name</th>
                        <th className="py-4 px-6">Position</th>
                        <th className="py-4 px-6">Contacts</th>
                        <th className="py-4 px-6">Date</th>
                        <th className="py-4 px-6">Resume</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-900/40 text-slate-300 text-xs">
                      {applications.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="py-8 text-center text-slate-500">No career applications found.</td>
                        </tr>
                      ) : (
                        applications.map(app => (
                          <tr key={app.id} className="hover:bg-slate-900/30">
                            <td className="py-4 px-6 font-semibold text-white">{app.fullName}</td>
                            <td className="py-4 px-6 text-blue-400 font-medium">{app.position}</td>
                            <td className="py-4 px-6 space-y-1">
                              <div>{app.email}</div>
                              <div className="text-slate-500">{app.phone}</div>
                            </td>
                            <td className="py-4 px-6 text-slate-500">
                              {new Date(app.appliedAt).toLocaleDateString()}
                            </td>
                            <td className="py-4 px-6">
                              <a
                                href={`http://localhost:8080${app.resumeUrl}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded bg-blue-950/40 text-blue-400 border border-blue-900/40 hover:bg-blue-900/40 transition font-bold"
                              >
                                <FileText className="h-3.5 w-3.5" />
                                <span>PDF Preview</span>
                              </a>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 3. Enquiry Messages view */}
            {activeTab === 'messages' && (
              <div className="space-y-4">
                {messages.length === 0 ? (
                  <div className="glass-card p-8 text-center text-slate-500 rounded-2xl border border-slate-850">
                    No partnership inquiries found in queue.
                  </div>
                ) : (
                  messages.map(msg => (
                    <div key={msg.id} className="glass-card p-6 rounded-2xl border border-slate-850 space-y-3">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                        <div>
                          <h3 className="text-sm font-bold text-white">{msg.name}</h3>
                          <p className="text-xs text-slate-500">
                            {msg.email} {msg.company ? `• Company: ${msg.company}` : ''}
                          </p>
                        </div>
                        <span className="text-xs text-slate-600">
                          {new Date(msg.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-slate-800 text-xs leading-relaxed bg-white border border-slate-200 p-4 rounded-xl">
                        {msg.message}
                      </p>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* 4. Newsletter Subscribers view */}
            {activeTab === 'subscribers' && (
              <div className="glass-card rounded-2xl border border-slate-850 overflow-hidden max-w-2xl text-left">
                <table className="w-full text-sm">
                  <thead className="bg-slate-900/50 border-b border-slate-850 text-slate-400 text-xs uppercase tracking-wider font-bold">
                    <tr>
                      <th className="py-4 px-6">Email Address</th>
                      <th className="py-4 px-6">Subscribed Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-900/40 text-slate-300 text-xs">
                    {subscribers.length === 0 ? (
                      <tr>
                        <td colSpan={2} className="py-8 text-center text-slate-500">No subscribers found in database.</td>
                      </tr>
                    ) : (
                      subscribers.map(sub => (
                        <tr key={sub.id} className="hover:bg-slate-900/30">
                          <td className="py-4 px-6 font-semibold text-white">{sub.email}</td>
                          <td className="py-4 px-6 text-slate-500">
                            {new Date(sub.subscribedAt).toLocaleString()}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal dialog for Product add/edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="relative w-full max-w-lg glass-card rounded-3xl p-6 md:p-8 border border-slate-800 shadow-2xl text-left">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute right-4 top-4 p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-xl font-extrabold text-white mb-6">
              {editingProduct ? 'Modify Product Specifications' : 'Insert New Product'}
            </h3>

            <form onSubmit={handleProductSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase">Product Name</label>
                {!isCustomName ? (
                  <select
                    required
                    value={prodName}
                    onChange={(e) => {
                      if (e.target.value === 'CUSTOM') {
                        setIsCustomName(true);
                        setProdName('');
                      } else {
                        setProdName(e.target.value);
                        // Auto-select icons for convenience
                        if (e.target.value === 'BNX MAIL') setProdIcon('Mail');
                        if (e.target.value === 'B2AUTH SECURITY') setProdIcon('Shield');
                        if (e.target.value === 'CLIKS') setProdIcon('User');
                        if (e.target.value === 'CLIKS BUSINESS') setProdIcon('Briefcase');
                      }
                    }}
                    className="w-full bg-slate-900 text-white border border-slate-800 rounded-lg py-2.5 px-3 focus:outline-none focus:border-blue-500 text-sm transition cursor-pointer"
                  >
                    <option value="">-- Select Product --</option>
                    <option value="BNX MAIL">BNX MAIL</option>
                    <option value="B2AUTH SECURITY">B2AUTH SECURITY</option>
                    <option value="CLIKS">CLIKS</option>
                    <option value="CLIKS BUSINESS">CLIKS BUSINESS</option>
                    <option value="CUSTOM">Custom Product...</option>
                  </select>
                ) : (
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      required
                      value={prodName}
                      onChange={(e) => setProdName(e.target.value)}
                      placeholder="e.g. BNX CHAT"
                      className="flex-grow bg-slate-900 text-white placeholder-slate-600 border border-slate-800 rounded-lg py-2 px-3 focus:outline-none focus:border-blue-500 text-sm transition"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setIsCustomName(false);
                        setProdName('');
                      }}
                      className="px-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-slate-300 hover:text-white transition text-xs font-bold"
                    >
                      Use Dropdown
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase">Description</label>
                <textarea
                  required
                  rows={3}
                  value={prodDesc}
                  onChange={(e) => setProdDesc(e.target.value)}
                  placeholder="Write details of the product..."
                  className="w-full bg-slate-900 text-white placeholder-slate-600 border border-slate-800 rounded-lg py-2 px-3 focus:outline-none focus:border-blue-500 text-sm transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 uppercase">Icon Class</label>
                  <select
                    value={prodIcon}
                    onChange={(e) => setProdIcon(e.target.value)}
                    className="w-full bg-slate-900 text-white border border-slate-800 rounded-lg py-2 px-3 focus:outline-none focus:border-blue-500 text-sm transition"
                  >
                    <option value="Mail">Mail / Inbox</option>
                    <option value="Shield">Shield / Lock</option>
                    <option value="User">User Profile</option>
                    <option value="Briefcase">Briefcase / Team</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 uppercase">Deployment Status</label>
                  <select
                    value={prodStatus}
                    onChange={(e) => setProdStatus(e.target.value)}
                    className="w-full bg-slate-900 text-white border border-slate-800 rounded-lg py-2 px-3 focus:outline-none focus:border-blue-500 text-sm transition"
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="BETA">BETA</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase">Features (Comma-separated)</label>
                <input
                  type="text"
                  required
                  value={prodFeatures}
                  onChange={(e) => setProdFeatures(e.target.value)}
                  placeholder="SMTP integration, Group inbox, WebSocket Sync"
                  className="w-full bg-slate-900 text-white placeholder-slate-600 border border-slate-800 rounded-lg py-2 px-3 focus:outline-none focus:border-blue-500 text-sm transition"
                />
                <p className="text-[10px] text-slate-500">Provide features separated by commas.</p>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition flex items-center justify-center space-x-2"
              >
                <span>{editingProduct ? 'Update Specifications' : 'Launch Product'}</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
