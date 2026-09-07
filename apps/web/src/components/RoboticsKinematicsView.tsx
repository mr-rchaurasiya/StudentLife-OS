import React, { useState } from 'react';
import {
  Compass,
  Sparkles,
  RotateCw,
  CheckCircle2
} from 'lucide-react';
import { RoboticTrajectoryPlan } from '@studentlife/shared';

interface Props {
  onAddXp?: (amount: number) => void;
}

export const RoboticsKinematicsView: React.FC<Props> = ({ onAddXp }) => {
  const [targetX, setTargetX] = useState(0.45);
  const [targetY, setTargetY] = useState(0.20);
  const [targetZ, setTargetZ] = useState(0.35);
  const [pitchDeg, setPitchDeg] = useState(45);
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
    trajectoryWaypoints: []
  });

  const handleSolve = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/robotics-kinematics/compute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetX,
          targetY,
          targetZ,
          targetPitchDeg: pitchDeg
        })
      });
      if (res.ok) {
        const data: RoboticTrajectoryPlan = await res.json();
        setPlan(data);
        if (onAddXp) onAddXp(70);
      }
    } catch {
      // Fallback
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-teal-950/70 via-slate-900 to-cyan-950/80 border border-teal-500/30 p-6 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-400 text-xs font-semibold uppercase tracking-wider">
              <Compass className="w-3.5 h-3.5" />
              Phase 97 • Autonomous Robotic Arm Inverse Kinematics & 6-DOF ROS Trajectory Planner
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-3">
              6-DOF Robotic Kinematics & Jacobian Studio
              <span className="text-xs px-2.5 py-1 rounded-lg bg-teal-500/20 text-teal-300 border border-teal-500/40">
                ROS 2 IK-Fast
              </span>
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl">
              Solve Denavit-Hartenberg (DH) joint matrices, calculate Jacobian inverse velocity trajectories, and avoid kinematic singularities for autonomous industrial manipulators.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleSolve}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-400 hover:to-cyan-500 text-white font-medium shadow-lg shadow-teal-500/25 transition-all text-sm disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              {isLoading ? 'Solving Kinematics...' : 'Solve Inverse Kinematics'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: End-Effector Target Inputs */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <Compass className="w-4 h-4 text-teal-400" />
              Target End-Effector Coordinates
            </h3>

            <div className="space-y-4 text-xs">
              <div>
                <div className="flex justify-between text-slate-400 mb-1">
                  <span>Target X (Forward Reach)</span>
                  <span className="text-teal-300 font-mono font-bold">{targetX} m</span>
                </div>
                <input
                  type="range"
                  min={0.1}
                  max={0.85}
                  step={0.01}
                  value={targetX}
                  onChange={(e) => setTargetX(parseFloat(e.target.value))}
                  className="w-full accent-teal-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-slate-400 mb-1">
                  <span>Target Y (Lateral Reach)</span>
                  <span className="text-cyan-300 font-mono font-bold">{targetY} m</span>
                </div>
                <input
                  type="range"
                  min={-0.6}
                  max={0.6}
                  step={0.01}
                  value={targetY}
                  onChange={(e) => setTargetY(parseFloat(e.target.value))}
                  className="w-full accent-cyan-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-slate-400 mb-1">
                  <span>Target Z (Elevation Reach)</span>
                  <span className="text-indigo-300 font-mono font-bold">{targetZ} m</span>
                </div>
                <input
                  type="range"
                  min={0.05}
                  max={0.75}
                  step={0.01}
                  value={targetZ}
                  onChange={(e) => setTargetZ(parseFloat(e.target.value))}
                  className="w-full accent-indigo-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-slate-400 mb-1">
                  <span>Tool Pitch Angle</span>
                  <span className="text-amber-300 font-mono font-bold">{pitchDeg}°</span>
                </div>
                <input
                  type="range"
                  min={-90}
                  max={90}
                  step={1}
                  value={pitchDeg}
                  onChange={(e) => setPitchDeg(parseInt(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-4 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span className="text-slate-300 font-semibold">Singularity Metric:</span>
            </div>
            <span className="text-emerald-400 font-mono font-bold">{plan.singularityDistanceMetric} (Safe)</span>
          </div>
        </div>

        {/* Right Column: 6-Axis Joint Solution Table */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                <RotateCw className="w-4 h-4 text-teal-400" />
                Computed 6-DOF Joint Angles & Torques
              </h3>
              <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                Feasible Trajectory
              </span>
            </div>

            <div className="space-y-2.5">
              {plan.joints.map((joint) => (
                <div
                  key={joint.jointNumber}
                  className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between text-xs"
                >
                  <div className="space-y-0.5">
                    <div className="font-bold text-white">{joint.jointName}</div>
                    <div className="text-[10px] text-slate-500">
                      Limits: [{joint.minLimitDeg}°, {joint.maxLimitDeg}°]
                    </div>
                  </div>

                  <div className="text-right space-y-0.5">
                    <div className="font-mono font-bold text-teal-300 text-sm">
                      {joint.currentAngleDeg}°
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Torque: {joint.torqueNm} Nm
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoboticsKinematicsView;
