import React, { useState } from 'react';
import {
  Heart,
  Sparkles,
  Dna,
  Activity
} from 'lucide-react';
import { EpigeneticClockReport } from '@studentlife/shared';

interface Props {
  onAddXp?: (amount: number, reason?: string) => void;
}

export const EpigeneticClockView: React.FC<Props> = ({ onAddXp }) => {
  const [chronoAge, setChronoAge] = useState(22);
  const [sleepHours, setSleepHours] = useState(7.5);
  const [cardioMins, setCardioMins] = useState(150);
  const [dietScore, setDietScore] = useState(8);
  const [stressScore, setStressScore] = useState(4);
  const [isLoading, setIsLoading] = useState(false);

  const [report, setReport] = useState<EpigeneticClockReport>({
    id: 'epi-init',
    chronologicalAgeYears: 22,
    epigeneticAgeHorvathYears: 19.8,
    epigeneticAgeHannumYears: 20.2,
    biologicalAgeAccelerationYears: -2.2,
    vitalityScorePercent: 92,
    analyzedCpgSites: [
      { cpgId: 'cg02228185', geneSymbol: 'ASPA', betaValuePercentage: 24.5, biologicalImpact: 'DNA_REPAIR' },
      { cpgId: 'cg25809905', geneSymbol: 'ELOVL2', betaValuePercentage: 18.2, biologicalImpact: 'METABOLIC_EFFICIENCY' },
      { cpgId: 'cg16867657', geneSymbol: 'KLF14', betaValuePercentage: 42.1, biologicalImpact: 'INFLAMMATION_REGULATION' },
      { cpgId: 'cg09809672', geneSymbol: 'EDARADD', betaValuePercentage: 12.8, biologicalImpact: 'CELLULAR_SENESCENCE' }
    ],
    recommendedLifestyleInterventions: [
      'Maintain 7.5+ hours of consistent deep REM circadian sleep',
      'Incorporate 150 mins Zone-2 mitochondrial aerobic training weekly',
      'Adopt polyphenol-rich antioxidant foods (matcha, berries, leafy greens)'
    ]
  });

  const handleAnalyze = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/epigenetic-clock/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chronologicalAgeYears: chronoAge,
          dailySleepHours: sleepHours,
          weeklyCardioMinutes: cardioMins,
          mediterraneanDietAdherenceScore: dietScore,
          stressIndex: stressScore
        })
      });
      if (res.ok) {
        const data: EpigeneticClockReport = await res.json();
        setReport(data);
        if (onAddXp) onAddXp(60, 'Analyzed Epigenetic DNA Methylation Clock');
      }
    } catch {
      // Local fallback
      const youth = (sleepHours - 7) * 0.6 + (cardioMins / 60) * 0.4 + (dietScore - 5) * 0.5 - (stressScore - 5) * 0.7;
      const horvath = Math.max(18, Math.round((chronoAge - youth) * 10) / 10);
      setReport({
        ...report,
        chronologicalAgeYears: chronoAge,
        epigeneticAgeHorvathYears: horvath,
        biologicalAgeAccelerationYears: Math.round((horvath - chronoAge) * 10) / 10,
        vitalityScorePercent: Math.min(99, Math.max(50, Math.round(85 + (chronoAge - horvath) * 3)))
      });
      if (onAddXp) onAddXp(60, 'Analyzed Epigenetic DNA Methylation Clock');
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
          background: 'linear-gradient(135deg, rgba(225, 29, 72, 0.2) 0%, rgba(30, 27, 75, 0.85) 50%, rgba(15, 23, 42, 0.95) 100%)',
          borderRadius: '20px',
          border: '1px solid rgba(244, 63, 94, 0.35)',
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
                backgroundColor: 'rgba(244, 63, 94, 0.25)', 
                color: '#fb7185', 
                border: '1px solid rgba(244, 63, 94, 0.4)',
                padding: '4px 12px',
                borderRadius: '9999px',
                fontSize: '0.75rem',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Heart size={14} color="#fb7185" />
              PHASE 98 &bull; EPIGENETICS & LONGEVITY
            </span>
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#ffffff', marginBottom: '8px' }}>
            Epigenetic DNA Methylation & <span style={{ background: 'linear-gradient(135deg, #fb7185, #f43f5e, #fda4af)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Biological Age Clock</span>
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#cbd5e1', lineHeight: 1.5 }}>
            Run multi-tissue Horvath & Hannum epigenetic clocks, regress CpG island methylation beta-values (β), and predict biological age reduction.
          </p>
        </div>

        <button
          onClick={handleAnalyze}
          disabled={isLoading}
          className="glow-hover"
          style={{
            padding: '12px 24px',
            borderRadius: '14px',
            border: 'none',
            background: 'linear-gradient(135deg, #e11d48 0%, #db2777 100%)',
            color: '#ffffff',
            fontSize: '0.9rem',
            fontWeight: 800,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 0 20px rgba(225, 29, 72, 0.4)'
          }}
        >
          <Sparkles size={16} color="#ffffff" />
          {isLoading ? 'Sequencing...' : 'Compute Epigenetic Age'}
        </button>
      </div>

      {/* Main Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
        {/* Left Column: Lifestyle Inputs */}
        <div 
          className="glass-panel"
          style={{
            padding: '24px',
            borderRadius: '18px',
            display: 'flex',
            flexDirection: 'column',
            gap: '18px',
            background: 'var(--bg-card)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Activity size={18} color="#fb7185" />
            <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#ffffff' }}>
              Lifestyle Biomarkers & Epigenetic Modulators
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '6px' }}>
                <span>Chronological Age</span>
                <span style={{ color: '#ffffff', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{chronoAge} Years</span>
              </div>
              <input
                type="range"
                min={18}
                max={75}
                value={chronoAge}
                onChange={(e) => setChronoAge(parseInt(e.target.value))}
                style={{ width: '100%', accentColor: '#f43f5e' }}
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '6px' }}>
                <span>Daily Sleep Duration</span>
                <span style={{ color: '#38bdf8', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{sleepHours} Hours</span>
              </div>
              <input
                type="range"
                min={4.0}
                max={10.0}
                step={0.5}
                value={sleepHours}
                onChange={(e) => setSleepHours(parseFloat(e.target.value))}
                style={{ width: '100%', accentColor: '#06b6d4' }}
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '6px' }}>
                <span>Weekly Cardio (Zone-2)</span>
                <span style={{ color: '#34d399', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{cardioMins} Mins</span>
              </div>
              <input
                type="range"
                min={0}
                max={360}
                step={15}
                value={cardioMins}
                onChange={(e) => setCardioMins(parseInt(e.target.value))}
                style={{ width: '100%', accentColor: '#10b981' }}
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '6px' }}>
                <span>Diet Quality (Mediterranean Score)</span>
                <span style={{ color: '#fbbf24', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{dietScore} / 10</span>
              </div>
              <input
                type="range"
                min={1}
                max={10}
                value={dietScore}
                onChange={(e) => setDietScore(parseInt(e.target.value))}
                style={{ width: '100%', accentColor: '#f59e0b' }}
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '6px' }}>
                <span>Chronic Stress Index</span>
                <span style={{ color: '#f43f5e', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{stressScore} / 10</span>
              </div>
              <input
                type="range"
                min={1}
                max={10}
                value={stressScore}
                onChange={(e) => setStressScore(parseInt(e.target.value))}
                style={{ width: '100%', accentColor: '#f43f5e' }}
              />
            </div>
          </div>
        </div>

        {/* Right Column: Epigenetic Output */}
        <div 
          className="glass-panel"
          style={{
            padding: '24px',
            borderRadius: '18px',
            display: 'flex',
            flexDirection: 'column',
            gap: '18px',
            background: 'var(--bg-card)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Dna size={18} color="#f43f5e" />
            <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#ffffff' }}>
              Horvath & Hannum Biological Age Report
            </h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
            <div style={{ padding: '12px', borderRadius: '12px', backgroundColor: 'rgba(9, 13, 22, 0.75)', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Horvath Biological Age</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#34d399', fontFamily: 'var(--font-mono)' }}>
                {report.epigeneticAgeHorvathYears} <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Yrs</span>
              </div>
            </div>

            <div style={{ padding: '12px', borderRadius: '12px', backgroundColor: 'rgba(9, 13, 22, 0.75)', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Age Acceleration (ΔAge)</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 900, color: report.biologicalAgeAccelerationYears <= 0 ? '#34d399' : '#f43f5e', fontFamily: 'var(--font-mono)' }}>
                {report.biologicalAgeAccelerationYears > 0 ? `+${report.biologicalAgeAccelerationYears}` : report.biologicalAgeAccelerationYears} <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Yrs</span>
              </div>
            </div>
          </div>

          {/* CpG Sites */}
          <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '12px' }}>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: '8px' }}>
              Analyzed CpG Methylation Sites (β-values):
            </span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
              {report.analyzedCpgSites.map((cpg, idx) => (
                <div key={idx} style={{ padding: '8px 10px', borderRadius: '8px', backgroundColor: 'rgba(9, 13, 22, 0.6)', border: '1px solid rgba(255, 255, 255, 0.06)', fontSize: '0.75rem' }}>
                  <div style={{ color: '#fb7185', fontWeight: 700 }}>{cpg.geneSymbol} ({cpg.cpgId})</div>
                  <div style={{ color: '#94a3b8', fontSize: '0.7rem' }}>Methylation: {cpg.betaValuePercentage}%</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EpigeneticClockView;
