<div align="center">

<img src="https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js" />
<img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white" />
<img src="https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" />
<img src="https://img.shields.io/badge/NeonDB-PostgreSQL-00E5BF?style=flat-square&logo=postgresql&logoColor=white" />
<img src="https://img.shields.io/badge/Gemini_2.0_Flash-AI-4285F4?style=flat-square&logo=google&logoColor=white" />
<img src="https://img.shields.io/badge/Deployed_on-Vercel-000000?style=flat-square&logo=vercel" />

<br /><br />

```
███████╗██╗      ██████╗ ██╗    ██╗████████╗██████╗ ██╗██████╗
██╔════╝██║     ██╔═══██╗██║    ██║╚══██╔══╝██╔══██╗██║██╔══██╗
█████╗  ██║     ██║   ██║██║ █╗ ██║   ██║   ██████╔╝██║██████╔╝
██╔══╝  ██║     ██║   ██║██║███╗██║   ██║   ██╔══██╗██║██╔═══╝
██║     ███████╗╚██████╔╝╚███╔███╔╝   ██║   ██║  ██║██║██║
╚═╝     ╚══════╝ ╚═════╝  ╚══╝╚══╝    ╚═╝   ╚═╝  ╚═╝╚═╝╚═╝
```

### *Your smartest travel companion.*
**Describe your dream trip. Get a complete itinerary in seconds.**

[**Live Demo →**](https://flowtrip.vercel.app) &nbsp;·&nbsp; [**Report a Bug**](https://github.com/King-Vamp/flowtrip/issues) &nbsp;·&nbsp; [**Request a Feature**](https://github.com/King-Vamp/flowtrip/issues)

<br />

![FlowTrip Hero](https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80&auto=format&fit=crop)

</div>

---

<br />

## What is FlowTrip?

Most travel tools are just directories. You still do all the thinking.

**FlowTrip is different.** Tell it where you want to go, how long you have, your budget, and your vibe — and it builds a complete, day-by-day itinerary that actually fits your life. No forms. No dropdowns. Just a conversation.

It's built on two of the fastest AI models on the planet, backed by a database of 10 million real-world attractions, and served with real photography of every destination. From the first prompt to a saved itinerary — under 10 seconds.

<br />

## ✦ Features

<table>
<tr>
<td width="50%">

### 🤖 Dual AI Engine
Switch between **Google Gemini 2.0 Flash** (best for detailed itineraries) and **Groq Llama 3.3 70B** (10× faster responses) mid-conversation. Both are free to use.

</td>
<td width="50%">

### 🗺️ Live Destinations
10M+ real attractions powered by **Geoapify Places API**, paired with stunning **Unsplash photography**. Filter by continent, category, and travel style.

</td>
</tr>
<tr>
<td width="50%">

### 💾 Trip Library
Every itinerary the AI generates can be saved to your personal trip library — with full markdown rendering, metadata, and a direct link back to the AI Planner to keep building.

</td>
<td width="50%">

### 👤 Smart Profiles
Preferences, travel style, climate preference, currency, bio, and location — all stored in PostgreSQL and used to personalize every interaction.

</td>
</tr>
<tr>
<td width="50%">

### 🌗 Zero-Flash Dark Mode
Light, Dark, and System themes — persisted to `localStorage` with an inline script that applies the class before React hydrates. No flicker, ever.

</td>
<td width="50%">

### 🔐 Production Auth
Email/password with OTP verification + Google OAuth — all through Base44. Session cookies, JWT decoding, and NeonDB profile sync on every `/api/auth/me` call.

</td>
</tr>
</table>

<br />

## ⚡ Tech Stack

| Layer | Technology | Why |
|---|---|---|
| **Framework** | Next.js 16 — App Router + Turbopack | File-based routing, RSC, edge-ready |
| **Language** | TypeScript 5 | End-to-end type safety |
| **Styling** | Tailwind CSS v4 + shadcn/ui | CSS variables, zero-runtime theming |
| **Animations** | Framer Motion | Physics-based spring animations |
| **Auth** | Base44 | Email + OAuth, OTP verification |
| **Database** | NeonDB (PostgreSQL) + Drizzle ORM | Serverless Postgres, type-safe queries |
| **AI — Quality** | Google Gemini 2.0 Flash | Best itinerary depth and reasoning |
| **AI — Speed** | Groq Llama 3.3 70B | Sub-second inference via LPU hardware |
| **Photos** | Unsplash API | 3M+ professional travel photographs |
| **Places** | Geoapify Places API | 10M+ real global attractions |
| **Deployment** | Vercel | Edge network, CI/CD, preview URLs |

<br />

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- npm or yarn
- A free [NeonDB](https://neon.tech) project
- Free API keys (all take under 2 minutes each)

### 1. Clone the repository

```bash
git clone https://github.com/Spiderykiller/flowtrip.git
cd flowtrip
npm install
```

### 2. Configure environment variables

Create `.env.local` in the project root:

```env
# App
NEXT_PUBLIC_BASE44_APP_ID=your_base44_app_id
NEXT_PUBLIC_APP_BASE_URL=http://localhost:3000
BASE44_DISABLE_ANALYTICS=true

# AI — both free, no credit card required
GEMINI_API_KEY=           # aistudio.google.com
GROQ_API_KEY=             # console.groq.com

# Database
DATABASE_URL=             # neon.tech → Connection string

# Media & Places
UNSPLASH_ACCESS_KEY=      # unsplash.com/developers
GEOAPIFY_API_KEY=         # myprojects.geoapify.com/register
```

<details>
<summary><b>Where to get each key</b></summary>

| Key | URL | Free Tier |
|---|---|---|
| `GEMINI_API_KEY` | [aistudio.google.com](https://aistudio.google.com) | 1,500 req/day |
| `GROQ_API_KEY` | [console.groq.com](https://console.groq.com) | 14,400 req/day |
| `DATABASE_URL` | [neon.tech](https://neon.tech) | 0.5 GB storage |
| `UNSPLASH_ACCESS_KEY` | [unsplash.com/developers](https://unsplash.com/developers) | 50 req/hour |
| `GEOAPIFY_API_KEY` | [geoapify.com](https://myprojects.geoapify.com/register) | 3,000 credits/day |

</details>

### 3. Initialize the database

```bash
npm install dotenv
npx drizzle-kit push
```

This creates three tables in NeonDB: `users`, `saved_trips`, and `trip_history`.

### 4. Start the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you're live.

<br />

## 📁 Project Structure

```
flowtrip/
├── app/
│   ├── (main)/                 # All app pages (wrapped in Navbar + Footer)
│   │   ├── page.tsx            # Home — hero with AI search bar
│   │   ├── AIPlanner/          # AI chat interface (Gemini + Groq)
│   │   ├── Destinations/       # Live destination gallery + Explore modal
│   │   ├── HowItWorks/         # Product explainer
│   │   ├── Community/          # Community page
│   │   ├── profile/            # User profile — view + inline edit
│   │   ├── settings/           # Profile · Security · Preferences · Appearance · Notifications
│   │   ├── saved-trips/        # Trip library grid
│   │   ├── saved-trips/[id]/   # Full itinerary detail with markdown rendering
│   │   ├── about/              # About FlowTrip
│   │   ├── careers/            # Careers page
│   │   ├── press/              # Press & media assets
│   │   ├── privacy/            # Privacy Policy
│   │   ├── terms/              # Terms of Service
│   │   └── cookies/            # Cookie Policy
│   ├── api/
│   │   ├── ai/chat/            # POST — Gemini / Groq router
│   │   ├── auth/               # login · signup · me · logout · callback · verify-otp
│   │   ├── destinations/       # GET — Geoapify + Unsplash with 1hr cache
│   │   └── user/
│   │       ├── profile/        # GET · PATCH — NeonDB profile
│   │       └── trips/          # GET · POST · DELETE — saved trips CRUD
│   └── layout.tsx              # Root layout — ThemeProvider + AuthProvider
│
├── components/
│   ├── ai-planner/             # ChatMessage · SaveTripModal · SuggestedPrompts · TypingIndicator
│   ├── destinations/           # DestinationCard · ExploreModal
│   ├── layout/                 # Navbar · Footer · AppLayout
│   ├── shared/                 # AnimatedSection · SectionLabel
│   └── ui/                     # shadcn/ui primitives (40+ components)
│
├── db/
│   ├── schema.ts               # Drizzle schema — users · saved_trips · trip_history
│   └── index.ts                # NeonDB client
│
├── lib/
│   ├── AuthContext.tsx          # useAuth — session, login, signup, logout, refresh
│   └── ThemeContext.tsx         # useTheme — light / dark / system
│
└── drizzle.config.ts           # Drizzle Kit config
```

<br />

## 🗄️ Database Schema

```sql
-- Users — synced from Base44 JWT, extended with profile data
users (
  id                    TEXT PRIMARY KEY,   -- Base44 user ID
  email                 TEXT NOT NULL,
  full_name             TEXT,
  bio                   TEXT,
  location              TEXT,
  website               TEXT,
  preferred_travel_style TEXT,              -- adventure | luxury | budget | cultural | family | solo
  preferred_climate     TEXT,              -- tropical | cold | temperate | desert | mediterranean
  currency              TEXT DEFAULT 'USD',
  email_notifications   BOOLEAN DEFAULT true,
  trip_reminders        BOOLEAN DEFAULT true,
  created_at            TIMESTAMP,
  updated_at            TIMESTAMP
)

-- Saved Trips — AI-generated itineraries stored per user
saved_trips (
  id              UUID PRIMARY KEY,
  user_id         TEXT REFERENCES users(id) ON DELETE CASCADE,
  title           TEXT NOT NULL,
  destination     TEXT NOT NULL,
  cover_image_url TEXT,
  duration_days   TEXT,
  budget          TEXT,
  itinerary       JSONB,                   -- { raw: "<markdown string>" }
  notes           TEXT,
  is_public       BOOLEAN DEFAULT false,
  created_at      TIMESTAMP,
  updated_at      TIMESTAMP
)

-- Trip History — passive log of AI queries per user
trip_history (
  id          UUID PRIMARY KEY,
  user_id     TEXT REFERENCES users(id) ON DELETE CASCADE,
  destination TEXT NOT NULL,
  query       TEXT,
  ai_provider TEXT,                        -- gemini | groq
  viewed_at   TIMESTAMP
)
```

<br />

## 🌍 Deployment

### Vercel (recommended)

```bash
# 1. Push to GitHub
git add . && git commit -m "deploy" && git push

# 2. Import on Vercel
# vercel.com/new → select your repo

# 3. Add environment variables
# Vercel Dashboard → Settings → Environment Variables
# Copy all keys from your .env.local

# 4. Deploy → done
```

### Environment Variables on Vercel

Go to **Project → Settings → Environment Variables** and add every key from your `.env.local`. Vercel auto-redeploys on every push to `main`.

### GitHub Actions CI

The repo includes a CI pipeline at `.github/workflows/ci.yml` that runs TypeScript type checking and a full Next.js build on every push and pull request to `main`.

Add your secrets at **GitHub → Settings → Secrets and variables → Actions**.

<br />

## 🧠 How the AI Works

```
User types: "5 days in Kyoto, April, $2000 budget, love temples and food"
                          │
                          ▼
          ┌───────────────────────────────┐
          │     /api/ai/chat (POST)       │
          │                               │
          │  provider = "gemini" | "groq" │
          │  messages = conversation[]    │
          └───────────────┬───────────────┘
                          │
             ┌────────────┴────────────┐
             │                         │
     provider=gemini            provider=groq
             │                         │
    Gemini 2.0 Flash           Llama 3.3 70B
    (Google AI Studio)         (Groq LPU Cloud)
             │                         │
             └────────────┬────────────┘
                          │
                    AI response
                  (markdown text)
                          │
                          ▼
           Client renders with ReactMarkdown
           "Save this trip" button appears
                          │
                          ▼
          Modal pre-fills title, destination,
          duration, budget via regex extraction
                          │
                          ▼
          POST /api/user/trips → NeonDB
```

<br />

## 📸 Screenshots

| Home — AI Search | Destinations Gallery |
|---|---|
| ![Home](https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&q=80&fit=crop) | ![Destinations](https://images.unsplash.com/photo-1530521954074-e64f6810b32d?w=600&q=80&fit=crop) |

| AI Planner | Saved Trips |
|---|---|
| ![AI Planner](https://images.unsplash.com/photo-1526772662000-3f88f10405ff?w=600&q=80&fit=crop) | ![Saved](https://images.unsplash.com/photo-1501446529957-6226b3ac0f3a?w=600&q=80&fit=crop) |

<br />

## 🤝 Contributing

Contributions, issues and feature requests are welcome.

```bash
# Fork → clone → branch
git checkout -b feature/your-feature-name

# Make your changes, then
git commit -m "feat: describe your change"
git push origin feature/your-feature-name

# Open a Pull Request
```

Please keep PRs focused — one feature or fix per PR.

<br />

## 📄 License

MIT © [King_Vamp](https://github.com/King-Vamp)

<br />

---

<div align="center">

**Built with obsession. Powered by AI. Made for explorers.**

*If FlowTrip helped you plan a trip, leave a ⭐ — it means more than you think.*

<br />

[↑ Back to top](#)

</div>
