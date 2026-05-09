import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const features = [
  { icon: '🎨', title: 'UI/UX Analysis', desc: 'AI scores your layout, typography, spacing, and visual hierarchy.' },
  { icon: '🔍', title: 'SEO Audit', desc: 'Missing meta tags, heading structure, alt texts, and keyword gaps.' },
  { icon: '⚡', title: 'Performance', desc: 'Lighthouse-powered Core Web Vitals with AI explanations.' },
  { icon: '♿', title: 'Accessibility', desc: 'WCAG violations, contrast issues, and ARIA label gaps.' },
  { icon: '💰', title: 'Conversion Optimizer', desc: 'Better CTAs, landing page structure, and copy improvements.' },
  { icon: '📱', title: 'Mobile Readiness', desc: 'Viewport, responsive design, and mobile UX assessment.' },
];

const stats = [
  { value: '10+', label: 'Metrics Analyzed' },
  { value: 'AI', label: 'Powered Insights' },
  { value: '60s', label: 'Full Audit Time' },
];

export default function Landing() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--color-surface)' }}>
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-5 border-b" style={{ borderColor: 'var(--color-border)' }}>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center text-white font-bold text-sm">V</div>
          <span className="font-semibold text-white">VisionAudit AI</span>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/login" className="text-sm text-slate-400 hover:text-white transition-colors px-4 py-2">Sign in</Link>
          <Link to="/register" className="text-sm bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg transition-colors font-medium">
            Get Started Free
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-8 pt-24 pb-16 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-6"
            style={{ background: 'rgba(99,102,241,0.15)', color: '#818cf8', border: '1px solid rgba(99,102,241,0.3)' }}>
            ✨ Powered by Gemini AI
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight mb-6">
            Your website deserves<br />
            <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(135deg, #6366f1, #a78bfa)' }}>
              a smarter audit
            </span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Paste any URL. Get AI-powered insights on UX, SEO, performance, accessibility, and conversion — not just scores, but <em className="text-slate-300">actionable recommendations</em>.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link to="/register"
              className="px-8 py-3.5 rounded-xl font-semibold text-white transition-all hover:scale-105"
              style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)', boxShadow: '0 0 30px rgba(99,102,241,0.4)' }}>
              Analyze Your Website →
            </Link>
            <Link to="/login" className="px-8 py-3.5 rounded-xl font-medium text-slate-300 hover:text-white transition-colors"
              style={{ border: '1px solid var(--color-border)' }}>
              Sign In
            </Link>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
          className="flex items-center justify-center gap-12 mt-16">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-3xl font-bold text-white">{s.value}</div>
              <div className="text-sm text-slate-500 mt-1">{s.label}</div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-8 py-16">
        <h2 className="text-2xl font-bold text-white text-center mb-12">Everything you need to improve your website</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f, i) => (
            <motion.div key={f.title}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
              className="p-6 rounded-2xl"
              style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)' }}>
              <div className="text-2xl mb-3">{f.icon}</div>
              <h3 className="font-semibold text-white mb-2">{f.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-2xl mx-auto px-8 py-16 text-center">
        <div className="p-10 rounded-3xl" style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)' }}>
          <h2 className="text-3xl font-bold text-white mb-4">Ready to audit your website?</h2>
          <p className="text-slate-400 mb-8">Free to start. No credit card required.</p>
          <Link to="/register"
            className="inline-block px-8 py-3.5 rounded-xl font-semibold text-white transition-all hover:scale-105"
            style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)', boxShadow: '0 0 30px rgba(99,102,241,0.3)' }}>
            Start Free Audit →
          </Link>
        </div>
      </section>

      <footer className="text-center py-8 text-slate-600 text-sm border-t" style={{ borderColor: 'var(--color-border)' }}>
        © 2025 VisionAudit AI
      </footer>
    </div>
  );
}
