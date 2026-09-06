import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, MessageCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

export default function Login() {
  const { login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({ identifier: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const next = {};
    if (!form.identifier.trim()) next.identifier = 'Email or username is required';
    if (!form.password) next.password = 'Password is required';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await login(form.identifier.trim(), form.password);
      toast.success('Welcome back!');
      const redirectTo = location.state?.from?.pathname || '/chat';
      navigate(redirectTo, { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-shell flex items-center justify-center">
      <div className="auth-wrap">
        <div className="flex flex-col items-center mb-8">
          <div className="auth-brand-icon w-12 h-12 rounded-xl bg-primary-600 flex items-center justify-center mb-3">
            <MessageCircle className="w-6 h-6 text-white" strokeWidth={2.2} />
          </div>
          <h1 className="auth-brand-name text-xl font-bold text-gray-900">ChatFlow</h1>
          <p className="text-sm text-gray-400 mt-1">Connect. Chat. Stay in sync.</p>
        </div>

        <div className="auth-card bg-white rounded-2xl shadow-card border border-surface-border p-7">
          <h2 className="text-lg font-semibold text-gray-900 mb-1">Welcome back</h2>
          <p className="text-sm text-gray-400 mb-6">Log in to continue to your conversations.</p>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label className="text-xs font-medium text-gray-600 block mb-1.5">Email or username</label>
              <input
                type="text"
                autoComplete="username"
                value={form.identifier}
                onChange={(e) => setForm({ ...form, identifier: e.target.value })}
                placeholder="you@example.com"
                className={`auth-input w-full border rounded-xl px-3.5 py-2.5 text-sm transition-colors focus:outline-none ${
                  errors.identifier
                    ? 'border-rose-300 focus:border-rose-400'
                    : 'border-surface-border'
                }`}
              />
              {errors.identifier && <p className="text-xs text-rose-500 mt-1">{errors.identifier}</p>}
            </div>

            <div>
              <label className="text-xs font-medium text-gray-600 block mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••"
                  className={`auth-input w-full border rounded-xl px-3.5 py-2.5 pr-10 text-sm transition-colors focus:outline-none ${
                    errors.password
                      ? 'border-rose-300 focus:border-rose-400'
                      : 'border-surface-border'
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

            <button
              type="submit"
              disabled={loading}
              className="auth-submit w-full text-white text-sm font-medium rounded-xl py-2.5 transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              Log in
            </button>
          </form>

          <p className="text-sm text-gray-500 text-center mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary-600 font-medium hover:text-primary-700">
              Sign up
            </Link>
          </p>
        </div>

        <p className="text-xs text-gray-400 text-center mt-6">
          Demo: try <span className="font-medium">rahul@chatflow.demo</span> / password123 (after running the seed script)
        </p>
      </div>
    </div>
  );
}
