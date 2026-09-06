import React, { useState, useEffect } from 'react';
import {
  StudentAnalyticsSummary,
} from '@studentlife/shared';
import { useAuth } from '../context/AuthContext';
import {
  AlertOctagon,
  Target,
  Clock,
  Sparkles,
  Zap,
  Award,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';

const API_BASE = 'http://localhost:5000/api';

const FALLBACK_ANALYTICS: StudentAnalyticsSummary = {
  overallReadinessScore: 78,
  estimatedPercentile: 97.4,
  totalMockTestsAttempted: 4,
  totalQuestionsSolved: 304,
  averageSpeedSecondsPerQuestion: 88,
  strongAreasCount: 18,
  weakAreasCount: 4,
  accuracyRate: 76.2,
  subjectMasteries: [
    {
      subjectName: 'Algorithms & Data Structures',
      totalQuestionsAttempted: 84,
      correctAnswers: 68,
      accuracyRate: 81,
      averageTimePerQuestionSeconds: 95,
      masteryGrade: 'PROFICIENT',
      colorCode: '#6366f1',
    },
    {
      subjectName: 'Operating Systems',
      totalQuestionsAttempted: 62,
      correctAnswers: 44,
      accuracyRate: 71,
      averageTimePerQuestionSeconds: 110,
      masteryGrade: 'INTERMEDIATE',
      colorCode: '#06b6d4',
    },
    {
      subjectName: 'Engineering Mathematics',
      totalQuestionsAttempted: 58,
      correctAnswers: 51,
      accuracyRate: 88,
      averageTimePerQuestionSeconds: 78,
      masteryGrade: 'EXPERT',
      colorCode: '#a855f7',
    },
    {
      subjectName: 'Database Management Systems',
      totalQuestionsAttempted: 48,
      correctAnswers: 39,
      accuracyRate: 81,
      averageTimePerQuestionSeconds: 82,
      masteryGrade: 'PROFICIENT',
      colorCode: '#10b981',
    },
    {
      subjectName: 'Computer Networks',
      totalQuestionsAttempted: 52,
      correctAnswers: 28,
      accuracyRate: 54,
      averageTimePerQuestionSeconds: 145,
      masteryGrade: 'NOVICE',
      colorCode: '#f59e0b',
    },
  ],
  speedAccuracyMatrix: [
    {
      id: 'sq-1',
      topic: 'Linear Algebra & Matrices',
      subject: 'Engineering Mathematics',
      accuracyPercentage: 92,
      avgTimeSeconds: 65,
      quadrant: 'FAST_ACCURATE',
    },
    {
      id: 'sq-2',
      topic: 'Graph Theory & BFS/DFS',
      subject: 'Algorithms',
      accuracyPercentage: 86,
      avgTimeSeconds: 80,
      quadrant: 'FAST_ACCURATE',
    },
    {
      id: 'sq-3',
      topic: 'Normalization & Functional Dependencies',
      subject: 'DBMS',
      accuracyPercentage: 84,
      avgTimeSeconds: 72,
      quadrant: 'FAST_ACCURATE',
    },
    {
      id: 'sq-4',
      topic: 'Virtual Memory & Inverted Page Tables',
      subject: 'Operating Systems',
      accuracyPercentage: 78,
      avgTimeSeconds: 140,
      quadrant: 'SLOW_ACCURATE',
    },
    {
      id: 'sq-5',
      topic: 'Dynamic Programming Recurrences',
      subject: 'Algorithms',
      accuracyPercentage: 68,
      avgTimeSeconds: 165,
      quadrant: 'SLOW_ACCURATE',
    },
    {
      id: 'sq-6',
      topic: 'Quantitative Aptitude Percentages',
      subject: 'General Aptitude',
      accuracyPercentage: 45,
      avgTimeSeconds: 50,
      quadrant: 'FAST_INACCURATE',
    },
    {
      id: 'sq-7',
      topic: 'TCP Congestion Control & Sliding Windows',
      subject: 'Computer Networks',
      accuracyPercentage: 42,
      avgTimeSeconds: 155,
      quadrant: 'SLOW_INACCURATE',
    },
    {
      id: 'sq-8',
      topic: 'Subnetting & VLSM Masking',
      subject: 'Computer Networks',
      accuracyPercentage: 38,
      avgTimeSeconds: 170,
      quadrant: 'SLOW_INACCURATE',
    },
  ],
  weakAreas: [
    {
      id: 'wa-1',
      topic: 'Subnetting & CIDR Address Calculation',
      subject: 'Computer Networks',
      accuracyPercentage: 38,
      errorCount: 14,
      negativeMarksLost: 4.62,
      severityLevel: 'CRITICAL',
      recommendationAction: 'Review CIDR bit-masking rules and solve 10 subnetting PYQs',
      pyqCountAvailable: 24,
    },
    {
      id: 'wa-2',
      topic: 'TCP Congestion Window & Slow Start Threshold',
      subject: 'Computer Networks',
      accuracyPercentage: 42,
      errorCount: 11,
      negativeMarksLost: 3.63,
      severityLevel: 'CRITICAL',
      recommendationAction: 'Study timeout vs 3 duplicate ACK transitions in TCP Tahoe/Reno',
      pyqCountAvailable: 18,
    },
    {
      id: 'wa-3',
      topic: 'Deadlock Avoidance & Banker’s Safety Algorithm',
      subject: 'Operating Systems',
      accuracyPercentage: 58,
      errorCount: 8,
      negativeMarksLost: 2.64,
      severityLevel: 'MODERATE',
      recommendationAction: 'Practice resource matrix vector allocations under varying processes',
      pyqCountAvailable: 15,
    },
    {
      id: 'wa-4',
      topic: 'Dynamic Programming Matrix Chain Multiplication',
      subject: 'Algorithms',
      accuracyPercentage: 62,
      errorCount: 6,
      negativeMarksLost: 1.98,
      severityLevel: 'MODERATE',
      recommendationAction: 'Derive split point recurrence intervals step-by-step',
      pyqCountAvailable: 20,
    },
  ],
  historicalTrends: [
    {
      testId: 'mock-1',
      testTitle: 'Diagnostic Assessment 1',
      dateStr: 'Aug 10, 2026',
      score: 42,
      maxScore: 100,
      percentage: 42,
      percentile: 74.5,
    },
    {
      testId: 'mock-2',
      testTitle: 'Subject Test: Systems & DSA',
      dateStr: 'Aug 22, 2026',
      score: 56,
      maxScore: 100,
      percentage: 56,
      percentile: 86.2,
    },
    {
      testId: 'mock-3',
      testTitle: 'National Full Mock 1',
      dateStr: 'Sept 01, 2026',
      score: 68.5,
      maxScore: 100,
      percentage: 68.5,
      percentile: 94.8,
    },
    {
      testId: 'mock-4',
      testTitle: 'GATE 2027 CSE Full Simulation',
      dateStr: 'Sept 06, 2026',
      score: 77.0,
      maxScore: 100,
      percentage: 77.0,
      percentile: 97.4,
    },
  ],
};

interface PerformanceAnalyticsViewProps {
  onTriggerPractice?: (topic: string) => void;
  onTriggerAiStudy?: (concept: string) => void;
}

export const PerformanceAnalyticsView: React.FC<PerformanceAnalyticsViewProps> = ({
  onTriggerPractice,
  onTriggerAiStudy,
}) => {
  const { tokens } = useAuth();
  const [data, setData] = useState<StudentAnalyticsSummary>(FALLBACK_ANALYTICS);
  const [isLoading, setIsLoading] = useState(false);
  const [activeQuadrantTab, setActiveQuadrantTab] = useState<'ALL' | 'FAST_ACCURATE' | 'SLOW_ACCURATE' | 'FAST_INACCURATE' | 'SLOW_INACCURATE'>('ALL');

  const fetchAnalytics = async () => {
    setIsLoading(true);
    try {
      const headers = tokens?.accessToken ? { Authorization: `Bearer ${tokens.accessToken}` } : undefined;
      const res = await fetch(`${API_BASE}/performance/summary`, { headers });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setData(json.data);
        }
      }
    } catch {
      // Use fallback
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const getMasteryBadge = (grade: string) => {
    switch (grade) {
      case 'EXPERT':
        return <span style={{ padding: '3px 8px', borderRadius: '10px', fontSize: '0.72rem', fontWeight: 800, background: 'rgba(168, 85, 247, 0.2)', color: '#d8b4fe', border: '1px solid rgba(168, 85, 247, 0.4)' }}>👑 EXPERT</span>;
      case 'PROFICIENT':
        return <span style={{ padding: '3px 8px', borderRadius: '10px', fontSize: '0.72rem', fontWeight: 700, background: 'rgba(16, 185, 129, 0.2)', color: '#6ee7b7', border: '1px solid rgba(16, 185, 129, 0.4)' }}>⭐ PROFICIENT</span>;
      case 'INTERMEDIATE':
        return <span style={{ padding: '3px 8px', borderRadius: '10px', fontSize: '0.72rem', fontWeight: 700, background: 'rgba(6, 182, 212, 0.2)', color: '#67e8f9', border: '1px solid rgba(6, 182, 212, 0.4)' }}>🔷 INTERMEDIATE</span>;
      default:
        return <span style={{ padding: '3px 8px', borderRadius: '10px', fontSize: '0.72rem', fontWeight: 700, background: 'rgba(245, 158, 11, 0.2)', color: '#fcd34d', border: '1px solid rgba(245, 158, 11, 0.4)' }}>⚠️ NOVICE</span>;
    }
  };

  const filteredQuadrants = activeQuadrantTab === 'ALL'
    ? data.speedAccuracyMatrix
    : data.speedAccuracyMatrix.filter((item) => item.quadrant === activeQuadrantTab);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '40px' }}>
      {/* 1. Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.8rem' }}>📊</span>
            <h1 style={{ fontSize: '1.85rem', fontWeight: 800, margin: 0, background: 'linear-gradient(135deg, #f8fafc 0%, #cbd5e1 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Performance Analytics & Diagnostics
            </h1>
          </div>
          <p style={{ margin: '6px 0 0 0', color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
            AI-driven mastery breakdown, speed vs accuracy quadrant matrix, and weak area diagnostic radar.
          </p>
        </div>

        <button
          onClick={fetchAnalytics}
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
          <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} /> Refresh Telemetry
        </button>
      </div>

      {/* 2. Top Summary KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        {/* Readiness Index */}
        <div className="glass-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px', borderLeft: '4px solid #10b981' }}>
          <div
            style={{
              width: '54px',
              height: '54px',
              borderRadius: '50%',
              background: 'conic-gradient(#10b981 0% 78%, rgba(255, 255, 255, 0.1) 78% 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', fontWeight: 800, color: '#34d399' }}>
              {data.overallReadinessScore}%
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 700 }}>
              Exam Readiness Index
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>
              Exam-Ready 🟢
            </div>
          </div>
        </div>

        {/* National Percentile */}
        <div className="glass-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '14px', borderLeft: '4px solid #6366f1' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#818cf8' }}>
            <Award size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 700 }}>
              National AIR Benchmark
            </div>
            <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#a5b4fc', marginTop: '2px' }}>
              {data.estimatedPercentile}th <span style={{ fontSize: '0.78rem', color: '#34d399', fontWeight: 600 }}>Top 0.8%</span>
            </div>
          </div>
        </div>

        {/* Solved & Accuracy */}
        <div className="glass-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '14px', borderLeft: '4px solid #f59e0b' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fbbf24' }}>
            <Target size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 700 }}>
              Practice Accuracy
            </div>
            <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#fbbf24', marginTop: '2px' }}>
              {data.accuracyRate}% <span style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)' }}>({data.totalQuestionsSolved} Qs)</span>
            </div>
          </div>
        </div>

        {/* Speed Dial */}
        <div className="glass-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '14px', borderLeft: '4px solid #ec4899' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(236, 72, 153, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f472b6' }}>
            <Clock size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 700 }}>
              Avg. Speed / Question
            </div>
            <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#f472b6', marginTop: '2px' }}>
              {data.averageSpeedSecondsPerQuestion}s <span style={{ fontSize: '0.78rem', color: '#34d399', fontWeight: 600 }}>Optimal ⚡</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Subject Mastery Heatmap & Progress Matrix */}
      <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
              Subject-wise Mastery & Strength Breakdown
            </h2>
            <p style={{ margin: '4px 0 0 0', color: 'var(--text-secondary)', fontSize: '0.84rem' }}>
              Aggregated from 300+ PYQs, sectional quizzes, and mock test responses.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.8rem', color: '#34d399', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
              <ShieldCheck size={14} /> {data.strongAreasCount} Strongholds
            </span>
            <span style={{ fontSize: '0.8rem', color: '#f87171', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', marginLeft: '8px' }}>
              <AlertOctagon size={14} /> {data.weakAreasCount} Weak Areas
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {data.subjectMasteries.map((subj) => (
            <div
              key={subj.subjectName}
              style={{
                background: 'rgba(255, 255, 255, 0.02)',
                borderRadius: '10px',
                padding: '14px 18px',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: subj.colorCode }} />
                  <span style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {subj.subjectName}
                  </span>
                  {getMasteryBadge(subj.masteryGrade)}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  <span>{subj.correctAnswers} / {subj.totalQuestionsAttempted} Solved</span>
                  <span>⏱️ {subj.averageTimePerQuestionSeconds}s / Q</span>
                  <strong style={{ color: subj.accuracyRate >= 80 ? '#34d399' : subj.accuracyRate >= 60 ? '#fbbf24' : '#f87171', fontSize: '0.9rem' }}>
                    {subj.accuracyRate}%
                  </strong>
                </div>
              </div>

              {/* Progress bar */}
              <div style={{ width: '100%', height: '8px', borderRadius: '4px', background: 'rgba(255, 255, 255, 0.08)', overflow: 'hidden' }}>
                <div
                  style={{
                    width: `${subj.accuracyRate}%`,
                    height: '100%',
                    borderRadius: '4px',
                    background: subj.colorCode,
                    transition: 'width 0.6s ease',
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Speed vs Accuracy 4-Quadrant Matrix */}
      <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
              Speed vs Accuracy 4-Quadrant Diagnostic Matrix
            </h2>
            <p style={{ margin: '4px 0 0 0', color: 'var(--text-secondary)', fontSize: '0.84rem' }}>
              Identifies conceptual blindspots vs pacing bottlenecks across every syllabus topic.
            </p>
          </div>

          {/* Quadrant filter pills */}
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {[
              { id: 'ALL', label: 'All Topics' },
              { id: 'FAST_ACCURATE', label: '🚀 Fast & Accurate' },
              { id: 'SLOW_ACCURATE', label: '⏳ Slow & Accurate' },
              { id: 'FAST_INACCURATE', label: '⚡ Fast & Inaccurate' },
              { id: 'SLOW_INACCURATE', label: '🔴 Slow & Inaccurate' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveQuadrantTab(tab.id as any)}
                style={{
                  padding: '5px 12px',
                  borderRadius: '16px',
                  fontSize: '0.76rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  border: activeQuadrantTab === tab.id ? '1px solid #818cf8' : '1px solid rgba(255, 255, 255, 0.08)',
                  background: activeQuadrantTab === tab.id ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                  color: activeQuadrantTab === tab.id ? '#e0e7ff' : 'var(--text-secondary)',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Quadrant grid items */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
          {filteredQuadrants.map((item) => {
            let borderColor = 'rgba(255, 255, 255, 0.1)';
            let badgeBg = 'rgba(255, 255, 255, 0.05)';
            let badgeText = '#cbd5e1';
            let quadrantTitle = '';

            if (item.quadrant === 'FAST_ACCURATE') {
              borderColor = 'rgba(16, 185, 129, 0.3)';
              badgeBg = 'rgba(16, 185, 129, 0.15)';
              badgeText = '#34d399';
              quadrantTitle = '🚀 Mastered (High Speed & High Accuracy)';
            } else if (item.quadrant === 'SLOW_ACCURATE') {
              borderColor = 'rgba(6, 182, 212, 0.3)';
              badgeBg = 'rgba(6, 182, 212, 0.15)';
              badgeText = '#22d3ee';
              quadrantTitle = '⏳ Needs Speed Practice (Accurate but Slow)';
            } else if (item.quadrant === 'FAST_INACCURATE') {
              borderColor = 'rgba(245, 158, 11, 0.3)';
              badgeBg = 'rgba(245, 158, 11, 0.15)';
              badgeText = '#fbbf24';
              quadrantTitle = '⚡ Careless Errors (Rushing too fast)';
            } else {
              borderColor = 'rgba(239, 68, 68, 0.3)';
              badgeBg = 'rgba(239, 68, 68, 0.15)';
              badgeText = '#f87171';
              quadrantTitle = '🔴 Critical Gap (Low Accuracy & Slow)';
            }

            return (
              <div
                key={item.id}
                style={{
                  background: 'rgba(15, 23, 42, 0.7)',
                  borderRadius: '10px',
                  padding: '16px',
                  border: `1px solid ${borderColor}`,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '12px',
                }}
              >
                <div>
                  <div style={{ fontSize: '0.72rem', color: badgeText, background: badgeBg, padding: '3px 8px', borderRadius: '6px', display: 'inline-block', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px' }}>
                    {quadrantTitle}
                  </div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: '0 0 4px 0', color: 'var(--text-primary)' }}>
                    {item.topic}
                  </h4>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)' }}>
                    {item.subject}
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255, 255, 255, 0.06)', paddingTop: '10px' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    Accuracy: <strong style={{ color: badgeText }}>{item.accuracyPercentage}%</strong>
                  </span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    Pacing: <strong style={{ color: 'var(--text-primary)' }}>{item.avgTimeSeconds}s</strong>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. Weak Area Diagnostic Radar & Remediation Actions */}
      <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1.2rem' }}>🎯</span>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0, color: '#f87171' }}>
                Weak Area Diagnostic Radar & AI Remediation
              </h2>
            </div>
            <p style={{ margin: '4px 0 0 0', color: 'var(--text-secondary)', fontSize: '0.84rem' }}>
              Prioritized high-risk topics costing negative marks in recent exams.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {data.weakAreas.map((area) => (
            <div
              key={area.id}
              style={{
                background: area.severityLevel === 'CRITICAL' ? 'rgba(239, 68, 68, 0.05)' : 'rgba(245, 158, 11, 0.05)',
                borderRadius: '12px',
                padding: '16px 20px',
                border: area.severityLevel === 'CRITICAL' ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid rgba(245, 158, 11, 0.3)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '16px',
              }}
            >
              <div style={{ maxWidth: '600px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span
                    style={{
                      padding: '2px 8px',
                      borderRadius: '10px',
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      background: area.severityLevel === 'CRITICAL' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                      color: area.severityLevel === 'CRITICAL' ? '#f87171' : '#fbbf24',
                    }}
                  >
                    {area.severityLevel} RISK
                  </span>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)' }}>
                    • {area.subject}
                  </span>
                </div>

                <h4 style={{ fontSize: '1rem', fontWeight: 700, margin: '0 0 6px 0', color: 'var(--text-primary)' }}>
                  {area.topic}
                </h4>

                <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.84rem' }}>
                  💡 <strong>Remediation Plan:</strong> {area.recommendationAction}
                </p>

                <div style={{ display: 'flex', gap: '14px', marginTop: '8px', fontSize: '0.78rem', color: 'var(--text-tertiary)' }}>
                  <span>Accuracy: <strong style={{ color: '#f87171' }}>{area.accuracyPercentage}%</strong></span>
                  <span>Negative Marks Lost: <strong style={{ color: '#f87171' }}>-{area.negativeMarksLost}</strong></span>
                  <span>{area.pyqCountAvailable} PYQs Available</span>
                </div>
              </div>

              {/* Action buttons */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  onClick={() => onTriggerPractice && onTriggerPractice(area.topic)}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '8px',
                    background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                    color: '#ffffff',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <Zap size={14} /> Practice Drill
                </button>

                <button
                  onClick={() => onTriggerAiStudy && onTriggerAiStudy(area.topic)}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '8px',
                    background: 'rgba(236, 72, 153, 0.15)',
                    border: '1px solid rgba(236, 72, 153, 0.3)',
                    color: '#f472b6',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <Sparkles size={14} /> AI Concept Explainer
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 6. Historical Score Trajectory Trends */}
      <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
          Historical Test Score & Percentile Trajectory
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
          {data.historicalTrends.map((trend, idx) => (
            <div
              key={trend.testId}
              style={{
                background: 'rgba(255, 255, 255, 0.02)',
                borderRadius: '10px',
                padding: '16px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                <span>Test #{idx + 1}</span>
                <span>{trend.dateStr}</span>
              </div>

              <h4 style={{ fontSize: '0.92rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                {trend.testTitle}
              </h4>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#34d399' }}>
                  {trend.score} <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>/ {trend.maxScore}</span>
                </span>

                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#818cf8' }}>
                  {trend.percentile}th %ile 🚀
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
