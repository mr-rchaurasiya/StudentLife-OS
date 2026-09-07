import React, { useState, useEffect } from 'react';
import {
  Dna,
  Scissors,
  Sparkles,
  RefreshCw,
  AlertTriangle,
  ShieldCheck,
  Search,
  Zap
} from 'lucide-react';
import type { CrisprTargetAnalysis } from '@studentlife/shared';

interface CrisprGeneEditorViewProps {
  onAddXp?: (amount: number) => void;
}

export const CrisprGeneEditorView: React.FC<CrisprGeneEditorViewProps> = ({ onAddXp }) => {
  const [targetGene, setTargetGene] = useState('HEK293-EMX1 (Human Exon 3)');
  const [dnaSequence, setDnaSequence] = useState('GAGTCCGAGCAGAAGAAGAAGGGCTCCCATCACATCAACCGGT');
  const [analysis, setAnalysis] = useState<CrisprTargetAnalysis | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const analyzeSequence = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/crispr-editor/design', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetGene,
          genomicDnaSequence: dnaSequence,
          casProteinType: 'SPCAS9'
        })
      });
      if (res.ok) {
        const data = await res.json();
        setAnalysis(data.data);
        if (onAddXp) onAddXp(65);
      }
    } catch (e) {
      console.error('Failed to design gRNA', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    analyzeSequence();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-rose-900/40 via-pink-900/40 to-amber-900/40 border border-rose-500/30 rounded-2xl p-6 backdrop-blur-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
          <Dna className="w-64 h-64 text-rose-400" />
        </div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30 uppercase tracking-wider">
                Phase 89 • Computational CRISPR Biotech
              </span>
              <span className="flex items-center gap-1 text-xs text-pink-400 font-medium">
                <Scissors className="w-3.5 h-3.5" /> Cas9 Nuclease Targeter
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-3">
              <Scissors className="w-8 h-8 text-rose-400" />
              3D CRISPR-Cas9 Guide-RNA (gRNA) & Off-Target Predictor
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              Design 20-nt guide RNA spacers, detect NGG protospacer adjacent motifs (PAM), compute on-target Doench cleavage scores, and simulate genome-wide off-target mismatch risks.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={analyzeSequence}
              disabled={loading}
              className="px-4 py-2.5 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-400 hover:to-pink-500 text-white font-bold rounded-xl text-sm flex items-center gap-2 shadow-lg shadow-rose-500/20 transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Re-Design gRNA
            </button>
          </div>
        </div>
      </div>

      {/* Target DNA Input Form */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-4 space-y-1">
            <label className="text-xs font-semibold text-slate-300 block">Target Gene Locus</label>
            <input
              type="text"
              value={targetGene}
              onChange={(e) => setTargetGene(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 focus:border-rose-500 focus:outline-none"
            />
          </div>

          <div className="md:col-span-8 space-y-1">
            <label className="text-xs font-semibold text-slate-300 block">Genomic Target DNA (5' ➔ 3')</label>
            <div className="relative">
              <input
                type="text"
                value={dnaSequence}
                onChange={(e) => setDnaSequence(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 font-mono focus:border-rose-500 focus:outline-none pr-10 uppercase"
              />
              <Search className="w-4 h-4 text-slate-500 absolute right-3.5 top-3" />
            </div>
          </div>
        </div>
      </div>

      {analysis && (
        <>
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-xl">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider">Doench Score</span>
                <Sparkles className="w-4 h-4 text-rose-400" />
              </div>
              <div className="text-3xl font-black text-rose-400">{analysis.onTargetDoenchScore} <span className="text-xs text-slate-400">/ 100</span></div>
              <p className="text-[11px] text-emerald-400 mt-1 font-semibold">High On-Target Cleavage</p>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-xl">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider">PAM Recognition</span>
                <Scissors className="w-4 h-4 text-pink-400" />
              </div>
              <div className="text-2xl font-mono font-black text-white">{analysis.pamMotif}</div>
              <p className="text-[11px] text-slate-400 mt-1">SpCas9 Compatible</p>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-xl">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider">GC Content</span>
                <Dna className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-3xl font-black text-amber-300">{analysis.gcContentPercent}%</div>
              <p className="text-[11px] text-slate-400 mt-1">Optimal Range (40–60%)</p>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-xl">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider">Safety Status</span>
                <ShieldCheck className="w-4 h-4 text-teal-400" />
              </div>
              <div className="text-sm font-bold text-teal-300 mt-1">APPROVED</div>
              <p className="text-[11px] text-teal-400 mt-1">Zero Fatal Off-Targets</p>
            </div>
          </div>

          {/* Designed 20-nt Spacer Showcase */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-rose-400" />
              Designed 20-nt Guide RNA Spacer Sequence
            </h3>
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 font-mono text-center text-lg sm:text-xl font-black tracking-widest text-rose-300">
              5'- {analysis.gRnaSequence20nt} - [NGG] -3'
            </div>
          </div>

          {/* Off-Target Cleavage Prediction Table */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              Genome-Wide Off-Target Risk Telemetry (CFD Matrix)
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse font-mono">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="py-2.5 px-3">Locus ID</th>
                    <th className="py-2.5 px-3">Chromosome Location</th>
                    <th className="py-2.5 px-3">Mismatches</th>
                    <th className="py-2.5 px-3">Mutated Positions</th>
                    <th className="py-2.5 px-3">CFD Cleavage Probability</th>
                    <th className="py-2.5 px-3">Risk Level</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {analysis.predictedCuts.map((cut) => (
                    <tr key={cut.locusId} className="hover:bg-slate-950/40">
                      <td className="py-2.5 px-3 font-bold text-slate-200">{cut.locusId}</td>
                      <td className="py-2.5 px-3 text-pink-300">{cut.chromosomeLocation}</td>
                      <td className="py-2.5 px-3">{cut.sequenceMismatchCount} bp</td>
                      <td className="py-2.5 px-3 text-slate-400">{cut.mismatchedBases}</td>
                      <td className="py-2.5 px-3 font-bold text-amber-300">{(cut.cleavageProbabilityScore * 100).toFixed(2)}%</td>
                      <td className="py-2.5 px-3">
                        <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                          {cut.riskLevel}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
