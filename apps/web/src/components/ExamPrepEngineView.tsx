import React, { useState, useEffect } from 'react';
import {
  ExamProfileItem,
  CreateExamProfileDto,
  ExamCategory,
} from '@studentlife/shared';
import { useAuth } from '../context/AuthContext';
import {
  Plus,
  Compass,
} from 'lucide-react';

const API_BASE = 'http://localhost:5000/api';

const calculateDays = (dateStr: string) => {
  const target = new Date(dateStr).getTime();
  const now = new Date().getTime();
  const diff = target - now;
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
};

const DEFAULT_FALLBACK_EXAMS: ExamProfileItem[] = [
  {
    id: 'exam-1',
    examName: 'GATE 2027 (Computer Science & Engineering)',
    examCode: 'GATE-CS',
    examCategory: 'NATIONAL_COMPETITIVE',
    targetExamDate: '2027-02-14',
    daysRemaining: calculateDays('2027-02-14'),
    targetScore: '75 / 100 Marks',
    targetPercentile: 'AIR < 500 (Top 0.5%)',
    syllabusCoveragePercent: 54,
    mockTestAverageScore: 68,
    overallReadinessIndex: 61,
    status: 'ACTIVE',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    strategyPhases: [
      {
        id: 'ms-1',
        name: 'Phase 1: Core Syllabus & Theory Coverage',
        targetMonth: 'Sept – Nov 2026',
        isCompleted: true,
        description: 'Complete discrete math, algorithms, COA, DBMS, and OS core topics.',
      },
      {
        id: 'ms-2',
        name: 'Phase 2: 15-Year PYQ Solving & Topic Tests',
        targetMonth: 'Dec 2026 – Jan 2027',
        isCompleted: false,
        description: 'Solve all past 15 years question papers with error-log tracking.',
      },
      {
        id: 'ms-3',
        name: 'Phase 3: Full-Length Mocks & Speed Calibration',
        targetMonth: 'Jan – Feb 2027',
        isCompleted: false,
        description: 'Simulate 10 national-level 3-hour tests with negative marking.',
      },
    ],
  },
  {
    id: 'exam-2',
    examName: 'University B.Tech 6th Semester Finals',
    examCode: 'UNIV-SEM6',
    examCategory: 'UNIVERSITY',
    targetExamDate: '2026-11-20',
    daysRemaining: calculateDays('2026-11-20'),
    targetScore: 'CGPA >= 9.2',
    targetPercentile: 'Top 5% in Department',
    syllabusCoveragePercent: 72,
    mockTestAverageScore: 82,
    overallReadinessIndex: 77,
    status: 'ACTIVE',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    strategyPhases: [
      {
        id: 'ms-4',
        name: 'Mid-term Lab Assessments & Viva Prep',
        targetMonth: 'October 2026',
        isCompleted: true,
        description: 'Complete internal projects and system design viva checklists.',
      },
      {
        id: 'ms-5',
        name: 'Past 5-Year University Papers & Derivations',
        targetMonth: 'November 2026',
        isCompleted: false,
        description: 'Practice 10-mark long-answer questions and theory proofs.',
      },
    ],
  },
  {
    id: 'exam-3',
    examName: 'Tech Tier-1 Software Engineer Online Assessment',
    examCode: 'OA-SWE',
    examCategory: 'RECRUITMENT',
    targetExamDate: '2026-10-15',
    daysRemaining: calculateDays('2026-10-15'),
    targetScore: '100% Test Case Pass',
    targetPercentile: 'Top 2% of applicants',
    syllabusCoveragePercent: 65,
    mockTestAverageScore: 78,
    overallReadinessIndex: 71,
    status: 'ACTIVE',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    strategyPhases: [
      {
        id: 'ms-6',
        name: 'Blind 75 & LeetCode Top Patterns',
        targetMonth: 'Sept 2026',
        isCompleted: true,
        description: 'Trees, Graphs, DP state compression, and Trie implementations.',
      },
      {
        id: 'ms-7',
        name: 'Timed 90-Min Coding Assessment Mock Run',
        targetMonth: 'Early Oct 2026',
        isCompleted: false,
        description: 'Simulate HackerRank / CodeSignal 4-problem test constraints.',
      },
    ],
  },
];

interface ExamPrepEngineViewProps {
  onMilestoneToggled?: (xp: number) => void;
}

export const ExamPrepEngineView: React.FC<ExamPrepEngineViewProps> = ({ onMilestoneToggled }) => {
  const { tokens } = useAuth();
  const [exams, setExams] = useState<ExamProfileItem[]>(DEFAULT_FALLBACK_EXAMS);
  const [selectedExamId, setSelectedExamId] = useState<string>(DEFAULT_FALLBACK_EXAMS[0].id);
  const [isCreatingExam, setIsCreatingExam] = useState(false);

  // New Exam Form State
  const [newExamName, setNewExamName] = useState('');
  const [newExamCode, setNewExamCode] = useState('');
  const [newCategory, setNewCategory] = useState<ExamCategory>('NATIONAL_COMPETITIVE');
  const [newExamDate, setNewExamDate] = useState('2027-05-15');
  const [newTargetScore, setNewTargetScore] = useState('Top 1% Marks');
  const [newTargetPercentile, setNewTargetPercentile] = useState('99.5th Percentile');

  const fetchExams = async () => {
    try {
      const res = await fetch(`${API_BASE}/exam-prep/profiles`, {
        headers: { Authorization: `Bearer ${tokens?.accessToken || ''}` },
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.data) {
          setExams(data.data);
          if (data.data.length > 0 && !selectedExamId) {
            setSelectedExamId(data.data[0].id);
          }
        }
      }
    } catch {
      // Keep state
    }
  };

  useEffect(() => {
    fetchExams();
  }, [tokens]);

  const selectedExam = exams.find((e) => e.id === selectedExamId) || exams[0];

  const handleToggleMilestone = async (examId: string, milestoneId: string) => {
    try {
      const res = await fetch(`${API_BASE}/exam-prep/profiles/${examId}/milestones/${milestoneId}`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${tokens?.accessToken || ''}` },
      });
      if (res.ok) {
        const data = await res.json();
        if (data.data) {
          setExams(exams.map((e) => (e.id === examId ? data.data : e)));
          if (onMilestoneToggled) onMilestoneToggled(25);
          return;
        }
      }
    } catch {
      // Fallback
    }

    // Local update fallback
    const updated = exams.map((e) => {
      if (e.id === examId) {
        const phases = e.strategyPhases.map((m) =>
          m.id === milestoneId ? { ...m, isCompleted: !m.isCompleted } : m
        );
        const completedCount = phases.filter((m) => m.isCompleted).length;
        const readiness = Math.min(100, e.syllabusCoveragePercent + Math.round((completedCount / phases.length) * 20));
        return {
          ...e,
          strategyPhases: phases,
          overallReadinessIndex: readiness,
        };
      }
      return e;
    });

    setExams(updated);
    if (onMilestoneToggled) onMilestoneToggled(25);
  };

  const handleCreateExam = async () => {
    if (!newExamName.trim()) {
      alert('Please provide an exam title.');
      return;
    }

    const dto: CreateExamProfileDto = {
      examName: newExamName,
      examCode: newExamCode || 'TARGET',
      examCategory: newCategory,
      targetExamDate: newExamDate,
      targetScore: newTargetScore,
      targetPercentile: newTargetPercentile,
    };

    try {
      const res = await fetch(`${API_BASE}/exam-prep/profiles`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${tokens?.accessToken || ''}`,
        },
        body: JSON.stringify(dto),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.data) {
          setExams([data.data, ...exams]);
          setSelectedExamId(data.data.id);
          setIsCreatingExam(false);
          return;
        }
      }
    } catch {
      // Fallback
    }

    // Local fallback
    const localNew: ExamProfileItem = {
      id: `exam-${Date.now()}`,
      examName: newExamName,
      examCode: newExamCode || 'TARGET',
      examCategory: newCategory,
      targetExamDate: newExamDate,
      daysRemaining: calculateDays(newExamDate),
      targetScore: newTargetScore,
      targetPercentile: newTargetPercentile,
      syllabusCoveragePercent: 20,
      mockTestAverageScore: 0,
      overallReadinessIndex: 25,
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      strategyPhases: [
        {
          id: `ms-${Date.now()}-1`,
          name: 'Phase 1: Conceptual Foundations',
          targetMonth: 'Month 1',
          isCompleted: false,
          description: 'Core syllabus coverage and fundamentals.',
        },
        {
          id: `ms-${Date.now()}-2`,
          name: 'Phase 2: Question Bank Drills',
          targetMonth: 'Month 2',
          isCompleted: false,
          description: 'High-frequency PYQ practice.',
        },
      ],
    };

    setExams([localNew, ...exams]);
    setSelectedExamId(localNew.id);
    setIsCreatingExam(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' }}>
      {/* Header Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.15), rgba(59, 130, 246, 0.12), rgba(16, 185, 129, 0.15))',
          border: '1px solid rgba(6, 182, 212, 0.3)',
          borderRadius: '16px',
          padding: '24px 28px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <span
              style={{
                background: 'linear-gradient(135deg, #06b6d4, #0284c7)',
                color: '#fff',
                padding: '3px 10px',
                borderRadius: '8px',
                fontSize: '0.72rem',
                fontWeight: 800,
                letterSpacing: '0.5px',
              }}
            >
              🎯 MILESTONE 3: EXAM & PRACTICE INAUGURATED
            </span>
            <span style={{ fontSize: '0.75rem', color: '#38bdf8', fontWeight: 600 }}>
              Phase 10 Active
            </span>
          </div>
          <h1
            style={{
              fontSize: '1.8rem',
              fontWeight: 800,
              background: 'linear-gradient(135deg, #fff, #a5f3fc, #93c5fd)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              margin: 0,
            }}
          >
            🏁 Exam Preparation & Strategy Cockpit
          </h1>
          <p style={{ color: 'var(--text-secondary)', margin: '6px 0 0 0', fontSize: '0.9rem' }}>
            Multi-exam countdown telemetry, target percentile trackers, and automated 3-stage preparation strategy roadmaps.
          </p>
        </div>

        <button
          onClick={() => setIsCreatingExam(true)}
          style={{
            padding: '10px 18px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #06b6d4, #0284c7)',
            color: '#fff',
            border: 'none',
            fontWeight: 700,
            fontSize: '0.88rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: '0 4px 14px rgba(6, 182, 212, 0.3)',
          }}
        >
          <Plus size={16} /> Add Target Exam
        </button>
      </div>

      {/* Main Split: Exam Switcher Cards & Detail Cockpit */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '360px 1fr',
          gap: '20px',
          minHeight: '600px',
        }}
      >
        {/* Left: Exam Profiles List */}
        <div
          style={{
            background: 'var(--card-bg)',
            border: '1px solid var(--border-color)',
            borderRadius: '16px',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase' }}>
            Target Exams ({exams.length})
          </span>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', overflowY: 'auto' }}>
            {exams.map((exam) => {
              const isSelected = selectedExam?.id === exam.id;
              return (
                <div
                  key={exam.id}
                  onClick={() => setSelectedExamId(exam.id)}
                  style={{
                    padding: '14px 16px',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    background: isSelected
                      ? 'linear-gradient(135deg, rgba(6, 182, 212, 0.2), rgba(2, 132, 199, 0.08))'
                      : 'rgba(255,255,255,0.02)',
                    border: isSelected
                      ? '1px solid rgba(6, 182, 212, 0.4)'
                      : '1px solid rgba(255,255,255,0.06)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span
                      style={{
                        fontSize: '0.68rem',
                        fontWeight: 700,
                        padding: '2px 6px',
                        borderRadius: '4px',
                        background: 'rgba(6, 182, 212, 0.15)',
                        color: '#22d3ee',
                      }}
                    >
                      {exam.examCategory.replace('_', ' ')}
                    </span>
                    <span
                      style={{
                        fontSize: '0.78rem',
                        fontWeight: 800,
                        color: exam.daysRemaining <= 60 ? '#f87171' : '#34d399',
                      }}
                    >
                      ⏳ {exam.daysRemaining} days left
                    </span>
                  </div>

                  <div style={{ fontWeight: 700, fontSize: '0.92rem', color: isSelected ? '#fff' : '#cbd5e1' }}>
                    {exam.examName}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    <span>Goal: {exam.targetScore}</span>
                    <span style={{ color: '#38bdf8', fontWeight: 600 }}>{exam.overallReadinessIndex}% Ready</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Selected Exam Readiness & Strategy Timeline */}
        {selectedExam && (
          <div
            style={{
              background: 'var(--card-bg)',
              border: '1px solid var(--border-color)',
              borderRadius: '16px',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
            }}
          >
            {/* Top Exam Header */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                borderBottom: '1px solid var(--border-color)',
                paddingBottom: '16px',
                flexWrap: 'wrap',
                gap: '12px',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      color: '#06b6d4',
                      textTransform: 'uppercase',
                    }}
                  >
                    {selectedExam.examCode} • {selectedExam.examCategory.replace('_', ' ')}
                  </span>
                </div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0, color: '#fff' }}>
                  {selectedExam.examName}
                </h2>
                <div style={{ display: 'flex', gap: '16px', marginTop: '6px', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                  <span>📅 Exam Date: <strong style={{ color: '#fff' }}>{selectedExam.targetExamDate}</strong></span>
                  <span>🏆 Target Percentile: <strong style={{ color: '#34d399' }}>{selectedExam.targetPercentile}</strong></span>
                </div>
              </div>

              {/* Countdown Big Box */}
              <div
                style={{
                  background: 'rgba(6, 182, 212, 0.1)',
                  border: '1px solid rgba(6, 182, 212, 0.3)',
                  borderRadius: '12px',
                  padding: '10px 18px',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#22d3ee' }}>
                  {selectedExam.daysRemaining}
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                  DAYS REMAINING
                </div>
              </div>
            </div>

            {/* Readiness Telemetry */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px' }}>
              <div
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  borderRadius: '10px',
                  padding: '14px',
                  border: '1px solid var(--border-color)',
                }}
              >
                <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: 600 }}>OVERALL READINESS</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#34d399', marginTop: '4px' }}>
                  {selectedExam.overallReadinessIndex}%
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Based on syllabus & mocks</div>
              </div>

              <div
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  borderRadius: '10px',
                  padding: '14px',
                  border: '1px solid var(--border-color)',
                }}
              >
                <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: 600 }}>SYLLABUS COVERAGE</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#38bdf8', marginTop: '4px' }}>
                  {selectedExam.syllabusCoveragePercent}%
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>From Syllabus Tracker</div>
              </div>

              <div
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  borderRadius: '10px',
                  padding: '14px',
                  border: '1px solid var(--border-color)',
                }}
              >
                <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: 600 }}>MOCK TEST AVERAGE</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#a78bfa', marginTop: '4px' }}>
                  {selectedExam.mockTestAverageScore > 0 ? `${selectedExam.mockTestAverageScore} / 100` : 'Pending Mocks'}
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Phase 12 Simulator Link</div>
              </div>
            </div>

            {/* Strategy Roadmap Timeline */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Compass size={18} color="#06b6d4" />
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0, color: '#fff' }}>
                    3-Stage Strategy Roadmap
                  </h3>
                </div>
                <span style={{ fontSize: '0.75rem', color: '#a78bfa', fontWeight: 600 }}>
                  Click milestone checkmark to complete (+25 XP)
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {selectedExam.strategyPhases.map((milestone, idx) => (
                  <div
                    key={milestone.id}
                    onClick={() => handleToggleMilestone(selectedExam.id, milestone.id)}
                    style={{
                      background: milestone.isCompleted
                        ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.12), rgba(5, 150, 105, 0.05))'
                        : 'rgba(255,255,255,0.02)',
                      border: milestone.isCompleted
                        ? '1px solid rgba(16, 185, 129, 0.4)'
                        : '1px solid rgba(255,255,255,0.06)',
                      borderRadius: '12px',
                      padding: '16px 20px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <div
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: milestone.isCompleted ? '#10b981' : 'rgba(255,255,255,0.1)',
                        color: milestone.isCompleted ? '#fff' : 'var(--text-secondary)',
                        fontWeight: 800,
                        fontSize: '0.8rem',
                      }}
                    >
                      {milestone.isCompleted ? '✓' : idx + 1}
                    </div>

                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div
                          style={{
                            fontWeight: 700,
                            fontSize: '0.92rem',
                            color: milestone.isCompleted ? '#34d399' : '#fff',
                            textDecoration: milestone.isCompleted ? 'line-through' : 'none',
                          }}
                        >
                          {milestone.name}
                        </div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                          {milestone.targetMonth}
                        </span>
                      </div>
                      {milestone.description && (
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                          {milestone.description}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add Exam Modal */}
      {isCreatingExam && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.7)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px',
          }}
        >
          <div
            style={{
              background: '#0f172a',
              border: '1px solid var(--border-color)',
              borderRadius: '20px',
              padding: '28px',
              maxWidth: '520px',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, color: '#fff' }}>
                🎯 Add Target Exam Profile
              </h3>
              <button
                onClick={() => setIsCreatingExam(false)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '1.2rem' }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Exam Title</label>
                <input
                  type="text"
                  placeholder="e.g. UPSC CSE 2027"
                  value={newExamName}
                  onChange={(e) => setNewExamName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid var(--border-color)',
                    color: '#fff',
                    fontSize: '0.88rem',
                    outline: 'none',
                    marginTop: '4px',
                  }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Exam Code</label>
                <input
                  type="text"
                  placeholder="e.g. UPSC-27"
                  value={newExamCode}
                  onChange={(e) => setNewExamCode(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid var(--border-color)',
                    color: '#fff',
                    fontSize: '0.88rem',
                    outline: 'none',
                    marginTop: '4px',
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as ExamCategory)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid var(--border-color)',
                    color: '#fff',
                    fontSize: '0.88rem',
                    outline: 'none',
                    marginTop: '4px',
                  }}
                >
                  <option value="NATIONAL_COMPETITIVE">National Competitive</option>
                  <option value="UNIVERSITY">University Exam</option>
                  <option value="RECRUITMENT">Recruitment Assessment</option>
                  <option value="CERTIFICATION">Professional Cert</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Exam Date</label>
                <input
                  type="date"
                  value={newExamDate}
                  onChange={(e) => setNewExamDate(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid var(--border-color)',
                    color: '#fff',
                    fontSize: '0.88rem',
                    outline: 'none',
                    marginTop: '4px',
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Target Score Goal</label>
                <input
                  type="text"
                  placeholder="e.g. 80 / 100 Marks"
                  value={newTargetScore}
                  onChange={(e) => setNewTargetScore(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid var(--border-color)',
                    color: '#fff',
                    fontSize: '0.88rem',
                    outline: 'none',
                    marginTop: '4px',
                  }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Target Percentile</label>
                <input
                  type="text"
                  placeholder="e.g. Top 0.5% (AIR < 200)"
                  value={newTargetPercentile}
                  onChange={(e) => setNewTargetPercentile(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid var(--border-color)',
                    color: '#fff',
                    fontSize: '0.88rem',
                    outline: 'none',
                    marginTop: '4px',
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
              <button
                onClick={() => setIsCreatingExam(false)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  fontWeight: 600,
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleCreateExam}
                style={{
                  padding: '8px 18px',
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #06b6d4, #0284c7)',
                  border: 'none',
                  color: '#fff',
                  cursor: 'pointer',
                  fontWeight: 700,
                }}
              >
                Create Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
