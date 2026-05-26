# DentaPro React Booking App

DentaPro is now a standard client-side React app built with Vite. It includes a full dental clinic landing page, a patient booking form, Supabase storage, double-booking protection, and a simple admin dashboard.

## Project Structure

```text
dentapro/
├── index.html
├── vite.config.js
├── supabase.sql
├── public/
│   └── assets/images/
├── src/
│   ├── App.jsx
│   ├── main.jsx
│   ├── styles.css
│   ├── components/
│   │   ├── BeforeAfterSlider.jsx
│   │   ├── BookingForm.jsx
│   │   └── Layout.jsx
│   ├── lib/
│   │   └── supabaseClient.js
│   ├── pages/
│   │   ├── AdminDashboard.jsx
│   │   └── HomePage.jsx
│   └── services/
│       └── appointments.js
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
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

The app also accepts the old `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` names, so existing values can keep working while you switch to Vite.

4. Start the app:

```bash
npm run dev
```

Open `http://localhost:4028`.

## Pages

- `/` shows the clinic landing page with hero, services, gallery, before/after sliders, testimonials, pricing, contact, and booking form.
- `/admin` shows all appointments and lets staff mark them as `confirmed` or `cancelled`.

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

The SQL also creates a unique active slot rule so the same date and time cannot be booked twice unless the old appointment is cancelled.

## Scripts

- `npm run dev` starts the Vite development server.
- `npm run build` creates the production build in `dist`.
- `npm run preview` previews the production build.
- `npm run lint` checks the source files.
- `npm run format` formats the source files.
