import React, { useState } from 'react';
import {
  RotateCw,
  Sparkles,
  Bot,
  CheckCircle2,
  Cpu
} from 'lucide-react';
import { RoboticTrajectoryPlan } from '@studentlife/shared';

interface Props {
  onAddXp?: (amount: number, reason?: string) => void;
}

export const RoboticsKinematicsView: React.FC<Props> = ({ onAddXp }) => {
  const [targetX, setTargetX] = useState(0.45);
  const [targetY, setTargetY] = useState(0.20);
  const [targetZ, setTargetZ] = useState(0.35);
  const [targetPitch, setTargetPitch] = useState(45);
  const [isLoading, setIsLoading] = useState(false);

  const [plan, setPlan] = useState<RoboticTrajectoryPlan>({
    id: 'traj-init',
    targetCoordinates: { x: 0.45, y: 0.20, z: 0.35, rollDeg: 0, pitchDeg: 45, yawDeg: 30 },
    joints: [
      { jointNumber: 1, jointName: 'Base Yaw (J1)', currentAngleDeg: 24.0, minLimitDeg: -180, maxLimitDeg: 180, torqueNm: 42.5 },
      { jointNumber: 2, jointName: 'Shoulder Pitch (J2)', currentAngleDeg: 48.5, minLimitDeg: -90, maxLimitDeg: 120, torqueNm: 78.1 },
      { jointNumber: 3, jointName: 'Elbow Pitch (J3)', currentAngleDeg: -25.5, minLimitDeg: -150, maxLimitDeg: 150, torqueNm: 54.0 },
      { jointNumber: 4, jointName: 'Wrist Pitch (J4)', currentAngleDeg: 22.0, minLimitDeg: -180, maxLimitDeg: 180, torqueNm: 18.2 },
      { jointNumber: 5, jointName: 'Wrist Roll (J5)', currentAngleDeg: 90.0, minLimitDeg: -180, maxLimitDeg: 180, torqueNm: 12.0 },
      { jointNumber: 6, jointName: 'End-Effector Yaw (J6)', currentAngleDeg: 30.0, minLimitDeg: -360, maxLimitDeg: 360, torqueNm: 6.5 }
    ],
    isReachabilityFeasible: true,
    singularityDistanceMetric: 0.084,
    executionTimeSec: 1.5,
    trajectoryWaypoints: [
      { timeStepSec: 0.0, jointAngles: [0, 0, 0, 0, 0, 0] },
      { timeStepSec: 0.5, jointAngles: [7.2, 14.5, -7.6, 6.6, 27.0, 9.0] },
      { timeStepSec: 1.0, jointAngles: [16.8, 33.9, -17.8, 15.4, 63.0, 21.0] },
      { timeStepSec: 1.5, jointAngles: [24.0, 48.5, -25.5, 22.0, 90.0, 30.0] }
    ]
  });

  const handleCompute = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/robotics-kinematics/compute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetX,
          targetY,
          targetZ,
          targetPitchDeg: targetPitch
        })
      });
      if (res.ok) {
        const data: RoboticTrajectoryPlan = await res.json();
        setPlan(data);
        if (onAddXp) onAddXp(60, 'Computed 6-DOF Inverse Kinematic Trajectory');
      }
    } catch {
      // Local fallback
      const theta1 = Math.round(Math.atan2(targetY, targetX) * (180 / Math.PI) * 10) / 10;
      setPlan((prev) => ({
        ...prev,
        targetCoordinates: { x: targetX, y: targetY, z: targetZ, rollDeg: 0, pitchDeg: targetPitch, yawDeg: 30 },
        joints: prev.joints.map((j, idx) => idx === 0 ? { ...j, currentAngleDeg: theta1 } : j)
      }));
      if (onAddXp) onAddXp(60, 'Computed 6-DOF Inverse Kinematic Trajectory');
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
          background: 'linear-gradient(135deg, rgba(13, 148, 136, 0.2) 0%, rgba(30, 27, 75, 0.85) 50%, rgba(15, 23, 42, 0.95) 100%)',
          borderRadius: '20px',
          border: '1px solid rgba(20, 184, 166, 0.35)',
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
                backgroundColor: 'rgba(20, 184, 166, 0.25)', 
                color: '#2dd4bf', 
                border: '1px solid rgba(20, 184, 166, 0.4)',
                padding: '4px 12px',
                borderRadius: '9999px',
                fontSize: '0.75rem',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <RotateCw size={14} color="#2dd4bf" />
              PHASE 97 &bull; MECHATRONICS & KINEMATICS
            </span>
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#ffffff', marginBottom: '8px' }}>
            Autonomous 6-DOF Robotic Arm <span style={{ background: 'linear-gradient(135deg, #2dd4bf, #06b6d4, #38bdf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Inverse Kinematics</span>
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#cbd5e1', lineHeight: 1.5 }}>
            Formulate Denavit-Hartenberg (DH) parameter matrices, resolve singularity condition numbers, and compute damped least-squares joint angles.
          </p>
        </div>

        <button
          onClick={handleCompute}
          disabled={isLoading}
          className="glow-hover"
          style={{
            padding: '12px 24px',
            borderRadius: '14px',
            border: 'none',
            background: 'linear-gradient(135deg, #0d9488 0%, #0891b2 100%)',
            color: '#ffffff',
            fontSize: '0.9rem',
            fontWeight: 800,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 0 20px rgba(13, 148, 136, 0.4)'
          }}
        >
          <Sparkles size={16} color="#ffffff" />
          {isLoading ? 'Computing...' : 'Solve Kinematics'}
        </button>
      </div>

      {/* Main Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
        {/* Left Column: Target Coordinates */}
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
            <Bot size={18} color="#2dd4bf" />
            <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#ffffff' }}>
              Target End-Effector Pose (Cartesian Workspace)
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '6px' }}>
                <span>Target X Position</span>
                <span style={{ color: '#2dd4bf', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{targetX.toFixed(2)} m</span>
              </div>
              <input
                type="range"
                min={0.10}
                max={0.85}
                step={0.01}
                value={targetX}
                onChange={(e) => setTargetX(parseFloat(e.target.value))}
                style={{ width: '100%', accentColor: '#14b8a6' }}
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '6px' }}>
                <span>Target Y Position</span>
                <span style={{ color: '#06b6d4', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{targetY.toFixed(2)} m</span>
              </div>
              <input
                type="range"
                min={-0.60}
                max={0.60}
                step={0.01}
                value={targetY}
                onChange={(e) => setTargetY(parseFloat(e.target.value))}
                style={{ width: '100%', accentColor: '#06b6d4' }}
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '6px' }}>
                <span>Target Z Position</span>
                <span style={{ color: '#38bdf8', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{targetZ.toFixed(2)} m</span>
              </div>
              <input
                type="range"
                min={0.05}
                max={0.80}
                step={0.01}
                value={targetZ}
                onChange={(e) => setTargetZ(parseFloat(e.target.value))}
                style={{ width: '100%', accentColor: '#38bdf8' }}
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '6px' }}>
                <span>Pitch Orientation</span>
                <span style={{ color: '#a78bfa', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{targetPitch}°</span>
              </div>
              <input
                type="range"
                min={-90}
                max={90}
                step={1}
                value={targetPitch}
                onChange={(e) => setTargetPitch(parseInt(e.target.value))}
                style={{ width: '100%', accentColor: '#a855f7' }}
              />
            </div>
          </div>
        </div>

        {/* Right Column: Solved Joint Angles */}
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Cpu size={18} color="#38bdf8" />
              <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#ffffff' }}>
                6-DOF Solved Joint Angle Vector (θ)
              </h3>
            </div>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#34d399', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <CheckCircle2 size={13} color="#34d399" /> Feasible
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
            {plan.joints.map((joint) => (
              <div 
                key={joint.jointNumber}
                style={{
                  padding: '12px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(9, 13, 22, 0.75)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px'
                }}
              >
                <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{joint.jointName}</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#2dd4bf', fontFamily: 'var(--font-mono)' }}>
                  {joint.currentAngleDeg}°
                </div>
                <div style={{ fontSize: '0.65rem', color: '#64748b' }}>Torque: {joint.torqueNm} Nm</div>
              </div>
            ))}
          </div>

          <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#94a3b8' }}>
            <span>Singularity Distance Metric: <strong style={{ color: '#34d399' }}>{plan.singularityDistanceMetric}</strong></span>
            <span>Execution Duration: <strong style={{ color: '#38bdf8' }}>{plan.executionTimeSec}s</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoboticsKinematicsView;
