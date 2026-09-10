import React, { useState, useEffect, useRef } from 'react';
import {
  GraduationCap,
  BookOpen,
  FileCheck2,
  FileCheck,
  Briefcase,
  Sparkles,
  Clock,
  LayoutDashboard,
  Calendar,
  Layers,
  FileText,
  RotateCcw,
  Target,
  TrendingUp,
  Compass,
  Award,
  Bell,
  Users,
  Users2,
  Trophy,
  Scan,
  Sun,
  Mic,
  Network,
  Swords,
  Highlighter,
  Trees,
  Code2,
  Globe,
  Presentation,
  ShoppingBag,
  Landmark,
  Wallet,
  Cpu,
  Palette,
  ShieldCheck,
  FileSearch,
  Scale,
  PackageSearch,
  Video,
  Eye,
  Bot,
  Waves,
  Utensils,
  FileCode2,
  Coins,
  Printer,
  Rocket,
  Bus,
  HeartPulse,
  Atom,
  Zap,
  MapPin,
  Languages,
  FlaskConical,
  Crown,
  Vote,
  Key,
  Scissors,
  Leaf,
  Orbit,
} from 'lucide-react';

import { LucideIcon } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export type ViewType =
  | 'DASHBOARD'
  | 'PLANNER'
  | 'SYLLABUS'
  | 'NOTES'
  | 'AI_STUDY'
  | 'REVISION'
  | 'EXAM_PREP'
  | 'QUESTION_BANK'
  | 'MOCK_TEST'
  | 'ANALYTICS'
  | 'CAREER'
  | 'RESUME'
  | 'INTERNSHIPS'
  | 'SCHOLARSHIPS'
  | 'DEADLINES'
  | 'AI_MENTOR'
  | 'COMMUNITY'
  | 'LEADERBOARD'
  | 'OCR_SCANNER'
  | 'STUDY_ROOMS'
  | 'VOICE_TUTOR'
  | 'CONCEPT_GRAPH'
  | 'QUIZ_BATTLE'
  | 'DOCUMENT_ANNOTATOR'
  | 'CUSTOM_PAPER'
  | 'FOCUS_GARDEN'
  | 'AI_PODCAST'
  | 'CODE_SANDBOX'
  | 'RANK_PREDICTOR'
  | 'VIRTUAL_CAMPUS'
  | 'SLIDE_GENERATOR'
  | 'MOCK_INTERVIEW'
  | 'NOTES_MARKETPLACE'
  | 'CIRCADIAN_FOCUS'
  | 'EXAM_TREND'
  | 'AI_WHITEBOARD'
  | 'STUDENT_FINANCES'
  | 'HOLO_SIMULATIONS'
  | 'SKILL_PASSPORT'
  | 'ARXIV_SCHOLAR'
  | 'SOCRATIC_DEBATE'
  | 'CAMPUS_EXCHANGE'
  | 'VIDEO_NAVIGATOR'
  | 'ERGONOMIC_WELLNESS'
  | 'RESEARCH_LAB'
  | 'NEURAL_FLOW'
  | 'HOSTEL_NUTRITION'
  | 'LATEX_STUDIO'
  | 'HACKATHON_RADAR'
  | 'PATENT_DRAFTER'
  | 'FACULTY_ADVISORY'
  | 'TUTOR_BOUNTY'
  | 'CAMPUS_PRINTING'
  | 'ALUMNI_RADAR'
  | 'STUDY_SWARM'
  | 'CAMPUS_INCUBATOR'
  | 'CAMPUS_TRANSIT'
  | 'MENTAL_RESILIENCE'
  | 'QUANTUM_LAB'
  | 'FELLOWSHIP_DRAFTER'
  | 'HACKATHON_WAR_ROOM'
  | 'SPEED_READER'
  | 'ACADEMIC_INTEGRITY'
  | 'CAMPUS_DIGITAL_TWIN'
  | 'POLYGLOT_TRANSLATOR'
  | 'LAB_NOTEBOOK'
  | 'ANKI_FSRS'
  | 'MICRO_INTERNSHIP'
  | 'KNOWLEDGE_OLYMPIAD'
  | 'KERNEL_PROFILER'
  | 'ASTRODYNAMICS'
  | 'CHEMICAL_RETRO'
  | 'SCHOLAR_TRACKER'
  | 'STUDY_GUILD_DAO'
  | 'NEUROMORPHIC_SNN'
  | 'QUANTUM_QKD'
  | 'PAPER_REFEREE'
  | 'CRISPR_EDITOR'
  | 'VENTURE_SAFE'
  | 'FUSION_TOKAMAK'
  | 'BCI_SPELLER'
  | 'LEGAL_ANALYZER'
  | 'EXOPLANET_PHOTOMETRY'
  | 'CARBON_MARKET'
  | 'GRAVITATIONAL_WAVES'
  | 'ROBOTICS_KINEMATICS'
  | 'EPIGENETIC_CLOCK'
  | 'HFT_ORDERBOOK'
  | 'CENTURY_GRANDMASTER'
  | 'LIVE_VOICE_TUTOR'
  | 'VIDEO_MOCK_INTERVIEW'
  | 'VISUAL_MINDMAP'
  | 'LIVE_PORTFOLIO'
  | 'ROADMAP';

export interface NavItem {
  id: ViewType;
  label: string;
  icon: LucideIcon;
  iconColor?: string;
  activeGradient?: string;
}

export interface NavCategory {
  id: string;
  label: string;
  shortLabel: string;
  icon: LucideIcon;
  accentColor: string;
  items: NavItem[];
}

export const NAVIGATION_GROUPS: NavCategory[] = [
  {
    id: 'ACADEMICS',
    label: 'Academics & Exams',
    shortLabel: '📚 Academics',
    icon: BookOpen,
    accentColor: '#38bdf8',
    items: [
      { id: 'PLANNER', label: 'Planner', icon: Calendar, iconColor: '#38bdf8' },
      { id: 'SYLLABUS', label: 'Syllabus', icon: BookOpen, iconColor: '#818cf8' },
      { id: 'NOTES', label: 'Notes Hub', icon: FileText, iconColor: '#a78bfa' },
      { id: 'REVISION', label: 'SM-2 Revision', icon: RotateCcw, iconColor: '#34d399', activeGradient: 'linear-gradient(135deg, #10b981, #059669)' },
      { id: 'EXAM_PREP', label: 'Exam Prep', icon: Target, iconColor: '#22d3ee', activeGradient: 'linear-gradient(135deg, #06b6d4, #0284c7)' },
      { id: 'QUESTION_BANK', label: 'PYQ Bank', icon: BookOpen, iconColor: '#818cf8', activeGradient: 'linear-gradient(135deg, #6366f1, #8b5cf6)' },
      { id: 'MOCK_TEST', label: 'Mock Tests', icon: Clock, iconColor: '#fbbf24', activeGradient: 'linear-gradient(135deg, #f59e0b, #ef4444)' },
      { id: 'CUSTOM_PAPER', label: 'Paper Synthesizer 📜', icon: FileText, iconColor: '#fbbf24', activeGradient: 'linear-gradient(135deg, #f59e0b, #ef4444)' },
      { id: 'RANK_PREDICTOR', label: 'AIR Predictor 🎯', icon: TrendingUp, iconColor: '#f43f5e', activeGradient: 'linear-gradient(135deg, #f43f5e, #e11d48)' },
      { id: 'EXAM_TREND', label: 'Exam Trends 🔮', icon: TrendingUp, iconColor: '#c084fc', activeGradient: 'linear-gradient(135deg, #a855f7, #ec4899)' },
      { id: 'ANKI_FSRS', label: 'Anki FSRS Sync 🔄', icon: RotateCcw, iconColor: '#38bdf8', activeGradient: 'linear-gradient(135deg, #0284c7, #0369a1)' },
      { id: 'ACADEMIC_INTEGRITY', label: 'Academic Integrity 🛡️', icon: ShieldCheck, iconColor: '#34d399', activeGradient: 'linear-gradient(135deg, #10b981, #059669)' },
      { id: 'ANALYTICS', label: 'Analytics', icon: TrendingUp, iconColor: '#34d399', activeGradient: 'linear-gradient(135deg, #10b981, #06b6d4)' },
    ],
  },
  {
    id: 'AI_STUDY',
    label: 'AI Study & Smart Tools',
    shortLabel: '🤖 AI Copilot',
    icon: Sparkles,
    accentColor: '#f472b6',
    items: [
      { id: 'AI_STUDY', label: 'AI Study Assistant', icon: Sparkles, iconColor: '#f472b6', activeGradient: 'linear-gradient(135deg, #ec4899, #8b5cf6)' },
      { id: 'AI_MENTOR', label: 'AI Mentor 360°', icon: Sparkles, iconColor: '#c084fc', activeGradient: 'linear-gradient(135deg, #a855f7, #7c3aed)' },
      { id: 'VOICE_TUTOR', label: 'Voice Tutor 🎙️', icon: Mic, iconColor: '#f472b6', activeGradient: 'linear-gradient(135deg, #ec4899, #8b5cf6)' },
      { id: 'LIVE_VOICE_TUTOR', label: 'Voice Mentor 🎙️', icon: Mic, iconColor: '#f43f5e', activeGradient: 'linear-gradient(135deg, #f43f5e, #8b5cf6)' },
      { id: 'VISUAL_MINDMAP', label: 'Mindmap Canvas 🗺️', icon: Network, iconColor: '#06b6d4', activeGradient: 'linear-gradient(135deg, #06b6d4, #6366f1)' },
      { id: 'AI_PODCAST', label: 'AI Podcast 🎙️', icon: Mic, iconColor: '#ec4899', activeGradient: 'linear-gradient(135deg, #ec4899, #be185d)' },
      { id: 'SOCRATIC_DEBATE', label: 'Socratic Debate ⚖️', icon: Scale, iconColor: '#c084fc', activeGradient: 'linear-gradient(135deg, #a855f7, #6366f1)' },
      { id: 'CONCEPT_GRAPH', label: 'Mind Map Graph 🕸️', icon: Network, iconColor: '#38bdf8', activeGradient: 'linear-gradient(135deg, #0284c7, #6366f1)' },
      { id: 'AI_WHITEBOARD', label: 'AI Whiteboard 🎨', icon: Palette, iconColor: '#38bdf8', activeGradient: 'linear-gradient(135deg, #06b6d4, #3b82f6)' },
      { id: 'DOCUMENT_ANNOTATOR', label: 'PDF Annotator 📝', icon: Highlighter, iconColor: '#22d3ee', activeGradient: 'linear-gradient(135deg, #06b6d4, #0891b2)' },
      { id: 'OCR_SCANNER', label: 'OCR Scanner', icon: Scan, iconColor: '#22d3ee', activeGradient: 'linear-gradient(135deg, #06b6d4, #0d9488)' },
      { id: 'VIDEO_NAVIGATOR', label: 'Video Navigator 🎬', icon: Video, iconColor: '#f472b6', activeGradient: 'linear-gradient(135deg, #ec4899, #db2777)' },
      { id: 'SPEED_READER', label: 'Speed Reader ⚡', icon: Zap, iconColor: '#fbbf24', activeGradient: 'linear-gradient(135deg, #f59e0b, #d97706)' },
      { id: 'POLYGLOT_TRANSLATOR', label: 'Polyglot Translator 🌐', icon: Languages, iconColor: '#c084fc', activeGradient: 'linear-gradient(135deg, #a855f7, #7c3aed)' },
      { id: 'SLIDE_GENERATOR', label: 'Slide Studio 📊', icon: Presentation, iconColor: '#c084fc', activeGradient: 'linear-gradient(135deg, #a855f7, #7c3aed)' },
    ],
  },
  {
    id: 'CAREER',
    label: 'Career & Opportunities',
    shortLabel: '💼 Career & Gigs',
    icon: Briefcase,
    accentColor: '#fbbf24',
    items: [
      { id: 'CAREER', label: 'Career Intel', icon: Briefcase, iconColor: '#fbbf24', activeGradient: 'linear-gradient(135deg, #f59e0b, #d97706)' },
      { id: 'LIVE_PORTFOLIO', label: 'Public Portfolio 🌐', icon: Globe, iconColor: '#818cf8', activeGradient: 'linear-gradient(135deg, #6366f1, #4f46e5)' },
      { id: 'VIDEO_MOCK_INTERVIEW', label: 'Video Interview 🎯', icon: Video, iconColor: '#f43f5e', activeGradient: 'linear-gradient(135deg, #f43f5e, #e11d48)' },
      { id: 'RESUME', label: 'Resume & ATS', icon: FileCheck2, iconColor: '#34d399', activeGradient: 'linear-gradient(135deg, #10b981, #6366f1)' },
      { id: 'INTERNSHIPS', label: 'Internships', icon: Compass, iconColor: '#22d3ee', activeGradient: 'linear-gradient(135deg, #06b6d4, #3b82f6)' },
      { id: 'SCHOLARSHIPS', label: 'Scholarships', icon: Award, iconColor: '#34d399', activeGradient: 'linear-gradient(135deg, #10b981, #f59e0b)' },
      { id: 'MOCK_INTERVIEW', label: 'Viva & Interview 🎙️', icon: Mic, iconColor: '#22d3ee', activeGradient: 'linear-gradient(135deg, #06b6d4, #0891b2)' },
      { id: 'STUDENT_FINANCES', label: 'Finances & Gigs 💳', icon: Wallet, iconColor: '#34d399', activeGradient: 'linear-gradient(135deg, #10b981, #059669)' },
      { id: 'MICRO_INTERNSHIP', label: 'Micro-Gigs Escrow 💼', icon: Briefcase, iconColor: '#fbbf24', activeGradient: 'linear-gradient(135deg, #f59e0b, #b45309)' },
      { id: 'CAMPUS_INCUBATOR', label: 'Startup Incubator 🚀', icon: Rocket, iconColor: '#fbbf24', activeGradient: 'linear-gradient(135deg, #f59e0b, #d97706)' },
      { id: 'FELLOWSHIP_DRAFTER', label: 'Fellowship Drafter 🏅', icon: GraduationCap, iconColor: '#fbbf24', activeGradient: 'linear-gradient(135deg, #f59e0b, #ea580c)' },
      { id: 'SKILL_PASSPORT', label: 'Skill Passport 🎖️', icon: ShieldCheck, iconColor: '#fbbf24', activeGradient: 'linear-gradient(135deg, #f59e0b, #ea580c)' },
      { id: 'VENTURE_SAFE', label: 'Venture SAFE 💼', icon: Briefcase, iconColor: '#10b981', activeGradient: 'linear-gradient(135deg, #10b981, #059669)' },
      { id: 'HFT_ORDERBOOK', label: 'HFT Order Book 📈', icon: TrendingUp, iconColor: '#f59e0b', activeGradient: 'linear-gradient(135deg, #f59e0b, #d97706)' },
    ],
  },
  {
    id: 'LABS',
    label: 'DeepTech & STEM Labs',
    shortLabel: '🔬 Research & Labs',
    icon: FlaskConical,
    accentColor: '#818cf8',
    items: [
      { id: 'RESEARCH_LAB', label: 'AI Research Lab 🧬', icon: Bot, iconColor: '#818cf8', activeGradient: 'linear-gradient(135deg, #6366f1, #4f46e5)' },
      { id: 'ARXIV_SCHOLAR', label: 'arXiv Scholar 📄', icon: FileSearch, iconColor: '#818cf8', activeGradient: 'linear-gradient(135deg, #6366f1, #4338ca)' },
      { id: 'CODE_SANDBOX', label: 'Code Sandbox 💻', icon: Code2, iconColor: '#38bdf8', activeGradient: 'linear-gradient(135deg, #0284c7, #0369a1)' },
      { id: 'LATEX_STUDIO', label: 'LaTeX Studio 📐', icon: FileCode2, iconColor: '#22d3ee', activeGradient: 'linear-gradient(135deg, #06b6d4, #0891b2)' },
      { id: 'PATENT_DRAFTER', label: 'Patent & IP 📜', icon: FileText, iconColor: '#34d399', activeGradient: 'linear-gradient(135deg, #10b981, #059669)' },
      { id: 'HOLO_SIMULATIONS', label: '3D Holo-Lab 🧬', icon: Cpu, iconColor: '#c084fc', activeGradient: 'linear-gradient(135deg, #a855f7, #7c3aed)' },
      { id: 'QUANTUM_LAB', label: 'Quantum Lab ⚛️', icon: Atom, iconColor: '#c084fc', activeGradient: 'linear-gradient(135deg, #a855f7, #7c3aed)' },
      { id: 'QUANTUM_QKD', label: 'Quantum QKD 🔑', icon: Key, iconColor: '#a855f7', activeGradient: 'linear-gradient(135deg, #a855f7, #7c3aed)' },
      { id: 'LAB_NOTEBOOK', label: 'Lab Notebook 🧪', icon: FlaskConical, iconColor: '#34d399', activeGradient: 'linear-gradient(135deg, #10b981, #059669)' },
      { id: 'KERNEL_PROFILER', label: 'SIMD Profiler ⚡', icon: Cpu, iconColor: '#38bdf8', activeGradient: 'linear-gradient(135deg, #0284c7, #0369a1)' },
      { id: 'ASTRODYNAMICS', label: 'Astrodynamics 🪐', icon: Orbit, iconColor: '#c084fc', activeGradient: 'linear-gradient(135deg, #a855f7, #7c3aed)' },
      { id: 'CHEMICAL_RETRO', label: 'Retrosynthesis 🧪', icon: FlaskConical, iconColor: '#34d399', activeGradient: 'linear-gradient(135deg, #10b981, #059669)' },
      { id: 'SCHOLAR_TRACKER', label: 'Scholar Tracker 🎓', icon: GraduationCap, iconColor: '#38bdf8', activeGradient: 'linear-gradient(135deg, #0284c7, #0369a1)' },
      { id: 'NEUROMORPHIC_SNN', label: 'Neuromorphic SNN 🧠', icon: Cpu, iconColor: '#f43f5e', activeGradient: 'linear-gradient(135deg, #f43f5e, #be123c)' },
      { id: 'PAPER_REFEREE', label: 'Peer Reviewer 📝', icon: FileCheck, iconColor: '#06b6d4', activeGradient: 'linear-gradient(135deg, #06b6d4, #0891b2)' },
      { id: 'CRISPR_EDITOR', label: 'CRISPR Gene Editor 🧬', icon: Scissors, iconColor: '#10b981', activeGradient: 'linear-gradient(135deg, #10b981, #047857)' },
      { id: 'FUSION_TOKAMAK', label: 'Fusion Tokamak ⚛️', icon: Atom, iconColor: '#ec4899', activeGradient: 'linear-gradient(135deg, #ec4899, #be185d)' },
      { id: 'BCI_SPELLER', label: 'BCI Neuro-Speller 🧠', icon: Waves, iconColor: '#8b5cf6', activeGradient: 'linear-gradient(135deg, #8b5cf6, #6d28d9)' },
      { id: 'LEGAL_ANALYZER', label: 'Legal Analyzer ⚖️', icon: Scale, iconColor: '#f59e0b', activeGradient: 'linear-gradient(135deg, #f59e0b, #d97706)' },
      { id: 'EXOPLANET_PHOTOMETRY', label: 'Exoplanet Photometry 🔭', icon: Orbit, iconColor: '#3b82f6', activeGradient: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' },
      { id: 'GRAVITATIONAL_WAVES', label: 'Gravitational Waves 🌌', icon: Waves, iconColor: '#6366f1', activeGradient: 'linear-gradient(135deg, #6366f1, #4338ca)' },
      { id: 'ROBOTICS_KINEMATICS', label: 'Robotics Kinematics 🤖', icon: Cpu, iconColor: '#06b6d4', activeGradient: 'linear-gradient(135deg, #06b6d4, #0891b2)' },
      { id: 'EPIGENETIC_CLOCK', label: 'Epigenetic Clock ⏳', icon: HeartPulse, iconColor: '#f43f5e', activeGradient: 'linear-gradient(135deg, #f43f5e, #e11d48)' },
    ],
  },
  {
    id: 'COMMUNITY',
    label: 'Campus Community & Arena',
    shortLabel: '👥 Campus Hub',
    icon: Users,
    accentColor: '#38bdf8',
    items: [
      { id: 'COMMUNITY', label: 'Community Hub', icon: Users, iconColor: '#818cf8', activeGradient: 'linear-gradient(135deg, #6366f1, #06b6d4)' },
      { id: 'LEADERBOARD', label: 'Leaderboards', icon: Trophy, iconColor: '#fbbf24', activeGradient: 'linear-gradient(135deg, #f59e0b, #ef4444)' },
      { id: 'STUDY_ROOMS', label: 'Study Rooms 🎧', icon: Users2, iconColor: '#c084fc', activeGradient: 'linear-gradient(135deg, #a855f7, #6366f1)' },
      { id: 'STUDY_SWARM', label: 'Study Swarm 🤖', icon: Bot, iconColor: '#818cf8', activeGradient: 'linear-gradient(135deg, #6366f1, #4f46e5)' },
      { id: 'QUIZ_BATTLE', label: '1v1 Arena ⚔️', icon: Swords, iconColor: '#f87171', activeGradient: 'linear-gradient(135deg, #ef4444, #dc2626)' },
      { id: 'HACKATHON_RADAR', label: 'Hackathons 🏆', icon: Trophy, iconColor: '#fbbf24', activeGradient: 'linear-gradient(135deg, #f59e0b, #d97706)' },
      { id: 'HACKATHON_WAR_ROOM', label: 'Hackathon War-Room ⚔️', icon: Swords, iconColor: '#f87171', activeGradient: 'linear-gradient(135deg, #ef4444, #b91c1c)' },
      { id: 'KNOWLEDGE_OLYMPIAD', label: 'Knowledge Olympiad 🏆', icon: Crown, iconColor: '#fbbf24', activeGradient: 'linear-gradient(135deg, #f59e0b, #b45309)' },
      { id: 'FACULTY_ADVISORY', label: 'Faculty Advisory 🎓', icon: GraduationCap, iconColor: '#c084fc', activeGradient: 'linear-gradient(135deg, #a855f7, #7c3aed)' },
      { id: 'ALUMNI_RADAR', label: 'Alumni Mentors 🌐', icon: Globe, iconColor: '#c084fc', activeGradient: 'linear-gradient(135deg, #a855f7, #6366f1)' },
      { id: 'TUTOR_BOUNTY', label: 'Tutor Bounty 💰', icon: Coins, iconColor: '#fbbf24', activeGradient: 'linear-gradient(135deg, #f59e0b, #d97706)' },
      { id: 'STUDY_GUILD_DAO', label: 'Guild DAO 🏛️', icon: Vote, iconColor: '#fbbf24', activeGradient: 'linear-gradient(135deg, #f59e0b, #b45309)' },
    ],
  },
  {
    id: 'CAMPUS',
    label: 'Campus Life & Wellness',
    shortLabel: '🏫 Campus & Health',
    icon: HeartPulse,
    accentColor: '#34d399',
    items: [
      { id: 'CAMPUS_EXCHANGE', label: 'Campus Exchange 📦', icon: PackageSearch, iconColor: '#fbbf24', activeGradient: 'linear-gradient(135deg, #f59e0b, #d97706)' },
      { id: 'NOTES_MARKETPLACE', label: 'Notes Bazaar 🛍️', icon: ShoppingBag, iconColor: '#fbbf24', activeGradient: 'linear-gradient(135deg, #f59e0b, #d97706)' },
      { id: 'HOSTEL_NUTRITION', label: 'Hostel Mess 🥗', icon: Utensils, iconColor: '#fbbf24', activeGradient: 'linear-gradient(135deg, #f59e0b, #d97706)' },
      { id: 'CAMPUS_TRANSIT', label: 'Campus Transit 🚌', icon: Bus, iconColor: '#22d3ee', activeGradient: 'linear-gradient(135deg, #06b6d4, #0891b2)' },
      { id: 'CAMPUS_PRINTING', label: 'Campus Print 🖨️', icon: Printer, iconColor: '#22d3ee', activeGradient: 'linear-gradient(135deg, #06b6d4, #0891b2)' },
      { id: 'CAMPUS_DIGITAL_TWIN', label: 'Campus Twin 🗺️', icon: MapPin, iconColor: '#38bdf8', activeGradient: 'linear-gradient(135deg, #0284c7, #0369a1)' },
      { id: 'VIRTUAL_CAMPUS', label: '2D Campus 🏰', icon: Landmark, iconColor: '#f472b6', activeGradient: 'linear-gradient(135deg, #ec4899, #db2777)' },
      { id: 'DEADLINES', label: 'Deadlines & Alerts', icon: Bell, iconColor: '#f87171', activeGradient: 'linear-gradient(135deg, #ef4444, #dc2626)' },
      { id: 'FOCUS_GARDEN', label: 'Focus Garden 🌲', icon: Trees, iconColor: '#34d399', activeGradient: 'linear-gradient(135deg, #10b981, #059669)' },
      { id: 'CIRCADIAN_FOCUS', label: 'Circadian Focus ⚡', icon: Sun, iconColor: '#34d399', activeGradient: 'linear-gradient(135deg, #10b981, #059669)' },
      { id: 'NEURAL_FLOW', label: 'Neural Flow 🧠', icon: Waves, iconColor: '#f472b6', activeGradient: 'linear-gradient(135deg, #ec4899, #db2777)' },
      { id: 'MENTAL_RESILIENCE', label: 'Resilience Sanctum 🧘', icon: HeartPulse, iconColor: '#34d399', activeGradient: 'linear-gradient(135deg, #10b981, #059669)' },
      { id: 'ERGONOMIC_WELLNESS', label: 'Ergonomics Bio-Cam 👁️', icon: Eye, iconColor: '#34d399', activeGradient: 'linear-gradient(135deg, #10b981, #059669)' },
      { id: 'CARBON_MARKET', label: 'Carbon Market 🌱', icon: Leaf, iconColor: '#10b981', activeGradient: 'linear-gradient(135deg, #10b981, #047857)' },
    ],
  },
];

// Helper to find parent category of a view
export function getCategoryForView(view: ViewType): string {
  for (const group of NAVIGATION_GROUPS) {
    if (group.items.some((item) => item.id === view)) {
      return group.id;
    }
  }
  return 'ACADEMICS';
}

interface NavigationHeaderProps {
  activeView: ViewType;
  setActiveView: (view: ViewType) => void;
  onOpenCommandPalette?: () => void;
}

export const NavigationHeader: React.FC<NavigationHeaderProps> = ({
  activeView,
  setActiveView,
}) => {
  const { t } = useLanguage();

  const getGroupShortLabel = (id: string, defaultLabel: string) => {
    switch (id) {
      case 'ACADEMICS': return t('academics');
      case 'AI_STUDY': return t('ai_copilot');
      case 'CAREER': return t('career');
      case 'LABS': return t('labs');
      case 'COMMUNITY': return t('community');
      case 'CAMPUS': return t('campus');
      default: return defaultLabel;
    }
  };

  const getGroupFullLabel = (id: string, defaultLabel: string) => {
    switch (id) {
      case 'ACADEMICS': return t('academics_full');
      case 'AI_STUDY': return t('ai_copilot_full');
      case 'CAREER': return t('career_full');
      case 'LABS': return t('labs_full');
      case 'COMMUNITY': return t('community_full');
      case 'CAMPUS': return t('campus_full');
      default: return defaultLabel;
    }
  };

  const getToolLabel = (id: string, defaultLabel: string) => {
    const key = `tool_${id}`;
    const translated = t(key);
    if (translated && translated !== key) return translated;
    return defaultLabel;
  };

  // Determine currently selected category
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(() =>
    getCategoryForView(activeView)
  );

  // Sync selected category if active view changes externally (e.g. from Command palette / Roadmap)
  useEffect(() => {
    if (activeView !== 'DASHBOARD' && activeView !== 'ROADMAP' && activeView !== 'CENTURY_GRANDMASTER') {
      const cat = getCategoryForView(activeView);
      setSelectedCategoryId(cat);
    }
  }, [activeView]);

  const activeGroup = NAVIGATION_GROUPS.find((g) => g.id === selectedCategoryId) || NAVIGATION_GROUPS[0];
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleSelectCategory = (catId: string) => {
    setSelectedCategoryId(catId);
    // Optionally switch to first item in category if not already in category
    const cat = NAVIGATION_GROUPS.find((g) => g.id === catId);
    if (cat && cat.items.length > 0) {
      const currentItemInCat = cat.items.some((i) => i.id === activeView);
      if (!currentItemInCat && activeView !== 'DASHBOARD') {
        setActiveView(cat.items[0].id);
      }
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {/* Level 1: Category Bar & Cockpit Home */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
        {/* Cockpit Home Button */}
        <button
          onClick={() => setActiveView('DASHBOARD')}
          className="glow-hover"
          style={{
            padding: '7px 14px',
            borderRadius: 'var(--radius-full)',
            border: activeView === 'DASHBOARD' ? '1px solid var(--accent-primary)' : '1px solid var(--border-glass)',
            fontSize: '0.78rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: activeView === 'DASHBOARD' ? 'var(--accent-primary)' : 'rgba(255, 255, 255, 0.04)',
            color: activeView === 'DASHBOARD' ? '#ffffff' : 'var(--text-secondary)',
            boxShadow: activeView === 'DASHBOARD' ? '0 0 12px rgba(99, 102, 241, 0.4)' : 'none',
            transition: 'all 0.2s ease',
          }}
          title="Go to Cockpit Dashboard"
        >
          <LayoutDashboard size={14} color={activeView === 'DASHBOARD' ? '#ffffff' : '#818cf8'} />
          <span>{t('cockpit')}</span>
        </button>

        {/* Divider */}
        <div style={{ width: '1px', height: '22px', backgroundColor: 'rgba(255, 255, 255, 0.1)', margin: '0 2px' }} />

        {/* 6 Category Tabs */}
        <div
          className="glass-pill"
          style={{
            padding: '3px',
            display: 'flex',
            gap: '3px',
            flexWrap: 'wrap',
            background: 'rgba(15, 23, 42, 0.65)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          {NAVIGATION_GROUPS.map((group) => {
            const isCategoryActive = selectedCategoryId === group.id && activeView !== 'DASHBOARD' && activeView !== 'ROADMAP' && activeView !== 'CENTURY_GRANDMASTER';
            const isSelected = selectedCategoryId === group.id;
            const Icon = group.icon;

            return (
              <button
                key={group.id}
                onClick={() => handleSelectCategory(group.id)}
                className="glow-hover"
                style={{
                  padding: '5px 12px',
                  borderRadius: 'var(--radius-full)',
                  border: isSelected ? `1px solid ${group.accentColor}55` : '1px solid transparent',
                  fontSize: '0.75rem',
                  fontWeight: isSelected ? 700 : 500,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: isSelected
                    ? `linear-gradient(135deg, ${group.accentColor}25, rgba(15, 23, 42, 0.8))`
                    : 'transparent',
                  color: isSelected ? '#ffffff' : 'var(--text-secondary)',
                  boxShadow: isCategoryActive ? `0 0 10px ${group.accentColor}33` : 'none',
                  transition: 'all 0.2s ease',
                }}
              >
                <Icon size={13} color={isSelected ? group.accentColor : 'var(--text-muted)'} />
                <span>{getGroupShortLabel(group.id, group.shortLabel)}</span>
                <span
                  style={{
                    fontSize: '0.65rem',
                    padding: '1px 5px',
                    borderRadius: '10px',
                    background: isSelected ? `${group.accentColor}33` : 'rgba(255, 255, 255, 0.06)',
                    color: isSelected ? group.accentColor : 'var(--text-muted)',
                    fontWeight: 600,
                  }}
                >
                  {group.items.length}
                </span>
              </button>
            );
          })}
        </div>

        {/* Grandmaster & Roadmap shortcuts */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginLeft: 'auto' }}>
          <button
            onClick={() => setActiveView('CENTURY_GRANDMASTER')}
            style={{
              padding: '5px 10px',
              borderRadius: 'var(--radius-full)',
              border: '1px solid rgba(245, 158, 11, 0.4)',
              fontSize: '0.72rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              background: activeView === 'CENTURY_GRANDMASTER' ? 'linear-gradient(135deg, #f59e0b, #eab308)' : 'rgba(245, 158, 11, 0.12)',
              color: activeView === 'CENTURY_GRANDMASTER' ? '#020617' : '#fbbf24',
              boxShadow: '0 0 10px rgba(245, 158, 11, 0.2)',
            }}
            title="Phase 100 Grandmaster Showcase"
          >
            <Crown size={12} color={activeView === 'CENTURY_GRANDMASTER' ? '#020617' : '#f59e0b'} />
            <span>{t('grandmaster')}</span>
          </button>

          <button
            onClick={() => setActiveView('ROADMAP')}
            style={{
              padding: '5px 10px',
              borderRadius: 'var(--radius-full)',
              border: activeView === 'ROADMAP' ? '1px solid var(--accent-primary)' : '1px solid var(--border-glass)',
              fontSize: '0.72rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              background: activeView === 'ROADMAP' ? 'var(--accent-primary)' : 'rgba(255, 255, 255, 0.04)',
              color: activeView === 'ROADMAP' ? '#ffffff' : 'var(--text-secondary)',
            }}
            title="90-Phase Matrix Roadmap"
          >
            <Layers size={12} />
            <span>{t('roadmap')}</span>
          </button>
        </div>
      </div>

      {/* Level 2: Active Category Tools Ribbon */}
      <div
        ref={scrollContainerRef}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
          overflowX: 'auto',
          padding: '4px 6px',
          borderRadius: '12px',
          background: 'rgba(15, 23, 42, 0.4)',
          border: `1px solid ${activeGroup.accentColor}22`,
          boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.05)',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        <div
          style={{
            fontSize: '0.68rem',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            fontWeight: 800,
            color: activeGroup.accentColor,
            whiteSpace: 'nowrap',
            paddingRight: '6px',
            borderRight: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          {getGroupFullLabel(activeGroup.id, activeGroup.label)}:
        </div>

        {activeGroup.items.map((item) => {
          const isItemActive = activeView === item.id;
          const Icon = item.icon;
          const bg = isItemActive
            ? item.activeGradient || 'var(--accent-primary)'
            : 'transparent';

          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className="glow-hover"
              style={{
                padding: '5px 11px',
                borderRadius: 'var(--radius-full)',
                border: isItemActive ? 'none' : '1px solid rgba(255, 255, 255, 0.05)',
                fontSize: '0.74rem',
                fontWeight: isItemActive ? 700 : 500,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                background: bg,
                color: isItemActive ? '#ffffff' : 'var(--text-secondary)',
                whiteSpace: 'nowrap',
                transition: 'all 0.18s ease',
                boxShadow: isItemActive ? '0 0 10px rgba(99, 102, 241, 0.35)' : 'none',
              }}
            >
              <Icon size={12} color={isItemActive ? '#ffffff' : item.iconColor || 'var(--text-muted)'} />
              <span>{getToolLabel(item.id, item.label)}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
