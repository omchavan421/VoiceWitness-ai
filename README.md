# VoiceWitness AI

See a Problem. Speak It. Route It.

VoiceWitness AI is a voice-first public issue reporting project. This repository is at **Phase 2: frontend UI**.

What exists now:

- A React + Vite frontend with the reporting screens and sample reports.
- An Express backend with one health-check route.

What is intentionally not built yet:

- Real voice input
- Gemini
- Supabase
- Authentication
- Saving a submitted report

## Project layout

```text
frontend/     React app (what you see in the browser)
backend/      Express API (what answers /api/health)
```

## Install dependencies

From the project root, run these two commands:

```bash
npm install --prefix frontend
npm install --prefix backend
```

Or use the shortcut:

```bash
npm run install:all
```

## Start the frontend

```bash
npm run dev:frontend
```

Open [http://localhost:43173](http://localhost:43173).

You should see the home page: **See a Problem. Speak It. Route It.**

Click through the sample flow:

1. **Start Speaking** opens Report Issue.
2. **Analyze Issue** opens the sample analysis.
3. **View Report** opens the draft report.
4. **Submit Report** opens My Reports.
5. **View Details** on VW1024 opens that case.

The same pages are in the top navigation: Home, Report Issue, and My Reports.

## Start the backend

Open a second terminal, then run:

```bash
npm run dev:backend
```

The API listens on port **47821**.

Health check: [http://localhost:47821/api/health](http://localhost:47821/api/health)

A working response looks like this:

```json
{
  "success": true,
  "message": "VoiceWitness API is running"
}
```

## Environment variables

Phase 1 does not need any API keys.

If you want to change the backend port, copy the example file and edit it:

```bash
cp backend/.env.example backend/.env
```

`.env` files are ignored by Git so secrets are not committed later.
