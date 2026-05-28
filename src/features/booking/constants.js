export const initialBookingForm = {
  name: '',
  email: '',
  phone: '',
  treatment_interest: '',
  age: '',
  gender: '',
  date: '',
  time: '',
  notes: '',
};

export const treatmentOptions = [
  'Teeth Whitening',
  'Porcelain Veneers',
  'Dental Implants',
  'Clear Aligners',
  'Deep Cleaning',
  'Check-Up + X-Rays',
  'Emergency Visit',
  'Smile Design Consultation',
];

export const genderOptions = ['Female', 'Male', 'Prefer not to say'];

export const buildTimeSlots = () => {
  const slots = [];
  for (let hour = 9; hour < 20; hour += 1) {
    slots.push(`${String(hour).padStart(2, '0')}:00`);
    slots.push(`${String(hour).padStart(2, '0')}:30`);
  }
  return slots;
};
