import React, { useState } from 'react';
import {
  SubjectWithTopics,
  CreateSubjectDto,
  CreateTopicDto,
  SyllabusOverviewStats,
} from '@studentlife/shared';
import { AddSubjectModal } from './AddSubjectModal';
import {
  Plus,
  BookOpen,
  CheckCircle2,
  Circle,
  ChevronDown,
  ChevronUp,
  Zap,
  Trash2,
} from 'lucide-react';

interface SyllabusManagerViewProps {
  subjects: SubjectWithTopics[];
  overview: SyllabusOverviewStats;
  onToggleTopic: (topicId: string) => Promise<void>;
  onCreateSubject: (dto: CreateSubjectDto) => Promise<void>;
  onAddTopic: (subjectId: string, dto: CreateTopicDto) => Promise<void>;
  onDeleteTopic: (topicId: string) => Promise<void>;
}

export const SyllabusManagerView: React.FC<SyllabusManagerViewProps> = ({
  subjects,
  overview,
  onToggleTopic,
  onCreateSubject,
  onAddTopic,
  onDeleteTopic,
}) => {
  const [isAddSubjectOpen, setIsAddSubjectOpen] = useState(false);
  const [expandedSubjectIds, setExpandedSubjectIds] = useState<string[]>(subjects.map((s) => s.id));
  const [newTopicInputs, setNewTopicInputs] = useState<{ [subjectId: string]: string }>({});
  const [xpToast, setXpToast] = useState<{ topicTitle: string; xp: number } | null>(null);

  const toggleSubjectExpand = (id: string) => {
    if (expandedSubjectIds.includes(id)) {
      setExpandedSubjectIds(expandedSubjectIds.filter((x) => x !== id));
    } else {
      setExpandedSubjectIds([...expandedSubjectIds, id]);
    }
  };

  const handleTopicCheck = async (topicTitle: string, topicId: string, isCurrentlyCompleted: boolean) => {
    await onToggleTopic(topicId);
    if (!isCurrentlyCompleted) {
      setXpToast({ topicTitle, xp: 20 });
      setTimeout(() => setXpToast(null), 3500);
    }
  };

  const handleInlineAddTopic = async (subjectId: string) => {
    const title = newTopicInputs[subjectId]?.trim();
    if (!title) return;

    await onAddTopic(subjectId, {
      subjectId,
      title,
      difficulty: 'MEDIUM',
      weightagePercentage: 10,
    });

    setNewTopicInputs({ ...newTopicInputs, [subjectId]: '' });
  };

  const getDifficultyBadge = (diff: 'EASY' | 'MEDIUM' | 'HARD') => {
    switch (diff) {
      case 'HARD':
        return <span style={{ fontSize: '0.65rem', padding: '2px 6px', borderRadius: '4px', backgroundColor: 'rgba(244, 63, 94, 0.15)', color: '#f87171', fontWeight: 700 }}>HARD</span>;
      case 'MEDIUM':
        return <span style={{ fontSize: '0.65rem', padding: '2px 6px', borderRadius: '4px', backgroundColor: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', fontWeight: 700 }}>MED</span>;
      case 'EASY':
        return <span style={{ fontSize: '0.65rem', padding: '2px 6px', borderRadius: '4px', backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#34d399', fontWeight: 700 }}>EASY</span>;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Top Banner & Overview */}
      <div className="glass-panel glow-hover" style={{ padding: '24px 32px', background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.85) 0%, rgba(15, 23, 42, 0.95) 100%)' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '20px' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span className="badge badge-completed">
                <CheckCircle2 size={12} /> PHASE 06 ACTIVE
              </span>
              <span className="badge badge-active">SYLLABUS & TOPIC MASTERY TRACKER</span>
            </div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>
              Syllabus Tracker & <span className="gradient-text">Topic Mastery</span>
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
              Hierarchical syllabus tree, topic weightage analytics, and exam-aligned completion telemetry.
            </p>
          </div>

          <button
            onClick={() => setIsAddSubjectOpen(true)}
            className="btn btn-primary"
            style={{ padding: '10px 18px', fontSize: '0.85rem' }}
          >
            <Plus size={16} /> Add Subject
          </button>
        </div>

        {/* Global Overview Metrics */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border-glass)' }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Overall Syllabus Coverage</div>
            <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--accent-secondary)' }}>
              {overview.overallCoveragePercentage}%
            </div>
            <div style={{ width: '100%', height: '4px', backgroundColor: '#1e293b', borderRadius: '2px', overflow: 'hidden', marginTop: '4px' }}>
              <div style={{ width: `${overview.overallCoveragePercentage}%`, height: '100%', background: 'var(--gradient-accent)' }} />
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Subjects Enrolled</div>
            <div style={{ fontSize: '1.3rem', fontWeight: 800 }}>
              {overview.totalSubjects} Subjects
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Topic Completion</div>
            <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>
              {overview.completedTopics} / {overview.totalTopics} Topics
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>High-Weightage Pending</div>
            <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#f43f5e' }}>
              {overview.highWeightageTopicsPending} Topics
            </div>
          </div>
        </div>
      </div>

      {/* Subject Cards & Topic Tree */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {subjects.map((sub) => {
          const isExpanded = expandedSubjectIds.includes(sub.id);

          return (
            <div
              key={sub.id}
              className="glass-panel glow-hover"
              style={{
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                borderLeft: `4px solid ${sub.colorCode}`,
              }}
            >
              {/* Subject Header Accordion */}
              <div
                onClick={() => toggleSubjectExpand(sub.id)}
                style={{
                  padding: '18px 24px',
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'pointer',
                  backgroundColor: 'rgba(15, 23, 42, 0.7)',
                  gap: '12px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '8px',
                      backgroundColor: `${sub.colorCode}20`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: sub.colorCode,
                    }}
                  >
                    <BookOpen size={18} />
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: 800 }}>{sub.name}</h3>
                      {sub.code && (
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                          [{sub.code}]
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                      {sub.targetExam} &bull; {sub.completedTopics} of {sub.totalTopics} Topics Mastered
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  {/* Progress Ring / Bar */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: '160px' }}>
                    <div style={{ flex: 1, height: '6px', backgroundColor: '#1e293b', borderRadius: '3px', overflow: 'hidden' }}>
                      <div
                        style={{
                          width: `${sub.completionPercentage}%`,
                          height: '100%',
                          backgroundColor: sub.colorCode,
                          borderRadius: '3px',
                          transition: 'width 0.4s ease',
                        }}
                      />
                    </div>
                    <span style={{ fontSize: '0.85rem', fontWeight: 800, color: sub.colorCode }}>
                      {sub.completionPercentage}%
                    </span>
                  </div>

                  <button
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--text-muted)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </button>
                </div>
              </div>

              {/* Topics Tree List (When Expanded) */}
              {isExpanded && (
                <div style={{ padding: '16px 24px 20px 24px', backgroundColor: 'rgba(0, 0, 0, 0.2)', borderTop: '1px solid var(--border-glass)' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {sub.topics.map((topic) => (
                      <div
                        key={topic.id}
                        style={{
                          padding: '10px 14px',
                          borderRadius: '8px',
                          backgroundColor: 'rgba(15, 23, 42, 0.5)',
                          border: '1px solid var(--border-glass)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '12px',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                          <button
                            onClick={() => handleTopicCheck(topic.title, topic.id, topic.isCompleted)}
                            style={{
                              background: 'transparent',
                              border: 'none',
                              cursor: 'pointer',
                              padding: 0,
                              color: topic.isCompleted ? 'var(--accent-emerald)' : 'var(--text-muted)',
                              display: 'flex',
                              alignItems: 'center',
                            }}
                          >
                            {topic.isCompleted ? <CheckCircle2 size={18} /> : <Circle size={18} />}
                          </button>
                          <span
                            style={{
                              fontSize: '0.85rem',
                              fontWeight: topic.isCompleted ? 500 : 700,
                              color: topic.isCompleted ? 'var(--text-muted)' : 'var(--text-primary)',
                              textDecoration: topic.isCompleted ? 'line-through' : 'none',
                            }}
                          >
                            {topic.title}
                          </span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          {/* Weightage Badge */}
                          <span
                            style={{
                              fontSize: '0.7rem',
                              padding: '2px 8px',
                              borderRadius: '4px',
                              backgroundColor: topic.weightagePercentage >= 14 ? 'rgba(244, 63, 94, 0.15)' : 'rgba(99, 102, 241, 0.15)',
                              color: topic.weightagePercentage >= 14 ? '#fda4af' : '#a5b4fc',
                              fontWeight: 600,
                            }}
                          >
                            {topic.weightagePercentage}% Weight
                          </span>

                          {getDifficultyBadge(topic.difficulty)}

                          <button
                            onClick={() => onDeleteTopic(topic.id)}
                            style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
                            title="Delete topic"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}

                    {/* Inline Add Topic Row */}
                    <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                      <input
                        type="text"
                        placeholder={`Add new chapter / topic to ${sub.name}...`}
                        value={newTopicInputs[sub.id] || ''}
                        onChange={(e) => setNewTopicInputs({ ...newTopicInputs, [sub.id]: e.target.value })}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleInlineAddTopic(sub.id);
                          }
                        }}
                        style={{
                          flex: 1,
                          padding: '8px 12px',
                          backgroundColor: 'rgba(0, 0, 0, 0.25)',
                          border: '1px solid var(--border-glass)',
                          borderRadius: '6px',
                          color: 'var(--text-primary)',
                          fontSize: '0.8rem',
                          outline: 'none',
                        }}
                      />
                      <button
                        onClick={() => handleInlineAddTopic(sub.id)}
                        className="btn btn-secondary"
                        style={{ padding: '8px 14px', fontSize: '0.75rem' }}
                      >
                        <Plus size={14} /> Add Topic
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add Subject Modal */}
      <AddSubjectModal
        isOpen={isAddSubjectOpen}
        onClose={() => setIsAddSubjectOpen(false)}
        onSave={onCreateSubject}
      />

      {/* XP Notification Toast */}
      {xpToast && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            padding: '12px 20px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'rgba(16, 185, 129, 0.95)',
            backdropFilter: 'blur(12px)',
            color: '#ffffff',
            boxShadow: '0 8px 24px rgba(16, 185, 129, 0.4)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <Zap size={18} />
          <div>
            <div style={{ fontWeight: 800, fontSize: '0.85rem' }}>Topic Mastered!</div>
            <div style={{ fontSize: '0.75rem', opacity: 0.9 }}>+{xpToast.xp} XP added to your scholar profile</div>
          </div>
        </div>
      )}

    </div>
  );
};
