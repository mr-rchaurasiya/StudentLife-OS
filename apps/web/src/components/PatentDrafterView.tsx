import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  FileCheck,
  Download,
  Search,
  CheckCircle,
  FileText,
  Shield
} from 'lucide-react';
import { ProvisionalPatentDraft, DraftPatentDto, PatentJurisdiction } from '@studentlife/shared';

interface PatentDrafterViewProps {
  onAddXp?: (xp: number, reason: string) => void;
}

export const PatentDrafterView: React.FC<PatentDrafterViewProps> = ({ onAddXp }) => {
  const [drafts, setDrafts] = useState<ProvisionalPatentDraft[]>([]);
  const [selectedDraft, setSelectedDraft] = useState<ProvisionalPatentDraft | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [titleInput, setTitleInput] = useState<string>('');
  const [descInput, setDescInput] = useState<string>('');
  const [fieldInput, setFieldInput] = useState<string>('Computer Science & Distributed Systems');
  const [jurisdiction, setJurisdiction] = useState<PatentJurisdiction>('IPO_INDIA');
  const [isDrafting, setIsDrafting] = useState<boolean>(false);

  useEffect(() => {
    fetchDrafts();
  }, []);

  const fetchDrafts = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/patent-drafter/drafts');
      const data = await res.json();
      if (data.success && data.data) {
        setDrafts(data.data);
        if (data.data.length > 0) {
          setSelectedDraft(data.data[0]);
        }
      }
    } catch (err) {
      console.error('Failed to fetch patent drafts', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDraftPatent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleInput.trim()) return;
    try {
      setIsDrafting(true);
      const dto: DraftPatentDto = {
        projectTitle: titleInput,
        projectDescription: descInput || titleInput,
        technicalField: fieldInput,
        jurisdiction
      };
      const res = await fetch('/api/patent-drafter/draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dto)
      });
      const data = await res.json();
      if (data.success && data.data) {
        setDrafts(prev => [data.data, ...prev]);
        setSelectedDraft(data.data);
        setTitleInput('');
        setDescInput('');
        onAddXp?.(40, 'Drafted Provisional Patent Application');
      }
    } catch (err) {
      console.error('Failed to draft patent', err);
    } finally {
      setIsDrafting(false);
    }
  };

  const handleExportPatent = () => {
    if (!selectedDraft) return;
    const content = `PROVISIONAL PATENT SPECIFICATION
Jurisdiction: ${selectedDraft.jurisdiction}
Title: ${selectedDraft.inventionTitle}
Inventors: ${selectedDraft.inventorNames.join(', ')}
Technical Field: ${selectedDraft.technicalField}
Patentability Score: ${selectedDraft.patentabilityScore}/100

1. TECHNICAL FIELD
${selectedDraft.technicalField}

2. BACKGROUND & PRIOR ART GAPS
${selectedDraft.backgroundPriorArtGaps.map((g, i) => `${i + 1}. ${g}`).join('\n')}

3. SUMMARY OF THE INVENTION
${selectedDraft.summaryOfInvention}

4. INDEPENDENT PATENT CLAIMS
${selectedDraft.independentClaims.join('\n')}

5. NOVELTY SEARCH STRINGS
${selectedDraft.noveltySearchKeywords.join('; ')}
`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `PATENT_SPEC_${selectedDraft.inventionTitle.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (isLoading || !selectedDraft) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
        <FileCheck size={36} className="animate-pulse" style={{ margin: '0 auto 16px', color: 'var(--accent-primary)' }} />
        <p>Loading Autonomous AI Patent & Student IP Drafter...</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top Banner */}
      <div className="glass-panel" style={{
        padding: '24px 32px',
        background: 'linear-gradient(135deg, rgba(217, 119, 6, 0.6) 0%, rgba(15, 23, 42, 0.9) 100%)',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '16px'
      }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span className="badge badge-active" style={{ backgroundColor: 'rgba(217, 119, 6, 0.2)', color: '#fbbf24' }}>
              <Sparkles size={12} /> PHASE 61 &bull; AI PATENT & IP DRAFTER
            </span>
            <span className="badge badge-completed">USPTO / IPO Provisional Drafting Engine</span>
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>
            Autonomous Patent & IP Drafter <span className="gradient-text">& Claims Synthesizer 📜</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
            Transform student capstone and research engineering projects into formal provisional patent specifications and claims.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <div className="glass-panel" style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Shield size={18} color="#fbbf24" />
            <div>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>PATENTABILITY</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff' }}>
                {selectedDraft.patentabilityScore}/100
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Available Drafts Strip */}
      {drafts.length > 1 && (
        <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '4px' }}>
          {drafts.map((d) => (
            <button
              key={d.id}
              onClick={() => setSelectedDraft(d)}
              className={`glass-pill ${selectedDraft.id === d.id ? 'badge-active' : ''}`}
              style={{
                padding: '6px 14px',
                fontSize: '0.75rem',
                border: selectedDraft.id === d.id ? '1px solid #fbbf24' : '1px solid var(--border-glass)',
                backgroundColor: selectedDraft.id === d.id ? 'rgba(245, 158, 11, 0.2)' : 'rgba(15, 23, 42, 0.6)',
                color: selectedDraft.id === d.id ? '#fbbf24' : 'var(--text-secondary)',
                cursor: 'pointer'
              }}
            >
              {d.inventionTitle}
            </button>
          ))}
        </div>
      )}

      {/* Main Grid: Specification Reader & Draft Generator Form */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '20px' }}>
        {/* Left: Patent Specification Document */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#fbbf24' }}>
                Jurisdiction: {selectedDraft.jurisdiction.replace('_', ' ')} &bull; {selectedDraft.technicalField}
              </span>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginTop: '2px' }}>
                {selectedDraft.inventionTitle}
              </h3>
            </div>
            <button
              onClick={handleExportPatent}
              className="btn btn-secondary"
              style={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Download size={14} /> Export Spec (.TXT)
            </button>
          </div>

          {/* Summary of Invention */}
          <div style={{
            padding: '14px 16px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'rgba(9, 13, 22, 0.8)',
            border: '1px solid var(--border-glass)'
          }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#fbbf24', marginBottom: '4px' }}>
              SUMMARY OF THE INVENTION:
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
              {selectedDraft.summaryOfInvention}
            </p>
          </div>

          {/* Background & Prior Art Gaps */}
          <div>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f43f5e', marginBottom: '6px' }}>
              Prior Art Gaps & Deficiencies:
            </h4>
            <ul style={{ paddingLeft: '18px', margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {selectedDraft.backgroundPriorArtGaps.map((gap, gIdx) => (
                <li key={gIdx}>{gap}</li>
              ))}
            </ul>
          </div>

          {/* Independent Claims */}
          <div>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#34d399', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle size={14} /> Formal Patent Claims:
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {selectedDraft.independentClaims.map((claim, cIdx) => (
                <div key={cIdx} style={{ fontSize: '0.78rem', color: '#ffffff', padding: '8px 12px', backgroundColor: 'rgba(15, 23, 42, 0.6)', borderRadius: '4px', borderLeft: '2px solid #34d399' }}>
                  {claim}
                </div>
              ))}
            </div>
          </div>

          {/* Novelty Search Strings */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Search size={12} /> Prior Art Search Keywords:
            </span>
            {selectedDraft.noveltySearchKeywords.map((kw, kIdx) => (
              <span key={kIdx} className="glass-pill" style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>
                {kw}
              </span>
            ))}
          </div>
        </div>

        {/* Right: Draft New Invention Form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileText size={18} color="#fbbf24" />
              Draft New Provisional Patent
            </h4>

            <form onSubmit={handleDraftPatent} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Invention Project Title</label>
                <input
                  type="text"
                  value={titleInput}
                  onChange={(e) => setTitleInput(e.target.value)}
                  placeholder="E.g., Low-Latency Cryptographic Key Exchange..."
                  className="glass-input"
                  style={{ width: '100%', padding: '8px 12px', fontSize: '0.85rem', marginTop: '4px' }}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Technical Field</label>
                <input
                  type="text"
                  value={fieldInput}
                  onChange={(e) => setFieldInput(e.target.value)}
                  className="glass-input"
                  style={{ width: '100%', padding: '8px 12px', fontSize: '0.85rem', marginTop: '4px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Jurisdiction Office</label>
                <select
                  value={jurisdiction}
                  onChange={(e) => setJurisdiction(e.target.value as PatentJurisdiction)}
                  className="glass-input"
                  style={{ width: '100%', padding: '8px 12px', fontSize: '0.85rem', marginTop: '4px' }}
                >
                  <option value="IPO_INDIA">IPO (Indian Patent Office)</option>
                  <option value="USPTO_USA">USPTO (United States)</option>
                  <option value="EPO_EUROPE">EPO (European Patent Office)</option>
                  <option value="WIPO_PCT">WIPO (International PCT)</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Project Description / Innovation Overview</label>
                <textarea
                  value={descInput}
                  onChange={(e) => setDescInput(e.target.value)}
                  placeholder="Describe your novel engineering algorithm, circuit, or apparatus..."
                  className="glass-input"
                  style={{ width: '100%', height: '100px', padding: '8px 12px', fontSize: '0.8rem', marginTop: '4px', resize: 'vertical' }}
                />
              </div>

              <button
                type="submit"
                disabled={isDrafting}
                className="btn btn-primary"
                style={{ padding: '10px 16px', fontSize: '0.85rem', marginTop: '4px' }}
              >
                {isDrafting ? 'Synthesizing Patent Claims...' : 'Synthesize Patent Draft (+40 XP)'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
