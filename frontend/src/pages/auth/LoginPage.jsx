import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Lock, Mail, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loading } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
      if (res.user.role === 'ADMIN') navigate('/admin');
      else navigate(from, { replace: true });
    } else toast.error(res.message);
  };

  return (
    <main className="min-h-[80vh] flex items-center justify-center px-4 py-12 sm:px-6">
      <section className="ui-card w-full max-w-md p-6 sm:p-8">
        <header className="mb-8">
          <img src="/logo.jpg" alt="LHQ Bangladesh" className="mb-6 h-12 w-12 rounded-lg border border-line object-cover" />
          <p className="ui-kicker mb-3"><span className="ui-mark" /> Customer account</p>
          <h1 className="text-2xl text-ink">Sign in to LHQ Bangladesh</h1>
          <p className="mt-2 text-sm leading-6 text-muted">Access your orders, saved addresses, and profile</p>
        </header>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="ui-label">Email address</label>
            <div className="relative">
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="name@example.com" className="ui-input pl-10" />
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            </div>
          </div>
          <div>
            <label className="ui-label">Password</label>
            <div className="relative">
              <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••" className="ui-input pl-10 pr-11" />
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted transition-colors hover:text-ink" aria-label={showPassword ? 'Hide password' : 'Show password'}>
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <button type="submit" disabled={loading} className="ui-btn ui-btn-accent ui-btn-lg w-full">
            {loading ? 'Authenticating...' : 'Sign in'}{!loading && <ArrowRight className="h-4 w-4" />}
          </button>
        </form>
        <div className="mt-6 border-t border-line pt-5 text-sm text-muted">
          <p>Don’t have an account? <Link to="/register" className="font-medium text-ember hover:underline">Register now</Link></p>
        </div>
        <aside className="mt-6 rounded-lg border border-line bg-raised p-4 text-xs leading-5 text-ink-soft">
          <p className="mb-1 font-medium text-ink">Demo accounts</p>
          <p><strong>Admin:</strong> admin@gadgetzone.com / Admin@123456</p>
          <p><strong>Customer:</strong> customer@example.com / Customer@123</p>
        </aside>
      </section>
    </main>
  );
}
