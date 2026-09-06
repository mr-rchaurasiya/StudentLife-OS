import React, { useState, useEffect } from 'react';
import {
  CareerRoleProfile,
  SkillRequirementItem,
} from '@studentlife/shared';
import { useAuth } from '../context/AuthContext';
import {
  CheckCircle2,
  Plus,
  Code2,
  RefreshCw,
  DollarSign,
} from 'lucide-react';

const API_BASE = 'http://localhost:5000/api';

const FALLBACK_ROLES: CareerRoleProfile[] = [
  {
    id: 'role-sde',
    title: 'Software Development Engineer (Backend / Distributed Systems)',
    iconEmoji: '💻',
    shortDescription: 'Design, build, and scale fault-tolerant backend services, microservices, and distributed systems handling millions of queries per second.',
    fullDescription: 'Software Development Engineers at Tier-1 tech firms architect high-concurrency microservices, optimize database queries, implement message queue architectures, and write production-grade code adhering to Clean Code and SOLID principles.',
    matchScorePercent: 82,
    marketTrend: {
      avgSalaryLpa: '₹24 - 45 LPA',
      salaryRange: {
        entry: '₹16 - 28 LPA',
        mid: '₹28 - 48 LPA',
        senior: '₹50 - 95 LPA',
      },
      topHiringCompanies: ['Google', 'Microsoft', 'Amazon', 'Uber', 'Atlassian', 'Flipkart'],
      demandGrowthPercent: 18.5,
      totalOpeningsEstimate: '42,000+ Active Roles',
    },
    requiredSkills: [
      {
        skillName: 'Data Structures & Algorithms',
        importance: 'MUST_HAVE',
        category: 'CORE_CS',
        isAcquired: true,
        learningCurveWeeks: 12,
      },
      {
        skillName: 'System Design & High-Level Architecture',
        importance: 'MUST_HAVE',
        category: 'CORE_CS',
        isAcquired: true,
        learningCurveWeeks: 8,
      },
      {
        skillName: 'Relational & NoSQL Database Optimization (PostgreSQL/Redis)',
        importance: 'MUST_HAVE',
        category: 'CORE_CS',
        isAcquired: true,
        learningCurveWeeks: 6,
      },
      {
        skillName: 'Distributed Message Brokers (Apache Kafka / RabbitMQ)',
        importance: 'GOOD_TO_HAVE',
        category: 'INFRASTRUCTURE',
        isAcquired: false,
        learningCurveWeeks: 4,
      },
      {
        skillName: 'Containerization & Orchestration (Docker & Kubernetes)',
        importance: 'GOOD_TO_HAVE',
        category: 'INFRASTRUCTURE',
        isAcquired: false,
        learningCurveWeeks: 3,
      },
      {
        skillName: 'CI/CD Pipelines & Observability (Grafana/Prometheus)',
        importance: 'OPTIONAL',
        category: 'INFRASTRUCTURE',
        isAcquired: false,
        learningCurveWeeks: 2,
      },
    ],
    recommendations: [
      {
        id: 'rec-1',
        title: 'Distributed Systems & Event-Driven Microservices Blueprint',
        type: 'PROJECT_BLUEPRINT',
        provider: 'StudentLife Career Hub',
        difficulty: 'ADVANCED',
        description: 'Build an idempotency-guaranteed distributed order processing engine using Kafka, PostgreSQL with CDC, and Redis write-back caching.',
      },
      {
        id: 'rec-2',
        title: 'Designing Data-Intensive Applications by Martin Kleppmann',
        type: 'BOOK',
        provider: "O'Reilly",
        difficulty: 'INTERMEDIATE',
        description: 'The definitive guide to replication, partitioning, transactions, and consensus in modern distributed databases.',
      },
      {
        id: 'rec-3',
        title: 'Docker & Kubernetes Cloud Architecture Specialization',
        type: 'COURSE',
        provider: 'Linux Foundation / CNCF',
        difficulty: 'INTERMEDIATE',
        description: 'Master multi-container orchestration, ingress routing, stateful sets, and zero-downtime deployment pipelines.',
      },
    ],
  },
  {
    id: 'role-ai-ml',
    title: 'AI / Machine Learning Engineer & LLM Specialist',
    iconEmoji: '🤖',
    shortDescription: 'Train, fine-tune, and deploy transformer architectures, generative AI models, and scalable embedding pipelines.',
    fullDescription: 'AI Engineers work at the intersection of mathematical theory and systems engineering, applying deep learning frameworks (PyTorch), LoRA fine-tuning, RAG pipelines, and vector database search at scale.',
    matchScorePercent: 68,
    marketTrend: {
      avgSalaryLpa: '₹28 - 55 LPA',
      salaryRange: {
        entry: '₹18 - 32 LPA',
        mid: '₹34 - 60 LPA',
        senior: '₹65 - 120 LPA',
      },
      topHiringCompanies: ['OpenAI', 'Google DeepMind', 'NVIDIA', 'Anthropic', 'Adobe', 'Meta'],
      demandGrowthPercent: 34.2,
      totalOpeningsEstimate: '18,500+ Active Roles',
    },
    requiredSkills: [
      {
        skillName: 'Linear Algebra, Calculus & Optimization',
        importance: 'MUST_HAVE',
        category: 'AI_MATH',
        isAcquired: true,
        learningCurveWeeks: 8,
      },
      {
        skillName: 'Probability, Bayes & Statistical Inference',
        importance: 'MUST_HAVE',
        category: 'AI_MATH',
        isAcquired: true,
        learningCurveWeeks: 6,
      },
      {
        skillName: 'PyTorch & Deep Learning Fundamentals',
        importance: 'MUST_HAVE',
        category: 'FRAMEWORK',
        isAcquired: false,
        learningCurveWeeks: 8,
      },
      {
        skillName: 'Transformer Architectures & Attention Mechanisms',
        importance: 'MUST_HAVE',
        category: 'CORE_CS',
        isAcquired: false,
        learningCurveWeeks: 6,
      },
      {
        skillName: 'Vector Databases & RAG Pipelines (Pinecone/Chroma/LangChain)',
        importance: 'GOOD_TO_HAVE',
        category: 'FRAMEWORK',
        isAcquired: false,
        learningCurveWeeks: 4,
      },
      {
        skillName: 'Quantization & Model Inference Serving (vLLM/Triton)',
        importance: 'OPTIONAL',
        category: 'INFRASTRUCTURE',
        isAcquired: false,
        learningCurveWeeks: 4,
      },
    ],
    recommendations: [
      {
        id: 'rec-4',
        title: 'Deep Learning Specialization with PyTorch',
        type: 'COURSE',
        provider: 'DeepLearning.AI',
        difficulty: 'INTERMEDIATE',
        description: 'Build neural networks from scratch, backpropagation calculus, CNNs, RNNs, and transformer attention heads.',
      },
      {
        id: 'rec-5',
        title: 'Production RAG & Knowledge Graph Engine Blueprint',
        type: 'PROJECT_BLUEPRINT',
        provider: 'StudentLife Career Hub',
        difficulty: 'ADVANCED',
        description: 'Construct a semantic hybrid search retrieval engine with re-ranking and hallucination prevention telemetry.',
      },
    ],
  },
  {
    id: 'role-quant',
    title: 'Quantitative Developer & Algorithmic Trading Engineer',
    iconEmoji: '📈',
    shortDescription: 'Develop low-latency market making algorithms, mathematical arbitrage models, and stochastic simulations.',
    fullDescription: 'Quant Developers build ultra-low latency execution engines in modern C++ and analyze statistical market anomalies using stochastic calculus, time-series forecasting, and kernel-bypass networking.',
    matchScorePercent: 74,
    marketTrend: {
      avgSalaryLpa: '₹45 - 120 LPA',
      salaryRange: {
        entry: '₹35 - 65 LPA',
        mid: '₹70 - 140 LPA',
        senior: '₹150 - 300 LPA',
      },
      topHiringCompanies: ['Jane Street', 'Tower Research Capital', 'Citadel', 'Optiver', 'Graviton', 'WorldQuant'],
      demandGrowthPercent: 22.0,
      totalOpeningsEstimate: '3,200+ Highly Selective Roles',
    },
    requiredSkills: [
      {
        skillName: 'Advanced Probability & Stochastic Calculus',
        importance: 'MUST_HAVE',
        category: 'AI_MATH',
        isAcquired: true,
        learningCurveWeeks: 10,
      },
      {
        skillName: 'Data Structures & Algorithmic Optimization',
        importance: 'MUST_HAVE',
        category: 'CORE_CS',
        isAcquired: true,
        learningCurveWeeks: 12,
      },
      {
        skillName: 'Modern Low-Latency C++ (C++20/23, Move Semantics, Lock-Free)',
        importance: 'MUST_HAVE',
        category: 'CORE_CS',
        isAcquired: false,
        learningCurveWeeks: 10,
      },
      {
        skillName: 'Memory Hierarchy, Cache Lines & CPU Branch Prediction',
        importance: 'MUST_HAVE',
        category: 'CORE_CS',
        isAcquired: true,
        learningCurveWeeks: 4,
      },
      {
        skillName: 'Time Series Econometrics & Backtesting Frameworks',
        importance: 'GOOD_TO_HAVE',
        category: 'AI_MATH',
        isAcquired: false,
        learningCurveWeeks: 6,
      },
    ],
    recommendations: [
      {
        id: 'rec-6',
        title: 'Lock-Free Order Book & Matching Engine in C++20',
        type: 'PROJECT_BLUEPRINT',
        provider: 'StudentLife Career Hub',
        difficulty: 'ADVANCED',
        description: 'Build a sub-microsecond limit order book with cache-aligned ring buffers and atomic SIMD operations.',
      },
    ],
  },
];

interface CareerIntelligenceViewProps {
  onAddSkillToPlanner?: (skillName: string) => void;
}

export const CareerIntelligenceView: React.FC<CareerIntelligenceViewProps> = ({
  onAddSkillToPlanner,
}) => {
  const { tokens } = useAuth();
  const [roles, setRoles] = useState<CareerRoleProfile[]>(FALLBACK_ROLES);
  const [selectedRoleId, setSelectedRoleId] = useState<string>(FALLBACK_ROLES[0].id);
  const [isLoading, setIsLoading] = useState(false);
  const [addedSkills, setAddedSkills] = useState<{ [skill: string]: boolean }>({});

  useEffect(() => {
    const fetchRoles = async () => {
      setIsLoading(true);
      try {
        const headers = tokens?.accessToken ? { Authorization: `Bearer ${tokens.accessToken}` } : undefined;
        const res = await fetch(`${API_BASE}/career/roles`, { headers });
        if (res.ok) {
          const json = await res.json();
          if (json.success && Array.isArray(json.data) && json.data.length > 0) {
            setRoles(json.data);
          }
        }
      } catch {
        // Fallback
      } finally {
        setIsLoading(false);
      }
    };
    fetchRoles();
  }, [tokens]);

  const activeRole = roles.find((r) => r.id === selectedRoleId) || roles[0];
  const acquiredSkills = activeRole.requiredSkills.filter((s) => s.isAcquired);
  const missingSkills = activeRole.requiredSkills.filter((s) => !s.isAcquired);

  const handleAddSkill = (skill: SkillRequirementItem) => {
    setAddedSkills((prev) => ({ ...prev, [skill.skillName]: true }));
    if (onAddSkillToPlanner) {
      onAddSkillToPlanner(`Master ${skill.skillName} (${skill.learningCurveWeeks} weeks roadmap)`);
    }
  };

  const getImportanceBadge = (imp: string) => {
    switch (imp) {
      case 'MUST_HAVE':
        return <span style={{ padding: '2px 8px', borderRadius: '10px', fontSize: '0.7rem', fontWeight: 800, background: 'rgba(239, 68, 68, 0.2)', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.3)' }}>🔴 MUST-HAVE</span>;
      case 'GOOD_TO_HAVE':
        return <span style={{ padding: '2px 8px', borderRadius: '10px', fontSize: '0.7rem', fontWeight: 700, background: 'rgba(245, 158, 11, 0.2)', color: '#fbbf24', border: '1px solid rgba(245, 158, 11, 0.3)' }}>🟡 RECOMMENDED</span>;
      default:
        return <span style={{ padding: '2px 8px', borderRadius: '10px', fontSize: '0.7rem', fontWeight: 600, background: 'rgba(255, 255, 255, 0.08)', color: 'var(--text-secondary)' }}>⚪ OPTIONAL</span>;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '40px' }}>
      {/* 1. Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.8rem' }}>💼</span>
            <h1 style={{ fontSize: '1.85rem', fontWeight: 800, margin: 0, background: 'linear-gradient(135deg, #f8fafc 0%, #cbd5e1 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Career Intelligence & Skill-Gap Explorer
            </h1>
          </div>
          <p style={{ margin: '6px 0 0 0', color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
            Map your academic preparation directly against Tier-1 tech job profiles, skill-gap heatmaps, and industry compensation trends.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={() => window.location.reload()}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '9px 16px',
              borderRadius: '10px',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              background: 'rgba(255, 255, 255, 0.04)',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              fontSize: '0.85rem',
              fontWeight: 600,
            }}
          >
            <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} /> Refresh Roles
          </button>
        </div>
      </div>

      {/* 2. Career Role Cards Selector */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
        {roles.map((role) => {
          const isSelected = role.id === selectedRoleId;
          return (
            <div
              key={role.id}
              onClick={() => setSelectedRoleId(role.id)}
              className="glass-card"
              style={{
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '14px',
                cursor: 'pointer',
                border: isSelected ? '2px solid #818cf8' : '1px solid rgba(255, 255, 255, 0.08)',
                background: isSelected
                  ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(15, 23, 42, 0.8) 100%)'
                  : 'rgba(15, 23, 42, 0.65)',
                transition: 'all 0.2s ease',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '1.8rem' }}>{role.iconEmoji}</span>
                  <div
                    style={{
                      padding: '4px 10px',
                      borderRadius: '12px',
                      fontSize: '0.78rem',
                      fontWeight: 800,
                      background: role.matchScorePercent >= 80 ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                      color: role.matchScorePercent >= 80 ? '#34d399' : '#fbbf24',
                      border: role.matchScorePercent >= 80 ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(245, 158, 11, 0.3)',
                    }}
                  >
                    {role.matchScorePercent}% Skill Match
                  </div>
                </div>

                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: '0 0 6px 0', color: 'var(--text-primary)' }}>
                  {role.title}
                </h3>

                <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.84rem', lineHeight: 1.5 }}>
                  {role.shortDescription}
                </p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255, 255, 255, 0.06)', paddingTop: '10px', fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>
                <span>💰 Avg: <strong style={{ color: '#34d399' }}>{role.marketTrend.avgSalaryLpa}</strong></span>
                <span>📈 +{role.marketTrend.demandGrowthPercent}% Growth</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Detailed Role Intel & Skill Gap Arena */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1.2fr', gap: '20px', alignItems: 'start' }}>
        {/* Left: Interactive Skill-Gap Matrix */}
        <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.2rem' }}>{activeRole.iconEmoji}</span>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                  Skill-Gap Analysis: {activeRole.title}
                </h2>
              </div>
              <p style={{ margin: '4px 0 0 0', color: 'var(--text-secondary)', fontSize: '0.84rem' }}>
                Matched against your active student profile skills & target examination coursework.
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.82rem', color: '#34d399', fontWeight: 700 }}>
                {acquiredSkills.length} Acquired
              </span>
              <span style={{ color: 'var(--text-tertiary)' }}>•</span>
              <span style={{ fontSize: '0.82rem', color: '#f87171', fontWeight: 700 }}>
                {missingSkills.length} Gaps to Bridge
              </span>
            </div>
          </div>

          {/* Missing Skills Priority List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h4 style={{ fontSize: '0.88rem', fontWeight: 700, margin: 0, color: '#f87171', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              🔴 High-Priority Missing Skills
            </h4>

            {missingSkills.map((skill) => (
              <div
                key={skill.skillName}
                style={{
                  background: 'rgba(239, 68, 68, 0.04)',
                  border: '1px solid rgba(239, 68, 68, 0.25)',
                  borderRadius: '10px',
                  padding: '14px 18px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '12px',
                }}
              >
                <div style={{ maxWidth: '420px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    {getImportanceBadge(skill.importance)}
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                      Est. Curve: ~{skill.learningCurveWeeks} weeks
                    </span>
                  </div>

                  <div style={{ fontSize: '0.94rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {skill.skillName}
                  </div>
                </div>

                <button
                  onClick={() => handleAddSkill(skill)}
                  disabled={addedSkills[skill.skillName]}
                  style={{
                    padding: '7px 14px',
                    borderRadius: '8px',
                    background: addedSkills[skill.skillName]
                      ? 'rgba(16, 185, 129, 0.2)'
                      : 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                    color: addedSkills[skill.skillName] ? '#34d399' : '#ffffff',
                    border: addedSkills[skill.skillName] ? '1px solid #10b981' : 'none',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: addedSkills[skill.skillName] ? 'default' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  {addedSkills[skill.skillName] ? (
                    <>
                      <CheckCircle2 size={13} /> Added to Planner
                    </>
                  ) : (
                    <>
                      <Plus size={13} /> Add to Study Planner
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>

          {/* Acquired Skills List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
            <h4 style={{ fontSize: '0.88rem', fontWeight: 700, margin: 0, color: '#34d399', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              🟢 Acquired Core Competencies
            </h4>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '8px' }}>
              {acquiredSkills.map((skill) => (
                <div
                  key={skill.skillName}
                  style={{
                    background: 'rgba(16, 185, 129, 0.05)',
                    border: '1px solid rgba(16, 185, 129, 0.2)',
                    borderRadius: '8px',
                    padding: '10px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '0.85rem',
                    color: '#e2e8f0',
                  }}
                >
                  <CheckCircle2 size={15} style={{ color: '#34d399', flexShrink: 0 }} />
                  <span>{skill.skillName}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Market Telemetry & Recommended Projects */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Compensation & Market Radar Card */}
          <div className="glass-card" style={{ padding: '22px', display: 'flex', flexDirection: 'column', gap: '16px', borderLeft: '4px solid #10b981' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <DollarSign size={20} style={{ color: '#34d399' }} />
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                Compensation & Market Radar
              </h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '10px 14px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Entry Level (0-2 Yrs)</span>
                <strong style={{ color: '#34d399', fontSize: '0.88rem' }}>{activeRole.marketTrend.salaryRange.entry}</strong>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '10px 14px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Mid-Level SDE (2-5 Yrs)</span>
                <strong style={{ color: '#60a5fa', fontSize: '0.88rem' }}>{activeRole.marketTrend.salaryRange.mid}</strong>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '10px 14px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Staff / Principal (5+ Yrs)</span>
                <strong style={{ color: '#c084fc', fontSize: '0.88rem' }}>{activeRole.marketTrend.salaryRange.senior}</strong>
              </div>
            </div>

            {/* Top Hiring Firms */}
            <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)', paddingTop: '12px' }}>
              <div style={{ fontSize: '0.76rem', color: 'var(--text-tertiary)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px' }}>
                Top Hiring Tech Firms
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {activeRole.marketTrend.topHiringCompanies.map((firm) => (
                  <span
                    key={firm}
                    style={{
                      padding: '3px 9px',
                      borderRadius: '8px',
                      background: 'rgba(255, 255, 255, 0.06)',
                      color: '#f1f5f9',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                    }}
                  >
                    🏢 {firm}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Recommended Project Blueprints */}
          <div className="glass-card" style={{ padding: '22px', display: 'flex', flexDirection: 'column', gap: '14px', borderLeft: '4px solid #6366f1' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Code2 size={20} style={{ color: '#818cf8' }} />
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                Portfolio Project Blueprints
              </h3>
            </div>

            {activeRole.recommendations.map((rec) => (
              <div
                key={rec.id}
                style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  borderRadius: '8px',
                  padding: '12px 14px',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.72rem', color: '#a5b4fc', fontWeight: 700, textTransform: 'uppercase' }}>
                    {rec.type.replace('_', ' ')} • {rec.difficulty}
                  </span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)' }}>{rec.provider}</span>
                </div>

                <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {rec.title}
                </div>

                <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.8rem', lineHeight: 1.45 }}>
                  {rec.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
