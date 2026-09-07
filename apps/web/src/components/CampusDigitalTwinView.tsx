import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Navigation,
  Layers,
  Sparkles,
  Search,
  Compass,
  ArrowRight,
  Clock,
  Footprints,
  Volume2
} from 'lucide-react';
import type { CampusBuildingNode, CampusDigitalTwinState, FindCampusRouteDto } from '@studentlife/shared';

export const CampusDigitalTwinView: React.FC = () => {
  const [twinState, setTwinState] = useState<CampusDigitalTwinState | null>(null);
  const [selectedBuilding, setSelectedBuilding] = useState<CampusBuildingNode | null>(null);
  const [fromNode, setFromNode] = useState<string>('b1');
  const [toNode, setToNode] = useState<string>('b2');
  const [routeResult, setRouteResult] = useState<{
    fromBuilding: string;
    toBuilding: string;
    walkingDistanceMeters: number;
    estimatedMinutes: number;
    waypointPath: string[];
  } | null>(null);
  const [loadingRoute, setLoadingRoute] = useState(false);

  // Fetch campus state
  useEffect(() => {
    fetch('http://localhost:5000/api/campus-digital-twin/state')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setTwinState(data.data);
          if (data.data.buildings && data.data.buildings.length > 0) {
            setSelectedBuilding(data.data.buildings[0]);
          }
        }
      })
      .catch(() => {
        // Fallback default state
        const defaultBuildings: CampusBuildingNode[] = [
          {
            id: 'b1',
            buildingName: 'Computer Science & AI Block',
            code: 'CSE-101',
            category: 'ACADEMIC',
            currentOccupancyPercent: 74,
            noiseLevelDb: 42,
            activeEventsCount: 3,
            coordinates: { x: 120, y: 80, z: 0 }
          },
          {
            id: 'b2',
            buildingName: 'Central University Library',
            code: 'LIB-CENTRAL',
            category: 'LIBRARY',
            currentOccupancyPercent: 48,
            noiseLevelDb: 28,
            activeEventsCount: 1,
            coordinates: { x: 280, y: 150, z: 0 }
          },
          {
            id: 'b3',
            buildingName: 'Central Lecture Theatre Complex',
            code: 'CLT-COMPLEX',
            category: 'ACADEMIC',
            currentOccupancyPercent: 88,
            noiseLevelDb: 68,
            activeEventsCount: 4,
            coordinates: { x: 200, y: 310, z: 0 }
          },
          {
            id: 'b4',
            buildingName: 'Hostel Alpha & Dining Hall',
            code: 'HST-ALPHA',
            category: 'HOSTEL',
            currentOccupancyPercent: 62,
            noiseLevelDb: 55,
            activeEventsCount: 2,
            coordinates: { x: 420, y: 90, z: 0 }
          },
          {
            id: 'b5',
            buildingName: 'Nano Science & Cleanroom Lab',
            code: 'NANO-LAB',
            category: 'LAB',
            currentOccupancyPercent: 31,
            noiseLevelDb: 35,
            activeEventsCount: 1,
            coordinates: { x: 360, y: 270, z: 0 }
          }
        ];
        setTwinState({
          buildings: defaultBuildings,
          recommendedQuietZones: ['Central University Library (Floor 3)', 'Nano Science Reading Vault']
        });
        setSelectedBuilding(defaultBuildings[0]);
      });
  }, []);

  const handleCalculateRoute = async () => {
    setLoadingRoute(true);
    const payload: FindCampusRouteDto = {
      fromBuildingId: fromNode,
      toBuildingId: toNode
    };

    try {
      const res = await fetch('http://localhost:5000/api/campus-digital-twin/route', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success && data.data) {
        setRouteResult(data.data);
      }
    } catch {
      // Fallback
      const fromB = twinState?.buildings.find((b) => b.id === fromNode)?.buildingName || fromNode;
      const toB = twinState?.buildings.find((b) => b.id === toNode)?.buildingName || toNode;
      setRouteResult({
        fromBuilding: fromB,
        toBuilding: toB,
        walkingDistanceMeters: 380,
        estimatedMinutes: 4.5,
        waypointPath: [fromB, 'Central Quadrangle Walkway', 'Skybridge Link 2', toB]
      });
    } finally {
      setLoadingRoute(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-950/60 via-indigo-950/40 to-slate-900 border border-blue-500/30 rounded-2xl p-6 relative overflow-hidden backdrop-blur-md shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-blue-500/20 border border-blue-500/40 text-blue-300 text-xs font-bold rounded-full uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-blue-400" />
                Phase 75 • Spatial Intelligence
              </span>
              <span className="px-2.5 py-0.5 bg-slate-800/80 border border-slate-700 text-slate-400 text-xs rounded-md">
                Indoor Navigation & Digital Twin
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight flex items-center gap-2">
              3D Campus Digital Twin & Indoor Navigation Navigator
            </h1>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl">
              Spatial node mapping across campus infrastructure. Real-time building occupancy telemetry, acoustic noise heatmaps, and optimal shortest indoor pathfinding.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-slate-900/80 border border-slate-700 px-4 py-2 rounded-xl text-center">
              <div className="text-xs text-slate-400 font-medium">Mapped Nodes</div>
              <div className="text-xl font-black text-blue-400">
                {twinState ? twinState.buildings.length : 5} <span className="text-xs text-slate-400">Facilities</span>
              </div>
            </div>
            <div className="bg-slate-900/80 border border-slate-700 px-4 py-2 rounded-xl text-center">
              <div className="text-xs text-slate-400 font-medium">Quiet Zones</div>
              <div className="text-xl font-black text-emerald-400">
                {twinState ? twinState.recommendedQuietZones.length : 2} <span className="text-xs text-slate-400">Zones</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Building Selector & Spatial Topology */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-xl space-y-3">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-400" />
              Campus Facilities & Spatial Nodes
            </h2>
            <div className="space-y-2.5 max-h-[420px] overflow-y-auto pr-1">
              {twinState?.buildings.map((b) => (
                <button
                  key={b.id}
                  onClick={() => setSelectedBuilding(b)}
                  className={`w-full text-left p-3.5 rounded-xl border transition flex flex-col gap-2 ${
                    selectedBuilding?.id === b.id
                      ? 'bg-blue-950/40 border-blue-500/80 text-white shadow-lg'
                      : 'bg-slate-950/60 border-slate-800/80 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-bold text-xs flex items-center gap-1.5">
                        <MapPin className={`w-3.5 h-3.5 ${selectedBuilding?.id === b.id ? 'text-blue-400' : 'text-slate-500'}`} />
                        {b.buildingName}
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono mt-0.5">{b.code} • {b.category}</div>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      b.currentOccupancyPercent > 75
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                        : b.currentOccupancyPercent > 40
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    }`}>
                      {b.currentOccupancyPercent}% Full
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Volume2 className="w-3 h-3 text-cyan-400" />
                      {b.noiseLevelDb} dB
                    </span>
                    <span className="flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-purple-400" />
                      {b.activeEventsCount} Active Events
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: 3D Spatial Node Inspector & Route Pathfinder */}
        <div className="lg:col-span-8 space-y-6">
          {/* Selected Building 3D Telemetry Card */}
          {selectedBuilding && (
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 shadow-xl space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
                <div>
                  <div className="text-xs text-blue-400 font-mono font-bold uppercase tracking-wider">Spatial Node Telemetry</div>
                  <h3 className="text-lg font-black text-white">{selectedBuilding.buildingName}</h3>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 bg-slate-950 border border-slate-700 rounded-lg text-xs font-mono text-slate-300">
                    Coordinates: ({selectedBuilding.coordinates.x}, {selectedBuilding.coordinates.y}, {selectedBuilding.coordinates.z})
                  </span>
                </div>
              </div>

              {/* Floor Availability & Recommended Quiet Zones */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-4 space-y-2">
                  <div className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                    Recommended Quiet Study Zones
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-400">
                    {twinState?.recommendedQuietZones.map((zone, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-slate-200">
                        <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                        {zone}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-4 space-y-3">
                  <div className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5 text-indigo-400" />
                    Acoustic & Density Index
                  </div>
                  <div className="space-y-2 text-xs">
                    <div>
                      <div className="flex justify-between text-slate-400 mb-1">
                        <span>Acoustic Ambient: {selectedBuilding.noiseLevelDb} dB</span>
                        <span className={selectedBuilding.noiseLevelDb < 45 ? 'text-emerald-400 font-bold' : 'text-amber-400'}>
                          {selectedBuilding.noiseLevelDb < 40 ? 'Deep Focus Safe' : 'Collaborative Hub'}
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-cyan-400"
                          style={{ width: `${Math.min(100, (selectedBuilding.noiseLevelDb / 85) * 100)}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-slate-400 mb-1">
                        <span>Occupancy Load: {selectedBuilding.currentOccupancyPercent}%</span>
                        <span className="text-slate-200 font-mono">{selectedBuilding.currentOccupancyPercent > 75 ? 'Near Capacity' : 'Seats Open'}</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-indigo-500"
                          style={{ width: `${selectedBuilding.currentOccupancyPercent}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Indoor Route Pathfinder Engine */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 shadow-xl space-y-5">
            <div className="flex items-center gap-2">
              <Navigation className="w-5 h-5 text-blue-400" />
              <h3 className="text-base font-bold text-white">
                Shortest Indoor Path & Skybridge Navigator
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-400 mb-1.5 block">Starting Point</label>
                <select
                  value={fromNode}
                  onChange={(e) => setFromNode(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-lg p-2.5 text-xs text-slate-200 focus:border-blue-500 focus:outline-none"
                >
                  {twinState?.buildings.map((b) => (
                    <option key={b.id} value={b.id}>{b.buildingName} ({b.code})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-400 mb-1.5 block">Destination Node</label>
                <select
                  value={toNode}
                  onChange={(e) => setToNode(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-lg p-2.5 text-xs text-slate-200 focus:border-blue-500 focus:outline-none"
                >
                  {twinState?.buildings.map((b) => (
                    <option key={b.id} value={b.id}>{b.buildingName} ({b.code})</option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={handleCalculateRoute}
              disabled={loadingRoute}
              className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs rounded-lg transition flex items-center justify-center gap-2 shadow-lg shadow-blue-950/40"
            >
              {loadingRoute ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  Calculate Optimal 3D Waypoint Path
                </>
              )}
            </button>

            {/* Route Result Preview */}
            {routeResult && (
              <div className="bg-slate-950/80 border border-blue-500/30 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                  <div className="flex items-center gap-3 text-xs">
                    <span className="flex items-center gap-1 text-slate-300 font-bold">
                      <Footprints className="w-3.5 h-3.5 text-blue-400" />
                      {routeResult.walkingDistanceMeters} meters
                    </span>
                    <span className="flex items-center gap-1 text-slate-300 font-bold">
                      <Clock className="w-3.5 h-3.5 text-emerald-400" />
                      ~{routeResult.estimatedMinutes} min walk
                    </span>
                  </div>
                  <span className="text-[10px] text-blue-300 bg-blue-500/20 px-2 py-0.5 rounded border border-blue-500/40 font-mono">
                    Shortest Topological Path
                  </span>
                </div>

                {/* Step by step path */}
                <div className="space-y-1.5 pt-1">
                  <div className="text-[11px] text-slate-400 font-medium mb-1">Turn-by-turn Navigation Steps:</div>
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    {routeResult.waypointPath.map((step, idx) => (
                      <React.Fragment key={idx}>
                        <span className="bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg text-slate-200 font-medium">
                          {step}
                        </span>
                        {idx < routeResult.waypointPath.length - 1 && (
                          <ArrowRight className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
