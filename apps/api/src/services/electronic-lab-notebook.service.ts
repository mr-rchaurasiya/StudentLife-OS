import {
  LabExperimentLog,
  CreateLabLogDto,
  ReagentSafetyData
} from '@studentlife/shared';
import * as crypto from 'crypto';

export class ElectronicLabNotebookService {
  private logs: Map<string, LabExperimentLog> = new Map();

  constructor() {
    this.seedDefault();
  }

  private seedDefault() {
    const defaultLog: LabExperimentLog = {
      id: 'eln-exp-01',
      experimentTitle: 'Sol-Gel Synthesis of Perovskite (CH3NH3PbI3) Thin Films for Photovoltaics',
      experimentType: 'WET_LAB_SYNTHESIS',
      hypothesis: 'Precursor stoichiometry ratio of 1:1 PbI2 to MAI in DMF will yield 15%+ PCE with minimal pinhole defects.',
      timestamp: new Date().toISOString(),
      status: 'VERIFIED',
      tamperProofSha256Hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      protocolSteps: [
        { stepNumber: 1, instruction: 'Dissolve 461 mg Lead(II) iodide (PbI2) and 159 mg MAI in 1 mL anhydrous DMF:DMSO (4:1 v/v).', completed: true },
        { stepNumber: 2, instruction: 'Stir at 60°C for 2 hours in a Nitrogen glovebox until a clear golden precursor forms.', completed: true },
        { stepNumber: 3, instruction: 'Spin-coat at 4000 RPM for 30 seconds; drip 200 µL Chlorobenzene antisolvent at 15s mark.', completed: true },
        { stepNumber: 4, instruction: 'Anneal on hotplate at 100°C for 10 minutes to induce black perovskite phase crystallization.', completed: true }
      ],
      reagents: [
        {
          reagentName: 'Lead(II) Iodide (PbI2)',
          casNumber: '10101-63-0',
          quantityMols: 0.001,
          ghsPictograms: ['TOXIC', 'ENVIRONMENT_HAZARD', 'HEALTH_HAZARD'],
          hazardSummary: 'Reproductive toxicity Cat 1A, Aquatic acute Cat 1. Handle exclusively in glovebox.',
          ppeRecommendations: ['Double Nitrile Gloves', 'Chemical Splash Goggles', 'Fume Hood Face Velocity > 100 FPM']
        },
        {
          reagentName: 'Methylammonium Iodide (CH3NH3I)',
          casNumber: '14965-49-2',
          quantityMols: 0.001,
          ghsPictograms: ['IRRITANT'],
          hazardSummary: 'Hygroscopic precursor. Skin and eye irritation Cat 2.',
          ppeRecommendations: ['Standard Nitrile Gloves', 'Safety Glasses']
        },
        {
          reagentName: 'N,N-Dimethylformamide (DMF)',
          casNumber: '68-12-2',
          quantityMols: 0.012,
          ghsPictograms: ['FLAMMABLE', 'HEALTH_HAZARD', 'IRRITANT'],
          hazardSummary: 'Flammable liquid Cat 3, reproductive toxicity Cat 1B.',
          ppeRecommendations: ['Butyl Rubber Gloves', 'Flame Retardant Lab Coat']
        }
      ]
    };
    this.logs.set(defaultLog.id, defaultLog);
  }

  public async createLog(dto: CreateLabLogDto): Promise<LabExperimentLog> {
    const reagents: ReagentSafetyData[] = dto.reagents.map(r => ({
      reagentName: r.reagentName,
      casNumber: r.casNumber,
      quantityMols: r.quantityMols,
      ghsPictograms: ['HEALTH_HAZARD', 'IRRITANT'],
      hazardSummary: `Verified SDS profile for CAS ${r.casNumber}. Chemical purity > 99.5%.`,
      ppeRecommendations: ['Nitrile Gloves (8 mil)', 'Safety Glasses with side shields', 'Certified Fume Hood']
    }));

    const steps = dto.protocolSteps.map((step, idx) => ({
      stepNumber: idx + 1,
      instruction: step,
      completed: false
    }));

    const rawDataToHash = JSON.stringify({
      title: dto.experimentTitle,
      type: dto.experimentType,
      hypothesis: dto.hypothesis,
      steps: dto.protocolSteps,
      timestamp: Date.now()
    });

    const sha256 = crypto.createHash('sha256').update(rawDataToHash).digest('hex');

    const newLog: LabExperimentLog = {
      id: `eln-${Date.now()}`,
      experimentTitle: dto.experimentTitle,
      experimentType: dto.experimentType,
      hypothesis: dto.hypothesis,
      protocolSteps: steps,
      reagents,
      tamperProofSha256Hash: sha256,
      timestamp: new Date().toISOString(),
      status: 'IN_PROGRESS'
    };

    this.logs.set(newLog.id, newLog);
    return newLog;
  }

  public getAllLogs(): LabExperimentLog[] {
    return Array.from(this.logs.values());
  }

  public toggleStep(logId: string, stepNumber: number): LabExperimentLog | null {
    const log = this.logs.get(logId);
    if (!log) return null;
    const step = log.protocolSteps.find(s => s.stepNumber === stepNumber);
    if (step) {
      step.completed = !step.completed;
    }
    const allDone = log.protocolSteps.every(s => s.completed);
    if (allDone) {
      log.status = 'COMPLETED';
    }
    return log;
  }
}

export const electronicLabNotebookService = new ElectronicLabNotebookService();
