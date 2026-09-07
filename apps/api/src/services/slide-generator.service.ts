import {
  SlideDeck,
  GenerateSlidesDto,
  SlideData
} from '@studentlife/shared';

export class SlideGeneratorService {
  private decks: Map<string, SlideDeck> = new Map();

  constructor() {
    this.seedDefaultDecks();
  }

  private seedDefaultDecks(): void {
    const dsaDeck: SlideDeck = {
      id: 'deck-dsa-trees',
      topic: 'Binary Search Trees & Self-Balancing AVL Rotations',
      subject: 'Data Structures & Algorithms',
      totalSlides: 4,
      createdAt: new Date().toISOString(),
      slides: [
        {
          slideNumber: 1,
          title: 'Binary Search Tree (BST) Fundamentals',
          subtitle: 'The Invariant Property & Traversal Orders',
          voiceoverNarration: 'Welcome to this masterclass on Binary Search Trees. In a BST, for every node X, all values in its left subtree are strictly smaller, and all values in its right subtree are strictly greater.',
          elements: [
            { type: 'HEADING', content: 'Core BST Invariant' },
            { type: 'BULLET', content: 'Left Subtree < Root < Right Subtree for all nodes recursively.' },
            { type: 'CALLOUT', content: 'In-Order Traversal (Left -> Root -> Right) always yields sorted array order!' },
            { type: 'FORMULA', content: 'Search & Insertion Time Complexity: Best/Avg: O(log N), Worst: O(N)' }
          ]
        },
        {
          slideNumber: 2,
          title: 'Why Balancing Matters: The Degenerate Tree',
          subtitle: 'Skewed Linked List Degradation',
          voiceoverNarration: 'When inserting sorted keys 1, 2, 3, 4 into a standard BST, the tree degenerates into a linear linked list with O of N height.',
          elements: [
            { type: 'HEADING', content: 'Worst Case Degradation' },
            { type: 'BULLET', content: 'Sequential ascending insertions create a right-skewed stick.' },
            { type: 'CODE_BLOCK', content: 'Height = N -> Binary search benefits collapse to linear O(N) scan.' },
            { type: 'CALLOUT', content: 'Solution: AVL Trees maintain Balance Factor = |Height(Left) - Height(Right)| <= 1' }
          ]
        },
        {
          slideNumber: 3,
          title: 'AVL Tree 4-Way Rotations',
          subtitle: 'LL, RR, LR, and RL Restoration',
          voiceoverNarration: 'To restore equilibrium after insertion, AVL trees execute single or double rotations in constant O of 1 time.',
          elements: [
            { type: 'HEADING', content: 'The Four Imbalance Cases' },
            { type: 'BULLET', content: '1. Left-Left (LL): Resolved via Single Right Rotation on unbalanced ancestor.' },
            { type: 'BULLET', content: '2. Right-Right (RR): Resolved via Single Left Rotation.' },
            { type: 'BULLET', content: '3. Left-Right (LR): Left Rotation on child -> Right Rotation on ancestor.' },
            { type: 'BULLET', content: '4. Right-Left (RL): Right Rotation on child -> Left Rotation on ancestor.' }
          ]
        },
        {
          slideNumber: 4,
          title: 'Summary & Competitive Exam Key Takeaways',
          subtitle: 'GATE & FAANG Quick Reference',
          voiceoverNarration: 'In summary, AVL trees guarantee strict O of log N worst case lookup times, making them ideal for high-read databases.',
          elements: [
            { type: 'CALLOUT', content: 'AVL trees are more rigidly balanced than Red-Black trees (Faster lookups, slightly slower insertions).' },
            { type: 'FORMULA', content: 'Maximum height of an AVL tree with N nodes: h <= 1.44 log2(N + 2) - 0.328' }
          ]
        }
      ]
    };

    this.decks.set(dsaDeck.id, dsaDeck);
  }

  public getAllDecks(): SlideDeck[] {
    return Array.from(this.decks.values());
  }

  public getDeckById(id: string): SlideDeck | undefined {
    return this.decks.get(id);
  }

  public generateDeck(dto: GenerateSlidesDto): SlideDeck {
    const topic = dto.topic || 'General Core Study Concept';
    const subject = dto.subject || 'Engineering & Sciences';
    const id = `deck-${Date.now()}`;
    const slideCount = dto.slideCount || 4;

    const slides: SlideData[] = [
      {
        slideNumber: 1,
        title: `Introduction to ${topic}`,
        subtitle: `Foundational Principles & Exam Blueprint`,
        voiceoverNarration: `Welcome to this presentation on ${topic}. Let's examine the essential building blocks and primary theorems that define this concept.`,
        elements: [
          { type: 'HEADING', content: 'Core Definition & Context' },
          { type: 'BULLET', content: `${topic} establishes the foundational behavior under standard physical and analytical assumptions.` },
          { type: 'CALLOUT', content: 'Key Exam Rule: Always identify non-trivial boundary constraints before executing mathematical formulas.' }
        ]
      },
      {
        slideNumber: 2,
        title: 'Analytical Breakdown & Mathematical Formulation',
        subtitle: 'Step-by-Step Derivation',
        voiceoverNarration: `Now let's delve into the mathematical formulation and equilibrium equations governing ${topic}.`,
        elements: [
          { type: 'HEADING', content: 'Governing Relations' },
          { type: 'FORMULA', content: 'ΔE = ∫ [∂f/∂x · dx + ∂f/∂y · dy] => Steady State Value' },
          { type: 'BULLET', content: 'Variable scaling remains proportional across linear regimes.' },
          { type: 'CALLOUT', content: 'High-yield numerical tip: Watch for unit conversions during calculation!' }
        ]
      },
      {
        slideNumber: 3,
        title: 'Real-World Applications & Edge Cases',
        subtitle: 'System Architecture & Constraints',
        voiceoverNarration: `Understanding where this concept breaks down is critical for scoring top marks in competitive examinations.`,
        elements: [
          { type: 'HEADING', content: 'Boundary Conditions & Limitations' },
          { type: 'BULLET', content: '1. Assumption holds under standard non-relativistic parameters.' },
          { type: 'BULLET', content: '2. Extreme conditions induce nonlinear damping or saturation.' },
          { type: 'CODE_BLOCK', content: '// Pseudocode representation:\nif (input < boundary_threshold) apply_standard_law();' }
        ]
      },
      {
        slideNumber: 4,
        title: 'Rapid Revision Checklist & Flash Summary',
        subtitle: 'High-Yield Memory Pegs',
        voiceoverNarration: `To conclude, keep this four-point formula checklist in your memory palace for instant recall during mock tests.`,
        elements: [
          { type: 'CALLOUT', content: 'Flashcard Rule: Connect this principle directly with conservation laws and rate-of-change invariants.' },
          { type: 'BULLET', content: 'Review previous year questions (PYQs) covering this topic every 5 days using SM-2 spaced repetition.' }
        ]
      }
    ];

    const newDeck: SlideDeck = {
      id,
      topic,
      subject,
      totalSlides: slideCount,
      slides: slides.slice(0, slideCount),
      createdAt: new Date().toISOString()
    };

    this.decks.set(id, newDeck);
    return newDeck;
  }
}

export const slideGeneratorService = new SlideGeneratorService();
