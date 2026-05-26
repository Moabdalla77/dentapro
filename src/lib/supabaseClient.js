import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (
  import.meta.env.VITE_SUPABASE_URL ||
  import.meta.env.NEXT_PUBLIC_SUPABASE_URL ||
  ''
).trim();
const supabaseKey = (
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  ''
).trim();

const isPlaceholderValue = (value) => {
  const normalizedValue = value.toLowerCase();

  return (
    !normalizedValue ||
    normalizedValue.includes('dummy') ||
    normalizedValue.includes('your-project') ||
    normalizedValue.includes('your-supabase') ||
    normalizedValue.includes('updateyour')
  );
};

const hasValidSupabaseUrl =
  supabaseUrl.startsWith('https://') &&
  supabaseUrl.endsWith('.supabase.co') &&
  !isPlaceholderValue(supabaseUrl);

const hasValidSupabaseKey = supabaseKey.length > 40 && !isPlaceholderValue(supabaseKey);

export const supabaseConfigError =
  hasValidSupabaseUrl && hasValidSupabaseKey
    ? ''
    : 'Supabase is not connected yet. Add your real VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY in .env, then restart the dev server.';

export const isSupabaseConfigured = !supabaseConfigError;

export const supabase = isSupabaseConfigured ? createClient(supabaseUrl, supabaseKey) : null;
