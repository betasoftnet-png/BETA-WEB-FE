import { useContext, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import {
  Plus, Edit, Trash, FileText, Briefcase, LogOut,
  RefreshCw, CheckCircle, AlertCircle, X, Shield, Users,
  Lock, Mail, Calculator, Brain, BookOpen, BarChart3, Bell,
  Upload, Download, ChevronRight, Calendar, Sliders,
  Handshake, ArrowLeft, Clock, Award, MapPin
} from 'lucide-react';
import axios from 'axios';
import api from '../api';

const mapStatusToUI = (status) => {
  const s = (status || '').toLowerCase().trim();
  if (s === 'pending' || s === 'applied' || s === 'reviewed' || s === 'under review' || s === 'underreview' || s === 'candidates' || s === 'candidate') return 'Applied';
  if (s === 'round 1 aptitude' || s === 'round1aptitude' || s === 'aptitude') return 'Round 1 Aptitude';
  if (s === 'round 2 technical' || s === 'round2technical' || s === 'technical' || s === 'technical questions') return 'Round 2 Technical';
  if (s === 'round 3 brand awareness' || s === 'round3brandawareness' || s === 'brand awareness' || s === 'brand') return 'Round 3 Brand Awareness';
  if (s === 'shortlisted') return 'Shortlisted';
  if (s === 'scheduled' || s === 'interview scheduled' || s === 'interviewscheduled') return 'Interview Scheduled';
  if (s === 'approved' || s === 'selected' || s === 'accepted') return 'Accepted';
  if (s === 'rejected') return 'Rejected';
  if (s === 'joined') return 'Joined';
  return 'Applied';
};

const BACKEND_API_BASE =
  window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1'
    ? 'http://localhost:8081'
    : 'https://apply.beta-softnet.com';

const fallbackApps = [];
const fallbackPartnerships = [];
const fallbackSupports = [];


const parsePartnerMessage = (msg, name, email, company, id, date) => {
  if (!msg) return null;
  const isPartner = msg.includes('[Futuristic Partner Request]') || msg.includes('Partner Type:');
  if (!isPartner) return null;

  const getValue = (label) => {
    const regex = new RegExp(`${label}:\\s*(.*)`);
    const match = msg.match(regex);
    return match ? match[1].trim() : '';
  };

  return {
    id: id || Math.random().toString(),
    name: name || '',
    email: email || '',
    company: company || '',
    partnerType: getValue('Partner Type') || 'Technology Partner',
    website: getValue('Website') || 'N/A',
    companySize: getValue('Company Size') || 'N/A',
    marketFocus: getValue('Market Focus') || 'N/A',
    proposal: getValue('Proposal Summary') || msg,
    phone: getValue('Phone') || 'N/A',
    createdAt: date || new Date().toISOString()
  };
};



const parseSupportMessage = (msg, name, email, company, id, date) => {
  if (!msg) return null;
  const isPartner = msg.includes('[Futuristic Partner Request]') || msg.includes('Partner Type:');
  if (isPartner) return null;

  return {
    id: id || Math.random().toString(),
    name: name || '',
    email: email || '',
    product: (company || '').replace('Support Request - ', '').trim() || 'General Enquiry',
    message: msg,
    createdAt: date || new Date().toISOString()
  };
};



export default function AdminDashboard() {
  const { user, logout } = useContext(AuthContext);

  // Job Board States
  const [externalJobs, setExternalJobs] = useState([]);
  const [externalApplications, setExternalApplications] = useState([]);
  const [activeSubTab, setActiveSubTab] = useState(() => {
    return localStorage.getItem('admin_active_sub_tab') || 'appsList';
  });
  const [aptitudeSubTab, setAptitudeSubTab] = useState('dashboard');
  const [selectedDomainTab, setSelectedDomainTab] = useState('React');
  const [technicalSubTab, setTechnicalSubTab] = useState('dashboard');
  const [brandSubTab, setBrandSubTab] = useState('dashboard');
  const [selectedBrandDomainTab, setSelectedBrandDomainTab] = useState('BNX Mail');
  const [selectedJobFilter, setSelectedJobFilter] = useState('All');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState(() => {
    return localStorage.getItem('admin_selected_status_filter') || 'Applied';
  });
  const [selectedCoverLetter, setSelectedCoverLetter] = useState(null);
  const [partnerships, setPartnerships] = useState([]);
  const [supports, setSupports] = useState([]);
  const [selectedAptitudeCategory, setSelectedAptitudeCategory] = useState(null);
  const [selectedAptitudeQuestionIds, setSelectedAptitudeQuestionIds] = useState([]);
  const [selectedResumeUrl, setSelectedResumeUrl] = useState(null);
  const [selectedResumeCandidate, setSelectedResumeCandidate] = useState(null);

  useEffect(() => {
    localStorage.setItem('admin_active_sub_tab', activeSubTab);
  }, [activeSubTab]);

  useEffect(() => {
    if (activeSubTab === 'candidateDetails' && !selectedApplication) {
      setActiveSubTab('appsList');
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('admin_selected_status_filter', selectedStatusFilter);
  }, [selectedStatusFilter]);

  // Search & Filters State
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Notifications State
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [readAdminNotifIds, setReadAdminNotifIds] = useState(() => {
    try {
      const stored = localStorage.getItem('admin_read_notif_ids');
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  });

  // Assign Assessment Modal States
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedCandidateForAssessment, setSelectedCandidateForAssessment] = useState(null);
  const [allQuestions, setAllQuestions] = useState([]);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [questionsError, setQuestionsError] = useState('');
  const [selectedQuestionIds, setSelectedQuestionIds] = useState([]);
  const [assessmentDuration, setAssessmentDuration] = useState(30);
  const [assigningAssessment, setAssigningAssessment] = useState(false);
  const [assignError, setAssignError] = useState('');

  const updateAppsAndSync = (newApps) => {
    setExternalApplications(newApps);
    localStorage.setItem('beta_applications', JSON.stringify(newApps));
  };

  // Application details/status/interview states
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [interviewDate, setInterviewDate] = useState('');
  const [interviewTime, setInterviewTime] = useState('');
  const [interviewLink, setInterviewLink] = useState('https://meet.google.com/abc-defg-hij');
  const [hrInterviewDate, setHrInterviewDate] = useState('');
  const [hrInterviewTime, setHrInterviewTime] = useState('');
  const [hrInterviewLocation, setHrInterviewLocation] = useState('');
  const [schedulingMeeting, setSchedulingMeeting] = useState(false);
  const [savingHrInterview, setSavingHrInterview] = useState(false);
  const [interviewer, setInterviewer] = useState('Tech Team Lead');
  const [remarks, setRemarks] = useState('');
  const [fetchedQuestions, setFetchedQuestions] = useState(null);
  const [fetchingQuestions, setFetchingQuestions] = useState(false);
  const [selectedQuestionsForCandidate, setSelectedQuestionsForCandidate] = useState([]);
  const [sendingAssessment, setSendingAssessment] = useState(false);
  const [questionSearchQuery, setQuestionSearchQuery] = useState('');
  const [questionCategoryQuery, setQuestionCategoryQuery] = useState('All');

  // Task Assessment States
  const [taskDescription, setTaskDescription] = useState('');
  const [taskSendStatus, setTaskSendStatus] = useState(''); // 'success' | 'error' | ''
  const [taskSendMessage, setTaskSendMessage] = useState('');
  const [sendingTask, setSendingTask] = useState(false);
  const [fetchedTask, setFetchedTask] = useState(null);
  const [fetchedTaskStatus, setFetchedTaskStatus] = useState(null);

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
    } catch {
      setAdminError('Connection to security server failed.');
    } finally {
      setAdminLoading(false);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const [jobsRes, appsRes] = await Promise.all([
        axios.get(`${BACKEND_API_BASE}/api/jobs`),
        axios.get(`${BACKEND_API_BASE}/api/admin/applications`)
      ]);
      const jobsList = jobsRes.data.data || jobsRes.data || [];
      setExternalJobs(jobsList);

      // const applicationsList = appsRes.data.data || appsRes.data || [];

      // const activeApplications = applicationsList.filter(
      //   (application) => application.status !== "REJECTED"
      // );

      // console.log("Applications:", activeApplications);
      // setApplications(activeApplications);
      const apps = appsRes.data.data || appsRes.data || [];
      if (apps.length === 0) {
        const stored = localStorage.getItem('beta_applications');
        if (stored) {
          const parsed = JSON.parse(stored) || [];
          setExternalApplications(parsed);
        } else {
          setExternalApplications(fallbackApps);
          localStorage.setItem('beta_applications', JSON.stringify(fallbackApps));
        }
      } else {
        const normalizedApps = apps
          .map(app => {
            const matchedJob = jobsList.find(j => String(j.id) === String(app.jobId));

            return {
              id: app.id,
              fullName: app.fullName || app.fullname || '',
              email: app.email || '',
              phone: app.phone || '',
              resumeUrl: app.resume
                ? `${BACKEND_API_BASE}/uploads/${app.resume}`
                : (app.resumeUrl || app.resumeurl || ''),
              coverLetter: app.coverLetter || app.coverletter || '',
              status: (app.interviewDate && app.interviewDate !== 'null' && app.interviewDate !== 'undefined' && (app.status || '').toUpperCase() === 'PENDING')
                ? 'Interview Scheduled'
                : mapStatusToUI(app.status),
              createdAt: app.appliedDate || app.applieddate || app.createdAt || app.createdat || '',
              appliedDate: app.appliedDate || app.applieddate || app.createdAt || app.createdat || '',
              jobTitle: matchedJob ? matchedJob.title : (app.jobTitle || app.jobtitle || 'Unknown Position'),
              jobDepartment: matchedJob ? matchedJob.department : (app.jobDepartment || app.jobdepartment || 'Engineering'),
              jobLocation: matchedJob ? matchedJob.location : (app.jobLocation || app.joblocation || 'Remote'),
              interviewDate: app.interviewDate || app.interviewdate || '',
              interviewTime: app.interviewTime || app.interviewtime || '',
              hrInterviewDate: app.hrInterviewDate || app.hrinterviewdate || '',
              hrInterviewTime: app.hrInterviewTime || app.hrinterviewtime || '',
              hrInterviewLocation: app.hrInterviewLocation || app.hrinterviewlocation || '',
              aptitudeStatus: app.aptitudeStatus || app.aptitudestatus || '',
              aptitudeScore: app.aptitudeScore !== undefined && app.aptitudeScore !== null ? app.aptitudeScore : (app.aptitudescore !== undefined && app.aptitudescore !== null ? app.aptitudescore : ''),
              assessmentTimeTaken: app.assessmentTimeTaken || app.assessmenttimetaken || '',
              experience: app.experience || '3 Years',
              githubLink: app.githubLink || app.githublink || ''
            };
          });

        setExternalApplications(normalizedApps);
        localStorage.setItem('beta_applications', JSON.stringify(normalizedApps));
      }
    } catch (fetchErr) {
      console.warn('Failed to fetch from live API. Loading fallback local data.', fetchErr);
      const stored = localStorage.getItem('beta_applications');
      if (stored) {
        const parsed = JSON.parse(stored) || [];
        setExternalApplications(parsed);
      } else {
        setExternalApplications(fallbackApps);
        localStorage.setItem('beta_applications', JSON.stringify(fallbackApps));
      }
    }

    try {
      const contactRes = await api.get('/api/contact');
      const list = contactRes.data.data || contactRes.data || [];

      const parsedPartners = list
        .map(item => parsePartnerMessage(item.message, item.name, item.email, item.company, item.id || item._id, item.createdAt))
        .filter(Boolean);
      setPartnerships(parsedPartners.length > 0 ? parsedPartners : fallbackPartnerships);

      const parsedSupports = list
        .map(item => parseSupportMessage(item.message, item.name, item.email, item.company, item.id || item._id, item.createdAt))
        .filter(Boolean);
      setSupports(parsedSupports.length > 0 ? parsedSupports : fallbackSupports);
    } catch (err) {
      try {
        const contactRes = await api.get('/api/contacts');
        const list = contactRes.data.data || contactRes.data || [];

        const parsedPartners = list
          .map(item => parsePartnerMessage(item.message, item.name, item.email, item.company, item.id || item._id, item.createdAt))
          .filter(Boolean);
        setPartnerships(parsedPartners.length > 0 ? parsedPartners : fallbackPartnerships);

        const parsedSupports = list
          .map(item => parseSupportMessage(item.message, item.name, item.email, item.company, item.id || item._id, item.createdAt))
          .filter(Boolean);
        setSupports(parsedSupports.length > 0 ? parsedSupports : fallbackSupports);
      } catch (err2) {
        // Fall back to offline mock datasets silently
        setPartnerships(fallbackPartnerships);
        setSupports(fallbackSupports);
      }
    }

    setLoading(false);
  };

  // Load data only if authenticated as admin
  useEffect(() => {
    if (user && user.role === 'ROLE_ADMIN') {
      fetchData();
    }
  }, [user]);

  // Silent background polling — re-fetches applications every 20s so scores/statuses update automatically
  useEffect(() => {
    if (!user || user.role !== 'ROLE_ADMIN') return;

    const silentRefetch = async () => {
      try {
        const [jobsRes, appsRes] = await Promise.all([
          axios.get(`${BACKEND_API_BASE}/api/jobs`),
          axios.get(`${BACKEND_API_BASE}/api/admin/applications`)
        ]);
        const jobsList = jobsRes.data.data || jobsRes.data || [];
        const apps = appsRes.data.data || appsRes.data || [];
        if (apps.length > 0) {
          const normalizedApps = apps.map(app => {
            const matchedJob = jobsList.find(j => String(j.id) === String(app.jobId));
            return {
              id: app.id,
              fullName: app.fullName || app.fullname || '',
              email: app.email || '',
              phone: app.phone || '',
              resumeUrl: app.resume
                ? `${BACKEND_API_BASE}/uploads/${app.resume}`
                : (app.resumeUrl || app.resumeurl || ''),
              coverLetter: app.coverLetter || app.coverletter || '',
              status: (app.interviewDate && app.interviewDate !== 'null' && app.interviewDate !== 'undefined' && (app.status || '').toUpperCase() === 'PENDING')
                ? 'Interview Scheduled'
                : mapStatusToUI(app.status),
              createdAt: app.appliedDate || app.applieddate || app.createdAt || app.createdat || '',
              appliedDate: app.appliedDate || app.applieddate || app.createdAt || app.createdat || '',
              jobTitle: matchedJob ? matchedJob.title : (app.jobTitle || app.jobtitle || 'Unknown Position'),
              jobDepartment: matchedJob ? matchedJob.department : (app.jobDepartment || app.jobdepartment || 'Engineering'),
              jobLocation: matchedJob ? matchedJob.location : (app.jobLocation || app.joblocation || 'Remote'),
              interviewDate: app.interviewDate || app.interviewdate || '',
              interviewTime: app.interviewTime || app.interviewtime || '',
              hrInterviewDate: app.hrInterviewDate || app.hrinterviewdate || '',
              hrInterviewTime: app.hrInterviewTime || app.hrinterviewtime || '',
              hrInterviewLocation: app.hrInterviewLocation || app.hrinterviewlocation || '',
              aptitudeStatus: app.aptitudeStatus || app.aptitudestatus || '',
              aptitudeScore: app.aptitudeScore !== undefined && app.aptitudeScore !== null ? app.aptitudeScore : (app.aptitudescore !== undefined && app.aptitudescore !== null ? app.aptitudescore : ''),
              assessmentTimeTaken: app.assessmentTimeTaken || app.assessmenttimetaken || '',
              experience: app.experience || '3 Years',
              githubLink: app.githubLink || app.githublink || ''
            };
          });
          setExternalApplications(normalizedApps);
          localStorage.setItem('beta_applications', JSON.stringify(normalizedApps));
        }
      } catch (_) {
        // Silent — don't show error on background poll
      }
    };

    const pollInterval = setInterval(silentRefetch, 20000);
    return () => clearInterval(pollInterval);
  }, [user]);


  useEffect(() => {
    if (selectedApplication) {
      setRemarks(selectedApplication.remarks || '');
      setInterviewDate(selectedApplication.interviewDate || '');
      setInterviewTime(selectedApplication.interviewTime || '');
      setInterviewLink(selectedApplication.interviewLink || 'https://meet.google.com/abc-defg-hij');
      setHrInterviewDate(selectedApplication.hrInterviewDate || '');
      setHrInterviewTime(selectedApplication.hrInterviewTime || '');
      setHrInterviewLocation(selectedApplication.hrInterviewLocation || 'Beta Towers, No. 12, Main Road, Tiruvallur, Tamil Nadu 602001, India');
      setFetchedQuestions(null);
      setSelectedQuestionsForCandidate([]);
      const normStatus = mapStatusToUI(selectedApplication.status);
      if (normStatus === 'Accepted' || selectedStatusFilter === 'Accepted') {
        setActiveSubTab('candidateDetails');
      }
    } else {
      setRemarks('');
      setInterviewDate('');
      setInterviewTime('');
      setInterviewLink('https://meet.google.com/abc-defg-hij');
      setHrInterviewDate('');
      setHrInterviewTime('');
      setHrInterviewLocation('');
      setFetchedQuestions(null);
      setSelectedQuestionsForCandidate([]);
    }
  }, [selectedApplication, selectedStatusFilter]);

  useEffect(() => {
    const fetchCandidateTask = async () => {
      if (!selectedApplication) {
        setFetchedTask(null);
        setFetchedTaskStatus(null);
        return;
      }
      try {
        const response = await axios.get(`${BACKEND_API_BASE}/api/task-assessment/${selectedApplication.id}`);
        setFetchedTask(response.data?.taskDescription || null);
        setFetchedTaskStatus(response.data?.status || null);
      } catch (err) {
        const localVal = localStorage.getItem(`task_assessment_${selectedApplication.id}`);
        setFetchedTask(localVal || null);
        setFetchedTaskStatus(localVal ? 'ASSIGNED' : null);
      }
    };
    fetchCandidateTask();
  }, [selectedApplication]);

  useEffect(() => {
    if (externalApplications.length > 0) {
      // Sort applications by ID descending so the newest candidate applications appear first in alerts
      const sortedApplications = [...externalApplications].sort((a, b) => b.id - a.id);

      const newApps = sortedApplications.filter(app => app.status === 'Candidates').slice(0, 3);
      const scheduled = sortedApplications.filter(app => app.status === 'Interview Scheduled' || app.aptitudeStatus === 'Assessment Sent').slice(0, 2);

      const sysId = 'sys-1';
      const list = [
        {
          id: sysId,
          type: 'system',
          title: 'Database connection online',
          message: 'Local mock storage sync complete.',
          time: 'Just now',
          unread: !readAdminNotifIds.includes(sysId)
        }
      ];

      newApps.forEach((app, idx) => {
        const notifId = `newapp-${app.id}-${idx}`;
        list.push({
          id: notifId,
          type: 'application',
          title: 'New Candidate Application',
          message: `${app.fullName} applied for ${app.jobTitle}`,
          time: '1 hour ago',
          unread: !readAdminNotifIds.includes(notifId)
        });
      });

      scheduled.forEach((app, idx) => {
        const notifId = `sch-${app.id}-${idx}`;
        list.push({
          id: notifId,
          type: 'reminder',
          title: 'Upcoming Assessment / Interview',
          message: `Interview reminder for ${app.fullName} (${app.jobTitle})`,
          time: app.interviewDate ? `${app.interviewDate} at ${app.interviewTime || '10:00'}` : 'Scheduled soon',
          unread: !readAdminNotifIds.includes(notifId)
        });
      });

      setNotifications(list);
    }
  }, [externalApplications, readAdminNotifIds]);

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
    let resp;
    let reqs;
    let skillsList;
    try {
      resp = Array.isArray(job.responsibilities) ? job.responsibilities : JSON.parse(job.responsibilities || '[]');
    } catch { resp = [job.responsibilities || '']; }
    try {
      reqs = Array.isArray(job.requirements) ? job.requirements : JSON.parse(job.requirements || '[]');
    } catch { reqs = [job.requirements || '']; }
    try {
      skillsList = Array.isArray(job.skills) ? job.skills : JSON.parse(job.skills || '[]');
    } catch { skillsList = [job.skills || '']; }

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
        await axios.put(`${BACKEND_API_BASE}/api/jobs/${editingJob.id}`, payload);
        setSuccess('Job opening updated successfully.');
      } else {
        await axios.post(`${BACKEND_API_BASE}/api/jobs`, payload);
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
      await axios.delete(`${BACKEND_API_BASE}/api/jobs/${id}`);
      setSuccess('Job opening deleted successfully.');
      fetchData();
    } catch (err) {
      setError('Failed to delete job opening.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePartnerDismiss = async (id) => {
    if (!window.confirm('Are you sure you want to dismiss this partnership request?')) return;
    setError('');
    setSuccess('');
    try {
      setLoading(true);
      try {
        await api.delete(`/api/contact/${id}`);
      } catch {
        await api.delete(`/api/contacts/${id}`);
      }
      setSuccess('Partnership request dismissed successfully.');
    } catch (err) {
      console.warn('API deletion failed. Dismissing locally.', err);
      setSuccess('Partnership request dismissed.');
    } finally {
      setPartnerships(prev => prev.filter(p => p.id !== id));
      setLoading(false);
      setTimeout(() => setSuccess(''), 3000);
    }
  };

  const handleSupportDismiss = async (id) => {
    if (!window.confirm('Are you sure you want to resolve / dismiss this support request?')) return;
    setError('');
    setSuccess('');
    try {
      setLoading(true);
      try {
        await api.delete(`/api/contact/${id}`);
      } catch {
        await api.delete(`/api/contacts/${id}`);
      }
      setSuccess('Support ticket resolved successfully.');
    } catch (err) {
      console.warn('API deletion failed. Dismissing locally.', err);
      setSuccess('Support ticket resolved.');
    } finally {
      setSupports(prev => prev.filter(s => s.id !== id));
      setLoading(false);
      setTimeout(() => setSuccess(''), 3000);
    }
  };

  const handleAssignQuestions = (appId) => {
    const candidate = externalApplications.find(app => app.id === appId);
    if (!candidate) return;

    if (selectedAptitudeQuestionIds.length === 0) {
      alert('Please select at least one question first!');
      return;
    }

    const assignedKey = `assessment_questions_${appId}`;
    const selectedQuestions = generateAptitudeQuestions(selectedAptitudeCategory)
      .filter(q => selectedAptitudeQuestionIds.includes(q.id));

    localStorage.setItem(assignedKey, JSON.stringify(selectedQuestions));

    const updatedApps = externalApplications.map(app =>
      app.id === appId ? { ...app, aptitudeStatus: 'Assessment Sent' } : app
    );
    updateAppsAndSync(updatedApps);

    setSuccess(`Assessment successfully sent to ${candidate.fullName}. Status updated to "Assessment Sent".`);
    setSelectedAptitudeQuestionIds([]);
    setSelectedAptitudeCategory(null);
    setTimeout(() => setSuccess(''), 4000);
  };

  const fetchAllQuestions = async () => {
    setLoadingQuestions(true);
    setQuestionsError('');
    try {
      const response = await axios.get(`${BACKEND_API_BASE}/api/questions`);
      setAllQuestions(response.data || []);
    } catch (err) {
      console.error('Error fetching questions:', err);
      setQuestionsError('Failed to load questions from database.');
    } finally {
      setLoadingQuestions(false);
    }
  };

  const handleOpenAssignModal = (candidate) => {
    setSelectedCandidateForAssessment(candidate);
    setIsAssignModalOpen(true);
    setSelectedQuestionIds([]);
    setAssessmentDuration(30);
    setAssignError('');
    fetchAllQuestions();
  };

  const handleToggleQuestion = (questionId) => {
    setSelectedQuestionIds(prev =>
      prev.includes(questionId)
        ? prev.filter(id => id !== questionId)
        : [...prev, questionId]
    );
  };

  const handleSendAssessment = async () => {
    if (selectedQuestionIds.length === 0) {
      setAssignError('Please select at least one question.');
      return;
    }

    const durationNum = parseInt(assessmentDuration);
    if (!assessmentDuration || isNaN(durationNum) || durationNum <= 0) {
      setAssignError('Please enter a valid assessment duration (in minutes).');
      return;
    }

    // Filter duplicate IDs (redundant safeguard)
    const uniqueQuestionIds = Array.from(new Set(selectedQuestionIds));

    setAssigningAssessment(true);
    setAssignError('');
    try {
      const payload = {
        candidateId: selectedCandidateForAssessment.id,
        questionIds: uniqueQuestionIds,
        duration: durationNum
      };

      // 1. Submit assignment to backend
      await axios.post(`${BACKEND_API_BASE}/api/assessment/send`, payload);

      // 3. Update local state (preserving existing status)
      const updatedApps = externalApplications.map(app =>
        app.id === selectedCandidateForAssessment.id
          ? { ...app, aptitudeStatus: 'Assessment Sent' }
          : app
      );
      updateAppsAndSync(updatedApps);

      if (selectedApplication && selectedApplication.id === selectedCandidateForAssessment.id) {
        setSelectedApplication(prev => ({ ...prev, aptitudeStatus: 'Assessment Sent' }));
      }

      setSuccess(`Assessment successfully assigned to ${selectedCandidateForAssessment.fullName}.`);
      setIsAssignModalOpen(false);
      setSelectedCandidateForAssessment(null);
      setSelectedQuestionIds([]);
      setAssessmentDuration(30);
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      console.error('Error assigning assessment:', err);
      const errMsg = err.response?.data || 'Failed to assign assessment. Please try again.';
      setAssignError(typeof errMsg === 'string' ? errMsg : JSON.stringify(errMsg));
    } finally {
      setAssigningAssessment(false);
    }
  };

  const handleUpdateStatus = async (appId, newStatus) => {
    if (newStatus === 'Rejected') {
      if (!window.confirm('Are you sure you want to reject this candidate?')) return;
    }
    if (newStatus === 'Accepted') {
      if (!window.confirm('Are you sure you want to accept this candidate?')) return;
    }
    if (newStatus === 'Joined') {
      if (!window.confirm('Are you sure you want to mark this candidate as Joined?')) return;
    }
    setError('');
    setSuccess('');

    let backendStatus = newStatus;
    if (newStatus === 'Accepted') backendStatus = 'ACCEPTED';
    if (newStatus === 'Rejected') backendStatus = 'REJECTED';
    if (newStatus === 'Joined') backendStatus = 'JOINED';
    if (newStatus === 'Shortlisted') backendStatus = 'SHORTLISTED';
    if (newStatus === 'Interview Scheduled') backendStatus = 'SCHEDULED';
    if (newStatus === 'Interview Completed') backendStatus = 'REVIEWED';
    if (newStatus === 'Candidates') backendStatus = 'PENDING';

    try {
      setLoading(true);
      await axios.put(`${BACKEND_API_BASE}/api/admin/applications/${appId}/status`, { status: backendStatus });
      if (newStatus === 'Rejected') {
        setSuccess(`Candidate status updated to ${newStatus}. Notification email sent.`);
      } else {
        setSuccess(`Candidate status updated to ${newStatus}.`);
      }
    } catch {
      console.warn('API update failed. Updating locally in state.');
      if (newStatus === 'Rejected') {
        setSuccess(`Candidate status updated to ${newStatus}. (Candidate email notification sent)`);
      } else {
        setSuccess(`Candidate status updated to ${newStatus}.`);
      }
    } finally {
      // Always update locally and sync
      const updated = externalApplications.map(app => app.id === appId ? { ...app, status: newStatus } : app);
      updateAppsAndSync(updated);
      if (selectedApplication) {
        setSelectedApplication(prev => ({ ...prev, status: newStatus }));
      }
      setLoading(false);
    }
  };

  const fetchTechnicalQuestions = async () => {
    if (!selectedApplication) return;
    setFetchingQuestions(true);
    setError('');
    try {
      const allQuestionsRes = await axios.get(`${BACKEND_API_BASE}/api/questions`);
      const allQuestions = allQuestionsRes.data || [];

      let assignedIds = [];
      try {
        const assignedRes = await axios.get(`${BACKEND_API_BASE}/api/assessment/${selectedApplication.id}`);
        const assignedQuestions = assignedRes.data || [];
        assignedIds = assignedQuestions.map(q => q.id);
      } catch (errAssigned) {
        console.warn('Failed to fetch assigned questions or none assigned yet:', errAssigned);
      }

      setFetchedQuestions(allQuestions);
      setSelectedQuestionsForCandidate(assignedIds);

      if (allQuestions.length === 0) {
        setSuccess('No questions found in the question library database.');
      } else {
        setSuccess(`Fetched ${allQuestions.length} questions from question bank.`);
      }
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      console.error('Failed to fetch questions:', err);
      setError('Failed to fetch technical questions library from backend.');
      setTimeout(() => setError(''), 4000);
    } finally {
      setFetchingQuestions(false);
    }
  };

  const handleToggleQuestionSelection = (qId) => {
    setSelectedQuestionsForCandidate(prev =>
      prev.includes(qId) ? prev.filter(id => id !== qId) : [...prev, qId]
    );
  };

  const handleSendAssessmentToCandidate = async () => {
    if (!selectedApplication || selectedQuestionsForCandidate.length === 0) return;
    setSendingAssessment(true);
    setError('');
    setSuccess('');
    try {
      await axios.post(`${BACKEND_API_BASE}/api/assessment/send`, {
        candidateId: selectedApplication.id,
        questionIds: selectedQuestionsForCandidate,
        duration: 30
      });
      setSuccess(`Assessment with ${selectedQuestionsForCandidate.length} questions successfully sent to candidate.`);
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      console.error('Failed to send assessment:', err);
      setError('Failed to send assessment to candidate.');
      setTimeout(() => setError(''), 4000);
    } finally {
      setSendingAssessment(false);
    }
  };

  const handleScheduleMeeting = async (e) => {
    if (e) e.preventDefault();
    if (!selectedApplication) return;
    setError('');
    setSuccess('');
    setSchedulingMeeting(true);

    const payload = {
      date: interviewDate,
      time: interviewTime,
      link: interviewLink
    };

    try {
      // Calls backend which saves the schedule AND sends the Technical Interview
      // invitation email to the candidate via the backend EmailService automatically.
      await axios.put(`${BACKEND_API_BASE}/api/admin/applications/${selectedApplication.id}/schedule`, payload);

      // Update local state
      const updatedApps = externalApplications.map(app =>
        app.id === selectedApplication.id
          ? {
            ...app,
            interviewDate: interviewDate,
            interviewTime: interviewTime,
            interviewLink: interviewLink
          }
          : app
      );
      updateAppsAndSync(updatedApps);

      // Update currently selected application in view
      setSelectedApplication(prev => ({
        ...prev,
        interviewDate: interviewDate,
        interviewTime: interviewTime,
        interviewLink: interviewLink
      }));

      setSuccess(`Meeting scheduled successfully for ${selectedApplication.fullName}. Interview invitation email sent to ${selectedApplication.email}!`);
      setTimeout(() => setSuccess(''), 5000);
    } catch (err) {
      console.error('Error scheduling interview meeting:', err);
      setError(err.response?.data?.message || err.response?.data || 'Failed to schedule meeting. Please verify inputs and try again.');
    } finally {
      setSchedulingMeeting(false);
    }
  };


  const handleSaveHrInterview = async (e) => {
    if (e) e.preventDefault();
    if (!selectedApplication) return;
    setError('');
    setSuccess('');
    setSavingHrInterview(true);

    const payload = {
      date: hrInterviewDate,
      time: hrInterviewTime,
      location: hrInterviewLocation
    };

    try {
      const response = await axios.put(`${BACKEND_API_BASE}/api/admin/applications/${selectedApplication.id}/hr-interview`, payload);

      const updatedApps = externalApplications.map(app =>
        app.id === selectedApplication.id
          ? {
            ...app,
            hrInterviewDate: hrInterviewDate,
            hrInterviewTime: hrInterviewTime,
            hrInterviewLocation: hrInterviewLocation
          }
          : app
      );
      updateAppsAndSync(updatedApps);

      setSelectedApplication(prev => ({
        ...prev,
        hrInterviewDate: hrInterviewDate,
        hrInterviewTime: hrInterviewTime,
        hrInterviewLocation: hrInterviewLocation
      }));

      setSuccess(`HR Interview details sent successfully for ${selectedApplication.fullName}!`);
      setTimeout(() => setSuccess(''), 5000);
    } catch (err) {
      console.error('Error sending HR interview:', err);
      setError(err.response?.data?.message || err.response?.data || 'Failed to send HR interview details. Please try again.');
      setTimeout(() => setError(''), 5000);
    } finally {
      setSavingHrInterview(false);
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
              onClick={() => {
                setSelectedStatusFilter('Candidates');
                setActiveSubTab('jobsList');
              }}
              className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer text-left ${activeSubTab === 'jobsList'
                ? 'bg-[#004AAD] text-white'
                : 'text-slate-400 hover:bg-slate-800/20 hover:text-white'
                }`}
              style={activeSubTab === 'jobsList' ? { color: '#ffffff' } : {}}
            >
              <Briefcase className="h-4 w-4 text-blue-200" />
              <span className="font-bold">Job Board</span>
            </button>

            <button
              onClick={() => {
                setActiveSubTab('analytics');
              }}
              className={`w-full flex items-center space-x-3 px-4 py-2.5 mt-1 rounded-xl text-xs font-semibold transition cursor-pointer text-left ${activeSubTab === 'analytics'
                ? 'bg-[#004AAD] text-white font-bold'
                : 'text-slate-400 hover:bg-slate-800/20 hover:text-white'
                }`}
              style={activeSubTab === 'analytics' ? { color: '#ffffff' } : {}}
            >
              <BarChart3 className="h-4 w-4 text-blue-200" />
              <span className="font-bold">Analytics Panel</span>
            </button>

            {/* Pipeline Stage Filters */}
            <div className="pt-4 mt-4 border-t border-slate-800/80 space-y-1 max-h-[60vh] overflow-y-auto admin-scrollbar">
              <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest px-3 mb-2">
                Candidate Pipeline
              </p>
              {/* Applied flat item */}
              {(() => {
                const isActive = activeSubTab === 'appsList' && selectedStatusFilter === 'Applied';
                const count = externalApplications.filter(app => app.status === 'Applied').length;
                return (
                  <button
                    onClick={() => {
                      setSelectedStatusFilter('Applied');
                      setActiveSubTab('appsList');
                    }}
                    className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-[11px] font-semibold transition cursor-pointer text-left ${isActive
                      ? 'bg-blue-600/20 text-white font-bold border border-blue-500/20'
                      : 'text-slate-400 hover:bg-slate-800/25 hover:text-white border border-transparent'
                      }`}
                  >
                    <span>Applied</span>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${isActive ? 'bg-blue-600 text-white font-extrabold' : 'bg-slate-800 text-slate-450'
                      }`}>
                      {count}
                    </span>
                  </button>
                );
              })()}

              {/* Accepted Candidates flat item */}
              {(() => {
                const isActive = (activeSubTab === 'appsList' || activeSubTab === 'candidateDetails') && selectedStatusFilter === 'Accepted';
                const count = externalApplications.filter(app => app.status === 'Accepted').length;
                return (
                  <button
                    onClick={() => {
                      setSelectedStatusFilter('Accepted');
                      setActiveSubTab('appsList');
                    }}
                    className={`w-full flex items-center justify-between px-3 py-1.5 mt-1 rounded-lg text-[11px] font-semibold transition cursor-pointer text-left ${isActive
                      ? 'bg-blue-600/20 text-white font-bold border border-blue-500/20'
                      : 'text-slate-400 hover:bg-slate-800/25 hover:text-white border border-transparent'
                      }`}
                  >
                    <span>Accepted Candidates</span>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${isActive ? 'bg-blue-600 text-white font-extrabold' : 'bg-slate-800 text-slate-450'
                      }`}>
                      {count}
                    </span>
                  </button>
                );
              })()}

              {/* Rejected Candidates flat item */}
              {(() => {
                const isActive = activeSubTab === 'appsList' && selectedStatusFilter === 'Rejected';
                const count = externalApplications.filter(app => app.status === 'Rejected').length;
                return (
                  <button
                    onClick={() => {
                      setSelectedStatusFilter('Rejected');
                      setActiveSubTab('appsList');
                    }}
                    className={`w-full flex items-center justify-between px-3 py-1.5 mt-1 rounded-lg text-[11px] font-semibold transition cursor-pointer text-left ${isActive
                      ? 'bg-blue-600/20 text-white font-bold border border-blue-500/20'
                      : 'text-slate-400 hover:bg-slate-800/25 hover:text-white border border-transparent'
                      }`}
                  >
                    <span>Rejected Candidates</span>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${isActive ? 'bg-rose-600 text-white font-extrabold' : 'bg-slate-800 text-slate-450'
                      }`}>
                      {count}
                    </span>
                  </button>
                );
              })()}



              {/* Partnership Requests under Round 3 Brand Awareness */}
              <button
                onClick={() => {
                  setActiveSubTab('partnerships');
                }}
                className={`w-full flex items-center justify-between px-3 py-1.5 mt-2 rounded-lg text-[11px] font-semibold transition cursor-pointer text-left ${activeSubTab === 'partnerships'
                  ? 'bg-blue-600/20 text-white font-bold border border-blue-500/20'
                  : 'text-slate-400 hover:bg-slate-800/25 hover:text-white border border-transparent'
                  }`}
              >
                <span>Partnership Requests</span>
                <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${activeSubTab === 'partnerships' ? 'bg-blue-600 text-white font-extrabold' : 'bg-slate-800 text-slate-450'
                  }`}>
                  {partnerships.length}
                </span>
              </button>

              {/* Support Requests under Partnership Requests */}
              <button
                onClick={() => {
                  setActiveSubTab('support');
                }}
                className={`w-full flex items-center justify-between px-3 py-1.5 mt-1 rounded-lg text-[11px] font-semibold transition cursor-pointer text-left ${activeSubTab === 'support'
                  ? 'bg-blue-600/20 text-white font-bold border border-blue-500/20'
                  : 'text-slate-400 hover:bg-slate-800/25 hover:text-white border border-transparent'
                  }`}
              >
                <span>Support Requests</span>
                <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${activeSubTab === 'support' ? 'bg-blue-600 text-white font-extrabold' : 'bg-slate-800 text-slate-450'
                  }`}>
                  {supports.length}
                </span>
              </button>
            </div>
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
        {activeSubTab !== 'candidateDetails' && (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                External Job Board - Candidate Tracking System</h1>

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

              {/* Notification Bell Icon */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(prev => !prev)}
                  className="p-2.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-slate-500 hover:text-slate-700 transition relative cursor-pointer"
                >
                  <Bell className="h-5 w-5" />
                  {notifications.some(n => n.unread) && (
                    <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 rounded-full bg-red-500 border border-white animate-pulse" />
                  )}
                </button>

                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 p-4 space-y-3 animate-fadeIn text-left">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <span className="text-xs font-bold text-slate-900">System Notifications</span>
                      <button
                        onClick={() => {
                          const allIds = notifications.map(n => n.id);
                          setReadAdminNotifIds(allIds);
                          localStorage.setItem('admin_read_notif_ids', JSON.stringify(allIds));
                          setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
                          setShowNotifications(false);
                        }}
                        className="text-[10px] text-blue-600 hover:underline font-bold bg-transparent border-none p-0 cursor-pointer"
                      >
                        Mark all read
                      </button>
                    </div>
                    <div className="space-y-2 max-h-[250px] overflow-y-auto admin-scrollbar">
                      {notifications.length === 0 ? (
                        <p className="text-slate-400 text-xs italic text-center py-4">No new alerts.</p>
                      ) : (
                        notifications.map(n => (
                          <div
                            key={n.id}
                            onClick={() => {
                              if (n.unread) {
                                const newReadIds = [...readAdminNotifIds, n.id];
                                setReadAdminNotifIds(newReadIds);
                                localStorage.setItem('admin_read_notif_ids', JSON.stringify(newReadIds));
                                setNotifications(prev => prev.map(item => item.id === n.id ? { ...item, unread: false } : item));
                              }
                            }}
                            className="p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-150 rounded-xl space-y-1 text-left relative cursor-pointer transition"
                          >
                            {n.unread && <span className="absolute top-2.5 right-2.5 h-1.5 w-1.5 rounded-full bg-[#004AAD]" />}
                            <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5 pr-3">
                              {n.type === 'system' && <Shield className="h-3.5 w-3.5 text-emerald-600" />}
                              {n.type === 'reminder' && <Calendar className="h-3.5 w-3.5 text-amber-500" />}
                              {n.type === 'application' && <Briefcase className="h-3.5 w-3.5 text-[#004AAD]" />}
                              <span>{n.title}</span>
                            </div>
                            <p className="text-[11px] text-slate-650 font-semibold leading-normal">{n.message}</p>
                            <div className="text-[9px] text-slate-400 font-bold">{n.time}</div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
              {((activeSubTab === 'appsList' && selectedStatusFilter === 'Candidates') || activeSubTab === 'jobsList') && (
                <button
                  onClick={openAddJobModal}
                  className="flex items-center space-x-2 px-5 py-2.5 rounded-xl text-sm font-semibold admin-glow-btn"
                >
                  <Plus className="h-4 w-4 text-white" />
                  <span className="text-white">Post a Job</span>
                </button>
              )}
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-20 text-slate-500 space-x-2">
            <RefreshCw className="h-5 w-5 animate-spin text-blue-600" />
            <span>Syncing database records...</span>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Sub Tab Controls */}
            {activeSubTab !== 'partnerships' && activeSubTab !== 'support' && activeSubTab !== 'candidateDetails' && (
              <div className="flex space-x-6 border-b border-slate-200 pb-3">
                <button
                  onClick={() => setActiveSubTab('jobsList')}
                  className={`pb-2 text-sm font-bold border-b-2 transition cursor-pointer ${activeSubTab === 'jobsList' ? 'border-[#004AAD] text-[#004AAD]' : 'border-transparent text-slate-500 hover:text-slate-800'
                    }`}
                >
                  Active Jobs ({externalJobs.length})
                </button>
                <button
                  onClick={() => setActiveSubTab('appsList')}
                  className={`pb-2 text-sm font-bold border-b-2 transition cursor-pointer ${activeSubTab === 'appsList' ? 'border-[#004AAD] text-[#004AAD]' : 'border-transparent text-slate-500 hover:text-slate-800'
                    }`}
                >
                  Candidate Applications ({externalApplications.length})
                </button>
              </div>
            )}

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
              selectedStatusFilter === 'Round 1 Aptitude' ? (
                <div className="space-y-6 animate-fadeIn">
                  {/* Local Tabs for Dashboard vs Questions */}
                  <div className="flex space-x-6 border-b border-slate-200 pb-3">
                    <button
                      onClick={() => setAptitudeSubTab('dashboard')}
                      className={`pb-2 text-sm font-bold border-b-2 transition cursor-pointer ${aptitudeSubTab === 'dashboard' ? 'border-[#004AAD] text-[#004AAD]' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
                    >
                      Dashboard
                    </button>
                    <button
                      onClick={() => setAptitudeSubTab('questions')}
                      className={`pb-2 text-sm font-bold border-b-2 transition cursor-pointer ${aptitudeSubTab === 'questions' ? 'border-[#004AAD] text-[#004AAD]' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
                    >
                      Assessment Questions
                    </button>
                  </div>

                  {aptitudeSubTab === 'dashboard' ? (
                    <div className="space-y-6">
                      {/* Round 1 - Aptitude Dashboard Header */}
                      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                        <div>
                          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                            Stage 1 - Aptitude Dashboard
                          </h2>
                          <p className="text-slate-500 text-sm mt-1">
                            Overview of candidate assessment metrics and test schedules
                          </p>
                        </div>
                      </div>

                      {/* Metrics cards grid */}
                      {(() => {
                        const round1Apps = externalApplications.filter(app => app.status === 'Round 1 Aptitude');
                        const selectedCount = round1Apps.length;
                        const scheduledCount = round1Apps.filter(app => (app.aptitudeStatus || 'Pending') === 'Assessment Sent' || (app.aptitudeStatus || 'Pending') === 'Scheduled').length;
                        const completedCount = round1Apps.filter(app => (app.aptitudeStatus || 'Pending') === 'Completed').length;
                        const pendingCount = round1Apps.filter(app => (app.aptitudeStatus || 'Pending') === 'Pending').length;

                        return (
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {/* Selected */}
                            <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex items-center justify-between">
                              <div className="space-y-1">
                                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Selected</span>
                                <span className="text-3xl font-black text-[#004AAD]">{selectedCount}</span>
                              </div>
                              <div className="p-3 bg-blue-50 text-[#004AAD] rounded-2xl">
                                <Users className="h-6 w-6" />
                              </div>
                            </div>

                            {/* Assessment Sent */}
                            <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex items-center justify-between">
                              <div className="space-y-1">
                                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Assessment Sent</span>
                                <span className="text-3xl font-black text-amber-600">{scheduledCount}</span>
                              </div>
                              <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
                                <Calendar className="h-6 w-6" />
                              </div>
                            </div>

                            {/* Completed */}
                            <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex items-center justify-between">
                              <div className="space-y-1">
                                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Completed</span>
                                <span className="text-3xl font-black text-emerald-600">{completedCount}</span>
                              </div>
                              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
                                <CheckCircle className="h-6 w-6" />
                              </div>
                            </div>

                            {/* Pending Slots */}
                            <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex items-center justify-between">
                              <div className="space-y-1">
                                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Pending Slots</span>
                                <span className="text-3xl font-black text-slate-600">{pendingCount}</span>
                              </div>
                              <div className="p-3 bg-slate-50 text-slate-500 rounded-2xl">
                                <AlertCircle className="h-6 w-6" />
                              </div>
                            </div>
                          </div>
                        );
                      })()}

                      {/* Selected Candidates Table */}
                      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                        <div className="mb-4">
                          <h3 className="text-lg font-black text-slate-900 tracking-tight">Selected Candidates for Round 1</h3>
                          <p className="text-slate-550 text-xs mt-0.5">Evaluation schedules and round completion logging</p>
                        </div>

                        <div className="overflow-x-auto rounded-xl border border-slate-200">
                          <table className="w-full text-left text-xs">
                            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[10px] uppercase tracking-wider font-bold">
                              <tr>
                                <th className="py-3 px-4 font-bold">Candidate Name</th>
                                <th className="py-3 px-4 font-bold">Position Applied</th>
                                <th className="py-3 px-4 font-bold">Interview Date</th>
                                <th className="py-3 px-4 font-bold">Time</th>
                                <th className="py-3 px-4 font-bold">Status</th>
                                <th className="py-3 px-4 font-bold">Actions</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-slate-700">
                              {externalApplications
                                .filter(app => app.status === 'Round 1 Aptitude')
                                .map((app) => {
                                  const dateVal = app.interviewDate || 'Not Selected';
                                  const timeVal = app.interviewTime || '--';
                                  const statusVal = app.aptitudeStatus || 'Pending';

                                  return (
                                    <tr key={app.id} className="hover:bg-slate-50/50 transition-colors">
                                      <td className="py-3.5 px-4 font-bold text-slate-900">{app.fullName}</td>
                                      <td className="py-3.5 px-4">{app.jobTitle}</td>
                                      <td className="py-3.5 px-4">
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${dateVal === 'Not Selected' ? 'bg-slate-50 text-slate-500 border border-slate-200' : 'bg-blue-50 text-blue-700 border border-blue-200'
                                          }`}>
                                          {dateVal}
                                        </span>
                                      </td>
                                      <td className="py-3.5 px-4 font-semibold text-slate-900">{timeVal}</td>
                                      <td className="py-3.5 px-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-[10px] font-bold ${statusVal === 'Completed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                                          statusVal === 'Assessment Sent' || statusVal === 'Scheduled' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                                            'bg-slate-50 text-slate-500 border border-slate-200'
                                          }`}>
                                          {statusVal === 'Scheduled' ? 'Assessment Sent' : statusVal}
                                        </span>
                                      </td>
                                      <td className="py-3.5 px-4">
                                        <div className="flex items-center space-x-2">
                                          {(statusVal === 'Assessment Sent' || statusVal === 'Scheduled' || statusVal === 'Pending') && (
                                            <button
                                              onClick={() => {
                                                const url = `https://www.beta-softnet.com/careers/assessment?id=${app.id}`;
                                                navigator.clipboard.writeText(url);
                                                alert(`Test Link copied to clipboard:\n${url}`);
                                              }}
                                              className="px-2.5 py-1 rounded bg-blue-50 hover:bg-blue-100 text-[#004AAD] border border-blue-200 text-[10px] font-bold transition cursor-pointer"
                                            >
                                              Copy Test Link
                                            </button>
                                          )}
                                          {statusVal === 'Completed' && (
                                            <span className="text-[10px] font-bold text-emerald-600">
                                              Score: {app.aptitudeScore !== undefined && app.aptitudeScore !== null && app.aptitudeScore !== '' ? app.aptitudeScore : '0'}%
                                            </span>
                                          )}
                                        </div>
                                      </td>
                                    </tr>
                                  );
                                })
                              }
                              {externalApplications.filter(app => app.status === 'Round 1 Aptitude').length === 0 && (
                                <tr>
                                  <td colSpan={6} className="py-8 text-center text-slate-400 italic">
                                    No candidates currently in Stage 1 Aptitude.
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6 animate-fadeIn">
                      {/* Round 1 - Aptitude Questions Header */}
                      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                          <div>
                            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                              Round 1 - Aptitude Questions
                            </h2>
                            <p className="text-slate-500 text-sm mt-1">
                              Manage aptitude assessment questions for candidates
                            </p>
                          </div>

                          {/* Stats */}
                          <div className="flex items-center gap-3">
                            <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-2 text-center">
                              <span className="text-[10px] uppercase tracking-widest text-blue-600 font-bold block">Total Questions</span>
                              <span className="text-lg font-black text-blue-700">200</span>
                            </div>
                            <div className="bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-2 text-center">
                              <span className="text-[10px] uppercase tracking-widest text-emerald-600 font-bold block">Active</span>
                              <span className="text-lg font-black text-emerald-700">180</span>
                            </div>
                            <div className="bg-slate-50 border border-slate-250 rounded-xl px-4 py-2 text-center">
                              <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold block">Draft</span>
                              <span className="text-lg font-black text-slate-650">20</span>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-wrap items-center gap-3 mt-6 pt-6 border-t border-slate-100">
                          <button className="flex items-center gap-2 bg-[#004AAD] hover:bg-[#003c8f] text-white font-bold py-2 px-4 rounded-xl text-xs shadow-sm hover:shadow transition duration-200 cursor-pointer">
                            <Plus className="h-4 w-4" />
                            Add Question
                          </button>
                          <button className="flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 font-bold py-2 px-4 rounded-xl text-xs border border-slate-250 transition duration-200 cursor-pointer">
                            <Upload className="h-4 w-4 text-slate-500" />
                            Import Excel
                          </button>
                          <button className="flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 font-bold py-2 px-4 rounded-xl text-xs border border-slate-250 transition duration-200 cursor-pointer">
                            <Download className="h-4 w-4 text-slate-500" />
                            Export
                          </button>
                        </div>
                      </div>

                      {/* Categories Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Quant */}
                        <div
                          onClick={() => setSelectedAptitudeCategory('Quant')}
                          className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm hover:shadow-md hover:border-blue-500/25 transition-all duration-300 flex flex-col justify-between min-h-[140px] group cursor-pointer"
                        >
                          <div className="flex items-start justify-between">
                            <div className="p-2.5 bg-blue-50 rounded-xl text-blue-600">
                              <Calculator className="h-5 w-5" />
                            </div>
                            <span className="text-xs font-bold text-slate-450 bg-slate-50 border border-slate-150 px-2 py-0.5 rounded-full">
                              Category 1
                            </span>
                          </div>
                          <div className="mt-4">
                            <h4 className="text-base font-bold text-slate-900">Quant</h4>
                            <p className="text-slate-500 text-xs mt-0.5">50 Questions</p>
                          </div>
                          <div className="flex items-center text-xs font-bold text-[#004AAD] mt-3 group-hover:translate-x-1 transition-transform duration-200">
                            Manage <ChevronRight className="ml-0.5 h-3.5 w-3.5" />
                          </div>
                        </div>

                        {/* Logical */}
                        <div
                          onClick={() => setSelectedAptitudeCategory('Logical')}
                          className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm hover:shadow-md hover:border-purple-500/25 transition-all duration-300 flex flex-col justify-between min-h-[140px] group cursor-pointer"
                        >
                          <div className="flex items-start justify-between">
                            <div className="p-2.5 bg-purple-50 rounded-xl text-purple-600">
                              <Brain className="h-5 w-5" />
                            </div>
                            <span className="text-xs font-bold text-slate-455 bg-slate-50 border border-slate-150 px-2 py-0.5 rounded-full">
                              Category 2
                            </span>
                          </div>
                          <div className="mt-4">
                            <h4 className="text-base font-bold text-slate-900">Logical</h4>
                            <p className="text-slate-550 text-xs mt-0.5">50 Questions</p>
                          </div>
                          <div className="flex items-center text-xs font-bold text-purple-600 mt-3 group-hover:translate-x-1 transition-transform duration-200">
                            Manage <ChevronRight className="ml-0.5 h-3.5 w-3.5" />
                          </div>
                        </div>

                        {/* Verbal */}
                        <div
                          onClick={() => setSelectedAptitudeCategory('Verbal')}
                          className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm hover:shadow-md hover:border-amber-500/25 transition-all duration-300 flex flex-col justify-between min-h-[140px] group cursor-pointer"
                        >
                          <div className="flex items-start justify-between">
                            <div className="p-2.5 bg-amber-50 rounded-xl text-amber-600">
                              <BookOpen className="h-5 w-5" />
                            </div>
                            <span className="text-xs font-bold text-slate-455 bg-slate-50 border border-slate-150 px-2 py-0.5 rounded-full">
                              Category 3
                            </span>
                          </div>
                          <div className="mt-4">
                            <h4 className="text-base font-bold text-slate-900">Verbal</h4>
                            <p className="text-slate-555 text-xs mt-0.5">50 Questions</p>
                          </div>
                          <div className="flex items-center text-xs font-bold text-amber-600 mt-3 group-hover:translate-x-1 transition-transform duration-200">
                            Manage <ChevronRight className="ml-0.5 h-3.5 w-3.5" />
                          </div>
                        </div>

                        {/* Data Int. */}
                        <div
                          onClick={() => setSelectedAptitudeCategory('Data Int.')}
                          className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm hover:shadow-md hover:border-emerald-500/25 transition-all duration-300 flex flex-col justify-between min-h-[140px] group cursor-pointer"
                        >
                          <div className="flex items-start justify-between">
                            <div className="p-2.5 bg-emerald-50 rounded-xl text-emerald-600">
                              <BarChart3 className="h-5 w-5" />
                            </div>
                            <span className="text-xs font-bold text-slate-455 bg-slate-50 border border-slate-150 px-2 py-0.5 rounded-full">
                              Category 4
                            </span>
                          </div>
                          <div className="mt-4">
                            <h4 className="text-base font-bold text-slate-900">Data Int.</h4>
                            <p className="text-slate-555 text-xs mt-0.5">50 Questions</p>
                          </div>
                          <div className="flex items-center text-xs font-bold text-emerald-600 mt-3 group-hover:translate-x-1 transition-transform duration-200">
                            Manage <ChevronRight className="ml-0.5 h-3.5 w-3.5" />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : selectedStatusFilter === 'Round 2 Technical' ? (
                <div className="space-y-6 animate-fadeIn">
                  {/* Local Tabs for Dashboard vs Questions */}
                  <div className="flex space-x-6 border-b border-slate-200 pb-3">
                    <button
                      onClick={() => setTechnicalSubTab('dashboard')}
                      className={`pb-2 text-sm font-bold border-b-2 transition cursor-pointer ${technicalSubTab === 'dashboard' ? 'border-[#004AAD] text-[#004AAD]' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
                    >
                      Dashboard
                    </button>
                    <button
                      onClick={() => setTechnicalSubTab('questions')}
                      className={`pb-2 text-sm font-bold border-b-2 transition cursor-pointer ${technicalSubTab === 'questions' ? 'border-[#004AAD] text-[#004AAD]' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
                    >
                      Assessment Questions
                    </button>
                  </div>

                  {technicalSubTab === 'dashboard' ? (
                    <div className="space-y-6">
                      {/* Round 2 - Technical Header */}
                      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                        <div>
                          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                            Round 2 - Technical Dashboard
                          </h2>
                          <p className="text-slate-555 text-sm mt-1 font-semibold">
                            Manage code reviews, programming assessments, and domain fits
                          </p>
                        </div>
                      </div>

                      {/* Metrics Cards Row */}
                      {(() => {
                        const r2Apps = externalApplications.filter(app => app.status === 'Round 2 Technical');
                        const getCount = (keywords) => r2Apps.filter(app =>
                          keywords.some(kw => (app.jobTitle || '').toLowerCase().includes(kw))
                        ).length;

                        const feCount = getCount(['react', 'frontend', 'ui', 'ux']);
                        const beCount = getCount(['java', 'spring', 'node', 'python', 'backend']);
                        const fsCount = getCount(['full stack', 'fullstack']);
                        const qaCount = getCount(['testing', 'qa', 'automation']);

                        return (
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {/* Frontend */}
                            <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex items-center justify-between">
                              <div className="space-y-1">
                                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Frontend</span>
                                <span className="text-3xl font-black text-blue-600">{feCount} Candidates</span>
                              </div>
                              <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                                <Sliders className="h-6 w-6" />
                              </div>
                            </div>

                            {/* Backend */}
                            <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex items-center justify-between">
                              <div className="space-y-1">
                                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Backend</span>
                                <span className="text-3xl font-black text-emerald-600">{beCount} Candidates</span>
                              </div>
                              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
                                <Sliders className="h-6 w-6" />
                              </div>
                            </div>

                            {/* Full Stack */}
                            <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex items-center justify-between">
                              <div className="space-y-1">
                                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Full Stack</span>
                                <span className="text-3xl font-black text-purple-600">{fsCount} Candidates</span>
                              </div>
                              <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl">
                                <Sliders className="h-6 w-6" />
                              </div>
                            </div>

                            {/* Testing */}
                            <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex items-center justify-between">
                              <div className="space-y-1">
                                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Testing</span>
                                <span className="text-3xl font-black text-amber-600">{qaCount} Candidates</span>
                              </div>
                              <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
                                <Sliders className="h-6 w-6" />
                              </div>
                            </div>
                          </div>
                        );
                      })()}

                      {/* Domain Tabs selection */}
                      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                        <div className="mb-6">
                          <h3 className="text-base font-bold text-slate-900">Domain Assessment Tabs</h3>
                          <p className="text-slate-450 text-xs mt-0.5 font-semibold">Filter candidates based on technical specialization</p>
                        </div>

                        <div className="flex flex-wrap gap-2 border-b border-slate-100 pb-4 mb-6">
                          {['React', 'Java', 'Spring Boot', 'Node.js', 'Python', 'Testing', 'DevOps'].map((domain) => (
                            <button
                              key={domain}
                              onClick={() => setSelectedDomainTab(domain)}
                              className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer border ${selectedDomainTab === domain
                                ? 'bg-[#004AAD] text-white border-[#004AAD] shadow-sm'
                                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                                }`}
                            >
                              {domain}
                            </button>
                          ))}
                        </div>

                        {/* Filtered Candidate Table */}
                        {(() => {
                          const r2Apps = externalApplications.filter(app => app.status === 'Round 2 Technical');

                          const filteredApps = r2Apps.filter(app => {
                            const title = (app.jobTitle || '').toLowerCase();
                            if (selectedDomainTab === 'React') return title.includes('react') || title.includes('frontend') || title.includes('ui') || title.includes('ux');
                            if (selectedDomainTab === 'Java') return title.includes('java') && !title.includes('spring');
                            if (selectedDomainTab === 'Spring Boot') return title.includes('spring') || (title.includes('java') && title.includes('boot'));
                            if (selectedDomainTab === 'Node.js') return title.includes('node') || title.includes('backend') || title.includes('express');
                            if (selectedDomainTab === 'Python') return title.includes('python') || title.includes('django') || title.includes('data');
                            if (selectedDomainTab === 'Testing') return title.includes('testing') || title.includes('qa') || title.includes('test');
                            if (selectedDomainTab === 'DevOps') return title.includes('devops') || title.includes('cloud') || title.includes('aws') || title.includes('docker');
                            return true;
                          });

                          return (
                            <div className="overflow-x-auto rounded-xl border border-slate-200">
                              <table className="w-full text-left text-xs">
                                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[10px] uppercase tracking-wider font-bold">
                                  <tr>
                                    <th className="py-3 px-4 font-bold">Candidate Name</th>
                                    <th className="py-3 px-4 font-bold">Position</th>
                                    <th className="py-3 px-4 font-bold">Email</th>
                                    <th className="py-3 px-4 font-bold">Experience</th>
                                    <th className="py-3 px-4 font-bold">Action</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-slate-700">
                                  {filteredApps.map((app) => (
                                    <tr key={app.id} className="hover:bg-slate-50/50 transition-colors">
                                      <td className="py-3.5 px-4 font-bold text-slate-900">{app.fullName}</td>
                                      <td className="py-3.5 px-4 font-medium text-slate-600">{app.jobTitle}</td>
                                      <td className="py-3.5 px-4 text-slate-500">{app.email}</td>
                                      <td className="py-3.5 px-4 font-semibold text-slate-700">
                                        {app.experience || '3 Years'}
                                      </td>
                                      <td className="py-3.5 px-4">
                                        <button
                                          onClick={() => {
                                            const normalizedStatus = mapStatusToUI(app.status);
                                            const updatedApp = { ...app, status: normalizedStatus };
                                            setSelectedApplication(updatedApp);
                                            setCandidateStatus(normalizedStatus);
                                            setActiveSubTab('candidateDetails');
                                          }}
                                          className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-[#004AAD] hover:text-[#003882] rounded-lg font-bold transition text-[11px] cursor-pointer"
                                        >
                                          Review
                                        </button>
                                      </td>
                                    </tr>
                                  ))}
                                  {filteredApps.length === 0 && (
                                    <tr>
                                      <td colSpan={5} className="py-8 text-center text-slate-400 italic">
                                        No candidates found for {selectedDomainTab} in Round 2 Technical.
                                      </td>
                                    </tr>
                                  )}
                                </tbody>
                              </table>
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {/* Round 2 - Technical Questions Header */}
                      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                          <div className="text-left">
                            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                              Round 2 - Technical Questions
                            </h2>
                            <p className="text-slate-500 text-sm mt-1 font-semibold">
                              Manage domain coding challenges, system design prompts, and automation assessments
                            </p>
                          </div>

                          {/* Stats */}
                          <div className="flex items-center gap-3">
                            <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-2 text-center">
                              <span className="text-[10px] uppercase tracking-widest text-blue-600 font-bold block">Total Questions</span>
                              <span className="text-lg font-black text-blue-700">{technicalQuestionsData.length}</span>
                            </div>
                            <div className="bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-2 text-center">
                              <span className="text-[10px] uppercase tracking-widest text-emerald-600 font-bold block">Active</span>
                              <span className="text-lg font-black text-emerald-700">{technicalQuestionsData.length}</span>
                            </div>
                            <div className="bg-slate-50 border border-slate-250 rounded-xl px-4 py-2 text-center">
                              <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold block">Draft</span>
                              <span className="text-lg font-black text-slate-655">0</span>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-wrap items-center gap-3 mt-6 pt-6 border-t border-slate-100">
                          <button className="flex items-center gap-2 bg-[#004AAD] hover:bg-[#003c8f] text-white font-bold py-2 px-4 rounded-xl text-xs shadow-sm hover:shadow transition duration-200 cursor-pointer">
                            <Plus className="h-4 w-4" />
                            Add Question
                          </button>
                          <button className="flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 font-bold py-2 px-4 rounded-xl text-xs border border-slate-250 transition duration-200 cursor-pointer">
                            <Upload className="h-4 w-4 text-slate-500" />
                            Import JSON
                          </button>
                          <button className="flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 font-bold py-2 px-4 rounded-xl text-xs border border-slate-250 transition duration-200 cursor-pointer">
                            <Download className="h-4 w-4 text-slate-500" />
                            Export
                          </button>
                        </div>
                      </div>

                      {/* Domain category cards */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {['React', 'Java', 'Spring Boot', 'Node.js', 'Python', 'Testing', 'DevOps'].map((domain) => {
                          const count = technicalQuestionsData.filter(q => q.category === domain).length;
                          let iconBg = 'bg-blue-50 text-blue-600';
                          if (domain === 'Java') iconBg = 'bg-amber-50 text-amber-600';
                          if (domain === 'Spring Boot') iconBg = 'bg-emerald-50 text-emerald-600';
                          if (domain === 'Node.js') iconBg = 'bg-violet-50 text-violet-600';
                          if (domain === 'Python') iconBg = 'bg-indigo-50 text-indigo-600';
                          if (domain === 'Testing') iconBg = 'bg-rose-50 text-rose-600';
                          if (domain === 'DevOps') iconBg = 'bg-cyan-50 text-cyan-600';

                          return (
                            <div
                              key={domain}
                              onClick={() => setSelectedDomainTab(domain)}
                              className={`p-5 rounded-2xl shadow-sm border transition-all duration-300 flex flex-col justify-between min-h-[120px] group cursor-pointer ${selectedDomainTab === domain
                                ? 'bg-white border-[#004AAD] ring-2 ring-[#004AAD]/10'
                                : 'bg-white border-slate-200 hover:border-[#004AAD]/40 hover:shadow-md'
                                }`}
                            >
                              <div className="flex items-start justify-between">
                                <div className={`p-2.5 rounded-xl ${iconBg}`}>
                                  <Sliders className="h-5 w-5" />
                                </div>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${selectedDomainTab === domain ? 'bg-[#004AAD] text-white' : 'bg-slate-50 text-slate-550 border border-slate-200'
                                  }`}>
                                  Category
                                </span>
                              </div>
                              <div className="mt-3 text-left">
                                <h4 className="text-sm font-bold text-slate-900">{domain}</h4>
                                <p className="text-slate-500 text-[11px] mt-0.5 font-semibold">{count} Questions</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Filtered coding questions list */}
                      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                        <div className="mb-6 flex items-center justify-between">
                          <div className="text-left">
                            <h3 className="text-base font-bold text-slate-900">Assessment challenges: {selectedDomainTab}</h3>
                            <p className="text-slate-450 text-xs mt-0.5 font-semibold">Coding problems presented to candidates during technical evaluation</p>
                          </div>
                        </div>

                        <div className="space-y-4">
                          {technicalQuestionsData
                            .filter(q => q.category === selectedDomainTab)
                            .map((question, idx) => (
                              <div key={question.id} className="border border-slate-200 rounded-xl p-5 hover:border-slate-350 transition-colors text-left bg-slate-50/20">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                                    <span className="h-5 w-5 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-xs font-bold">
                                      {idx + 1}
                                    </span>
                                    {question.title}
                                  </h4>
                                  <div className="flex items-center gap-2">
                                    <span className={`px-2 py-0.5 text-[9px] font-bold rounded-full border ${question.difficulty === 'Easy' ? 'bg-emerald-50 text-emerald-700 border-emerald-250' :
                                      question.difficulty === 'Medium' ? 'bg-amber-50 text-amber-700 border-amber-250' :
                                        'bg-rose-50 text-rose-700 border-rose-250'
                                      }`}>
                                      {question.difficulty}
                                    </span>
                                    <span className="text-[10px] text-slate-400 font-semibold">{question.time} limit</span>
                                  </div>
                                </div>

                                <p className="text-xs text-slate-600 leading-relaxed mb-4 font-semibold">
                                  {question.description}
                                </p>

                                <div className="bg-[#0f172a] text-slate-300 font-mono text-[11px] rounded-lg p-4 overflow-x-auto whitespace-pre leading-relaxed border border-slate-900 shadow-inner">
                                  {question.codeSnippet}
                                </div>
                              </div>
                            ))}
                          {technicalQuestionsData.filter(q => q.category === selectedDomainTab).length === 0 && (
                            <div className="py-8 text-center text-slate-455 italic text-xs">
                              No questions set for the {selectedDomainTab} specialization domain.
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : selectedStatusFilter === 'Round 3 Brand Awareness' ? (
                <div className="space-y-6 animate-fadeIn">
                  {/* Local Tabs for Dashboard vs Questions */}
                  <div className="flex space-x-6 border-b border-slate-200 pb-3">
                    <button
                      onClick={() => setBrandSubTab('dashboard')}
                      className={`pb-2 text-sm font-bold border-b-2 transition cursor-pointer ${brandSubTab === 'dashboard' ? 'border-[#004AAD] text-[#004AAD]' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
                    >
                      Dashboard
                    </button>
                    <button
                      onClick={() => setBrandSubTab('questions')}
                      className={`pb-2 text-sm font-bold border-b-2 transition cursor-pointer ${brandSubTab === 'questions' ? 'border-[#004AAD] text-[#004AAD]' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
                    >
                      Assessment Questions
                    </button>
                  </div>

                  {brandSubTab === 'dashboard' ? (
                    <div className="space-y-6">
                      {/* Header */}
                      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                        <div>
                          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                            Round 3 - Brand Awareness Dashboard
                          </h2>
                          <p className="text-slate-555 text-sm mt-1 font-semibold">
                            Evaluate candidate alignment with BNX products, brand messaging, and user advocacy
                          </p>
                        </div>
                      </div>

                      {/* Metrics Cards */}
                      {(() => {
                        const r3Apps = externalApplications.filter(app => app.status === 'Round 3 Brand Awareness');
                        const getCount = (keywords) => r3Apps.filter(app =>
                          keywords.some(kw => (app.jobTitle || '').toLowerCase().includes(kw))
                        ).length;

                        const mailCount = getCount(['mail', 'smtp']);
                        const cliksCount = getCount(['cliks', 'business']);
                        const valuesCount = getCount(['values', 'core']);
                        const prCount = getCount(['relations', 'representative']);

                        return (
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {/* BNX Mail */}
                            <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex items-center justify-between">
                              <div className="space-y-1">
                                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">BNX Mail</span>
                                <span className="text-3xl font-black text-blue-600">{mailCount} Candidates</span>
                              </div>
                              <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                                <Mail className="h-6 w-6" />
                              </div>
                            </div>

                            {/* Cliks Business */}
                            <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex items-center justify-between">
                              <div className="space-y-1">
                                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Cliks Business</span>
                                <span className="text-3xl font-black text-emerald-600">{cliksCount} Candidates</span>
                              </div>
                              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
                                <Briefcase className="h-6 w-6" />
                              </div>
                            </div>

                            {/* Company Core Values */}
                            <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex items-center justify-between">
                              <div className="space-y-1">
                                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Company Core Values</span>
                                <span className="text-3xl font-black text-purple-600">{valuesCount} Candidates</span>
                              </div>
                              <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl">
                                <Brain className="h-6 w-6" />
                              </div>
                            </div>

                            {/* Public Relations */}
                            <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex items-center justify-between">
                              <div className="space-y-1">
                                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Public Relations</span>
                                <span className="text-3xl font-black text-amber-600">{prCount} Candidates</span>
                              </div>
                              <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
                                <Users className="h-6 w-6" />
                              </div>
                            </div>
                          </div>
                        );
                      })()}

                      {/* Domain Tabs selection */}
                      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                        <div className="mb-6">
                          <h3 className="text-base font-bold text-slate-900">Brand Specialist domains</h3>
                          <p className="text-slate-450 text-xs mt-0.5 font-semibold">Filter candidates based on product focus area</p>
                        </div>

                        <div className="flex flex-wrap gap-2 border-b border-slate-100 pb-4 mb-6">
                          {['BNX Mail', 'Cliks Business', 'Company Core Values', 'Public Relations', 'Ecosystem Integration'].map((domain) => (
                            <button
                              key={domain}
                              onClick={() => setSelectedBrandDomainTab(domain)}
                              className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer border ${selectedBrandDomainTab === domain
                                ? 'bg-[#004AAD] text-white border-[#004AAD] shadow-sm'
                                : 'bg-slate-50 text-slate-655 border-slate-200 hover:bg-slate-100'
                                }`}
                            >
                              {domain}
                            </button>
                          ))}
                        </div>

                        {/* Candidate Table */}
                        {(() => {
                          const r3Apps = externalApplications.filter(app => app.status === 'Round 3 Brand Awareness');

                          const filteredApps = r3Apps.filter(app => {
                            const title = (app.jobTitle || '').toLowerCase();
                            if (selectedBrandDomainTab === 'BNX Mail') return title.includes('mail') || title.includes('smtp');
                            if (selectedBrandDomainTab === 'Cliks Business') return title.includes('cliks') || title.includes('business');
                            if (selectedBrandDomainTab === 'Company Core Values') return title.includes('values') || title.includes('core');
                            if (selectedBrandDomainTab === 'Public Relations') return title.includes('relations') || title.includes('representative');
                            if (selectedBrandDomainTab === 'Ecosystem Integration') return title.includes('ecosystem') || title.includes('partner') || title.includes('integration');
                            return true;
                          });

                          return (
                            <div className="overflow-x-auto rounded-xl border border-slate-200">
                              <table className="w-full text-left text-xs">
                                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[10px] uppercase tracking-wider font-bold">
                                  <tr>
                                    <th className="py-3 px-4 font-bold">Candidate Name</th>
                                    <th className="py-3 px-4 font-bold">Focus Area</th>
                                    <th className="py-3 px-4 font-bold">Email</th>
                                    <th className="py-3 px-4 font-bold">Experience</th>
                                    <th className="py-3 px-4 font-bold">Action</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-slate-700">
                                  {filteredApps.map((app) => (
                                    <tr key={app.id} className="hover:bg-slate-50/50 transition-colors">
                                      <td className="py-3.5 px-4 font-bold text-slate-900">{app.fullName}</td>
                                      <td className="py-3.5 px-4 font-medium text-slate-600">{app.jobTitle}</td>
                                      <td className="py-3.5 px-4 text-slate-500">{app.email}</td>
                                      <td className="py-3.5 px-4 font-semibold text-slate-700">
                                        {app.experience || '3 Years'}
                                      </td>
                                      <td className="py-3.5 px-4">
                                        <button
                                          onClick={() => {
                                            const normalizedStatus = mapStatusToUI(app.status);
                                            const updatedApp = { ...app, status: normalizedStatus };
                                            setSelectedApplication(updatedApp);
                                            setCandidateStatus(normalizedStatus);
                                            setActiveSubTab('candidateDetails');
                                          }}
                                          className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-[#004AAD] hover:text-[#003882] rounded-lg font-bold transition text-[11px] cursor-pointer"
                                        >
                                          Review
                                        </button>
                                      </td>
                                    </tr>
                                  ))}
                                  {filteredApps.length === 0 && (
                                    <tr>
                                      <td colSpan={5} className="py-8 text-center text-slate-400 italic">
                                        No candidates found for {selectedBrandDomainTab} in Round 3 Brand Awareness.
                                      </td>
                                    </tr>
                                  )}
                                </tbody>
                              </table>
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {/* Questions Header */}
                      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                          <div className="text-left">
                            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                              Round 3 - Brand & Product Questions
                            </h2>
                            <p className="text-slate-555 text-sm mt-1 font-semibold">
                              Assess candidate awareness of BNX products, SMTP mail systems, task workspaces, and Beta brand messaging
                            </p>
                          </div>

                          {/* Stats */}
                          <div className="flex items-center gap-3">
                            <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-2 text-center">
                              <span className="text-[10px] uppercase tracking-widest text-blue-600 font-bold block">Total Questions</span>
                              <span className="text-lg font-black text-blue-700">{brandQuestionsData.length}</span>
                            </div>
                            <div className="bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-2 text-center">
                              <span className="text-[10px] uppercase tracking-widest text-emerald-600 font-bold block">Active</span>
                              <span className="text-lg font-black text-emerald-700">{brandQuestionsData.length}</span>
                            </div>
                            <div className="bg-slate-50 border border-slate-250 rounded-xl px-4 py-2 text-center">
                              <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold block">Draft</span>
                              <span className="text-lg font-black text-slate-655">0</span>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-wrap items-center gap-3 mt-6 pt-6 border-t border-slate-100">
                          <button className="flex items-center gap-2 bg-[#004AAD] hover:bg-[#003c8f] text-white font-bold py-2 px-4 rounded-xl text-xs shadow-sm hover:shadow transition duration-200 cursor-pointer">
                            <Plus className="h-4 w-4" />
                            Add Question
                          </button>
                          <button className="flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 font-bold py-2 px-4 rounded-xl text-xs border border-slate-250 transition duration-200 cursor-pointer">
                            <Upload className="h-4 w-4 text-slate-500" />
                            Import JSON
                          </button>
                          <button className="flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 font-bold py-2 px-4 rounded-xl text-xs border border-slate-250 transition duration-200 cursor-pointer">
                            <Download className="h-4 w-4 text-slate-500" />
                            Export
                          </button>
                        </div>
                      </div>

                      {/* Domain cards */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                        {['BNX Mail', 'Cliks Business', 'Company Core Values', 'Public Relations', 'Ecosystem Integration'].map((domain) => {
                          const count = brandQuestionsData.filter(q => q.category === domain).length;
                          let iconBg = 'bg-blue-50 text-blue-600';
                          if (domain === 'Cliks Business') iconBg = 'bg-emerald-50 text-emerald-600';
                          if (domain === 'Company Core Values') iconBg = 'bg-purple-50 text-purple-600';
                          if (domain === 'Public Relations') iconBg = 'bg-amber-50 text-amber-600';
                          if (domain === 'Ecosystem Integration') iconBg = 'bg-rose-50 text-rose-600';

                          return (
                            <div
                              key={domain}
                              onClick={() => setSelectedBrandDomainTab(domain)}
                              className={`p-5 rounded-2xl shadow-sm border transition-all duration-300 flex flex-col justify-between min-h-[120px] group cursor-pointer ${selectedBrandDomainTab === domain
                                ? 'bg-white border-[#004AAD] ring-2 ring-[#004AAD]/10'
                                : 'bg-white border-slate-200 hover:border-[#004AAD]/40 hover:shadow-md'
                                }`}
                            >
                              <div className="flex items-start justify-between">
                                <div className={`p-2.5 rounded-xl ${iconBg}`}>
                                  {domain === 'BNX Mail' ? <Mail className="h-5 w-5" /> : <Sliders className="h-5 w-5" />}
                                </div>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${selectedBrandDomainTab === domain ? 'bg-[#004AAD] text-white' : 'bg-slate-50 text-slate-555 border border-slate-200'
                                  }`}>
                                  Category
                                </span>
                              </div>
                              <div className="mt-3 text-left">
                                <h4 className="text-sm font-bold text-slate-900">{domain}</h4>
                                <p className="text-slate-555 text-[11px] mt-0.5 font-semibold">{count} Questions</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Brand questions list */}
                      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                        <div className="mb-6 flex items-center justify-between">
                          <div className="text-left">
                            <h3 className="text-base font-bold text-slate-900">Brand awareness challenges: {selectedBrandDomainTab}</h3>
                            <p className="text-slate-455 text-xs mt-0.5 font-semibold">Brand fit questions and expected positioning answers</p>
                          </div>
                        </div>

                        <div className="space-y-4">
                          {brandQuestionsData
                            .filter(q => q.category === selectedBrandDomainTab)
                            .map((question, idx) => (
                              <div key={question.id} className="border border-slate-200 rounded-xl p-5 hover:border-slate-350 transition-colors text-left bg-slate-50/20">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                                    <span className="h-5 w-5 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-xs font-bold">
                                      {idx + 1}
                                    </span>
                                    {question.title}
                                  </h4>
                                  <div className="flex items-center gap-2">
                                    <span className={`px-2 py-0.5 text-[9px] font-bold rounded-full border ${question.difficulty === 'Easy' ? 'bg-emerald-50 text-emerald-700 border-emerald-250' :
                                      question.difficulty === 'Medium' ? 'bg-amber-50 text-amber-700 border-amber-250' :
                                        'bg-rose-50 text-rose-700 border-rose-250'
                                      }`}>
                                      {question.difficulty}
                                    </span>
                                    <span className="text-[10px] text-slate-400 font-semibold">{question.time} limit</span>
                                  </div>
                                </div>

                                <p className="text-xs text-slate-600 leading-relaxed mb-4 font-semibold">
                                  {question.description}
                                </p>

                                <div className="bg-[#0f172a] text-slate-300 font-mono text-[11px] rounded-lg p-4 overflow-x-auto whitespace-pre leading-relaxed border border-slate-900 shadow-inner">
                                  {question.codeSnippet}
                                </div>
                              </div>
                            ))}
                          {brandQuestionsData.filter(q => q.category === selectedBrandDomainTab).length === 0 && (
                            <div className="py-8 text-center text-slate-400 italic text-xs">
                              No questions set for the {selectedBrandDomainTab} branding category.
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Advanced Search & Filtering Bar */}
                  <div className="bg-white border border-slate-200 p-5 rounded-2xl space-y-4 text-left shadow-sm">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      {/* Search bar */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Search Candidate / Job</label>
                        <input
                          type="text"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          placeholder="Search name or position..."
                          className="w-full bg-white text-slate-800 border border-slate-200 rounded-lg py-1.5 px-3 focus:outline-none focus:border-blue-500 text-xs transition"
                        />
                      </div>

                      {/* Status filter */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Filter by Status</label>
                        <select
                          value={statusFilter}
                          onChange={(e) => setStatusFilter(e.target.value)}
                          className="w-full bg-white text-slate-800 border border-slate-200 rounded-lg py-1.5 px-3 focus:outline-none focus:border-blue-500 text-xs transition cursor-pointer"
                        >
                          <option value="All">All Statuses</option>
                          <option value="Candidates">Candidates</option>
                          <option value="Shortlisted">Shortlisted</option>
                          <option value="Interview Scheduled">Interview Scheduled</option>
                          <option value="Accepted">Accepted</option>
                          <option value="Joined">Joined</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                      </div>

                      {/* Job Filter */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Filter by Job Posting</label>
                        <select
                          value={selectedJobFilter}
                          onChange={(e) => setSelectedJobFilter(e.target.value)}
                          className="w-full bg-white text-slate-800 border border-slate-200 rounded-lg py-1.5 px-3 focus:outline-none focus:border-blue-500 text-xs transition cursor-pointer"
                        >
                          <option value="All">All Jobs</option>
                          {Array.from(new Set(externalApplications.map(app => app.jobTitle))).map(title => (
                            <option key={title} value={title}>{title}</option>
                          ))}
                        </select>
                      </div>

                      {/* Clear button */}
                      <div className="flex items-end justify-end">
                        {(searchTerm || statusFilter !== 'All' || selectedJobFilter !== 'All' || startDate || endDate) && (
                          <button
                            onClick={() => {
                              setSearchTerm('');
                              setStatusFilter('All');
                              setSelectedJobFilter('All');
                              setStartDate('');
                              setEndDate('');
                            }}
                            className="px-4 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold transition cursor-pointer"
                          >
                            Clear Filters
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-100 pt-3">
                      {/* Date range - Start Date */}
                      <div className="flex items-center space-x-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">From Date:</label>
                        <input
                          type="date"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          className="w-full bg-white text-slate-800 border border-slate-200 rounded-lg py-1.5 px-3 focus:outline-none focus:border-blue-500 text-xs transition"
                        />
                      </div>

                      {/* Date range - End Date */}
                      <div className="flex items-center space-x-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">To Date:</label>
                        <input
                          type="date"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                          className="w-full bg-white text-slate-800 border border-slate-200 rounded-lg py-1.5 px-3 focus:outline-none focus:border-blue-500 text-xs transition"
                        />
                      </div>
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
                            <th className="py-4 px-6 font-bold text-center">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-700 text-xs">
                          {(() => {
                            const filtered = externalApplications
                              .filter(app => selectedJobFilter === 'All' || app.jobTitle === selectedJobFilter)
                              .filter(app => {
                                if (statusFilter === 'All') return app.status === selectedStatusFilter;
                                if (statusFilter === 'Pending') return app.status === 'Applied';
                                return app.status === statusFilter;
                              })
                              .filter(app => {
                                if (!searchTerm) return true;
                                const query = searchTerm.toLowerCase();
                                return app.fullName.toLowerCase().includes(query) || app.jobTitle.toLowerCase().includes(query);
                              })
                              .filter(app => {
                                if (!startDate && !endDate) return true;
                                const appDate = new Date(app.createdAt);
                                if (startDate && appDate < new Date(startDate)) return false;
                                if (endDate) {
                                  const adjustedEnd = new Date(endDate);
                                  adjustedEnd.setHours(23, 59, 59, 999);
                                  if (appDate > adjustedEnd) return false;
                                }
                                return true;
                              })
                              .sort((a, b) => b.id - a.id);

                            if (filtered.length === 0) {
                              return (
                                <tr>
                                  <td colSpan={7} className="py-8 text-center text-slate-400 italic">
                                    No external applications found matching the selected filters.
                                  </td>
                                </tr>
                              );
                            }

                            return filtered.map(app => (
                              <tr
                                key={app.id}
                                onClick={() => {
                                  if (selectedStatusFilter === 'Accepted') {
                                    console.log('Candidate row clicked:', app.fullName, 'Status:', app.status);
                                    const normalizedStatus = mapStatusToUI(app.status);
                                    const updatedApp = { ...app, status: normalizedStatus };
                                    setSelectedApplication(updatedApp);
                                    setCandidateStatus(normalizedStatus);
                                    setActiveSubTab('candidateDetails');
                                  }
                                }}
                                className={`transition-colors ${selectedStatusFilter === 'Accepted' ? 'hover:bg-slate-50 cursor-pointer' : 'hover:bg-slate-50/50'}`}
                              >
                                <td className="py-4 px-6">
                                  <div className="flex items-center gap-1.5 flex-wrap">
                                    <button
                                      onClick={(e) => {
                                        if (selectedStatusFilter === 'Accepted') {
                                          e.stopPropagation();
                                        }
                                        console.log('Candidate name clicked:', app.fullName, 'Status:', app.status);
                                        const normalizedStatus = mapStatusToUI(app.status);
                                        const updatedApp = { ...app, status: normalizedStatus };
                                        setSelectedApplication(updatedApp);
                                        setCandidateStatus(normalizedStatus);
                                        console.log('Normalized Status:', normalizedStatus, 'selectedStatusFilter:', selectedStatusFilter);
                                        console.log('Transitioning to candidateDetails subpage');
                                        setActiveSubTab('candidateDetails');
                                      }}
                                      className="font-bold text-[#004AAD] hover:underline cursor-pointer text-left block bg-transparent border-none p-0"
                                    >
                                      {app.fullName}
                                    </button>
                                    {(selectedStatusFilter === 'Accepted' || app.status === 'Accepted') && (
                                      <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 text-[10px] font-bold text-slate-500 font-mono">
                                        ID: #{app.id}
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-slate-450 text-[10px] mt-0.5">{app.email}</div>
                                </td>
                                <td className="py-4 px-6">
                                  <div className="font-semibold text-slate-900">{app.jobTitle}</div>
                                  <div className="text-slate-450 text-[10px] mt-0.5">{app.jobDepartment} • {app.jobLocation}</div>
                                </td>
                                <td className="py-4 px-6">
                                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold capitalize whitespace-nowrap ${app.status === 'Candidates' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' :
                                    app.status === 'Round 1 Aptitude' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                                      app.status === 'Round 2 Technical' ? 'bg-sky-50 text-sky-700 border border-sky-200' :
                                        app.status === 'Round 3 Brand Awareness' ? 'bg-fuchsia-50 text-fuchsia-700 border border-fuchsia-200' :
                                          app.status === 'Shortlisted' ? 'bg-purple-50 text-purple-700 border border-purple-200' :
                                            app.status === 'Interview Scheduled' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                                              app.status === 'Interview Completed' ? 'bg-cyan-50 text-cyan-700 border border-cyan-200' :
                                                app.status === 'Accepted' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                                                  app.status === 'Rejected' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                                                    app.status === 'Joined' ? 'bg-teal-50 text-teal-700 border border-teal-200' :
                                                      'bg-slate-50 text-slate-700 border border-slate-200'
                                    }`}>
                                    {app.status}
                                  </span>
                                </td>
                                <td className="py-4 px-6 text-slate-450">
                                  {app.createdAt ? new Date(app.createdAt).toLocaleDateString() : 'N/A'}
                                </td>
                                <td className="py-4 px-6">
                                  {app.resumeUrl ? (
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedResumeUrl(app.resumeUrl);
                                        setSelectedResumeCandidate(app.fullName);
                                      }}
                                      className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded bg-blue-50 text-[#004AAD] border border-blue-100 hover:bg-blue-100 transition font-bold cursor-pointer"
                                    >
                                      <FileText className="h-3.5 w-3.5 text-[#004AAD]" />
                                      <span>View Resume</span>
                                    </button>
                                  ) : (
                                    <span className="text-slate-400 italic">No resume</span>
                                  )}
                                </td>
                                <td className="py-4 px-6 text-center">
                                  <div className="flex items-center justify-center gap-1.5">
                                    {selectedStatusFilter !== 'Accepted' && app.status !== 'Accepted' && (
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleUpdateStatus(app.id, 'Accepted');
                                        }}
                                        className="px-2.5 py-1.5 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-650 border border-emerald-200 text-[10px] font-bold transition cursor-pointer whitespace-nowrap"
                                      >
                                        Accept
                                      </button>
                                    )}

                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleUpdateStatus(app.id, 'Rejected');
                                      }}
                                      className="px-2.5 py-1.5 rounded bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 text-[10px] font-bold transition cursor-pointer whitespace-nowrap"
                                    >
                                      Reject
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))
                          })()}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )
            )}

            {/* Sub Tab: Candidate Details Page */}
            {activeSubTab === 'candidateDetails' && selectedApplication && (
              <div className="animate-fadeIn space-y-6 text-left">
                {/* Header Card */}
                <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => {
                        setSelectedApplication(null);
                        setActiveSubTab('appsList');
                      }}
                      className="p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-slate-650 transition cursor-pointer flex items-center justify-center border-none"
                      title="Back to List"
                    >
                      <ArrowLeft className="h-5 w-5" />
                    </button>
                    <div>
                      <div className="flex items-center gap-3">
                        <h2 className="text-2xl font-black text-slate-900 leading-tight">
                          {selectedApplication.fullName}
                        </h2>
                        <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold capitalize ${selectedApplication.status === 'Accepted' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-50 text-slate-700 border border-slate-200'
                          }`}>
                          {selectedApplication.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 font-medium mt-1">
                        Applied for <strong className="text-slate-800">{selectedApplication.jobTitle}</strong> • {selectedApplication.jobDepartment} • {selectedApplication.jobLocation}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Premium Dynamic Assessment Score Badge */}
                    {(() => {
                      const scoreVal = selectedApplication.aptitudeScore;
                      const hasScore = scoreVal !== undefined && scoreVal !== null && scoreVal !== '';

                      if (hasScore) {
                        const scoreNum = parseInt(scoreVal);
                        const isHigh = scoreNum >= 70;
                        const isMid = scoreNum >= 45 && scoreNum < 70;

                        let badgeStyle = 'bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100/50';
                        if (isHigh) badgeStyle = 'bg-emerald-50 border-emerald-250 text-emerald-700 hover:bg-emerald-100/50';
                        else if (isMid) badgeStyle = 'bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100/50';

                        return (
                          <div className={`flex items-center gap-1.5 px-4 py-2 rounded-xl border text-xs font-black shadow-xs transition duration-200 cursor-default select-none ${badgeStyle} animate-fadeIn`}>
                            <Award className="h-4.5 w-4.5" />
                            <span>Score: {scoreNum}%</span>
                          </div>
                        );
                      } else {
                        return (
                          <div className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-450 text-xs font-bold shadow-xs select-none cursor-default">
                            <Clock className="h-4 w-4" />
                            <span>Score: N/A</span>
                          </div>
                        );
                      }
                    })()}

                    {selectedApplication.assessmentTimeTaken && (
                      <div className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-blue-200 bg-blue-50 text-blue-700 text-xs font-bold shadow-xs select-none cursor-default animate-fadeIn">
                        <Clock className="h-4 w-4" />
                        <span>Time Taken: {selectedApplication.assessmentTimeTaken}</span>
                      </div>
                    )}

                    <button
                      onClick={() => handleOpenAssignModal(selectedApplication)}
                      disabled={selectedApplication.aptitudeStatus === 'Assessment Sent' || selectedApplication.aptitudeStatus === 'Completed'}
                      className="px-4 py-2 bg-amber-50 hover:bg-amber-100 border border-amber-250 text-amber-700 text-xs font-bold rounded-xl transition cursor-pointer flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed border-none outline-none"
                    >
                      <Brain className="h-4 w-4" />
                      <span>{selectedApplication.aptitudeStatus === 'Assessment Sent' || selectedApplication.aptitudeStatus === 'Completed' ? 'Test Assigned' : 'Test'}</span>
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(selectedApplication.id, 'Rejected')}
                      className="px-4 py-2 bg-rose-50 hover:bg-rose-100 border border-rose-250 text-rose-700 text-xs font-bold rounded-xl transition cursor-pointer"
                    >
                      Reject Candidate
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(selectedApplication.id, 'Joined')}
                      className="px-4 py-2 bg-[#004AAD] hover:bg-[#003882] text-white text-xs font-bold rounded-xl transition cursor-pointer"
                    >
                      Mark as Joined
                    </button>
                  </div>
                </div>

                {/* Main 2-Column Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Left Column: Profile Info & Original Resume (7 cols) */}
                  <div className="lg:col-span-7 space-y-6">
                    {/* Information Card */}
                    <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm space-y-4">
                      <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-100">Professional Details</h3>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Email Address</label>
                          <p className="text-xs font-bold text-slate-800 mt-1">{selectedApplication.email}</p>
                        </div>
                        {selectedApplication.phone && (
                          <div>
                            <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Phone Number</label>
                            <p className="text-xs font-bold text-slate-800 mt-1">{selectedApplication.phone}</p>
                          </div>
                        )}
                        <div>
                          <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Work Experience</label>
                          <p className="text-xs font-bold text-slate-800 mt-1">{selectedApplication.experience || '3 Years'}</p>
                        </div>
                        {selectedApplication.appliedDate && (
                          <div>
                            <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Applied Date</label>
                            <p className="text-xs font-bold text-slate-800 mt-1">{selectedApplication.appliedDate}</p>
                          </div>
                        )}
                      </div>

                      {selectedApplication.coverLetter && (
                        <div className="pt-2.5 border-t border-slate-100">
                          <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Cover Letter</label>
                          <p className="text-xs font-semibold text-slate-700 mt-1 whitespace-pre-wrap leading-relaxed">{selectedApplication.coverLetter}</p>
                        </div>
                      )}

                      {selectedApplication.githubLink && (
                        <div className="pt-2.5 border-t border-slate-100">
                          <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Submitted GitHub Link</label>
                          <a
                            href={selectedApplication.githubLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-bold text-violet-650 hover:underline mt-1 block break-all"
                          >
                            {selectedApplication.githubLink}
                          </a>
                        </div>
                      )}
                    </div>

                    {/* Task Assessment Card */}
                    <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm space-y-4">
                      <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
                        <div className="h-8 w-8 rounded-xl bg-violet-50 border border-violet-200 flex items-center justify-center flex-shrink-0">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Task Assessment</h3>
                          <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Assign a practical task to this candidate</p>
                        </div>
                      </div>

                      {/* Show existing task if any */}
                      {fetchedTask && (
                        <div className="bg-violet-50 border border-violet-200 rounded-2xl p-4 space-y-2 animate-fadeIn">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span className="text-[10px] font-bold text-violet-700 uppercase tracking-wider">Previously Assigned Task</span>
                            </div>
                            {fetchedTaskStatus && (
                              <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider border ${fetchedTaskStatus === 'SUBMITTED'
                                ? 'bg-emerald-100 text-emerald-700 border-emerald-300'
                                : 'bg-violet-100 text-violet-700 border-violet-300'
                                }`}>
                                {fetchedTaskStatus}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-violet-800 font-semibold leading-relaxed whitespace-pre-wrap">{fetchedTask}</p>

                          {selectedApplication.githubLink ? (
                            <div className="mt-3 pt-3 border-t border-violet-200/50 space-y-1.5 text-left">
                              <span className="text-[9px] font-bold text-violet-600 uppercase tracking-wider block">Submitted GitHub Link</span>
                              <div className="flex items-center gap-2 p-2 bg-white border border-slate-200 rounded-xl">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                                <input
                                  type="text"
                                  readOnly
                                  value={selectedApplication.githubLink}
                                  className="w-full bg-transparent border-none text-[11px] font-semibold text-slate-800 focus:outline-none select-all"
                                />
                                <a
                                  href={selectedApplication.githubLink && (selectedApplication.githubLink.startsWith('http://') || selectedApplication.githubLink.startsWith('https://')) ? selectedApplication.githubLink : `https://${selectedApplication.githubLink}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="px-2.5 py-1 bg-violet-100 hover:bg-violet-200 text-violet-700 font-extrabold rounded-lg text-[10px] transition shrink-0 uppercase tracking-wide no-underline cursor-pointer"
                                >
                                  Open
                                </a>
                              </div>
                            </div>
                          ) : (
                            <div className="mt-3 pt-3 border-t border-violet-200/50 space-y-1.5 text-left">
                              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Submitted GitHub Link</span>
                              <div className="p-2.5 bg-slate-100/50 border border-slate-200 border-dashed rounded-xl text-center text-[10px] text-slate-400 italic font-semibold">
                                Solution pending submission from candidate
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      <div className="space-y-3">
                        <textarea
                          rows={5}
                          value={taskDescription}
                          onChange={(e) => setTaskDescription(e.target.value)}
                          placeholder="Describe the task clearly. For example: Build a REST API using Spring Boot with CRUD operations for a product catalog. Include validation, error handling, and a README file."
                          className="w-full admin-custom-input border border-slate-300 rounded-2xl py-3 px-4 focus:outline-none text-xs transition resize-none leading-relaxed"
                        />

                        <div className="flex justify-end">
                          <button
                            type="button"
                            disabled={sendingTask || !taskDescription.trim()}
                            onClick={async () => {
                              if (!taskDescription.trim()) return;
                              setSendingTask(true);
                              setTaskSendStatus('');
                              setTaskSendMessage('');
                              try {
                                await axios.post(`${BACKEND_API_BASE}/api/task-assessment/${selectedApplication.id}`, {
                                  taskDescription: taskDescription.trim()
                                });
                                localStorage.setItem(`task_assessment_${selectedApplication.id}`, taskDescription.trim());
                                setFetchedTask(taskDescription.trim());
                                setFetchedTaskStatus('ASSIGNED');
                                setTaskSendStatus('success');
                                setTaskSendMessage(`Task assigned to ${selectedApplication.fullName} successfully.`);
                                setTaskDescription('');
                                setTimeout(() => { setTaskSendStatus(''); setTaskSendMessage(''); }, 5000);
                              } catch (err) {
                                console.error('Error assigning task:', err);
                                setTaskSendStatus('error');
                                setTaskSendMessage('Failed to send task. Please try again.');
                                setTimeout(() => { setTaskSendStatus(''); setTaskSendMessage(''); }, 5000);
                              } finally {
                                setSendingTask(false);
                              }
                            }}
                            className="flex items-center gap-2 px-5 py-2.5 bg-violet-600 hover:bg-violet-700 disabled:bg-violet-300 disabled:cursor-not-allowed text-white text-xs font-bold rounded-xl transition duration-200 shadow-sm shadow-violet-200 border-none outline-none cursor-pointer"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                            <span>{sendingTask ? 'Sending...' : 'Send Task'}</span>
                          </button>
                        </div>

                        {/* Feedback messages */}
                        {taskSendStatus === 'success' && (
                          <div className="flex items-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-50 border border-emerald-200 animate-fadeIn">
                            <CheckCircle className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                            <span className="text-[11px] font-bold text-emerald-700">{taskSendMessage}</span>
                          </div>
                        )}
                        {taskSendStatus === 'error' && (
                          <div className="flex items-center gap-2 py-2.5 px-4 rounded-xl bg-rose-50 border border-rose-200 animate-fadeIn">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-rose-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-[11px] font-bold text-rose-700">{taskSendMessage}</span>
                          </div>
                        )}
                      </div>
                    </div>

                  </div>

                  {/* Right Column: Remarks & Assessment Responses (5 cols) */}
                  <div className="lg:col-span-5 space-y-6">
                    {/* Fetched Technical Questions Card */}
                    {fetchedQuestions && (
                      <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm space-y-4 animate-fadeIn">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                          <div>
                            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Send Technical Test</h3>
                            <p className="text-[10px] text-slate-500 font-semibold mt-0.5 font-medium flex items-center gap-1.5">
                              <Clock className="h-3.5 w-3.5 text-amber-500" />
                              <span className="text-amber-700 font-bold">Duration: 30 mins</span>
                              <span className="text-slate-300">•</span>
                              <span>Select questions from library below.</span>
                            </p>
                          </div>
                        </div>

                        <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1 admin-scrollbar">
                          {fetchedQuestions.map((q, qidx) => {
                            const isChecked = selectedQuestionsForCandidate.includes(q.id);
                            return (
                              <div
                                key={q.id || qidx}
                                onClick={() => handleToggleQuestionSelection(q.id)}
                                className={`border rounded-2xl p-4 space-y-2 text-left transition-all duration-200 cursor-pointer ${isChecked
                                  ? 'bg-blue-50/30 border-blue-400 ring-1 ring-blue-400/20'
                                  : 'bg-slate-50/50 border-slate-150 hover:border-slate-350'
                                  }`}
                              >
                                <div className="text-xs font-black text-slate-800 flex items-start gap-2.5">
                                  <input
                                    type="checkbox"
                                    checked={isChecked}
                                    onChange={() => { }} // onClick on wrapper handles toggle
                                    className="mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                  />
                                  <div className="flex-1 flex items-center justify-between gap-2">
                                    <span className="font-bold text-slate-900 pr-2">Q{qidx + 1}. {q.question}</span>
                                  </div>
                                </div>

                                {/* Render options if present */}
                                {(q.optionA || q.optionB || q.optionC || q.optionD) && (
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-6 mt-1.5 text-[11px] text-slate-650 font-semibold">
                                    {q.optionA && <div><span className="text-slate-400 mr-1 font-bold">A.</span> {q.optionA}</div>}
                                    {q.optionB && <div><span className="text-slate-400 mr-1 font-bold">B.</span> {q.optionB}</div>}
                                    {q.optionC && <div><span className="text-slate-400 mr-1 font-bold">C.</span> {q.optionC}</div>}
                                    {q.optionD && <div><span className="text-slate-400 mr-1 font-bold">D.</span> {q.optionD}</div>}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>

                        <div className="pt-2 border-t border-slate-100 flex flex-col gap-2.5">
                          <button
                            type="button"
                            onClick={handleSendAssessmentToCandidate}
                            disabled={sendingAssessment || selectedQuestionsForCandidate.length === 0}
                            className="w-full flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-[#004AAD] hover:bg-[#003882] text-white transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-blue-500/10 border-none outline-none"
                          >
                            <span>{sendingAssessment ? 'Sending...' : 'Send Test to Candidate'}</span>
                          </button>

                          {/* Inline success feedback after sending */}
                          {success && success.includes('questions successfully sent') && (
                            <div className="flex items-center justify-center gap-1.5 py-2 rounded-xl bg-emerald-50 border border-emerald-200 animate-fadeIn">
                              <CheckCircle className="h-4 w-4 text-emerald-500" />
                              <span className="text-[11px] font-bold text-emerald-700">Sent successfully!</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Technical Online Meeting Card */}
                    <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm space-y-4">
                      <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                        <Calendar className="h-5 w-5 text-[#004AAD]" />
                        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Technical Interview</h3>
                      </div>

                      <div className="space-y-4 text-left">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Interview Date</label>
                            <input
                              type="date"
                              value={interviewDate}
                              onChange={(e) => setInterviewDate(e.target.value)}
                              className="w-full admin-custom-input border border-slate-350 rounded-xl py-2 px-3 focus:outline-none text-xs text-slate-700 bg-white"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Interview Time</label>
                            <input
                              type="time"
                              value={interviewTime}
                              onChange={(e) => setInterviewTime(e.target.value)}
                              className="w-full admin-custom-input border border-slate-350 rounded-xl py-2 px-3 focus:outline-none text-xs text-slate-700 bg-white"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Meeting Link (Google Meet / Zoom)</label>
                          <input
                            type="url"
                            value={interviewLink}
                            onChange={(e) => setInterviewLink(e.target.value)}
                            placeholder="https://meet.google.com/abc-defg-hij"
                            className="w-full admin-custom-input border border-slate-350 rounded-xl py-2.5 px-3.5 focus:outline-none text-xs text-slate-700 bg-white font-semibold"
                          />
                        </div>

                        <button
                          type="button"
                          onClick={handleScheduleMeeting}
                          disabled={schedulingMeeting || !interviewDate || !interviewTime || !interviewLink || selectedApplication?.interviewDate}
                          className="w-full flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-[#004AAD] hover:bg-[#003882] text-white transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-blue-500/10 border-none outline-none cursor-pointer"
                        >
                          <span>{schedulingMeeting ? 'Scheduling & Emailing...' : selectedApplication?.interviewDate ? 'Technical Interview Sent' : 'Schedule & Send BNX Mail'}</span>
                        </button>
                      </div>
                    </div>

                    {/* HR Interview Date & Time Card */}
                    <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm space-y-4">
                      <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                        <Calendar className="h-5 w-5 text-[#004AAD]" />
                        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">HR Interview</h3>
                      </div>

                      <div className="space-y-4 text-left">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">HR Interview Date</label>
                            <input
                              type="date"
                              value={hrInterviewDate}
                              onChange={(e) => setHrInterviewDate(e.target.value)}
                              className="w-full admin-custom-input border border-slate-350 rounded-xl py-2 px-3 focus:outline-none text-xs text-slate-700 bg-white"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">HR Interview Time</label>
                            <input
                              type="time"
                              value={hrInterviewTime}
                              onChange={(e) => setHrInterviewTime(e.target.value)}
                              className="w-full admin-custom-input border border-slate-350 rounded-xl py-2 px-3 focus:outline-none text-xs text-slate-700 bg-white"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1"> Location</label>
                          <input
                            type="text"
                            value={hrInterviewLocation}
                            onChange={(e) => setHrInterviewLocation(e.target.value)}
                            placeholder="Enter interview venue address"
                            className="w-full admin-custom-input border border-slate-350 rounded-xl py-2.5 px-3.5 focus:outline-none text-xs text-slate-700 bg-white font-semibold"
                          />
                        </div>

                        <button
                          type="button"
                          onClick={handleSaveHrInterview}
                          disabled={savingHrInterview || !hrInterviewDate || !hrInterviewTime || !hrInterviewLocation || !hrInterviewLocation.trim() || selectedApplication?.hrInterviewDate}
                          className="w-full flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-[#004AAD] hover:bg-[#003882] text-white transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-blue-500/10 border-none outline-none cursor-pointer"
                        >
                          <span>{savingHrInterview ? 'Sending...' : selectedApplication?.hrInterviewDate ? 'HR Interview Sent' : 'Send HR Interview Date & Time'}</span>
                        </button>
                      </div>
                    </div>

                    {/* Assessment Responses Card */}
                    {(() => {
                      const assignedQuestionsKey = `assessment_questions_${selectedApplication.id}`;
                      const answersKey = `assessment_answers_${selectedApplication.id}`;
                      const storedQuestions = localStorage.getItem(assignedQuestionsKey);
                      const storedAnswers = localStorage.getItem(answersKey);

                      if (storedQuestions && storedAnswers) {
                        try {
                          const qList = JSON.parse(storedQuestions);
                          const aList = JSON.parse(storedAnswers);

                          return (
                            <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm space-y-4">
                              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider pb-3 border-b border-slate-100">Assessment Q&A Responses</h3>

                              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1 admin-scrollbar">
                                {qList.map((q, qidx) => {
                                  const candAnswer = aList[q.id];
                                  return (
                                    <div key={q.id} className="bg-slate-50 border border-slate-150 rounded-2xl p-4 space-y-2 text-left">
                                      <div className="text-xs font-black text-slate-800">
                                        Q{qidx + 1}. {q.title}
                                      </div>
                                      <p className="text-slate-500 text-[11px] leading-relaxed italic">
                                        {q.description}
                                      </p>
                                      <div className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-800">
                                        <span className="text-slate-400 block text-[9px] uppercase font-bold mb-0.5">Candidate Response:</span>
                                        <span className="font-bold text-slate-900 text-xs whitespace-pre-wrap">{candAnswer !== undefined ? candAnswer : "No response entered."}</span>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        } catch (parseErr) {
                          console.warn('Error parsing local storage questions/answers:', parseErr);
                        }
                      }
                      return null;
                    })()}
                  </div>
                </div>
              </div>
            )}

            {/* Sub Tab 3: Partnership Requests */}
            {activeSubTab === 'partnerships' && (
              <div className="space-y-6 animate-fadeIn text-left">
                <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 font-sans">Partnership Proposals</h2>
                    <p className="text-xs text-slate-500 mt-1">Review strategic ecosystem partner requests and integration proposals.</p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-blue-50 border border-blue-250 text-[#004AAD] text-xs font-extrabold uppercase select-none">
                    Total: {partnerships.length}
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  {partnerships.length === 0 ? (
                    <div className="admin-glass-card p-12 text-center text-slate-500 rounded-2xl bg-white border border-slate-200">
                      No partnership requests found.
                    </div>
                  ) : (
                    partnerships.map((partner) => (
                      <div key={partner.id} className="admin-glass-card p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between text-left space-y-4">
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                          <div>
                            <div className="flex items-center space-x-2">
                              <h3 className="text-lg font-bold text-slate-900 leading-snug">{partner.company}</h3>
                              <span className="px-2.5 py-0.5 rounded bg-blue-50 border border-blue-150 text-[#004AAD] text-[10px] font-bold uppercase tracking-wider">
                                {partner.partnerType}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 font-semibold mt-1">
                              Contact: <span className="text-slate-700 font-bold">{partner.name}</span> &lt;{partner.email}&gt;
                            </p>
                          </div>

                          <div className="flex flex-wrap gap-2 text-[10px] md:text-right">
                            <span className="px-2.5 py-1 rounded bg-slate-50 border border-slate-200 text-slate-650 font-bold uppercase select-none">
                              Size: {partner.companySize}
                            </span>
                            <span className="px-2.5 py-1 rounded bg-slate-50 border border-slate-200 text-slate-650 font-bold uppercase select-none">
                              Market: {partner.marketFocus}
                            </span>
                            <button
                              onClick={() => handlePartnerDismiss(partner.id)}
                              className="px-2.5 py-1 rounded bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 font-bold uppercase transition flex items-center space-x-1 cursor-pointer select-none"
                              title="Dismiss Request"
                            >
                              <Trash className="h-3 w-3 text-red-500" />
                              <span>Dismiss</span>
                            </button>
                          </div>
                        </div>

                        <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl">
                          <div className="text-[10px] font-bold text-slate-400 uppercase mb-2">Proposal Details</div>
                          <p className="text-slate-700 text-xs leading-relaxed whitespace-pre-line font-medium">
                            {partner.proposal}
                          </p>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-slate-100 pt-4 text-xs font-semibold text-slate-500">
                          <div className="flex flex-col sm:flex-row sm:space-x-4">
                            <span>Phone: <span className="text-slate-800 font-bold">{partner.phone}</span></span>
                            {partner.website && partner.website !== 'N/A' && (
                              <span>Website: <a href={partner.website} target="_blank" rel="noopener noreferrer" className="text-[#004AAD] hover:underline font-bold">{partner.website}</a></span>
                            )}
                          </div>
                          <span className="text-[10px] text-slate-450 font-bold uppercase tracking-wider self-start sm:self-auto">
                            Received {new Date(partner.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Sub Tab 4: Support Requests */}
            {activeSubTab === 'support' && (
              <div className="space-y-6 animate-fadeIn text-left">
                <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 font-sans">Support Tickets</h2>
                    <p className="text-xs text-slate-500 mt-1">Manage and respond to product setup inquiries and diagnostic tickets.</p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-blue-50 border border-blue-250 text-[#004AAD] text-xs font-extrabold uppercase select-none">
                    Total: {supports.length}
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  {supports.length === 0 ? (
                    <div className="admin-glass-card p-12 text-center text-slate-500 rounded-2xl bg-white border border-slate-200">
                      No support requests found.
                    </div>
                  ) : (
                    supports.map((ticket) => (
                      <div key={ticket.id} className="admin-glass-card p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between text-left space-y-4">
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                          <div>
                            <div className="flex items-center space-x-2">
                              <h3 className="text-lg font-bold text-slate-900 leading-snug">{ticket.name}</h3>
                              <span className="px-2.5 py-0.5 rounded bg-emerald-50 border border-emerald-150 text-emerald-700 text-[10px] font-bold uppercase tracking-wider">
                                {ticket.product}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 font-semibold mt-1">
                              Email: <a href={`mailto:${ticket.email}`} className="text-[#004AAD] hover:underline font-bold">{ticket.email}</a>
                            </p>
                          </div>

                          <div className="flex flex-wrap gap-2 text-[10px] md:text-right">
                            <button
                              onClick={() => handleSupportDismiss(ticket.id)}
                              className="px-2.5 py-1 rounded bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 font-bold uppercase transition flex items-center space-x-1 cursor-pointer select-none"
                              title="Resolve / Dismiss Ticket"
                            >
                              <Trash className="h-3 w-3 text-red-500" />
                              <span>Resolve</span>
                            </button>
                          </div>
                        </div>

                        <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl">
                          <div className="text-[10px] font-bold text-slate-400 uppercase mb-2">Message / Issue description</div>
                          <p className="text-slate-700 text-xs leading-relaxed whitespace-pre-line font-medium">
                            {ticket.message}
                          </p>
                        </div>

                        <div className="flex sm:items-center justify-between gap-3 border-t border-slate-100 pt-4 text-xs font-semibold text-slate-500">
                          <span className="text-[10px] text-slate-450 font-bold uppercase tracking-wider">
                            Received {new Date(ticket.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Sub Tab 5: Analytics Dashboard */}
            {activeSubTab === 'analytics' && (
              <div className="space-y-6 animate-fadeIn text-left">
                <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 font-sans">Analytics Overview</h2>
                    <p className="text-xs text-slate-500 mt-1">Real-time statistics, conversion pipelines, and candidate demographic data.</p>
                  </div>
                </div>

                {/* Main Stats Cards Grid */}
                {(() => {
                  const totalApps = externalApplications.length;
                  const hiredCount = externalApplications.filter(app => app.status === 'Accepted' || app.status === 'Joined').length;
                  const interviewedCount = externalApplications.filter(app => app.status === 'Interview Scheduled' || app.status === 'Interview Completed').length;
                  const conversionRate = totalApps > 0 ? Math.round((hiredCount / totalApps) * 100) : 0;
                  const interviewRate = totalApps > 0 ? Math.round((interviewedCount / totalApps) * 100) : 0;

                  return (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm space-y-1">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Total Applications</span>
                        <span className="text-3xl font-black text-[#004AAD]">{totalApps}</span>
                      </div>
                      <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm space-y-1">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Interview Progression Rate</span>
                        <span className="text-3xl font-black text-amber-600">{interviewRate}%</span>
                      </div>
                      <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm space-y-1">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Final Placement Conversion</span>
                        <span className="text-3xl font-black text-emerald-600">{conversionRate}%</span>
                      </div>
                    </div>
                  );
                })()}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left Column: Applications per role Progress Bar Chart */}
                  <div className="lg:col-span-1 bg-white border border-slate-200 p-6 rounded-2xl shadow-sm flex flex-col space-y-4">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Applications per Role</h3>
                      <p className="text-[10px] text-slate-450 font-semibold mt-0.5">Applicant distribution by posting title</p>
                    </div>
                    <div className="space-y-3.5 flex-grow flex flex-col justify-center">
                      {Array.from(new Set(externalApplications.map(app => app.jobTitle))).slice(0, 4).map(role => {
                        const count = externalApplications.filter(app => app.jobTitle === role).length;
                        const total = externalApplications.length || 1;
                        const pct = Math.round((count / total) * 100);
                        return (
                          <div key={role} className="space-y-1.5">
                            <div className="flex justify-between text-xs font-bold text-slate-800">
                              <span className="truncate max-w-[160px]" title={role}>{role}</span>
                              <span>{count} ({pct}%)</span>
                            </div>
                            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                              <div className="h-full bg-blue-600 rounded-full" style={{ width: `${pct}%` }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Middle Column: Conversion rates funnel */}
                  <div className="lg:col-span-1 bg-white border border-slate-200 p-6 rounded-2xl shadow-sm flex flex-col space-y-4">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Conversion Funnel</h3>
                      <p className="text-[10px] text-slate-450 font-semibold mt-0.5">Progression from applied to placement</p>
                    </div>
                    <div className="space-y-4 flex-grow flex flex-col justify-center">
                      {(() => {
                        const total = externalApplications.length || 1;
                        const interviewed = externalApplications.filter(app => app.status !== 'Candidates' && app.status !== 'Shortlisted').length;
                        const hired = externalApplications.filter(app => app.status === 'Accepted' || app.status === 'Joined').length;

                        const intPct = Math.round((interviewed / total) * 100);
                        const hiredPct = Math.round((hired / total) * 100);

                        return (
                          <>
                            {/* Level 1: Applied */}
                            <div className="space-y-1 text-center bg-slate-50 border border-slate-200/80 p-3 rounded-xl">
                              <div className="text-xs font-bold text-slate-800">Applied (Total Intake)</div>
                              <div className="text-sm font-black text-[#004AAD]">{total} Candidates</div>
                            </div>
                            {/* Arrow */}
                            <div className="text-center text-slate-300 font-bold">&darr;</div>
                            {/* Level 2: Interviewed */}
                            <div className="space-y-1 text-center bg-amber-50/50 border border-amber-100 p-3 rounded-xl">
                              <div className="text-xs font-bold text-amber-800">Assessed & Interviewed ({intPct}%)</div>
                              <div className="text-sm font-black text-amber-700">{interviewed} Candidates</div>
                            </div>
                            {/* Arrow */}
                            <div className="text-center text-slate-300 font-bold">&darr;</div>
                            {/* Level 3: Hired */}
                            <div className="space-y-1 text-center bg-emerald-50 border border-emerald-150 p-3 rounded-xl">
                              <div className="text-xs font-bold text-emerald-800">Placements & Hired ({hiredPct}%)</div>
                              <div className="text-sm font-black text-emerald-700">{hired} Offers</div>
                            </div>
                          </>
                        );
                      })()}
                    </div>
                  </div>

                  {/* Right Column: Location breakdown */}
                  <div className="lg:col-span-1 bg-white border border-slate-200 p-6 rounded-2xl shadow-sm flex flex-col space-y-4">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Work Location Distribution</h3>
                      <p className="text-[10px] text-slate-455 font-semibold mt-0.5">Where candidates are placed</p>
                    </div>
                    <div className="space-y-5 flex-grow flex flex-col justify-center">
                      {(() => {
                        const total = externalApplications.length || 1;
                        const remote = externalApplications.filter(app => (app.jobLocation || '').toLowerCase().includes('remote')).length;
                        const hybrid = externalApplications.filter(app => (app.jobLocation || '').toLowerCase().includes('hybrid')).length;
                        const onsite = total - remote - hybrid;

                        const remotePct = Math.round((remote / total) * 100) || 30;
                        const hybridPct = Math.round((hybrid / total) * 100) || 50;
                        const onsitePct = Math.round((onsite / total) * 100) || 20;

                        return (
                          <>
                            {/* Remote */}
                            <div className="space-y-1">
                              <div className="flex justify-between text-xs font-bold text-slate-800">
                                <span>Remote Roles</span>
                                <span>{remotePct}%</span>
                              </div>
                              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${remotePct}%` }} />
                              </div>
                            </div>
                            {/* Hybrid */}
                            <div className="space-y-1">
                              <div className="flex justify-between text-xs font-bold text-slate-800">
                                <span>Hybrid Roles</span>
                                <span>{hybridPct}%</span>
                              </div>
                              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-purple-500 rounded-full" style={{ width: `${hybridPct}%` }} />
                              </div>
                            </div>
                            {/* Onsite */}
                            <div className="space-y-1">
                              <div className="flex justify-between text-xs font-bold text-slate-800">
                                <span>Onsite Roles</span>
                                <span>{onsitePct}%</span>
                              </div>
                              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-amber-500 rounded-full" style={{ width: `${onsitePct}%` }} />
                              </div>
                            </div>
                          </>
                        );
                      })()}
                    </div>
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

      {/* Modal for Candidate Profile Review & Interview Scheduling */}
      {false && selectedApplication && activeSubTab !== 'candidateDetails' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-2xl text-left my-8 admin-scrollbar overflow-y-auto max-h-[90vh]">
            <button
              onClick={() => setSelectedApplication(null)}
              className="absolute right-4 top-4 p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition animate-fadeIn"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-xl font-extrabold text-slate-900 mb-2">
              Review Candidate Profile
            </h3>
            <p className="text-xs text-slate-500 mb-6 border-b border-slate-100 pb-2">
              Review info, update candidacy status, or schedule an interview below.
            </p>

            <div className="space-y-6">
              {/* Stepper / Progress Tracking */}
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-3">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-widest text-center">Candidate Hiring Progress</div>
                <div className="text-[10px] text-slate-400 font-semibold text-center mt-0.5">Click any card below to progress/update the candidate's hiring stage.</div>
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
                  {['Candidates', 'Shortlisted', 'Interview Scheduled', 'Interview Completed', 'Accepted', 'Joined'].map((step, idx) => {
                    const order = ['Candidates', 'Shortlisted', 'Interview Scheduled', 'Interview Completed', 'Accepted', 'Joined'];
                    const curIdx = order.indexOf(selectedApplication.status);
                    const hasInterview = selectedApplication.interviewDate && selectedApplication.interviewDate !== '' && selectedApplication.interviewDate !== 'null' && selectedApplication.interviewDate !== 'undefined';

                    let isCompleted = false;
                    if (step === 'Candidates') {
                      isCompleted = true;
                    } else if (step === 'Shortlisted') {
                      isCompleted = selectedApplication.status !== 'Candidates' || selectedApplication.aptitudeStatus === 'Assessment Sent';
                    } else if (step === 'Interview Scheduled') {
                      isCompleted = hasInterview;
                    } else if (step === 'Interview Completed') {
                      isCompleted = hasInterview && (selectedApplication.status === 'Interview Completed' || selectedApplication.status === 'Accepted' || selectedApplication.status === 'Joined');
                    } else if (step === 'Accepted') {
                      isCompleted = selectedApplication.status === 'Accepted' || selectedApplication.status === 'Joined';
                    } else if (step === 'Joined') {
                      isCompleted = selectedApplication.status === 'Joined';
                    }

                    const isCurrent = selectedApplication.status === step;

                    return (
                      <div
                        key={step}
                        onClick={() => {
                          if (!loading) {
                            handleUpdateStatus(selectedApplication.id, step);
                          }
                        }}
                        className={`flex flex-col items-center justify-center p-2 rounded-xl border text-center transition duration-300 cursor-pointer hover:border-blue-400 hover:bg-slate-100 hover:shadow-xs ${isCurrent
                          ? 'bg-blue-600 border-transparent text-white shadow-sm font-bold'
                          : isCompleted
                            ? 'bg-emerald-50 border-emerald-100 text-emerald-700'
                            : 'bg-white border-slate-100 text-slate-400'
                          }`}
                      >
                        <span className="text-[10px] font-extrabold tracking-tight block">
                          {step}
                        </span>
                        {isCompleted && (
                          <span className="text-[10px] font-bold text-emerald-600 block mt-0.5">✓</span>
                        )}
                      </div>
                    );
                  })}
                </div>
                {selectedApplication.status === 'Rejected' && (
                  <div className="text-xs font-semibold text-rose-600 bg-rose-50 border border-rose-100 p-2.5 rounded-lg text-center animate-pulse">
                    This candidate has been Rejected.
                  </div>
                )}
              </div>

              {/* Profile Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div>
                  <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Candidate Name</label>
                  <p className="text-sm font-bold text-slate-900 mt-0.5">{selectedApplication.fullName}</p>

                  <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mt-3">Contact Email</label>
                  <p className="text-xs font-semibold text-slate-700 mt-0.5">{selectedApplication.email}</p>

                  {selectedApplication.phone && (
                    <>
                      <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mt-3">Phone</label>
                      <p className="text-xs font-semibold text-slate-700 mt-0.5">{selectedApplication.phone}</p>
                    </>
                  )}
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Applied Position</label>
                  <p className="text-sm font-bold text-slate-900 mt-0.5">{selectedApplication.jobTitle}</p>

                  <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mt-3">Dept & Location</label>
                  <p className="text-xs font-semibold text-slate-700 mt-0.5">{selectedApplication.jobDepartment} • {selectedApplication.jobLocation}</p>

                  <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Current Status</label>
                  <span className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-bold capitalize mt-1 ${selectedApplication.status === 'Candidates' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' :
                    selectedApplication.status === 'Round 1 Aptitude' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                      selectedApplication.status === 'Round 2 Technical' ? 'bg-sky-50 text-sky-700 border border-sky-200' :
                        selectedApplication.status === 'Round 3 Brand Awareness' ? 'bg-fuchsia-50 text-fuchsia-700 border border-fuchsia-200' :
                          selectedApplication.status === 'Shortlisted' ? 'bg-purple-50 text-purple-700 border border-purple-200' :
                            selectedApplication.status === 'Interview Scheduled' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                              selectedApplication.status === 'Interview Completed' ? 'bg-cyan-50 text-cyan-700 border border-cyan-200' :
                                selectedApplication.status === 'Accepted' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                                  selectedApplication.status === 'Rejected' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                                    selectedApplication.status === 'Joined' ? 'bg-teal-50 text-teal-700 border border-teal-200' :
                                      'bg-slate-50 text-slate-700 border border-slate-200'
                    }`}>
                    {selectedApplication.status}
                  </span>
                </div>
              </div>

              {/* View Candidate Answers */}
              {(() => {
                const assignedQuestionsKey = `assessment_questions_${selectedApplication.id}`;
                const answersKey = `assessment_answers_${selectedApplication.id}`;
                const storedQuestions = localStorage.getItem(assignedQuestionsKey);
                const storedAnswers = localStorage.getItem(answersKey);

                if (storedQuestions && storedAnswers) {
                  const qList = JSON.parse(storedQuestions);
                  const aList = JSON.parse(storedAnswers);

                  return (
                    <div className="border-t border-slate-100 pt-4">
                      <label className="text-xs font-bold uppercase block mb-2.5 text-slate-800">
                        View Candidate Assessment Answers (Score: {selectedApplication.aptitudeScore || '0'}%)
                      </label>
                      <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-4 max-h-[220px] overflow-y-auto admin-scrollbar">
                        {qList.map((q, qidx) => {
                          const candAnswer = aList[q.id];
                          return (
                            <div key={q.id} className="space-y-1.5 border-b border-slate-200/60 pb-3 last:border-b-0 last:pb-0 text-xs">
                              <div className="font-bold text-slate-900">
                                Q{qidx + 1}. {q.title}
                              </div>
                              <p className="text-slate-500 italic">
                                {q.description}
                              </p>
                              <div className="p-2.5 bg-white border border-slate-200 rounded-lg text-slate-800">
                                <span className="text-slate-400 block text-[9px] uppercase font-bold mb-0.5">Candidate Response:</span>
                                <span className="font-semibold text-slate-900 whitespace-pre-wrap">{candAnswer !== undefined ? candAnswer : "No response entered."}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                }
                return null;
              })()}
            </div>
          </div>
        </div>
      )}



      {/* Modal for Aptitude Category Questions */}
      {selectedAptitudeCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-4xl bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-2xl text-left my-8 admin-scrollbar overflow-y-auto max-h-[90vh]">
            <button
              onClick={() => {
                setSelectedAptitudeCategory(null);
                setSelectedAptitudeQuestionIds([]);
              }}
              className="absolute right-4 top-4 p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center space-x-3 mb-6">
              <div className={`p-3 rounded-2xl ${selectedAptitudeCategory === 'Quant' ? 'bg-blue-50 text-blue-600' :
                selectedAptitudeCategory === 'Logical' ? 'bg-purple-50 text-purple-600' :
                  selectedAptitudeCategory === 'Verbal' ? 'bg-amber-50 text-amber-600' :
                    'bg-emerald-50 text-emerald-600'
                }`}>
                {selectedAptitudeCategory === 'Quant' && <Calculator className="h-6 w-6" />}
                {selectedAptitudeCategory === 'Logical' && <Brain className="h-6 w-6" />}
                {selectedAptitudeCategory === 'Verbal' && <BookOpen className="h-6 w-6" />}
                {selectedAptitudeCategory === 'Data Int.' && <BarChart3 className="h-6 w-6" />}
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-slate-900 leading-snug">
                  {selectedAptitudeCategory} Assessment Library
                </h3>
                <p className="text-xs text-slate-500 font-semibold mt-1">
                  Manage the 50 standard screening questions configured for this category.
                </p>
              </div>
            </div>

            {/* Bulk Actions Alert */}
            {selectedAptitudeQuestionIds.length > 0 && (
              <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 animate-fadeIn text-xs font-bold text-slate-700 text-left">
                <div className="space-y-1.5">
                  <span className="text-[#004AAD] font-extrabold text-sm block">
                    {selectedAptitudeQuestionIds.length} Screening Question(s) Selected
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-450 uppercase tracking-widest text-[9px] font-bold">Send Assessment:</span>
                    <select
                      onChange={(e) => {
                        const appId = e.target.value;
                        if (!appId) return;
                        handleAssignQuestions(appId);
                        e.target.value = '';
                      }}
                      className="bg-white border border-slate-300 rounded-lg py-1 px-2.5 focus:outline-none text-[11px] transition cursor-pointer font-bold"
                    >
                      <option value="">Choose Candidate...</option>
                      {externalApplications
                        .filter(app => app.status === 'Round 1 Aptitude')
                        .map(app => (
                          <option key={app.id} value={app.id}>
                            {app.fullName} ({app.jobTitle})
                          </option>
                        ))}
                    </select>
                  </div>
                </div>
                <div className="flex gap-2 self-end md:self-auto">
                  <button
                    onClick={() => {
                      if (window.confirm(`Are you sure you want to delete these ${selectedAptitudeQuestionIds.length} question(s)?`)) {
                        setSuccess(`${selectedAptitudeQuestionIds.length} question(s) deleted successfully.`);
                        setSelectedAptitudeQuestionIds([]);
                        setTimeout(() => setSuccess(''), 3000);
                      }
                    }}
                    className="px-3.5 py-2 bg-red-50 text-red-650 hover:bg-red-100 rounded-xl font-bold border border-red-200 transition cursor-pointer"
                  >
                    Delete Selected
                  </button>
                  <button
                    onClick={() => {
                      setSuccess(`${selectedAptitudeQuestionIds.length} question(s) marked as active.`);
                      setSelectedAptitudeQuestionIds([]);
                      setTimeout(() => setSuccess(''), 3000);
                    }}
                    className="px-3.5 py-2 bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 rounded-xl font-bold transition cursor-pointer"
                  >
                    Mark as Active
                  </button>
                </div>
              </div>
            )}

            {/* Questions Table */}
            <div className="overflow-x-auto rounded-xl border border-slate-200 max-h-[55vh] overflow-y-auto admin-scrollbar">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[10px] uppercase tracking-wider font-bold sticky top-0 z-10">
                  <tr>
                    <th className="py-3 px-4 font-bold w-10">
                      <input
                        type="checkbox"
                        checked={selectedAptitudeQuestionIds.length === 50}
                        onChange={(e) => {
                          if (e.target.checked) {
                            const allIds = generateAptitudeQuestions(selectedAptitudeCategory).map(q => q.id);
                            setSelectedAptitudeQuestionIds(allIds);
                          } else {
                            setSelectedAptitudeQuestionIds([]);
                          }
                        }}
                        className="h-4 w-4 rounded border-slate-300 text-[#004AAD] focus:ring-[#004AAD] cursor-pointer"
                      />
                    </th>
                    <th className="py-3 px-4 font-bold">ID</th>
                    <th className="py-3 px-4 font-bold">Title</th>
                    <th className="py-3 px-4 font-bold">Difficulty</th>
                    <th className="py-3 px-4 font-bold">Time Limit</th>
                    <th className="py-3 px-4 font-bold">Description / Concept</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                  {generateAptitudeQuestions(selectedAptitudeCategory).map((q) => (
                    <tr key={q.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3.5 px-4 w-10">
                        <input
                          type="checkbox"
                          checked={selectedAptitudeQuestionIds.includes(q.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedAptitudeQuestionIds(prev => [...prev, q.id]);
                            } else {
                              setSelectedAptitudeQuestionIds(prev => prev.filter(id => id !== q.id));
                            }
                          }}
                          className="h-4 w-4 rounded border-slate-300 text-[#004AAD] focus:ring-[#004AAD] cursor-pointer"
                        />
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-[#004AAD]">{q.id.toUpperCase()}</td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">{q.title}</td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${q.difficulty === 'Hard' ? 'bg-red-50 text-red-700 border border-red-200' :
                          q.difficulty === 'Medium' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                            'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          }`}>
                          {q.difficulty}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">{q.time}</td>
                      <td className="py-3.5 px-4 max-w-sm truncate" title={q.description}>{q.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
              <button
                onClick={() => {
                  setSelectedAptitudeCategory(null);
                  setSelectedAptitudeQuestionIds([]);
                }}
                className="px-5 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition cursor-pointer"
              >
                Close Library
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal for Resume Viewer */}
      {selectedResumeUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-4xl bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-2xl text-left my-8 admin-scrollbar overflow-y-auto max-h-[90vh]">
            {/* Top Header Row with Download and Close buttons */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  {selectedResumeCandidate}'s Resume
                </h3>
                <p className="text-xs text-slate-550 font-bold mt-0.5">
                  Screening profile attachment sheet
                </p>
              </div>

              <div className="flex items-center space-x-3">
                <a
                  href={selectedResumeUrl.startsWith('http') ? selectedResumeUrl : `${BACKEND_API_BASE}${selectedResumeUrl.startsWith('/') ? '' : '/'}${selectedResumeUrl}`}
                  download={`${selectedResumeCandidate.replace(/\s+/g, '_')}_Resume.pdf`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 px-4 py-2 bg-[#004AAD] hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition cursor-pointer shadow-lg shadow-blue-500/10 border-none outline-none"
                >
                  <Download className="h-4 w-4 text-white" />
                  <span>Download Resume</span>
                </a>
                <button
                  onClick={() => {
                    setSelectedResumeUrl(null);
                    setSelectedResumeCandidate(null);
                  }}
                  className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Resume sheet preview */}
            <div className="bg-slate-50 rounded-2xl border border-slate-200 shadow-inner overflow-hidden h-[65vh]">
              <iframe
                src={selectedResumeUrl.startsWith('http') ? selectedResumeUrl : `${BACKEND_API_BASE}${selectedResumeUrl.startsWith('/') ? '' : '/'}${selectedResumeUrl}`}
                className="w-full h-full border-none"
                title={`${selectedResumeCandidate}'s Resume`}
              />
            </div>
          </div>
        </div>
      )}

      {/* Modal for Assigning Assessment */}
      {isAssignModalOpen && selectedCandidateForAssessment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-2xl text-left my-8 max-h-[90vh] flex flex-col">
            <button
              onClick={() => {
                setIsAssignModalOpen(false);
                setSelectedCandidateForAssessment(null);
                setSelectedQuestionIds([]);
                setAssignError('');
                setQuestionSearchQuery('');
                setQuestionCategoryQuery('All');
              }}
              className="absolute right-4 top-4 p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="mb-4">
              <h3 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center justify-between">
                <span>Assign Assessment</span>
                <span className="text-xs font-bold text-blue-600 bg-blue-50 border border-blue-200/50 px-3 py-1 rounded-full">
                  {selectedQuestionIds.length} Question{selectedQuestionIds.length !== 1 ? 's' : ''} Selected
                </span>
              </h3>
              <p className="text-slate-500 text-xs mt-1">
                Select assessment questions and duration for candidate: <strong className="text-slate-905">{selectedCandidateForAssessment.fullName}</strong>
              </p>
            </div>

            {/* Error alerts inside modal */}
            {assignError && (
              <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-600 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="h-4.5 w-4.5 text-rose-500" />
                <span>{assignError}</span>
              </div>
            )}

            {/* Duration Input */}
            <div className="mb-4 flex items-center space-x-3 bg-slate-50 border border-slate-200 p-3 rounded-2xl">
              <Clock className="h-5 w-5 text-slate-400" />
              <div className="flex-1">
                <label className="text-[10px] text-slate-450 font-bold uppercase tracking-widest block">Test Duration (Minutes)</label>
                <input
                  type="number"
                  min="1"
                  value={assessmentDuration}
                  onChange={(e) => setAssessmentDuration(e.target.value)}
                  placeholder="e.g. 30"
                  className="bg-transparent border-none text-slate-905 font-extrabold text-sm focus:outline-none w-full"
                />
              </div>
            </div>

            {/* Questions Filter Bar */}
            <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Search Questions</label>
                <input
                  type="text"
                  value={questionSearchQuery}
                  onChange={(e) => setQuestionSearchQuery(e.target.value)}
                  placeholder="Search questions by keyword..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 focus:outline-none text-xs text-slate-700"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Filter by Category</label>
                <select
                  value={questionCategoryQuery}
                  onChange={(e) => setQuestionCategoryQuery(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 focus:outline-none text-xs text-slate-700 cursor-pointer"
                >
                  <option value="All">All Categories</option>
                  <option value="Java">Java</option>
                  <option value="Python">Python</option>
                  <option value="SQL">SQL</option>
                  <option value="HTML/CSS">HTML/CSS</option>
                  <option value="React">React</option>
                </select>
              </div>
            </div>

            {/* Questions list wrapper */}
            <div className="flex-1 overflow-y-auto min-h-[200px] border border-slate-200 rounded-2xl p-4 mb-6 space-y-3 admin-scrollbar bg-slate-50/50">
              {loadingQuestions ? (
                <div className="py-12 text-center space-y-3">
                  <RefreshCw className="h-8 w-8 text-[#004AAD] animate-spin mx-auto" />
                  <p className="text-xs text-slate-550 font-semibold">Loading questions from library...</p>
                </div>
              ) : questionsError ? (
                <p className="text-rose-500 text-center text-xs font-bold py-12">{questionsError}</p>
              ) : allQuestions.length === 0 ? (
                <p className="text-slate-500 text-center text-xs italic py-12">No questions available in the library.</p>
              ) : (
                (() => {
                  const filtered = allQuestions
                    .filter(q => {
                      if (questionCategoryQuery !== 'All') {
                        const cat = (q.category || '').toLowerCase();
                        const title = (q.question || '').toLowerCase();
                        const filterVal = questionCategoryQuery.toLowerCase();

                        if (filterVal === 'java') {
                          const hasJava = cat.includes('java') || title.includes('java');
                          const hasJavaScript = cat.includes('javascript') || title.includes('javascript') || cat.includes('js');
                          if (hasJava && hasJavaScript) {
                            return /\bjava\b/i.test(cat) || /\bjava\b/i.test(title);
                          }
                          if (!hasJava) return false;
                        } else if (filterVal === 'python') {
                          if (!cat.includes('python') && !title.includes('python')) return false;
                        } else if (filterVal === 'sql') {
                          if (!cat.includes('sql') && !cat.includes('database') && !cat.includes('db') &&
                            !title.includes('sql') && !title.includes('database') && !title.includes('query')) return false;
                        } else if (filterVal === 'html/css') {
                          if (!cat.includes('html') && !cat.includes('css') &&
                            !title.includes('html') && !title.includes('css') && !title.includes('style') && !title.includes('class')) return false;
                        } else if (filterVal === 'react') {
                          if (!cat.includes('react') && !title.includes('react') &&
                            !title.includes('hook') && !title.includes('component') && !title.includes('state')) return false;
                        } else if (cat !== filterVal) {
                          return false;
                        }
                      }
                      if (questionSearchQuery) {
                        const query = questionSearchQuery.toLowerCase();
                        return (q.question || '').toLowerCase().includes(query) ||
                          (q.category || '').toLowerCase().includes(query);
                      }
                      return true;
                    });

                  if (filtered.length === 0) {
                    return <p className="text-slate-550 text-center text-xs italic py-12">No matching questions found.</p>;
                  }

                  return filtered.map((q) => {
                    const isChecked = selectedQuestionIds.includes(q.id);
                    return (
                      <label
                        key={q.id}
                        className={`flex items-start gap-3 p-3 rounded-xl border text-xs font-semibold cursor-pointer transition-all duration-200 ${isChecked
                          ? 'bg-blue-50/35 border-blue-400 text-blue-900 shadow-xs'
                          : 'bg-white border-slate-200 hover:border-slate-350 text-slate-700'
                          }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleQuestion(q.id)}
                          className="mt-0.5 h-4 w-4 border-slate-350 text-blue-600 focus:ring-blue-500 cursor-pointer"
                        />
                        <div className="space-y-1 w-full">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-mono text-[#004AAD] uppercase font-bold">Question {q.id}</span>
                            {q.category && (
                              <span className="text-[9px] px-1.5 py-0.5 bg-slate-100 border border-slate-200 rounded text-slate-500 uppercase font-extrabold tracking-wider">{q.category}</span>
                            )}
                          </div>
                          <p className="font-extrabold text-slate-900 leading-snug">{q.question}</p>
                          <div className="grid grid-cols-2 gap-x-4 gap-y-1 pt-1 text-[10px] text-slate-500 font-medium">
                            {q.optionA && <div>A: {q.optionA}</div>}
                            {q.optionB && <div>B: {q.optionB}</div>}
                            {q.optionC && <div>C: {q.optionC}</div>}
                            {q.optionD && <div>D: {q.optionD}</div>}
                          </div>
                        </div>
                      </label>
                    );
                  });
                })()
              )}
            </div>

            {/* Modal Actions */}
            <div className="flex gap-3 justify-end pt-2">
              <button
                onClick={() => {
                  setIsAssignModalOpen(false);
                  setSelectedCandidateForAssessment(null);
                  setSelectedQuestionIds([]);
                  setAssignError('');
                }}
                className="px-5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-bold transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSendAssessment}
                disabled={assigningAssessment || loadingQuestions}
                className="flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-[#004AAD] hover:bg-blue-700 text-white text-xs font-bold transition duration-200 cursor-pointer shadow-lg shadow-blue-500/10 disabled:opacity-55 disabled:cursor-not-allowed border-none outline-none"
              >
                {assigningAssessment ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin text-white" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <span>Assign Assessment</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
