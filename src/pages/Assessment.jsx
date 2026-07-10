import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { Shield, Brain, Clock, CheckCircle, AlertTriangle, ArrowRight, RefreshCw } from 'lucide-react';

export default function Assessment() {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const candidateId = searchParams.get('id');

  const [candidate, setCandidate] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(1800); // Default 30 minutes in seconds
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [score, setScore] = useState(0);

  useEffect(() => {
    // Load candidate and applications from local storage
    const storedApps = localStorage.getItem('beta_applications');
    if (storedApps && candidateId) {
      const apps = JSON.parse(storedApps);
      const found = apps.find(app => String(app.id) === String(candidateId));
      if (found) {
        setCandidate(found);
      }
    }

    if (!candidateId) {
      setError('Invalid or missing candidate ID URL parameter.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');
    axios.get(`https://apply.beta-softnet.com/api/assessment/${candidateId}`)
      .then((response) => {
        const fetchedQuestions = response.data || [];
        setQuestions(fetchedQuestions);
        if (fetchedQuestions.length === 0) {
          setError('No assessment questions have been assigned to you yet.');
        } else if (fetchedQuestions[0].duration) {
          setTimeLeft(fetchedQuestions[0].duration * 60);
        } else {
          setTimeLeft(30 * 60); // Default fallback: 30 minutes
        }
      })
      .catch((error) => {
        console.error('Failed to load candidate questions:', error);
        setError('Failed to fetch assigned questions from the backend.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [candidateId]);

  // Running Timer Countdown
  useEffect(() => {
    if (timeLeft <= 0 || submitted || loading) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit(true); // Auto-submit when time is up
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, submitted, loading]);

  const handleSelectOption = (qId, optionIdx) => {
    if (submitted || submitting) return;
    setAnswers(prev => ({ ...prev, [qId]: optionIdx }));
  };

  const handleSubmit = async (autoSubmit = false) => {
    if (submitted || submitting) return;

    if (!autoSubmit && !window.confirm('Are you sure you want to submit your assessment answers now?')) {
      return;
    }

    setSubmitting(true);
    setError('');

    // Calculate a mock score based on answered questions count
    let answeredCount = 0;
    questions.forEach((q) => {
      const answerVal = answers[q.id];
      if (answerVal && answerVal.trim().length > 0) {
        answeredCount++;
      }
    });

    const calculatedScore = questions.length > 0
      ? Math.min(100, Math.max(40, Math.round((answeredCount / questions.length) * 100)))
      : 80;

    try {
      // Send all answers to the backend
      const answerPromises = Object.entries(answers).map(([qId, selectedVal]) => {
        return axios.post('http://localhost:8081/api/answers', {
          candidateId: parseInt(candidateId),
          questionId: parseInt(qId),
          selectedAnswer: selectedVal
        });
      });

      await Promise.all(answerPromises);

      setScore(calculatedScore);
      setSubmitted(true);

      // Save full typed answers in localStorage
      localStorage.setItem(`assessment_answers_${candidateId}`, JSON.stringify(answers));

      // Save submission results to global localStorage
      const storedApps = localStorage.getItem('beta_applications');
      if (storedApps && candidateId) {
        const apps = JSON.parse(storedApps);
        const updated = apps.map(app => {
          if (String(app.id) === String(candidateId)) {
            const isTechnical = app.status === 'Round 1 Technical';
            const isBrand = app.status === 'Round 2 Brand Awareness';
            return {
              ...app,
              technicalStatus: isTechnical ? 'Completed' : app.technicalStatus,
              technicalScore: isTechnical ? calculatedScore : app.technicalScore,
              brandStatus: isBrand ? 'Completed' : app.brandStatus,
              brandScore: isBrand ? calculatedScore : app.brandScore,
              aptitudeStatus: (!isTechnical && !isBrand) ? 'Completed' : app.aptitudeStatus,
              aptitudeScore: (!isTechnical && !isBrand) ? calculatedScore : app.aptitudeScore
            };
          }
          return app;
        });
        localStorage.setItem('beta_applications', JSON.stringify(updated));
      }
    } catch (err) {
      console.error('Failed to submit answers:', err);
      setError('Failed to submit assessment answers to the backend. Please check your network connection and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-left font-sans">
        <div className="w-full max-w-xl bg-white border border-slate-200 shadow-2xl rounded-3xl p-8 md:p-10 text-center space-y-6">
          <div className="h-16 w-16 bg-blue-50 border border-blue-200 text-[#004AAD] rounded-2xl flex items-center justify-center mx-auto animate-spin shadow-inner">
            <RefreshCw className="h-8 w-8" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Loading Assessment...</h2>
            <p className="text-slate-500 text-sm mt-1 leading-relaxed">
              Please wait while we fetch your assigned screening questions from the recruitment database.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error && questions.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-left font-sans">
        <div className="w-full max-w-xl bg-white border border-slate-200 shadow-2xl rounded-3xl p-8 md:p-10 text-center space-y-6">
          <div className="h-16 w-16 bg-rose-50 border border-rose-200 text-rose-600 rounded-2xl flex items-center justify-center mx-auto shadow-sm animate-pulse">
            <AlertTriangle className="h-8 w-8" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Assessment Unavailable</h2>
            <p className="text-rose-600 text-sm font-semibold mt-2 bg-rose-50 border border-rose-100 rounded-2xl p-4 leading-relaxed">
              {error}
            </p>
          </div>
          <p className="text-slate-450 text-[11px] leading-relaxed">
            Please contact the HR team or check your invitation link for details.
          </p>
        </div>
      </div>
    );
  }

  const candidateName = candidate?.fullName || 'Guest Candidate';
  const jobTitle = candidate?.jobTitle || 'BNX Mail Strategist';

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-left font-sans">
        <div className="w-full max-w-xl bg-white border border-slate-250/80 shadow-2xl rounded-3xl p-8 md:p-10 space-y-6 animate-fadeIn">
          <div className="h-16 w-16 bg-emerald-50 border border-emerald-200 text-emerald-600 rounded-2xl flex items-center justify-center shadow-sm">
            <CheckCircle className="h-8 w-8" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Assessment Submitted!</h2>
            <p className="text-slate-500 text-sm mt-1 leading-relaxed">
              Thank you, <strong className="text-slate-900">{candidateName}</strong>. Your screening exam responses have been successfully logged in the recruitment tracking system.
            </p>
          </div>
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs font-semibold text-slate-500">
            <div>Candidate: <strong className="text-slate-800">{candidateName}</strong></div>
            <div>Role: <strong className="text-slate-800">{jobTitle}</strong></div>
            <div>Score: <strong className="text-emerald-600 font-extrabold">{score}%</strong></div>
          </div>
          <p className="text-slate-400 text-xs leading-relaxed">
            Recruiting team will review your profile metrics shortly. You may close this browser window.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-850 font-sans py-12 px-4 flex justify-center text-left">
      <div className="w-full max-w-3xl space-y-6 animate-fadeIn">
        {/* Header card */}
        <div className="bg-white border border-slate-250 shadow-md rounded-3xl p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-xs font-bold text-[#004AAD] uppercase tracking-wider">
              <Brain className="h-4 w-4" />
              <span>
                {candidate?.status === 'Round 1 Technical' ? 'Round 2: Technical Challenge' :
                  candidate?.status === 'Round 2 Brand Awareness' ? 'Round 3: Brand Awareness Evaluation' :
                    'Round 1: Aptitude Screening'}
              </span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">{candidateName}</h1>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">{jobTitle}</p>
          </div>

          <div className="flex items-center space-x-4 bg-slate-50 border border-slate-200 px-4 py-3 rounded-2xl self-start md:self-auto shadow-sm">
            <Clock className={`h-5 w-5 ${timeLeft < 60 ? 'text-red-500 animate-pulse' : 'text-slate-450'}`} />
            <div>
              <span className="text-[10px] text-slate-455 font-bold uppercase tracking-widest block">Time Remaining</span>
              <span className={`text-base font-black font-mono ${timeLeft < 60 ? 'text-red-600' : 'text-slate-900'}`}>
                {formatTime(timeLeft)}
              </span>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 text-xs font-bold text-rose-700 flex items-center gap-2.5 shadow-sm animate-fadeIn">
            <AlertTriangle className="h-4.5 w-4.5 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        {/* Questions list */}
        <div className="space-y-6">
          {questions.map((q, idx) => {
            return (
              <div key={q.id} className="bg-white border border-slate-250 shadow-sm rounded-2xl p-6 space-y-4">
                <div className="flex items-start justify-between border-b border-slate-100 pb-3">
                  <div>
                    <span className="text-[10px] font-bold font-mono text-[#004AAD] uppercase tracking-wider block">Question {idx + 1} of {questions.length}</span>
                    <h3 className="text-base font-extrabold text-slate-900 leading-snug mt-1">{q.question}</h3>
                  </div>
                </div>

                {/* Multiple choice option cards with radio selection */}
                <div className="space-y-2.5 pt-2">
                  {[
                    { key: 'optionA', label: 'A', text: q.optionA },
                    { key: 'optionB', label: 'B', text: q.optionB },
                    { key: 'optionC', label: 'C', text: q.optionC },
                    { key: 'optionD', label: 'D', text: q.optionD }
                  ].map((opt) => {
                    if (!opt.text) return null;
                    const isSelected = answers[q.id] === opt.key;
                    return (
                      <label
                        key={opt.key}
                        className={`flex items-center gap-3 p-3.5 rounded-2xl border text-sm font-semibold cursor-pointer transition-all duration-200 ${isSelected
                            ? 'bg-blue-50/30 border-blue-400 text-blue-900 shadow-xs'
                            : 'bg-slate-50/50 border-slate-200 hover:border-slate-350 text-slate-700'
                          }`}
                      >
                        <input
                          type="radio"
                          name={`question_${q.id}`}
                          value={opt.key}
                          checked={isSelected}
                          onChange={() => handleSelectOption(q.id, opt.key)}
                          disabled={submitted || submitting}
                          className="h-4.5 w-4.5 border-slate-350 text-blue-600 focus:ring-blue-500 cursor-pointer disabled:opacity-50"
                        />
                        <span className="font-black text-slate-455 mr-0.5">{opt.label}.</span>
                        <span>{opt.text}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Submit Actions */}
        <div className="bg-white border border-slate-250 shadow-md rounded-3xl p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <p className="text-xs text-slate-500 font-semibold leading-relaxed max-w-md text-left">
            Please review all your answers before submitting. The test will automatically finalize when the countdown reaches zero.
          </p>
          <button
            onClick={() => handleSubmit(false)}
            disabled={submitting || submitted}
            className="flex items-center justify-center space-x-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition duration-200 cursor-pointer shadow-lg shadow-blue-500/10 self-end sm:self-auto border-none outline-none disabled:opacity-55 disabled:cursor-not-allowed"
          >
            <span>{submitting ? 'Submitting Answers...' : 'Submit Assessment'}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
