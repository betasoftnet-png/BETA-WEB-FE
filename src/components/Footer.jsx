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
      setMessage('Successfully subscribed! Welcome to Beta Softnet.');
    } catch (err) {
      console.error(err);
      setStatus('error');
      setMessage(err.response?.data?.message || 'Subscription failed. Try again.');
    }
  };

  return (
    <footer className="custom-site-footer bg-[#E9F4FF] border-t border-slate-200 pt-16 pb-8 text-[#64748B]">
      <style>{`
        footer.custom-site-footer,
        footer.custom-site-footer p,
        footer.custom-site-footer span,
        footer.custom-site-footer div {
          color: #64748B !important;
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
        footer.custom-site-footer p.footer-brand-description {
          color: #000000 !important;
        }
        footer.custom-site-footer input {
          color: #0F172A !important;
        }
      `}</style>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-4 flex flex-col items-center text-center">
            <Link to="/" className="flex items-center justify-center select-none">
              <img src="/logo.png" alt="Beta Logo" className="h-14 w-auto object-contain mx-auto" />
            </Link>
            <p className="text-sm footer-brand-description font-semibold">
              Unified Software for a Connected Generation. Building next-generation collaboration, auth, and productivity suites.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Products</h4>
            <ul className="space-y-2 text-sm font-medium">
              <li><Link to="/products" className="text-slate-600 hover:text-blue-600 transition">BNX Mail</Link></li>
              <li><Link to="/products" className="text-slate-600 hover:text-blue-600 transition">B2 Auth Security</Link></li>
              <li><Link to="/products" className="text-slate-600 hover:text-blue-600 transition">Cliks Personal</Link></li>
              <li><Link to="/products#cliks-business" className="text-slate-600 hover:text-blue-600 transition">Cliks Business</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Company</h4>
            <ul className="space-y-2 text-sm font-medium">
              <li><Link to="/about" className="text-slate-600 hover:text-blue-600 transition">About Us</Link></li>
              <li><Link to="/careers" className="text-slate-600 hover:text-blue-600 transition">Careers</Link></li>
              <li><Link to="/partners" className="text-slate-600 hover:text-blue-600 transition">Partners</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Stay Updated</h4>
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

        {/* Bottom Bar */}
        <div className="border-t border-slate-200 pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 font-medium">
          <p>&copy; {new Date().getFullYear()} Beta Softnet Private Limited. All rights reserved.</p>
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
