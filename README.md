<h1 align="center">ClauseGuard</h1>

> **"Understand Before You Agree."**


<p align="center">
  <a href="https://clause-guard-two.vercel.app/">
    <img src="https://img.shields.io/badge/🚀_LIVE_DEMO-Visit_ClauseGuard-F97316?style=for-the-badge" alt="Live Demo">
  </a>
</p>


ClauseGuard is an AI-powered contract analysis tool that helps ordinary users understand agreements before signing. It identifies clauses that deserve attention, explains them in plain language, and suggests questions worth asking — powered by Google Gemini 2.5 Flash.

---

## Features

- 📄 **PDF upload** or **paste contract text** for analysis
- 🤖 **Real AI analysis** via Google Gemini 2.5 Flash (structured JSON output mode)
- 🎯 **Contract Attention Score** (0–100) with severity level
- 🔍 **Clause-by-clause breakdown** with plain-language explanations
- ❓ **Questions Worth Asking** for each flagged clause
- ⚡ **Explain Simply** — ultra-plain one-line summaries
- 📋 **Before You Sign** — top priority checklist
- 🕓 **Analysis History** — quick access to past analyses (localStorage)
- 🖨️ **Print / Save PDF** — browser print dialog for saving results

> **Disclaimer:** ClauseGuard provides informational analysis only. It is not a law firm and does not provide legal advice. Always consult a qualified legal professional for important agreements.

---

## Tech Stack

### Frontend
| Tool | Version |
|---|---|
| React | 19 |
| Vite | 8 |
| TypeScript | 6 |
| Tailwind CSS | 4 (via `@tailwindcss/vite`) |
| React Router | 7 |
| Lucide React | latest |

### Backend
| Tool | Version |
|---|---|
| Node.js + Express | 4 |
| TypeScript + ts-node-dev | — |
| `@google/genai` SDK | ^1.10.0 |
| Gemini model | `gemini-3.5-flash` |
| pdf-parse | ^1.1.1 |
| Zod | ^3.x |
| multer | ^2.x |

---

## Getting Started

### 1. Frontend only (sample/mock mode — no API key needed)

```bash
# Install frontend dependencies
npm install

# Start Vite dev server
npm run dev
# → http://localhost:5173
```

In this mode you can use the **"Load Sample Contract"** button to see a demo analysis without needing the backend.

### 2. Full stack with real Gemini AI

```bash
# 1. Install frontend dependencies
npm install

# 2. Install backend dependencies
cd server && npm install && cd ..

# 3. Configure the backend environment
cp server/.env.example server/.env
# Edit server/.env and set: GEMINI_API_KEY=your_key_from_aistudio.google.com

# 4. Start both servers with one command
npm run dev:all
# → Frontend: http://localhost:5173
# → Backend:  http://localhost:3001
```

### 3. Individual start commands

```bash
# Frontend only
npm run dev

# Backend only
npm run dev:server
```

---

## Environment Variables

### Backend (`server/.env`)
```bash
cp server/.env.example server/.env
```

| Variable | Default | Description |
|---|---|---|
| `GEMINI_API_KEY` | *(required)* | Gemini API key from [aistudio.google.com](https://aistudio.google.com/apikey) |
| `PORT` | `3001` | Backend server port |
| `ALLOWED_ORIGIN` | `http://localhost:5173` | CORS allowed origin |

### Frontend (`root .env`)
```bash
cp .env.example .env
```

| Variable | Default | Description |
|---|---|---|
| `VITE_API_URL` | *(empty)* | Leave empty for local dev (Vite proxies `/api/*` to `:3001`). Set to deployed backend URL for production. |

> ⚠️ Never commit `.env` files. They are covered by `.gitignore`. Only `.env.example` files are tracked.

---

## API Endpoints

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/health` | Server health check |
| `POST` | `/api/analyze` | Analyse contract text (JSON body: `{ text, documentName }`) |
| `POST` | `/api/analyze/pdf` | Analyse PDF upload (multipart: `file`, `documentName`) |

---

## Project Structure

```
├── server/                   Express + TypeScript backend
│   ├── src/
│   │   ├── index.ts          Server entry point
│   │   ├── routes/           Express route handlers
│   │   ├── services/         Gemini AI + PDF extraction
│   │   ├── schemas/          Zod validation schemas
│   │   └── middleware/       Error handling, request validation
│   ├── .env.example          Backend environment template
│   └── package.json
│
└── src/                      React + TypeScript frontend
    ├── types/                TypeScript interfaces (shared shape)
    ├── data/                 Mock analysis data (used in sample mode)
    ├── context/              AnalysisContext (React reducer)
    ├── services/             api.ts — typed fetch wrappers
    ├── utils/                historyStorage (localStorage)
    ├── components/           Reusable UI components
    │   ├── layout/           Navbar, Footer
    │   ├── landing/          Hero, Features
    │   ├── analyze/          UploadArea (upload + paste tabs)
    │   ├── loading/          AnalysisProgress (real + sample mode)
    │   ├── results/          ScoreHeader, ClauseCard, etc.
    │   └── history/          HistoryList
    ├── pages/                Route-level page components
    ├── App.tsx               Router, layout shell, AnalysisProvider
    └── index.css             Design system and global styles
```

---

## License

MIT
