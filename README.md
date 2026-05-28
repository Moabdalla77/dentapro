# DentaPro React Booking App

DentaPro is a client-side React app built with Vite. It includes a dental clinic landing page, patient appointment booking, Supabase storage, double-booking protection, and a simple authenticated admin dashboard.

## Project Structure

```text
dentapro/
├── index.html
├── vite.config.js
├── supabase.sql
├── public/
│   ├── favicon.ico
│   ├── favicon.svg
│   └── assets/images/
│       └── clinic-hero.png
├── src/
│   ├── App.jsx
│   ├── main.jsx
│   ├── styles.css
│   ├── components/
│   │   ├── BeforeAfterSlider.jsx
│   │   ├── BookingForm.jsx
│   │   ├── HeroToothScene.jsx
│   │   ├── Layout.jsx
│   │   ├── MotionSection.jsx
│   │   └── ToothViewer.jsx
│   ├── features/
│   │   └── booking/
│   │       └── constants.js
│   ├── lib/
│   │   └── supabaseClient.js
│   ├── pages/
│   │   ├── AdminDashboard.jsx
│   │   └── HomePage.jsx
│   ├── services/
│   │   └── appointments.js
│   └── shared/
│       └── config/
│           └── contact.js
├── package.json
├── postcss.config.js
└── tailwind.config.js
```

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create a Supabase project, open the SQL editor, and run the SQL in `supabase.sql`.

3. Copy `.env.example` to `.env` and add your Supabase values:

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-supabase-publishable-key
```

The app also accepts the older `VITE_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_SUPABASE_URL`, and `NEXT_PUBLIC_SUPABASE_ANON_KEY` names for compatibility.

4. Start the app:

```bash
npm run dev
```

Open `http://localhost:4028`.

## Pages

- `/` shows the clinic landing page with hero, services, gallery, before/after sliders, testimonials, pricing, contact, and booking form.
- `/admin` lets authenticated staff view appointments and mark them as `confirmed` or `cancelled`.

## Supabase Table

The app expects an `appointments` table with:

- `id`
- `name`
- `email`
- `phone`
- `treatment_interest`
- `age`
- `gender`
- `date`
- `time`
- `notes`
- `status`

The SQL creates a unique active slot rule so the same date and time cannot be booked twice unless the old appointment is cancelled.

## Scripts

- `npm run dev` starts the Vite development server.
- `npm run build` creates the production build in `dist`.
- `npm run preview` previews the production build.
- `npm run lint` checks the source files.
- `npm run format` formats the source files.

## GitHub Upload Checklist

- Keep `.env` private and untracked.
- Commit `.env.example` so collaborators know which variables are required.
- Do not commit `node_modules`, `dist`, `.npm-cache`, or local agent/tooling folders.
- Run `npm run lint` and `npm run build` before pushing.
