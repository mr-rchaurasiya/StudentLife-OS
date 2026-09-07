import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  GraduationCap,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  FileText,
  UserCheck
} from 'lucide-react';
import { FacultyOfficeSlot, AdvisoryBooking, BookAdvisorySlotDto, AdvisoryPurpose } from '@studentlife/shared';

interface FacultyAdvisoryViewProps {
  onAddXp?: (xp: number, reason: string) => void;
}

export const FacultyAdvisoryView: React.FC<FacultyAdvisoryViewProps> = ({ onAddXp }) => {
  const [slots, setSlots] = useState<FacultyOfficeSlot[]>([]);
  const [bookings, setBookings] = useState<AdvisoryBooking[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedFacultyId, setSelectedFacultyId] = useState<string>('');
  const [scheduledDate, setScheduledDate] = useState<string>('2026-09-12');
  const [purpose, setPurpose] = useState<AdvisoryPurpose>('THESIS_GUIDANCE');
  const [agendaInput, setAgendaInput] = useState<string>('');
  const [isBooking, setIsBooking] = useState<boolean>(false);

  useEffect(() => {
    fetchAdvisoryData();
  }, []);

  const fetchAdvisoryData = async () => {
    try {
      setIsLoading(true);
      const [slotsRes, bookRes] = await Promise.all([
        fetch('/api/faculty-advisory/slots'),
        fetch('/api/faculty-advisory/bookings')
      ]);
      const slotsData = await slotsRes.json();
      const bookData = await bookRes.json();
      if (slotsData.success && slotsData.data) {
        setSlots(slotsData.data);
        if (slotsData.data.length > 0) {
          setSelectedFacultyId(slotsData.data[0].id);
        }
      }
      if (bookData.success && bookData.data) {
        setBookings(bookData.data);
      }
    } catch (err) {
      console.error('Failed to fetch faculty advisory data', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookSlot = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsBooking(true);
      const dto: BookAdvisorySlotDto = {
        facultyId: selectedFacultyId,
        scheduledDate,
        purpose,
        agendaDescription: agendaInput || 'Discussion on research and academic performance'
      };
      const res = await fetch('/api/faculty-advisory/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dto)
      });
      const data = await res.json();
      if (data.success && data.data) {
        setBookings(prev => [data.data, ...prev]);
        setAgendaInput('');
        onAddXp?.(25, 'Booked 1-on-1 Faculty Advisory Slot');
      }
    } catch (err) {
      console.error('Failed to book advisory slot', err);
    } finally {
      setIsBooking(false);
    }
  };

  if (isLoading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
        <GraduationCap size={36} className="animate-pulse" style={{ margin: '0 auto 16px', color: 'var(--accent-primary)' }} />
        <p>Loading Faculty Office Hours & Advisory Scheduler...</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top Banner */}
      <div className="glass-panel" style={{
        padding: '24px 32px',
        background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.6) 0%, rgba(15, 23, 42, 0.9) 100%)',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '16px'
      }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span className="badge badge-active" style={{ backgroundColor: 'rgba(99, 102, 241, 0.2)', color: '#818cf8' }}>
              <Sparkles size={12} /> PHASE 62 &bull; FACULTY OFFICE HOURS & ADVISORY
            </span>
            <span className="badge badge-completed">Automated Briefing Packet Generator</span>
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>
            Faculty Advisory & Office Hours <span className="gradient-text">Scheduler 🎓</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
            Book 1-on-1 office hours for thesis guidance, LOR recommendation letters, and grade reviews with pre-meeting briefings.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span className="badge badge-active" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
            <UserCheck size={16} /> {slots.length} Professors Available
          </span>
        </div>
      </div>

      {/* Main Grid: Available Faculty Slots & My Confirmed Bookings */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1.1fr', gap: '20px' }}>
        {/* Left: Available Faculty Slots */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h4 style={{ fontSize: '1.05rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <GraduationCap size={18} color="#818cf8" />
            Department Faculty Office Hours
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {slots.map((fac) => (
              <div
                key={fac.id}
                className="glass-panel"
                style={{
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  borderLeft: selectedFacultyId === fac.id ? '3px solid var(--accent-primary)' : '1px solid var(--border-glass)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>
                      {fac.professorName}
                    </h3>
                    <span style={{ fontSize: '0.75rem', color: '#a78bfa', fontWeight: 700 }}>
                      {fac.department}
                    </span>
                  </div>
                  <span className="badge badge-active" style={{ fontSize: '0.7rem' }}>
                    {fac.currentBookingsCount}/{fac.maxStudentsPerSlot} Booked
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '14px', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <MapPin size={14} color="#38bdf8" /> {fac.officeRoom}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={14} color="#fbbf24" /> {fac.timeSlotFormatted} ({fac.availableDays.join(', ')})
                  </span>
                </div>

                <div style={{ paddingTop: '8px', borderTop: '1px solid var(--border-glass)', display: 'flex', justifyContent: 'flex-end' }}>
                  <button
                    onClick={() => setSelectedFacultyId(fac.id)}
                    className={selectedFacultyId === fac.id ? 'btn btn-primary' : 'btn btn-secondary'}
                    style={{ fontSize: '0.75rem', padding: '6px 14px' }}
                  >
                    {selectedFacultyId === fac.id ? 'Selected for Booking' : 'Select Professor'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Book Slot Form */}
          <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Calendar size={16} color="var(--accent-primary)" />
              Reserve Advisory Slot
            </h4>

            <form onSubmit={handleBookSlot} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Preferred Date</label>
                  <input
                    type="date"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    className="glass-input"
                    style={{ width: '100%', padding: '8px 12px', fontSize: '0.85rem', marginTop: '4px' }}
                    required
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Meeting Purpose</label>
                  <select
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value as AdvisoryPurpose)}
                    className="glass-input"
                    style={{ width: '100%', padding: '8px 12px', fontSize: '0.85rem', marginTop: '4px' }}
                  >
                    <option value="THESIS_GUIDANCE">Thesis & Research Guidance</option>
                    <option value="LOR_REQUEST">Recommendation Letter (LOR)</option>
                    <option value="EXAM_GRADE_REVIEW">Semester Finals Grade Review</option>
                    <option value="RESEARCH_FELLOWSHIP">Lab Research Fellowship</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Agenda & Specific Questions</label>
                <textarea
                  value={agendaInput}
                  onChange={(e) => setAgendaInput(e.target.value)}
                  placeholder="Outline key topics or questions for the professor..."
                  className="glass-input"
                  style={{ width: '100%', height: '70px', padding: '8px 12px', fontSize: '0.8rem', marginTop: '4px', resize: 'vertical' }}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isBooking}
                className="btn btn-primary"
                style={{ padding: '10px 16px', fontSize: '0.85rem', marginTop: '4px' }}
              >
                {isBooking ? 'Confirming Appointment...' : 'Confirm Advisory Booking (+25 XP)'}
              </button>
            </form>
          </div>
        </div>

        {/* Right: Confirmed Advisory Bookings & Pre-Meeting Briefs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h4 style={{ fontSize: '1.05rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle2 size={18} color="#34d399" />
            My Confirmed Office Hour Appointments
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {bookings.map((b) => (
              <div
                key={b.id}
                className="glass-panel"
                style={{
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                  borderLeft: '3px solid #34d399'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="badge badge-completed" style={{ fontSize: '0.65rem' }}>
                    {b.status}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                    {b.scheduledDate} &bull; {b.scheduledTime}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>
                  {b.professorName}
                </h3>

                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  <strong>Agenda:</strong> {b.agendaDescription}
                </div>

                {/* Briefing Packet */}
                <div style={{
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'rgba(9, 13, 22, 0.8)',
                  border: '1px solid var(--border-glass)',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '8px'
                }}>
                  <FileText size={16} color="#818cf8" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                    <strong style={{ color: '#818cf8' }}>Pre-Meeting Brief:</strong> {b.briefingPacketSummary}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
