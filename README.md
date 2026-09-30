# VoiceWitness AI

See a Problem. Speak It. Route It.

VoiceWitness AI is a voice-first public issue reporting project. This repository is at **Phase 4: Gemini understanding**.

What exists now:

- A React + Vite frontend with the reporting screens.
- Browser speech recognition on the Report Issue page.
- `POST /api/analyze`, which sends the description to Gemini and returns a structured result.

What is intentionally not built yet:

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

1. **Start Speaking** on the home page opens Report Issue.
2. On Report Issue, **Start Speaking** uses the browser microphone. **Analyze Issue** sends the text to the backend. The analysis page shows Gemini's structured result.
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

The Gemini key belongs only in `backend/.env`. Copy the example and add your own key there:

```bash
cp backend/.env.example backend/.env
```

`backend/.env.example` lists `GEMINI_API_KEY` with an empty value. Do not put a real key in frontend code or in Git. `.env` files are ignored.

## Deployment

The backend is deployed on Render. The frontend is deployed on Vercel.

On Render, set the root directory to `backend`, the start command to `npm start`, and add these environment variables:

- `GEMINI_API_KEY` — your Gemini key. Create a new one if an older key was shared. Do not put it in Git.
- `FRONTEND_URL` — the Vercel site URL, with no slash at the end.
- `PORT` — Render sets this. You can leave it unset.

On Vercel, set the root directory to `frontend` and add:

- `VITE_API_URL` — the Render backend URL, with no slash at the end. Example shape: `https://your-service.onrender.com`

Local development still uses `http://localhost:47821` when `VITE_API_URL` is empty.
