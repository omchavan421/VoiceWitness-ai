# VoiceWitness AI

See a Problem. Speak It. Route It.

VoiceWitness AI is a voice-first public issue reporting project. This repository is at **Phase 1: project foundation**.

What exists now:

- A React + Vite frontend that shows the project name.
- An Express backend with one health-check route.

What is intentionally not built yet:

- Voice input
- Gemini
- Follow-up questions
- Reports
- Supabase
- Authentication

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

You should see **VoiceWitness AI** and the tagline **See a Problem. Speak It. Route It.**

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
