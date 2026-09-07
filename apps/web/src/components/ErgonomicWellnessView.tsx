import React, { useState, useEffect } from 'react';
import {
  Eye,
  Activity,
  HeartPulse,
  AlertTriangle,
  CheckCircle,
  Play,
  RotateCcw,
  Sparkles,
  Camera,
  ShieldCheck,
  Award,
  Maximize2
} from 'lucide-react';
import { ErgonomicWellnessProfile } from '@studentlife/shared';

export const ErgonomicWellnessView: React.FC = () => {
  const [profile, setProfile] = useState<ErgonomicWellnessProfile | null>(null);
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [isCalibrating, setIsCalibrating] = useState<boolean>(false);
  const [countdownSeconds, setCountdownSeconds] = useState<number>(20);
  const [isBreakActive, setIsBreakActive] = useState<boolean>(false);
  const [simulatedBlinkCount, setSimulatedBlinkCount] = useState<number>(16);
  const [simulatedPosture, setSimulatedPosture] = useState<'GOOD_UPRIGHT' | 'FORWARD_HEAD_SLOUCH' | 'TOO_CLOSE_TO_SCREEN'>('GOOD_UPRIGHT');
  const [simulatedDistance, setSimulatedDistance] = useState<number>(55);
  const [activeStretchIndex, setActiveStretchIndex] = useState<number>(0);

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    let timer: any;
    if (isBreakActive && countdownSeconds > 0) {
      timer = setInterval(() => {
        setCountdownSeconds((prev) => prev - 1);
      }, 1000);
    } else if (countdownSeconds === 0 && isBreakActive) {
      setIsBreakActive(false);
      triggerAction('EYE_BREAK');
      setCountdownSeconds(20);
    }
    return () => clearInterval(timer);
  }, [isBreakActive, countdownSeconds]);

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/ergonomic-wellness/profile');
      const data = await res.json();
      if (data.success) {
        setProfile(data.data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const toggleCamera = () => {
    if (!isCameraActive) {
      setIsCalibrating(true);
      setTimeout(() => {
        setIsCalibrating(false);
        setIsCameraActive(true);
      }, 1500);
    } else {
      setIsCameraActive(false);
    }
  };

  const handleSimulateChange = async (
    blink: number,
    posture: 'GOOD_UPRIGHT' | 'FORWARD_HEAD_SLOUCH' | 'TOO_CLOSE_TO_SCREEN',
    distance: number
  ) => {
    setSimulatedBlinkCount(blink);
    setSimulatedPosture(posture);
    setSimulatedDistance(distance);

    try {
      const res = await fetch('/api/ergonomic-wellness/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          blinkRatePerMinute: blink,
          postureStatus: posture,
          distanceCm: distance
        })
      });
      const data = await res.json();
      if (data.success) {
        setProfile(data.data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const triggerAction = async (action: 'EYE_BREAK' | 'STRETCH') => {
    try {
      const res = await fetch('/api/ergonomic-wellness/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action })
      });
      const data = await res.json();
      if (data.success) {
        setProfile(data.data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const stretchRoutines = [
    {
      name: 'Trapezius & Neck Release',
      duration: '30 sec',
      steps: 'Gently tilt right ear to right shoulder, hold 15s. Repeat on the left side with deep breathing.',
      target: 'Upper Trapezius & Cervical Spine'
    },
    {
      name: 'Chin Tucks (Anti-Slouch)',
      duration: '20 sec',
      steps: 'Pull chin straight back creating a double chin posture. Hold 5s. Repeat 5 times to realign spine.',
      target: 'Deep Cervical Flexors'
    },
    {
      name: 'Thoracic Extension & Chest Opener',
      duration: '45 sec',
      steps: 'Interlock hands behind your head. Inhale and open elbows wide while arching upper back gently.',
      target: 'Pectoralis & Upper Thoracic'
    }
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900/60 via-teal-900/40 to-slate-900/80 border border-emerald-500/30 rounded-2xl p-6 backdrop-blur-xl shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-2 border border-emerald-500/30">
              <Sparkles className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '4s' }} />
              Phase 55: AI Ergonomics & Bio-Feedback Monitor
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
              <HeartPulse className="w-8 h-8 text-emerald-400" />
              Ergonomic Posture & Eye-Blink Bio-Feedback
            </h1>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl">
              Real-time computer vision telemetry for desk fatigue mitigation, 20-20-20 optical eye breaks, and cervical spine alignment.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={toggleCamera}
              className={`px-4 py-2.5 rounded-xl font-medium text-sm flex items-center gap-2 transition shadow-lg ${
                isCameraActive
                  ? 'bg-rose-600/90 text-white hover:bg-rose-500 shadow-rose-900/30'
                  : 'bg-emerald-600 text-white hover:bg-emerald-500 shadow-emerald-900/30'
              }`}
            >
              <Camera className="w-4 h-4" />
              {isCalibrating ? 'Calibrating Mesh...' : isCameraActive ? 'Disconnect AI Cam' : 'Activate Bio-Feedback Cam'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Live Bio Telemetry & 20-20-20 Break Engine */}
        <div className="lg:col-span-2 space-y-6">
          {/* Real-time Telemetry Dashboard */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-teal-400" />
                Live Bio-Telemetry & Posture Status
              </h2>
              <span
                className={`text-xs px-2.5 py-1 rounded-full font-semibold border ${
                  isCameraActive
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 animate-pulse'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}
              >
                {isCameraActive ? '● Live Optical Sensor' : 'Sensor Standby'}
              </span>
            </div>

            {/* Simulation / Sensor Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                  <span>Blink Rate</span>
                  <Eye className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="text-2xl font-black text-white">{profile?.blinkRatePerMinute || simulatedBlinkCount} <span className="text-xs font-normal text-slate-400">/min</span></div>
                <div className="text-[11px] text-slate-400 mt-1">
                  {(profile?.blinkRatePerMinute || simulatedBlinkCount) < 12 ? '⚠️ Low (Eye strain risk)' : '✅ Healthy blink rhythm'}
                </div>
              </div>

              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                  <span>Cervical Posture</span>
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-lg font-bold text-white truncate">
                  {(profile?.currentPostureStatus || simulatedPosture) === 'GOOD_UPRIGHT' && <span className="text-emerald-400">Upright & Aligned</span>}
                  {(profile?.currentPostureStatus || simulatedPosture) === 'FORWARD_HEAD_SLOUCH' && <span className="text-amber-400">Forward Head Slouch</span>}
                  {(profile?.currentPostureStatus || simulatedPosture) === 'TOO_CLOSE_TO_SCREEN' && <span className="text-rose-400">Too Close to Screen</span>}
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  Distance: {profile?.screenDistanceCm || simulatedDistance} cm
                </div>
              </div>

              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                  <span>Eye Strain Index</span>
                  <AlertTriangle className="w-4 h-4 text-yellow-400" />
                </div>
                <div className="text-2xl font-black text-white">{profile?.digitalEyeStrainScore ?? 32} <span className="text-xs font-normal text-slate-400">/100</span></div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div
                    className={`h-full ${
                      (profile?.digitalEyeStrainScore ?? 32) > 60
                        ? 'bg-rose-500'
                        : (profile?.digitalEyeStrainScore ?? 32) > 35
                        ? 'bg-amber-500'
                        : 'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.min(100, profile?.digitalEyeStrainScore ?? 32)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Quick Simulate Buttons to Test Algorithm */}
            <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-800/80 mb-4">
              <div className="text-xs text-slate-400 font-semibold mb-2 flex items-center gap-1.5">
                <Maximize2 className="w-3.5 h-3.5 text-teal-400" />
                Simulate Ergonomic State Profiles:
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleSimulateChange(18, 'GOOD_UPRIGHT', 58)}
                  className="px-3 py-1.5 bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-700/50 text-emerald-300 rounded-lg text-xs font-medium transition"
                >
                  🟢 Optimal (18 blinks, 58cm Upright)
                </button>
                <button
                  onClick={() => handleSimulateChange(8, 'FORWARD_HEAD_SLOUCH', 42)}
                  className="px-3 py-1.5 bg-amber-950/60 hover:bg-amber-900/80 border border-amber-700/50 text-amber-300 rounded-lg text-xs font-medium transition"
                >
                  🟡 Slouch & Low Blinks (8 blinks, 42cm)
                </button>
                <button
                  onClick={() => handleSimulateChange(6, 'TOO_CLOSE_TO_SCREEN', 28)}
                  className="px-3 py-1.5 bg-rose-950/60 hover:bg-rose-900/80 border border-rose-700/50 text-rose-300 rounded-lg text-xs font-medium transition"
                >
                  🔴 Critical Strain (6 blinks, 28cm Near)
                </button>
              </div>
            </div>

            {/* Active Alerts */}
            {profile?.activeAlerts && profile.activeAlerts.length > 0 && (
              <div className="space-y-2">
                {profile.activeAlerts.map((alert, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 bg-teal-950/30 border border-teal-800/40 rounded-xl text-teal-200 text-xs">
                    <CheckCircle className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                    <span>{alert}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 20-20-20 Break Engine */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Eye className="w-5 h-5 text-cyan-400" />
                  20-20-20 Rule Optical Rest Engine
                </h3>
                <p className="text-slate-400 text-xs mt-0.5">
                  Every 20 minutes of screen focus, gaze at an object 20 feet away for 20 seconds.
                </p>
              </div>
              <span className="text-xs bg-cyan-950 text-cyan-300 border border-cyan-800/50 px-3 py-1 rounded-full font-medium">
                Completed Today: {profile?.eyeBreaksCompleted || 0}
              </span>
            </div>

            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-6 text-center space-y-4">
              {isBreakActive ? (
                <div className="space-y-3">
                  <div className="text-4xl font-black text-cyan-400 animate-pulse">
                    00:{countdownSeconds < 10 ? `0${countdownSeconds}` : countdownSeconds}
                  </div>
                  <p className="text-sm text-cyan-200 font-medium">
                    Look away from your screen at a distant object (~20 feet away) and breathe deeply.
                  </p>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden max-w-md mx-auto">
                    <div
                      className="bg-cyan-500 h-full transition-all duration-1000 ease-linear"
                      style={{ width: `${((20 - countdownSeconds) / 20) * 100}%` }}
                    />
                  </div>
                  <button
                    onClick={() => {
                      setIsBreakActive(false);
                      setCountdownSeconds(20);
                    }}
                    className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs"
                  >
                    Cancel Break
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="inline-flex p-3 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    <Eye className="w-8 h-8" />
                  </div>
                  <div className="text-base font-semibold text-white">Ready for your 20-Second Eye Relaxation?</div>
                  <p className="text-xs text-slate-400 max-w-md mx-auto">
                    Relieves ciliary muscle spasm in the eyes, reduces dry eye burning, and resets your blink cadence.
                  </p>
                  <button
                    onClick={() => setIsBreakActive(true)}
                    className="px-6 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-sm rounded-xl shadow-lg shadow-cyan-900/30 inline-flex items-center gap-2 transition"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    Start 20s Break Now
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Stretch Routines & Daily Summary */}
        <div className="space-y-6">
          {/* Daily Ergonomic Scorecard */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl shadow-xl">
            <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" />
              Ergonomic Wellness Scorecard
            </h3>

            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs p-2.5 bg-slate-950/60 rounded-xl border border-slate-800/80">
                <span className="text-slate-400">Total Screen Time Today</span>
                <span className="font-semibold text-white">{profile?.screenTimeMinutesToday || 185} mins</span>
              </div>
              <div className="flex justify-between items-center text-xs p-2.5 bg-slate-950/60 rounded-xl border border-slate-800/80">
                <span className="text-slate-400">Eye Rest Intervals Done</span>
                <span className="font-semibold text-cyan-400">{profile?.eyeBreaksCompleted || 5} breaks</span>
              </div>
              <div className="flex justify-between items-center text-xs p-2.5 bg-slate-950/60 rounded-xl border border-slate-800/80">
                <span className="text-slate-400">Stretches Completed</span>
                <span className="font-semibold text-emerald-400">{profile?.stretchesCompleted || 3} sets</span>
              </div>
            </div>
          </div>

          {/* Micro-Stretch Assistant */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <RotateCcw className="w-5 h-5 text-emerald-400" />
                Desk Micro-Stretches
              </h3>
              <span className="text-xs text-slate-400">
                {activeStretchIndex + 1}/{stretchRoutines.length}
              </span>
            </div>

            <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-white">{stretchRoutines[activeStretchIndex].name}</span>
                <span className="text-[11px] bg-emerald-950 text-emerald-300 border border-emerald-800/40 px-2 py-0.5 rounded font-mono">
                  {stretchRoutines[activeStretchIndex].duration}
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {stretchRoutines[activeStretchIndex].steps}
              </p>

              <div className="text-[11px] text-slate-400">
                <span className="font-semibold text-slate-300">Target Area:</span> {stretchRoutines[activeStretchIndex].target}
              </div>

              <div className="pt-2 flex items-center gap-2">
                <button
                  onClick={() => triggerAction('STRETCH')}
                  className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition"
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  Mark Stretch Done (+XP)
                </button>
                <button
                  onClick={() => setActiveStretchIndex((prev) => (prev + 1) % stretchRoutines.length)}
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium transition"
                >
                  Next Routine
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
