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
  X
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

  const activeDoc = documents.find(d => d.id === activeDocId) || documents[0];

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
        x: Math.max(10, rect.left - containerRect.left + rect.width / 2 - 150),
        y: Math.max(10, rect.top - containerRect.top - 54)
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

  const handleAddHighlight = async (type: DocumentAnnotationType = 'HIGHLIGHT', noteContent?: string, aiResponse?: string) => {
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
        setDocuments(prev =>
          prev.map(doc =>
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
      setDocuments(prev =>
        prev.map(doc =>
          doc.id === activeDoc.id
            ? { ...doc, annotations: doc.annotations.filter(a => a.id !== annId) }
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
        setDocuments(prev => [json.data, ...prev]);
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

  const getColorClasses = (color: DocumentAnnotationColor) => {
    switch (color) {
      case 'yellow': return 'bg-amber-500/25 text-amber-200 border-b-2 border-amber-400';
      case 'emerald': return 'bg-emerald-500/25 text-emerald-200 border-b-2 border-emerald-400';
      case 'cyan': return 'bg-cyan-500/25 text-cyan-200 border-b-2 border-cyan-400';
      case 'rose': return 'bg-rose-500/25 text-rose-200 border-b-2 border-rose-400';
      case 'violet': return 'bg-purple-500/25 text-purple-200 border-b-2 border-purple-400';
      default: return 'bg-amber-500/25 text-amber-200';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400 text-sm font-medium">Loading Smart Document Annotator Engine...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Top Header & Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-cyan-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
            <Highlighter className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-white tracking-tight">Smart PDF & Notes Annotator</h1>
              <span className="px-2.5 py-0.5 text-xs font-semibold bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-500/30 rounded-full flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> In-Place AI
              </span>
            </div>
            <p className="text-sm text-slate-400">
              Select any sentence or formula for instant ELI5 breakdowns, flashcards, bilingual audio notes & marginal highlights.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowNewDocModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl font-medium text-sm transition-all hover:border-slate-600 shadow-md"
          >
            <Plus className="w-4 h-4 text-cyan-400" />
            Paste New Notes
          </button>
          <button
            onClick={handleExportMarkdown}
            disabled={!activeDoc}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white rounded-xl font-semibold text-sm transition-all shadow-lg shadow-indigo-500/25"
          >
            <Download className="w-4 h-4" />
            Export Annotations (.md)
          </button>
        </div>
      </div>

      {/* Main Grid: Document Selector Sidebar + Reader Canvas + Marginal Notes Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Sidebar: Document Selector (3 cols) */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-xl">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-2 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-400" />
              Document Library ({documents.length})
            </h3>
            <div className="space-y-2">
              {documents.map(doc => {
                const isActive = doc.id === activeDoc?.id;
                return (
                  <button
                    key={doc.id}
                    onClick={() => {
                      setActiveDocId(doc.id);
                      setFloatingMenuPos(null);
                    }}
                    className={`w-full text-left p-3 rounded-xl transition-all flex flex-col gap-1 border ${
                      isActive
                        ? 'bg-gradient-to-r from-indigo-950/60 to-slate-900 border-indigo-500/50 shadow-md shadow-indigo-950/50'
                        : 'bg-slate-950/40 border-slate-800/60 hover:bg-slate-800/40 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-md ${
                        isActive ? 'bg-indigo-500/20 text-indigo-300' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {doc.subject}
                      </span>
                      <span className="text-[11px] text-slate-500 font-mono">
                        {doc.readTimeMinutes} min read
                      </span>
                    </div>
                    <div className={`font-semibold text-sm line-clamp-1 ${isActive ? 'text-white' : 'text-slate-300'}`}>
                      {doc.title}
                    </div>
                    <div className="text-[11px] text-slate-500 flex items-center gap-2">
                      <span>{doc.annotations.length} highlights</span>
                      <span>•</span>
                      <span className="truncate">{doc.category}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Guide Card */}
          <div className="bg-gradient-to-br from-indigo-950/40 via-slate-900/60 to-purple-950/40 border border-indigo-500/20 rounded-2xl p-4 text-xs text-slate-300 space-y-2">
            <div className="font-semibold text-indigo-300 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Pro Student Tip
            </div>
            <p className="text-slate-400 leading-relaxed">
              Highlight any equation or paragraph with your mouse. The in-place AI toolbar will pop up directly over your text for instant zero-friction deep learning!
            </p>
          </div>
        </div>

        {/* Center: Interactive Document Canvas (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          {activeDoc ? (
            <div
              ref={readerContainerRef}
              className="relative bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl text-slate-200 min-h-[650px]"
            >
              {/* Document Header */}
              <div className="border-b border-slate-800 pb-5 mb-6">
                <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 uppercase tracking-wide mb-1">
                  <span>{activeDoc.category}</span>
                  <span>•</span>
                  <span>{activeDoc.subject}</span>
                </div>
                <h2 className="text-2xl font-bold text-white tracking-tight leading-snug">
                  {activeDoc.title}
                </h2>
                <div className="flex items-center gap-4 text-xs text-slate-400 mt-2">
                  <span>Author: {activeDoc.author}</span>
                  <span>•</span>
                  <span>{activeDoc.paragraphs.length} Paragraphs</span>
                  <span>•</span>
                  <span>{activeDoc.readTimeMinutes} min estimated reading</span>
                </div>
              </div>

              {/* Floating Contextual AI & Highlight Action Toolbar */}
              {floatingMenuPos && (
                <div
                  style={{
                    top: `${floatingMenuPos.y}px`,
                    left: `${floatingMenuPos.x}px`
                  }}
                  className="absolute z-30 flex items-center gap-1.5 p-1.5 bg-slate-950/95 backdrop-blur-xl border border-indigo-500/40 rounded-2xl shadow-2xl shadow-indigo-950/80 animate-in fade-in zoom-in-95 duration-150"
                >
                  <button
                    onClick={() => handleAiAction('EXPLAIN')}
                    className="flex items-center gap-1 px-2.5 py-1.5 bg-indigo-600/80 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition-all shadow-sm"
                    title="Explain Simply (ELI5)"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    Explain
                  </button>

                  <button
                    onClick={() => handleAiAction('SUMMARIZE')}
                    className="flex items-center gap-1 px-2 py-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded-xl text-xs font-medium transition-all"
                    title="Synthesize Key Takeaways"
                  >
                    <Layers className="w-3.5 h-3.5" />
                    Summarize
                  </button>

                  <button
                    onClick={() => handleAiAction('FLASHCARD')}
                    className="flex items-center gap-1 px-2 py-1.5 bg-slate-800 hover:bg-slate-700 text-purple-300 rounded-xl text-xs font-medium transition-all"
                    title="Convert to Active Recall Flashcard"
                  >
                    <BrainCircuit className="w-3.5 h-3.5" />
                    Flashcard
                  </button>

                  <button
                    onClick={() => handleAiAction('QUIZ')}
                    className="flex items-center gap-1 px-2 py-1.5 bg-slate-800 hover:bg-slate-700 text-emerald-300 rounded-xl text-xs font-medium transition-all"
                    title="Generate MCQ Practice Question"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    Quiz
                  </button>

                  <button
                    onClick={() => handleAiAction('TRANSLATE_HINDI')}
                    className="flex items-center gap-1 px-2 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded-xl text-xs font-medium transition-all"
                    title="Bilingual Hindi / Hinglish translation"
                  >
                    <Languages className="w-3.5 h-3.5" />
                    Hindi
                  </button>

                  <button
                    onClick={() => handleAiAction('SIMPLIFY_MATH')}
                    className="flex items-center gap-1 px-2 py-1.5 bg-slate-800 hover:bg-slate-700 text-rose-300 rounded-xl text-xs font-medium transition-all"
                    title="Step-by-Step Mathematical Derivation"
                  >
                    <Calculator className="w-3.5 h-3.5" />
                    Math
                  </button>

                  <div className="w-[1px] h-5 bg-slate-700 mx-0.5" />

                  {/* Color Pickers */}
                  <div className="flex items-center gap-1 px-1">
                    {(['yellow', 'emerald', 'cyan', 'rose', 'violet'] as DocumentAnnotationColor[]).map(c => (
                      <button
                        key={c}
                        onClick={() => {
                          setHighlightColor(c);
                          handleAddHighlight('HIGHLIGHT');
                        }}
                        className={`w-4 h-4 rounded-full transition-transform hover:scale-125 ${
                          c === 'yellow' ? 'bg-amber-400' :
                          c === 'emerald' ? 'bg-emerald-400' :
                          c === 'cyan' ? 'bg-cyan-400' :
                          c === 'rose' ? 'bg-rose-400' : 'bg-purple-400'
                        }`}
                        title={`Highlight with ${c}`}
                      />
                    ))}
                  </div>

                  <button
                    onClick={() => setShowNoteModal(true)}
                    className="p-1.5 bg-slate-800 hover:bg-slate-700 text-amber-400 rounded-xl text-xs transition-all"
                    title="Add Sticky Note"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Document Paragraphs Flow */}
              <div className="space-y-6 text-slate-300 leading-relaxed font-sans text-base">
                {activeDoc.paragraphs.map((para, idx) => {
                  const paraAnnotations = activeDoc.annotations.filter(a => a.paragraphIndex === idx);
                  return (
                    <div
                      key={idx}
                      onMouseUp={() => handleMouseUp(idx)}
                      className="group relative p-3 -mx-3 rounded-xl hover:bg-slate-800/30 transition-colors"
                    >
                      <span className="absolute -left-6 top-3 text-[10px] font-mono text-slate-600 select-none group-hover:text-slate-400">
                        P{idx + 1}
                      </span>
                      <p className="select-text whitespace-pre-wrap">
                        {para}
                      </p>

                      {/* Paragraph In-line Badges for Annotations */}
                      {paraAnnotations.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3 pt-2 border-t border-slate-800/60">
                          {paraAnnotations.map(ann => (
                            <span
                              key={ann.id}
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${getColorClasses(ann.color)}`}
                            >
                              <Highlighter className="w-3 h-3" />
                              <span className="truncate max-w-[160px]">"{ann.selectedText}"</span>
                              <button
                                onClick={() => handleDeleteAnnotation(ann.id)}
                                className="hover:opacity-75 ml-1"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400">
              No document selected. Choose one from the library or paste a new one!
            </div>
          )}
        </div>

        {/* Right Sidebar: Marginal Insights & Notes Drawer (3 cols) */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-xl">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-2 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                Marginal Insights ({activeDoc?.annotations.length || 0})
              </span>
            </h3>

            {activeDoc && activeDoc.annotations.length > 0 ? (
              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
                {activeDoc.annotations.map(ann => (
                  <div
                    key={ann.id}
                    className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-xl space-y-2 hover:border-slate-700 transition-all text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${getColorClasses(ann.color)}`}>
                        {ann.type}
                      </span>
                      <button
                        onClick={() => handleDeleteAnnotation(ann.id)}
                        className="text-slate-500 hover:text-rose-400 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-slate-300 font-medium italic border-l-2 border-slate-700 pl-2">
                      "{ann.selectedText}"
                    </div>

                    {ann.noteContent && (
                      <div className="text-amber-200/90 bg-amber-950/30 p-2 rounded-lg border border-amber-500/20">
                        {ann.noteContent}
                      </div>
                    )}

                    {ann.aiResponse && (
                      <div className="text-cyan-200/90 bg-cyan-950/30 p-2 rounded-lg border border-cyan-500/20 whitespace-pre-wrap font-mono text-[11px]">
                        {ann.aiResponse}
                      </div>
                    )}

                    <div className="text-[10px] text-slate-500">
                      Paragraph {ann.paragraphIndex + 1}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center text-slate-500 text-xs border border-dashed border-slate-800 rounded-xl">
                No marginal notes yet. Highlight any text in the reader to generate AI cards and highlights!
              </div>
            )}
          </div>
        </div>

      </div>

      {/* AI Action Result Modal */}
      {aiResultModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-indigo-500/40 rounded-2xl max-w-2xl w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-600/30 border border-indigo-500/50 flex items-center justify-center text-indigo-400">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">AI Annotation & Learning Assistant</h3>
                  <p className="text-xs text-slate-400">Action: {aiResultModal.action}</p>
                </div>
              </div>
              <button
                onClick={() => setAiResultModal(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800 text-xs text-slate-300 italic border-l-4 border-l-indigo-500">
              Selected text: "{aiResultModal.snippet}"
            </div>

            <div className="bg-slate-950/90 p-4 rounded-xl border border-indigo-500/20 text-slate-200 text-sm whitespace-pre-wrap leading-relaxed max-h-[350px] overflow-y-auto font-sans">
              {aiResultModal.text}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800">
              <button
                onClick={() => {
                  handleAddHighlight('AI_INSIGHT', undefined, aiResultModal.text);
                  setAiResultModal(null);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white rounded-xl text-xs font-semibold transition-all shadow-md"
              >
                <CheckCircle2 className="w-4 h-4" />
                Pin to Marginal Notes
              </button>
              <button
                onClick={() => setAiResultModal(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sticky Note Creation Modal */}
      {showNoteModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-amber-400" />
              Add Marginal Sticky Note
            </h3>
            <p className="text-xs text-slate-400 italic">
              "{selectedText}"
            </p>
            <textarea
              value={stickyNoteInput}
              onChange={e => setStickyNoteInput(e.target.value)}
              placeholder="Write your study note, doubt, or mnemonic here..."
              rows={4}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowNoteModal(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs"
              >
                Cancel
              </button>
              <button
                onClick={() => handleAddHighlight('NOTE', stickyNoteInput)}
                disabled={!stickyNoteInput.trim()}
                className="px-4 py-2 bg-gradient-to-r from-amber-600 to-indigo-600 text-white rounded-xl text-xs font-semibold disabled:opacity-50"
              >
                Save Note
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Document Modal */}
      {showNewDocModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-cyan-400" />
                Paste Lecture Notes / PDF Text
              </h3>
              <button onClick={() => setShowNewDocModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateDocument} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-400">Document Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Thermodynamics - Second Law & Carnot Cycle"
                  value={newDocForm.title}
                  onChange={e => setNewDocForm({ ...newDocForm, title: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-sm text-slate-200 mt-1 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-400">Subject</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Physics / Polity"
                    value={newDocForm.subject}
                    onChange={e => setNewDocForm({ ...newDocForm, subject: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-sm text-slate-200 mt-1 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-400">Category / Exam</label>
                  <input
                    type="text"
                    placeholder="e.g. JEE Advanced"
                    value={newDocForm.category}
                    onChange={e => setNewDocForm({ ...newDocForm, category: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-sm text-slate-200 mt-1 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400">Text Content (Separate paragraphs by blank lines)</label>
                <textarea
                  required
                  rows={6}
                  placeholder="Paste textbook chapter, PDF lecture extract, or research abstract here..."
                  value={newDocForm.text}
                  onChange={e => setNewDocForm({ ...newDocForm, text: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-slate-200 mt-1 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewDocModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-cyan-600 to-indigo-600 text-white rounded-xl text-xs font-semibold shadow-md"
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
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900/95 border border-indigo-500/50 rounded-2xl p-4 shadow-2xl flex items-center gap-3 animate-bounce">
          <div className="w-5 h-5 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs font-semibold text-indigo-300">AI Thinking & Synthesizing Annotation...</span>
        </div>
      )}
    </div>
  );
};
export default SmartDocumentAnnotatorView;
