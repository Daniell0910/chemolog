# ChemoLog

A simple, free tool for cancer patients to track chemotherapy side effects, spot patterns across treatment cycles, and bring real data to their care team.

---

## Setup Guide (15 minutes)

### Step 1: Create a Supabase project (free)

1. Go to [supabase.com](https://supabase.com) and sign up / log in
2. Click **New Project**
3. Pick a name (e.g. `chemolog`), set a database password, choose a region close to your users
4. Wait ~2 min for it to spin up

### Step 2: Set up the database

1. In your Supabase dashboard, go to **SQL Editor** (left sidebar)
2. Click **New query**
3. Paste the entire contents of `supabase-setup.sql` into the editor
4. Click **Run** — you should see "Success"

### Step 3: Get your API keys

1. In Supabase, go to **Settings > API** (left sidebar)
2. Copy **Project URL** (looks like `https://xxxxx.supabase.co`)
3. Copy **anon / public** key (the long string under "Project API keys")

### Step 4: Create your .env file

1. In the project folder, copy `.env.example` to `.env`:
   ```
   cp .env.example .env
   ```
2. Paste your keys:
   ```
   VITE_SUPABASE_URL=https://xxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
   ```

### Step 5: Run locally

```bash
npm install
npm run dev
```

Open http://localhost:5173 — you should see the landing page. Try signing up!

### Step 6: Deploy to Vercel (free)

1. Push this project to a GitHub repo
2. Go to [vercel.com](https://vercel.com) and sign up with GitHub
3. Click **New Project** → Import your repo
4. In the **Environment Variables** section, add:
   - `VITE_SUPABASE_URL` = your project URL
   - `VITE_SUPABASE_ANON_KEY` = your anon key
5. Click **Deploy**
6. Your site will be live at `your-project.vercel.app` in ~60 seconds

### Step 7 (optional): Custom domain

1. In Vercel, go to your project **Settings > Domains**
2. Add your custom domain (e.g. `chemolog.app`)
3. Follow the DNS instructions Vercel gives you

---

## Project structure

```
chemolog/
├── index.html
├── package.json
├── vite.config.js
├── supabase-setup.sql    ← Run this in Supabase SQL Editor
├── .env.example           ← Copy to .env and add your keys
└── src/
    ├── main.jsx
    ├── App.jsx            ← Routing + auth protection
    ├── index.css          ← Global styles
    ├── lib/
    │   ├── supabase.js    ← Supabase client
    │   └── auth.jsx       ← Auth context (signup/login/logout)
    └── pages/
        ├── Landing.jsx    ← Public landing page
        ├── Auth.jsx       ← Login / signup forms
        ├── Dashboard.jsx  ← Symptom overview + charts
        └── LogEntry.jsx   ← Daily symptom logging form
```

## Tech stack

- **Frontend**: React 18 + Vite
- **Backend/Auth/DB**: Supabase (Postgres + Auth + API)
- **Charts**: Recharts
- **Hosting**: Vercel

---

Built with care.
