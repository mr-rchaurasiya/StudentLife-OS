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
  RotateCcw
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

  return (
    <div className="space-y-6 animate-fadeIn pb-16">
      {/* Top Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
              <Brain className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
              Phase 32 • 3D Mind Maps & Concept Knowledge Graph
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
              Interactive Knowledge Graph 🕸️
            </h1>
            <p className="text-sm md:text-base text-slate-300 leading-relaxed">
              Visualize how complex topics connect through prerequisites, exam weightages, and
              mastery levels. Click any node for instant formulas, takeaways, and active recall bridges.
            </p>
          </div>

          {/* Subject Switcher Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setSelectedSubject('dsa')}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition ${
                selectedSubject === 'dsa'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Algorithms & DSA
            </button>
            <button
              onClick={() => setSelectedSubject('physics')}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition ${
                selectedSubject === 'physics'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Calculus & Physics
            </button>
          </div>
        </div>

        {/* Mastery Overview Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-800/80">
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-[11px] text-slate-400 uppercase font-semibold">Total Nodes</span>
            <div className="text-xl font-bold text-white mt-0.5">{graphData.nodes.length} Concepts</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-[11px] text-slate-400 uppercase font-semibold">Mastered</span>
            <div className="text-xl font-bold text-emerald-400 mt-0.5">
              {graphData.nodes.filter((n) => n.mastery === 'MASTERED').length} Topics
            </div>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-[11px] text-slate-400 uppercase font-semibold">Under Revision</span>
            <div className="text-xl font-bold text-amber-400 mt-0.5">
              {graphData.nodes.filter((n) => n.mastery === 'REVISING').length} Topics
            </div>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-[11px] text-slate-400 uppercase font-semibold">Domain Mastery</span>
            <div className="text-xl font-bold text-indigo-300 mt-0.5">{graphData.overallMasteryPercent}%</div>
          </div>
        </div>
      </div>

      {/* Main Graph Stage & Inspector Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Interactive Graph Canvas */}
        <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden flex flex-col h-[620px]">
          {/* Controls Overlay */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800 z-10">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-medium">Filter Mastery:</span>
              <div className="flex gap-1.5">
                {(['ALL', 'MASTERED', 'REVISING', 'UNEXPLORED'] as const).map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => setMasteryFilter(lvl)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition ${
                      masteryFilter === lvl
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            {/* Zoom Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setZoomLevel((z) => Math.min(1.5, z + 0.1))}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white transition"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                onClick={() => setZoomLevel((z) => Math.max(0.7, z - 0.1))}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white transition"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <button
                onClick={() => setZoomLevel(1)}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white transition"
                title="Reset Zoom"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* SVG Canvas Area */}
          <div className="flex-1 relative overflow-hidden bg-slate-950/60 rounded-2xl mt-4 border border-slate-800/80 flex items-center justify-center">
            <svg
              className="w-full h-full cursor-grab active:cursor-grabbing"
              viewBox="0 0 850 450"
              style={{ transform: `scale(${zoomLevel})`, transition: 'transform 0.2s ease-out' }}
            >
              {/* Defs for Gradients & Markers */}
              <defs>
                <marker
                  id="arrow"
                  viewBox="0 0 10 10"
                  refX="18"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#6366f1" opacity="0.6" />
                </marker>
              </defs>

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
                      strokeWidth="2"
                      strokeDasharray={edge.type === 'APPLICATION' ? '4 4' : 'none'}
                      opacity="0.5"
                      markerEnd="url(#arrow)"
                    />
                    {edge.label && (
                      <text
                        x={(source.x + target.x) / 2}
                        y={(source.y + target.y) / 2 - 6}
                        fill="#94a3b8"
                        fontSize="9"
                        textAnchor="middle"
                        fontFamily="monospace"
                      >
                        {edge.label}
                      </text>
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
                    className="cursor-pointer group"
                  >
                    {/* Outer Glow Ring */}
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={isSelected ? 28 : 22}
                      fill={nodeColor}
                      opacity={isSelected ? 0.35 : 0.15}
                      className="transition-all duration-300 group-hover:scale-125"
                    />

                    {/* Central Core */}
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={isSelected ? 16 : 13}
                      fill="#0f172a"
                      stroke={nodeColor}
                      strokeWidth={isSelected ? 3 : 2}
                      className="transition-all duration-300"
                    />

                    {/* Label Badge */}
                    <text
                      x={node.x}
                      y={node.y + 36}
                      fill={isSelected ? '#ffffff' : '#cbd5e1'}
                      fontSize="11"
                      fontWeight="bold"
                      textAnchor="middle"
                      className="select-none transition-colors"
                    >
                      {node.label}
                    </text>

                    {/* Weightage Subtitle */}
                    <text
                      x={node.x}
                      y={node.y + 48}
                      fill="#64748b"
                      fontSize="9"
                      textAnchor="middle"
                      fontFamily="monospace"
                      className="select-none"
                    >
                      {node.weightagePercent}% Weight • {node.pyqCount} PYQs
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Right Column: Node Inspector & Practice Launcher */}
        <div className="lg:col-span-1 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between h-[620px] overflow-y-auto">
          {selectedNode ? (
            <div className="space-y-4">
              {/* Header */}
              <div className="pb-3 border-b border-slate-800">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
                    {selectedNode.category}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    {selectedNode.pyqCount} Solved PYQs
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white">{selectedNode.label}</h3>
              </div>

              {/* Mastery Level Toggle */}
              <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
                <span className="text-[11px] font-semibold text-slate-400 uppercase">Mastery State:</span>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['MASTERED', 'REVISING', 'UNEXPLORED'] as const).map((m) => (
                    <button
                      key={m}
                      onClick={() => handleUpdateMastery(selectedNode.id, m)}
                      className={`py-1.5 rounded-xl text-[10px] font-bold uppercase transition ${
                        selectedNode.mastery === m
                          ? m === 'MASTERED'
                            ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                            : m === 'REVISING'
                            ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
                            : 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                          : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              {/* Formula & Derivation Box */}
              {selectedNode.formulaSummary && (
                <div className="p-3.5 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-300">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    Key Mathematical / Code Blueprint
                  </div>
                  <code className="text-xs text-indigo-200 font-mono block leading-relaxed break-words">
                    {selectedNode.formulaSummary}
                  </code>
                </div>
              )}

              {/* Key Takeaways Bullets */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-slate-400 uppercase">Core Exam Mechanisms:</span>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {selectedNode.keyTakeaways.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
              <Brain className="w-12 h-12 text-slate-600 mb-3 animate-pulse" />
              <p className="text-sm font-semibold text-slate-300">Select any concept node in the graph</p>
              <p className="text-xs mt-1">View formula breakdowns, exam frequency, and revision drills.</p>
            </div>
          )}

          {/* Action Footer Bridges */}
          {selectedNode && (
            <div className="pt-4 border-t border-slate-800 space-y-2 mt-4">
              <button
                onClick={() => {
                  onAddXp?.(20, `Completed Flashcard Drill: ${selectedNode.label}`);
                  onNavigateView?.('AI_STUDY');
                }}
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/30 flex items-center justify-center gap-2 transition"
              >
                <Zap className="w-4 h-4" /> Practice Flashcards (+20 XP)
              </button>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => onNavigateView?.('NOTES')}
                  className="py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-medium text-xs flex items-center justify-center gap-1.5 border border-slate-700 transition"
                >
                  <FileText className="w-3.5 h-3.5" /> Open Notes
                </button>
                <button
                  onClick={() => onNavigateView?.('VOICE_TUTOR')}
                  className="py-2 rounded-xl bg-purple-950/60 hover:bg-purple-900/60 text-purple-300 hover:text-purple-100 font-medium text-xs flex items-center justify-center gap-1.5 border border-purple-500/30 transition"
                >
                  <Mic className="w-3.5 h-3.5 text-purple-400" /> Voice Drill
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
