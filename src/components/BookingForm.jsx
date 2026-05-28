import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CalendarCheck, Loader2, Mail, MessageCircle } from 'lucide-react';
import { createAppointment, fetchBookedSlots } from '../services/appointments';
import { isSupabaseConfigured, supabaseConfigError } from '../lib/supabaseClient';
import {
  buildTimeSlots,
  genderOptions,
  initialBookingForm,
  treatmentOptions,
} from '../features/booking/constants';
import { clinicContact } from '../shared/config/contact';

const arGenderOptions = ['أنثى', 'ذكر', 'أفضل عدم الإجابة'];

const bookingCopy = {
  en: {
    title: 'Book an appointment',
    subtitle: 'Choose a date and time that works for you.',
    name: 'Name',
    email: 'Email address',
    phone: 'Phone number',
    treatment: 'Treatment interest',
    age: 'Age',
    gender: 'Gender',
    date: 'Preferred date',
    time: 'Preferred time',
    notes: 'Additional notes',
    selectTreatment: 'Select treatment',
    selectGender: 'Select gender',
    selectTime: 'Select time',
    closed: 'The clinic is closed on Fridays. Please choose Saturday to Thursday.',
    fullyBooked: 'All slots are booked for this date.',
    success: 'Appointment request sent. The clinic will confirm it soon.',
    submit: 'Submit booking',
    notify: 'Notify clinic',
    emailClinic: 'Email clinic',
  },
  ar: {
    title: 'احجز موعد',
    subtitle: 'اختر اليوم والوقت المناسبين لك.',
    name: 'الاسم',
    email: 'البريد الإلكتروني',
    phone: 'رقم الهاتف',
    treatment: 'الخدمة المطلوبة',
    age: 'العمر',
    gender: 'النوع',
    date: 'التاريخ المفضل',
    time: 'الوقت المفضل',
    notes: 'ملاحظات إضافية',
    selectTreatment: 'اختر الخدمة',
    selectGender: 'اختر النوع',
    selectTime: 'اختر الوقت',
    closed: 'العيادة مغلقة يوم الجمعة. من فضلك اختر من السبت إلى الخميس.',
    fullyBooked: 'كل المواعيد محجوزة في هذا اليوم.',
    success: 'تم إرسال طلب الحجز. ستقوم العيادة بتأكيد الموعد قريباً.',
    submit: 'إرسال الحجز',
    notify: 'إبلاغ العيادة',
    emailClinic: 'إرسال بريد',
  },
};

const timeSlots = buildTimeSlots();
const getTodayValue = () => new Date().toISOString().slice(0, 10);
const isFriday = (date) => date && new Date(`${date}T12:00:00`).getDay() === 5;

export default function BookingForm({ variant = 'default', language = 'en' }) {
  const [form, setForm] = useState(initialBookingForm);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [lastBooking, setLastBooking] = useState(null);
  const copy = bookingCopy[language] || bookingCopy.en;
  const isArabic = language === 'ar';
  const availableSlots = useMemo(
    () => timeSlots.filter((slot) => !bookedSlots.includes(slot)),
    [bookedSlots]
  );

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  useEffect(() => {
    let active = true;

    if (!form.date || !isSupabaseConfigured || isFriday(form.date)) {
      setBookedSlots([]);
      return undefined;
    }

    setLoadingSlots(true);
    fetchBookedSlots(form.date)
      .then((slots) => {
        if (active) setBookedSlots(slots);
      })
      .catch(() => {
        if (active) setBookedSlots([]);
      })
      .finally(() => {
        if (active) setLoadingSlots(false);
      });

    return () => {
      active = false;
    };
  }, [form.date]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');
    setError('');

    if (!isSupabaseConfigured) {
      setError(supabaseConfigError);
      return;
    }

    if (isFriday(form.date)) {
      setError(copy.closed);
      return;
    }

    setLoading(true);

    try {
      await createAppointment(form);
      setMessage(copy.success);
      setLastBooking(form);
      setForm(initialBookingForm);
      setBookedSlots([]);
    } catch (appointmentError) {
      const isNetworkError =
        appointmentError.message === 'Failed to fetch' ||
        appointmentError.name === 'TypeError' ||
        appointmentError.message?.toLowerCase().includes('fetch');

      setError(
        isNetworkError
          ? 'Could not reach Supabase. Check your project URL, anon key, and internet connection.'
          : appointmentError.message || 'Could not book this appointment.'
      );
    } finally {
      setLoading(false);
    }
  };

  const notificationMessage = lastBooking
    ? `New appointment request:
Name: ${lastBooking.name}
Phone: ${lastBooking.phone}
Email: ${lastBooking.email}
Treatment: ${lastBooking.treatment_interest}
Date: ${lastBooking.date}
Time: ${lastBooking.time}
Notes: ${lastBooking.notes || '-'}`
    : '';
  const encodedNotification = encodeURIComponent(notificationMessage);

  return (
    <motion.form
      onSubmit={handleSubmit}
      className={`booking-card grid gap-4 ${variant === 'hero' ? 'booking-card-hero' : ''}`}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
    >
      <div>
        <h2 className="text-2xl font-bold text-stone-950">{copy.title}</h2>
        <p className="mt-1 text-sm text-stone-600">{copy.subtitle}</p>
      </div>

      <label className="grid gap-2 text-sm font-semibold text-stone-700">
        {copy.name}
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          className="booking-input"
          placeholder={isArabic ? 'اسم المريض' : 'Patient name'}
          required
        />
      </label>

      <label className="grid gap-2 text-sm font-semibold text-stone-700">
        {copy.email}
        <input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          className="booking-input"
          placeholder="patient@email.com"
          required
        />
      </label>

      <label className="grid gap-2 text-sm font-semibold text-stone-700">
        {copy.phone}
        <input
          name="phone"
          type="tel"
          value={form.phone}
          onChange={handleChange}
          className="booking-input"
          placeholder="+1 555 123 4567"
          required
        />
      </label>

      <label className="grid gap-2 text-sm font-semibold text-stone-700">
        {copy.treatment}
        <select
          name="treatment_interest"
          value={form.treatment_interest}
          onChange={handleChange}
          className="booking-input"
          required
        >
          <option value="">{copy.selectTreatment}</option>
          {treatmentOptions.map((treatment) => (
            <option key={treatment} value={treatment}>
              {treatment}
            </option>
          ))}
        </select>
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2 text-sm font-semibold text-stone-700">
          {copy.age}
          <input
            name="age"
            type="number"
            min="1"
            max="120"
            value={form.age}
            onChange={handleChange}
            className="booking-input"
            placeholder="Age"
            required
          />
        </label>

        <label className="grid gap-2 text-sm font-semibold text-stone-700">
          {copy.gender}
          <select
            name="gender"
            value={form.gender}
            onChange={handleChange}
            className="booking-input"
            required
          >
            <option value="">{copy.selectGender}</option>
            {(isArabic ? arGenderOptions : genderOptions).map((gender, index) => (
              <option key={gender} value={genderOptions[index]}>
                {gender}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2 text-sm font-semibold text-stone-700">
          {copy.date}
          <input
            name="date"
            type="date"
            min={getTodayValue()}
            value={form.date}
            onChange={handleChange}
            className="booking-input"
            required
          />
        </label>

        <label className="grid gap-2 text-sm font-semibold text-stone-700">
          {copy.time}
          <select
            name="time"
            value={form.time}
            onChange={handleChange}
            className="booking-input"
            disabled={!form.date || loadingSlots || isFriday(form.date) || availableSlots.length === 0}
            required
          >
            <option value="">
              {loadingSlots
                ? isArabic
                  ? 'جاري تحميل المواعيد'
                  : 'Loading times'
                : copy.selectTime}
            </option>
            {availableSlots.map((slot) => (
              <option key={slot} value={slot}>
                {slot}
              </option>
            ))}
          </select>
        </label>
      </div>
      {isFriday(form.date) && <p className="text-sm font-semibold text-rose-700">{copy.closed}</p>}
      {form.date && !isFriday(form.date) && availableSlots.length === 0 && !loadingSlots && (
        <p className="text-sm font-semibold text-rose-700">{copy.fullyBooked}</p>
      )}

      <label className="grid gap-2 text-sm font-semibold text-stone-700">
        {copy.notes}
        <textarea
          name="notes"
          value={form.notes}
          onChange={handleChange}
          className="booking-input min-h-28 resize-y"
          placeholder={
            isArabic
              ? 'اكتب أي ألم أو حساسية أو هدف من الزيارة.'
              : 'Tell us about pain, sensitivity, goals, or anything the dentist should know.'
          }
        />
      </label>

      <AnimatePresence>
        {message && (
          <motion.p
            className="rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-800"
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
          >
            {message}
          </motion.p>
        )}
        {error && (
          <motion.p
            className="rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-800"
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>

      <motion.button
        type="submit"
        disabled={loading}
        className="gold-button justify-center disabled:cursor-not-allowed disabled:opacity-70"
        whileHover={loading ? undefined : { y: -2 }}
        whileTap={loading ? undefined : { scale: 0.98 }}
      >
        {loading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <CalendarCheck className="h-5 w-5" />
        )}
        {copy.submit}
      </motion.button>
      {lastBooking && (
        <div className="grid gap-2 sm:grid-cols-2">
          <a
            href={`https://wa.me/${clinicContact.whatsappPhone}?text=${encodedNotification}`}
            target="_blank"
            rel="noreferrer"
            className="ghost-notify-button"
          >
            <MessageCircle className="h-4 w-4" />
            {copy.notify}
          </a>
          <a
            href={`mailto:${clinicContact.email}?subject=New appointment request&body=${encodedNotification}`}
            className="ghost-notify-button"
          >
            <Mail className="h-4 w-4" />
            {copy.emailClinic}
          </a>
        </div>
      )}
    </motion.form>
  );
}
