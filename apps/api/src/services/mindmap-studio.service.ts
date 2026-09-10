import {
  MindmapData,
  MindmapNode,
  MindmapEdge,
  GenerateMindmapDto
} from '@studentlife/shared';

class MindmapStudioService {
  private mindmaps: Map<string, MindmapData> = new Map();

  constructor() {
    this.seedDefaultMindmaps();
  }

  private seedDefaultMindmaps() {
    const defaultMap: MindmapData = {
      id: 'mm-quantum-computing',
      topicTitle: 'Quantum Computing & Algorithms Architecture',
      domain: 'Computer Science & Physics',
      activeRecallScore: 0,
      totalMaskableNodes: 5,
      nodes: [
        {
          id: 'node-root',
          label: 'Quantum Computation',
          category: 'CORE_ROOT',
          description: 'Information processing using quantum mechanical phenomena like superposition and entanglement.',
          isMaskedForRecall: false,
          userRecallRevealed: true,
          importance: 'CRITICAL',
          x: 350,
          y: 60
        },
        {
          id: 'node-qubit',
          label: 'Qubit State Representation',
          category: 'KEY_DEFINITION',
          description: 'State vector on Bloch sphere |\\psi\\rangle = \\alpha|0\\rangle + \\beta|1\\rangle where |\\alpha|^2 + |\\beta|^2 = 1.',
          formulaLatex: '|\\psi\\rangle = \\alpha|0\\rangle + \\beta|1\\rangle',
          isMaskedForRecall: true,
          userRecallRevealed: false,
          importance: 'CRITICAL',
          x: 140,
          y: 190
        },
        {
          id: 'node-gates',
          label: 'Unitary Quantum Gates',
          category: 'BRANCH',
          description: 'Hadamard (H), Pauli (X, Y, Z), CNOT, Phase (S, T) unitary transformations preserving norm.',
          isMaskedForRecall: false,
          userRecallRevealed: true,
          importance: 'HIGH',
          x: 350,
          y: 200
        },
        {
          id: 'node-algorithms',
          label: 'Quantum Speedup Algorithms',
          category: 'BRANCH',
          description: 'Shor algorithm (exponential speedup for factoring) and Grover algorithm (quadratic speedup for unstructured search).',
          isMaskedForRecall: true,
          userRecallRevealed: false,
          importance: 'CRITICAL',
          x: 570,
          y: 190
        },
        {
          id: 'node-shor',
          label: 'Shor\'s Factorization',
          category: 'FORMULA_NODE',
          description: 'Quantum Fourier Transform (QFT) for period finding with polynomial time complexity O((log N)^3).',
          formulaLatex: 'O((\\log N)^3) \\implies \\text{RSA Cryptanalysis}',
          isMaskedForRecall: true,
          userRecallRevealed: false,
          importance: 'HIGH',
          x: 480,
          y: 330
        },
        {
          id: 'node-grover',
          label: 'Grover\'s Search Operator',
          category: 'FORMULA_NODE',
          description: 'Diffusion operator amplifying target state amplitude in O(\\sqrt{N}) iterations.',
          formulaLatex: 'G = (2|\\psi\\rangle\\langle\\psi| - I) O_f \\implies O(\\sqrt{N})',
          isMaskedForRecall: true,
          userRecallRevealed: false,
          importance: 'HIGH',
          x: 660,
          y: 330
        },
        {
          id: 'node-bell',
          label: 'Bell State Entanglement',
          category: 'FORMULA_NODE',
          description: 'Maximally entangled two-qubit state generated via H followed by CNOT.',
          formulaLatex: '|\\Phi^+\\rangle = \\frac{|00\\rangle + |11\\rangle}{\\sqrt{2}}',
          isMaskedForRecall: true,
          userRecallRevealed: false,
          importance: 'CRITICAL',
          x: 140,
          y: 330
        }
      ],
      edges: [
        { id: 'e1', sourceNodeId: 'node-root', targetNodeId: 'node-qubit', relationshipLabel: 'State Primitive' },
        { id: 'e2', sourceNodeId: 'node-root', targetNodeId: 'node-gates', relationshipLabel: 'Operations' },
        { id: 'e3', sourceNodeId: 'node-root', targetNodeId: 'node-algorithms', relationshipLabel: 'Applications' },
        { id: 'e4', sourceNodeId: 'node-qubit', targetNodeId: 'node-bell', relationshipLabel: 'Entanglement' },
        { id: 'e5', sourceNodeId: 'node-algorithms', targetNodeId: 'node-shor', relationshipLabel: 'Period Finding' },
        { id: 'e6', sourceNodeId: 'node-algorithms', targetNodeId: 'node-grover', relationshipLabel: 'Amplitude Amplification' }
      ]
    };

    this.mindmaps.set(defaultMap.id, defaultMap);
  }

  public getMindmap(id: string): MindmapData {
    return this.mindmaps.get(id) || this.mindmaps.get('mm-quantum-computing')!;
  }

  public generateMindmap(dto: GenerateMindmapDto): MindmapData {
    const newId = `mm-${Date.now()}`;
    const cleanTopic = dto.topicTitle || 'Advanced Physics & Systems';
    const cleanDomain = dto.domain || 'Engineering & Science';

    const generatedMap: MindmapData = {
      id: newId,
      topicTitle: cleanTopic,
      domain: cleanDomain,
      activeRecallScore: 0,
      totalMaskableNodes: 4,
      nodes: [
        {
          id: 'n-root',
          label: cleanTopic,
          category: 'CORE_ROOT',
          description: `Foundational root concept of ${cleanTopic} encompassing governing laws and derivations.`,
          isMaskedForRecall: false,
          userRecallRevealed: true,
          importance: 'CRITICAL',
          x: 350,
          y: 60
        },
        {
          id: 'n-branch-1',
          label: 'Theoretical Foundations & Axioms',
          category: 'BRANCH',
          description: 'Governing first principles, conservation laws, and invariant properties.',
          isMaskedForRecall: false,
          userRecallRevealed: true,
          importance: 'HIGH',
          x: 170,
          y: 190
        },
        {
          id: 'n-branch-2',
          label: 'Mathematical Formulation',
          category: 'FORMULA_NODE',
          description: 'Key mathematical relation governing system dynamics.',
          formulaLatex: '\\oint \\vec{B} \\cdot d\\vec{l} = \\mu_0 I_{enc} + \\mu_0 \\varepsilon_0 \\frac{d\\Phi_E}{dt}',
          isMaskedForRecall: true,
          userRecallRevealed: false,
          importance: 'CRITICAL',
          x: 530,
          y: 190
        },
        {
          id: 'n-leaf-1',
          label: 'Boundary Conditions & Edge Cases',
          category: 'KEY_DEFINITION',
          description: 'Asymptotic behavior, critical limits, and singular points under perturbation.',
          isMaskedForRecall: true,
          userRecallRevealed: false,
          importance: 'MEDIUM',
          x: 170,
          y: 330
        },
        {
          id: 'n-leaf-2',
          label: 'Exam & Application Patterns',
          category: 'EXAMPLE_LEAF',
          description: 'Standard PYQ problem patterns, synthesis problems, and industry use cases.',
          isMaskedForRecall: true,
          userRecallRevealed: false,
          importance: 'HIGH',
          x: 530,
          y: 330
        }
      ],
      edges: [
        { id: 'ge1', sourceNodeId: 'n-root', targetNodeId: 'n-branch-1', relationshipLabel: 'Foundations' },
        { id: 'ge2', sourceNodeId: 'n-root', targetNodeId: 'n-branch-2', relationshipLabel: 'Formulas' },
        { id: 'ge3', sourceNodeId: 'n-branch-1', targetNodeId: 'n-leaf-1', relationshipLabel: 'Constraints' },
        { id: 'ge4', sourceNodeId: 'n-branch-2', targetNodeId: 'n-leaf-2', relationshipLabel: 'Applied PYQs' }
      ]
    };

    this.mindmaps.set(generatedMap.id, generatedMap);
    return generatedMap;
  }

  public revealNode(mapId: string, nodeId: string): MindmapData {
    const map = this.getMindmap(mapId);
    const node = map.nodes.find((n) => n.id === nodeId);
    if (node && node.isMaskedForRecall && !node.userRecallRevealed) {
      node.userRecallRevealed = true;
      map.activeRecallScore += 1;
    }
    return map;
  }
}

export const mindmapStudioService = new MindmapStudioService();
