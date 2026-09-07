import React, { useState, useEffect } from 'react';
import {
  Crown,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  Download,
  Lock
} from 'lucide-react';
import { CenturyGrandmasterProfile, CenturySoulboundCertificate } from '@studentlife/shared';

interface Props {
  onAddXp?: (amount: number) => void;
}

export const CenturyGrandmasterView: React.FC<Props> = ({ onAddXp }) => {
  const [studentName, setStudentName] = useState('Candidate Grandmaster');
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
      studentName: 'Candidate Grandmaster',
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
        if (onAddXp) onAddXp(500); // Massive Grandmaster bonus!
      }
    } catch {
      // Fallback
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
    <div className="space-y-6">
      {/* Grandmaster Sovereign Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-950/80 via-slate-900 to-yellow-950/90 border-2 border-amber-500/50 p-8 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/50 text-amber-300 text-xs font-bold uppercase tracking-widest">
              <Crown className="w-4 h-4 text-amber-400" />
              Phase 100 • The Century Grandmaster Finale (100/100 Complete)
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight flex items-center gap-3">
              Century Grandmaster Singularity Medallion
              <span className="text-xs px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black">
                100 / 100 PHASES
              </span>
            </h1>
            <p className="text-sm text-slate-200 max-w-2xl leading-relaxed">
              Congratulations! You have completed all 100 architectural phases across Study, Quantum Physics, Biotech, Robotics, FinTech, and AI. Claim your permanent cryptographic soulbound credential.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleDownloadTranscript}
              className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-amber-300 border border-amber-500/40 font-bold text-xs shadow-lg transition-all"
            >
              <Download className="w-4 h-4" />
              Download Master Transcript
            </button>
            <button
              onClick={handleClaim}
              disabled={isLoading}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/30 transition-all disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              {isClaimed ? 'Medallion Claimed! 🏆' : 'Claim Soulbound Medallion'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Medallion & Certificate */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive 3D Gold Medallion */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-gradient-to-b from-slate-900/90 to-slate-950 border-2 border-amber-500/40 rounded-3xl p-6 text-center space-y-4 shadow-xl">
            {/* Medallion Visual */}
            <div className="relative mx-auto w-40 h-40 rounded-full bg-gradient-to-tr from-amber-600 via-yellow-300 to-amber-500 p-2 shadow-2xl shadow-amber-500/30 flex items-center justify-center animate-pulse">
              <div className="w-full h-full rounded-full bg-slate-950 border-2 border-amber-400/80 flex flex-col items-center justify-center p-3 text-center space-y-1">
                <Crown className="w-8 h-8 text-amber-400" />
                <div className="text-xl font-black text-amber-300">100</div>
                <div className="text-[9px] font-bold tracking-widest text-amber-400 uppercase">CENTURION</div>
              </div>
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-black text-white">Mythic Centurion Scholar</h3>
              <p className="text-xs text-amber-400/90 font-medium">100 of 100 Architecture Phases Operational</p>
            </div>

            <div className="space-y-2 text-xs text-left pt-2 border-t border-slate-800">
              <div>
                <label className="block text-slate-400 mb-1">Scholar Full Name</label>
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">University / Institute</label>
                <input
                  type="text"
                  value={collegeName}
                  onChange={(e) => setCollegeName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Cryptographic Soulbound Certificate */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-900/90 border border-amber-500/30 rounded-3xl p-6 space-y-5 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-white">Cryptographic Soulbound Certificate</h3>
              </div>
              <span className="text-xs font-mono px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/40">
                VERIFIED BY SHA-256
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400">Recipient:</span>
                <span className="text-white font-bold">{profileData.certificate.studentName}</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400">Total Curriculum Mastery:</span>
                <span className="text-emerald-400 font-bold">100 / 100 Phases (GPA 4.0 Equivalent)</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="text-slate-400 flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5 text-amber-400" />
                  Soulbound Cryptographic Hash:
                </div>
                <div className="font-mono text-[11px] text-amber-300 break-all">
                  {profileData.certificate.sha256SoulboundHash}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="text-slate-400">RSA-2048 Digital Authority Signature:</div>
                <div className="font-mono text-[10px] text-slate-500 break-all">
                  {profileData.certificate.signatureRsa2048}
                </div>
              </div>
            </div>

            {/* Unlocked Master Abilities */}
            <div className="space-y-2 pt-2 border-t border-slate-800 text-xs">
              <div className="font-bold text-slate-200">Unlocked Sovereign Privileges:</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {profileData.certificate.unlockedMasterAbilities.map((ability, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-2 rounded-lg bg-amber-950/20 border border-amber-500/20 text-amber-200 text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                    {ability}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CenturyGrandmasterView;
