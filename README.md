<div align="center">

# 🎓 StudentLife OS
### *The Next-Generation Operating System for Study, Exams, and Career Acceleration*

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

**StudentLife OS** is an all-in-one productivity suite and AI-driven workspace designed specifically for ambitious students preparing for competitive exams (GATE, JEE, UPSC), mastering university curriculums, and launching high-growth tech careers.

[🚀 Quick Start](#-quick-start) • [✨ Key Modules](#-key-modules-20-phase-architecture) • [🛠️ Tech Stack](#️-tech-stack) • [📦 Project Structure](#-project-structure)

</div>

---

## 🌟 Key Highlights

- 🧠 **SuperMemo SM-2 Spaced Repetition**: Memory retention decay forecasting and rapid active-recall queue.
- 🎯 **Timed Mock Test Simulator**: Official exam simulation with 5-state question palette, negative marking, on-screen scientific calculator, and national AIR percentile benchmarking.
- 🤖 **AI Personal Mentor 360°**: Cross-module synthesis synthesizing study hours, mock performance, career gaps, and burnout health into daily 3-step action plans.
- 📄 **A4 ATS Resume Builder**: Real-time split-screen resume builder with 4-gauge ATS compliance scoring (92/100) and AI STAR-formula bullet rewriter.
- 💼 **Internships & Career Intelligence**: 5-stage application Kanban radar (Stripe, Google, OpenAI) + Skill-gap heatmaps with 1-click Study Planner bridge.
- 🎧 **Virtual Study Rooms & Community Hub**: Focus rooms with synchronized Pomodoro timers and multi-track ambient audio (Lo-Fi Rain, Library Cafe, Deep Synth).

---

## ✨ Key Modules (20-Phase Architecture)

| Module | Features & Capabilities |
|---|---|
| **Student Cockpit** | Pomodoro Focus Timer, Daily Goal Ring, Exam Countdown Clocks, Streak Counter (+50 XP 🔥) |
| **Study Planner** | Daily time-blocking timeline, weekly load balancer, priority matrix badges (+15 XP) |
| **Syllabus Manager** | Hierarchical subject trees, topic weightages, difficulty tags, mastery progress rings |
| **Notes & Resources** | Split-screen Markdown editor with live preview, word counter, and smart document bookmarks |
| **AI Study Assistant** | PDF ➔ Mindmap trees, 3D active recall flashcards, and 24/7 multi-depth doubt solver |
| **Revision Engine** | SuperMemo SM-2 interval calculations with urgency telemetry (🔴 Overdue, 🟡 Due, 🟢 Upcoming) |
| **Question Bank** | 10,000+ indexed PYQs (GATE, Finals 2018–2024) with step-by-step LaTeX proofs |
| **Mock Simulator** | Timed simulation papers, Section switcher, negative marking (-0.33 / -0.66), and instant scorecards |
| **Diagnostics Radar** | 4-Quadrant Speed vs Accuracy matrix, Subject mastery heatmap, and 1-click drill launchers |
| **Career Intelligence**| Multi-role career pathways, market compensation radar ($125k–$190k), and skill gap heatmaps |
| **ATS Resume Builder** | Real-time reactive A4 sheet preview, Job Description keyword matcher, and mock interview Q&A |
| **Internship Radar** | Elite opportunities radar + 5-stage Kanban application tracking pipeline |
| **Scholarships Vault** | ₹4.8 Lakhs financial aid calculator + eligibility matchmaker & document readiness vault |
| **Deadlines & Alerts** | RFC-5545 `.ics` export engine, Google Calendar sync, and multi-channel notification alarms |
| **AI Mentor 360°** | 3 coaching personas (*🎯 Strategic Coach, 🧘 Empathetic Support, ⚡ Drill Master*) + Burnout radar |
| **Community Hub** | Virtual focus rooms, ambient sound engine, and peer doubt discussion forum with +20 XP solutions |

---

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Vanilla CSS (Ultra Dark Glassmorphism), Lucide Icons
- **Backend**: Node.js, Express, TypeScript, RESTful API architecture
- **Database / ORM**: PostgreSQL, Prisma ORM
- **Shared Layer**: `@studentlife/shared` (Zero-duplication TypeScript domain contracts & DTOs)
- **Containerization**: Docker, Docker Compose

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)

### 1. Clone the repository
```bash
git clone https://github.com/mr-rchaurasiya/StudentLife-OS.git
cd StudentLife-OS
```

### 2. Install dependencies
```bash
npm install
```

### 3. Build shared contracts
```bash
npm run build --workspace=packages/shared
```

### 4. Start Development Servers
```bash
npm run dev
```

- **Frontend Application**: `http://localhost:5173`
- **Backend API Server**: `http://localhost:5000`
- **API Health Check**: `http://localhost:5000/api/health`

---

## 📦 Project Structure

```
studentlife-os/
├── apps/
│   ├── web/               # React + Vite Glassmorphic Frontend
│   └── api/               # Express + TypeScript Backend API
├── packages/
│   ├── shared/            # Shared Domain Models, DTOs & Types
│   └── database/          # Prisma ORM Schema & Migrations
├── docker-compose.yml     # Multi-container orchestration
└── package.json           # Monorepo Workspace Config
```

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
