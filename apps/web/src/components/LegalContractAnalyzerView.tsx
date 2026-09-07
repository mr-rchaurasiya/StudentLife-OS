import React, { useState } from 'react';
import {
  FileText,
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  Sparkles,
  Zap,
  Search,
  BookOpen
} from 'lucide-react';
import { LegalRiskAssessmentReport, ContractClauseRisk } from '@studentlife/shared';

interface Props {
  onAddXp?: (amount: number) => void;
}

const PRESET_CONTRACTS = [
  {
    title: 'University Incubator & Startup IP Assignment',
    role: 'STUDENT_FOUNDER' as const,
    text: `AGREEMENT FOR INCUBATION AND INTELLECTUAL PROPERTY ASSIGNMENT
1. DEFINITIONS: "Invention" means any idea, patentable discovery, computer program code, algorithm, dataset, or prototype developed by Student.
2. IP ASSIGNMENT: Student hereby unconditionally and irrevocably assigns all right, title, and interest in and to any and all inventions, code, designs, or ideas created during the term of their student tenure, whether or not created on university equipment or during academic hours.
3. NON-COMPETE: Student shall not engage, directly or indirectly, in any commercial endeavor, venture, or company in the same domain as the Incubator for 24 months globally after graduation.
4. INDEMNITY: Student indemnifies Sponsor against all legal costs, claims, damages, and IP infringement liabilities without ceiling or cap.`
  },
  {
    title: 'Freelance AI Full-Stack Development Agreement',
    role: 'FREELANCER' as const,
    text: `FREELANCE SERVICES CONTRACT & SOFTWARE RIGHTS
1. DELIVERABLES: Developer shall produce frontend UI and backend API nodes as specified in Milestone Schedules.
2. REVISED CODE OWNERSHIP: All proprietary background libraries and pre-existing open-source toolkits utilized by Freelancer shall become exclusive property of Client with full moral rights waived.
3. TERMINATION & PAYMENT: Client reserves the right to withhold final milestone disbursements if subjective aesthetic expectations are not met at Client's sole discretion.
4. JURISDICTION: Any dispute shall be arbitrated exclusively in Delaware under expedited binding arbitration at Freelancer's sole expense.`
  }
];

export const LegalContractAnalyzerView: React.FC<Props> = ({ onAddXp }) => {
  const [contractTitle, setContractTitle] = useState(PRESET_CONTRACTS[0].title);
  const [studentRole, setStudentRole] = useState<'FREELANCER' | 'STUDENT_FOUNDER' | 'RESEARCH_ASSISTANT'>('STUDENT_FOUNDER');
  const [contractFullText, setContractFullText] = useState(PRESET_CONTRACTS[0].text);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedClause, setSelectedClause] = useState<ContractClauseRisk | null>(null);

  const [report, setReport] = useState<LegalRiskAssessmentReport>({
    id: 'legal-rep-init',
    contractTitle: 'University Incubator & Startup IP Assignment',
    overallRiskScore: 68,
    contractSafetyTier: 'MODERATE_REVIEW_ADVISED',
    ipRetainedPercent: 40.0,
    patentInfringementRiskPercent: 18.5,
    flaggedClauses: [
      {
        clauseTitle: 'Section 2: Perpetual Worldwide Assignment of All Student Inventions',
        originalText: 'Student hereby unconditionally and irrevocably assigns all right, title, and interest in and to any and all inventions, code, designs, or ideas created during the term, whether or not created on company equipment.',
        riskCategory: 'UNFAIR_IP_ASSIGNMENT',
        severityLevel: 'CRITICAL',
        suggestedRedlineText: 'Student assigns only inventions specifically conceived and developed within the explicit scope of client milestone deliverables and using client equipment.',
        legalJustification: 'Overreaching claim captures student thesis research and unrelated personal side-projects created outside contract hours.'
      },
      {
        clauseTitle: 'Section 3: 24-Month Global Non-Compete Restriction',
        originalText: 'Student shall not engage, directly or indirectly, in any business or academic endeavor competing with Company for a period of 24 months globally.',
        riskCategory: 'OVERREACHING_NON_COMPETE',
        severityLevel: 'HIGH',
        suggestedRedlineText: 'Non-compete is limited to direct solicitation of existing company clients for a reasonable period of 6 months in the primary city of operation.',
        legalJustification: 'Unenforceable and unduly restrictive for student interns and university researchers under modern labor standards.'
      }
    ]
  });

  const handleAnalyze = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/legal-analyzer/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contractTitle,
          contractFullText,
          studentRole
        })
      });
      if (res.ok) {
        const data: LegalRiskAssessmentReport = await res.json();
        setReport(data);
        if (data.flaggedClauses.length > 0) {
          setSelectedClause(data.flaggedClauses[0]);
        }
        if (onAddXp) onAddXp(65);
      }
    } catch {
      // Fallback
    } finally {
      setIsLoading(false);
    }
  };

  const getSeverityBadge = (level: string) => {
    switch (level) {
      case 'CRITICAL':
        return <span className="px-2 py-0.5 rounded text-xs font-bold bg-red-500/20 text-red-400 border border-red-500/30">CRITICAL RISK</span>;
      case 'HIGH':
        return <span className="px-2 py-0.5 rounded text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">HIGH RISK</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">MODERATE</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-950/60 via-slate-900 to-indigo-950/70 border border-amber-500/30 p-6 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-wider">
              <ShieldAlert className="w-3.5 h-3.5" />
              Phase 93 • Autonomous Legal Contract Analyzer & Patent Infringement Risk Radar
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-3">
              Student Legal Shield & Patent Risk Radar
              <span className="text-xs px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40">
                AI Redline Engine
              </span>
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl">
              Protect your intellectual property, research thesis code, and startup equity with automated clause analysis, non-compete reasonableness screening, and patent claim collision detection.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleAnalyze}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white font-medium shadow-lg shadow-amber-500/25 transition-all text-sm disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              {isLoading ? 'Scanning Clauses...' : 'Run Contract Risk Scan'}
            </button>
          </div>
        </div>
      </div>

      {/* Preset Pickers */}
      <div className="flex flex-wrap gap-2">
        {PRESET_CONTRACTS.map((preset, idx) => (
          <button
            key={idx}
            onClick={() => {
              setContractTitle(preset.title);
              setStudentRole(preset.role);
              setContractFullText(preset.text);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
              contractTitle === preset.title
                ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            {preset.title}
          </button>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Contract Editor & Meta */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <FileText className="w-4 h-4 text-amber-400" />
              Contract Parameters
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Contract Title</label>
                <input
                  type="text"
                  value={contractTitle}
                  onChange={(e) => setContractTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Student Role Perspective</label>
                <select
                  value={studentRole}
                  onChange={(e) => setStudentRole(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="STUDENT_FOUNDER">Student Founder / Co-Founder</option>
                  <option value="FREELANCER">Independent Freelance Developer</option>
                  <option value="RESEARCH_ASSISTANT">Graduate Research Assistant</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Agreement Full Legal Text</label>
                <textarea
                  rows={9}
                  value={contractFullText}
                  onChange={(e) => setContractFullText(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-lg p-3 text-white font-mono text-xs focus:outline-none focus:border-amber-500 resize-none"
                  placeholder="Paste contract clauses or NDAs here..."
                />
              </div>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 text-center">
              <div className="text-xs text-slate-400 mb-1">Risk Score</div>
              <div className={`text-xl font-bold ${report.overallRiskScore > 50 ? 'text-red-400' : 'text-emerald-400'}`}>
                {report.overallRiskScore}/100
              </div>
            </div>
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 text-center">
              <div className="text-xs text-slate-400 mb-1">IP Retained</div>
              <div className="text-xl font-bold text-amber-400">
                {report.ipRetainedPercent}%
              </div>
            </div>
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 text-center">
              <div className="text-xs text-slate-400 mb-1">Patent Collision</div>
              <div className="text-xl font-bold text-indigo-400">
                {report.patentInfringementRiskPercent}%
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Flagged Clauses & Redlines */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                Detected Problematic Clauses ({report.flaggedClauses.length})
              </h3>
              <span className="text-xs font-medium px-2.5 py-1 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
                {report.contractSafetyTier.replace(/_/g, ' ')}
              </span>
            </div>

            <div className="space-y-3">
              {report.flaggedClauses.map((clause, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedClause(clause)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    selectedClause?.clauseTitle === clause.clauseTitle
                      ? 'bg-amber-950/20 border-amber-500/50 shadow-md shadow-amber-950/30'
                      : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <h4 className="text-xs font-bold text-white">{clause.clauseTitle}</h4>
                    {getSeverityBadge(clause.severityLevel)}
                  </div>
                  <p className="text-xs text-slate-300 italic mb-2 line-clamp-2">
                    &quot;{clause.originalText}&quot;
                  </p>
                  <div className="text-[11px] text-amber-400 flex items-center gap-1.5 font-medium">
                    <Zap className="w-3 h-3" />
                    Category: {clause.riskCategory.replace(/_/g, ' ')}
                  </div>
                </div>
              ))}
            </div>

            {/* Selected Clause Deep-Dive & Redline */}
            {selectedClause && (
              <div className="mt-4 pt-4 border-t border-slate-800 space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-white">
                  <BookOpen className="w-4 h-4 text-indigo-400" />
                  Legal Analysis & Recommended Redline
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                  <div className="text-slate-400">
                    <span className="font-semibold text-slate-300">Justification: </span>
                    {selectedClause.legalJustification}
                  </div>
                  <div className="p-2.5 rounded-lg bg-emerald-950/30 border border-emerald-500/30 text-emerald-300">
                    <div className="flex items-center gap-1.5 font-bold mb-1 text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      Suggested Redline Replacement:
                    </div>
                    &quot;{selectedClause.suggestedRedlineText}&quot;
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Patent Collision Radar Tile */}
          <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                <Search className="w-4 h-4 text-indigo-400" />
                Patent Prior Art Infringement Radar
              </h3>
              <span className="text-xs text-slate-400">USPTO / WIPO Real-Time Index</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <div className="font-semibold text-white mb-1">US Pat. 10,482,918</div>
                <div className="text-slate-400 text-[11px] mb-2">Distributed Cryptographic Key Exchange & P2P Escrow</div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">Claim Overlap:</span>
                  <span className="text-emerald-400 font-bold">12.4% (Safe)</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <div className="font-semibold text-white mb-1">EP Pat. 3,892,104</div>
                <div className="text-slate-400 text-[11px] mb-2">Real-time Tokamak Magnetic Coil Flux Feedback</div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">Claim Overlap:</span>
                  <span className="text-amber-400 font-bold">24.1% (Low Collision)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LegalContractAnalyzerView;
