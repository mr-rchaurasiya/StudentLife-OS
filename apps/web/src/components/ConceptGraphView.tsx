import React, { useState, useEffect } from 'react';
import {
  SubjectKnowledgeGraph,
  ConceptNode,
  MasteryLevel
} from '@studentlife/shared';
import {
  Brain,
  Sparkles,
  Zap,
  CheckCircle2,
  FileText,
  Mic,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Activity
} from 'lucide-react';

interface ConceptGraphViewProps {
  onAddXp?: (xp: number, reason: string) => void;
  onNavigateView?: (view: string) => void;
}

const FALLBACK_GRAPH: SubjectKnowledgeGraph = {
  subjectId: 'dsa',
  subjectName: 'Algorithms & Data Structures (GATE & FAANG)',
  overallMasteryPercent: 78,
  nodes: [
    {
      id: 'node-arrays',
      label: 'Arrays & Two Pointers',
      subject: 'DSA',
      category: 'Fundamentals',
      mastery: 'MASTERED',
      weightagePercent: 12,
      x: 100,
      y: 200,
      formulaSummary: 'Sliding window window_size = R - L + 1, O(N) amortized',
      pyqCount: 45,
      keyTakeaways: ['Prefix Sums', 'Kadane Algorithm', 'Two Pointer Collisions']
    },
    {
      id: 'node-recursion',
      label: 'Recursion & Backtracking',
      subject: 'DSA',
      category: 'Core Logic',
      mastery: 'MASTERED',
      weightagePercent: 15,
      x: 280,
      y: 120,
      formulaSummary: 'T(N) = a T(N/b) + f(N) (Master Theorem)',
      pyqCount: 38,
      keyTakeaways: ['Call Stack Visualization', 'Subsets & Permutations', 'Pruning Branches']
    },
    {
      id: 'node-trees',
      label: 'Binary Trees & BST',
      subject: 'DSA',
      category: 'Non-Linear Structures',
      mastery: 'MASTERED',
      weightagePercent: 18,
      x: 460,
      y: 100,
      formulaSummary: 'Height = O(log N) balanced, Inorder BST is sorted',
      pyqCount: 52,
      keyTakeaways: ['LCA (Lowest Common Ancestor)', 'Tree Traversals DFS/BFS', 'Diameter of Tree']
    },
    {
      id: 'node-graphs',
      label: 'Graph Algorithms',
      subject: 'DSA',
      category: 'Advanced Structures',
      mastery: 'REVISING',
      weightagePercent: 22,
      x: 640,
      y: 160,
      formulaSummary: 'Dijkstra O((V + E) log V), Bellman-Ford O(V * E)',
      pyqCount: 64,
      keyTakeaways: ['Topological Sort (Kahn)', 'Shortest Paths', 'Disjoint Set Union (DSU)']
    },
    {
      id: 'node-dp',
      label: 'Dynamic Programming',
      subject: 'DSA',
      category: 'Optimization',
      mastery: 'REVISING',
      weightagePercent: 25,
      x: 480,
      y: 300,
      formulaSummary: 'Optimal Substructure + Overlapping Subproblems',
      pyqCount: 78,
      keyTakeaways: ['0/1 Knapsack Pattern', 'Longest Common Subsequence', 'Matrix Chain Multiplication']
    },
    {
      id: 'node-tree-dp',
      label: 'DP on Trees & Re-Rooting',
      subject: 'DSA',
      category: 'Expert Competitive',
      mastery: 'UNEXPLORED',
      weightagePercent: 8,
      x: 720,
      y: 320,
      formulaSummary: 'DP[u] aggregated from children + Re-rooting in O(N)',
      pyqCount: 18,
      keyTakeaways: ['Subtree Size Counting', 'Tree Distances Sum', 'In-Out DP States']
    }
  ],
  edges: [
    { id: 'e1', from: 'node-arrays', to: 'node-recursion', type: 'PREREQUISITE', label: 'Base Recursion' },
    { id: 'e2', from: 'node-recursion', to: 'node-trees', type: 'PREREQUISITE', label: 'Tree DFS' },
    { id: 'e3', from: 'node-trees', to: 'node-graphs', type: 'PREREQUISITE', label: 'General Graph' },
    { id: 'e4', from: 'node-recursion', to: 'node-dp', type: 'PREREQUISITE', label: 'Memoization' },
    { id: 'e5', from: 'node-trees', to: 'node-tree-dp', type: 'PREREQUISITE', label: 'Tree Structure' },
    { id: 'e6', from: 'node-dp', to: 'node-tree-dp', type: 'APPLICATION', label: 'Tree Recurrence' },
    { id: 'e7', from: 'node-graphs', to: 'node-dp', type: 'CORRELATED', label: 'DAG Shortest Path' }
  ]
};

export const ConceptGraphView: React.FC<ConceptGraphViewProps> = ({
  onAddXp,
  onNavigateView
}) => {
  const [selectedSubject, setSelectedSubject] = useState<string>('dsa');
  const [graphData, setGraphData] = useState<SubjectKnowledgeGraph>(FALLBACK_GRAPH);
  const [selectedNode, setSelectedNode] = useState<ConceptNode | null>(FALLBACK_GRAPH.nodes[0]);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [masteryFilter, setMasteryFilter] = useState<'ALL' | MasteryLevel>('ALL');

  useEffect(() => {
    fetch(`/api/concept-graph/${selectedSubject}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setGraphData(data.data);
          setSelectedNode(data.data.nodes[0] || null);
        }
      })
      .catch(() => {});
  }, [selectedSubject]);

  const handleUpdateMastery = (nodeId: string, newMastery: MasteryLevel) => {
    setGraphData((prev) => ({
      ...prev,
      nodes: prev.nodes.map((n) => (n.id === nodeId ? { ...n, mastery: newMastery } : n))
    }));

    if (selectedNode?.id === nodeId) {
      setSelectedNode((prev) => (prev ? { ...prev, mastery: newMastery } : null));
    }

    if (newMastery === 'MASTERED') {
      onAddXp?.(30, `Mastered Concept: ${selectedNode?.label}`);
    }

    fetch(`/api/concept-graph/${selectedSubject}/nodes/${nodeId}/mastery`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mastery: newMastery })
    }).catch(() => {});
  };

  const filteredNodes = graphData.nodes.filter(
    (n) => masteryFilter === 'ALL' || n.mastery === masteryFilter
  );

  const getNodeColor = (mastery: MasteryLevel) => {
    switch (mastery) {
      case 'MASTERED':
        return '#10b981'; // Emerald
      case 'REVISING':
        return '#f59e0b'; // Amber
      case 'UNEXPLORED':
        return '#8b5cf6'; // Purple
      default:
        return '#6366f1';
    }
  };

  const masteredCount = graphData.nodes.filter((n) => n.mastery === 'MASTERED').length;
  const revisingCount = graphData.nodes.filter((n) => n.mastery === 'REVISING').length;
  const unexploredCount = graphData.nodes.filter((n) => n.mastery === 'UNEXPLORED').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '60px' }}>
      {/* Top Banner */}
      <div
        style={{
          position: 'relative',
          borderRadius: '24px',
          overflow: 'hidden',
          background: 'linear-gradient(135deg, rgba(30, 27, 75, 0.8) 0%, rgba(15, 23, 42, 0.95) 50%, rgba(49, 46, 129, 0.6) 100%)',
          border: '1px solid rgba(99, 102, 241, 0.25)',
          padding: '28px 32px',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
          backdropFilter: 'blur(16px)'
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
            background: 'radial-gradient(circle, rgba(99, 102, 241, 0.2) 0%, rgba(0, 0, 0, 0) 70%)',
            pointerEvents: 'none'
          }}
        />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px', position: 'relative', zIndex: 1 }}>
          <div style={{ maxWidth: '720px' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '4px 12px',
                borderRadius: '9999px',
                fontSize: '0.75rem',
                fontWeight: 700,
                backgroundColor: 'rgba(99, 102, 241, 0.15)',
                color: '#a5b4fc',
                border: '1px solid rgba(99, 102, 241, 0.35)',
                marginBottom: '12px'
              }}
            >
              <Brain size={14} color="#818cf8" style={{ animation: 'pulse 2s infinite' }} />
              Phase 32 &bull; 3D Mind Maps & Concept Knowledge Graph
            </div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em', margin: '0 0 8px 0' }}>
              Interactive Knowledge Graph 🕸️
            </h1>
            <p style={{ fontSize: '0.92rem', color: '#94a3b8', lineHeight: 1.5, margin: 0 }}>
              Visualize how complex topics connect through prerequisites, exam weightages, and mastery levels. Click any node for instant formulas, takeaways, and active recall bridges.
            </p>
          </div>

          {/* Subject Switcher Pills */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: 'rgba(15, 23, 42, 0.8)',
              padding: '6px',
              borderRadius: '16px',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          >
            <button
              onClick={() => setSelectedSubject('dsa')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 18px',
                borderRadius: '12px',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s',
                border: selectedSubject === 'dsa' ? '1px solid #818cf8' : '1px solid transparent',
                backgroundColor: selectedSubject === 'dsa' ? 'rgba(99, 102, 241, 0.25)' : 'transparent',
                color: selectedSubject === 'dsa' ? '#ffffff' : '#94a3b8',
                boxShadow: selectedSubject === 'dsa' ? '0 4px 16px rgba(99, 102, 241, 0.3)' : 'none'
              }}
            >
              💻 Algorithms & DSA
            </button>
            <button
              onClick={() => setSelectedSubject('physics')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 18px',
                borderRadius: '12px',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s',
                border: selectedSubject === 'physics' ? '1px solid #818cf8' : '1px solid transparent',
                backgroundColor: selectedSubject === 'physics' ? 'rgba(99, 102, 241, 0.25)' : 'transparent',
                color: selectedSubject === 'physics' ? '#ffffff' : '#94a3b8',
                boxShadow: selectedSubject === 'physics' ? '0 4px 16px rgba(99, 102, 241, 0.3)' : 'none'
              }}
            >
              ⚡ Calculus & Physics
            </button>
          </div>
        </div>

        {/* Mastery Overview Strip */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '14px',
            marginTop: '24px',
            paddingTop: '20px',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)'
          }}
        >
          <div
            style={{
              padding: '14px 18px',
              borderRadius: '16px',
              backgroundColor: 'rgba(15, 23, 42, 0.6)',
              border: '1px solid rgba(99, 102, 241, 0.2)',
              display: 'flex',
              alignItems: 'center',
              gap: '14px'
            }}
          >
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                backgroundColor: 'rgba(99, 102, 241, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Brain size={20} color="#818cf8" />
            </div>
            <div>
              <span style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em' }}>
                Total Nodes
              </span>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff' }}>
                {graphData.nodes.length} Concepts
              </div>
            </div>
          </div>

          <div
            style={{
              padding: '14px 18px',
              borderRadius: '16px',
              backgroundColor: 'rgba(15, 23, 42, 0.6)',
              border: '1px solid rgba(16, 185, 129, 0.25)',
              display: 'flex',
              alignItems: 'center',
              gap: '14px'
            }}
          >
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                backgroundColor: 'rgba(16, 185, 129, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <CheckCircle2 size={20} color="#10b981" />
            </div>
            <div>
              <span style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em' }}>
                Mastered
              </span>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#10b981' }}>
                {masteredCount} Topics
              </div>
            </div>
          </div>

          <div
            style={{
              padding: '14px 18px',
              borderRadius: '16px',
              backgroundColor: 'rgba(15, 23, 42, 0.6)',
              border: '1px solid rgba(245, 158, 11, 0.25)',
              display: 'flex',
              alignItems: 'center',
              gap: '14px'
            }}
          >
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                backgroundColor: 'rgba(245, 158, 11, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <RotateCcw size={20} color="#f59e0b" />
            </div>
            <div>
              <span style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em' }}>
                Under Revision
              </span>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f59e0b' }}>
                {revisingCount} Topics
              </div>
            </div>
          </div>

          <div
            style={{
              padding: '14px 18px',
              borderRadius: '16px',
              backgroundColor: 'rgba(15, 23, 42, 0.6)',
              border: '1px solid rgba(139, 92, 246, 0.25)',
              display: 'flex',
              alignItems: 'center',
              gap: '14px'
            }}
          >
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                backgroundColor: 'rgba(139, 92, 246, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Activity size={20} color="#a855f7" />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em' }}>
                  Domain Mastery
                </span>
                <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#a855f7' }}>
                  {graphData.overallMasteryPercent}%
                </span>
              </div>
              <div
                style={{
                  width: '100%',
                  height: '6px',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '9999px',
                  marginTop: '6px',
                  overflow: 'hidden'
                }}
              >
                <div
                  style={{
                    width: `${graphData.overallMasteryPercent}%`,
                    height: '100%',
                    background: 'linear-gradient(90deg, #6366f1 0%, #10b981 100%)',
                    borderRadius: '9999px'
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Graph Stage & Inspector Sidebar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
        {/* Left Column: Interactive Graph Canvas */}
        <div
          style={{
            gridColumn: 'span 2',
            backgroundColor: 'rgba(15, 23, 42, 0.85)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '24px',
            padding: '20px 24px',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
            display: 'flex',
            flexDirection: 'column',
            height: '660px',
            backdropFilter: 'blur(16px)'
          }}
        >
          {/* Controls Toolbar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingBottom: '14px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              zIndex: 10
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 700 }}>Filter Mastery:</span>
              <div style={{ display: 'flex', gap: '6px' }}>
                {(['ALL', 'MASTERED', 'REVISING', 'UNEXPLORED'] as const).map((lvl) => {
                  const isActive = masteryFilter === lvl;
                  let color = '#818cf8';
                  let activeBg = 'rgba(99, 102, 241, 0.25)';
                  let activeBorder = '1px solid #818cf8';
                  let label: string = lvl;
                  if (lvl === 'ALL') label = 'ALL (' + graphData.nodes.length + ')';
                  if (lvl === 'MASTERED') {
                    color = '#10b981';
                    activeBg = 'rgba(16, 185, 129, 0.25)';
                    activeBorder = '1px solid #10b981';
                    label = `MASTERED (${masteredCount})`;
                  }
                  if (lvl === 'REVISING') {
                    color = '#f59e0b';
                    activeBg = 'rgba(245, 158, 11, 0.25)';
                    activeBorder = '1px solid #f59e0b';
                    label = `REVISING (${revisingCount})`;
                  }
                  if (lvl === 'UNEXPLORED') {
                    color = '#a855f7';
                    activeBg = 'rgba(168, 85, 247, 0.25)';
                    activeBorder = '1px solid #a855f7';
                    label = `UNEXPLORED (${unexploredCount})`;
                  }

                  return (
                    <button
                      key={lvl}
                      onClick={() => setMasteryFilter(lvl)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '10px',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        border: isActive ? activeBorder : '1px solid rgba(255, 255, 255, 0.08)',
                        backgroundColor: isActive ? activeBg : 'rgba(2, 6, 23, 0.6)',
                        color: isActive ? color : '#94a3b8'
                      }}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Zoom Controls */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600, marginRight: '4px' }}>
                {Math.round(zoomLevel * 100)}%
              </span>
              <button
                onClick={() => setZoomLevel((z) => Math.min(1.6, z + 0.1))}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#cbd5e1',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.15s'
                }}
                title="Zoom In"
              >
                <ZoomIn size={15} />
              </button>
              <button
                onClick={() => setZoomLevel((z) => Math.max(0.6, z - 0.1))}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#cbd5e1',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.15s'
                }}
                title="Zoom Out"
              >
                <ZoomOut size={15} />
              </button>
              <button
                onClick={() => setZoomLevel(1)}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#cbd5e1',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.15s'
                }}
                title="Reset Zoom"
              >
                <RotateCcw size={15} />
              </button>
            </div>
          </div>

          {/* SVG Canvas Area */}
          <div
            style={{
              flex: 1,
              position: 'relative',
              overflow: 'hidden',
              backgroundColor: '#020617',
              backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(30, 41, 59, 0.5) 0%, rgba(2, 6, 23, 0.98) 100%)',
              borderRadius: '18px',
              marginTop: '16px',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <svg
              style={{
                width: '100%',
                height: '100%',
                cursor: 'grab',
                transform: `scale(${zoomLevel})`,
                transition: 'transform 0.2s ease-out'
              }}
              viewBox="0 0 850 450"
            >
              {/* Defs for Gradients & Markers */}
              <defs>
                {/* Arrow Marker */}
                <marker
                  id="arrow"
                  viewBox="0 0 10 10"
                  refX="18"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#6366f1" opacity="0.8" />
                </marker>

                {/* Subtle Grid Pattern */}
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255, 255, 255, 0.03)" strokeWidth="1" />
                  <circle cx="0" cy="0" r="1.5" fill="rgba(99, 102, 241, 0.12)" />
                </pattern>
              </defs>

              {/* Grid Background */}
              <rect width="100%" height="100%" fill="url(#grid)" />

              {/* Connecting Edges */}
              {graphData.edges.map((edge) => {
                const source = graphData.nodes.find((n) => n.id === edge.from);
                const target = graphData.nodes.find((n) => n.id === edge.to);
                if (!source || !target) return null;

                return (
                  <g key={edge.id}>
                    <line
                      x1={source.x}
                      y1={source.y}
                      x2={target.x}
                      y2={target.y}
                      stroke="#4f46e5"
                      strokeWidth="2.5"
                      strokeDasharray={edge.type === 'APPLICATION' ? '5 5' : 'none'}
                      opacity="0.65"
                      markerEnd="url(#arrow)"
                    />
                    {edge.label && (
                      <g>
                        <rect
                          x={(source.x + target.x) / 2 - (edge.label.length * 3.5 + 8)}
                          y={(source.y + target.y) / 2 - 17}
                          width={edge.label.length * 7 + 16}
                          height="18"
                          rx="9"
                          fill="rgba(15, 23, 42, 0.85)"
                          stroke="rgba(99, 102, 241, 0.3)"
                          strokeWidth="1"
                        />
                        <text
                          x={(source.x + target.x) / 2}
                          y={(source.y + target.y) / 2 - 5}
                          fill="#c7d2fe"
                          fontSize="9.5"
                          fontWeight="600"
                          textAnchor="middle"
                          fontFamily="monospace"
                        >
                          {edge.label}
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}

              {/* Concept Nodes */}
              {filteredNodes.map((node) => {
                const isSelected = selectedNode?.id === node.id;
                const nodeColor = getNodeColor(node.mastery);

                return (
                  <g
                    key={node.id}
                    onClick={() => setSelectedNode(node)}
                    style={{ cursor: 'pointer' }}
                  >
                    {/* Pulsing Outer Halo for Selected Node */}
                    {isSelected && (
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r={34}
                        fill={nodeColor}
                        opacity="0.18"
                      />
                    )}

                    {/* Outer Glow Ring */}
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={isSelected ? 26 : 21}
                      fill={nodeColor}
                      opacity={isSelected ? 0.45 : 0.2}
                    />

                    {/* Central Core */}
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={isSelected ? 16 : 13}
                      fill="#0b1120"
                      stroke={nodeColor}
                      strokeWidth={isSelected ? 3.5 : 2}
                    />

                    {/* Label Badge Container */}
                    <text
                      x={node.x}
                      y={node.y + 36}
                      fill={isSelected ? '#ffffff' : '#e2e8f0'}
                      fontSize="11"
                      fontWeight={isSelected ? '800' : '700'}
                      textAnchor="middle"
                      style={{
                        userSelect: 'none',
                        textShadow: '0 2px 8px rgba(0, 0, 0, 0.8)'
                      }}
                    >
                      {node.label}
                    </text>

                    {/* Weightage Subtitle */}
                    <text
                      x={node.x}
                      y={node.y + 49}
                      fill="#94a3b8"
                      fontSize="9"
                      fontWeight="500"
                      textAnchor="middle"
                      fontFamily="monospace"
                      style={{ userSelect: 'none' }}
                    >
                      {node.weightagePercent}% Weight &bull; {node.pyqCount} PYQs
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Bottom Tip Overlay */}
            <div
              style={{
                position: 'absolute',
                bottom: '12px',
                right: '16px',
                padding: '4px 12px',
                borderRadius: '8px',
                backgroundColor: 'rgba(15, 23, 42, 0.75)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                fontSize: '0.72rem',
                color: '#94a3b8',
                pointerEvents: 'none'
              }}
            >
              💡 Click any node to inspect blueprint & start drills
            </div>
          </div>
        </div>

        {/* Right Column: Node Inspector & Practice Launcher */}
        <div
          style={{
            backgroundColor: 'rgba(15, 23, 42, 0.85)',
            border: '1px solid rgba(99, 102, 241, 0.25)',
            borderRadius: '24px',
            padding: '24px',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: '660px',
            backdropFilter: 'blur(16px)',
            overflowY: 'auto'
          }}
        >
          {selectedNode ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Header */}
              <div style={{ paddingBottom: '14px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span
                    style={{
                      padding: '3px 10px',
                      borderRadius: '9999px',
                      fontSize: '0.7rem',
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      backgroundColor: 'rgba(99, 102, 241, 0.15)',
                      color: '#a5b4fc',
                      border: '1px solid rgba(99, 102, 241, 0.35)'
                    }}
                  >
                    {selectedNode.category}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontFamily: 'monospace', fontWeight: 600 }}>
                    {selectedNode.pyqCount} Solved PYQs
                  </span>
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
                  {selectedNode.label}
                </h3>
              </div>

              {/* Mastery Level Toggle */}
              <div
                style={{
                  padding: '14px',
                  borderRadius: '16px',
                  backgroundColor: 'rgba(2, 6, 23, 0.7)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}
              >
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Mastery State:
                </span>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
                  {(['MASTERED', 'REVISING', 'UNEXPLORED'] as const).map((m) => {
                    const isSelected = selectedNode.mastery === m;
                    let activeBg = '#10b981';
                    let label = 'MASTERED';
                    if (m === 'REVISING') {
                      activeBg = '#f59e0b';
                      label = 'REVISING';
                    }
                    if (m === 'UNEXPLORED') {
                      activeBg = '#8b5cf6';
                      label = 'UNEXPLORED';
                    }

                    return (
                      <button
                        key={m}
                        onClick={() => handleUpdateMastery(selectedNode.id, m)}
                        style={{
                          padding: '8px 4px',
                          borderRadius: '10px',
                          fontSize: '0.7rem',
                          fontWeight: 800,
                          textTransform: 'uppercase',
                          cursor: 'pointer',
                          transition: 'all 0.15s',
                          border: isSelected ? 'none' : '1px solid rgba(255, 255, 255, 0.08)',
                          backgroundColor: isSelected ? activeBg : 'rgba(15, 23, 42, 0.8)',
                          color: isSelected ? '#ffffff' : '#94a3b8',
                          boxShadow: isSelected ? `0 4px 12px ${activeBg}40` : 'none'
                        }}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Formula & Derivation Box */}
              {selectedNode.formulaSummary && (
                <div
                  style={{
                    padding: '14px',
                    borderRadius: '16px',
                    backgroundColor: 'rgba(49, 46, 129, 0.25)',
                    border: '1px solid rgba(99, 102, 241, 0.35)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', fontWeight: 700, color: '#c7d2fe' }}>
                    <Sparkles size={14} color="#fbbf24" />
                    Key Mathematical / Code Blueprint
                  </div>
                  <code
                    style={{
                      fontSize: '0.8rem',
                      color: '#e0e7ff',
                      fontFamily: 'monospace',
                      backgroundColor: 'rgba(15, 23, 42, 0.6)',
                      padding: '8px 10px',
                      borderRadius: '8px',
                      display: 'block',
                      lineHeight: 1.5,
                      wordBreak: 'break-word',
                      border: '1px solid rgba(99, 102, 241, 0.2)'
                    }}
                  >
                    {selectedNode.formulaSummary}
                  </code>
                </div>
              )}

              {/* Key Takeaways Bullets */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Core Exam Mechanisms:
                </span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {selectedNode.keyTakeaways.map((item, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '8px',
                        padding: '8px 12px',
                        borderRadius: '10px',
                        backgroundColor: 'rgba(2, 6, 23, 0.5)',
                        border: '1px solid rgba(255, 255, 255, 0.05)',
                        fontSize: '0.8rem',
                        color: '#cbd5e1'
                      }}
                    >
                      <CheckCircle2 size={15} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div
              style={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                padding: '24px',
                color: '#94a3b8'
              }}
            >
              <Brain size={48} color="#475569" style={{ marginBottom: '12px' }} />
              <p style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff', margin: '0 0 4px 0' }}>
                Select any concept node
              </p>
              <p style={{ fontSize: '0.8rem', margin: 0, color: '#64748b' }}>
                Click on the graph nodes to inspect formula breakdowns, exam weightage, and revision drills.
              </p>
            </div>
          )}

          {/* Action Footer Bridges */}
          {selectedNode && (
            <div style={{ paddingTop: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '12px' }}>
              <button
                onClick={() => {
                  onAddXp?.(20, `Completed Flashcard Drill: ${selectedNode.label}`);
                  onNavigateView?.('AI_STUDY');
                }}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '14px',
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: '0.85rem',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 6px 20px rgba(99, 102, 241, 0.35)',
                  transition: 'all 0.2s'
                }}
              >
                <Zap size={16} /> Practice Flashcards (+20 XP)
              </button>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <button
                  onClick={() => onNavigateView?.('NOTES')}
                  style={{
                    padding: '10px',
                    borderRadius: '12px',
                    backgroundColor: 'rgba(255, 255, 255, 0.06)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: '#e2e8f0',
                    fontWeight: 700,
                    fontSize: '0.78rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    transition: 'all 0.15s'
                  }}
                >
                  <FileText size={14} /> Open Notes
                </button>
                <button
                  onClick={() => onNavigateView?.('VOICE_TUTOR')}
                  style={{
                    padding: '10px',
                    borderRadius: '12px',
                    backgroundColor: 'rgba(168, 85, 247, 0.15)',
                    border: '1px solid rgba(168, 85, 247, 0.35)',
                    color: '#e9d5ff',
                    fontWeight: 700,
                    fontSize: '0.78rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    transition: 'all 0.15s'
                  }}
                >
                  <Mic size={14} color="#c084fc" /> Voice Drill
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConceptGraphView;
