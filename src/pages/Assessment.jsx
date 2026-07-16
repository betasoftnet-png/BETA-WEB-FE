import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { Shield, Brain, Clock, CheckCircle, AlertTriangle, ArrowRight, RefreshCw } from 'lucide-react';

const BACKEND_API_BASE =
  window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1'
    ? 'http://localhost:8081'
    : 'https://apply.beta-softnet.com';

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
  const [attempts, setAttempts] = useState(0);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [isScreenObscured, setIsScreenObscured] = useState(false);
  const questionsReadyRef = useRef(false); // tracks when questions are fully loaded and stable
  const [blockedMessage, setBlockedMessage] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [securityAlert, setSecurityAlert] = useState('');
  const terminateAssessmentDueToScreenshot = () => {
    const msg = "Screenshot activity detected. Your assessment has been terminated.";
    setBlockedMessage(msg);
    localStorage.setItem(`assessment_blocked_${candidateId}`, "screenshot_terminated");

    if (candidateId) {
      axios.post(`${BACKEND_API_BASE}/api/assessment/${candidateId}/increment-attempt`)
        .then(() => axios.post(`${BACKEND_API_BASE}/api/assessment/${candidateId}/increment-attempt`))
        .catch(err => console.error("Error logging screenshot violation:", err));
    }
  };

  useEffect(() => {
    if (!securityAlert) return;
    const timer = setTimeout(() => {
      setSecurityAlert('');
    }, 3000);
    return () => clearTimeout(timer);
  }, [securityAlert]);

  useEffect(() => {
    if (!candidateId) {
      setError('Invalid or missing candidate ID URL parameter.');
      setLoading(false);
      return;
    }

    // Check if previously blocked due to screenshot
    const isPreviouslyBlocked = localStorage.getItem(`assessment_blocked_${candidateId}`);
    if (isPreviouslyBlocked === "screenshot_terminated") {
      setBlockedMessage("Screenshot activity detected. Your assessment has been terminated.");
      setLoading(false);
      return;
    }

    // Load candidate and applications from local storage
    const storedApps = localStorage.getItem('beta_applications');
    if (storedApps) {
      const apps = JSON.parse(storedApps);
      const found = apps.find(app => String(app.id) === String(candidateId));
      if (found) {
        setCandidate(found);
      }
    }

    setLoading(true);
    setError('');
    axios.get(`${BACKEND_API_BASE}/api/assessment/${candidateId}`)
      .then((response) => {
        // The API now returns a wrapper object: { candidateId, candidateName, jobTitle, questions, attempts, submitted, score }
        const payload = response.data || {};

        if (payload.submitted) {
          setCandidate({
            fullName: payload.candidateName,
            jobTitle: payload.jobTitle,
            id: payload.candidateId || candidateId
          });
          setScore(payload.score || 0);
          setSubmitted(true);
          setLoading(false);
          return;
        }

        const fetchedQuestions = payload.questions || [];
        setQuestions(fetchedQuestions);
        setCandidate({
          fullName: payload.candidateName,
          jobTitle: payload.jobTitle,
          id: payload.candidateId || candidateId
        });

        const currentAttempts = payload.attempts || 0;
        setAttempts(currentAttempts);

        if (currentAttempts === 2) {
          alert("You have refreshed 1 time (Count 1). If you attempt more than 2 times, the assessment page will be closed.");
        } else if (currentAttempts > 2) {
          setBlockedMessage("Assessment Blocked: You have exceeded the maximum of 2 allowed attempts.");
        }

        if (fetchedQuestions.length === 0) {
          setError('No assessment questions have been assigned to you yet.');
        } else if (fetchedQuestions[0].duration) {
          setTimeLeft(fetchedQuestions[0].duration * 60);
        } else {
          setTimeLeft(30 * 60); // Default fallback: 30 minutes
        }

        // Mark questions as ready after a 5-second stabilization window
        setTimeout(() => { questionsReadyRef.current = true; }, 5000);
      })
      .catch((error) => {
        console.error('Failed to load candidate questions:', error);
        const errorMsg = error.response?.data || 'Failed to fetch assigned questions from the backend.';
        if (typeof errorMsg === 'string' && errorMsg.toLowerCase().includes('already submitted')) {
          setSubmitted(true);
        } else if (typeof errorMsg === 'string' && (errorMsg.toLowerCase().includes('2 times') || errorMsg.toLowerCase().includes('exceeded'))) {
          setBlockedMessage(errorMsg);
        } else {
          setError(errorMsg);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [candidateId]);

  // 1. Tab Switch / Focus Loss Detection
  useEffect(() => {
    if (!candidateId || loading || submitted || error) return;

    let lastViolationTime = 0;

    const handleVisibilityOrBlur = () => {
      if (!questionsReadyRef.current) return; // Wait until questions are fully loaded and stable
      const now = Date.now();
      if (now - lastViolationTime < 2000) return; // Throttling: ignore events within 2 seconds

      if (document.visibilityState === 'hidden' || !document.hasFocus()) {
        lastViolationTime = now;

        axios.post(`${BACKEND_API_BASE}/api/assessment/${candidateId}/increment-attempt`)
          .then((res) => {
            const updatedAttempts = res.data;
            setAttempts(updatedAttempts);
            if (updatedAttempts === 2) {
              setShowWarningModal(true);
            } else if (updatedAttempts > 2) {
              setBlockedMessage('Assessment blocked. You have exceeded the maximum allowed attempts/violations (2 attempts max).');
            } else {
              setShowWarningModal(true);
            }
          })
          .catch((err) => {
            console.error('Error recording attempt violation:', err);
            const errBody = err.response?.data || 'Assessment blocked due to security violation.';
            if (typeof errBody === 'string' && (errBody.toLowerCase().includes('2 times') || errBody.toLowerCase().includes('exceeded'))) {
              setBlockedMessage("Assessment Blocked: You have exceeded the maximum of 2 allowed attempts.");
            } else {
              setError(errBody);
            }
          });
      }
    };

    window.addEventListener('visibilitychange', handleVisibilityOrBlur);
    window.addEventListener('blur', handleVisibilityOrBlur);

    return () => {
      window.removeEventListener('visibilitychange', handleVisibilityOrBlur);
      window.removeEventListener('blur', handleVisibilityOrBlur);
    };
  }, [candidateId, loading, submitted, error]);

  // 1.5. Screenshot and Focus Loss Obscuration
  useEffect(() => {
    if (!candidateId || loading || submitted || error) return;

    const handleBlur = () => {
      if (!questionsReadyRef.current) return; // Wait until questions are stable
      setIsScreenObscured(true);
    };

    const handleFocus = () => {
      if (!questionsReadyRef.current) return; // Wait until questions are stable
      // Re-verify that they aren't blocked before showing content
      axios.get(`${BACKEND_API_BASE}/api/assessment/${candidateId}?increment=false`)
        .then(() => {
          setIsScreenObscured(false);
        })
        .catch((err) => {
          const errBody = err.response?.data || 'Assessment blocked.';
          if (typeof errBody === 'string' && (errBody.toLowerCase().includes('2 times') || errBody.toLowerCase().includes('exceeded'))) {
            setBlockedMessage("Assessment Blocked: You have exceeded the maximum of 2 allowed attempts.");
          } else {
            setError(errBody);
          }
        });
    };

    window.addEventListener('blur', handleBlur);
    window.addEventListener('focus', handleFocus);
    document.addEventListener('mouseleave', handleBlur);
    document.addEventListener('mouseenter', handleFocus);

    const handleVisibilityChange = () => {
      if (!questionsReadyRef.current) return; // Wait until questions are stable
      if (document.visibilityState === 'hidden') {
        setIsScreenObscured(true);
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('mouseleave', handleBlur);
      document.removeEventListener('mouseenter', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [candidateId, loading, submitted, error]);

  // 2. Prevent Copy/Cut/Right-Click & Keyboard Protection
  useEffect(() => {
    const preventCopy = (e) => {
      e.preventDefault();
      setSecurityAlert("Copying questions or options is disabled for security reasons.");
    };

    const preventKeyDown = (e) => {
      // 1. Detect screenshot combinations
      const isPrintScreen = e.key === 'PrintScreen' || e.keyCode === 44 || e.code === 'PrintScreen';
      const isWinShiftS = e.metaKey && e.shiftKey && (e.key === 's' || e.key === 'S' || e.keyCode === 83);
      const isMacScreenshot = e.metaKey && e.shiftKey && (e.key === '3' || e.key === '4' || e.key === '5' || (e.keyCode >= 51 && e.keyCode <= 53));
      const isCtrlShiftS = e.ctrlKey && e.shiftKey && (e.key === 's' || e.key === 'S' || e.keyCode === 83);

      if (isPrintScreen || isWinShiftS || isMacScreenshot || isCtrlShiftS) {
        e.preventDefault();
        try {
          navigator.clipboard.writeText("Screenshot blocked by Beta Softnet security policy.");
        } catch (err) {
          // Ignore
        }
        terminateAssessmentDueToScreenshot();
        return false;
      }

      // 2. Disable F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U, Ctrl+S, Ctrl+P, Ctrl+C, Ctrl+V, Ctrl+X
      if (
        e.keyCode === 123 || // F12
        (e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.keyCode === 74)) || // Ctrl+Shift+I/J
        (e.ctrlKey && (e.keyCode === 85 || e.keyCode === 83 || e.keyCode === 80 || e.keyCode === 67 || e.keyCode === 86 || e.keyCode === 88)) // Ctrl+U/S/P/C/V/X
      ) {
        e.preventDefault();
        setSecurityAlert("Developer tools and custom keyboard shortcuts are disabled for security reasons.");
        return false;
      }
    };

    const preventContextMenu = (e) => {
      e.preventDefault();
    };

    window.addEventListener('copy', preventCopy);
    window.addEventListener('cut', preventCopy);
    window.addEventListener('contextmenu', preventContextMenu);
    window.addEventListener('keydown', preventKeyDown);
    window.addEventListener('keyup', preventKeyDown);

    return () => {
      window.removeEventListener('copy', preventCopy);
      window.removeEventListener('cut', preventCopy);
      window.removeEventListener('contextmenu', preventContextMenu);
      window.removeEventListener('keydown', preventKeyDown);
      window.removeEventListener('keyup', preventKeyDown);
    };
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

    setSubmitting(true);
    setError('');

    // Calculate actual time taken
    const totalDuration = questions.length > 0 && questions[0].duration ? questions[0].duration * 60 : 30 * 60;
    const elapsed = Math.max(0, totalDuration - timeLeft);
    const mins = Math.floor(elapsed / 60);
    const secs = elapsed % 60;
    const timeTakenStr = `${mins}m ${secs}s`;

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
        return axios.post(`${BACKEND_API_BASE}/api/answers`, {
          candidateId: parseInt(candidateId),
          questionId: parseInt(qId),
          selectedAnswer: selectedVal
        });
      });

      await Promise.all(answerPromises);

      // Finalize the assessment submission in the backend
      const submitRes = await axios.post(`${BACKEND_API_BASE}/api/assessment/${candidateId}/submit?timeTaken=${encodeURIComponent(timeTakenStr)}`);
      const finalScore = (submitRes.data && submitRes.data.score !== undefined) ? submitRes.data.score : calculatedScore;

      setScore(finalScore);
      setSubmitted(true);

      // Save submission state to prevent re-entering
      localStorage.setItem(`assessment_submitted_${candidateId}`, 'true');

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
              technicalScore: isTechnical ? finalScore : app.technicalScore,
              brandStatus: isBrand ? 'Completed' : app.brandStatus,
              brandScore: isBrand ? finalScore : app.brandScore,
              aptitudeStatus: (!isTechnical && !isBrand) ? 'Completed' : app.aptitudeStatus,
              aptitudeScore: (!isTechnical && !isBrand) ? finalScore : app.aptitudeScore
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

  if (blockedMessage) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-left font-sans">
        <div className="w-full max-w-xl bg-white border border-slate-200 shadow-2xl rounded-3xl p-8 md:p-10 text-center space-y-6">
          <div className="h-16 w-16 bg-rose-50 border border-rose-200 text-rose-600 rounded-2xl flex items-center justify-center mx-auto shadow-sm animate-pulse">
            <Shield className="h-8 w-8 text-rose-600 animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Assessment Blocked</h2>
            <p className="text-rose-600 text-sm font-semibold mt-2 bg-rose-50 border border-rose-100 rounded-2xl p-4 leading-relaxed">
              {blockedMessage}
            </p>
          </div>
          <p className="text-slate-450 text-[11px] leading-relaxed">
            Please contact the HR/recruiting team if you believe this is an error or to request an unlock.
          </p>
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
            {candidate?.id && <div>Candidate ID: <strong className="text-slate-800 font-mono">#{candidate.id}</strong></div>}
            <div>Candidate: <strong className="text-slate-800">{candidateName}</strong></div>
            <div>Role: <strong className="text-slate-800">{jobTitle}</strong></div>
          </div>
          <p className="text-slate-400 text-xs leading-relaxed">
            Recruiting team will review your profile metrics shortly. You may close this browser window.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-850 font-sans py-12 px-4 flex justify-center text-left select-none relative">
      <style>{`
        @media print {
          body { display: none !important; }
        }
        .select-none {
          user-select: none !important;
          -webkit-user-select: none !important;
          -moz-user-select: none !important;
          -ms-user-select: none !important;
        }
      `}</style>

      <div className={`w-full max-w-3xl space-y-6 animate-fadeIn ${showWarningModal || isScreenObscured ? 'blur-md pointer-events-none' : ''}`}>
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
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex flex-wrap items-center gap-2">
              <span>{candidateName}</span>
              {candidate?.id && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10.5px] font-bold bg-slate-100 border border-slate-200 text-slate-500 select-all cursor-text font-mono" title="Candidate ID">
                  ID: {candidate.id}
                </span>
              )}
            </h1>
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
            onClick={() => setShowConfirmModal(true)}
            disabled={submitting || submitted}
            className="flex items-center justify-center space-x-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition duration-200 cursor-pointer shadow-lg shadow-blue-500/10 self-end sm:self-auto border-none outline-none disabled:opacity-55 disabled:cursor-not-allowed"
          >
            <span>{submitting ? 'Submitting Answers...' : 'Submit Assessment'}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {showWarningModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md pointer-events-auto">
          <div className="w-full max-w-md bg-white border border-rose-100 shadow-2xl rounded-3xl p-6 md:p-8 text-center space-y-6 animate-fadeIn">
            <div className="h-16 w-16 bg-rose-50 border border-rose-200 text-rose-600 rounded-2xl flex items-center justify-center mx-auto shadow-sm animate-bounce">
              <AlertTriangle className="h-8 w-8" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Security Violation Warning</h2>
              <p className="text-rose-600 text-xs font-semibold mt-2 bg-rose-50 border border-rose-100 rounded-xl p-3 leading-relaxed">
                You navigated away from the assessment tab or lost window focus.
              </p>
              <p className="text-slate-500 text-xs leading-relaxed mt-4">
                This action has been logged as one count/attempt. You have used <strong className="text-slate-900">{attempts}</strong> of <strong className="text-slate-900">2</strong> allowed attempts.
              </p>
            </div>
            <button
              onClick={() => setShowWarningModal(false)}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 text-white text-xs font-bold transition duration-200 cursor-pointer shadow-lg shadow-red-500/20 border-none outline-none"
            >
              I Understand, Return to Assessment
            </button>
          </div>
        </div>
      )}

      {isScreenObscured && !submitted && !error && !loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-xl pointer-events-auto">
          <div className="w-full max-w-md bg-white border border-slate-200 shadow-2xl rounded-3xl p-8 text-center space-y-6 animate-fadeIn">
            <div className="h-16 w-16 bg-blue-50 border border-blue-200 text-[#004AAD] rounded-2xl flex items-center justify-center mx-auto shadow-sm">
              <Shield className="h-8 w-8 animate-pulse" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Screen Protection Active</h2>
              <p className="text-slate-500 text-xs leading-relaxed mt-2 bg-slate-50 border border-slate-100 rounded-xl p-3">
                Content is hidden because focus was lost. Screenshot tools are blocked.
              </p>
              <p className="text-slate-450 text-[11px] leading-relaxed mt-4">
                Click the button below to resume the assessment.
              </p>
            </div>
            <button
              onClick={() => setIsScreenObscured(false)}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition duration-200 cursor-pointer shadow-lg shadow-blue-500/20 border-none outline-none"
            >
              Resume Assessment
            </button>
          </div>
        </div>
      )}

      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md pointer-events-auto">
          <div className="w-full max-w-md bg-white border border-slate-200 shadow-2xl rounded-3xl p-6 md:p-8 text-center space-y-6 animate-fadeIn">
            <div className="h-16 w-16 bg-blue-50 border border-blue-200 text-[#004AAD] rounded-2xl flex items-center justify-center mx-auto shadow-sm">
              <Shield className="h-8 w-8 text-[#004AAD]" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Submit Assessment?</h2>
              <p className="text-slate-500 text-xs leading-relaxed mt-2 bg-slate-50 border border-slate-100 rounded-xl p-3">
                Are you sure you want to submit your assessment answers now? You won't be able to edit them afterward.
              </p>
            </div>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition duration-200 cursor-pointer border-none outline-none"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowConfirmModal(false);
                  handleSubmit(true);
                }}
                className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition duration-200 cursor-pointer shadow-lg shadow-blue-500/20 border-none outline-none"
              >
                Yes, Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {securityAlert && (
        <div className="fixed top-6 right-6 z-[100] max-w-sm bg-slate-900 text-white border border-slate-800 shadow-2xl rounded-2xl p-4 flex items-center gap-3 animate-slideIn">
          <div className="h-8 w-8 bg-rose-500/20 border border-rose-500/30 text-rose-450 rounded-lg flex items-center justify-center shrink-0">
            <AlertTriangle className="h-4.5 w-4.5 text-rose-500" />
          </div>
          <div className="flex-1 text-xs font-semibold leading-normal">
            {securityAlert}
          </div>
        </div>
      )}
    </div>
  );
}


