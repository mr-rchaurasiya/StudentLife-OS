import {
  VirtualStudyRoom,
  CommunityDoubtPost,
  CommunityStatsSummary,
  CreateDiscussionDto,
  PostReplyDto,
  CreateStudyRoomDto,
  DiscussionReplyItem
} from '@studentlife/shared';

export class CommunityService {
  private static studyRooms: VirtualStudyRoom[] = [
    {
      id: 'room-1',
      name: 'GATE CSE 2027 • 100-Day Sprint Jam',
      topicOrExam: 'GATE (CSE / IT)',
      roomType: 'SILENT_FOCUS',
      backgroundAmbience: 'LOFI_RAIN',
      activeParticipantsCount: 14,
      maxCapacity: 25,
      pomodoroStage: 'FOCUS',
      secondsRemainingInInterval: 1140, // 19 mins
      hostName: 'Siddharth V. (AIR 42)',
      hostAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=siddharth',
      participants: [
        { id: 'p1', name: 'Alex Chen', avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=student', studyGoal: 'Solve 10 DP Recurrences', streakDays: 7 },
        { id: 'p2', name: 'Priya Sharma', avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=priya', studyGoal: 'Compiler Design Syntax Trees', streakDays: 12 },
        { id: 'p3', name: 'Rohan Gupta', avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=rohan', studyGoal: 'Computer Networks TCP Reno', streakDays: 4 },
        { id: 'p4', name: 'Ananya Roy', avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=ananya', studyGoal: 'Discrete Math Graphs', streakDays: 9 }
      ],
      isLocked: false,
      tags: ['National Exam', 'Strict Silent', 'Pomodoro 50/10']
    },
    {
      id: 'room-2',
      name: 'Distributed Systems & FAANG LeetCode Grind',
      topicOrExam: 'Tier-1 SDE Placements',
      roomType: 'LATE_NIGHT_GRIND',
      backgroundAmbience: 'DEEP_SYNTH',
      activeParticipantsCount: 19,
      maxCapacity: 30,
      pomodoroStage: 'FOCUS',
      secondsRemainingInInterval: 620, // 10 mins
      hostName: 'Devika Nair (SWE Intern)',
      hostAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=devika',
      participants: [
        { id: 'p5', name: 'Karan Mehra', avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=karan', studyGoal: 'Raft Log Replication in Go', streakDays: 15 },
        { id: 'p6', name: 'Vikram Joshi', avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=vikram', studyGoal: 'Sliding Window Hard Problems', streakDays: 6 }
      ],
      isLocked: false,
      tags: ['Coding & Systems', 'Late Night', 'Lofi Synth']
    },
    {
      id: 'room-3',
      name: 'Quiet University Finals & Mathematics Hall',
      topicOrExam: 'Engineering Mathematics & Sem Finals',
      roomType: 'SILENT_FOCUS',
      backgroundAmbience: 'LIBRARY_CAFE',
      activeParticipantsCount: 8,
      maxCapacity: 20,
      pomodoroStage: 'SHORT_BREAK',
      secondsRemainingInInterval: 210, // 3.5 mins
      hostName: 'Arjun K.',
      hostAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=arjun',
      participants: [
        { id: 'p7', name: 'Meera Iyer', avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=meera', studyGoal: 'Linear Algebra Eigenvalues', streakDays: 8 }
      ],
      isLocked: false,
      tags: ['University Finals', 'Library Ambience', 'Break Time']
    },
    {
      id: 'room-4',
      name: 'UPSC CSE 2026 Prelims Reading Room',
      topicOrExam: 'Civil Services Examination',
      roomType: 'SILENT_FOCUS',
      backgroundAmbience: 'WHITE_NOISE',
      activeParticipantsCount: 22,
      maxCapacity: 40,
      pomodoroStage: 'FOCUS',
      secondsRemainingInInterval: 1480, // 24 mins
      hostName: 'Aditya P. (IAS Aspirant)',
      hostAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=aditya',
      participants: [
        { id: 'p8', name: 'Shreya Das', avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=shreya', studyGoal: 'Indian Polity Laxmikanth Ch 12-16', streakDays: 21 }
      ],
      isLocked: false,
      tags: ['Civil Services', 'High Focus', 'Deep White Noise']
    }
  ];

  private static discussions: CommunityDoubtPost[] = [
    {
      id: 'post-1',
      authorId: 'auth-1',
      authorName: 'Rohan Verma',
      authorAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=rohan',
      authorBadge: 'Level 4 • Rank Top 5%',
      subjectTag: 'Algorithms',
      targetExam: 'GATE CSE',
      title: 'How to prove optimal substructure for Longest Increasing Subsequence with Binary Search?',
      content: 'I understand the classic O(N^2) DP approach where dp[i] = 1 + max(dp[j]). But how do we rigorously prove why the tails array with binary search (Patience Sorting) guarantees optimal subsequence length in O(N log N)?',
      codeSnippet: `// Patience sorting binary search approach\nint lengthOfLIS(vector<int>& nums) {\n    vector<int> tails;\n    for (int x : nums) {\n        auto it = lower_bound(tails.begin(), tails.end(), x);\n        if (it == tails.end()) tails.push_back(x);\n        else *it = x;\n    }\n    return tails.size();\n}`,
      upvotesCount: 28,
      isUpvotedByMe: false,
      answersCount: 2,
      isSolved: true,
      topAnswerAuthor: 'Siddharth V. (AIR 42)',
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      replies: [
        {
          id: 'rep-1',
          authorId: 'auth-sid',
          authorName: 'Siddharth V. (AIR 42)',
          authorAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=siddharth',
          authorBadge: 'AIR 42 • GATE CSE Mentor',
          content: 'The key invariant is: `tails[i]` stores the minimum tail element among all increasing subsequences of length `i + 1` seen so far. Because `tails` is strictly monotonically increasing, we can binary search in O(log N). When we replace `tails[k] = x`, we are making the boundary smaller for future elements without reducing the maximum length achieved.',
          upvotes: 24,
          isUpvotedByMe: true,
          isAcceptedAnswer: true,
          createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'rep-2',
          authorId: 'auth-2',
          authorName: 'Ananya Roy',
          authorAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=ananya',
          authorBadge: 'Level 3 Student',
          content: 'Also remember: `tails` does NOT store the actual LIS subsequence elements in order—it only tracks the optimal tail boundaries. To reconstruct the sequence, you need parent pointers.',
          upvotes: 9,
          isUpvotedByMe: false,
          isAcceptedAnswer: false,
          createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
        }
      ]
    },
    {
      id: 'post-2',
      authorId: 'auth-3',
      authorName: 'Karan Mehra',
      authorAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=karan',
      authorBadge: 'Level 5 Distributed Systems',
      subjectTag: 'System Design',
      targetExam: 'FAANG Interviews',
      title: 'Handling Redis Cache Stampede (Thundering Herd) under 50k QPS spikes?',
      content: 'When a hot cache key expires while multiple worker pods query it simultaneously, all requests fall through to Postgres causing connection exhaustion. What is the production standard: Mutex Locking (Singleflight) or Probabilistic Early Expiration (XFetch)?',
      upvotesCount: 34,
      isUpvotedByMe: true,
      answersCount: 1,
      isSolved: true,
      topAnswerAuthor: 'Devika Nair',
      createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
      replies: [
        {
          id: 'rep-3',
          authorId: 'auth-devika',
          authorName: 'Devika Nair',
          authorAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=devika',
          authorBadge: 'Cloud Telemetry Lead',
          content: 'In distributed Go microservices, using `golang.org/x/sync/singleflight` combined with probabilistic early background refresh (XFetch algorithm: `currentTime - beta * delta * ln(random()) > expiry`) is standard. Only 1 goroutine regenerates the cache key while others wait on channel result.',
          codeSnippet: `// Singleflight group prevents concurrent DB hits\nv, err, _ := g.Do(key, func() (interface{}, error) {\n    return fetchFromPostgres(key)\n})`,
          upvotes: 29,
          isUpvotedByMe: true,
          isAcceptedAnswer: true,
          createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
        }
      ]
    },
    {
      id: 'post-3',
      authorId: 'auth-4',
      authorName: 'Shreya Das',
      authorAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=shreya',
      authorBadge: 'Level 3 Aspirant',
      subjectTag: 'Operating Systems',
      targetExam: 'University Finals',
      title: 'Difference between Banker Algorithm and Resource Allocation Graph with multiple instances?',
      content: 'Can a cycle in a Resource Allocation Graph guarantee deadlock when multiple instances of resources are present, or is safety check algorithm mandatory?',
      upvotesCount: 16,
      isUpvotedByMe: false,
      answersCount: 1,
      isSolved: false,
      createdAt: new Date(Date.now() - 14 * 60 * 60 * 1000).toISOString(),
      replies: [
        {
          id: 'rep-4',
          authorId: 'auth-1',
          authorName: 'Alex Chen',
          authorAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=student',
          authorBadge: 'StudentLife Scholar',
          content: 'A cycle in RAG is a NECESSARY condition, but NOT SUFFICIENT when resources have multiple instances. You must run Banker Safety Algorithm (`Work >= Need`) to check for a safe sequence.',
          upvotes: 11,
          isUpvotedByMe: false,
          isAcceptedAnswer: false,
          createdAt: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString()
        }
      ]
    }
  ];

  public static getStats(): CommunityStatsSummary {
    const totalStudentsLive = this.studyRooms.reduce((acc, r) => acc + r.activeParticipantsCount, 365);
    return {
      totalActiveStudentsLive: totalStudentsLive,
      activeStudyRoomsCount: this.studyRooms.length,
      totalDoubtsSolvedToday: 142,
      totalDiscussionThreads: this.discussions.length
    };
  }

  public static getRooms(): VirtualStudyRoom[] {
    return this.studyRooms;
  }

  public static createRoom(dto: CreateStudyRoomDto): VirtualStudyRoom {
    const newRoom: VirtualStudyRoom = {
      id: `room-${Date.now()}`,
      name: dto.name,
      topicOrExam: dto.topicOrExam,
      roomType: dto.roomType,
      backgroundAmbience: dto.backgroundAmbience,
      activeParticipantsCount: 1,
      maxCapacity: dto.maxCapacity || 25,
      pomodoroStage: 'FOCUS',
      secondsRemainingInInterval: 1500, // 25 mins
      hostName: 'Alex Chen (You)',
      hostAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=student',
      participants: [
        { id: 'p-me', name: 'Alex Chen', avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=student', studyGoal: 'Live Peer Study Session', streakDays: 7 }
      ],
      isLocked: false,
      tags: dto.tags || ['Custom Study Room']
    };

    this.studyRooms.unshift(newRoom);
    return newRoom;
  }

  public static joinRoom(roomId: string): VirtualStudyRoom | null {
    const room = this.studyRooms.find(r => r.id === roomId);
    if (!room) return null;

    if (!room.participants.some(p => p.id === 'p-me')) {
      room.participants.push({
        id: 'p-me',
        name: 'Alex Chen (You)',
        avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=student',
        studyGoal: 'Focus Session',
        streakDays: 7
      });
      room.activeParticipantsCount += 1;
    }
    return room;
  }

  public static getDiscussions(subjectTag?: string, targetExam?: string): CommunityDoubtPost[] {
    let list = [...this.discussions];
    if (subjectTag && subjectTag !== 'ALL') {
      list = list.filter(d => d.subjectTag.toLowerCase() === subjectTag.toLowerCase());
    }
    if (targetExam && targetExam !== 'ALL') {
      list = list.filter(d => d.targetExam?.toLowerCase().includes(targetExam.toLowerCase()));
    }
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public static createDiscussion(dto: CreateDiscussionDto): CommunityDoubtPost {
    const newPost: CommunityDoubtPost = {
      id: `post-${Date.now()}`,
      authorId: 'auth-me',
      authorName: 'Alex Chen',
      authorAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=student',
      authorBadge: 'Level 2 Scholar • 7d Streak 🔥',
      subjectTag: dto.subjectTag,
      targetExam: dto.targetExam || 'General Academics',
      title: dto.title,
      content: dto.content,
      codeSnippet: dto.codeSnippet,
      upvotesCount: 1,
      isUpvotedByMe: true,
      answersCount: 0,
      isSolved: false,
      replies: [],
      createdAt: new Date().toISOString()
    };

    this.discussions.unshift(newPost);
    return newPost;
  }

  public static toggleUpvote(postId: string): CommunityDoubtPost | null {
    const post = this.discussions.find(p => p.id === postId);
    if (!post) return null;

    if (post.isUpvotedByMe) {
      post.upvotesCount = Math.max(0, post.upvotesCount - 1);
      post.isUpvotedByMe = false;
    } else {
      post.upvotesCount += 1;
      post.isUpvotedByMe = true;
    }
    return post;
  }

  public static addReply(postId: string, dto: PostReplyDto): CommunityDoubtPost | null {
    const post = this.discussions.find(p => p.id === postId);
    if (!post) return null;

    const newReply: DiscussionReplyItem = {
      id: `rep-${Date.now()}`,
      authorId: 'auth-me',
      authorName: 'Alex Chen',
      authorAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=student',
      authorBadge: 'Level 2 Scholar',
      content: dto.content,
      codeSnippet: dto.codeSnippet,
      upvotes: 1,
      isUpvotedByMe: true,
      isAcceptedAnswer: false,
      createdAt: new Date().toISOString()
    };

    post.replies.push(newReply);
    post.answersCount = post.replies.length;
    return post;
  }
}
