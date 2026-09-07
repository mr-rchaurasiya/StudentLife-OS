import React, { useState, useEffect, useRef } from 'react';
import {
  Palette,
  Sparkles,
  Square,
  Circle,
  MoveRight,
  Type,
  Diamond,
  Trash2,
  Download
} from 'lucide-react';
import {
  WhiteboardDiagram,
  WhiteboardElement,
  AiDiagramRequestDto
} from '@studentlife/shared';

interface AiWhiteboardStudioViewProps {
  onAddXp?: (xp: number, reason: string) => void;
}

export const AiWhiteboardStudioView: React.FC<AiWhiteboardStudioViewProps> = ({ onAddXp }) => {
  const [diagrams, setDiagrams] = useState<WhiteboardDiagram[]>([]);
  const [activeDiagram, setActiveDiagram] = useState<WhiteboardDiagram | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedTool, setSelectedTool] = useState<'RECTANGLE' | 'CIRCLE' | 'ARROW' | 'TEXT' | 'DIAMOND'>('RECTANGLE');
  const [selectedColor, setSelectedColor] = useState<string>('#38bdf8');
  const [aiTopicInput, setAiTopicInput] = useState<string>('Database Sharding & Read Replicas');
  const [aiTypeInput, setAiTypeInput] = useState<'FLOWCHART' | 'ARCHITECTURE' | 'ALGORITHM_TREE' | 'CONCEPT_MAP'>('ARCHITECTURE');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [showAiModal, setShowAiModal] = useState<boolean>(false);
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    fetchDiagrams();
  }, []);

  const fetchDiagrams = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/ai-whiteboard/diagrams');
      const data = await res.json();
      if (data.success && data.data) {
        setDiagrams(data.data);
        if (data.data.length > 0) {
          setActiveDiagram(data.data[0]);
        }
      }
    } catch (err) {
      console.error('Failed to fetch whiteboard diagrams', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCanvasClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!activeDiagram || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const x = Math.round(e.clientX - rect.left);
    const y = Math.round(e.clientY - rect.top);

    const newElement: WhiteboardElement = {
      id: `el-${Date.now()}`,
      type: selectedTool,
      x: Math.max(20, x - 50),
      y: Math.max(20, y - 25),
      width: selectedTool === 'ARROW' ? 80 : 120,
      height: selectedTool === 'ARROW' ? 2 : selectedTool === 'CIRCLE' ? 80 : 50,
      text: selectedTool === 'TEXT' ? 'Click to edit' : selectedTool.toLowerCase(),
      color: selectedColor,
      fill: `${selectedColor}22`
    };

    const updatedElements = [...activeDiagram.elements, newElement];
    const updatedDiagram: WhiteboardDiagram = {
      ...activeDiagram,
      elements: updatedElements
    };

    setActiveDiagram(updatedDiagram);
    setDiagrams(prev => prev.map(d => d.id === updatedDiagram.id ? updatedDiagram : d));
  };

  const handleGenerateAiDiagram = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsGenerating(true);
      const dto: AiDiagramRequestDto = {
        topic: aiTopicInput,
        diagramType: aiTypeInput
      };
      const res = await fetch('/api/ai-whiteboard/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dto)
      });
      const data = await res.json();
      if (data.success && data.data) {
        setDiagrams(prev => [data.data, ...prev]);
        setActiveDiagram(data.data);
        setShowAiModal(false);
        onAddXp?.(30, 'Synthesized AI Architecture Diagram');
      }
    } catch (err) {
      console.error('Failed to generate AI diagram', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleClearCanvas = () => {
    if (!activeDiagram) return;
    const updated: WhiteboardDiagram = { ...activeDiagram, elements: [] };
    setActiveDiagram(updated);
    setDiagrams(prev => prev.map(d => d.id === updated.id ? updated : d));
  };

  const handleDownloadSvg = () => {
    if (!svgRef.current || !activeDiagram) return;
    const svgData = new XMLSerializer().serializeToString(svgRef.current);
    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeDiagram.title.replace(/\s+/g, '_')}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (isLoading || !activeDiagram) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
        <Palette size={36} className="animate-pulse" style={{ margin: '0 auto 16px', color: 'var(--accent-primary)' }} />
        <p>Loading AI Collaborative Whiteboard Engine...</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top Banner */}
      <div className="glass-panel" style={{
        padding: '20px 28px',
        background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.9) 100%)',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '16px'
      }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span className="badge badge-active" style={{ backgroundColor: 'rgba(56, 189, 248, 0.2)', color: '#38bdf8' }}>
              <Sparkles size={12} /> PHASE 47 &bull; AI VECTOR CANVAS
            </span>
            <span className="badge badge-completed">Excalidraw Compatible</span>
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>
            AI Collaborative Whiteboard <span className="gradient-text">& Flowcharts 🎨</span>
          </h2>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setShowAiModal(true)}
            className="btn btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}
          >
            <Sparkles size={14} /> AI Auto-Diagram
          </button>
          <button
            onClick={handleDownloadSvg}
            className="btn btn-secondary"
            style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}
          >
            <Download size={14} /> Export SVG
          </button>
          <button
            onClick={handleClearCanvas}
            className="btn btn-ghost"
            style={{ color: '#ef4444', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}
          >
            <Trash2 size={14} /> Clear
          </button>
        </div>
      </div>

      {/* Toolbar & Canvas Container */}
      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '20px' }}>
        {/* Left Toolbar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Tool Selector */}
          <div className="glass-panel" style={{ padding: '18px' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '12px' }}>
              CANVAS SHAPES
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              {[
                { type: 'RECTANGLE', label: 'Box', icon: Square },
                { type: 'CIRCLE', label: 'Circle', icon: Circle },
                { type: 'ARROW', label: 'Arrow', icon: MoveRight },
                { type: 'DIAMOND', label: 'Decision', icon: Diamond },
                { type: 'TEXT', label: 'Text', icon: Type }
              ].map(tool => {
                const IconComponent = tool.icon;
                const isSelected = selectedTool === tool.type;
                return (
                  <button
                    key={tool.type}
                    onClick={() => setSelectedTool(tool.type as any)}
                    style={{
                      padding: '10px',
                      borderRadius: 'var(--radius-sm)',
                      border: isSelected ? '1px solid var(--accent-primary)' : '1px solid var(--border-glass)',
                      backgroundColor: isSelected ? 'rgba(99, 102, 241, 0.2)' : 'rgba(15, 23, 42, 0.6)',
                      color: isSelected ? '#ffffff' : 'var(--text-secondary)',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '0.75rem',
                      fontWeight: 600
                    }}
                  >
                    <IconComponent size={16} />
                    {tool.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Color Palette */}
          <div className="glass-panel" style={{ padding: '18px' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '12px' }}>
              PALETTE ACCENT
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {['#38bdf8', '#818cf8', '#34d399', '#f472b6', '#fbbf24', '#f87171', '#c084fc'].map(color => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    backgroundColor: color,
                    border: selectedColor === color ? '2px solid #ffffff' : 'none',
                    cursor: 'pointer',
                    boxShadow: selectedColor === color ? `0 0 10px ${color}` : 'none'
                  }}
                />
              ))}
            </div>
          </div>

          {/* Diagram Selector List */}
          <div className="glass-panel" style={{ padding: '18px' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '12px' }}>
              SAVED DIAGRAMS
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {diagrams.map(diag => (
                <div
                  key={diag.id}
                  onClick={() => setActiveDiagram(diag)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: activeDiagram.id === diag.id ? 'rgba(99, 102, 241, 0.2)' : 'rgba(15, 23, 42, 0.5)',
                    border: activeDiagram.id === diag.id ? '1px solid var(--accent-primary)' : '1px solid var(--border-glass)',
                    cursor: 'pointer',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: activeDiagram.id === diag.id ? '#ffffff' : 'var(--text-secondary)',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {diag.title}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Interactive SVG Whiteboard Canvas */}
        <div
          className="glass-panel"
          style={{
            padding: '16px',
            minHeight: '520px',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: 'rgba(9, 13, 22, 0.95)',
            position: 'relative'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', padding: '0 8px' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: 700 }}>
              {activeDiagram.title} <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>({activeDiagram.elements.length} elements)</span>
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Click anywhere on canvas to place {selectedTool.toLowerCase()}
            </span>
          </div>

          <div
            style={{
              flex: 1,
              width: '100%',
              minHeight: '460px',
              backgroundColor: '#070b14',
              borderRadius: 'var(--radius-md)',
              border: '1px dashed rgba(255, 255, 255, 0.1)',
              overflow: 'hidden',
              cursor: 'crosshair',
              position: 'relative'
            }}
          >
            <svg
              ref={svgRef}
              onClick={handleCanvasClick}
              width="100%"
              height="100%"
              style={{ minHeight: '460px' }}
            >
              {/* Grid Background Pattern */}
              <defs>
                <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
                  <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                </pattern>
                <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#94a3b8" />
                </marker>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />

              {/* Render Elements */}
              {activeDiagram.elements.map((el) => {
                if (el.type === 'RECTANGLE') {
                  return (
                    <g key={el.id}>
                      <rect
                        x={el.x}
                        y={el.y}
                        width={el.width || 120}
                        height={el.height || 50}
                        rx="8"
                        fill={el.fill || `${el.color}22`}
                        stroke={el.color}
                        strokeWidth="2"
                      />
                      <text
                        x={el.x + (el.width || 120) / 2}
                        y={el.y + (el.height || 50) / 2 + 4}
                        textAnchor="middle"
                        fill="#ffffff"
                        fontSize="12"
                        fontWeight="600"
                        fontFamily="var(--font-sans)"
                      >
                        {el.text}
                      </text>
                    </g>
                  );
                }
                if (el.type === 'CIRCLE') {
                  const radius = (el.width || 80) / 2;
                  return (
                    <g key={el.id}>
                      <circle
                        cx={el.x + radius}
                        cy={el.y + radius}
                        r={radius}
                        fill={el.fill || `${el.color}22`}
                        stroke={el.color}
                        strokeWidth="2"
                      />
                      <text
                        x={el.x + radius}
                        y={el.y + radius + 4}
                        textAnchor="middle"
                        fill="#ffffff"
                        fontSize="11"
                        fontWeight="600"
                        fontFamily="var(--font-sans)"
                      >
                        {el.text}
                      </text>
                    </g>
                  );
                }
                if (el.type === 'ARROW') {
                  return (
                    <g key={el.id}>
                      <line
                        x1={el.x}
                        y1={el.y}
                        x2={el.x + (el.width || 80)}
                        y2={el.y + (el.height || 0)}
                        stroke={el.color}
                        strokeWidth="2"
                        markerEnd="url(#arrow)"
                      />
                      {el.text && (
                        <text
                          x={el.x + (el.width || 80) / 2}
                          y={el.y - 6}
                          textAnchor="middle"
                          fill="#94a3b8"
                          fontSize="10"
                          fontFamily="var(--font-sans)"
                        >
                          {el.text}
                        </text>
                      )}
                    </g>
                  );
                }
                if (el.type === 'DIAMOND') {
                  const w = el.width || 120;
                  const h = el.height || 70;
                  const points = `${el.x + w/2},${el.y} ${el.x + w},${el.y + h/2} ${el.x + w/2},${el.y + h} ${el.x},${el.y + h/2}`;
                  return (
                    <g key={el.id}>
                      <polygon
                        points={points}
                        fill={el.fill || `${el.color}22`}
                        stroke={el.color}
                        strokeWidth="2"
                      />
                      <text
                        x={el.x + w/2}
                        y={el.y + h/2 + 4}
                        textAnchor="middle"
                        fill="#ffffff"
                        fontSize="11"
                        fontWeight="600"
                        fontFamily="var(--font-sans)"
                      >
                        {el.text}
                      </text>
                    </g>
                  );
                }
                return (
                  <text
                    key={el.id}
                    x={el.x}
                    y={el.y}
                    fill={el.color}
                    fontSize="14"
                    fontWeight="700"
                    fontFamily="var(--font-sans)"
                  >
                    {el.text}
                  </text>
                );
              })}
            </svg>
          </div>
        </div>
      </div>

      {/* AI Synthesizer Modal */}
      {showAiModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '520px', padding: '32px' }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '8px' }}>
              Synthesize AI Whiteboard Diagram ✨
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>
              Describe an architecture, algorithm, or syllabus concept to generate an editable vector diagram.
            </p>

            <form onSubmit={handleGenerateAiDiagram} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                  Topic / Concept
                </label>
                <input
                  type="text"
                  value={aiTopicInput}
                  onChange={(e) => setAiTopicInput(e.target.value)}
                  className="glass-input"
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-md)' }}
                  placeholder="e.g. Distributed Tracing in Kubernetes"
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                  Diagram Blueprint Type
                </label>
                <select
                  value={aiTypeInput}
                  onChange={(e) => setAiTypeInput(e.target.value as any)}
                  className="glass-input"
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-md)' }}
                >
                  <option value="ARCHITECTURE">System Architecture</option>
                  <option value="FLOWCHART">Sequential Flowchart</option>
                  <option value="ALGORITHM_TREE">Data Structure / Algorithm Tree</option>
                  <option value="CONCEPT_MAP">Conceptual Node Map</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
                <button
                  type="button"
                  onClick={() => setShowAiModal(false)}
                  className="btn btn-secondary"
                  style={{ padding: '8px 18px', fontSize: '0.85rem' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isGenerating}
                  className="btn btn-primary"
                  style={{ padding: '8px 20px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Sparkles size={14} />
                  {isGenerating ? 'Generating...' : 'Generate Blueprint'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
