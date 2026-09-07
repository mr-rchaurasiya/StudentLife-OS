import { CampusItem, CreateCampusItemDto } from '@studentlife/shared';

export class CampusExchangeService {
  private static items: CampusItem[] = [
    {
      id: 'item-01',
      type: 'LOST',
      category: 'CALCULATOR',
      title: 'Casio fx-991EX ClassWiz Scientific Calculator',
      locationDetails: 'Left in LH-102 Lecture Hall, Row 4 Desk',
      description: 'Black casing with sticker of React logo on back cover. Found missing after Afternoon Physics Lecture.',
      reportedBy: 'Rahul Sharma',
      contactHandle: '@rahul_s_iit',
      status: 'OPEN',
      dateReported: '2026-09-06'
    },
    {
      id: 'item-02',
      type: 'FOUND',
      category: 'ID_DOCUMENT',
      title: 'College Campus Library SmartCard (Card #88921)',
      locationDetails: 'Central Library Ground Floor Reading Room',
      description: 'Submitted to reception desk. Name visible: Priyanshu V.',
      reportedBy: 'Library Warden',
      contactHandle: 'library_desk@campus.edu',
      status: 'OPEN',
      dateReported: '2026-09-07'
    },
    {
      id: 'item-03',
      type: 'FOR_BORROW_RENT',
      category: 'LAB_EQUIPMENT',
      title: 'Engineering Mini Drafter + T-Scale Set',
      locationDetails: 'Hostel Block B, Room 312',
      description: 'Available for semester borrowing or exams. Completely calibrated with pristine scales.',
      reportedBy: 'Amit Patel',
      contactHandle: '@amit_mech25',
      status: 'OPEN',
      dateReported: '2026-09-05'
    }
  ];

  public static getItems(): CampusItem[] {
    return this.items;
  }

  public static reportItem(dto: CreateCampusItemDto): CampusItem {
    const newItem: CampusItem = {
      id: `item-${Date.now()}`,
      type: dto.type,
      category: dto.category,
      title: dto.title,
      locationDetails: dto.locationDetails,
      description: dto.description,
      reportedBy: 'Active Student',
      contactHandle: dto.contactHandle || '@student',
      status: 'OPEN',
      dateReported: new Date().toISOString().split('T')[0]
    };

    this.items.unshift(newItem);
    return newItem;
  }

  public static claimItem(id: string): CampusItem | null {
    const item = this.items.find(i => i.id === id);
    if (!item) return null;
    item.status = item.type === 'FOR_BORROW_RENT' ? 'CLAIMED' : 'RESOLVED';
    return item;
  }
}
