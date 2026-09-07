import React, { useState, useEffect } from 'react';
import {
  FlaskConical,
  ShieldAlert,
  CheckCircle2,
  Plus,
  Lock,
  Beaker,
  AlertTriangle
} from 'lucide-react';
import type { LabExperimentLog, CreateLabLogDto } from '@studentlife/shared';

export const ElectronicLabNotebookView: React.FC = () => {
  const [logs, setLogs] = useState<LabExperimentLog[]>([]);
  const [selectedLog, setSelectedLog] = useState<LabExperimentLog | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // New log form state
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState<'WET_LAB_SYNTHESIS' | 'DRY_LAB_SIMULATION' | 'BIO_ASSAY'>('WET_LAB_SYNTHESIS');
  const [newHypothesis, setNewHypothesis] = useState('');
  const [newSteps, setNewSteps] = useState('Prepare 0.1M aqueous buffer.\nTitrate with 0.05M HCl until pH 7.4.\nCentrifuge at 12,000 RPM for 15 mins.');
  const [newReagents, setNewReagents] = useState('Sodium Chloride (7647-14-5, 0.05 mol)\nHydrochloric Acid (7647-01-0, 0.01 mol)');

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/electronic-lab-notebook/logs');
      const data = await res.json();
      if (data.success && data.data) {
        setLogs(data.data);
        if (data.data.length > 0 && !selectedLog) {
          setSelectedLog(data.data[0]);
        }
      }
    } catch {
      // Fallback
    }
  };

  const handleToggleStep = async (stepNumber: number) => {
    if (!selectedLog) return;
    try {
      const res = await fetch(`http://localhost:5000/api/electronic-lab-notebook/log/${selectedLog.id}/toggle-step`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stepNumber })
      });
      const data = await res.json();
      if (data.success && data.data) {
        setSelectedLog(data.data);
        setLogs(prev => prev.map(l => (l.id === data.data.id ? data.data : l)));
      }
    } catch {
      // Local fallback
      const step = selectedLog.protocolSteps.find(s => s.stepNumber === stepNumber);
      if (step) step.completed = !step.completed;
      setSelectedLog({ ...selectedLog });
    }
  };

  const handleCreateLog = async () => {
    const reagentArray = newReagents.split('\n').filter(r => r.trim()).map(r => {
      const parts = r.split('(');
      const name = parts[0]?.trim() || 'Reagent';
      const meta = parts[1]?.replace(')', '').split(',') || ['0000-00-0', '0.01 mol'];
      return {
        reagentName: name,
        casNumber: meta[0]?.trim() || '0000-00-0',
        quantityMols: parseFloat(meta[1] || '0.01') || 0.01
      };
    });

    const payload: CreateLabLogDto = {
      experimentTitle: newTitle || 'Novel Catalytic Synthesis',
      experimentType: newType,
      hypothesis: newHypothesis || 'Stoichiometric ratio yields target product with > 90% purity.',
      protocolSteps: newSteps.split('\n').filter(s => s.trim()),
      reagents: reagentArray
    };

    try {
      const res = await fetch('http://localhost:5000/api/electronic-lab-notebook/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success && data.data) {
        setLogs(prev => [data.data, ...prev]);
        setSelectedLog(data.data);
        setIsCreating(false);
      }
    } catch {
      setIsCreating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-950/60 via-emerald-950/40 to-slate-900 border border-teal-500/30 rounded-2xl p-6 relative overflow-hidden backdrop-blur-md shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-teal-500/20 border border-teal-500/40 text-teal-300 text-xs font-bold rounded-full uppercase tracking-wider flex items-center gap-1.5">
                <FlaskConical className="w-3.5 h-3.5 text-teal-400" />
                Phase 77 • Research Protocol
              </span>
              <span className="px-2.5 py-0.5 bg-slate-800/80 border border-slate-700 text-slate-400 text-xs rounded-md">
                Electronic Lab Notebook (ELN)
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight flex items-center gap-2">
              Autonomous Electronic Lab Notebook & Wet-Lab Logger
            </h1>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl">
              Standard operating procedure step execution, real-time chemical hazard SDS safety intelligence, reagent stoichiometry, and SHA-256 tamper-proof protocol signing.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsCreating(true)}
              className="px-4 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-black rounded-xl shadow-lg shadow-teal-500/20 flex items-center gap-2 text-xs transition"
            >
              <Plus className="w-4 h-4" /> New Protocol
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Experiment Logs List */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-xl space-y-3">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Beaker className="w-4 h-4 text-teal-400" />
              Experiment Protocols
            </h2>
            <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
              {logs.map((log) => (
                <button
                  key={log.id}
                  onClick={() => { setSelectedLog(log); setIsCreating(false); }}
                  className={`w-full text-left p-3.5 rounded-xl border transition flex flex-col gap-2 ${
                    selectedLog?.id === log.id && !isCreating
                      ? 'bg-teal-950/40 border-teal-500/80 text-white shadow-lg'
                      : 'bg-slate-950/60 border-slate-800/80 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-bold text-xs line-clamp-1">{log.experimentTitle}</div>
                      <div className="text-[10px] text-slate-500 font-mono mt-0.5">{log.experimentType}</div>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      log.status === 'COMPLETED'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : log.status === 'VERIFIED'
                        ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    }`}>
                      {log.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-slate-400">
                    <span>{log.protocolSteps.filter(s => s.completed).length}/{log.protocolSteps.length} Steps Done</span>
                    <span>•</span>
                    <span>{log.reagents.length} Reagents</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Selected Experiment Execution or Creation Form */}
        <div className="lg:col-span-8 space-y-6">
          {isCreating ? (
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 shadow-xl space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-teal-400" />
                Create New Research Experiment Protocol
              </h3>

              <div>
                <label className="text-xs text-slate-400 mb-1 block">Experiment Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Synthesis of Gold Nanoparticles via Citrate Reduction"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-200 focus:border-teal-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Protocol Classification</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-slate-200 focus:border-teal-500 focus:outline-none"
                  >
                    <option value="WET_LAB_SYNTHESIS">Wet-Lab Chemical Synthesis</option>
                    <option value="DRY_LAB_SIMULATION">Dry-Lab Computational Run</option>
                    <option value="BIO_ASSAY">Biological Assay / Gel Electrophoresis</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Hypothesis</label>
                  <input
                    type="text"
                    value={newHypothesis}
                    onChange={(e) => setNewHypothesis(e.target.value)}
                    placeholder="Measurable objective..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-slate-200 focus:border-teal-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-400 mb-1 block">Protocol Steps (One per line)</label>
                <textarea
                  value={newSteps}
                  onChange={(e) => setNewSteps(e.target.value)}
                  className="w-full h-28 bg-slate-950 border border-slate-700 rounded-lg p-3 text-xs text-slate-200 focus:border-teal-500 focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 mb-1 block">Reagents & CAS Numbers (One per line: Name (CAS, Mols))</label>
                <textarea
                  value={newReagents}
                  onChange={(e) => setNewReagents(e.target.value)}
                  className="w-full h-20 bg-slate-950 border border-slate-700 rounded-lg p-3 text-xs text-slate-200 focus:border-teal-500 focus:outline-none font-mono"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleCreateLog}
                  className="flex-1 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-lg transition"
                >
                  Save & Generate Tamper-Proof SHA-256 Log
                </button>
                <button
                  onClick={() => setIsCreating(false)}
                  className="px-4 py-2.5 bg-slate-800 text-slate-300 text-xs rounded-lg border border-slate-700"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : selectedLog ? (
            <div className="space-y-6">
              {/* Protocol Details & Hash */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 shadow-xl space-y-4">
                <div className="flex items-start justify-between border-b border-slate-800 pb-3">
                  <div>
                    <h3 className="text-base font-black text-white">{selectedLog.experimentTitle}</h3>
                    <div className="text-xs text-slate-400 mt-1 font-serif italic">"{selectedLog.hypothesis}"</div>
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-950 border border-slate-700 rounded-lg text-[10px] font-mono text-emerald-400">
                    <Lock className="w-3 h-3" />
                    SHA-256: {selectedLog.tamperProofSha256Hash.slice(0, 10)}...
                  </div>
                </div>

                {/* Step Execution Checklist */}
                <div className="space-y-3">
                  <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">Protocol Execution Steps</div>
                  <div className="space-y-2">
                    {selectedLog.protocolSteps.map((step) => (
                      <button
                        key={step.stepNumber}
                        onClick={() => handleToggleStep(step.stepNumber)}
                        className={`w-full text-left p-3 rounded-lg border transition flex items-start gap-3 text-xs ${
                          step.completed
                            ? 'bg-emerald-950/30 border-emerald-500/50 text-emerald-200'
                            : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        <CheckCircle2 className={`w-4 h-4 mt-0.5 shrink-0 ${step.completed ? 'text-emerald-400 fill-emerald-400/20' : 'text-slate-600'}`} />
                        <div>
                          <span className="font-bold text-teal-400 mr-2">Step {step.stepNumber}:</span>
                          <span>{step.instruction}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Chemical Safety & SDS Hazards */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 shadow-xl space-y-4">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-amber-400" />
                  <h3 className="text-sm font-bold text-white">Reagent Safety Data & SDS GHS Ratings</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedLog.reagents.map((r, i) => (
                    <div key={i} className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-2.5 text-xs">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="font-bold text-slate-200">{r.reagentName}</div>
                          <div className="text-[10px] text-slate-500 font-mono">CAS: {r.casNumber} • {r.quantityMols} mol</div>
                        </div>
                        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {r.ghsPictograms.map((g, gi) => (
                          <span key={gi} className="px-1.5 py-0.5 bg-rose-500/20 border border-rose-500/40 text-rose-300 text-[9px] font-bold rounded">
                            {g}
                          </span>
                        ))}
                      </div>

                      <p className="text-[11px] text-slate-400">{r.hazardSummary}</p>

                      <div className="pt-1 border-t border-slate-800 text-[10px] text-teal-300">
                        <span className="font-bold text-slate-400">Required PPE: </span>
                        {r.ppeRecommendations.join(', ')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
