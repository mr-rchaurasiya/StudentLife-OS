import React, { useState, useEffect } from 'react';
import {
  Compass,
  Globe2,
  Clock,
  Navigation
} from 'lucide-react';
import type { KeplerianOrbitParameters, OrbitalTransferManeuver, PropagateOrbitDto } from '@studentlife/shared';

interface AstrodynamicsOrbitSimViewProps {
  onAddXp?: (amount: number) => void;
}

export const AstrodynamicsOrbitSimView: React.FC<AstrodynamicsOrbitSimViewProps> = ({ onAddXp }) => {
  const [orbitName, setOrbitName] = useState('ISS Low Earth Orbit (LEO)');
  const [primaryBody, setPrimaryBody] = useState<'EARTH' | 'MOON' | 'MARS' | 'SUN'>('EARTH');
  const [semiMajorAxis, setSemiMajorAxis] = useState<number>(7000);
  const [eccentricity, setEccentricity] = useState<number>(0.015);
  const [inclination, setInclination] = useState<number>(51.6);
  const [orbit, setOrbit] = useState<KeplerianOrbitParameters | null>(null);
  const [transfer, setTransfer] = useState<OrbitalTransferManeuver | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchState();
  }, []);

  const fetchState = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/astrodynamics-sim/orbit-state');
      const data = await res.json();
      if (data.success && data.data) {
        setOrbit(data.data.orbit);
        setTransfer(data.data.transfer);
      }
    } catch {
      // Fallback
    }
  };

  const handlePropagate = async () => {
    setLoading(true);
    const payload: PropagateOrbitDto = {
      targetOrbitName: orbitName,
      primaryBody,
      semiMajorAxisKm: semiMajorAxis,
      eccentricity,
      inclinationDeg: inclination
    };

    try {
      const res = await fetch('http://localhost:5000/api/astrodynamics-sim/propagate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success && data.data) {
        setOrbit(data.data.orbit);
        setTransfer(data.data.transfer);
        if (onAddXp) onAddXp(60);
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
      <div className="bg-gradient-to-r from-sky-950/70 via-indigo-950/50 to-slate-900 border border-sky-500/30 rounded-2xl p-6 relative overflow-hidden backdrop-blur-md shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-sky-500/20 border border-sky-500/40 text-sky-300 text-xs font-bold rounded-full uppercase tracking-wider flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-sky-400" />
                Phase 82 • Aerospace Dynamics
              </span>
              <span className="px-2.5 py-0.5 bg-slate-800/80 border border-slate-700 text-slate-400 text-xs rounded-md">
                Keplerian & Hohmann Solver
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight flex items-center gap-2">
              3D Celestial Astrodynamics & Orbit Propagator
            </h1>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl">
              Solve Keplerian 6-orbital elements ($a, e, i, \Omega, \omega, \nu$), delta-v ($\Delta v$) Hohmann transfer trajectory budgets, and Lagrange equilibrium potential wells.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-slate-900/80 border border-slate-700 px-4 py-2 rounded-xl text-center">
              <div className="text-xs text-slate-400 font-medium">Orbital Period</div>
              <div className="text-xl font-black text-sky-400">
                {orbit ? `${orbit.orbitalPeriodMinutes} min` : '97.2 min'}
              </div>
            </div>
            <div className="bg-slate-900/80 border border-slate-700 px-4 py-2 rounded-xl text-center">
              <div className="text-xs text-slate-400 font-medium">Transfer Δv</div>
              <div className="text-xl font-black text-emerald-400">
                {transfer ? `${transfer.totalDeltaVKmSec} km/s` : '3.89 km/s'}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Orbital Parameters Configurator */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Globe2 className="w-4 h-4 text-sky-400" />
              Keplerian Orbital Elements
            </h2>

            <div>
              <label className="text-xs text-slate-400 mb-1 block">Mission Orbit Designation</label>
              <input
                type="text"
                value={orbitName}
                onChange={(e) => setOrbitName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-200 focus:border-sky-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 mb-1 block">Primary Celestial Attractor</label>
              <select
                value={primaryBody}
                onChange={(e) => setPrimaryBody(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-slate-200 focus:border-sky-500 focus:outline-none"
              >
                <option value="EARTH">Earth (μ = 3.986 × 10^5 km³/s²)</option>
                <option value="MOON">Moon (μ = 4.902 × 10^3 km³/s²)</option>
                <option value="MARS">Mars (μ = 4.282 × 10^4 km³/s²)</option>
                <option value="SUN">Sun (Heliocentric μ = 1.327 × 10^11 km³/s²)</option>
              </select>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>Semi-Major Axis (a)</span>
                  <span className="text-sky-400 font-mono font-bold">{semiMajorAxis} km</span>
                </div>
                <input
                  type="range"
                  min="6600"
                  max="42164"
                  step="200"
                  value={semiMajorAxis}
                  onChange={(e) => setSemiMajorAxis(Number(e.target.value))}
                  className="w-full accent-sky-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>Eccentricity (e)</span>
                  <span className="text-sky-400 font-mono font-bold">{eccentricity}</span>
                </div>
                <input
                  type="range"
                  min="0.0"
                  max="0.8"
                  step="0.01"
                  value={eccentricity}
                  onChange={(e) => setEccentricity(Number(e.target.value))}
                  className="w-full accent-sky-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>Inclination (i)</span>
                  <span className="text-sky-400 font-mono font-bold">{inclination}°</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="98.7"
                  step="0.5"
                  value={inclination}
                  onChange={(e) => setInclination(Number(e.target.value))}
                  className="w-full accent-sky-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
                />
              </div>
            </div>

            <button
              onClick={handlePropagate}
              disabled={loading}
              className="w-full py-2.5 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-bold text-xs rounded-lg transition flex items-center justify-center gap-2 shadow-lg shadow-sky-950/40"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Navigation className="w-4 h-4" />
                  Propagate 2-Body Keplerian Orbit
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Orbital Telemetry & Transfer Budget */}
        <div className="lg:col-span-7 space-y-4">
          {orbit && (
            <div className="space-y-4">
              {/* Ephemeris Cards */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 text-center">
                  <div className="text-[10px] text-slate-400 font-medium">Periapsis Alt</div>
                  <div className="text-xl font-black text-sky-400 mt-1">{orbit.periapsisAltitudeKm} <span className="text-xs text-slate-500">km</span></div>
                </div>
                <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 text-center">
                  <div className="text-[10px] text-slate-400 font-medium">Apoapsis Alt</div>
                  <div className="text-xl font-black text-indigo-400 mt-1">{orbit.apoapsisAltitudeKm} <span className="text-xs text-slate-500">km</span></div>
                </div>
                <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 text-center">
                  <div className="text-[10px] text-slate-400 font-medium">Orbital Period</div>
                  <div className="text-xl font-black text-emerald-400 mt-1">{orbit.orbitalPeriodMinutes} <span className="text-xs text-slate-500">min</span></div>
                </div>
              </div>

              {/* Hohmann Transfer Maneuver Card */}
              {transfer && (
                <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                      Hohmann Interplanetary Transfer Maneuver Budget
                    </h3>
                    <span className="text-xs font-mono text-emerald-400 font-bold">
                      Total Δv = {transfer.totalDeltaVKmSec} km/s
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 font-serif leading-relaxed">
                    {transfer.trajectoryDescription}
                  </p>

                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                      <div className="text-[10px] text-slate-500 uppercase">Burn 1 (Periapsis)</div>
                      <div className="text-sm font-bold text-sky-300 font-mono mt-0.5">+{transfer.deltaV1KmSec} km/s</div>
                    </div>
                    <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                      <div className="text-[10px] text-slate-500 uppercase">Burn 2 (Apoapsis)</div>
                      <div className="text-sm font-bold text-indigo-300 font-mono mt-0.5">+{transfer.deltaV2KmSec} km/s</div>
                    </div>
                    <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                      <div className="text-[10px] text-slate-500 uppercase flex items-center gap-1">
                        <Clock className="w-3 h-3 text-emerald-400" /> Coast Time
                      </div>
                      <div className="text-sm font-bold text-emerald-300 font-mono mt-0.5">{transfer.transferTimeHours} hrs</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
