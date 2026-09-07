import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Sparkles,
  DollarSign,
  Activity,
  CheckCircle2
} from 'lucide-react';
import { OrderBookSnapshot } from '@studentlife/shared';

interface Props {
  onAddXp?: (amount: number) => void;
}

export const HftOrderBookView: React.FC<Props> = ({ onAddXp }) => {
  const [tradeSide, setTradeSide] = useState<'BUY' | 'SELL'>('BUY');
  const [tradeQty, setTradeQty] = useState(10);
  const [orderType, setOrderType] = useState<'LIMIT' | 'MARKET'>('MARKET');
  const [lastFillMsg, setLastFillMsg] = useState<string | null>(null);

  const [snapshot, setSnapshot] = useState<OrderBookSnapshot>({
    id: 'hft-snap-01',
    symbol: 'STUDENT_COIN / USD',
    lastTradePriceUsd: 2840.50,
    spreadBps: 1.8,
    bidLadder: [
      { priceUsd: 2840.40, aggregateQuantity: 145, orderCount: 12 },
      { priceUsd: 2840.20, aggregateQuantity: 320, orderCount: 28 },
      { priceUsd: 2840.00, aggregateQuantity: 890, orderCount: 65 },
      { priceUsd: 2839.50, aggregateQuantity: 1450, orderCount: 110 }
    ],
    askLadder: [
      { priceUsd: 2840.60, aggregateQuantity: 180, orderCount: 14 },
      { priceUsd: 2840.80, aggregateQuantity: 290, orderCount: 22 },
      { priceUsd: 2841.00, aggregateQuantity: 740, orderCount: 58 },
      { priceUsd: 2841.50, aggregateQuantity: 1620, orderCount: 125 }
    ],
    recentFills: [
      { price: 2840.55, quantity: 25, side: 'BUY', timestamp: '11:45:01.892' },
      { price: 2840.50, quantity: 50, side: 'SELL', timestamp: '11:45:01.810' },
      { price: 2840.45, quantity: 15, side: 'SELL', timestamp: '11:45:01.650' }
    ],
    matchingEngineLatencyMicros: 4.2
  });

  const fetchSnapshot = async () => {
    try {
      const res = await fetch('/api/hft-orderbook/snapshot');
      if (res.ok) {
        const data: OrderBookSnapshot = await res.json();
        setSnapshot(data);
      }
    } catch {
      // Fallback
    }
  };

  useEffect(() => {
    fetchSnapshot();
  }, []);

  const handleExecuteTrade = async () => {
    try {
      const res = await fetch('/api/hft-orderbook/trade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          side: tradeSide,
          priceUsd: snapshot.lastTradePriceUsd,
          quantityLots: tradeQty,
          orderType
        })
      });
      if (res.ok) {
        const data = await res.json();
        setLastFillMsg(`Filled ${tradeQty} lots of ${tradeSide} @ $${data.fillPrice} in ${data.latencyMicros}µs (Order: ${data.orderId})`);
        if (onAddXp) onAddXp(65);
      }
    } catch {
      // Fallback
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-950/70 via-slate-900 to-teal-950/80 border border-emerald-500/30 p-6 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
              <TrendingUp className="w-3.5 h-3.5" />
              Phase 99 • High-Frequency Algorithmic Order Book (L2/L3) & Limit Matching Engine
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-3">
              Sub-Microsecond L2/L3 Order Depth Matching Engine
              <span className="text-xs px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                Price-Time FIFO
              </span>
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl">
              Simulate ultra-low latency quantitative trading, inspect Level-2 market depth ladders, and backtest automated limit order routing with sub-5 microsecond execution latencies.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchSnapshot}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-medium shadow-lg shadow-emerald-500/25 transition-all text-sm"
            >
              <Sparkles className="w-4 h-4" />
              Refresh L2 Book
            </button>
          </div>
        </div>
      </div>

      {lastFillMsg && (
        <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/50 text-emerald-300 text-xs flex items-center justify-between">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            {lastFillMsg}
          </span>
          <button onClick={() => setLastFillMsg(null)} className="text-slate-400 hover:text-white text-xs">
            Dismiss
          </button>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Order Execution Terminal */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              Trade Entry Terminal
            </h3>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setTradeSide('BUY')}
                  className={`py-2 rounded-lg font-bold transition-all ${
                    tradeSide === 'BUY'
                      ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                      : 'bg-slate-950 text-slate-400 border border-slate-800'
                  }`}
                >
                  BUY
                </button>
                <button
                  onClick={() => setTradeSide('SELL')}
                  className={`py-2 rounded-lg font-bold transition-all ${
                    tradeSide === 'SELL'
                      ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20'
                      : 'bg-slate-950 text-slate-400 border border-slate-800'
                  }`}
                >
                  SELL
                </button>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Order Execution Type</label>
                <select
                  value={orderType}
                  onChange={(e) => setOrderType(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="MARKET">Immediate Market Order (Taker)</option>
                  <option value="LIMIT">Resting Limit Order (Maker)</option>
                </select>
              </div>

              <div>
                <div className="flex justify-between text-slate-400 mb-1">
                  <span>Order Quantity</span>
                  <span className="text-white font-mono font-bold">{tradeQty} Lots</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={100}
                  value={tradeQty}
                  onChange={(e) => setTradeQty(parseInt(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>

              <button
                onClick={handleExecuteTrade}
                className={`w-full py-2.5 rounded-xl font-bold text-xs shadow-lg transition-all ${
                  tradeSide === 'BUY'
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white'
                    : 'bg-gradient-to-r from-rose-500 to-pink-600 text-white'
                }`}
              >
                Send {tradeSide} Order ({tradeQty} Lots)
              </button>
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-4 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-teal-400" />
              <span className="text-slate-300 font-semibold">Engine Latency:</span>
            </div>
            <span className="text-teal-400 font-mono font-bold text-sm">{snapshot.matchingEngineLatencyMicros} µs</span>
          </div>
        </div>

        {/* Right Column: Visual L2 Depth Book */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                Live L2 Depth Ladder ({snapshot.symbol})
              </h3>
              <span className="text-xs font-mono text-slate-400">
                Spread: <span className="text-emerald-400 font-bold">{snapshot.spreadBps} bps</span>
              </span>
            </div>

            {/* Asks (Sellers) */}
            <div className="space-y-1 text-xs">
              <div className="text-[10px] text-rose-400 font-bold uppercase tracking-wider mb-1">
                Asks (Sellers)
              </div>
              {snapshot.askLadder.slice(0, 3).reverse().map((level, idx) => (
                <div
                  key={idx}
                  className="p-2 rounded-lg bg-rose-950/20 border border-rose-500/20 flex items-center justify-between font-mono"
                >
                  <span className="text-rose-400 font-bold">${level.priceUsd.toFixed(2)}</span>
                  <span className="text-slate-300">{level.aggregateQuantity} lots</span>
                  <span className="text-slate-500 text-[10px]">{level.orderCount} ords</span>
                </div>
              ))}
            </div>

            {/* Mid Market Price */}
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-center font-mono">
              <span className="text-xs text-slate-400 mr-2">Mid-Market Price:</span>
              <span className="text-lg font-black text-white">${snapshot.lastTradePriceUsd.toFixed(2)}</span>
            </div>

            {/* Bids (Buyers) */}
            <div className="space-y-1 text-xs">
              <div className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider mb-1">
                Bids (Buyers)
              </div>
              {snapshot.bidLadder.slice(0, 3).map((level, idx) => (
                <div
                  key={idx}
                  className="p-2 rounded-lg bg-emerald-950/20 border border-emerald-500/20 flex items-center justify-between font-mono"
                >
                  <span className="text-emerald-400 font-bold">${level.priceUsd.toFixed(2)}</span>
                  <span className="text-slate-300">{level.aggregateQuantity} lots</span>
                  <span className="text-slate-500 text-[10px]">{level.orderCount} ords</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HftOrderBookView;
