import {
  OcrScanResult,
  OcrScanRequestDto
} from '@studentlife/shared';

export class OcrService {
  private static presetScans: { [key: string]: OcrScanResult } = {
    CALCULUS_NOTE: {
      id: 'scan-calc-01',
      documentType: 'HANDWRITTEN_NOTE',
      title: 'Handwritten Class Notes: Multivariable Calculus & Partial Derivatives',
      subjectName: 'Engineering Mathematics',
      confidenceScorePercent: 96.8,
      extractedMarkdown: `### 📘 Multivariable Calculus — Gradient & Directional Derivatives

**Core Notes Extracted:**
1. Let $f(x, y, z)$ be a scalar field. The **Gradient Vector** is defined as:
   $$\\nabla f = \\left( \\frac{\\partial f}{\\partial x}, \\frac{\\partial f}{\\partial y}, \\frac{\\partial f}{\\partial z} \\right)$$
2. **Directional Derivative** along unit vector $\\mathbf{u}$:
   $$D_{\\mathbf{u}} f = \\nabla f \\cdot \\mathbf{u} = |\\nabla f| \\cos(\\theta)$$
3. **Maximum Rate of Increase**: Occurs when $\\theta = 0$, in the exact direction of the gradient $\\nabla f$, with magnitude $|\\nabla f|$.
4. **Tangent Plane Equation** to surface $F(x, y, z) = 0$ at $(x_0, y_0, z_0)$:
   $$\\nabla F(x_0, y_0, z_0) \\cdot (x - x_0, y - y_0, z - z_0) = 0$$`,
      keyFormulas: [
        {
          id: 'frm-1',
          name: 'Directional Derivative Formula',
          latex: 'D_{\\mathbf{u}} f = \\nabla f \\cdot \\mathbf{u}',
          explanation: 'Calculates the instantaneous rate of change of scalar field f in the direction of unit vector u.'
        },
        {
          id: 'frm-2',
          name: 'Gradient Vector',
          latex: '\\nabla f = \\frac{\\partial f}{\\partial x}\\mathbf{i} + \\frac{\\partial f}{\\partial y}\\mathbf{j} + \\frac{\\partial f}{\\partial z}\\mathbf{k}',
          explanation: 'Points in the direction of greatest spatial rate of increase of the function.'
        }
      ],
      bulletSummary: [
        'Gradient vector points in the direction of steepest ascent.',
        'Directional derivative is zero perpendicular to the gradient vector (along level curves).',
        'Crucial for GATE Calculus and Machine Learning Gradient Descent optimization.'
      ],
      generatedQuiz: [
        {
          id: 'q-1',
          questionText: 'In which direction does a scalar field f(x, y) increase most rapidly at point P?',
          options: [
            'Along the tangent to the level curve',
            'In the exact direction of the gradient vector ∇f',
            'Perpendicular to ∇f',
            'Opposite to ∇f'
          ],
          correctAnswerIndex: 1,
          explanation: 'The maximum value of Du(f) = |∇f| cos(θ) occurs when cos(θ) = 1 (i.e., θ = 0°), which is along ∇f.'
        },
        {
          id: 'q-2',
          questionText: 'What is the directional derivative of f along a vector orthogonal to the gradient ∇f?',
          options: ['0', '1', '|∇f|', 'Undefined'],
          correctAnswerIndex: 0,
          explanation: 'Since u is orthogonal to ∇f, the dot product ∇f · u = 0.'
        }
      ],
      suggestedFlashcardsCount: 4,
      scannedAt: new Date().toISOString()
    },
    DP_BLUEPRINT: {
      id: 'scan-dp-02',
      documentType: 'DIAGRAM_CHART',
      title: 'Classroom Whiteboard: 0/1 Knapsack State Space & Recurrence',
      subjectName: 'Algorithms & Data Structures',
      confidenceScorePercent: 98.2,
      extractedMarkdown: `### 💻 0/1 Knapsack Dynamic Programming Recurrence Blueprint

**Recurrence Formulation:**
$$dp[i][w] = \\begin{cases} 
dp[i-1][w] & \\text{if } \\text{weight}[i-1] > w \\\\ 
\\max(dp[i-1][w], \\text{val}[i-1] + dp[i-1][w - \\text{weight}[i-1]]) & \\text{otherwise} 
\\end{cases}$$

- **State Representation**: $dp[i][w]$ = Maximum value attainable using a subset of the first $i$ items with max weight capacity $w$.
- **Time Complexity**: $O(N \\times W)$ pseudo-polynomial.
- **Space Optimization**: 2D table can be compressed to 1D array by iterating $w$ backwards ($W \\to \\text{weight}[i]$).`,
      keyFormulas: [
        {
          id: 'frm-3',
          name: 'Knapsack 1D State Transition',
          latex: 'dp[w] = \\max(dp[w], \\text{val}[i] + dp[w - \\text{wt}[i]])',
          explanation: 'Iterating right-to-left preserves previous stage state without overwriting.'
        }
      ],
      bulletSummary: [
        'Overlapping subproblems are memoized to avoid exponential 2^N runtime.',
        'Backwards iteration in 1D array prevents picking the same item multiple times.',
        'Core pattern for Subset Sum, Partition Equal Subset, and Target Sum.'
      ],
      generatedQuiz: [
        {
          id: 'q-3',
          questionText: 'Why do we iterate backwards from W to wt[i] in the 1D space optimized Knapsack?',
          options: [
            'To make the loop run faster in hardware cache',
            'To prevent using the current item multiple times in the same subproblem',
            'To sort the items by density',
            'To avoid recursion stack overflow'
          ],
          correctAnswerIndex: 1,
          explanation: 'Backwards iteration ensures that dp[w - wt[i]] refers to the state from the PREVIOUS item iteration, maintaining the 0/1 constraint.'
        }
      ],
      suggestedFlashcardsCount: 5,
      scannedAt: new Date().toISOString()
    }
  };

  public static processScan(dto: OcrScanRequestDto): OcrScanResult {
    const key = dto.presetKey || 'CALCULUS_NOTE';
    if (this.presetScans[key]) {
      return this.presetScans[key];
    }
    return this.presetScans.CALCULUS_NOTE;
  }
}
