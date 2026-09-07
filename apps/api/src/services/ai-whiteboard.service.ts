import { WhiteboardDiagram, WhiteboardElement, AiDiagramRequestDto } from '@studentlife/shared';

export class AiWhiteboardService {
  private static diagrams: WhiteboardDiagram[] = [
    {
      id: 'diag-01',
      title: 'Distributed Microservices Architecture',
      topic: 'System Design',
      generatedByAi: true,
      notesSummary: 'API Gateway routes incoming student traffic to Auth, Study Engine, and Analytics microservices with Redis caching layer.',
      createdAt: new Date().toISOString(),
      elements: [
        { id: 'el-1', type: 'RECTANGLE', x: 60, y: 120, width: 140, height: 60, text: 'Client Web/PWA', color: '#38bdf8', fill: 'rgba(56, 189, 248, 0.15)' },
        { id: 'el-2', type: 'ARROW', x: 200, y: 150, width: 70, height: 2, text: 'HTTPS / WSS', color: '#94a3b8' },
        { id: 'el-3', type: 'DIAMOND', x: 270, y: 110, width: 130, height: 80, text: 'API Gateway (Rate Limiter)', color: '#a855f7', fill: 'rgba(168, 85, 247, 0.15)' },
        { id: 'el-4', type: 'ARROW', x: 400, y: 130, width: 80, height: 2, text: '/api/auth', color: '#94a3b8' },
        { id: 'el-5', type: 'RECTANGLE', x: 480, y: 70, width: 150, height: 50, text: 'Auth & JWT Service', color: '#10b981', fill: 'rgba(16, 185, 129, 0.15)' },
        { id: 'el-6', type: 'ARROW', x: 400, y: 170, width: 80, height: 2, text: '/api/study', color: '#94a3b8' },
        { id: 'el-7', type: 'RECTANGLE', x: 480, y: 160, width: 150, height: 50, text: 'Study & Exam Engine', color: '#f59e0b', fill: 'rgba(245, 158, 11, 0.15)' },
        { id: 'el-8', type: 'CIRCLE', x: 670, y: 110, width: 100, height: 100, text: 'PostgreSQL + Redis Cache', color: '#ec4899', fill: 'rgba(236, 72, 153, 0.15)' }
      ]
    },
    {
      id: 'diag-02',
      title: 'Binary Search Tree Balancing (AVL / Red-Black)',
      topic: 'Data Structures & Algorithms',
      generatedByAi: true,
      notesSummary: 'Demonstrates RR and LL rotations when node balance factor falls outside [-1, 1].',
      createdAt: new Date().toISOString(),
      elements: [
        { id: 'bst-1', type: 'CIRCLE', x: 340, y: 60, width: 60, height: 60, text: 'Node (30)', color: '#6366f1', fill: 'rgba(99, 102, 241, 0.2)' },
        { id: 'bst-2', type: 'ARROW', x: 330, y: 110, width: -60, height: 50, text: 'L', color: '#94a3b8' },
        { id: 'bst-3', type: 'CIRCLE', x: 230, y: 160, width: 60, height: 60, text: 'Node (20)', color: '#10b981', fill: 'rgba(16, 185, 129, 0.2)' },
        { id: 'bst-4', type: 'ARROW', x: 410, y: 110, width: 60, height: 50, text: 'R', color: '#94a3b8' },
        { id: 'bst-5', type: 'CIRCLE', x: 450, y: 160, width: 60, height: 60, text: 'Node (40)', color: '#f59e0b', fill: 'rgba(245, 158, 11, 0.2)' }
      ]
    }
  ];

  public static getDiagrams(): WhiteboardDiagram[] {
    return this.diagrams;
  }

  public static generateAiDiagram(dto: AiDiagramRequestDto): WhiteboardDiagram {
    const newId = `diag-${Date.now()}`;
    const generated: WhiteboardDiagram = {
      id: newId,
      title: `AI Diagram: ${dto.topic}`,
      topic: dto.topic,
      generatedByAi: true,
      notesSummary: `AI generated ${dto.diagramType.toLowerCase()} blueprint for ${dto.topic}. Optimized for quick visual revision.`,
      createdAt: new Date().toISOString(),
      elements: [
        { id: `el-${Date.now()}-1`, type: 'RECTANGLE', x: 80, y: 100, width: 140, height: 60, text: `Input: ${dto.topic}`, color: '#38bdf8', fill: 'rgba(56, 189, 248, 0.15)' },
        { id: `el-${Date.now()}-2`, type: 'ARROW', x: 220, y: 130, width: 80, height: 2, text: 'Process Flow', color: '#94a3b8' },
        { id: `el-${Date.now()}-3`, type: 'DIAMOND', x: 300, y: 90, width: 120, height: 80, text: 'Condition / Logic', color: '#a855f7', fill: 'rgba(168, 85, 247, 0.15)' },
        { id: `el-${Date.now()}-4`, type: 'ARROW', x: 420, y: 130, width: 80, height: 2, text: 'Success Result', color: '#94a3b8' },
        { id: `el-${Date.now()}-5`, type: 'CIRCLE', x: 500, y: 90, width: 90, height: 90, text: 'Output State', color: '#10b981', fill: 'rgba(16, 185, 129, 0.15)' }
      ]
    };

    this.diagrams.unshift(generated);
    return generated;
  }

  public static saveDiagram(diagram: WhiteboardDiagram): WhiteboardDiagram {
    const existingIdx = this.diagrams.findIndex(d => d.id === diagram.id);
    if (existingIdx >= 0) {
      this.diagrams[existingIdx] = diagram;
    } else {
      this.diagrams.unshift(diagram);
    }
    return diagram;
  }
}
