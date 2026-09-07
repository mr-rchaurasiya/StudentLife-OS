import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Trophy,
  Users,
  ExternalLink,
  Search,
  CheckCircle2,
  Calendar,
  Layers
} from 'lucide-react';
import { HackathonEvent, HackathonTeamMatchResult, FindTeammatesDto } from '@studentlife/shared';

interface HackathonRadarViewProps {
  onAddXp?: (xp: number, reason: string) => void;
}

export const HackathonRadarView: React.FC<HackathonRadarViewProps> = ({ onAddXp }) => {
  const [events, setEvents] = useState<HackathonEvent[]>([]);
  const [matches, setMatches] = useState<HackathonTeamMatchResult[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [skillInput, setSkillInput] = useState<string>('React, TypeScript, Machine Learning');
  const [isSearching, setIsSearching] = useState<boolean>(false);

  useEffect(() => {
    fetchHackathonData();
  }, []);

  const fetchHackathonData = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/hackathon-radar/events');
      const data = await res.json();
      if (data.success && data.data) {
        setEvents(data.data);
      }
      // Initial match
      await handleSearchTeammates();
    } catch (err) {
      console.error('Failed to fetch hackathons', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchTeammates = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    try {
      setIsSearching(true);
      const dto: FindTeammatesDto = {
        mySkills: skillInput.split(',').map(s => s.trim()).filter(Boolean)
      };
      const res = await fetch('/api/hackathon-radar/match-teammates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dto)
      });
      const data = await res.json();
      if (data.success && data.data) {
        setMatches(data.data);
        if (e) {
          onAddXp?.(20, 'Matched with Hackathon Teammates');
        }
      }
    } catch (err) {
      console.error('Failed to match teammates', err);
    } finally {
      setIsSearching(false);
    }
  };

  if (isLoading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
        <Trophy size={36} className="animate-pulse" style={{ margin: '0 auto 16px', color: 'var(--accent-primary)' }} />
        <p>Loading Global Hackathon Radar & AI Team Matchmaker...</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top Banner */}
      <div className="glass-panel" style={{
        padding: '24px 32px',
        background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.6) 0%, rgba(15, 23, 42, 0.9) 100%)',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '16px'
      }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span className="badge badge-active" style={{ backgroundColor: 'rgba(239, 68, 68, 0.2)', color: '#f87171' }}>
              <Sparkles size={12} /> PHASE 60 &bull; GLOBAL HACKATHON RADAR & MATCHMAKER
            </span>
            <span className="badge badge-completed">AI Skill-Complementary Teaming</span>
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>
            Global Hackathon Radar <span className="gradient-text">& Team Matchmaker 🏆</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
            Live tracking of worldwide student hackathons (SIH, ETHGlobal, Kaggle) & AI pairing with complementary engineers.
          </p>
        </div>

        {/* Skill Match Search Bar */}
        <form onSubmit={handleSearchTeammates} style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
          <input
            type="text"
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            placeholder="Your skills (e.g., Python, PyTorch, React)..."
            className="glass-input"
            style={{ padding: '8px 14px', fontSize: '0.85rem', width: '240px' }}
          />
          <button
            type="submit"
            disabled={isSearching}
            className="btn btn-primary"
            style={{ padding: '8px 16px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Search size={14} />
            {isSearching ? 'Matching...' : 'Find Teammates'}
          </button>
        </form>
      </div>

      {/* Main Grid: Hackathons Radar & Matched Teams */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.2fr', gap: '20px' }}>
        {/* Left: Featured Global Hackathons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h4 style={{ fontSize: '1.05rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Trophy size={18} color="#fbbf24" />
            Active Worldwide Student Hackathons
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {events.map((hack) => (
              <div
                key={hack.id}
                className="glass-panel glow-hover"
                style={{
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                      {hack.organizer} &bull; {hack.format}
                    </span>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginTop: '2px' }}>
                      {hack.title}
                    </h3>
                  </div>
                  <span className="badge badge-active" style={{ fontSize: '0.75rem', fontWeight: 800 }}>
                    💰 {hack.prizePool}
                  </span>
                </div>

                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                  <strong style={{ color: '#ffffff' }}>Featured Track:</strong> {hack.featuredChallenge}
                </p>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {hack.themes.map((theme, tIdx) => (
                    <span key={tIdx} className="glass-pill" style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                      {theme}
                    </span>
                  ))}
                </div>

                <div style={{
                  paddingTop: '10px',
                  borderTop: '1px solid var(--border-glass)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div style={{ fontSize: '0.75rem', color: '#f43f5e', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Calendar size={14} /> {hack.daysRemaining} days left (Deadline: {hack.registrationDeadline})
                  </div>
                  <a
                    href={hack.portalUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-secondary"
                    style={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    Register / Portal <ExternalLink size={12} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: AI-Matched Teammates & Open Spots */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h4 style={{ fontSize: '1.05rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Users size={18} color="#2dd4bf" />
            AI-Matched Complementary Teams
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {matches.map((team, idx) => (
              <div
                key={idx}
                className="glass-panel"
                style={{
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  borderLeft: '3px solid #2dd4bf'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span className="badge badge-active" style={{ fontSize: '0.65rem' }}>
                      {team.hackathonTitle}
                    </span>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginTop: '4px' }}>
                      {team.teamName}
                    </h3>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>COMPATIBILITY</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#34d399' }}>
                      {team.matchScorePercent}% Match
                    </div>
                  </div>
                </div>

                {/* Team Members */}
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px' }}>
                    Current Teammates:
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {team.members.map((member, mIdx) => (
                      <div key={mIdx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#2dd4bf' }} />
                        <span style={{ fontWeight: 700, color: '#ffffff' }}>{member.name}</span>
                        <span>&bull; {member.role}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Open Needed Roles */}
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#fbbf24', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Layers size={12} /> Open Roles Needed to Complete Team:
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {team.openRolesNeeded.map((role, rIdx) => (
                      <span key={rIdx} className="glass-pill" style={{ fontSize: '0.72rem', color: '#fbbf24', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
                        + {role}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Contact Bridge */}
                <div style={{
                  paddingTop: '10px',
                  borderTop: '1px solid var(--border-glass)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Contact: <strong style={{ color: '#ffffff' }}>{team.contactHandle}</strong>
                  </span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(team.contactHandle);
                      onAddXp?.(15, `Connected with Team ${team.teamName}`);
                    }}
                    className="btn btn-primary"
                    style={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    <CheckCircle2 size={12} /> Connect & Join Team
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
