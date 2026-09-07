import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Coins,
  Clock,
  Plus,
  Zap,
  UserCheck
} from 'lucide-react';
import { PeerTutorBounty, CreateTutorBountyDto, AcceptTutorBountyDto } from '@studentlife/shared';

interface TutorBountyMarketViewProps {
  onAddXp?: (xp: number, reason: string) => void;
}

export const TutorBountyMarketView: React.FC<TutorBountyMarketViewProps> = ({ onAddXp }) => {
  const [bounties, setBounties] = useState<PeerTutorBounty[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [subjectInput, setSubjectInput] = useState<string>('Data Structures & Algorithms');
  const [topicInput, setTopicInput] = useState<string>('');
  const [descInput, setDescInput] = useState<string>('');
  const [coinInput, setCoinInput] = useState<number>(120);
  const [isCreating, setIsCreating] = useState<boolean>(false);

  useEffect(() => {
    fetchBounties();
  }, []);

  const fetchBounties = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/tutor-bounty/bounties');
      const data = await res.json();
      if (data.success && data.data) {
        setBounties(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch tutor bounties', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateBounty = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topicInput.trim() || !descInput.trim()) return;
    try {
      setIsCreating(true);
      const dto: CreateTutorBountyDto = {
        subjectTag: subjectInput,
        topicTitle: topicInput,
        doubtDescription: descInput,
        coinBountyReward: coinInput,
        urgencyMinutes: 15
      };
      const res = await fetch('/api/tutor-bounty/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dto)
      });
      const data = await res.json();
      if (data.success && data.data) {
        setBounties(prev => [data.data, ...prev]);
        setTopicInput('');
        setDescInput('');
        onAddXp?.(20, 'Posted Peer Doubt Bounty');
      }
    } catch (err) {
      console.error('Failed to create tutor bounty', err);
    } finally {
      setIsCreating(false);
    }
  };

  const handleAcceptBounty = async (bountyId: string) => {
    try {
      const dto: AcceptTutorBountyDto = { bountyId };
      const res = await fetch('/api/tutor-bounty/accept', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dto)
      });
      const data = await res.json();
      if (data.success && data.data) {
        setBounties(prev => prev.map(b => b.id === bountyId ? data.data : b));
        onAddXp?.(35, 'Accepted Peer Micro-Tutoring Session (+Study Coins)');
      }
    } catch (err) {
      console.error('Failed to accept bounty', err);
    }
  };

  if (isLoading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
        <Coins size={36} className="animate-pulse" style={{ margin: '0 auto 16px', color: 'var(--accent-primary)' }} />
        <p>Loading Peer Micro-Tutoring & Doubt Bounty Marketplace...</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top Banner */}
      <div className="glass-panel" style={{
        padding: '24px 32px',
        background: 'linear-gradient(135deg, rgba(20, 184, 166, 0.6) 0%, rgba(15, 23, 42, 0.9) 100%)',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '16px'
      }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span className="badge badge-active" style={{ backgroundColor: 'rgba(20, 184, 166, 0.2)', color: '#2dd4bf' }}>
              <Sparkles size={12} /> PHASE 63 &bull; PEER TUTOR & BOUNTY MARKETPLACE
            </span>
            <span className="badge badge-completed">1-on-1 Micro Sessions & Study Coins</span>
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>
            Peer Doubt Bounty Marketplace <span className="gradient-text">& Micro-Tutor 💰</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
            Post urgent STEM/Coding doubts with Study Coin escrow rewards or earn XP by teaching peers in 15-min sessions.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <div className="glass-panel" style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Coins size={18} color="#fbbf24" />
            <div>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>OPEN BOUNTIES</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff' }}>
                {bounties.filter(b => b.status === 'OPEN').length} Active
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Live Bounties Feed & Post Bounty Form */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1.1fr', gap: '20px' }}>
        {/* Left: Open Peer Bounties */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h4 style={{ fontSize: '1.05rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Coins size={18} color="#2dd4bf" />
            Active Peer Doubt Bounties
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {bounties.map((bounty) => (
              <div
                key={bounty.id}
                className="glass-panel glow-hover"
                style={{
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                  borderLeft: bounty.status === 'OPEN' ? '3px solid #2dd4bf' : '3px solid #a855f7'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <span className="badge badge-active" style={{ fontSize: '0.65rem' }}>
                      {bounty.subjectTag}
                    </span>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginTop: '4px' }}>
                      {bounty.topicTitle}
                    </h3>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fbbf24' }}>
                      🪙 {bounty.coinBountyReward} Coins
                    </div>
                    <span style={{ fontSize: '0.65rem', color: 'var(--accent-primary)', fontWeight: 700 }}>
                      +{bounty.xpReward} XP
                    </span>
                  </div>
                </div>

                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.4, margin: 0 }}>
                  {bounty.doubtDescription}
                </p>

                <div style={{
                  paddingTop: '10px',
                  borderTop: '1px solid var(--border-glass)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Clock size={12} color="#f43f5e" /> Urgency: ~{bounty.urgencyMinutes} mins &bull; Posted by: {bounty.studentName}
                  </div>

                  {bounty.status === 'OPEN' ? (
                    <button
                      onClick={() => handleAcceptBounty(bounty.id)}
                      className="btn btn-primary"
                      style={{ fontSize: '0.75rem', padding: '6px 14px', display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                      <Zap size={12} /> Accept & Start (+Coins)
                    </button>
                  ) : (
                    <span className="badge badge-completed" style={{ fontSize: '0.7rem' }}>
                      <UserCheck size={12} /> {bounty.assignedTutorName}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Post New Bounty Form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Plus size={18} color="#2dd4bf" />
              Post a New Doubt Bounty
            </h4>

            <form onSubmit={handleCreateBounty} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Subject Domain</label>
                <select
                  value={subjectInput}
                  onChange={(e) => setSubjectInput(e.target.value)}
                  className="glass-input"
                  style={{ width: '100%', padding: '8px 12px', fontSize: '0.85rem', marginTop: '4px' }}
                >
                  <option value="Data Structures & Algorithms">Data Structures & Algorithms</option>
                  <option value="Operating Systems & Concurrency">Operating Systems & Concurrency</option>
                  <option value="Electromagnetics & Waves">Electromagnetics & Waves</option>
                  <option value="Discrete Mathematics & Graph Theory">Discrete Mathematics</option>
                  <option value="Computer Networks & Sockets">Computer Networks</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Specific Doubt Topic</label>
                <input
                  type="text"
                  value={topicInput}
                  onChange={(e) => setTopicInput(e.target.value)}
                  placeholder="E.g., Dijkstra negative weight cycle failure condition..."
                  className="glass-input"
                  style={{ width: '100%', padding: '8px 12px', fontSize: '0.85rem', marginTop: '4px' }}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Detailed Doubt Description</label>
                <textarea
                  value={descInput}
                  onChange={(e) => setDescInput(e.target.value)}
                  placeholder="Explain exactly where you are stuck in your code or mathematical proof..."
                  className="glass-input"
                  style={{ width: '100%', height: '80px', padding: '8px 12px', fontSize: '0.8rem', marginTop: '4px', resize: 'vertical' }}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Coin Bounty Reward (From Balance)</label>
                <input
                  type="number"
                  value={coinInput}
                  onChange={(e) => setCoinInput(Number(e.target.value))}
                  className="glass-input"
                  style={{ width: '100%', padding: '8px 12px', fontSize: '0.85rem', marginTop: '4px' }}
                />
              </div>

              <button
                type="submit"
                disabled={isCreating}
                className="btn btn-primary"
                style={{ padding: '10px 16px', fontSize: '0.85rem', marginTop: '4px' }}
              >
                {isCreating ? 'Placing Bounty on Board...' : 'Post Bounty to Campus Peer Network (+20 XP)'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
