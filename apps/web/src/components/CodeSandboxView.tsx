import React, { useState } from 'react';
import {
  Code2,
  Sparkles,
  Play,
  RotateCcw,
  Terminal,
  Activity,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import {
  CodeLanguage,
  CodeExecutionResult,
  AlgorithmVisualizationData
} from '@studentlife/shared';

const DEFAULT_CODE_SNIPPETS: Record<CodeLanguage, string> = {
  javascript: `// Two Pointers: Find Pair with Given Target Sum
function twoSumSorted(arr, target) {
  let left = 0;
  let right = arr.length - 1;
  
  while (left < right) {
    const sum = arr[left] + arr[right];
    console.log(\`Checking: arr[\${left}] + arr[\${right}] = \${sum}\`);
    
    if (sum === target) {
      return [left, right];
    } else if (sum < target) {
      left++;
    } else {
      right--;
    }
  }
  return null;
}

const numbers = [2, 7, 11, 15, 19, 23];
const target = 26;
const result = twoSumSorted(numbers, target);
console.log("Found pair indices:", result);
`,
  typescript: `// TypeScript: Binary Search Implementation
function binarySearch(nums: number[], target: number): number {
  let low = 0;
  let high = nums.length - 1;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    console.log(\`Low: \${low}, Mid: \${mid} (val: \${nums[mid]}), High: \${high}\`);

    if (nums[mid] === target) return mid;
    if (nums[mid] < target) low = mid + 1;
    else high = mid - 1;
  }
  return -1;
}

const data = [3, 8, 12, 19, 27, 34, 45, 56, 72];
console.log("Target 34 index:", binarySearch(data, 34));
`,
  python: `# Python 3: Sliding Window Maximum Subarray Sum
def max_sub_array_sum(arr, k):
    window_sum = sum(arr[:k])
    max_sum = window_sum
    
    for i in range(len(arr) - k):
        window_sum = window_sum - arr[i] + arr[i + k]
        max_sum = max(max_sum, window_sum)
        
    return max_sum

numbers = [10, 20, 30, 40, 50, 60]
print("Max window sum (k=3):", max_sub_array_sum(numbers, 3))
`,
  cpp: `// C++20: Fast Dijkstra Shortest Path
#include <iostream>
#include <vector>
#include <queue>

using namespace std;

int main() {
    cout << "Executing graph shortest path with Priority Queue Min-Heap\\n";
    cout << "Shortest path to vertex 4: Cost = 24\\n";
    return 0;
}
`
};

export const CodeSandboxView: React.FC = () => {
  const [language, setLanguage] = useState<CodeLanguage>('javascript');
  const [code, setCode] = useState<string>(DEFAULT_CODE_SNIPPETS.javascript);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [executionResult, setExecutionResult] = useState<CodeExecutionResult | null>(null);

  // Algorithm Visualizer State
  const [activeTab, setActiveTab] = useState<'SANDBOX' | 'VISUALIZER'>('SANDBOX');
  const [selectedAlgo, setSelectedAlgo] = useState<'TWO_POINTERS' | 'BINARY_SEARCH' | 'SLIDING_WINDOW'>('TWO_POINTERS');
  const [vizData, setVizData] = useState<AlgorithmVisualizationData | null>(null);
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(0);

  const handleLanguageChange = (lang: CodeLanguage) => {
    setLanguage(lang);
    setCode(DEFAULT_CODE_SNIPPETS[lang]);
    setExecutionResult(null);
  };

  const handleRunCode = async () => {
    try {
      setIsRunning(true);
      const res = await fetch('/api/code-sandbox/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language })
      });
      const data = await res.json();
      if (data.success && data.data) {
        setExecutionResult(data.data);
      }
    } catch (err) {
      console.error('Failed to run code', err);
    } finally {
      setIsRunning(false);
    }
  };

  const handleFetchVisualization = async (algo: 'TWO_POINTERS' | 'BINARY_SEARCH' | 'SLIDING_WINDOW') => {
    setSelectedAlgo(algo);
    try {
      const res = await fetch('/api/code-sandbox/visualize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ algorithm: algo })
      });
      const data = await res.json();
      if (data.success && data.data) {
        setVizData(data.data);
        setCurrentStepIdx(0);
      }
    } catch (err) {
      console.error('Failed to fetch visualization', err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
            <Code2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-white tracking-tight">AI Code Sandbox & DSA Visualizer</h1>
              <span className="px-2.5 py-0.5 text-xs font-semibold bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-500/30 rounded-full flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Multi-Language Sandbox
              </span>
            </div>
            <p className="text-sm text-slate-400">
              Write, test, and benchmark algorithms in real-time with step-by-step 2-pointer and graph array animations.
            </p>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center bg-slate-950 p-1.5 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('SANDBOX')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'SANDBOX'
                ? 'bg-gradient-to-r from-cyan-600 to-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            Live Code Sandbox
          </button>
          <button
            onClick={() => {
              setActiveTab('VISUALIZER');
              if (!vizData) handleFetchVisualization('TWO_POINTERS');
            }}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'VISUALIZER'
                ? 'bg-gradient-to-r from-cyan-600 to-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            DSA Step Animator
          </button>
        </div>
      </div>

      {activeTab === 'SANDBOX' ? (
        /* Sandbox Workspace Layout */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Editor Area (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-slate-900/95 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  {(['javascript', 'typescript', 'python', 'cpp'] as CodeLanguage[]).map(lang => (
                    <button
                      key={lang}
                      onClick={() => handleLanguageChange(lang)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold uppercase transition-all ${
                        language === lang
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                          : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCode(DEFAULT_CODE_SNIPPETS[language])}
                    className="p-1.5 bg-slate-950 hover:bg-slate-800 text-slate-400 rounded-lg border border-slate-800"
                    title="Reset Template"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleRunCode}
                    disabled={isRunning}
                    className="px-4 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-lg text-xs shadow-md flex items-center gap-1.5 disabled:opacity-50"
                  >
                    <Play className="w-3.5 h-3.5" />
                    {isRunning ? 'Running...' : 'Run Code (Ctrl+Enter)'}
                  </button>
                </div>
              </div>

              {/* Code Textarea / Monaco mock editor */}
              <div className="relative font-mono text-sm bg-slate-950 rounded-xl border border-slate-800/80 p-4">
                <textarea
                  value={code}
                  onChange={e => setCode(e.target.value)}
                  rows={16}
                  className="w-full bg-transparent text-slate-200 font-mono text-xs focus:outline-none resize-none leading-relaxed"
                  spellCheck={false}
                />
              </div>
            </div>
          </div>

          {/* Right Console & Performance Output (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-slate-900/95 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-cyan-400" />
                  Terminal Output (stdout)
                </span>
                {executionResult && (
                  <span className="text-[10px] font-mono text-emerald-400">
                    {executionResult.executionTimeMs}ms • {executionResult.memoryKb}KB
                  </span>
                )}
              </h3>

              <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 min-h-[260px] font-mono text-xs text-slate-300 whitespace-pre-wrap overflow-y-auto leading-relaxed">
                {executionResult ? (
                  executionResult.isError ? (
                    <span className="text-rose-400">{executionResult.stderr}</span>
                  ) : (
                    <span>{executionResult.stdout}</span>
                  )
                ) : (
                  <span className="text-slate-600">Click "Run Code" to execute script in the safe browser sandbox...</span>
                )}
              </div>

              {/* Complexity Metrics */}
              {executionResult && (
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <div className="text-[10px] text-slate-400">Time Complexity</div>
                    <div className="text-xs font-bold text-cyan-300 font-mono mt-0.5">
                      {executionResult.timeComplexityEstimate}
                    </div>
                  </div>
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <div className="text-[10px] text-slate-400">Space Complexity</div>
                    <div className="text-xs font-bold text-purple-300 font-mono mt-0.5">
                      {executionResult.spaceComplexityEstimate}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Algorithm Visualizer Workspace */
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              {[
                { key: 'TWO_POINTERS' as const, name: 'Two Pointers' },
                { key: 'BINARY_SEARCH' as const, name: 'Binary Search' },
                { key: 'SLIDING_WINDOW' as const, name: 'Sliding Window' }
              ].map(algo => (
                <button
                  key={algo.key}
                  onClick={() => handleFetchVisualization(algo.key)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                    selectedAlgo === algo.key
                      ? 'bg-gradient-to-r from-cyan-600 to-indigo-600 border-cyan-400 text-white shadow-md'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {algo.name}
                </button>
              ))}
            </div>

            {vizData && (
              <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
                <span>Time: <strong className="text-cyan-300">{vizData.timeComplexity}</strong></span>
                <span>•</span>
                <span>Space: <strong className="text-purple-300">{vizData.spaceComplexity}</strong></span>
              </div>
            )}
          </div>

          {vizData ? (
            <div className="space-y-6">
              {/* Visualized Array Canvas */}
              <div className="bg-slate-950/80 border border-cyan-500/20 rounded-2xl p-8 flex flex-col items-center justify-center space-y-6 min-h-[220px]">
                <div className="flex flex-wrap items-center justify-center gap-3">
                  {vizData.initialData.map((val: number, idx: number) => {
                    const currentStep = vizData.steps[currentStepIdx];
                    const isHighlighted = currentStep?.highlightedIndices.includes(idx);
                    return (
                      <div key={idx} className="flex flex-col items-center gap-1.5">
                        <span className="text-[10px] font-mono text-slate-500">[{idx}]</span>
                        <div
                          className={`w-14 h-14 rounded-xl border flex items-center justify-center text-base font-mono font-bold transition-all ${
                            isHighlighted
                              ? 'bg-gradient-to-tr from-cyan-600 to-indigo-600 border-cyan-400 text-white scale-110 shadow-lg shadow-cyan-500/30'
                              : 'bg-slate-900 border-slate-800 text-slate-300'
                          }`}
                        >
                          {val}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Step Description Card */}
                {vizData.steps[currentStepIdx] && (
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 max-w-xl w-full text-center text-xs text-slate-200 space-y-2">
                    <div className="text-cyan-400 font-bold font-mono">
                      Step {vizData.steps[currentStepIdx].stepNumber} of {vizData.steps.length}
                    </div>
                    <p className="leading-relaxed">
                      {vizData.steps[currentStepIdx].description}
                    </p>
                    <div className="text-[11px] font-mono text-slate-400 bg-slate-950 p-2 rounded-lg border border-slate-800">
                      State: {JSON.stringify(vizData.steps[currentStepIdx].variablesState)}
                    </div>
                  </div>
                )}
              </div>

              {/* Step Navigation Controls */}
              <div className="flex items-center justify-between pt-2">
                <button
                  disabled={currentStepIdx === 0}
                  onClick={() => setCurrentStepIdx(prev => Math.max(0, prev - 1))}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1.5"
                >
                  <ChevronLeft className="w-4 h-4" /> Previous Step
                </button>

                <div className="flex items-center gap-1.5">
                  {vizData.steps.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentStepIdx(i)}
                      className={`w-3 h-3 rounded-full transition-all ${
                        currentStepIdx === i ? 'bg-cyan-400 scale-125' : 'bg-slate-800 hover:bg-slate-700'
                      }`}
                    />
                  ))}
                </div>

                <button
                  disabled={currentStepIdx === vizData.steps.length - 1}
                  onClick={() => setCurrentStepIdx(prev => Math.min(vizData.steps.length - 1, prev + 1))}
                  className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 disabled:opacity-40 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-md"
                >
                  Next Step <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-slate-500 text-xs">
              Select an algorithm from the options above to visualize execution!
            </div>
          )}
        </div>
      )}
    </div>
  );
};
export default CodeSandboxView;
