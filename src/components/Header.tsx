import { useState } from 'react';
import { Menu, X } from 'lucide-react';

const NAV_ITEMS = [
  { href: '#program', label: 'Program' },
  { href: '#talare', label: 'Talare' },
  { href: '#biljetter', label: 'Biljetter' },
  { href: '#praktiskt', label: 'Praktiskt' },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border-hairline)] bg-[var(--bg-canvas)]/92 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-3 px-4 py-3 sm:gap-8 sm:px-6 sm:py-3.5">
        <a
          href="#top"
          className="typo-display text-lg font-semibold tracking-tight text-[var(--text-primary)] whitespace-nowrap shrink-0 sm:text-xl"
        >
          Stjärnfall
        </a>

        <nav aria-label="Huvudnavigation" className="hidden md:block">
          <ul className="site-nav__list flex items-center gap-7 text-sm font-medium">
            {NAV_ITEMS.map((item) => (
              <li key={item.href} className="site-nav__item">
                <a
                  href={item.href}
                  className="site-nav__link whitespace-nowrap shrink-0"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <a
            href="#biljetter"
            className="btn-primary px-3.5 py-2 text-xs sm:px-4"
          >
            Boka plats
          </a>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav-menu"
            aria-label={mobileOpen ? 'Stäng meny' : 'Öppna meny'}
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
          aria-label="Mobilnavigation"
          className="md:hidden border-t border-[var(--border-hairline)] bg-[var(--bg-surface)] px-4 py-4 sm:px-6"
        >
          <ul className="flex flex-col gap-2 text-sm font-medium">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
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
