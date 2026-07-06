import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Send, CheckCircle2, AlertCircle } from 'lucide-react';
import api from '../api';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [message, setMessage] = useState('');

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;
    setStatus('loading');
    try {
      await api.post('/api/newsletter/subscribe', { email });
      setStatus('success');
      setEmail('');
      setMessage('Successfully subscribed! Welcome to Beta.');
    } catch (err) {
      console.error(err);
      setStatus('error');
      setMessage(err.response?.data?.message || 'Subscription failed. Try again.');
    }
  };

  return (
    <footer className="custom-site-footer bg-[#E9F4FF] border-t border-slate-200 pt-16 pb-0 text-[#64748B]">
      <style>{`
        footer.custom-site-footer,
        footer.custom-site-footer p,
        footer.custom-site-footer span,
        footer.custom-site-footer div {
          color: #002D7A !important;
        }
        footer.custom-site-footer h4 {
          color: #0F172A !important;
        }
        footer.custom-site-footer a {
          color: #004AAD !important;
        }
        footer.custom-site-footer a:hover {
          color: #002D7A !important;
        }
        footer.custom-site-footer a.footer-product-link {
          color: #004AAD !important;
          text-decoration: none;
        }
        footer.custom-site-footer a.footer-product-link:hover {
          color: #002D7A !important;
        }
        footer.custom-site-footer .footer-product-desc {
          color: #004AAD !important;
          font-weight: 400;
          font-size: 0.75rem;
          display: block;
          margin-top: 0.125rem;
        }
        footer.custom-site-footer p.footer-brand-description {
          color: #000000 !important;
        }
        footer.custom-site-footer input {
          color: #0F172A !important;
        }
        footer.custom-site-footer .footer-bottom-bar,
        footer.custom-site-footer .footer-bottom-bar p,
        footer.custom-site-footer .footer-bottom-bar a,
        footer.custom-site-footer .footer-bottom-bar span {
          color: #ffffff !important;
        }
        footer.custom-site-footer .footer-bottom-bar a:hover {
          color: #cbd5e1 !important;
        }
      `}</style>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 mb-16">
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-4 flex flex-col items-center text-center">
            <Link to="/" className="flex items-center justify-center select-none">
              <img src="/logo.png" alt="Beta Logo" className="h-14 w-auto object-contain mx-auto" />
            </Link>
            <p className="text-sm footer-brand-description font-semibold">
              One platform for communication, security, and teamwork.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Products</h2>
            <ul className="space-y-3">
              <li>
                <a href="https://www.bnxmail.com/login" target="_blank" rel="noopener noreferrer" className="footer-product-link block">
                  <span className="font-bold block">BNX Mail</span>
                  <span className="footer-product-desc">WhatsApp-style collaborative email platform.</span>
                </a>
              </li>
              <li>
                <a href="https://www.b2auth.com/" target="_blank" rel="noopener noreferrer" className="footer-product-link block">
                  <span className="font-bold block">B2 Auth Security</span>
                  <span className="footer-product-desc">Unified authentication, SSO, and MFA gateway.</span>
                </a>
              </li>
              <li>
                <a href="https://cliks.beta-softnet.com/" target="_blank" rel="noopener noreferrer" className="footer-product-link block">
                  <span className="font-bold block">Cliks</span>
                  <span className="footer-product-desc">Personal productivity suite with notes & calendars.</span>
                </a>
              </li>
              <li>
                <a href="https://www.cliksbusiness.com/" target="_blank" rel="noopener noreferrer" className="footer-product-link block">
                  <span className="font-bold block">Cliks Business</span>
                  <span className="footer-product-desc">Agile team sprint workflow and collaboration.</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Company</h2>
            <ul className="space-y-2 text-sm font-medium">
              <li><Link to="/about" className="text-slate-600 hover:text-blue-600 transition">About</Link></li>
              <li><Link to="/careers" className="text-slate-600 hover:text-blue-600 transition">Careers</Link></li>
              <li><Link to="/partners" className="text-slate-600 hover:text-blue-600 transition">Partners</Link></li>
              <li><Link to="/support" className="text-slate-600 hover:text-blue-600 transition">Support</Link></li>
            </ul>
          </div>

          {/* Internships */}
          <div>
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Internships</h2>
            <ul className="space-y-2 text-sm font-medium">
              <li><Link to="/careers" className="text-slate-600 hover:text-blue-600 transition">Fullstack Development</Link></li>
              <li><Link to="/careers" className="text-slate-600 hover:text-blue-600 transition">App Development</Link></li>
              <li><Link to="/careers" className="text-slate-600 hover:text-blue-600 transition">AI&ML</Link></li>
              <li><Link to="/careers" className="text-slate-600 hover:text-blue-600 transition">Data Science</Link></li>
              <li><Link to="/careers" className="text-slate-600 hover:text-blue-600 transition">Data Analytics</Link></li>
            </ul>
          </div>

          {/* Contact Sales */}
          <div>
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Contact Sales</h2>
            <div className="text-xs space-y-2 font-medium">
              <p>Phone: <a href="tel:+919444369625" className="hover:underline block mt-0.5">+91 94443 69625</a></p>
              <p>Email: <a href="mailto:betasoftnet2025@gmail.com" className="hover:underline block mt-0.5 break-all">betasoftnet2025@gmail.com</a></p>
            </div>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Stay Updated</h2>
            <p className="text-sm text-slate-500 font-medium">
              Subscribe to get the latest product release notes and corporate insights.
            </p>
            <form onSubmit={handleSubscribe} className="flex relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full bg-white text-slate-900 placeholder-slate-400 border border-slate-200 rounded-lg py-2 px-3 pr-10 focus:outline-none focus:border-blue-500 text-sm transition"
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className="absolute right-1 top-1 bottom-1 px-2.5 bg-blue-600 hover:bg-blue-500 rounded-md text-white transition flex items-center justify-center disabled:bg-slate-200 disabled:text-slate-400"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
            {status === 'success' && (
              <div className="flex items-center space-x-1.5 text-xs text-emerald-600">
                <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
                <span>{message}</span>
              </div>
            )}
            {status === 'error' && (
              <div className="flex items-center space-x-1.5 text-xs text-rose-600">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span>{message}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="w-full bg-gradient-to-r from-[#0A3161] to-[#0F4DB8] border-t border-blue-800 py-6 px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between text-xs text-white font-medium footer-bottom-bar">
        <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row items-center justify-between px-4 sm:px-6 lg:px-8">
          <p>&copy; {new Date().getFullYear()} Beta Private Limited. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-slate-800 transition">Privacy Policy</a>
            <a href="#" className="hover:text-slate-800 transition">Terms of Service</a>
            <a href="#" className="hover:text-slate-800 transition">Security Disclosure</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
