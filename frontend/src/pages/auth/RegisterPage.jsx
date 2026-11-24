import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Phone, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register, loading } = useAuthStore();
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    const res = await register(formData.name, formData.email, formData.password, formData.phone);
    if (res.success) {
      toast.success('Registration successful! Welcome to LHQ Bangladesh.');
      navigate('/');
    } else toast.error(res.message);
  };

  const fields = [
    { name: 'name', label: 'Full name', type: 'text', placeholder: 'e.g. Rahim Ahmed', Icon: User, required: true },
    { name: 'email', label: 'Email address', type: 'email', placeholder: 'name@example.com', Icon: Mail, required: true },
    { name: 'phone', label: 'Phone number', type: 'tel', placeholder: '01712345678', Icon: Phone },
  ];
  const passwordField = (name, label, shown, toggle) => (
    <div>
      <label className="ui-label">{label}</label>
      <div className="relative">
        <input type={shown ? 'text' : 'password'} name={name} value={formData[name]} onChange={handleChange} required placeholder="••••••••" className="ui-input pl-10 pr-11" />
        <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
        <button type="button" onClick={toggle} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted transition-colors hover:text-ink" aria-label={shown ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`}>
          {shown ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );

  return (
    <main className="min-h-[85vh] flex items-center justify-center px-4 py-12 sm:px-6">
      <section className="ui-card w-full max-w-lg p-6 sm:p-8">
        <header className="mb-8">
          <img src="/logo.jpg" alt="LHQ Bangladesh" className="mb-6 h-12 w-12 rounded-lg border border-line object-cover" />
          <p className="ui-kicker mb-3"><span className="ui-mark" /> Customer account</p>
          <h1 className="text-2xl text-ink">Create customer account</h1>
          <p className="mt-2 text-sm leading-6 text-muted">Join LHQ Bangladesh for faster checkouts and order history</p>
        </header>
        <form onSubmit={handleSubmit} className="space-y-5">
          {fields.map(({ name, label, type, placeholder, Icon, required }) => (
            <div key={name}>
              <label className="ui-label">{label}</label>
              <div className="relative">
                <input type={type} name={name} value={formData[name]} onChange={handleChange} required={required} placeholder={placeholder} className="ui-input pl-10" />
                <Icon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
              </div>
            </div>
          ))}
          {passwordField('password', 'Password (min. 6 characters)', showPassword, () => setShowPassword(!showPassword))}
          {passwordField('confirmPassword', 'Confirm password', showConfirmPassword, () => setShowConfirmPassword(!showConfirmPassword))}
          <button type="submit" disabled={loading} className="ui-btn ui-btn-accent ui-btn-lg w-full">
            {loading ? 'Creating account...' : 'Complete registration'}{!loading && <ArrowRight className="h-4 w-4" />}
          </button>
        </form>
        <div className="mt-6 border-t border-line pt-5 text-sm text-muted">
          <p>Already have an account? <Link to="/login" className="font-medium text-ember hover:underline">Sign in</Link></p>
        </div>
      </section>
    </main>
  );
}
