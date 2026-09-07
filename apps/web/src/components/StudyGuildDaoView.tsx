import React, { useState, useEffect } from 'react';
import {
  Vote,
  Coins,
  ShieldCheck,
  PlusCircle,
  TrendingUp,
  CheckCircle2,
  Sparkles,
  Building2,
  Hash
} from 'lucide-react';
import type { GuildProposal, GuildProposalCategory } from '@studentlife/shared';

interface StudyGuildDaoViewProps {
  onAddXp?: (amount: number) => void;
}

export const StudyGuildDaoView: React.FC<StudyGuildDaoViewProps> = ({ onAddXp }) => {
  const [proposals, setProposals] = useState<GuildProposal[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [voiceCredits, setVoiceCredits] = useState(100); // 100 Voice Credits for Quadratic Voting
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  // New Proposal Form State
  const [newTitle, setNewTitle] = useState('');
  const [newJustification, setNewJustification] = useState('');
  const [newCategory, setNewCategory] = useState<GuildProposalCategory>('HARDWARE_ACQUISITION');
  const [newRequestedFunding, setNewRequestedFunding] = useState(250);

  const fetchProposals = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/study-guild-dao/proposals');
      if (res.ok) {
        const data = await res.json();
        setProposals(data.proposals || []);
      }
    } catch (e) {
      console.error('Failed to fetch guild proposals', e);
    }
  };

  useEffect(() => {
    fetchProposals();
  }, []);

  const handleCastVote = async (proposalId: string, creditsSpent: number = 4) => {
    if (voiceCredits < creditsSpent) {
      alert(`Insufficient Voice Credits! You need ${creditsSpent} credits.`);
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/study-guild-dao/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          proposalId,
          creditsToSpend: creditsSpent
        })
      });
      if (res.ok) {
        setVoiceCredits((prev) => prev - creditsSpent);
        fetchProposals();
        if (onAddXp) onAddXp(35);
      }
    } catch (e) {
      console.error('Failed to cast quadratic vote', e);
    }
  };

  const handleCreateProposal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newJustification.trim()) return;

    try {
      const res = await fetch('http://localhost:5000/api/study-guild-dao/proposals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle,
          category: newCategory,
          requestedTreasuryCoins: newRequestedFunding,
          justification: newJustification
        })
      });
      if (res.ok) {
        setShowCreateModal(false);
        setNewTitle('');
        setNewJustification('');
        fetchProposals();
        if (onAddXp) onAddXp(80);
      }
    } catch (e) {
      console.error('Failed to create proposal', e);
    }
  };

  const filteredProposals = proposals.filter((p) =>
    selectedCategory === 'ALL' ? true : p.category === selectedCategory
  );

  const totalTreasury = 14850; // $14,850 USDC / Guild Credits

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-900/40 via-orange-900/40 to-yellow-900/40 border border-amber-500/30 rounded-2xl p-6 backdrop-blur-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
          <Building2 className="w-64 h-64 text-amber-400" />
        </div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase tracking-wider">
                Phase 85 • Decentralized Governance
              </span>
              <span className="flex items-center gap-1 text-xs text-amber-400 font-medium">
                <Vote className="w-3.5 h-3.5" /> Quadratic DAO Engine
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-3">
              <Vote className="w-8 h-8 text-amber-400" />
              Decentralized Collegiate Study Guild & Quadratic DAO
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              Collegiate chapter governance, Sybil-resistant Quadratic Voting (Credits = Votes²), multi-sig treasury allocations, and cryptographically verified on-chain proposals.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold rounded-xl text-sm flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              New DAO Proposal
            </button>
          </div>
        </div>
      </div>

      {/* Treasury & Voice Credits Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-xl">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Guild Treasury</span>
            <Coins className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-black text-amber-300">${totalTreasury.toLocaleString()} <span className="text-xs font-normal text-slate-400">USDC</span></div>
          <p className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1 font-medium">
            <TrendingUp className="w-3 h-3" /> Multi-sig 3/5 quorum active
          </p>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-xl">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Your Voice Credits</span>
            <Sparkles className="w-4 h-4 text-yellow-400" />
          </div>
          <div className="text-3xl font-black text-yellow-300">{voiceCredits} <span className="text-xs font-normal text-slate-400">VC</span></div>
          <p className="text-[11px] text-slate-400 mt-1 font-mono">Quadratic Cost = Votes²</p>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-xl">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Active Proposals</span>
            <Vote className="w-4 h-4 text-orange-400" />
          </div>
          <div className="text-3xl font-black text-white">{proposals.length}</div>
          <p className="text-[11px] text-slate-400 mt-1">
            {proposals.filter((p) => p.status === 'VOTING_ACTIVE').length} Voting in progress
          </p>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-xl">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Governance Tier</span>
            <ShieldCheck className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-xl font-black text-teal-300 mt-1">Core Fellow</div>
          <p className="text-[11px] text-teal-400 mt-1">Sybil-proof Soulbound ID</p>
        </div>
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap items-center gap-2">
        {['ALL', 'HARDWARE_ACQUISITION', 'COURSE_LICENSE', 'HACKATHON_SPONSORSHIP', 'CAMPUS_EVENT'].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`text-xs px-3.5 py-1.5 rounded-xl border transition-all ${
              selectedCategory === cat
                ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 font-bold'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            {cat.replace(/_/g, ' ')}
          </button>
        ))}
      </div>

      {/* Proposals List */}
      <div className="space-y-4">
        {filteredProposals.map((proposal) => {
          const votes = proposal.quadraticVotesAccumulated;
          const voters = proposal.totalVotersCount;

          return (
            <div
              key={proposal.id}
              className="bg-slate-900/60 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-6 backdrop-blur-xl transition-all space-y-4"
            >
              {/* Proposal Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider border ${
                        proposal.status === 'VOTING_ACTIVE'
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                          : proposal.status === 'PASSED_FUNDED'
                          ? 'bg-sky-500/10 border-sky-500/30 text-sky-400'
                          : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                      }`}
                    >
                      {proposal.status.replace(/_/g, ' ')}
                    </span>
                    <span className="text-xs text-slate-500 font-mono">
                      #{proposal.id} • Proposer: {proposal.proposerName}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white">{proposal.title}</h3>
                </div>

                <div className="flex items-center gap-3">
                  {proposal.requestedTreasuryCoins > 0 && (
                    <span className="text-xs font-mono font-bold bg-amber-500/10 border border-amber-500/20 text-amber-300 px-3 py-1 rounded-xl">
                      ${proposal.requestedTreasuryCoins} USDC Requested
                    </span>
                  )}
                </div>
              </div>

              {/* Quadratic Voting Progress Bar */}
              <div className="space-y-2 pt-2 border-t border-slate-800/80">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-amber-400 flex items-center gap-1">
                    <Vote className="w-3.5 h-3.5" /> Quadratic Votes: {votes.toFixed(1)}
                  </span>
                  <span className="text-slate-400">
                    {voters} Unique Student Voters {proposal.quorumReached && '• Quorum Reached ✓'}
                  </span>
                </div>
                <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden flex">
                  <div
                    className="bg-gradient-to-r from-amber-500 to-yellow-400 h-full transition-all duration-500"
                    style={{ width: `${Math.min(100, (votes / 50) * 100)}%` }}
                  />
                </div>
              </div>

              {/* Footer Meta & Quadratic Action Buttons */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 text-xs text-slate-400">
                <div className="flex items-center gap-2 font-mono text-[11px]">
                  <Hash className="w-3 h-3 text-slate-500" />
                  <span className="text-slate-500">Hash:</span>
                  <span className="text-slate-300">{proposal.onChainProposalHash?.slice(0, 16) || '0x498a...'}...</span>
                </div>

                {proposal.status === 'VOTING_ACTIVE' && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCastVote(proposal.id, 4)}
                      className="px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold rounded-lg text-xs flex items-center gap-1 transition-all"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Cast +2.0 Votes (4 VC)
                    </button>
                    <button
                      onClick={() => handleCastVote(proposal.id, 9)}
                      className="px-3 py-1.5 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 font-bold rounded-lg text-xs flex items-center gap-1 transition-all"
                    >
                      <Sparkles className="w-3.5 h-3.5" /> Cast +3.0 Votes (9 VC)
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* New Proposal Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-amber-400" />
                Submit Collegiate DAO Proposal
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateProposal} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Proposal Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Purchase 4x RTX 4090 Workstations for AI Lab"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as GuildProposalCategory)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 focus:border-amber-500 focus:outline-none"
                  >
                    <option value="HARDWARE_ACQUISITION">Hardware Acquisition</option>
                    <option value="COURSE_LICENSE">Course License</option>
                    <option value="HACKATHON_SPONSORSHIP">Hackathon Sponsorship</option>
                    <option value="CAMPUS_EVENT">Campus Event</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Requested Treasury Coins</label>
                  <input
                    type="number"
                    min={0}
                    max={10000}
                    value={newRequestedFunding}
                    onChange={(e) => setNewRequestedFunding(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Justification & Student Impact</label>
                <textarea
                  required
                  rows={4}
                  value={newJustification}
                  onChange={(e) => setNewJustification(e.target.value)}
                  placeholder="Explain why the guild should allocate treasury funds, deliverables, and student impact..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs transition-all"
                >
                  Submit to DAO
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
