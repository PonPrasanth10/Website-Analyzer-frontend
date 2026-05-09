import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store';
import api from '../lib/api';

export default function Auth({ mode = 'login' }) {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuthStore();
  const navigate = useNavigate();
  const isRegister = mode === 'register';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const endpoint = isRegister ? '/auth/register' : '/auth/login';
      const payload = isRegister ? form : { email: form.email, password: form.password };
      const { data } = await api.post(endpoint, payload);
      login(data.user, data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--color-surface)' }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md p-8 rounded-2xl"
        style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)' }}>

        <Link to="/" className="flex items-center gap-2 mb-8">
          <div className="w-7 h-7 rounded-lg bg-indigo-500 flex items-center justify-center text-white font-bold text-xs">V</div>
          <span className="font-semibold text-white text-sm">VisionAudit AI</span>
        </Link>

        <h1 className="text-2xl font-bold text-white mb-1">
          {isRegister ? 'Create your account' : 'Welcome back'}
        </h1>
        <p className="text-slate-400 text-sm mb-8">
          {isRegister ? 'Start auditing websites for free' : 'Sign in to your dashboard'}
        </p>

        {error && (
          <div className="mb-4 p-3 rounded-lg text-sm text-red-400" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div>
              <label className="block text-sm text-slate-400 mb-1.5">Full Name</label>
              <input
                type="text" required placeholder="John Doe"
                value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg text-sm text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                style={{ background: 'var(--color-surface-3)', border: '1px solid var(--color-border)' }}
              />
            </div>
          )}
          <div>
            <label className="block text-sm text-slate-400 mb-1.5">Email</label>
            <input
              type="email" required placeholder="you@example.com"
              value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg text-sm text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              style={{ background: 'var(--color-surface-3)', border: '1px solid var(--color-border)' }}
            />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1.5">Password</label>
            <input
              type="password" required placeholder="••••••••" minLength={6}
              value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg text-sm text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              style={{ background: 'var(--color-surface-3)', border: '1px solid var(--color-border)' }}
            />
          </div>
          <button type="submit" disabled={loading}
            className="w-full py-3 rounded-lg font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50 mt-2"
            style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)' }}>
            {loading ? 'Please wait...' : isRegister ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 mt-6">
          {isRegister ? 'Already have an account? ' : "Don't have an account? "}
          <Link to={isRegister ? '/login' : '/register'} className="text-indigo-400 hover:text-indigo-300">
            {isRegister ? 'Sign in' : 'Sign up free'}
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
