import { useEffect, useMemo, useState } from 'react';
import {
  CalendarDays,
  Check,
  Clock,
  Loader2,
  Lock,
  LogOut,
  Mail,
  Phone,
  RefreshCw,
  Search,
  UserRound,
  X,
} from 'lucide-react';
import { fetchAppointments, updateAppointmentStatus } from '../services/appointments';
import { isSupabaseConfigured, supabase, supabaseConfigError } from '../lib/supabaseClient';

const statusStyles = {
  pending: 'admin-status-pending',
  confirmed: 'admin-status-confirmed',
  cancelled: 'admin-status-cancelled',
};

const statusOptions = ['all', 'pending', 'confirmed', 'cancelled'];

function formatDate(value) {
  if (!value) return '-';
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' }).format(
    date
  );
}

export default function AdminDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [session, setSession] = useState(null);
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [statusFilter, setStatusFilter] = useState('all');
  const [query, setQuery] = useState('');
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

  const metrics = useMemo(() => {
    const pending = appointments.filter((appointment) => appointment.status === 'pending').length;
    const confirmed = appointments.filter(
      (appointment) => appointment.status === 'confirmed'
    ).length;
    const cancelled = appointments.filter(
      (appointment) => appointment.status === 'cancelled'
    ).length;

    return [
      { label: 'Total requests', value: appointments.length, tone: 'neutral' },
      { label: 'Needs review', value: pending, tone: 'pending' },
      { label: 'Confirmed', value: confirmed, tone: 'confirmed' },
      { label: 'Cancelled', value: cancelled, tone: 'cancelled' },
    ];
  }, [appointments]);

  const filteredAppointments = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return appointments.filter((appointment) => {
      const matchesStatus = statusFilter === 'all' || appointment.status === statusFilter;
      const searchable = [
        appointment.name,
        appointment.email,
        appointment.phone,
        appointment.treatment_interest,
        appointment.notes,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return matchesStatus && (!normalizedQuery || searchable.includes(normalizedQuery));
    });
  }, [appointments, query, statusFilter]);

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
      <main className="admin-shell admin-centered">
        <div className="admin-loading">
          <Loader2 className="h-5 w-5 animate-spin" />
          Loading admin access
        </div>
      </main>
    );
  }

  if (!session) {
    return (
      <main className="admin-auth-shell">
        <form onSubmit={handleLogin} className="admin-auth-card">
          <div className="admin-auth-icon">
            <Lock className="h-6 w-6" />
          </div>
          <p className="admin-kicker">Staff access</p>
          <h1>Admin sign in</h1>
          <p>Use the clinic staff account to review and manage appointment requests.</p>

          <div className="admin-auth-fields">
            <label>
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
            <label>
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

          {error && <p className="admin-error">{error}</p>}

          <button type="submit" className="gold-button admin-auth-submit">
            Sign in
          </button>
        </form>
      </main>
    );
  }

  return (
    <main className="admin-shell">
      <header className="admin-hero">
        <div>
          <p className="admin-kicker">Admin</p>
          <h1>Appointment dashboard</h1>
          <p>Review requests, contact patients, and keep visit status clear.</p>
        </div>
        <div className="admin-header-actions">
          <button type="button" onClick={loadAppointments} className="admin-ghost-button">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
          <button type="button" onClick={handleLogout} className="admin-ghost-button">
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>
      </header>

      <section className="admin-metrics" aria-label="Appointment summary">
        {metrics.map((metric) => (
          <article key={metric.label} className={`admin-metric admin-metric-${metric.tone}`}>
            <span>{metric.label}</span>
            <strong>{metric.value}</strong>
          </article>
        ))}
      </section>

      <section className="admin-panel">
        <div className="admin-toolbar">
          <label className="admin-search">
            <Search className="h-4 w-4" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search patient, phone, treatment..."
            />
          </label>

          <div className="admin-status-tabs" aria-label="Filter appointments by status">
            {statusOptions.map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setStatusFilter(status)}
                className={statusFilter === status ? 'active' : ''}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {error && <p className="admin-error">{error}</p>}

        {loading ? (
          <div className="admin-loading-block">
            <div className="admin-loading">
              <Loader2 className="h-5 w-5 animate-spin" />
              Loading appointments
            </div>
            {[1, 2, 3, 4].map((row) => (
              <div key={row} className="admin-skeleton-row">
                <span />
                <span />
                <span />
                <span />
              </div>
            ))}
          </div>
        ) : filteredAppointments.length === 0 ? (
          <div className="admin-empty">
            <CalendarDays className="h-8 w-8" />
            <h2>No appointments found</h2>
            <p>Try a different search or status filter.</p>
          </div>
        ) : (
          <>
            <div className="admin-card-list">
              {filteredAppointments.map((appointment) => (
                <AppointmentCard
                  key={appointment.id}
                  appointment={appointment}
                  savingId={savingId}
                  onStatus={handleStatus}
                />
              ))}
            </div>

            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Patient</th>
                    <th>Contact</th>
                    <th>Treatment</th>
                    <th>Visit</th>
                    <th>Notes</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAppointments.map((appointment) => (
                    <tr key={appointment.id}>
                      <td>
                        <strong>{appointment.name}</strong>
                        <span>
                          {[appointment.age, appointment.gender].filter(Boolean).join(' / ') || '-'}
                        </span>
                      </td>
                      <td>
                        <a href={`tel:${appointment.phone}`}>{appointment.phone}</a>
                        <span>{appointment.email || '-'}</span>
                      </td>
                      <td>{appointment.treatment_interest || '-'}</td>
                      <td>
                        <strong>{formatDate(appointment.date)}</strong>
                        <span>{appointment.time || '-'}</span>
                      </td>
                      <td className="admin-notes">{appointment.notes || '-'}</td>
                      <td>
                        <StatusBadge status={appointment.status} />
                      </td>
                      <td>
                        <StatusActions
                          appointment={appointment}
                          savingId={savingId}
                          onStatus={handleStatus}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </section>
    </main>
  );
}

function StatusBadge({ status }) {
  return <span className={`admin-status ${statusStyles[status] || statusStyles.pending}`}>{status}</span>;
}

function StatusActions({ appointment, savingId, onStatus }) {
  const isSaving = savingId === appointment.id;

  return (
    <div className="admin-row-actions">
      <button
        type="button"
        disabled={isSaving || appointment.status === 'confirmed'}
        onClick={() => onStatus(appointment.id, 'confirmed')}
        className="admin-confirm-button"
        aria-label="Confirm appointment"
      >
        <Check className="h-4 w-4" />
      </button>
      <button
        type="button"
        disabled={isSaving || appointment.status === 'cancelled'}
        onClick={() => onStatus(appointment.id, 'cancelled')}
        className="admin-cancel-button"
        aria-label="Cancel appointment"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

function AppointmentCard({ appointment, savingId, onStatus }) {
  return (
    <article className="admin-appointment-card">
      <div className="admin-card-topline">
        <div>
          <h2>{appointment.name}</h2>
          <p>{appointment.treatment_interest || 'General visit'}</p>
        </div>
        <StatusBadge status={appointment.status} />
      </div>

      <div className="admin-card-details">
        <span>
          <CalendarDays className="h-4 w-4" />
          {formatDate(appointment.date)}
        </span>
        <span>
          <Clock className="h-4 w-4" />
          {appointment.time || '-'}
        </span>
        <span>
          <Phone className="h-4 w-4" />
          {appointment.phone}
        </span>
        <span>
          <Mail className="h-4 w-4" />
          {appointment.email || '-'}
        </span>
        <span>
          <UserRound className="h-4 w-4" />
          {[appointment.age, appointment.gender].filter(Boolean).join(' / ') || '-'}
        </span>
      </div>

      {appointment.notes && <p className="admin-card-notes">{appointment.notes}</p>}

      <StatusActions appointment={appointment} savingId={savingId} onStatus={onStatus} />
    </article>
  );
}
