import {
  TopperNoteResource,
  UploadResourceDto,
  UnlockResourceDto
} from '@studentlife/shared';

export class NotesMarketplaceService {
  private resources: Map<string, TopperNoteResource> = new Map();

  constructor() {
    this.seedDefaultResources();
  }

  private seedDefaultResources(): void {
    const defaultList: TopperNoteResource[] = [
      {
        id: 'res-jee-physics-air12',
        title: 'Complete Modern Physics & Optics Hand-Written Formula Bible',
        author: 'Kunal Singhania',
        topperRankBadge: 'AIR 12 (JEE Advanced 2025)',
        exam: 'JEE Advanced',
        subject: 'Physics',
        pageCount: 38,
        rating: 4.9,
        downloadCount: 1420,
        unlockCostCoins: 30,
        tags: ['Rotational Dynamics', 'Photoelectric', 'Wave Optics', 'Shortcuts'],
        previewParagraphs: [
          'De Broglie & Matter Waves: Always memorize the kinetic energy form: λ = h / √(2mE). For electron accelerated by V volts: λ = 12.27 / √V Ångströms.',
          'Bohr Radius scaling: r_n ∝ n² / Z. Energy level: E_n = -13.6 · (Z² / n²) eV. Binding energy numericals always appear in Section 1!'
        ],
        isUnlocked: true,
        createdAt: new Date().toISOString()
      },
      {
        id: 'res-upsc-polity-air04',
        title: 'Indian Polity Laxmikanth Ultimate Mindmaps & Articles 1-395 Matrix',
        author: 'Ananya Sharma, IAS',
        topperRankBadge: 'AIR 04 (UPSC CSE 2024)',
        exam: 'UPSC Civil Services',
        subject: 'Indian Polity & Governance',
        pageCount: 75,
        rating: 5.0,
        downloadCount: 2890,
        unlockCostCoins: 50,
        tags: ['Fundamental Rights', 'Preamble', 'Emergency Provisions', 'Judiciary'],
        previewParagraphs: [
          'Article 32 vs Article 226 Writs: SC jurisdiction is confined strictly to Fundamental Rights, whereas HC jurisdiction covers "any other legal right" as well.',
          'Basic Structure Doctrine evolution: Shankari Prasad (1951) -> Golaknath (1967) -> 24th Amendment -> Kesavananda Bharati (1973) 13-Judge Bench.'
        ],
        isUnlocked: false,
        createdAt: new Date(Date.now() - 86400000 * 3).toISOString()
      },
      {
        id: 'res-gate-cs-air01',
        title: 'GATE CS: Complete Algorithms & Compiler Design Cheatbook',
        author: 'Vikramaditya S.',
        topperRankBadge: 'AIR 01 (GATE CS 2025)',
        exam: 'GATE CS & IT',
        subject: 'Algorithms & Automata',
        pageCount: 52,
        rating: 4.95,
        downloadCount: 1980,
        unlockCostCoins: 40,
        tags: ['Dynamic Programming', 'Dijkstra', 'Turing Machines', 'LR Parsers'],
        previewParagraphs: [
          'Master Theorem cases for T(n) = aT(n/b) + f(n): Compare f(n) with n^(log_b a). Case 1: Poly smaller -> Θ(n^log_b a). Case 2: Poly equal -> Θ(n^log_b a · log n).',
          'Dijkstra priority queue: O((V+E) log V). Bellman-Ford O(VE) for negative edge cycles.'
        ],
        isUnlocked: true,
        createdAt: new Date(Date.now() - 86400000 * 5).toISOString()
      }
    ];

    for (const res of defaultList) {
      this.resources.set(res.id, res);
    }
  }

  public getAllResources(): TopperNoteResource[] {
    return Array.from(this.resources.values());
  }

  public getResourceById(id: string): TopperNoteResource | undefined {
    return this.resources.get(id);
  }

  public unlockResource(dto: UnlockResourceDto): TopperNoteResource {
    const res = this.resources.get(dto.resourceId);
    if (!res) throw new Error('Resource not found');

    res.isUnlocked = true;
    res.downloadCount += 1;
    return res;
  }

  public uploadResource(dto: UploadResourceDto): TopperNoteResource {
    const id = `res-${Date.now()}`;
    const newRes: TopperNoteResource = {
      id,
      title: dto.title,
      author: 'Student Contributor',
      topperRankBadge: dto.topperRankBadge || 'Verified Contributor ⭐',
      exam: dto.exam,
      subject: dto.subject,
      pageCount: Math.ceil(dto.content.split(/\s+/).length / 200),
      rating: 5.0,
      downloadCount: 1,
      unlockCostCoins: dto.unlockCostCoins || 25,
      previewParagraphs: dto.content.split(/\n\n+/).slice(0, 2),
      tags: [dto.subject, dto.exam],
      isUnlocked: true,
      createdAt: new Date().toISOString()
    };

    this.resources.set(id, newRes);
    return newRes;
  }
}

export const notesMarketplaceService = new NotesMarketplaceService();
