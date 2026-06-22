import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import { 
  Plus, Edit, Trash, FileText, Briefcase, LogOut, 
  RefreshCw, CheckCircle, AlertCircle, X, Shield, Users,
  Lock, Mail
} from 'lucide-react';
import axios from 'axios';

export default function AdminDashboard() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // Job Board States
  const [externalJobs, setExternalJobs] = useState([]);
  const [externalApplications, setExternalApplications] = useState([]);
  const [activeSubTab, setActiveSubTab] = useState('jobsList');
  const [selectedJobFilter, setSelectedJobFilter] = useState('All');
  const [selectedCoverLetter, setSelectedCoverLetter] = useState(null);

  // Job Posting/Editing Modal States
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null); // null if adding, job object if editing
  const [jobTitle, setJobTitle] = useState('');
  const [jobDept, setJobDept] = useState('');
  const [jobLocation, setJobLocation] = useState('');
  const [jobType, setJobType] = useState('Full-time');
  const [jobSalary, setJobSalary] = useState('');
  const [jobDesc, setJobDesc] = useState('');
  const [jobResponsibilities, setJobResponsibilities] = useState(['']);
  const [jobRequirements, setJobRequirements] = useState(['']);
  const [jobSkills, setJobSkills] = useState(['']);

  // Load/Alert States
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Admin credentials login states
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminError, setAdminError] = useState('');
  const [adminLoading, setAdminLoading] = useState(false);
  const { login } = useContext(AuthContext);

  const handleAdminSubmit = async (e) => {
    e.preventDefault();
    setAdminError('');
    setAdminLoading(true);

    try {
      const res = await login(adminUsername, adminPassword);
      if (!res.success) {
        setAdminError(res.message);
      }
    } catch (err) {
      setAdminError('Connection to security server failed.');
    } finally {
      setAdminLoading(false);
    }
  };

  // Load data only if authenticated as admin
  useEffect(() => {
    if (user && user.role === 'ROLE_ADMIN') {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const [jobsRes, appsRes] = await Promise.all([
        axios.get('https://apply.beta-softnet.com/api/jobs'),
        axios.get('https://apply.beta-softnet.com/api/applications')
      ]);
      setExternalJobs(jobsRes.data.data || jobsRes.data || []);
      
      const apps = appsRes.data.data || appsRes.data || [];
      const normalizedApps = apps.map(app => ({
        id: app.id,
        fullName: app.fullName || app.fullname || '',
        email: app.email || '',
        phone: app.phone || '',
        resumeUrl: app.resumeUrl || app.resumeurl || '',
        coverLetter: app.coverLetter || app.coverletter || '',
        status: app.status || '',
        createdAt: app.createdAt || app.createdat || '',
        jobTitle: app.jobTitle || app.jobtitle || '',
        jobDepartment: app.jobDepartment || app.jobdepartment || '',
        jobLocation: app.jobLocation || app.joblocation || ''
      }));
      setExternalApplications(normalizedApps);
    } catch (err) {
      setError('Failed to fetch jobs or applications from apply.beta-softnet.com.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleArrayChange = (index, value, array, setArray) => {
    const newArray = [...array];
    newArray[index] = value;
    setArray(newArray);
  };

  const addArrayField = (array, setArray) => {
    setArray([...array, '']);
  };

  const removeArrayField = (index, array, setArray) => {
    if (array.length === 1) {
      setArray(['']);
    } else {
      const newArray = array.filter((_, i) => i !== index);
      setArray(newArray);
    }
  };

  const openAddJobModal = () => {
    setEditingJob(null);
    setJobTitle('');
    setJobDept('');
    setJobLocation('');
    setJobType('Full-time');
    setJobSalary('');
    setJobDesc('');
    setJobResponsibilities(['']);
    setJobRequirements(['']);
    setJobSkills(['']);
    setIsJobModalOpen(true);
  };

  const openEditJobModal = (job) => {
    setEditingJob(job);
    setJobTitle(job.title);
    setJobDept(job.department);
    setJobLocation(job.location);
    setJobType(job.type || 'Full-time');
    setJobSalary(job.salary);
    setJobDesc(job.description);
    
    // Parse arrays (handling both parsed arrays and raw string representations)
    let resp = [''];
    let reqs = [''];
    let skillsList = [''];
    try {
      resp = Array.isArray(job.responsibilities) ? job.responsibilities : JSON.parse(job.responsibilities || '[]');
    } catch(e) { resp = [job.responsibilities || '']; }
    try {
      reqs = Array.isArray(job.requirements) ? job.requirements : JSON.parse(job.requirements || '[]');
    } catch(e) { reqs = [job.requirements || '']; }
    try {
      skillsList = Array.isArray(job.skills) ? job.skills : JSON.parse(job.skills || '[]');
    } catch(e) { skillsList = [job.skills || '']; }
    
    setJobResponsibilities(resp.length > 0 ? resp : ['']);
    setJobRequirements(reqs.length > 0 ? reqs : ['']);
    setJobSkills(skillsList.length > 0 ? skillsList : ['']);
    setIsJobModalOpen(true);
  };

  const handleJobSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    const responsibilities = jobResponsibilities.map(r => r.trim()).filter(r => r.length > 0);
    const requirements = jobRequirements.map(r => r.trim()).filter(r => r.length > 0);
    const skills = jobSkills.map(s => s.trim()).filter(s => s.length > 0);
    
    const payload = {
      title: jobTitle,
      department: jobDept,
      location: jobLocation,
      type: jobType,
      salary: jobSalary,
      description: jobDesc,
      responsibilities,
      requirements,
      skills
    };
    
    try {
      setLoading(true);
      if (editingJob) {
        await axios.put(`https://apply.beta-softnet.com/api/jobs/${editingJob.id}`, payload);
        setSuccess('Job opening updated successfully.');
      } else {
        await axios.post('https://apply.beta-softnet.com/api/jobs', payload);
        setSuccess('Job opening posted successfully.');
      }
      setIsJobModalOpen(false);
      fetchData();
    } catch (err) {
      setError(editingJob ? 'Failed to update job posting.' : 'Failed to post job opening.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleJobDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this job posting permanently? This will also remove any candidate applications for this role.')) return;
    setError('');
    setSuccess('');
    try {
      setLoading(true);
      await axios.delete(`https://apply.beta-softnet.com/api/jobs/${id}`);
      setSuccess('Job opening deleted successfully.');
      fetchData();
    } catch (err) {
      setError('Failed to delete job opening.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const isAuthorized = user && user.role === 'ROLE_ADMIN';

  if (!isAuthorized) {
    return (
      <div className="auth-white-theme min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12 text-left relative overflow-hidden w-full">
        {/* Background blobs */}
        <div className="absolute top-[30%] left-[20%] w-[300px] h-[300px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[30%] right-[20%] w-[300px] h-[300px] bg-cyan-600/10 rounded-full blur-[100px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md glass-card p-8 rounded-3xl border border-slate-200 shadow-2xl relative bg-white z-10"
        >
          {/* Header */}
          <div className="text-center space-y-2 mb-8">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center mx-auto text-white shadow-lg shadow-blue-500/20">
              <Lock className="h-5 w-5" />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Admin Portal</h2>
            <p className="text-slate-500 text-xs uppercase tracking-widest font-bold">Secure Gatekeeping</p>
          </div>

          {/* Form */}
          <form onSubmit={handleAdminSubmit} className="space-y-5">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Username / Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  required
                  value={adminUsername}
                  onChange={(e) => setAdminUsername(e.target.value)}
                  placeholder="admin@betasoftnet.com"
                  className="w-full bg-white text-slate-900 placeholder-slate-400 border border-slate-200 rounded-lg py-2 px-3 pl-10 focus:outline-none focus:border-blue-500 text-sm transition"
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-500 uppercase">Password</label>
                <a href="#" className="text-xs font-semibold text-[#004AAD] hover:text-[#003c8a] transition">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="password"
                  required
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
                  className="w-full bg-white text-slate-900 placeholder-slate-400 border border-slate-200 rounded-lg py-2 px-3 pl-10 focus:outline-none focus:border-blue-500 text-sm transition"
                />
              </div>
            </div>

            {adminError && (
              <div className="flex items-center space-x-2 text-rose-600 text-xs p-3 rounded-lg bg-rose-50 border border-rose-100">
                <AlertCircle className="h-4 w-4 flex-shrink-0 text-rose-500" />
                <span>{adminError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={adminLoading}
              className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition flex items-center justify-center space-x-2 disabled:bg-slate-400 cursor-pointer border-none outline-none"
            >
              {adminLoading ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin text-white" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <span>Login to Dashboard</span>
              )}
            </button>
          </form>

          {/* Credentials Tip */}
          <div className="mt-6 pt-4 border-t border-slate-200 text-center">
            <p className="text-xs text-slate-500 leading-normal">
              Demo Credentials:<br />
              <span className="font-semibold text-slate-700">admin@betasoftnet.com</span> / <span className="font-semibold text-slate-700">admin123</span>
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col md:flex-row text-left admin-light-theme relative">
      {/* Light Theme specific adjustments */}
      <style>{`
        .admin-light-theme {
          background-color: #F8FAFC !important;
          color: #1E293B !important;
        }
        .admin-light-theme h1, 
        .admin-light-theme h2, 
        .admin-light-theme h3, 
        .admin-light-theme h4, 
        .admin-light-theme h5, 
        .admin-light-theme h6 {
          color: #0F172A !important;
        }
        .admin-light-theme p {
          color: #475569 !important;
        }
        .admin-light-theme label {
          color: #475569 !important;
          font-weight: 600;
        }
        .admin-sidebar {
          background-color: #0F172A !important; /* Dark blue-slate sidebar for contrast */
          border-right: 1px solid #1E293B !important;
        }
        .admin-sidebar p, 
        .admin-sidebar span, 
        .admin-sidebar button {
          color: #94A3B8 !important;
        }
        .admin-sidebar button:hover {
          color: #FFFFFF !important;
        }
        .admin-glass-card {
          background: #FFFFFF !important;
          border: 1px solid rgba(226, 232, 240, 0.8) !important;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05) !important;
          transition: all 0.25s ease !important;
        }
        .admin-glass-card:hover {
          border-color: rgba(59, 130, 246, 0.4) !important;
          box-shadow: 0 10px 20px rgba(59, 130, 246, 0.08) !important;
          transform: translateY(-2px);
        }
        .admin-glow-btn {
          background: #004AAD !important;
          color: #FFFFFF !important;
          border: none !important;
          box-shadow: 0 4px 12px rgba(0, 74, 173, 0.2) !important;
          transition: all 0.2s ease !important;
        }
        .admin-glow-btn:hover {
          background: #003c8a !important;
          box-shadow: 0 6px 16px rgba(0, 74, 173, 0.3) !important;
        }
        .admin-custom-input {
          background-color: #FFFFFF !important;
          border: 1px solid #CBD5E1 !important;
          color: #0F172A !important;
        }
        .admin-custom-input:focus {
          border-color: #004AAD !important;
          box-shadow: 0 0 0 2px rgba(0, 74, 173, 0.15) !important;
        }
        .admin-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .admin-scrollbar::-webkit-scrollbar-track {
          background: #F8FAFC;
        }
        .admin-scrollbar::-webkit-scrollbar-thumb {
          background: #CBD5E1;
          border-radius: 10px;
        }
      `}</style>

      {/* Sidebar navigation */}
      <div className="w-full md:w-64 md:fixed md:top-0 md:bottom-0 md:left-0 md:h-screen admin-sidebar flex flex-col justify-between py-6 z-20">
        <div>
          <div className="px-6 mb-8 flex items-center space-x-2 text-white font-bold text-lg">
            <div className="p-1.5 bg-[#004AAD] rounded-lg">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <span className="text-white font-bold tracking-wider">
              BETA ADMIN
            </span>
          </div>

          <nav className="space-y-1 px-3">
            <button
              className="w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition bg-[#004AAD] text-white!"
              style={{ color: '#ffffff' }}
            >
              <Briefcase className="h-4.5 w-4.5 text-blue-200" />
              <span className="text-white font-bold">Job Board</span>
            </button>
          </nav>
        </div>

        {/* User profile / Logout */}
        <div className="px-4 border-t border-slate-800 pt-6 space-y-4">
          <div className="flex items-center space-x-3">
            <div className="h-9 w-9 rounded-full bg-slate-800 flex items-center justify-center font-bold text-slate-350">
              AD
            </div>
            <div>
              <p className="text-sm font-bold text-white">Administrator</p>
              <p className="text-xs text-slate-500 mt-1">{user?.username}</p>
            </div>
          </div>
          <button
            onClick={() => logout()}
            className="w-full flex items-center justify-center space-x-2 px-3 py-2.5 rounded-xl text-xs font-bold bg-red-950/20 text-red-400 border border-red-900/30 hover:bg-red-900/30 transition duration-200"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Main Panel Content */}
      <div className="flex-1 md:ml-64 p-6 md:p-10 max-w-7xl mx-auto w-full z-10 overflow-y-auto">
        {/* Banner Alert messages */}
        {error && (
          <div className="mb-6 flex items-center space-x-2 text-rose-600 text-sm p-4 rounded-xl bg-rose-50 border border-rose-200 animate-fadeIn font-semibold">
            <AlertCircle className="h-5 w-5 flex-shrink-0 text-rose-500" />
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="mb-6 flex items-center space-x-2 text-emerald-700 text-sm p-4 rounded-xl bg-emerald-50 border border-emerald-250 animate-fadeIn font-semibold">
            <CheckCircle className="h-5 w-5 flex-shrink-0 text-emerald-600" />
            <span>{success}</span>
          </div>
        )}

        {/* Tab Headers */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              External Job Board
            </h1>
            <p className="text-slate-550 text-sm mt-1">
              Post careers to apply.beta-softnet.com and manage candidate applications.
            </p>
          </div>

          <div className="flex space-x-3 self-start sm:self-auto">
            <button
              onClick={fetchData}
              disabled={loading}
              className="p-2.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-slate-500 hover:text-slate-700 transition disabled:opacity-50"
            >
              <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={openAddJobModal}
              className="flex items-center space-x-2 px-5 py-2.5 rounded-xl text-sm font-semibold admin-glow-btn"
            >
              <Plus className="h-4 w-4 text-white" />
              <span className="text-white">Post a Job</span>
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20 text-slate-500 space-x-2">
            <RefreshCw className="h-5 w-5 animate-spin text-blue-600" />
            <span>Syncing database records...</span>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Sub Tab Controls */}
            <div className="flex space-x-6 border-b border-slate-200 pb-3">
              <button
                onClick={() => setActiveSubTab('jobsList')}
                className={`pb-2 text-sm font-bold border-b-2 transition cursor-pointer ${
                  activeSubTab === 'jobsList' ? 'border-[#004AAD] text-[#004AAD]' : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Active Jobs ({externalJobs.length})
              </button>
              <button
                onClick={() => setActiveSubTab('appsList')}
                className={`pb-2 text-sm font-bold border-b-2 transition cursor-pointer ${
                  activeSubTab === 'appsList' ? 'border-[#004AAD] text-[#004AAD]' : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Candidate Applications ({externalApplications.length})
              </button>
            </div>

            {/* Sub Tab 1: Jobs list */}
            {activeSubTab === 'jobsList' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {externalJobs.length === 0 ? (
                  <div className="col-span-full admin-glass-card p-12 text-center text-slate-500 rounded-2xl bg-white border border-slate-200">
                    No active jobs found on the external board. Click "Post a Job" to post one!
                  </div>
                ) : (
                  externalJobs.map(job => (
                    <div key={job.id} className="admin-glass-card p-6 rounded-2xl flex flex-col justify-between text-left">
                      <div>
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <div>
                            <h3 className="text-lg font-bold text-slate-900 leading-snug">{job.title}</h3>
                            <div className="flex flex-wrap gap-1.5 mt-2">
                              <span className="px-2.5 py-0.5 rounded bg-slate-50 border border-slate-200 text-slate-600 text-[10px] font-semibold">
                                {job.department}
                              </span>
                              <span className="px-2.5 py-0.5 rounded bg-slate-50 border border-slate-200 text-slate-600 text-[10px] font-semibold">
                                {job.location}
                              </span>
                              <span className="px-2.5 py-0.5 rounded bg-slate-50 border border-slate-200 text-slate-600 text-[10px] font-semibold">
                                {job.type}
                              </span>
                            </div>
                          </div>
                          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg flex-shrink-0">
                            {job.salary}
                          </span>
                        </div>
                        
                        <p className="text-slate-600 text-xs mb-5 leading-relaxed line-clamp-3">
                          {job.description}
                        </p>

                        {job.skills && job.skills.length > 0 && (
                          <div className="mb-4">
                            <div className="text-[10px] uppercase font-bold text-slate-400 mb-1.5">Required Skills</div>
                            <div className="flex flex-wrap gap-1">
                              {job.skills.map((skill, idx) => (
                                <span key={idx} className="px-2.5 py-0.5 rounded bg-blue-50 border border-blue-100 text-[#004AAD] text-[10px] font-medium">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-2">
                        <span className="text-[10px] text-slate-400">
                          Posted on {new Date(job.createdat || job.createdAt).toLocaleDateString()}
                        </span>
                        
                        <div className="flex space-x-2">
                          <button
                            onClick={() => {
                              setSelectedJobFilter(job.title);
                              setActiveSubTab('appsList');
                            }}
                            className="px-2.5 py-1.5 rounded bg-slate-50 hover:bg-slate-100 text-[#004AAD] border border-slate-200 text-[10px] font-bold transition flex items-center space-x-1 cursor-pointer"
                            title="View applications for this job"
                          >
                            <Users className="h-3 w-3" />
                            <span>Apps</span>
                          </button>
                          
                          <button
                            onClick={() => openEditJobModal(job)}
                            className="p-1.5 rounded bg-slate-50 hover:bg-slate-100 text-[#004AAD] border border-slate-200 text-xs transition cursor-pointer"
                            title="Edit Job Opening"
                          >
                            <Edit className="h-3.5 w-3.5" />
                          </button>

                          <button
                            onClick={() => handleJobDelete(job.id)}
                            className="p-1.5 rounded bg-red-50 hover:bg-red-100 text-red-655 border border-red-200 text-xs transition cursor-pointer"
                            title="Delete Job"
                          >
                            <Trash className="h-3.5 w-3.5 text-red-500" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Sub Tab 2: Applications list */}
            {activeSubTab === 'appsList' && (
              <div className="space-y-4">
                {/* Filtering header */}
                <div className="flex items-center justify-between p-4 rounded-xl bg-white border border-slate-200">
                  <div className="text-slate-600 text-xs font-medium">
                    Showing {
                      (selectedJobFilter === 'All' 
                        ? externalApplications
                        : externalApplications.filter(app => app.jobTitle === selectedJobFilter)
                      ).length
                    } applications {selectedJobFilter !== 'All' && `for "${selectedJobFilter}"`}
                  </div>
                  <div className="flex items-center space-x-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Filter by Job:</label>
                    <select
                      value={selectedJobFilter}
                      onChange={(e) => setSelectedJobFilter(e.target.value)}
                      className="bg-white text-slate-850 border border-slate-250 rounded-lg py-1.5 px-3 focus:outline-none focus:border-blue-500 text-xs transition cursor-pointer"
                    >
                      <option value="All">All Jobs</option>
                      {Array.from(new Set(externalApplications.map(app => app.jobTitle))).map(title => (
                        <option key={title} value={title}>{title}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="admin-glass-card rounded-2xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider font-bold">
                        <tr>
                          <th className="py-4 px-6 font-bold">Candidate</th>
                          <th className="py-4 px-6 font-bold">Job Applied</th>
                          <th className="py-4 px-6 font-bold">Status</th>
                          <th className="py-4 px-6 font-bold">Date</th>
                          <th className="py-4 px-6 font-bold">Resume</th>
                          <th className="py-4 px-6 font-bold">Cover Letter</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-700 text-xs">
                        {(selectedJobFilter === 'All' 
                          ? externalApplications
                          : externalApplications.filter(app => app.jobTitle === selectedJobFilter)
                        ).length === 0 ? (
                          <tr>
                            <td colSpan={6} className="py-8 text-center text-slate-400 italic">No external applications found.</td>
                          </tr>
                        ) : (
                          (selectedJobFilter === 'All' 
                            ? externalApplications
                            : externalApplications.filter(app => app.jobTitle === selectedJobFilter)
                          ).map(app => (
                            <tr key={app.id} className="hover:bg-slate-50/50 transition-colors">
                              <td className="py-4 px-6">
                                <div className="font-bold text-slate-900">{app.fullName}</div>
                                <div className="text-slate-450 text-[10px] mt-0.5">{app.email}</div>
                              </td>
                              <td className="py-4 px-6">
                                <div className="font-semibold text-slate-900">{app.jobTitle}</div>
                                <div className="text-slate-450 text-[10px] mt-0.5">{app.jobDepartment} • {app.jobLocation}</div>
                              </td>
                              <td className="py-4 px-6">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold capitalize ${
                                  app.status === 'pending' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                                  app.status === 'approved' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                                  'bg-rose-50 text-rose-700 border border-rose-200'
                                }`}>
                                  {app.status}
                                </span>
                              </td>
                              <td className="py-4 px-6 text-slate-450">
                                {new Date(app.createdAt).toLocaleDateString()}
                              </td>
                              <td className="py-4 px-6">
                                {app.resumeUrl ? (
                                  <a
                                    href={app.resumeUrl.startsWith('http') ? app.resumeUrl : `https://apply.beta-softnet.com${app.resumeUrl}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded bg-blue-50 text-[#004AAD] border border-blue-100 hover:bg-blue-100 transition font-bold"
                                  >
                                    <FileText className="h-3.5 w-3.5 text-[#004AAD]" />
                                    <span>Download</span>
                                  </a>
                                ) : (
                                  <span className="text-slate-400 italic">No resume</span>
                                )}
                              </td>
                              <td className="py-4 px-6 max-w-xs">
                                <button
                                  onClick={() => setSelectedCoverLetter({
                                    candidate: app.fullName,
                                    job: app.jobTitle,
                                    text: app.coverLetter
                                  })}
                                  className="text-[#004AAD] hover:text-blue-800 font-semibold underline underline-offset-2 text-left line-clamp-2 cursor-pointer bg-transparent border-none p-0"
                                >
                                  {app.coverLetter}
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal dialog for Job Board posting / editing */}
      {isJobModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-xl bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-2xl text-left my-8 admin-scrollbar overflow-y-auto max-h-[90vh]">
            <button
              onClick={() => setIsJobModalOpen(false)}
              className="absolute right-4 top-4 p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-xl font-extrabold text-slate-900 mb-6">
              {editingJob ? 'Edit Job Opening' : 'Post a New Job'}
            </h3>

            <form onSubmit={handleJobSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase">Job Title</label>
                  <input
                    type="text"
                    required
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    placeholder="e.g. Senior Systems Engineer"
                    className="w-full admin-custom-input border border-slate-300 rounded-lg py-2 px-3 focus:outline-none text-sm transition"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase">Department</label>
                  <input
                    type="text"
                    
                    value={jobDept}
                    onChange={(e) => setJobDept(e.target.value)}
                    placeholder="e.g. Engineering"
                    className="w-full admin-custom-input border border-slate-300 rounded-lg py-2 px-3 focus:outline-none text-sm transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase">Location</label>
                  <input
                    type="text"
                    required
                    value={jobLocation}
                    onChange={(e) => setJobLocation(e.target.value)}
                    placeholder="e.g. Remote"
                    className="w-full admin-custom-input border border-slate-300 rounded-lg py-2 px-3 focus:outline-none text-sm transition"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase">Job Type</label>
                  <select
                    value={jobType}
                    onChange={(e) => setJobType(e.target.value)}
                    className="w-full admin-custom-input border border-slate-300 rounded-lg py-2.5 px-3 focus:outline-none text-sm transition cursor-pointer"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase">Salary Range</label>
                  <input
                    type="text"
                    value={jobSalary}
                    onChange={(e) => setJobSalary(e.target.value)}
                    placeholder="e.g. ₹10k - ₹15k"
                    className="w-full admin-custom-input border border-slate-300 rounded-lg py-2 px-3 focus:outline-none text-sm transition"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase">Description</label>
                <textarea
                  rows={3}
                  value={jobDesc}
                  onChange={(e) => setJobDesc(e.target.value)}
                  placeholder="We are seeking..."
                  className="w-full admin-custom-input border border-slate-300 rounded-lg py-2 px-3 focus:outline-none text-sm transition"
                />
              </div>

              {/* Responsibilities list */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold uppercase">Responsibilities</label>
                  <button
                    type="button"
                    onClick={() => addArrayField(jobResponsibilities, setJobResponsibilities)}
                    className="text-[10px] text-[#004AAD] hover:underline font-bold"
                  >
                    + Add item
                  </button>
                </div>
                <div className="space-y-2">
                  {jobResponsibilities.map((resp, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <input
                        type="text"
                        
                        value={resp}
                        onChange={(e) => handleArrayChange(idx, e.target.value, jobResponsibilities, setJobResponsibilities)}
                        placeholder={`Responsibility #${idx + 1}`}
                        className="flex-grow admin-custom-input border border-slate-300 rounded-lg py-1.5 px-3 focus:outline-none text-sm transition"
                      />
                      <button
                        type="button"
                        onClick={() => removeArrayField(idx, jobResponsibilities, setJobResponsibilities)}
                        className="p-1.5 bg-red-50 text-red-500 border border-red-200 rounded-lg hover:bg-red-100 transition"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Requirements list */}
              <div className="space-y-2 mt-4">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold uppercase">Requirements</label>
                  <button
                    type="button"
                    onClick={() => addArrayField(jobRequirements, setJobRequirements)}
                    className="text-[10px] text-[#004AAD] hover:underline font-bold"
                  >
                    + Add item
                  </button>
                </div>
                <div className="space-y-2">
                  {jobRequirements.map((req, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <input
                        type="text"
                        
                        value={req}
                        onChange={(e) => handleArrayChange(idx, e.target.value, jobRequirements, setJobRequirements)}
                        placeholder={`Requirement #${idx + 1}`}
                        className="flex-grow admin-custom-input border border-slate-300 rounded-lg py-1.5 px-3 focus:outline-none text-sm transition"
                      />
                      <button
                        type="button"
                        onClick={() => removeArrayField(idx, jobRequirements, setJobRequirements)}
                        className="p-1.5 bg-red-50 text-red-500 border border-red-200 rounded-lg hover:bg-red-100 transition"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Skills list */}
              <div className="space-y-2 mt-4">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold uppercase">Required Skills</label>
                  <button
                    type="button"
                    onClick={() => addArrayField(jobSkills, setJobSkills)}
                    className="text-[10px] text-[#004AAD] hover:underline font-bold"
                  >
                    + Add skill
                  </button>
                </div>
                <div className="space-y-2">
                  {jobSkills.map((skill, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <input
                        type="text"
                        
                        value={skill}
                        onChange={(e) => handleArrayChange(idx, e.target.value, jobSkills, setJobSkills)}
                        placeholder={`Skill #${idx + 1}`}
                        className="flex-grow admin-custom-input border border-slate-300 rounded-lg py-1.5 px-3 focus:outline-none text-sm transition"
                      />
                      <button
                        type="button"
                        onClick={() => removeArrayField(idx, jobSkills, setJobSkills)}
                        className="p-1.5 bg-red-50 text-red-500 border border-red-200 rounded-lg hover:bg-red-100 transition"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-6 py-2.5 rounded-xl admin-glow-btn text-white text-xs font-bold transition flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {loading ? <span>Saving...</span> : <span>{editingJob ? 'Save Changes' : 'Publish Job Opening'}</span>}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal for Cover Letter Preview */}
      {selectedCoverLetter && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-2xl text-left">
            <button
              onClick={() => setSelectedCoverLetter(null)}
              className="absolute right-4 top-4 p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-650 transition"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-xl font-extrabold text-slate-900 mb-2">
              Cover Letter
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Submitted by <strong className="text-slate-905">{selectedCoverLetter.candidate}</strong> for the position of <strong className="text-slate-905">{selectedCoverLetter.job}</strong>
            </p>

            <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl max-h-[60vh] overflow-y-auto admin-scrollbar">
              <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap no-override">
                {selectedCoverLetter.text}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
