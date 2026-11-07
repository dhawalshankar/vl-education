# VartaLang

**VartaLang** is a language-education platform for learning Indian and foreign languages through structured courses, practice labs, challenges, and certification tracks. This private repository contains the frontend web app, built with Next.js, and is owned by **Dhrupad Research Labs Pvt Ltd**.

> This app talks to separate backend services (see [Environment Variables](#environment-variables)) for authentication, courses, enrollments, and administration. Those backends are not included in this repository.

## Features

- **Landing and marketing pages** — hero, language highlights, learning paths, certifications, and platform information (`app/page.tsx`)
- **Language catalog and courses** — browse 22 scheduled Indian languages, English, foreign languages, and backend-provided courses (`app/learn`, `app/learn/[language]`, `app/learn/[language]/[courseId]`)
- **Role-based dashboards** — student, instructor, and admin views with role-aware access (`app/dashboard`, `app/dashboard/instructor`, `app/dashboard/admin`)
- **Authentication** — email/password and Google sign-in, SSO exchange, protected routes, and password recovery (`app/auth/login`, `app/context/AuthContext.tsx`)
- **Learning activity** — enrollments, course progress, streak tracking, practice labs, challenges, community, and upcoming modules (`app/lib/streak.ts`, `app/practice`, `app/challenges`, `app/community`)
- **Instructor profiles** — public instructor pages with dynamic IDs (`app/instructors/[id]`)
- **Information and support** — About, Certifications, Privacy, and Terms pages

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 16](https://nextjs.org) (App Router) |
| UI library | React 19 |
| Styling | Tailwind CSS 4 |
| Icons | [lucide-react](https://lucide.dev) |
| Language | TypeScript |
| Linting | ESLint (`eslint-config-next`) |
| Authentication UI | [`@react-oauth/google`](https://www.npmjs.com/package/@react-oauth/google) |

## Getting Started

### Prerequisites

- Node.js 18.18+ (or a compatible runtime)
- A running instance of the VartaLang backend API (see [Environment Variables](#environment-variables))

### Installation

```bash
git clone <private-repository-url>
cd vl-education
npm install
```

### Environment Variables

Create a `.env.local` file in the project root:

```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_MAIN_API_URL=http://localhost:5000
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-oauth-client-id
NEXT_PUBLIC_VARTALANG_URL=https://vartalang.in
```

- `NEXT_PUBLIC_API_URL` points to the LMS API. The client appends `/api/v1` for course, enrollment, practice, instructor, and admin endpoints.
- `NEXT_PUBLIC_MAIN_API_URL` points to the main VartaLang service used for email/password and Google authentication before SSO exchange.
- `NEXT_PUBLIC_GOOGLE_CLIENT_ID` configures the Google OAuth provider used on the login page.
- `NEXT_PUBLIC_VARTALANG_URL` is the account signup URL base used when a Google account does not yet exist.

The defaults allow the app to start locally, but authenticated features require reachable backend services and a configured Google OAuth client.

### Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

### Other scripts

```bash
npm run build   # production build
npm run start   # run the production build
npm run lint    # run ESLint
npm test        # run checkout tests
```

### Payment checkout tests

The Razorpay checkout flow is covered by the Vitest suite in
`components/RazorpayCheckout.test.tsx`. The tests mock the Razorpay browser SDK
and backend client, so they do not create real orders or payments. Run them with
`npm test`.

## Project Structure

```
app/
├── page.tsx                          # Landing page
├── layout.tsx                        # Root layout, wraps app in AuthProvider
├── globals.css                       # Global styles / Tailwind entry
├── about/                             # About page
├── certifications/                   # Certification information
├── challenges/                        # Learning challenges
├── community/                         # Community page
├── context/
│   └── AuthContext.tsx               # Auth state, email/Google login, SSO, and logout
├── lib/
│   ├── api.ts                        # API clients and authenticated fetch helper
│   ├── languages.ts                  # Language catalog, aliases, and presentation helpers
│   ├── streak.ts                     # Client-side daily activity streak
│   └── useApi.ts                     # Shared data-fetching hook
├── auth/login/                       # Email/password and Google login
├── forgot-password/                  # Password recovery page
├── dashboard/                        # Student dashboard and enrollments
│   ├── instructor/                   # Instructor dashboard
│   └── admin/                        # Admin dashboard
├── payment-success/                  # Post-payment enrollment confirmation
├── learn/                            # Course catalog
│   └── [language]/
│       ├── page.tsx                  # Courses for a given language
│       └── [courseId]/page.tsx       # Single course page
├── instructors/[id]/                 # Public instructor profile
├── practice/                         # Practice labs and upcoming modules
├── privacy/, terms/                   # Policy pages
└── not-found.tsx                     # 404 page

components/
├── CourseExplorer.tsx                # Course catalog UI
├── CoursePlayerModal.tsx             # Course lesson player
├── CourseStudio.tsx                  # Course authoring UI
├── Footer.tsx
├── Hero.tsx
└── Navbar.tsx

public/                               # Static assets, logos, and icons
```

## Authentication & Roles

Auth is handled client-side via `AuthContext`, which stores the LMS `accessToken` in `localStorage` and exposes:

- `user`, `loading`, `isAuthenticated`
- `isStudent`, `isInstructor`, `isAdmin`
- `login()`, `loginWithGoogle()`, `logout()`

`app/lib/api.ts` wraps `fetch` with automatic Bearer-token injection, retries failed GET requests once for sleeping backend instances, and provides typed API clients for authentication, courses, enrollments, learning, instructors, and administration. Protected pages redirect unauthenticated users to `/auth/login`.

Daily streaks are currently stored per user in browser `localStorage` by `app/lib/streak.ts`. The file documents the future backend heartbeat integration.

## Deployment

The app can be deployed on any Next.js-compatible host (e.g. [Vercel](https://vercel.com/new)). Make sure `NEXT_PUBLIC_API_URL` is set to your production backend URL in the hosting platform's environment settings.

## Ownership & License

This is a private repository owned by **Dhrupad Research Labs Pvt Ltd**. The source code and associated materials are proprietary and must not be copied, redistributed, or reused without written permission. No open-source license is granted.