import { supabase } from '../lib/supabaseClient';

const TABLE_NAME = 'appointments';
const getSupabaseClient = () => {
  if (!supabase) {
    throw new Error('Supabase is not connected.');
  }

  return supabase;
};

export async function fetchAppointments() {
  const client = getSupabaseClient();
  const { data, error } = await client
    .from(TABLE_NAME)
    .select('*')
    .neq('status', 'cancelled')
    .order('date', { ascending: true })
    .order('time', { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function fetchBookedSlots(date) {
  const client = getSupabaseClient();
  const { data, error } = await client
    .from(TABLE_NAME)
    .select('time')
    .eq('date', date)
    .neq('status', 'cancelled');

  if (error) throw error;
  return (data ?? []).map((appointment) => appointment.time?.slice(0, 5)).filter(Boolean);
}

export async function createAppointment(appointment) {
  const client = getSupabaseClient();
  const { data: existing, error: lookupError } = await client
    .from(TABLE_NAME)
    .select('id')
    .eq('date', appointment.date)
    .eq('time', appointment.time)
    .neq('status', 'cancelled')
    .maybeSingle();

  if (lookupError) throw lookupError;

  if (existing) {
    throw new Error('This date and time is already booked.');
  }

  const payload = {
    ...appointment,
    age: appointment.age ? Number(appointment.age) : null,
    notes: appointment.notes || null,
    status: 'pending',
  };

  const { data, error } = await client.from(TABLE_NAME).insert(payload).select().single();

  if (error?.code === '23505') {
    throw new Error('This date and time is already booked.');
  }

  if (error) throw error;
  return data;
}

export async function updateAppointmentStatus(id, status) {
  const client = getSupabaseClient();
  const { data, error } = await client
    .from(TABLE_NAME)
    .update({ status })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}
