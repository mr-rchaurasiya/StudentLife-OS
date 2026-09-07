import React, { useState, useEffect } from 'react';
import {
  Video,
  Sparkles,
  Play,
  FileText,
  Clock,
  ExternalLink,
  ChevronRight,
  Download
} from 'lucide-react';
import {
  VideoLectureAnalysis,
  LectureChapterMarker,
  AnalyzeLectureDto
} from '@studentlife/shared';

interface VideoLectureNavigatorViewProps {
  onAddXp?: (xp: number, reason: string) => void;
}

export const VideoLectureNavigatorView: React.FC<VideoLectureNavigatorViewProps> = ({ onAddXp }) => {
  const [lectures, setLectures] = useState<VideoLectureAnalysis[]>([]);
  const [activeLecture, setActiveLecture] = useState<VideoLectureAnalysis | null>(null);
  const [currentChapter, setCurrentChapter] = useState<LectureChapterMarker | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [urlInput, setUrlInput] = useState<string>('https://youtube.com/watch?v=OQ5jsbhAv_M');
  const [subjectInput, setSubjectInput] = useState<string>('Algorithms & Graph Theory');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);

  useEffect(() => {
    fetchLectures();
  }, []);

  const fetchLectures = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/video-navigator/lectures');
      const data = await res.json();
      if (data.success && data.data) {
        setLectures(data.data);
        if (data.data.length > 0) {
          setActiveLecture(data.data[0]);
          if (data.data[0].chapters?.length > 0) {
            setCurrentChapter(data.data[0].chapters[0]);
          }
        }
      }
    } catch (err) {
      console.error('Failed to fetch video lectures', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsAnalyzing(true);
      const dto: AnalyzeLectureDto = {
        videoUrl: urlInput,
        targetSubject: subjectInput
      };
      const res = await fetch('/api/video-navigator/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dto)
      });
      const data = await res.json();
      if (data.success && data.data) {
        setLectures(prev => [data.data, ...prev.filter(l => l.id !== data.data.id)]);
        setActiveLecture(data.data);
        if (data.data.chapters?.length > 0) {
          setCurrentChapter(data.data.chapters[0]);
        }
        onAddXp?.(30, 'Analyzed Multimodal Video Lecture');
      }
    } catch (err) {
      console.error('Failed to analyze video lecture', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDownloadCheatsheet = () => {
    if (!activeLecture) return;
    const blob = new Blob([activeLecture.printableCheatsheetMarkdown], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeLecture.videoTitle.replace(/\s+/g, '_')}_Cheatsheet.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (isLoading || !activeLecture) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
        <Video size={36} className="animate-pulse" style={{ margin: '0 auto 16px', color: 'var(--accent-primary)' }} />
        <p>Loading Multimodal Video Lecture Navigator & Slide-OCR Chunker...</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top Banner */}
      <div className="glass-panel" style={{
        padding: '24px 32px',
        background: 'linear-gradient(135deg, rgba(13, 148, 136, 0.6) 0%, rgba(15, 23, 42, 0.9) 100%)',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '16px'
      }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span className="badge badge-active" style={{ backgroundColor: 'rgba(20, 184, 166, 0.2)', color: '#2dd4bf' }}>
              <Sparkles size={12} /> PHASE 54 &bull; MULTIMODAL VIDEO OCR CHUNKER
            </span>
            <span className="badge badge-completed">Timestamped Concept Seek</span>
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>
            Video Lecture Navigator <span className="gradient-text">& Slide Chunker 🎬</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
            Transform YouTube/NPTEL recorded lectures into interactive chapter timelines, whiteboard formula proofs, and cheatsheets.
          </p>
        </div>

        <form onSubmit={handleAnalyze} style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
          <input
            type="text"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="Paste YouTube / NPTEL URL..."
            className="glass-input"
            style={{ padding: '8px 14px', fontSize: '0.85rem', width: '200px' }}
            required
          />
          <input
            type="text"
            value={subjectInput}
            onChange={(e) => setSubjectInput(e.target.value)}
            placeholder="Target Subject..."
            className="glass-input"
            style={{ padding: '8px 14px', fontSize: '0.85rem', width: '160px' }}
          />
          <button
            type="submit"
            disabled={isAnalyzing}
            className="btn btn-primary"
            style={{ padding: '8px 18px', fontSize: '0.85rem' }}
          >
            {isAnalyzing ? 'Ingesting Video...' : 'Analyze Video'}
          </button>
        </form>
      </div>

      {/* Available Lectures Strip */}
      {lectures.length > 1 && (
        <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '4px' }}>
          {lectures.map((lec) => (
            <button
              key={lec.id}
              onClick={() => {
                setActiveLecture(lec);
                if (lec.chapters?.length > 0) setCurrentChapter(lec.chapters[0]);
              }}
              className={`glass-pill ${activeLecture.id === lec.id ? 'badge-active' : ''}`}
              style={{
                padding: '6px 14px',
                fontSize: '0.75rem',
                border: activeLecture.id === lec.id ? '1px solid #2dd4bf' : '1px solid var(--border-glass)',
                backgroundColor: activeLecture.id === lec.id ? 'rgba(20, 184, 166, 0.2)' : 'rgba(15, 23, 42, 0.6)',
                color: activeLecture.id === lec.id ? '#2dd4bf' : 'var(--text-secondary)',
                cursor: 'pointer'
              }}
            >
              {lec.videoTitle}
            </button>
          ))}
        </div>
      )}

      {/* Main Grid: Video Stream Simulator & Chapter Seek Matrix */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '20px' }}>
        {/* Left: Video Preview & Active Chapter Proof */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#38bdf8' }}>
                  {activeLecture.subject} &bull; {activeLecture.instructorName}
                </span>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginTop: '2px' }}>
                  {activeLecture.videoTitle}
                </h3>
              </div>
              <a
                href={activeLecture.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="btn btn-secondary"
                style={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                Watch on YouTube <ExternalLink size={12} />
              </a>
            </div>

            {/* Video Player Display Simulator */}
            <div
              style={{
                width: '100%',
                height: '240px',
                backgroundColor: '#070b14',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-glass)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '12px',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: 'rgba(99, 102, 241, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#818cf8',
                border: '1px solid var(--accent-primary)'
              }}>
                <Play size={28} />
              </div>
              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#ffffff' }}>
                Active Bookmark: {currentChapter?.title || 'Starting lecture...'}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#2dd4bf', fontFamily: 'var(--font-mono)' }}>
                Position: {currentChapter?.timestampFormatted || '00:00'} / {activeLecture.durationMinutes}:00
              </div>
            </div>

            {/* Extracted Math Proof OCR Card */}
            {currentChapter?.extractedWhiteboardMathProof && (
              <div style={{
                marginTop: '16px',
                padding: '14px 16px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'rgba(9, 13, 22, 0.8)',
                border: '1px solid var(--border-glass)'
              }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#fbbf24', marginBottom: '6px' }}>
                  WHITEBOARD OCR EXTRACTED FORMULA PROOF:
                </div>
                <div style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.9rem',
                  color: '#ffffff',
                  backgroundColor: 'rgba(15, 23, 42, 0.6)',
                  padding: '10px 12px',
                  borderRadius: '4px'
                }}>
                  {currentChapter.extractedWhiteboardMathProof}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Chapter Timeline & Cheatsheet */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Chapter Timeline */}
          <div className="glass-panel" style={{ padding: '20px' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={16} color="var(--accent-primary)" />
              Timeline Chapters & Concept Markers
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {activeLecture.chapters.map((ch, idx) => {
                const isSelected = currentChapter?.timestampFormatted === ch.timestampFormatted;
                return (
                  <div
                    key={idx}
                    onClick={() => {
                      setCurrentChapter(ch);
                      onAddXp?.(10, `Seeked to Chapter: ${ch.title}`);
                    }}
                    className="glow-hover"
                    style={{
                      padding: '12px 14px',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: isSelected ? 'rgba(20, 184, 166, 0.2)' : 'rgba(15, 23, 42, 0.6)',
                      border: isSelected ? '1px solid #2dd4bf' : '1px solid var(--border-glass)',
                      cursor: 'pointer',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#2dd4bf', fontFamily: 'var(--font-mono)' }}>
                          {ch.timestampFormatted}
                        </span>
                        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: isSelected ? '#ffffff' : 'var(--text-primary)' }}>
                          {ch.title}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                        Concepts: {ch.keyConcepts.join(', ')}
                      </div>
                    </div>
                    <ChevronRight size={16} color="var(--text-muted)" />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Printable Cheatsheet Card */}
          <div className="glass-panel" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileText size={16} color="#fbbf24" />
                Lecture Summary Cheatsheet
              </h4>
              <button
                onClick={handleDownloadCheatsheet}
                className="btn btn-secondary"
                style={{ padding: '4px 10px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                <Download size={12} /> Export .MD
              </button>
            </div>
            <pre style={{
              fontSize: '0.75rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.5,
              whiteSpace: 'pre-wrap',
              margin: 0,
              fontFamily: 'var(--font-sans)',
              backgroundColor: 'rgba(9, 13, 22, 0.6)',
              padding: '12px',
              borderRadius: 'var(--radius-sm)'
            }}>
              {activeLecture.printableCheatsheetMarkdown}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
