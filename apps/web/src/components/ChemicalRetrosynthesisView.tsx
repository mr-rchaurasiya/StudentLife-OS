import React, { useState, useEffect } from 'react';
import {
  FlaskConical,
  Dna,
  ArrowRight,
  Sparkles,
  Layers,
  TestTubes,
  Zap,
  CheckCircle2,
  Atom,
  RefreshCw,
  Search,
  Split,
  ChevronRight
} from 'lucide-react';
import type { RetrosyntheticPathway } from '@studentlife/shared';

interface ChemicalRetrosynthesisViewProps {
  onAddXp?: (amount: number) => void;
}

export const ChemicalRetrosynthesisView: React.FC<ChemicalRetrosynthesisViewProps> = ({ onAddXp }) => {
  const [targetSmiles, setTargetSmiles] = useState('CC(=O)Oc1ccccc1C(=O)O');
  const [moleculeName, setMoleculeName] = useState('Aspirin (Acetylsalicylic Acid)');
  const [maxSteps, setMaxSteps] = useState(4);
  const [selectedPathway, setSelectedPathway] = useState<RetrosyntheticPathway | null>(null);
  const [allPathways, setAllPathways] = useState<RetrosyntheticPathway[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'PATHWAYS' | 'MOLECULAR_GRAPH' | 'REAGENTS'>('PATHWAYS');
  const [reactionStepIdx, setReactionStepIdx] = useState(0);

  const fetchRetrosynthesis = async (smiles: string, name: string) => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/chemical-retrosynthesis/plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ smilesFormula: smiles, moleculeName: name, maxDisconnectionDepth: maxSteps })
      });
      if (res.ok) {
        const data = await res.json();
        const pathways: RetrosyntheticPathway[] = data.pathways || [];
        setAllPathways(pathways);
        if (pathways.length > 0) {
          setSelectedPathway(pathways[0]);
          setReactionStepIdx(0);
        }
      }
    } catch (e) {
      console.error('Failed to fetch retrosynthesis pathway', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRetrosynthesis(targetSmiles, moleculeName);
  }, []);

  const handlePlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetSmiles.trim()) return;
    fetchRetrosynthesis(targetSmiles, moleculeName);
    if (onAddXp) onAddXp(65);
  };

  const PRESETS = [
    { name: 'Aspirin (Acetylsalicylic Acid)', smiles: 'CC(=O)Oc1ccccc1C(=O)O' },
    { name: 'Paracetamol (Acetaminophen)', smiles: 'CC(=O)Nc1ccc(O)cc1' },
    { name: 'Ibuprofen', smiles: 'CC(C)Cc1ccc(cc1)C(C)C(=O)O' },
    { name: 'Caffeine', smiles: 'Cn1cnc2c1c(=O)n(c(=O)n2C)C' }
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-900/40 via-emerald-900/40 to-cyan-900/40 border border-teal-500/30 rounded-2xl p-6 backdrop-blur-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
          <FlaskConical className="w-64 h-64 text-teal-400" />
        </div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-500/20 text-teal-300 border border-teal-500/30 uppercase tracking-wider">
                Phase 83 • Quantum Chemoinformatics
              </span>
              <span className="flex items-center gap-1 text-xs text-emerald-400 font-medium">
                <Atom className="w-3.5 h-3.5" /> Disconnection Engine
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-3">
              <TestTubes className="w-8 h-8 text-teal-400 animate-pulse" />
              AI Chemical Retrosynthesis & Molecule Designer
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              Deconstruct complex therapeutic molecules backwards into commercially viable synthons, catalog precursors, and multi-step synthesis reaction graphs.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                fetchRetrosynthesis(targetSmiles, moleculeName);
                if (onAddXp) onAddXp(30);
              }}
              disabled={loading}
              className="px-4 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-white font-semibold rounded-xl text-sm flex items-center gap-2 shadow-lg shadow-teal-500/20 transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Re-Plan Synthons
            </button>
          </div>
        </div>
      </div>

      {/* Target Molecule Input Form & Presets */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl space-y-4">
        <form onSubmit={handlePlan} className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-8 space-y-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <FlaskConical className="w-3.5 h-3.5 text-teal-400" />
              Target Molecule Canonical SMILES / Formula
            </label>
            <div className="relative">
              <input
                type="text"
                value={targetSmiles}
                onChange={(e) => setTargetSmiles(e.target.value)}
                placeholder="e.g. CC(=O)Oc1ccccc1C(=O)O"
                className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl px-4 py-2.5 text-slate-100 text-sm font-mono focus:border-teal-500 focus:outline-none pr-10"
              />
              <Search className="w-4 h-4 text-slate-500 absolute right-3.5 top-3" />
            </div>
          </div>

          <div className="md:col-span-2 space-y-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-emerald-400" />
              Max Disconnections
            </label>
            <select
              value={maxSteps}
              onChange={(e) => setMaxSteps(Number(e.target.value))}
              className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl px-3 py-2.5 text-slate-100 text-sm focus:border-teal-500 focus:outline-none"
            >
              <option value={2}>2 Steps (Short)</option>
              <option value={3}>3 Steps (Standard)</option>
              <option value={4}>4 Steps (Complete)</option>
              <option value={5}>5 Steps (Deep Synth)</option>
            </select>
          </div>

          <div className="md:col-span-2 flex items-end">
            <button
              type="submit"
              disabled={loading}
              className="w-full h-[42px] bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-teal-500/20 transition-all disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              Analyze
            </button>
          </div>
        </form>

        {/* Quick Presets */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800/80">
          <span className="text-xs text-slate-400 font-semibold flex items-center gap-1">
            <Dna className="w-3.5 h-3.5 text-teal-400" /> Presets:
          </span>
          {PRESETS.map((p) => (
            <button
              key={p.name}
              type="button"
              onClick={() => {
                setTargetSmiles(p.smiles);
                setMoleculeName(p.name);
                fetchRetrosynthesis(p.smiles, p.name);
              }}
              className={`text-xs px-3 py-1 rounded-lg border transition-all ${
                targetSmiles === p.smiles
                  ? 'bg-teal-500/20 border-teal-500/50 text-teal-300 font-semibold'
                  : 'bg-slate-800/40 border-slate-700 text-slate-400 hover:text-slate-200 hover:border-slate-600'
              }`}
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Analysis Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Synthetic Pathways Navigation */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 backdrop-blur-xl">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                <Split className="w-4 h-4 text-teal-400" />
                Predicted Synthetic Pathways ({allPathways.length})
              </h3>
              <span className="text-xs bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full">
                AI Rank
              </span>
            </div>

            <div className="space-y-2.5">
              {allPathways.map((path, idx) => {
                const isSelected = selectedPathway?.id === path.id;
                return (
                  <div
                    key={path.id || idx}
                    onClick={() => {
                      setSelectedPathway(path);
                      setReactionStepIdx(0);
                    }}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-teal-950/40 border-teal-500/50 shadow-md shadow-teal-500/10'
                        : 'bg-slate-950/40 border-slate-800/80 hover:border-slate-700 text-slate-400'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              path.overallYieldEstimatePercent >= 70
                                ? 'bg-emerald-400'
                                : path.overallYieldEstimatePercent >= 50
                                ? 'bg-amber-400'
                                : 'bg-rose-400'
                            }`}
                          />
                          <span className="text-xs font-bold text-slate-200">
                            Pathway #{idx + 1}: {path.moleculeName}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">
                          Category: {path.therapeuticCategory}
                        </p>
                      </div>
                      <span className="text-xs font-mono font-bold text-teal-300 bg-teal-500/10 px-2 py-0.5 rounded">
                        {path.overallYieldEstimatePercent}% Yield
                      </span>
                    </div>

                    <div className="flex items-center gap-3 mt-3 pt-2.5 border-t border-slate-800/60 text-[11px] text-slate-400">
                      <span>{path.steps.length} Steps</span>
                      <span>•</span>
                      <span>MW: <strong className="text-slate-200">{path.molecularWeight} g/mol</strong></span>
                      <span>•</span>
                      <span className="text-emerald-400 font-semibold">{path.totalSynthesisSteps} Synth Nodes</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Chemoinformatics Summary */}
          {selectedPathway && (
            <div className="bg-gradient-to-br from-slate-900/80 to-slate-950/80 border border-slate-800 rounded-2xl p-4">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Atom className="w-3.5 h-3.5 text-cyan-400" /> Reaction Energetics & Complexity
              </h4>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-2.5 bg-slate-900/60 rounded-xl border border-slate-800">
                  <span className="text-slate-500 block">Overall Yield</span>
                  <span className="text-base font-bold text-emerald-400">{selectedPathway.overallYieldEstimatePercent}%</span>
                </div>
                <div className="p-2.5 bg-slate-900/60 rounded-xl border border-slate-800">
                  <span className="text-slate-500 block">Disconnection Steps</span>
                  <span className="text-base font-bold text-cyan-400">{selectedPathway.steps.length} Nodes</span>
                </div>
                <div className="p-2.5 bg-slate-900/60 rounded-xl border border-slate-800">
                  <span className="text-slate-500 block">Molecular Weight</span>
                  <span className="text-base font-bold text-teal-300">{selectedPathway.molecularWeight} g/mol</span>
                </div>
                <div className="p-2.5 bg-slate-900/60 rounded-xl border border-slate-800">
                  <span className="text-slate-500 block">Therapeutic Category</span>
                  <span className="text-sm font-bold text-indigo-400">{selectedPathway.therapeuticCategory}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Step-by-Step Disconnection Graph & Mechanism */}
        <div className="lg:col-span-8 space-y-4">
          {/* Tabs */}
          <div className="flex items-center gap-2 bg-slate-900/60 p-1.5 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('PATHWAYS')}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                activeTab === 'PATHWAYS'
                  ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Split className="w-3.5 h-3.5" /> Reaction Disconnection Tree
            </button>
            <button
              onClick={() => setActiveTab('MOLECULAR_GRAPH')}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                activeTab === 'MOLECULAR_GRAPH'
                  ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Atom className="w-3.5 h-3.5" /> Synthon Synapses & Bonds
            </button>
            <button
              onClick={() => setActiveTab('REAGENTS')}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                activeTab === 'REAGENTS'
                  ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <TestTubes className="w-3.5 h-3.5" /> Reagents & Catalysts
            </button>
          </div>

          {selectedPathway ? (
            <div className="space-y-4">
              {activeTab === 'PATHWAYS' && (
                <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                    <div>
                      <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <Zap className="w-5 h-5 text-teal-400" />
                        {selectedPathway.moleculeName} Synthesis Pathway
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Category: {selectedPathway.therapeuticCategory} • Total Steps: {selectedPathway.totalSynthesisSteps}
                      </p>
                    </div>
                    <span className="text-xs font-mono bg-slate-800 text-teal-300 px-3 py-1 rounded-lg border border-slate-700">
                      SMILES: {selectedPathway.smilesFormula}
                    </span>
                  </div>

                  {/* Disconnection Steps Flow */}
                  <div className="space-y-4">
                    {selectedPathway.steps.map((step, idx) => (
                      <div
                        key={step.stepNumber || idx}
                        onClick={() => setReactionStepIdx(idx)}
                        className={`p-4 rounded-xl border transition-all cursor-pointer ${
                          reactionStepIdx === idx
                            ? 'bg-slate-950 border-teal-500 shadow-lg shadow-teal-500/10'
                            : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-teal-500/20 text-teal-300 text-xs font-black flex items-center justify-center border border-teal-500/40">
                              {step.stepNumber || idx + 1}
                            </span>
                            <h4 className="text-sm font-bold text-slate-100">
                              {step.reactionName || 'Disconnection Step'}
                            </h4>
                          </div>
                          <div className="flex items-center gap-2 text-xs">
                            <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                              Yield: {step.predictedYieldPercent}%
                            </span>
                            <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                              {step.conditions || 'Optimal Conditions'}
                            </span>
                          </div>
                        </div>

                        {/* Reaction Visualizer: Product -> Synthons */}
                        <div className="grid grid-cols-1 md:grid-cols-11 gap-2 items-center bg-slate-900/80 p-3 rounded-lg border border-slate-800/80">
                          {/* Target / Product */}
                          <div className="md:col-span-4 p-2.5 bg-slate-950 rounded border border-slate-800">
                            <span className="text-[10px] text-slate-500 uppercase font-semibold block mb-1">Target Fragment</span>
                            <span className="text-xs font-mono text-teal-300 break-all">{step.targetFragment}</span>
                          </div>

                          {/* Retro Arrow */}
                          <div className="md:col-span-3 flex flex-col items-center justify-center py-1 text-center">
                            <span className="text-[10px] text-teal-400 font-bold uppercase tracking-wider flex items-center gap-1">
                              Retro Disconnect <ArrowRight className="w-3 h-3 text-teal-400" />
                            </span>
                            <span className="text-[11px] text-slate-400 italic mt-0.5">
                              {step.reagentsRequired?.join(', ') || 'Catalytic'}
                            </span>
                          </div>

                          {/* Synthons / Precursors */}
                          <div className="md:col-span-4 p-2.5 bg-slate-950 rounded border border-slate-800">
                            <span className="text-[10px] text-emerald-500 uppercase font-semibold block mb-1">Precursors / Synthons</span>
                            <div className="space-y-1">
                              {step.synthons?.map((s: string, sIdx: number) => (
                                <span key={sIdx} className="text-xs font-mono text-emerald-300 block break-all">
                                  • {s}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Mechanism Notes */}
                        {step.conditions && (
                          <p className="text-xs text-slate-400 mt-2.5 italic flex items-center gap-1.5">
                            <ChevronRight className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                            Conditions: {step.conditions}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'MOLECULAR_GRAPH' && (
                <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl space-y-6 text-center py-12">
                  <div className="w-20 h-20 rounded-full bg-teal-500/10 border border-teal-500/30 flex items-center justify-center mx-auto mb-4">
                    <Atom className="w-10 h-10 text-teal-400 animate-spin" />
                  </div>
                  <h3 className="text-lg font-bold text-white">Quantum Bond Cleavage & Synthons</h3>
                  <p className="text-xs text-slate-400 max-w-md mx-auto">
                    Visualizing retro-cleavage at target sigma/pi bonds. Functional group interconversions (FGI) identify synthetic equivalents with zero protecting group overhead.
                  </p>
                  <div className="flex flex-wrap justify-center gap-3 mt-4">
                    <span className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-teal-300 font-mono">
                      Acyl Donor Synthon: [CH3-C+=O]
                    </span>
                    <span className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-emerald-300 font-mono">
                      Phenolic Nucleophile: [O- - C6H4-COOH]
                    </span>
                  </div>
                </div>
              )}

              {activeTab === 'REAGENTS' && (
                <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl space-y-4">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <TestTubes className="w-5 h-5 text-teal-400" />
                    Laboratory Reagents, Catalysts & Safety Sheet
                  </h3>
                  <div className="space-y-3">
                    {selectedPathway.steps.map((step, idx) => (
                      <div key={idx} className="p-3.5 bg-slate-950/80 rounded-xl border border-slate-800">
                        <div className="flex items-center justify-between text-xs font-bold text-teal-300 mb-2">
                          <span>Step {step.stepNumber}: {step.reactionName}</span>
                          <span className="text-slate-400 font-normal">{step.conditions}</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {step.reagentsRequired?.map((r: string, rIdx: number) => (
                            <span key={rIdx} className="text-xs px-2.5 py-1 rounded bg-teal-950/40 text-teal-200 border border-teal-800/60 flex items-center gap-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" /> {r}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-12 text-center text-slate-400">
              <FlaskConical className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p>No synthetic pathways loaded. Click Analyze to compute retro-disconnections.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
