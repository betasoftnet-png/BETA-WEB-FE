import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Shield, Brain, Clock, CheckCircle, AlertTriangle, ArrowRight } from 'lucide-react';

export default function Assessment() {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const candidateId = searchParams.get('id');

  const [candidate, setCandidate] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    // Load candidate and applications from local storage
    const storedApps = localStorage.getItem('beta_applications');
    if (storedApps && candidateId) {
      const apps = JSON.parse(storedApps);
      const found = apps.find(app => app.id === candidateId);
      if (found) {
        setCandidate(found);
      }
    }

    // Load assigned questions or load default 5 Quant questions
    const assignedKey = `assessment_questions_${candidateId}`;
    const storedQuestions = localStorage.getItem(assignedKey);
    if (storedQuestions) {
      setQuestions(JSON.parse(storedQuestions));
    } else {
      // Load a default set of 5 sample questions if none were assigned
      const defaultQuestions = [
        {
          id: 'q-quant-default-1',
          title: 'Simple Interest & Growth',
          difficulty: 'Easy',
          time: '2 mins',
          description: 'Calculate the Simple Interest on a principal sum of $2000 at a rate of 6% per annum for 3 years.',
          options: ['A) $360', 'B) $300', 'C) $400', 'D) $420'],
          correctIndex: 0
        },
        {
          id: 'q-logical-default-2',
          title: 'Blood Relations Tree',
          difficulty: 'Medium',
          time: '2 mins',
          description: 'Pointing to a photo, a project lead says: "His mother is the only daughter-in-law of my father\'s wife." How is the lead related to the person in the photo?',
          options: ['A) Brother', 'B) Father', 'C) Uncle', 'D) Cousin'],
          correctIndex: 1
        },
        {
          id: 'q-verbal-default-3',
          title: 'Synonyms & Vocabulary',
          difficulty: 'Easy',
          time: '1 min',
          description: 'Choose the word which is closest in meaning to the term "Loquacious".',
          options: ['A) Quiet', 'B) Angry', 'C) Talkative', 'D) Happy'],
          correctIndex: 2
        },
        {
          id: 'q-quant-default-4',
          title: 'Profit and Loss',
          difficulty: 'Medium',
          time: '2 mins',
          description: 'A retail merchant marks his inventory 20% above cost price and then offers a customer discount of 10%. What is the net profit percentage?',
          options: ['A) 10%', 'B) 8%', 'C) 12%', 'D) 5%'],
          correctIndex: 1
        },
        {
          id: 'q-dataint-default-5',
          title: 'Pie Chart Budget Share',
          difficulty: 'Medium',
          time: '3 mins',
          description: 'A corporate pie chart segments expenditure. If the total annual budget is $200,000, find the raw amount spent on R&D if it represents 15% of total share.',
          options: ['A) $30,000', 'B) $25,000', 'C) $35,000', 'D) $40,000'],
          correctIndex: 0
        }
      ];
      setQuestions(defaultQuestions);
    }
  }, [candidateId]);

  // Running Timer Countdown
  useEffect(() => {
    if (timeLeft <= 0 || submitted) return;
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
  }, [timeLeft, submitted]);

  const handleSelectOption = (qId, optionIdx) => {
    setAnswers(prev => ({ ...prev, [qId]: optionIdx }));
  };

  const handleSubmit = (autoSubmit = false) => {
    if (submitted) return;

    if (!autoSubmit && !window.confirm('Are you sure you want to submit your assessment answers now?')) {
      return;
    }

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

    setScore(calculatedScore);
    setSubmitted(true);

    // Save full typed answers in localStorage
    localStorage.setItem(`assessment_answers_${candidateId}`, JSON.stringify(answers));

    // Save submission results to global localStorage
    const storedApps = localStorage.getItem('beta_applications');
    if (storedApps && candidateId) {
      const apps = JSON.parse(storedApps);
      const updated = apps.map(app => {
        if (app.id === candidateId) {
          return {
            ...app,
            aptitudeStatus: 'Completed',
            aptitudeScore: calculatedScore
          };
        }
        return app;
      });
      localStorage.setItem('beta_applications', JSON.stringify(updated));
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (!candidate && candidateId) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50 text-slate-800">
        <div className="max-w-md bg-white border border-slate-200 shadow-xl rounded-3xl p-8 text-center space-y-6">
          <div className="h-16 w-16 bg-red-50 border border-red-200 text-red-500 rounded-2xl flex items-center justify-center mx-auto">
            <AlertTriangle className="h-8 w-8" />
          </div>
          <h2 className="text-xl font-extrabold text-slate-900">Assessment Link Invalid</h2>
          <p className="text-sm text-slate-500 leading-relaxed">
            The candidate profile could not be retrieved from the tracking system database. Please ensure you are opening a valid URL copied from the Admin panel.
          </p>
        </div>
      </div>
    );
  }

  // Fallback candidate text if viewing without ID
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
              Thank you, <strong className="text-slate-900">{candidateName}</strong>. Your aptitude screening exam responses have been successfully logged in the recruitment tracking system.
            </p>
          </div>
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs font-semibold text-slate-500">
            <div>Candidate: <strong className="text-slate-800">{candidateName}</strong></div>
            <div>Role: <strong className="text-slate-800">{jobTitle}</strong></div>
            <div>Aptitude Score: <strong className="text-emerald-600 font-extrabold">{score}%</strong></div>
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
      <div className="w-full max-w-3xl space-y-6">
        {/* Header card */}
        <div className="bg-white border border-slate-250 shadow-md rounded-3xl p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-xs font-bold text-[#004AAD] uppercase tracking-wider">
              <Brain className="h-4 w-4" />
              <span>Round 1: Aptitude Screening</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">{candidateName}</h1>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">{jobTitle}</p>
          </div>

          <div className="flex items-center space-x-4 bg-slate-50 border border-slate-200 px-4 py-3 rounded-2xl self-start md:self-auto shadow-sm">
            <Clock className={`h-5 w-5 ${timeLeft < 60 ? 'text-red-500 animate-pulse' : 'text-slate-450'}`} />
            <div>
              <span className="text-[10px] text-slate-450 font-bold uppercase tracking-widest block">Time Remaining</span>
              <span className={`text-base font-black font-mono ${timeLeft < 60 ? 'text-red-600' : 'text-slate-900'}`}>
                {formatTime(timeLeft)}
              </span>
            </div>
          </div>
        </div>

        {/* Questions list */}
        <div className="space-y-6">
          {questions.map((q, idx) => {
            // Generate standard multiple choice options if they don't exist
            const options = q.options || [
              'A) ValueOption 1',
              'B) ValueOption 2',
              'C) ValueOption 3',
              'D) ValueOption 4'
            ];

            return (
              <div key={q.id} className="bg-white border border-slate-250 shadow-sm rounded-2xl p-6 space-y-4">
                <div className="flex items-start justify-between border-b border-slate-100 pb-3">
                  <div>
                    <span className="text-[10px] font-bold font-mono text-[#004AAD] uppercase tracking-wider block">Question {idx + 1} of {questions.length}</span>
                    <h3 className="text-base font-extrabold text-slate-900 leading-snug mt-1">{q.title}</h3>
                  </div>
                  <span className="px-2.5 py-0.5 rounded bg-slate-50 border border-slate-200 text-slate-650 text-[9px] font-bold uppercase">
                    {q.difficulty}
                  </span>
                </div>

                <p className="text-slate-700 text-sm leading-relaxed font-medium">
                  {q.description}
                </p>

                {/* Text answer input box */}
                <div className="pt-2">
                  <label className="text-[10px] uppercase tracking-wider font-bold text-slate-450 block mb-1.5">Your Response:</label>
                  <textarea
                    rows={3}
                    value={answers[q.id] || ''}
                    onChange={(e) => setAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                    placeholder="Type your final calculated answer, reasoning, or response here..."
                    className="w-full border border-slate-200 rounded-xl py-3.5 px-4 focus:outline-none focus:border-[#004AAD] text-xs font-semibold bg-slate-50/50 transition duration-200"
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Submit Actions */}
        <div className="bg-white border border-slate-250 shadow-md rounded-3xl p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <p className="text-xs text-slate-500 font-semibold leading-relaxed max-w-md">
            Please review all your answers before submitting. The test will automatically finalize when the countdown reaches zero.
          </p>
          <button
            onClick={() => handleSubmit(false)}
            className="flex items-center justify-center space-x-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition duration-200 cursor-pointer shadow-lg shadow-blue-500/10 self-end sm:self-auto border-none outline-none"
          >
            <span>Submit Assessment</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
