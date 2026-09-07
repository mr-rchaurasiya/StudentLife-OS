import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Rocket,
  Presentation,
  Award,
  ExternalLink,
  DollarSign,
  Plus
} from 'lucide-react';
import { CampusStartupProject } from '@studentlife/shared';

interface CampusIncubatorViewProps {
  onAddXp?: (xp: number, reason: string) => void;
}

export const CampusIncubatorView: React.FC<CampusIncubatorViewProps> = ({ onAddXp }) => {
  const [projects, setProjects] = useState<CampusStartupProject[]>([]);
  const [selectedProject, setSelectedProject] = useState<CampusStartupProject | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [nameInput, setNameInput] = useState<string>('');
  const [industryInput, setIndustryInput] = useState<string>('AI & Distributed Cloud');
  const [ideaInput, setIdeaInput] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/campus-incubator/projects');
      const json = await res.json();
      if (json.success && json.data && json.data.length > 0) {
        setProjects(json.data);
        setSelectedProject(json.data[0]);
      }
    } catch (err) {
      console.error('Failed to load incubator projects', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateDeck = async () => {
    if (!nameInput.trim() || !ideaInput.trim()) return;
    setIsGenerating(true);
    try {
      const res = await fetch('/api/campus-incubator/generate-deck', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          startupName: nameInput.trim(),
          industryVertical: industryInput.trim(),
          rawProjectIdea: ideaInput.trim(),
        }),
      });
      const json = await res.json();
      if (json.success && json.data) {
        setProjects([json.data, ...projects]);
        setSelectedProject(json.data);
        setNameInput('');
        setIdeaInput('');
        onAddXp?.(50, 'Synthesized VC-Ready Startup Pitch Deck & TAM/SAM/SOM Model');
      }
    } catch (err) {
      console.error('Failed to synthesize pitch deck', err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1280px', margin: '0 auto', width: '100%' }}>
      {/* Header Banner */}
      <div className="glass-panel glow-hover" style={{
        padding: '24px 32px',
        background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(239, 68, 68, 0.1) 100%)',
        borderLeft: '4px solid #f59e0b',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span className="badge badge-completed">
                <Rocket size={13} /> PHASE 67: CAMPUS STARTUP INCUBATOR
              </span>
              <span className="badge badge-active">VC PITCH DECK + GRANTS RADAR</span>
            </div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>
              Campus Startup Incubator & <span className="gradient-text">AI Pitch Deck Synthesizer</span>
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
              Transform engineering projects & hackathon prototypes into investor-grade pitch decks, TAM/SAM/SOM models, and matching student founder grants.
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '380px 1fr', gap: '20px' }}>
        {/* Left Column: Form & Project Directory */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Deck Generator Form */}
          <div className="glass-panel" style={{ padding: '20px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Plus size={16} color="#fbbf24" /> Synthesize New Pitch Deck
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>
                  Startup / Venture Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. NeuroSync Labs"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
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
                  Industry Vertical
                </label>
                <select
                  value={industryInput}
                  onChange={(e) => setIndustryInput(e.target.value)}
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
                  <option value="AI & Distributed Cloud">AI & Distributed Cloud</option>
                  <option value="FinTech & Web3 Payments">FinTech & Web3 Payments</option>
                  <option value="EdTech & Skill Verification">EdTech & Skill Verification</option>
                  <option value="HealthTech & Bio-Sensors">HealthTech & Bio-Sensors</option>
                  <option value="ClimateTech & Clean Energy">ClimateTech & Clean Energy</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>
                  Core Project / Innovation Concept
                </label>
                <textarea
                  placeholder="Describe what your engineering system does, key technical innovation, and target customer..."
                  value={ideaInput}
                  onChange={(e) => setIdeaInput(e.target.value)}
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
                onClick={handleGenerateDeck}
                disabled={isGenerating || !nameInput.trim() || !ideaInput.trim()}
                style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}
              >
                <Sparkles size={15} /> {isGenerating ? 'Synthesizing 10-Slide Deck...' : 'Generate Pitch Deck (+50 XP)'}
              </button>
            </div>
          </div>

          {/* Project List */}
          <div className="glass-panel" style={{ padding: '20px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '12px' }}>Venture Portfolio</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {projects.map((proj) => {
                const isSelected = selectedProject?.id === proj.id;
                return (
                  <div
                    key={proj.id}
                    onClick={() => setSelectedProject(proj)}
                    style={{
                      padding: '12px 14px',
                      borderRadius: '8px',
                      backgroundColor: isSelected ? 'rgba(245, 158, 11, 0.15)' : 'rgba(15, 23, 42, 0.6)',
                      border: isSelected ? '1px solid #f59e0b' : '1px solid var(--border-glass)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.9rem', color: isSelected ? '#fbbf24' : '#fff' }}>
                        {proj.startupName}
                      </span>
                      <span className="badge" style={{ fontSize: '0.65rem', backgroundColor: 'rgba(245, 158, 11, 0.2)', color: '#fbbf24' }}>
                        {proj.stage.replace('_', ' ')}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      {proj.industryVertical}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Active Project Details & Pitch Deck Slides Preview */}
        {selectedProject ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Top Metrics Strip */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px' }}>
              <div className="glass-panel" style={{ padding: '16px', borderLeft: '3px solid #f59e0b' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Total Addressable Market</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fbbf24', marginTop: '4px' }}>
                  {selectedProject.tamSamSom.tam}
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '2px' }}>Global Market Ceiling</div>
              </div>

              <div className="glass-panel" style={{ padding: '16px', borderLeft: '3px solid #10b981' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Target SOM (Year 1)</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#34d399', marginTop: '4px' }}>
                  {selectedProject.tamSamSom.som}
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '2px' }}>Beachhead Demographic</div>
              </div>

              <div className="glass-panel" style={{ padding: '16px', borderLeft: '3px solid #06b6d4' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Unit CAC / LTV</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#22d3ee', marginTop: '4px' }}>
                  {selectedProject.unitEconomics.cac} / {selectedProject.unitEconomics.ltv}
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '2px' }}>{selectedProject.unitEconomics.paybackMonths} Mo Payback</div>
              </div>

              <div className="glass-panel" style={{ padding: '16px', borderLeft: '3px solid #a855f7' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Eligible Grants</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#c084fc', marginTop: '4px' }}>
                  {selectedProject.matchedGrants.length} Schemes
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '2px' }}>₹4.2 Cr+ Matchmaker</div>
              </div>
            </div>

            {/* Slide Deck Carousel / Grid */}
            <div className="glass-panel" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Presentation size={18} color="#fbbf24" /> VC-Ready Pitch Deck ({selectedProject.slides.length} Slides)
                </h3>
                <span className="badge badge-active">Investor Deck Structure</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
                {selectedProject.slides.map((slide) => (
                  <div
                    key={slide.slideNumber}
                    style={{
                      padding: '16px',
                      borderRadius: '10px',
                      backgroundColor: 'rgba(15, 23, 42, 0.7)',
                      border: '1px solid var(--border-glass)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      minHeight: '180px',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#fbbf24' }}>
                          SLIDE {slide.slideNumber}: {slide.title}
                        </span>
                        {slide.metricHighlight && (
                          <span className="badge badge-completed" style={{ fontSize: '0.65rem' }}>
                            {slide.metricHighlight}
                          </span>
                        )}
                      </div>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '8px', color: '#fff' }}>
                        {slide.headline}
                      </div>
                      <ul style={{ paddingLeft: '16px', margin: 0, fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                        {slide.bulletPoints.map((bp, idx) => (
                          <li key={idx}>{bp}</li>
                        ))}
                      </ul>
                    </div>

                    <div style={{
                      marginTop: '12px',
                      padding: '6px 10px',
                      borderRadius: '6px',
                      backgroundColor: 'rgba(0, 0, 0, 0.3)',
                      fontSize: '0.7rem',
                      color: '#94a3b8',
                      borderLeft: '2px solid #06b6d4',
                    }}>
                      Visual: {slide.visualCallout}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Matched Grants Radar */}
            <div className="glass-panel" style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Award size={18} color="#34d399" /> Matched Student Founder Grants & Fellowships
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
                {selectedProject.matchedGrants.map((grant) => (
                  <div
                    key={grant.id}
                    style={{
                      padding: '16px',
                      borderRadius: '10px',
                      backgroundColor: 'rgba(15, 23, 42, 0.6)',
                      border: '1px solid var(--border-glass)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                        <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#34d399' }}>
                          {grant.grantName}
                        </span>
                        <span className="badge" style={{ fontSize: '0.7rem', backgroundColor: 'rgba(16, 185, 129, 0.2)', color: '#34d399' }}>
                          {grant.eligibilityScore}% Fit
                        </span>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                        {grant.agency}
                      </div>
                      <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <DollarSign size={14} /> Max Non-Dilutive Grant: ₹{(grant.maxFundingINR / 100000).toFixed(1)} Lakhs
                      </div>
                    </div>

                    <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                        Deadline: {grant.applicationDeadline}
                      </span>
                      <a
                        href={grant.applicationUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-secondary"
                        style={{ fontSize: '0.7rem', padding: '4px 10px', display: 'flex', alignItems: 'center', gap: '4px' }}
                      >
                        Apply <ExternalLink size={11} />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
            {isLoading ? 'Loading campus venture projects...' : 'Select or create a project to inspect pitch decks.'}
          </div>
        )}
      </div>
    </div>
  );
};
