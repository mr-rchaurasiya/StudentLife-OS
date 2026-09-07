import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Sparkles,
  ExternalLink,
  Copy,
  Search,
  CheckCircle2,
  FileText,
  Table,
  Layers
} from 'lucide-react';
import {
  ResearchPaperSummary,
  SearchPapersDto
} from '@studentlife/shared';

interface ArxivScholarViewProps {
  onAddXp?: (xp: number, reason: string) => void;
}

export const ArxivScholarView: React.FC<ArxivScholarViewProps> = ({ onAddXp }) => {
  const [papers, setPapers] = useState<ResearchPaperSummary[]>([]);
  const [activePaper, setActivePaper] = useState<ResearchPaperSummary | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('Diffusion Models in Latent Space');
  const [selectedDomain, setSelectedDomain] = useState<'AI_ML' | 'DISTRIBUTED_SYSTEMS' | 'QUANTUM_COMPUTING' | 'CYBERSECURITY'>('AI_ML');
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);

  useEffect(() => {
    fetchPapers();
  }, []);

  const fetchPapers = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/arxiv-scholar/papers');
      const data = await res.json();
      if (data.success && data.data) {
        setPapers(data.data);
        if (data.data.length > 0) {
          setActivePaper(data.data[0]);
        }
      }
    } catch (err) {
      console.error('Failed to fetch research papers', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchAndSummarize = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSearching(true);
      const dto: SearchPapersDto = {
        query: searchQuery,
        domain: selectedDomain
      };
      const res = await fetch('/api/arxiv-scholar/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dto)
      });
      const data = await res.json();
      if (data.success && data.data) {
        setPapers(prev => [data.data, ...prev.filter(p => p.id !== data.data.id)]);
        setActivePaper(data.data);
        onAddXp?.(30, 'Synthesized arXiv Literature Review');
      }
    } catch (err) {
      console.error('Failed to search papers', err);
    } finally {
      setIsSearching(false);
    }
  };

  const copyCitation = (text: string, formatName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedFormat(formatName);
    setTimeout(() => setCopiedFormat(null), 2000);
  };

  if (isLoading || !activePaper) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
        <BookOpen size={36} className="animate-pulse" style={{ margin: '0 auto 16px', color: 'var(--accent-primary)' }} />
        <p>Loading AI arXiv Scholar & Research Literature Review Synthesizer...</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Banner */}
      <div className="glass-panel" style={{
        padding: '24px 32px',
        background: 'linear-gradient(135deg, rgba(30, 27, 75, 0.7) 0%, rgba(15, 23, 42, 0.9) 100%)',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '16px'
      }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span className="badge badge-active" style={{ backgroundColor: 'rgba(99, 102, 241, 0.2)', color: '#818cf8' }}>
              <Sparkles size={12} /> PHASE 51 &bull; DEEP LITERATURE SYNTHESIZER
            </span>
            <span className="badge badge-completed">
              <CheckCircle2 size={12} /> arXiv / IEEE Direct Citation
            </span>
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>
            AI arXiv Scholar & <span className="gradient-text">Research Reviewer 📑</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
            Instantly ingest, summarize, and extract methodology & benchmark matrices with 1-click BibTeX export.
          </p>
        </div>

        <form onSubmit={handleSearchAndSummarize} style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
          <select
            value={selectedDomain}
            onChange={(e) => setSelectedDomain(e.target.value as any)}
            className="glass-input"
            style={{ padding: '8px 12px', fontSize: '0.85rem' }}
          >
            <option value="AI_ML">AI & Machine Learning</option>
            <option value="DISTRIBUTED_SYSTEMS">Distributed Systems & Cloud</option>
            <option value="QUANTUM_COMPUTING">Quantum Computing</option>
            <option value="CYBERSECURITY">Cybersecurity & Cryptography</option>
          </select>

          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search topic or arXiv ID..."
            className="glass-input"
            style={{ padding: '8px 14px', fontSize: '0.85rem', width: '220px' }}
            required
          />

          <button
            type="submit"
            disabled={isSearching}
            className="btn btn-primary"
            style={{ padding: '8px 18px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Search size={14} />
            {isSearching ? 'Ingesting...' : 'Synthesize'}
          </button>
        </form>
      </div>

      {/* Main Grid: Paper Selector & Deep Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '20px' }}>
        {/* Left: Papers List */}
        <div className="glass-panel" style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>
            INDEXED RESEARCH PAPERS
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {papers.map(p => (
              <div
                key={p.id}
                onClick={() => setActivePaper(p)}
                className="glow-hover"
                style={{
                  padding: '12px 14px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: activePaper.id === p.id ? 'rgba(99, 102, 241, 0.2)' : 'rgba(15, 23, 42, 0.6)',
                  border: activePaper.id === p.id ? '1px solid var(--accent-primary)' : '1px solid var(--border-glass)',
                  cursor: 'pointer'
                }}
              >
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: activePaper.id === p.id ? '#ffffff' : 'var(--text-primary)', marginBottom: '4px' }}>
                  {p.title}
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                  {p.conferenceOrJournal} &bull; {p.publishedYear}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Active Paper Deep Dive */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Header Card */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', marginBottom: '8px' }}>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#38bdf8' }}>
                  {activePaper.conferenceOrJournal} ({activePaper.publishedYear}) &bull; arXiv:{activePaper.arxivId}
                </span>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginTop: '4px', lineHeight: 1.3 }}>
                  {activePaper.title}
                </h3>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  By: {activePaper.authors.join(', ')}
                </div>
              </div>

              <a
                href={activePaper.pdfUrl}
                target="_blank"
                rel="noreferrer"
                className="btn btn-secondary"
                style={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px', whiteSpace: 'nowrap' }}
              >
                Open Original PDF <ExternalLink size={12} />
              </a>
            </div>

            {/* Abstract */}
            <div style={{
              marginTop: '16px',
              padding: '14px 16px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'rgba(9, 13, 22, 0.7)',
              border: '1px solid var(--border-glass)'
            }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-secondary)', marginBottom: '4px' }}>
                EXECUTIVE SUMMARY & CORE THESIS:
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                {activePaper.abstractSummary}
              </p>
            </div>
          </div>

          {/* Methodology & Benchmarks Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            {/* Core Methodology */}
            <div className="glass-panel" style={{ padding: '20px' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Layers size={16} color="var(--accent-primary)" />
                Core Algorithm & Architecture
              </h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                {activePaper.coreMethodology}
              </p>

              <div style={{ marginTop: '14px', paddingTop: '12px', borderTop: '1px solid var(--border-glass)' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px' }}>
                  KEY TAKEAWAYS FOR STUDENTS:
                </div>
                <ul style={{ paddingLeft: '18px', margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {activePaper.keyTakeaways.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Empirical Benchmarks */}
            <div className="glass-panel" style={{ padding: '20px' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Table size={16} color="#34d399" />
                Benchmark Results vs Baseline
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {activePaper.keyBenchmarks.map((bm, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: '10px 12px',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: 'rgba(15, 23, 42, 0.6)',
                      border: '1px solid var(--border-glass)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '0.8rem', fontWeight: 700 }}>{bm.metric}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                        Baseline: {bm.baselineScore}
                      </div>
                    </div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#34d399' }}>
                      {bm.score}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Citation Generator */}
          <div className="glass-panel" style={{ padding: '20px' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileText size={16} color="#fbbf24" />
              1-Click Academic Citations (BibTeX / APA / IEEE)
            </h4>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div style={{
                padding: '12px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'rgba(9, 13, 22, 0.8)',
                border: '1px solid var(--border-glass)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}>
                <div>
                  <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '4px' }}>
                    APA 7TH EDITION
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                    {activePaper.bibtex.apaFormatted}
                  </div>
                </div>
                <button
                  onClick={() => copyCitation(activePaper.bibtex.apaFormatted, 'APA')}
                  style={{
                    alignSelf: 'flex-end',
                    marginTop: '8px',
                    background: 'none',
                    border: 'none',
                    color: copiedFormat === 'APA' ? '#34d399' : 'var(--accent-primary)',
                    cursor: 'pointer',
                    fontSize: '0.7rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <Copy size={11} /> {copiedFormat === 'APA' ? 'Copied!' : 'Copy APA'}
                </button>
              </div>

              <div style={{
                padding: '12px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'rgba(9, 13, 22, 0.8)',
                border: '1px solid var(--border-glass)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}>
                <div>
                  <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '4px' }}>
                    RAW BIBTEX
                  </div>
                  <div style={{
                    fontSize: '0.7rem',
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--text-muted)',
                    maxHeight: '45px',
                    overflow: 'hidden'
                  }}>
                    {activePaper.bibtex.rawBibtex}
                  </div>
                </div>
                <button
                  onClick={() => copyCitation(activePaper.bibtex.rawBibtex, 'BibTeX')}
                  style={{
                    alignSelf: 'flex-end',
                    marginTop: '8px',
                    background: 'none',
                    border: 'none',
                    color: copiedFormat === 'BibTeX' ? '#34d399' : '#fbbf24',
                    cursor: 'pointer',
                    fontSize: '0.7rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <Copy size={11} /> {copiedFormat === 'BibTeX' ? 'Copied!' : 'Copy BibTeX'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
