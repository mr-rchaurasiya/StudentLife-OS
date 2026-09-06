import {
  FocusGardenState,
  FocusTree,
  StudyPet,
  TreeSpecies,
  PlantTreeDto,
  CompleteTreeDto
} from '@studentlife/shared';

export class FocusGardenService {
  private gardenState: FocusGardenState;

  constructor() {
    this.gardenState = {
      totalTreesPlanted: 14,
      totalForestHarvested: 12,
      totalFocusHours: 7.5,
      gardenCoins: 380,
      pet: {
        id: 'pet-owl-01',
        name: 'Athena the Scholar',
        type: 'WISE_OWL',
        level: 4,
        currentXp: 320,
        xpToNextLevel: 500,
        happinessPercent: 92,
        activeFocusBoostPercent: 12,
        unlockedCostumes: ['Graduation Cap 🎓', 'Wizard Scarf 🧣', 'Steampunk Goggles 🥽'],
        currentMood: 'JOYFUL'
      },
      trees: [
        {
          id: 'tree-1',
          species: 'CHERRY_BLOSSOM',
          plantedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
          durationMinutes: 25,
          status: 'HARVESTED',
          focusSubject: 'Data Structures',
          earnedCoins: 25,
          earnedXp: 50,
          gridPosition: { row: 0, col: 0 }
        },
        {
          id: 'tree-2',
          species: 'GOLDEN_OAK',
          plantedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
          durationMinutes: 50,
          status: 'HARVESTED',
          focusSubject: 'Operating Systems',
          earnedCoins: 50,
          earnedXp: 100,
          gridPosition: { row: 0, col: 1 }
        },
        {
          id: 'tree-3',
          species: 'CYBER_PINE',
          plantedAt: new Date(Date.now() - 86400000).toISOString(),
          durationMinutes: 25,
          status: 'HARVESTED',
          focusSubject: 'JEE Physics',
          earnedCoins: 25,
          earnedXp: 50,
          gridPosition: { row: 0, col: 2 }
        },
        {
          id: 'tree-4',
          species: 'MYSTIC_WILLOW',
          plantedAt: new Date(Date.now() - 86400000).toISOString(),
          durationMinutes: 90,
          status: 'HARVESTED',
          focusSubject: 'Algorithms Deep Dive',
          earnedCoins: 90,
          earnedXp: 180,
          gridPosition: { row: 1, col: 0 }
        },
        {
          id: 'tree-5',
          species: 'EMERALD_BAMBOO',
          plantedAt: new Date().toISOString(),
          durationMinutes: 25,
          status: 'HARVESTED',
          focusSubject: 'UPSC Polity',
          earnedCoins: 25,
          earnedXp: 50,
          gridPosition: { row: 1, col: 1 }
        }
      ]
    };
  }

  public getGardenState(): FocusGardenState {
    return this.gardenState;
  }

  public plantTree(dto: PlantTreeDto): FocusGardenState {
    const treeId = `tree-${Date.now()}`;
    const nextRow = Math.floor(this.gardenState.trees.length / 4);
    const nextCol = this.gardenState.trees.length % 4;

    const newTree: FocusTree = {
      id: treeId,
      species: dto.species,
      plantedAt: new Date().toISOString(),
      durationMinutes: dto.durationMinutes,
      status: 'GROWING',
      focusSubject: dto.subject || 'General Deep Work',
      earnedCoins: 0,
      earnedXp: 0,
      gridPosition: { row: nextRow, col: nextCol }
    };

    this.gardenState.currentActiveSession = {
      treeId,
      species: dto.species,
      durationMinutes: dto.durationMinutes,
      elapsedSeconds: 0,
      subject: dto.subject || 'Deep Study'
    };

    this.gardenState.totalTreesPlanted += 1;
    this.gardenState.pet.currentMood = 'FOCUSING';

    return this.gardenState;
  }

  public completeTree(dto: CompleteTreeDto): FocusGardenState {
    if (!this.gardenState.currentActiveSession) {
      return this.gardenState;
    }

    const { treeId, durationMinutes, species, subject } = this.gardenState.currentActiveSession;
    const isSuccess = dto.wasSuccessful;

    const earnedCoins = isSuccess ? durationMinutes : 0;
    const earnedXp = isSuccess ? durationMinutes * 2 : 10;

    const completedTree: FocusTree = {
      id: treeId,
      species,
      plantedAt: new Date().toISOString(),
      durationMinutes,
      status: isSuccess ? 'HARVESTED' : 'WITHERED',
      focusSubject: subject,
      earnedCoins,
      earnedXp,
      gridPosition: {
        row: Math.floor(this.gardenState.trees.length / 4),
        col: this.gardenState.trees.length % 4
      }
    };

    this.gardenState.trees.push(completedTree);
    this.gardenState.currentActiveSession = undefined;

    if (isSuccess) {
      this.gardenState.totalForestHarvested += 1;
      this.gardenState.totalFocusHours += durationMinutes / 60;
      this.gardenState.gardenCoins += earnedCoins;
      this.gardenState.pet.currentXp += earnedXp;
      this.gardenState.pet.happinessPercent = Math.min(100, this.gardenState.pet.happinessPercent + 10);
      this.gardenState.pet.currentMood = 'JOYFUL';

      // Level up pet
      if (this.gardenState.pet.currentXp >= this.gardenState.pet.xpToNextLevel) {
        this.gardenState.pet.level += 1;
        this.gardenState.pet.currentXp -= this.gardenState.pet.xpToNextLevel;
        this.gardenState.pet.xpToNextLevel = Math.round(this.gardenState.pet.xpToNextLevel * 1.5);
        this.gardenState.pet.activeFocusBoostPercent += 2;
      }
    } else {
      this.gardenState.pet.happinessPercent = Math.max(20, this.gardenState.pet.happinessPercent - 15);
      this.gardenState.pet.currentMood = 'HUNGRY';
    }

    return this.gardenState;
  }

  public feedOrPetStudyPet(): StudyPet {
    this.gardenState.pet.happinessPercent = Math.min(100, this.gardenState.pet.happinessPercent + 15);
    this.gardenState.pet.currentMood = 'JOYFUL';
    return this.gardenState.pet;
  }
}

export const focusGardenService = new FocusGardenService();
