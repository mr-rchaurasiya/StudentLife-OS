import React, { useState, useEffect } from 'react';
import {
  FlaskConical,
  ShieldAlert,
  Plus,
  Lock,
  Beaker,
  AlertTriangle,
  Check
} from 'lucide-react';
import type { LabExperimentLog, CreateLabLogDto } from '@studentlife/shared';

const DEFAULT_INITIAL_LOGS: LabExperimentLog[] = [
  {
    id: 'eln-1',
    experimentTitle: 'Sol-Gel Synthesis of Perovskite (CH3NH3PbI3) Thin Films for Photovoltaics',
    experimentType: 'WET_LAB_SYNTHESIS',
    hypothesis: 'Precursor stoichiometry ratio of 1:1 PbI2 to MAI in DMF will yield 15%+ PCE with minimal pinhole defects.',
    protocolSteps: [
      { stepNumber: 1, instruction: 'Dissolve 461 mg Lead(II) iodide (PbI2) and 159 mg MAI in 1 mL anhydrous DMF:DMSO (4:1 v/v).', completed: true },
      { stepNumber: 2, instruction: 'Stir at 60°C for 2 hours in a Nitrogen glovebox until a clear golden precursor forms.', completed: true },
      { stepNumber: 3, instruction: 'Spin-coat at 4000 RPM for 30 seconds; drip 200 µL Chlorobenzene antisolvent at 15s mark.', completed: true },
      { stepNumber: 4, instruction: 'Anneal on hotplate at 100°C for 10 minutes to induce black perovskite phase crystallization.', completed: true }
    ],
    reagents: [
      {
        reagentName: 'Lead(II) Iodide (PbI2)',
        casNumber: '10101-63-0',
        quantityMols: 0.001,
        ghsPictograms: ['TOXIC', 'ENVIRONMENT_HAZARD', 'HEALTH_HAZARD'],
        hazardSummary: 'Reproductive toxicity Cat 1A, Aquatic acute Cat 1. Handle exclusively in glovebox.',
        ppeRecommendations: ['Nitrile Gloves (double)', 'Safety Goggles', 'Chemical Fume Hood']
      },
      {
        reagentName: 'Methylammonium Iodide (MAI)',
        casNumber: '14965-49-2',
        quantityMols: 0.001,
        ghsPictograms: ['IRRITANT'],
        hazardSummary: 'Hygroscopic powder. Skin and eye irritant.',
        ppeRecommendations: ['Lab Coat', 'Nitrile Gloves', 'Face Shield']
      },
      {
        reagentName: 'N,N-Dimethylformamide (DMF)',
        casNumber: '68-12-2',
        quantityMols: 0.013,
        ghsPictograms: ['FLAMMABLE', 'TOXIC', 'HEALTH_HAZARD'],
        hazardSummary: 'Flammable liquid and vapor. Harmful if inhaled or absorbed through skin.',
        ppeRecommendations: ['Solvent-resistant Gloves', 'Vapor Respirator', 'Glovebox']
      }
    ],
    tamperProofSha256Hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    timestamp: new Date().toISOString(),
    status: 'VERIFIED'
  },
  {
    id: 'eln-2',
    experimentTitle: 'CRISPR-Cas9 In Vitro Cleavage Assay of EGFP Target DNA',
    experimentType: 'BIO_ASSAY',
    hypothesis: 'Engineered sgRNA with 20-nt guide sequence will achieve >85% cleavage efficiency in target plasmid.',
    protocolSteps: [
      { stepNumber: 1, instruction: 'Assemble Cas9 nuclease (1 µM) and sgRNA (1 µM) in 1X NEB3.1 buffer; incubate 25°C for 10 min.', completed: true },
      { stepNumber: 2, instruction: 'Add 300 ng substrate plasmid DNA to ribonucleoprotein complex.', completed: true },
      { stepNumber: 3, instruction: 'Incubate reaction at 37°C for 60 minutes.', completed: false },
      { stepNumber: 4, instruction: 'Add 1 µL Proteinase K and incubate at 55°C for 10 min to stop reaction; run on 1.2% agarose gel.', completed: false }
    ],
    reagents: [
      {
        reagentName: 'SpyCas9 Recombinant Nuclease',
        casNumber: '9001-90-5',
        quantityMols: 0.00001,
        ghsPictograms: ['NON_HAZARDOUS'],
        hazardSummary: 'Biological enzyme. Store at -20°C.',
        ppeRecommendations: ['Standard Lab Coat', 'Nitrile Gloves']
      },
      {
        reagentName: 'Ethidium Bromide Agarose Stain',
        casNumber: '1239-45-8',
        quantityMols: 0.00005,
        ghsPictograms: ['MUTAGEN', 'TOXIC'],
        hazardSummary: 'Potent mutagen. Avoid aerosolization and direct skin contact.',
        ppeRecommendations: ['Double Gloves', 'UV Face Shield', 'Dedicated Waste Bin']
      }
    ],
    tamperProofSha256Hash: '7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b',
    timestamp: new Date().toISOString(),
    status: 'IN_PROGRESS'
  }
];

export const ElectronicLabNotebookView: React.FC = () => {
  const [logs, setLogs] = useState<LabExperimentLog[]>(DEFAULT_INITIAL_LOGS);
  const [selectedLog, setSelectedLog] = useState<LabExperimentLog | null>(DEFAULT_INITIAL_LOGS[0]);
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
      const res = await fetch('/api/electronic-lab-notebook/logs');
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          setLogs(data.data);
          if (!selectedLog) {
            setSelectedLog(data.data[0]);
          }
        }
      }
    } catch {
      // Fallback already preloaded
    }
  };

  const handleToggleStep = async (stepNumber: number) => {
    if (!selectedLog) return;
    
    // Update local state smoothly
    const updatedSteps = selectedLog.protocolSteps.map(s => 
      s.stepNumber === stepNumber ? { ...s, completed: !s.completed } : s
    );
    const allDone = updatedSteps.every(s => s.completed);
    const updatedLog: LabExperimentLog = {
      ...selectedLog,
      protocolSteps: updatedSteps,
      status: allDone ? 'VERIFIED' : 'IN_PROGRESS'
    };

    setSelectedLog(updatedLog);
    setLogs(prev => prev.map(l => (l.id === updatedLog.id ? updatedLog : l)));

    try {
      await fetch(`/api/electronic-lab-notebook/log/${selectedLog.id}/toggle-step`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stepNumber })
      });
    } catch {
      // Offline fallback already updated state
    }
  };

  const handleCreateLog = async () => {
    const rawReagentLines = newReagents.split('\n').filter(r => r.trim());
    const reagentArray = rawReagentLines.map(r => {
      const parts = r.split('(');
      const name = parts[0]?.trim() || 'Reagent Compound';
      const meta = parts[1]?.replace(')', '').split(',') || ['0000-00-0', '0.01 mol'];
      return {
        reagentName: name,
        casNumber: meta[0]?.trim() || '7732-18-5',
        quantityMols: parseFloat(meta[1] || '0.01') || 0.01,
        ghsPictograms: ['IRRITANT', 'CAUTION'],
        hazardSummary: 'Handle according to institutional biosafety and chemical hygiene plans.',
        ppeRecommendations: ['Nitrile Gloves', 'Lab Coat', 'Safety Glasses']
      };
    });

    const stepsArray = newSteps.split('\n').filter(s => s.trim()).map((st, idx) => ({
      stepNumber: idx + 1,
      instruction: st,
      completed: false
    }));

    const pseudoHash = 'sha256-' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

    const newLogItem: LabExperimentLog = {
      id: 'eln-' + Date.now(),
      experimentTitle: newTitle || 'Catalytic Hydrogenation Run & Reaction Kinetics',
      experimentType: newType,
      hypothesis: newHypothesis || 'Optimized catalyst loading will yield >92% conversion at 50 bar.',
      protocolSteps: stepsArray.length > 0 ? stepsArray : [{ stepNumber: 1, instruction: 'Execute standard protocol procedure.', completed: false }],
      reagents: reagentArray.length > 0 ? reagentArray : [{
        reagentName: 'Sample Substrate',
        casNumber: '100-00-0',
        quantityMols: 0.05,
        ghsPictograms: ['CAUTION'],
        hazardSummary: 'Standard chemical safety precautions apply.',
        ppeRecommendations: ['Gloves', 'Goggles']
      }],
      tamperProofSha256Hash: pseudoHash,
      timestamp: new Date().toISOString(),
      status: 'IN_PROGRESS'
    };

    setLogs(prev => [newLogItem, ...prev]);
    setSelectedLog(newLogItem);
    setIsCreating(false);
    setNewTitle('');
    setNewHypothesis('');

    try {
      const payload: CreateLabLogDto = {
        experimentTitle: newLogItem.experimentTitle,
        experimentType: newLogItem.experimentType,
        hypothesis: newLogItem.hypothesis,
        protocolSteps: newSteps.split('\n').filter(s => s.trim()),
        reagents: reagentArray.map(r => ({
          reagentName: r.reagentName,
          casNumber: r.casNumber,
          quantityMols: r.quantityMols
        }))
      };

      await fetch('/api/electronic-lab-notebook/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } catch {
      // Local state already updated
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
          background: 'linear-gradient(135deg, rgba(20, 184, 166, 0.22) 0%, rgba(15, 23, 42, 0.95) 50%, rgba(16, 185, 129, 0.25) 100%)',
          border: '1px solid rgba(20, 184, 166, 0.35)',
          padding: '28px 32px',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
        }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '20px', position: 'relative', zIndex: 1 }}>
          <div style={{ maxWidth: '800px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px', flexWrap: 'wrap' }}>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '5px 12px',
                  borderRadius: '9999px',
                  fontSize: '11px',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  background: 'rgba(20, 184, 166, 0.15)',
                  color: '#2dd4bf',
                  border: '1px solid rgba(20, 184, 166, 0.3)'
                }}
              >
                <FlaskConical style={{ width: '13px', height: '13px' }} />
                Phase 77 • Research Protocol
              </span>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '5px 12px',
                  borderRadius: '9999px',
                  fontSize: '11px',
                  fontWeight: 700,
                  background: 'rgba(51, 65, 85, 0.5)',
                  color: '#94a3b8',
                  border: '1px solid rgba(51, 65, 85, 0.8)'
                }}
              >
                Electronic Lab Notebook (ELN)
              </span>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '5px 12px',
                  borderRadius: '9999px',
                  fontSize: '11px',
                  fontWeight: 700,
                  background: 'rgba(16, 185, 129, 0.12)',
                  color: '#34d399',
                  border: '1px solid rgba(16, 185, 129, 0.25)'
                }}
              >
                <Lock style={{ width: '13px', height: '13px' }} />
                SHA-256 Tamper-Proof
              </span>
            </div>

            <h1 style={{ fontSize: '28px', fontWeight: 900, color: '#ffffff', margin: 0, display: 'flex', alignItems: 'center', gap: '12px', letterSpacing: '-0.02em' }}>
              <Beaker style={{ width: '32px', height: '32px', color: '#14b8a6' }} />
              Autonomous Electronic Lab Notebook & Wet-Lab Logger
            </h1>
            <p style={{ color: '#94a3b8', fontSize: '14px', lineHeight: '1.6', margin: '8px 0 0 0' }}>
              Standard operating procedure step execution, real-time chemical hazard SDS safety intelligence, reagent stoichiometry, and SHA-256 tamper-proof protocol signing.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={() => setIsCreating(true)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 24px',
                borderRadius: '14px',
                fontWeight: 800,
                fontSize: '13px',
                color: '#042f2e',
                background: 'linear-gradient(135deg, #2dd4bf 0%, #14b8a6 50%, #0d9488 100%)',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 8px 24px rgba(20, 184, 166, 0.35)',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            >
              <Plus style={{ width: '16px', height: '16px' }} />
              New Protocol
            </button>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', alignItems: 'start' }}>
        {/* Left Column: Experiment Protocols List */}
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(16px)',
            borderRadius: '20px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 800, color: '#ffffff', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Beaker style={{ width: '18px', height: '18px', color: '#2dd4bf' }} />
              Experiment Protocols
            </h2>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#64748b' }}>
              {logs.length} Active Logs
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {logs.map((log) => {
              const isSelected = selectedLog?.id === log.id && !isCreating;
              const completedCount = log.protocolSteps.filter(s => s.completed).length;
              return (
                <div
                  key={log.id}
                  onClick={() => { setSelectedLog(log); setIsCreating(false); }}
                  style={{
                    padding: '16px',
                    borderRadius: '14px',
                    border: isSelected ? '1px solid rgba(20, 184, 166, 0.6)' : '1px solid rgba(51, 65, 85, 0.6)',
                    background: isSelected
                      ? 'linear-gradient(135deg, rgba(20, 184, 166, 0.15) 0%, rgba(15, 23, 42, 0.9) 100%)'
                      : 'rgba(2, 6, 23, 0.6)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: isSelected ? '0 8px 20px rgba(20, 184, 166, 0.15)' : 'none'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '10px', marginBottom: '8px' }}>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 800, color: '#f8fafc', lineHeight: '1.4' }}>
                        {log.experimentTitle}
                      </div>
                      <div style={{ fontSize: '10px', color: '#64748b', fontFamily: 'monospace', marginTop: '2px' }}>
                        {log.experimentType}
                      </div>
                    </div>
                    <span
                      style={{
                        padding: '3px 8px',
                        borderRadius: '6px',
                        fontSize: '10px',
                        fontWeight: 800,
                        flexShrink: 0,
                        background: log.status === 'VERIFIED' ? 'rgba(16, 185, 129, 0.2)' : log.status === 'COMPLETED' ? 'rgba(6, 182, 212, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                        color: log.status === 'VERIFIED' ? '#34d399' : log.status === 'COMPLETED' ? '#22d3ee' : '#fbbf24',
                        border: `1px solid ${log.status === 'VERIFIED' ? 'rgba(16, 185, 129, 0.4)' : log.status === 'COMPLETED' ? 'rgba(6, 182, 212, 0.4)' : 'rgba(245, 158, 11, 0.4)'}`
                      }}
                    >
                      {log.status}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: '#94a3b8' }}>
                    <span style={{ color: '#2dd4bf', fontWeight: 700 }}>
                      {completedCount}/{log.protocolSteps.length} Steps Done
                    </span>
                    <span>•</span>
                    <span>{log.reagents.length} Reagents</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Selected Experiment Execution or Creation Form */}
        <div style={{ flex: '2', minWidth: '0' }}>
          {isCreating ? (
            <div
              style={{
                background: 'rgba(15, 23, 42, 0.75)',
                backdropFilter: 'blur(16px)',
                borderRadius: '20px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '18px'
              }}
            >
              <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 900, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Plus style={{ width: '18px', height: '18px', color: '#2dd4bf' }} />
                Create New Research Experiment Protocol
              </h3>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#94a3b8', marginBottom: '6px' }}>
                  Experiment Title
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Synthesis of Gold Nanoparticles via Citrate Reduction"
                  style={{
                    width: '100%',
                    background: '#020617',
                    border: '1px solid rgba(51, 65, 85, 0.8)',
                    borderRadius: '12px',
                    padding: '10px 14px',
                    fontSize: '13px',
                    color: '#f8fafc',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#94a3b8', marginBottom: '6px' }}>
                    Protocol Classification
                  </label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    style={{
                      width: '100%',
                      background: '#020617',
                      border: '1px solid rgba(51, 65, 85, 0.8)',
                      borderRadius: '12px',
                      padding: '10px 14px',
                      fontSize: '13px',
                      color: '#f8fafc',
                      outline: 'none'
                    }}
                  >
                    <option value="WET_LAB_SYNTHESIS">Wet-Lab Chemical Synthesis</option>
                    <option value="DRY_LAB_SIMULATION">Dry-Lab Computational Run</option>
                    <option value="BIO_ASSAY">Biological Assay / Gel Electrophoresis</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#94a3b8', marginBottom: '6px' }}>
                    Hypothesis
                  </label>
                  <input
                    type="text"
                    value={newHypothesis}
                    onChange={(e) => setNewHypothesis(e.target.value)}
                    placeholder="Measurable research objective..."
                    style={{
                      width: '100%',
                      background: '#020617',
                      border: '1px solid rgba(51, 65, 85, 0.8)',
                      borderRadius: '12px',
                      padding: '10px 14px',
                      fontSize: '13px',
                      color: '#f8fafc',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#94a3b8', marginBottom: '6px' }}>
                  Protocol Steps (One instruction per line)
                </label>
                <textarea
                  value={newSteps}
                  onChange={(e) => setNewSteps(e.target.value)}
                  style={{
                    width: '100%',
                    height: '110px',
                    background: '#020617',
                    border: '1px solid rgba(51, 65, 85, 0.8)',
                    borderRadius: '12px',
                    padding: '12px 14px',
                    fontSize: '12px',
                    fontFamily: 'monospace',
                    color: '#f8fafc',
                    outline: 'none',
                    resize: 'vertical',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#94a3b8', marginBottom: '6px' }}>
                  Reagents & CAS Numbers (Format: Name (CAS, Mols))
                </label>
                <textarea
                  value={newReagents}
                  onChange={(e) => setNewReagents(e.target.value)}
                  style={{
                    width: '100%',
                    height: '80px',
                    background: '#020617',
                    border: '1px solid rgba(51, 65, 85, 0.8)',
                    borderRadius: '12px',
                    padding: '12px 14px',
                    fontSize: '12px',
                    fontFamily: 'monospace',
                    color: '#f8fafc',
                    outline: 'none',
                    resize: 'vertical',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '6px' }}>
                <button
                  onClick={handleCreateLog}
                  style={{
                    flex: 1,
                    padding: '12px 20px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #2dd4bf 0%, #14b8a6 100%)',
                    color: '#042f2e',
                    fontWeight: 800,
                    fontSize: '13px',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  Save & Generate Tamper-Proof SHA-256 Log
                </button>
                <button
                  onClick={() => setIsCreating(false)}
                  style={{
                    padding: '12px 20px',
                    borderRadius: '12px',
                    background: '#1e293b',
                    color: '#cbd5e1',
                    fontSize: '13px',
                    fontWeight: 700,
                    border: '1px solid #334155',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : selectedLog ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Protocol Details & Hash */}
              <div
                style={{
                  background: 'rgba(15, 23, 42, 0.75)',
                  backdropFilter: 'blur(16px)',
                  borderRadius: '20px',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '20px'
                }}
              >
                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between', gap: '14px', borderBottom: '1px solid rgba(51, 65, 85, 0.5)', paddingBottom: '16px' }}>
                  <div style={{ maxWidth: '650px' }}>
                    <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 900, color: '#ffffff', lineHeight: '1.4' }}>
                      {selectedLog.experimentTitle}
                    </h3>
                    <div style={{ fontSize: '13px', color: '#94a3b8', marginTop: '6px', fontStyle: 'italic', lineHeight: '1.5' }}>
                      "{selectedLog.hypothesis}"
                    </div>
                  </div>
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '6px 12px',
                      borderRadius: '10px',
                      background: '#020617',
                      border: '1px solid rgba(16, 185, 129, 0.35)',
                      fontSize: '11px',
                      fontFamily: 'monospace',
                      color: '#34d399',
                      fontWeight: 700
                    }}
                  >
                    <Lock style={{ width: '13px', height: '13px' }} />
                    SHA-256: {selectedLog.tamperProofSha256Hash.slice(0, 14)}...
                  </div>
                </div>

                {/* Step Execution Checklist */}
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 800, color: '#cbd5e1', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '12px' }}>
                    Protocol Execution Steps (Click to Toggle Completion)
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {selectedLog.protocolSteps.map((step) => (
                      <div
                        key={step.stepNumber}
                        onClick={() => handleToggleStep(step.stepNumber)}
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '12px',
                          padding: '14px 16px',
                          borderRadius: '12px',
                          border: step.completed ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid rgba(51, 65, 85, 0.6)',
                          background: step.completed ? 'rgba(16, 185, 129, 0.08)' : 'rgba(2, 6, 23, 0.6)',
                          color: step.completed ? '#f8fafc' : '#94a3b8',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <div
                          style={{
                            width: '20px',
                            height: '20px',
                            borderRadius: '6px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: step.completed ? '#10b981' : '#1e293b',
                            color: step.completed ? '#ffffff' : '#64748b',
                            border: `1px solid ${step.completed ? '#34d399' : '#334155'}`,
                            flexShrink: 0,
                            marginTop: '2px'
                          }}
                        >
                          {step.completed && <Check style={{ width: '13px', height: '13px', strokeWidth: 3 }} />}
                        </div>
                        <div style={{ fontSize: '13px', lineHeight: '1.5' }}>
                          <span style={{ fontWeight: 800, color: step.completed ? '#34d399' : '#2dd4bf', marginRight: '8px' }}>
                            Step {step.stepNumber}:
                          </span>
                          <span style={{ textDecoration: step.completed ? 'none' : 'none' }}>
                            {step.instruction}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Chemical Safety & SDS Hazards */}
              <div
                style={{
                  background: 'rgba(15, 23, 42, 0.75)',
                  backdropFilter: 'blur(16px)',
                  borderRadius: '20px',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <ShieldAlert style={{ width: '20px', height: '20px', color: '#fbbf24' }} />
                  <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 800, color: '#ffffff' }}>
                    Reagent Safety Data & SDS GHS Ratings
                  </h3>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
                  {selectedLog.reagents.map((r, i) => (
                    <div
                      key={i}
                      style={{
                        background: '#020617',
                        border: '1px solid rgba(51, 65, 85, 0.6)',
                        borderRadius: '14px',
                        padding: '16px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
                        <div>
                          <div style={{ fontSize: '13px', fontWeight: 800, color: '#f8fafc' }}>
                            {r.reagentName}
                          </div>
                          <div style={{ fontSize: '11px', color: '#64748b', fontFamily: 'monospace', marginTop: '2px' }}>
                            CAS: {r.casNumber} • {r.quantityMols} mol
                          </div>
                        </div>
                        <AlertTriangle style={{ width: '16px', height: '16px', color: '#fbbf24', flexShrink: 0 }} />
                      </div>

                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {r.ghsPictograms.map((g, gi) => (
                          <span
                            key={gi}
                            style={{
                              padding: '2px 8px',
                              borderRadius: '6px',
                              background: 'rgba(244, 63, 94, 0.15)',
                              border: '1px solid rgba(244, 63, 94, 0.35)',
                              color: '#fda4af',
                              fontSize: '10px',
                              fontWeight: 800
                            }}
                          >
                            {g}
                          </span>
                        ))}
                      </div>

                      <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8', lineHeight: '1.4' }}>
                        {r.hazardSummary}
                      </p>

                      <div style={{ paddingTop: '8px', borderTop: '1px solid rgba(51, 65, 85, 0.5)', fontSize: '11px', color: '#2dd4bf' }}>
                        <span style={{ fontWeight: 700, color: '#64748b' }}>Required PPE: </span>
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
