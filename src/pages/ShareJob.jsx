import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertCircle, ArrowLeft, ArrowRight, Briefcase, MapPin, Clock } from 'lucide-react';
import axios from 'axios';

// Resolve the API base URL at module load time — works on both localhost and production
const API_BASE =
  window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:8081'
    : 'https://apply.beta-softnet.com';

const CAREERS_URL =
  window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? `http://${window.location.host}/careers`
    : 'https://www.beta-softnet.com/careers';

export default function ShareJob() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) {
      setError('Invalid Job ID specified in URL.');
      setLoading(false);
      return;
    }

    const fetchJob = async () => {
      setLoading(true);
      setError('');
      try {
        // Use a plain axios instance (no auth token) so unauthenticated visitors can load the page
        const response = await axios.get(`${API_BASE}/api/jobs/${id}`, {
          headers: { 'Content-Type': 'application/json' },
          timeout: 10000,
        });

        // Handle both flat { id, title, ... } and wrapped { data: { id, title, ... } }
        const jobData = response.data?.data ?? response.data;

        if (jobData && (jobData.id || jobData.id === 0)) {
          setJob({
            id: jobData.id,
            title: jobData.title || 'Job Opening',
            department: jobData.department || '',
            location: jobData.location || '',
            type: jobData.type || jobData.employmentType || '',
            experience: jobData.experience || '',
            salary: jobData.salary || '',
          });
        } else {
          setError('This job posting is no longer available.');
        }
      } catch (err) {
        console.error('ShareJob: API fetch failed:', err);
        const status = err.response?.status;
        if (status === 404) {
          setError('This job posting is no longer available.');
        } else if (status === 401 || status === 403) {
          setError('Access denied. Please visit the Careers page to browse open roles.');
        } else {
          setError('Unable to load this job posting. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  const handleOpenCareers = () => {
    const destination = `${CAREERS_URL}?job=${id}`;
    window.location.href = destination;
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-10 w-10 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />
          <p className="text-slate-500 text-sm font-bold animate-pulse">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md glass-card p-8 rounded-3xl border border-slate-200 shadow-2xl text-center flex flex-col items-center space-y-6"
        >
          <div className="h-16 w-16 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-500 shadow-sm">
            <AlertCircle className="h-8 w-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight text-center">Job Not Found</h2>
            <p className="text-slate-500 text-sm leading-relaxed text-center">
              {error || 'This posting may no longer be active or the URL is invalid.'}
            </p>
          </div>
          <button
            id="back-to-careers-btn"
            onClick={() => { window.location.href = CAREERS_URL; }}
            className="w-full py-3 rounded-2xl bg-[#004AAD] hover:bg-[#003882] text-white text-xs font-bold transition flex items-center justify-center space-x-2 shadow-lg shadow-blue-500/10 border-none outline-none cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Careers</span>
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16 relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md glass-card rounded-3xl border border-slate-200/90 shadow-xl p-8 flex flex-col items-center space-y-6 text-center relative"
      >
        {/* Logo */}
        <a href={CAREERS_URL.replace('/careers', '')} className="inline-block select-none mb-2">
          <img
            src="/logo.png"
            alt="Beta Softnet"
            className="h-16 w-auto object-contain hover:scale-105 transition-transform duration-300"
          />
        </a>

        {/* Badge */}
        <span className="text-[10px] font-black text-blue-600 bg-blue-50 border border-blue-500/10 px-3.5 py-1 rounded-full uppercase tracking-widest shadow-sm -mb-2">
          Beta Softnet Hiring
        </span>

        {/* Job Title */}
        <div className="space-y-3 w-full">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#002D7A] tracking-tight leading-tight">
            {job.title}
          </h1>
        </div>

        {/* Meta pills */}
        {(job.department || job.location || job.type || job.experience || job.salary) && (
          <div className="flex flex-wrap justify-center gap-2 w-full">
            {job.department && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-600 bg-slate-100 border border-slate-200 px-3 py-1 rounded-full">
                <Briefcase className="h-3 w-3" /> {job.department}
              </span>
            )}
            {job.location && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-600 bg-slate-100 border border-slate-200 px-3 py-1 rounded-full">
                <MapPin className="h-3 w-3" /> {job.location}
              </span>
            )}
            {job.type && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-600 bg-slate-100 border border-slate-200 px-3 py-1 rounded-full">
                <Clock className="h-3 w-3" /> {job.type}
              </span>
            )}
            {job.experience && (
              <span className="text-[11px] font-bold text-slate-600 bg-slate-100 border border-slate-200 px-3 py-1 rounded-full">
                ⏳ {job.experience}
              </span>
            )}
            {job.salary && (
              <span className="text-[11px] font-bold text-slate-600 bg-slate-100 border border-slate-200 px-3 py-1 rounded-full">
                💰 {job.salary}
              </span>
            )}
          </div>
        )}

        {/* CTA Button */}
        <div className="w-full pt-2">
          <button
            id="open-careers-btn"
            onClick={handleOpenCareers}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-extrabold transition-all duration-300 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 hover:-translate-y-0.5 flex items-center justify-center space-x-2 cursor-pointer border-none outline-none text-xs uppercase tracking-wider"
          >
            <span>View &amp; Apply</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        <p className="text-[10px] text-slate-400 font-medium">
          © {new Date().getFullYear()} Beta Softnet · All rights reserved
        </p>
      </motion.div>
    </div>
  );
}
