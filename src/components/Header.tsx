import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  const navItems = [
    { href: '#program', label: t.header.navProgram },
    { href: '#talare', label: t.header.navSpeakers },
    { href: '#biljetter', label: t.header.navTickets },
    { href: '#praktiskt', label: t.header.navPractical },
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

        <div className="flex items-center gap-1 sm:gap-3 shrink-0">
          <div
            role="group"
            aria-label={t.header.languageGroupAria}
            className="inline-flex items-center rounded-md border border-[var(--border-hairline)] bg-[var(--bg-subtle)] p-0.5"
          >
            <button
              type="button"
              onClick={() => setLanguage('sv')}
              aria-pressed={language === 'sv'}
              aria-label={t.header.switchToSvAria}
              className={`rounded px-1.5 py-1 text-[11px] font-semibold tracking-wide transition-colors min-h-[38px] min-w-[26px] sm:px-2 sm:min-w-[32px] ${
                language === 'sv'
                  ? 'bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-xs'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              SV
            </button>
            <button
              type="button"
              onClick={() => setLanguage('en')}
              aria-pressed={language === 'en'}
              aria-label={t.header.switchToEnAria}
              className={`rounded px-1.5 py-1 text-[11px] font-semibold tracking-wide transition-colors min-h-[38px] min-w-[26px] sm:px-2 sm:min-w-[32px] ${
                language === 'en'
                  ? 'bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-xs'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => setLanguage('zh')}
              aria-pressed={language === 'zh'}
              aria-label={t.header.switchToZhAria}
              className={`rounded px-1.5 py-1 text-[11px] font-semibold tracking-wide transition-colors min-h-[38px] min-w-[28px] sm:px-2 sm:min-w-[34px] whitespace-nowrap ${
                language === 'zh'
                  ? 'bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-xs'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              中文
            </button>
          </div>

          <a
            href="#biljetter"
            aria-label={t.header.bookCtaAria}
            className="btn-primary px-2 py-2 text-[11px] sm:px-4 sm:text-xs"
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
