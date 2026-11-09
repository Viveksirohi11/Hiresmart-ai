# HireSmart AI — Resume & Job Description Analyzer

A MERN-style MVP that accepts a PDF resume and job description, extracts resume text, requests a structured analysis from Gemini, and saves analysis history per user.

## Features
- JWT registration/login
- PDF-only resume upload with size limit and text extraction
- AI comparison: match estimate, matched/missing skills, strengths, improvement suggestions, interview questions
- Per-user analysis history
- React dashboard and analysis result UI
- Basic API security: Helmet, rate limiting, input validation, ownership checks

> The match score is an AI-generated estimate, not a validated ATS score or a prediction of hiring outcomes. AI output can be wrong; users should verify recommendations. Do not add skills or experience that are not true.

## Requirements
- Node.js 20+
- MongoDB connection string
- Gemini API key

## Run locally

### 1. Backend
```bash
cd backend
cp .env.example .env
# Fill MONGO_URI, JWT_SECRET and GEMINI_API_KEY
npm install
npm run dev
```
Backend runs at `http://localhost:5000`.

### 2. Frontend
In a second terminal:
```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```
Frontend runs at the Vite URL, usually `http://localhost:5173`.

## API
- `POST /api/auth/register` — `{ name, email, password }`
- `POST /api/auth/login` — `{ email, password }`
- `GET /api/auth/me` — authenticated profile
- `POST /api/resumes/upload` — multipart form field `resume`
- `GET /api/resumes` — user's resumes
- `DELETE /api/resumes/:id` — delete own resume
- `POST /api/analysis/analyze` — `{ resumeId, jobTitle, jobDescription }`
- `GET /api/analysis/history` — user's analysis history
- `GET /api/analysis/:id` — one owned analysis
- `DELETE /api/analysis/:id` — delete own analysis
- `GET /api/health` — health check

## Notes before production
- Configure HTTPS, CORS allowlist, secret rotation, and persistent/private file storage.
- This MVP stores extracted resume text in MongoDB and removes the temporary upload after parsing. Add a retention policy and a user-facing data deletion flow before public launch.
- Add malware scanning, stronger validation, audit logging, and tests before handling real candidate data at scale.
- Keep API keys only on the server. Never commit `.env`.

## Daily Development Log - 2026-11-09

- Development: 
- Testing: 
- Status: Daily development update.
