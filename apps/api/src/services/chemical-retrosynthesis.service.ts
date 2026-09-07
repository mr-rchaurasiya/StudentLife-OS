import {
  RetrosyntheticPathway,
  PlanRetrosynthesisDto
} from '@studentlife/shared';

export class ChemicalRetrosynthesisService {
  private pathways: Map<string, RetrosyntheticPathway> = new Map();

  constructor() {
    this.seedDefault();
  }

  private seedDefault() {
    const defaultPathway: RetrosyntheticPathway = {
      id: 'retro-path-01',
      moleculeName: 'Paracetamol (Acetaminophen)',
      smilesFormula: 'CC(=O)NC1=CC=C(O)C=C1',
      molecularWeight: 151.16,
      therapeuticCategory: 'Analgesic / Antipyretic (NSAID-Adjacent)',
      totalSynthesisSteps: 2,
      overallYieldEstimatePercent: 88.5,
      steps: [
        {
          stepNumber: 1,
          targetFragment: 'N-(4-hydroxyphenyl)acetamide',
          synthons: ['4-aminophenol [HO-C6H4-NH2]', 'Acetyl Synthon [CH3-CO+]'],
          reagentsRequired: ['Acetic Anhydride (Ac2O)', 'Aqueous Phosphoric Acid or Pyridine catalyst'],
          reactionName: 'Nucleophilic Acyl Substitution / Amide Coupling',
          predictedYieldPercent: 92.0,
          conditions: 'Stir at 60°C in aqueous media for 45 min, cool to precipitate crystal needles.'
        },
        {
          stepNumber: 2,
          targetFragment: '4-Aminophenol Precursor',
          synthons: ['4-nitrophenol [HO-C6H4-NO2]'],
          reagentsRequired: ['Sodium Borohydride (NaBH4) / Palladium on Carbon (Pd/C) or Iron in HCl'],
          reactionName: 'Catalytic Nitro Group Hydrogenation',
          predictedYieldPercent: 96.2,
          conditions: 'Reflux in ethanol under 1 atm H2 balloon or transfer hydrogenation.'
        }
      ]
    };
    this.pathways.set(defaultPathway.id, defaultPathway);
  }

  public getPathway(id: string = 'retro-path-01'): RetrosyntheticPathway {
    return this.pathways.get(id) || Array.from(this.pathways.values())[0];
  }

  public planRetrosynthesis(dto: PlanRetrosynthesisDto): RetrosyntheticPathway {
    const pathway: RetrosyntheticPathway = {
      id: `retro-${Date.now()}`,
      moleculeName: dto.moleculeName || 'Synthetic Target Molecule',
      smilesFormula: dto.smilesFormula || 'CC(=O)OC1=CC=CC=C1C(=O)O',
      molecularWeight: 180.16,
      therapeuticCategory: 'Organic Bio-Active Intermediate',
      totalSynthesisSteps: 3,
      overallYieldEstimatePercent: 78.4,
      steps: [
        {
          stepNumber: 1,
          targetFragment: 'Target Core Scaffold',
          synthons: ['Aryl Halide Synthon', 'Organoboron Intermediate'],
          reagentsRequired: ['Pd(PPh3)4 (5 mol%)', 'K2CO3 Base in Dioxane/Water (4:1)'],
          reactionName: 'Suzuki-Miyaura Cross-Coupling',
          predictedYieldPercent: 85.0,
          conditions: 'Degas with N2, heat to 85°C for 3 hours under microwave irradiation.'
        },
        {
          stepNumber: 2,
          targetFragment: 'Boronic Acid Intermediate',
          synthons: ['Substituted Bromobenzene', 'Bis(pinacolato)diboron [B2pin2]'],
          reagentsRequired: ['Pd(dppf)Cl2', 'Potassium Acetate (KOAc) in Anhydrous DMSO'],
          reactionName: 'Miyaura Borylation',
          predictedYieldPercent: 90.5,
          conditions: '80°C in sealed tube for 12 hours.'
        },
        {
          stepNumber: 3,
          targetFragment: 'Starting Material Synthon',
          synthons: ['Commercially Available Feedstock (Sigma-Aldrich / Enamine)'],
          reagentsRequired: ['N-Bromosuccinimide (NBS)', 'AIBN initiator in CCl4 or EtOAc'],
          reactionName: 'Wohl-Ziegler Radical Halogenation',
          predictedYieldPercent: 89.0,
          conditions: 'Irradiate with 500W tungsten lamp at reflux.'
        }
      ]
    };

    this.pathways.set(pathway.id, pathway);
    return pathway;
  }
}

export const chemicalRetrosynthesisService = new ChemicalRetrosynthesisService();
