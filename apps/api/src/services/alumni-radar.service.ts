import { AlumnusMentor, AlumniMentorshipRequest, RequestAlumniChatDto } from '@studentlife/shared';

export class AlumniRadarService {
  private static alumni: AlumnusMentor[] = [
    {
      id: 'alumni-01',
      fullName: 'Vikramaditya Iyer (Class of 2021)',
      graduationYear: 2021,
      degree: 'B.Tech Computer Science (IIT)',
      companyName: 'Google DeepMind (London)',
      currentDesignation: 'Senior Research Scientist (LLM Systems)',
      industry: 'DEEP_TECH_AI',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
      linkedinHandle: 'linkedin.com/in/vikram-iyer-ai',
      bioSnippet: 'Ex-competitive programmer. Mentoring undergrads on publishing top-tier AI papers and transitioning into industrial AI research labs.',
      availableCoffeeSlotsCount: 2,
      topAdviceTag: 'Deep Work > Shallow Application Spam'
    },
    {
      id: 'alumni-02',
      fullName: 'Ananya Deshmukh (Class of 2022)',
      graduationYear: 2022,
      degree: 'B.Tech Electrical Engineering',
      companyName: 'NVIDIA (Santa Clara / Remote)',
      currentDesignation: 'Senior CUDA & Hardware Acceleration Engineer',
      industry: 'BIG_TECH',
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100',
      linkedinHandle: 'linkedin.com/in/ananya-deshmukh-nv',
      bioSnippet: 'Helping students master low-level C++, GPU kernel optimization, and cracking systems placement interviews.',
      availableCoffeeSlotsCount: 3,
      topAdviceTag: 'Master Pointer Arithmetic & Memory Hierarchy'
    }
  ];

  private static requests: AlumniMentorshipRequest[] = [
    {
      id: 'req-01',
      mentorId: 'alumni-01',
      mentorName: 'Vikramaditya Iyer (Class of 2021)',
      studentName: 'Rohit Chaurasiya',
      requestedDate: '2026-09-14',
      topicDiscussion: 'Guidance on NeurIPS / ICML publication roadmap and DeepMind research internship referrals.',
      aiSuggestedIcebreaker: 'Hi Vikramaditya! I noticed your recent work on speculative decoding and shared IIT club lineage in Robotics.',
      status: 'ACCEPTED',
      meetingRoomUrl: 'https://meet.google.com/xyz-student-alumni',
      createdAt: new Date().toISOString()
    }
  ];

  public static getMentors(): AlumnusMentor[] {
    return this.alumni;
  }

  public static getRequests(): AlumniMentorshipRequest[] {
    return this.requests;
  }

  public static requestChat(dto: RequestAlumniChatDto): AlumniMentorshipRequest {
    const mentor = this.alumni.find(m => m.id === dto.mentorId) || this.alumni[0];
    const newReq: AlumniMentorshipRequest = {
      id: `req-${Date.now()}`,
      mentorId: mentor.id,
      mentorName: mentor.fullName,
      studentName: 'Rohit Chaurasiya',
      requestedDate: dto.preferredDate || '2026-09-16',
      topicDiscussion: dto.topicDiscussion || 'General Tech Career & Systems Engineering Advice',
      aiSuggestedIcebreaker: `Hi ${mentor.fullName.split(' ')[0]}, I am an undergraduate working on ${dto.topicDiscussion.slice(0, 40)} and would love 15 mins of your wisdom as an alumnus at ${mentor.companyName}!`,
      status: 'PENDING_APPROVAL',
      createdAt: new Date().toISOString()
    };
    this.requests.unshift(newReq);
    return newReq;
  }
}
