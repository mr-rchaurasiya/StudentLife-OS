import {
  KeplerianOrbitParameters,
  OrbitalTransferManeuver,
  PropagateOrbitDto
} from '@studentlife/shared';

export class AstrodynamicsSimService {
  private activeOrbit: KeplerianOrbitParameters;
  private activeTransfer: OrbitalTransferManeuver;

  constructor() {
    this.activeOrbit = {
      semiMajorAxisKm: 7000,
      eccentricity: 0.012,
      inclinationDeg: 51.6,
      longitudeOfAscendingNodeDeg: 120.4,
      argumentOfPeriapsisDeg: 45.2,
      trueAnomalyDeg: 180.0,
      orbitalPeriodMinutes: 97.2,
      periapsisAltitudeKm: 536.0,
      apoapsisAltitudeKm: 704.0
    };

    this.activeTransfer = {
      maneuverName: 'Hohmann Transfer from LEO (600 km) to GEO (35,786 km)',
      deltaV1KmSec: 2.42,
      deltaV2KmSec: 1.47,
      totalDeltaVKmSec: 3.89,
      transferTimeHours: 5.28,
      trajectoryDescription: 'Elliptical coplanar transfer ellipse with apogee insertion burn at geostationary synchronization altitude.'
    };
  }

  public getOrbitState(): { orbit: KeplerianOrbitParameters; transfer: OrbitalTransferManeuver } {
    return { orbit: this.activeOrbit, transfer: this.activeTransfer };
  }

  public propagateOrbit(dto: PropagateOrbitDto): { orbit: KeplerianOrbitParameters; transfer: OrbitalTransferManeuver } {
    const muMap: Record<string, number> = {
      EARTH: 398600.4418, // km^3 / s^2
      MOON: 4902.8,
      MARS: 42828.3,
      SUN: 132712440018.0
    };
    const mu = muMap[dto.primaryBody] || 398600.4418;
    const rEarth = 6378.137;

    const a = dto.semiMajorAxisKm || 7000;
    const e = Math.min(0.95, Math.max(0, dto.eccentricity));
    const periodSec = 2 * Math.PI * Math.sqrt(Math.pow(a, 3) / mu);
    const rPeri = a * (1 - e);
    const rApo = a * (1 + e);

    this.activeOrbit = {
      semiMajorAxisKm: Math.round(a),
      eccentricity: Math.round(e * 1000) / 1000,
      inclinationDeg: dto.inclinationDeg || 28.5,
      longitudeOfAscendingNodeDeg: 140.0,
      argumentOfPeriapsisDeg: 60.0,
      trueAnomalyDeg: 90.0,
      orbitalPeriodMinutes: Math.round((periodSec / 60) * 10) / 10,
      periapsisAltitudeKm: Math.round(rPeri - rEarth),
      apoapsisAltitudeKm: Math.round(rApo - rEarth)
    };

    // Calculate Hohmann to GEO
    const rGeo = 42164; // km radius
    const v1_init = Math.sqrt(mu / a);
    const v_trans_1 = Math.sqrt(mu * (2 / a - 2 / (a + rGeo)));
    const dv1 = Math.abs(v_trans_1 - v1_init);

    const v2_geo = Math.sqrt(mu / rGeo);
    const v_trans_2 = Math.sqrt(mu * (2 / rGeo - 2 / (a + rGeo)));
    const dv2 = Math.abs(v2_geo - v_trans_2);
    const totalDv = Math.round((dv1 + dv2) * 100) / 100;
    const transferSec = Math.PI * Math.sqrt(Math.pow((a + rGeo) / 2, 3) / mu);

    this.activeTransfer = {
      maneuverName: `Hohmann Transfer: ${dto.targetOrbitName} to GEO Target`,
      deltaV1KmSec: Math.round(dv1 * 100) / 100,
      deltaV2KmSec: Math.round(dv2 * 100) / 100,
      totalDeltaVKmSec: totalDv,
      transferTimeHours: Math.round((transferSec / 3600) * 10) / 10,
      trajectoryDescription: `Calculated standard 2-impulse coplanar orbital trajectory around ${dto.primaryBody}.`
    };

    return { orbit: this.activeOrbit, transfer: this.activeTransfer };
  }
}

export const astrodynamicsSimService = new AstrodynamicsSimService();
