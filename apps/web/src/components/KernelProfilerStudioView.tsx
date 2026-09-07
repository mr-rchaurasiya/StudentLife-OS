import React, { useState, useEffect } from 'react';
import {
  Cpu,
  Code2,
  Sparkles,
  CheckCircle2,
  Gauge
} from 'lucide-react';
import type { CodeProfileAnalysis, AnalyzeKernelCodeDto } from '@studentlife/shared';

const SAMPLE_CPP_KERNEL = `// Fast 64-byte Cache-Aligned Tiled GEMM with AVX-512 FMA
#include <immintrin.h>

void compute_gemm_tiled_avx512(const float* __restrict__ A, 
                               const float* __restrict__ B, 
                               float* __restrict__ C, 
                               int N) {
    #pragma omp parallel for collapse(2)
    for (int i = 0; i < N; i += 16) {
        for (int j = 0; j < N; j += 16) {
            __m512 c_vec = _mm512_setzero_ps();
            for (int k = 0; k < N; ++k) {
                __m512 a_val = _mm512_set1_ps(A[i * N + k]);
                __m512 b_vec = _mm512_loadu_ps(&B[k * N + j]);
                c_vec = _mm512_fmadd_ps(a_val, b_vec, c_vec);
            }
            _mm512_storeu_ps(&C[i * N + j], c_vec);
        }
    }
}`;

interface KernelProfilerStudioViewProps {
  onAddXp?: (amount: number) => void;
}

export const KernelProfilerStudioView: React.FC<KernelProfilerStudioViewProps> = ({ onAddXp }) => {
  const [funcName, setFuncName] = useState('compute_gemm_tiled_avx512');
  const [sourceLang, setSourceLang] = useState<'CPP' | 'RUST' | 'PYTHON'>('CPP');
  const [targetArch, setTargetArch] = useState<'X86_64_AVX512' | 'ARM64_NEON'>('X86_64_AVX512');
  const [codeText, setCodeText] = useState(SAMPLE_CPP_KERNEL);
  const [analysis, setAnalysis] = useState<CodeProfileAnalysis | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('http://localhost:5000/api/kernel-profiler/profile/prof-simd-01')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setAnalysis(data.data);
        }
      })
      .catch(() => {});
  }, []);

  const handleAnalyze = async () => {
    setLoading(true);
    const payload: AnalyzeKernelCodeDto = {
      functionName: funcName,
      sourceLanguage: sourceLang,
      sourceCode: codeText,
      targetArchitecture: targetArch
    };

    try {
      const res = await fetch('http://localhost:5000/api/kernel-profiler/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success && data.data) {
        setAnalysis(data.data);
        if (onAddXp) onAddXp(50);
      }
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-cyan-950/70 via-blue-950/50 to-slate-900 border border-cyan-500/30 rounded-2xl p-6 relative overflow-hidden backdrop-blur-md shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-xs font-bold rounded-full uppercase tracking-wider flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                Phase 81 • Low-Level Systems
              </span>
              <span className="px-2.5 py-0.5 bg-slate-800/80 border border-slate-700 text-slate-400 text-xs rounded-md">
                AVX-512 & SIMD Kernel Optimizer
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight flex items-center gap-2">
              AI Autonomous Code Profiler & Kernel Optimizer
            </h1>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl">
              Inspect algorithm routines for L1/L2 cache misses, branch mispredictions, SIMD loop vectorization (AVX-512, ARM NEON), and compiler assembly side-by-side.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-slate-900/80 border border-slate-700 px-4 py-2 rounded-xl text-center">
              <div className="text-xs text-slate-400 font-medium">SIMD Speedup</div>
              <div className="text-xl font-black text-cyan-400">
                {analysis ? `${analysis.simdOptimization.speedupMultiplier}x` : '14.8x'}
              </div>
            </div>
            <div className="bg-slate-900/80 border border-slate-700 px-4 py-2 rounded-xl text-center">
              <div className="text-xs text-slate-400 font-medium">L1 Miss Rate</div>
              <div className="text-xl font-black text-emerald-400">
                {analysis ? `${analysis.l1CacheMissRatePercent}%` : '1.4%'}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Code Editor & Configuration */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Code2 className="w-4 h-4 text-cyan-400" />
                Algorithm Kernel Source
              </h2>
              <div className="flex items-center gap-2">
                <select
                  value={sourceLang}
                  onChange={(e) => setSourceLang(e.target.value as any)}
                  className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-200 focus:border-cyan-500 focus:outline-none"
                >
                  <option value="CPP">C++20</option>
                  <option value="RUST">Rust 1.80</option>
                  <option value="PYTHON">Python (NumPy C-Ext)</option>
                </select>
                <select
                  value={targetArch}
                  onChange={(e) => setTargetArch(e.target.value as any)}
                  className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-200 focus:border-cyan-500 focus:outline-none"
                >
                  <option value="X86_64_AVX512">x86_64 (AVX-512)</option>
                  <option value="ARM64_NEON">ARM64 (NEON / SVE)</option>
                </select>
              </div>
            </div>

            <input
              type="text"
              value={funcName}
              onChange={(e) => setFuncName(e.target.value)}
              placeholder="Routine / Function Name"
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-200 focus:border-cyan-500 focus:outline-none font-mono"
            />

            <textarea
              className="w-full h-80 bg-slate-950 border border-slate-700 rounded-lg p-3 text-xs text-slate-200 focus:border-cyan-500 focus:outline-none resize-none font-mono leading-relaxed"
              value={codeText}
              onChange={(e) => setCodeText(e.target.value)}
            />

            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="w-full py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs rounded-lg transition flex items-center justify-center gap-2 shadow-lg shadow-cyan-950/40"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Profile CPU Cache & Generate SIMD Assembly
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Hardware Telemetry & Generated Assembly */}
        <div className="lg:col-span-6 space-y-4">
          {analysis && (
            <div className="space-y-4">
              {/* Telemetry Metric Cards */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 text-center">
                  <div className="text-[10px] text-slate-400 font-medium">Time Complexity</div>
                  <div className="text-xs font-mono font-bold text-cyan-300 mt-1 line-clamp-1">
                    {analysis.timeComplexityBound}
                  </div>
                </div>
                <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 text-center">
                  <div className="text-[10px] text-slate-400 font-medium">Branch Mispredict</div>
                  <div className="text-base font-black text-emerald-400 mt-0.5">
                    {analysis.branchMispredictionPercent}%
                  </div>
                </div>
                <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 text-center">
                  <div className="text-[10px] text-slate-400 font-medium">Est. CPU Cycles</div>
                  <div className="text-base font-black text-amber-400 mt-0.5 font-mono">
                    {analysis.estimatedExecutionCycles}
                  </div>
                </div>
              </div>

              {/* Vectorized Assembly Snippet */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-xl space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                  <div className="flex items-center gap-2">
                    <Gauge className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs font-bold text-white">
                      Generated {analysis.simdOptimization.instructionSet} Vector Assembly
                    </span>
                  </div>
                  <span className="px-2 py-0.5 bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 rounded text-[10px] font-mono font-bold">
                    {analysis.simdOptimization.speedupMultiplier}x Peak Throughput
                  </span>
                </div>

                <pre className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 font-mono text-xs text-cyan-200 overflow-x-auto leading-relaxed">
                  {analysis.simdOptimization.assemblySnippet}
                </pre>
              </div>

              {/* Optimization Recommendations */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-xl space-y-2.5">
                <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Hardware Cache & Vector Alignment Recommendations
                </div>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {analysis.profilingRecommendations.map((rec, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 mt-0.5 shrink-0" />
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
