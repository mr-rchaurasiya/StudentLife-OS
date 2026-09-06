import {
  AiPodcast,
  GeneratePodcastDto,
  PodcastHost,
  PodcastDialogueTurn
} from '@studentlife/shared';

export class AiPodcastService {
  private podcasts: Map<string, AiPodcast> = new Map();

  private host1: PodcastHost = {
    id: 'host-alex',
    name: 'Dr. Alex Vance',
    avatar: '👨‍🏫',
    role: 'Analytical Theory Specialist',
    voiceGender: 'male',
    personality: 'Structured, rigorous, breaks down underlying first-principles.'
  };

  private host2: PodcastHost = {
    id: 'host-maya',
    name: 'Prof. Maya Sharma',
    avatar: '👩‍🔬',
    role: 'Intuitive & Exam Strategist',
    voiceGender: 'female',
    personality: 'Engaging, provides vivid analogies and mnemonic shortcuts.'
  };

  constructor() {
    this.seedDefaultPodcasts();
  }

  private seedDefaultPodcasts(): void {
    const quantumPodcast: AiPodcast = {
      id: 'podcast-quantum-physics',
      title: 'Quantum Wavefunctions & The Reality of Schrödinger\'s Cat',
      topic: 'Quantum Mechanics & Modern Physics',
      sourceType: 'TEXTBOOK_CHAPTER',
      totalDurationSeconds: 180,
      host1: this.host1,
      host2: this.host2,
      summaryKeyTakeaways: [
        'Wave-particle duality applies to every quantum particle: λ = h / p.',
        'Born\'s interpretation establishes |ψ|² as a probability density rather than a physical smear.',
        'Superposition collapses strictly upon interaction or thermodynamic measurement.'
      ],
      dialogueTurns: [
        {
          id: 'turn-1',
          speaker: 'host1',
          text: 'Welcome back everyone to the Deep Dive Study Podcast. Today we are tackling something that trips up almost every physics student: the Schrödinger Equation and the true meaning of quantum wavefunctions.',
          durationEstimateSeconds: 8,
          keyConcepts: ['Schrödinger Equation', 'Wavefunction Intro']
        },
        {
          id: 'turn-2',
          speaker: 'host2',
          text: 'Yes! And Alex, the common mistake students make is visualizing the wave function as a physical cloud of dust spread out in space. But that is fundamentally misleading!',
          durationEstimateSeconds: 7,
          keyConcepts: ['Common Student Misconception', 'Probability Interpretation']
        },
        {
          id: 'turn-3',
          speaker: 'host1',
          text: 'Exactly right, Maya. Max Born proved that ψ is actually a complex probability amplitude. When you take the squared magnitude, mod ψ squared, it gives you the exact statistical probability of finding that electron at coordinate x.',
          durationEstimateSeconds: 9,
          keyConcepts: ['Max Born Rule', 'Mod Psi Squared']
        },
        {
          id: 'turn-4',
          speaker: 'host2',
          text: 'Here is a memory peg for your exams: Think of ψ as a weather map with isobar lines. The lines aren\'t the rain itself, they tell you where the rain is most likely to fall!',
          durationEstimateSeconds: 8,
          keyConcepts: ['Exam Mnemonic', 'Weather Map Analogy']
        },
        {
          id: 'turn-5',
          speaker: 'host1',
          text: 'Brilliant analogy. And on top of that, remember the de Broglie relation λ equals h over p. For competitive exams like JEE or GATE, always check non-relativistic bounds before plugging in momentum values.',
          durationEstimateSeconds: 9,
          keyConcepts: ['de Broglie Equation', 'Exam Numerical Strategy']
        }
      ],
      createdAt: new Date().toISOString()
    };

    this.podcasts.set(quantumPodcast.id, quantumPodcast);
  }

  public getAllPodcasts(): AiPodcast[] {
    return Array.from(this.podcasts.values());
  }

  public getPodcastById(id: string): AiPodcast | undefined {
    return this.podcasts.get(id);
  }

  public generatePodcast(dto: GeneratePodcastDto): AiPodcast {
    const topic = dto.topic || 'General Core Study Topic';
    const id = `podcast-${Date.now()}`;

    const turns: PodcastDialogueTurn[] = [
      {
        id: 'turn-1',
        speaker: 'host1',
        text: `Welcome students to today's active audio breakdown on: ${topic}. Let's break down the essential foundations you need to master this for your exams.`,
        durationEstimateSeconds: 8,
        keyConcepts: ['Topic Overview', 'Core Foundations']
      },
      {
        id: 'turn-2',
        speaker: 'host2',
        text: `Absolutely, Alex! If we look at past year trends, questions from ${topic} test your conceptual depth rather than rote memorization. The key is understanding how the primary variables interact.`,
        durationEstimateSeconds: 9,
        keyConcepts: ['Exam Weightage', 'Conceptual Depth']
      },
      {
        id: 'turn-3',
        speaker: 'host1',
        text: `Precisely. When analyzing ${topic}, start by isolating boundary conditions and identifying constant parameters before executing any derivative or proof.`,
        durationEstimateSeconds: 8,
        keyConcepts: ['Boundary Conditions', 'Problem Solving Workflow']
      },
      {
        id: 'turn-4',
        speaker: 'host2',
        text: `And for revision speed: create a 1-page formula sheet mapping the direct relationships. That will save you crucial minutes during final test series!`,
        durationEstimateSeconds: 7,
        keyConcepts: ['Revision Shortcut', 'Formula Sheet Strategy']
      }
    ];

    const newPodcast: AiPodcast = {
      id,
      title: `AI Masterclass: ${topic}`,
      topic,
      sourceType: dto.sourceText ? 'NOTES' : 'SYLLABUS',
      totalDurationSeconds: 150,
      host1: this.host1,
      host2: this.host2,
      summaryKeyTakeaways: [
        `Master the first-principles foundation of ${topic}.`,
        'Focus on boundary limits and parameter scaling.',
        'Pair formula derivation with active spaced repetition recall.'
      ],
      dialogueTurns: turns,
      createdAt: new Date().toISOString()
    };

    this.podcasts.set(id, newPodcast);
    return newPodcast;
  }
}

export const aiPodcastService = new AiPodcastService();
