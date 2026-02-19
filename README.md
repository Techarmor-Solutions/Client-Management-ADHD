# ADHD Client Manager

A React web app for marketing agency owners with ADHD. Guiding principle: **always show what to do next, without making you think.**

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS v3
- **Database**: Supabase (PostgreSQL + Auth)
- **Hosting**: Vercel

---

## Local Development

```bash
# 1. Install dependencies
npm install

# 2. Copy env and fill in your Supabase credentials
cp .env.example .env.local

# 3. Start dev server
npm run dev
```

---

## One-Time Setup

### 1. Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run `supabase/schema.sql`
3. Go to **Authentication → Providers → Google** and enable it
4. Paste your Google Cloud OAuth **Client ID** and **Client Secret**

### 2. Google Cloud Console

1. Go to [console.cloud.google.com](https://console.cloud.google.com) → **APIs & Services → Credentials**
2. Create an **OAuth 2.0 Client ID** (Web application)
3. Add authorized redirect URI:
   ```
   https://<your-project-ref>.supabase.co/auth/v1/callback
   ```
4. Copy the Client ID and Secret into Supabase

### 3. Supabase URL Configuration

In Supabase → **Authentication → URL Configuration**:
- **Site URL**: `https://your-subdomain.yourdomain.com`
- **Redirect URLs**: add `https://your-subdomain.yourdomain.com`

### 4. Vercel Deployment

1. Push this repo to GitHub
2. Import at [vercel.com](https://vercel.com)
3. Add environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Set your custom subdomain in Vercel → **Domains**

---

## Features

- **Task list** — sorted by overdue → due date → priority
- **Quick Add bar** — always visible; clears title, preserves client + recurrence
- **"What's Next?"** — highlights the single most important task
- **Recurring tasks** — daily / weekly / monthly; auto-creates next occurrence on complete
- **Client view** — status, revenue, projects, per-client task list
- **Weekly Review** — 4-step guided flow (catch up overdue → review clients → plan week → done)
- **Google sign-in only** — single user, RLS-secured

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `n` | Focus Quick Add bar |
| `Esc` | Close any open modal |
