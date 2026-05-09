import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { RadialBarChart, RadialBar, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import api from '../lib/api';
import Navbar from '../components/Navbar';

const TABS = ['Overview', 'AI Insights', 'SEO', 'Performance', 'Conversion', 'Redesign'];

export default function Report() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Overview');

  useEffect(() => {
    api.get(`/reports/${id}`)
      .then(({ data }) => setReport(data))
      .catch(() => navigate('/dashboard'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <LoadingScreen />;
  if (!report) return null;

  const ai = report.aiAnalysis || {};
  const lh = report.lighthouse || {};

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-surface)' }}>
      <Navbar />
      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
          <div>
            <button onClick={() => navigate('/dashboard')} className="text-slate-500 hover:text-white text-sm mb-2 flex items-center gap-1 transition-colors">
              ← Dashboard
            </button>
            <h1 className="text-2xl font-bold text-white truncate max-w-xl">{report.url}</h1>
            <p className="text-slate-500 text-sm mt-1">{new Date(report.createdAt).toLocaleString()}</p>
          </div>
          {ai.overallScore != null && (
            <div className="text-center p-4 rounded-2xl" style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)' }}>
              <div className="text-4xl font-bold" style={{ color: scoreColor(ai.overallScore) }}>{ai.overallScore}</div>
              <div className="text-xs text-slate-500 mt-1">Overall Score</div>
            </div>
          )}
        </div>

        {/* Executive Summary */}
        {ai.executiveSummary && (
          <div className="p-5 rounded-2xl mb-6" style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)' }}>
            <p className="text-slate-300 leading-relaxed">💡 {ai.executiveSummary}</p>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 mb-6 p-1 rounded-xl w-fit" style={{ background: 'var(--color-surface-2)' }}>
          {TABS.map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
              style={activeTab === tab
                ? { background: '#6366f1', color: 'white' }
                : { color: '#94a3b8' }}>
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <motion.div key={activeTab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
          {activeTab === 'Overview' && <OverviewTab ai={ai} lh={lh} screenshot={report.screenshot} crawl={report.crawlData} />}
          {activeTab === 'AI Insights' && <InsightsTab ai={ai} />}
          {activeTab === 'SEO' && <SEOTab ai={ai} crawl={report.crawlData} lh={lh} />}
          {activeTab === 'Performance' && <PerformanceTab lh={lh} />}
          {activeTab === 'Conversion' && <ConversionTab ai={ai} />}
          {activeTab === 'Redesign' && <RedesignTab ai={ai} />}
        </motion.div>
      </main>
    </div>
  );
}

// ── Overview Tab ──────────────────────────────────────────────────────────────
function OverviewTab({ ai, lh, screenshot, crawl }) {
  const scores = [
    { name: 'UI', value: ai.uiScore || 0, fill: '#6366f1' },
    { name: 'UX', value: ai.uxScore || 0, fill: '#8b5cf6' },
    { name: 'SEO', value: ai.seoScore || 0, fill: '#06b6d4' },
    { name: 'Conversion', value: ai.conversionScore || 0, fill: '#10b981' },
    { name: 'Accessibility', value: ai.accessibilityScore || 0, fill: '#f59e0b' },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Score Cards */}
      <div className="p-6 rounded-2xl" style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)' }}>
        <h3 className="font-semibold text-white mb-4">AI Score Breakdown</h3>
        <div className="space-y-3">
          {scores.map((s) => (
            <div key={s.name} className="flex items-center gap-3">
              <span className="text-slate-400 text-sm w-24">{s.name}</span>
              <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'var(--color-border)' }}>
                <motion.div className="h-full rounded-full" style={{ background: s.fill }}
                  initial={{ width: 0 }} animate={{ width: `${s.value}%` }} transition={{ duration: 0.8, delay: 0.1 }} />
              </div>
              <span className="text-sm font-semibold w-8 text-right" style={{ color: s.fill }}>{s.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Lighthouse Scores */}
      {lh.performance != null && (
        <div className="p-6 rounded-2xl" style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)' }}>
          <h3 className="font-semibold text-white mb-4">Lighthouse Scores</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Performance', value: lh.performance },
              { label: 'Accessibility', value: lh.accessibility },
              { label: 'Best Practices', value: lh.bestPractices },
              { label: 'SEO', value: lh.seo },
            ].map((s) => (
              <div key={s.label} className="p-3 rounded-xl text-center" style={{ background: 'var(--color-surface-3)' }}>
                <div className="text-2xl font-bold" style={{ color: scoreColor(s.value) }}>{s.value}</div>
                <div className="text-xs text-slate-500 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Screenshot */}
      {screenshot && (
        <div className="p-6 rounded-2xl lg:col-span-2" style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)' }}>
          <h3 className="font-semibold text-white mb-4">Website Screenshot</h3>
          <img src={`data:image/png;base64,${screenshot}`} alt="Website screenshot"
            className="w-full rounded-xl border" style={{ borderColor: 'var(--color-border)', maxHeight: '400px', objectFit: 'cover', objectPosition: 'top' }} />
        </div>
      )}

      {/* Crawl Stats */}
      {crawl && (
        <div className="p-6 rounded-2xl lg:col-span-2" style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)' }}>
          <h3 className="font-semibold text-white mb-4">Page Stats</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Stat label="Word Count" value={crawl.wordCount?.toLocaleString()} />
            <Stat label="Images" value={crawl.images?.total} sub={`${crawl.images?.missingAlt} missing alt`} />
            <Stat label="Internal Links" value={crawl.links?.internal} />
            <Stat label="External Links" value={crawl.links?.external} />
          </div>
        </div>
      )}
    </div>
  );
}

// ── AI Insights Tab ───────────────────────────────────────────────────────────
function InsightsTab({ ai }) {
  return (
    <div className="space-y-6">
      {ai.highPriorityIssues?.length > 0 && (
        <IssueSection title="🔴 High Priority Issues" issues={ai.highPriorityIssues} color="#ef4444" bg="rgba(239,68,68,0.08)" border="rgba(239,68,68,0.2)" />
      )}
      {ai.mediumPriorityIssues?.length > 0 && (
        <IssueSection title="🟡 Medium Priority Issues" issues={ai.mediumPriorityIssues} color="#f59e0b" bg="rgba(245,158,11,0.08)" border="rgba(245,158,11,0.2)" />
      )}
      {ai.quickWins?.length > 0 && (
        <div className="p-6 rounded-2xl" style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)' }}>
          <h3 className="font-semibold text-white mb-4">⚡ Quick Wins (under 1 hour)</h3>
          <ul className="space-y-2">
            {ai.quickWins.map((w, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                <span className="text-emerald-400 mt-0.5">✓</span> {w}
              </li>
            ))}
          </ul>
        </div>
      )}
      {ai.roadmap?.length > 0 && (
        <div className="p-6 rounded-2xl" style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)' }}>
          <h3 className="font-semibold text-white mb-4">🗺️ Improvement Roadmap</h3>
          <div className="space-y-4">
            {ai.roadmap.map((phase, i) => (
              <div key={i} className="flex gap-4">
                <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center text-white text-xs font-bold shrink-0 mt-0.5">{i + 1}</div>
                <div>
                  <p className="font-medium text-white text-sm">{phase.phase}</p>
                  <ul className="mt-1 space-y-1">
                    {phase.actions?.map((a, j) => (
                      <li key={j} className="text-sm text-slate-400">• {a}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── SEO Tab ───────────────────────────────────────────────────────────────────
function SEOTab({ ai, crawl, lh }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InfoCard title="Current Meta Title" content={crawl?.title} note={`${crawl?.title?.length || 0} chars (ideal: 50-60)`} />
        <InfoCard title="Current Meta Description" content={crawl?.description || 'Missing'} note={`${crawl?.description?.length || 0} chars (ideal: 150-160)`} warn={!crawl?.description} />
      </div>
      {ai.seoRecommendations && (
        <div className="p-6 rounded-2xl" style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)' }}>
          <h3 className="font-semibold text-white mb-4">✨ AI-Suggested Improvements</h3>
          <div className="space-y-4">
            {ai.seoRecommendations.suggestedTitle && (
              <Suggestion label="Optimized Title" value={ai.seoRecommendations.suggestedTitle} />
            )}
            {ai.seoRecommendations.suggestedDescription && (
              <Suggestion label="Optimized Description" value={ai.seoRecommendations.suggestedDescription} />
            )}
          </div>
        </div>
      )}
      {crawl?.h1?.length > 0 && (
        <div className="p-6 rounded-2xl" style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)' }}>
          <h3 className="font-semibold text-white mb-3">Heading Structure</h3>
          <div className="space-y-2">
            {crawl.h1.map((h, i) => <HeadingTag key={i} level="H1" text={h} />)}
            {crawl.h2?.slice(0, 4).map((h, i) => <HeadingTag key={i} level="H2" text={h} />)}
          </div>
        </div>
      )}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Stat label="Images w/o Alt" value={crawl?.images?.missingAlt} warn={crawl?.images?.missingAlt > 0} />
        <Stat label="Lighthouse SEO" value={lh?.seo ? `${lh.seo}/100` : 'N/A'} />
        <Stat label="Has Canonical" value={crawl?.canonicalUrl ? 'Yes' : 'No'} warn={!crawl?.canonicalUrl} />
        <Stat label="Structured Data" value={crawl?.structuredData ? 'Yes' : 'No'} />
      </div>
    </div>
  );
}

// ── Performance Tab ───────────────────────────────────────────────────────────
function PerformanceTab({ lh }) {
  if (!lh?.performance) return <EmptyState message="Lighthouse data unavailable for this report." />;

  const metrics = [
    { name: 'LCP', value: (lh.metrics?.lcp / 1000).toFixed(2), unit: 's', good: 2.5, desc: 'Largest Contentful Paint' },
    { name: 'FCP', value: (lh.metrics?.fcp / 1000).toFixed(2), unit: 's', good: 1.8, desc: 'First Contentful Paint' },
    { name: 'CLS', value: lh.metrics?.cls?.toFixed(3), unit: '', good: 0.1, desc: 'Cumulative Layout Shift' },
    { name: 'TTFB', value: (lh.metrics?.ttfb / 1000).toFixed(2), unit: 's', good: 0.8, desc: 'Time to First Byte' },
    { name: 'Speed Index', value: (lh.metrics?.speedIndex / 1000).toFixed(2), unit: 's', good: 3.4, desc: 'Speed Index' },
  ];

  const chartData = [
    { name: 'Performance', score: lh.performance },
    { name: 'Accessibility', score: lh.accessibility },
    { name: 'Best Practices', score: lh.bestPractices },
    { name: 'SEO', score: lh.seo },
  ];

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-2xl" style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)' }}>
        <h3 className="font-semibold text-white mb-4">Lighthouse Scores</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={chartData} barSize={40}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2a2a45" />
            <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis domain={[0, 100]} tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: '#16162a', border: '1px solid #2a2a45', borderRadius: 8, color: '#e2e8f0' }} />
            <Bar dataKey="score" fill="#6366f1" radius={[4, 4, 0, 0]}
              label={{ position: 'top', fill: '#94a3b8', fontSize: 11 }} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {metrics.map((m) => {
          const val = parseFloat(m.value);
          const isGood = val <= m.good;
          return (
            <div key={m.name} className="p-4 rounded-xl" style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)' }}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-slate-500">{m.desc}</span>
                <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: isGood ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', color: isGood ? '#10b981' : '#ef4444' }}>
                  {isGood ? 'Good' : 'Needs Work'}
                </span>
              </div>
              <div className="text-2xl font-bold text-white">{m.value}<span className="text-sm text-slate-500 ml-1">{m.unit}</span></div>
              <div className="text-xs text-slate-500 mt-1">Target: ≤ {m.good}{m.unit}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Conversion Tab ────────────────────────────────────────────────────────────
function ConversionTab({ ai }) {
  return (
    <div className="space-y-6">
      {ai.conversionTips?.length > 0 ? (
        <div className="space-y-4">
          <h3 className="font-semibold text-white">CTA & Copy Improvements</h3>
          {ai.conversionTips.map((tip, i) => (
            <div key={i} className="p-5 rounded-2xl" style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)' }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                <div className="p-3 rounded-lg" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)' }}>
                  <p className="text-xs text-red-400 mb-1 font-medium">Current</p>
                  <p className="text-slate-300 text-sm">{tip.original}</p>
                </div>
                <div className="p-3 rounded-lg" style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.15)' }}>
                  <p className="text-xs text-emerald-400 mb-1 font-medium">Improved</p>
                  <p className="text-slate-300 text-sm">{tip.improved}</p>
                </div>
              </div>
              <p className="text-xs text-slate-500">💡 {tip.reason}</p>
            </div>
          ))}
        </div>
      ) : <EmptyState message="No conversion tips available." />}
    </div>
  );
}

// ── Redesign Tab ──────────────────────────────────────────────────────────────
function RedesignTab({ ai }) {
  const vision = ai.visionAnalysis;
  return (
    <div className="space-y-6">
      {vision && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ScoreCard label="Visual Appeal" score={vision.visualAppealScore} />
          <ScoreCard label="Design Modernity" score={vision.designModernityScore} />
          <ScoreCard label="Branding" score={vision.brandingConsistencyScore} />
        </div>
      )}
      {vision?.colorPaletteAssessment && (
        <InfoCard title="🎨 Color Palette" content={vision.colorPaletteAssessment} />
      )}
      {vision?.typographyAssessment && (
        <InfoCard title="✍️ Typography" content={vision.typographyAssessment} />
      )}
      {vision?.layoutAssessment && (
        <InfoCard title="📐 Layout & Hierarchy" content={vision.layoutAssessment} />
      )}
      {ai.redesignSuggestions?.length > 0 && (
        <div className="p-6 rounded-2xl" style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)' }}>
          <h3 className="font-semibold text-white mb-4">Redesign Recommendations</h3>
          <ul className="space-y-2">
            {ai.redesignSuggestions.map((s, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                <span className="text-indigo-400 mt-0.5">→</span> {s}
              </li>
            ))}
          </ul>
        </div>
      )}
      {vision?.modernizationTips?.length > 0 && (
        <div className="p-6 rounded-2xl" style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)' }}>
          <h3 className="font-semibold text-white mb-4">✨ Modernization Tips</h3>
          <ul className="space-y-2">
            {vision.modernizationTips.map((t, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                <span className="text-purple-400 mt-0.5">✦</span> {t}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// ── Shared Components ─────────────────────────────────────────────────────────
function IssueSection({ title, issues, color, bg, border }) {
  return (
    <div className="p-6 rounded-2xl" style={{ background: bg, border: `1px solid ${border}` }}>
      <h3 className="font-semibold text-white mb-4">{title}</h3>
      <div className="space-y-3">
        {issues.map((issue, i) => (
          <div key={i} className="p-4 rounded-xl" style={{ background: 'var(--color-surface-2)' }}>
            <p className="font-medium text-sm" style={{ color }}>{issue.title}</p>
            <p className="text-slate-400 text-sm mt-1">{issue.description}</p>
            {issue.impact && <p className="text-xs text-slate-500 mt-1.5">Impact: {issue.impact}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}

function InfoCard({ title, content, note, warn }) {
  return (
    <div className="p-5 rounded-2xl" style={{ background: 'var(--color-surface-2)', border: `1px solid ${warn ? 'rgba(239,68,68,0.3)' : 'var(--color-border)'}` }}>
      <p className="text-xs text-slate-500 mb-2">{title}</p>
      <p className="text-slate-200 text-sm">{content || '—'}</p>
      {note && <p className="text-xs text-slate-500 mt-2">{note}</p>}
    </div>
  );
}

function Suggestion({ label, value }) {
  return (
    <div>
      <p className="text-xs text-slate-500 mb-1">{label}</p>
      <p className="text-sm text-emerald-300 p-3 rounded-lg" style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.15)' }}>{value}</p>
    </div>
  );
}

function HeadingTag({ level, text }) {
  const colors = { H1: '#6366f1', H2: '#8b5cf6', H3: '#a78bfa' };
  return (
    <div className="flex items-start gap-2">
      <span className="text-xs font-mono px-1.5 py-0.5 rounded shrink-0 mt-0.5" style={{ background: 'var(--color-surface-3)', color: colors[level] }}>{level}</span>
      <span className="text-sm text-slate-300">{text}</span>
    </div>
  );
}

function Stat({ label, value, sub, warn }) {
  return (
    <div className="p-4 rounded-xl text-center" style={{ background: 'var(--color-surface-2)', border: `1px solid ${warn ? 'rgba(239,68,68,0.3)' : 'var(--color-border)'}` }}>
      <div className="text-xl font-bold" style={{ color: warn ? '#ef4444' : 'white' }}>{value ?? '—'}</div>
      <div className="text-xs text-slate-500 mt-1">{label}</div>
      {sub && <div className="text-xs mt-0.5" style={{ color: warn ? '#ef4444' : '#64748b' }}>{sub}</div>}
    </div>
  );
}

function ScoreCard({ label, score }) {
  return (
    <div className="p-5 rounded-2xl text-center" style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)' }}>
      <div className="text-3xl font-bold mb-1" style={{ color: scoreColor(score) }}>{score ?? '—'}</div>
      <div className="text-sm text-slate-400">{label}</div>
    </div>
  );
}

function EmptyState({ message }) {
  return <div className="text-center py-16 text-slate-500">{message}</div>;
}

function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--color-surface)' }}>
      <div className="text-center">
        <div className="w-10 h-10 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin mx-auto mb-4" />
        <p className="text-slate-400">Loading report...</p>
      </div>
    </div>
  );
}

function scoreColor(score) {
  if (score >= 80) return '#10b981';
  if (score >= 60) return '#f59e0b';
  return '#ef4444';
}
