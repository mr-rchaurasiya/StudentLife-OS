import {
  CareerRoleProfile,
  CareerSkillGapReport,
} from '@studentlife/shared';

const SEED_CAREER_ROLES: CareerRoleProfile[] = [
  {
    id: 'role-sde',
    title: 'Software Development Engineer (Backend / Distributed Systems)',
    iconEmoji: '💻',
    shortDescription: 'Design, build, and scale fault-tolerant backend services, microservices, and distributed systems handling millions of queries per second.',
    fullDescription: 'Software Development Engineers at Tier-1 tech firms architect high-concurrency microservices, optimize database queries, implement message queue architectures, and write production-grade code adhering to Clean Code and SOLID principles.',
    matchScorePercent: 82,
    marketTrend: {
      avgSalaryLpa: '₹24 - 45 LPA',
      salaryRange: {
        entry: '₹16 - 28 LPA',
        mid: '₹28 - 48 LPA',
        senior: '₹50 - 95 LPA',
      },
      topHiringCompanies: ['Google', 'Microsoft', 'Amazon', 'Uber', 'Atlassian', 'Flipkart'],
      demandGrowthPercent: 18.5,
      totalOpeningsEstimate: '42,000+ Active Roles',
    },
    requiredSkills: [
      {
        skillName: 'Data Structures & Algorithms',
        importance: 'MUST_HAVE',
        category: 'CORE_CS',
        isAcquired: true,
        learningCurveWeeks: 12,
      },
      {
        skillName: 'System Design & High-Level Architecture',
        importance: 'MUST_HAVE',
        category: 'CORE_CS',
        isAcquired: true,
        learningCurveWeeks: 8,
      },
      {
        skillName: 'Relational & NoSQL Database Optimization (PostgreSQL/Redis)',
        importance: 'MUST_HAVE',
        category: 'CORE_CS',
        isAcquired: true,
        learningCurveWeeks: 6,
      },
      {
        skillName: 'Distributed Message Brokers (Apache Kafka / RabbitMQ)',
        importance: 'GOOD_TO_HAVE',
        category: 'INFRASTRUCTURE',
        isAcquired: false,
        learningCurveWeeks: 4,
      },
      {
        skillName: 'Containerization & Orchestration (Docker & Kubernetes)',
        importance: 'GOOD_TO_HAVE',
        category: 'INFRASTRUCTURE',
        isAcquired: false,
        learningCurveWeeks: 3,
      },
      {
        skillName: 'CI/CD Pipelines & Observability (Grafana/Prometheus)',
        importance: 'OPTIONAL',
        category: 'INFRASTRUCTURE',
        isAcquired: false,
        learningCurveWeeks: 2,
      },
    ],
    recommendations: [
      {
        id: 'rec-1',
        title: 'Distributed Systems & Event-Driven Microservices Blueprint',
        type: 'PROJECT_BLUEPRINT',
        provider: 'StudentLife Career Hub',
        difficulty: 'ADVANCED',
        description: 'Build an idempotency-guaranteed distributed order processing engine using Kafka, PostgreSQL with CDC, and Redis write-back caching.',
      },
      {
        id: 'rec-2',
        title: 'Designing Data-Intensive Applications by Martin Kleppmann',
        type: 'BOOK',
        provider: "O'Reilly",
        difficulty: 'INTERMEDIATE',
        description: 'The definitive guide to replication, partitioning, transactions, and consensus in modern distributed databases.',
      },
      {
        id: 'rec-3',
        title: 'Docker & Kubernetes Cloud Architecture Specialization',
        type: 'COURSE',
        provider: 'Linux Foundation / CNCF',
        difficulty: 'INTERMEDIATE',
        description: 'Master multi-container orchestration, ingress routing, stateful sets, and zero-downtime deployment pipelines.',
      },
    ],
  },
  {
    id: 'role-ai-ml',
    title: 'AI / Machine Learning Engineer & LLM Specialist',
    iconEmoji: '🤖',
    shortDescription: 'Train, fine-tune, and deploy transformer architectures, generative AI models, and scalable embedding pipelines.',
    fullDescription: 'AI Engineers work at the intersection of mathematical theory and systems engineering, applying deep learning frameworks (PyTorch), LoRA fine-tuning, RAG pipelines, and vector database search at scale.',
    matchScorePercent: 68,
    marketTrend: {
      avgSalaryLpa: '₹28 - 55 LPA',
      salaryRange: {
        entry: '₹18 - 32 LPA',
        mid: '₹34 - 60 LPA',
        senior: '₹65 - 120 LPA',
      },
      topHiringCompanies: ['OpenAI', 'Google DeepMind', 'NVIDIA', 'Anthropic', 'Adobe', 'Meta'],
      demandGrowthPercent: 34.2,
      totalOpeningsEstimate: '18,500+ Active Roles',
    },
    requiredSkills: [
      {
        skillName: 'Linear Algebra, Calculus & Optimization',
        importance: 'MUST_HAVE',
        category: 'AI_MATH',
        isAcquired: true,
        learningCurveWeeks: 8,
      },
      {
        skillName: 'Probability, Bayes & Statistical Inference',
        importance: 'MUST_HAVE',
        category: 'AI_MATH',
        isAcquired: true,
        learningCurveWeeks: 6,
      },
      {
        skillName: 'PyTorch & Deep Learning Fundamentals',
        importance: 'MUST_HAVE',
        category: 'FRAMEWORK',
        isAcquired: false,
        learningCurveWeeks: 8,
      },
      {
        skillName: 'Transformer Architectures & Attention Mechanisms',
        importance: 'MUST_HAVE',
        category: 'CORE_CS',
        isAcquired: false,
        learningCurveWeeks: 6,
      },
      {
        skillName: 'Vector Databases & RAG Pipelines (Pinecone/Chroma/LangChain)',
        importance: 'GOOD_TO_HAVE',
        category: 'FRAMEWORK',
        isAcquired: false,
        learningCurveWeeks: 4,
      },
      {
        skillName: 'Quantization & Model Inference Serving (vLLM/Triton)',
        importance: 'OPTIONAL',
        category: 'INFRASTRUCTURE',
        isAcquired: false,
        learningCurveWeeks: 4,
      },
    ],
    recommendations: [
      {
        id: 'rec-4',
        title: 'Deep Learning Specialization with PyTorch',
        type: 'COURSE',
        provider: 'DeepLearning.AI',
        difficulty: 'INTERMEDIATE',
        description: 'Build neural networks from scratch, backpropagation calculus, CNNs, RNNs, and transformer attention heads.',
      },
      {
        id: 'rec-5',
        title: 'Production RAG & Knowledge Graph Engine Blueprint',
        type: 'PROJECT_BLUEPRINT',
        provider: 'StudentLife Career Hub',
        difficulty: 'ADVANCED',
        description: 'Construct a semantic hybrid search retrieval engine with re-ranking and hallucination prevention telemetry.',
      },
    ],
  },
  {
    id: 'role-quant',
    title: 'Quantitative Researcher & High-Frequency Trading Developer',
    iconEmoji: '📈',
    shortDescription: 'Develop low-latency market making algorithms, mathematical arbitrage models, and stochastic simulations.',
    fullDescription: 'Quant Developers build ultra-low latency execution engines in modern C++ and analyze statistical market anomalies using stochastic calculus, time-series forecasting, and kernel-bypass networking.',
    matchScorePercent: 74,
    marketTrend: {
      avgSalaryLpa: '₹45 - 120 LPA',
      salaryRange: {
        entry: '₹35 - 65 LPA',
        mid: '₹70 - 140 LPA',
        senior: '₹150 - 300 LPA',
      },
      topHiringCompanies: ['Jane Street', 'Tower Research Capital', 'Citadel', 'Optiver', 'Graviton', 'WorldQuant'],
      demandGrowthPercent: 22.0,
      totalOpeningsEstimate: '3,200+ Highly Selective Roles',
    },
    requiredSkills: [
      {
        skillName: 'Advanced Probability & Stochastic Calculus',
        importance: 'MUST_HAVE',
        category: 'AI_MATH',
        isAcquired: true,
        learningCurveWeeks: 10,
      },
      {
        skillName: 'Data Structures & Algorithmic Optimization',
        importance: 'MUST_HAVE',
        category: 'CORE_CS',
        isAcquired: true,
        learningCurveWeeks: 12,
      },
      {
        skillName: 'Modern Low-Latency C++ (C++20/23, Move Semantics, Lock-Free)',
        importance: 'MUST_HAVE',
        category: 'CORE_CS',
        isAcquired: false,
        learningCurveWeeks: 10,
      },
      {
        skillName: 'Memory Hierarchy, Cache Lines & CPU Branch Prediction',
        importance: 'MUST_HAVE',
        category: 'CORE_CS',
        isAcquired: true,
        learningCurveWeeks: 4,
      },
      {
        skillName: 'Time Series Econometrics & Backtesting Frameworks',
        importance: 'GOOD_TO_HAVE',
        category: 'AI_MATH',
        isAcquired: false,
        learningCurveWeeks: 6,
      },
    ],
    recommendations: [
      {
        id: 'rec-6',
        title: 'Lock-Free Order Book & Matching Engine in C++20',
        type: 'PROJECT_BLUEPRINT',
        provider: 'StudentLife Career Hub',
        difficulty: 'ADVANCED',
        description: 'Build a sub-microsecond limit order book with cache-aligned ring buffers and atomic SIMD operations.',
      },
    ],
  },
];

class CareerService {
  private roles: CareerRoleProfile[] = [...SEED_CAREER_ROLES];

  public getRoles(_userId: string): CareerRoleProfile[] {
    return this.roles;
  }

  public getRoleById(id: string): CareerRoleProfile | null {
    return this.roles.find((r) => r.id === id) || null;
  }

  public analyzeSkillGap(roleId: string): CareerSkillGapReport {
    const role = this.roles.find((r) => r.id === roleId) || this.roles[0];
    const acquired = role.requiredSkills.filter((s) => s.isAcquired).map((s) => s.skillName);
    const missing = role.requiredSkills.filter((s) => !s.isAcquired);
    const totalCurveWeeks = missing.reduce((sum, s) => sum + s.learningCurveWeeks, 0);

    return {
      roleId: role.id,
      roleTitle: role.title,
      matchScorePercent: role.matchScorePercent,
      acquiredSkills: acquired,
      missingSkills: missing,
      recommendedPlanWeeks: totalCurveWeeks,
    };
  }
}

export const careerService = new CareerService();
