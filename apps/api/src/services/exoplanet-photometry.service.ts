import {
  ExoplanetTransitAnalysis,
  AnalyzeTransitLightCurveDto,
  PhotometryDataPoint
} from '@studentlife/shared';

export class ExoplanetPhotometryService {
  async analyzeLightCurve(dto: AnalyzeTransitLightCurveDto): Promise<ExoplanetTransitAnalysis> {
    const star = dto.starName || 'Kepler-186';
    const rStar = dto.stellarRadiusSolar || 0.52;
    const tEff = dto.stellarEffectiveTempK || 3755;

    // Simulate standard transit dip light curve
    const lightCurve: PhotometryDataPoint[] = [];
    const depthPpm = 480; // 0.048% transit depth (Earth-sized planet)
    const transitDurationHours = 3.2;

    for (let t = -6; t <= 6; t += 0.5) {
      let flux = 1.0;
      if (Math.abs(t) < transitDurationHours / 2) {
        // Limb-darkened transit bottom
        flux = 1.0 - (depthPpm / 1e6) * (1 - 0.2 * Math.pow(t / (transitDurationHours / 2), 2));
      }
      lightCurve.push({
        timeHours: Math.round(t * 10) / 10,
        normalizedFlux: Math.round(flux * 100000) / 100000,
        fluxError: 0.00004
      });
    }

    // Planetary radius Rp = R_star * sqrt(delta_F)
    const planetRadiusEarth = Math.round(rStar * Math.sqrt(depthPpm / 1e6) * 109.2 * 10) / 10;
    const semiMajorAu = 0.432;
    // T_eq = T_eff * sqrt(R_star / 2*a)
    const eqTempK = Math.round(tEff * Math.sqrt((rStar * 0.00465) / (2 * semiMajorAu)));
    const isHabitable = eqTempK >= 200 && eqTempK <= 310;

    return {
      id: `exo-ana-${Date.now()}`,
      starName: star,
      planetName: `${star} f (Earth-Analogue Candidate)`,
      transitDepthPpm: depthPpm,
      planetRadiusEarthRadii: planetRadiusEarth || 1.17,
      orbitalPeriodDays: 129.9,
      semiMajorAxisAu: semiMajorAu,
      equilibriumTempKelvin: eqTempK || 242,
      isInHabitableZone: isHabitable,
      transitLightCurve: lightCurve
    };
  }
}
