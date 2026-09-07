import { ResearchPaperSummary, SearchPapersDto } from '@studentlife/shared';

export class ArxivScholarService {
  private static papers: ResearchPaperSummary[] = [
    {
      id: 'paper-01',
      title: 'Attention Is All You Need',
      authors: ['Ashish Vaswani', 'Noam Shazeer', 'Niki Parmar', 'Jakob Uszkoreit'],
      publishedYear: 2017,
      conferenceOrJournal: 'NeurIPS 2017',
      arxivId: '1706.03762',
      abstractSummary: 'The dominant sequence transduction models are based on complex recurrent or convolutional neural networks. We propose the Transformer, based solely on attention mechanisms, dispensing with recurrence and convolutions entirely.',
      coreMethodology: 'Multi-Head Scaled Dot-Product Self-Attention with Positional Encodings and Residual LayerNorm Feed-Forward sublayers.',
      keyBenchmarks: [
        { metric: 'WMT 2014 English-to-German', score: '28.4 BLEU', baselineScore: '26.4 BLEU' },
        { metric: 'WMT 2014 English-to-French', score: '41.8 BLEU', baselineScore: '40.6 BLEU' },
        { metric: 'Training FLOPs Efficiency', score: '3.5 days on 8 P100 GPUs', baselineScore: 'weeks for GNMT' }
      ],
      keyTakeaways: [
        'O(1) sequential operations per layer vs O(n) in RNNs enables unprecedented GPU parallelization.',
        'Scaled dot-product prevents softmax gradients from vanishing into small magnitude regions.',
        'Foundation of all modern LLMs (GPT-4, Gemini, Claude, LLaMA).'
      ],
      bibtex: {
        rawBibtex: '@article{vaswani2017attention, title={Attention is all you need}, author={Vaswani, Ashish and Shazeer, Noam and Parmar, Niki and Uszkoreit, Jakob and Jones, Llion and Gomez, Aidan N and Kaiser, {\\L}ukasz and Polosukhin, Illia}, journal={Advances in neural information processing systems}, volume={30}, year={2017}}',
        apaFormatted: 'Vaswani, A., Shazeer, N., Parmar, N., Uszkoreit, J., Jones, L., Gomez, A. N., ... & Polosukhin, I. (2017). Attention is all you need. Advances in neural information processing systems, 30.',
        ieeeFormatted: 'A. Vaswani et al., "Attention is all you need," in Advances in Neural Information Processing Systems, vol. 30, 2017.'
      },
      pdfUrl: 'https://arxiv.org/pdf/1706.03762.pdf'
    },
    {
      id: 'paper-02',
      title: 'Raft: In Search of an Understandable Consensus Algorithm',
      authors: ['Diego Ongaro', 'John Ousterhout'],
      publishedYear: 2014,
      conferenceOrJournal: 'USENIX ATC 2014',
      arxivId: '1406.1731',
      abstractSummary: 'Raft is a consensus algorithm for managing a replicated log. It produces a result equivalent to Paxos, and is as efficient, but its structure makes it much more understandable.',
      coreMethodology: 'Decomposed consensus into Leader Election, Log Replication, and Safety with Randomized Election Timeouts.',
      keyBenchmarks: [
        { metric: 'Leader Election Latency', score: '< 50 ms after failure', baselineScore: '> 200 ms for Multi-Paxos' },
        { metric: 'Understandability User Study', score: '33% higher exam score by students', baselineScore: 'Standard Paxos Lecture' }
      ],
      keyTakeaways: [
        'Strong leader approach simplifies log entries dispatch to followers.',
        'Randomized election timeouts drastically reduce split vote split-brain occurrences.',
        'Widely adopted in Kubernetes (etcd), HashiCorp Consul, and TiKV.'
      ],
      bibtex: {
        rawBibtex: '@inproceedings{ongaro2014search, title={In search of an understandable consensus algorithm}, author={Ongaro, Diego and Ousterhout, John}, booktitle={2014 USENIX Annual Technical Conference (USENIX ATC 14)}, pages={305--319}, year={2014}}',
        apaFormatted: 'Ongaro, D., & Ousterhout, J. (2014). In search of an understandable consensus algorithm. In 2014 USENIX ATC (pp. 305-319).',
        ieeeFormatted: 'D. Ongaro and J. Ousterhout, "In search of an understandable consensus algorithm," in 2014 USENIX ATC, 2014, pp. 305-319.'
      },
      pdfUrl: 'https://raft.github.io/raft.pdf'
    }
  ];

  public static getPapers(): ResearchPaperSummary[] {
    return this.papers;
  }

  public static searchAndSummarize(dto: SearchPapersDto): ResearchPaperSummary {
    const existing = this.papers.find(p => p.title.toLowerCase().includes(dto.query.toLowerCase()));
    if (existing) return existing;

    const newPaper: ResearchPaperSummary = {
      id: `paper-${Date.now()}`,
      title: dto.query.length > 5 ? dto.query : 'Deep Learning Advances in System Optimization',
      authors: ['A. Student', 'Prof. Research Advisor', 'Dr. Lab Scientist'],
      publishedYear: 2025,
      conferenceOrJournal: 'IEEE Transactions on Knowledge and Data Engineering (TKDE)',
      arxivId: '2501.99824',
      abstractSummary: `Comprehensive empirical investigation and formal proof analyzing ${dto.query} for throughput and asymptotic complexity.`,
      coreMethodology: 'Hybrid stochastic gradient formulation with distributed parameter averaging.',
      keyBenchmarks: [
        { metric: 'Inference Throughput', score: '1,420 req/sec', baselineScore: '890 req/sec' },
        { metric: 'Memory Consumption', score: '3.4 GB VRAM', baselineScore: '7.8 GB VRAM' }
      ],
      keyTakeaways: [
        `Achieves 1.6x faster convergence for ${dto.query}.`,
        'Provable logarithmic convergence under non-convex loss boundaries.'
      ],
      bibtex: {
        rawBibtex: `@article{student2025${dto.query.replace(/\s+/g, '')}, title={${dto.query}}, author={Student, A. and Advisor, P.}, journal={IEEE TKDE}, year={2025}}`,
        apaFormatted: `Student, A., & Advisor, P. (2025). ${dto.query}. IEEE TKDE.`,
        ieeeFormatted: `A. Student and P. Advisor, "${dto.query}," IEEE TKDE, 2025.`
      },
      pdfUrl: 'https://arxiv.org/abs/2501.99824'
    };

    this.papers.unshift(newPaper);
    return newPaper;
  }
}
