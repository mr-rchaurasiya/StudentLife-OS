import {
  NoteItem,
  CreateNoteDto,
  UpdateNoteDto,
  ResourceDocumentItem,
} from '@studentlife/shared';

const notesDb = new Map<string, NoteItem[]>();

const DEFAULT_RESOURCE_DOCUMENTS: ResourceDocumentItem[] = [
  {
    id: 'res-1',
    title: 'GATE CSE Master Formula & Concept Handbook',
    type: 'FORMULA_SHEET',
    subjectName: 'GATE Exam Prep',
    fileSize: '4.2 MB',
    pagesOrItems: 48,
    description: 'Comprehensive formula summaries for Discrete Math, Algorithms, COA, DBMS, and Networks.',
    tags: ['#GATE', '#Formulas', '#Revision'],
    isPinned: true,
  },
  {
    id: 'res-2',
    title: 'Distributed Systems & Microservices Architecture Blueprint',
    type: 'CHEATSHEET',
    subjectName: 'System Design',
    fileSize: '2.8 MB',
    pagesOrItems: 24,
    description: 'Visual diagrams for Sharding, CAP Theorem, Kafka pipelines, and Redis Cache invalidation.',
    tags: ['#SystemDesign', '#Architecture', '#InterviewPrep'],
    isPinned: true,
  },
  {
    id: 'res-3',
    title: 'Top 75 Essential LeetCode Patterns & Templates',
    type: 'CODE_SNIPPET',
    subjectName: 'Data Structures & Algorithms',
    fileSize: '1.5 MB',
    pagesOrItems: 75,
    description: 'Boilerplate templates for Two Pointers, Monotonic Stacks, DP State Machines, and Trie trees.',
    tags: ['#DSA', '#LeetCode', '#CodingInterview'],
    isPinned: false,
  },
];

const seedDemoNotes = () => {
  const demoStudentId = 'demo-student-uuid-01';

  const defaultNotes: NoteItem[] = [
    {
      id: 'note-1',
      userId: demoStudentId,
      title: 'Dynamic Programming: 0/1 Knapsack & Subset Sum Blueprint',
      subjectName: 'Data Structures & Algorithms',
      subjectColor: '#6366f1',
      content: `# Dynamic Programming: 0/1 Knapsack Pattern

## 1. Problem Identification
Whenever we are given a set of items with weights and profits, and we need to find a subset that satisfies a weight constraint $W$ while maximizing total profit.

\`\`\`python
def knapsack(weights, values, W, n):
    dp = [[0 for _ in range(W + 1)] for _ in range(n + 1)]
    
    for i in range(1, n + 1):
        for w in range(1, W + 1):
            if weights[i-1] <= w:
                dp[i][w] = max(values[i-1] + dp[i-1][w - weights[i-1]], dp[i-1][w])
            else:
                dp[i][w] = dp[i-1][w]
    return dp[n][W]
\`\`\`

## 2. Key Variations
- **Subset Sum Problem**: Target sum match using boolean matrix.
- **Equal Sum Partition**: If total sum is odd $\\rightarrow$ False, else Target = Sum // 2.
- **Count of Subsets with Given Sum**: Replace max with addition $(+)$.`,
      tags: ['#DSA', '#DP', '#Algorithms'],
      isBookmarked: true,
      isAiGenerated: false,
      wordCount: 120,
      readTimeMinutes: 2,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'note-2',
      userId: demoStudentId,
      title: 'System Design: Cache-Aside vs Write-Through Patterns',
      subjectName: 'System Design',
      subjectColor: '#06b6d4',
      content: `# Distributed Caching Strategies

## Cache-Aside (Lazy Loading)
1. Application queries Cache first.
2. If **Cache Hit** $\\rightarrow$ return data immediately.
3. If **Cache Miss** $\\rightarrow$ read from Database, update Cache, return data.

> **Pros**: Resilient against cache failure.  
> **Cons**: Cache misses result in 3 round trips.

---

## Write-Through Cache
Application writes data to Cache, and Cache synchronously writes to DB.

- **Pros**: Data consistency between DB and Cache is high.
- **Cons**: Write latency is higher because two storage layers are written synchronously.`,
      tags: ['#SystemDesign', '#Caching', '#Redis'],
      isBookmarked: false,
      isAiGenerated: false,
      wordCount: 95,
      readTimeMinutes: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  notesDb.set(demoStudentId, defaultNotes);
};

seedDemoNotes();

export class NotesService {
  static async getNotes(userId: string, filter?: { tag?: string; subject?: string; search?: string }): Promise<NoteItem[]> {
    let userNotes = notesDb.get(userId) || [];

    if (filter?.subject) {
      userNotes = userNotes.filter(n => n.subjectName.toLowerCase() === filter.subject!.toLowerCase());
    }
    if (filter?.tag) {
      userNotes = userNotes.filter(n => n.tags.includes(filter.tag!));
    }
    if (filter?.search) {
      const q = filter.search.toLowerCase();
      userNotes = userNotes.filter(n => n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q));
    }

    return userNotes;
  }

  static async getNoteById(userId: string, noteId: string): Promise<NoteItem | null> {
    const userNotes = notesDb.get(userId) || [];
    return userNotes.find(n => n.id === noteId) || null;
  }

  static async createNote(userId: string, dto: CreateNoteDto): Promise<NoteItem> {
    const words = dto.content.trim().split(/\\s+/).filter(Boolean).length;
    const readTimeMinutes = Math.max(1, Math.ceil(words / 150));

    const newNote: NoteItem = {
      id: `note-${Date.now()}`,
      userId,
      title: dto.title.trim(),
      content: dto.content,
      subjectName: dto.subjectName.trim(),
      subjectColor: dto.subjectColor || '#6366f1',
      tags: dto.tags || ['#StudyNote'],
      isBookmarked: dto.isBookmarked || false,
      isAiGenerated: false,
      wordCount: words,
      readTimeMinutes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const userNotes = notesDb.get(userId) || [];
    userNotes.unshift(newNote);
    notesDb.set(userId, userNotes);

    return newNote;
  }

  static async updateNote(userId: string, noteId: string, dto: UpdateNoteDto): Promise<NoteItem> {
    const userNotes = notesDb.get(userId) || [];
    const index = userNotes.findIndex(n => n.id === noteId);

    if (index === -1) {
      const error: any = new Error('Note not found');
      error.statusCode = 404;
      throw error;
    }

    const current = userNotes[index];
    const content = dto.content !== undefined ? dto.content : current.content;
    const words = content.trim().split(/\\s+/).filter(Boolean).length;
    const readTimeMinutes = Math.max(1, Math.ceil(words / 150));

    const updated: NoteItem = {
      ...current,
      title: dto.title !== undefined ? dto.title.trim() : current.title,
      content,
      subjectName: dto.subjectName !== undefined ? dto.subjectName.trim() : current.subjectName,
      subjectColor: dto.subjectColor !== undefined ? dto.subjectColor : current.subjectColor,
      tags: dto.tags !== undefined ? dto.tags : current.tags,
      isBookmarked: dto.isBookmarked !== undefined ? dto.isBookmarked : current.isBookmarked,
      wordCount: words,
      readTimeMinutes,
      updatedAt: new Date().toISOString(),
    };

    userNotes[index] = updated;
    notesDb.set(userId, userNotes);
    return updated;
  }

  static async toggleBookmark(userId: string, noteId: string): Promise<NoteItem> {
    const userNotes = notesDb.get(userId) || [];
    const note = userNotes.find(n => n.id === noteId);

    if (!note) {
      const error: any = new Error('Note not found');
      error.statusCode = 404;
      throw error;
    }

    note.isBookmarked = !note.isBookmarked;
    note.updatedAt = new Date().toISOString();
    notesDb.set(userId, userNotes);

    return note;
  }

  static async deleteNote(userId: string, noteId: string): Promise<void> {
    let userNotes = notesDb.get(userId) || [];
    userNotes = userNotes.filter(n => n.id !== noteId);
    notesDb.set(userId, userNotes);
  }

  static async getResources(): Promise<ResourceDocumentItem[]> {
    return DEFAULT_RESOURCE_DOCUMENTS;
  }
}
