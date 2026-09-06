import React, { useState } from 'react';
import { StudyTask, CreateStudyTaskDto, WeeklyScheduleData, TaskPriority } from '@studentlife/shared';
import { TaskModal } from './TaskModal';
import {
  Plus,
  Clock,
  Calendar,
  CheckCircle2,
  Circle,
  Play,
  Trash2,
  Zap,
  Tag,
  ListTodo,
} from 'lucide-react';

interface StudyPlannerViewProps {
  tasks: StudyTask[];
  weeklySchedule: WeeklyScheduleData[];
  onToggleTask: (taskId: string) => Promise<void>;
  onCreateTask: (dto: CreateStudyTaskDto) => Promise<void>;
  onDeleteTask: (taskId: string) => Promise<void>;
  onStartFocusForTask: (taskTitle: string, durationMinutes: number) => void;
}

export const StudyPlannerView: React.FC<StudyPlannerViewProps> = ({
  tasks,
  weeklySchedule,
  onToggleTask,
  onCreateTask,
  onDeleteTask,
  onStartFocusForTask,
}) => {
  const [plannerTab, setPlannerTab] = useState<'DAILY_TIMELINE' | 'WEEKLY_MATRIX' | 'TASK_LIST'>('DAILY_TIMELINE');
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<StudyTask | null>(null);
  const [filterPriority, setFilterPriority] = useState<string>('ALL');
  const [xpToast, setXpToast] = useState<{ title: string; xp: number } | null>(null);

  const handleToggle = async (task: StudyTask) => {
    const isNowCompleting = task.status !== 'COMPLETED';
    await onToggleTask(task.id);
    if (isNowCompleting) {
      setXpToast({ title: task.title, xp: 15 });
      setTimeout(() => setXpToast(null), 3500);
    }
  };

  const todayStr = new Date().toISOString().split('T')[0];
  const todayTasks = tasks.filter((t) => t.dueDate === todayStr);
  const completedTodayCount = todayTasks.filter((t) => t.status === 'COMPLETED').length;
  const totalEstimatedMinutesToday = todayTasks.reduce((acc, curr) => acc + curr.estimatedMinutes, 0);

  const filteredTasks = tasks.filter((t) => {
    if (filterPriority !== 'ALL' && t.priority !== filterPriority) return false;
    return true;
  });

  const getPriorityBadge = (p: TaskPriority) => {
    switch (p) {
      case 'URGENT':
        return <span className="badge" style={{ backgroundColor: 'rgba(244, 63, 94, 0.2)', color: '#f87171', border: '1px solid rgba(244, 63, 94, 0.4)' }}>URGENT</span>;
      case 'HIGH':
        return <span className="badge" style={{ backgroundColor: 'rgba(245, 158, 11, 0.2)', color: '#fbbf24', border: '1px solid rgba(245, 158, 11, 0.4)' }}>HIGH</span>;
      case 'MEDIUM':
        return <span className="badge" style={{ backgroundColor: 'rgba(99, 102, 241, 0.2)', color: '#818cf8', border: '1px solid rgba(99, 102, 241, 0.4)' }}>MEDIUM</span>;
      case 'LOW':
        return <span className="badge" style={{ backgroundColor: 'rgba(148, 163, 184, 0.1)', color: '#94a3b8', border: '1px solid rgba(148, 163, 184, 0.3)' }}>LOW</span>;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Top Header Summary Banner */}
      <div className="glass-panel glow-hover" style={{ padding: '24px 32px', background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.85) 0%, rgba(15, 23, 42, 0.95) 100%)' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '20px' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span className="badge badge-completed">
                <CheckCircle2 size={12} /> PHASE 05 ACTIVE
              </span>
              <span className="badge badge-active">STUDY PLANNER & TIMERS ENGINE</span>
            </div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>
              Smart Study Planner & <span className="gradient-text">Time Blocking</span>
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
              Plan daily time-slots, manage subject tasks with priorities, and launch instant Pomodoro focus blocks.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => {
                setTaskToEdit(null);
                setIsTaskModalOpen(true);
              }}
              className="btn btn-primary"
              style={{ padding: '10px 18px', fontSize: '0.85rem' }}
            >
              <Plus size={16} /> Schedule Task
            </button>
          </div>
        </div>

        {/* Daily Metric Strip */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border-glass)' }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Tasks Due Today</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {todayTasks.length} Tasks
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Completed Today</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>
              {completedTodayCount} / {todayTasks.length} Completed
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Total Planned Focus</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent-secondary)' }}>
              {Math.floor(totalEstimatedMinutesToday / 60)}h {totalEstimatedMinutesToday % 60 > 0 ? `${totalEstimatedMinutesToday % 60}m` : ''}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Completion Rate</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent-purple)' }}>
              {todayTasks.length > 0 ? Math.round((completedTodayCount / todayTasks.length) * 100) : 100}%
            </div>
          </div>
        </div>
      </div>

      {/* Sub-view Navigation & Filters */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
        {/* Tab Switcher */}
        <div className="glass-pill" style={{ padding: '4px', display: 'flex', gap: '4px' }}>
          <button
            onClick={() => setPlannerTab('DAILY_TIMELINE')}
            style={{
              padding: '6px 14px',
              borderRadius: 'var(--radius-full)',
              border: 'none',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: plannerTab === 'DAILY_TIMELINE' ? 'var(--accent-primary)' : 'transparent',
              color: plannerTab === 'DAILY_TIMELINE' ? '#ffffff' : 'var(--text-secondary)',
            }}
          >
            <Clock size={14} /> Daily Timeline
          </button>
          <button
            onClick={() => setPlannerTab('WEEKLY_MATRIX')}
            style={{
              padding: '6px 14px',
              borderRadius: 'var(--radius-full)',
              border: 'none',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: plannerTab === 'WEEKLY_MATRIX' ? 'var(--accent-primary)' : 'transparent',
              color: plannerTab === 'WEEKLY_MATRIX' ? '#ffffff' : 'var(--text-secondary)',
            }}
          >
            <Calendar size={14} /> Weekly Strip
          </button>
          <button
            onClick={() => setPlannerTab('TASK_LIST')}
            style={{
              padding: '6px 14px',
              borderRadius: 'var(--radius-full)',
              border: 'none',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: plannerTab === 'TASK_LIST' ? 'var(--accent-primary)' : 'transparent',
              color: plannerTab === 'TASK_LIST' ? '#ffffff' : 'var(--text-secondary)',
            }}
          >
            <ListTodo size={14} /> Task Manager
          </button>
        </div>

        {/* Priority Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Priority:</span>
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            style={{
              padding: '6px 10px',
              backgroundColor: 'rgba(15, 23, 42, 0.8)',
              border: '1px solid var(--border-glass)',
              borderRadius: '6px',
              color: 'var(--text-primary)',
              fontSize: '0.75rem',
              outline: 'none',
            }}
          >
            <option value="ALL">All Priorities</option>
            <option value="URGENT">Urgent Only</option>
            <option value="HIGH">High Priority</option>
            <option value="MEDIUM">Medium Priority</option>
            <option value="LOW">Low Priority</option>
          </select>
        </div>
      </div>

      {/* VIEW 1: DAILY TIME-BLOCK TIMELINE */}
      {plannerTab === 'DAILY_TIMELINE' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Calendar size={16} /> Schedule for Today ({todayStr})
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {todayTasks.length === 0 ? (
              <div className="glass-panel" style={{ padding: '36px', textAlign: 'center', color: 'var(--text-muted)' }}>
                No study tasks scheduled for today. Click "+ Schedule Task" to block your study sessions.
              </div>
            ) : (
              todayTasks.map((task) => (
                <div
                  key={task.id}
                  className="glass-panel glow-hover"
                  style={{
                    padding: '16px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '16px',
                    borderLeft: `4px solid ${task.subjectColor || '#6366f1'}`,
                    opacity: task.status === 'COMPLETED' ? 0.65 : 1,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1 }}>
                    {/* Checkbox */}
                    <button
                      onClick={() => handleToggle(task)}
                      style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 0, color: task.status === 'COMPLETED' ? 'var(--accent-emerald)' : 'var(--text-muted)' }}
                    >
                      {task.status === 'COMPLETED' ? <CheckCircle2 size={22} /> : <Circle size={22} />}
                    </button>

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <span
                          style={{
                            fontSize: '0.95rem',
                            fontWeight: 700,
                            textDecoration: task.status === 'COMPLETED' ? 'line-through' : 'none',
                          }}
                        >
                          {task.title}
                        </span>
                        {getPriorityBadge(task.priority)}
                      </div>

                      {task.description && (
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                          {task.description}
                        </p>
                      )}

                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '6px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: task.subjectColor || '#818cf8', fontWeight: 600 }}>
                          <Tag size={12} /> {task.subjectName}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Clock size={12} /> {task.dueTime || 'Anytime'} ({task.estimatedMinutes}m)
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {task.status !== 'COMPLETED' && (
                      <button
                        onClick={() => onStartFocusForTask(task.title, task.estimatedMinutes)}
                        className="btn btn-secondary"
                        style={{ padding: '6px 12px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                      >
                        <Play size={13} color="var(--accent-secondary)" /> Focus Block
                      </button>
                    )}
                    <button
                      onClick={() => onDeleteTask(task.id)}
                      style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '6px' }}
                      title="Delete task"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* VIEW 2: WEEKLY STRIP MATRIX */}
      {plannerTab === 'WEEKLY_MATRIX' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px' }}>
          {weeklySchedule.map((day) => (
            <div
              key={day.dateStr}
              className="glass-panel glow-hover"
              style={{
                padding: '16px',
                border: day.isToday ? '1px solid var(--border-glow)' : '1px solid var(--border-glass)',
                backgroundColor: day.isToday ? 'rgba(99, 102, 241, 0.08)' : 'rgba(15, 23, 42, 0.7)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: day.isToday ? 'var(--accent-primary)' : 'var(--text-primary)' }}>
                  {day.dayName} {day.isToday && '(Today)'}
                </span>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                  {day.dateStr.split('-').slice(1).join('/')}
                </span>
              </div>

              <div style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '4px' }}>
                {day.totalTasks} <span style={{ fontSize: '0.75rem', fontWeight: 400, color: 'var(--text-muted)' }}>tasks</span>
              </div>

              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                {Math.floor(day.estimatedMinutes / 60)}h {day.estimatedMinutes % 60}m planned
              </div>

              {/* Day tasks snippet */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {day.tasks.slice(0, 3).map((t) => (
                  <div
                    key={t.id}
                    style={{
                      padding: '4px 6px',
                      borderRadius: '4px',
                      backgroundColor: 'rgba(0, 0, 0, 0.3)',
                      fontSize: '0.7rem',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      color: t.status === 'COMPLETED' ? 'var(--text-muted)' : 'var(--text-primary)',
                      borderLeft: `2px solid ${t.subjectColor || '#6366f1'}`,
                    }}
                  >
                    {t.title}
                  </div>
                ))}
                {day.tasks.length > 3 && (
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>+{day.tasks.length - 3} more</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* VIEW 3: ALL TASKS LIST */}
      {plannerTab === 'TASK_LIST' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {filteredTasks.map((task) => (
            <div
              key={task.id}
              className="glass-panel glow-hover"
              style={{
                padding: '14px 18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderLeft: `4px solid ${task.subjectColor || '#6366f1'}`,
                opacity: task.status === 'COMPLETED' ? 0.65 : 1,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <button
                  onClick={() => handleToggle(task)}
                  style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 0, color: task.status === 'COMPLETED' ? 'var(--accent-emerald)' : 'var(--text-muted)' }}
                >
                  {task.status === 'COMPLETED' ? <CheckCircle2 size={20} /> : <Circle size={20} />}
                </button>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '0.9rem', fontWeight: 700, textDecoration: task.status === 'COMPLETED' ? 'line-through' : 'none' }}>
                      {task.title}
                    </span>
                    {getPriorityBadge(task.priority)}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', gap: '10px', marginTop: '2px' }}>
                    <span>{task.subjectName}</span> &bull;
                    <span>Due: {task.dueDate} {task.dueTime}</span> &bull;
                    <span>{task.estimatedMinutes}m</span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => onDeleteTask(task.id)}
                  style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '6px' }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Task Creation Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        taskToEdit={taskToEdit}
        onSave={onCreateTask}
      />

      {/* XP Toast Notification */}
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
            <div style={{ fontWeight: 800, fontSize: '0.85rem' }}>Task Completed!</div>
            <div style={{ fontSize: '0.75rem', opacity: 0.9 }}>+{xpToast.xp} XP added to your scholar level</div>
          </div>
        </div>
      )}

    </div>
  );
};
