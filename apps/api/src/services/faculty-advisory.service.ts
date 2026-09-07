import { FacultyOfficeSlot, AdvisoryBooking, BookAdvisorySlotDto } from '@studentlife/shared';

export class FacultyAdvisoryService {
  private static facultySlots: FacultyOfficeSlot[] = [
    {
      id: 'fac-01',
      professorName: 'Prof. Arvind Kejriwal, Ph.D.',
      department: 'Computer Science & Engineering',
      officeRoom: 'Block IV, Room 412 (Academic Wing)',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
      availableDays: ['Tuesday', 'Thursday'],
      timeSlotFormatted: '14:00 - 16:00 IST',
      maxStudentsPerSlot: 4,
      currentBookingsCount: 1
    },
    {
      id: 'fac-02',
      professorName: 'Dr. Sunita Narain, Ph.D.',
      department: 'Electrical Engineering & Quantum Systems',
      officeRoom: 'EE Research Labs, Room 208',
      avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100',
      availableDays: ['Wednesday', 'Friday'],
      timeSlotFormatted: '15:30 - 17:30 IST',
      maxStudentsPerSlot: 3,
      currentBookingsCount: 2
    }
  ];

  private static bookings: AdvisoryBooking[] = [
    {
      id: 'book-01',
      facultyId: 'fac-01',
      professorName: 'Prof. Arvind Kejriwal, Ph.D.',
      studentName: 'Rohit Chaurasiya',
      scheduledDate: '2026-09-10',
      scheduledTime: '14:30 IST',
      purpose: 'THESIS_GUIDANCE',
      agendaDescription: 'Review preliminary benchmark results on dynamic LoRA quantization and discuss NeurIPS submission timeline.',
      briefingPacketSummary: 'Attached: 5-Page Draft Blueprint, Syllabus Completion 84%, Recent GATE Score Top 0.5%.',
      status: 'CONFIRMED',
      createdAt: new Date().toISOString()
    }
  ];

  public static getFacultySlots(): FacultyOfficeSlot[] {
    return this.facultySlots;
  }

  public static getBookings(): AdvisoryBooking[] {
    return this.bookings;
  }

  public static bookSlot(dto: BookAdvisorySlotDto): AdvisoryBooking {
    const faculty = this.facultySlots.find(f => f.id === dto.facultyId) || this.facultySlots[0];
    faculty.currentBookingsCount += 1;

    const newBooking: AdvisoryBooking = {
      id: `book-${Date.now()}`,
      facultyId: faculty.id,
      professorName: faculty.professorName,
      studentName: 'Rohit Chaurasiya',
      scheduledDate: dto.scheduledDate || '2026-09-12',
      scheduledTime: '15:00 IST',
      purpose: dto.purpose || 'THESIS_GUIDANCE',
      agendaDescription: dto.agendaDescription || '1-on-1 Academic & Research Advisory Meeting',
      briefingPacketSummary: `Auto-Compiled Brief: Academic Year 3, Field: ${faculty.department}, 3 Research Questions attached.`,
      status: 'CONFIRMED',
      createdAt: new Date().toISOString()
    };

    this.bookings.unshift(newBooking);
    return newBooking;
  }
}
