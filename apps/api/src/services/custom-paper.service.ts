import { 
  CustomMockPaper, 
  GenerateMockPaperDto, 
  ExamDifficulty, 
  MockPaperQuestion 
} from '@studentlife/shared';

export class CustomPaperService {
  private savedPapers: Map<string, CustomMockPaper> = new Map();

  constructor() {
    this.seedDefaultPapers();
  }

  private seedDefaultPapers(): void {
    const jeeAdvancedPaper: CustomMockPaper = {
      id: 'paper-jee-adv-2026-01',
      title: 'JEE Advanced 2026: Grand Super-Mock (Physics & Math Focus)',
      examType: 'JEE Advanced',
      subject: 'Physics & Mathematics',
      durationMinutes: 180,
      totalMarks: 120,
      totalQuestions: 6,
      sections: [
        {
          title: 'Section 1: Single Correct Multiple Choice (+3 / -1)',
          weightageMarks: 36,
          questions: [
            {
              id: 'q-jee-1',
              questionNumber: 1,
              type: 'MCQ',
              marks: 3,
              negativeMarks: 1,
              difficulty: 'HARD',
              topic: 'Rotational Dynamics & Conservation of Angular Momentum',
              questionText: 'A uniform solid cylinder of mass M and radius R is given an initial angular velocity ω₀ and placed gently on a rough horizontal surface with coefficient of friction μ. Find the time t at which pure rolling begins without slipping.',
              options: [
                't = (R · ω₀) / (3 · μ · g)',
                't = (2 · R · ω₀) / (3 · μ · g)',
                't = (R · ω₀) / (2 · μ · g)',
                't = (3 · R · ω₀) / (4 · μ · g)'
              ],
              correctAnswer: 't = (R · ω₀) / (3 · μ · g)',
              detailedSolution: 'Torque about the instantaneous axis of contact or analyzing linear acceleration (a = μg) and angular deceleration (α = τ/I = (μMgR)/(0.5MR²) = 2μg/R). Pure rolling occurs when v = ωR => (μgt) = (ω₀ - 2μgt/R)R => μgt + 2μgt = Rω₀ => 3μgt = Rω₀ => t = Rω₀ / (3μg).'
            },
            {
              id: 'q-jee-2',
              questionNumber: 2,
              type: 'MCQ',
              marks: 3,
              negativeMarks: 1,
              difficulty: 'MEDIUM',
              topic: 'Calculus: Definite Integrals & Leibniz Rule',
              questionText: 'Evaluate the definite integral: I = ∫[0 to π/2] (sin³(x) / (sin³(x) + cos³(x))) dx.',
              options: [
                'π / 2',
                'π / 4',
                'π / 8',
                '1'
              ],
              correctAnswer: 'π / 4',
              detailedSolution: 'Using the King\'s Property ∫[a to b] f(x)dx = ∫[a to b] f(a+b-x)dx: Substituting x -> π/2 - x gives I = ∫[0 to π/2] (cos³(x) / (cos³(x) + sin³(x))) dx. Adding both expressions: 2I = ∫[0 to π/2] 1 dx = π/2 => I = π/4.'
            }
          ]
        },
        {
          title: 'Section 2: Numerical Value / Integer Type (+4 / 0)',
          weightageMarks: 40,
          questions: [
            {
              id: 'q-jee-3',
              questionNumber: 3,
              type: 'NUMERICAL',
              marks: 4,
              negativeMarks: 0,
              difficulty: 'COMPETITIVE_OLYMPIAD',
              topic: 'Electromagnetism: Faraday Law & Induced EMF',
              questionText: 'A circular conducting loop of radius r = 0.5 m and resistance R = 2 Ω is located in a spatially uniform magnetic field B(t) = 4t² - 2t + 1 (Tesla) perpendicular to the loop plane. Compute the induced electric current (in Amperes) at time t = 2 seconds.',
              correctAnswer: '5.50',
              detailedSolution: 'Magnetic Flux Φ = B(t) · Area = (4t² - 2t + 1) · πr² = π(0.5)²(4t² - 2t + 1) = 0.25π(4t² - 2t + 1). Induced EMF |ε| = dΦ/dt = 0.25π(8t - 2). At t = 2s, |ε| = 0.25π(14) = 3.5π ≈ 10.995 V. Current I = ε / R = 10.995 / 2 ≈ 5.50 A.'
            }
          ]
        }
      ],
      createdAt: new Date().toISOString()
    };

    const upscPaper: CustomMockPaper = {
      id: 'paper-upsc-prelims-2026',
      title: 'UPSC Civil Services Prelims 2026: General Studies Paper-I',
      examType: 'UPSC Prelims',
      subject: 'Polity, Environment & Economy',
      durationMinutes: 120,
      totalMarks: 200,
      totalQuestions: 3,
      sections: [
        {
          title: 'Section 1: Multi-Statement Analytical Questions (+2 / -0.66)',
          weightageMarks: 200,
          questions: [
            {
              id: 'q-upsc-1',
              questionNumber: 1,
              type: 'ASSERTION_REASON',
              marks: 2,
              negativeMarks: 0.66,
              difficulty: 'HARD',
              topic: 'Constitutional Bodies: Election Commission of India',
              questionText: 'Consider the following statements regarding the Election Commission of India:\n1. The Chief Election Commissioner and Election Commissioners have equal power and receive equal salaries.\n2. In case of difference of opinion, the matter is decided by the Commission according to the opinion of the majority.\n3. The Constitution has prescribed the qualifications of the members of the Election Commission.\n\nWhich of the statements given above is/are correct?',
              options: [
                '1 and 2 only',
                '2 and 3 only',
                '1 and 3 only',
                '1, 2 and 3'
              ],
              correctAnswer: '1 and 2 only',
              detailedSolution: 'Statement 1 & 2 are correct under Election Commission (Conditions of Service) Act. Statement 3 is incorrect because the Constitution of India has NOT prescribed legal, educational, administrative, or judicial qualifications for Election Commissioners.'
            }
          ]
        }
      ],
      createdAt: new Date().toISOString()
    };

    this.savedPapers.set(jeeAdvancedPaper.id, jeeAdvancedPaper);
    this.savedPapers.set(upscPaper.id, upscPaper);
  }

  public getAllPapers(): CustomMockPaper[] {
    return Array.from(this.savedPapers.values());
  }

  public getPaperById(id: string): CustomMockPaper | undefined {
    return this.savedPapers.get(id);
  }

  public generateMockPaper(dto: GenerateMockPaperDto): CustomMockPaper {
    const totalQ = dto.totalQuestions || 10;
    const paperId = `paper-gen-${Date.now()}`;
    const dist = dto.difficultyDistribution || { easyPct: 30, mediumPct: 50, hardPct: 20 };

    const topicsList = dto.topics && dto.topics.length > 0 ? dto.topics : ['General Core Concepts', 'Advanced Problem Solving', 'Conceptual Analysis'];

    const questions: MockPaperQuestion[] = [];

    for (let i = 1; i <= totalQ; i++) {
      let diff: ExamDifficulty = 'MEDIUM';
      const pct = (i / totalQ) * 100;
      if (pct <= dist.easyPct) diff = 'EASY';
      else if (pct <= dist.easyPct + dist.mediumPct) diff = 'MEDIUM';
      else diff = 'HARD';

      const topic = topicsList[(i - 1) % topicsList.length];
      const q = this.synthesizeQuestion(i, dto.examType, dto.subject, topic, diff);
      questions.push(q);
    }

    const marksPerQ = dto.examType.includes('UPSC') ? 2 : dto.examType.includes('NEET') ? 4 : 3;
    const totalMarks = totalQ * marksPerQ;

    const paper: CustomMockPaper = {
      id: paperId,
      title: `${dto.examType} High-Yield Custom Test Series: ${dto.subject}`,
      examType: dto.examType,
      subject: dto.subject,
      durationMinutes: Math.min(180, totalQ * 2),
      totalMarks,
      totalQuestions: totalQ,
      sections: [
        {
          title: `Section 1: Standard Objective Assessment (${totalQ} Questions | Total ${totalMarks} Marks)`,
          weightageMarks: totalMarks,
          questions
        }
      ],
      createdAt: new Date().toISOString()
    };

    this.savedPapers.set(paperId, paper);
    return paper;
  }

  private synthesizeQuestion(index: number, examType: string, subject: string, topic: string, difficulty: ExamDifficulty): MockPaperQuestion {
    const isMathOrPhysics = subject.toLowerCase().includes('physic') || subject.toLowerCase().includes('math') || subject.toLowerCase().includes('cs');

    if (isMathOrPhysics) {
      return {
        id: `gen-q-${index}`,
        questionNumber: index,
        type: 'MCQ',
        marks: 4,
        negativeMarks: 1,
        difficulty,
        topic,
        questionText: `[${topic}] In a state-of-the-art system governed by ${subject} constraints (Level: ${difficulty}), compute the steady-state equilibrium value when parameter k = ${index * 2 + 1}.`,
        options: [
          `Option A: E = (${index * 2 + 1} / 2) · π·ħ`,
          `Option B [Correct]: E = (${index * 2 + 1}² + 4) / (${index + 1})`,
          `Option C: E = ln(${index + 2}) / √(2π)`,
          `Option D: E = 0 (Vanishes identically)`
        ],
        correctAnswer: `Option B [Correct]: E = (${index * 2 + 1}² + 4) / (${index + 1})`,
        detailedSolution: `Step 1: Set up the differential balance equation for ${topic}. Step 2: Integrate over interval [0, ${index * 2}]. Step 3: Normalizing yields exact value (${index * 2 + 1}² + 4) / (${index + 1}).`
      };
    } else {
      return {
        id: `gen-q-${index}`,
        questionNumber: index,
        type: 'MCQ',
        marks: 2,
        negativeMarks: 0.66,
        difficulty,
        topic,
        questionText: `[${topic}] Regarding institutional principles and contemporary frameworks in ${subject} (${examType}):\nStatement 1: The designated authority holds sovereign discretionary jurisdictions under standard schedule provisions.\nStatement 2: Statutory reviews mandate periodic reporting every 5 calendar years.\n\nWhich of the statements given above is/are logically sound?`,
        options: [
          '1 only',
          '2 only',
          'Both 1 and 2',
          'Neither 1 nor 2'
        ],
        correctAnswer: 'Both 1 and 2',
        detailedSolution: `Both statements are corroborated by standard statutory interpretations in ${topic}. Judicial precedents validate statement 1, while regulatory statutes codify the 5-year cyclical review in statement 2.`
      };
    }
  }
}

export const customPaperService = new CustomPaperService();
