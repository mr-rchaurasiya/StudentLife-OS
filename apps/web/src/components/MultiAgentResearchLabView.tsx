import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Bot,
  Layers,
  Send,
  Download,
  GitBranch,
  Search,
  BookOpen,
  Award
} from 'lucide-react';
import { ResearchHypothesisProposal, RunResearchAgentsDto } from '@studentlife/shared';

interface MultiAgentResearchLabViewProps {
  onAddXp?: (xp: number, reason: string) => void;
}

export const MultiAgentResearchLabView: React.FC<MultiAgentResearchLabViewProps> = ({ onAddXp }) => {
  const [proposals, setProposals] = useState<ResearchHypothesisProposal[]>([]);
  const [selectedProposal, setSelectedProposal] = useState<ResearchHypothesisProposal | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [topicInput, setTopicInput] = useState<string>('');
  const [domainInput, setDomainInput] = useState<string>('AI & Distributed Systems');
  const [isSynthesizing, setIsSynthesizing] = useState<boolean>(false);

  useEffect(() => {
    fetchProposals();
  }, []);

  const fetchProposals = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/research-lab/proposals');
      const data = await res.json();
      if (data.success && data.data) {
        setProposals(data.data);
        if (data.data.length > 0) {
          setSelectedProposal(data.data[0]);
        }
      }
    } catch (err) {
      console.error('Failed to fetch research proposals', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRunAgents = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topicInput.trim()) return;
    try {
      setIsSynthesizing(true);
      const dto: RunResearchAgentsDto = {
        researchTopic: topicInput,
        domain: domainInput
      };
      const res = await fetch('/api/research-lab/run-agents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dto)
      });
      const data = await res.json();
      if (data.success && data.data) {
        setProposals(prev => [data.data, ...prev]);
        setSelectedProposal(data.data);
        setTopicInput('');
        onAddXp?.(35, 'Synthesized Multi-Agent Research Proposal');
      }
    } catch (err) {
      console.error('Failed to run research agents', err);
    } finally {
      setIsSynthesizing(false);
    }
  };

  const handleExportProposal = () => {
    if (!selectedProposal) return;
    const content = `# Research Thesis Proposal: ${selectedProposal.topicTitle}
Domain: ${selectedProposal.domain}
Generated: ${new Date(selectedProposal.createdAt).toLocaleString()}

## 1. Core Hypothesis Statement
${selectedProposal.hypothesisStatement}

## 2. Literature Gaps Identified
${selectedProposal.literatureGapsIdentified.map((g, i) => `${i + 1}. ${g}`).join('\n')}

## 3. Proposed Methodology
${selectedProposal.proposedMethodology}

## 4. Experiment Blueprint & Ablations
${selectedProposal.suggestedExperimentSteps.map((s, i) => `${i + 1}. ${s}`).join('\n')}

## 5. Target Conferences
${selectedProposal.targetConferencesOrJournals.join(', ')}
`;
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedProposal.topicTitle.replace(/\s+/g, '_')}_Proposal.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (isLoading || !selectedProposal) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
        <Bot size={36} className="animate-pulse" style={{ margin: '0 auto 16px', color: 'var(--accent-primary)' }} />
        <p>Loading Autonomous Multi-Agent AI Research Lab...</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top Banner */}
      <div className="glass-panel" style={{
        padding: '24px 32px',
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.6) 0%, rgba(15, 23, 42, 0.9) 100%)',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '16px'
      }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span className="badge badge-active" style={{ backgroundColor: 'rgba(99, 102, 241, 0.2)', color: '#818cf8' }}>
              <Sparkles size={12} /> PHASE 56 &bull; MULTI-AGENT AI RESEARCH LAB
            </span>
            <span className="badge badge-completed">Autonomous Dialogue Mesh</span>
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>
            Multi-Agent AI Research Lab <span className="gradient-text">& Proposal Synthesizer 🧬</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
            3 Autonomous AI Agents (Lit Scout Ada, Critic Karl, Synthesizer Sophia) formulate novel research hypotheses & experiment blueprints.
          </p>
        </div>

        <form onSubmit={handleRunAgents} style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
          <input
            type="text"
            value={topicInput}
            onChange={(e) => setTopicInput(e.target.value)}
            placeholder="E.g., Quantum-Resistant Post-Quantum Kyber VPN..."
            className="glass-input"
            style={{ padding: '8px 14px', fontSize: '0.85rem', width: '260px' }}
            required
          />
          <select
            value={domainInput}
            onChange={(e) => setDomainInput(e.target.value)}
            className="glass-input"
            style={{ padding: '8px 10px', fontSize: '0.85rem', width: '160px' }}
          >
            <option value="AI & Distributed Systems">AI & Distributed</option>
            <option value="Quantum & Cryptography">Quantum Crypto</option>
            <option value="Robotics & Control Systems">Edge Robotics</option>
            <option value="Bioinformatics & Genomics">Bioinformatics</option>
          </select>
          <button
            type="submit"
            disabled={isSynthesizing}
            className="btn btn-primary"
            style={{ padding: '8px 18px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Send size={14} />
            {isSynthesizing ? 'Agents Deliberating...' : 'Run 3-Agent Lab'}
          </button>
        </form>
      </div>

      {/* Available Proposals Strip */}
      {proposals.length > 1 && (
        <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '4px' }}>
          {proposals.map((prop) => (
            <button
              key={prop.id}
              onClick={() => setSelectedProposal(prop)}
              className={`glass-pill ${selectedProposal.id === prop.id ? 'badge-active' : ''}`}
              style={{
                padding: '6px 14px',
                fontSize: '0.75rem',
                border: selectedProposal.id === prop.id ? '1px solid #818cf8' : '1px solid var(--border-glass)',
                backgroundColor: selectedProposal.id === prop.id ? 'rgba(99, 102, 241, 0.2)' : 'rgba(15, 23, 42, 0.6)',
                color: selectedProposal.id === prop.id ? '#818cf8' : 'var(--text-secondary)',
                cursor: 'pointer'
              }}
            >
              {prop.topicTitle}
            </button>
          ))}
        </div>
      )}

      {/* Main Grid: Multi-Agent Chat Transcript & Formulated Thesis Blueprint */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1.3fr', gap: '20px' }}>
        {/* Left: Agent Synchronous Deliberation Feed */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Bot size={18} color="#818cf8" />
              Autonomous Agent Debate Mesh
            </h4>
            <span className="badge badge-active" style={{ fontSize: '0.7rem' }}>
              3 Agents Active
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxHeight: '520px', overflowY: 'auto' }}>
            {selectedProposal.agentDialogues.map((dialogue, idx) => (
              <div
                key={idx}
                style={{
                  padding: '14px 16px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'rgba(9, 13, 22, 0.8)',
                  borderLeft: `3px solid ${dialogue.avatarColor}`,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 800, color: dialogue.avatarColor }}>
                    {dialogue.agentName}
                  </span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                    {dialogue.timestamp}
                  </span>
                </div>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  {dialogue.content}
                </p>
                {dialogue.citationsReferenced.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '4px' }}>
                    {dialogue.citationsReferenced.map((cite, cIdx) => (
                      <span key={cIdx} className="glass-pill" style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                        <Search size={10} style={{ marginRight: '3px' }} /> {cite}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right: Structured Thesis Proposal Output */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#a78bfa' }}>
                  {selectedProposal.domain}
                </span>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginTop: '2px' }}>
                  {selectedProposal.topicTitle}
                </h3>
              </div>
              <button
                onClick={handleExportProposal}
                className="btn btn-secondary"
                style={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <Download size={14} /> Export Proposal .MD
              </button>
            </div>

            {/* Hypothesis Box */}
            <div style={{
              padding: '14px 16px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'rgba(99, 102, 241, 0.1)',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              marginBottom: '16px'
            }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#818cf8', marginBottom: '4px' }}>
                FORMAL RESEARCH HYPOTHESIS:
              </div>
              <div style={{ fontSize: '0.85rem', color: '#ffffff', lineHeight: 1.5, fontStyle: 'italic' }}>
                "{selectedProposal.hypothesisStatement}"
              </div>
            </div>

            {/* Literature Gaps */}
            <div style={{ marginBottom: '14px' }}>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f43f5e', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Layers size={14} /> Unaddressed Literature Gaps:
              </h4>
              <ul style={{ paddingLeft: '18px', margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {selectedProposal.literatureGapsIdentified.map((gap, gIdx) => (
                  <li key={gIdx}>{gap}</li>
                ))}
              </ul>
            </div>

            {/* Proposed Methodology */}
            <div style={{ marginBottom: '14px' }}>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#2dd4bf', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <GitBranch size={14} /> Proposed Methodology:
              </h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                {selectedProposal.proposedMethodology}
              </p>
            </div>

            {/* Suggested Experiments */}
            <div style={{ marginBottom: '14px' }}>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fbbf24', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <BookOpen size={14} /> Experiment Matrix & Ablations:
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {selectedProposal.suggestedExperimentSteps.map((step, sIdx) => (
                  <div key={sIdx} style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', padding: '6px 10px', backgroundColor: 'rgba(15, 23, 42, 0.6)', borderRadius: '4px' }}>
                    {step}
                  </div>
                ))}
              </div>
            </div>

            {/* Target Conferences */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '12px' }}>
              <Award size={14} color="#a855f7" />
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>Target Publication:</span>
              <div style={{ display: 'flex', gap: '6px' }}>
                {selectedProposal.targetConferencesOrJournals.map((conf, cIdx) => (
                  <span key={cIdx} className="badge badge-active" style={{ fontSize: '0.7rem' }}>
                    {conf}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
