import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Search, X, Compass, Zap, Brain, Atom, Dna, 
  TrendingUp, Award, Bot, Sparkles, ArrowRight, CornerDownLeft
} from 'lucide-react';

export interface PhaseMeta {
  id: string;
  name: string;
  category: 'AI & Neuro' | 'Physics & Space' | 'Bio & Health' | 'Finance & Web3' | 'Academics & Career' | 'Robotics & IoT';
  description: string;
  badge?: string;
}

// 100 Phases Directory categorized
export const ALL_100_PHASES_META: PhaseMeta[] = [
  // 1-10 Foundation & Academics
  { id: 'dashboard', name: 'Phase 01: Core Operating Dashboard', category: 'Academics & Career', description: 'Academic task hub, daily schedule, and GPA metrics tracker' },
  { id: 'gpa', name: 'Phase 02: Real-Time CGPA & Target Calculator', category: 'Academics & Career', description: 'Weighted credit calculator and grade forecasting model' },
  { id: 'attendance', name: 'Phase 03: Smart Attendance & Bunk Predictor', category: 'Academics & Career', description: 'Real-time threshold alert and safe bunk calculation engine' },
  { id: 'syllabus', name: 'Phase 04: Syllabus Tracker & Micro-Goals', category: 'Academics & Career', description: 'Hierarchical module progress tracking with completion velocities' },
  { id: 'calendar', name: 'Phase 05: Academic Calendar & Exam Countdown', category: 'Academics & Career', description: 'Milestone timeline, deadlines, and urgency indicators' },
  { id: 'notes', name: 'Phase 06: Smart Notes & Flashcard Generator', category: 'Academics & Career', description: 'Markdown note-taking with spaced repetition flashcard generation' },
  { id: 'audio-study', name: 'Phase 07: Focus Audio & Binaural Soundscapes', category: 'Bio & Health', description: 'Alpha/Theta brainwave binaural beats and ambient focus mixer' },
  { id: 'study-room', name: 'Phase 08: Virtual Collaborative Study Room', category: 'Academics & Career', description: 'Pomodoro synchronization, silent study presence, and accountability' },
  { id: 'quiz', name: 'Phase 09: Dynamic Quiz Engine & Concept Mastery', category: 'Academics & Career', description: 'Adaptive difficulty quizzes and cognitive weak-spot remediation' },
  { id: 'habits', name: 'Phase 10: Habit Forge & Streak Preserver', category: 'Bio & Health', description: 'Atomic habit tracking with streak shields and gamified rewards' },

  // 11-20 Career & Financial
  { id: 'budget', name: 'Phase 11: Student Budget & Expense Allocator', category: 'Finance & Web3', description: 'Zero-based student expense ledger and monthly burn-rate analytics' },
  { id: 'resume', name: 'Phase 12: ATS Resume Builder & Parser', category: 'Academics & Career', description: 'Keyword matching, formatting validator, and score optimizer' },
  { id: 'internships', name: 'Phase 13: Internship & Job Application Tracker', category: 'Academics & Career', description: 'Kanban pipeline for application status and interview dates' },
  { id: 'mock-interview', name: 'Phase 14: AI Mock Interviewer & Speech Coach', category: 'AI & Neuro', description: 'Voice analysis, filler word detection, and technical evaluation' },
  { id: 'scholarships', name: 'Phase 15: Global Scholarship & Grant Matcher', category: 'Finance & Web3', description: 'Automated eligibility criteria matching and deadline alarms' },
  { id: 'portfolio', name: 'Phase 16: Interactive Developer Portfolio Generator', category: 'Academics & Career', description: 'Showcase projects, GitHub integrations, and live demos' },
  { id: 'alumni', name: 'Phase 17: Alumni Mentorship & Networking Network', category: 'Academics & Career', description: 'Warm introduction directory and industry mentor matching' },
  { id: 'micro-gigs', name: 'Phase 18: Campus Freelance & Micro-Gig Market', category: 'Finance & Web3', description: 'Peer-to-peer student skill marketplace with escrow settlement' },
  { id: 'career-roadmap', name: 'Phase 19: AI Skill Gap & Career Pathway Synthesizer', category: 'Academics & Career', description: 'Role requirement breakdown and targeted course sequencing' },
  { id: 'coding-lab', name: 'Phase 20: Cloud IDE & Algorithmic Sandbox', category: 'AI & Neuro', description: 'Multi-language code execution and algorithm visualizer' },

  // 21-30 Wellbeing, Social & Advanced Systems
  { id: 'sleep', name: 'Phase 21: Sleep Cycle & Circadian Optimizer', category: 'Bio & Health', description: 'REM cycle timing, sleep debt tracking, and wake-up alerts' },
  { id: 'meal-planner', name: 'Phase 22: Student Nutrition & Budget Meal Planner', category: 'Bio & Health', description: 'Micronutrient tracking and hostel-friendly budget recipes' },
  { id: 'mental-health', name: 'Phase 23: Cognitive Reframing & Mood Journal', category: 'Bio & Health', description: 'CBT reflection prompts, mood tracking, and stress mitigation' },
  { id: 'campus-events', name: 'Phase 24: Campus Hackathons & Event Radar', category: 'Academics & Career', description: 'Tech events, fests, hackathon team formation board' },
  { id: 'peer-tutoring', name: 'Phase 25: Peer Tutoring Exchange & Token Vault', category: 'Academics & Career', description: 'Knowledge barter system powered by academic time credits' },
  { id: 'library-manager', name: 'Phase 26: Library Book Tracker & ISBN Scanner', category: 'Academics & Career', description: 'Due date alerts, renewal automations, and ISBN book searches' },
  { id: 'roommate-hub', name: 'Phase 27: Roommate Chore & Expense Splitter', category: 'Academics & Career', description: 'Fair chore rotation matrix and split-bill settlement' },
  { id: 'lost-found', name: 'Phase 28: Smart Campus Lost & Found Registry', category: 'Academics & Career', description: 'Geo-tagged item reporting and claim verification' },
  { id: 'fitness-hub', name: 'Phase 29: Hostel Workout & Step Challenge', category: 'Bio & Health', description: 'Bodyweight routines, weekly leaderboard, and fitness logs' },
  { id: 'code-review', name: 'Phase 30: Automated Code Review & Clean Code Linter', category: 'AI & Neuro', description: 'Security vulnerability and complexity analysis' },

  // 31-40 Research, Bio & Data Intelligence
  { id: 'research-papers', name: 'Phase 31: Academic Paper Summary & ArXiv Radar', category: 'Academics & Career', description: 'Automated paper synthesis, citation maps, and BibTeX export' },
  { id: 'spaced-rep', name: 'Phase 32: SuperMemo SM-2 Spaced Repetition Engine', category: 'AI & Neuro', description: 'Optimal retention scheduling based on cognitive decay curves' },
  { id: 'pomodoro-analytics', name: 'Phase 33: Deep Work Biometrics & Heatmaps', category: 'Bio & Health', description: 'Attention span analytics and optimal focus window discovery' },
  { id: 'course-bidding', name: 'Phase 34: Elective Course Bidding Simulator', category: 'Academics & Career', description: 'Game-theoretic bid optimization for competitive university courses' },
  { id: 'crypto-grants', name: 'Phase 35: Web3 Student DAO & Grant Protocol', category: 'Finance & Web3', description: 'Decentralized research grants, voting governance, and smart vaults' },
  { id: 'speech-trainer', name: 'Phase 36: Rhetoric & Pitch Deck Presentation Lab', category: 'Academics & Career', description: 'Slide pacing, vocal modulation, and audience retention metrics' },
  { id: 'dataset-hub', name: 'Phase 37: Student Open Data & ML Model Registry', category: 'AI & Neuro', description: 'Dataset versioning, model weights, and performance benchmarks' },
  { id: 'patent-search', name: 'Phase 38: Prior Art Patent Search & IP Lab', category: 'Academics & Career', description: 'USPTO/WIPO semantic novelty search and claims breakdown' },
  { id: 'crowdfunding', name: 'Phase 39: Student Hardware Project Crowdfunder', category: 'Finance & Web3', description: 'Milestone-based community backing and prototype updates' },
  { id: 'neural-notes', name: 'Phase 40: Bidirectional Knowledge Graph (Zettelkasten)', category: 'AI & Neuro', description: 'Interactive network graph of interconnected concepts' },

  // 41-50 High-Tech, Simulators & Bio-Engineering
  { id: 'circuit-sim', name: 'Phase 41: SPICE Electronic Circuit Simulator', category: 'Physics & Space', description: 'AC/DC waveform analysis, RLC filters, and logic gates' },
  { id: 'satellite-tracker', name: 'Phase 42: LEO CubeSat & Orbital Mechanics Tracker', category: 'Physics & Space', description: 'TLE propagation, ground station pass prediction, Doppler shifts' },
  { id: 'protein-fold', name: 'Phase 43: AlphaFold Molecular Protein Visualizer', category: 'Bio & Health', description: '3D PDB viewer, Ramachandran plots, and binding pocket analysis' },
  { id: 'neurofeedback', name: 'Phase 44: EEG Frequency Band & Alpha-Wave Analyzer', category: 'Bio & Health', description: 'Real-time power spectral density and focus state detection' },
  { id: 'defi-sim', name: 'Phase 45: AMM Liquidity Pool & Flash Loan Sandbox', category: 'Finance & Web3', description: 'Uniswap v3 constant product formula and impermanent loss model' },
  { id: 'quantum-sim', name: 'Phase 46: Qubit Bloch Sphere & Quantum Circuit Lab', category: 'Physics & Space', description: 'Hadamard, CNOT, teleportation circuits, and state vector evolution' },
  { id: 'carbon-tracker', name: 'Phase 47: Student Carbon Footprint & Offset Ledger', category: 'Finance & Web3', description: 'Commute, diet, device energy emission audits' },
  { id: 'thesis-defense', name: 'Phase 48: AI Thesis Defense & Socratic Interrogator', category: 'Academics & Career', description: 'Adversarial academic questioning and methodology defense' },
  { id: 'smart-contract', name: 'Phase 49: Solidity Smart Contract Audit & Gas Linter', category: 'Finance & Web3', description: 'Reentrancy vulnerability scanner and gas opcode optimizer' },
  { id: 'bci-interface', name: 'Phase 50: Steady-State Visual Evoked Potential (SSVEP)', category: 'AI & Neuro', description: 'Brain-computer interface speller and FFT harmonics detector' },

  // 51-60 Advanced Sciences & Frontier Computing
  { id: 'fluid-dynamics', name: 'Phase 51: Navier-Stokes Computational Fluid Dynamics', category: 'Physics & Space', description: '2D grid lattice Boltzmann smoke and aerodynamic simulations' },
  { id: 'crispr-sim', name: 'Phase 52: CRISPR-Cas9 Guide RNA & Off-Target Scorer', category: 'Bio & Health', description: 'PAM recognition (NGG) and CFD off-target cut probability' },
  { id: 'astrophysics', name: 'Phase 53: N-Body Gravitational Galaxy Collisions', category: 'Physics & Space', description: 'Barnes-Hut tree algorithm and celestial trajectory integration' },
  { id: 'cyber-range', name: 'Phase 54: Offensive Security & CTF Exploit Sandbox', category: 'AI & Neuro', description: 'Buffer overflow, SQLi, and cryptographic challenge validator' },
  { id: 'synthetic-bio', name: 'Phase 55: Genetic Logic Gates & BioBrick Assembler', category: 'Bio & Health', description: 'Repressilator circuits, Hill kinetics, and synthetic plasmid maps' },
  { id: 'particle-physics', name: 'Phase 56: CERN LHC Particle Collision Track Explorer', category: 'Physics & Space', description: 'Lorentz force, invariant mass reconstruction, Higgs boson peaks' },
  { id: 'high-freq-trading', name: 'Phase 57: Quantitative Order Book & Market Microstructure', category: 'Finance & Web3', description: 'VWAP calculation, order flow imbalance, and slippage simulator' },
  { id: 'optics-lab', name: 'Phase 58: Laser Interferometer & Holography Simulator', category: 'Physics & Space', description: 'Michelson-Morley interference patterns and wave diffraction' },
  { id: 'reinforcement-learning', name: 'Phase 59: Deep Q-Network & CartPole Policy Gym', category: 'AI & Neuro', description: 'Live Bellman updates, epsilon-greedy decay, and policy loss' },
  { id: 'nanotech', name: 'Phase 60: Carbon Nanotube & Molecular Dynamics Rig', category: 'Physics & Space', description: 'Chiral vector indices (n,m), bandgap calculation, and tensile stress' },

  // 61-70 Deep Tech, Genomics & Complex Systems
  { id: 'fusion-plasma', name: 'Phase 61: Tokamak Magnetic Confinement & Plasma Torus', category: 'Physics & Space', description: 'Grad-Shafranov equilibrium and Lawson criterion ignition energy' },
  { id: 'genomic-assembly', name: 'Phase 62: De Bruijn Graph DNA Sequence Assembler', category: 'Bio & Health', description: 'K-mer frequency spectrum, Eulerian path reconstruction' },
  { id: 'superconductor', name: 'Phase 63: High-Tc Superconductor & Meissner Effect', category: 'Physics & Space', description: 'BCS energy gap, London penetration depth, magnetic levitation' },
  { id: 'swarm-robotics', name: 'Phase 64: Swarm Intelligence & Reynolds Boids Flocking', category: 'Robotics & IoT', description: 'Separation, alignment, and cohesion vector dynamics' },
  { id: 'metamaterials', name: 'Phase 65: Negative Refractive Index & Invisibility Cloak', category: 'Physics & Space', description: 'FDTD electrodynamics and transformation optics simulator' },
  { id: 'neuro-evolution', name: 'Phase 66: NEAT Topology Evolving Neural Networks', category: 'AI & Neuro', description: 'Genetic speciation, structural mutations, fitness landscapes' },
  { id: 'space-propulsion', name: 'Phase 67: Hall Effect Ion Thruster & Deep Space Flight', category: 'Physics & Space', description: 'Tsiolkovsky rocket equation, specific impulse (Isp), and delta-v' },
  { id: 'cryptanalysis', name: 'Phase 68: Lattice-Based Post-Quantum Cryptanalysis', category: 'AI & Neuro', description: 'Learning With Errors (LWE) and Shor algorithm quantum resistance' },
  { id: 'climate-model', name: 'Phase 69: Global General Circulation Climate System', category: 'Physics & Space', description: 'Albedo feedback loops, greenhouse forcing, oceanic heat sinks' },
  { id: 'exoskeleton', name: 'Phase 70: Biomechanical Exoskeleton Torque Optimizer', category: 'Robotics & IoT', description: 'Hill muscle model, joint torque assistance, metabolic reduction' },

  // 71-80 Quantum, Security & AI Systems
  { id: 'quantum-annealing', name: 'Phase 71: D-Wave Style Quantum Annealing Ising Solver', category: 'Physics & Space', description: 'QUBO quadratic unconstrained binary optimization for TSP' },
  { id: 'federated-learning', name: 'Phase 72: Privacy-Preserving Federated Learning Mesh', category: 'AI & Neuro', description: 'FedAvg aggregation, differential privacy epsilon noise injection' },
  { id: 'neuromorphic-snn', name: 'Phase 73: Spiking Neural Network Spike-Timing Plasticity', category: 'AI & Neuro', description: 'LIF neuron membrane potential dynamics and STDP synaptic weights' },
  { id: 'quantum-qkd', name: 'Phase 74: BB84 Quantum Key Distribution Protocol Sim', category: 'Physics & Space', description: 'Photon polarization basis reconciliation and eavesdropping bit error' },
  { id: 'paper-referee', name: 'Phase 75: Multi-Agent Peer Review & Citation Referee', category: 'Academics & Career', description: 'Autonomous reviewer critique synthesis and rebuttal engine' },
  { id: 'crispr-editor', name: 'Phase 76: Cas12/Cas13 Multi-Locus Transcriptome Modulator', category: 'Bio & Health', description: 'RNA-guided base editing, off-target energy landscapes' },
  { id: 'venture-safe', name: 'Phase 77: Student Startup Cap Table & SAFE Syndicate Vault', category: 'Finance & Web3', description: 'Pro-rata dilution, post-money SAFE conversion, term-sheet builder' },
  { id: 'fusion-tokamak', name: 'Phase 78: Plasma Equilibrium & Real-Time Magnetics Solver', category: 'Physics & Space', description: 'Poloidal magnetic flux, q-profile safety factor, divertor heat flux' },
  { id: 'bci-speller', name: 'Phase 79: P300 Oddball Brain-Computer Interface Speller', category: 'AI & Neuro', description: 'EEG ERP event-related potential averaging and real-time classification' },
  { id: 'legal-analyzer', name: 'Phase 80: Multi-Jurisdictional Legal Precedent Analyzer', category: 'Academics & Career', description: 'IRAC legal brief synthesis, statutory interpretation tree' },

  // 81-90 Frontier Science & Quantum Universe
  { id: 'exoplanet-photometry', name: 'Phase 81: Kepler/TESS Transit Light Curve Photometry', category: 'Physics & Space', description: 'Exoplanet radius estimation, limb darkening, and transit period fold' },
  { id: 'carbon-market', name: 'Phase 82: Verified Peer-to-Peer Campus Carbon Credit Market', category: 'Finance & Web3', description: 'Decentralized carbon credits, automated proof-of-transit validation' },
  { id: 'gravitational-waves', name: 'Phase 83: LIGO Matched-Filter Gravitational Wave Detector', category: 'Physics & Space', description: 'Chirp mass calculation, signal-to-noise ratio matched filtering' },
  { id: 'robotics-kinematics', name: 'Phase 84: 6-DOF Robotic Arm Inverse Kinematics & Trajectory', category: 'Robotics & IoT', description: 'Denavit-Hartenberg parameters, Jacobian velocity kinematics' },
  { id: 'epigenetic-clock', name: 'Phase 85: Horvath Multi-Tissue DNA Methylation Aging Clock', category: 'Bio & Health', description: 'CpG island methylation beta-value regression and biological age' },
  { id: 'hft-orderbook', name: 'Phase 86: Nanosecond L3 Order Book Matching Engine', category: 'Finance & Web3', description: 'Price-time priority matching, FPGA FIFO queue latency emulation' },
  { id: 'astrodynamics', name: 'Phase 87: Interplanetary Hohmann Transfer & Gravitational Slingshot', category: 'Physics & Space', description: 'Patched conics approximation, delta-v budget, planetary ephemeris' },
  { id: 'chemical-retro', name: 'Phase 88: Retrosynthetic Disconnection & Reaction Tree Explorer', category: 'Bio & Health', description: 'Synthons, functional group interconversions, forward synthesis' },
  { id: 'scholar-tracker', name: 'Phase 89: Global Academic Citation Graph & Impact Visualizer', category: 'Academics & Career', description: 'PageRank academic centrality, h-index projections, co-authorship maps' },
  { id: 'study-guild-dao', name: 'Phase 90: Decentralized Autonomous Study Guild & Quadratic Voting', category: 'Finance & Web3', description: 'Sybil-resistant quadratic voting, treasury disbursement, study bounties' },

  // 91-100 Grandmaster Century Suite
  { id: 'knowledge-olympiad', name: 'Phase 91: Global Student Olympiad & Real-Time ELO Battles', category: 'Academics & Career', description: 'Multiplayer competitive academic olympiad with live Elo matchmaking' },
  { id: 'kernel-profiler', name: 'Phase 92: SIMD & AVX-512 Vectorization Kernel Profiler', category: 'AI & Neuro', description: 'Roofline memory-compute model, cache miss penalty analysis' },
  { id: 'faculty-advisory', name: 'Phase 93: Academic Faculty Advisory & Office Hours Portal', category: 'Academics & Career', description: 'Research mentorship scheduling, thesis committee review queues' },
  { id: 'tutor-bounty', name: 'Phase 94: Real-Time Academic Problem Bounty & Micro-Escrow', category: 'Finance & Web3', description: 'Proof-of-solution verification with instant micro-payouts' },
  { id: 'study-swarm', name: 'Phase 95: Multi-Agent Autonomous Academic Swarm Coordinator', category: 'AI & Neuro', description: 'Collaborative autonomous LLM agents tackling complex problems' },
  { id: 'campus-exchange', name: 'Phase 96: Smart Campus Resource Exchange & Lost-Found', category: 'Academics & Career', description: 'Verified peer item exchange, drafters, calculators and textbooks' },
  { id: 'campus-incubator', name: 'Phase 97: Campus Startup Accelerator & Investor Demo Hub', category: 'Finance & Web3', description: 'Pitch decks, mentor advisory board, and equity-free angel grant pipeline' },
  { id: 'campus-transit', name: 'Phase 98: Real-Time Campus Transit & Multi-Modal Routing', category: 'Robotics & IoT', description: 'Live bus telemetry, EV shuttle slots, and optimized campus walking paths' },
  { id: 'mental-resilience', name: 'Phase 99: Student Mental Resilience & Biofeedback Sanctum', category: 'Bio & Health', description: 'Heart-rate variability coherence, guided breathing, mindfulness telemetry' },
  { id: 'century-grandmaster', name: 'Phase 100: Century Grandmaster Singularity Medallion', category: 'Academics & Career', description: '100-Module Master Transcript, Soulbound SHA-256 Passport & Medallion' },
];

interface CommandPaletteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPhase: (phaseId: string) => void;
  currentPhaseId?: string;
}

export const CommandPaletteModal: React.FC<CommandPaletteModalProps> = ({
  isOpen,
  onClose,
  onSelectPhase,
  currentPhaseId = 'dashboard',
}) => {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listContainerRef = useRef<HTMLDivElement>(null);

  const categories = ['All', 'AI & Neuro', 'Physics & Space', 'Bio & Health', 'Finance & Web3', 'Academics & Career', 'Robotics & IoT'];

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 60);
      setSelectedIndex(0);
      setQuery('');
    }
  }, [isOpen]);

  const filteredPhases = useMemo(() => {
    const q = query.toLowerCase().trim();
    return ALL_100_PHASES_META.filter((phase) => {
      const matchesCategory = selectedCategory === 'All' || phase.category === selectedCategory;
      const matchesQuery =
        !q ||
        phase.name.toLowerCase().includes(q) ||
        phase.id.toLowerCase().includes(q) ||
        phase.description.toLowerCase().includes(q) ||
        phase.category.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [query, selectedCategory]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % (filteredPhases.length || 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filteredPhases.length) % (filteredPhases.length || 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredPhases[selectedIndex]) {
          onSelectPhase(filteredPhases[selectedIndex].id);
          onClose();
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredPhases, selectedIndex, onSelectPhase, onClose]);

  // Keep active item in view during keyboard navigation
  useEffect(() => {
    if (listContainerRef.current) {
      const activeEl = listContainerRef.current.children[selectedIndex] as HTMLElement;
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }
  }, [selectedIndex]);

  if (!isOpen) return null;

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'AI & Neuro': return <Brain size={16} color="#c084fc" />;
      case 'Physics & Space': return <Atom size={16} color="#38bdf8" />;
      case 'Bio & Health': return <Dna size={16} color="#34d399" />;
      case 'Finance & Web3': return <TrendingUp size={16} color="#fbbf24" />;
      case 'Robotics & IoT': return <Bot size={16} color="#f43f5e" />;
      default: return <Award size={16} color="#818cf8" />;
    }
  };

  const getCategoryBadgeColor = (category: string) => {
    switch (category) {
      case 'AI & Neuro': return { bg: 'rgba(192, 132, 252, 0.15)', text: '#c084fc', border: 'rgba(192, 132, 252, 0.3)' };
      case 'Physics & Space': return { bg: 'rgba(56, 189, 248, 0.15)', text: '#38bdf8', border: 'rgba(56, 189, 248, 0.3)' };
      case 'Bio & Health': return { bg: 'rgba(52, 211, 153, 0.15)', text: '#34d399', border: 'rgba(52, 211, 153, 0.3)' };
      case 'Finance & Web3': return { bg: 'rgba(251, 191, 36, 0.15)', text: '#fbbf24', border: 'rgba(251, 191, 36, 0.3)' };
      case 'Robotics & IoT': return { bg: 'rgba(244, 63, 94, 0.15)', text: '#f43f5e', border: 'rgba(244, 63, 94, 0.3)' };
      default: return { bg: 'rgba(129, 140, 248, 0.15)', text: '#818cf8', border: 'rgba(129, 140, 248, 0.3)' };
    }
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        backgroundColor: 'rgba(4, 7, 18, 0.78)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        animation: 'fadeIn 0.2s ease-out'
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '720px',
          maxHeight: '82vh',
          backgroundColor: 'rgba(13, 19, 36, 0.96)',
          border: '1px solid rgba(99, 102, 241, 0.28)',
          borderRadius: '20px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 40px rgba(99, 102, 241, 0.18)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          animation: 'slideUp 0.22s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        {/* Search Header */}
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            backgroundColor: 'rgba(9, 14, 28, 0.7)'
          }}
        >
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: 'rgba(99, 102, 241, 0.15)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            flexShrink: 0
          }}>
            <Search size={18} color="#818cf8" />
          </div>

          <input
            ref={inputRef}
            type="text"
            placeholder="Search across all 100 phases, tools & subjects... (e.g. 'quantum', 'robotics', 'hft')"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: '#ffffff',
              fontSize: '1.02rem',
              fontWeight: 500,
              fontFamily: 'inherit',
              padding: '6px 0',
              caretColor: '#818cf8'
            }}
          />

          {query && (
            <button
              onClick={() => setQuery('')}
              style={{
                background: 'rgba(255, 255, 255, 0.06)',
                border: 'none',
                borderRadius: '8px',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                padding: '5px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.15s ease'
              }}
            >
              <X size={15} />
            </button>
          )}

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '4px 8px',
              borderRadius: '6px',
              backgroundColor: 'rgba(255, 255, 255, 0.07)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: 'var(--text-muted)',
              fontSize: '0.72rem',
              fontWeight: 700,
              fontFamily: 'monospace',
              letterSpacing: '0.05em'
            }}
          >
            ESC
          </div>
        </div>

        {/* Category Pills Bar */}
        <div
          style={{
            padding: '10px 16px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            overflowX: 'auto',
            backgroundColor: 'rgba(9, 14, 28, 0.4)',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}
        >
          <Compass size={15} color="var(--text-muted)" style={{ flexShrink: 0, marginRight: '4px' }} />
          {categories.map((cat) => {
            const isCatActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setSelectedIndex(0);
                }}
                style={{
                  padding: '5px 12px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.75rem',
                  fontWeight: isCatActive ? 700 : 500,
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                  border: isCatActive ? '1px solid rgba(99, 102, 241, 0.6)' : '1px solid rgba(255, 255, 255, 0.07)',
                  background: isCatActive ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : 'rgba(255, 255, 255, 0.04)',
                  color: isCatActive ? '#ffffff' : 'var(--text-secondary)',
                  boxShadow: isCatActive ? '0 0 12px rgba(99, 102, 241, 0.4)' : 'none',
                  transition: 'all 0.15s ease'
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Results List */}
        <div
          ref={listContainerRef}
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '10px 14px',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
            scrollbarWidth: 'thin',
            scrollbarColor: 'rgba(255, 255, 255, 0.2) transparent'
          }}
        >
          {filteredPhases.length === 0 ? (
            <div style={{ padding: '48px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
              <Sparkles size={32} style={{ margin: '0 auto 10px', color: 'var(--accent-primary)', opacity: 0.6 }} />
              <p style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                No phases found matching "{query}"
              </p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                Try searching by topic, module number, or selecting a different category.
              </p>
            </div>
          ) : (
            filteredPhases.map((phase, idx) => {
              const isSelected = idx === selectedIndex;
              const isCurrent = phase.id === currentPhaseId;
              const badgeStyle = getCategoryBadgeColor(phase.category);

              return (
                <div
                  key={phase.id}
                  onClick={() => {
                    onSelectPhase(phase.id);
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  style={{
                    padding: '10px 14px',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px',
                    border: isSelected ? '1px solid rgba(99, 102, 241, 0.45)' : '1px solid transparent',
                    background: isSelected
                      ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.16) 0%, rgba(139, 92, 246, 0.08) 100%)'
                      : 'rgba(255, 255, 255, 0.02)',
                    boxShadow: isSelected ? '0 0 15px rgba(99, 102, 241, 0.18)' : 'none',
                    transition: 'all 0.12s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                    <div
                      style={{
                        width: '34px',
                        height: '34px',
                        borderRadius: '9px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: isSelected ? 'rgba(99, 102, 241, 0.25)' : 'rgba(255, 255, 255, 0.05)',
                        border: `1px solid ${isSelected ? 'rgba(99, 102, 241, 0.4)' : 'rgba(255, 255, 255, 0.08)'}`,
                        flexShrink: 0
                      }}
                    >
                      {getCategoryIcon(phase.category)}
                    </div>

                    <div style={{ minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '0.88rem', fontWeight: 700, color: isSelected ? '#ffffff' : 'var(--text-primary)' }}>
                          {phase.name}
                        </span>

                        {isCurrent && (
                          <span
                            style={{
                              fontSize: '0.62rem',
                              fontWeight: 800,
                              padding: '2px 6px',
                              borderRadius: '4px',
                              background: 'rgba(16, 185, 129, 0.15)',
                              border: '1px solid rgba(16, 185, 129, 0.3)',
                              color: '#34d399'
                            }}
                          >
                            ACTIVE
                          </span>
                        )}

                        <span
                          style={{
                            fontSize: '0.66rem',
                            fontWeight: 600,
                            padding: '2px 7px',
                            borderRadius: 'var(--radius-full)',
                            background: badgeStyle.bg,
                            border: `1px solid ${badgeStyle.border}`,
                            color: badgeStyle.text
                          }}
                        >
                          {phase.category}
                        </span>
                      </div>

                      <p
                        style={{
                          fontSize: '0.75rem',
                          color: 'var(--text-secondary)',
                          margin: '3px 0 0 0',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}
                      >
                        {phase.description}
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                    {isSelected ? (
                      <span
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          color: '#818cf8',
                          fontFamily: 'monospace',
                          background: 'rgba(99, 102, 241, 0.15)',
                          padding: '3px 7px',
                          borderRadius: '6px'
                        }}
                      >
                        <span>Select</span>
                        <CornerDownLeft size={12} />
                      </span>
                    ) : (
                      <ArrowRight size={14} color="var(--text-muted)" opacity={0.6} />
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div
          style={{
            padding: '12px 18px',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            backgroundColor: 'rgba(9, 14, 28, 0.85)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.75rem',
            color: 'var(--text-muted)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <kbd style={{ padding: '2px 5px', borderRadius: '4px', background: 'rgba(255, 255, 255, 0.08)', color: '#ffffff', fontFamily: 'monospace', fontSize: '0.7rem' }}>↑</kbd>
              <kbd style={{ padding: '2px 5px', borderRadius: '4px', background: 'rgba(255, 255, 255, 0.08)', color: '#ffffff', fontFamily: 'monospace', fontSize: '0.7rem' }}>↓</kbd>
              <span>to navigate</span>
            </span>

            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <kbd style={{ padding: '2px 6px', borderRadius: '4px', background: 'rgba(255, 255, 255, 0.08)', color: '#ffffff', fontFamily: 'monospace', fontSize: '0.7rem' }}>↵</kbd>
              <span>to open</span>
            </span>

            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <kbd style={{ padding: '2px 6px', borderRadius: '4px', background: 'rgba(255, 255, 255, 0.08)', color: '#ffffff', fontFamily: 'monospace', fontSize: '0.7rem' }}>ESC</kbd>
              <span>to close</span>
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#818cf8', fontWeight: 700 }}>
            <Zap size={14} />
            <span>100 Modules Indexed</span>
          </div>
        </div>
      </div>
    </div>
  );
};
