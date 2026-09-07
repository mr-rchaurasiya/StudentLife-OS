import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  DollarSign,
  PieChart,
  FileCheck,
  RefreshCw,
  Download,
  Building,
  CheckCircle2,
  Hash
} from 'lucide-react';
import type { VentureSafeAgreement } from '@studentlife/shared';

interface VentureSyndicateSafeViewProps {
  onAddXp?: (amount: number) => void;
}

export const VentureSyndicateSafeView: React.FC<VentureSyndicateSafeViewProps> = ({ onAddXp }) => {
  const [startupName, setStartupName] = useState('NovaNeural Robotics Inc.');
  const [founderName, setFounderName] = useState('Alex Mercer (CEO & Co-Founder)');
  const [investorName, setInvestorName] = useState('Stanford & IIT Student Angel Syndicate');
  const [investmentAmount, setInvestmentAmount] = useState<number>(75000);
  const [valuationCap, setValuationCap] = useState<number>(3000000);
  const [discountRate, setDiscountRate] = useState<number>(20);
  const [safeAgreement, setSafeAgreement] = useState<VentureSafeAgreement | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'SAFE_AGREEMENT' | 'CAP_TABLE' | 'DEAL_MEMO'>('SAFE_AGREEMENT');

  const generateSafe = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/venture-syndicate/generate-safe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          startupName,
          founderName,
          investorName,
          investmentAmountUsd: investmentAmount,
          postMoneyValuationCapUsd: valuationCap,
          discountRatePercent: discountRate
        })
      });
      if (res.ok) {
        const data = await res.json();
        setSafeAgreement(data.data);
        if (onAddXp) onAddXp(75);
      }
    } catch (e) {
      console.error('Failed to generate SAFE agreement', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    generateSafe();
  }, []);

  const handleDownloadMarkdown = () => {
    if (!safeAgreement) return;
    const blob = new Blob([safeAgreement.safeAgreementMarkdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${startupName.replace(/\s+/g, '_')}_PostMoney_SAFE.md`;
    a.click();
    if (onAddXp) onAddXp(30);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900/40 via-amber-900/40 to-yellow-900/40 border border-emerald-500/30 rounded-2xl p-6 backdrop-blur-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
          <Building className="w-64 h-64 text-amber-400" />
        </div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase tracking-wider">
                Phase 90 • Venture Capital & Financing
              </span>
              <span className="flex items-center gap-1 text-xs text-emerald-400 font-medium">
                <DollarSign className="w-3.5 h-3.5" /> YC Post-Money SAFE
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-emerald-400" />
              Student Venture Syndicate & YC Post-Money SAFE Note Builder
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              Model student venture capital rounds, draft YC-standard Post-Money SAFE agreements with valuation caps & discounts, and simulate real-time equity dilution cap tables.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleDownloadMarkdown}
              disabled={!safeAgreement}
              className="px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-amber-500 hover:from-emerald-400 hover:to-amber-400 text-slate-950 font-bold rounded-xl text-sm flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              Export SAFE Contract
            </button>
          </div>
        </div>
      </div>

      {/* Financing Configuration Form */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1">Company Name</label>
          <input
            type="text"
            value={startupName}
            onChange={(e) => setStartupName(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 focus:border-amber-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1">Founder / CEO</label>
          <input
            type="text"
            value={founderName}
            onChange={(e) => setFounderName(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 focus:border-amber-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1">Investor / Syndicate</label>
          <input
            type="text"
            value={investorName}
            onChange={(e) => setInvestorName(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 focus:border-amber-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1">Investment Amount ($ USD)</label>
          <input
            type="number"
            step="5000"
            value={investmentAmount}
            onChange={(e) => setInvestmentAmount(Number(e.target.value))}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 focus:border-amber-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1">Post-Money Valuation Cap ($ USD)</label>
          <input
            type="number"
            step="100000"
            value={valuationCap}
            onChange={(e) => setValuationCap(Number(e.target.value))}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 focus:border-amber-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1">Discount Rate (%)</label>
          <input
            type="number"
            min="0"
            max="40"
            value={discountRate}
            onChange={(e) => setDiscountRate(Number(e.target.value))}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 focus:border-amber-500 focus:outline-none"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={generateSafe}
          disabled={loading}
          className="px-6 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-sm flex items-center gap-2 transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Recalculate Dilution & SAFE
        </button>
      </div>

      {safeAgreement && (
        <>
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-xl">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider">Purchase Amount</span>
                <DollarSign className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-3xl font-black text-emerald-400">${safeAgreement.investmentAmountUsd.toLocaleString()}</div>
              <p className="text-[11px] text-slate-400 mt-1">Cash Inflow</p>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-xl">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider">Post-Money Cap</span>
                <Building className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-3xl font-black text-amber-300">${(safeAgreement.postMoneyValuationCapUsd / 1e6).toFixed(2)}M</div>
              <p className="text-[11px] text-slate-400 mt-1">Ceiling Valuation</p>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-xl">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider">Implied Equity</span>
                <PieChart className="w-4 h-4 text-indigo-400" />
              </div>
              <div className="text-3xl font-black text-indigo-300">{safeAgreement.impliedEquityPercent}%</div>
              <p className="text-[11px] text-indigo-400 mt-1">Post-Conversion Stake</p>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-xl">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider">Contract SHA-256</span>
                <Hash className="w-4 h-4 text-teal-400" />
              </div>
              <div className="text-xs font-mono font-bold text-teal-300 truncate mt-2">{safeAgreement.sha256ContractHash}</div>
              <p className="text-[11px] text-teal-400 mt-1">Cryptographically Sealed</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 bg-slate-900/60 p-1.5 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('SAFE_AGREEMENT')}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                activeTab === 'SAFE_AGREEMENT'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileCheck className="w-3.5 h-3.5" /> YC SAFE Legal Agreement
            </button>
            <button
              onClick={() => setActiveTab('CAP_TABLE')}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                activeTab === 'CAP_TABLE'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <PieChart className="w-3.5 h-3.5" /> Dilution & Cap Table Matrix
            </button>
            <button
              onClick={() => setActiveTab('DEAL_MEMO')}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                activeTab === 'DEAL_MEMO'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Building className="w-3.5 h-3.5" /> Syndicate Investment Memo
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === 'SAFE_AGREEMENT' && (
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl">
              <pre className="text-xs font-mono text-slate-300 whitespace-pre-wrap leading-relaxed bg-slate-950 p-5 rounded-xl border border-slate-800">
                {safeAgreement.safeAgreementMarkdown}
              </pre>
            </div>
          )}

          {activeTab === 'CAP_TABLE' && (
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <PieChart className="w-4 h-4 text-amber-400" />
                Post-Money Ownership & Equity Waterfall
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse font-mono">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400">
                      <th className="py-2.5 px-3">Shareholder</th>
                      <th className="py-2.5 px-3">Class</th>
                      <th className="py-2.5 px-3">Shares Count</th>
                      <th className="py-2.5 px-3">Pre-Money %</th>
                      <th className="py-2.5 px-3 text-amber-300">Post-Money %</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {safeAgreement.capTableSimulation.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-950/40">
                        <td className="py-2.5 px-3 font-bold text-slate-200">{row.holderName}</td>
                        <td className="py-2.5 px-3 text-slate-400">{row.stakeType}</td>
                        <td className="py-2.5 px-3 text-slate-300">{row.sharesCount.toLocaleString()}</td>
                        <td className="py-2.5 px-3 text-slate-400">{row.ownershipPercentPre}%</td>
                        <td className="py-2.5 px-3 font-bold text-emerald-400">{row.ownershipPercentPost}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'DEAL_MEMO' && (
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl space-y-3">
              <h3 className="text-sm font-bold text-white mb-2">Student Angel Syndicate Investment Thesis</h3>
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2 text-xs text-slate-300 leading-relaxed">
                <p><strong>Investment Thesis:</strong> {startupName} is developing high-barrier proprietary technology with strong student founder talent.</p>
                <p><strong>Structure:</strong> Standard Y-Combinator Post-Money SAFE note at a ${ (safeAgreement.postMoneyValuationCapUsd / 1e6).toFixed(1) }M valuation cap with a {safeAgreement.discountRatePercent}% discount rate.</p>
                <p className="text-emerald-400 flex items-center gap-1 font-semibold pt-1">
                  <CheckCircle2 className="w-4 h-4" /> Syndicate Quorum Approved & Verified
                </p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
