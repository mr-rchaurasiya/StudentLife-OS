import React, { useState, useEffect, useRef } from 'react';
import {
  FileText,
  Highlighter,
  Sparkles,
  BookOpen,
  Plus,
  Trash2,
  Download,
  CheckCircle2,
  HelpCircle,
  BrainCircuit,
  MessageSquare,
  Languages,
  Calculator,
  Layers,
  X,
  Clock,
  User,
  Info
} from 'lucide-react';
import {
  SmartDocument,
  DocumentAnnotationColor,
  DocumentAnnotationType,
  DocumentAiAction
} from '@studentlife/shared';

export const SmartDocumentAnnotatorView: React.FC = () => {
  const [documents, setDocuments] = useState<SmartDocument[]>([]);
  const [activeDocId, setActiveDocId] = useState<string>('doc-quantum-mechanics');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const [selectedText, setSelectedText] = useState<string>('');
  const [selectedParagraphIdx, setSelectedParagraphIdx] = useState<number>(0);
  const [floatingMenuPos, setFloatingMenuPos] = useState<{ x: number; y: number } | null>(null);

  // Note creation state
  const [highlightColor, setHighlightColor] = useState<DocumentAnnotationColor>('yellow');
  const [stickyNoteInput, setStickyNoteInput] = useState<string>('');
  const [showNoteModal, setShowNoteModal] = useState<boolean>(false);

  // Active AI output modal
  const [aiResultModal, setAiResultModal] = useState<{
    action: string;
    text: string;
    snippet: string;
  } | null>(null);

  // New Document modal
  const [showNewDocModal, setShowNewDocModal] = useState<boolean>(false);
  const [newDocForm, setNewDocForm] = useState({
    title: '',
    subject: '',
    category: '',
    author: '',
    text: ''
  });

  const readerContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/document-annotator/documents');
      const data = await res.json();
      if (data.success && data.data) {
        setDocuments(data.data);
        if (data.data.length > 0 && !activeDocId) {
          setActiveDocId(data.data[0].id);
        }
      }
    } catch (err) {
      console.error('Failed to load documents', err);
    } finally {
      setIsLoading(false);
    }
  };

  const activeDoc = documents.find((d) => d.id === activeDocId) || documents[0];

  // Handle Text Selection
  const handleMouseUp = (paragraphIdx: number) => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) {
      setFloatingMenuPos(null);
      return;
    }

    const text = selection.toString().trim();
    if (text.length > 2) {
      setSelectedText(text);
      setSelectedParagraphIdx(paragraphIdx);

      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      const containerRect = readerContainerRef.current?.getBoundingClientRect() || { top: 0, left: 0 };

      setFloatingMenuPos({
        x: Math.max(10, rect.left - containerRect.left + rect.width / 2 - 200),
        y: Math.max(10, rect.top - containerRect.top - 58)
      });
    } else {
      setFloatingMenuPos(null);
    }
  };

  const handleAiAction = async (action: DocumentAiAction) => {
    if (!selectedText || !activeDoc) return;
    try {
      setIsAiLoading(true);
      setFloatingMenuPos(null);
      const res = await fetch('/api/document-annotator/ai-action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentId: activeDoc.id,
          selectedText,
          action,
          contextParagraph: activeDoc.paragraphs[selectedParagraphIdx]
        })
      });

      const json = await res.json();
      if (json.success && json.data) {
        setAiResultModal({
          action,
          text: json.data.response,
          snippet: selectedText
        });
      }
    } catch (err) {
      console.error('AI action failed', err);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleAddHighlight = async (
    type: DocumentAnnotationType = 'HIGHLIGHT',
    noteContent?: string,
    aiResponse?: string
  ) => {
    if (!selectedText || !activeDoc) return;
    try {
      const res = await fetch(`/api/document-annotator/documents/${activeDoc.id}/annotations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentId: activeDoc.id,
          selectedText,
          color: highlightColor,
          type,
          noteContent: noteContent || undefined,
          aiResponse: aiResponse || undefined,
          paragraphIndex: selectedParagraphIdx
        })
      });

      const json = await res.json();
      if (json.success && json.data) {
        setDocuments((prev) =>
          prev.map((doc) =>
            doc.id === activeDoc.id
              ? { ...doc, annotations: [...doc.annotations, json.data] }
              : doc
          )
        );
      }
    } catch (err) {
      console.error('Failed to save highlight', err);
    } finally {
      setFloatingMenuPos(null);
      setShowNoteModal(false);
      setStickyNoteInput('');
    }
  };

  const handleDeleteAnnotation = async (annId: string) => {
    if (!activeDoc) return;
    try {
      await fetch(`/api/document-annotator/documents/${activeDoc.id}/annotations/${annId}`, {
        method: 'DELETE'
      });
      setDocuments((prev) =>
        prev.map((doc) =>
          doc.id === activeDoc.id
            ? { ...doc, annotations: doc.annotations.filter((a) => a.id !== annId) }
            : doc
        )
      );
    } catch (err) {
      console.error('Failed to delete annotation', err);
    }
  };

  const handleCreateDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocForm.text.trim()) return;

    try {
      const res = await fetch('/api/document-annotator/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newDocForm)
      });
      const json = await res.json();
      if (json.success && json.data) {
        setDocuments((prev) => [json.data, ...prev]);
        setActiveDocId(json.data.id);
        setShowNewDocModal(false);
        setNewDocForm({ title: '', subject: '', category: '', author: '', text: '' });
      }
    } catch (err) {
      console.error('Failed to create document', err);
    }
  };

  const handleExportMarkdown = async () => {
    if (!activeDoc) return;
    try {
      const res = await fetch(`/api/document-annotator/documents/${activeDoc.id}/export`);
      const json = await res.json();
      if (json.success && json.data?.markdown) {
        const blob = new Blob([json.data.markdown], { type: 'text/markdown;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${activeDoc.title.replace(/[^a-zA-Z0-9]/g, '_')}_Annotated.md`;
        link.click();
        URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.error('Failed to export markdown', err);
    }
  };

  const getColorStyles = (color: DocumentAnnotationColor) => {
    switch (color) {
      case 'yellow':
        return {
          bg: 'rgba(245, 158, 11, 0.22)',
          text: '#fef3c7',
          border: '1px solid rgba(245, 158, 11, 0.5)',
          dot: '#f59e0b'
        };
      case 'emerald':
        return {
          bg: 'rgba(16, 185, 129, 0.22)',
          text: '#d1fae5',
          border: '1px solid rgba(16, 185, 129, 0.5)',
          dot: '#10b981'
        };
      case 'cyan':
        return {
          bg: 'rgba(6, 182, 212, 0.22)',
          text: '#cffafe',
          border: '1px solid rgba(6, 182, 212, 0.5)',
          dot: '#06b6d4'
        };
      case 'rose':
        return {
          bg: 'rgba(244, 63, 94, 0.22)',
          text: '#ffe4e6',
          border: '1px solid rgba(244, 63, 94, 0.5)',
          dot: '#f43f5e'
        };
      case 'violet':
        return {
          bg: 'rgba(168, 85, 247, 0.22)',
          text: '#f3e8ff',
          border: '1px solid rgba(168, 85, 247, 0.5)',
          dot: '#a855f7'
        };
      default:
        return {
          bg: 'rgba(245, 158, 11, 0.22)',
          text: '#fef3c7',
          border: '1px solid rgba(245, 158, 11, 0.5)',
          dot: '#f59e0b'
        };
    }
  };

  if (isLoading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              border: '4px solid #06b6d4',
              borderTopColor: 'transparent',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}
          />
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', fontWeight: 600 }}>
            Loading Smart Document Annotator Engine...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '60px', maxWidth: '1600px', margin: '0 auto' }}>
      {/* Top Header & Action Bar */}
      <div
        style={{
          position: 'relative',
          borderRadius: '24px',
          overflow: 'hidden',
          background: 'linear-gradient(135deg, rgba(14, 116, 144, 0.3) 0%, rgba(15, 23, 42, 0.95) 50%, rgba(49, 46, 129, 0.5) 100%)',
          border: '1px solid rgba(6, 182, 212, 0.3)',
          padding: '28px 32px',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
          backdropFilter: 'blur(16px)',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '20px'
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '-50px',
            right: '-50px',
            width: '320px',
            height: '320px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(6, 182, 212, 0.18) 0%, rgba(0, 0, 0, 0) 70%)',
            pointerEvents: 'none'
          }}
        />

        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', position: 'relative', zIndex: 1, maxWidth: '800px' }}>
          <div
            style={{
              width: '54px',
              height: '54px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #06b6d4 0%, #6366f1 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 24px rgba(6, 182, 212, 0.35)',
              flexShrink: 0
            }}
          >
            <Highlighter size={28} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '6px' }}>
              <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em', margin: 0 }}>
                Smart PDF & Notes Annotator
              </h1>
              <span
                style={{
                  backgroundColor: 'rgba(6, 182, 212, 0.15)',
                  color: '#67e8f9',
                  border: '1px solid rgba(6, 182, 212, 0.4)',
                  padding: '3px 10px',
                  borderRadius: '9999px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px'
                }}
              >
                <Sparkles size={12} color="#22d3ee" /> In-Place AI Active Recall
              </span>
            </div>
            <p style={{ fontSize: '0.9rem', color: '#94a3b8', margin: 0, lineHeight: 1.5 }}>
              Select any sentence or formula for instant ELI5 breakdowns, flashcards, bilingual audio notes & marginal highlights.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', position: 'relative', zIndex: 1 }}>
          <button
            onClick={() => setShowNewDocModal(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '11px 18px',
              borderRadius: '14px',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              backgroundColor: 'rgba(15, 23, 42, 0.8)',
              color: '#e2e8f0',
              fontWeight: 700,
              fontSize: '0.82rem',
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
            }}
          >
            <Plus size={16} color="#22d3ee" />
            Paste New Notes
          </button>
          <button
            onClick={handleExportMarkdown}
            disabled={!activeDoc}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '11px 20px',
              borderRadius: '14px',
              border: 'none',
              background: 'linear-gradient(135deg, #06b6d4 0%, #6366f1 100%)',
              color: '#ffffff',
              fontWeight: 800,
              fontSize: '0.82rem',
              cursor: 'pointer',
              boxShadow: '0 6px 20px rgba(6, 182, 212, 0.35)',
              transition: 'all 0.2s',
              opacity: !activeDoc ? 0.5 : 1
            }}
          >
            <Download size={16} />
            Export Annotations (.md)
          </button>
        </div>
      </div>

      {/* Main Grid: Document Library Sidebar + Reader Canvas + Marginal Notes Drawer */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '24px' }}>
        
        {/* Left Sidebar: Document Selector (3 cols) */}
        <div style={{ gridColumn: 'span 3', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div
            style={{
              backgroundColor: 'rgba(15, 23, 42, 0.85)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '20px',
              padding: '18px',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.35)',
              backdropFilter: 'blur(16px)'
            }}
          >
            <h3
              style={{
                fontSize: '0.72rem',
                fontWeight: 800,
                color: '#94a3b8',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                margin: '0 0 14px 0',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <BookOpen size={15} color="#818cf8" />
              Document Library ({documents.length})
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {documents.map((doc) => {
                const isActive = doc.id === activeDoc?.id;
                return (
                  <button
                    key={doc.id}
                    onClick={() => {
                      setActiveDocId(doc.id);
                      setFloatingMenuPos(null);
                    }}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      padding: '14px',
                      borderRadius: '14px',
                      transition: 'all 0.2s',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '6px',
                      cursor: 'pointer',
                      border: isActive ? '1px solid rgba(6, 182, 212, 0.5)' : '1px solid rgba(255, 255, 255, 0.06)',
                      background: isActive
                        ? 'linear-gradient(135deg, rgba(6, 182, 212, 0.15) 0%, rgba(15, 23, 42, 0.95) 100%)'
                        : 'rgba(2, 6, 23, 0.5)',
                      boxShadow: isActive ? '0 6px 18px rgba(6, 182, 212, 0.18)' : 'none'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span
                        style={{
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          padding: '2px 8px',
                          borderRadius: '6px',
                          backgroundColor: isActive ? 'rgba(6, 182, 212, 0.25)' : 'rgba(255, 255, 255, 0.06)',
                          color: isActive ? '#67e8f9' : '#94a3b8'
                        }}
                      >
                        {doc.subject}
                      </span>
                      <span style={{ fontSize: '0.7rem', color: '#64748b', fontFamily: 'monospace', display: 'flex', alignItems: 'center', gap: '3px' }}>
                        <Clock size={11} /> {doc.readTimeMinutes}m read
                      </span>
                    </div>
                    <div
                      style={{
                        fontWeight: 700,
                        fontSize: '0.85rem',
                        color: isActive ? '#ffffff' : '#cbd5e1',
                        lineHeight: 1.4,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}
                    >
                      {doc.title}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ color: '#22d3ee', fontWeight: 600 }}>{doc.annotations.length} highlights</span>
                      <span>&bull;</span>
                      <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{doc.category}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Guide Card */}
          <div
            style={{
              background: 'linear-gradient(135deg, rgba(30, 27, 75, 0.5) 0%, rgba(15, 23, 42, 0.7) 100%)',
              border: '1px solid rgba(99, 102, 241, 0.25)',
              borderRadius: '20px',
              padding: '16px',
              fontSize: '0.8rem',
              color: '#cbd5e1',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }}
          >
            <div style={{ fontWeight: 800, color: '#a5b4fc', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Sparkles size={15} color="#fbbf24" />
              Pro Student Tip
            </div>
            <p style={{ color: '#94a3b8', lineHeight: 1.5, margin: 0, fontSize: '0.78rem' }}>
              Highlight any equation or paragraph with your mouse. The in-place AI toolbar will pop up directly over your text for instant zero-friction deep learning!
            </p>
          </div>
        </div>

        {/* Center: Interactive Document Canvas (6 cols) */}
        <div style={{ gridColumn: 'span 6', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {activeDoc ? (
            <div
              ref={readerContainerRef}
              style={{
                position: 'relative',
                backgroundColor: 'rgba(15, 23, 42, 0.85)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '24px',
                padding: '32px',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
                color: '#e2e8f0',
                minHeight: '660px',
                backdropFilter: 'blur(16px)'
              }}
            >
              {/* Document Header */}
              <div style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '20px', marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', fontWeight: 800, color: '#22d3ee', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
                  <span>{activeDoc.category}</span>
                  <span>&bull;</span>
                  <span>{activeDoc.subject}</span>
                </div>
                <h2 style={{ fontSize: '1.65rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em', lineHeight: 1.3, margin: '0 0 10px 0' }}>
                  {activeDoc.title}
                </h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '0.75rem', color: '#94a3b8', flexWrap: 'wrap' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <User size={13} color="#64748b" /> {activeDoc.author}
                  </span>
                  <span>&bull;</span>
                  <span>{activeDoc.paragraphs.length} Paragraphs</span>
                  <span>&bull;</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={13} color="#64748b" /> {activeDoc.readTimeMinutes} min estimated reading
                  </span>
                </div>
              </div>

              {/* Floating Contextual AI & Highlight Action Toolbar */}
              {floatingMenuPos && (
                <div
                  style={{
                    position: 'absolute',
                    top: `${floatingMenuPos.y}px`,
                    left: `${floatingMenuPos.x}px`,
                    zIndex: 40,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 8px',
                    backgroundColor: 'rgba(2, 6, 23, 0.96)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(6, 182, 212, 0.5)',
                    borderRadius: '16px',
                    boxShadow: '0 12px 36px rgba(0, 0, 0, 0.8), 0 0 20px rgba(6, 182, 212, 0.25)'
                  }}
                >
                  <button
                    onClick={() => handleAiAction('EXPLAIN')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '6px 10px',
                      backgroundColor: 'rgba(99, 102, 241, 0.35)',
                      border: '1px solid rgba(99, 102, 241, 0.6)',
                      color: '#ffffff',
                      borderRadius: '10px',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                    title="Explain Simply (ELI5)"
                  >
                    <Sparkles size={13} color="#fbbf24" />
                    Explain
                  </button>

                  <button
                    onClick={() => handleAiAction('SUMMARIZE')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '6px 9px',
                      backgroundColor: 'rgba(15, 23, 42, 0.8)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: '#67e8f9',
                      borderRadius: '10px',
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                    title="Synthesize Key Takeaways"
                  >
                    <Layers size={13} />
                    Summarize
                  </button>

                  <button
                    onClick={() => handleAiAction('FLASHCARD')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '6px 9px',
                      backgroundColor: 'rgba(15, 23, 42, 0.8)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: '#c084fc',
                      borderRadius: '10px',
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                    title="Convert to Active Recall Flashcard"
                  >
                    <BrainCircuit size={13} />
                    Flashcard
                  </button>

                  <button
                    onClick={() => handleAiAction('QUIZ')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '6px 9px',
                      backgroundColor: 'rgba(15, 23, 42, 0.8)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: '#34d399',
                      borderRadius: '10px',
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                    title="Generate MCQ Practice Question"
                  >
                    <HelpCircle size={13} />
                    Quiz
                  </button>

                  <button
                    onClick={() => handleAiAction('TRANSLATE_HINDI')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '6px 9px',
                      backgroundColor: 'rgba(15, 23, 42, 0.8)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: '#fcd34d',
                      borderRadius: '10px',
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                    title="Bilingual Hindi / Hinglish translation"
                  >
                    <Languages size={13} />
                    Hindi
                  </button>

                  <button
                    onClick={() => handleAiAction('SIMPLIFY_MATH')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '6px 9px',
                      backgroundColor: 'rgba(15, 23, 42, 0.8)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: '#fb7185',
                      borderRadius: '10px',
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                    title="Step-by-Step Mathematical Derivation"
                  >
                    <Calculator size={13} />
                    Math
                  </button>

                  <div style={{ width: '1px', height: '20px', backgroundColor: 'rgba(255, 255, 255, 0.15)', margin: '0 2px' }} />

                  {/* Color Swatches */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '0 2px' }}>
                    {(['yellow', 'emerald', 'cyan', 'rose', 'violet'] as DocumentAnnotationColor[]).map((c) => {
                      const col = getColorStyles(c);
                      return (
                        <button
                          key={c}
                          onClick={() => {
                            setHighlightColor(c);
                            handleAddHighlight('HIGHLIGHT');
                          }}
                          style={{
                            width: '16px',
                            height: '16px',
                            borderRadius: '50%',
                            backgroundColor: col.dot,
                            border: '1px solid rgba(255, 255, 255, 0.3)',
                            cursor: 'pointer',
                            transition: 'transform 0.15s'
                          }}
                          title={`Highlight with ${c}`}
                        />
                      );
                    })}
                  </div>

                  <button
                    onClick={() => setShowNoteModal(true)}
                    style={{
                      padding: '6px 8px',
                      backgroundColor: 'rgba(245, 158, 11, 0.15)',
                      border: '1px solid rgba(245, 158, 11, 0.3)',
                      color: '#fbbf24',
                      borderRadius: '10px',
                      fontSize: '0.72rem',
                      cursor: 'pointer'
                    }}
                    title="Add Sticky Note"
                  >
                    <MessageSquare size={13} />
                  </button>
                </div>
              )}

              {/* Document Paragraphs Flow */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', color: '#cbd5e1', lineHeight: 1.75, fontSize: '0.98rem' }}>
                {activeDoc.paragraphs.map((para, idx) => {
                  const paraAnnotations = activeDoc.annotations.filter((a) => a.paragraphIndex === idx);
                  return (
                    <div
                      key={idx}
                      onMouseUp={() => handleMouseUp(idx)}
                      style={{
                        position: 'relative',
                        padding: '12px 16px',
                        borderRadius: '14px',
                        backgroundColor: 'rgba(2, 6, 23, 0.35)',
                        border: '1px solid rgba(255, 255, 255, 0.04)',
                        transition: 'background-color 0.15s'
                      }}
                    >
                      <span
                        style={{
                          position: 'absolute',
                          left: '-24px',
                          top: '14px',
                          fontSize: '0.68rem',
                          fontFamily: 'monospace',
                          color: '#64748b',
                          userSelect: 'none'
                        }}
                      >
                        P{idx + 1}
                      </span>
                      <p style={{ userSelect: 'text', whiteSpace: 'pre-wrap', margin: 0 }}>
                        {para}
                      </p>

                      {/* Paragraph In-line Badges for Annotations */}
                      {paraAnnotations.length > 0 && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '12px', paddingTop: '10px', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
                          {paraAnnotations.map((ann) => {
                            const cStyle = getColorStyles(ann.color);
                            return (
                              <span
                                key={ann.id}
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '6px',
                                  padding: '4px 10px',
                                  borderRadius: '8px',
                                  fontSize: '0.72rem',
                                  fontWeight: 600,
                                  backgroundColor: cStyle.bg,
                                  color: cStyle.text,
                                  border: cStyle.border
                                }}
                              >
                                <Highlighter size={12} />
                                <span style={{ maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                  "{ann.selectedText}"
                                </span>
                                <button
                                  onClick={() => handleDeleteAnnotation(ann.id)}
                                  style={{
                                    background: 'transparent',
                                    border: 'none',
                                    color: cStyle.text,
                                    cursor: 'pointer',
                                    padding: '0',
                                    marginLeft: '4px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    opacity: 0.7
                                  }}
                                >
                                  <X size={12} />
                                </button>
                              </span>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div
              style={{
                backgroundColor: 'rgba(15, 23, 42, 0.85)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '24px',
                padding: '48px',
                textAlign: 'center',
                color: '#94a3b8'
              }}
            >
              No document selected. Choose one from the library or paste a new one!
            </div>
          )}
        </div>

        {/* Right Sidebar: Marginal Insights & Notes Drawer (3 cols) */}
        <div style={{ gridColumn: 'span 3', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div
            style={{
              backgroundColor: 'rgba(15, 23, 42, 0.85)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '20px',
              padding: '18px',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.35)',
              backdropFilter: 'blur(16px)'
            }}
          >
            <h3
              style={{
                fontSize: '0.72rem',
                fontWeight: 800,
                color: '#94a3b8',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                margin: '0 0 14px 0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Layers size={15} color="#22d3ee" />
                Marginal Insights ({activeDoc?.annotations.length || 0})
              </span>
            </h3>

            {activeDoc && activeDoc.annotations.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '580px', overflowY: 'auto', paddingRight: '4px' }}>
                {activeDoc.annotations.map((ann) => {
                  const cStyle = getColorStyles(ann.color);
                  return (
                    <div
                      key={ann.id}
                      style={{
                        padding: '12px',
                        backgroundColor: 'rgba(2, 6, 23, 0.65)',
                        border: '1px solid rgba(255, 255, 255, 0.06)',
                        borderRadius: '14px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px',
                        fontSize: '0.78rem'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span
                          style={{
                            padding: '2px 8px',
                            borderRadius: '6px',
                            fontSize: '0.65rem',
                            fontWeight: 800,
                            textTransform: 'uppercase',
                            backgroundColor: cStyle.bg,
                            color: cStyle.text,
                            border: cStyle.border
                          }}
                        >
                          {ann.type}
                        </span>
                        <button
                          onClick={() => handleDeleteAnnotation(ann.id)}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: '#64748b',
                            cursor: 'pointer',
                            padding: '2px',
                            display: 'flex',
                            alignItems: 'center'
                          }}
                          title="Delete Annotation"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>

                      <div
                        style={{
                          color: '#cbd5e1',
                          fontWeight: 500,
                          fontStyle: 'italic',
                          borderLeft: `3px solid ${cStyle.dot}`,
                          paddingLeft: '8px'
                        }}
                      >
                        "{ann.selectedText}"
                      </div>

                      {ann.noteContent && (
                        <div
                          style={{
                            color: '#fef3c7',
                            backgroundColor: 'rgba(245, 158, 11, 0.15)',
                            padding: '8px 10px',
                            borderRadius: '8px',
                            border: '1px solid rgba(245, 158, 11, 0.25)',
                            lineHeight: 1.4
                          }}
                        >
                          {ann.noteContent}
                        </div>
                      )}

                      {ann.aiResponse && (
                        <div
                          style={{
                            color: '#cffafe',
                            backgroundColor: 'rgba(6, 182, 212, 0.12)',
                            padding: '8px 10px',
                            borderRadius: '8px',
                            border: '1px solid rgba(6, 182, 212, 0.25)',
                            whiteSpace: 'pre-wrap',
                            fontFamily: 'monospace',
                            fontSize: '0.72rem',
                            lineHeight: 1.45
                          }}
                        >
                          {ann.aiResponse}
                        </div>
                      )}

                      <div style={{ fontSize: '0.68rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Info size={11} /> Paragraph {ann.paragraphIndex + 1}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div
                style={{
                  padding: '24px 16px',
                  textAlign: 'center',
                  color: '#64748b',
                  fontSize: '0.78rem',
                  border: '1px dashed rgba(255, 255, 255, 0.1)',
                  borderRadius: '14px'
                }}
              >
                No marginal notes yet. Highlight any text in the reader to generate AI cards and highlights!
              </div>
            )}
          </div>
        </div>

      </div>

      {/* AI Action Result Modal */}
      {aiResultModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 50,
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px'
          }}
        >
          <div
            style={{
              backgroundColor: '#0f172a',
              border: '1px solid rgba(6, 182, 212, 0.4)',
              borderRadius: '24px',
              maxWidth: '650px',
              width: '100%',
              padding: '28px',
              display: 'flex',
              flexDirection: 'column',
              gap: '18px',
              boxShadow: '0 24px 60px rgba(0, 0, 0, 0.8)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '12px',
                    backgroundColor: 'rgba(99, 102, 241, 0.25)',
                    border: '1px solid rgba(99, 102, 241, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#818cf8'
                  }}
                >
                  <Sparkles size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
                    AI Annotation & Learning Assistant
                  </h3>
                  <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: '2px 0 0 0' }}>
                    Action: {aiResultModal.action}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setAiResultModal(null)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  padding: '4px'
                }}
              >
                <X size={20} />
              </button>
            </div>

            <div
              style={{
                backgroundColor: 'rgba(2, 6, 23, 0.7)',
                padding: '12px 14px',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                borderLeft: '4px solid #6366f1',
                fontSize: '0.8rem',
                color: '#cbd5e1',
                fontStyle: 'italic'
              }}
            >
              Selected text: "{aiResultModal.snippet}"
            </div>

            <div
              style={{
                backgroundColor: 'rgba(2, 6, 23, 0.85)',
                padding: '16px',
                borderRadius: '14px',
                border: '1px solid rgba(6, 182, 212, 0.2)',
                color: '#e2e8f0',
                fontSize: '0.88rem',
                whiteSpace: 'pre-wrap',
                lineHeight: 1.6,
                maxHeight: '320px',
                overflowY: 'auto'
              }}
            >
              {aiResultModal.text}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '10px', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <button
                onClick={() => {
                  handleAddHighlight('AI_INSIGHT', undefined, aiResultModal.text);
                  setAiResultModal(null);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 18px',
                  background: 'linear-gradient(135deg, #06b6d4 0%, #6366f1 100%)',
                  color: '#ffffff',
                  borderRadius: '12px',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(6, 182, 212, 0.3)'
                }}
              >
                <CheckCircle2 size={16} />
                Pin to Marginal Notes
              </button>
              <button
                onClick={() => setAiResultModal(null)}
                style={{
                  padding: '10px 16px',
                  backgroundColor: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#cbd5e1',
                  borderRadius: '12px',
                  fontSize: '0.82rem',
                  cursor: 'pointer'
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sticky Note Creation Modal */}
      {showNoteModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 50,
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px'
          }}
        >
          <div
            style={{
              backgroundColor: '#0f172a',
              border: '1px solid rgba(245, 158, 11, 0.35)',
              borderRadius: '20px',
              maxWidth: '460px',
              width: '100%',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8)'
            }}
          >
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
              <MessageSquare size={18} color="#fbbf24" />
              Add Marginal Sticky Note
            </h3>
            <p style={{ fontSize: '0.78rem', color: '#94a3b8', fontStyle: 'italic', margin: 0 }}>
              "{selectedText}"
            </p>
            <textarea
              value={stickyNoteInput}
              onChange={(e) => setStickyNoteInput(e.target.value)}
              placeholder="Write your study note, doubt, or mnemonic here..."
              rows={4}
              style={{
                width: '100%',
                boxSizing: 'border-box',
                backgroundColor: 'rgba(2, 6, 23, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '12px',
                padding: '12px',
                fontSize: '0.85rem',
                color: '#ffffff',
                outline: 'none',
                resize: 'vertical'
              }}
            />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px', paddingTop: '6px' }}>
              <button
                onClick={() => setShowNoteModal(false)}
                style={{
                  padding: '8px 14px',
                  backgroundColor: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#94a3b8',
                  borderRadius: '10px',
                  fontSize: '0.78rem',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => handleAddHighlight('NOTE', stickyNoteInput)}
                disabled={!stickyNoteInput.trim()}
                style={{
                  padding: '8px 16px',
                  background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                  color: '#ffffff',
                  borderRadius: '10px',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                  opacity: !stickyNoteInput.trim() ? 0.5 : 1
                }}
              >
                Save Note
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Document Modal */}
      {showNewDocModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 50,
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px'
          }}
        >
          <div
            style={{
              backgroundColor: '#0f172a',
              border: '1px solid rgba(6, 182, 212, 0.35)',
              borderRadius: '24px',
              maxWidth: '580px',
              width: '100%',
              padding: '28px',
              display: 'flex',
              flexDirection: 'column',
              gap: '18px',
              boxShadow: '0 24px 60px rgba(0, 0, 0, 0.8)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '12px' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                <FileText size={20} color="#22d3ee" />
                Paste Lecture Notes / PDF Text
              </h3>
              <button
                onClick={() => setShowNewDocModal(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  padding: '4px'
                }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateDocument} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
                  Document Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Thermodynamics - Second Law & Carnot Cycle"
                  value={newDocForm.title}
                  onChange={(e) => setNewDocForm({ ...newDocForm, title: e.target.value })}
                  style={{
                    width: '100%',
                    boxSizing: 'border-box',
                    backgroundColor: 'rgba(2, 6, 23, 0.8)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '12px',
                    padding: '10px 14px',
                    fontSize: '0.85rem',
                    color: '#ffffff',
                    outline: 'none'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
                    Subject
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Physics / Polity"
                    value={newDocForm.subject}
                    onChange={(e) => setNewDocForm({ ...newDocForm, subject: e.target.value })}
                    style={{
                      width: '100%',
                      boxSizing: 'border-box',
                      backgroundColor: 'rgba(2, 6, 23, 0.8)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      borderRadius: '12px',
                      padding: '10px 14px',
                      fontSize: '0.85rem',
                      color: '#ffffff',
                      outline: 'none'
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
                    Category / Exam
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. JEE Advanced"
                    value={newDocForm.category}
                    onChange={(e) => setNewDocForm({ ...newDocForm, category: e.target.value })}
                    style={{
                      width: '100%',
                      boxSizing: 'border-box',
                      backgroundColor: 'rgba(2, 6, 23, 0.8)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      borderRadius: '12px',
                      padding: '10px 14px',
                      fontSize: '0.85rem',
                      color: '#ffffff',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
                  Text Content (Separate paragraphs by blank lines)
                </label>
                <textarea
                  required
                  rows={6}
                  placeholder="Paste textbook chapter, PDF lecture extract, or research abstract here..."
                  value={newDocForm.text}
                  onChange={(e) => setNewDocForm({ ...newDocForm, text: e.target.value })}
                  style={{
                    width: '100%',
                    boxSizing: 'border-box',
                    backgroundColor: 'rgba(2, 6, 23, 0.8)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '12px',
                    padding: '12px 14px',
                    fontSize: '0.85rem',
                    color: '#ffffff',
                    outline: 'none',
                    resize: 'vertical'
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', paddingTop: '6px' }}>
                <button
                  type="button"
                  onClick={() => setShowNewDocModal(false)}
                  style={{
                    padding: '9px 16px',
                    backgroundColor: 'rgba(255, 255, 255, 0.06)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: '#94a3b8',
                    borderRadius: '10px',
                    fontSize: '0.8rem',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '9px 20px',
                    background: 'linear-gradient(135deg, #06b6d4 0%, #6366f1 100%)',
                    color: '#ffffff',
                    borderRadius: '10px',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(6, 182, 212, 0.3)'
                  }}
                >
                  Create & Open
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* AI Processing overlay */}
      {isAiLoading && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 50,
            backgroundColor: 'rgba(15, 23, 42, 0.95)',
            border: '1px solid rgba(6, 182, 212, 0.5)',
            borderRadius: '16px',
            padding: '14px 20px',
            boxShadow: '0 12px 30px rgba(0, 0, 0, 0.6)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}
        >
          <div
            style={{
              width: '18px',
              height: '18px',
              border: '2px solid #22d3ee',
              borderTopColor: 'transparent',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}
          />
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#67e8f9' }}>
            AI Thinking & Synthesizing Annotation...
          </span>
        </div>
      )}
    </div>
  );
};

export default SmartDocumentAnnotatorView;
