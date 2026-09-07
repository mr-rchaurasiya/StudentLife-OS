import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Swords,
  Clock,
  GitCommit,
  CheckCircle2,
  Share2,
  FileCode,
  Plus
} from 'lucide-react';
import { HackathonWarRoomState } from '@studentlife/shared';

interface HackathonWarRoomViewProps {
  onAddXp?: (xp: number, reason: string) => void;
}

export const HackathonWarRoomView: React.FC<HackathonWarRoomViewProps> = ({ onAddXp }) => {
  const [warRoomState, setWarRoomState] = useState<HackathonWarRoomState | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [taskTitle, setTaskTitle] = useState<string>('');
  const [assigneeName, setAssigneeName] = useState<string>('Aman C.');
  const [taskRole, setTaskRole] = useState<'FRONTEND' | 'BACKEND' | 'ML_AI' | 'DESIGN_PITCH'>('FRONTEND');
  const [isAddingTask, setIsAddingTask] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);

  useEffect(() => {
    fetchWarRoom();
  }, []);

  const fetchWarRoom = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/hackathon-war-room/state');
      const json = await res.json();
      if (json.success && json.data) {
        setWarRoomState(json.data);
      }
    } catch (err) {
      console.error('Failed to load war room state', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTask = async () => {
    if (!taskTitle.trim()) return;
    setIsAddingTask(true);
    try {
      const res = await fetch('/api/hackathon-war-room/task/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: taskTitle.trim(),
          assigneeName,
          role: taskRole,
        }),
      });
      const json = await res.json();
      if (json.success && json.data) {
        setWarRoomState(json.data);
        setTaskTitle('');
        onAddXp?.(20, `Logged Sprint Milestone: ${taskTitle}`);
      }
    } catch (err) {
      console.error('Failed to add sprint task', err);
    } finally {
      setIsAddingTask(false);
    }
  };

  const handleToggleTask = async (taskId: string) => {
    try {
      const res = await fetch('/api/hackathon-war-room/task/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskId }),
      });
      const json = await res.json();
      if (json.success && json.data) {
        setWarRoomState(json.data);
        onAddXp?.(40, 'Completed Sprint Deliverable & Pushed Git Commit');
      }
    } catch (err) {
      console.error('Failed to toggle task status', err);
    }
  };

  const handleExportDevpost = async () => {
    setIsExporting(true);
    try {
      const res = await fetch('/api/hackathon-war-room/devpost/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectName: 'AuraFlow AI: Distributed Student Focus Mesh',
          inspiration: 'Collegiate hackathons and engineering sprints require unified real-time telemetry and sub-second zero-latency collaboration.',
          howWeBuiltIt: 'Architected with React 18, Node.js TypeScript, Web Audio 40Hz Gamma modulator, and ONNX micro-inference.',
        }),
      });
      const json = await res.json();
      if (json.success && json.data) {
        setWarRoomState(json.data);
        onAddXp?.(50, 'Synthesized Devpost Hackathon Submission Package');
      }
    } catch (err) {
      console.error('Failed to export Devpost submission', err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1280px', margin: '0 auto', width: '100%' }}>
      {/* Header Banner */}
      <div className="glass-panel glow-hover" style={{
        padding: '24px 32px',
        background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(245, 158, 11, 0.1) 100%)',
        borderLeft: '4px solid #ef4444',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span className="badge badge-completed">
                <Swords size={13} /> PHASE 72: HACKATHON 24H WAR-ROOM
              </span>
              <span className="badge badge-active">LIVE SPRINT COMMAND HUB</span>
            </div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>
              Live Hackathon War-Room & <span className="gradient-text">Sprint Command Hub</span>
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
              Real-time 24-hour hackathon countdown, team task Kanban burndown, live simulated commit activity stream, and Devpost export.
            </p>
          </div>

          {warRoomState && (
            <div style={{ display: 'flex', gap: '12px' }}>
              <div className="glass-panel" style={{ padding: '12px 20px', backgroundColor: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
                <div style={{ fontSize: '0.75rem', color: '#f87171', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                  <Clock size={13} /> Hackathon Clock
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff', marginTop: '2px' }}>
                  {warRoomState.hoursRemaining}h left
                </div>
              </div>

              <div className="glass-panel" style={{ padding: '12px 20px', backgroundColor: 'rgba(245, 158, 11, 0.15)', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
                <div style={{ fontSize: '0.75rem', color: '#fbbf24', fontWeight: 600 }}>Team Sprint XP</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff', marginTop: '2px' }}>
                  +{warRoomState.totalTeamXp} XP
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
          Syncing with Hackathon War-Room Telemetry Node...
        </div>
      ) : warRoomState ? (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '20px' }}>
          {/* Left Column: Task Kanban & Devpost Generator */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Task Board */}
            <div className="glass-panel" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={18} color="#34d399" /> Sprint Deliverables & Action Items ({warRoomState.tasks.length})
                </h3>
                <span className="badge badge-active">24h Sprint Active</span>
              </div>

              {/* Add Task Form */}
              <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
                <input
                  type="text"
                  placeholder="e.g. Implement WebRTC voice room or Redis caching..."
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  style={{
                    flex: 2,
                    minWidth: '220px',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    backgroundColor: 'rgba(15, 23, 42, 0.8)',
                    border: '1px solid var(--border-glass)',
                    color: '#fff',
                    fontSize: '0.85rem',
                  }}
                />
                <input
                  type="text"
                  value={assigneeName}
                  onChange={(e) => setAssigneeName(e.target.value)}
                  placeholder="Assignee name..."
                  style={{
                    flex: 1,
                    minWidth: '130px',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    backgroundColor: 'rgba(15, 23, 42, 0.8)',
                    border: '1px solid var(--border-glass)',
                    color: '#fff',
                    fontSize: '0.85rem',
                  }}
                />
                <select
                  value={taskRole}
                  onChange={(e) => setTaskRole(e.target.value as any)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '6px',
                    backgroundColor: 'rgba(15, 23, 42, 0.8)',
                    border: '1px solid var(--border-glass)',
                    color: '#fff',
                    fontSize: '0.85rem',
                  }}
                >
                  <option value="FRONTEND">Frontend (UI/PWA)</option>
                  <option value="BACKEND">Backend (API/DB)</option>
                  <option value="ML_AI">ML / Edge AI</option>
                  <option value="DESIGN_PITCH">Design & Pitch</option>
                </select>
                <button
                  className="btn btn-primary"
                  onClick={handleAddTask}
                  disabled={isAddingTask || !taskTitle.trim()}
                  style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem' }}
                >
                  <Plus size={14} /> Add Sprint Task
                </button>
              </div>

              {/* Task Items */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {warRoomState.tasks.map((task) => (
                  <div
                    key={task.id}
                    style={{
                      padding: '14px 16px',
                      borderRadius: '10px',
                      backgroundColor: 'rgba(15, 23, 42, 0.7)',
                      border: '1px solid var(--border-glass)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: '12px',
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#fff', marginBottom: '4px' }}>
                        {task.title}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                        <span>👤 {task.assigneeName}</span>
                        <span>•</span>
                        <span className="badge" style={{ fontSize: '0.65rem' }}>{task.role}</span>
                        <span>•</span>
                        <span>⏱️ ~{task.estimatedHours} hrs</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleToggleTask(task.id)}
                      className="btn"
                      style={{
                        padding: '6px 12px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        backgroundColor: task.status === 'DONE' ? 'rgba(16, 185, 129, 0.2)' : task.status === 'IN_PROGRESS' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(15, 23, 42, 0.8)',
                        color: task.status === 'DONE' ? '#34d399' : task.status === 'IN_PROGRESS' ? '#fbbf24' : 'var(--text-secondary)',
                        border: '1px solid var(--border-glass)',
                      }}
                    >
                      {task.status === 'DONE' ? '✓ DONE' : task.status === 'IN_PROGRESS' ? '⚙️ IN PROGRESS' : '○ TO DO'}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Devpost Markdown Exporter */}
            <div className="glass-panel" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Share2 size={16} color="#fbbf24" /> Devpost / Submission Story Synthesizer
                </h3>
                <button
                  className="btn btn-secondary"
                  onClick={handleExportDevpost}
                  disabled={isExporting}
                  style={{ fontSize: '0.75rem', padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  <Sparkles size={13} /> Re-Synthesize Devpost Story
                </button>
              </div>
              <pre style={{
                padding: '16px',
                borderRadius: '8px',
                backgroundColor: 'rgba(15, 23, 42, 0.7)',
                border: '1px solid var(--border-glass)',
                fontSize: '0.8rem',
                lineHeight: 1.6,
                color: '#94a3b8',
                whiteSpace: 'pre-wrap',
                fontFamily: 'var(--font-mono)',
                margin: 0,
              }}>
                {warRoomState.devpostDraftMarkdown}
              </pre>
            </div>
          </div>

          {/* Right Column: Live Git Commit Telemetry Stream */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="glass-panel" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <GitCommit size={16} color="#38bdf8" /> Live Commit Stream
                </h3>
                <span className="badge badge-active">Branch: main</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {warRoomState.commits.map((c) => (
                  <div
                    key={c.id}
                    style={{
                      padding: '14px',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(15, 23, 42, 0.6)',
                      border: '1px solid var(--border-glass)',
                      borderLeft: '3px solid #38bdf8',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.8rem', color: '#38bdf8' }}>
                        {c.author}
                      </span>
                      <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                        {new Date(c.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <div style={{ fontSize: '0.8rem', color: '#e2e8f0', marginBottom: '6px', fontFamily: 'var(--font-mono)' }}>
                      {c.commitMessage}
                    </div>

                    <div style={{ fontSize: '0.7rem', color: '#34d399', fontWeight: 600 }}>
                      +{c.linesAdded} lines committed
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick War-Room Advice */}
            <div className="glass-panel" style={{ padding: '20px' }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <FileCode size={15} color="#fbbf24" /> 24h Hackathon Pro-Tips
              </h4>
              <ul style={{ paddingLeft: '16px', margin: 0, fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                <li>🎯 <strong>Hour 0–4</strong>: Lock minimal schema & contracts</li>
                <li>⚡ <strong>Hour 4–16</strong>: Zero-distraction core logic coding</li>
                <li>🎨 <strong>Hour 16–20</strong>: UI Polish & Loom video recording</li>
                <li>📝 <strong>Hour 20–24</strong>: Devpost writeup & submission freeze</li>
              </ul>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};
