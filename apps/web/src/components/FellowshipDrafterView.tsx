import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  GraduationCap,
  Award,
  Download,
  CheckCircle2,
  FileText,
  Plus
} from 'lucide-react';
import { FellowshipProposal, FellowshipType } from '@studentlife/shared';

interface FellowshipDrafterViewProps {
  onAddXp?: (xp: number, reason: string) => void;
}

export const FellowshipDrafterView: React.FC<FellowshipDrafterViewProps> = ({ onAddXp }) => {
  const [proposals, setProposals] = useState<FellowshipProposal[]>([]);
  const [selectedProposal, setSelectedProposal] = useState<FellowshipProposal | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [fellowshipType, setFellowshipType] = useState<FellowshipType>('PMRF_INDIA');
  const [fieldInput, setFieldInput] = useState<string>('Quantum Machine Learning & Edge Computing');
  const [topicInput, setTopicInput] = useState<string>('');
  const [isDrafting, setIsDrafting] = useState<boolean>(false);

  useEffect(() => {
    fetchProposals();
  }, []);

  const fetchProposals = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/fellowship-drafter/proposals');
      const json = await res.json();
      if (json.success && json.data && json.data.length > 0) {
        setProposals(json.data);
        setSelectedProposal(json.data[0]);
      }
    } catch (err) {
      console.error('Failed to load fellowship proposals', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDraft = async () => {
    if (!fieldInput.trim() || !topicInput.trim()) return;
    setIsDrafting(true);
    try {
      const res = await fetch('/api/fellowship-drafter/draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fellowshipType,
          applicantField: fieldInput.trim(),
          primaryResearchTopic: topicInput.trim(),
        }),
      });
      const json = await res.json();
      if (json.success && json.data) {
        setProposals([json.data, ...proposals]);
        setSelectedProposal(json.data);
        setTopicInput('');
        onAddXp?.(55, `Generated ${fellowshipType.replace('_', ' ')} Research Proposal & SOP`);
      }
    } catch (err) {
      console.error('Failed to draft proposal', err);
    } finally {
      setIsDrafting(false);
    }
  };

  const handleDownload = () => {
    if (!selectedProposal) return;
    const content = `=====================================================
FELLOWSHIP APPLICATION PROPOSAL: ${selectedProposal.fellowshipType}
FIELD: ${selectedProposal.applicantField}
COMPETITIVE INDEX: ${selectedProposal.competitiveIndexScore}%
=====================================================

1. STATEMENT OF PURPOSE:
${selectedProposal.statementOfPurpose}

2. RESEARCH METHODOLOGY:
${selectedProposal.researchMethodology}

3. BROADER SOCIETAL & COMPUTATIONAL IMPACT:
${selectedProposal.broaderImpactStatements.map((s, i) => `[${i + 1}] ${s}`).join('\n')}

4. REFEREE ENDORSEMENT HIGHLIGHTS:
${selectedProposal.refereeBulletPoints.map((r) => `• ${r}`).join('\n')}
`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedProposal.fellowshipType}_Proposal.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1280px', margin: '0 auto', width: '100%' }}>
      {/* Header Banner */}
      <div className="glass-panel glow-hover" style={{
        padding: '24px 32px',
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(245, 158, 11, 0.1) 100%)',
        borderLeft: '4px solid #6366f1',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span className="badge badge-completed">
                <GraduationCap size={13} /> PHASE 71: GLOBAL FELLOWSHIP & PMRF DRAFTER
              </span>
              <span className="badge badge-active">FULBRIGHT • PMRF • DAAD • RHODES</span>
            </div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>
              Global Fellowship & <span className="gradient-text">PMRF Proposal Drafter</span>
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
              Autonomous doctoral grant & fellowship proposal generator, high-impact Statement of Purpose (SOP) builder, and faculty referee bullet synthesizers.
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '380px 1fr', gap: '20px' }}>
        {/* Left Column: Form & History */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Drafter Form */}
          <div className="glass-panel" style={{ padding: '20px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Plus size={16} color="#818cf8" /> Draft New Fellowship Proposal
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>
                  Target Fellowship Scheme
                </label>
                <select
                  value={fellowshipType}
                  onChange={(e) => setFellowshipType(e.target.value as FellowshipType)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    backgroundColor: 'rgba(15, 23, 42, 0.8)',
                    border: '1px solid var(--border-glass)',
                    color: '#fff',
                    fontSize: '0.85rem',
                  }}
                >
                  <option value="PMRF_INDIA">Prime Minister's Research Fellowship (PMRF India)</option>
                  <option value="FULBRIGHT_NEHRU">Fulbright-Nehru Doctoral Grant (USIEF)</option>
                  <option value="DAAD_GERMANY">DAAD Graduate Research Fellowship (Germany)</option>
                  <option value="RHODES_OXFORD">Rhodes Scholarship (University of Oxford)</option>
                  <option value="ERASMUS_MUNDUS">Erasmus Mundus Joint Master/Doctoral Grant</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>
                  Applicant Academic Field
                </label>
                <input
                  type="text"
                  placeholder="e.g. Distributed Consensus & Quantum Networks"
                  value={fieldInput}
                  onChange={(e) => setFieldInput(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    backgroundColor: 'rgba(15, 23, 42, 0.8)',
                    border: '1px solid var(--border-glass)',
                    color: '#fff',
                    fontSize: '0.85rem',
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>
                  Primary Doctoral / Research Problem Statement
                </label>
                <textarea
                  placeholder="Describe the central hypothesis, core bottleneck to overcome, and why this research matters..."
                  value={topicInput}
                  onChange={(e) => setTopicInput(e.target.value)}
                  rows={4}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    backgroundColor: 'rgba(15, 23, 42, 0.8)',
                    border: '1px solid var(--border-glass)',
                    color: '#fff',
                    fontSize: '0.8rem',
                    resize: 'none',
                  }}
                />
              </div>

              <button
                className="btn btn-primary"
                onClick={handleDraft}
                disabled={isDrafting || !fieldInput.trim() || !topicInput.trim()}
                style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}
              >
                <Sparkles size={15} /> {isDrafting ? 'Synthesizing Proposal...' : 'Synthesize Proposal (+55 XP)'}
              </button>
            </div>
          </div>

          {/* Proposal List */}
          <div className="glass-panel" style={{ padding: '20px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '12px' }}>Your Drafted Proposals</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {proposals.map((prop) => {
                const isSelected = selectedProposal?.id === prop.id;
                return (
                  <div
                    key={prop.id}
                    onClick={() => setSelectedProposal(prop)}
                    style={{
                      padding: '12px 14px',
                      borderRadius: '8px',
                      backgroundColor: isSelected ? 'rgba(99, 102, 241, 0.2)' : 'rgba(15, 23, 42, 0.6)',
                      border: isSelected ? '1px solid #6366f1' : '1px solid var(--border-glass)',
                      cursor: 'pointer',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.85rem', color: isSelected ? '#818cf8' : '#fff' }}>
                        {prop.fellowshipType.replace('_', ' ')}
                      </span>
                      <span className="badge badge-completed" style={{ fontSize: '0.65rem' }}>
                        {prop.competitiveIndexScore}% Index
                      </span>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      {prop.applicantField}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Detailed Proposal Inspection */}
        {selectedProposal ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="glass-panel" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid var(--border-glass)', paddingBottom: '14px' }}>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>
                    {selectedProposal.fellowshipType.replace('_', ' ')} Proposal
                  </h3>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    Field: {selectedProposal.applicantField}
                  </span>
                </div>

                <button
                  className="btn btn-secondary"
                  onClick={handleDownload}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem' }}
                >
                  <Download size={14} /> Download Proposal (.txt)
                </button>
              </div>

              {/* Statement of Purpose */}
              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#818cf8', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <FileText size={15} /> 1. Statement of Purpose (SOP)
                </h4>
                <div style={{
                  padding: '16px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(15, 23, 42, 0.7)',
                  border: '1px solid var(--border-glass)',
                  fontSize: '0.85rem',
                  lineHeight: 1.6,
                  color: '#e2e8f0',
                }}>
                  {selectedProposal.statementOfPurpose}
                </div>
              </div>

              {/* Research Methodology */}
              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#38bdf8', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Award size={15} /> 2. 3-Stage Research Methodology
                </h4>
                <pre style={{
                  padding: '16px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(15, 23, 42, 0.7)',
                  border: '1px solid var(--border-glass)',
                  fontSize: '0.8rem',
                  lineHeight: 1.6,
                  color: '#94a3b8',
                  whiteSpace: 'pre-wrap',
                  fontFamily: 'inherit',
                  margin: 0,
                }}>
                  {selectedProposal.researchMethodology}
                </pre>
              </div>

              {/* Broader Impact */}
              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#34d399', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle2 size={15} /> 3. Broader Societal & Computational Impact
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {selectedProposal.broaderImpactStatements.map((stmt, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: '10px 14px',
                        borderRadius: '6px',
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        borderLeft: '3px solid #10b981',
                        fontSize: '0.8rem',
                        color: '#a7f3d0',
                      }}
                    >
                      {stmt}
                    </div>
                  ))}
                </div>
              </div>

              {/* Referee Endorsements */}
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fbbf24', marginBottom: '8px' }}>
                  4. Recommended Highlights for Faculty Recommendation Letters
                </h4>
                <ul style={{ paddingLeft: '18px', margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  {selectedProposal.refereeBulletPoints.map((pt, idx) => (
                    <li key={idx}>{pt}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
            {isLoading ? 'Loading fellowship proposals...' : 'Select or draft a proposal to view details.'}
          </div>
        )}
      </div>
    </div>
  );
};
