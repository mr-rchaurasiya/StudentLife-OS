import { VideoLectureAnalysis, AnalyzeLectureDto } from '@studentlife/shared';

export class VideoNavigatorService {
  private static lectures: VideoLectureAnalysis[] = [
    {
      id: 'lec-dsa-dp',
      videoTitle: 'Lecture 18: Dynamic Programming, Bellman-Ford & Shortest Paths',
      sourceUrl: 'https://youtube.com/watch?v=OQ5jsbhAv_M',
      durationMinutes: 52,
      instructorName: 'Prof. Erik Demaine (MIT 6.006)',
      subject: 'Computer Science & Algorithms',
      createdAt: new Date().toISOString(),
      printableCheatsheetMarkdown: `### 📌 Key Takeaways: Bellman-Ford & DP
- **Negative Cycles**: Bellman-Ford detects negative weight cycles in $O(|V| \cdot |E|)$ time.
- **Recurrence**: $d[v] = \min(d[v], d[u] + w(u, v))$ relaxed $|V| - 1$ times.
- **DAG Shortest Path**: Topologically sort vertices in $O(V + E)$ then relax edges in linear time.`,
      chapters: [
        {
          timestampSeconds: 0,
          timestampFormatted: '00:00',
          title: 'Introduction & Motivation for Shortest Paths with Negative Weights',
          keyConcepts: ['Dijkstra Limitations', 'Negative Cycle Definition']
        },
        {
          timestampSeconds: 512,
          timestampFormatted: '08:32',
          title: 'Bellman-Ford Relaxations Algorithm Proof',
          keyConcepts: ['Edge Relaxation', '|V|-1 Invariant Loop'],
          extractedWhiteboardMathProof: 'd^{(k)}[v] = \\min \\{ d^{(k-1)}[v], \\min_{u} (d^{(k-1)}[u] + w(u,v)) \\}'
        },
        {
          timestampSeconds: 1420,
          timestampFormatted: '23:40',
          title: 'Dynamic Programming Memoization & Subproblem DAG',
          keyConcepts: ['Topological Ordering', 'Memoized Recursion vs Iterative DP']
        },
        {
          timestampSeconds: 2310,
          timestampFormatted: '38:30',
          title: 'Negative Cycle Detection on 10th Iteration',
          keyConcepts: ['Cycle Re-evaluation', 'Infinity Distance Sentinel']
        }
      ]
    }
  ];

  public static getLectures(): VideoLectureAnalysis[] {
    return this.lectures;
  }

  public static analyzeLecture(dto: AnalyzeLectureDto): VideoLectureAnalysis {
    const existing = this.lectures.find(l => l.sourceUrl === dto.videoUrl);
    if (existing) return existing;

    const newAnalysis: VideoLectureAnalysis = {
      id: `lec-${Date.now()}`,
      videoTitle: dto.videoUrl.includes('youtube') ? 'Advanced University Lecture Video' : 'Synthesized Video Lecture Stream',
      sourceUrl: dto.videoUrl,
      durationMinutes: 45,
      instructorName: 'Guest Faculty / NPTEL Series',
      subject: dto.targetSubject || 'Engineering & Science',
      createdAt: new Date().toISOString(),
      printableCheatsheetMarkdown: `### 📌 Auto-Generated Lecture Summary for ${dto.targetSubject || 'Topic'}
- **Core Theorem**: Verified structural properties with asymptotic lower bounds.
- **Practical Application**: Step-by-step example problem solved at min 18:40.
- **Exam Warning**: Highlighted as high-frequency question pattern.`,
      chapters: [
        {
          timestampSeconds: 0,
          timestampFormatted: '00:00',
          title: 'Lecture Overview & Historical Context',
          keyConcepts: ['Foundational Concepts', 'Prerequisite Review']
        },
        {
          timestampSeconds: 620,
          timestampFormatted: '10:20',
          title: 'Mathematical Proof & Theoretical Formulation',
          keyConcepts: ['Lemma 1 Proof', 'Invariant Formulation'],
          extractedWhiteboardMathProof: 'T(n) = 2T(n/2) + O(n) \\implies O(n \\log n)'
        },
        {
          timestampSeconds: 1380,
          timestampFormatted: '23:00',
          title: 'Worked Numerical Problem & Edge Cases',
          keyConcepts: ['Step-by-step walkthrough', 'Boundary condition analysis']
        },
        {
          timestampSeconds: 2100,
          timestampFormatted: '35:00',
          title: 'Summary & Practice PYQ Homework Problems',
          keyConcepts: ['Homework Set', 'Next Lecture Preview']
        }
      ]
    };

    this.lectures.unshift(newAnalysis);
    return newAnalysis;
  }
}
