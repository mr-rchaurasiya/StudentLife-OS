import {
  CampusDigitalTwinState,
  FindCampusRouteDto,
  CampusBuildingNode,
} from '@studentlife/shared';

export class CampusDigitalTwinService {
  private state: CampusDigitalTwinState;

  constructor() {
    this.state = this.getInitialState();
  }

  private getInitialState(): CampusDigitalTwinState {
    const buildings: CampusBuildingNode[] = [
      {
        id: 'b-cse',
        buildingName: 'Department of Computer Science & Engineering',
        code: 'CSE-MAIN',
        category: 'ACADEMIC',
        coordinates: { x: 120, y: 80, z: 15 },
        currentOccupancyPercent: 68,
        noiseLevelDb: 42,
        activeEventsCount: 2,
      },
      {
        id: 'b-lib',
        buildingName: 'Central Academic Library & Study Sanctum',
        code: 'LIB-CENTRAL',
        category: 'LIBRARY',
        coordinates: { x: 250, y: 150, z: 25 },
        currentOccupancyPercent: 84,
        noiseLevelDb: 28,
        activeEventsCount: 0,
      },
      {
        id: 'b-clt',
        buildingName: 'Central Lecture Theatre Complex (Auditoriums 1-4)',
        code: 'CLT-COMPLEX',
        category: 'ACADEMIC',
        coordinates: { x: 200, y: 300, z: 18 },
        currentOccupancyPercent: 45,
        noiseLevelDb: 52,
        activeEventsCount: 3,
      },
      {
        id: 'b-h7',
        buildingName: 'Aryabhata Research Hostel 7 & Dining Quad',
        code: 'HOSTEL-07',
        category: 'HOSTEL',
        coordinates: { x: 450, y: 120, z: 30 },
        currentOccupancyPercent: 91,
        noiseLevelDb: 64,
        activeEventsCount: 1,
      },
      {
        id: 'b-nano',
        buildingName: 'Centre for Nanotechnology & Quantum Fabrication',
        code: 'NANO-LAB',
        category: 'LAB',
        coordinates: { x: 380, y: 280, z: 12 },
        currentOccupancyPercent: 32,
        noiseLevelDb: 35,
        activeEventsCount: 1,
      },
    ];

    return {
      buildings,
      recommendedQuietZones: [
        'Central Academic Library (Floor 3 - Deep Study Carrels)',
        'Nanotechnology Centre Seminar Lounge',
      ],
      activeNavigationRoute: {
        fromBuilding: 'Aryabhata Research Hostel 7 & Dining Quad',
        toBuilding: 'Department of Computer Science & Engineering',
        walkingDistanceMeters: 420,
        estimatedMinutes: 5,
        waypointPath: ['Hostel 7 North Gate', 'Canopy Shaded Boulevard', 'Library Cyber Plaza', 'CSE Department Atrium'],
      },
    };
  }

  async getDigitalTwinState(): Promise<CampusDigitalTwinState> {
    return this.state;
  }

  async findCampusRoute(dto: FindCampusRouteDto): Promise<CampusDigitalTwinState> {
    const fromB = this.state.buildings.find((b) => b.id === dto.fromBuildingId) || this.state.buildings[0];
    const toB = this.state.buildings.find((b) => b.id === dto.toBuildingId) || this.state.buildings[1];

    const dx = fromB.coordinates.x - toB.coordinates.x;
    const dy = fromB.coordinates.y - toB.coordinates.y;
    const dist = Math.round(Math.sqrt(dx * dx + dy * dy) * 2.5);
    const mins = Math.max(2, Math.round(dist / 80));

    this.state.activeNavigationRoute = {
      fromBuilding: fromB.buildingName,
      toBuilding: toB.buildingName,
      walkingDistanceMeters: dist,
      estimatedMinutes: mins,
      waypointPath: [`${fromB.code} Main Entry`, 'Central Walkway Quad', `${toB.code} Ground Floor Foyer`],
    };

    return this.state;
  }
}

export const campusDigitalTwinService = new CampusDigitalTwinService();
