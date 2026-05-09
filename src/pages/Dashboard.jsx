import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore, useReportStore } from '../store';
import api from '../lib/api';
import Navbar from '../components/Navbar';
import ScoreRing from '../components/ScoreRing';

export default function Dashboard() {
  const [url, setUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuthStore();
  const { reports, setReports, setJob, jobStatus, jobReportId, clearJob } = useReportStore();
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/reports').then(({ data }) => setReports(data)).catch(() => {});
  }, []);

  // Poll job status
  useEffect(() => {
    if (!jobReportId || jobStatus === 'completed' || jobStatus === 'failed') return;
    const interval = setInterval(async () => {
      try {
        const { data } = await api.get(`/analyze/${jobReportId}/status`);
        setJob(jobReportId, data.status);
        if (data.status === 'completed') {
          clearInterval(interval);
          api.get('/reports').then(({ data: r }) => setReports(r));
          navigate(`/report/${jobReportId}`);
        } else if (data.status === 'failed') {
          clearInterval(interval);
          setError('Analysis failed. Please try again.');
        }
      } catch { clearInterval(interval); }
    }, 3000);
    return () => clearInterval(interval);
  }, [jobReportId, jobStatus]);

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!url.trim()) return;
    setError('');
    setSubmitting(true);
    try {
      const { data } = await api.post('/analyze', { url: url.trim() });
      setJob(data.reportId, 'pending');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to start analysis');
    } finally {
      setSubmitting(false);
    }
  };

  const isAnalyzing = jobStatus === 'pending' || jobStatus === 'processing';

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    try {
      await api.delete(`/reports/${id}`);
      setReports(reports.filter((r) => r._id !== id));
    } catch {}
  };

  const handleDeleteAll = async () => {
    if (!window.confirm('Delete all analyses? This cannot be undone.')) return;
    try {
      await Promise.all(reports.map((r) => api.delete(`/reports/${r._id}`)));
      setReports([]);
    } catch {}
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-surface)' }}>
      <Navbar />
      <main className="max-w-5xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-white mb-2">Welcome back, {user?.name?.split(' ')[0]} 👋</h1>
          <p className="text-slate-400">Analyze any website and get AI-powered insights in under a minute.</p>
        </div>

        {/* URL Input */}
        <div className="p-6 rounded-2xl mb-8" style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)' }}>
          <form onSubmit={handleAnalyze} className="flex gap-3">
            <input
              type="text" value={url} onChange={(e) => setUrl(e.target.value)}
              placeholder="https://yourwebsite.com"
              disabled={isAnalyzing}
              className="flex-1 px-4 py-3 rounded-xl text-white text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-all disabled:opacity-50"
              style={{ background: 'var(--color-surface-3)', border: '1px solid var(--color-border)' }}
            />
            <button type="submit" disabled={submitting || isAnalyzing}
              className="px-6 py-3 rounded-xl font-semibold text-white text-sm transition-all hover:opacity-90 disabled:opacity-50 whitespace-nowrap"
              style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)' }}>
              {submitting ? 'Starting...' : 'Analyze →'}
            </button>
          </form>

          {error && <p className="text-red-400 text-sm mt-3">{error}</p>}

          {/* Analysis Progress */}
          <AnimatePresence>
            {isAnalyzing && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                className="mt-4 p-4 rounded-xl" style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)' }}>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full border-2 border-indigo-400 border-t-transparent animate-spin" />
                  <div>
                    <p className="text-indigo-300 text-sm font-medium">
                      {jobStatus === 'pending' ? 'Queued — starting analysis...' : 'Analyzing your website...'}
                    </p>
                    <p className="text-slate-500 text-xs mt-0.5">Crawling, running Lighthouse, and generating AI insights</p>
                  </div>
                </div>
                <div className="mt-3 h-1 rounded-full overflow-hidden" style={{ background: 'var(--color-border)' }}>
                  <motion.div className="h-full rounded-full bg-indigo-500"
                    animate={{ width: ['20%', '80%'] }} transition={{ duration: 45, ease: 'linear' }} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Reports History */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Recent Analyses</h2>
            {reports.length > 0 && (
              <button onClick={handleDeleteAll}
                className="text-xs text-red-400 hover:text-red-300 px-3 py-1.5 rounded-lg transition-colors"
                style={{ border: '1px solid rgba(239,68,68,0.2)', background: 'rgba(239,68,68,0.05)' }}>
                Delete All
              </button>
            )}
          </div>
          {reports.length === 0 ? (
            <div className="text-center py-16 text-slate-500">
              <div className="text-4xl mb-3">🔍</div>
              <p>No analyses yet. Enter a URL above to get started.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {reports.map((r) => (
                <motion.div key={r._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  onClick={() => r.status === 'completed' && navigate(`/report/${r._id}`)}
                  className="flex items-center justify-between p-4 rounded-xl transition-all"
                  style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)', cursor: r.status === 'completed' ? 'pointer' : 'default' }}
                  whileHover={r.status === 'completed' ? { borderColor: '#6366f1' } : {}}>
                  <div className="flex items-center gap-4 min-w-0">
                    <StatusBadge status={r.status} />
                    <div className="min-w-0">
                      <p className="text-white text-sm font-medium truncate">{r.url}</p>
                      <p className="text-slate-500 text-xs mt-0.5">{new Date(r.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    {r.status === 'completed' && r.aiAnalysis?.overallScore != null && (
                      <>
                        <ScorePill label="Overall" score={r.aiAnalysis.overallScore} />
                        <ScorePill label="SEO" score={r.aiAnalysis.seoScore} />
                        <span className="text-slate-500 text-sm">→</span>
                      </>
                    )}
                    <button
                      onClick={(e) => handleDelete(e, r._id)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-500 hover:text-red-400 transition-colors hover:bg-red-400/10"
                      title="Delete">
                      ✕
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function StatusBadge({ status }) {
  const map = {
    completed: { color: '#10b981', bg: 'rgba(16,185,129,0.1)', label: '✓' },
    processing: { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', label: '⟳' },
    pending: { color: '#6366f1', bg: 'rgba(99,102,241,0.1)', label: '…' },
    failed: { color: '#ef4444', bg: 'rgba(239,68,68,0.1)', label: '✕' },
  };
  const s = map[status] || map.pending;
  return (
    <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
      style={{ background: s.bg, color: s.color }}>
      {s.label}
    </div>
  );
}

function ScorePill({ label, score }) {
  const color = score >= 80 ? '#10b981' : score >= 60 ? '#f59e0b' : '#ef4444';
  return (
    <div className="text-center">
      <div className="text-sm font-bold" style={{ color }}>{score}</div>
      <div className="text-xs text-slate-500">{label}</div>
    </div>
  );
}
