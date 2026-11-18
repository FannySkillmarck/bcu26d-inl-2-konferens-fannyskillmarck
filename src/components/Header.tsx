import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useLanguage, type Language } from '../i18n/LanguageContext';

function FlagIcon({ lang }: { lang: Language }) {
  if (lang === 'sv') {
    return (
      <svg
        viewBox="0 0 24 16"
        width="20"
        height="14"
        aria-hidden="true"
        className="h-3.5 w-5 shrink-0 rounded-[2px] border border-black/15"
      >
        <rect width="24" height="16" fill="#006AA7" />
        <rect x="7" width="3.2" height="16" fill="#FECC00" />
        <rect y="6.4" width="24" height="3.2" fill="#FECC00" />
      </svg>
    );
  }

  if (lang === 'en') {
    return (
      <svg
        viewBox="0 0 24 16"
        width="20"
        height="14"
        aria-hidden="true"
        className="h-3.5 w-5 shrink-0 rounded-[2px] border border-black/15"
      >
        <rect width="24" height="16" fill="#012169" />
        <path d="M0 0 L24 16 M24 0 L0 16" stroke="#FFFFFF" strokeWidth="3.2" />
        <path d="M0 0 L24 16 M24 0 L0 16" stroke="#C8102E" strokeWidth="1.4" />
        <path d="M12 0 V16 M0 8 H24" stroke="#FFFFFF" strokeWidth="4.6" />
        <path d="M12 0 V16 M0 8 H24" stroke="#C8102E" strokeWidth="2.6" />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 24 16"
      width="20"
      height="14"
      aria-hidden="true"
      className="h-3.5 w-5 shrink-0 rounded-[2px] border border-black/15"
    >
      <rect width="24" height="16" fill="#DE2910" />
      <polygon
        points="4.8,2.1 5.4,3.9 7.3,3.9 5.8,5.0 6.3,6.8 4.8,5.7 3.3,6.8 3.8,5.0 2.3,3.9 4.2,3.9"
        fill="#FFDE00"
      />
      <circle cx="9.2" cy="2.2" r="0.7" fill="#FFDE00" />
      <circle cx="10.6" cy="3.8" r="0.7" fill="#FFDE00" />
      <circle cx="10.6" cy="6.0" r="0.7" fill="#FFDE00" />
      <circle cx="9.2" cy="7.6" r="0.7" fill="#FFDE00" />
    </svg>
  );
}

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  const navItems = [
    { href: '#program', label: t.header.navProgram },
    { href: '#talare', label: t.header.navSpeakers },
    { href: '#biljetter', label: t.header.navTickets },
    { href: '#praktiskt', label: t.header.navPractical },
  ];

  const languageOptions: Array<{
    code: Language;
    ariaLabel: string;
    title: string;
  }> = [
    { code: 'sv', ariaLabel: t.header.switchToSvAria, title: 'Svenska' },
    { code: 'en', ariaLabel: t.header.switchToEnAria, title: 'English' },
    { code: 'zh', ariaLabel: t.header.switchToZhAria, title: '中文' },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border-hairline)] bg-[var(--bg-canvas)]/92 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-1.5 px-2.5 py-3 sm:gap-8 sm:px-6 sm:py-3.5">
        <a
          href="#top"
          aria-label={t.header.brandAria}
          className="typo-display text-[15px] font-semibold tracking-tight text-[var(--text-primary)] whitespace-nowrap shrink-0 sm:text-xl"
        >
          Stjärnfall
        </a>

        <nav aria-label={t.header.mainNavAria} className="hidden md:block">
          <ul className="site-nav__list flex items-center gap-7 text-sm font-medium">
            {navItems.map((item) => (
              <li key={item.href} className="site-nav__item">
                <a
                  href={item.href}
                  aria-label={`${t.header.jumpToPrefix} ${item.label}`}
                  className="site-nav__link whitespace-nowrap shrink-0"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          <div
            role="group"
            aria-label={t.header.languageGroupAria}
            className="inline-flex items-center gap-0.5 rounded-md border border-[var(--border-hairline)] bg-[var(--bg-subtle)] p-0.5"
          >
            {languageOptions.map(({ code, ariaLabel, title }) => {
              const isActive = language === code;
              return (
                <button
                  key={code}
                  type="button"
                  onClick={() => setLanguage(code)}
                  aria-pressed={isActive}
                  aria-label={ariaLabel}
                  title={title}
                  className={`inline-flex items-center justify-center rounded px-1.5 py-1 transition-all min-h-[38px] min-w-[30px] sm:px-2 sm:min-w-[34px] ${
                    isActive
                      ? 'bg-[var(--bg-surface)] ring-1 ring-[var(--accent-brass)] shadow-xs opacity-100'
                      : 'opacity-70 hover:opacity-100'
                  }`}
                >
                  <FlagIcon lang={code} />
                </button>
              );
            })}
          </div>

          <a
            href="#biljetter"
            aria-label={t.header.bookCtaAria}
            className="btn-primary px-2.5 py-2 text-[11px] sm:px-4 sm:text-xs"
          >
            {t.header.bookCta}
          </a>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav-menu"
            aria-label={
              mobileOpen ? t.header.closeMenuAria : t.header.openMenuAria
            }
            className="inline-flex md:hidden items-center justify-center rounded-md border border-[var(--border-hairline)] p-2 text-[var(--text-primary)] min-h-[44px] min-w-[44px]"
          >
            {mobileOpen ? (
              <X className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Menu className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav
          id="mobile-nav-menu"
          aria-label={t.header.mobileNavAria}
          className="md:hidden border-t border-[var(--border-hairline)] bg-[var(--bg-surface)] px-4 py-4 sm:px-6"
        >
          <ul className="flex flex-col gap-2 text-sm font-medium">
            {navItems.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  aria-label={`${t.header.jumpToPrefix} ${item.label}`}
                  onClick={() => setMobileOpen(false)}
                  className="block py-2.5 text-[var(--text-primary)] hover:text-[var(--accent-brass)] whitespace-nowrap"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
