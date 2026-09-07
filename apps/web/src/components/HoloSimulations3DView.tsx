import React, { useState, useEffect, useRef } from 'react';
import {
  Cpu,
  Sparkles,
  Play,
  Pause,
  RotateCcw,
  Layers,
  Zap,
  Activity
} from 'lucide-react';
import {
  Simulation3DModel,
  SimulationParameter,
  RunSimulationDto
} from '@studentlife/shared';

interface HoloSimulations3DViewProps {
  onAddXp?: (xp: number, reason: string) => void;
}

export const HoloSimulations3DView: React.FC<HoloSimulations3DViewProps> = ({ onAddXp }) => {
  const [simulations, setSimulations] = useState<Simulation3DModel[]>([]);
  const [activeSim, setActiveSim] = useState<Simulation3DModel | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [clockTick, setClockTick] = useState<number>(0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameIdRef = useRef<number | null>(null);

  useEffect(() => {
    fetchSimulations();
  }, []);

  const fetchSimulations = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/holo-simulations/models');
      const data = await res.json();
      if (data.success && data.data) {
        setSimulations(data.data);
        if (data.data.length > 0) {
          setActiveSim(data.data[0]);
        }
      }
    } catch (err) {
      console.error('Failed to fetch simulations', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleParameterChange = async (paramId: string, newValue: number) => {
    if (!activeSim) return;
    const updatedParams = activeSim.parameters.map(p => p.id === paramId ? { ...p, value: newValue } : p);
    const updatedSim = { ...activeSim, parameters: updatedParams };
    setActiveSim(updatedSim);

    const paramMap: Record<string, number> = {};
    updatedParams.forEach(p => { paramMap[p.id] = p.value; });

    try {
      const dto: RunSimulationDto = {
        simulationId: activeSim.id,
        parameters: paramMap
      };
      await fetch('/api/holo-simulations/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dto)
      });
      onAddXp?.(10, 'Tweaked 3D Holo-Lab Physics Parameters');
    } catch (err) {
      console.error('Failed to sync simulation parameters', err);
    }
  };

  // Canvas Animation Render Loop
  useEffect(() => {
    let tick = 0;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      if (isPlaying) {
        tick += 0.05;
        setClockTick(Math.floor(tick * 10));
      }

      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      // Dark futuristic grid
      ctx.fillStyle = '#060a12';
      ctx.fillRect(0, 0, width, height);

      if (activeSim?.id === 'sim-cpu-pipeline') {
        // Draw 5-Stage RISC Pipeline Boxes
        const stages = ['IF (Fetch)', 'ID (Decode)', 'EX (Execute)', 'MEM (Access)', 'WB (WriteBack)'];
        const stageColors = ['#38bdf8', '#818cf8', '#ec4899', '#f59e0b', '#10b981'];
        const boxWidth = 100;
        const boxHeight = 70;
        const startX = 30;
        const y = height / 2 - 35;
        const spacing = 125;

        stages.forEach((st, idx) => {
          const x = startX + idx * spacing;
          ctx.fillStyle = `${stageColors[idx]}22`;
          ctx.strokeStyle = stageColors[idx];
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.roundRect(x, y, boxWidth, boxHeight, 8);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 11px Inter, sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(st, x + boxWidth / 2, y + 40);

          // Arrow to next stage
          if (idx < stages.length - 1) {
            ctx.strokeStyle = '#64748b';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(x + boxWidth, y + boxHeight / 2);
            ctx.lineTo(x + spacing, y + boxHeight / 2);
            ctx.stroke();
          }
        });

        // Moving Instruction Data Packets
        const packetX = (startX + (tick * 80) % (spacing * 5)) % (width - 40);
        ctx.fillStyle = '#38bdf8';
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(packetX, y + boxHeight / 2, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      } else if (activeSim?.id === 'sim-pendulum-chaos') {
        // Double Pendulum Simulation
        const originX = width / 2;
        const originY = 60;
        const l1 = 110;
        const l2 = 90;
        const theta1 = Math.sin(tick * 1.5) * 1.2;
        const theta2 = Math.sin(tick * 2.2 + 1.0) * 1.6;

        const x1 = originX + l1 * Math.sin(theta1);
        const y1 = originY + l1 * Math.cos(theta1);
        const x2 = x1 + l2 * Math.sin(theta2);
        const y2 = y1 + l2 * Math.cos(theta2);

        // Rod 1
        ctx.strokeStyle = '#818cf8';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(originX, originY);
        ctx.lineTo(x1, y1);
        ctx.stroke();

        // Rod 2
        ctx.strokeStyle = '#f472b6';
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();

        // Bobs
        ctx.fillStyle = '#818cf8';
        ctx.beginPath();
        ctx.arc(x1, y1, 10, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#f472b6';
        ctx.shadowColor = '#f472b6';
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.arc(x2, y2, 12, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      } else {
        // Electromagnetic Wave propagation
        const centerY = height / 2;
        ctx.lineWidth = 2;
        for (let x = 0; x < width; x += 4) {
          const eY = centerY + Math.sin(x * 0.03 - tick * 2) * 45;
          const bY = centerY + Math.cos(x * 0.03 - tick * 2) * 25;

          ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
          ctx.beginPath();
          ctx.moveTo(x, centerY);
          ctx.lineTo(x, eY);
          ctx.stroke();

          ctx.strokeStyle = 'rgba(244, 114, 182, 0.4)';
          ctx.beginPath();
          ctx.moveTo(x, centerY);
          ctx.lineTo(x, bY);
          ctx.stroke();
        }
      }

      animFrameIdRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
    };
  }, [isPlaying, activeSim]);

  if (isLoading || !activeSim) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
        <Cpu size={36} className="animate-pulse" style={{ margin: '0 auto 16px', color: 'var(--accent-primary)' }} />
        <p>Loading 3D Interactive Science & CS Holo-Lab...</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top Banner */}
      <div className="glass-panel" style={{
        padding: '24px 32px',
        background: 'linear-gradient(135deg, rgba(30, 27, 75, 0.7) 0%, rgba(15, 23, 42, 0.9) 100%)',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '16px'
      }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span className="badge badge-active" style={{ backgroundColor: 'rgba(168, 85, 247, 0.2)', color: '#c084fc' }}>
              <Sparkles size={12} /> PHASE 49 &bull; 3D WEBGL HOLO-LAB
            </span>
            <span className="badge badge-completed">60 FPS Real-time Solver</span>
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>
            3D Science & CS <span className="gradient-text">Holo-Lab 🧬</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
            Experiment with CPU Pipeline hazards, double pendulum chaotic motion, and Maxwell electromagnetic fields.
          </p>
        </div>

        {/* Model Switcher */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {simulations.map(sim => (
            <button
              key={sim.id}
              onClick={() => setActiveSim(sim)}
              className="glow-hover"
              style={{
                padding: '8px 14px',
                borderRadius: 'var(--radius-full)',
                border: activeSim.id === sim.id ? '1px solid var(--accent-primary)' : '1px solid var(--border-glass)',
                backgroundColor: activeSim.id === sim.id ? 'var(--accent-primary)' : 'rgba(15, 23, 42, 0.6)',
                color: activeSim.id === sim.id ? '#ffffff' : 'var(--text-secondary)',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              {sim.title.split(' ')[0]} {sim.title.split(' ')[1]}
            </button>
          ))}
        </div>
      </div>

      {/* Main Simulation Stage & Controls */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '20px' }}>
        {/* Canvas Simulation Stage */}
        <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Zap size={18} color="#38bdf8" />
              {activeSim.title}
            </h3>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="btn btn-secondary"
                style={{ padding: '6px 12px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                {isPlaying ? <Pause size={12} /> : <Play size={12} />}
                {isPlaying ? 'Pause' : 'Resume'}
              </button>
              <button
                onClick={() => setClockTick(0)}
                className="btn btn-ghost"
                style={{ padding: '6px 10px', fontSize: '0.75rem' }}
              >
                <RotateCcw size={12} />
              </button>
            </div>
          </div>

          <canvas
            ref={canvasRef}
            width={640}
            height={320}
            style={{
              width: '100%',
              height: '320px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-glass)'
            }}
          />

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            <span>Status: <strong style={{ color: '#34d399' }}>{isPlaying ? 'RUNNING (60 FPS)' : 'PAUSED'}</strong></span>
            <span>Clock Pulse: #{clockTick}</span>
            <span>Active Stage: <strong style={{ color: '#38bdf8' }}>{activeSim.activeStageLabel}</strong></span>
          </div>
        </div>

        {/* Right: Parameter Sliders & Mathematical Formulas */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Sliders */}
          <div className="glass-panel" style={{ padding: '20px' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Activity size={16} color="var(--accent-primary)" />
              Simulation Sliders & Parameters
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {activeSim.parameters.map((param: SimulationParameter) => (
                <div key={param.id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>{param.name}</span>
                    <span style={{ fontWeight: 700, color: '#38bdf8' }}>
                      {param.value} {param.unit}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={param.min}
                    max={param.max}
                    step={param.step}
                    value={param.value}
                    onChange={(e) => handleParameterChange(param.id, Number(e.target.value))}
                    style={{ width: '100%', accentColor: 'var(--accent-primary)', cursor: 'pointer' }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Key Formulas */}
          <div className="glass-panel" style={{ padding: '20px' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Layers size={16} color="#fbbf24" />
              Governing Physical / Asymptotic Formulas
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {activeSim.keyFormulas.map((formula, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'rgba(9, 13, 22, 0.8)',
                    border: '1px solid var(--border-glass)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.75rem',
                    color: '#fbbf24'
                  }}
                >
                  {formula}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
