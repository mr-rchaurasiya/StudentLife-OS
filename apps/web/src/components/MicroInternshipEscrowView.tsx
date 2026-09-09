import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  Coins,
  Clock,
  CheckCircle2,
  GitPullRequest,
  Lock,
  Award,
  ShieldCheck,
  Building,
  X
} from 'lucide-react';
import type { MicroInternshipGig, SubmitProofOfWorkDto, MicroGigCategory } from '@studentlife/shared';

interface MicroInternshipEscrowViewProps {
  onAddXp?: (xp: number, reason: string) => void;
}

const FALLBACK_GIGS: MicroInternshipGig[] = [
  {
    id: 'gig-01',
    title: 'Benchmark ONNX Runtime vs PyTorch on Raspberry Pi 5',
    sponsorOrganization: 'EdgeAI Robotics Lab',
    category: 'AI_BENCHMARK',
    bountyStudyCoins: 250,
    deadlineHours: 48,
    requirements: [
      'Compile ONNX quantized int8 MobileNetV3 model',
      'Measure latency distribution across 1000 inferences',
      'Submit reproducible Jupyter Notebook & latency CSV in PR'
    ],
    status: 'OPEN',
    escrowStatus: 'FUNDED_IN_ESCROW'
  },
  {
    id: 'gig-02',
    title: 'Implement WebRTC Screen-Share & Canvas Pointer Bridge',
    sponsorOrganization: 'OpenCollab EdTech',
    category: 'FULLSTACK_FEATURE',
    bountyStudyCoins: 400,
    deadlineHours: 36,
    requirements: [
      'MediaStream getDisplayMedia capture handler in React',
      'Binary WebSocket cursor coordinates broadcast at 60 FPS',
      'Pass end-to-end Cypress integration tests'
    ],
    status: 'OPEN',
    escrowStatus: 'FUNDED_IN_ESCROW'
  },
  {
    id: 'gig-03',
    title: 'Indian Judicial Judgment NER Dataset Annotation (100 Docs)',
    sponsorOrganization: 'LegalTech AI Foundation',
    category: 'DATASET_CURATION',
    bountyStudyCoins: 180,
    deadlineHours: 24,
    requirements: [
      'Tag Statutes, Petitioner, Respondent, Judge, and IPC Section entities',
      'Ensure CoNLL-2003 format compatibility and zero tag overlaps'
    ],
    status: 'IN_SPRINT',
    pullRequestUrl: 'https://github.com/LegalTechAI/corpus-in/pull/142',
    escrowStatus: 'FUNDED_IN_ESCROW'
  },
  {
    id: 'gig-04',
    title: 'Smart Contract Slither & Mythril Static Security Scan',
    sponsorOrganization: 'Polygon Student Guild',
    category: 'SECURITY_AUDIT',
    bountyStudyCoins: 500,
    deadlineHours: 48,
    requirements: [
      'Run Slither vulnerability detectors on ERC-4626 Vault contract',
      'Provide remediation patches for reentrancy and integer underflow risks'
    ],
    status: 'APPROVED',
    pullRequestUrl: 'https://github.com/PolygonGuild/vault-contracts/pull/88',
    escrowStatus: 'RELEASED_TO_STUDENT'
  }
];

export const MicroInternshipEscrowView: React.FC<MicroInternshipEscrowViewProps> = ({ onAddXp }) => {
  const [gigs, setGigs] = useState<MicroInternshipGig[]>(FALLBACK_GIGS);
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
      const res = await fetch('/api/micro-internship/gigs');
      const data = await res.json();
      if (data.success && data.data && data.data.length > 0) {
        setGigs(data.data);
      }
    } catch {
      // Keep fallback
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
      const res = await fetch('/api/micro-internship/submit-proof', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success && data.data) {
        setGigs((prev) => prev.map((g) => (g.id === data.data.id ? data.data : g)));
        setSelectedGig(null);
        setPrUrl('');
        setNotes('');
        onAddXp?.(50, 'Micro-Internship PR Proof of Work Submitted');
      } else {
        // Optimistic local update
        setGigs((prev) =>
          prev.map((g) =>
            g.id === selectedGig.id
              ? { ...g, status: 'SUBMITTED', pullRequestUrl: prUrl }
              : g
          )
        );
        setSelectedGig(null);
        setPrUrl('');
        setNotes('');
        onAddXp?.(50, 'Micro-Internship PR Proof of Work Submitted');
      }
    } catch {
      // Local optimistic update
      setGigs((prev) =>
        prev.map((g) =>
          g.id === selectedGig.id
            ? { ...g, status: 'SUBMITTED', pullRequestUrl: prUrl }
            : g
        )
      );
      setSelectedGig(null);
      setPrUrl('');
      setNotes('');
      onAddXp?.(50, 'Micro-Internship PR Proof of Work Submitted');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReleaseEscrow = async (gigId: string, coins: number) => {
    try {
      const res = await fetch(`/api/micro-internship/gig/${gigId}/release-escrow`, {
        method: 'POST'
      });
      const data = await res.json();
      if (data.success && data.data) {
        setGigs((prev) => prev.map((g) => (g.id === data.data.id ? data.data : g)));
        onAddXp?.(100, `Micro-Internship Escrow Approved (+${coins} Coins)`);
      } else {
        // Optimistic local update
        setGigs((prev) =>
          prev.map((g) =>
            g.id === gigId
              ? { ...g, status: 'APPROVED', escrowStatus: 'RELEASED_TO_STUDENT' }
              : g
          )
        );
        onAddXp?.(100, `Micro-Internship Escrow Approved (+${coins} Coins)`);
      }
    } catch {
      // Optimistic local update
      setGigs((prev) =>
        prev.map((g) =>
          g.id === gigId
            ? { ...g, status: 'APPROVED', escrowStatus: 'RELEASED_TO_STUDENT' }
            : g
        )
      );
      onAddXp?.(100, `Micro-Internship Escrow Approved (+${coins} Coins)`);
    }
  };

  const filteredGigs =
    selectedCategory === 'ALL'
      ? gigs
      : gigs.filter((g) => g.category === selectedCategory);

  const totalEscrowPool = gigs.reduce((sum, g) => sum + g.bountyStudyCoins, 0);

  const getCategoryBadge = (cat: string) => {
    switch (cat) {
      case 'AI_BENCHMARK':
        return { label: 'AI Benchmark 🤖', bg: 'rgba(99, 102, 241, 0.2)', text: '#a5b4fc', border: 'rgba(99, 102, 241, 0.4)' };
      case 'FULLSTACK_FEATURE':
        return { label: 'Fullstack Feature 💻', bg: 'rgba(6, 182, 212, 0.2)', text: '#67e8f9', border: 'rgba(6, 182, 212, 0.4)' };
      case 'DATASET_CURATION':
        return { label: 'Dataset Curation 📊', bg: 'rgba(168, 85, 247, 0.2)', text: '#e9d5ff', border: 'rgba(168, 85, 247, 0.4)' };
      case 'SECURITY_AUDIT':
        return { label: 'Security Audit 🛡️', bg: 'rgba(244, 63, 94, 0.2)', text: '#fecdd3', border: 'rgba(244, 63, 94, 0.4)' };
      default:
        return { label: cat.replace('_', ' '), bg: 'rgba(245, 158, 11, 0.2)', text: '#fef08a', border: 'rgba(245, 158, 11, 0.4)' };
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '60px', maxWidth: '1600px', margin: '0 auto' }}>
      {/* Header Banner */}
      <div
        style={{
          position: 'relative',
          borderRadius: '24px',
          overflow: 'hidden',
          background: 'linear-gradient(135deg, rgba(217, 119, 6, 0.3) 0%, rgba(15, 23, 42, 0.95) 50%, rgba(245, 158, 11, 0.22) 100%)',
          border: '1px solid rgba(245, 158, 11, 0.35)',
          padding: '28px 32px',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
          backdropFilter: 'blur(16px)',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '20px'
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '-50px',
            right: '-50px',
            width: '320px',
            height: '320px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(245, 158, 11, 0.18) 0%, rgba(0, 0, 0, 0) 70%)',
            pointerEvents: 'none'
          }}
        />

        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', position: 'relative', zIndex: 1, maxWidth: '820px' }}>
          <div
            style={{
              width: '54px',
              height: '54px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 24px rgba(245, 158, 11, 0.35)',
              flexShrink: 0
            }}
          >
            <Briefcase size={28} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '6px' }}>
              <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em', margin: 0 }}>
                Micro-Internship & 48h Sprint Escrow Hub
              </h1>
              <span
                style={{
                  backgroundColor: 'rgba(245, 158, 11, 0.15)',
                  color: '#fef08a',
                  border: '1px solid rgba(245, 158, 11, 0.4)',
                  padding: '3px 10px',
                  borderRadius: '9999px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px'
                }}
              >
                <ShieldCheck size={13} color="#facc15" /> Smart Escrow Verified
              </span>
            </div>
            <p style={{ fontSize: '0.9rem', color: '#94a3b8', margin: 0, lineHeight: 1.5 }}>
              Real-world 24–48 hour student contracts funded in escrow. GitHub PR proof-of-work verification, instant Study Coin payouts, and verifiable Skill Passport items.
            </p>
          </div>
        </div>

        {/* Escrow Pool Scorecard */}
        <div
          style={{
            backgroundColor: 'rgba(15, 23, 42, 0.85)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            borderRadius: '18px',
            padding: '14px 22px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px',
            boxShadow: '0 8px 20px rgba(0, 0, 0, 0.3)',
            position: 'relative',
            zIndex: 1
          }}
        >
          <span style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700 }}>
            Active Escrow Pool
          </span>
          <div style={{ fontSize: '1.45rem', fontWeight: 900, color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Coins size={22} color="#fbbf24" />
            {totalEscrowPool.toLocaleString()} <span style={{ fontSize: '0.75rem', color: '#cbd5e1', fontWeight: 600 }}>Coins</span>
          </div>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '0.78rem', color: '#cbd5e1', fontWeight: 700, marginRight: '4px' }}>
          Filter Track:
        </span>
        {(['ALL', 'AI_BENCHMARK', 'FULLSTACK_FEATURE', 'DATASET_CURATION', 'SECURITY_AUDIT'] as const).map((cat) => {
          const isActive = selectedCategory === cat;
          const badgeInfo = getCategoryBadge(cat);
          let label = cat === 'ALL' ? 'ALL TRACKS (' + gigs.length + ')' : badgeInfo.label;

          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: '8px 16px',
                borderRadius: '12px',
                fontSize: '0.75rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s',
                border: isActive ? '1px solid #fbbf24' : '1px solid rgba(255, 255, 255, 0.08)',
                backgroundColor: isActive ? 'rgba(245, 158, 11, 0.22)' : 'rgba(15, 23, 42, 0.75)',
                color: isActive ? '#fef08a' : '#94a3b8',
                boxShadow: isActive ? '0 4px 14px rgba(245, 158, 11, 0.25)' : 'none'
              }}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Gigs Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))', gap: '20px' }}>
        {filteredGigs.map((gig) => {
          const catInfo = getCategoryBadge(gig.category);
          return (
            <div
              key={gig.id}
              style={{
                backgroundColor: 'rgba(15, 23, 42, 0.85)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '22px',
                padding: '24px',
                boxShadow: '0 15px 35px rgba(0, 0, 0, 0.35)',
                backdropFilter: 'blur(16px)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '18px',
                transition: 'all 0.2s'
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {/* Header Info */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <span
                      style={{
                        alignSelf: 'flex-start',
                        padding: '3px 10px',
                        borderRadius: '8px',
                        fontSize: '0.7rem',
                        fontWeight: 800,
                        backgroundColor: catInfo.bg,
                        color: catInfo.text,
                        border: `1px solid ${catInfo.border}`
                      }}
                    >
                      {catInfo.label}
                    </span>
                    <h3 style={{ fontSize: '1.12rem', fontWeight: 800, color: '#ffffff', lineHeight: 1.35, margin: '2px 0 0 0' }}>
                      {gig.title}
                    </h3>
                    <div style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Building size={13} color="#64748b" />
                      <span>Sponsor: <strong style={{ color: '#cbd5e1' }}>{gig.sponsorOrganization}</strong></span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px', flexShrink: 0 }}>
                    <div
                      style={{
                        padding: '6px 12px',
                        borderRadius: '12px',
                        backgroundColor: 'rgba(245, 158, 11, 0.15)',
                        border: '1px solid rgba(245, 158, 11, 0.3)',
                        color: '#fbbf24',
                        fontWeight: 900,
                        fontSize: '1.05rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <Coins size={16} />
                      {gig.bountyStudyCoins} <span style={{ fontSize: '0.7rem', color: '#fef08a' }}>Coins</span>
                    </div>
                    <span style={{ fontSize: '0.7rem', color: '#67e8f9', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                      <Clock size={11} /> {gig.deadlineHours}h Sprint
                    </span>
                  </div>
                </div>

                {/* Deliverables Checklist */}
                <div
                  style={{
                    backgroundColor: 'rgba(2, 6, 23, 0.6)',
                    padding: '14px 16px',
                    borderRadius: '14px',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px'
                  }}
                >
                  <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Deliverables & Requirements:
                  </div>
                  <ul style={{ margin: 0, paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.82rem', color: '#cbd5e1', lineHeight: 1.4 }}>
                    {gig.requirements.map((req, idx) => (
                      <li key={idx} style={{ color: '#e2e8f0' }}>
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Bottom Actions & Escrow State */}
              <div
                style={{
                  borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                  paddingTop: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '10px'
                }}
              >
                <span
                  style={{
                    padding: '4px 12px',
                    borderRadius: '10px',
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    backgroundColor: gig.escrowStatus === 'RELEASED_TO_STUDENT' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                    color: gig.escrowStatus === 'RELEASED_TO_STUDENT' ? '#34d399' : '#fef08a',
                    border: gig.escrowStatus === 'RELEASED_TO_STUDENT' ? '1px solid rgba(16, 185, 129, 0.35)' : '1px solid rgba(245, 158, 11, 0.35)'
                  }}
                >
                  <Lock size={12} />
                  {gig.escrowStatus.replace(/_/g, ' ')}
                </span>

                {gig.status === 'OPEN' && (
                  <button
                    onClick={() => setSelectedGig(gig)}
                    style={{
                      padding: '9px 18px',
                      borderRadius: '12px',
                      background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                      color: '#ffffff',
                      fontWeight: 800,
                      fontSize: '0.8rem',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      boxShadow: '0 4px 14px rgba(245, 158, 11, 0.35)'
                    }}
                  >
                    <GitPullRequest size={14} /> Submit PR
                  </button>
                )}

                {(gig.status === 'SUBMITTED' || gig.status === 'IN_SPRINT') && (
                  <button
                    onClick={() => handleReleaseEscrow(gig.id, gig.bountyStudyCoins)}
                    style={{
                      padding: '9px 18px',
                      borderRadius: '12px',
                      background: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
                      color: '#ffffff',
                      fontWeight: 800,
                      fontSize: '0.8rem',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      boxShadow: '0 4px 14px rgba(16, 185, 129, 0.35)'
                    }}
                  >
                    <CheckCircle2 size={14} /> Release Escrow (+XP)
                  </button>
                )}

                {gig.status === 'APPROVED' && (
                  <span
                    style={{
                      fontSize: '0.78rem',
                      fontWeight: 800,
                      color: '#34d399',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      backgroundColor: 'rgba(16, 185, 129, 0.1)',
                      padding: '6px 12px',
                      borderRadius: '10px',
                      border: '1px solid rgba(16, 185, 129, 0.3)'
                    }}
                  >
                    <Award size={14} /> Credential Issued
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Proof of Work Submission Modal */}
      {selectedGig && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            backgroundColor: 'rgba(0, 0, 0, 0.78)',
            backdropFilter: 'blur(12px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px'
          }}
        >
          <div
            style={{
              backgroundColor: '#0f172a',
              border: '1px solid rgba(245, 158, 11, 0.4)',
              borderRadius: '24px',
              maxWidth: '560px',
              width: '100%',
              padding: '28px',
              display: 'flex',
              flexDirection: 'column',
              gap: '18px',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.85)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '14px' }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
                  Submit Proof-of-Work
                </h3>
                <p style={{ fontSize: '0.78rem', color: '#fbbf24', margin: '3px 0 0 0', fontWeight: 600 }}>
                  {selectedGig.title}
                </p>
              </div>
              <button
                onClick={() => setSelectedGig(null)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  padding: '4px'
                }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#cbd5e1' }}>
                GitHub Pull Request / Commit URL
              </label>
              <input
                type="text"
                value={prUrl}
                onChange={(e) => setPrUrl(e.target.value)}
                placeholder="https://github.com/org/repo/pull/123"
                style={{
                  width: '100%',
                  boxSizing: 'border-box',
                  backgroundColor: 'rgba(2, 6, 23, 0.8)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '12px',
                  padding: '10px 14px',
                  fontSize: '0.85rem',
                  color: '#ffffff',
                  fontFamily: 'monospace',
                  outline: 'none'
                }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#cbd5e1' }}>
                Implementation & Verification Notes
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                placeholder="Summary of benchmark results, reproduction steps, test suites passed..."
                style={{
                  width: '100%',
                  boxSizing: 'border-box',
                  backgroundColor: 'rgba(2, 6, 23, 0.8)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '12px',
                  padding: '12px 14px',
                  fontSize: '0.85rem',
                  color: '#ffffff',
                  outline: 'none',
                  resize: 'vertical'
                }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px', paddingTop: '8px' }}>
              <button
                onClick={() => setSelectedGig(null)}
                style={{
                  padding: '9px 16px',
                  backgroundColor: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#94a3b8',
                  borderRadius: '10px',
                  fontSize: '0.8rem',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitProof}
                disabled={isSubmitting || !prUrl.trim()}
                style={{
                  padding: '9px 20px',
                  background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                  color: '#ffffff',
                  borderRadius: '10px',
                  fontSize: '0.8rem',
                  fontWeight: 800,
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(245, 158, 11, 0.35)',
                  opacity: isSubmitting || !prUrl.trim() ? 0.5 : 1
                }}
              >
                {isSubmitting ? 'Verifying PR...' : 'Submit for Escrow Release (+50 XP)'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MicroInternshipEscrowView;
