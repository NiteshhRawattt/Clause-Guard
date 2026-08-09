# ClauseGuard

> **"Understand Before You Agree."**

ClauseGuard is an AI-powered contract analysis tool that helps ordinary users understand agreements before signing. It identifies clauses that deserve attention, explains them in plain language, and suggests questions worth asking.

---

## Features

- 📄 **PDF upload** or **paste contract text** for analysis
- 🎯 **Contract Attention Score** (0–100) with severity level
- 🔍 **Clause-by-clause breakdown** with plain-language explanations
- ❓ **Questions Worth Asking** for each flagged clause
- ⚡ **Explain Simply** — ultra-plain one-line summaries
- 📋 **Before You Sign** — top priority checklist
- 🕓 **Analysis History** — quick access to past analyses

> **Disclaimer:** ClauseGuard provides informational analysis only. It is not a law firm and does not provide legal advice. Always consult a qualified legal professional for important agreements.

---

## Tech Stack

| Tool | Version |
|---|---|
| React | 19 |
| Vite | 8 |
| TypeScript | 6 |
| Tailwind CSS | 4 (via `@tailwindcss/vite`) |
| React Router | 7 |
| Lucide React | latest |

---

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev
# → http://localhost:5173

# Production build
npm run build

# Preview production build
npm run preview
```

---

## Environment Variables

Copy `.env.example` to `.env` and fill in values for backend/AI integration:

```bash
cp .env.example .env
```

> The current frontend MVP uses mock data only. No API keys are required to run locally.

---

## Project Structure

```
src/
  types/          TypeScript interfaces
  data/           Mock analysis data (to be replaced by API)
  components/     Reusable UI components
    layout/       Navbar, Footer
    landing/      Hero, Features
    analyze/      UploadArea
    loading/      AnalysisProgress
    results/      ScoreHeader, CategoryOverview, ClauseCard, etc.
    history/      HistoryList
    about/        AboutContent
  pages/          Route-level page components
  App.tsx         Router and layout shell
  index.css       Design system and global styles
```

---

## License

MIT
