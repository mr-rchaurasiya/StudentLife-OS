import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Printer,
  QrCode,
  CheckCircle2,
  Plus
} from 'lucide-react';
import { CampusPrintJob, CreatePrintJobDto, PrintLocation } from '@studentlife/shared';

interface CampusPrintingQueueViewProps {
  onAddXp?: (xp: number, reason: string) => void;
}

export const CampusPrintingQueueView: React.FC<CampusPrintingQueueViewProps> = ({ onAddXp }) => {
  const [jobs, setJobs] = useState<CampusPrintJob[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [titleInput, setTitleInput] = useState<string>('');
  const [pageCount, setPageCount] = useState<number>(8);
  const [isDoubleSided, setIsDoubleSided] = useState<boolean>(true);
  const [isColor, setIsColor] = useState<boolean>(false);
  const [location, setLocation] = useState<PrintLocation>('CENTRAL_LIBRARY');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    fetchPrintJobs();
  }, []);

  const fetchPrintJobs = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/campus-printing/jobs');
      const data = await res.json();
      if (data.success && data.data) {
        setJobs(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch print jobs', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleInput.trim()) return;
    try {
      setIsSubmitting(true);
      const dto: CreatePrintJobDto = {
        documentTitle: titleInput,
        pageCount,
        isDoubleSided,
        isColor,
        location
      };
      const res = await fetch('/api/campus-printing/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dto)
      });
      const data = await res.json();
      if (data.success && data.data) {
        setJobs(prev => [data.data, ...prev]);
        setTitleInput('');
        onAddXp?.(15, 'Queued Document for Campus Kiosk Print');
      }
    } catch (err) {
      console.error('Failed to create print job', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
        <Printer size={36} className="animate-pulse" style={{ margin: '0 auto 16px', color: 'var(--accent-primary)' }} />
        <p>Loading Smart Campus Printing & Laser Plotter Queue Hub...</p>
      </div>
    );
  }

  const estimatedCost = isDoubleSided
    ? Math.ceil(pageCount / 2) * (isColor ? 9 : 3.6)
    : pageCount * (isColor ? 5 : 2);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top Banner */}
      <div className="glass-panel" style={{
        padding: '24px 32px',
        background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.6) 0%, rgba(15, 23, 42, 0.9) 100%)',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '16px'
      }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span className="badge badge-active" style={{ backgroundColor: 'rgba(14, 165, 233, 0.2)', color: '#38bdf8' }}>
              <Sparkles size={12} /> PHASE 64 &bull; SMART CAMPUS PRINTING QUEUE
            </span>
            <span className="badge badge-completed">Instant QR Code Release</span>
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>
            Smart Campus Printing & Plotter <span className="gradient-text">Queue Hub 🖨️</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
            Centralized print queue across Library, CS Labs, and Hostel Xerox hubs with double-sided cost optimization.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <div className="glass-panel" style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Printer size={18} color="#38bdf8" />
            <div>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>QUEUED JOBS</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff' }}>
                {jobs.length} Documents
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Live Print Queue & Send New Job Form */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1.1fr', gap: '20px' }}>
        {/* Left: Active Print Queue */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h4 style={{ fontSize: '1.05rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Printer size={18} color="#38bdf8" />
            Active Print Jobs & Pickup Stations
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {jobs.map((job) => (
              <div
                key={job.id}
                className="glass-panel glow-hover"
                style={{
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  borderLeft: job.status === 'READY_FOR_PICKUP' ? '3px solid #34d399' : '3px solid #38bdf8'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <span className="badge badge-active" style={{ fontSize: '0.65rem' }}>
                      {job.location.replace('_', ' ')}
                    </span>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginTop: '4px' }}>
                      {job.documentTitle}
                    </h3>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#38bdf8' }}>
                      ₹{job.estimatedCostINR} INR
                    </div>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                      {job.pageCount} pages ({job.isDoubleSided ? '2-Sided' : '1-Sided'})
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px', fontSize: '0.75rem' }}>
                  <span className="glass-pill" style={{ color: job.isColor ? '#ec4899' : 'var(--text-secondary)' }}>
                    {job.isColor ? '🎨 Color Print' : '⬛ Grayscale'}
                  </span>
                  <span className="glass-pill" style={{ color: '#34d399' }}>
                    <CheckCircle2 size={12} style={{ marginRight: '3px' }} /> {job.status.replace('_', ' ')}
                  </span>
                </div>

                {/* QR Code Release Box */}
                <div style={{
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'rgba(9, 13, 22, 0.8)',
                  border: '1px solid var(--border-glass)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: '#ffffff' }}>
                    <QrCode size={18} color="#38bdf8" />
                    <span>Kiosk Release PIN: <strong style={{ fontFamily: 'var(--font-mono)', color: '#38bdf8' }}>{job.qrReleaseCode}</strong></span>
                  </div>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(job.qrReleaseCode);
                      onAddXp?.(5, 'Copied Kiosk QR PIN');
                    }}
                    className="btn btn-secondary"
                    style={{ fontSize: '0.7rem', padding: '4px 10px' }}
                  >
                    Copy PIN
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Upload & Queue Print Job Form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Plus size={18} color="#38bdf8" />
              Queue New Document for Print
            </h4>

            <form onSubmit={handleCreateJob} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Document File Name</label>
                <input
                  type="text"
                  value={titleInput}
                  onChange={(e) => setTitleInput(e.target.value)}
                  placeholder="E.g., Final_Year_Project_Report_v3.pdf"
                  className="glass-input"
                  style={{ width: '100%', padding: '8px 12px', fontSize: '0.85rem', marginTop: '4px' }}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Page Count</label>
                  <input
                    type="number"
                    value={pageCount}
                    onChange={(e) => setPageCount(Math.max(1, Number(e.target.value)))}
                    className="glass-input"
                    style={{ width: '100%', padding: '8px 12px', fontSize: '0.85rem', marginTop: '4px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Campus Station</label>
                  <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value as PrintLocation)}
                    className="glass-input"
                    style={{ width: '100%', padding: '8px 12px', fontSize: '0.85rem', marginTop: '4px' }}
                  >
                    <option value="CENTRAL_LIBRARY">Central Library Kiosk</option>
                    <option value="CS_DEPT_LAB">CS Dept Computer Lab</option>
                    <option value="HOSTEL_XEROX_HUB">Hostel Xerox Hub</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '16px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={isDoubleSided}
                    onChange={(e) => setIsDoubleSided(e.target.checked)}
                  />
                  2-Sided (Save 40% Paper)
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={isColor}
                    onChange={(e) => setIsColor(e.target.checked)}
                  />
                  Color Print
                </label>
              </div>

              <div style={{
                padding: '10px 12px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'rgba(14, 165, 233, 0.1)',
                border: '1px solid rgba(14, 165, 233, 0.3)',
                fontSize: '0.82rem',
                color: '#38bdf8'
              }}>
                Estimated Kiosk Cost: <strong>₹{Math.round(estimatedCost)} INR</strong>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary"
                style={{ padding: '10px 16px', fontSize: '0.85rem', marginTop: '4px' }}
              >
                {isSubmitting ? 'Sending to Kiosk Queue...' : 'Queue Document for Print (+15 XP)'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
