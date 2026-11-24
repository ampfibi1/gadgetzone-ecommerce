import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Lock, Mail, ArrowRight } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loading } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter your email and password');
      return;
    }

    const res = await login(email, password);
    if (res.success) {
      toast.success(`Welcome back, ${res.user.name}!`);
      if (res.user.role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate(from, { replace: true });
      }
    } else {
      toast.error(res.message);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-xl border border-slate-200/90 p-6 sm:p-8 shadow-xs">
        <div className="text-center mb-6">
          <img src="/logo.jpg" alt="LHQ Bangladesh" className="w-12 h-12 mx-auto mb-3 rounded-lg object-cover border border-slate-200" />
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Sign in to LHQ Bangladesh</h1>
          <p className="text-xs text-slate-500 mt-1">
            Access your orders, saved addresses, and profile
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Email address
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="name@example.com"
                className="w-full pl-9 pr-3.5 py-2 rounded-lg border border-slate-200 text-xs sm:text-sm focus:ring-1 focus:ring-sky-500 focus:outline-hidden"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full pl-9 pr-3.5 py-2 rounded-lg border border-slate-200 text-xs sm:text-sm focus:ring-1 focus:ring-sky-500 focus:outline-hidden"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-sky-600 hover:bg-sky-500 disabled:bg-slate-200 disabled:text-slate-400 text-white font-medium rounded-lg text-xs sm:text-sm transition-colors flex items-center justify-center gap-1.5"
          >
            {loading ? 'Authenticating...' : 'Sign in'}
            {!loading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        <div className="mt-5 pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
          <p>
            Don't have an account?{' '}
            <Link to="/register" className="font-medium text-sky-600 hover:underline">
              Register now
            </Link>
          </p>
        </div>

        {/* Demo Credentials Box */}
        <div className="mt-5 p-3 bg-slate-50 border border-slate-200 rounded-lg text-[11px] text-slate-600 space-y-1">
          <p className="font-semibold text-slate-800">Demo accounts:</p>
          <p><strong>Admin:</strong> admin@gadgetzone.com / Admin@123456</p>
          <p><strong>Customer:</strong> customer@example.com / Customer@123</p>
        </div>
      </div>
    </div>
  );
}
