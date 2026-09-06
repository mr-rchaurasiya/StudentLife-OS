import React, { useState, useEffect } from 'react';
import { StudyTask, CreateStudyTaskDto, TaskPriority } from '@studentlife/shared';
import { X, Calendar, Clock, Tag, AlertTriangle, CheckSquare } from 'lucide-react';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskToEdit?: StudyTask | null;
  onSave: (dto: CreateStudyTaskDto) => Promise<void>;
}

const SUBJECT_OPTIONS = [
  { name: 'Data Structures & Algorithms', color: '#6366f1' },
  { name: 'System Design', color: '#06b6d4' },
  { name: 'GATE Exam Prep', color: '#f43f5e' },
  { name: 'Computer Networks', color: '#10b981' },
  { name: 'Mathematics & Calculus', color: '#a855f7' },
  { name: 'General Revision', color: '#f59e0b' },
];

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  taskToEdit,
  onSave,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [subjectName, setSubjectName] = useState('Data Structures & Algorithms');
  const [subjectColor, setSubjectColor] = useState('#6366f1');
  const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueTime, setDueTime] = useState('04:00 PM');
  const [priority, setPriority] = useState<TaskPriority>('MEDIUM');
  const [estimatedMinutes, setEstimatedMinutes] = useState<number>(45);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title);
      setDescription(taskToEdit.description || '');
      setSubjectName(taskToEdit.subjectName);
      setSubjectColor(taskToEdit.subjectColor || '#6366f1');
      setDueDate(taskToEdit.dueDate);
      setDueTime(taskToEdit.dueTime || '04:00 PM');
      setPriority(taskToEdit.priority);
      setEstimatedMinutes(taskToEdit.estimatedMinutes);
    } else {
      setTitle('');
      setDescription('');
      setSubjectName('Data Structures & Algorithms');
      setSubjectColor('#6366f1');
      setDueDate(new Date().toISOString().split('T')[0]);
      setDueTime('04:00 PM');
      setPriority('MEDIUM');
      setEstimatedMinutes(45);
    }
  }, [taskToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubjectChange = (name: string, color: string) => {
    setSubjectName(name);
    setSubjectColor(color);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    try {
      await onSave({
        title,
        description,
        subjectName,
        subjectColor,
        dueDate,
        dueTime,
        priority,
        estimatedMinutes,
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
          maxWidth: '520px',
          backgroundColor: 'rgba(15, 23, 42, 0.95)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.7), 0 0 40px rgba(99, 102, 241, 0.25)',
          overflow: 'hidden',
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
              <CheckSquare size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>
                {taskToEdit ? 'Edit Study Task' : 'Schedule New Study Task'}
              </h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                Time-block tasks with subjects, priorities and Pomodoro sessions
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {/* Title */}
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
              Task Title
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Master Dynamic Programming 0/1 Knapsack"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                backgroundColor: 'rgba(0, 0, 0, 0.25)',
                border: '1px solid var(--border-glass)',
                borderRadius: '8px',
                color: 'var(--text-primary)',
                fontSize: '0.9rem',
                outline: 'none',
              }}
            />
          </div>

          {/* Description */}
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
              Notes / Sub-goals (Optional)
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Solve 3 problems on LeetCode + write markdown cheat-sheet"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                backgroundColor: 'rgba(0, 0, 0, 0.25)',
                border: '1px solid var(--border-glass)',
                borderRadius: '8px',
                color: 'var(--text-primary)',
                fontSize: '0.85rem',
                outline: 'none',
                resize: 'none',
              }}
            />
          </div>

          {/* Subject Picker */}
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
              <Tag size={14} /> Subject / Module
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {SUBJECT_OPTIONS.map((sub) => {
                const isSelected = subjectName === sub.name;
                return (
                  <button
                    key={sub.name}
                    type="button"
                    onClick={() => handleSubjectChange(sub.name, sub.color)}
                    style={{
                      padding: '5px 10px',
                      borderRadius: '6px',
                      border: isSelected ? `1px solid ${sub.color}` : '1px solid var(--border-glass)',
                      backgroundColor: isSelected ? `${sub.color}25` : 'rgba(0,0,0,0.2)',
                      color: isSelected ? sub.color : 'var(--text-secondary)',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    {sub.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Date & Time Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                <Calendar size={14} /> Due Date
              </label>
              <input
                type="date"
                required
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  backgroundColor: 'rgba(0, 0, 0, 0.25)',
                  border: '1px solid var(--border-glass)',
                  borderRadius: '6px',
                  color: 'var(--text-primary)',
                  fontSize: '0.85rem',
                  outline: 'none',
                }}
              />
            </div>
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                <Clock size={14} /> Time Slot
              </label>
              <input
                type="text"
                placeholder="e.g. 10:00 AM"
                value={dueTime}
                onChange={(e) => setDueTime(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  backgroundColor: 'rgba(0, 0, 0, 0.25)',
                  border: '1px solid var(--border-glass)',
                  borderRadius: '6px',
                  color: 'var(--text-primary)',
                  fontSize: '0.85rem',
                  outline: 'none',
                }}
              />
            </div>
          </div>

          {/* Priority & Estimated Minutes Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                <AlertTriangle size={14} /> Priority Level
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  backgroundColor: 'rgba(15, 23, 42, 0.9)',
                  border: '1px solid var(--border-glass)',
                  borderRadius: '6px',
                  color: 'var(--text-primary)',
                  fontSize: '0.85rem',
                  outline: 'none',
                }}
              >
                <option value="LOW">Low Priority</option>
                <option value="MEDIUM">Medium Priority</option>
                <option value="HIGH">High Priority</option>
                <option value="URGENT">Urgent (Exam Focus)</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                <Clock size={14} /> Estimated Focus
              </label>
              <select
                value={estimatedMinutes}
                onChange={(e) => setEstimatedMinutes(Number(e.target.value))}
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  backgroundColor: 'rgba(15, 23, 42, 0.9)',
                  border: '1px solid var(--border-glass)',
                  borderRadius: '6px',
                  color: 'var(--text-primary)',
                  fontSize: '0.85rem',
                  outline: 'none',
                }}
              >
                <option value={15}>15 mins (Quick Revision)</option>
                <option value={25}>25 mins (1 Pomodoro)</option>
                <option value={45}>45 mins</option>
                <option value={60}>60 mins (1 Hour)</option>
                <option value={90}>90 mins (Deep Session)</option>
                <option value={120}>120 mins (2 Hours)</option>
              </select>
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
              {isSubmitting ? 'Saving...' : taskToEdit ? 'Update Task' : 'Add to Schedule'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
