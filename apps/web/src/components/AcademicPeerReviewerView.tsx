import React, { useState, useEffect } from 'react';
import {
  FileText,
  Award,
  Sparkles,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  ShieldCheck,
  Zap
} from 'lucide-react';
import type { PaperRefereeReport } from '@studentlife/shared';

interface AcademicPeerReviewerViewProps {
  onAddXp?: (amount: number) => void;
}

export const AcademicPeerReviewerView: React.FC<AcademicPeerReviewerViewProps> = ({ onAddXp }) => {
  const [paperTitle, setPaperTitle] = useState('Scalable State Space Models for Long-Context Scientific Reasoning');
  const [targetVenue, setTargetVenue] = useState('NeurIPS / ICLR 2027');
  const [abstractText, setAbstractText] = useState('We propose a sub-quadratic state-space architecture combining selective memory retention with hardware-aligned associative scan kernels. On extensive benchmarks across 14 reasoning tasks, our method yields 3.2x throughput speedups while outperforming transformer baselines.');
  const [report, setReport] = useState<PaperRefereeReport | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'SCORES' | 'REVIEWER_2' | 'REBUTTAL'>('SCORES');

  const runPeerReview = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/paper-referee/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paperTitle,
          targetVenue,
          abstractText
        })
      });
      if (res.ok) {
        const data = await res.json();
        setReport(data.data);
        if (onAddXp) onAddXp(60);
      }
    } catch (e) {
      console.error('Failed to run paper peer review', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runPeerReview();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900/40 via-indigo-900/40 to-slate-900/40 border border-blue-500/30 rounded-2xl p-6 backdrop-blur-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
          <FileText className="w-64 h-64 text-blue-400" />
        </div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30 uppercase tracking-wider">
                Phase 88 • Autonomous Peer-Review
              </span>
              <span className="flex items-center gap-1 text-xs text-indigo-400 font-medium">
                <ShieldCheck className="w-3.5 h-3.5" /> Conference Referee AI
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-3">
              <FileText className="w-8 h-8 text-blue-400" />
              Autonomous Academic Paper Referee & Reviewer 2 Scorer
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              Simulate tier-1 conference peer review (NeurIPS/ICLR/IEEE), generate adversarial *Reviewer 2* critiques, and synthesize camera-ready rebuttal counter-arguments.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={runPeerReview}
              disabled={loading}
              className="px-4 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 text-white font-bold rounded-xl text-sm flex items-center gap-2 shadow-lg shadow-blue-500/20 transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Score Paper
            </button>
          </div>
        </div>
      </div>

      {/* Paper Submission Form */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-8 space-y-1">
            <label className="text-xs font-semibold text-slate-300 block">Paper Title</label>
            <input
              type="text"
              value={paperTitle}
              onChange={(e) => setPaperTitle(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div className="md:col-span-4 space-y-1">
            <label className="text-xs font-semibold text-slate-300 block">Target Venue</label>
            <input
              type="text"
              value={targetVenue}
              onChange={(e) => setTargetVenue(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-300 block">Abstract & Core Methodology Snippet</label>
          <textarea
            rows={3}
            value={abstractText}
            onChange={(e) => setAbstractText(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 font-mono focus:border-blue-500 focus:outline-none"
          />
        </div>
      </div>

      {report && (
        <>
          {/* Top Score Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-xl">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider">Overall Score</span>
                <Award className="w-4 h-4 text-blue-400" />
              </div>
              <div className="text-3xl font-black text-white">{report.overallScore} <span className="text-sm font-normal text-slate-400">/ 10</span></div>
              <p className="text-[11px] text-blue-400 mt-1 font-semibold">{report.decisionRecommendation.replace(/_/g, ' ')}</p>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-xl">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider">Acceptance Chance</span>
                <Sparkles className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-3xl font-black text-emerald-400">{report.acceptanceProbabilityPercent}%</div>
              <p className="text-[11px] text-slate-400 mt-1">Tier-1 Conference Model</p>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-xl">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider">Novelty Rating</span>
                <Zap className="w-4 h-4 text-indigo-400" />
              </div>
              <div className="text-3xl font-black text-indigo-300">8.8 <span className="text-xs text-slate-400">/ 10</span></div>
              <p className="text-[11px] text-indigo-400 mt-1">High Theoretical Merit</p>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-xl">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider">Reviewer Consensus</span>
                <CheckCircle2 className="w-4 h-4 text-teal-400" />
              </div>
              <div className="text-xl font-black text-teal-300 mt-1">Lean Accept</div>
              <p className="text-[11px] text-slate-400 mt-1">2 Accepts, 1 Weak Reject</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 bg-slate-900/60 p-1.5 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('SCORES')}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                activeTab === 'SCORES'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Award className="w-3.5 h-3.5" /> 5-Point Criteria Breakdown
            </button>
            <button
              onClick={() => setActiveTab('REVIEWER_2')}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                activeTab === 'REVIEWER_2'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5 text-amber-300" /> Reviewer #2 Critical Review
            </button>
            <button
              onClick={() => setActiveTab('REBUTTAL')}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                activeTab === 'REBUTTAL'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" /> Rebuttal Strategy & Counter-Proofs
            </button>
          </div>

          {/* Tab Contents */}
          {activeTab === 'SCORES' && (
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl space-y-3">
              <h3 className="text-sm font-bold text-white mb-2">Evaluator Rubric Metrics</h3>
              {report.criteriaScores.map((c, idx) => (
                <div key={idx} className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-200">{c.criterion.replace(/_/g, ' ')}</span>
                    <span className="text-xs font-mono font-bold text-blue-400 bg-blue-500/10 px-2.5 py-0.5 rounded border border-blue-500/20">
                      {c.scoreOutOf10} / 10
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">{c.comments}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'REVIEWER_2' && (
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl space-y-4">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                <AlertTriangle className="w-4 h-4" /> Reviewer #2 Harsh Critique
              </div>
              <div className="p-4 bg-amber-950/20 border border-amber-500/30 rounded-xl text-xs text-amber-200 leading-relaxed font-serif">
                "{report.reviewer2Critique}"
              </div>
            </div>
          )}

          {activeTab === 'REBUTTAL' && (
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl space-y-3">
              <h3 className="text-sm font-bold text-white mb-2">Recommended Author Rebuttal Strategy</h3>
              {report.suggestedRebuttalStrategy.map((strat, idx) => (
                <div key={idx} className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-start gap-2 text-xs text-slate-300">
                  <ChevronRight className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                  <span>{strat}</span>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};
