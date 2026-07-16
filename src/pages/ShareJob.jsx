import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertCircle, ArrowLeft, ArrowRight } from 'lucide-react';
import api from '../api';

export default function ShareJob() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const redirect = searchParams.get('redirect');

  useEffect(() => {
    const fetchJob = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await api.get(`/api/jobs/${id}`);
        const jobData = response.data?.data || response.data;
        if (jobData && jobData.id) {
          setJob({
            id: jobData.id,
            title: jobData.title || 'Job Opening'
          });
        } else {
          throw new Error('Invalid job payload');
        }
      } catch (err) {
        console.error('API fetch for job details failed:', err);
        setError('We could not find the job posting you are looking for.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchJob();
    } else {
      setError('Invalid Job ID specified in URL.');
      setLoading(false);
    }
  }, [id]);

  const handleOpenCareers = () => {
    const destination = redirect ? decodeURIComponent(redirect) : 'https://www.beta-softnet.com/careers';
    if (destination.startsWith('http://') || destination.startsWith('https://')) {
      window.location.href = destination;
    } else {
      navigate(destination);
    }
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
              {error || "This posting may no longer be active or the URL is invalid."}
            </p>
          </div>
          <button
            onClick={() => {
              window.location.href = 'https://www.beta-softnet.com/careers';
            }}
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
        <a href="https://www.beta-softnet.com" className="inline-block select-none mb-2">
          <img 
            src="/logo.png" 
            alt="Beta Softnet" 
            className="h-16 w-auto object-contain hover:scale-105 transition-transform duration-300" 
          />
        </a>

        {/* Heading & Title */}
        <div className="space-y-3 w-full">
          <span className="text-[10px] font-black text-blue-600 bg-blue-50 border border-blue-500/10 px-3.5 py-1 rounded-full uppercase tracking-widest shadow-sm">
            Beta Softnet Hiring
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#002D7A] tracking-tight leading-tight pt-2">
            {job.title}
          </h1>
        </div>

        {/* Action Button */}
        <div className="w-full pt-4">
          <button
            onClick={handleOpenCareers}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-extrabold transition-all duration-300 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 hover:-translate-y-0.5 flex items-center justify-center space-x-2 cursor-pointer border-none outline-none text-xs uppercase tracking-wider"
          >
            <span>Open Careers</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}
