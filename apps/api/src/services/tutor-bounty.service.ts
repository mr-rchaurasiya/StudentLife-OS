import { PeerTutorBounty, CreateTutorBountyDto, AcceptTutorBountyDto } from '@studentlife/shared';

export class TutorBountyService {
  private static bounties: PeerTutorBounty[] = [
    {
      id: 'bounty-01',
      studentName: 'Aarav Mehta (2nd Year)',
      studentAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100',
      subjectTag: 'Data Structures & Algorithms',
      topicTitle: 'Red-Black Tree Left/Right Rotation Edge Cases',
      doubtDescription: 'Need 15 min live audio/whiteboard walk-through of the double-rotation fix-up case after insertion in Red-Black BST.',
      coinBountyReward: 150,
      xpReward: 35,
      urgencyMinutes: 20,
      status: 'OPEN',
      createdAt: new Date().toISOString()
    },
    {
      id: 'bounty-02',
      studentName: 'Sneha Patel (3rd Year)',
      studentAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
      subjectTag: 'Electromagnetics & Waves',
      topicTitle: 'Poynting Vector & Wave Polarization Proof',
      doubtDescription: 'Stuck on deriving the time-averaged power flux density for circularly polarized TEM waves.',
      coinBountyReward: 200,
      xpReward: 50,
      urgencyMinutes: 15,
      status: 'OPEN',
      createdAt: new Date().toISOString()
    }
  ];

  public static getBounties(): PeerTutorBounty[] {
    return this.bounties;
  }

  public static createBounty(dto: CreateTutorBountyDto): PeerTutorBounty {
    const newBounty: PeerTutorBounty = {
      id: `bounty-${Date.now()}`,
      studentName: 'Rohit Chaurasiya',
      studentAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
      subjectTag: dto.subjectTag || 'Computer Science',
      topicTitle: dto.topicTitle,
      doubtDescription: dto.doubtDescription,
      coinBountyReward: dto.coinBountyReward || 100,
      xpReward: 30,
      urgencyMinutes: dto.urgencyMinutes || 20,
      status: 'OPEN',
      createdAt: new Date().toISOString()
    };
    this.bounties.unshift(newBounty);
    return newBounty;
  }

  public static acceptBounty(dto: AcceptTutorBountyDto): PeerTutorBounty {
    const bounty = this.bounties.find(b => b.id === dto.bountyId);
    if (bounty) {
      bounty.status = 'IN_SESSION';
      bounty.assignedTutorName = 'Rohit Chaurasiya (Verified Peer Tutor)';
      return bounty;
    }
    return this.bounties[0];
  }
}
