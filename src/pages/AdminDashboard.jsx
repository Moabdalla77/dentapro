import { useEffect, useState } from 'react';
import { Check, Loader2, Lock, LogOut, RefreshCw, X } from 'lucide-react';
import { fetchAppointments, updateAppointmentStatus } from '../services/appointments';
import { isSupabaseConfigured, supabase, supabaseConfigError } from '../lib/supabaseClient';

const statusStyles = {
  pending: 'bg-amber-50 text-amber-800 ring-amber-200',
  confirmed: 'bg-emerald-50 text-emerald-800 ring-emerald-200',
  cancelled: 'bg-rose-50 text-rose-800 ring-rose-200',
};

export default function AdminDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [session, setSession] = useState(null);
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const loadAppointments = async () => {
    setError('');

    if (!isSupabaseConfigured) {
      setLoading(false);
      setError(supabaseConfigError);
      return;
    }

    setLoading(true);

    try {
      setAppointments(await fetchAppointments());
    } catch (appointmentsError) {
      setError(appointmentsError.message || 'Could not load appointments.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setAuthLoading(false);
      setLoading(false);
      setError(supabaseConfigError);
      return undefined;
    }

    let mounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setSession(data.session);
      setAuthLoading(false);
      if (data.session) loadAppointments();
      else setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      if (nextSession) loadAppointments();
      else {
        setAppointments([]);
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const handleCredentialChange = (event) => {
    const { name, value } = event.target;
    setCredentials((current) => ({ ...current, [name]: value }));
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setError('');
    setAuthLoading(true);

    const { error: signInError } = await supabase.auth.signInWithPassword(credentials);

    if (signInError) {
      setError(signInError.message || 'Could not sign in.');
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const handleStatus = async (id, status) => {
    setSavingId(id);
    setError('');

    try {
      const updated = await updateAppointmentStatus(id, status);
      setAppointments((current) =>
        current.map((appointment) => (appointment.id === id ? updated : appointment))
      );
    } catch (statusError) {
      setError(statusError.message || 'Could not update appointment.');
    } finally {
      setSavingId(null);
    }
  };

  if (authLoading) {
    return (
      <main className="mx-auto grid min-h-[calc(100vh-8rem)] max-w-6xl place-items-center px-4 py-10 sm:px-6">
        <div className="flex items-center gap-3 text-slate-600">
          <Loader2 className="h-5 w-5 animate-spin" />
          Loading admin access
        </div>
      </main>
    );
  }

  if (!session) {
    return (
      <main className="mx-auto grid min-h-[calc(100vh-8rem)] max-w-md place-items-center px-4 py-10 sm:px-6">
        <form
          onSubmit={handleLogin}
          className="w-full rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-clinic-100 text-clinic-700">
            <Lock className="h-6 w-6" />
          </div>
          <h1 className="mt-5 text-2xl font-bold text-slate-950">Admin sign in</h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Sign in with the clinic staff account to view and manage appointment requests.
          </p>
          <div className="mt-5 grid gap-4">
            <label className="grid gap-2 text-sm font-semibold text-slate-700">
              Email
              <input
                name="email"
                type="email"
                value={credentials.email}
                onChange={handleCredentialChange}
                className="booking-input"
                required
              />
            </label>
            <label className="grid gap-2 text-sm font-semibold text-slate-700">
              Password
              <input
                name="password"
                type="password"
                value={credentials.password}
                onChange={handleCredentialChange}
                className="booking-input"
                required
              />
            </label>
          </div>
          {error && (
            <p className="mt-4 rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-800">{error}</p>
          )}
          <button type="submit" className="gold-button mt-5 w-full justify-center">
            Sign in
          </button>
        </form>
      </main>
    );
  }

  return (
    <main className="mx-auto min-h-[calc(100vh-8rem)] max-w-6xl px-4 py-10 sm:px-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">Admin</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-950">Appointment dashboard</h1>
          <p className="mt-2 text-slate-600">View bookings and update their status.</p>
        </div>
        <button
          type="button"
          onClick={loadAppointments}
          className="inline-flex items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>
        <button
          type="button"
          onClick={handleLogout}
          className="inline-flex items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </div>

      {error && (
        <p className="mt-6 rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-800">{error}</p>
      )}

      <section className="mt-6 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        {loading ? (
          <div className="grid gap-3 p-6">
            <div className="flex items-center gap-3 text-slate-600">
              <Loader2 className="h-5 w-5 animate-spin" />
              Loading appointments
            </div>
            {[1, 2, 3].map((row) => (
              <div key={row} className="admin-skeleton-row">
                <span />
                <span />
                <span />
                <span />
              </div>
            ))}
          </div>
        ) : appointments.length === 0 ? (
          <p className="p-10 text-center text-slate-500">No bookings yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3">Patient</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Phone</th>
                  <th className="px-4 py-3">Treatment</th>
                  <th className="px-4 py-3">Age</th>
                  <th className="px-4 py-3">Gender</th>
                  <th className="px-4 py-3">Preferred date</th>
                  <th className="px-4 py-3">Preferred time</th>
                  <th className="px-4 py-3">Notes</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {appointments.map((appointment) => (
                  <tr key={appointment.id}>
                    <td className="whitespace-nowrap px-4 py-4 font-semibold text-slate-900">
                      {appointment.name}
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-slate-600">
                      {appointment.email || '-'}
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-slate-600">
                      {appointment.phone}
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-slate-600">
                      {appointment.treatment_interest || '-'}
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-slate-600">
                      {appointment.age || '-'}
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-slate-600">
                      {appointment.gender || '-'}
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-slate-600">
                      {appointment.date}
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-slate-600">
                      {appointment.time}
                    </td>
                    <td className="max-w-xs px-4 py-4 text-slate-600">
                      <span className="line-clamp-2">{appointment.notes || '-'}</span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-4">
                      <span
                        className={`rounded-md px-2 py-1 text-xs font-bold ring-1 ${statusStyles[appointment.status] || statusStyles.pending}`}
                      >
                        {appointment.status}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-right">
                      <div className="inline-flex gap-2">
                        <button
                          type="button"
                          disabled={savingId === appointment.id}
                          onClick={() => handleStatus(appointment.id, 'confirmed')}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-60"
                          aria-label="Confirm appointment"
                        >
                          <Check className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          disabled={savingId === appointment.id}
                          onClick={() => handleStatus(appointment.id, 'cancelled')}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-rose-600 text-white hover:bg-rose-700 disabled:opacity-60"
                          aria-label="Cancel appointment"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
