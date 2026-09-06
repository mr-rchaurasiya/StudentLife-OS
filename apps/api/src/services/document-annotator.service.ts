import { 
  SmartDocument, 
  DocumentAnnotation, 
  DocumentAiActionRequestDto 
} from '@studentlife/shared';

export class DocumentAnnotatorService {
  private documents: Map<string, SmartDocument> = new Map();

  constructor() {
    this.seedDefaultDocuments();
  }

  private seedDefaultDocuments(): void {
    const defaultDocs: SmartDocument[] = [
      {
        id: 'doc-quantum-mechanics',
        title: 'Quantum Mechanics: Wave-Particle Duality & Schrödinger Equation',
        subject: 'Physics',
        category: 'JEE Advanced / College Physics',
        author: 'Prof. Richard Feynman & P. Dirac Notes',
        readTimeMinutes: 8,
        paragraphs: [
          'In quantum mechanics, wave–particle duality holds that every particle or quantum entity may be described as either a particle or a wave. It expresses the inability of the classical concepts "particle" or "wave" to fully describe the behavior of quantum-scale objects.',
          'The de Broglie wavelength is given by λ = h / p, where h is Planck\'s constant (6.626 × 10⁻³⁴ J·s) and p is the linear momentum of the particle. For a macroscopic baseball with mass 0.145 kg moving at 40 m/s, the de Broglie wavelength is on the order of 10⁻³⁴ meters, which is imperceptibly small and explains why quantum wave nature is undetectable at everyday macroscopic scales.',
          'The time-dependent Schrödinger equation in one dimension is: iℏ (∂ψ/∂t) = - (ℏ² / 2m) (∂²ψ/∂x²) + V(x,t)ψ. Here, ψ(x,t) represents the complex probability amplitude of the particle. Max Born provided the physical interpretation: |ψ(x,t)|² dx represents the exact probability density of finding the quantum particle in the spatial interval [x, x+dx].',
          'Heisenberg\'s Uncertainty Principle states that the product of the uncertainties in position and momentum satisfies Δx · Δp ≥ ℏ / 2. This is not a limitation of experimental apparatus, but a fundamental ontological property of quantum states: a localized wave packet necessarily consists of a superposition of many momentum components.',
          'Quantum tunneling occurs when a wave function penetrates through a potential barrier V₀ > E. Even when classical kinetic energy would be negative in the barrier region, the probability amplitude decays exponentially as ψ(x) ∝ e^(-κx) where κ = √(2m(V₀ - E)) / ℏ, resulting in a non-zero transmission coefficient T > 0 across narrow barriers.'
        ],
        annotations: [
          {
            id: 'ann-1',
            documentId: 'doc-quantum-mechanics',
            selectedText: 'λ = h / p',
            color: 'cyan',
            type: 'FORMULA',
            noteContent: 'Crucial for photoelectric and diffraction numericals.',
            paragraphIndex: 1,
            createdAt: new Date().toISOString()
          },
          {
            id: 'ann-2',
            documentId: 'doc-quantum-mechanics',
            selectedText: 'iℏ (∂ψ/∂t) = - (ℏ² / 2m) (∂²ψ/∂x²) + V(x,t)ψ',
            color: 'yellow',
            type: 'AI_INSIGHT',
            aiResponse: '💡 **AI Insight**: Left side represents total energy operator (Hamiltonian acting on wave function). Right side is the sum of Kinetic Energy (-ℏ²/2m ∇²) and Potential Energy (V).',
            paragraphIndex: 2,
            createdAt: new Date().toISOString()
          }
        ]
      },
      {
        id: 'doc-indian-polity-fr',
        title: 'Indian Polity: Fundamental Rights (Articles 12–35)',
        subject: 'UPSC / Political Science',
        category: 'Indian Constitution & Governance',
        author: 'Dr. B.R. Ambedkar & M. Laxmikanth Digest',
        readTimeMinutes: 10,
        paragraphs: [
          'Part III of the Indian Constitution (Articles 12 to 35) is described as the Magna Carta of India. Fundamental Rights are justiciable in nature, meaning they are enforceable by courts under Article 32 (Supreme Court) and Article 226 (High Courts).',
          'Article 14 guarantees equality before the law and equal protection of the laws within the territory of India. While equality before law is a negative concept borrowed from the British Constitution, equal protection of laws is a positive concept borrowed from the American Constitution emphasizing affirmative action for similarly situated groups.',
          'Article 21 states: "No person shall be deprived of his life or personal liberty except according to procedure established by law." In the landmark Maneka Gandhi Case (1978), the Supreme Court expanded this to "Due Process of Law", establishing that a law curtailing liberty must be just, fair, and reasonable.',
          'Article 32 is termed by Dr. B.R. Ambedkar as the "Heart and Soul of the Constitution". The Supreme Court has the power to issue five types of prerogative writs: Habeas Corpus, Mandamus, Prohibition, Certiorari, and Quo-Warranto for the enforcement of Fundamental Rights.'
        ],
        annotations: [
          {
            id: 'ann-3',
            documentId: 'doc-indian-polity-fr',
            selectedText: 'Article 32 is termed by Dr. B.R. Ambedkar as the "Heart and Soul of the Constitution"',
            color: 'rose',
            type: 'HIGHLIGHT',
            noteContent: 'High frequency MCQ in UPSC Prelims and State PSCs!',
            paragraphIndex: 3,
            createdAt: new Date().toISOString()
          }
        ]
      },
      {
        id: 'doc-dsa-dijkstra',
        title: 'Graph Algorithms: Dijkstra\'s Shortest Path & Priority Queues',
        subject: 'Computer Science',
        category: 'DSA / FAANG Interview Prep',
        author: 'Edsger W. Dijkstra & CLRS Reference',
        readTimeMinutes: 7,
        paragraphs: [
          'Dijkstra\'s algorithm finds the shortest paths from a single source node to all other nodes in a weighted directed graph with non-negative edge weights. It is a quintessential greedy algorithm that continually relaxes the edge leading to the unvisited vertex with minimal tentative distance.',
          'When implemented with a min-heap or binary priority queue, Dijkstra\'s algorithm runs in O((V + E) log V) time, where V is the number of vertices and E is the number of edges. If implemented with a Fibonacci heap, the theoretical complexity improves to O(E + V log V).',
          'Crucial limitation: Dijkstra\'s algorithm fails in the presence of negative edge weights because the greedy choice assumes that once a vertex is marked visited, no shorter path to it can ever be found. For graphs with negative edge weights, Bellman-Ford (O(V · E)) or SPFA must be utilized instead.'
        ],
        annotations: []
      }
    ];

    for (const doc of defaultDocs) {
      this.documents.set(doc.id, doc);
    }
  }

  public getAllDocuments(): SmartDocument[] {
    return Array.from(this.documents.values());
  }

  public getDocumentById(id: string): SmartDocument | undefined {
    return this.documents.get(id);
  }

  public createDocument(data: { title: string; subject: string; category?: string; author?: string; text: string }): SmartDocument {
    const paragraphs = data.text
      .split(/\n\s*\n/)
      .map(p => p.trim())
      .filter(p => p.length > 0);

    const docId = `doc-${Date.now()}`;
    const newDoc: SmartDocument = {
      id: docId,
      title: data.title || 'Untitled Document',
      subject: data.subject || 'General Study',
      category: data.category || 'User Notes',
      author: data.author || 'Student',
      readTimeMinutes: Math.max(1, Math.ceil(data.text.split(/\s+/).length / 150)),
      paragraphs: paragraphs.length > 0 ? paragraphs : [data.text],
      annotations: []
    };

    this.documents.set(docId, newDoc);
    return newDoc;
  }

  public addAnnotation(documentId: string, annotation: Omit<DocumentAnnotation, 'id' | 'createdAt'>): DocumentAnnotation {
    const doc = this.documents.get(documentId);
    if (!doc) {
      throw new Error(`Document with id "${documentId}" not found`);
    }

    const newAnnotation: DocumentAnnotation = {
      ...annotation,
      id: `ann-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      documentId,
      createdAt: new Date().toISOString()
    };

    doc.annotations.push(newAnnotation);
    return newAnnotation;
  }

  public deleteAnnotation(documentId: string, annotationId: string): boolean {
    const doc = this.documents.get(documentId);
    if (!doc) return false;

    const initialLen = doc.annotations.length;
    doc.annotations = doc.annotations.filter(a => a.id !== annotationId);
    return doc.annotations.length < initialLen;
  }

  public performAiAction(dto: DocumentAiActionRequestDto): { action: string; response: string; keyPoints?: string[] } {
    const selected = dto.selectedText.trim();

    switch (dto.action) {
      case 'EXPLAIN':
        return {
          action: 'EXPLAIN',
          response: `🧠 **Conceptual Breakdown for "${selected.slice(0, 50)}..."**:\n\n` +
            `• **Core Idea**: Think of this concept as an equilibrium state. In simple terms: ${this.generateSimpleExplanation(selected)}\n` +
            `• **Real-World Analogy**: Similar to ripples on a water pond when a pebble drops, the energy is distributed across states rather than confined to a single deterministic point.\n` +
            `• **Key Exam takeaway**: Always verify the boundary conditions and domain constraints before applying this equation or principle.`
        };

      case 'SUMMARIZE':
        return {
          action: 'SUMMARIZE',
          response: `📌 **Key Synthesis & Core Takeaways**:\n\n` +
            `1. **Primary Principle**: ${selected.slice(0, 80)} represents a cornerstone rule in this domain.\n` +
            `2. **Critical Condition**: Valid under non-relativistic / standard standard boundary assumptions.\n` +
            `3. **Memory Peg**: Associate this with direct proportional scaling of parameters.`
        };

      case 'FLASHCARD':
        return {
          action: 'FLASHCARD',
          response: `🗂️ **Generated Active Recall Flashcard**:\n\n` +
            `**[FRONT - Question]**:\nWhat is the definition and operational meaning of: "${selected.slice(0, 60)}"?\n\n` +
            `**[BACK - Solution & Insights]**:\n${selected}\n*(Key formula/axiom derived from standard syllabus benchmark)*`
        };

      case 'QUIZ':
        return {
          action: 'QUIZ',
          response: `❓ **Instant Speed Check Question**:\n\n` +
            `**Question**: Based on the passage: "${selected.slice(0, 80)}...", which statement is strictly TRUE?\n\n` +
            `• **(A)** The effect diminishes linearly with increasing system scale.\n` +
            `• **(B) [Correct]** It represents a foundational principle governed by inherent physical/logical boundaries.\n` +
            `• **(C)** It is applicable only when external resistance is infinite.\n` +
            `• **(D)** Classical mechanics fully replicates this behavior at macroscopic dimensions.\n\n` +
            `*💡 Explanation: Option B is correct because the selected text highlights fundamental constraints rather than arbitrary approximations.*`
        };

      case 'TRANSLATE_HINDI':
        return {
          action: 'TRANSLATE_HINDI',
          response: `🇮🇳 **Bilingual Hinglish / Hindi Explanation**:\n\n` +
            `**सरल हिंदी समझ**:\nयह सिद्धांत बताता है कि: "${selected.slice(0, 80)}..."\n\n` +
            `**Hinglish Summary**: Iska seedha matlab yeh hai ki jab bhi hum is condition ko apply karte hain, to system standard rules ke hisaab se behave karta hai. Exam ke liye iska formula aur limitation yaad rakhna zaroori hai!`
        };

      case 'SIMPLIFY_MATH':
        return {
          action: 'SIMPLIFY_MATH',
          response: `📐 **Mathematical / Step-by-Step Breakdown**:\n\n` +
            `• **Step 1 (Variables)**: Identify primary variables and dependent parameters.\n` +
            `• **Step 2 (Conservation/Law)**: Equate differential terms with potential/kinetic components.\n` +
            `• **Step 3 (Limit / Bounds)**: Integrate over the valid boundary domain [0, ∞) to ensure normalization.`
        };

      default:
        return {
          action: 'GENERAL',
          response: `💡 Analysis for selected snippet: "${selected}"`
        };
    }
  }

  public exportMarkdown(documentId: string): string {
    const doc = this.documents.get(documentId);
    if (!doc) throw new Error('Document not found');

    let md = `# ${doc.title}\n`;
    md += `**Subject**: ${doc.subject} | **Category**: ${doc.category} | **Author**: ${doc.author}\n\n---\n\n`;

    doc.paragraphs.forEach((p, idx) => {
      md += `### Paragraph ${idx + 1}\n${p}\n\n`;
      const parasAnns = doc.annotations.filter(a => a.paragraphIndex === idx);
      if (parasAnns.length > 0) {
        md += `> **Marginal Notes & Annotations:**\n`;
        parasAnns.forEach(ann => {
          md += `> - [${ann.type}] **"${ann.selectedText}"**: ${ann.noteContent || ann.aiResponse || 'Highlighted'}\n`;
        });
        md += `\n`;
      }
    });

    return md;
  }

  private generateSimpleExplanation(text: string): string {
    if (text.length > 120) {
      return text.slice(0, 115) + '...';
    }
    return text;
  }
}

export const documentAnnotatorService = new DocumentAnnotatorService();
