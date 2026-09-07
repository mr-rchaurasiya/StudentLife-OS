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

  // 71-80 Grand Frontier Systems
  { id: 'dark-matter', name: 'Phase 71: Dark Matter Halo & Gravitational Lensing', category: 'Physics & Space', description: 'NFW profile, Einstein rings, and galaxy rotation curves' },
  { id: 'synthetic-organism', name: 'Phase 72: Minimal Genome & Cellular Metabolic Flux', category: 'Bio & Health', description: 'FBA flux balance analysis and stoichiometric ATP yields' },
  { id: 'quantum-annealing', name: 'Phase 73: D-Wave Ising Model & QUBO Combinatorial Solver', category: 'Physics & Space', description: 'Transverse field quantum tunneling and TSP energy landscapes' },
  { id: 'brain-tumor-ai', name: 'Phase 74: AI Brain MRI Tumor Segmentation & Neuro-Radiology', category: 'AI & Neuro', description: 'U-Net semantic dice scores and 3D slice voxel rendering' },
  { id: 'carbon-capture', name: 'Phase 75: Direct Air Capture & MOF Thermodynamic Sorbent', category: 'Physics & Space', description: 'Langmuir adsorption isotherms and thermal swing regeneration' },
  { id: 'neural-radiance', name: 'Phase 76: NeRF Volumetric 3D Scene Reconstruction', category: 'AI & Neuro', description: 'Positional encoding, ray marching, and photometric loss' },
  { id: 'cellular-automata', name: 'Phase 77: Complex Self-Organizing Wolfram Rule Systems', category: 'AI & Neuro', description: 'Class 4 computation universality and entropy gradients' },
  { id: 'microfluidics', name: 'Phase 78: Lab-on-a-Chip Droplet & Poiseuille Flow', category: 'Bio & Health', description: 'Capillary numbers, Dean vortices, and laminar diffusion' },
  { id: 'nuclear-fission', name: 'Phase 79: Fast Breeder Reactor & Delayed Neutron Kinetics', category: 'Physics & Space', description: 'Point reactor kinetics and reactivity temperature coefficient' },
  { id: 'multimodal-rag', name: 'Phase 80: Multimodal Knowledge Graph & Vector Hybrid Search', category: 'AI & Neuro', description: 'Hierarchical HNSW vector search and cross-attention fusion' },

  // 81-90 Singularity, Neuro-Bio & Enterprise Web3
  { id: 'neuromorphic-snn', name: 'Phase 81: Neuromorphic Spiking Neural Network (SNN)', category: 'AI & Neuro', description: 'Leaky Integrate-and-Fire (LIF) and STDP synaptic plasticity' },
  { id: 'qkd-network', name: 'Phase 82: Quantum Key Distribution (BB84 & E91 Protocol)', category: 'Physics & Space', description: 'Single-photon polarization, quantum bit error rate (QBER)' },
  { id: 'paper-referee', name: 'Phase 83: Autonomous Peer-Review & Socratic Paper Referee', category: 'Academics & Career', description: 'Methodological rigor scoring and statistical fallacy detection' },
  { id: 'crispr-designer', name: 'Phase 84: Prime Editing & CRISPR-Cas12 Off-Target Engine', category: 'Bio & Health', description: 'PegRNA reverse transcriptase templates and nickase efficiency' },
  { id: 'venture-safe', name: 'Phase 85: Student Startup SAFE Note & Cap Table Simulator', category: 'Finance & Web3', description: 'Post-money SAFE, valuation caps, and pro-rata investor dilution' },
  { id: 'synthetic-neural-net', name: 'Phase 86: Neuromorphic Spike Timing Plasticity Matrix', category: 'AI & Neuro', description: 'Hardware-level millivolt membrane potentials and spike rasters' },
  { id: 'quantum-telemetry', name: 'Phase 87: Quantum Entanglement Telemetry & Bell State Verifier', category: 'Physics & Space', description: 'CHSH inequality violation ($S > 2$) and eavesdropper detection' },
  { id: 'meta-referee', name: 'Phase 88: Socratic Peer-Review & Reproducibility Assessor', category: 'Academics & Career', description: 'Reproducibility checklists and p-hacking statistical audits' },
  { id: 'prime-editing', name: 'Phase 89: Next-Gen Prime Editing & Base Substitution Designer', category: 'Bio & Health', description: 'Adenine/Cytosine base editors and precision genomic repairs' },
  { id: 'startup-cap-table', name: 'Phase 90: Cap Table Waterfall & Dilution Sensitivity Model', category: 'Finance & Web3', description: 'Series A/B convertible rounds and liquidation preference math' },

  // 91-100 Century Grandmaster Horizon
  { id: 'fusion-tokamak', name: 'Phase 91: Magnetic Tokamak Plasma & Lawson Criterion', category: 'Physics & Space', description: 'Triple product $n T \tau_E$, beta limit, and toroidal equilibrium' },
  { id: 'bci-speller', name: 'Phase 92: P300 BCI EEG Neuro-Speller & Cognitive Decoder', category: 'AI & Neuro', description: 'Oddball visual paradigm, signal averaging, and live typing' },
  { id: 'legal-contracts', name: 'Phase 93: Autonomous Legal Contract Analyzer & Risk Auditor', category: 'Academics & Career', description: 'Indemnification loops, non-competes, and IP assignment clauses' },
  { id: 'exoplanet-transit', name: 'Phase 94: Exoplanet Transit Photometry & Kepler Lightcurve', category: 'Physics & Space', description: 'Transit depth $(R_p/R_*)^2$, orbital period, and habitable zone' },
  { id: 'carbon-market', name: 'Phase 95: Real-Time Carbon Offset Credit Marketplace', category: 'Finance & Web3', description: 'Verra/Gold Standard verified registry and liquidity book' },
  { id: 'gravitational-waves', name: 'Phase 96: Gravitational Wave Interferometry & Ringdown', category: 'Physics & Space', description: 'LIGO/Virgo strain $h(t)$, Chirp Mass $\mathcal{M}$, Inspiral-Merger' },
  { id: 'robotics-kinematics', name: 'Phase 97: Autonomous 6-DOF Robotic Arm Inverse Kinematics', category: 'Robotics & IoT', description: 'DH parameter matrices, Jacobian velocity solvers, trajectory planning' },
  { id: 'epigenetic-clock', name: 'Phase 98: Epigenetic DNA Methylation & Longevity Clock', category: 'Bio & Health', description: 'Horvath multi-tissue biological clock and CpG beta-value regression' },
  { id: 'hft-orderbook', name: 'Phase 99: High-Frequency Algorithmic Order Book (L2/L3)', category: 'Finance & Web3', description: 'Sub-microsecond Price-Time FIFO matching engine & depth ladders' },
  { id: 'century-grandmaster', name: 'Phase 100: Century Grandmaster Singularity Medallion', category: 'Academics & Career', description: '100-Module Master Transcript, Soulbound SHA-256 Passport & Medallion' },
];

interface CommandPaletteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPhase: (phaseId: string) => void;
  currentPhaseId: string;
}

export const CommandPaletteModal: React.FC<CommandPaletteModalProps> = ({
  isOpen,
  onClose,
  onSelectPhase,
  currentPhaseId,
}) => {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const categories = ['All', 'AI & Neuro', 'Physics & Space', 'Bio & Health', 'Finance & Web3', 'Academics & Career', 'Robotics & IoT'];

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelectedIndex(0);
    }
  }, [isOpen]);

  const filteredPhases = useMemo(() => {
    const q = query.toLowerCase().trim();
    return ALL_100_PHASES_META.filter(phase => {
      const matchesCategory = selectedCategory === 'All' || phase.category === selectedCategory;
      const matchesQuery = !q || 
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
        setSelectedIndex(prev => (prev + 1) % (filteredPhases.length || 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + filteredPhases.length) % (filteredPhases.length || 1));
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

  if (!isOpen) return null;

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'AI & Neuro': return <Brain className="w-3.5 h-3.5 text-purple-400" />;
      case 'Physics & Space': return <Atom className="w-3.5 h-3.5 text-blue-400" />;
      case 'Bio & Health': return <Dna className="w-3.5 h-3.5 text-emerald-400" />;
      case 'Finance & Web3': return <TrendingUp className="w-3.5 h-3.5 text-amber-400" />;
      case 'Robotics & IoT': return <Bot className="w-3.5 h-3.5 text-rose-400" />;
      default: return <Award className="w-3.5 h-3.5 text-indigo-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div 
        className="w-full max-w-3xl bg-slate-900/95 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh] backdrop-blur-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header */}
        <div className="p-4 border-b border-slate-800 flex items-center gap-3 bg-slate-950/60">
          <Search className="w-5 h-5 text-indigo-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a command or search across all 100 phases... (e.g., 'quantum', 'robotics', 'epigenetic', 'hft')"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            className="w-full bg-transparent text-white placeholder-slate-400 text-base focus:outline-none"
          />
          {query && (
            <button 
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-slate-800 text-slate-400 text-xs font-mono">
            <span>ESC</span>
          </div>
        </div>

        {/* Category Pills */}
        <div className="px-4 py-2 border-b border-slate-800/80 flex items-center gap-2 overflow-x-auto no-scrollbar bg-slate-900/50">
          <Compass className="w-4 h-4 text-slate-400 shrink-0" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setSelectedIndex(0);
              }}
              className={`px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                  : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1 divide-y divide-slate-800/40">
          {filteredPhases.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <Sparkles className="w-8 h-8 mx-auto text-slate-600 mb-2" />
              <p className="text-sm">No phases found matching "{query}"</p>
              <p className="text-xs text-slate-500 mt-1">Try searching by topic, number, or category.</p>
            </div>
          ) : (
            filteredPhases.map((phase, idx) => {
              const isSelected = idx === selectedIndex;
              const isCurrent = phase.id === currentPhaseId;

              return (
                <div
                  key={phase.id}
                  onClick={() => {
                    onSelectPhase(phase.id);
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`px-3 py-2.5 rounded-xl cursor-pointer flex items-center justify-between gap-3 transition-all ${
                    isSelected 
                      ? 'bg-indigo-600/20 border border-indigo-500/40 text-white' 
                      : 'hover:bg-slate-800/50 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`p-2 rounded-lg ${
                      isSelected ? 'bg-indigo-500/30 text-indigo-300' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {getCategoryIcon(phase.category)}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm text-white truncate">{phase.name}</span>
                        {isCurrent && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                            Active
                          </span>
                        )}
                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-800/80 text-slate-400 hidden sm:inline-block">
                          {phase.category}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 truncate mt-0.5">
                        {phase.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {isSelected ? (
                      <span className="flex items-center gap-1 text-xs text-indigo-400 font-mono">
                        <span>Select</span>
                        <CornerDownLeft className="w-3.5 h-3.5" />
                      </span>
                    ) : (
                      <ArrowRight className="w-4 h-4 text-slate-600" />
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">↑</kbd>
              <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">↓</kbd>
              <span>to navigate</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">↵</kbd>
              <span>to select</span>
            </span>
          </div>
          <div className="flex items-center gap-2 text-indigo-400 font-medium">
            <Zap className="w-3.5 h-3.5" />
            <span>100 Modules Indexed</span>
          </div>
        </div>
      </div>
    </div>
  );
};
