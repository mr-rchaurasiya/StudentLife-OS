import React, { useState, useEffect } from 'react';
import {
  DeadlineItem,
  DeadlineCategory,
  DeadlinePriority,
  NotificationChannelPreference,
  NotificationAlertLog,
  DeadlineStatsSummary,
  CreateDeadlineDto,
  NotificationChannelType
} from '@studentlife/shared';

interface DeadlineAlertsViewProps {
  onAddXp?: (xp: number, reason: string) => void;
}

export const DeadlineAlertsView: React.FC<DeadlineAlertsViewProps> = ({ onAddXp }) => {
  const [deadlines, setDeadlines] = useState<DeadlineItem[]>([]);
  const [stats, setStats] = useState<DeadlineStatsSummary | null>(null);
  const [preferences, setPreferences] = useState<NotificationChannelPreference[]>([]);
  const [alertLogs, setAlertLogs] = useState<NotificationAlertLog[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedPriority, setSelectedPriority] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showPreferencesDrawer, setShowPreferencesDrawer] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  // New Deadline Form State
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<DeadlineCategory>('EXAM_FORM');
  const [newDueDate, setNewDueDate] = useState('');
  const [newDueTime, setNewDueTime] = useState('23:59 IST');
  const [newPriority, setNewPriority] = useState<DeadlinePriority>('HIGH');
  const [newOrg, setNewOrg] = useState('');
  const [newPortalUrl, setNewPortalUrl] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newTags, setNewTags] = useState('Academic, Target 2026');
  const [newChannels, setNewChannels] = useState<NotificationChannelType[]>(['PUSH', 'EMAIL']);
  const [newLeadDays, setNewLeadDays] = useState<number[]>([7, 3, 1]);

  useEffect(() => {
    fetchDeadlines();
    fetchPreferences();
    fetchLogs();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const fetchDeadlines = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/deadlines');
      if (res.ok) {
        const json = await res.json();
        if (json.data) {
          setDeadlines(json.data.deadlines || []);
          setStats(json.data.stats || null);
        }
      }
    } catch {
      // Fallback local mock
    }
  };

  const fetchPreferences = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/deadlines/preferences');
      if (res.ok) {
        const json = await res.json();
        if (json.data) setPreferences(json.data);
      }
    } catch {
      // Silent catch
    }
  };

  const fetchLogs = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/deadlines/notifications');
      if (res.ok) {
        const json = await res.json();
        if (json.data) setAlertLogs(json.data);
      }
    } catch {
      // Silent catch
    }
  };

  const toggleDeadline = async (id: string) => {
    try {
      const res = await fetch(`http://localhost:5000/api/deadlines/${id}/toggle`, {
        method: 'PATCH'
      });
      if (res.ok) {
        const json = await res.json();
        const updated: DeadlineItem = json.data;
        setDeadlines(prev => prev.map(d => d.id === id ? updated : d));
        if (updated.isCompleted) {
          showToast('🎉 Milestone Completed! +15 XP Awarded 🔥');
          if (onAddXp) onAddXp(15, `Completed Deadline: ${updated.title}`);
        } else {
          showToast('Deadline restored to active queue.');
        }
        // Refresh stats
        fetchDeadlines();
      }
    } catch {
      // Offline toggle
      setDeadlines(prev => prev.map(d => d.id === id ? { ...d, isCompleted: !d.isCompleted } : d));
    }
  };

  const handleCreateDeadline = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDueDate) {
      showToast('⚠️ Please provide a deadline title and due date.');
      return;
    }

    const payload: CreateDeadlineDto = {
      title: newTitle.trim(),
      category: newCategory,
      dueDate: new Date(newDueDate).toISOString(),
      dueTime: newDueTime.trim() || '23:59 IST',
      priority: newPriority,
      organization: newOrg.trim() || 'Academic Institution',
      portalUrl: newPortalUrl.trim() || undefined,
      description: newDescription.trim() || 'Timely submission required.',
      tags: newTags.split(',').map(t => t.trim()).filter(Boolean),
      reminderChannels: newChannels,
      leadTimeDays: newLeadDays
    };

    try {
      const res = await fetch('http://localhost:5000/api/deadlines', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const json = await res.json();
        setDeadlines(prev => [json.data, ...prev]);
        setShowAddModal(false);
        // Reset form
        setNewTitle('');
        setNewOrg('');
        setNewPortalUrl('');
        setNewDescription('');
        showToast('✅ Deadline Scheduled with Active Smart Alerts! +20 XP 🔥');
        if (onAddXp) onAddXp(20, 'Scheduled New Academic Deadline');
        fetchDeadlines();
      }
    } catch {
      showToast('❌ Failed to schedule deadline. Server unreachable.');
    }
  };

  const handleToggleChannel = async (channel: string) => {
    try {
      const res = await fetch('http://localhost:5000/api/deadlines/preferences/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ channel })
      });
      if (res.ok) {
        const json = await res.json();
        setPreferences(json.data);
        showToast(`🔔 Notification settings updated for ${channel}`);
      }
    } catch {
      // Local toggle
      setPreferences(prev => prev.map(p => p.channel === channel ? { ...p, enabled: !p.enabled } : p));
    }
  };

  const handleTestTrigger = async (channel: string) => {
    try {
      const res = await fetch('http://localhost:5000/api/deadlines/notifications/test-trigger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ channel })
      });
      if (res.ok) {
        const json = await res.json();
        setAlertLogs(prev => [json.data, ...prev]);
        showToast(`⚡ Test Alert Dispatched via ${channel}!`);
      }
    } catch {
      showToast(`⚡ Test notification simulated via ${channel}`);
    }
  };

  const handleExportIcs = () => {
    window.open('http://localhost:5000/api/deadlines/export/ics', '_blank');
    showToast('📥 Downloading .ICS Calendar with configured alarms!');
  };

  const getGoogleCalendarUrl = (item: DeadlineItem) => {
    const due = new Date(item.dueDate);
    const startStr = due.toISOString().replace(/-|:|\.\d\d\d/g, '');
    const endStr = new Date(due.getTime() + 60 * 60 * 1000).toISOString().replace(/-|:|\.\d\d\d/g, '');
    const title = encodeURIComponent(`[StudentLife OS] ${item.title}`);
    const details = encodeURIComponent(`${item.description}\n\nPortal: ${item.portalUrl || 'N/A'}\nPriority: ${item.priority}`);
    const location = encodeURIComponent(item.organization);

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startStr}/${endStr}&details=${details}&location=${location}`;
  };

  // Filtered Deadlines
  const filteredDeadlines = deadlines.filter(d => {
    const matchesCategory = selectedCategory === 'ALL' || d.category === selectedCategory;
    const matchesPriority = selectedPriority === 'ALL' || d.priority === selectedPriority;
    const matchesSearch =
      d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.organization.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesPriority && matchesSearch;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          top: '24px',
          right: '24px',
          zIndex: 9999,
          background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.95), rgba(220, 38, 38, 0.95))',
          color: '#fff',
          padding: '12px 24px',
          borderRadius: '12px',
          boxShadow: '0 8px 32px rgba(239, 68, 68, 0.4)',
          fontWeight: '600',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          animation: 'fadeIn 0.3s ease'
        }}>
          {toastMessage}
        </div>
      )}

      {/* Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.85) 0%, rgba(15, 23, 42, 0.95) 100%)',
        border: '1px solid rgba(239, 68, 68, 0.25)',
        borderRadius: '20px',
        padding: '2rem',
        boxShadow: '0 12px 40px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(16px)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1.5rem'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '2rem' }}>⏰</span>
            <h1 style={{ margin: 0, fontSize: '1.85rem', fontWeight: '800', background: 'linear-gradient(135deg, #fff 0%, #cbd5e1 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Deadlines & Smart Notification Engine
            </h1>
            <span style={{
              background: 'rgba(239, 68, 68, 0.15)',
              color: '#f87171',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              padding: '4px 10px',
              borderRadius: '20px',
              fontSize: '0.75rem',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              Zero Miss Guarantee
            </span>
          </div>
          <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.95rem', maxWidth: '720px', lineHeight: '1.5' }}>
            Proactive countdown telemetry for exam registrations, scholarship cutoffs, fee payments, and priority internship applications with multi-channel push, email, and calendar synchronization.
          </p>
        </div>

        {/* Global Action Buttons */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => setShowAddModal(true)}
            style={{
              background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
              color: '#fff',
              border: 'none',
              padding: '10px 18px',
              borderRadius: '10px',
              fontWeight: '700',
              cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(239, 68, 68, 0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'transform 0.2s ease'
            }}
          >
            <span>➕</span> Schedule Deadline
          </button>

          <button
            onClick={handleExportIcs}
            style={{
              background: 'rgba(59, 130, 246, 0.15)',
              color: '#60a5fa',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              padding: '10px 16px',
              borderRadius: '10px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <span>📥</span> Export .ICS
          </button>

          <button
            onClick={() => setShowPreferencesDrawer(!showPreferencesDrawer)}
            style={{
              background: 'rgba(255, 255, 255, 0.06)',
              color: '#cbd5e1',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              padding: '10px 16px',
              borderRadius: '10px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <span>⚙️</span> Channels ({preferences.filter(p => p.enabled).length})
          </button>
        </div>
      </div>

      {/* 4-Metric Telemetry Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '1rem'
      }}>
        {/* Urgent (< 7d) */}
        <div style={{
          background: 'rgba(30, 41, 59, 0.7)',
          border: '1px solid rgba(239, 68, 68, 0.35)',
          borderRadius: '16px',
          padding: '1.25rem',
          backdropFilter: 'blur(12px)',
          boxShadow: '0 8px 24px rgba(239, 68, 68, 0.12)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.4rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#f87171', fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              🔴 Urgent Deadlines
            </span>
            <span style={{ fontSize: '1.25rem' }}>⚡</span>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '800', color: '#fca5a5' }}>
            {stats ? stats.urgentCount : 3}
          </div>
          <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
            Due within next 7 days • High Action Required
          </div>
        </div>

        {/* Upcoming (7 - 30d) */}
        <div style={{
          background: 'rgba(30, 41, 59, 0.7)',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          borderRadius: '16px',
          padding: '1.25rem',
          backdropFilter: 'blur(12px)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.4rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#fbbf24', fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              🟡 Upcoming (7–30d)
            </span>
            <span style={{ fontSize: '1.25rem' }}>⏳</span>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '800', color: '#fde68a' }}>
            {stats ? stats.upcomingCount : 2}
          </div>
          <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
            Documents & draft preparation window
          </div>
        </div>

        {/* Active Alert Channels */}
        <div style={{
          background: 'rgba(30, 41, 59, 0.7)',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          borderRadius: '16px',
          padding: '1.25rem',
          backdropFilter: 'blur(12px)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.4rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#60a5fa', fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              🔔 Notification Pipeline
            </span>
            <span style={{ fontSize: '1.25rem' }}>📱</span>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '800', color: '#93c5fd' }}>
            {preferences.filter(p => p.enabled).length} / 4
          </div>
          <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
            Web Push, Email, iCal Sync Active
          </div>
        </div>

        {/* Completed */}
        <div style={{
          background: 'rgba(30, 41, 59, 0.7)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          borderRadius: '16px',
          padding: '1.25rem',
          backdropFilter: 'blur(12px)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.4rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#34d399', fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              🏆 Completed
            </span>
            <span style={{ fontSize: '1.25rem' }}>✅</span>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '800', color: '#6ee7b7' }}>
            {stats ? stats.completedCount : 1}
          </div>
          <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
            Zero late penalties recorded
          </div>
        </div>
      </div>

      {/* Notification Preferences Drawer (Expandable) */}
      {showPreferencesDrawer && (
        <div style={{
          background: 'rgba(15, 23, 42, 0.95)',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          borderRadius: '16px',
          padding: '1.5rem',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 12px 32px rgba(0, 0, 0, 0.5)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem',
          animation: 'fadeIn 0.2s ease'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#f8fafc', fontWeight: '700' }}>
                ⚙️ Smart Notification Channels & Dispatch Rules
              </h3>
              <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: '#94a3b8' }}>
                Configure where StudentLife OS sends countdown alerts and reminder lead-times.
              </p>
            </div>
            <button
              onClick={() => setShowPreferencesDrawer(false)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#94a3b8',
                fontSize: '1.25rem',
                cursor: 'pointer'
              }}
            >
              ✕
            </button>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1rem'
          }}>
            {preferences.map(pref => (
              <div
                key={pref.channel}
                style={{
                  background: 'rgba(30, 41, 59, 0.6)',
                  border: pref.enabled ? '1px solid rgba(59, 130, 246, 0.4)' : '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '12px',
                  padding: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: '700', color: pref.enabled ? '#60a5fa' : '#94a3b8', fontSize: '0.9rem' }}>
                    {pref.channel === 'PUSH' && '📱 Web Browser Push'}
                    {pref.channel === 'EMAIL' && '📧 Email Digest'}
                    {pref.channel === 'CALENDAR_SYNC' && '📅 iCal / Google Calendar Sync'}
                    {pref.channel === 'SMS' && '💬 Direct SMS Alerts'}
                  </span>
                  <input
                    type="checkbox"
                    checked={pref.enabled}
                    onChange={() => handleToggleChannel(pref.channel)}
                    style={{ width: '18px', height: '18px', accentColor: '#3b82f6', cursor: 'pointer' }}
                  />
                </div>
                <div style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>
                  {pref.destination}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                  {pref.description}
                </div>
                <div style={{ marginTop: 'auto', paddingTop: '0.5rem' }}>
                  <button
                    onClick={() => handleTestTrigger(pref.channel)}
                    style={{
                      background: 'rgba(255, 255, 255, 0.06)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: '#cbd5e1',
                      borderRadius: '6px',
                      padding: '4px 10px',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    ⚡ Test Trigger
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Recent Dispatched Alert Logs */}
          <div style={{ marginTop: '0.5rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '1rem' }}>
            <h4 style={{ margin: '0 0 0.5rem', fontSize: '0.9rem', color: '#cbd5e1' }}>
              📡 Recent Alert Dispatch History
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {alertLogs.slice(0, 3).map(log => (
                <div
                  key={log.id}
                  style={{
                    background: 'rgba(30, 41, 59, 0.4)',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '0.8rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ color: log.urgency === 'URGENT' ? '#f87171' : '#60a5fa' }}>●</span>
                    <span style={{ fontWeight: '600', color: '#f1f5f9' }}>{log.title}</span>
                    <span style={{ color: '#64748b' }}>• {log.message}</span>
                  </div>
                  <span style={{ color: '#64748b', fontSize: '0.75rem' }}>
                    {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Filtering & Search Controls */}
      <div style={{
        background: 'rgba(30, 41, 59, 0.6)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '16px',
        padding: '1.25rem',
        backdropFilter: 'blur(12px)',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '1rem',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {/* Category Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '2px', maxWidth: '100%' }}>
          {[
            { id: 'ALL', label: 'All Deadlines' },
            { id: 'EXAM_FORM', label: '📝 Exam Forms' },
            { id: 'SCHOLARSHIP_CUTOFF', label: '🎓 Scholarships' },
            { id: 'INTERNSHIP_DEADLINE', label: '💼 Internships' },
            { id: 'FEE_PAYMENT', label: '💵 Fee Payment' },
            { id: 'ASSIGNMENT', label: '📋 Coursework' },
            { id: 'COMPETITIVE_REGISTRATION', label: '🏛️ National/Civil' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedCategory(tab.id)}
              style={{
                background: selectedCategory === tab.id ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' : 'rgba(255, 255, 255, 0.05)',
                color: selectedCategory === tab.id ? '#fff' : '#94a3b8',
                border: selectedCategory === tab.id ? '1px solid #ef4444' : '1px solid rgba(255, 255, 255, 0.08)',
                padding: '8px 14px',
                borderRadius: '10px',
                fontSize: '0.85rem',
                fontWeight: '600',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Priority & Search Filters */}
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            style={{
              background: 'rgba(15, 23, 42, 0.8)',
              color: '#cbd5e1',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              padding: '8px 12px',
              borderRadius: '8px',
              fontSize: '0.85rem',
              cursor: 'pointer'
            }}
          >
            <option value="ALL">All Priorities</option>
            <option value="URGENT">🔴 Urgent Only</option>
            <option value="HIGH">🟠 High Priority</option>
            <option value="MEDIUM">🟡 Medium Priority</option>
          </select>

          <input
            type="text"
            placeholder="🔍 Search deadlines, exam, org..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              background: 'rgba(15, 23, 42, 0.8)',
              color: '#fff',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              padding: '8px 14px',
              borderRadius: '8px',
              fontSize: '0.85rem',
              width: '240px'
            }}
          />
        </div>
      </div>

      {/* Deadlines Cockpit Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(420px, 1fr))',
        gap: '1.25rem'
      }}>
        {filteredDeadlines.map(item => {
          const isUrgent = item.daysRemaining <= 7 && !item.isCompleted;
          const isPending = !item.isCompleted;

          return (
            <div
              key={item.id}
              style={{
                background: item.isCompleted
                  ? 'rgba(30, 41, 59, 0.4)'
                  : isUrgent
                    ? 'linear-gradient(135deg, rgba(30, 41, 59, 0.85) 0%, rgba(45, 20, 20, 0.75) 100%)'
                    : 'rgba(30, 41, 59, 0.7)',
                border: item.isCompleted
                  ? '1px solid rgba(16, 185, 129, 0.3)'
                  : isUrgent
                    ? '1px solid rgba(239, 68, 68, 0.4)'
                    : '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '18px',
                padding: '1.5rem',
                backdropFilter: 'blur(16px)',
                boxShadow: isUrgent ? '0 8px 32px rgba(239, 68, 68, 0.15)' : '0 8px 24px rgba(0, 0, 0, 0.25)',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                opacity: item.isCompleted ? 0.75 : 1,
                transition: 'all 0.2s ease'
              }}
            >
              {/* Card Header: Category & Countdown Badge */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                    <span style={{
                      background: 'rgba(255, 255, 255, 0.08)',
                      color: '#94a3b8',
                      padding: '3px 8px',
                      borderRadius: '6px',
                      fontSize: '0.72rem',
                      fontWeight: '700',
                      textTransform: 'uppercase'
                    }}>
                      {item.category.replace(/_/g, ' ')}
                    </span>
                    <span style={{
                      background: item.priority === 'URGENT' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                      color: item.priority === 'URGENT' ? '#f87171' : '#fbbf24',
                      padding: '3px 8px',
                      borderRadius: '6px',
                      fontSize: '0.72rem',
                      fontWeight: '700'
                    }}>
                      {item.priority}
                    </span>
                  </div>
                  <h3 style={{
                    margin: 0,
                    fontSize: '1.15rem',
                    fontWeight: '700',
                    color: item.isCompleted ? '#94a3b8' : '#f8fafc',
                    textDecoration: item.isCompleted ? 'line-through' : 'none',
                    lineHeight: '1.4'
                  }}>
                    {item.title}
                  </h3>
                  <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                    🏛️ {item.organization}
                  </span>
                </div>

                {/* Live Countdown Clock Badge */}
                <div style={{
                  background: item.isCompleted
                    ? 'rgba(16, 185, 129, 0.15)'
                    : isUrgent
                      ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.25) 0%, rgba(220, 38, 38, 0.35) 100%)'
                      : 'rgba(245, 158, 11, 0.15)',
                  border: item.isCompleted
                    ? '1px solid rgba(16, 185, 129, 0.4)'
                    : isUrgent
                      ? '1px solid rgba(239, 68, 68, 0.5)'
                      : '1px solid rgba(245, 158, 11, 0.4)',
                  padding: '8px 12px',
                  borderRadius: '12px',
                  textAlign: 'center',
                  minWidth: '100px'
                }}>
                  {item.isCompleted ? (
                    <div style={{ color: '#34d399', fontWeight: '800', fontSize: '0.85rem' }}>
                      ✅ Done
                    </div>
                  ) : (
                    <>
                      <div style={{
                        fontSize: '1.2rem',
                        fontWeight: '800',
                        color: isUrgent ? '#fca5a5' : '#fde68a',
                        lineHeight: '1.1'
                      }}>
                        {item.daysRemaining}d Left
                      </div>
                      <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '2px' }}>
                        {item.dueTime || '23:59 IST'}
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Description */}
              <p style={{
                margin: 0,
                fontSize: '0.85rem',
                color: '#cbd5e1',
                lineHeight: '1.5'
              }}>
                {item.description}
              </p>

              {/* Tags */}
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {item.tags.map(tag => (
                  <span
                    key={tag}
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      color: '#94a3b8',
                      padding: '2px 8px',
                      borderRadius: '6px',
                      fontSize: '0.75rem'
                    }}
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Lead-Time Alarms & Channels */}
              <div style={{
                background: 'rgba(15, 23, 42, 0.6)',
                padding: '8px 12px',
                borderRadius: '10px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '0.75rem',
                color: '#94a3b8'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>🔔 Alerts at:</span>
                  {item.leadTimeDays.map(days => (
                    <span
                      key={days}
                      style={{
                        background: 'rgba(59, 130, 246, 0.15)',
                        color: '#93c5fd',
                        padding: '1px 6px',
                        borderRadius: '4px',
                        fontWeight: '600'
                      }}
                    >
                      {days}d
                    </span>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {item.reminderChannels.includes('PUSH') && <span title="Web Push Active">📱</span>}
                  {item.reminderChannels.includes('EMAIL') && <span title="Email Alerts Active">📧</span>}
                  {item.reminderChannels.includes('CALENDAR_SYNC') && <span title="Calendar Sync Active">📅</span>}
                </div>
              </div>

              {/* Actions Footer */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                paddingTop: '0.75rem',
                marginTop: 'auto'
              }}>
                {/* Completion Checkbox */}
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  color: item.isCompleted ? '#34d399' : '#cbd5e1'
                }}>
                  <input
                    type="checkbox"
                    checked={item.isCompleted}
                    onChange={() => toggleDeadline(item.id)}
                    style={{ width: '18px', height: '18px', accentColor: '#10b981', cursor: 'pointer' }}
                  />
                  {item.isCompleted ? 'Completed (+15 XP)' : 'Mark Completed'}
                </label>

                {/* Right Action Links */}
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  {isPending && (
                    <a
                      href={getGoogleCalendarUrl(item)}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        background: 'rgba(255, 255, 255, 0.06)',
                        color: '#94a3b8',
                        padding: '6px 10px',
                        borderRadius: '8px',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                      title="Sync to Google Calendar"
                    >
                      <span>📅</span> Sync
                    </a>
                  )}

                  {item.portalUrl && (
                    <a
                      href={item.portalUrl}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                        color: '#fff',
                        padding: '6px 12px',
                        borderRadius: '8px',
                        fontSize: '0.8rem',
                        fontWeight: '700',
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <span>🔗</span> Open Portal
                    </a>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Schedule Deadline Modal */}
      {showAddModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 9999,
          padding: '1rem'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
            border: '1px solid rgba(239, 68, 68, 0.4)',
            borderRadius: '20px',
            padding: '2rem',
            width: '100%',
            maxWidth: '560px',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.6)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.5rem' }}>⏰</span>
                <h2 style={{ margin: 0, fontSize: '1.35rem', color: '#fff', fontWeight: '800' }}>
                  Schedule Academic Deadline
                </h2>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#94a3b8',
                  fontSize: '1.5rem',
                  cursor: 'pointer'
                }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateDeadline} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '4px', fontWeight: '600' }}>
                  Deadline Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., GATE 2027 Application Form"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'rgba(15, 23, 42, 0.8)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '8px',
                    padding: '10px 12px',
                    color: '#fff',
                    fontSize: '0.9rem',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '4px', fontWeight: '600' }}>
                    Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as DeadlineCategory)}
                    style={{
                      width: '100%',
                      background: 'rgba(15, 23, 42, 0.8)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      borderRadius: '8px',
                      padding: '10px 12px',
                      color: '#fff',
                      fontSize: '0.9rem'
                    }}
                  >
                    <option value="EXAM_FORM">📝 Exam Form</option>
                    <option value="SCHOLARSHIP_CUTOFF">🎓 Scholarship Cutoff</option>
                    <option value="INTERNSHIP_DEADLINE">💼 Internship Deadline</option>
                    <option value="FEE_PAYMENT">💵 Fee Payment</option>
                    <option value="ASSIGNMENT">📋 Assignment/Project</option>
                    <option value="COMPETITIVE_REGISTRATION">🏛️ Competitive/Civil</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '4px', fontWeight: '600' }}>
                    Priority
                  </label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as DeadlinePriority)}
                    style={{
                      width: '100%',
                      background: 'rgba(15, 23, 42, 0.8)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      borderRadius: '8px',
                      padding: '10px 12px',
                      color: '#fff',
                      fontSize: '0.9rem'
                    }}
                  >
                    <option value="URGENT">🔴 Urgent (&lt; 7 days)</option>
                    <option value="HIGH">🟠 High Priority</option>
                    <option value="MEDIUM">🟡 Medium Priority</option>
                    <option value="LOW">🟢 Low Priority</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '4px', fontWeight: '600' }}>
                    Due Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                    style={{
                      width: '100%',
                      background: 'rgba(15, 23, 42, 0.8)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      borderRadius: '8px',
                      padding: '10px 12px',
                      color: '#fff',
                      fontSize: '0.9rem',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '4px', fontWeight: '600' }}>
                    Due Time
                  </label>
                  <input
                    type="text"
                    placeholder="23:59 IST"
                    value={newDueTime}
                    onChange={(e) => setNewDueTime(e.target.value)}
                    style={{
                      width: '100%',
                      background: 'rgba(15, 23, 42, 0.8)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      borderRadius: '8px',
                      padding: '10px 12px',
                      color: '#fff',
                      fontSize: '0.9rem',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '4px', fontWeight: '600' }}>
                    Organization / Authority
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. IIT Roorkee / NTA"
                    value={newOrg}
                    onChange={(e) => setNewOrg(e.target.value)}
                    style={{
                      width: '100%',
                      background: 'rgba(15, 23, 42, 0.8)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      borderRadius: '8px',
                      padding: '10px 12px',
                      color: '#fff',
                      fontSize: '0.9rem',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '4px', fontWeight: '600' }}>
                    Official Portal URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://portal.ac.in"
                    value={newPortalUrl}
                    onChange={(e) => setNewPortalUrl(e.target.value)}
                    style={{
                      width: '100%',
                      background: 'rgba(15, 23, 42, 0.8)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      borderRadius: '8px',
                      padding: '10px 12px',
                      color: '#fff',
                      fontSize: '0.9rem',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '4px', fontWeight: '600' }}>
                  Submission Notes / Requirements
                </label>
                <textarea
                  rows={2}
                  placeholder="Key documents, payment steps, or photo guidelines..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'rgba(15, 23, 42, 0.8)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    color: '#fff',
                    fontSize: '0.85rem',
                    boxSizing: 'border-box',
                    resize: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '4px', fontWeight: '600' }}>
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. National Exam, GATE CSE, IIT Admission"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'rgba(15, 23, 42, 0.8)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    color: '#fff',
                    fontSize: '0.85rem',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '6px', fontWeight: '600' }}>
                  Active Notification Channels
                </label>
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  {(['PUSH', 'EMAIL', 'CALENDAR_SYNC', 'SMS'] as NotificationChannelType[]).map(ch => (
                    <label key={ch} style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#cbd5e1', fontSize: '0.8rem', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={newChannels.includes(ch)}
                        onChange={(e) => {
                          if (e.target.checked) setNewChannels([...newChannels, ch]);
                          else setNewChannels(newChannels.filter(x => x !== ch));
                        }}
                        style={{ accentColor: '#3b82f6' }}
                      />
                      {ch === 'PUSH' ? '📱 Push' : ch === 'EMAIL' ? '📧 Email' : ch === 'CALENDAR_SYNC' ? '📅 iCal' : '💬 SMS'}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '6px', fontWeight: '600' }}>
                  Smart Lead-Time Alarms
                </label>
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  {[14, 7, 3, 1].map(d => (
                    <label key={d} style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#cbd5e1', fontSize: '0.8rem', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={newLeadDays.includes(d)}
                        onChange={(e) => {
                          if (e.target.checked) setNewLeadDays([...newLeadDays, d]);
                          else setNewLeadDays(newLeadDays.filter(x => x !== d));
                        }}
                        style={{ accentColor: '#ef4444' }}
                      />
                      {d} days before
                    </label>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  style={{
                    flex: 1,
                    background: 'rgba(255, 255, 255, 0.08)',
                    color: '#cbd5e1',
                    border: 'none',
                    padding: '12px',
                    borderRadius: '10px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  style={{
                    flex: 2,
                    background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                    color: '#fff',
                    border: 'none',
                    padding: '12px',
                    borderRadius: '10px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    boxShadow: '0 4px 16px rgba(239, 68, 68, 0.4)'
                  }}
                >
                  Confirm & Schedule (+20 XP)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeadlineAlertsView;
