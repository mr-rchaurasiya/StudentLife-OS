import {
  SubjectKnowledgeGraph,
  ConceptNode
} from '@studentlife/shared';

class ConceptGraphService {
  private graphs: Record<string, SubjectKnowledgeGraph> = {
    dsa: {
      subjectId: 'dsa',
      subjectName: 'Algorithms & Data Structures (GATE & FAANG)',
      overallMasteryPercent: 78,
      nodes: [
        {
          id: 'node-arrays',
          label: 'Arrays & Two Pointers',
          subject: 'DSA',
          category: 'Fundamentals',
          mastery: 'MASTERED',
          weightagePercent: 12,
          x: 100,
          y: 200,
          formulaSummary: 'Sliding window window_size = R - L + 1, O(N) amortized',
          pyqCount: 45,
          keyTakeaways: ['Prefix Sums', 'Kadane Algorithm', 'Two Pointer Collisions']
        },
        {
          id: 'node-recursion',
          label: 'Recursion & Backtracking',
          subject: 'DSA',
          category: 'Core Logic',
          mastery: 'MASTERED',
          weightagePercent: 15,
          x: 280,
          y: 120,
          formulaSummary: 'T(N) = a T(N/b) + f(N) (Master Theorem)',
          pyqCount: 38,
          keyTakeaways: ['Call Stack Visualization', 'Subsets & Permutations', 'Pruning Branches']
        },
        {
          id: 'node-trees',
          label: 'Binary Trees & BST',
          subject: 'DSA',
          category: 'Non-Linear Structures',
          mastery: 'MASTERED',
          weightagePercent: 18,
          x: 460,
          y: 100,
          formulaSummary: 'Height = O(log N) balanced, Inorder BST is sorted',
          pyqCount: 52,
          keyTakeaways: ['LCA (Lowest Common Ancestor)', 'Tree Traversals DFS/BFS', 'Diameter of Tree']
        },
        {
          id: 'node-graphs',
          label: 'Graph Algorithms',
          subject: 'DSA',
          category: 'Advanced Structures',
          mastery: 'REVISING',
          weightagePercent: 22,
          x: 640,
          y: 160,
          formulaSummary: 'Dijkstra O((V + E) log V), Bellman-Ford O(V * E)',
          pyqCount: 64,
          keyTakeaways: ['Topological Sort (Kahn)', 'Shortest Paths', 'Disjoint Set Union (DSU)']
        },
        {
          id: 'node-dp',
          label: 'Dynamic Programming',
          subject: 'DSA',
          category: 'Optimization',
          mastery: 'REVISING',
          weightagePercent: 25,
          x: 480,
          y: 300,
          formulaSummary: 'Optimal Substructure + Overlapping Subproblems',
          pyqCount: 78,
          keyTakeaways: ['0/1 Knapsack Pattern', 'Longest Common Subsequence', 'Matrix Chain Multiplication']
        },
        {
          id: 'node-tree-dp',
          label: 'DP on Trees & Re-Rooting',
          subject: 'DSA',
          category: 'Expert Competitive',
          mastery: 'UNEXPLORED',
          weightagePercent: 8,
          x: 720,
          y: 320,
          formulaSummary: 'DP[u] aggregated from children + Re-rooting in O(N)',
          pyqCount: 18,
          keyTakeaways: ['Subtree Size Counting', 'Tree Distances Sum', 'In-Out DP States']
        }
      ],
      edges: [
        { id: 'e1', from: 'node-arrays', to: 'node-recursion', type: 'PREREQUISITE', label: 'Base Recursion' },
        { id: 'e2', from: 'node-recursion', to: 'node-trees', type: 'PREREQUISITE', label: 'Tree DFS' },
        { id: 'e3', from: 'node-trees', to: 'node-graphs', type: 'PREREQUISITE', label: 'General Graph' },
        { id: 'e4', from: 'node-recursion', to: 'node-dp', type: 'PREREQUISITE', label: 'Memoization' },
        { id: 'e5', from: 'node-trees', to: 'node-tree-dp', type: 'PREREQUISITE', label: 'Tree Structure' },
        { id: 'e6', from: 'node-dp', to: 'node-tree-dp', type: 'APPLICATION', label: 'Tree Recurrence' },
        { id: 'e7', from: 'node-graphs', to: 'node-dp', type: 'CORRELATED', label: 'DAG Shortest Path' }
      ]
    },
    physics: {
      subjectId: 'physics',
      subjectName: 'Calculus & Modern Physics (JEE & Engineering)',
      overallMasteryPercent: 72,
      nodes: [
        {
          id: 'p-calc',
          label: 'Differential Calculus',
          subject: 'Physics/Math',
          category: 'Math Foundation',
          mastery: 'MASTERED',
          weightagePercent: 20,
          x: 120,
          y: 180,
          formulaSummary: "df/dx = lim_{h -> 0} [f(x+h) - f(x)] / h",
          pyqCount: 40,
          keyTakeaways: ['Chain Rule', 'Taylor Series Approximation', 'Maxima & Minima']
        },
        {
          id: 'p-int',
          label: 'Integral Calculus',
          subject: 'Physics/Math',
          category: 'Math Foundation',
          mastery: 'MASTERED',
          weightagePercent: 22,
          x: 320,
          y: 130,
          formulaSummary: "\\int u \\, dv = uv - \\int v \\, du",
          pyqCount: 50,
          keyTakeaways: ['Integration by Parts', 'Definite Integral Properties', 'Area Under Curves']
        },
        {
          id: 'p-mech',
          label: 'Rotational Mechanics',
          subject: 'Physics',
          category: 'Classical Physics',
          mastery: 'REVISING',
          weightagePercent: 28,
          x: 520,
          y: 180,
          formulaSummary: "\\tau = I \\alpha, \\quad L = I \\omega",
          pyqCount: 65,
          keyTakeaways: ['Parallel Axis Theorem', 'Conservation of Angular Momentum', 'Rolling without Slipping']
        },
        {
          id: 'p-em',
          label: 'Electromagnetism & Flux',
          subject: 'Physics',
          category: 'Fields & Waves',
          mastery: 'UNEXPLORED',
          weightagePercent: 30,
          x: 400,
          y: 330,
          formulaSummary: "\\oint E \\cdot dA = Q_{enc} / \\epsilon_0",
          pyqCount: 70,
          keyTakeaways: ['Gauss Law', 'Faraday Electromagnetic Induction', 'Maxwell Equations']
        }
      ],
      edges: [
        { id: 'pe1', from: 'p-calc', to: 'p-int', type: 'PREREQUISITE', label: 'Antiderivative' },
        { id: 'pe2', from: 'p-int', to: 'p-mech', type: 'APPLICATION', label: 'Moment of Inertia' },
        { id: 'pe3', from: 'p-int', to: 'p-em', type: 'APPLICATION', label: 'Surface & Line Integrals' }
      ]
    }
  };

  public getGraphBySubject(subjectId = 'dsa'): SubjectKnowledgeGraph {
    return this.graphs[subjectId] || this.graphs.dsa;
  }

  public getAllSubjectGraphsSummary(): Array<{ id: string; name: string; nodeCount: number; mastery: number }> {
    return Object.keys(this.graphs).map((key) => {
      const g = this.graphs[key];
      return {
        id: g.subjectId,
        name: g.subjectName,
        nodeCount: g.nodes.length,
        mastery: g.overallMasteryPercent
      };
    });
  }

  public updateNodeMastery(subjectId: string, nodeId: string, newMastery: ConceptNode['mastery']): boolean {
    const g = this.graphs[subjectId];
    if (!g) return false;
    const node = g.nodes.find((n) => n.id === nodeId);
    if (node) {
      node.mastery = newMastery;
      return true;
    }
    return false;
  }
}

export const conceptGraphService = new ConceptGraphService();
