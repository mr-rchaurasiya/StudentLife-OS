import {
  LiveVoiceTutorSession,
  LiveVoiceTutorMessage,
  LiveVoiceTutorQueryDto
} from '@studentlife/shared';

class VoiceTutorService {
  private sessions: Map<string, LiveVoiceTutorSession> = new Map();

  constructor() {
    this.seedInitialSession();
  }

  private seedInitialSession() {
    const demoSession: LiveVoiceTutorSession = {
      sessionId: 'sess-voice-demo',
      subjectDomain: 'JEE Physics & Mechanics',
      topicTitle: 'Rotational Dynamics & Torque Derivations',
      language: 'HINGLISH',
      currentBoardStep: 2,
      boardWhiteboardNotes: [
        '1. Fundamental Relation: \\vec{\\tau} = \\vec{r} \\times \\vec{F} = I\\vec{\\alpha}',
        '2. Moment of Inertia for Rigid Disc: I = \\frac{1}{2}MR^2',
        '3. Rolling without slipping condition: a_{cm} = \\alpha R \\implies \\text{Pure Rolling Conservation}'
      ],
      isListening: false,
      isSpeaking: false,
      messages: [
        {
          id: 'msg-v-1',
          sender: 'AI_TUTOR',
          text: 'Namaste! Main hoon aapka AI Voice Tutor. Aaj hum Rotational Dynamics aur Rolling Motion ke concepts ko step-by-step samjhenge. Koi bhi doubt ho, directly boliye ya type kijiye!',
          audioDurationSeconds: 6,
          timestamp: '10:00 AM',
          latexFormulas: ['\\tau = I\\alpha', 'E_{total} = \\frac{1}{2}mv^2 + \\frac{1}{2}I\\omega^2'],
          suggestedFollowups: [
            'Explain Moment of Inertia of Hollow Cylinder',
            'Derive acceleration on inclined plane',
            'Hindi me explain kijiye'
          ],
          keyConceptSummary: 'Torque produces angular acceleration analogous to Force producing linear acceleration in Newtonian mechanics.'
        }
      ]
    };

    this.sessions.set(demoSession.sessionId, demoSession);
  }

  public getSession(sessionId: string): LiveVoiceTutorSession {
    if (!this.sessions.has(sessionId)) {
      const newSession: LiveVoiceTutorSession = {
        sessionId,
        subjectDomain: 'General Academic Science',
        topicTitle: 'Interactive Concept Mastery',
        language: 'HINGLISH',
        currentBoardStep: 1,
        boardWhiteboardNotes: ['Whiteboard initialized. Ask any scientific derivation!'],
        isListening: false,
        isSpeaking: false,
        messages: [
          {
            id: `msg-${Date.now()}`,
            sender: 'AI_TUTOR',
            text: 'Hello! I am ready to guide your study block. Ask any question in Hindi, English, or Hinglish.',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            latexFormulas: []
          }
        ]
      };
      this.sessions.set(sessionId, newSession);
    }
    return this.sessions.get(sessionId)!;
  }

  public askVoiceTutor(dto: LiveVoiceTutorQueryDto): LiveVoiceTutorSession {
    const session = this.getSession(dto.sessionId);
    session.language = dto.language;
    session.subjectDomain = dto.subjectDomain || session.subjectDomain;

    // Record student voice query
    const studentMsg: LiveVoiceTutorMessage = {
      id: `msg-stu-${Date.now()}`,
      sender: 'STUDENT',
      text: dto.studentSpokenText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    session.messages.push(studentMsg);

    // AI Synthesizer Logic
    const prompt = dto.studentSpokenText.toLowerCase();
    let aiResponseText = '';
    let latexList: string[] = [];
    let whiteboardStep = '';

    if (prompt.includes('moment of inertia') || prompt.includes('disc') || prompt.includes('ring')) {
      aiResponseText = dto.language === 'HI'
        ? 'जड़त्व आघूर्ण (Moment of Inertia) घूर्णन गति में द्रव्यमान का कार्य करता है। डिस्क के केंद्र से गुजरने वाले अक्ष के परितः I = (1/2)MR² होता है।'
        : dto.language === 'HINGLISH'
        ? 'Moment of Inertia rotational motion me mass ka analogue hai! Kisi uniform disc ke central perpendicular axis ke about I = (1/2)MR^2 hota hai, jabki thin ring ke liye I = MR^2 hota hai.'
        : 'The Moment of Inertia measures the resistance of a body to rotational acceleration. For a uniform solid disc through its center, I = 1/2 MR^2.';
      latexList = ['I_{disc} = \\frac{1}{2}MR^2', 'I_{ring} = MR^2', 'I_{sphere} = \\frac{2}{5}MR^2'];
      whiteboardStep = `Step ${session.boardWhiteboardNotes.length + 1}: Calculated I_{disc} = 1/2 MR^2 with Parallel Axis Theorem I = I_{cm} + Md^2`;
    } else if (prompt.includes('algorithm') || prompt.includes('dijkstra') || prompt.includes('dp') || prompt.includes('time complexity')) {
      aiResponseText = dto.language === 'HINGLISH'
        ? 'Dijkstra algorithm greedy paradigm use karta hai shortest path find karne ke liye non-negative weighted graphs me. Iski time complexity priority queue ke sath O((V + E) log V) hoti hai.'
        : 'Dijkstra algorithm computes the shortest path tree from a single source node using a min-priority queue with time complexity O((V + E) log V).';
      latexList = ['O((V + E) \\log V)', 'd[v] = \\min(d[v], d[u] + w(u, v))'];
      whiteboardStep = `Step ${session.boardWhiteboardNotes.length + 1}: Dijkstra Relaxation step d[v] = min(d[v], d[u] + w(u,v))`;
    } else if (prompt.includes('article') || prompt.includes('constitution') || prompt.includes('polity') || prompt.includes('upsc')) {
      aiResponseText = dto.language === 'HINGLISH'
        ? 'Bhartiya Samvidhan ke Article 32 ko Dr. B.R. Ambedkar ne "Heart and Soul of the Constitution" kaha tha. Iske antargat Supreme Court 5 tarah ke Writs (Habeas Corpus, Mandamus, Prohibition, Certiorari, Quo-Warranto) issue kar sakta hai.'
        : 'Article 32 guarantees the Right to Constitutional Remedies, empowering the Supreme Court to issue 5 types of Prerogative Writs for the enforcement of Fundamental Rights.';
      latexList = ['\\text{Article 32} \\implies \\text{Right to Constitutional Remedies}'];
      whiteboardStep = `Step ${session.boardWhiteboardNotes.length + 1}: Writs Analysis: Habeas Corpus, Mandamus, Quo Warranto, Certiorari, Prohibition`;
    } else {
      aiResponseText = dto.language === 'HINGLISH'
        ? `Aapne poocha: "${dto.studentSpokenText}". Yeh topic examination ke point of view se kaafi crucial hai. Iske core principles ko break down karke dekhein toh har step logically connect hota hai!`
        : `Analyzing your query on "${dto.studentSpokenText}". This core concept breaks down systematically into foundational equations and applied derivation steps.`;
      latexList = ['\\nabla \\cdot \\vec{E} = \\frac{\\rho}{\\varepsilon_0}', '\\Delta S \\ge 0'];
      whiteboardStep = `Step ${session.boardWhiteboardNotes.length + 1}: Derived foundational principles for "${dto.studentSpokenText.slice(0, 40)}..."`;
    }

    session.boardWhiteboardNotes.push(whiteboardStep);
    session.currentBoardStep = session.boardWhiteboardNotes.length;

    const aiMsg: LiveVoiceTutorMessage = {
      id: `msg-ai-${Date.now()}`,
      sender: 'AI_TUTOR',
      text: aiResponseText,
      audioDurationSeconds: Math.ceil(aiResponseText.length / 15),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      latexFormulas: latexList,
      suggestedFollowups: [
        'Can you show a numerical example?',
        'How will this be asked in exam PYQs?',
        'Next step derivation'
      ],
      keyConceptSummary: whiteboardStep
    };

    session.messages.push(aiMsg);
    return session;
  }
}

export const voiceTutorService = new VoiceTutorService();
