import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  Coins,
  Clock,
  CheckCircle2,
  GitPullRequest,
  Lock,
  Award
} from 'lucide-react';
import type { MicroInternshipGig, SubmitProofOfWorkDto, MicroGigCategory } from '@studentlife/shared';

interface MicroInternshipEscrowViewProps {
  onAddXp?: (xp: number, reason: string) => void;
}

export const MicroInternshipEscrowView: React.FC<MicroInternshipEscrowViewProps> = ({ onAddXp }) => {
  const [gigs, setGigs] = useState<MicroInternshipGig[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<MicroGigCategory | 'ALL'>('ALL');
  const [selectedGig, setSelectedGig] = useState<MicroInternshipGig | null>(null);
  const [prUrl, setPrUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchGigs();
  }, []);

  const fetchGigs = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/micro-internship/gigs');
      const data = await res.json();
      if (data.success && data.data) {
        setGigs(data.data);
      }
    } catch {
      // Fallback
    }
  };

  const handleSubmitProof = async () => {
    if (!selectedGig || !prUrl.trim()) return;
    setIsSubmitting(true);

    const payload: SubmitProofOfWorkDto = {
      gigId: selectedGig.id,
      pullRequestUrl: prUrl,
      submissionNotes: notes
    };

    try {
      const res = await fetch('http://localhost:5000/api/micro-internship/submit-proof', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success && data.data) {
        setGigs(prev => prev.map(g => (g.id === data.data.id ? data.data : g)));
        setSelectedGig(null);
        setPrUrl('');
        setNotes('');
        onAddXp?.(50, 'Micro-Internship PR Proof of Work Submitted');
      }
    } catch {
      // Local fallback
      setSelectedGig(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReleaseEscrow = async (gigId: string, coins: number) => {
    try {
      const res = await fetch(`http://localhost:5000/api/micro-internship/gig/${gigId}/release-escrow`, {
        method: 'POST'
      });
      const data = await res.json();
      if (data.success && data.data) {
        setGigs(prev => prev.map(g => (g.id === data.data.id ? data.data : g)));
        onAddXp?.(100, `Micro-Internship Escrow Approved (+${coins} Coins)`);
      }
    } catch {
      // Fallback
    }
  };

  const filteredGigs = selectedCategory === 'ALL'
    ? gigs
    : gigs.filter(g => g.category === selectedCategory);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-950/60 via-yellow-950/40 to-slate-900 border border-amber-500/30 rounded-2xl p-6 relative overflow-hidden backdrop-blur-md shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold rounded-full uppercase tracking-wider flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-amber-400" />
                Phase 79 • Proof of Work
              </span>
              <span className="px-2.5 py-0.5 bg-slate-800/80 border border-slate-700 text-slate-400 text-xs rounded-md">
                Smart Escrow Micro-Internships
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight flex items-center gap-2">
              Micro-Internship & 48h Sprint Escrow Hub
            </h1>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl">
              Real-world 24–48 hour student contracts funded in escrow. GitHub PR proof-of-work verification, instant Study Coin payouts, and verifiable Skill Passport portfolio items.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-slate-900/80 border border-slate-700 px-4 py-2 rounded-xl text-center">
              <div className="text-xs text-slate-400 font-medium">Escrow Pool</div>
              <div className="text-xl font-black text-amber-400 flex items-center justify-center gap-1">
                <Coins className="w-4 h-4 text-amber-400" /> 1,330 <span className="text-xs text-slate-400">Coins</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap gap-2">
        {(['ALL', 'AI_BENCHMARK', 'FULLSTACK_FEATURE', 'DATASET_CURATION', 'SECURITY_AUDIT'] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition border ${
              selectedCategory === cat
                ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-md shadow-amber-500/20'
                : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            {cat.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Gigs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredGigs.map((gig) => (
          <div
            key={gig.id}
            className="bg-slate-900/80 border border-slate-800 hover:border-amber-500/40 rounded-xl p-5 shadow-xl space-y-4 transition flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-mono text-amber-400 font-bold uppercase">{gig.category}</span>
                  <h3 className="text-sm font-bold text-white mt-0.5">{gig.title}</h3>
                  <div className="text-xs text-slate-400 mt-0.5 font-medium">Sponsor: {gig.sponsorOrganization}</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-base font-black text-amber-400 flex items-center justify-end gap-1">
                    <Coins className="w-4 h-4" /> {gig.bountyStudyCoins}
                  </div>
                  <div className="text-[10px] text-slate-500 flex items-center gap-1 justify-end mt-0.5">
                    <Clock className="w-3 h-3" /> {gig.deadlineHours}h Sprint
                  </div>
                </div>
              </div>

              {/* Requirements */}
              <div className="space-y-1.5 pt-2 border-t border-slate-800">
                <div className="text-[11px] font-bold text-slate-400 uppercase">Deliverables:</div>
                <ul className="space-y-1 text-xs text-slate-300">
                  {gig.requirements.map((req, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="w-1.5 h-1.5 bg-amber-400 rounded-full mt-1.5 shrink-0" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Bottom Actions & Escrow State */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
              <span className={`px-2.5 py-1 rounded text-[10px] font-bold flex items-center gap-1 ${
                gig.escrowStatus === 'RELEASED_TO_STUDENT'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              }`}>
                <Lock className="w-3 h-3" />
                {gig.escrowStatus.replace(/_/g, ' ')}
              </span>

              {gig.status === 'OPEN' && (
                <button
                  onClick={() => setSelectedGig(gig)}
                  className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg transition flex items-center gap-1.5"
                >
                  <GitPullRequest className="w-3.5 h-3.5" /> Submit PR
                </button>
              )}

              {gig.status === 'SUBMITTED' && (
                <button
                  onClick={() => handleReleaseEscrow(gig.id, gig.bountyStudyCoins)}
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg transition flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" /> Release Escrow (+XP)
                </button>
              )}

              {gig.status === 'APPROVED' && (
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                  <Award className="w-4 h-4" /> Credential Issued
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Proof of Work Submission Modal */}
      {selectedGig && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-4">
            <h3 className="text-base font-black text-white">
              Submit Proof-of-Work: {selectedGig.title}
            </h3>

            <div>
              <label className="text-xs text-slate-400 mb-1 block">GitHub Pull Request URL</label>
              <input
                type="text"
                value={prUrl}
                onChange={(e) => setPrUrl(e.target.value)}
                placeholder="https://github.com/org/repo/pull/123"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-200 focus:border-amber-500 focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 mb-1 block">Implementation & Test Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Summary of benchmark results, test suites passed, reproduction steps..."
                className="w-full h-24 bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-200 focus:border-amber-500 focus:outline-none resize-none"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleSubmitProof}
                disabled={isSubmitting || !prUrl.trim()}
                className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-lg transition"
              >
                {isSubmitting ? 'Verifying PR...' : 'Submit for Escrow Release (+50 XP)'}
              </button>
              <button
                onClick={() => setSelectedGig(null)}
                className="px-4 py-2.5 bg-slate-800 text-slate-300 text-xs rounded-lg border border-slate-700"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
