import { useState, useEffect } from 'react';
import {
  InternshipOpportunity,
  TrackedJobApplication,
  ApplicationPipelineStage,
  ColdOutreachTemplate,
} from '@studentlife/shared';
import {
  Compass,
  Briefcase,
  ExternalLink,
  Plus,
  Trash2,
  Clock,
  Sparkles,
  Search,
  Filter,
  ArrowRight,
  Trophy,
  Mail,
  Send,
  UserCheck,
  Bookmark,
  CheckCircle2,
} from 'lucide-react';

const KANBAN_STAGES: { stage: ApplicationPipelineStage; label: string; color: string; icon: any }[] = [
  { stage: 'SAVED', label: 'Saved & Researching', color: '#818cf8', icon: Bookmark },
  { stage: 'APPLIED', label: 'Applied & Awaiting', color: '#06b6d4', icon: Send },
  { stage: 'OA_ASSESSMENT', label: 'OA Assessment', color: '#f59e0b', icon: Clock },
  { stage: 'TECHNICAL_INTERVIEW', label: 'Technical Rounds', color: '#ec4899', icon: Briefcase },
  { stage: 'OFFER_RECEIVED', label: 'Offer Received 🏆', color: '#10b981', icon: Trophy },
];

export function InternshipRadarView() {
  const [activeTab, setActiveTab] = useState<'RADAR' | 'KANBAN' | 'COLD_OUTREACH'>('RADAR');
  const [opportunities, setOpportunities] = useState<InternshipOpportunity[]>([]);
  const [trackedApplications, setTrackedApplications] = useState<TrackedJobApplication[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState<'ALL' | 'REMOTE' | 'HYBRID' | 'ONSITE'>('ALL');
  const [isAddingCustomApp, setIsAddingCustomApp] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New application form state
  const [newAppCompany, setNewAppCompany] = useState('');
  const [newAppRole, setNewAppRole] = useState('');
  const [newAppStipend, setNewAppStipend] = useState('$9,000 / mo');
  const [newAppLocation, setNewAppLocation] = useState('Remote');
  const [newAppStage, setNewAppStage] = useState<ApplicationPipelineStage>('SAVED');
  const [newAppNotes, setNewAppNotes] = useState('');

  // Cold outreach generator state
  const [outreachCompany, setOutreachCompany] = useState('Stripe');
  const [outreachRole, setOutreachRole] = useState('Backend Software Engineering Intern');
  const [outreachRecipient, setOutreachRecipient] = useState('Elena Rostova');
  const [outreachProject, setOutreachProject] = useState('DistriCache (High-Throughput Raft Distributed Store)');
  const [outreachTemplate, setOutreachTemplate] = useState<ColdOutreachTemplate | null>(null);
  const [isGeneratingOutreach, setIsGeneratingOutreach] = useState(false);

  useEffect(() => {
    fetchOpportunities();
    fetchTrackedApplications();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const fetchOpportunities = async () => {
    try {
      const res = await fetch('/api/internships');
      const data = await res.json();
      if (data && data.success && data.data) {
        setOpportunities(data.data);
      }
    } catch {
      // Keep state
    }
  };

  const fetchTrackedApplications = async () => {
    try {
      const res = await fetch('/api/internships/tracked');
      const data = await res.json();
      if (data && data.success && data.data) {
        setTrackedApplications(data.data);
      }
    } catch {
      // Keep state
    }
  };

  const handleToggleBookmark = async (id: string) => {
    try {
      const res = await fetch(`/api/internships/${id}/bookmark`, { method: 'PATCH' });
      const data = await res.json();
      if (data && data.success && data.data) {
        setOpportunities(opportunities.map((o) => (o.id === id ? data.data : o)));
      }
    } catch {
      // Fallback
    }
  };

  const handleAddOpportunityToKanban = async (opp: InternshipOpportunity) => {
    try {
      const res = await fetch('/api/internships/tracked', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          opportunityId: opp.id,
          companyName: opp.companyName,
          roleTitle: opp.roleTitle,
          stipendOrSalary: opp.stipendOrSalary,
          location: opp.location,
          stage: 'SAVED',
          notes: `Added from Opportunity Radar. Match score: ${opp.matchScorePercent}%. Deadline: ${opp.applicationDeadline}`,
        }),
      });
      const data = await res.json();
      if (data && data.success && data.data) {
        setTrackedApplications([data.data, ...trackedApplications]);
        showToast(`Added ${opp.companyName} to your Kanban Application Pipeline! 🎯`);
      }
    } catch {
      // Fallback
    }
  };

  const handleCreateCustomApp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAppCompany || !newAppRole) return;

    try {
      const res = await fetch('/api/internships/tracked', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName: newAppCompany,
          roleTitle: newAppRole,
          stipendOrSalary: newAppStipend,
          location: newAppLocation,
          stage: newAppStage,
          notes: newAppNotes,
        }),
      });
      const data = await res.json();
      if (data && data.success && data.data) {
        setTrackedApplications([data.data, ...trackedApplications]);
        setIsAddingCustomApp(false);
        setNewAppCompany('');
        setNewAppRole('');
        setNewAppNotes('');
        showToast(`Application for ${newAppCompany} added to Kanban!`);
      }
    } catch {
      // Fallback
    }
  };

  const handleAdvanceStage = async (appId: string, currentStage: ApplicationPipelineStage) => {
    const stageOrder: ApplicationPipelineStage[] = ['SAVED', 'APPLIED', 'OA_ASSESSMENT', 'TECHNICAL_INTERVIEW', 'OFFER_RECEIVED'];
    const currentIndex = stageOrder.indexOf(currentStage);
    if (currentIndex === -1 || currentIndex >= stageOrder.length - 1) return;

    const nextStage = stageOrder[currentIndex + 1];

    try {
      const res = await fetch(`/api/internships/tracked/${appId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stage: nextStage }),
      });
      const data = await res.json();
      if (data && data.success && data.data) {
        setTrackedApplications(trackedApplications.map((a) => (a.id === appId ? data.data : a)));
        showToast(`Advanced to ${nextStage.replace(/_/g, ' ')}! 🚀`);
      }
    } catch {
      // Fallback
    }
  };

  const handleDeleteApplication = async (appId: string) => {
    try {
      await fetch(`/api/internships/tracked/${appId}`, { method: 'DELETE' });
      setTrackedApplications(trackedApplications.filter((a) => a.id !== appId));
      showToast('Application removed from tracker.');
    } catch {
      // Fallback
    }
  };

  const handleGenerateOutreach = async () => {
    setIsGeneratingOutreach(true);
    try {
      const res = await fetch('/api/internships/outreach-template', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName: outreachCompany,
          roleTitle: outreachRole,
          recipientName: outreachRecipient,
          studentKeyProject: outreachProject,
        }),
      });
      const data = await res.json();
      if (data && data.success && data.data) {
        setOutreachTemplate(data.data);
      }
    } catch {
      // Fallback
    } finally {
      setIsGeneratingOutreach(false);
    }
  };

  // Filter opportunities
  const filteredOpportunities = opportunities.filter((opp) => {
    const matchesSearch =
      opp.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.roleTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.requiredSkills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesLocation =
      locationFilter === 'ALL' || opp.workLocationType === locationFilter;

    return matchesSearch && matchesLocation;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header Banner */}
      <section className="glass-panel glow-hover" style={{
        padding: '24px 32px',
        background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%)',
        position: 'relative',
      }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '20px' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span className="badge badge-completed">
                <Compass size={12} /> PHASE 16 ACTIVE
              </span>
              <span className="badge badge-active">80% TOTAL OS PROGRESS</span>
              <span className="badge" style={{ backgroundColor: 'rgba(16, 185, 129, 0.2)', color: '#34d399', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                1 Offer Secured 🏆
              </span>
            </div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>
              Internships & Job Radar <span className="gradient-text">Engine</span>
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
              Curated elite tech internships, real-time Kanban application pipeline tracking, and AI cold outreach message generator.
            </p>
          </div>

          {/* Action Bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <button
              onClick={() => setIsAddingCustomApp(true)}
              className="btn btn-primary"
              style={{ padding: '8px 16px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Plus size={14} /> Add Application to Kanban
            </button>
            <button
              onClick={() => {
                setActiveTab('COLD_OUTREACH');
                if (!outreachTemplate) handleGenerateOutreach();
              }}
              className="btn btn-secondary"
              style={{ padding: '8px 16px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px', color: '#c084fc', borderColor: 'rgba(168, 85, 247, 0.3)' }}
            >
              <Sparkles size={14} /> AI Recruiter Outreach
            </button>
          </div>
        </div>

        {toastMessage && (
          <div style={{
            position: 'absolute',
            bottom: '12px',
            right: '24px',
            backgroundColor: '#10b981',
            color: '#ffffff',
            padding: '6px 14px',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.75rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.4)',
          }}>
            <CheckCircle2 size={13} /> {toastMessage}
          </div>
        )}
      </section>

      {/* Main Tabs */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border-glass)', paddingBottom: '12px' }}>
        <button
          onClick={() => setActiveTab('RADAR')}
          style={{
            padding: '8px 18px',
            borderRadius: 'var(--radius-full)',
            border: 'none',
            fontSize: '0.85rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: activeTab === 'RADAR' ? 'var(--accent-primary)' : 'rgba(255,255,255,0.04)',
            color: activeTab === 'RADAR' ? '#ffffff' : 'var(--text-secondary)',
          }}
        >
          <Compass size={15} /> Opportunity Radar ({opportunities.length})
        </button>
        <button
          onClick={() => setActiveTab('KANBAN')}
          style={{
            padding: '8px 18px',
            borderRadius: 'var(--radius-full)',
            border: 'none',
            fontSize: '0.85rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: activeTab === 'KANBAN' ? 'linear-gradient(135deg, #06b6d4, #3b82f6)' : 'rgba(255,255,255,0.04)',
            color: activeTab === 'KANBAN' ? '#ffffff' : 'var(--text-secondary)',
          }}
        >
          <Briefcase size={15} color={activeTab === 'KANBAN' ? '#fff' : '#22d3ee'} /> Application Pipeline ({trackedApplications.length})
        </button>
        <button
          onClick={() => {
            setActiveTab('COLD_OUTREACH');
            if (!outreachTemplate) handleGenerateOutreach();
          }}
          style={{
            padding: '8px 18px',
            borderRadius: 'var(--radius-full)',
            border: 'none',
            fontSize: '0.85rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: activeTab === 'COLD_OUTREACH' ? 'linear-gradient(135deg, #a855f7, #6366f1)' : 'rgba(255,255,255,0.04)',
            color: activeTab === 'COLD_OUTREACH' ? '#ffffff' : 'var(--text-secondary)',
          }}
        >
          <Mail size={15} color={activeTab === 'COLD_OUTREACH' ? '#fff' : '#c084fc'} /> Cold Outreach Assistant
        </button>
      </div>

      {/* Tab 1: Opportunity Radar */}
      {activeTab === 'RADAR' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Search & Location Filter Bar */}
          <div className="glass-panel" style={{ padding: '16px 20px', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: '260px' }}>
              <Search size={16} color="var(--text-muted)" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by company (Stripe, Google, OpenAI), role, or skill..."
                className="input-field"
                style={{ flex: 1, fontSize: '0.85rem', padding: '8px 12px' }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Filter size={14} color="var(--text-muted)" />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Location:</span>
              {(['ALL', 'REMOTE', 'HYBRID', 'ONSITE'] as const).map((loc) => (
                <button
                  key={loc}
                  onClick={() => setLocationFilter(loc)}
                  style={{
                    padding: '5px 12px',
                    borderRadius: 'var(--radius-full)',
                    border: 'none',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    backgroundColor: locationFilter === loc ? 'var(--accent-primary)' : 'rgba(255,255,255,0.05)',
                    color: locationFilter === loc ? '#ffffff' : 'var(--text-secondary)',
                  }}
                >
                  {loc}
                </button>
              ))}
            </div>
          </div>

          {/* Opportunities Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '20px' }}>
            {filteredOpportunities.map((opp) => (
              <div
                key={opp.id}
                className="glass-panel glow-hover"
                style={{
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  borderTop: `3px solid ${opp.matchScorePercent >= 90 ? 'var(--accent-emerald)' : '#6366f1'}`,
                }}
              >
                <div>
                  {/* Top company & badges */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <div>
                      <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff' }}>{opp.companyName}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{opp.location} &bull; {opp.workLocationType}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span className="badge" style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#34d399', fontWeight: 700, fontSize: '0.75rem' }}>
                        {opp.matchScorePercent}% Match
                      </span>
                      <button
                        onClick={() => handleToggleBookmark(opp.id)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: opp.isBookmarked ? '#fbbf24' : 'var(--text-muted)', padding: '4px' }}
                      >
                        <Bookmark size={16} fill={opp.isBookmarked ? '#fbbf24' : 'none'} />
                      </button>
                    </div>
                  </div>

                  {/* Role title & Stipend */}
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, lineHeight: 1.4, marginBottom: '8px' }}>
                    {opp.roleTitle}
                  </h4>

                  <div style={{ display: 'inline-block', padding: '4px 10px', borderRadius: '6px', backgroundColor: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', fontSize: '0.8rem', fontWeight: 700, marginBottom: '12px' }}>
                    💰 {opp.stipendOrSalary}
                  </div>

                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '14px' }}>
                    {opp.description}
                  </p>

                  {/* Skills match */}
                  <div style={{ marginBottom: '14px' }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                      Matched Competencies ({opp.matchedSkills.length}/{opp.requiredSkills.length}):
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                      {opp.matchedSkills.map((sk, idx) => (
                        <span key={idx} className="badge badge-completed" style={{ fontSize: '0.7rem' }}>
                          ✓ {sk}
                        </span>
                      ))}
                      {opp.missingSkills.map((sk, idx) => (
                        <span key={idx} className="badge badge-pending" style={{ fontSize: '0.7rem' }}>
                          + {sk}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Perks */}
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'flex', flexDirection: 'column', gap: '3px', marginBottom: '16px' }}>
                    {opp.perks.map((p, idx) => (
                      <div key={idx}>&bull; {p}</div>
                    ))}
                  </div>
                </div>

                {/* Card footer with actions */}
                <div style={{ paddingTop: '14px', borderTop: '1px solid var(--border-glass)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: '0.75rem', color: opp.daysRemaining <= 30 ? '#f87171' : 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={12} /> {opp.daysRemaining} days left
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => handleAddOpportunityToKanban(opp)}
                      className="btn btn-secondary"
                      style={{ padding: '6px 12px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                      <Plus size={12} /> Track in Kanban
                    </button>
                    <a
                      href={opp.applyUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-primary"
                      style={{ padding: '6px 12px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none' }}
                    >
                      Apply <ExternalLink size={12} />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Application Pipeline Kanban */}
      {activeTab === 'KANBAN' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, minmax(240px, 1fr))', gap: '16px', overflowX: 'auto', paddingBottom: '16px' }}>
          {KANBAN_STAGES.map(({ stage, label, color, icon: StageIcon }) => {
            const stageApps = trackedApplications.filter((a) => a.stage === stage);
            return (
              <div
                key={stage}
                className="glass-panel"
                style={{
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  backgroundColor: 'rgba(15, 23, 42, 0.6)',
                  borderTop: `3px solid ${color}`,
                  minHeight: '520px',
                }}
              >
                {/* Column Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '8px', borderBottom: '1px solid var(--border-glass)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 700, color }}>
                    <StageIcon size={14} /> {label}
                  </div>
                  <span className="badge" style={{ backgroundColor: 'rgba(255,255,255,0.08)', fontSize: '0.7rem', fontWeight: 700 }}>
                    {stageApps.length}
                  </span>
                </div>

                {/* Column Cards */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {stageApps.map((app) => (
                    <div
                      key={app.id}
                      className="glass-panel glow-hover"
                      style={{
                        padding: '14px',
                        backgroundColor: 'rgba(30, 41, 59, 0.7)',
                        border: '1px solid var(--border-glass)',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                        <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#ffffff' }}>{app.companyName}</div>
                        {app.referralStatus === 'SECURED' && (
                          <span className="badge" style={{ backgroundColor: 'rgba(16, 185, 129, 0.2)', color: '#34d399', fontSize: '0.65rem' }}>
                            <UserCheck size={10} /> Referral
                          </span>
                        )}
                      </div>

                      <div style={{ fontSize: '0.78rem', color: '#818cf8', fontWeight: 600, marginBottom: '6px' }}>
                        {app.roleTitle}
                      </div>

                      {app.stipendOrSalary && (
                        <div style={{ fontSize: '0.72rem', color: '#fbbf24', fontWeight: 700, marginBottom: '8px' }}>
                          💰 {app.stipendOrSalary}
                        </div>
                      )}

                      {app.notes && (
                        <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', lineHeight: 1.4, margin: '0 0 10px 0' }}>
                          {app.notes}
                        </p>
                      )}

                      {/* Card footer & advance controls */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '8px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                        <button
                          onClick={() => handleDeleteApplication(app.id)}
                          style={{ background: 'none', border: 'none', color: '#f43f5e', cursor: 'pointer', padding: '2px' }}
                          title="Remove from tracker"
                        >
                          <Trash2 size={12} />
                        </button>

                        {stage !== 'OFFER_RECEIVED' && (
                          <button
                            onClick={() => handleAdvanceStage(app.id, app.stage)}
                            className="btn btn-secondary"
                            style={{ padding: '4px 8px', fontSize: '0.68rem', display: 'flex', alignItems: 'center', gap: '4px', color: '#34d399' }}
                            title="Advance to next interview/application stage"
                          >
                            Advance <ArrowRight size={10} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}

                  {stageApps.length === 0 && (
                    <div style={{ padding: '24px 12px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.75rem', fontStyle: 'italic' }}>
                      No applications in this stage
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab 3: Cold Outreach & LinkedIn Message Generator */}
      {activeTab === 'COLD_OUTREACH' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 1fr) 2fr', gap: '24px', alignItems: 'start' }}>
          
          {/* Controls Form */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', color: '#c084fc' }}>
              <Sparkles size={16} /> Personalize Recruiter Outreach
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>Target Company</label>
                <input
                  type="text"
                  value={outreachCompany}
                  onChange={(e) => setOutreachCompany(e.target.value)}
                  className="input-field"
                  style={{ width: '100%', fontSize: '0.85rem', padding: '8px 12px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>Role Title</label>
                <input
                  type="text"
                  value={outreachRole}
                  onChange={(e) => setOutreachRole(e.target.value)}
                  className="input-field"
                  style={{ width: '100%', fontSize: '0.85rem', padding: '8px 12px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>Recipient Name (Recruiter / Manager)</label>
                <input
                  type="text"
                  value={outreachRecipient}
                  onChange={(e) => setOutreachRecipient(e.target.value)}
                  className="input-field"
                  style={{ width: '100%', fontSize: '0.85rem', padding: '8px 12px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>Highlight Project / Achievement</label>
                <input
                  type="text"
                  value={outreachProject}
                  onChange={(e) => setOutreachProject(e.target.value)}
                  className="input-field"
                  style={{ width: '100%', fontSize: '0.85rem', padding: '8px 12px' }}
                />
              </div>

              <button
                onClick={handleGenerateOutreach}
                disabled={isGeneratingOutreach}
                className="btn btn-primary"
                style={{ marginTop: '8px', padding: '10px', fontSize: '0.85rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px' }}
              >
                <Sparkles size={14} />
                {isGeneratingOutreach ? 'Generating Message...' : 'Generate Cold Email & LinkedIn Note'}
              </button>
            </div>
          </div>

          {/* Generated Templates View */}
          {outreachTemplate && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Cold Email */}
              <div className="glass-panel" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#34d399', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Mail size={16} /> 1. Tailored Cold Email Draft
                  </h4>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`Subject: ${outreachTemplate.subjectLine}\n\n${outreachTemplate.body}`);
                      showToast('Copied email to clipboard!');
                    }}
                    className="btn btn-secondary"
                    style={{ padding: '4px 10px', fontSize: '0.7rem' }}
                  >
                    Copy Email
                  </button>
                </div>

                <div style={{ padding: '10px 14px', borderRadius: '6px', backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-glass)', marginBottom: '10px', fontSize: '0.8rem', fontWeight: 600 }}>
                  <span style={{ color: 'var(--text-muted)' }}>Subject: </span>{outreachTemplate.subjectLine}
                </div>

                <pre style={{
                  padding: '16px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(9, 13, 22, 0.7)',
                  border: '1px solid var(--border-glass)',
                  fontFamily: 'inherit',
                  fontSize: '0.82rem',
                  lineHeight: 1.6,
                  color: 'var(--text-primary)',
                  whiteSpace: 'pre-wrap',
                  margin: 0,
                }}>
                  {outreachTemplate.body}
                </pre>
              </div>

              {/* LinkedIn Note */}
              <div className="glass-panel" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#818cf8', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Send size={16} /> 2. Short LinkedIn Connect Request (&lt; 300 chars)
                  </h4>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(outreachTemplate.linkedInConnectNote);
                      showToast('Copied LinkedIn note to clipboard!');
                    }}
                    className="btn btn-secondary"
                    style={{ padding: '4px 10px', fontSize: '0.7rem' }}
                  >
                    Copy Note
                  </button>
                </div>

                <div style={{
                  padding: '14px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(9, 13, 22, 0.7)',
                  border: '1px solid var(--border-glass)',
                  fontSize: '0.82rem',
                  lineHeight: 1.5,
                  color: '#ffffff',
                }}>
                  "{outreachTemplate.linkedInConnectNote}"
                </div>

                <div style={{ marginTop: '12px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Character Count: {outreachTemplate.linkedInConnectNote.length} / 300
                </div>
              </div>

              {/* Outreach Tips */}
              <div className="glass-panel" style={{ padding: '18px 24px', backgroundColor: 'rgba(245, 158, 11, 0.04)', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#fbbf24', marginBottom: '8px' }}>
                  💡 High-Response Outreach Strategy Tips:
                </div>
                <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {outreachTemplate.tips.map((t, idx) => (
                    <li key={idx}>{t}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Add Custom Application Modal */}
      {isAddingCustomApp && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '20px',
        }}>
          <div className="glass-panel" style={{ maxWidth: '500px', width: '100%', padding: '28px', backgroundColor: 'rgba(15, 23, 42, 0.95)' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Plus size={18} color="var(--accent-primary)" /> Add Application to Pipeline
            </h3>

            <form onSubmit={handleCreateCustomApp} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>Company Name *</label>
                <input
                  type="text"
                  required
                  value={newAppCompany}
                  onChange={(e) => setNewAppCompany(e.target.value)}
                  placeholder="e.g. Apple, Meta, OpenAI, Startup"
                  className="input-field"
                  style={{ width: '100%', fontSize: '0.85rem', padding: '8px 12px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>Role Title *</label>
                <input
                  type="text"
                  required
                  value={newAppRole}
                  onChange={(e) => setNewAppRole(e.target.value)}
                  placeholder="e.g. Distributed Systems Engineering Intern"
                  className="input-field"
                  style={{ width: '100%', fontSize: '0.85rem', padding: '8px 12px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>Stipend / Salary</label>
                  <input
                    type="text"
                    value={newAppStipend}
                    onChange={(e) => setNewAppStipend(e.target.value)}
                    className="input-field"
                    style={{ width: '100%', fontSize: '0.85rem', padding: '8px 12px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>Location</label>
                  <input
                    type="text"
                    value={newAppLocation}
                    onChange={(e) => setNewAppLocation(e.target.value)}
                    className="input-field"
                    style={{ width: '100%', fontSize: '0.85rem', padding: '8px 12px' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>Initial Stage</label>
                <select
                  value={newAppStage}
                  onChange={(e) => setNewAppStage(e.target.value as ApplicationPipelineStage)}
                  className="input-field"
                  style={{ width: '100%', fontSize: '0.85rem', padding: '8px 12px' }}
                >
                  <option value="SAVED">Saved & Researching</option>
                  <option value="APPLIED">Applied & Awaiting</option>
                  <option value="OA_ASSESSMENT">OA Assessment</option>
                  <option value="TECHNICAL_INTERVIEW">Technical Rounds</option>
                  <option value="OFFER_RECEIVED">Offer Received 🏆</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>Notes</label>
                <textarea
                  value={newAppNotes}
                  onChange={(e) => setNewAppNotes(e.target.value)}
                  placeholder="Referral contact, portal URL, interview prep notes..."
                  rows={2}
                  className="input-field"
                  style={{ width: '100%', fontSize: '0.8rem', padding: '8px 12px' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
                <button
                  type="button"
                  onClick={() => setIsAddingCustomApp(false)}
                  className="btn btn-secondary"
                  style={{ padding: '8px 16px', fontSize: '0.85rem' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ padding: '8px 18px', fontSize: '0.85rem' }}
                >
                  Add to Kanban
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
