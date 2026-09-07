import {
  ScholarCitationProfile,
  TrackScholarDto
} from '@studentlife/shared';

export class ScholarTrackerService {
  private profile: ScholarCitationProfile;

  constructor() {
    this.profile = {
      scholarName: 'Aman Chaurasiya',
      affiliation: 'Department of Computer Science & Engineering, IIT',
      hIndex: 14,
      i10Index: 18,
      totalCitations: 942,
      citationsVelocityPerYear: [
        { year: 2022, citations: 85 },
        { year: 2023, citations: 210 },
        { year: 2024, citations: 340 },
        { year: 2025, citations: 460 },
        { year: 2026, citations: 620 }
      ],
      coAuthorNetwork: [
        { name: 'Dr. Ramesh Sharma', institution: 'IIT Bombay', sharedPapers: 6 },
        { name: 'Prof. Geoffrey Hinton', institution: 'University of Toronto', sharedPapers: 2 },
        { name: 'Dr. Yoshua Bengio', institution: 'Mila - Quebec AI Institute', sharedPapers: 3 },
        { name: 'Dr. Ananya Iyer', institution: 'IISc Bangalore', sharedPapers: 5 }
      ],
      topPublications: [
        {
          id: 'pub-01',
          title: 'Equivariant Hamiltonian Message Passing on 3D Molecular Conformations',
          venue: 'NeurIPS 2024 (Oral Presentation)',
          year: 2024,
          citationsCount: 312,
          doi: '10.48550/arXiv.2409.11024',
          isHighlyCited: true
        },
        {
          id: 'pub-02',
          title: 'Asynchronous Byzantine Fault-Tolerant Consensus in Sharded Distributed Ledgers',
          venue: 'IEEE Transactions on Parallel and Distributed Systems',
          year: 2023,
          citationsCount: 248,
          doi: '10.1109/TPDS.2023.3289012',
          isHighlyCited: true
        },
        {
          id: 'pub-03',
          title: 'Circadian-Coupled Spaced Repetition Scheduling with Subvocalization Latency Suppression',
          venue: 'ACM Conference on Human Factors in Computing Systems (CHI 2025)',
          year: 2025,
          citationsCount: 186,
          doi: '10.1145/3613904.3642109',
          isHighlyCited: false
        },
        {
          id: 'pub-04',
          title: 'Quantum Circuit Topology Mapping via Bloch Sphere Vector Entanglement Geodesics',
          venue: 'Physical Review Letters (PRL)',
          year: 2025,
          citationsCount: 196,
          doi: '10.1103/PhysRevLett.134.080401',
          isHighlyCited: true
        }
      ]
    };
  }

  public getProfile(): ScholarCitationProfile {
    return this.profile;
  }

  public trackScholar(dto: TrackScholarDto): ScholarCitationProfile {
    this.profile.scholarName = dto.scholarName || this.profile.scholarName;
    if (dto.institutionDomain) {
      this.profile.affiliation = `${dto.institutionDomain} Research Labs`;
    }
    return this.profile;
  }
}

export const scholarTrackerService = new ScholarTrackerService();
