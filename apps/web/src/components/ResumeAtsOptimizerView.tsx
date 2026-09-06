import { useState, useEffect } from 'react';
import {
  StudentResumeData,
  AtsScoreReport,
  AiInterviewMockQuestion,
  AtsBulletSuggestion,
} from '@studentlife/shared';
import {
  FileCheck2,
  Sparkles,
  Printer,
  CheckCircle2,
  Zap,
  Briefcase,
  Layers,
  Plus,
  Trash2,
  Target,
  RefreshCw,
} from 'lucide-react';

const DEFAULT_RESUME: StudentResumeData = {
  id: 'resume-demo-01',
  userId: 'demo-student-uuid-01',
  templateId: 'MODERN_SINGLE_COLUMN',
  contact: {
    fullName: 'Alex Morgan',
    email: 'alex.morgan.cs@gmail.com',
    phone: '+1 (555) 234-5678',
    location: 'San Francisco, CA / Seattle, WA',
    githubUrl: 'https://github.com/alexmorgan-cs',
    linkedinUrl: 'https://linkedin.com/in/alex-morgan-cs',
    portfolioUrl: 'https://alexmorgan.dev',
  },
  headline: 'Software Engineer & Distributed Systems Enthusiast',
  professionalSummary:
    'Computer Science senior with proven experience in building high-throughput backend services, distributed caching layers, and microservices architecture. Proficient in Go, TypeScript, PostgreSQL, and Redis. Passionate about low-latency systems and cloud reliability.',
  education: [
    {
      id: 'edu-1',
      institution: 'University of California, Berkeley',
      degree: 'Bachelor of Science',
      fieldOfStudy: 'Computer Science & Engineering',
      startDate: 'Aug 2022',
      endDate: 'May 2026 (Expected)',
      cgpaOrGrade: '3.88 / 4.00 (Dean\'s Honor List)',
      relevantCoursework: [
        'Distributed Systems',
        'Data Structures & Algorithms',
        'Database Systems',
        'Computer Networks',
        'Operating Systems',
      ],
    },
  ],
  experience: [
    {
      id: 'exp-1',
      role: 'Backend Engineering Intern',
      company: 'Stripe / FinTech Infrastructure',
      location: 'San Francisco, CA',
      startDate: 'May 2025',
      endDate: 'Aug 2025',
      isCurrentRole: false,
      bulletPoints: [
        'Engineered an idempotent payout reconciliation microservice in Go and PostgreSQL handling over 250,000 daily financial transactions with 99.999% data consistency.',
        'Architected a multi-tier Redis caching strategy that slashed API endpoint p99 latency from 320ms down to 42ms under peak 15,000 RPS traffic loads.',
        'Designed comprehensive integration test suites using Docker containers and mock payment gateways, boosting test coverage from 64% to 92%.',
      ],
    },
    {
      id: 'exp-2',
      role: 'Undergraduate Research Assistant',
      company: 'Berkeley RISELab',
      location: 'Berkeley, CA',
      startDate: 'Jan 2024',
      endDate: 'Dec 2024',
      isCurrentRole: false,
      bulletPoints: [
        'Benchmarked Raft consensus algorithm leader election failover latencies in geo-distributed network topologies with simulated packet drops.',
        'Authored performance telemetry logging pipelines in Rust to stream sub-millisecond heartbeat metrics to Prometheus and Grafana dashboards.',
      ],
    },
  ],
  projects: [
    {
      id: 'proj-1',
      title: 'DistriCache: High-Performance Distributed Key-Value Store',
      technologies: ['Go', 'Raft Consensus', 'gRPC', 'Protobuf', 'Docker'],
      githubUrl: 'https://github.com/alexmorgan-cs/districache',
      liveUrl: 'https://districache-demo.dev',
      bulletPoints: [
        'Implemented a distributed in-memory key-value store using the Raft consensus protocol for strong linearizable consistency and automatic failover.',
        'Achieved 12,000 write operations/sec and 45,000 read operations/sec across 5 replicated nodes with sub-5ms cluster replication latency.',
        'Integrated gRPC streaming protocol and custom binary serialization for optimal network serialization overhead.',
      ],
    },
    {
      id: 'proj-2',
      title: 'StreamPulse: Real-Time Event Analytics Pipeline',
      technologies: ['TypeScript', 'Apache Kafka', 'Node.js', 'PostgreSQL', 'Redis', 'TailwindCSS'],
      githubUrl: 'https://github.com/alexmorgan-cs/streampulse',
      liveUrl: 'https://streampulse.dev',
      bulletPoints: [
        'Built an end-to-end telemetry pipeline ingesting 50,000 real-time client analytics events per minute via distributed Apache Kafka partitions.',
        'Developed sliding-window aggregation consumers computing rolling metrics with Redis HyperLogLog for unique visitor cardinality estimation.',
      ],
    },
  ],
  skillCategories: [
    {
      categoryName: 'Languages',
      skills: ['Go', 'TypeScript', 'Python', 'C / C++', 'SQL', 'Rust'],
    },
    {
      categoryName: 'Backend & Distributed',
      skills: ['Node.js', 'gRPC', 'Redis', 'Apache Kafka', 'PostgreSQL', 'RESTful APIs', 'Microservices'],
    },
    {
      categoryName: 'Cloud & DevOps',
      skills: ['Docker', 'Kubernetes', 'AWS', 'CI/CD (GitHub Actions)', 'Prometheus', 'Linux'],
    },
    {
      categoryName: 'Core Computer Science',
      skills: ['Data Structures & Algorithms', 'Distributed Systems', 'Database Indexing', 'Concurrency', 'TCP/IP'],
    },
  ],
  certifications: [
    'AWS Certified Solutions Architect – Associate (2025)',
    'Certified Kubernetes Application Developer (CKAD)',
  ],
  achievements: [
    '1st Place Winner – CalHacks 11.0 (Distributed Infrastructure Track)',
    'Top 2.5% Globally on LeetCode (Knight Badge, 2150+ Contest Rating)',
  ],
  updatedAt: new Date().toISOString(),
};

export function ResumeAtsOptimizerView() {
  const [activeTab, setActiveTab] = useState<'EDITOR_PREVIEW' | 'ATS_DIAGNOSTICS' | 'INTERVIEW_SIMULATOR'>('EDITOR_PREVIEW');
  const [resume, setResume] = useState<StudentResumeData>(DEFAULT_RESUME);
  const [atsReport, setAtsReport] = useState<AtsScoreReport | null>(null);
  const [jobDescriptionInput, setJobDescriptionInput] = useState<string>('');
  const [targetRoleTitle, setTargetRoleTitle] = useState<string>('Distributed Systems & Backend Engineer');
  const [isScanningAts, setIsScanningAts] = useState<boolean>(false);
  const [interviewQuestions, setInterviewQuestions] = useState<AiInterviewMockQuestion[]>([]);
  const [isGeneratingInterview, setIsGeneratingInterview] = useState<boolean>(false);
  const [optimizingBulletIndex, setOptimizingBulletIndex] = useState<{ expIdx?: number; projIdx?: number; bulletIdx: number } | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveToast, setSaveToast] = useState(false);

  useEffect(() => {
    fetchResume();
  }, []);

  const fetchResume = async () => {
    try {
      const res = await fetch('/api/resume');
      const data = await res.json();
      if (data && data.success && data.data) {
        setResume(data.data);
        runAtsAnalysis(data.data);
      } else {
        runAtsAnalysis(DEFAULT_RESUME);
      }
    } catch {
      runAtsAnalysis(DEFAULT_RESUME);
    }
  };

  const handleSaveResume = async () => {
    setIsSaving(true);
    try {
      await fetch('/api/resume', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(resume),
      });
      setSaveToast(true);
      setTimeout(() => setSaveToast(false), 3000);
      runAtsAnalysis(resume);
    } catch {
      // Keep state
    } finally {
      setIsSaving(false);
    }
  };

  const runAtsAnalysis = async (resumeData: StudentResumeData = resume) => {
    setIsScanningAts(true);
    try {
      const res = await fetch('/api/resume/analyze-ats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resume: resumeData,
          targetRole: targetRoleTitle,
          jobDescriptionText: jobDescriptionInput,
        }),
      });
      const data = await res.json();
      if (data && data.success && data.data) {
        setAtsReport(data.data);
      }
    } catch {
      // Fallback
    } finally {
      setIsScanningAts(false);
    }
  };

  const handleOptimizeBullet = async (
    targetText: string,
    expIdx?: number,
    projIdx?: number,
    bulletIdx: number = 0
  ) => {
    setOptimizingBulletIndex({ expIdx, projIdx, bulletIdx });
    try {
      const res = await fetch('/api/resume/optimize-bullet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bulletPoint: targetText,
          roleOrProjectContext: expIdx !== undefined ? resume.experience[expIdx]?.role : resume.projects[projIdx || 0]?.title,
        }),
      });
      const data = await res.json();
      if (data && data.success && data.data) {
        const suggestion: AtsBulletSuggestion = data.data;

        // Apply enhanced bullet point
        const updatedResume = { ...resume };
        if (expIdx !== undefined && updatedResume.experience[expIdx]) {
          const bullets = [...updatedResume.experience[expIdx].bulletPoints];
          bullets[bulletIdx] = suggestion.enhancedBullet;
          updatedResume.experience[expIdx].bulletPoints = bullets;
        } else if (projIdx !== undefined && updatedResume.projects[projIdx]) {
          const bullets = [...updatedResume.projects[projIdx].bulletPoints];
          bullets[bulletIdx] = suggestion.enhancedBullet;
          updatedResume.projects[projIdx].bulletPoints = bullets;
        }
        setResume(updatedResume);
        runAtsAnalysis(updatedResume);
      }
    } catch {
      // Fallback
    } finally {
      setOptimizingBulletIndex(null);
    }
  };

  const handleGenerateInterviewQa = async () => {
    setIsGeneratingInterview(true);
    setActiveTab('INTERVIEW_SIMULATOR');
    try {
      const res = await fetch('/api/resume/interview-qa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resume }),
      });
      const data = await res.json();
      if (data && data.success && data.data) {
        setInterviewQuestions(data.data);
      }
    } catch {
      // Fallback
    } finally {
      setIsGeneratingInterview(false);
    }
  };

  const handleAddExperienceBullet = (expIdx: number) => {
    const updated = { ...resume };
    updated.experience[expIdx].bulletPoints.push('Architected and delivered new feature optimizing throughput by 25%.');
    setResume(updated);
  };

  const handleDeleteExperienceBullet = (expIdx: number, bIdx: number) => {
    const updated = { ...resume };
    updated.experience[expIdx].bulletPoints = updated.experience[expIdx].bulletPoints.filter((_, i) => i !== bIdx);
    setResume(updated);
  };

  const handleAddProjectBullet = (projIdx: number) => {
    const updated = { ...resume };
    updated.projects[projIdx].bulletPoints.push('Implemented automated microservices architecture handling concurrent client workloads.');
    setResume(updated);
  };

  const handleDeleteProjectBullet = (projIdx: number, bIdx: number) => {
    const updated = { ...resume };
    updated.projects[projIdx].bulletPoints = updated.projects[projIdx].bulletPoints.filter((_, i) => i !== bIdx);
    setResume(updated);
  };

  const atsScore = atsReport?.overallAtsScore || 92;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Header & Telemetry */}
      <section className="glass-panel glow-hover" style={{
        padding: '24px 32px',
        background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%)',
        position: 'relative',
      }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '20px' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span className="badge badge-completed">
                <FileCheck2 size={12} /> PHASE 15 ACTIVE
              </span>
              <span className="badge" style={{ backgroundColor: 'rgba(16, 185, 129, 0.2)', color: '#34d399', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                ATS Score: {atsScore}/100 🟢 Excellent
              </span>
              <span className="badge" style={{ backgroundColor: 'rgba(245, 158, 11, 0.2)', color: '#fbbf24', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
                ⚡ STAR Method Active
              </span>
            </div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>
              Resume & ATS Optimizer <span className="gradient-text">Engine</span>
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
              Live LaTeX/Modern single-column resume builder, automated ATS keyword compliance checker, and tailored AI mock interview generator.
            </p>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <button
              onClick={() => runAtsAnalysis()}
              disabled={isScanningAts}
              className="btn btn-secondary"
              style={{ padding: '8px 16px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <RefreshCw size={14} className={isScanningAts ? 'pulse-circle' : ''} />
              {isScanningAts ? 'Scanning ATS...' : 'Run ATS Scan'}
            </button>

            <button
              onClick={handleGenerateInterviewQa}
              disabled={isGeneratingInterview}
              className="btn btn-secondary"
              style={{ padding: '8px 16px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(168, 85, 247, 0.15)', borderColor: 'rgba(168, 85, 247, 0.3)', color: '#c084fc' }}
            >
              <Sparkles size={14} />
              {isGeneratingInterview ? 'Generating...' : 'AI Mock Interview Q&A'}
            </button>

            <button
              onClick={() => window.print()}
              className="btn btn-secondary"
              style={{ padding: '8px 16px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Printer size={14} /> Print / Export PDF
            </button>

            <button
              onClick={handleSaveResume}
              disabled={isSaving}
              className="btn btn-primary"
              style={{ padding: '8px 18px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <CheckCircle2 size={14} /> {isSaving ? 'Saving...' : 'Save Resume'}
            </button>
          </div>
        </div>

        {saveToast && (
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
            <CheckCircle2 size={13} /> Resume Saved & Synced!
          </div>
        )}
      </section>

      {/* Tab Switcher */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border-glass)', paddingBottom: '12px' }}>
        <button
          onClick={() => setActiveTab('EDITOR_PREVIEW')}
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
            backgroundColor: activeTab === 'EDITOR_PREVIEW' ? 'var(--accent-primary)' : 'rgba(255,255,255,0.04)',
            color: activeTab === 'EDITOR_PREVIEW' ? '#ffffff' : 'var(--text-secondary)',
          }}
        >
          <FileCheck2 size={15} /> Resume Editor & Live A4 Sheet
        </button>
        <button
          onClick={() => {
            setActiveTab('ATS_DIAGNOSTICS');
            if (!atsReport) runAtsAnalysis();
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
            backgroundColor: activeTab === 'ATS_DIAGNOSTICS' ? 'linear-gradient(135deg, #10b981, #059669)' : 'rgba(255,255,255,0.04)',
            color: activeTab === 'ATS_DIAGNOSTICS' ? '#ffffff' : 'var(--text-secondary)',
          }}
        >
          <Target size={15} color={activeTab === 'ATS_DIAGNOSTICS' ? '#fff' : '#34d399'} /> ATS Scanner & Keyword Matcher
        </button>
        <button
          onClick={() => {
            setActiveTab('INTERVIEW_SIMULATOR');
            if (interviewQuestions.length === 0) handleGenerateInterviewQa();
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
            backgroundColor: activeTab === 'INTERVIEW_SIMULATOR' ? 'linear-gradient(135deg, #a855f7, #6366f1)' : 'rgba(255,255,255,0.04)',
            color: activeTab === 'INTERVIEW_SIMULATOR' ? '#ffffff' : 'var(--text-secondary)',
          }}
        >
          <Sparkles size={15} color={activeTab === 'INTERVIEW_SIMULATOR' ? '#fff' : '#c084fc'} /> AI Mock Interview Q&A
        </button>
      </div>

      {/* Tab 1: Editor & Live A4 Sheet */}
      {activeTab === 'EDITOR_PREVIEW' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(400px, 1fr) minmax(480px, 1.1fr)', gap: '24px', alignItems: 'start' }}>
          
          {/* Left: Interactive Section Editor */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Contact & Headline */}
            <div className="glass-panel" style={{ padding: '20px' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px', color: '#818cf8' }}>
                <Briefcase size={16} /> Contact Info & Headline
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>Full Name</label>
                  <input
                    type="text"
                    value={resume.contact.fullName}
                    onChange={(e) => setResume({ ...resume, contact: { ...resume.contact, fullName: e.target.value } })}
                    className="input-field"
                    style={{ width: '100%', fontSize: '0.85rem', padding: '8px 12px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>Email</label>
                  <input
                    type="email"
                    value={resume.contact.email}
                    onChange={(e) => setResume({ ...resume, contact: { ...resume.contact, email: e.target.value } })}
                    className="input-field"
                    style={{ width: '100%', fontSize: '0.85rem', padding: '8px 12px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>Phone</label>
                  <input
                    type="text"
                    value={resume.contact.phone}
                    onChange={(e) => setResume({ ...resume, contact: { ...resume.contact, phone: e.target.value } })}
                    className="input-field"
                    style={{ width: '100%', fontSize: '0.85rem', padding: '8px 12px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>Location</label>
                  <input
                    type="text"
                    value={resume.contact.location}
                    onChange={(e) => setResume({ ...resume, contact: { ...resume.contact, location: e.target.value } })}
                    className="input-field"
                    style={{ width: '100%', fontSize: '0.85rem', padding: '8px 12px' }}
                  />
                </div>
              </div>
              <div style={{ marginTop: '12px' }}>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>Headline</label>
                <input
                  type="text"
                  value={resume.headline}
                  onChange={(e) => setResume({ ...resume, headline: e.target.value })}
                  className="input-field"
                  style={{ width: '100%', fontSize: '0.85rem', padding: '8px 12px' }}
                />
              </div>
              <div style={{ marginTop: '12px' }}>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>Professional Summary</label>
                <textarea
                  value={resume.professionalSummary}
                  onChange={(e) => setResume({ ...resume, professionalSummary: e.target.value })}
                  className="input-field"
                  rows={3}
                  style={{ width: '100%', fontSize: '0.8rem', padding: '8px 12px', resize: 'vertical' }}
                />
              </div>
            </div>

            {/* Experience Section with AI STAR Enhancers */}
            <div className="glass-panel" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', color: '#34d399' }}>
                  <Zap size={16} /> Work Experience & Internships
                </h4>
              </div>

              {resume.experience.map((exp, expIdx) => (
                <div key={exp.id} style={{ marginBottom: '16px', padding: '14px', borderRadius: '8px', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-glass)' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '8px', marginBottom: '8px' }}>
                    <input
                      type="text"
                      value={exp.role}
                      placeholder="Role Title"
                      onChange={(e) => {
                        const updated = { ...resume };
                        updated.experience[expIdx].role = e.target.value;
                        setResume(updated);
                      }}
                      className="input-field"
                      style={{ fontSize: '0.8rem', padding: '6px 10px', fontWeight: 600 }}
                    />
                    <input
                      type="text"
                      value={exp.company}
                      placeholder="Company"
                      onChange={(e) => {
                        const updated = { ...resume };
                        updated.experience[expIdx].company = e.target.value;
                        setResume(updated);
                      }}
                      className="input-field"
                      style={{ fontSize: '0.8rem', padding: '6px 10px' }}
                    />
                  </div>

                  {/* Bullet Points */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '10px' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>Key Achievements (STAR Format):</div>
                    {exp.bulletPoints.map((bullet, bIdx) => {
                      const isOptimizing = optimizingBulletIndex?.expIdx === expIdx && optimizingBulletIndex?.bulletIdx === bIdx;
                      return (
                        <div key={bIdx} style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}>
                          <textarea
                            value={bullet}
                            onChange={(e) => {
                              const updated = { ...resume };
                              updated.experience[expIdx].bulletPoints[bIdx] = e.target.value;
                              setResume(updated);
                            }}
                            rows={2}
                            className="input-field"
                            style={{ flex: 1, fontSize: '0.75rem', padding: '6px 10px', lineHeight: 1.4 }}
                          />
                          <button
                            onClick={() => handleOptimizeBullet(bullet, expIdx, undefined, bIdx)}
                            disabled={isOptimizing}
                            className="btn btn-secondary"
                            style={{ padding: '6px 8px', fontSize: '0.7rem', color: '#fbbf24', borderColor: 'rgba(245, 158, 11, 0.3)', display: 'flex', alignItems: 'center', gap: '4px' }}
                            title="Enhance with AI STAR Formula"
                          >
                            <Sparkles size={12} /> {isOptimizing ? 'Rewriting...' : 'STAR'}
                          </button>
                          <button
                            onClick={() => handleDeleteExperienceBullet(expIdx, bIdx)}
                            style={{ background: 'none', border: 'none', color: '#f43f5e', cursor: 'pointer', padding: '6px 4px' }}
                            title="Delete bullet"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      );
                    })}
                    <button
                      onClick={() => handleAddExperienceBullet(expIdx)}
                      className="btn btn-secondary"
                      style={{ alignSelf: 'flex-start', padding: '4px 10px', fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}
                    >
                      <Plus size={12} /> Add Achievement Bullet
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Projects Section */}
            <div className="glass-panel" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', color: '#818cf8' }}>
                  <Layers size={16} /> Technical Projects
                </h4>
              </div>

              {resume.projects.map((proj, projIdx) => (
                <div key={proj.id} style={{ marginBottom: '16px', padding: '14px', borderRadius: '8px', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-glass)' }}>
                  <div style={{ marginBottom: '8px' }}>
                    <input
                      type="text"
                      value={proj.title}
                      placeholder="Project Title"
                      onChange={(e) => {
                        const updated = { ...resume };
                        updated.projects[projIdx].title = e.target.value;
                        setResume(updated);
                      }}
                      className="input-field"
                      style={{ width: '100%', fontSize: '0.8rem', padding: '6px 10px', fontWeight: 700 }}
                    />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '10px' }}>
                    {proj.bulletPoints.map((bullet, bIdx) => {
                      const isOptimizing = optimizingBulletIndex?.projIdx === projIdx && optimizingBulletIndex?.bulletIdx === bIdx;
                      return (
                        <div key={bIdx} style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}>
                          <textarea
                            value={bullet}
                            onChange={(e) => {
                              const updated = { ...resume };
                              updated.projects[projIdx].bulletPoints[bIdx] = e.target.value;
                              setResume(updated);
                            }}
                            rows={2}
                            className="input-field"
                            style={{ flex: 1, fontSize: '0.75rem', padding: '6px 10px', lineHeight: 1.4 }}
                          />
                          <button
                            onClick={() => handleOptimizeBullet(bullet, undefined, projIdx, bIdx)}
                            disabled={isOptimizing}
                            className="btn btn-secondary"
                            style={{ padding: '6px 8px', fontSize: '0.7rem', color: '#fbbf24', borderColor: 'rgba(245, 158, 11, 0.3)', display: 'flex', alignItems: 'center', gap: '4px' }}
                            title="Enhance with AI STAR Formula"
                          >
                            <Sparkles size={12} /> {isOptimizing ? 'Rewriting...' : 'STAR'}
                          </button>
                          <button
                            onClick={() => handleDeleteProjectBullet(projIdx, bIdx)}
                            style={{ background: 'none', border: 'none', color: '#f43f5e', cursor: 'pointer', padding: '6px 4px' }}
                            title="Delete bullet"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      );
                    })}
                    <button
                      onClick={() => handleAddProjectBullet(projIdx)}
                      className="btn btn-secondary"
                      style={{ alignSelf: 'flex-start', padding: '4px 10px', fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}
                    >
                      <Plus size={12} /> Add Project Metric Bullet
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>

          {/* Right: Clean A4 ATS Resume Preview (Printable View) */}
          <div style={{
            backgroundColor: '#ffffff',
            color: '#0f172a',
            padding: '36px 40px',
            borderRadius: '8px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
            fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            minHeight: '840px',
            position: 'sticky',
            top: '80px',
          }} id="printable-resume">
            
            {/* Header / Name */}
            <div style={{ textAlign: 'center', borderBottom: '2px solid #0f172a', paddingBottom: '12px', marginBottom: '14px' }}>
              <h1 style={{ fontSize: '1.6rem', fontWeight: 800, letterSpacing: '-0.02em', margin: 0, color: '#0f172a' }}>
                {resume.contact.fullName.toUpperCase()}
              </h1>
              <div style={{ fontSize: '0.8rem', color: '#475569', marginTop: '6px', display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
                <span>{resume.contact.location}</span>
                <span>&bull;</span>
                <span>{resume.contact.phone}</span>
                <span>&bull;</span>
                <span style={{ color: '#2563eb' }}>{resume.contact.email}</span>
                <span>&bull;</span>
                <span style={{ color: '#2563eb' }}>{resume.contact.githubUrl}</span>
              </div>
            </div>

            {/* Professional Summary */}
            <div style={{ marginBottom: '14px' }}>
              <h3 style={{ fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#0f172a', borderBottom: '1px solid #cbd5e1', paddingBottom: '2px', marginBottom: '6px' }}>
                Professional Summary
              </h3>
              <p style={{ fontSize: '0.78rem', lineHeight: 1.5, color: '#334155', margin: 0 }}>
                {resume.professionalSummary}
              </p>
            </div>

            {/* Education */}
            <div style={{ marginBottom: '14px' }}>
              <h3 style={{ fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#0f172a', borderBottom: '1px solid #cbd5e1', paddingBottom: '2px', marginBottom: '6px' }}>
                Education
              </h3>
              {resume.education.map((edu) => (
                <div key={edu.id} style={{ marginBottom: '6px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 700, color: '#0f172a' }}>
                    <span>{edu.institution}</span>
                    <span>{edu.startDate} – {edu.endDate}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#475569', fontStyle: 'italic' }}>
                    <span>{edu.degree} in {edu.fieldOfStudy}</span>
                    <span>{edu.cgpaOrGrade}</span>
                  </div>
                  {edu.relevantCoursework && (
                    <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '2px' }}>
                      <strong>Coursework:</strong> {edu.relevantCoursework.join(', ')}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Experience */}
            <div style={{ marginBottom: '14px' }}>
              <h3 style={{ fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#0f172a', borderBottom: '1px solid #cbd5e1', paddingBottom: '2px', marginBottom: '6px' }}>
                Experience & Internships
              </h3>
              {resume.experience.map((exp) => (
                <div key={exp.id} style={{ marginBottom: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 700, color: '#0f172a' }}>
                    <span>{exp.role} &bull; <span style={{ fontWeight: 600, color: '#2563eb' }}>{exp.company}</span></span>
                    <span style={{ fontSize: '0.75rem', color: '#475569' }}>{exp.startDate} – {exp.endDate}</span>
                  </div>
                  <ul style={{ margin: '4px 0 0 16px', padding: 0, fontSize: '0.75rem', color: '#334155', lineHeight: 1.45 }}>
                    {exp.bulletPoints.map((bullet, idx) => (
                      <li key={idx} style={{ marginBottom: '3px' }}>{bullet}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Projects */}
            <div style={{ marginBottom: '14px' }}>
              <h3 style={{ fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#0f172a', borderBottom: '1px solid #cbd5e1', paddingBottom: '2px', marginBottom: '6px' }}>
                Technical Projects
              </h3>
              {resume.projects.map((proj) => (
                <div key={proj.id} style={{ marginBottom: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 700, color: '#0f172a' }}>
                    <span>{proj.title}</span>
                    <span style={{ fontSize: '0.72rem', color: '#2563eb' }}>{proj.technologies.join(' | ')}</span>
                  </div>
                  <ul style={{ margin: '4px 0 0 16px', padding: 0, fontSize: '0.75rem', color: '#334155', lineHeight: 1.45 }}>
                    {proj.bulletPoints.map((bullet, idx) => (
                      <li key={idx} style={{ marginBottom: '3px' }}>{bullet}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Technical Skills */}
            <div style={{ marginBottom: '14px' }}>
              <h3 style={{ fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#0f172a', borderBottom: '1px solid #cbd5e1', paddingBottom: '2px', marginBottom: '6px' }}>
                Technical Skills
              </h3>
              <div style={{ fontSize: '0.75rem', color: '#334155', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                {resume.skillCategories.map((cat, idx) => (
                  <div key={idx}>
                    <strong>{cat.categoryName}:</strong> {cat.skills.join(', ')}
                  </div>
                ))}
              </div>
            </div>

            {/* Certifications & Awards */}
            <div>
              <h3 style={{ fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#0f172a', borderBottom: '1px solid #cbd5e1', paddingBottom: '2px', marginBottom: '6px' }}>
                Certifications & Honors
              </h3>
              <div style={{ fontSize: '0.75rem', color: '#334155', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                {resume.certifications.map((cert, idx) => (
                  <div key={idx}>&bull; {cert}</div>
                ))}
                {resume.achievements.map((ach, idx) => (
                  <div key={idx}>&bull; {ach}</div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Tab 2: ATS Scanner & Keyword Matcher */}
      {activeTab === 'ATS_DIAGNOSTICS' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Target Job Description Box */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px', color: '#34d399' }}>
              <Target size={18} /> Target Job Description & Role Matcher
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(240px, 1fr) 2fr', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' }}>Target Job Title</label>
                <input
                  type="text"
                  value={targetRoleTitle}
                  onChange={(e) => setTargetRoleTitle(e.target.value)}
                  className="input-field"
                  style={{ width: '100%', fontSize: '0.85rem', padding: '10px 12px' }}
                />
                <button
                  onClick={() => runAtsAnalysis()}
                  disabled={isScanningAts}
                  className="btn btn-primary"
                  style={{ width: '100%', marginTop: '12px', padding: '10px', fontSize: '0.85rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px' }}
                >
                  <RefreshCw size={14} className={isScanningAts ? 'pulse-circle' : ''} />
                  {isScanningAts ? 'Calculating ATS Matches...' : 'Match Against JD'}
                </button>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' }}>Paste Target Job Description (Optional)</label>
                <textarea
                  value={jobDescriptionInput}
                  onChange={(e) => setJobDescriptionInput(e.target.value)}
                  placeholder="Paste job posting text from Google, Amazon, Stripe, or Startups to extract required keywords and check match density..."
                  rows={4}
                  className="input-field"
                  style={{ width: '100%', fontSize: '0.8rem', padding: '10px 12px' }}
                />
              </div>
            </div>
          </div>

          {/* 4-Score Diagnostic Gauges */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            <div className="glass-panel" style={{ padding: '20px', borderTop: '3px solid var(--accent-emerald)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>OVERALL ATS SCORE</div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-emerald)', margin: '4px 0' }}>
                {atsReport?.overallAtsScore || 92}<span style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>/100</span>
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Top tier parser readability & single-column structure.</p>
            </div>

            <div className="glass-panel" style={{ padding: '20px', borderTop: '3px solid #6366f1' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>KEYWORD MATCH RATE</div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#818cf8', margin: '4px 0' }}>
                {atsReport?.keywordMatchPercentage || 88}%
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Matches core distributed systems & engineering requirements.</p>
            </div>

            <div className="glass-panel" style={{ padding: '20px', borderTop: '3px solid #f59e0b' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>QUANTIFIED IMPACT (STAR)</div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#fbbf24', margin: '4px 0' }}>
                {atsReport?.quantifiedImpactScore || 94}%
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Bullets contain numeric KPIs (% latency, RPS throughput).</p>
            </div>

            <div className="glass-panel" style={{ padding: '20px', borderTop: '3px solid #06b6d4' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>PARSER COMPLIANCE</div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#22d3ee', margin: '4px 0' }}>
                {atsReport?.formattingComplianceScore || 96}%
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Standard section headers easily indexed by Workday & Greenhouse.</p>
            </div>
          </div>

          {/* Keywords & Section Breakdown */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            
            {/* Detected & Missing Keywords */}
            <div className="glass-panel" style={{ padding: '20px' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '14px', color: '#818cf8' }}>
                Keywords Density & Match Breakdown
              </h4>
              
              <div style={{ marginBottom: '14px' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#34d399', marginBottom: '8px' }}>
                  🟢 Matched In Resume ({atsReport?.detectedKeywords.length || 14})
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {(atsReport?.detectedKeywords || []).map((kw, idx) => (
                    <span key={idx} className="badge badge-completed" style={{ fontSize: '0.75rem' }}>
                      {kw.keyword} ({kw.frequency}x)
                    </span>
                  ))}
                </div>
              </div>

              {atsReport?.missingKeywords && atsReport.missingKeywords.length > 0 && (
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#f59e0b', marginBottom: '8px' }}>
                    🟡 Suggested Missing Keywords
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {atsReport.missingKeywords.map((kw, idx) => (
                      <span key={idx} className="badge badge-pending" style={{ fontSize: '0.75rem' }}>
                        + {kw}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Section Diagnostics */}
            <div className="glass-panel" style={{ padding: '20px' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '14px', color: '#34d399' }}>
                Section-by-Section Diagnostics
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {(atsReport?.sectionDiagnostics || []).map((diag, idx) => (
                  <div key={idx} style={{ padding: '10px 14px', borderRadius: '8px', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-glass)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>{diag.sectionName}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{diag.feedback}</div>
                    </div>
                    <span className="badge badge-completed" style={{ fontSize: '0.75rem', fontWeight: 700 }}>
                      {diag.score}/100
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Bullet Enhancement Recommendations */}
          {atsReport?.bulletSuggestions && atsReport.bulletSuggestions.length > 0 && (
            <div className="glass-panel" style={{ padding: '20px' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px', color: '#fbbf24' }}>
                <Zap size={16} /> AI Bullet Point STAR Transformations
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
                {atsReport.bulletSuggestions.map((sug, idx) => (
                  <div key={idx} style={{ padding: '16px', borderRadius: '10px', backgroundColor: 'rgba(245, 158, 11, 0.04)', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Original Passive Bullet:</div>
                    <div style={{ fontSize: '0.8rem', color: '#f87171', marginBottom: '8px', fontStyle: 'italic' }}>
                      "{sug.originalBullet}"
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#34d399', fontWeight: 700, marginBottom: '4px' }}>
                      ✨ Enhanced STAR Formula:
                    </div>
                    <div style={{ fontSize: '0.82rem', color: '#ffffff', lineHeight: 1.4, fontWeight: 600, marginBottom: '8px' }}>
                      "{sug.enhancedBullet}"
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                      <strong>Why this works:</strong> {sug.reasoning}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

      {/* Tab 3: AI Mock Interview Simulator */}
      {activeTab === 'INTERVIEW_SIMULATOR' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="glass-panel" style={{ padding: '24px', background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.1) 0%, rgba(99, 102, 241, 0.1) 100%)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#c084fc' }}>
                  Tailored Technical & Behavioral Interview Simulator
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  Generated questions based on your specific resume projects (DistriCache, Raft consensus, Stripe caching) with scoring rubrics.
                </p>
              </div>
              <button
                onClick={handleGenerateInterviewQa}
                disabled={isGeneratingInterview}
                className="btn btn-primary"
                style={{ padding: '8px 18px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <Sparkles size={14} /> Regenerate Practice Questions
              </button>
            </div>
          </div>

          {interviewQuestions.length === 0 ? (
            <div className="glass-panel" style={{ padding: '40px', textAlign: 'center' }}>
              <Sparkles size={32} color="#c084fc" style={{ margin: '0 auto 12px auto' }} />
              <h4 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Generate Your Tailored Interview Prep</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', maxWidth: '460px', margin: '8px auto 20px auto' }}>
                AI analyzes each project and internship on your resume to generate high-yield technical and system design deep-dive questions.
              </p>
              <button
                onClick={handleGenerateInterviewQa}
                className="btn btn-primary"
                style={{ padding: '10px 24px', fontSize: '0.9rem' }}
              >
                Generate Interview Questions Now
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {interviewQuestions.map((qa) => (
                <div key={qa.id} className="glass-panel glow-hover" style={{ padding: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <span className="badge" style={{ backgroundColor: 'rgba(99, 102, 241, 0.2)', color: '#818cf8', border: '1px solid rgba(99, 102, 241, 0.3)', fontSize: '0.75rem' }}>
                      {qa.questionType.replace(/_/g, ' ')}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Context: <strong>{qa.relatedProjectOrExperience}</strong>
                    </span>
                  </div>

                  <h4 style={{ fontSize: '1.05rem', fontWeight: 700, lineHeight: 1.5, marginBottom: '8px' }}>
                    {qa.question}
                  </h4>

                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '14px', fontStyle: 'italic' }}>
                    💡 <strong>Why Interviewers Ask This:</strong> {qa.contextWhyAsked}
                  </p>

                  <div style={{ padding: '14px 18px', borderRadius: '8px', backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-glass)', marginBottom: '14px' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#34d399', marginBottom: '8px' }}>
                      🎯 Ideal Answer Scoring Rubric:
                    </div>
                    <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      {qa.idealAnswerRubric.map((point, idx) => (
                        <li key={idx}>{point}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                      Key Terms to Include in Response:
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {qa.keyTermsToInclude.map((term, idx) => (
                        <span key={idx} className="badge badge-completed" style={{ fontSize: '0.7rem' }}>
                          {term}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
}
