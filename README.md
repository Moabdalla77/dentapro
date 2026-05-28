# DentaPro

Modern dental clinic website and appointment booking system built with React, Vite, Tailwind CSS, and Supabase.

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=111)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=fff)](https://vite.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-ready-3FCF8E?logo=supabase&logoColor=fff)](https://supabase.com/)
[![Build](https://img.shields.io/badge/build-passing-brightgreen)](#quality-checks)

## Overview

DentaPro is a polished client-side booking experience for a dental clinic. Patients can explore services, review before/after visuals, estimate treatment cost, and request appointments. Staff can sign in to the admin dashboard to view bookings and update appointment status.

## Features

- Responsive dental clinic landing page
- Online appointment booking with Supabase persistence
- Active-slot double-booking protection
- Authenticated admin dashboard
- Appointment status management: pending, confirmed, cancelled
- Treatment cost estimator
- Before/after comparison sliders
- Animated UI sections with Framer Motion
- Lightweight 3D tooth visual and embedded 3D viewer
- English/Arabic language toggle
- WhatsApp, email, phone, and map contact actions

## Tech Stack

- React 19
- Vite 6
- React Router
- Tailwind CSS
- Supabase JavaScript client
- Framer Motion
- Three.js
- Lucide React icons

## Project Structure

```text
dentapro/
|-- public/
|   |-- favicon.ico
|   |-- favicon.svg
|   `-- assets/
|       `-- images/
|           `-- clinic-hero.png
|-- src/
|   |-- components/
|   |   |-- BeforeAfterSlider.jsx
|   |   |-- BookingForm.jsx
|   |   |-- HeroToothScene.jsx
|   |   |-- Layout.jsx
|   |   |-- MotionSection.jsx
|   |   `-- ToothViewer.jsx
|   |-- features/
|   |   `-- booking/
|   |       `-- constants.js
|   |-- lib/
|   |   `-- supabaseClient.js
|   |-- pages/
|   |   |-- AdminDashboard.jsx
|   |   `-- HomePage.jsx
|   |-- services/
|   |   `-- appointments.js
|   |-- shared/
|   |   `-- config/
|   |       `-- contact.js
|   |-- App.jsx
|   |-- main.jsx
|   `-- styles.css
|-- supabase.sql
|-- package.json
|-- tailwind.config.js
|-- vite.config.js
`-- README.md
```

## Getting Started

### Prerequisites

- Node.js 18 or newer
- npm
- Supabase project

### Installation

```bash
npm install
```

Create a local environment file:

```bash
cp .env.example .env
```

Add your Supabase values:

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-supabase-publishable-key
```

The app also supports the older `VITE_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_SUPABASE_URL`, and `NEXT_PUBLIC_SUPABASE_ANON_KEY` names for compatibility.

Start the development server:

```bash
npm run dev
```

Open `http://localhost:4028`.

## Supabase Setup

1. Create a Supabase project.
2. Open the Supabase SQL editor.
3. Run the contents of `supabase.sql`.
4. Add your Supabase URL and publishable key to `.env`.
5. Create a staff user in Supabase Auth for `/admin`.

The SQL file creates the `appointments` table, enables RLS, protects appointment details, and adds a unique active-slot rule so two non-cancelled bookings cannot share the same date and time.

## Routes

| Route | Purpose |
| --- | --- |
| `/` | Public clinic website and booking flow |
| `/admin` | Authenticated appointment dashboard |

## Environment Variables

| Variable | Required | Description |
| --- | --- | --- |
| `VITE_SUPABASE_URL` | Yes | Supabase project URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Yes | Public browser-safe Supabase key |
| `VITE_SUPABASE_ANON_KEY` | Optional | Backward-compatible key name |

Do not commit `.env`. Use `.env.example` as the public template.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Create a production build |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint against `src` |
| `npm run format` | Format source files with Prettier |

## Quality Checks

Before pushing changes:

```bash
npm run lint
npm run build
```

Both checks currently pass.

## Deployment

This app can be deployed to any static hosting provider that supports Vite builds, such as Vercel, Netlify, Cloudflare Pages, or GitHub Pages.

Recommended build settings:

```text
Build command: npm run build
Output directory: dist
```

Add the same Supabase environment variables in your hosting provider dashboard.

## Security Notes

- `.env` is ignored and should stay private.
- The Supabase service role key must never be used in this frontend.
- Public users can create appointment requests and read only the slot fields needed for availability checks.
- Authenticated staff users can read appointment details and update appointment status.
- Run the latest `supabase.sql` in Supabase after database-related changes.

## Repository Hygiene

- `node_modules`, `dist`, local caches, and private environment files are ignored.
- `.env.example` is committed so setup is reproducible.
- Generated or unused assets have been removed from the repository.

## License

No license has been published yet. All rights are reserved by the repository owner unless a license file is added.
