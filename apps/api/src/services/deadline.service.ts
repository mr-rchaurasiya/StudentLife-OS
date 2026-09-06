import {
  DeadlineItem,
  DeadlineCategory,
  DeadlinePriority,
  NotificationChannelPreference,
  NotificationAlertLog,
  CreateDeadlineDto,
  UpdateDeadlineDto,
  DeadlineStatsSummary
} from '@studentlife/shared';

export class DeadlineService {
  private static deadlines: DeadlineItem[] = [
    {
      id: 'dl-1',
      title: 'GATE 2027 Official Online Registration Portal',
      category: 'EXAM_FORM',
      dueDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString(),
      dueTime: '23:59 IST',
      daysRemaining: 12,
      priority: 'URGENT',
      description: 'Final submission deadline for GATE online application form with regular fee (₹1,800). Upload category certificate and photograph.',
      portalUrl: 'https://gate2027.iit.ac.in/apply',
      organization: 'IIT Roorkee / GATE Organizing Committee',
      isCompleted: false,
      reminderChannels: ['PUSH', 'EMAIL', 'CALENDAR_SYNC'],
      leadTimeDays: [14, 7, 3, 1],
      tags: ['National Exam', 'GATE CSE', 'IIT Admission'],
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'dl-2',
      title: 'Reliance Foundation Undergraduate Scholarship Cutoff',
      category: 'SCHOLARSHIP_CUTOFF',
      dueDate: new Date(Date.now() + 19 * 24 * 60 * 60 * 1000).toISOString(),
      dueTime: '17:00 IST',
      daysRemaining: 19,
      priority: 'HIGH',
      description: 'Online application submission & Aptitude Test slot booking for ₹2,00,000 undergraduate grant.',
      portalUrl: 'https://scholarships.reliancefoundation.org',
      organization: 'Reliance Foundation Trust',
      isCompleted: false,
      reminderChannels: ['EMAIL', 'PUSH'],
      leadTimeDays: [14, 7, 3],
      tags: ['Scholarship', 'Need-cum-Merit', '₹2 Lakhs'],
      createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'dl-3',
      title: 'Google Summer 2026 SWE Internship Priority Window',
      category: 'INTERNSHIP_DEADLINE',
      dueDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString(),
      dueTime: '23:59 PST',
      daysRemaining: 6,
      priority: 'URGENT',
      description: 'Early candidate review window closes for Software Engineering Intern positions across Bangalore & Hyderabad campuses.',
      portalUrl: 'https://careers.google.com/jobs/students',
      organization: 'Google University Programs',
      isCompleted: false,
      reminderChannels: ['PUSH', 'EMAIL', 'CALENDAR_SYNC'],
      leadTimeDays: [7, 3, 1],
      tags: ['Big Tech', 'Internship', 'Tier 1 Priority'],
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'dl-4',
      title: 'Semester 6 Mid-Term Examination Fee & Form Clearance',
      category: 'FEE_PAYMENT',
      dueDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
      dueTime: '16:00 IST',
      daysRemaining: 4,
      priority: 'URGENT',
      description: 'University ERP examination fee payment (₹2,500) and no-dues clearance verification before Hall Ticket generation.',
      portalUrl: 'https://erp.university.edu/exam-fee',
      organization: 'University Examination Branch',
      isCompleted: false,
      reminderChannels: ['PUSH', 'EMAIL'],
      leadTimeDays: [7, 3, 1],
      tags: ['University Finals', 'Mid-Term', 'Hall Ticket'],
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'dl-5',
      title: 'UPSC CSE 2026 Prelims Online Application Form',
      category: 'COMPETITIVE_REGISTRATION',
      dueDate: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toISOString(),
      dueTime: '18:00 IST',
      daysRemaining: 28,
      priority: 'MEDIUM',
      description: 'One Time Registration (OTR) and Detailed Application Form (DAF) submission on upsconline.nic.in.',
      portalUrl: 'https://upsconline.nic.in',
      organization: 'Union Public Service Commission',
      isCompleted: false,
      reminderChannels: ['EMAIL', 'CALENDAR_SYNC'],
      leadTimeDays: [14, 7],
      tags: ['Civil Services', 'National', 'OTR Required'],
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'dl-6',
      title: 'Distributed Systems Capstone Milestone 2 Submission',
      category: 'ASSIGNMENT',
      dueDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString(),
      dueTime: '23:59 IST',
      daysRemaining: 8,
      priority: 'HIGH',
      description: 'Submit Raft Consensus Leader Election & Log Replication GitHub repo link with benchmark metrics.',
      portalUrl: 'https://classroom.google.com',
      organization: 'Department of Computer Science',
      isCompleted: true,
      reminderChannels: ['PUSH'],
      leadTimeDays: [3, 1],
      tags: ['Coursework', 'Capstone', 'Raft Algorithm'],
      createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString()
    }
  ];

  private static preferences: NotificationChannelPreference[] = [
    {
      channel: 'PUSH',
      enabled: true,
      destination: 'Web Browser Push (Chrome/Brave)',
      description: 'Instant desktop & mobile push alerts for urgent countdown milestones (< 48h)'
    },
    {
      channel: 'EMAIL',
      enabled: true,
      destination: 'alex.chen@studentlife.ai',
      description: 'Daily morning digest & 7-day advance notice alerts for exam forms & grants'
    },
    {
      channel: 'CALENDAR_SYNC',
      enabled: true,
      destination: 'iCal / Google Calendar Sync Stream',
      description: 'Automatic two-way calendar sync with recurring alarm triggers'
    },
    {
      channel: 'SMS',
      enabled: false,
      destination: '+1 (555) 019-4829',
      description: 'SMS notification alerts for critical same-day submission cutoffs'
    }
  ];

  private static alertLogs: NotificationAlertLog[] = [
    {
      id: 'log-1',
      deadlineId: 'dl-4',
      title: '⚡ 4 Days Left: Semester 6 Exam Fee Clearance',
      message: 'Your examination fee clearance window closes in 4 days. Complete payment to avoid late fine.',
      channel: 'PUSH',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      isRead: false,
      urgency: 'URGENT'
    },
    {
      id: 'log-2',
      deadlineId: 'dl-3',
      title: '🎯 Google Summer 2026 SWE Window Closes in 6 Days',
      message: 'Priority candidate review closes soon. Ensure your resume and GitHub links are attached.',
      channel: 'EMAIL',
      timestamp: new Date(Date.now() - 14 * 60 * 60 * 1000).toISOString(),
      isRead: true,
      urgency: 'URGENT'
    },
    {
      id: 'log-3',
      deadlineId: 'dl-1',
      title: '🔔 GATE 2027 Registration: 12 Days Remaining',
      message: 'Upload category certificates and verify your test center preferences.',
      channel: 'CALENDAR_SYNC',
      timestamp: new Date(Date.now() - 26 * 60 * 60 * 1000).toISOString(),
      isRead: true,
      urgency: 'HIGH'
    }
  ];

  public static getAllDeadlines(category?: DeadlineCategory, priority?: DeadlinePriority): DeadlineItem[] {
    let list = [...this.deadlines];

    if (category) {
      list = list.filter(d => d.category === category);
    }
    if (priority) {
      list = list.filter(d => d.priority === priority);
    }

    return list.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  }

  public static getDeadlineStats(): DeadlineStatsSummary {
    const total = this.deadlines.length;
    const completed = this.deadlines.filter(d => d.isCompleted).length;
    const urgent = this.deadlines.filter(d => !d.isCompleted && d.daysRemaining <= 7).length;
    const upcoming = this.deadlines.filter(d => !d.isCompleted && d.daysRemaining > 7 && d.daysRemaining <= 30).length;
    const activeChannels = this.preferences.filter(p => p.enabled).length;
    const activeUncompleted = this.deadlines
      .filter(d => !d.isCompleted)
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

    return {
      totalDeadlines: total,
      urgentCount: urgent,
      upcomingCount: upcoming,
      completedCount: completed,
      activeNotificationChannelsCount: activeChannels,
      nextImmediateDeadline: activeUncompleted[0]
    };
  }

  public static createDeadline(dto: CreateDeadlineDto): DeadlineItem {
    const dueTimeMs = new Date(dto.dueDate).getTime();
    const daysRem = Math.max(0, Math.ceil((dueTimeMs - Date.now()) / (1000 * 60 * 60 * 24)));

    const newDeadline: DeadlineItem = {
      id: `dl-${Date.now()}`,
      title: dto.title,
      category: dto.category,
      dueDate: dto.dueDate,
      dueTime: dto.dueTime || '23:59 IST',
      daysRemaining: daysRem,
      priority: dto.priority,
      description: dto.description,
      portalUrl: dto.portalUrl,
      organization: dto.organization,
      isCompleted: false,
      reminderChannels: dto.reminderChannels || ['PUSH', 'EMAIL'],
      leadTimeDays: dto.leadTimeDays || [7, 3, 1],
      tags: dto.tags || ['Custom Deadline'],
      createdAt: new Date().toISOString()
    };

    this.deadlines.unshift(newDeadline);
    return newDeadline;
  }

  public static toggleDeadlineCompletion(id: string): DeadlineItem | null {
    const item = this.deadlines.find(d => d.id === id);
    if (!item) return null;

    item.isCompleted = !item.isCompleted;
    return item;
  }

  public static updateDeadline(id: string, dto: UpdateDeadlineDto): DeadlineItem | null {
    const item = this.deadlines.find(d => d.id === id);
    if (!item) return null;

    if (dto.title) item.title = dto.title;
    if (dto.category) item.category = dto.category;
    if (dto.dueDate) {
      item.dueDate = dto.dueDate;
      item.daysRemaining = Math.max(0, Math.ceil((new Date(dto.dueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
    }
    if (dto.dueTime) item.dueTime = dto.dueTime;
    if (dto.priority) item.priority = dto.priority;
    if (dto.description) item.description = dto.description;
    if (dto.portalUrl) item.portalUrl = dto.portalUrl;
    if (dto.organization) item.organization = dto.organization;
    if (typeof dto.isCompleted === 'boolean') item.isCompleted = dto.isCompleted;
    if (dto.reminderChannels) item.reminderChannels = dto.reminderChannels;
    if (dto.leadTimeDays) item.leadTimeDays = dto.leadTimeDays;
    if (dto.tags) item.tags = dto.tags;

    return item;
  }

  public static deleteDeadline(id: string): boolean {
    const prevLen = this.deadlines.length;
    this.deadlines = this.deadlines.filter(d => d.id !== id);
    return this.deadlines.length < prevLen;
  }

  public static getPreferences(): NotificationChannelPreference[] {
    return this.preferences;
  }

  public static toggleChannelPreference(channel: string): NotificationChannelPreference[] {
    const pref = this.preferences.find(p => p.channel === channel);
    if (pref) {
      pref.enabled = !pref.enabled;
    }
    return this.preferences;
  }

  public static getAlertLogs(): NotificationAlertLog[] {
    return this.alertLogs;
  }

  public static markLogAsRead(id: string): NotificationAlertLog[] {
    const log = this.alertLogs.find(l => l.id === id);
    if (log) {
      log.isRead = true;
    }
    return this.alertLogs;
  }

  public static triggerTestNotification(channel: string = 'PUSH'): NotificationAlertLog {
    const newAlert: NotificationAlertLog = {
      id: `log-${Date.now()}`,
      deadlineId: 'dl-test',
      title: `⚡ Live Test Trigger via ${channel}`,
      message: `Verification notification successfully dispatched from StudentLife OS Engine at ${new Date().toLocaleTimeString()}.`,
      channel: channel as any,
      timestamp: new Date().toISOString(),
      isRead: false,
      urgency: 'HIGH'
    };

    this.alertLogs.unshift(newAlert);
    return newAlert;
  }

  public static generateIcsCalendar(): string {
    const activeDeadlines = this.deadlines.filter(d => !d.isCompleted);
    const nowStamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

    const eventsIcs = activeDeadlines.map(d => {
      const due = new Date(d.dueDate);
      const dtStart = due.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
      const dtEnd = new Date(due.getTime() + 60 * 60 * 1000).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

      return [
        'BEGIN:VEVENT',
        `UID:${d.id}@studentlife.os`,
        `DTSTAMP:${nowStamp}`,
        `DTSTART:${dtStart}`,
        `DTEND:${dtEnd}`,
        `SUMMARY:[StudentLife OS] ${d.title}`,
        `DESCRIPTION:${d.description.replace(/\n/g, '\\n')}\\n\\nPortal: ${d.portalUrl || 'N/A'}\\nPriority: ${d.priority}`,
        `CATEGORIES:${d.category}`,
        `STATUS:CONFIRMED`,
        `PRIORITY:${d.priority === 'URGENT' ? '1' : d.priority === 'HIGH' ? '3' : '5'}`,
        'BEGIN:VALARM',
        'TRIGGER:-P1D',
        'ACTION:DISPLAY',
        `DESCRIPTION:Reminder: ${d.title} is due tomorrow!`,
        'END:VALARM',
        'END:VEVENT'
      ].join('\r\n');
    }).join('\r\n');

    return [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//StudentLife OS//Academic Deadlines Calendar//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'X-WR-CALNAME:StudentLife OS Deadlines & Exam Forms',
      'X-WR-TIMEZONE:UTC',
      eventsIcs,
      'END:VCALENDAR'
    ].join('\r\n');
  }
}
