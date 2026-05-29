import { lazy, Suspense, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Award,
  ChevronDown,
  Clock,
  ExternalLink,
  Mail,
  MapPin,
  MessageCircle,
  Navigation,
  Phone,
  ShieldCheck,
  Smile,
  Sparkles,
  Star,
  Stethoscope,
  Syringe,
} from 'lucide-react';
import BookingForm from '../components/BookingForm';
import BeforeAfterSlider from '../components/BeforeAfterSlider';
import MotionSection from '../components/MotionSection';
import { clinicContact } from '../shared/config/contact';

const ToothViewer = lazy(() => import('../components/ToothViewer.jsx'));

const heroImage = '/assets/images/clinic-hero.png';

const services = [
  {
    title: 'Smile Design',
    arTitle: 'تصميم الابتسامة',
    text: 'Veneers, bonding, whitening, and subtle finishing for a confident natural smile.',
    arText: 'فينير، حشوات تجميلية، تبييض، ولمسات نهائية لابتسامة طبيعية وواثقة.',
    duration: '45-90 min',
    bestFor: 'Color, shape, and smile harmony',
    icon: Sparkles,
    image: 'https://img.rocket.new/generatedImages/rocket_gen_img_1d51188d5-1778696203698.png',
  },
  {
    title: 'Preventive Care',
    arTitle: 'العناية الوقائية',
    text: 'Dental exams, cleaning, polishing, gum checks, and practical care plans.',
    arText: 'كشف الأسنان، التنظيف، التلميع، فحص اللثة، وخطة عناية عملية.',
    duration: '30-60 min',
    bestFor: 'Routine checkups and gum health',
    icon: ShieldCheck,
    image: 'https://img.rocket.new/generatedImages/rocket_gen_img_170242c94-1772074682245.png',
  },
  {
    title: 'Dental Implants',
    arTitle: 'زراعة الأسنان',
    text: 'Precise planning and restorations for missing teeth, function, and comfort.',
    arText: 'تخطيط دقيق وتعويضات للأسنان المفقودة لتحسين الوظيفة والراحة.',
    duration: 'Consultation first',
    bestFor: 'Missing teeth and stable bite support',
    icon: Smile,
    image: 'https://img.rocket.new/generatedImages/rocket_gen_img_156759942-1772376106553.png',
  },
  {
    title: 'Emergency Visits',
    arTitle: 'زيارات الطوارئ',
    text: 'Fast help for tooth pain, chipped teeth, swelling, and urgent concerns.',
    arText: 'مساعدة سريعة لآلام الأسنان، الكسور، التورم، والحالات العاجلة.',
    duration: 'Same-day review',
    bestFor: 'Pain, swelling, and broken teeth',
    icon: Stethoscope,
    image: 'https://img.rocket.new/generatedImages/rocket_gen_img_1aca03d6d-1772973811245.png',
  },
];

const pageCopy = {
  en: {
    langLabel: 'العربية',
    heroPill: 'Modern Dental Clinic',
    heroTitle: 'Smile care with a luxury finish.',
    heroText:
      'Dr. Ahmed Afify brings cosmetic dentistry, preventive care, transparent pricing, and real appointment booking together in one polished experience.',
    book: 'Book Appointment',
    call: 'Call Clinic',
    gallery: 'View Transformations',
    clinicView: 'Clinic View',
    clinicTitle: 'A calm place for confident care.',
    clinicText:
      "A clearer look at the treatment room and clinical setting behind Dr. Ahmed Afify's experience.",
    aboutEyebrow: 'Doctor Profile',
    aboutTitle: 'Meet Dr. Ahmed Afify.',
    aboutText:
      'A patient-focused dental clinician providing clear treatment planning, gentle care, and modern restorative and cosmetic dentistry.',
    aboutPoints: ['Clear explanations before treatment', 'Preventive-first care philosophy', 'Cosmetic and restorative treatment planning'],
    servicesEyebrow: 'Services',
    servicesTitle: 'Everything your smile needs, shaped around comfort.',
    servicesText: 'A refined clinic experience for routine visits, cosmetic upgrades, and urgent concerns.',
    duration: 'Duration',
    bestFor: 'Best for',
  },
  ar: {
    langLabel: 'English',
    heroPill: 'عيادة أسنان حديثة',
    heroTitle: 'عناية بابتسامتك بلمسة راقية.',
    heroText:
      'يقدم د. أحمد عفيفي طب الأسنان التجميلي والوقائي مع أسعار واضحة وحجز مواعيد مباشر في تجربة بسيطة ومنظمة.',
    book: 'احجز موعد',
    call: 'اتصل بالعيادة',
    gallery: 'شاهد النتائج',
    clinicView: 'صورة العيادة',
    clinicTitle: 'مكان هادئ لعناية واثقة.',
    clinicText: 'نظرة أوضح على غرفة العلاج والبيئة الطبية داخل عيادة د. أحمد عفيفي.',
    aboutEyebrow: 'عن الطبيب',
    aboutTitle: 'تعرف على د. أحمد عفيفي.',
    aboutText:
      'طبيب أسنان يهتم براحة المريض، وشرح الخطة العلاجية بوضوح، وتقديم حلول تجميلية وترميمية حديثة.',
    aboutPoints: ['شرح واضح قبل العلاج', 'اهتمام بالوقاية أولا', 'تخطيط علاجي تجميلي وترميمي'],
    servicesEyebrow: 'الخدمات',
    servicesTitle: 'كل ما تحتاجه ابتسامتك براحة ووضوح.',
    servicesText: 'تجربة عيادة منظمة للزيارات الدورية، التجميل، والحالات العاجلة.',
    duration: 'المدة',
    bestFor: 'مناسب لـ',
  },
};
const gallery = [
  {
    title: 'Whitening Transformation',
    before: 'https://img.rocket.new/generatedImages/rocket_gen_img_170242c94-1772074682245.png',
    after: 'https://img.rocket.new/generatedImages/rocket_gen_img_170242c94-1772074682245.png',
  },
  {
    title: 'Smile Alignment',
    before: 'https://img.rocket.new/generatedImages/rocket_gen_img_1d51188d5-1778696203698.png',
    after: 'https://img.rocket.new/generatedImages/rocket_gen_img_1d51188d5-1778696203698.png',
  },
  {
    title: 'Restorative Finish',
    before: 'https://img.rocket.new/generatedImages/rocket_gen_img_156759942-1772376106553.png',
    after: 'https://img.rocket.new/generatedImages/rocket_gen_img_156759942-1772376106553.png',
  },
];

const testimonials = [
  {
    name: 'Maya R.',
    role: 'Smile design patient',
    text: 'Everything felt polished and calm. The team explained each step and the result looked like me, just brighter.',
    image: 'https://img.rocket.new/generatedImages/rocket_gen_img_1bb5d2cb2-1763294526193.png',
  },
  {
    name: 'Omar H.',
    role: 'Emergency visit',
    text: 'I booked online, got seen quickly, and left with a clear plan. The whole experience was easier than expected.',
    image: 'https://img.rocket.new/generatedImages/rocket_gen_img_172fcd53a-1763299680950.png',
  },
  {
    name: 'Lina S.',
    role: 'Implant consultation',
    text: 'The clinic feels premium without being intimidating. I loved how transparent the pricing and scheduling were.',
    image: 'https://img.rocket.new/generatedImages/rocket_gen_img_1bfddacc6-1772205842001.png',
  },
];

const treatments = [
  { name: 'Teeth Whitening', min: 180, max: 350 },
  { name: 'Porcelain Veneers', min: 950, max: 1800 },
  { name: 'Dental Implants', min: 2200, max: 4200 },
  { name: 'Clear Aligners', min: 2800, max: 5200 },
  { name: 'Deep Cleaning', min: 160, max: 320 },
  { name: 'Check-Up + X-Rays', min: 90, max: 180 },
];

const unitOptions = [1, 2, 4, 6, 8];

const insuranceOptions = [
  { name: 'No Insurance', discount: 0, helper: '' },
  { name: 'Basic Plan', discount: 20, helper: '-20% covered' },
  { name: 'Premium Plan', discount: 40, helper: '-40% covered' },
  { name: 'Full Coverage', discount: 60, helper: '-60% covered' },
];

const faqs = [
  {
    question: 'Can I book directly online?',
    answer:
      'Yes. Pick a date and time in the booking form. The app checks active appointments before saving.',
  },
  {
    question: 'How do you prevent double booking?',
    answer:
      'The app checks Supabase before creating a booking, and the database includes a unique active slot rule.',
  },
  {
    question: 'Are whitening treatments safe for sensitive teeth?',
    answer:
      'The dentist reviews sensitivity first and recommends the safest whitening approach for your case.',
  },
  {
    question: 'Can staff confirm or cancel appointments?',
    answer: 'Yes. The admin dashboard lists all bookings and includes confirm and cancel actions.',
  },
];

export default function HomePage({ language = 'en' }) {
  const [selectedTreatment, setSelectedTreatment] = useState(treatments[1]);
  const [units, setUnits] = useState(1);
  const [selectedInsurance, setSelectedInsurance] = useState(insuranceOptions[0]);
  const [appointmentPreference, setAppointmentPreference] = useState(55);
  const [openFaq, setOpenFaq] = useState(0);

  const adjustedMin = Math.round(
    (selectedTreatment.min * units * (100 - selectedInsurance.discount)) / 100
  );
  const adjustedMax = Math.round(
    (selectedTreatment.max * units * (100 - selectedInsurance.discount)) / 100
  );
  const copy = pageCopy[language];
  const isArabic = language === 'ar';

  const formatCurrency = (value) => `$${value.toLocaleString()}`;
  const preferenceNote =
    appointmentPreference < 34
      ? 'Standard booking - usually 1-2 weeks out.'
      : appointmentPreference > 66
        ? 'Priority booking available - contact us directly.'
        : 'Appointments typically available within 3-5 days.';

  useEffect(() => {
    const nodes = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.18 }
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  return (
    <main className="premium-page" dir={isArabic ? 'rtl' : 'ltr'}>
      <section className="hero-section">
        <img
          src={heroImage}
          alt="Dr. Ahmed Afify dental clinic treatment room"
          className="hero-image"
        />
        <div className="hero-overlay" />
        <div className="relative mx-auto grid min-h-screen max-w-7xl content-center gap-10 px-6 pb-16 pt-28 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="animate-in-hero text-white">
            <span className="service-pill border-white/20 bg-white/10 text-gold-light">
              {copy.heroPill}
            </span>
            <h1 className="hero-headline mt-6 max-w-4xl">{copy.heroTitle}</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/75">
              {copy.heroText}
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <motion.a
                href="#booking"
                className="gold-button"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                {copy.book}
                <ArrowRight className="h-5 w-5" />
              </motion.a>
            </div>
          </div>

          <div className="animate-in-hero reveal-delay-2">
            <BookingForm variant="hero" language={language} />
          </div>
        </div>
      </section>

      <section className="trust-strip" aria-label="Clinic highlights">
        <Stat value="12k+" label="Smiles" />
        <Stat value="4.9" label="Rating" />
        <Stat value="24h" label="Fast reply" />
      </section>

      <section id="doctor" className="doctor-profile-section">
        <div className="doctor-profile-inner reveal">
          <div className="doctor-portrait">
            <img src={heroImage} alt="Dr. Ahmed Afify dental clinic treatment room" />
          </div>
          <div>
            <p className="eyebrow">{copy.aboutEyebrow}</p>
            <h2 className="section-headline mt-3 text-stone-950">{copy.aboutTitle}</h2>
            <p className="mt-5 max-w-2xl leading-8 text-stone-600">{copy.aboutText}</p>
            <div className="mt-7 grid gap-3">
              {copy.aboutPoints.map((point) => (
                <div key={point} className="doctor-point">
                  <ShieldCheck className="h-5 w-5 text-clinic-700" />
                  <span>{point}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="tooth-viewer" className="tooth-showcase-section">
        <div className="tooth-showcase-inner reveal">
          <div className="tooth-showcase-copy">
            <p className="eyebrow">3D Tooth Preview</p>
            <h2 className="section-headline mt-3 text-stone-950">Explore dental anatomy in 3D.</h2>
            <p className="mt-5 max-w-2xl leading-8 text-stone-600">
              A clean interactive model for patient education, placed away from booking so the main
              appointment flow stays fast and focused.
            </p>
          </div>
          <Suspense fallback={<div className="standalone-tooth-skeleton" aria-hidden="true" />}>
            <ToothViewer className="standalone-tooth-viewer" />
          </Suspense>
        </div>
      </section>

      <section id="services" className="section-wrap bg-warm">
        <SectionHeader eyebrow={copy.servicesEyebrow} title={copy.servicesTitle} text={copy.servicesText} />
        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {services.map((service, index) => (
            <motion.article
              key={service.title}
              className={`service-card reveal reveal-delay-${index + 1}`}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.22 }}
            >
              <img src={service.image} alt={service.title} className="service-card-image" />
              <div className="service-card-shade" />
              <div className="relative z-10">
                <service.icon className="h-9 w-9 text-gold-light" />
                <h3 className="mt-5 text-2xl font-bold text-white">
                  {isArabic ? service.arTitle : service.title}
                </h3>
                <p className="mt-3 max-w-md leading-7 text-white/75">
                  {isArabic ? service.arText : service.text}
                </p>
                <div className="service-detail-grid">
                  <span>
                    <strong>{copy.duration}</strong>
                    {service.duration}
                  </span>
                  <span>
                    <strong>{copy.bestFor}</strong>
                    {service.bestFor}
                  </span>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      <section id="gallery" className="section-wrap bg-ink text-white">
        <SectionHeader
          eyebrow="Gallery"
          title="Before and after interactions from the original experience."
          text="Drag the handle to compare each smile preview."
          tone="dark"
        />
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {gallery.map((item, index) => (
            <article key={item.title} className={`reveal reveal-delay-${index + 1}`}>
              <BeforeAfterSlider before={item.before} after={item.after} title={item.title} />
              <h3 className="mt-4 text-xl font-bold">{item.title}</h3>
            </article>
          ))}
        </div>
      </section>

      <section id="testimonials" className="section-wrap bg-white">
        <SectionHeader
          eyebrow="Testimonials"
          title="Patients remember the calm as much as the results."
        />
        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <article
              key={testimonial.name}
              className={`premium-card reveal reveal-delay-${index + 1}`}
            >
              <div className="flex gap-1 text-gold">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <p className="mt-5 leading-8 text-stone-700">{testimonial.text}</p>
              <div className="mt-6 flex items-center gap-4">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="h-14 w-14 rounded-full object-cover ring-2 ring-gold/30"
                />
                <div>
                  <p className="font-bold text-stone-950">{testimonial.name}</p>
                  <p className="text-sm text-stone-500">{testimonial.role}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="pricing" className="cost-estimator-section">
        <div className="cost-estimator-inner reveal">
          <div className="cost-estimator-heading">
            <h2>
              Treatment Cost <span>Estimator</span>
            </h2>
            <p>
              Get an instant estimate for your treatment. Exact pricing confirmed
              <br className="hidden sm:block" />
              during your free consultation.
            </p>
          </div>

          <div className="cost-estimator-grid">
            <div className="estimator-controls">
              <div className="estimator-group">
                <p className="estimator-label">Select Treatment</p>
                <div className="treatment-grid">
                  {treatments.map((treatment) => (
                    <button
                      key={treatment.name}
                      type="button"
                      onClick={() => setSelectedTreatment(treatment)}
                      className={`estimator-pill ${
                        selectedTreatment.name === treatment.name ? 'active' : ''
                      }`}
                    >
                      {treatment.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="estimator-group">
                <p className="estimator-label">Number of Teeth / Units</p>
                <div className="unit-row">
                  {unitOptions.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setUnits(option)}
                      className={`unit-button ${units === option ? 'active' : ''}`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              <div className="estimator-group">
                <p className="estimator-label">Insurance Coverage</p>
                <div className="insurance-grid">
                  {insuranceOptions.map((option) => (
                    <button
                      key={option.name}
                      type="button"
                      onClick={() => setSelectedInsurance(option)}
                      className={`insurance-card ${
                        selectedInsurance.name === option.name ? 'active' : ''
                      }`}
                    >
                      <span>{option.name}</span>
                      {option.helper && <small>{option.helper}</small>}
                    </button>
                  ))}
                </div>
              </div>

              <div className="estimator-group">
                <p className="estimator-label">Appointment Preference</p>
                <div className="preference-row">
                  <span>Standard</span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={appointmentPreference}
                    onChange={(event) => setAppointmentPreference(Number(event.target.value))}
                    className="preference-range"
                  />
                  <span>Same-Day</span>
                </div>
                <p className="preference-note">{preferenceNote}</p>
              </div>
            </div>

            <aside className="estimate-summary-card">
              <p className="summary-label">Estimated Cost</p>
              <p className="summary-cost">
                {formatCurrency(adjustedMin)} - {formatCurrency(adjustedMax)}
              </p>

              <div className="summary-lines">
                <div>
                  <span>Treatment</span>
                  <strong>{selectedTreatment.name}</strong>
                </div>
                <div>
                  <span>Units</span>
                  <strong>{units}</strong>
                </div>
                <div>
                  <span>Insurance</span>
                  <strong>{selectedInsurance.name}</strong>
                </div>
                <div className="summary-divider" />
                <div>
                  <span>Base price</span>
                  <strong>
                    {formatCurrency(selectedTreatment.min)}-{formatCurrency(selectedTreatment.max)}
                  </strong>
                </div>
              </div>

              <a href="#booking" className="summary-cta">
                Book Free Consultation
              </a>
              <p className="summary-footnote">Exact pricing confirmed in-clinic. No hidden fees.</p>
            </aside>
          </div>
        </div>
      </section>

      <section id="booking" className="section-wrap bg-white">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div className="reveal">
            <p className="eyebrow">Booking</p>
            <h2 className="section-headline mt-3 text-stone-950">
              Online appointments, protected from double booking.
            </h2>
            <p className="mt-5 leading-8 text-stone-600">
              The booking form stays connected to Supabase. It checks active appointments before
              saving and the admin dashboard can confirm or cancel each request.
            </p>
            <div className="mt-8 grid gap-4">
              <InfoLine icon={Clock} text={`Open ${clinicContact.hours}`} />
              <InfoLine icon={Syringe} text="Emergency cases are reviewed first" />
              <InfoLine icon={Award} text="Designed for a simple non-programmer workflow" />
            </div>
          </div>
          <div className="reveal reveal-delay-2">
            <BookingForm language={language} />
          </div>
        </div>
      </section>

      <section id="faq" className="section-wrap bg-warm">
        <SectionHeader eyebrow="FAQ" title="A few clear answers before you visit." />
        <div className="mt-10 grid gap-3">
          {faqs.map((faq, index) => (
            <motion.button
              key={faq.question}
              type="button"
              onClick={() => setOpenFaq(openFaq === index ? -1 : index)}
              className="faq-item reveal"
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.995 }}
            >
              <span className="flex items-center justify-between gap-5 text-left text-lg font-bold text-stone-950">
                {faq.question}
                <ChevronDown
                  className={`h-5 w-5 flex-none text-gold transition ${openFaq === index ? 'rotate-180' : ''}`}
                />
              </span>
              {openFaq === index && (
                <span className="mt-3 block text-left leading-7 text-stone-600">{faq.answer}</span>
              )}
            </motion.button>
          ))}
        </div>
      </section>

      <section id="contact" className="section-wrap bg-ink text-white">
        <div className="contact-section-grid">
          <div className="contact-info-column reveal">
            <p className="eyebrow text-gold-light">Contact</p>
            <h2 className="section-headline mt-3">Clinic information and location.</h2>
            <p className="mt-5 max-w-2xl leading-8 text-white/70">
              For urgent pain or appointment changes, call directly. For standard visits, the
              booking form is the fastest way to send your request.
            </p>

            <div className="contact-panel mt-8">
              <ContactLine icon={MapPin} label={clinicContact.address} />
              <ContactLine
                icon={Phone}
                label={clinicContact.phoneDisplay}
                href={`tel:${clinicContact.phoneHref}`}
              />
              <ContactLine
                icon={Mail}
                label={clinicContact.email}
                href={`mailto:${clinicContact.email}`}
              />
              <ContactLine icon={Clock} label={clinicContact.hours} />
            </div>

            <div className="clinic-options">
              <div>
                <strong>Parking</strong>
                <span>Street parking and nearby garage access available.</span>
              </div>
              <div>
                <strong>Emergency</strong>
                <span>Call first for same-day pain, swelling, or broken tooth visits.</span>
              </div>
              <div>
                <strong>Accessibility</strong>
                <span>Elevator access and ground-floor reception support.</span>
              </div>
            </div>
          </div>

          <div className="map-card reveal reveal-delay-2">
            <iframe
              title="Dr. Ahmed Afify clinic map"
              src={`https://www.google.com/maps?q=${clinicContact.mapsQuery}&output=embed`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <div className="map-actions">
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${clinicContact.mapsQuery}`}
                target="_blank"
                rel="noreferrer"
                className="summary-cta"
              >
                <Navigation className="h-4 w-4" />
                Get Directions
              </a>
              <a href={`tel:${clinicContact.phoneHref}`} className="ghost-map-button">
                <Phone className="h-4 w-4" />
                Call Clinic
              </a>
              <a href={`mailto:${clinicContact.email}`} className="ghost-map-button">
                <ExternalLink className="h-4 w-4" />
                Email Us
              </a>
            </div>
          </div>
        </div>
      </section>

      <a
        href={`https://wa.me/${clinicContact.phoneHref.replace('+', '')}`}
        className="whatsapp-float"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle className="h-7 w-7" />
      </a>

      <div className="mobile-action-bar" aria-label="Quick appointment actions">
        <a href="#booking" className="mobile-action-primary">
          {copy.book}
          <ArrowRight className="h-4 w-4" />
        </a>
        <a href={`tel:${clinicContact.phoneHref}`} className="mobile-action-secondary">
          <Phone className="h-4 w-4" />
          {copy.call}
        </a>
      </div>
    </main>
  );
}

function SectionHeader({ eyebrow, title, text, tone = 'light' }) {
  return (
    <MotionSection className="max-w-3xl">
      <p className={`eyebrow ${tone === 'dark' ? 'text-gold-light' : ''}`}>{eyebrow}</p>
      <h2 className={`section-headline mt-3 ${tone === 'dark' ? 'text-white' : 'text-stone-950'}`}>
        {title}
      </h2>
      {text && (
        <p className={`mt-5 leading-8 ${tone === 'dark' ? 'text-white/70' : 'text-stone-600'}`}>
          {text}
        </p>
      )}
    </MotionSection>
  );
}

function Stat({ value, label }) {
  return (
    <div className="stat-card">
      <p>{value}</p>
      <span>{label}</span>
    </div>
  );
}

function InfoLine({ icon: Icon, text }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-stone-200 bg-stone-50 p-4 text-sm font-semibold text-stone-700">
      <Icon className="h-5 w-5 text-gold-dark" />
      {text}
    </div>
  );
}

function ContactLine({ icon: Icon, label, href }) {
  const content = (
    <>
      <Icon className="h-5 w-5 text-gold-light" />
      <span className="font-semibold">{label}</span>
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        className="flex items-center gap-3 rounded-lg bg-white/10 p-4 transition hover:bg-white/15"
      >
        {content}
      </a>
    );
  }

  return <div className="flex items-center gap-3 rounded-lg bg-white/10 p-4">{content}</div>;
}
