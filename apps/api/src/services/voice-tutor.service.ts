import {
  VoiceTutorMessage,
  OralQuizDrill,
  VoiceTutorQueryDto,
  EvaluateOralAnswerDto
} from '@studentlife/shared';

class VoiceTutorService {
  private drills: OralQuizDrill[] = [
    {
      id: 'drill-1',
      subject: 'Algorithms & Data Structures',
      topic: 'Dynamic Programming & Memoization',
      question: 'In your own words, explain the difference between Top-Down Memoization and Bottom-Up Tabulation in Dynamic Programming.',
      expectedKeyPoints: ['recursion', 'cache', 'subproblems', 'iterative', 'base case', 'table'],
      hint: 'Think about call stack vs iterative array filling.',
      fullExplanation: 'Top-Down uses recursion with a lookup cache (memoization) solving subproblems on demand. Bottom-Up avoids call stack overhead by iteratively filling a DP table starting strictly from the base cases.'
    },
    {
      id: 'drill-2',
      subject: 'Physics & Calculus',
      topic: 'Rotational Motion & Inertia',
      question: 'State the Parallel Axis Theorem and specify when it is mathematically valid to apply.',
      expectedKeyPoints: ['center of mass', 'distance squared', 'mass', 'parallel axis', 'i = icm + md^2'],
      hint: 'The reference axis must pass through the Center of Mass.',
      fullExplanation: 'The Parallel Axis Theorem states that Moment of Inertia about any axis equals Moment of Inertia about a parallel axis passing through the Center of Mass plus M times d squared (I = I_cm + M*d^2).'
    },
    {
      id: 'drill-3',
      subject: 'Indian Polity & Constitution',
      topic: 'Basic Structure Doctrine',
      question: 'Which landmark Supreme Court judgment introduced the Basic Structure Doctrine, and what is its core significance?',
      expectedKeyPoints: ['kesavananda bharati', '1973', 'article 368', 'amendment power', 'fundamental features'],
      hint: 'Decided in 1973 by the largest 13-judge constitutional bench in Indian history.',
      fullExplanation: 'Established in the 1973 Kesavananda Bharati case, it ruled that while Parliament has wide power to amend the Constitution under Article 368, it cannot alter or destroy its Basic Structure (like democracy, rule of law, federalism).'
    }
  ];

  public async respondToVoice(dto: VoiceTutorQueryDto): Promise<VoiceTutorMessage> {
    const q = dto.transcript.toLowerCase().trim();
    const persona = dto.persona || 'Socratic Tutor';
    const isBilingual = dto.languageMode === 'bilingual' || dto.languageMode === 'hi-IN';

    let answerText = '';
    let category: 'EXPLANATION' | 'ORAL_QUIZ_PROMPT' = 'EXPLANATION';
    let latexSnippet = '';
    let followUp = '';

    if (q.includes('integration') || q.includes('calculus') || q.includes('derivative') || q.includes('math')) {
      if (isBilingual) {
        answerText = 'Integration basically function ke under area calculate karne ka tool hai. Definite integral me hum fundamental theorem use karte hain jisme upper limit minus lower limit evaluate hota hai.';
      } else {
        answerText = 'Integration fundamentally accumulates infinitesimal quantities to calculate area under curves. Using the Fundamental Theorem of Calculus, the definite integral of f(x) from a to b equals F(b) minus F(a).';
      }
      latexSnippet = '\\int_{a}^{b} f(x) \\, dx = F(b) - F(a)';
      followUp = 'Would you like to practice King\'s property of definite integrals orally?';
    } else if (q.includes('dp') || q.includes('knapsack') || q.includes('algorithm') || q.includes('complexity')) {
      if (isBilingual) {
        answerText = '0/1 Knapsack problem me har item ke do choices hote hain: include ya exclude. Time complexity O(N into W) hoti hai using 2D DP table.';
      } else {
        answerText = 'In 0/1 Knapsack, for each item at index i with capacity w, you either skip it or take it if weight fits. The recurrence is: DP[i][w] = max(DP[i-1][w], val[i] + DP[i-1][w - wt[i]]). Time complexity is O(N * W).';
      }
      latexSnippet = 'DP[i][w] = \\max(DP[i-1][w], \\, v_i + DP[i-1][w - w_i])';
      followUp = 'Shall we do a quick 30-second oral drill on Space Optimization?';
    } else if (q.includes('upsc') || q.includes('polity') || q.includes('fundamental rights') || q.includes('article')) {
      if (isBilingual) {
        answerText = 'Fundamental Rights Constitution ke Part 3 me Article 12 se 35 tak defined hain. Inhe Justiciable rights kaha jata hai jise Article 32 ke through Supreme Court direct protect karta hai.';
      } else {
        answerText = 'Fundamental Rights are enshrined in Part III (Articles 12-35) of the Indian Constitution. They are justiciable and enforceable by the Supreme Court directly under Article 32, which Dr. Ambedkar termed the "Heart and Soul of the Constitution".';
      }
      followUp = 'Do you want to verbally recite the 6 Fundamental Rights categories?';
    } else if (q.includes('quiz') || q.includes('drill') || q.includes('test me')) {
      const randomDrill = this.drills[Math.floor(Math.random() * this.drills.length)];
      category = 'ORAL_QUIZ_PROMPT';
      answerText = `Oral Flashcard Challenge! ${randomDrill.question}`;
      followUp = 'Speak your verbal answer clearly into the microphone.';
    } else {
      // General Socratic response
      if (persona === 'Rapid Exam Driller') {
        answerText = `High-yield focus for ${dto.currentSubject || 'your target exam'}: Always break the concept into core formula, assumptions, and edge cases. Speak any specific theorem to test your active recall!`;
      } else {
        answerText = `Great question. When studying ${dto.currentSubject || 'this topic'}, the key intuition is understanding the first principle mechanism. What aspect would you like to explore deeper?`;
      }
      followUp = 'Ask me to explain any theorem, derivation, or say "Quiz me" for an oral drill.';
    }

    return {
      id: `vt-${Date.now()}`,
      role: 'assistant',
      text: answerText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      category,
      audioDurationSeconds: Math.ceil(answerText.split(' ').length / 2.5),
      latexSnippet,
      followUpSuggestion: followUp
    };
  }

  public getOralDrills(): OralQuizDrill[] {
    return this.drills;
  }

  public evaluateOralAnswer(dto: EvaluateOralAnswerDto): { scorePercent: number; matchedKeywords: string[]; feedback: string; xpEarned: number } {
    const drill = this.drills.find((d) => d.id === dto.drillId) || this.drills[0];
    const spokenLower = dto.spokenAnswer.toLowerCase();

    const matched = drill.expectedKeyPoints.filter((kp) => spokenLower.includes(kp.toLowerCase()));
    const ratio = matched.length / drill.expectedKeyPoints.length;
    const scorePercent = Math.min(100, Math.round(ratio * 100) + (spokenLower.length > 40 ? 15 : 0));

    let feedback = '';
    if (scorePercent >= 80) {
      feedback = 'Outstanding verbal mastery! You hit all primary concepts with precise articulation.';
    } else if (scorePercent >= 50) {
      feedback = 'Good attempt! You captured the main intuition. Try including more formal terminology.';
    } else {
      feedback = `Keep practicing! Remember the core elements: ${drill.expectedKeyPoints.join(', ')}.`;
    }

    return {
      scorePercent,
      matchedKeywords: matched,
      feedback,
      xpEarned: scorePercent >= 75 ? 35 : 15
    };
  }
}

export const voiceTutorService = new VoiceTutorService();
