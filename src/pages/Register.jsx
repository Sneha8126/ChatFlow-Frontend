import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, MessageCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

export default function Register() {
  const { register } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = 'Full name is required';
    if (!form.username.trim()) {
      next.username = 'Username is required';
    } else if (!/^[a-zA-Z0-9_]{3,20}$/.test(form.username.trim())) {
      next.username = '3-20 characters, letters/numbers/underscores only';
    }
    if (!form.email.trim()) {
      next.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) {
      next.email = 'Enter a valid email address';
    }
    if (!form.password) {
      next.password = 'Password is required';
    } else if (form.password.length < 6) {
      next.password = 'Must be at least 6 characters';
    }
    if (form.confirmPassword !== form.password) {
      next.confirmPassword = 'Passwords do not match';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await register(form);
      toast.success('Account created! Welcome to ChatFlow.');
      navigate('/chat', { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not create your account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { key: 'name', label: 'Full name', type: 'text', placeholder: 'Jane Doe', autoComplete: 'name' },
    { key: 'username', label: 'Username', type: 'text', placeholder: 'janedoe', autoComplete: 'username' },
    { key: 'email', label: 'Email', type: 'email', placeholder: 'you@example.com', autoComplete: 'email' },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-soft px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-primary-600 flex items-center justify-center mb-3">
            <MessageCircle className="w-6 h-6 text-white" strokeWidth={2.2} />
          </div>
          <h1 className="text-xl font-bold text-gray-900">ChatFlow</h1>
          <p className="text-sm text-gray-400 mt-1">Connect. Chat. Stay in sync.</p>
        </div>

        <div className="bg-white rounded-2xl shadow-card border border-surface-border p-7">
          <h2 className="text-lg font-semibold text-gray-900 mb-1">Create your account</h2>
          <p className="text-sm text-gray-400 mb-6">Join ChatFlow and start chatting in seconds.</p>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {fields.map((f) => (
              <div key={f.key}>
                <label className="text-xs font-medium text-gray-600 block mb-1.5">{f.label}</label>
                <input
                  type={f.type}
                  autoComplete={f.autoComplete}
                  value={form[f.key]}
                  onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                  placeholder={f.placeholder}
                  className={`w-full border rounded-xl px-3.5 py-2.5 text-sm transition-colors focus:outline-none ${
                    errors[f.key]
                      ? 'border-rose-300 focus:border-rose-400'
                      : 'border-surface-border focus:border-primary-400'
                  }`}
                />
                {errors[f.key] && <p className="text-xs text-rose-500 mt-1">{errors[f.key]}</p>}
              </div>
            ))}

            <div>
              <label className="text-xs font-medium text-gray-600 block mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="At least 6 characters"
                  className={`w-full border rounded-xl px-3.5 py-2.5 pr-10 text-sm transition-colors focus:outline-none ${
                    errors.password
                      ? 'border-rose-300 focus:border-rose-400'
                      : 'border-surface-border focus:border-primary-400'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-rose-500 mt-1">{errors.password}</p>}
            </div>

            <div>
              <label className="text-xs font-medium text-gray-600 block mb-1.5">Confirm password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                value={form.confirmPassword}
                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                placeholder="Re-enter your password"
                className={`w-full border rounded-xl px-3.5 py-2.5 text-sm transition-colors focus:outline-none ${
                  errors.confirmPassword
                    ? 'border-rose-300 focus:border-rose-400'
                    : 'border-surface-border focus:border-primary-400'
                }`}
              />
              {errors.confirmPassword && <p className="text-xs text-rose-500 mt-1">{errors.confirmPassword}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-xl py-2.5 transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              Create account
            </button>
          </form>

          <p className="text-sm text-gray-500 text-center mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 font-medium hover:text-primary-700">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
