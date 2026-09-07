import {
  CampusTransitState,
  ShuttleVehicle,
  ShuttleRouteNode,
  CarpoolRidePost,
  BookCarpoolRideDto,
} from '@studentlife/shared';

export class CampusTransitService {
  private state: CampusTransitState;

  constructor() {
    this.state = this.getInitialState();
  }

  private getInitialState(): CampusTransitState {
    const activeShuttles: ShuttleVehicle[] = [
      {
        id: 'shuttle-101',
        vehicleNumber: 'CAMPUS-EV-01',
        routeName: 'Blue Line (North Hostels ⇄ Academic Blocks)',
        vehicleType: 'ELECTRIC_SHUTTLE',
        currentStop: 'Hostel 7 Complex',
        nextStop: 'Central Lecture Theatre (CLT)',
        etaMinutes: 3,
        speedKmph: 22,
        isLiveTracking: true,
      },
      {
        id: 'shuttle-102',
        vehicleNumber: 'CAMPUS-EV-02',
        routeName: 'Green Express (Main Gate ⇄ Central Library)',
        vehicleType: 'E_RICKSHAW_EXPRESS',
        currentStop: 'Main Gate Kiosk',
        nextStop: 'Innovation Complex / CSE Lab',
        etaMinutes: 6,
        speedKmph: 18,
        isLiveTracking: true,
      },
      {
        id: 'shuttle-103',
        vehicleNumber: 'CAMPUS-EV-03',
        routeName: 'Night Owl Loop (Sports Complex ⇄ Research Park)',
        vehicleType: 'ELECTRIC_SHUTTLE',
        currentStop: 'Sports Arena / Gymkhana',
        nextStop: 'Post-Graduate Hostels',
        etaMinutes: 8,
        speedKmph: 25,
        isLiveTracking: true,
      },
    ];

    const routeStops: ShuttleRouteNode[] = [
      {
        id: 'stop-1',
        stopName: 'Central Lecture Theatre (CLT)',
        stopLocationTag: 'Academic Core',
        nextArrivalMinutes: 3,
        occupancyStatus: 'SEATS_AVAILABLE',
      },
      {
        id: 'stop-2',
        stopName: 'Central Library & Cyber Cafe',
        stopLocationTag: 'Study Zone',
        nextArrivalMinutes: 5,
        occupancyStatus: 'STANDING_ONLY',
      },
      {
        id: 'stop-3',
        stopName: 'Hostel 7 / 8 / 9 Dining Quad',
        stopLocationTag: 'North Residential',
        nextArrivalMinutes: 7,
        occupancyStatus: 'SEATS_AVAILABLE',
      },
      {
        id: 'stop-4',
        stopName: 'Innovation Hub & Biotech Lab',
        stopLocationTag: 'South Research Block',
        nextArrivalMinutes: 11,
        occupancyStatus: 'FULL',
      },
    ];

    const activeCarpoolPosts: CarpoolRidePost[] = [
      {
        id: 'pool-1',
        riderName: 'Rohit K. (Hostel 5)',
        fromLocation: 'Hostel 5 Ground',
        toLocation: 'Mechanical Workshop',
        departureTime: '10:15 AM',
        availableSeats: 1,
        coinRewardContribution: 15,
        status: 'OPEN',
      },
      {
        id: 'pool-2',
        riderName: 'Priya Sharma (Hostel 2)',
        fromLocation: 'Girls Hostel 2 Gate',
        toLocation: 'Central Library Block B',
        departureTime: '10:30 AM',
        availableSeats: 2,
        coinRewardContribution: 20,
        status: 'OPEN',
      },
      {
        id: 'pool-3',
        riderName: 'Aman C. (Hostel 4)',
        fromLocation: 'Hostel 4 Quad',
        toLocation: 'Department of Computer Science',
        departureTime: '11:00 AM',
        availableSeats: 1,
        coinRewardContribution: 10,
        status: 'OPEN',
      },
    ];

    return {
      activeShuttles,
      routeStops,
      activeCarpoolPosts,
      userEcoCarbonSavedKg: 14.8,
    };
  }

  async getTransitState(): Promise<CampusTransitState> {
    return this.state;
  }

  async bookCarpoolRide(dto: BookCarpoolRideDto): Promise<CampusTransitState> {
    const post = this.state.activeCarpoolPosts.find((p) => p.id === dto.carpoolPostId);
    if (post && post.availableSeats > 0) {
      post.availableSeats -= 1;
      if (post.availableSeats === 0) {
        post.status = 'FILLED';
      }
      this.state.userEcoCarbonSavedKg = parseFloat((this.state.userEcoCarbonSavedKg + 0.8).toFixed(1));
    }
    return this.state;
  }
}

export const campusTransitService = new CampusTransitService();
