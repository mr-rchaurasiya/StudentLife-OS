import React, { useState, useEffect } from 'react';
import {
  Brain,
  Eye,
  EyeOff,
  Sparkles,
  CheckCircle2,
  BookOpen
} from 'lucide-react';
import {
  MindmapData,
  MindmapNode
} from '@studentlife/shared';

interface VisualMindmapStudioViewProps {
  onAddXp?: (xp: number, reason: string) => void;
}

const PRESET_MINDMAPS = [
  { topic: 'Quantum Computing & Algorithms Architecture', domain: 'Physics & Computer Science' },
  { topic: 'Electromagnetism & Maxwell Equations', domain: 'JEE Advanced Physics' },
  { topic: 'Indian Constitution & Fundamental Rights', domain: 'UPSC CSE GS-2' },
  { topic: 'Graph Algorithms & Dynamic Programming', domain: 'GATE CS & Algorithms' }
];

export const VisualMindmapStudioView: React.FC<VisualMindmapStudioViewProps> = ({ onAddXp }) => {
  const [mindmap, setMindmap] = useState<MindmapData | null>(null);
  const [activeRecallMode, setActiveRecallMode] = useState<boolean>(true);
  const [selectedNode, setSelectedNode] = useState<MindmapNode | null>(null);
  const [topicInput, setTopicInput] = useState<string>('');
  const [domainInput] = useState<string>('Engineering & Science');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  useEffect(() => {
    fetchMindmap();
  }, []);

  const fetchMindmap = async (id?: string) => {
    try {
      const res = await fetch(`/api/mindmap-studio?id=${encodeURIComponent(id || 'mm-quantum-computing')}`);
      const data = await res.json();
      if (data.success && data.data) {
        setMindmap(data.data);
        if (data.data.nodes.length > 0) {
          setSelectedNode(data.data.nodes[0]);
        }
      }
    } catch {
      // Handled
    }
  };

  const handleGenerateMindmap = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!topicInput.trim()) return;

    setIsGenerating(true);
    try {
      const res = await fetch('/api/mindmap-studio/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topicTitle: topicInput,
          domain: domainInput
        })
      });
      const data = await res.json();
      if (data.success && data.data) {
        setMindmap(data.data);
        if (data.data.nodes.length > 0) {
          setSelectedNode(data.data.nodes[0]);
        }
        onAddXp?.(35, `Synthesized Visual Mindmap: ${topicInput}`);
        setTopicInput('');
      }
    } catch {
      // Handled
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRevealNode = async (nodeId: string) => {
    if (!mindmap) return;
    try {
      const res = await fetch('/api/mindmap-studio/reveal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mapId: mindmap.id,
          nodeId
        })
      });
      const data = await res.json();
      if (data.success && data.data) {
        setMindmap(data.data);
        const updatedSelected = data.data.nodes.find((n: MindmapNode) => n.id === nodeId);
        if (updatedSelected) setSelectedNode(updatedSelected);
        onAddXp?.(15, 'Active Recall Node Unlocked');
      }
    } catch {
      // Handled
    }
  };

  const getNodeColor = (cat: string) => {
    switch (cat) {
      case 'CORE_ROOT':
        return { bg: 'bg-indigo-600', border: 'border-indigo-400', text: 'text-white' };
      case 'BRANCH':
        return { bg: 'bg-slate-900/90', border: 'border-cyan-500/50', text: 'text-cyan-300' };
      case 'FORMULA_NODE':
        return { bg: 'bg-slate-900/90', border: 'border-amber-500/50', text: 'text-amber-300' };
      case 'KEY_DEFINITION':
        return { bg: 'bg-slate-900/90', border: 'border-emerald-500/50', text: 'text-emerald-300' };
      default:
        return { bg: 'bg-slate-900/90', border: 'border-slate-700', text: 'text-slate-300' };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-cyan-950/40 to-slate-900 border border-cyan-500/30 rounded-3xl p-6 md:p-8 relative overflow-hidden backdrop-blur-xl shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2.5 mb-2.5">
              <span className="px-3 py-1 bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-xs font-bold rounded-full uppercase tracking-wider flex items-center gap-1.5">
                <Brain className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                Phase 103 • Interactive Visual Mindmap & Active Recall
              </span>
              <span className="px-2.5 py-0.5 bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold rounded-md">
                Active Recall Drill Canvas
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight flex items-center gap-2">
              Visual Knowledge Mindmap Studio 🗺️
            </h1>
            <p className="text-slate-300 text-xs md:text-sm mt-1 max-w-2xl leading-relaxed">
              Synthesize complex multi-chapter syllabi into visual hierarchical node maps. Toggle <strong>Active Recall Mode</strong> to test formula retention and definitions before high-stakes exams.
            </p>
          </div>

          {/* Active Recall Toggle & Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveRecallMode(!activeRecallMode)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-2 shadow-lg ${
                activeRecallMode
                  ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 shadow-amber-500/20'
                  : 'bg-slate-900 border border-slate-700 text-slate-300'
              }`}
            >
              {activeRecallMode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {activeRecallMode ? 'Active Recall: ON (Masked)' : 'Study Mode: All Revealed'}
            </button>
          </div>
        </div>

        {/* Generate Mindmap Input Bar */}
        <form onSubmit={handleGenerateMindmap} className="flex flex-wrap items-center gap-2 mt-6 pt-5 border-t border-slate-800/80">
          <input
            type="text"
            value={topicInput}
            onChange={(e) => setTopicInput(e.target.value)}
            placeholder="Type any syllabus topic (e.g. Thermodynamics Carnot Cycles, Indian Polity Emergency Powers)..."
            className="flex-1 min-w-[240px] bg-slate-950 border border-slate-800 rounded-2xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
          <button
            type="submit"
            disabled={isGenerating}
            className="px-5 py-2.5 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white text-xs font-bold rounded-2xl shadow-lg shadow-cyan-600/30 transition flex items-center gap-1.5"
          >
            <Sparkles className="w-4 h-4" />
            {isGenerating ? 'Synthesizing Mindmap...' : 'Generate AI Mindmap'}
          </button>
        </form>

        {/* Preset Mindmap Chips */}
        <div className="flex flex-wrap items-center gap-2 mt-4">
          <span className="text-xs text-slate-400 font-semibold">Presets:</span>
          {PRESET_MINDMAPS.map((pm, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setTopicInput(pm.topic);
                handleGenerateMindmap();
              }}
              className="px-3 py-1 rounded-xl bg-slate-950/80 hover:bg-cyan-950/60 border border-slate-800 hover:border-cyan-500/40 text-[11px] text-slate-300 hover:text-white transition"
            >
              {pm.topic}
            </button>
          ))}
        </div>
      </div>

      {/* Main Canvas & Details Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Interactive Visual Node Canvas */}
        <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden min-h-[520px] flex flex-col justify-between">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-white">{mindmap?.topicTitle}</h2>
              <span className="px-2 py-0.5 rounded-full bg-slate-800 text-[10px] text-slate-400 font-semibold border border-slate-700">
                {mindmap?.domain}
              </span>
            </div>

            {activeRecallMode && mindmap && (
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-400">Recall Score:</span>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 font-mono font-bold text-amber-400">
                  {mindmap.activeRecallScore} / {mindmap.totalMaskableNodes} Revealed
                </span>
              </div>
            )}
          </div>

          {/* SVG Connection Lines & Interactive Nodes Stage */}
          <div className="relative flex-1 my-6 min-h-[380px]">
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              {mindmap?.edges.map((edge) => {
                const source = mindmap.nodes.find((n) => n.id === edge.sourceNodeId);
                const target = mindmap.nodes.find((n) => n.id === edge.targetNodeId);
                if (!source || !target) return null;

                return (
                  <g key={edge.id}>
                    <line
                      x1={`${(source.x / 750) * 100}%`}
                      y1={`${(source.y / 400) * 100}%`}
                      x2={`${(target.x / 750) * 100}%`}
                      y2={`${(target.y / 400) * 100}%`}
                      stroke="#475569"
                      strokeWidth="2"
                      strokeDasharray="4 4"
                      className="opacity-60"
                    />
                  </g>
                );
              })}
            </svg>

            {/* Render Nodes */}
            {mindmap?.nodes.map((node) => {
              const isSelected = selectedNode?.id === node.id;
              const isMasked = activeRecallMode && node.isMaskedForRecall && !node.userRecallRevealed;
              const color = getNodeColor(node.category);

              return (
                <div
                  key={node.id}
                  onClick={() => setSelectedNode(node)}
                  className={`absolute p-3 rounded-2xl cursor-pointer transition transform hover:scale-105 shadow-xl border backdrop-blur-md ${color.bg} ${color.border} ${
                    isSelected ? 'ring-2 ring-cyan-400 shadow-cyan-500/30 scale-105 z-20' : 'z-10'
                  }`}
                  style={{
                    left: `${(node.x / 750) * 82}%`,
                    top: `${(node.y / 400) * 80}%`,
                    maxWidth: '220px'
                  }}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      {node.category.replace('_', ' ')}
                    </span>
                    {node.isMaskedForRecall && (
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                        node.userRecallRevealed ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                      }`}>
                        {node.userRecallRevealed ? '✓ Recalled' : '🔒 Test'}
                      </span>
                    )}
                  </div>

                  <h3 className={`text-xs font-bold ${color.text} leading-tight`}>
                    {isMasked ? '❓ [Tap to Reveal]' : node.label}
                  </h3>

                  {node.formulaLatex && !isMasked && (
                    <div className="mt-1.5 text-[10px] font-mono text-amber-300 bg-slate-950/80 px-2 py-1 rounded-lg">
                      {node.formulaLatex}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>Click any node to view deep breakdown or test formula recall</span>
            <span className="text-cyan-400 font-semibold">{mindmap?.nodes.length} Connected Nodes</span>
          </div>
        </div>

        {/* Right Col: Selected Node Inspector & Active Recall Test Panel */}
        <div className="lg:col-span-1 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold text-white">Concept Inspector</h3>
              </div>
              {selectedNode && (
                <span className="px-2.5 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-[10px] text-slate-300 font-bold">
                  {selectedNode.importance} PRIORITY
                </span>
              )}
            </div>

            {selectedNode ? (
              <div className="space-y-4">
                <div>
                  <h4 className="text-base font-bold text-white">{selectedNode.label}</h4>
                  <span className="text-xs text-slate-400">{selectedNode.category}</span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Explanation & Core Principle:
                  </span>
                  {activeRecallMode && selectedNode.isMaskedForRecall && !selectedNode.userRecallRevealed ? (
                    <div className="space-y-3 text-center py-4">
                      <p className="text-xs text-amber-300/90 font-medium">
                        Content is hidden in Active Recall mode. Test your mental memory first!
                      </p>
                      <button
                        onClick={() => handleRevealNode(selectedNode.id)}
                        className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 text-xs font-bold rounded-xl shadow-lg transition"
                      >
                        Reveal Concept & Score (+15 XP)
                      </button>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-200 leading-relaxed">
                      {selectedNode.description}
                    </p>
                  )}
                </div>

                {selectedNode.formulaLatex && (
                  <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30 space-y-1.5">
                    <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                      Key Formula / Derivation:
                    </span>
                    {activeRecallMode && selectedNode.isMaskedForRecall && !selectedNode.userRecallRevealed ? (
                      <div className="text-xs text-slate-400 font-mono italic">
                        [Formula masked for recall testing]
                      </div>
                    ) : (
                      <div className="font-mono text-xs text-amber-300 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                        <code>{selectedNode.formulaLatex}</code>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12 text-slate-400 text-xs">
                Select a node in the diagram to inspect properties
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 space-y-2">
            <button
              onClick={() => onAddXp?.(40, 'Completed Mindmap Active Recall Drill')}
              className="w-full py-3 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white text-xs font-bold rounded-2xl shadow-lg shadow-cyan-600/30 transition flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              Complete Active Recall Session (+40 XP)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisualMindmapStudioView;
