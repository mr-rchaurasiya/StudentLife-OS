import React, { useState } from 'react';
import {
  TrendingUp,
  Sparkles,
  DollarSign,
  Activity
} from 'lucide-react';
import { OrderBookSnapshot } from '@studentlife/shared';

interface Props {
  onAddXp?: (amount: number, reason?: string) => void;
}

export const HftOrderBookView: React.FC<Props> = ({ onAddXp }) => {
  const [side, setSide] = useState<'BUY' | 'SELL'>('BUY');
  const [orderType, setOrderType] = useState<'LIMIT' | 'MARKET'>('LIMIT');
  const [price, setPrice] = useState(2840.50);
  const [quantity, setQuantity] = useState(50);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [snapshot] = useState<OrderBookSnapshot>({
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

  const handleExecuteTrade = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/hft-orderbook/trade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          side,
          orderType,
          priceUsd: price,
          quantityLots: quantity
        })
      });
      if (res.ok) {
        const data = await res.json();
        setStatusMsg(`Order Filled at $${data.fillPrice} (Latency: ${data.latencyMicros}µs)`);
        if (onAddXp) onAddXp(60, 'Executed High-Frequency Limit Order');
      }
    } catch {
      setStatusMsg(`Order Placed Locally (Simulated fill at $${price})`);
      if (onAddXp) onAddXp(60, 'Executed High-Frequency Limit Order');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1280px', margin: '0 auto', width: '100%' }}>
      {/* Header Banner */}
      <div 
        className="glass-panel"
        style={{
          padding: '28px 32px',
          background: 'linear-gradient(135deg, rgba(5, 150, 105, 0.2) 0%, rgba(30, 27, 75, 0.85) 50%, rgba(15, 23, 42, 0.95) 100%)',
          borderRadius: '20px',
          border: '1px solid rgba(16, 185, 129, 0.35)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px'
        }}
      >
        <div style={{ maxWidth: '700px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
            <span 
              className="badge" 
              style={{ 
                backgroundColor: 'rgba(16, 185, 129, 0.25)', 
                color: '#34d399', 
                border: '1px solid rgba(16, 185, 129, 0.4)',
                padding: '4px 12px',
                borderRadius: '9999px',
                fontSize: '0.75rem',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <TrendingUp size={14} color="#34d399" />
              PHASE 99 &bull; QUANTITATIVE FINTECH & MICROSTRUCTURE
            </span>
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#ffffff', marginBottom: '8px' }}>
            High-Frequency Algorithmic <span style={{ background: 'linear-gradient(135deg, #34d399, #059669, #0284c7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Order Book (L2/L3)</span>
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#cbd5e1', lineHeight: 1.5 }}>
            Sub-microsecond Price-Time FIFO matching engine, dynamic bid/ask depth ladders, VWAP execution, and slippage telemetry.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', backgroundColor: 'rgba(9, 13, 22, 0.8)', padding: '12px 18px', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <div>
            <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Last Trade Price</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#34d399', fontFamily: 'var(--font-mono)' }}>
              ${snapshot.lastTradePriceUsd.toFixed(2)}
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: L2 Depth & Order Placement */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
        {/* Left: L2 Depth Ladder */}
        <div 
          className="glass-panel"
          style={{
            padding: '24px',
            borderRadius: '18px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            background: 'var(--bg-card)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Activity size={18} color="#06b6d4" />
              Level-2 Market Depth Order Ladder
            </h3>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontFamily: 'var(--font-mono)' }}>
              Spread: {snapshot.spreadBps} bps
            </span>
          </div>

          {/* Asks (Red) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{ fontSize: '0.7rem', color: '#f43f5e', fontWeight: 700 }}>ASKS (SELLERS)</span>
            {snapshot.askLadder.slice(0, 3).reverse().map((ask, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 10px', backgroundColor: 'rgba(244, 63, 94, 0.08)', borderRadius: '6px', fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>
                <span style={{ color: '#fb7185' }}>${ask.priceUsd.toFixed(2)}</span>
                <span style={{ color: '#cbd5e1' }}>{ask.aggregateQuantity} Lots</span>
                <span style={{ color: '#64748b' }}>({ask.orderCount} orders)</span>
              </div>
            ))}
          </div>

          <div style={{ height: '1px', backgroundColor: 'rgba(255, 255, 255, 0.1)', margin: '4px 0' }} />

          {/* Bids (Green) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{ fontSize: '0.7rem', color: '#10b981', fontWeight: 700 }}>BIDS (BUYERS)</span>
            {snapshot.bidLadder.slice(0, 3).map((bid, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 10px', backgroundColor: 'rgba(16, 185, 129, 0.08)', borderRadius: '6px', fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>
                <span style={{ color: '#34d399' }}>${bid.priceUsd.toFixed(2)}</span>
                <span style={{ color: '#cbd5e1' }}>{bid.aggregateQuantity} Lots</span>
                <span style={{ color: '#64748b' }}>({bid.orderCount} orders)</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Trade Execution Form */}
        <div 
          className="glass-panel"
          style={{
            padding: '24px',
            borderRadius: '18px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            background: 'var(--bg-card)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <DollarSign size={18} color="#34d399" />
            <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#ffffff' }}>
              Direct DMA / HFT Order Ticket
            </h3>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setSide('BUY')}
              style={{
                flex: 1,
                padding: '10px',
                borderRadius: '10px',
                border: 'none',
                backgroundColor: side === 'BUY' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(15, 23, 42, 0.6)',
                color: side === 'BUY' ? '#34d399' : '#94a3b8',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer',
                borderWidth: '1px',
                borderStyle: 'solid',
                borderColor: side === 'BUY' ? '#10b981' : 'rgba(255, 255, 255, 0.08)'
              }}
            >
              BUY (BID)
            </button>
            <button
              onClick={() => setSide('SELL')}
              style={{
                flex: 1,
                padding: '10px',
                borderRadius: '10px',
                border: 'none',
                backgroundColor: side === 'SELL' ? 'rgba(244, 63, 94, 0.3)' : 'rgba(15, 23, 42, 0.6)',
                color: side === 'SELL' ? '#fb7185' : '#94a3b8',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer',
                borderWidth: '1px',
                borderStyle: 'solid',
                borderColor: side === 'SELL' ? '#f43f5e' : 'rgba(255, 255, 255, 0.08)'
              }}
            >
              SELL (ASK)
            </button>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setOrderType('LIMIT')}
              style={{
                flex: 1,
                padding: '6px 12px',
                borderRadius: '8px',
                backgroundColor: orderType === 'LIMIT' ? 'rgba(99, 102, 241, 0.3)' : 'rgba(15, 23, 42, 0.6)',
                color: orderType === 'LIMIT' ? '#a5b4fc' : '#94a3b8',
                fontWeight: 600,
                fontSize: '0.75rem',
                cursor: 'pointer',
                border: orderType === 'LIMIT' ? '1px solid #6366f1' : '1px solid rgba(255, 255, 255, 0.08)'
              }}
            >
              LIMIT ORDER
            </button>
            <button
              onClick={() => setOrderType('MARKET')}
              style={{
                flex: 1,
                padding: '6px 12px',
                borderRadius: '8px',
                backgroundColor: orderType === 'MARKET' ? 'rgba(99, 102, 241, 0.3)' : 'rgba(15, 23, 42, 0.6)',
                color: orderType === 'MARKET' ? '#a5b4fc' : '#94a3b8',
                fontWeight: 600,
                fontSize: '0.75rem',
                cursor: 'pointer',
                border: orderType === 'MARKET' ? '1px solid #6366f1' : '1px solid rgba(255, 255, 255, 0.08)'
              }}
            >
              MARKET ORDER
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Limit Price ($)</label>
              <input
                type="number"
                step="0.1"
                value={price}
                onChange={(e) => setPrice(parseFloat(e.target.value))}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', backgroundColor: 'rgba(9, 13, 22, 0.8)', border: '1px solid rgba(255, 255, 255, 0.08)', color: '#ffffff', outline: 'none', fontFamily: 'var(--font-mono)' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Quantity (Lots)</label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', backgroundColor: 'rgba(9, 13, 22, 0.8)', border: '1px solid rgba(255, 255, 255, 0.08)', color: '#ffffff', outline: 'none', fontFamily: 'var(--font-mono)' }}
              />
            </div>
          </div>

          <button
            onClick={handleExecuteTrade}
            disabled={isLoading}
            className="glow-hover"
            style={{
              padding: '12px',
              borderRadius: '12px',
              border: 'none',
              background: side === 'BUY' ? 'linear-gradient(135deg, #059669, #10b981)' : 'linear-gradient(135deg, #e11d48, #f43f5e)',
              color: '#ffffff',
              fontSize: '0.9rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <Sparkles size={16} color="#ffffff" />
            {isLoading ? 'Executing...' : `Transmit ${side} Limit Order`}
          </button>

          {statusMsg && (
            <div style={{ padding: '8px 12px', borderRadius: '8px', backgroundColor: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', color: '#34d399', fontSize: '0.75rem', textAlign: 'center' }}>
              {statusMsg}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HftOrderBookView;
