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
    const defaultList: AiPodcast[] = [
      {
        id: 'podcast-quantum-physics',
        title: 'Quantum Wavefunctions & The Reality of Schrödinger\'s Cat',
        topic: 'Quantum Mechanics & Modern Physics',
        language: 'en-US',
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
      },
      {
        id: 'podcast-polity-hinglish',
        title: 'संविधान की प्रस्तावना और मौलिक अधिकार (Preamble & Fundamental Rights)',
        topic: 'Indian Polity & UPSC GS-II',
        language: 'hinglish',
        sourceType: 'SYLLABUS',
        totalDurationSeconds: 210,
        host1: {
          id: 'host-vikram',
          name: 'Dr. Vikram Sir',
          avatar: '👨‍💼',
          role: 'UPSC Polity Senior Mentor',
          voiceGender: 'male',
          personality: 'Constitutional Law Scholar'
        },
        host2: {
          id: 'host-ananya',
          name: 'Ananya Ma\'am',
          avatar: '👩‍🏫',
          role: 'Prelims Elimination Specialist',
          voiceGender: 'female',
          personality: 'Case Laws & Articles Mnemonic Guide'
        },
        summaryKeyTakeaways: [
          'Kesavananda Bharati Case (1973) ne Basic Structure Doctrine establish kiya.',
          'Article 32 (Constitutional Remedies) ko Dr. Ambedkar ne Heart and Soul of Constitution kaha.',
          'Preamble Constitution ka integral part hai aur 42nd Amendment se 3 naye words add huye the.'
        ],
        dialogueTurns: [
          {
            id: 'turn-1',
            speaker: 'host1',
            text: 'Namaste aspirants! Aaj ke podcast me hum samjhenge Preamble aur Fundamental Rights ke core concepts ko jo UPSC Prelims aur Mains me bar-bar puche jaate hain.',
            durationEstimateSeconds: 8,
            keyConcepts: ['Preamble Overview', 'UPSC High Yield']
          },
          {
            id: 'turn-2',
            speaker: 'host2',
            text: 'Sir, sabse bada confusion students ko hota hai ki kya Preamble amend ho sakta hai ya nahi? Kesavananda Bharati Case 1973 ne clear kar diya tha ki Preamble amend ho sakta hai, lekin Basic Structure violate nahi hona chahiye.',
            durationEstimateSeconds: 10,
            keyConcepts: ['Kesavananda Bharati Case', 'Basic Structure Doctrine']
          },
          {
            id: 'turn-3',
            speaker: 'host1',
            text: 'Bilkul sahi Ananya! 42nd Constitutional Amendment Act 1976 ke dwara Preamble me 3 naye words add kiye gaye the: Socialist, Secular, aur Integrity.',
            durationEstimateSeconds: 8,
            keyConcepts: ['42nd Amendment 1976', 'Socialist Secular Integrity']
          },
          {
            id: 'turn-4',
            speaker: 'host2',
            text: 'Aur Article 32 jo Writs (Habeas Corpus, Mandamus, Prohibition, Certiorari, Quo-Warranto) deta hai, use Dr. Ambedkar ne Constitution ka Heart and Soul kaha tha.',
            durationEstimateSeconds: 9,
            keyConcepts: ['Article 32', '5 Constitutional Writs']
          }
        ],
        createdAt: new Date(Date.now() - 3600000).toISOString()
      },
      {
        id: 'podcast-physics-hindi',
        title: 'न्यूटन के गति के नियम और संवेग संरक्षण (Laws of Motion)',
        topic: 'Physics & Mechanics (भौतिक विज्ञान)',
        language: 'hi-IN',
        sourceType: 'TEXTBOOK_CHAPTER',
        totalDurationSeconds: 190,
        host1: {
          id: 'host-rajesh',
          name: 'प्रो. राजेश शर्मा',
          avatar: '👨‍🔬',
          role: 'वरिष्ठ भौतिक विज्ञानी',
          voiceGender: 'male',
          personality: 'सैद्धांतिक भौतिकी विशेषज्ञ'
        },
        host2: {
          id: 'host-kavita',
          name: 'डॉ. कविता वर्मा',
          avatar: '👩‍🏫',
          role: 'संख्यात्मक समस्या विशेषज्ञ',
          voiceGender: 'female',
          personality: 'सरल उदाहरण और ट्रिक्स'
        },
        summaryKeyTakeaways: [
          'प्रथम नियम जड़त्व (Inertia) को परिभाषित करता है।',
          'द्वितीय नियम बल F = dp/dt = ma का गणितीय सूत्र देता है।',
          'तृतीय नियम क्रिया-प्रतिक्रिया (Action-Reaction) हमेशा दो अलग-अलग वस्तुओं पर कार्य करता है।'
        ],
        dialogueTurns: [
          {
            id: 'turn-1',
            speaker: 'host1',
            text: 'नमस्कार विद्यार्थियों! आज के व्याख्यान में हम न्यूटन के गति के तीनों नियमों और संवेग संरक्षण के मूल सिद्धांतों को गहराई से समझेंगे।',
            durationEstimateSeconds: 8,
            keyConcepts: ['न्यूटन के नियम', 'यांत्रिकी परिचय']
          },
          {
            id: 'turn-2',
            speaker: 'host2',
            text: 'जी सर! विद्यार्थी अक्सर यह भूल जाते हैं कि क्रिया और प्रतिक्रिया बल हमेशा दो अलग-अलग पिंडों पर एक ही समय में लगते हैं, इसलिए वे एक-दूसरे को निरस्त नहीं करते।',
            durationEstimateSeconds: 9,
            keyConcepts: ['तृतीय नियम भ्रान्ति', 'क्रिया-प्रतिक्रिया']
          },
          {
            id: 'turn-3',
            speaker: 'host1',
            text: 'अति उत्तम बिंदु! और संवेग संरक्षण का नियम कहता है कि यदि बाह्य बल शून्य हो, तो निकाय का कुल संवेग सदैव संरक्षित रहता है।',
            durationEstimateSeconds: 8,
            keyConcepts: ['संवेग संरक्षण', 'F_ext = 0']
          }
        ],
        createdAt: new Date(Date.now() - 7200000).toISOString()
      },
      {
        id: 'podcast-neural-networks-es',
        title: 'Redes Neuronales Artificiales y Aprendizaje Profundo',
        topic: 'Inteligencia Artificial y Deep Learning',
        language: 'es-ES',
        sourceType: 'TEXTBOOK_CHAPTER',
        totalDurationSeconds: 170,
        host1: {
          id: 'host-carlos',
          name: 'Dr. Carlos Mendoza',
          avatar: '👨‍💻',
          role: 'Investigador de IA',
          voiceGender: 'male',
          personality: 'Especialista en Algoritmos de Deep Learning'
        },
        host2: {
          id: 'host-elena',
          name: 'Prof. Elena Ramos',
          avatar: '👩‍🔬',
          role: 'Especialista en Datos',
          voiceGender: 'female',
          personality: 'Enfoque práctico y arquitecturas neuronales'
        },
        summaryKeyTakeaways: [
          'La retropropagación (Backpropagation) utiliza la regla de la cadena para calcular gradientes.',
          'Las funciones de activación como ReLU introducen no linealidades esenciales.',
          'El descenso de gradiente estocástico (SGD) optimiza la función de pérdida.'
        ],
        dialogueTurns: [
          {
            id: 'turn-1',
            speaker: 'host1',
            text: '¡Bienvenidos al podcast de Inteligencia Artificial! Hoy exploramos cómo aprenden las redes neuronales profundas mediante la optimización de pesos.',
            durationEstimateSeconds: 8,
            keyConcepts: ['Redes Neuronales', 'Introducción IA']
          },
          {
            id: 'turn-2',
            speaker: 'host2',
            text: '¡Exacto Carlos! El núcleo del aprendizaje profundo reside en el algoritmo de backpropagation, que calcula el gradiente del error respecto a cada peso.',
            durationEstimateSeconds: 9,
            keyConcepts: ['Backpropagation', 'Regla de la Cadena']
          }
        ],
        createdAt: new Date(Date.now() - 10800000).toISOString()
      },
      {
        id: 'podcast-thermo-fr',
        title: 'Thermodynamique et Entropie de l\'Univers',
        topic: 'Physique & Thermodynamique',
        language: 'fr-FR',
        sourceType: 'TEXTBOOK_CHAPTER',
        totalDurationSeconds: 160,
        host1: {
          id: 'host-jean',
          name: 'Dr. Jean-Pierre Dubois',
          avatar: '👨‍🏫',
          role: 'Physicien Théoricien',
          voiceGender: 'male',
          personality: 'Expert en thermodynamique statistique'
        },
        host2: {
          id: 'host-sophie',
          name: 'Prof. Sophie Laurent',
          avatar: '👩‍🔬',
          role: 'Spécialiste de l\'Énergie',
          voiceGender: 'female',
          personality: 'Pédagogue et stratège d\'examen'
        },
        summaryKeyTakeaways: [
          'Le second principe stipule que l\'entropie d\'un système isolé ne peut que croître.',
          'Le cycle de Carnot définit le rendement maximal théorique.',
          'L\'entropie statistique de Boltzmann relie l\'état macroscopique aux micro-états: S = k ln W.'
        ],
        dialogueTurns: [
          {
            id: 'turn-1',
            speaker: 'host1',
            text: 'Bienvenue à tous! Aujourd\'hui, nous explorons le concept fascinant de l\'entropie et la flèche du temps thermodynamique.',
            durationEstimateSeconds: 8,
            keyConcepts: ['Second Principe', 'Entropie']
          },
          {
            id: 'turn-2',
            speaker: 'host2',
            text: 'Absolument Jean! Pour les concours, retenez bien la formule de Boltzmann: S = k ln W, qui relie le désordre microscopique aux grandeurs mesurables.',
            durationEstimateSeconds: 9,
            keyConcepts: ['Formule de Boltzmann', 'Rendement de Carnot']
          }
        ],
        createdAt: new Date(Date.now() - 14400000).toISOString()
      }
    ];

    for (const p of defaultList) {
      this.podcasts.set(p.id, p);
    }
  }

  public getAllPodcasts(): AiPodcast[] {
    return Array.from(this.podcasts.values());
  }

  public getPodcastById(id: string): AiPodcast | undefined {
    return this.podcasts.get(id);
  }

  public generatePodcast(dto: GeneratePodcastDto): AiPodcast {
    const topic = dto.topic || 'General Core Study Topic';
    const lang = dto.language || 'en-US';
    const id = `podcast-${Date.now()}`;

    let turns: PodcastDialogueTurn[];
    let takeaways: string[];
    let title: string;

    if (lang === 'hinglish') {
      title = `AI Masterclass Podcast: ${topic} (Hinglish)`;
      turns = [
        {
          id: 'turn-1',
          speaker: 'host1',
          text: `Welcome students! Aaj hum ${topic} ke sabse important exam concepts ko break down karenge.`,
          durationEstimateSeconds: 7,
          keyConcepts: ['Topic Overview', 'Concept Foundations']
        },
        {
          id: 'turn-2',
          speaker: 'host2',
          text: `Haan Alex! Previous year papers dekhein to ${topic} se direct questions aate hain. Iske primary formulas aur exceptions ko yaad rakhna bahut zaroori hai.`,
          durationEstimateSeconds: 8,
          keyConcepts: ['Exam Weightage', 'Formula Application']
        },
        {
          id: 'turn-3',
          speaker: 'host1',
          text: `Ek golden tip: numerical solve karte waqt always units aur boundary conditions check karein.`,
          durationEstimateSeconds: 7,
          keyConcepts: ['Numerical Strategy', 'Boundary Limits']
        },
        {
          id: 'turn-4',
          speaker: 'host2',
          text: `Aur daily revision ke liye 1-page quick formula sheet banayein taaki exam day par zero confusion ho!`,
          durationEstimateSeconds: 7,
          keyConcepts: ['Revision Technique', 'Spaced Recall']
        }
      ];
      takeaways = [
        `${topic} ke core first-principles aur standard exceptions ko master karein.`,
        'Numerical questions me boundary conditions aur SI units verify karein.',
        'Spaced repetition aur 1-page formula summary se retention 3x badhayein.'
      ];
    } else if (lang === 'hi-IN') {
      title = `AI ऑडियो पॉडकास्ट: ${topic} (हिन्दी)`;
      turns = [
        {
          id: 'turn-1',
          speaker: 'host1',
          text: `नमस्कार विद्यार्थियों! आज के इस विशेष सत्र में हम ${topic} के प्रमुख सिद्धांतों का गहन विश्लेषण करेंगे।`,
          durationEstimateSeconds: 8,
          keyConcepts: ['विषय परिचय', 'मूल सिद्धांत']
        },
        {
          id: 'turn-2',
          speaker: 'host2',
          text: `जी बिल्कुल! प्रतियोगी परीक्षाओं की दृष्टि से ${topic} के मुख्य सूत्र और व्यावहारिक अनुप्रयोग अत्यंत महत्वपूर्ण हैं।`,
          durationEstimateSeconds: 8,
          keyConcepts: ['परीक्षा रणनीति', 'सूत्र अनुप्रयोग']
        },
        {
          id: 'turn-3',
          speaker: 'host1',
          text: `प्रश्नों को हल करते समय सीमांत शर्तों (Boundary Conditions) का ध्यान रखें और चरणबद्ध गणना करें।`,
          durationEstimateSeconds: 8,
          keyConcepts: ['चरणबद्ध समाधान', 'सटीकता']
        }
      ];
      takeaways = [
        `${topic} के सैद्धांतिक आधार और सूत्रों को समझें।`,
        'अभ्यास प्रश्नों में इकाइयों और सीमाओं का ध्यान रखें।',
        'नियमित अंतराल पर मुख्य बिंदुओं का पुनरावलोकन करें।'
      ];
    } else if (lang === 'es-ES') {
      title = `Podcast de Estudio IA: ${topic} (Español)`;
      turns = [
        {
          id: 'turn-1',
          speaker: 'host1',
          text: `¡Bienvenidos estudiantes! Hoy desglosamos los conceptos clave de ${topic} para dominar tus exámenes.`,
          durationEstimateSeconds: 7,
          keyConcepts: ['Resumen del Tema', 'Fundamentos']
        },
        {
          id: 'turn-2',
          speaker: 'host2',
          text: `¡Excelente! Para ${topic}, es crucial comprender la derivación matemática y las aplicaciones prácticas.`,
          durationEstimateSeconds: 8,
          keyConcepts: ['Estrategia de Examen', 'Derivación']
        }
      ];
      takeaways = [
        `Domina los fundamentos esenciales de ${topic}.`,
        'Verifica siempre las unidades y condiciones de frontera.',
        'Aplica la técnica de repetición espaciada.'
      ];
    } else if (lang === 'fr-FR') {
      title = `Masterclass Audio IA: ${topic} (Français)`;
      turns = [
        {
          id: 'turn-1',
          speaker: 'host1',
          text: `Bienvenue à tous! Aujourd'hui, nous décomposons les principes fondamentaux de ${topic}.`,
          durationEstimateSeconds: 7,
          keyConcepts: ['Vue d\'ensemble', 'Principes Fondamentaux']
        },
        {
          id: 'turn-2',
          speaker: 'host2',
          text: `Tout à fait! Pour réussir vos épreuves sur ${topic}, concentrez-vous sur les relations directes et les formules clés.`,
          durationEstimateSeconds: 8,
          keyConcepts: ['Stratégie d\'Examen', 'Formules Clés']
        }
      ];
      takeaways = [
        `Comprendre les bases théoriques de ${topic}.`,
        'Analyser les conditions aux limites dans les calculs.',
        'Mémoriser les formules avec des fiches de synthèse.'
      ];
    } else {
      title = `AI Masterclass Podcast: ${topic}`;
      turns = [
        {
          id: 'turn-1',
          speaker: 'host1',
          text: `Welcome students to today's audio breakdown on: ${topic}. Let's break down the essential foundations you need to master this for your exams.`,
          durationEstimateSeconds: 8,
          keyConcepts: ['Topic Overview', 'Core Foundations']
        },
        {
          id: 'turn-2',
          speaker: 'host2',
          text: `Absolutely, Alex! Questions from ${topic} test your conceptual depth rather than rote memorization. The key is understanding how the primary variables interact.`,
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
      takeaways = [
        `Master the first-principles foundation of ${topic}.`,
        'Focus on boundary limits and parameter scaling.',
        'Pair formula derivation with active spaced repetition recall.'
      ];
    }

    const newPodcast: AiPodcast = {
      id,
      title,
      topic,
      language: lang,
      sourceType: dto.sourceText ? 'NOTES' : 'SYLLABUS',
      totalDurationSeconds: turns.length * 28,
      host1: this.host1,
      host2: this.host2,
      summaryKeyTakeaways: takeaways,
      dialogueTurns: turns,
      createdAt: new Date().toISOString()
    };

    this.podcasts.set(id, newPodcast);
    return newPodcast;
  }
}

export const aiPodcastService = new AiPodcastService();
