import React, { useState, useEffect } from 'react';
import {
  Globe,
  Github,
  Send,
  Sparkles,
  Trophy,
  CheckCircle2,
  Code2,
  Copy,
  Award,
  Star
} from 'lucide-react';
import {
  StudentPublicPortfolio,
  ColdOutreachResult
} from '@studentlife/shared';

interface LivePortfolioHubViewProps {
  onAddXp?: (xp: number, reason: string) => void;
}

export const LivePortfolioHubView: React.FC<LivePortfolioHubViewProps> = ({ onAddXp }) => {
  const [portfolio, setPortfolio] = useState<StudentPublicPortfolio | null>(null);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  // Outreach Generator state
  const [recipientType, setRecipientType] = useState<'RECRUITER' | 'PROFESSOR_PI' | 'FOUNDER'>('RECRUITER');
  const [recipientName, setRecipientName] = useState<string>('Alex Johnson');
  const [targetOrg, setTargetOrg] = useState<string>('Google DeepMind');
  const [targetRole, setTargetRole] = useState<string>('Research Scientist / AI Systems');
  const [keyAchievement, setKeyAchievement] = useState<string>('Distributed Low-Latency Engine & Olympiad Rank');
  const [outreachResult, setOutreachResult] = useState<ColdOutreachResult | null>(null);
  const [isDrafting, setIsDrafting] = useState<boolean>(false);

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const fetchPortfolio = async () => {
    try {
      const res = await fetch('/api/live-portfolio/profile/rohan-verma');
      const data = await res.json();
      if (data.success && data.data) {
        setPortfolio(data.data);
      }
    } catch {
      // Handled
    }
  };

  const handleDraftOutreach = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsDrafting(true);

    try {
      const res = await fetch('/api/live-portfolio/draft-outreach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientType,
          recipientName,
          companyOrUniversity: targetOrg,
          targetRoleOrLab: targetRole,
          studentKeyAchievement: keyAchievement
        })
      });
      const data = await res.json();
      if (data.success && data.data) {
        setOutreachResult(data.data);
        onAddXp?.(30, 'Drafted AI Cold Outreach Pitch');
      }
    } catch {
      // Handled
    } finally {
      setIsDrafting(false);
    }
  };

  const copyPublicUrl = () => {
    navigator.clipboard.writeText(`https://studentlife.app/p/${portfolio?.username || 'rohan-verma'}`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 border border-indigo-500/30 rounded-3xl p-6 md:p-8 relative overflow-hidden backdrop-blur-xl shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2.5 mb-2.5">
              <span className="px-3 py-1 bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 text-xs font-bold rounded-full uppercase tracking-wider flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
                Phase 104 • Live Public Portfolio & Cold Outreach Hub
              </span>
              <span className="px-2.5 py-0.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold rounded-md">
                Public URL Active
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight flex items-center gap-2">
              Sovereign Student Public Portfolio 🌐
            </h1>
            <p className="text-slate-300 text-xs md:text-sm mt-1 max-w-2xl leading-relaxed">
              Showcase verified credentials, GitHub projects, research papers, and Olympiad ranks on your live personal domain. Draft targeted recruiter and professor cold outreach emails in 1 click.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={copyPublicUrl}
              className="px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition flex items-center gap-2"
            >
              {copiedLink ? <CheckCircle2 className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
              {copiedLink ? 'Copied Public URL!' : 'Share Live Portfolio'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Live Profile Showcase & Cold Outreach Drafter */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Live Public Portfolio Preview Card */}
        {portfolio && (
          <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-8 relative overflow-hidden">
            {/* Top Profile Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 pb-6 border-b border-slate-800">
              <img
                src={portfolio.avatarUrl}
                alt={portfolio.fullName}
                className="w-20 h-20 rounded-3xl object-cover ring-4 ring-indigo-500/30 shadow-xl"
              />
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-black text-white">{portfolio.fullName}</h2>
                  <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-1">
                    <Trophy className="w-3.5 h-3.5" /> {portfolio.totalStudentLifeXp} XP
                  </span>
                </div>
                <p className="text-xs text-indigo-300 font-semibold">{portfolio.headline}</p>
                <p className="text-xs text-slate-400">{portfolio.college}</p>
              </div>
            </div>

            {/* Bio Section */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Bio & Focus</span>
              <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-4 rounded-2xl border border-slate-800/80">
                "{portfolio.bio}"
              </p>
            </div>

            {/* Top Verified Badges */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-400" /> Verified Proof-of-Skill Badges
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {portfolio.verifiedBadges.map((b, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-xl bg-slate-950/80 border border-indigo-500/20 text-xs font-semibold text-slate-200 flex items-center gap-2"
                  >
                    <span>{b}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Projects Showcase */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Code2 className="w-4 h-4 text-cyan-400" /> Featured Open-Source Projects
              </span>
              <div className="grid grid-cols-1 gap-4">
                {portfolio.projects.map((proj, i) => (
                  <div
                    key={i}
                    className="p-5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-indigo-500/40 transition shadow-lg space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-white flex items-center gap-2">
                        {proj.title}
                        {proj.starsCount && (
                          <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-300 text-[10px] font-bold border border-amber-500/20 flex items-center gap-1">
                            <Star className="w-3 h-3 fill-amber-300" /> {proj.starsCount}
                          </span>
                        )}
                      </h4>
                      {proj.githubUrl && (
                        <a
                          href={proj.githubUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                        >
                          <Github className="w-3.5 h-3.5" /> Repository
                        </a>
                      )}
                    </div>
                    <p className="text-xs text-slate-300">{proj.impactMetrics}</p>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {proj.techStack.map((tech, tIdx) => (
                        <span
                          key={tIdx}
                          className="px-2 py-0.5 rounded-lg bg-slate-900 text-[10px] font-mono text-slate-400 border border-slate-800"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Right Col: AI Cold Outreach Pitch Drafter */}
        <div className="lg:col-span-1 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <h3 className="text-sm font-bold text-white">AI Cold Outreach Drafter</h3>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 font-bold">
                Auto-Pitch
              </span>
            </div>

            <form onSubmit={handleDraftOutreach} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Recipient Type</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { id: 'RECRUITER', label: 'Recruiter' },
                    { id: 'PROFESSOR_PI', label: 'Professor' },
                    { id: 'FOUNDER', label: 'Founder' }
                  ].map((r) => (
                    <button
                      type="button"
                      key={r.id}
                      onClick={() => setRecipientType(r.id as any)}
                      className={`py-1.5 text-[11px] font-bold rounded-xl transition ${
                        recipientType === r.id
                          ? 'bg-indigo-600 text-white shadow'
                          : 'bg-slate-950 text-slate-400 border border-slate-800'
                      }`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Recipient Name</label>
                <input
                  type="text"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  placeholder="e.g. Dr. Andrew Ng / Alex Johnson"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Company / Lab</label>
                <input
                  type="text"
                  value={targetOrg}
                  onChange={(e) => setTargetOrg(e.target.value)}
                  placeholder="e.g. Google DeepMind / Stanford AI Lab"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Target Position / Topic</label>
                <input
                  type="text"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  placeholder="e.g. AI Research Scientist / SDE-1"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Your Key Highlight / Project</label>
                <input
                  type="text"
                  value={keyAchievement}
                  onChange={(e) => setKeyAchievement(e.target.value)}
                  placeholder="e.g. Distributed Low-Latency Engine & Olympiad Rank"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <button
                type="submit"
                disabled={isDrafting}
                className="w-full py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-600/30 transition flex items-center justify-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                {isDrafting ? 'Drafting Outreach...' : 'Draft Email & LinkedIn Note'}
              </button>
            </form>

            {/* Outreach Pitch Output */}
            {outreachResult && (
              <div className="mt-4 p-4 rounded-2xl bg-slate-950 border border-indigo-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">
                    Generated Pitch Subject:
                  </span>
                </div>
                <div className="text-xs font-semibold text-white">{outreachResult.emailSubject}</div>
                <textarea
                  rows={4}
                  readOnly
                  value={outreachResult.emailBodyMarkdown}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-[11px] text-slate-200 focus:outline-none font-mono leading-relaxed"
                />
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(outreachResult.emailBodyMarkdown);
                    alert('Copied cold email to clipboard!');
                  }}
                  className="w-full py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 text-indigo-300 text-[11px] font-bold transition flex items-center justify-center gap-1"
                >
                  <Copy className="w-3 h-3" /> Copy Email Template
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LivePortfolioHubView;
