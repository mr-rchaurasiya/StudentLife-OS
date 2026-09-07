import React, { useState, useEffect } from 'react';
import {
  Award,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Copy,
  Plus,
  Trophy
} from 'lucide-react';
import {
  VerifiedPassportSummary,
  GenerateCredentialDto
} from '@studentlife/shared';

interface SkillPassportCredentialViewProps {
  onAddXp?: (xp: number, reason: string) => void;
}

export const SkillPassportCredentialView: React.FC<SkillPassportCredentialViewProps> = ({ onAddXp }) => {
  const [passport, setPassport] = useState<VerifiedPassportSummary | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showMintModal, setShowMintModal] = useState<boolean>(false);
  const [titleInput, setTitleInput] = useState<string>('GATE 2027 Algorithms & Distributed Systems Laureate');
  const [skillsInput, setSkillsInput] = useState<string>('Dynamic Programming, Concurrency, System Design');
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  useEffect(() => {
    fetchPassport();
  }, []);

  const fetchPassport = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/skill-passport/summary');
      const data = await res.json();
      if (data.success && data.data) {
        setPassport(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch skill passport', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMintCredential = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const dto: GenerateCredentialDto = {
        credentialTitle: titleInput,
        skills: skillsInput.split(',').map(s => s.trim()).filter(Boolean)
      };
      const res = await fetch('/api/skill-passport/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dto)
      });
      const data = await res.json();
      if (data.success && data.data) {
        setShowMintModal(false);
        fetchPassport();
        onAddXp?.(50, 'Minted Verifiable Academic Skill Certificate');
      }
    } catch (err) {
      console.error('Failed to mint credential', err);
    }
  };

  const copyToClipboard = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  if (isLoading || !passport) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
        <Award size={36} className="animate-pulse" style={{ margin: '0 auto 16px', color: 'var(--accent-primary)' }} />
        <p>Loading Cryptographic Academic Skill Passport...</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Banner with 50-Phase Grandmaster Trophy */}
      <div className="glass-panel" style={{
        padding: '28px 32px',
        background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(30, 27, 75, 0.8) 100%)',
        position: 'relative',
        overflow: 'hidden',
        border: '1px solid rgba(245, 158, 11, 0.3)'
      }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '20px' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span className="badge badge-active" style={{ backgroundColor: 'rgba(245, 158, 11, 0.25)', color: '#fbbf24' }}>
                <Trophy size={12} /> PHASE 50 &bull; GRANDMASTER VERIFIED VAULT 🏆
              </span>
              <span className="badge badge-completed">
                <ShieldCheck size={12} /> SHA-256 Cryptographic Proof
              </span>
            </div>
            <h2 style={{ fontSize: '1.9rem', fontWeight: 800 }}>
              Verifiable Academic <span className="gradient-text">Skill Passport 🎖️</span>
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
              Cryptographically signed proof of mock test percentiles, completed syllabus milestones, and verified coding proficiencies.
            </p>
          </div>

          <button
            onClick={() => setShowMintModal(true)}
            className="btn btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', fontSize: '0.9rem' }}
          >
            <Plus size={16} /> Mint Digital Credential
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <div className="glass-panel" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(245, 158, 11, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fbbf24' }}>
            <Trophy size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Percentile Rank</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fbbf24' }}>Top {passport.topRankPercentile}%</div>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(16, 185, 129, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#34d399' }}>
            <ShieldCheck size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Verified Credentials</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>{passport.totalCredentialsIssued} Issued</div>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(99, 102, 241, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#818cf8' }}>
            <Sparkles size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Mastery Badges</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#818cf8' }}>{passport.totalVerifiedBadges} Badges</div>
          </div>
        </div>
      </div>

      {/* Credentials Cards List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Award size={20} color="var(--accent-primary)" />
          Signed Academic Digital Certificates
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px' }}>
          {passport.credentials.map(cred => (
            <div
              key={cred.id}
              className="glass-panel glow-hover"
              style={{
                padding: '24px',
                borderRadius: 'var(--radius-lg)',
                borderTop: '3px solid #fbbf24',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '16px',
                backgroundColor: 'rgba(15, 23, 42, 0.8)'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.05em', color: '#fbbf24' }}>
                    {cred.level}
                  </span>
                  <span className="badge badge-completed">
                    <CheckCircle2 size={11} /> {cred.status}
                  </span>
                </div>

                <h4 style={{ fontSize: '1.15rem', fontWeight: 800, lineHeight: 1.4, marginBottom: '6px' }}>
                  {cred.credentialTitle}
                </h4>

                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
                  Issued to: <strong style={{ color: 'var(--text-primary)' }}>{cred.studentName}</strong> &bull; {cred.issuedDate}
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
                  {cred.verifiedSkills.map((skill, sIdx) => (
                    <span
                      key={sIdx}
                      style={{
                        fontSize: '0.7rem',
                        fontWeight: 600,
                        padding: '3px 8px',
                        borderRadius: '4px',
                        backgroundColor: 'rgba(99, 102, 241, 0.15)',
                        color: '#a5b4fc',
                        border: '1px solid rgba(99, 102, 241, 0.3)'
                      }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{
                padding: '10px 12px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'rgba(9, 13, 22, 0.9)',
                border: '1px solid var(--border-glass)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                    SHA-256 IMMUTABLE PROOF
                  </span>
                  <button
                    onClick={() => copyToClipboard(cred.sha256VerificationHash)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: copiedHash === cred.sha256VerificationHash ? '#34d399' : 'var(--text-muted)',
                      cursor: 'pointer',
                      fontSize: '0.65rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <Copy size={10} />
                    {copiedHash === cred.sha256VerificationHash ? 'Copied!' : 'Copy Hash'}
                  </button>
                </div>
                <div style={{
                  fontSize: '0.7rem',
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--text-secondary)',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>
                  {cred.sha256VerificationHash}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '8px', borderTop: '1px solid var(--border-glass)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  +{cred.xpMilestoneReached.toLocaleString()} XP Milestone
                </span>
                <a
                  href={cred.publicVerificationUrl}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: 'var(--accent-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    textDecoration: 'none'
                  }}
                >
                  Public Verify Link <ExternalLink size={12} />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mint Credential Modal */}
      {showMintModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '480px', padding: '32px' }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '8px' }}>
              Mint Cryptographic Credential 🎖️
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>
              Creates a signed SHA-256 verifiable certificate for academic and placement portfolios.
            </p>

            <form onSubmit={handleMintCredential} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                  Credential Title
                </label>
                <input
                  type="text"
                  value={titleInput}
                  onChange={(e) => setTitleInput(e.target.value)}
                  className="glass-input"
                  style={{ width: '100%', padding: '10px 14px' }}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                  Verified Skills (comma separated)
                </label>
                <input
                  type="text"
                  value={skillsInput}
                  onChange={(e) => setSkillsInput(e.target.value)}
                  className="glass-input"
                  style={{ width: '100%', padding: '10px 14px' }}
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
                <button
                  type="button"
                  onClick={() => setShowMintModal(false)}
                  className="btn btn-secondary"
                  style={{ padding: '8px 18px', fontSize: '0.85rem' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ padding: '8px 20px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Award size={14} /> Mint Credential
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
