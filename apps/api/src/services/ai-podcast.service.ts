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
        mode: 'DEEP_DIVE',
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
        id: 'podcast-qa-biology-hinglish',
        title: '❓ Viva & Exam Q&A Drill: Cell Biology & Genetics',
        topic: 'Biology & Genetics (Viva / Question-Answer)',
        language: 'hinglish',
        mode: 'QA_INTERVIEW',
        sourceType: 'NOTES',
        totalDurationSeconds: 200,
        host1: {
          id: 'host-vikram',
          name: 'Dr. Vikram Sir (Examiner)',
          avatar: '👨‍🏫',
          role: 'Viva Examiner & Question Host',
          voiceGender: 'male',
          personality: 'Direct, sharp, asks high-probability viva & competitive exam questions.'
        },
        host2: {
          id: 'host-ananya',
          name: 'Ananya Ma\'am (Answer Specialist)',
          avatar: '👩‍🔬',
          role: 'Concepts & Solution Strategist',
          voiceGender: 'female',
          personality: 'Crisp, structured step-by-step model answers with exam keywords.'
        },
        summaryKeyTakeaways: [
          'Question 1: Mitosis produces 2 identical diploid cells, Meiosis produces 4 haploid gametes with crossing over.',
          'Question 2: Okazaki fragments are synthesized on the lagging strand (5\' to 3\') and sealed by DNA Ligase.',
          'Question 3: Mitochondria & Chloroplast have their own 70S ribosomes (Endosymbiotic theory).'
        ],
        dialogueTurns: [
          {
            id: 'turn-1',
            speaker: 'host1',
            text: 'Question 1: Ananya, viva me examiner sabse pehle puchte hain: Mitosis aur Meiosis ke beech ka fundamental difference kya hai?',
            durationEstimateSeconds: 8,
            keyConcepts: ['Question 1', 'Mitosis vs Meiosis']
          },
          {
            id: 'turn-2',
            speaker: 'host2',
            text: 'Answer 1: Sir, Mitosis me ek cell 2 identical diploid daughter cells banata hai body growth ke liye. Jabki Meiosis me 4 genetically unique haploid gametes bante hain crossing-over ke karan! Exam tip: Prophase-1 ka Pachytene stage yaad rakhein jahan recombination hota hai.',
            durationEstimateSeconds: 12,
            keyConcepts: ['Model Answer', 'Pachytene Recombination']
          },
          {
            id: 'turn-3',
            speaker: 'host1',
            text: 'Question 2: DNA Replication ke dauran Okazaki fragments kis strand par bante hain aur kyun?',
            durationEstimateSeconds: 8,
            keyConcepts: ['Question 2', 'Okazaki Fragments']
          },
          {
            id: 'turn-4',
            speaker: 'host2',
            text: 'Answer 2: Okazaki fragments Lagging Strand par bante hain! Kyunki DNA Polymerase hamesha 5-prime to 3-prime direction me synthesize karta hai, isliye replication fork open hone par lagging strand discontinuous pieces me banta hai jise DNA Ligase seal karta hai.',
            durationEstimateSeconds: 12,
            keyConcepts: ['Model Answer', 'Lagging Strand & DNA Ligase']
          },
          {
            id: 'turn-5',
            speaker: 'host1',
            text: 'Question 3: Endosymbiotic theory ke according mitochondria aur chloroplasts ke paas kaunsa ribosome hota hai?',
            durationEstimateSeconds: 7,
            keyConcepts: ['Question 3', 'Organelle Ribosomes']
          },
          {
            id: 'turn-6',
            speaker: 'host2',
            text: 'Answer 3: Inke paas prokaryotic 70S ribosomes aur circular DNA hota hai, jo prove karta hai ki ye ancient bacterial symbionts the!',
            durationEstimateSeconds: 9,
            keyConcepts: ['Model Answer', '70S Ribosome & Circular DNA']
          }
        ],
        createdAt: new Date(Date.now() - 3600000).toISOString()
      },
      {
        id: 'podcast-reader-chemistry-hi',
        title: '📖 अविरल व्याख्यान पाठ (Continuous Notes Reader): कार्बनिक रसायन एवं IUPAC नामकरण',
        topic: 'Organic Chemistry (सीधा वाचन पाठ / As-Is Audio Lecture)',
        language: 'hi-IN',
        mode: 'CONTINUOUS_READER',
        sourceType: 'NOTES',
        totalDurationSeconds: 240,
        host1: {
          id: 'host-rajesh',
          name: 'प्रो. राजेश शर्मा (Audio Narrator)',
          avatar: '🎙️',
          role: 'Continuous Lecture Narrator',
          voiceGender: 'male',
          personality: 'स्पष्ट, अविरल, बिना किसी रुकावट के नोट्स का सीधा धाराप्रवाह वाचन।'
        },
        host2: {
          id: 'host-kavita',
          name: 'डॉ. कविता वर्मा (Co-Narrator)',
          avatar: '📖',
          role: 'Section Narrator',
          voiceGender: 'female',
          personality: 'खंड-दर-खंड सारांश वाचन।'
        },
        summaryKeyTakeaways: [
          'खंड 1: कार्बन की चतुःसंयोजकता एवं श्रृंखलन (Catenation) गुण।',
          'खंड 2: संतृप्त एवं असंतृप्त हाइड्रोकार्बन का विभाजन।',
          'खंड 3: IUPAC नामकरण में जनक श्रृंखला का चयन एवं क्रियात्मक समूह को प्राथमिकता।'
        ],
        dialogueTurns: [
          {
            id: 'turn-1',
            speaker: 'host1',
            text: 'अध्याय एक: कार्बनिक रसायन का परिचय। कार्बन परमाणु क्रमांक छह वाला एक अधातु है जिसकी संयोजकता चार होती है। अपने चतुःसंयोजी स्वभाव और श्रृंखलन के अद्वितीय गुण के कारण यह लाखों स्थिर सहसंयोजक यौगिकों का निर्माण करने में सक्षम है।',
            durationEstimateSeconds: 12,
            keyConcepts: ['खंड 1', 'कार्बन चतुःसंयोजकता']
          },
          {
            id: 'turn-2',
            speaker: 'host1',
            text: 'अध्याय दो: हाइड्रोकार्बन का वर्गीकरण। वे कार्बनिक यौगिक जो केवल कार्बन और हाइड्रोजन से बने होते हैं, हाइड्रोकार्बन कहलाते हैं। इन्हें दो मुख्य श्रेणियों में विभाजित किया जाता है: प्रथम, संतृप्त हाइड्रोकार्बन जिनमें केवल एकल आबंध उपस्थित होते हैं तथा जिनका सामान्य सूत्र C n H 2n+2 है। द्वितीय, असंतृप्त हाइड्रोकार्बन जिनमें द्वि-आबंध अथवा त्रि-आबंध होते हैं।',
            durationEstimateSeconds: 14,
            keyConcepts: ['खंड 2', 'हाइड्रोकार्बन वर्गीकरण']
          },
          {
            id: 'turn-3',
            speaker: 'host1',
            text: 'अध्याय तीन: आईयूपीएसी (IUPAC) नामकरण प्रणाली के मुख्य नियम। नियम एक: सदैव कार्बन परमाणुओं की सबसे लम्बी अविच्छिन्न श्रृंखला का चयन करें जिसे जनक श्रृंखला कहा जाता है। नियम दो: कार्बन श्रृंखला का क्रमांकन उस सिरे से करें जहां से मुख्य क्रियात्मक समूह को न्यूनतम संख्या प्राप्त हो सके।',
            durationEstimateSeconds: 14,
            keyConcepts: ['खंड 3', 'IUPAC नामकरण नियम']
          },
          {
            id: 'turn-4',
            speaker: 'host1',
            text: 'अध्याय चार: महत्वपूर्ण समावयवता (Isomerism)। जब दो या दो से अधिक यौगिकों का अणुसूत्र समान हो परंतु उनकी संरचना अथवा त्रिविम विन्यास भिन्न हो, तो उन्हें समावयवी कहा जाता है। परीक्षा हेतु श्रृंखला समावयवता और स्थिति समावयवता पर विशेष ध्यान दें।',
            durationEstimateSeconds: 13,
            keyConcepts: ['खंड 4', 'समावयवता के प्रकार']
          }
        ],
        createdAt: new Date(Date.now() - 5400000).toISOString()
      },
      {
        id: 'podcast-polity-hinglish',
        title: 'संविधान की प्रस्तावना और मौलिक अधिकार (Preamble & Fundamental Rights)',
        topic: 'Indian Polity & UPSC GS-II',
        language: 'hinglish',
        mode: 'DEEP_DIVE',
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
            text: 'Aur Fundamental Rights me Article 21 (Right to Life) aur Article 32 (Writs) sabse zyada frequently tested areas hain. Inke landmark judgments ko hamesha revised rakhein.',
            durationEstimateSeconds: 9,
            keyConcepts: ['Article 21 & Article 32', 'Constitutional Writs']
          }
        ],
        createdAt: new Date(Date.now() - 7200000).toISOString()
      },
      {
        id: 'podcast-laws-of-motion-hi',
        title: 'न्यूटन के गति के नियम और संवेग संरक्षण (Laws of Motion)',
        topic: 'Physics & Mechanics (भौतिक विज्ञान)',
        language: 'hi-IN',
        mode: 'DEEP_DIVE',
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
        createdAt: new Date(Date.now() - 9000000).toISOString()
      },
      {
        id: 'podcast-neural-networks-es',
        title: 'Redes Neuronales Artificiales y Aprendizaje Profundo',
        topic: 'Inteligencia Artificial y Deep Learning',
        language: 'es-ES',
        mode: 'DEEP_DIVE',
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
        mode: 'DEEP_DIVE',
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
    const mode = dto.mode || 'DEEP_DIVE';
    const id = `podcast-${Date.now()}`;

    let turns: PodcastDialogueTurn[] = [];
    let takeaways: string[] = [];
    let title = '';

    if (mode === 'QA_INTERVIEW') {
      if (lang === 'hi-IN') {
        title = `❓ प्रश्नोत्तर (Q&A) अभ्यास सत्र: ${topic}`;
        turns = [
          {
            id: 'turn-1',
            speaker: 'host1',
            text: `प्रश्न 1: ${topic} का सबसे बुनियादी सिद्धांत क्या है और यह परीक्षाओं में क्यों पूछा जाता है?`,
            durationEstimateSeconds: 7,
            keyConcepts: ['प्रश्न 1', 'मूल अवधारणा']
          },
          {
            id: 'turn-2',
            speaker: 'host2',
            text: `उत्तर: ${topic} का मुख्य आधार इसके क्रियात्मक नियमों पर निर्भर करता है। परीक्षा में सदैव इसके सूत्र और प्राथमिक मान्यताओं (Assumptions) को स्पष्ट रूप से लिखें।`,
            durationEstimateSeconds: 10,
            keyConcepts: ['आदर्श उत्तर', 'परीक्षा सूत्र']
          },
          {
            id: 'turn-3',
            speaker: 'host1',
            text: `प्रश्न 2: इस विषय से संबंधित संख्यात्मक प्रश्नों (Numericals) को हल करते समय सबसे सामान्य त्रुटि क्या होती है?`,
            durationEstimateSeconds: 7,
            keyConcepts: ['प्रश्न 2', 'संख्यात्मक त्रुटियां']
          },
          {
            id: 'turn-4',
            speaker: 'host2',
            text: `उत्तर: विद्यार्थी प्रायः मात्रकों (SI Units) का रूपांतरण भूल जाते हैं। अतः गणना प्रारंभ करने से पहले सभी मानों को मानक मात्रकों में बदलें।`,
            durationEstimateSeconds: 9,
            keyConcepts: ['आदर्श उत्तर', 'मात्रक सावधानी']
          }
        ];
        takeaways = [
          `प्रश्न 1: ${topic} के सैद्धांतिक आधार और मान्यताओं को कंठस्थ रखें।`,
          'प्रश्न 2: संख्यात्मक प्रश्नों में SI मात्रकों और सीमांत शर्तों का विशेष ध्यान रखें।'
        ];
      } else if (lang === 'hinglish') {
        title = `❓ Exam & Viva Q&A Drill: ${topic}`;
        turns = [
          {
            id: 'turn-1',
            speaker: 'host1',
            text: `Question 1: ${topic} se related sabse high-weightage viva question kya ban sakta hai?`,
            durationEstimateSeconds: 7,
            keyConcepts: ['Question 1', 'High Weightage Core']
          },
          {
            id: 'turn-2',
            speaker: 'host2',
            text: `Answer 1: Examiner aksar ${topic} ke working principles aur primary governing equations puchte hain. Answer dete waqt first-principles se derive karke explain karein.`,
            durationEstimateSeconds: 10,
            keyConcepts: ['Model Answer', 'Governing Equations']
          },
          {
            id: 'turn-3',
            speaker: 'host1',
            text: `Question 2: Exam me full marks score karne ke liye diagram ya equations me kya highlight karna chahiye?`,
            durationEstimateSeconds: 7,
            keyConcepts: ['Question 2', 'Answer Presentation']
          },
          {
            id: 'turn-4',
            speaker: 'host2',
            text: `Answer 2: Always labeled diagrams banayein, key formulas ko box me band karein aur boundary conditions ko clearly mention karein!`,
            durationEstimateSeconds: 9,
            keyConcepts: ['Model Answer', 'Diagram Presentation']
          }
        ];
        takeaways = [
          `Q&A 1: ${topic} ke primary governing equations ko derivation ke sath tayyar karein.`,
          'Q&A 2: Labeled diagrams aur SI units se step-marking me full score secure karein.'
        ];
      } else {
        title = `❓ Viva & Conceptual Q&A Drill: ${topic}`;
        turns = [
          {
            id: 'turn-1',
            speaker: 'host1',
            text: `Question 1: What is the single most critical governing principle behind ${topic}?`,
            durationEstimateSeconds: 7,
            keyConcepts: ['Question 1', 'Governing Principle']
          },
          {
            id: 'turn-2',
            speaker: 'host2',
            text: `Answer: The core principle of ${topic} relies on conservation and boundary invariance. In written exams, always state the standard mathematical formulation first before providing boundary conditions.`,
            durationEstimateSeconds: 10,
            keyConcepts: ['Model Answer', 'Mathematical Formulation']
          },
          {
            id: 'turn-3',
            speaker: 'host1',
            text: `Question 2: What common pitfall should students avoid when solving numerical questions on this topic?`,
            durationEstimateSeconds: 7,
            keyConcepts: ['Question 2', 'Common Pitfalls']
          },
          {
            id: 'turn-4',
            speaker: 'host2',
            text: `Answer: Neglecting standard unit normalization and sign conventions. Always verify dimensions of your final expression before substituting numerical constants.`,
            durationEstimateSeconds: 9,
            keyConcepts: ['Model Answer', 'Unit Normalization']
          }
        ];
        takeaways = [
          `Q1: Master the fundamental governing formulation of ${topic}.`,
          'Q2: Ensure rigorous dimensional consistency and sign convention adherence.'
        ];
      }
    } else if (mode === 'CONTINUOUS_READER') {
      if (dto.sourceText && dto.sourceText.trim().length > 10) {
        const paragraphs = dto.sourceText
          .split(/\n\s*\n|\n(?=[0-9]+\.|\*|-|Chapter|Section|भाग|अध्याय)/)
          .map(p => p.trim())
          .filter(p => p.length > 0);

        title = `📖 Continuous Notes Reader: ${topic}`;
        turns = paragraphs.map((p, idx) => ({
          id: `turn-${idx + 1}`,
          speaker: 'host1',
          text: p,
          durationEstimateSeconds: Math.max(6, Math.round(p.split(' ').length * 0.4)),
          keyConcepts: [`Section ${idx + 1}`, topic]
        }));

        takeaways = [
          `Complete continuous reading of provided notes for ${topic}.`,
          `${turns.length} structured sections synthesized for uninterrupted audiobook listening.`
        ];
      } else {
        if (lang === 'hi-IN') {
          title = `📖 अविरल व्याख्यान पाठ (Continuous Audio Lecture): ${topic}`;
          turns = [
            {
              id: 'turn-1',
              speaker: 'host1',
              text: `अध्याय एक: ${topic} की व्यापक प्रस्तावना। इस विषय के अंतर्गत हम उन सभी आधारभूत नियमों और समीकरणों का अध्ययन करेंगे जो पाठ्यक्रम और प्रतियोगी परीक्षाओं की दृष्टि से अत्यंत महत्वपूर्ण हैं।`,
              durationEstimateSeconds: 11,
              keyConcepts: ['अध्याय 1', 'प्रस्तावना']
            },
            {
              id: 'turn-2',
              speaker: 'host1',
              text: `अध्याय दो: मुख्य सूत्र एवं सिद्धांत। ${topic} के सभी प्रमुख सिद्धांतों को तार्किक क्रम में व्यवस्थित किया गया है ताकि आप बिना किसी व्यवधान के इनका क्रमिक अध्ययन कर सकें।`,
              durationEstimateSeconds: 11,
              keyConcepts: ['अध्याय 2', 'सैद्धांतिक संरचना']
            },
            {
              id: 'turn-3',
              speaker: 'host1',
              text: `अध्याय तीन: परीक्षा हेतु महत्वपूर्ण निष्कर्ष एवं सारांश। संपूर्ण सामग्री के अध्ययन के उपरांत प्रमुख बिंदुओं का नियमित पुनरावलोकन सुनिश्चित करें।`,
              durationEstimateSeconds: 10,
              keyConcepts: ['अध्याय 3', 'निष्कर्ष']
            }
          ];
          takeaways = [
            `${topic} का सम्पूर्ण अविरल एवं धाराप्रवाह वाचन पाठ।`,
            'बिना किसी रुकावट के लगातार सुनने हेतु अनुकूलित।'
          ];
        } else if (lang === 'hinglish') {
          title = `📖 Continuous Notes Audio Reader: ${topic}`;
          turns = [
            {
              id: 'turn-1',
              speaker: 'host1',
              text: `Section 1: Overview of ${topic}. Is chapter ke essential conceptual points aur exam definitions ko hum step-by-step continuous narration me cover kar rahe hain.`,
              durationEstimateSeconds: 10,
              keyConcepts: ['Section 1', 'Introduction']
            },
            {
              id: 'turn-2',
              speaker: 'host1',
              text: `Section 2: Governing Principles & Formulas. ${topic} ke sabhi critical formulas aur application rules ko audio notes ke roop me dhyan se sunein.`,
              durationEstimateSeconds: 11,
              keyConcepts: ['Section 2', 'Core Rules']
            },
            {
              id: 'turn-3',
              speaker: 'host1',
              text: `Section 3: Summary & Key Takeaways. Revision karte waqt in audio points ko regularly repeat karein taaki quick recall ban sake.`,
              durationEstimateSeconds: 9,
              keyConcepts: ['Section 3', 'Review Summary']
            }
          ];
          takeaways = [
            `Seamless continuous reading flow for ${topic}.`,
            'Ideal for passive listening while commuting or revising.'
          ];
        } else {
          title = `📖 Continuous Lecture Reader: ${topic}`;
          turns = [
            {
              id: 'turn-1',
              speaker: 'host1',
              text: `Section 1: Introduction to ${topic}. We begin by establishing the comprehensive theoretical background and defining the core parameters governing this domain.`,
              durationEstimateSeconds: 10,
              keyConcepts: ['Section 1', 'Introduction']
            },
            {
              id: 'turn-2',
              speaker: 'host1',
              text: `Section 2: Primary Formulations and Analytical Laws. ${topic} incorporates direct functional relationships that remain central to advanced problem solving.`,
              durationEstimateSeconds: 10,
              keyConcepts: ['Section 2', 'Analytical Laws']
            },
            {
              id: 'turn-3',
              speaker: 'host1',
              text: `Section 3: Practical Takeaways and Review. Consolidate these key points into active memory through systematic listening.`,
              durationEstimateSeconds: 9,
              keyConcepts: ['Section 3', 'Summary']
            }
          ];
          takeaways = [
            `Uninterrupted continuous audio reading of ${topic}.`,
            'Designed for focused, distraction-free audio study.'
          ];
        }
      }
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
      mode,
      sourceType: dto.sourceText ? 'NOTES' : 'SYLLABUS',
      totalDurationSeconds: turns.reduce((acc, t) => acc + (t.durationEstimateSeconds || 8), 0),
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
