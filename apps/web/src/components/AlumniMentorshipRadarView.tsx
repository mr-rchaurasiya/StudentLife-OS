import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Briefcase,
  Calendar,
  MessageSquare,
  ExternalLink,
  CheckCircle2,
  Video,
  Coffee,
  Linkedin
} from 'lucide-react';
import { AlumnusMentor, AlumniMentorshipRequest, RequestAlumniChatDto } from '@studentlife/shared';

interface AlumniMentorshipRadarViewProps {
  onAddXp?: (xp: number, reason: string) => void;
}

export const AlumniMentorshipRadarView: React.FC<AlumniMentorshipRadarViewProps> = ({ onAddXp }) => {
  const [mentors, setMentors] = useState<AlumnusMentor[]>([]);
  const [requests, setRequests] = useState<AlumniMentorshipRequest[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedMentorId, setSelectedMentorId] = useState<string>('');
  const [topicInput, setTopicInput] = useState<string>('');
  const [preferredDate, setPreferredDate] = useState<string>('2026-09-18');
  const [isSending, setIsSending] = useState<boolean>(false);

  useEffect(() => {
    fetchAlumniData();
  }, []);

  const fetchAlumniData = async () => {
    try {
      setIsLoading(true);
      const [mentorRes, reqRes] = await Promise.all([
        fetch('/api/alumni-radar/mentors'),
        fetch('/api/alumni-radar/requests')
      ]);
      const mentorData = await mentorRes.json();
      const reqData = await reqRes.json();
      if (mentorData.success && mentorData.data) {
        setMentors(mentorData.data);
        if (mentorData.data.length > 0) {
          setSelectedMentorId(mentorData.data[0].id);
        }
      }
      if (reqData.success && reqData.data) {
        setRequests(reqData.data);
      }
    } catch (err) {
      console.error('Failed to fetch alumni data', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topicInput.trim()) return;
    try {
      setIsSending(true);
      const dto: RequestAlumniChatDto = {
        mentorId: selectedMentorId,
        topicDiscussion: topicInput,
        preferredDate
      };
      const res = await fetch('/api/alumni-radar/request-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dto)
      });
      const data = await res.json();
      if (data.success && data.data) {
        setRequests(prev => [data.data, ...prev]);
        setTopicInput('');
        onAddXp?.(30, 'Sent 1-on-1 Coffee Chat Request to Alumnus');
      }
    } catch (err) {
      console.error('Failed to request alumni chat', err);
    } finally {
      setIsSending(false);
    }
  };

  if (isLoading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
        <Briefcase size={36} className="animate-pulse" style={{ margin: '0 auto 16px', color: 'var(--accent-primary)' }} />
        <p>Loading AI Alumni Mentorship & Senior Career Guidance Radar...</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top Banner */}
      <div className="glass-panel" style={{
        padding: '24px 32px',
        background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.6) 0%, rgba(15, 23, 42, 0.9) 100%)',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '16px'
      }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span className="badge badge-active" style={{ backgroundColor: 'rgba(168, 85, 247, 0.2)', color: '#c084fc' }}>
              <Sparkles size={12} /> PHASE 65 &bull; AI ALUMNI MENTORSHIP RADAR
            </span>
            <span className="badge badge-completed">1-Click Coffee Chat & Referral Bridge</span>
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>
            Alumni Mentorship Radar <span className="gradient-text">& Senior Referral Hub 🤝</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
            Connect with verified college seniors at Google, NVIDIA, and top research labs for 15-minute coffee chats and career guidance.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <div className="glass-panel" style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Coffee size={18} color="#c084fc" />
            <div>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>ALUMNI NETWORK</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff' }}>
                {mentors.length} Verified Mentors
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Alumni Directory & Coffee Chat Requests */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1.1fr', gap: '20px' }}>
        {/* Left: Verified Alumni Directory */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h4 style={{ fontSize: '1.05rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Briefcase size={18} color="#c084fc" />
            Verified Alumni Working in Industry
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {mentors.map((alumnus) => (
              <div
                key={alumnus.id}
                className="glass-panel glow-hover"
                style={{
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  borderLeft: selectedMentorId === alumnus.id ? '3px solid #c084fc' : '1px solid var(--border-glass)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <span className="badge badge-active" style={{ fontSize: '0.65rem' }}>
                      {alumnus.companyName}
                    </span>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginTop: '4px' }}>
                      {alumnus.fullName}
                    </h3>
                    <div style={{ fontSize: '0.78rem', color: '#c084fc', fontWeight: 600 }}>
                      {alumnus.currentDesignation}
                    </div>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: '#fbbf24', fontWeight: 800 }}>
                    ☕ {alumnus.availableCoffeeSlotsCount} slots open
                  </span>
                </div>

                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.4, margin: 0 }}>
                  {alumnus.bioSnippet}
                </p>

                <div style={{ fontSize: '0.75rem', color: '#34d399', fontWeight: 600 }}>
                  💡 Top Advice: "{alumnus.topAdviceTag}"
                </div>

                <div style={{
                  paddingTop: '10px',
                  borderTop: '1px solid var(--border-glass)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <a
                    href={`https://${alumnus.linkedinHandle}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{ fontSize: '0.75rem', color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none' }}
                  >
                    <Linkedin size={14} /> LinkedIn Profile <ExternalLink size={10} />
                  </a>

                  <button
                    onClick={() => setSelectedMentorId(alumnus.id)}
                    className={selectedMentorId === alumnus.id ? 'btn btn-primary' : 'btn btn-secondary'}
                    style={{ fontSize: '0.75rem', padding: '6px 14px' }}
                  >
                    {selectedMentorId === alumnus.id ? 'Selected for Chat' : 'Select Mentor'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Request Chat Form */}
          <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Coffee size={16} color="var(--accent-primary)" />
              Request 15-Minute Mentorship Coffee Chat
            </h4>

            <form onSubmit={handleRequestChat} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Preferred Date</label>
                <input
                  type="date"
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  className="glass-input"
                  style={{ width: '100%', padding: '8px 12px', fontSize: '0.85rem', marginTop: '4px' }}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Discussion Topic / Career Goal</label>
                <textarea
                  value={topicInput}
                  onChange={(e) => setTopicInput(e.target.value)}
                  placeholder="E.g., Seeking advice on preparing for systems engineer interviews & research fellowship..."
                  className="glass-input"
                  style={{ width: '100%', height: '70px', padding: '8px 12px', fontSize: '0.8rem', marginTop: '4px', resize: 'vertical' }}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSending}
                className="btn btn-primary"
                style={{ padding: '10px 16px', fontSize: '0.85rem', marginTop: '4px' }}
              >
                {isSending ? 'Sending Request...' : 'Send Coffee Chat Invitation (+30 XP)'}
              </button>
            </form>
          </div>
        </div>

        {/* Right: Confirmed & Pending Mentorship Chats */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h4 style={{ fontSize: '1.05rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle2 size={18} color="#34d399" />
            My Mentorship Coffee Chats
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {requests.map((req) => (
              <div
                key={req.id}
                className="glass-panel"
                style={{
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                  borderLeft: req.status === 'ACCEPTED' ? '3px solid #34d399' : '3px solid #fbbf24'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="badge badge-completed" style={{ fontSize: '0.65rem' }}>
                    {req.status}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Calendar size={12} /> {req.requestedDate}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>
                  {req.mentorName}
                </h3>

                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  <strong>Topic:</strong> {req.topicDiscussion}
                </div>

                {/* AI Icebreaker Card */}
                <div style={{
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'rgba(9, 13, 22, 0.8)',
                  border: '1px solid var(--border-glass)',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '8px'
                }}>
                  <MessageSquare size={16} color="#c084fc" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                    <strong style={{ color: '#c084fc' }}>AI Generated Icebreaker:</strong> {req.aiSuggestedIcebreaker}
                  </div>
                </div>

                {req.meetingRoomUrl && (
                  <div style={{ paddingTop: '8px', borderTop: '1px solid var(--border-glass)' }}>
                    <a
                      href={req.meetingRoomUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-primary"
                      style={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'center' }}
                    >
                      <Video size={14} /> Join Google Meet Video Call
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
