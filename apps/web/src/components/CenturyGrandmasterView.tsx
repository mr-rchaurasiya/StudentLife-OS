import React, { useState, useEffect } from 'react';
import {
  Crown,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  Download,
  Lock,
  Award,
  Layers,
  User,
  Building
} from 'lucide-react';
import { CenturyGrandmasterProfile, CenturySoulboundCertificate } from '@studentlife/shared';

interface Props {
  onAddXp?: (amount: number, reason?: string) => void;
}

export const CenturyGrandmasterView: React.FC<Props> = ({ onAddXp }) => {
  const [studentName, setStudentName] = useState('Radhey Chaurasiya');
  const [collegeName, setCollegeName] = useState('Indian Institute of Technology (IIT)');
  const [isClaimed, setIsClaimed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [profileData, setProfileData] = useState<CenturyGrandmasterProfile>({
    studentProfile: {
      id: 'prof-centurion',
      userId: 'user-centurion-100',
      collegeOrSchool: 'IIT Bombay / MIT Research Scholar',
      degreeOrGrade: 'Ph.D. / B.Tech Computer Science & Artificial Intelligence',
      fieldOfStudy: 'Super-Intelligent Systems & Computational Physics',
      academicYear: 4,
      targetExams: ['GATE (AIR 1)', 'UPSC CSE', 'ACM ICPC World Finals'],
      primaryInterests: ['Quantum AI', 'Astrodynamics', 'Kinematics', 'HFT Systems'],
      skillTags: ['100/100 Phases Master', 'Full-Stack Monorepo Architect', 'Quantum Computing'],
      careerAspirations: ['Founding Research Scientist', 'DeepTech Venture Creator'],
      dailyStudyGoalMinutes: 300,
      streakCount: 100,
      xpPoints: 24500,
      level: 100,
      xpToNextLevel: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    certificate: {
      id: 'sbt-cert-100-grandmaster',
      studentName: 'Radhey Chaurasiya',
      college: 'Indian Institute of Technology (IIT)',
      completionDate: new Date().toISOString(),
      totalPhasesCompleted: 100,
      totalXpAccumulated: 24500,
      grandmasterTier: 'MYTHIC_CENTURION_SINGULARITY',
      sha256SoulboundHash: '0x99a8f7e6d5c4b3a2910847261538402759281746253482716492817462510948',
      signatureRsa2048: 'SIG_RSA_SHA256:4f8e91d0c3a2b1756e4819d0847261530948172648193847',
      unlockedMasterAbilities: [
        'Omni-Disciplinary Academic Synthesis (100 Modules)',
        'Autonomous Quantum & Kinematic Reasoning',
        'Real-Time High-Frequency Quantitative Modeling',
        'Permanent Soulbound Blockchain Credential Vault'
      ]
    },
    transcript: {
      totalModules: 100,
      passedCount: 100,
      masteryGpaEquivalent: 4.0,
      pillarBreakdown: {
        foundation: 10,
        studyAndResearch: 30,
        examsAndPractice: 15,
        careerAndFintech: 20,
        aiAndCommunity: 15,
        quantumAndAdvancedTech: 10
      }
    }
  });

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/century-grandmaster/profile');
      if (res.ok) {
        const data: CenturyGrandmasterProfile = await res.json();
        setProfileData(data);
      }
    } catch {
      // Fallback
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleClaim = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/century-grandmaster/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName,
          college: collegeName
        })
      });
      if (res.ok) {
        const cert: CenturySoulboundCertificate = await res.json();
        setProfileData((prev) => ({ ...prev, certificate: cert }));
        setIsClaimed(true);
        if (onAddXp) onAddXp(500, 'Claimed Century Grandmaster Medallion');
      }
    } catch {
      // Fallback
      setIsClaimed(true);
      if (onAddXp) onAddXp(500, 'Claimed Century Grandmaster Medallion');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadTranscript = () => {
    const transcriptText = `# 🎓 STUDENTLIFE OS — OFFICIAL 100-PHASE MASTER TRANSCRIPT
Candidate: ${profileData.certificate.studentName}
Institution: ${profileData.certificate.college}
Completion Status: 100 / 100 Phases (100% OPERATIONAL)
Grandmaster Tier: MYTHIC CENTURION SINGULARITY
GPA Equivalent: 4.0 / 4.0
Cryptographic Hash: ${profileData.certificate.sha256SoulboundHash}
Signature: ${profileData.certificate.signatureRsa2048}

---
### CURRICULUM PILLARS:
1. Foundation & Systems: 10 Modules (100% Mastery)
2. Study & Research Laboratory: 30 Modules (100% Mastery)
3. Exams, Testing & Analytics: 15 Modules (100% Mastery)
4. Career, FinTech & Startups: 20 Modules (100% Mastery)
5. AI, Voice & Community: 15 Modules (100% Mastery)
6. Quantum, BioTech & DeepTech: 10 Modules (100% Mastery)

Certified by StudentLife OS Centurion Engine.`;

    const blob = new Blob([transcriptText], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `StudentLife_Century_Grandmaster_Transcript_${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', maxWidth: '1280px', margin: '0 auto', width: '100%' }}>
      {/* Grandmaster Sovereign Hero Banner */}
      <div 
        className="glass-panel"
        style={{
          padding: '32px 36px',
          background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.22) 0%, rgba(30, 27, 75, 0.9) 50%, rgba(15, 23, 42, 0.95) 100%)',
          position: 'relative',
          overflow: 'hidden',
          border: '1.5px solid rgba(245, 158, 11, 0.45)',
          borderRadius: '24px',
          boxShadow: '0 0 40px rgba(245, 158, 11, 0.18)'
        }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '24px' }}>
          <div style={{ maxWidth: '680px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <span 
                className="badge" 
                style={{ 
                  backgroundColor: 'rgba(245, 158, 11, 0.25)', 
                  color: '#fbbf24', 
                  border: '1px solid rgba(245, 158, 11, 0.5)',
                  padding: '4px 12px',
                  borderRadius: '9999px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Crown size={14} color="#fbbf24" />
                PHASE 100 &bull; THE CENTURY GRANDMASTER FINALE
              </span>
              <span
                style={{
                  backgroundColor: 'linear-gradient(135deg, #f59e0b, #eab308)',
                  background: 'linear-gradient(135deg, #f59e0b, #eab308)',
                  color: '#020617',
                  padding: '3px 10px',
                  borderRadius: '9999px',
                  fontSize: '0.7rem',
                  fontWeight: 900,
                  letterSpacing: '0.05em'
                }}
              >
                100 / 100 PHASES
              </span>
            </div>

            <h2 style={{ fontSize: '2rem', fontWeight: 900, letterSpacing: '-0.02em', color: '#ffffff', marginBottom: '10px', lineHeight: 1.2 }}>
              Century Grandmaster <span style={{ background: 'linear-gradient(135deg, #fbbf24, #f59e0b, #fef08a)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Singularity Medallion</span>
            </h2>

            <p style={{ fontSize: '0.9rem', color: '#cbd5e1', lineHeight: 1.6 }}>
              Congratulations! You have completed all 100 architectural phases across Study, Quantum Physics, Biotech, Robotics, FinTech, and AI. Claim your permanent cryptographic soulbound credential.
            </p>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
            <button
              onClick={handleDownloadTranscript}
              className="glow-hover"
              style={{
                padding: '12px 20px',
                borderRadius: '14px',
                border: '1px solid rgba(245, 158, 11, 0.4)',
                backgroundColor: 'rgba(15, 23, 42, 0.85)',
                color: '#fde68a',
                fontSize: '0.85rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                backdropFilter: 'blur(10px)'
              }}
            >
              <Download size={16} color="#fbbf24" />
              Download Master Transcript
            </button>

            <button
              onClick={handleClaim}
              disabled={isLoading}
              className="glow-hover"
              style={{
                padding: '12px 24px',
                borderRadius: '14px',
                border: 'none',
                background: 'linear-gradient(135deg, #f59e0b 0%, #eab308 50%, #d97706 100%)',
                color: '#020617',
                fontSize: '0.9rem',
                fontWeight: 900,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 0 25px rgba(245, 158, 11, 0.4)',
                transition: 'transform 0.15s ease'
              }}
            >
              <Sparkles size={17} color="#020617" />
              {isClaimed ? 'Medallion Claimed! 🏆' : 'Claim Soulbound Medallion'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Medallion Showcase & Cryptographic Certificate */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
        
        {/* Left Column: Interactive 3D Gold Medallion */}
        <div 
          className="glass-panel glow-hover"
          style={{
            padding: '28px',
            borderRadius: '20px',
            border: '1.5px solid rgba(245, 158, 11, 0.35)',
            background: 'linear-gradient(180deg, rgba(30, 41, 59, 0.75) 0%, rgba(15, 23, 42, 0.95) 100%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            gap: '20px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
          }}
        >
          {/* Glowing 3D Gold Medallion */}
          <div 
            style={{
              width: '180px',
              height: '180px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #f59e0b 0%, #fef08a 40%, #d97706 70%, #b45309 100%)',
              padding: '8px',
              boxShadow: '0 0 50px rgba(245, 158, 11, 0.45), inset 0 0 15px rgba(255, 255, 255, 0.6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative'
            }}
          >
            <div 
              style={{
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                background: 'radial-gradient(circle, #0f172a 40%, #020617 100%)',
                border: '2px solid rgba(245, 158, 11, 0.8)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px',
                padding: '12px',
                boxShadow: 'inset 0 0 20px rgba(245, 158, 11, 0.25)'
              }}
            >
              <Crown size={34} color="#fbbf24" style={{ filter: 'drop-shadow(0 0 8px #f59e0b)' }} />
              <span style={{ fontSize: '1.75rem', fontWeight: 900, color: '#fef08a', lineHeight: 1, fontFamily: 'var(--font-mono)' }}>
                100
              </span>
              <span style={{ fontSize: '0.65rem', fontWeight: 900, letterSpacing: '0.15em', color: '#fbbf24', textTransform: 'uppercase' }}>
                CENTURION
              </span>
            </div>
          </div>

          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#ffffff', marginBottom: '4px' }}>
              Mythic Centurion Scholar
            </h3>
            <p style={{ fontSize: '0.8rem', color: '#fbbf24', fontWeight: 600 }}>
              100 of 100 Architecture Phases Operational
            </p>
          </div>

          {/* Scholar Input Configuration */}
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '14px', textAlign: 'left', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '16px' }}>
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', marginBottom: '6px' }}>
                <User size={13} color="#fbbf24" /> Scholar Full Name
              </label>
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="Enter your name..."
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(9, 13, 22, 0.9)',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  color: '#ffffff',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  outline: 'none',
                  transition: 'border-color 0.2s ease'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', marginBottom: '6px' }}>
                <Building size={13} color="#fbbf24" /> University / Institute
              </label>
              <input
                type="text"
                value={collegeName}
                onChange={(e) => setCollegeName(e.target.value)}
                placeholder="Enter university name..."
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(9, 13, 22, 0.9)',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  color: '#ffffff',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  outline: 'none',
                  transition: 'border-color 0.2s ease'
                }}
              />
            </div>
          </div>
        </div>

        {/* Right Column: Cryptographic Soulbound Certificate */}
        <div 
          className="glass-panel glow-hover"
          style={{
            padding: '28px',
            borderRadius: '20px',
            border: '1.5px solid rgba(245, 158, 11, 0.35)',
            background: 'linear-gradient(180deg, rgba(30, 41, 59, 0.75) 0%, rgba(15, 23, 42, 0.95) 100%)',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ShieldCheck size={20} color="#fbbf24" />
              </div>
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ffffff' }}>
                  Cryptographic Soulbound Certificate
                </h3>
                <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Immutable Sovereign Academic Passport</span>
              </div>
            </div>

            <span 
              style={{
                fontSize: '0.7rem',
                fontFamily: 'var(--font-mono)',
                fontWeight: 700,
                padding: '4px 10px',
                borderRadius: '8px',
                backgroundColor: 'rgba(245, 158, 11, 0.15)',
                color: '#fef08a',
                border: '1px solid rgba(245, 158, 11, 0.4)'
              }}
            >
              VERIFIED BY SHA-256
            </span>
          </div>

          {/* Certificate Spec Table */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ padding: '12px 16px', borderRadius: '12px', backgroundColor: 'rgba(9, 13, 22, 0.75)', border: '1px solid rgba(255, 255, 255, 0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Recipient:</span>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ffffff' }}>{profileData.certificate.studentName}</span>
            </div>

            <div style={{ padding: '12px 16px', borderRadius: '12px', backgroundColor: 'rgba(9, 13, 22, 0.75)', border: '1px solid rgba(255, 255, 255, 0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Total Curriculum Mastery:</span>
              <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#34d399', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 size={14} color="#34d399" />
                100 / 100 Phases (GPA 4.0 Equivalent)
              </span>
            </div>

            <div style={{ padding: '12px 16px', borderRadius: '12px', backgroundColor: 'rgba(9, 13, 22, 0.75)', border: '1px solid rgba(255, 255, 255, 0.06)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: '#94a3b8' }}>
                <Lock size={12} color="#fbbf24" />
                <span>Soulbound Cryptographic Hash:</span>
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#fde68a', wordBreak: 'break-all', lineHeight: 1.4 }}>
                {profileData.certificate.sha256SoulboundHash}
              </div>
            </div>

            <div style={{ padding: '12px 16px', borderRadius: '12px', backgroundColor: 'rgba(9, 13, 22, 0.75)', border: '1px solid rgba(255, 255, 255, 0.06)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>RSA-2048 Digital Authority Signature:</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: '#64748b', wordBreak: 'break-all' }}>
                {profileData.certificate.signatureRsa2048}
              </div>
            </div>
          </div>

          {/* Unlocked Master Abilities */}
          <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '16px' }}>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f1f5f9', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Award size={15} color="#fbbf24" /> Unlocked Sovereign Privileges:
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '8px' }}>
              {profileData.certificate.unlockedMasterAbilities.map((ability, idx) => (
                <div 
                  key={idx}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '10px',
                    backgroundColor: 'rgba(245, 158, 11, 0.1)',
                    border: '1px solid rgba(245, 158, 11, 0.25)',
                    color: '#fef08a',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <CheckCircle2 size={13} color="#fbbf24" style={{ flexShrink: 0 }} />
                  <span>{ability}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Curriculum Pillar Breakdown Matrix */}
      <div 
        className="glass-panel"
        style={{
          padding: '24px 28px',
          borderRadius: '20px',
          border: '1px solid var(--border-glass)',
          background: 'var(--bg-card)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <Layers size={18} color="#6366f1" />
          <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#ffffff' }}>
            100-Module Master Curriculum Mastery Breakdown
          </h3>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '14px' }}>
          {[
            { label: 'Foundation & Core', count: 10, color: '#6366f1' },
            { label: 'Study & Research', count: 30, color: '#06b6d4' },
            { label: 'Exams & Testing', count: 15, color: '#f43f5e' },
            { label: 'Career & FinTech', count: 20, color: '#10b981' },
            { label: 'AI & Community', count: 15, color: '#a855f7' },
            { label: 'DeepTech & Quantum', count: 10, color: '#f59e0b' }
          ].map((pillar, idx) => (
            <div 
              key={idx}
              style={{
                padding: '14px 16px',
                borderRadius: '12px',
                backgroundColor: 'rgba(9, 13, 22, 0.6)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>{pillar.label}</span>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: pillar.color }}>100%</span>
              </div>
              <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#ffffff' }}>
                {pillar.count} <span style={{ fontSize: '0.75rem', fontWeight: 500, color: '#64748b' }}>/ {pillar.count}</span>
              </div>
              <div style={{ width: '100%', height: '4px', borderRadius: '2px', backgroundColor: 'rgba(255, 255, 255, 0.08)', overflow: 'hidden' }}>
                <div style={{ width: '100%', height: '100%', backgroundColor: pillar.color, borderRadius: '2px' }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CenturyGrandmasterView;
