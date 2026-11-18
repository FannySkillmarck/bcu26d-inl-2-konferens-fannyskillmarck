import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import type { FaqItem } from '../data/conference';
import { useLanguage } from '../i18n/LanguageContext';

interface FaqSectionProps {
  items: FaqItem[];
}

export function FaqSection({ items }: FaqSectionProps) {
  const { t } = useLanguage();
  const [openIds, setOpenIds] = useState<string[]>(['parking']);

  const toggleItem = (id: string) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <section
      id="faq"
      aria-labelledby="heading-faq"
      className="border-t border-[var(--border-hairline)] bg-[var(--bg-canvas)] py-16 lg:py-24"
    >
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-12">
          <header className="lg:col-span-5">
            <p className="section-header__kicker">{t.faq.kicker}</p>
            <h2
              id="heading-faq"
              className="typo-display mt-3 text-3xl font-semibold tracking-tight sm:text-4xl"
              style={{ textWrap: 'balance' }}
            >
              {t.faq.heading}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-[var(--text-muted)]">
              {t.faq.intro}
            </p>
            <p className="mt-5 text-xs leading-relaxed text-[var(--text-muted)]">
              {t.faq.contactPrompt}{' '}
              <a
                href="mailto:info@stjarnfall.se"
                className="font-medium text-[var(--accent-brass)] underline-offset-4 hover:underline"
              >
                info@stjarnfall.se
              </a>
              .
            </p>
          </header>

          <div className="lg:col-span-7">
            <ul className="faq-list overflow-hidden rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-surface)]">
              {items.map((item) => {
                const isOpen = openIds.includes(item.id);
                const buttonId = `faq-trigger-${item.id}`;
                const panelId = `faq-panel-${item.id}`;

                return (
                  <li key={item.id} className="faq-list__item">
                    <h3>
                      <button
                        type="button"
                        id={buttonId}
                        aria-expanded={isOpen}
                        aria-controls={panelId}
                        onClick={() => toggleItem(item.id)}
                        className="faq-list__trigger flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-semibold text-[var(--text-primary)] min-h-[52px] sm:px-6 sm:py-5 sm:text-base"
                      >
                        <span>{item.question}</span>
                        <ChevronDown
                          className="faq-list__icon h-4 w-4 shrink-0 text-[var(--accent-brass)]"
                          aria-hidden="true"
                        />
                      </button>
                    </h3>

                    {isOpen && (
                      <div
                        id={panelId}
                        role="region"
                        aria-labelledby={buttonId}
                        className="px-5 pb-5 text-sm leading-relaxed text-[var(--text-muted)] sm:px-6 sm:pb-6"
                      >
                        {item.answer}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
