create table if not exists appointments (
  id bigint generated always as identity primary key,
  name text not null,
  email text,
  phone text not null,
  treatment_interest text,
  age integer,
  gender text,
  date date not null,
  time time not null,
  notes text,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'cancelled')),
  created_at timestamptz not null default now()
);

alter table appointments add column if not exists email text;
alter table appointments add column if not exists treatment_interest text;
alter table appointments add column if not exists age integer;
alter table appointments add column if not exists gender text;
alter table appointments add column if not exists notes text;

-- Prevent two active appointments from using the same date and time.
create unique index if not exists appointments_unique_active_slot
on appointments (date, time)
where status <> 'cancelled';

-- Supabase Data API access for the browser client.
-- Run this in the Supabase SQL editor after creating/selecting your project.
grant usage on schema public to anon, authenticated;
revoke all on table public.appointments from anon, authenticated;
grant insert on table public.appointments to anon, authenticated;
grant select (date, time, status) on table public.appointments to anon;
grant select, update on table public.appointments to authenticated;
grant usage, select on all sequences in schema public to anon, authenticated;

alter table public.appointments enable row level security;

drop policy if exists "Public can create pending appointment requests" on public.appointments;
drop policy if exists "Public can read appointment slots" on public.appointments;
drop policy if exists "Public can update appointment status" on public.appointments;
drop policy if exists "Staff can read appointment details" on public.appointments;
drop policy if exists "Staff can update appointment status" on public.appointments;

create policy "Public can create pending appointment requests"
on public.appointments
for insert
to anon, authenticated
with check (
  status = 'pending'
  and name is not null
  and length(trim(name)) > 0
  and phone is not null
  and length(trim(phone)) > 0
  and date is not null
  and time is not null
);

create policy "Public can read appointment slots"
on public.appointments
for select
to anon
using (true);

create policy "Staff can read appointment details"
on public.appointments
for select
to authenticated
using (true);

create policy "Staff can update appointment status"
on public.appointments
for update
to authenticated
using (true)
with check (status in ('pending', 'confirmed', 'cancelled'));
