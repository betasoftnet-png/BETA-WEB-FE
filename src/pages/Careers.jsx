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
  SlidersHorizontal,
  ArrowRight,
  ArrowLeft,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Bookmark,
  Share2,
  MoreHorizontal,
  AlertTriangle
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import api from '../api';



const JOB_BOARD_API_BASE =
  window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1'
    ? 'http://localhost:8081'
    : 'https://apply.beta-softnet.com';

const benefits = [
  { emoji: '💰', title: 'Bonus', desc: 'Competitive base package with performance bonuses tied to milestones.' },
  { emoji: '📚', title: 'Learning', desc: 'Annual education grant of $2,000 for courses and tech conferences.' },
  { emoji: '✈️', title: 'Trips', desc: 'Distributed team offsites and engineering hackathons worldwide.' },
  { emoji: '🎯', title: 'Mentorship', desc: 'Regular syncs with domain architects and technical roadmap reviews.' }
];

const processSteps = [
  { id: '1', title: 'Application', desc: 'Profile & PDF resume upload', icon: FileText, color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
  { id: '2', title: 'Assessment', desc: 'Initial evaluation test', icon: Code2, color: 'text-pink-400', bg: 'bg-pink-500/10 border-pink-500/20' },
  { id: '3', title: 'Technical interview', desc: 'Systems architecture alignment', icon: User, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
  { id: '4', title: 'Task Assessment', desc: 'GitHub task and code review', icon: CheckSquare, color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
  { id: '5', title: 'HR interview', desc: 'Culture fit & team alignment', icon: Users, color: 'text-pink-400', bg: 'bg-pink-500/10 border-pink-500/20' },
  { id: '6', title: 'Offer', desc: 'Final proposal discussions', icon: Award, color: 'text-[#F59E0B]', bg: 'bg-amber-500/10 border-amber-500/20' }
];
const mapStatusToUI = (status) => {
  if (!status) return 'Applied';
  const s = status.trim();
  const lower = s.toLowerCase();

  if (lower === 'pending' || lower === 'applied' || lower === 'under review' || lower === 'candidates' || lower === 'candidate') return 'Applied';
  if (lower === 'shortlisted') return 'Shortlisted';
  if (lower === 'assessment sent' || lower === 'round 1 test' || lower === 'round 1 aptitude' || lower === 'aptitude') return 'Assessment Sent';
  if (lower === 'technical interview' || lower === 'interview scheduled' || lower === 'scheduled' || lower === 'technical') return 'Technical Interview';
  if (lower === 'task assessment' || lower === 'task assigned' || lower === 'task submitted' || lower === 'task') return 'Task Assessment';
  if (lower === 'hr interview' || lower === 'hr scheduled' || lower === 'hr round' || lower === 'hr') return 'HR Interview';
  if (lower === 'accepted' || lower === 'selected' || lower === 'approved' || lower === 'joined' || lower === 'offer sent') return 'Selected';
  if (lower === 'rejected') return 'Rejected';
  return s;
};

const formatDate = (isoString) => {
  if (!isoString) return '';
  try {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return isoString;
  }
};

const AppliedTime = ({ timestamp }) => {
  const [timeAgo, setTimeAgo] = useState('');

  useEffect(() => {
    const calculateTimeAgo = () => {
      if (!timestamp) return '';
      try {
        const date = new Date(timestamp);
        const now = new Date();
        const diffMs = now - date;
        const diffSecs = Math.floor(diffMs / 1000);
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffSecs < 30) {
          return 'Applied just now';
        }
        if (diffSecs < 60) {
          return 'Applied less than a minute ago';
        }
        if (diffMins < 60) {
          return `Applied ${diffMins} ${diffMins === 1 ? 'minute' : 'minutes'} ago`;
        }
        if (diffHours < 24) {
          return `Applied ${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
        }
        if (diffDays < 7) {
          return `Applied ${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
        }
        const formattedDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        const formattedTime = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
        return `Applied on ${formattedDate} at ${formattedTime}`;
      } catch {
        return 'Applied';
      }
    };

    setTimeAgo(calculateTimeAgo());

    const interval = setInterval(() => {
      setTimeAgo(calculateTimeAgo());
    }, 60000);

    return () => clearInterval(interval);
  }, [timestamp]);

  return <span>{timeAgo || 'Applied'}</span>;
};

export default function Careers() {
  const navigate = useNavigate();
  const { user, redirectToSSO } = useContext(AuthContext);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const candidateToken = queryParams.get('token');
  const candidateId = candidateToken || queryParams.get('id');
  const isTaskAssessmentRoute = location.pathname.startsWith('/careers/task-assessment') || ((location.pathname === '/careers' || location.pathname === '/careers/') && candidateId);
  const isSavedJobsRoute = location.pathname.startsWith('/careers/saved-jobs');

  const [taskData, setTaskData] = useState(null);
  const [loadingTask, setLoadingTask] = useState(false);
  const [taskError, setTaskError] = useState('');
  const [gitLinkInput, setGitLinkInput] = useState('');
  const [submittingTask, setSubmittingTask] = useState(false);
  const [taskSubmitSuccess, setTaskSubmitSuccess] = useState(false);

  useEffect(() => {
    if (isTaskAssessmentRoute && candidateId) {
      const fetchTask = async () => {
        setLoadingTask(true);
        setTaskError('');
        try {
          const res = await axios.get(`${JOB_BOARD_API_BASE}/api/task-assessment/${candidateId}`);
          setTaskData(res.data);
          if (res.data?.candidate?.githubLink) {
            setGitLinkInput(res.data.candidate.githubLink);
          }
        } catch (err) {
          console.error(err);
          setTaskError('No task assessment found for this candidate, or the link is invalid.');
        } finally {
          setLoadingTask(false);
        }
      };
      fetchTask();
    }
  }, [isTaskAssessmentRoute, candidateId]);

  useEffect(() => {
    setJobsPage(1);
  }, [location.pathname]);

  useEffect(() => {
    if (isSavedJobsRoute && !user) {
      setShowLoginPrompt(true);
    }
  }, [isSavedJobsRoute, user]);

  const handleTaskSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!gitLinkInput.trim() || !candidateId) return;

    setSubmittingTask(true);
    setTaskError('');
    try {
      await axios.post(
        `${JOB_BOARD_API_BASE}/api/task-assessment/${candidateId}/submit`,
        { githubLink: gitLinkInput.trim() }
      );
      setTaskSubmitSuccess(true);
      const res = await axios.get(`${JOB_BOARD_API_BASE}/api/task-assessment/${candidateId}`);
      setTaskData(res.data);
    } catch (err) {
      console.error(err);
      setTaskError('Failed to submit GitHub repository. Please verify the link and try again.');
    } finally {
      setSubmittingTask(false);
    }
  };

  const [jobsList, setJobsList] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(false);
  const [jobsError, setJobsError] = useState('');

  const [selectedJob, setSelectedJob] = useState(null);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [experience, setExperience] = useState('Fresher / 0-1 Years');
  const [coverLetter, setCoverLetter] = useState('');
  const [resume, setResume] = useState(null);
  const [interviewDate, setInterviewDate] = useState('');
  const [interviewTime, setInterviewTime] = useState('');
  const [shouldSchedule, setShouldSchedule] = useState(false);

  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [message, setMessage] = useState('');

  // Live Job Search & Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // My Jobs Applications Tracking State
  const [showMyJobs, setShowMyJobs] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [myJobsLoading, setMyJobsLoading] = useState(false);
  const [myJobsError, setMyJobsError] = useState('');
  const [userApplications, setUserApplications] = useState([]);

  // Save, Share, Report states & handlers
  const [savedJobs, setSavedJobs] = useState([]);

  useEffect(() => {
    const fetchSavedJobs = async () => {
      if (user?.email) {
        try {
          const res = await axios.get(`${JOB_BOARD_API_BASE}/api/liked-jobs?email=${encodeURIComponent(user.email)}`);
          const ids = res.data.map(item => item.jobId);
          setSavedJobs(ids);
        } catch (err) {
          console.error('Failed to fetch saved jobs from backend:', err);
        }
      } else {
        setSavedJobs([]);
      }
    };
    fetchSavedJobs();
  }, [user]);

  const [activeReportJobId, setActiveReportJobId] = useState(null);

  const handleSaveJob = async (jobId) => {
    if (!user) {
      setShowLoginPrompt(true);
      return;
    }
    const isSaved = savedJobs.some(id => Number(id) === Number(jobId));
    try {
      if (isSaved) {
        await axios.delete(`${JOB_BOARD_API_BASE}/api/liked-jobs?email=${encodeURIComponent(user.email)}&jobId=${jobId}`);
        setSavedJobs(prev => prev.filter(id => Number(id) !== Number(jobId)));
      } else {
        await axios.post(`${JOB_BOARD_API_BASE}/api/liked-jobs`, {
          email: user.email,
          jobId: jobId
        });
        setSavedJobs(prev => {
          if (prev.some(id => Number(id) === Number(jobId))) return prev;
          return [...prev, jobId];
        });
        // Navigate to the Saved Jobs page/section immediately
        navigate('/careers/saved-jobs');
        setShowMyJobs(false);
      }
    } catch (err) {
      console.error('Failed to update saved job on backend:', err);
    }
  };

  const handleSavedJobsClick = () => {
    if (!user) {
      setShowLoginPrompt(true);
    } else {
      navigate('/careers/saved-jobs');
      // If candidate workspace is active (showMyJobs is true), switch back to search-roles view
      setShowMyJobs(false);
      setTimeout(() => {
        document.getElementById('search-roles')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  const handleShareJob = (job) => {
    const shareUrl = `https://www.beta-softnet.com/share/jobs/${job.id}`;
    navigator.clipboard.writeText(shareUrl)
      .then(() => {
        alert(`Link to share "${job.title}" copied to clipboard!`);
      })
      .catch(() => {
        alert(`Failed to copy share link.`);
      });
  };

  const handleToggleReportMenu = (jobId) => {
    setActiveReportJobId(prev => prev === jobId ? null : jobId);
  };

  const handleReportJob = (job) => {
    setActiveReportJobId(null);
    const reason = prompt(`Please enter your reason for reporting the "${job.title}" job posting:`);
    if (reason && reason.trim()) {
      alert(`Thank you for your report. Our recruitment compliance team will investigate this job posting.`);
    }
  };

  const [expandedJobDescs, setExpandedJobDescs] = useState({});
  const toggleJobDesc = (jobId) => {
    setExpandedJobDescs(prev => ({
      ...prev,
      [jobId]: !prev[jobId]
    }));
  };

  // GitHub task submission state
  const [gitLinks, setGitLinks] = useState({});
  const [submittingGit, setSubmittingGit] = useState({});
  const [gitErrors, setGitErrors] = useState({});

  const handleSubmittingGit = async (appId) => {
    const link = gitLinks[appId];
    if (!link || !link.trim()) return;

    setSubmittingGit(prev => ({ ...prev, [appId]: true }));
    setGitErrors(prev => ({ ...prev, [appId]: '' }));

    try {
      await axios.put(
        `${JOB_BOARD_API_BASE}/api/jobs/applications/${appId}/github?githubLink=${encodeURIComponent(link.trim())}`
      );
      // Refresh applications list
      await fetchUserApplications();
    } catch (err) {
      console.error('Error submitting GitHub link:', err);
      const msg = err.response?.data?.message || err.response?.data || 'Failed to submit GitHub link. Please check the URL and try again.';
      setGitErrors(prev => ({ ...prev, [appId]: typeof msg === 'string' ? msg : JSON.stringify(msg) }));
    } finally {
      setSubmittingGit(prev => ({ ...prev, [appId]: false }));
    }
  };

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
        const fetched = data.map((job) => ({
          ...job,
          location: job.location || 'Remote',
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

  // Reset form when selectedJob changes
  useEffect(() => {
    if (!selectedJob) {
      setPhone('');
      setExperience('Fresher / 0-1 Years');
      setCoverLetter('');
      setResume(null);
      setStatus('idle');
      setMessage('');
      setInterviewDate('');
      setInterviewTime('');
      setShouldSchedule(false);
    }
  }, [selectedJob]);


  const [jobsPage, setJobsPage] = useState(1);
  const [myJobsPage, setMyJobsPage] = useState(1);

  // Reset pagination on filter change
  useEffect(() => {
    setJobsPage(1);
  }, [searchQuery, selectedTeam, selectedLocation, selectedType]);

  // Reset my jobs pagination when applications reload or view toggled
  useEffect(() => {
    setMyJobsPage(1);
  }, [userApplications.length, showMyJobs]);

  // Auto-select job from URL query parameter (e.g. ?job=5)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const jobId = params.get('job');
    if (jobId && jobsList.length > 0) {
      const match = jobsList.find(j => String(j.id) === String(jobId));
      if (match) {
        setSelectedJob(match);
      }
    }
  }, [jobsList, location.search]);

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

  const displayedJobs = isSavedJobsRoute
    ? filteredJobs.filter(job => savedJobs.some(id => Number(id) === Number(job.id)))
    : filteredJobs;

  const jobsPerPage = 3;
  const indexOfLastJob = jobsPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = displayedJobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalJobsPages = Math.ceil(displayedJobs.length / jobsPerPage);

  const myJobsPerPage = 3;
  const indexOfLastMyJob = myJobsPage * myJobsPerPage;
  const indexOfFirstMyJob = indexOfLastMyJob - myJobsPerPage;
  const currentMyJobs = userApplications.slice(indexOfFirstMyJob, indexOfLastMyJob);
  const totalMyJobsPages = Math.ceil(userApplications.length / myJobsPerPage);

  const handleApply = async (e, jobOverride = null) => {
    e.preventDefault();

    const activeJob = jobOverride || selectedJob;

    // Debug logs
    console.log("Active Job:", activeJob);
    console.log("Job ID:", activeJob?.id);

    if (!fullName || !email || !phone || !resume || !activeJob) {
      console.log("Validation failed");
      return;
    }

    if (phone.replace(/\D/g, '').length !== 10) {
      setStatus("error");
      setMessage("Phone number must be exactly 10 digits.");
      return;
    }

    // Check for duplicate application locally
    const emailToCheck = email.trim().toLowerCase();
    const jobIdToCheck = activeJob.id;

    let localApps = [];
    try {
      const stored = localStorage.getItem('beta_applications');
      localApps = stored ? JSON.parse(stored) : [];
    } catch (err) {
      console.error('Local storage read failed:', err);
    }

    const hasAppliedLocally = localApps.some(app =>
      (app.email || '').toLowerCase() === emailToCheck &&
      Number(app.jobId) === Number(jobIdToCheck)
    );

    const hasAppliedInState = userApplications.some(app =>
      (app.email || '').toLowerCase() === emailToCheck &&
      Number(app.jobId) === Number(jobIdToCheck)
    );

    if (hasAppliedLocally || hasAppliedInState) {
      setStatus("error");
      setMessage("You have already applied for this job using this email address.");
      return;
    }

    setStatus("loading");
    setMessage("");

    const formData = new FormData();
    formData.append("jobId", activeJob.id);
    formData.append("fullName", fullName);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("experience", experience);
    formData.append("coverLetter", coverLetter);
    formData.append("resume", resume);
    formData.append("interviewDate", shouldSchedule ? interviewDate : "");
    formData.append("interviewTime", shouldSchedule ? interviewTime : "");

    // Print all FormData values
    for (const pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }

    try {
      const response = await axios.post(
        `${JOB_BOARD_API_BASE}/api/jobs/apply`,
        formData
      );

      console.log("Success:", response.data);
      setStatus("success");
      setMessage(response.data?.message || "Your application was submitted successfully!");

      // Save locally to track in Candidate Workspace / My Jobs
      const newApp = {
        id: response.data?.id || response.data?.data?.id || `local-${Date.now()}`,
        fullName,
        email,
        phone,
        experience: experience || activeJob.experience || 'Fresher / 0-1 Years',
        coverLetter,
        resumeUrl: resume ? resume.name : '',
        status: shouldSchedule && interviewDate ? 'Interview Scheduled' : 'Applied',
        createdAt: new Date().toISOString(),
        appliedDate: new Date().toISOString(),
        appliedTime: new Date().toISOString(),
        jobTitle: activeJob.title,
        jobDepartment: activeJob.team || 'Engineering',
        jobLocation: activeJob.location || 'Tiruvallur',
        interviewDate: shouldSchedule ? interviewDate : '',
        interviewTime: shouldSchedule ? interviewTime : '',
        experience: activeJob.experience || '3 Years',
        jobId: activeJob.id
      };

      try {
        const stored = localStorage.getItem('beta_applications');
        const currentLocal = stored ? JSON.parse(stored) : [];
        currentLocal.push(newApp);
        localStorage.setItem('beta_applications', JSON.stringify(currentLocal));
      } catch (err) {
        console.error('Error saving local application backup:', err);
      }

      // Refresh applications list dynamically
      fetchUserApplications();

    } catch (error) {
      console.error("Error:", error);
      console.error("Response:", error.response);
      console.error("Data:", error.response?.data);

      setStatus("error");
      const errData = error.response?.data;
      let errMsg = "Failed to submit application.";
      if (errData) {
        if (typeof errData === 'string') {
          errMsg = errData;
        } else if (typeof errData === 'object') {
          errMsg = errData.message || errData.error || JSON.stringify(errData);
        }
      } else {
        errMsg = error.message || errMsg;
      }
      setMessage(errMsg);
    }
  };

  const fetchUserApplications = async () => {
    if (!user) return;
    setMyJobsLoading(true);
    setMyJobsError('');
    try {
      const userEmail = (user.email || user.username || '').toLowerCase();
      let apiApps = [];
      try {
        const response = await axios.get(`${JOB_BOARD_API_BASE}/api/jobs/my-applications?email=${encodeURIComponent(userEmail)}`);
        apiApps = response.data?.data || response.data || [];
      } catch (err) {
        console.error('API /api/jobs/my-applications failed:', err);
      }

      // Load local storage apps
      let localApps = [];
      try {
        const stored = localStorage.getItem('beta_applications');
        localApps = stored ? JSON.parse(stored) : [];
      } catch (err) {
        console.error('Local storage read failed:', err);
      }

      const apiFiltered = apiApps.filter(
        (app) => (app.email || '').toLowerCase() === userEmail
      );
      const localFiltered = localApps.filter(
        (app) => (app.email || '').toLowerCase() === userEmail
      );

      const mergedApps = [];
      const seenIds = new Set();
      const seenJobKeys = new Set();

      // Normalize API apps and match with local storage
      apiFiltered.forEach((app) => {
        const normalized = {
          id: app.id,
          fullName: app.fullName || app.fullname || '',
          email: app.email || '',
          phone: app.phone || '',
          resume: app.resume || app.resumeUrl || app.resumeurl || '',
          resumeUrl: app.resumeUrl || app.resumeurl || (app.resume ? (app.resume.startsWith('http') || app.resume.startsWith('/') ? app.resume : `${JOB_BOARD_API_BASE}/uploads/${app.resume}`) : ''),
          coverLetter: app.coverLetter || app.coverletter || '',
          status: mapStatusToUI(app.status),
          createdAt: app.createdAt || app.createdat || '',
          appliedDate: app.appliedDate || app.applieddate || app.createdAt || app.createdat || '',
          jobTitle: app.jobTitle || app.jobtitle || '',
          jobDepartment: app.jobDepartment || app.jobdepartment || '',
          jobLocation: app.jobLocation || app.joblocation || '',
          interviewDate: app.interviewDate || app.interviewdate || '',
          interviewTime: app.interviewTime || app.interviewtime || '',
          aptitudeStatus: app.aptitudeStatus || app.aptitudestatus || '',
          aptitudeScore: app.aptitudeScore || app.aptitudescore || '',
          experience: app.experience || '3 Years',
          githubLink: app.githubLink || app.githublink || '',
          taskAssigned: app.taskAssigned !== undefined ? app.taskAssigned : (app.taskassigned || false),
          jobId: app.jobId || app.jobid || '',
          appliedTime: app.appliedTime || app.appliedtime || '',
          pipelineStage: app.pipelineStage !== undefined && app.pipelineStage !== null ? app.pipelineStage : null
        };

        const jobKey = `${(normalized.email || '').toLowerCase()}-${(normalized.jobTitle || '').toLowerCase()}-${normalized.jobId || ''}`;
        seenJobKeys.add(jobKey);

        const localMatch = localFiltered.find((l) => l.id === app.id || (l.jobTitle === normalized.jobTitle && l.email === normalized.email));
        if (localMatch) {
          if (localMatch.createdAt) {
            normalized.createdAt = localMatch.createdAt;
          }
          if (localMatch.appliedDate) {
            normalized.appliedDate = localMatch.appliedDate;
          }
          if (localMatch.appliedTime) {
            normalized.appliedTime = localMatch.appliedTime;
          }
          if (localMatch.aptitudeStatus && !normalized.aptitudeStatus) {
            normalized.aptitudeStatus = localMatch.aptitudeStatus;
          }
          if (localMatch.aptitudeScore !== undefined && localMatch.aptitudeScore !== null && normalized.aptitudeScore === '') {
            normalized.aptitudeScore = localMatch.aptitudeScore;
          }
          if (localMatch.status && localMatch.status !== normalized.status && localMatch.status !== 'Applied') {
            normalized.status = localMatch.status;
          }
          if (localMatch.pipelineStage !== undefined && localMatch.pipelineStage !== null && normalized.pipelineStage === null) {
            normalized.pipelineStage = localMatch.pipelineStage;
          }
        }

        mergedApps.push(normalized);
        seenIds.add(app.id);
      });

      // Include local apps that are not yet on backend
      localFiltered.forEach((localApp) => {
        const jobKey = `${(localApp.email || '').toLowerCase()}-${(localApp.jobTitle || '').toLowerCase()}-${localApp.jobId || localApp.jobid || ''}`;
        if (!seenIds.has(localApp.id) && !seenJobKeys.has(jobKey)) {
          mergedApps.push({
            id: localApp.id,
            jobId: localApp.jobId || localApp.jobid || '',
            fullName: localApp.fullName || '',
            email: localApp.email || '',
            phone: localApp.phone || '',
            resumeUrl: localApp.resumeUrl || '',
            coverLetter: localApp.coverLetter || '',
            status: localApp.status || 'Applied',
            createdAt: localApp.createdAt || new Date().toISOString(),
            appliedDate: localApp.appliedDate || localApp.applieddate || localApp.createdAt || new Date().toISOString(),
            appliedTime: localApp.appliedTime || localApp.appliedTime || localApp.createdAt || new Date().toISOString(),
            jobTitle: localApp.jobTitle || '',
            jobDepartment: localApp.jobDepartment || 'Engineering',
            jobLocation: localApp.jobLocation || 'Tiruvallur',
            interviewDate: localApp.interviewDate || '',
            interviewTime: localApp.interviewTime || '',
            aptitudeStatus: localApp.aptitudeStatus || '',
            aptitudeScore: localApp.aptitudeScore !== undefined && localApp.aptitudeScore !== null ? localApp.aptitudeScore : '',
            experience: localApp.experience || '3 Years',
            pipelineStage: localApp.pipelineStage !== undefined && localApp.pipelineStage !== null ? localApp.pipelineStage : 0
          });
          seenJobKeys.add(jobKey);
        }
      });

      // Sort by date created desc
      mergedApps.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setUserApplications(mergedApps);
    } catch (err) {
      console.error('Failed to parse or merge user applications:', err);
      setMyJobsError('Failed to load application details.');
    } finally {
      setMyJobsLoading(false);
    }
  };

  const handleMyJobsClick = () => {
    if (!user) {
      setShowLoginPrompt(true);
    } else {
      setShowMyJobs(true);
      fetchUserApplications();
    }
  };

  if (isTaskAssessmentRoute) {
    return (
      <div className="auth-white-theme min-h-screen flex items-center justify-center px-4 py-12 bg-slate-50 relative overflow-hidden w-full">
        <style>{`
          .auth-white-theme {
            background: linear-gradient(135deg, #F5F3FF 0%, #EFF6FF 50%, #FDF2F8 100%) !important;
            color: #1E293B !important;
          }
        `}</style>
        {/* Decorative background blobs */}
        <div className="absolute top-[30%] left-[20%] w-[300px] h-[300px] bg-purple-600/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[30%] right-[20%] w-[300px] h-[300px] bg-pink-600/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="w-full max-w-2xl bg-white p-8 rounded-3xl border border-slate-200 shadow-xl relative z-10 text-left">
          {/* Header */}
          <div className="flex items-center space-x-3 mb-6">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-purple-500/10">
              <Code2 className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Task Assessment</h2>
              <p className="text-slate-500 text-xs uppercase tracking-widest font-bold">BETA Recruitment Portal</p>
            </div>
          </div>

          {loadingTask ? (
            <div className="py-12 text-center text-slate-500 text-sm font-semibold">
              <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-3 text-purple-600" />
              Loading task details...
            </div>
          ) : taskError ? (
            <div className="py-6 text-center space-y-4">
              <div className="h-16 w-16 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center mx-auto text-rose-500">
                <AlertCircle className="h-8 w-8" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Task Loading Failed</h3>
                <p className="text-slate-500 text-sm mt-1">{taskError}</p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Candidate Info Card */}
              {taskData?.candidate && (
                <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-base font-extrabold text-slate-900">{taskData.candidate.fullName}</h4>
                      <p className="text-slate-500 text-xs mt-0.5">Applied for <strong>{taskData.candidate.jobTitle || 'Developer'}</strong></p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${taskData.status === 'SUBMITTED'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-purple-50 text-purple-700 border-purple-200'
                      }`}>
                      {taskData.status}
                    </span>
                  </div>
                </div>
              )}

              {/* Task Details Card */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Assigned Task Description</h4>
                <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl font-sans text-sm text-slate-800 leading-relaxed whitespace-pre-line">
                  {taskData?.taskDescription}
                </div>
              </div>

              {/* Submission Status */}
              {taskData?.candidate?.githubLink || taskData?.status === 'SUBMITTED' ? (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Submitted Task Solution</h4>
                  <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center justify-between">
                    <a
                      href={taskData?.candidate?.githubLink && (taskData.candidate.githubLink.startsWith('http://') || taskData.candidate.githubLink.startsWith('https://')) ? taskData.candidate.githubLink : `https://${taskData?.candidate?.githubLink || ''}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-bold text-violet-650 hover:underline break-all"
                    >
                      {taskData?.candidate?.githubLink || taskData?.githubLink}
                    </a>
                    <span className="px-3 py-1 bg-emerald-500/10 text-emerald-700 text-[10px] font-black rounded-full uppercase tracking-wider">
                      ✓ Submitted
                    </span>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleTaskSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">GitHub Repository Link</label>
                    <input
                      type="url"
                      required
                      value={gitLinkInput}
                      onChange={(e) => setGitLinkInput(e.target.value)}
                      placeholder="https://github.com/yourusername/yourproject"
                      disabled={submittingTask}
                      className="w-full bg-white text-slate-900 placeholder-slate-400 border border-slate-200 rounded-xl py-3 px-4 focus:outline-none focus:border-purple-500 text-sm transition"
                    />
                  </div>

                  {taskSubmitSuccess && (
                    <div className="p-3.5 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center space-x-2 text-emerald-700 text-xs font-semibold">
                      <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                      <span>GitHub repository link submitted successfully! Your task status is updated to SUBMITTED.</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={submittingTask || !gitLinkInput.trim()}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 hover:scale-[1.01] active:scale-[0.99] text-white text-xs font-black transition flex items-center justify-center space-x-2 shadow-lg shadow-purple-500/10 border-none cursor-pointer"
                  >
                    {submittingTask ? 'Submitting Repository...' : 'Submit Task Assessment'}
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

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
        .careers-purple-pink-theme .cta-block p {
          color: #5B3A00 !important;
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
          background:white !important;
        }
      `}</style>



      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-2 space-y-16 md:space-y-20">
        {!showMyJobs ? (
          <>
            {/* COMBINED HERO & OPEN ROLES GROUP */}
            <div className="space-y-6">
              {/* HERO SECTION */}
              <div className="text-center max-w-3xl mx-auto pt-2 pb-4 space-y-6">
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

              <div id="search-roles" className="space-y-4">
                <div className="w-full max-w-5xl mx-auto hacker-layout-box unified-openings-box p-6 sm:p-8 rounded-2xl shadow-xl shadow-purple-500/5 text-left space-y-6">
                  {/* Header inside Box with Centered Title, and Search Bar + Filter Button */}
                  <div className="flex flex-col items-center justify-center gap-4 border-b border-purple-500/10 pb-6 w-full">
                    <div className="text-center">
                      <h3 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900">
                        {isSavedJobsRoute ? 'Saved Roles' : 'Open Roles'}
                      </h3>
                      <span className="text-xs md:text-sm font-extrabold text-[#F59E0B] uppercase tracking-widest block mt-1">
                        {isSavedJobsRoute ? 'Your Saved Jobs' : 'Explore Opportunities'}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-3 w-full">
                      {isSavedJobsRoute && (
                        <button
                          type="button"
                          onClick={() => {
                            navigate('/careers');
                          }}
                          className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-purple-500/20 bg-white text-slate-700 hover:bg-slate-50 hover:border-purple-500/40 hover:shadow-purple-500/10 transition-all duration-300 text-xs font-bold shadow-sm cursor-pointer whitespace-nowrap"
                        >
                          <ArrowLeft className="h-3.5 w-3.5" />
                          <span>All Jobs</span>
                        </button>
                      )}
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

                      <button
                        type="button"
                        onClick={handleMyJobsClick}
                        className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-purple-500/20 bg-white text-slate-700 hover:bg-slate-50 hover:border-purple-500/40 hover:shadow-purple-500/10 transition-all duration-300 text-xs font-bold shadow-sm cursor-pointer whitespace-nowrap"
                      >
                        <Briefcase className="h-3.5 w-3.5 text-purple-600" />
                        <span>My Jobs</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleSavedJobsClick}
                        className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-purple-500/20 bg-white text-slate-700 hover:bg-slate-50 hover:border-purple-500/40 hover:shadow-purple-500/10 transition-all duration-300 text-xs font-bold shadow-sm cursor-pointer whitespace-nowrap"
                      >
                        <Bookmark className="h-3.5 w-3.5 text-purple-600" fill={savedJobs.length > 0 ? "currentColor" : "none"} />
                        <span>Saved Jobs</span>
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
                    <AnimatePresence mode="wait">
                      {currentJobs.length > 0 ? (
                        currentJobs.map((job) => (
                          <motion.div
                            key={job.id}
                            layout
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.3 }}
                            className="relative p-5 rounded-xl border border-blue-500/20 bg-[#dbeafe]/60 hover:bg-[#dbeafe]/85 hover:border-blue-500/35 hover:shadow-sm transition-all duration-300 text-left flex flex-col sm:flex-row sm:items-center justify-between gap-6 group"
                          >
                            {/* Action Row: Location, Salary, Save, Share, Report - flex on mobile, absolute on desktop */}
                            <div className="flex flex-wrap items-center gap-2 mb-2 sm:mb-0 sm:absolute sm:top-4 sm:right-4 z-10">
                              {job.location && (
                                <span className="px-2.5 py-1 rounded-xl text-[10px] font-black text-blue-600 bg-blue-50 border border-blue-500/10 mr-1 shadow-sm uppercase tracking-wider flex items-center gap-1">
                                  <MapPin className="h-3 w-3 text-blue-500" />
                                  {job.location}
                                </span>
                              )}
                              {job.salary && (
                                <span className="px-2.5 py-1 rounded-xl text-[10px] font-black text-emerald-600 bg-emerald-50 border border-emerald-500/10 mr-1 shadow-sm uppercase tracking-wider">
                                  {job.salary.startsWith('₹') || job.salary.startsWith('Rs') ? job.salary : `₹${job.salary}`}
                                </span>
                              )}
                              {/* Save button */}
                              <button
                                type="button"
                                onClick={() => handleSaveJob(job.id)}
                                className={`p-2 rounded-xl border transition-all duration-300 flex items-center justify-center cursor-pointer ${savedJobs.includes(job.id)
                                  ? 'bg-purple-50 border-purple-200 text-purple-600 hover:bg-purple-100'
                                  : 'bg-white border-slate-200 text-slate-400 hover:text-purple-600 hover:border-purple-200 hover:bg-purple-50/30'
                                  }`}
                                title="Save Job"
                              >
                                <Bookmark className="h-4 w-4" fill={savedJobs.includes(job.id) ? "currentColor" : "none"} />
                              </button>

                              {/* Share button */}
                              <button
                                type="button"
                                onClick={() => handleShareJob(job)}
                                className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-blue-50/30 hover:border-blue-200 text-slate-400 hover:text-blue-500 transition-all duration-300 flex items-center justify-center cursor-pointer"
                                title="Share Job"
                              >
                                <Share2 className="h-4 w-4" />
                              </button>

                              {/* Three dots (Report) menu */}
                              <div className="relative">
                                <button
                                  type="button"
                                  onClick={() => handleToggleReportMenu(job.id)}
                                  className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-350 text-slate-400 hover:text-slate-700 transition-all duration-300 flex items-center justify-center cursor-pointer"
                                  title="Options"
                                >
                                  <MoreHorizontal className="h-4 w-4" />
                                </button>
                                {activeReportJobId === job.id && (
                                  <div className="absolute right-0 mt-1 w-28 bg-white border border-slate-200 rounded-xl shadow-lg z-30 p-1 animate-fadeIn">
                                    <button
                                      type="button"
                                      onClick={() => handleReportJob(job)}
                                      className="w-full text-left px-3 py-1.5 hover:bg-rose-50 text-rose-600 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border-none bg-transparent"
                                    >
                                      <AlertTriangle className="h-3.5 w-3.5 text-rose-500" />
                                      Report Job
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="space-y-4 flex-grow">
                              <div className="pr-0 sm:pr-72 text-left">
                                <h3 className="text-lg font-black tracking-tight group-hover:text-[#EC4899] transition-colors duration-300 flex flex-wrap items-center gap-2">
                                  {job.title}
                                </h3>
                                <div className="flex flex-wrap items-center gap-2 mt-0.5 mb-2">
                                  <span className="text-[9px] font-extrabold text-[#F59E0B] uppercase tracking-widest block">
                                    {job.team}
                                  </span>
                                  {job.type && (
                                    <>
                                      <span className="text-slate-350 text-[9px] font-extrabold">•</span>
                                      <span className="text-[9px] font-extrabold text-[#10B981] uppercase tracking-widest block">
                                        {job.type}
                                      </span>
                                    </>
                                  )}
                                  {job.experience && (
                                    <>
                                      <span className="text-slate-350 text-[9px] font-extrabold">•</span>
                                      <span className="text-[9px] font-extrabold text-[#8B5CF6] uppercase tracking-widest block">
                                        {job.experience}
                                      </span>
                                    </>
                                  )}
                                </div>
                              </div>

                              {/* Role Description Block */}
                              {(() => {
                                const descriptionText = job.description || '';
                                const limit = 220;
                                return (
                                  <div className="mt-3.5 text-xs text-left">
                                    <span className="font-extrabold text-[#8B5CF6] text-[10px] uppercase tracking-wider block mb-1">
                                      Role Description
                                    </span>
                                    {expandedJobDescs[job.id] ? (
                                      <p className="text-slate-600 leading-relaxed font-semibold">
                                        {descriptionText}
                                      </p>
                                    ) : (
                                      <p className="text-slate-600 leading-relaxed font-semibold">
                                        {descriptionText.length > limit ? (
                                          <>
                                            {descriptionText.slice(0, limit)}...{" "}
                                            <button
                                              type="button"
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                toggleJobDesc(job.id);
                                              }}
                                              className="text-[#EC4899] hover:text-[#db3c8b] font-bold text-[11px] hover:underline cursor-pointer bg-transparent border-none p-0 inline-block transition-colors duration-200"
                                            >
                                              See More
                                            </button>
                                          </>
                                        ) : (
                                          descriptionText
                                        )}
                                      </p>
                                    )}
                                  </div>
                                );
                              })()}

                              {/* Required Skills Block */}
                              {((job.description || '').length <= 220 || expandedJobDescs[job.id]) && job.skills && job.skills.length > 0 && (
                                <div className="mt-3.5 text-left">
                                  <span className="font-extrabold text-[#EC4899] text-[10px] uppercase tracking-wider block mb-1.5">
                                    Required Skills
                                  </span>
                                  <div className="flex flex-wrap gap-1.5">
                                    {job.skills.map((skill, idx) => (
                                      <span key={idx} className="px-2.5 py-1 rounded-xl bg-purple-50 border border-purple-500/10 text-[#8B5CF6] text-[10px] font-black shadow-sm">
                                        {skill}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* See Less Button (for expanded long description) */}
                              {expandedJobDescs[job.id] && (job.description || '').length > 220 && (
                                <div className="mt-3 text-left">
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      toggleJobDesc(job.id);
                                    }}
                                    className="text-[#EC4899] hover:text-[#db3c8b] font-bold text-[11px] hover:underline cursor-pointer bg-transparent border-none p-0 transition-colors duration-200"
                                  >
                                    See Less
                                  </button>
                                </div>
                              )}
                            </div>

                            <div className="flex-shrink-0 w-full sm:w-auto mt-8 sm:mt-0">
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
                          No positions found. Try adjusting filters or search keywords.
                        </div>
                      )}
                    </AnimatePresence>

                    {/* Pagination Controls */}
                    {totalJobsPages > 1 && (
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-purple-500/10 w-full mt-4">
                        <span className="text-xs font-semibold text-slate-500">
                          Showing {indexOfFirstJob + 1}-{Math.min(indexOfLastJob, displayedJobs.length)} of {displayedJobs.length} roles
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            disabled={jobsPage === 1}
                            onClick={() => {
                              setJobsPage(prev => Math.max(prev - 1, 1));
                              document.querySelector('.unified-openings-box')?.scrollIntoView({ behavior: 'smooth' });
                            }}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition duration-300 flex items-center gap-1 ${jobsPage === 1
                              ? 'bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed'
                              : 'bg-white border-purple-500/20 text-slate-700 hover:bg-slate-50 cursor-pointer hover:border-purple-500/40 hover:text-purple-600'
                              }`}
                          >
                            <ChevronLeft className="h-3.5 w-3.5" />
                            <span>Previous</span>
                          </button>

                          <div className="flex items-center gap-1">
                            {Array.from({ length: totalJobsPages }, (_, idx) => idx + 1).map((pNum) => (
                              <button
                                key={pNum}
                                type="button"
                                onClick={() => {
                                  setJobsPage(pNum);
                                  document.querySelector('.unified-openings-box')?.scrollIntoView({ behavior: 'smooth' });
                                }}
                                className={`h-8 w-8 rounded-xl text-xs font-bold transition duration-300 cursor-pointer ${jobsPage === pNum
                                  ? 'bg-[#8B5CF6] text-white shadow-sm'
                                  : 'bg-white border border-purple-500/10 text-slate-700 hover:bg-slate-50'
                                  }`}
                              >
                                {pNum}
                              </button>
                            ))}
                          </div>

                          <button
                            type="button"
                            disabled={jobsPage === totalJobsPages}
                            onClick={() => {
                              setJobsPage(prev => Math.min(prev + 1, totalJobsPages));
                              document.querySelector('.unified-openings-box')?.scrollIntoView({ behavior: 'smooth' });
                            }}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition duration-300 flex items-center gap-1 ${jobsPage === totalJobsPages
                              ? 'bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed'
                              : 'bg-white border-purple-500/20 text-slate-700 hover:bg-slate-50 cursor-pointer hover:border-purple-500/40 hover:text-purple-600'
                              }`}
                          >
                            <span>Next</span>
                            <ChevronRight className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    )}


                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 6: HIRING PROCESS */}
            <div className="space-y-10 -mt-6 md:-mt-8">
              <div className="text-center max-w-2xl mx-auto space-y-2.5">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-[#EC4899] text-xs font-semibold uppercase tracking-wider">
                  <CheckSquare className="h-3.5 w-3.5" />
                  <span>Hiring Pipeline</span>
                </div>
                <h2 className="text-3xl md:text-5xl font-extrabold">Our Hiring Process</h2>
                <p className="text-slate-500 text-sm">A quick outline of how we validate core competencies and welcome new team members.</p>
              </div>

              {/* Connected Glowing Nodes Timeline */}
              <div className="relative max-w-4xl mx-auto pt-2 flex flex-col md:flex-row flex-wrap md:flex-nowrap items-center justify-between gap-8 md:gap-4">
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
                        className="glass-card-purple p-4 pb-5 rounded-3xl border border-purple-500/20 text-center flex flex-col items-center justify-start shadow-md w-full md:w-[15%] md:h-[210px] group relative"
                      >
                        <div className={`h-12 w-12 rounded-full flex items-center justify-center border ${step.bg} mb-3 shadow-lg shadow-purple-500/10 transition-transform duration-500 group-hover:scale-105 shrink-0`}>
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
            <div className="cta-block relative overflow-hidden rounded-3xl p-10 md:p-16 border border-amber-200/80 bg-gradient-to-r from-amber-50/90 via-yellow-50/80 to-amber-50/90 text-center shadow-xl shadow-amber-500/5">
              {/* Subtle yellow background glow circles inside CTA */}
              <div className="absolute top-[-30px] left-[-30px] w-48 h-48 bg-yellow-200/40 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute bottom-[-30px] right-[-30px] w-64 h-64 bg-amber-200/40 rounded-full blur-2xl pointer-events-none" />

              <div className="relative z-10 space-y-6 max-w-2xl mx-auto">
                <h2 className="text-3xl md:text-5xl font-black text-[#5B3A00] leading-tight tracking-tight">
                  Ready to Build Something Amazing?
                </h2>
                <p className="text-[#5B3A00]/90 max-w-xl mx-auto text-sm md:text-base leading-relaxed font-semibold">
                  Join a team of creators, system architects, and designers scaling software to thousands of businesses globally.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                  <a
                    href="#search-roles"
                    className="w-full sm:w-auto px-8 py-3.5 rounded-xl text-sm font-black bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-950 transition-all duration-300 hover:scale-[1.02] shadow-md shadow-amber-500/20 no-underline"
                  >
                    Apply Now
                  </a>
                </div>
              </div>
            </div>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-4xl mx-auto space-y-8 py-8 animate-fadeIn"
          >
            {/* Header / Navigation Bar for My Jobs */}
            <div id="my-apps-header" className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-purple-500/10 pb-6">
              <div className="space-y-1">
                <span className="text-xs font-bold text-[#EC4899] uppercase tracking-widest block">Candidate Workspace</span>
                <h2 className="text-3xl font-black text-slate-900">My Applications</h2>
                <p className="text-slate-500 text-sm font-medium">Track your active roles and interview updates</p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setShowMyJobs(false);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-purple-500/20 bg-white text-slate-700 hover:bg-slate-50 transition-all duration-300 text-xs font-bold shadow-sm cursor-pointer whitespace-nowrap self-start sm:self-auto"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Back to Open Positions</span>
              </button>
            </div>

            {myJobsLoading ? (
              <div className="flex flex-col items-center justify-center py-20 space-y-4">
                <div className="h-10 w-10 border-4 border-purple-500/30 border-t-purple-600 rounded-full animate-spin" />
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider animate-pulse">Retrieving application history...</p>
              </div>
            ) : myJobsError ? (
              <div className="py-16 text-center space-y-4 bg-white border border-purple-100 rounded-3xl p-8 shadow-sm">
                <div className="h-12 w-12 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center mx-auto text-rose-500">
                  <AlertCircle className="h-6 w-6" />
                </div>
                <h4 className="text-base font-bold text-slate-800">Something went wrong</h4>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">{myJobsError}</p>
                <button
                  onClick={fetchUserApplications}
                  className="px-5 py-2 rounded-xl bg-purple-600 text-white text-xs font-extrabold shadow-md hover:bg-purple-700 transition cursor-pointer"
                >
                  Retry Fetching
                </button>
              </div>
            ) : userApplications.length === 0 ? (
              <div className="py-20 text-center space-y-6 bg-white border border-purple-100 rounded-3xl p-8 shadow-sm">
                <div className="h-16 w-16 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center mx-auto text-[#EC4899] shadow-sm">
                  <Briefcase className="h-8 w-8 text-purple-400" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-base font-bold text-slate-800">No Applications Found</h4>
                  <p className="text-slate-500 text-xs leading-relaxed max-w-sm mx-auto">
                    You haven't submitted any job applications yet. Apply to our open roles to track them here!
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowMyJobs(false);
                    setTimeout(() => {
                      document.getElementById('search-roles')?.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  }}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] text-white text-xs font-extrabold transition cursor-pointer shadow-md"
                >
                  Explore Opportunities
                </button>
              </div>
            ) : (
              <>
                <div className="space-y-6">
                  {currentMyJobs.map((app) => {
                    const rawStatus = app.status || '';
                    const aptitudeStatus = (app.aptitudeStatus || '').toLowerCase().trim();
                    const isRejected = rawStatus.toLowerCase().trim() === 'rejected';

                    // Fetch pipeline stage status dynamically from backend
                    let activeIdx = app.pipelineStage !== undefined && app.pipelineStage !== null ? app.pipelineStage : 0;

                    const steps = ['Application', 'Assessment', 'Technical interview', 'Task Assessment', 'HR interview', 'Offer'];

                    return (
                      <div
                        key={app.id}
                        className="glass-card-purple p-6 rounded-3xl border border-purple-500/10 flex flex-col gap-6 relative overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow duration-300"
                      >
                        {/* Upper card header */}
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                          <div>
                            <h4 className="text-lg font-black text-slate-900 transition-colors">
                              {app.jobTitle || 'General Opening'}
                            </h4>
                            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1 text-xs text-slate-500 font-semibold">
                              <span className="text-[#EC4899] font-extrabold uppercase tracking-wide text-[10px]">
                                {app.jobDepartment || 'Engineering'}
                              </span>
                              <span>&bull;</span>
                              <span>{app.jobLocation || 'Tiruvallur'}</span>
                              {app.experience && (
                                <>
                                  <span>&bull;</span>
                                  <span>{app.experience}</span>
                                </>
                              )}
                              <span>&bull;</span>
                              <span className="text-[11px] text-slate-400 font-medium">
                                <AppliedTime timestamp={app.appliedTime || app.appliedDate || app.createdAt} />
                              </span>
                            </div>
                          </div>

                          {/* Status Badge */}
                          <div className="flex-shrink-0">
                            <span className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider border ${isRejected
                              ? 'bg-rose-50 text-rose-700 border-rose-200'
                              : activeIdx === 5
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : 'bg-purple-50 text-purple-700 border-purple-200'
                              }`}>
                              {isRejected ? 'Rejected' : steps[activeIdx]}
                            </span>
                          </div>
                        </div>

                        {/* Interactive Steps Visualizer */}
                        <div className="border-t border-purple-500/10 pt-5 pb-2">
                          <div className="relative flex items-center justify-between w-full">
                            {/* Connector Line */}
                            <div className="absolute left-3 right-3 top-3 h-[2px] bg-slate-100 z-0">
                              <div
                                className={`h-full transition-all duration-500 ${isRejected ? 'bg-rose-500' : 'bg-gradient-to-r from-[#8B5CF6] via-[#EC4899] to-emerald-500'}`}
                                style={{ width: `${(activeIdx / (steps.length - 1)) * 100}%` }}
                              />
                            </div>

                            {/* Node Circles */}
                            {steps.map((stepName, idx) => {
                              const isCompleted = idx < activeIdx;
                              const isActive = idx === activeIdx;
                              const isRejectedNode = isRejected && isActive;

                              let circleClasses = 'bg-white border-slate-200 text-slate-400';
                              if (isCompleted) {
                                circleClasses = 'bg-[#8B5CF6] border-[#8B5CF6] text-white shadow-sm';
                              } else if (isActive) {
                                circleClasses = isRejectedNode
                                  ? 'bg-rose-500 border-rose-500 text-white shadow-md shadow-rose-200 animate-pulse'
                                  : 'bg-[#EC4899] border-[#EC4899] text-white shadow-md shadow-pink-200 animate-pulse';
                              }

                              return (
                                <div key={stepName} className="flex flex-col items-center relative z-10 flex-1 text-center px-1">
                                  <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 text-[10px] font-black transition-all duration-300 ${circleClasses}`}>
                                    {isCompleted ? '✓' : idx + 1}
                                  </div>
                                  <span className={`text-[8.5px] font-bold mt-1.5 uppercase tracking-wide block ${isActive ? (isRejectedNode ? 'text-rose-600 font-black' : 'text-[#EC4899] font-black') : isCompleted ? 'text-slate-700' : 'text-slate-400'}`}>
                                    {stepName}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Actionable status details below tracker */}
                        {isRejected ? (
                          <div className="mt-1 p-3.5 bg-rose-500/5 border border-rose-500/20 rounded-xl text-left text-xs">
                            <span className="font-extrabold text-rose-600 uppercase tracking-wider block mb-0.5">Application Closed</span>
                            <p className="text-slate-500 font-medium">
                              We sincerely appreciate the time you spent interviewing with us. While we are not advancing with this specific role at present, we will keep your file for matching future openings.
                            </p>
                          </div>
                        ) : activeIdx === 0 ? (
                          <div className="mt-1 p-3.5 bg-purple-500/5 border border-purple-500/20 rounded-xl text-left text-xs">
                            <span className="font-extrabold text-purple-600 uppercase tracking-wider block mb-0.5">Application Received</span>
                            <p className="text-slate-500 font-medium">
                              Your profile has been logged and is under initial review by our talent acquisition team.
                            </p>
                          </div>
                        ) : activeIdx === 1 ? (
                          <div className="mt-1">
                            {app.aptitudeStatus === 'Completed' || app.assessmentSubmitted ? (
                              <div className="p-3.5 bg-emerald-500/5 border border-emerald-500/20 rounded-xl text-left text-xs">
                                <span className="font-extrabold text-emerald-600 uppercase tracking-wider block mb-0.5">Assessment Completed</span>
                                <p className="text-slate-500 font-medium">
                                  Your Test Round answers have been logged{app.aptitudeScore !== '' && app.aptitudeScore !== undefined ? ` (Score: ${app.aptitudeScore}%)` : ''}. Recruiting managers are reviewing your evaluation.
                                </p>
                              </div>
                            ) : (
                              <div className="p-3.5 bg-purple-500/5 border border-purple-500/20 rounded-xl text-left text-xs">
                                <span className="font-extrabold text-purple-600 uppercase tracking-wider block mb-0.5">Assessment Phase</span>
                                <p className="text-slate-500 font-medium">
                                  Your profile is undergoing assessment. The test will be conducted and provided by the admin.
                                </p>
                              </div>
                            )}
                          </div>
                        ) : activeIdx === 2 ? (
                          <div className="mt-1">
                            {app.interviewDate || app.interviewTime ? (
                              <div className="p-3.5 bg-blue-500/5 border border-blue-500/20 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                                <div className="text-left">
                                  <span className="font-extrabold text-blue-600 uppercase tracking-wider block mb-0.5">Technical Interview Scheduled</span>
                                  <p className="text-slate-500 font-medium">
                                    📅 <strong>Date:</strong> {app.interviewDate || 'To be notified'} {app.interviewTime ? `at ${app.interviewTime}` : ''}
                                  </p>
                                </div>
                                {app.interviewLink && (
                                  <a
                                    href={app.interviewLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full sm:w-auto px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-black rounded-xl transition-all cursor-pointer text-center whitespace-nowrap shadow-sm"
                                  >
                                    Join Google Meet
                                  </a>
                                )}
                              </div>
                            ) : (
                              <div className="p-3.5 bg-blue-500/5 border border-blue-500/20 rounded-xl text-left text-xs">
                                <span className="font-extrabold text-blue-600 uppercase tracking-wider block mb-0.5">Technical Interview Stage</span>
                                <p className="text-slate-500 font-medium">
                                  Congratulations on clearing the Test Round! Scheduling your Technical Interview is in progress. Check your email for invites.
                                </p>
                              </div>
                            )}
                          </div>
                        ) : activeIdx === 3 ? (
                          <div className="mt-1 space-y-2">
                            {app.githubLink ? (
                              <div className="p-3.5 bg-emerald-500/5 border border-emerald-500/20 rounded-xl text-left text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                <div>
                                  <span className="font-extrabold text-emerald-600 uppercase tracking-wider block mb-0.5">Task Assessment Submitted</span>
                                  <p className="text-slate-500 font-medium break-all">
                                    ✓ <strong>Submitted Solution:</strong> <a href={app.githubLink} target="_blank" rel="noopener noreferrer" className="text-violet-650 underline font-bold">{app.githubLink}</a>
                                  </p>
                                </div>
                              </div>
                            ) : (
                              <div className="p-3.5 bg-violet-500/5 border border-violet-500/20 rounded-xl text-left text-xs space-y-3">
                                <div>
                                  <span className="font-extrabold text-violet-700 uppercase tracking-wider block mb-0.5">Task Assessment Assigned</span>
                                  <p className="text-slate-500 font-medium">
                                    Please complete the task instructions sent to your email and submit your GitHub repository link below.
                                  </p>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-2">
                                  <input
                                    type="url"
                                    placeholder="https://github.com/your-username/your-repo"
                                    value={gitLinks[app.id] || ''}
                                    onChange={(e) => setGitLinks(prev => ({ ...prev, [app.id]: e.target.value }))}
                                    className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500/20 bg-white"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => handleSubmittingGit(app.id)}
                                    disabled={submittingGit[app.id] || !(gitLinks[app.id] || '').trim()}
                                    className="px-4 py-2 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition cursor-pointer whitespace-nowrap shadow-xs border-none"
                                  >
                                    {submittingGit[app.id] ? 'Submitting...' : 'Submit Repository'}
                                  </button>
                                </div>
                                {gitErrors[app.id] && (
                                  <p className="text-[10px] font-bold text-rose-600">{gitErrors[app.id]}</p>
                                )}
                              </div>
                            )}
                          </div>
                        ) : activeIdx === 4 ? (
                          <div className="mt-1">
                            {app.hrInterviewDate || app.hrInterviewTime || app.hrInterviewLocation ? (
                              <div className="p-3.5 bg-purple-500/5 border border-purple-500/20 rounded-xl text-left text-xs space-y-1">
                                <span className="font-extrabold text-purple-600 uppercase tracking-wider block mb-0.5">HR Interview Scheduled</span>
                                <p className="text-slate-500 font-medium">
                                  🏢 <strong>Date:</strong> {app.hrInterviewDate || 'To be notified'} {app.hrInterviewTime ? `at ${app.hrInterviewTime}` : ''}
                                </p>
                                {app.hrInterviewLocation && (
                                  <p className="text-slate-500 font-medium">
                                    📍 <strong>Venue:</strong> {app.hrInterviewLocation.startsWith('http') ? (
                                      <a href={app.hrInterviewLocation} target="_blank" rel="noopener noreferrer" className="text-violet-650 underline font-bold">Open Venue Map</a>
                                    ) : (
                                      <strong className="text-slate-800">{app.hrInterviewLocation}</strong>
                                    )}
                                  </p>
                                )}
                              </div>
                            ) : (
                              <div className="p-3.5 bg-purple-500/5 border border-purple-500/20 rounded-xl text-left text-xs">
                                <span className="font-extrabold text-purple-600 uppercase tracking-wider block mb-0.5">HR Interview Stage</span>
                                <p className="text-slate-500 font-medium">
                                  You have cleared the Task Assessment and are shortlisted for the final HR Interview stage. Scheduling details will be shared shortly.
                                </p>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="mt-1 p-3.5 bg-emerald-500/5 border border-emerald-500/20 rounded-xl text-left text-xs">
                            <span className="font-extrabold text-emerald-600 uppercase tracking-wider block mb-0.5">Offer</span>
                            <p className="text-slate-500 font-medium">
                              🎉 Congratulations! You have successfully cleared all selection rounds. An onboarding specialist will contact you with the offer proposal and joining details.
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Pagination Controls */}
                {totalMyJobsPages > 1 && (
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-purple-500/10 w-full mt-4">
                    <span className="text-xs font-semibold text-slate-500">
                      Showing {indexOfFirstMyJob + 1}-{Math.min(indexOfLastMyJob, userApplications.length)} of {userApplications.length} applications
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        disabled={myJobsPage === 1}
                        onClick={() => {
                          setMyJobsPage(prev => Math.max(prev - 1, 1));
                          document.getElementById('my-apps-header')?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition duration-300 flex items-center gap-1 ${myJobsPage === 1
                          ? 'bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed'
                          : 'bg-white border-purple-500/20 text-slate-700 hover:bg-slate-50 cursor-pointer hover:border-purple-500/40 hover:text-purple-600'
                          }`}
                      >
                        <ChevronLeft className="h-3.5 w-3.5" />
                        <span>Previous</span>
                      </button>

                      <div className="flex items-center gap-1">
                        {Array.from({ length: totalMyJobsPages }, (_, idx) => idx + 1).map((pNum) => (
                          <button
                            key={pNum}
                            type="button"
                            onClick={() => {
                              setMyJobsPage(pNum);
                              document.getElementById('my-apps-header')?.scrollIntoView({ behavior: 'smooth' });
                            }}
                            className={`h-8 w-8 rounded-xl text-xs font-bold transition duration-300 cursor-pointer ${myJobsPage === pNum
                              ? 'bg-[#8B5CF6] text-white shadow-sm'
                              : 'bg-white border border-purple-500/10 text-slate-700 hover:bg-slate-50'
                              }`}
                          >
                            {pNum}
                          </button>
                        ))}
                      </div>

                      <button
                        type="button"
                        disabled={myJobsPage === totalMyJobsPages}
                        onClick={() => {
                          setMyJobsPage(prev => Math.min(prev + 1, totalMyJobsPages));
                          document.getElementById('my-apps-header')?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition duration-300 flex items-center gap-1 ${myJobsPage === totalMyJobsPages
                          ? 'bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed'
                          : 'bg-white border-purple-500/20 text-slate-700 hover:bg-slate-50 cursor-pointer hover:border-purple-500/40 hover:text-purple-600'
                          }`}
                      >
                        <span>Next</span>
                        <ChevronRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </motion.div>
        )}
      </div>

      {/* APPLICATION FORM MODAL (FEATURED JOBS TARGET) */}
      <AnimatePresence>
        {selectedJob && (
          <div
            onClick={() => setSelectedJob(null)}
            className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-start justify-center p-4 py-8 sm:py-12"
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg bg-white rounded-3xl p-6 md:p-8 border border-purple-100 shadow-2xl text-left my-auto"
            >
              <button
                type="button"
                onClick={() => setSelectedJob(null)}
                className="absolute right-4 top-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 border-none transition duration-200 cursor-pointer flex items-center justify-center shadow-sm"
              >
                <X className="h-4 w-4" />
              </button>
              <div className="mb-6 space-y-1">
                <span className="text-xs font-bold text-[#EC4899] uppercase tracking-widest">Apply for position</span>
                <h3 className="text-2xl font-black">{selectedJob.title}</h3>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">
                  {selectedJob.team} &bull; {selectedJob.location}
                  {selectedJob.salary && ` • ${selectedJob.salary}`}
                  {selectedJob.experience && ` • ${selectedJob.experience}`}
                </p>
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
                  <div className="space-y-3">
                    <p className="text-slate-500 text-xs leading-relaxed max-w-sm mx-auto">{message}</p>
                    <p className="inline-block bg-purple-50 border border-purple-100 rounded-xl py-2 px-4 text-[#8B5CF6] text-xs font-semibold leading-relaxed mx-auto">
                      You will receive mail through{' '}
                      <a
                        href="https://www.bnxmail.com/login"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline font-black hover:text-[#EC4899] transition-all"
                      >
                        BNX mail
                      </a>.
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedJob(null)}
                    className="px-6 py-2.5 rounded-xl bg-purple-600/10 hover:bg-gradient-to-r hover:from-[#8B5CF6] hover:to-[#EC4899] text-[#8B5CF6] hover:text-white border border-purple-500/30 text-xs font-extrabold transition cursor-pointer"
                  >
                    Close Modal
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApply} className="space-y-4">
                  {/* Pre-fetched Logged-in User Information */}
                  <div className="p-4 bg-purple-50/50 border border-purple-100 rounded-2xl text-xs font-semibold animate-fadeIn text-left">
                    <div>
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">Email Address</span>
                      <span className="text-slate-850 text-sm font-bold">{email || "Not Available"}</span>
                    </div>
                  </div>

                  <div className="space-y-1 text-left">
                    <label className="text-xs font-bold text-slate-500 uppercase">Full Name</label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Enter your full name"
                      className="w-full bg-white text-slate-800 placeholder-slate-400 border border-purple-200 rounded-xl py-2.5 px-4 focus:outline-none focus:border-[#EC4899] text-sm transition font-semibold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase">Phone Number</label>
                    <input
                      type="tel"
                      pattern="[0-9]{10}"
                      maxLength="10"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      placeholder="e.g. 9876543210"
                      className="w-full bg-white text-slate-800 placeholder-slate-400 border border-purple-200 rounded-xl py-2.5 px-4 focus:outline-none focus:border-[#EC4899] text-sm transition font-semibold"
                    />
                  </div>

                  <div className="space-y-1 text-left">
                    <label className="text-xs font-bold text-slate-500 uppercase">Total Work Experience</label>
                    <select
                      value={experience}
                      onChange={(e) => setExperience(e.target.value)}
                      className="w-full bg-white text-slate-800 border border-purple-200 rounded-xl py-2.5 px-4 focus:outline-none focus:border-[#EC4899] text-sm transition font-semibold cursor-pointer"
                    >
                      <option value="Fresher / 0-1 Years">Fresher / 0-1 Years</option>
                      <option value="1-2 Years">1-2 Years</option>
                      <option value="2-3 Years">2-3 Years</option>
                      <option value="3-5 Years">3-5 Years</option>
                      <option value="5+ Years">5+ Years</option>
                    </select>
                  </div>

                  <div className="space-y-1 text-left">
                    <label className="text-xs font-bold text-slate-500 uppercase">Cover Letter</label>
                    <textarea
                      value={coverLetter}
                      onChange={(e) => setCoverLetter(e.target.value)}
                      placeholder="Write your cover letter or introduction..."
                      rows={4}
                      className="w-full bg-white text-slate-800 placeholder-slate-400 border border-purple-200 rounded-xl py-2.5 px-4 focus:outline-none focus:border-[#EC4899] text-sm transition font-semibold resize-none"
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

                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setSelectedJob(null)}
                      className="flex-1 py-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition cursor-pointer text-center"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={status === 'loading'}
                      className="flex-[2] py-3 rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] text-white text-xs font-black transition flex items-center justify-center space-x-2 disabled:from-slate-200 disabled:to-slate-300 disabled:text-slate-400 cursor-pointer border-none"
                    >
                      {status === 'loading' ? (
                        <span>Submitting...</span>
                      ) : (
                        <>
                          <Briefcase className="h-4.5 w-4.5 text-white" />
                          <span>Submit Application</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>



      {/* SIGN IN REQUIRED FOR MY JOBS */}
      <AnimatePresence>
        {showLoginPrompt && (
          <div
            onClick={() => setShowLoginPrompt(false)}
            className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-sm bg-white rounded-3xl p-6 md:p-8 border border-purple-100 shadow-2xl text-left my-auto"
            >
              <button
                type="button"
                onClick={() => setShowLoginPrompt(false)}
                className="absolute right-4 top-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 border-none transition duration-200 cursor-pointer flex items-center justify-center shadow-sm"
              >
                <X className="h-4 w-4" />
              </button>
              <div className="py-6 text-center space-y-6">
                <div className="h-16 w-16 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center mx-auto text-[#EC4899] shadow-sm">
                  <AlertCircle className="h-8 w-8 animate-pulse" />
                </div>
                <h4 className="text-lg font-bold">Sign In Required</h4>
                <p className="text-slate-500 text-xs leading-relaxed max-w-xs mx-auto">
                  Please sign in to view and track your job application updates.
                </p>
                <button
                  onClick={() => {
                    setShowLoginPrompt(false);
                    redirectToSSO('/careers');
                  }}
                  className="w-full px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] hover:from-[#7c4ee6] hover:to-[#db3c8b] text-white text-xs font-extrabold transition cursor-pointer border-none shadow-md"
                >
                  Sign In to View Applications
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
