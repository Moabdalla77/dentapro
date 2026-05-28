import { Link, NavLink } from 'react-router-dom';
import { LayoutDashboard, Menu, Phone, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { clinicContact } from '../shared/config/contact';

const navItems = [
  { label: 'Services', href: '/#services' },
  { label: 'Gallery', href: '/#gallery' },
  { label: 'Testimonials', href: '/#testimonials' },
  { label: 'Pricing', href: '/#pricing' },
  { label: 'FAQ', href: '/#faq' },
  { label: 'Contact', href: '/#contact' },
];

export default function Layout({ children, language = 'en', onToggleLanguage }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#f7fbfb] text-stone-950">
      <header
        className={`fixed left-0 right-0 top-0 z-50 transition-all duration-500 ${
          scrolled || open
            ? 'border-b border-stone-200 bg-white/95 shadow-sm backdrop-blur-xl'
            : 'bg-transparent'
        }`}
      >
        <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
          <Link to="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
            <span className="logo-mark">
              <span className="logo-tooth" aria-hidden="true" />
            </span>
            <div>
              <p
                className={`brand-name text-lg font-bold leading-tight transition-colors ${
                  scrolled || open ? 'text-teal-950' : 'text-enamel'
                }`}
              >
                {clinicContact.name}
              </p>
              <p className={`text-xs ${scrolled || open ? 'text-slate-500' : 'text-white/70'}`}>
                {clinicContact.label}
              </p>
            </div>
          </Link>

          <div className="hidden items-center gap-2 md:flex">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={`rounded-md px-3 py-2 text-sm font-semibold transition ${
                  scrolled
                    ? 'text-slate-600 hover:bg-clinic-100 hover:text-clinic-700'
                    : 'text-white/75 hover:bg-white/10 hover:text-enamel'
                }`}
              >
                {item.label}
              </a>
            ))}
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-semibold transition ${
                  isActive
                    ? 'bg-clinic-100 text-clinic-900'
                    : scrolled
                      ? 'text-slate-600 hover:bg-clinic-100 hover:text-clinic-700'
                      : 'text-white/75 hover:bg-white/10 hover:text-enamel'
                }`
              }
            >
              <LayoutDashboard className="h-4 w-4" />
              Admin
            </NavLink>
            <a
              href={`tel:${clinicContact.phoneHref}`}
              className={`ml-2 inline-flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-semibold transition ${
                scrolled
                  ? 'border-clinic-100 text-slate-700 hover:border-clinic-500/40 hover:bg-clinic-100'
                  : 'border-white/25 text-white hover:bg-white/10'
              }`}
            >
              <Phone className="h-4 w-4" />
              Call clinic
            </a>
            <button type="button" onClick={onToggleLanguage} className="nav-language-toggle">
              {language === 'en' ? 'العربية' : 'English'}
            </button>
          </div>

          <button
            type="button"
            className={`inline-flex h-10 w-10 items-center justify-center rounded-md border md:hidden ${
              scrolled || open ? 'border-stone-200 text-stone-900' : 'border-white/25 text-white'
            }`}
            onClick={() => setOpen((value) => !value)}
            aria-label="Open menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </nav>

        {open && (
          <div className="border-t border-stone-200 bg-white px-4 py-3 md:hidden">
            <div className="mx-auto grid max-w-6xl gap-2">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="rounded-md px-3 py-3 text-sm font-semibold text-slate-700 hover:bg-clinic-100"
                >
                  {item.label}
                </a>
              ))}
              <NavLink
                to="/admin"
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `inline-flex items-center gap-2 rounded-md px-3 py-3 text-sm font-semibold ${
                    isActive ? 'bg-clinic-100 text-clinic-900' : 'text-slate-700'
                  }`
                }
              >
                <LayoutDashboard className="h-4 w-4" />
                Admin
              </NavLink>
              <button
                type="button"
                onClick={() => {
                  onToggleLanguage?.();
                  setOpen(false);
                }}
                className="rounded-md px-3 py-3 text-left text-sm font-semibold text-slate-700 hover:bg-clinic-100"
              >
                {language === 'en' ? 'العربية' : 'English'}
              </button>
            </div>
          </div>
        )}
      </header>

      {children}

      <footer className="border-t border-stone-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-6 py-7 text-sm text-stone-500 md:flex-row md:items-center md:justify-between">
          <p>{clinicContact.name} {clinicContact.label}. Care for brighter, healthier smiles.</p>
          <p>Open {clinicContact.hours}</p>
        </div>
      </footer>
    </div>
  );
}
