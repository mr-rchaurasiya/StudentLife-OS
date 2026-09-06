import React, { useState } from 'react';
import { CreateSubjectDto } from '@studentlife/shared';
import { X, BookOpen, Plus, Trash2 } from 'lucide-react';

interface AddSubjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (dto: CreateSubjectDto) => Promise<void>;
}

const PRESET_COLORS = ['#6366f1', '#06b6d4', '#10b981', '#a855f7', '#f59e0b', '#f43f5e', '#3b82f6'];

export const AddSubjectModal: React.FC<AddSubjectModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [targetExam, setTargetExam] = useState('');
  const [colorCode, setColorCode] = useState('#6366f1');
  const [topicsList, setTopicsList] = useState<Array<{ title: string; difficulty: 'EASY' | 'MEDIUM' | 'HARD'; weightagePercentage: number }>>([
    { title: 'Core Foundations & Basics', difficulty: 'EASY', weightagePercentage: 10 },
    { title: 'Advanced Problem Solving', difficulty: 'HARD', weightagePercentage: 15 },
  ]);
  const [newTopicTitle, setNewTopicTitle] = useState('');
  const [newTopicDifficulty, setNewTopicDifficulty] = useState<'EASY' | 'MEDIUM' | 'HARD'>('MEDIUM');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleAddTopic = () => {
    if (!newTopicTitle.trim()) return;
    setTopicsList([
      ...topicsList,
      {
        title: newTopicTitle.trim(),
        difficulty: newTopicDifficulty,
        weightagePercentage: 10,
      },
    ]);
    setNewTopicTitle('');
  };

  const handleRemoveTopic = (idx: number) => {
    setTopicsList(topicsList.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    try {
      await onSave({
        name,
        code,
        targetExam,
        colorCode,
        initialTopics: topicsList,
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(5, 8, 15, 0.85)',
        backdropFilter: 'blur(12px)',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
      }}
      onClick={onClose}
    >
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '560px',
          maxHeight: '90vh',
          backgroundColor: 'rgba(15, 23, 42, 0.95)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.7), 0 0 40px rgba(99, 102, 241, 0.25)',
          overflowY: 'auto',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid var(--border-glass)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'sticky',
            top: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.98)',
            zIndex: 10,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'var(--gradient-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
              }}
            >
              <BookOpen size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Add New Subject to Syllabus</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                Track topics, weightages & completion milestones
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '6px',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {/* Subject Name & Code */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                Subject Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Database Management Systems"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  backgroundColor: 'rgba(0, 0, 0, 0.25)',
                  border: '1px solid var(--border-glass)',
                  borderRadius: '8px',
                  color: 'var(--text-primary)',
                  fontSize: '0.85rem',
                  outline: 'none',
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                Course Code
              </label>
              <input
                type="text"
                placeholder="e.g. CS-301"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  backgroundColor: 'rgba(0, 0, 0, 0.25)',
                  border: '1px solid var(--border-glass)',
                  borderRadius: '8px',
                  color: 'var(--text-primary)',
                  fontSize: '0.85rem',
                  outline: 'none',
                }}
              />
            </div>
          </div>

          {/* Target Exam Tag */}
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
              Target Exam / Module (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. GATE 2027 CSE, University Finals"
              value={targetExam}
              onChange={(e) => setTargetExam(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                backgroundColor: 'rgba(0, 0, 0, 0.25)',
                border: '1px solid var(--border-glass)',
                borderRadius: '8px',
                color: 'var(--text-primary)',
                fontSize: '0.85rem',
                outline: 'none',
              }}
            />
          </div>

          {/* Color Picker */}
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>
              Subject Accent Color
            </label>
            <div style={{ display: 'flex', gap: '8px' }}>
              {PRESET_COLORS.map((col) => (
                <button
                  key={col}
                  type="button"
                  onClick={() => setColorCode(col)}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    backgroundColor: col,
                    border: colorCode === col ? '3px solid #ffffff' : '1px solid transparent',
                    cursor: 'pointer',
                    boxShadow: colorCode === col ? `0 0 12px ${col}` : 'none',
                  }}
                />
              ))}
            </div>
          </div>

          {/* Initial Topics Section */}
          <div style={{ paddingTop: '8px', borderTop: '1px solid var(--border-glass)' }}>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>
              Initial Topics / Chapters ({topicsList.length})
            </label>

            {/* List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '12px' }}>
              {topicsList.map((t, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '6px',
                    backgroundColor: 'rgba(0, 0, 0, 0.25)',
                    border: '1px solid var(--border-glass)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '0.8rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>{t.title}</span>
                    <span style={{ fontSize: '0.65rem', padding: '2px 6px', borderRadius: '4px', backgroundColor: 'rgba(99, 102, 241, 0.15)', color: '#818cf8', fontWeight: 600 }}>
                      {t.difficulty}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveTopic(idx)}
                    style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>

            {/* Add Topic Input Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr auto', gap: '8px' }}>
              <input
                type="text"
                placeholder="Topic / Chapter name..."
                value={newTopicTitle}
                onChange={(e) => setNewTopicTitle(e.target.value)}
                style={{
                  padding: '8px 10px',
                  backgroundColor: 'rgba(0, 0, 0, 0.25)',
                  border: '1px solid var(--border-glass)',
                  borderRadius: '6px',
                  color: 'var(--text-primary)',
                  fontSize: '0.8rem',
                  outline: 'none',
                }}
              />
              <select
                value={newTopicDifficulty}
                onChange={(e) => setNewTopicDifficulty(e.target.value as any)}
                style={{
                  padding: '8px',
                  backgroundColor: 'rgba(15, 23, 42, 0.9)',
                  border: '1px solid var(--border-glass)',
                  borderRadius: '6px',
                  color: 'var(--text-primary)',
                  fontSize: '0.75rem',
                  outline: 'none',
                }}
              >
                <option value="EASY">Easy</option>
                <option value="MEDIUM">Medium</option>
                <option value="HARD">Hard</option>
              </select>
              <button
                type="button"
                onClick={handleAddTopic}
                className="btn btn-secondary"
                style={{ padding: '8px 12px', fontSize: '0.75rem' }}
              >
                <Plus size={14} /> Add
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
              style={{ padding: '8px 16px' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary"
              style={{ padding: '8px 22px' }}
            >
              {isSubmitting ? 'Adding...' : 'Save Subject'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
