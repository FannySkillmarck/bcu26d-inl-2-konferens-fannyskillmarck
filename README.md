# Stjärnfall 2027 — Nordiskt Symposium för Astrologi & Kosmisk Tid

En fiktiv konferens-one-pager byggd med React, TypeScript och Tailwind CSS v4 som demonstrerar semantisk HTML, BEM-namngiven CSS i `@layer components`, avancerade CSS-selektorer, CSS-animationer, responsiv layout samt ljust och mörkt tema via `prefers-color-scheme`.

---

## Namnkonvention & CSS-arkitektur

Projektet kombinerar Tailwind CSS v4 för layout och spacing med handskriven CSS i `src/index.css`. **Samtliga egna klassnamn ligger strikt inuti `@layer components`** och följer **BEM (Block, Element, Modifier)** enligt formatet `.block__element--modifier`:

- **Navigation**: `.site-nav__list`, `.site-nav__item`, `.site-nav__link`
- **Sektionsrubriker**: `.section-header__kicker`
- **Hero-emblem**: `.hero-emblem`, `.hero-emblem__ring`, `.hero-emblem__ring--reverse`
- **Programschema**: `.schedule__list`, `.schedule__row`, `.schedule__item`, `.schedule__item--highlighted`
- **Talargalleri**: `.speaker-card`, `.speaker-card__media`, `.speaker-card__portrait`, `.speaker-card__overlay`, `.speaker-card__body`, `.speaker-card__trigger`
- **Biljettnivåer**: `.ticket-grid`, `.ticket-grid__item`, `.ticket-card`
- **Modaler & typografi**: `.modal-dialog__panel`, `.typo-display`, `.typo-mono`, `.btn-primary`

### Avancerade CSS-selektorer & animationer

- **Barn- och syskonselektorer**: `.site-nav__list > .site-nav__item > .site-nav__link`, `.schedule__list > .schedule__row + .schedule__row`
- **Pseudo-klasser & strukturella pseudo-klasser**: `:hover`, `:focus-within`, `:focus-visible`, `:has(.speaker-card__trigger:focus-visible)`, `:nth-child(even)`, `:first-of-type`
- **Pseudo-element**: `::before` (linjer och rombmarkörer i programmet) och `::after` (understrykning i menyn samt klickyta på talarkort)
- **Attributselektorer**: `a[href^="#"]`, `.schedule__item[data-track="Workshop"]`, `.ticket-card[data-featured="true"]`
- **Animationer**: `@keyframes orbitSpin` (roterande planetbanor i hero-sektionen) och `@keyframes fadeInUp` (modalentrering), med fullt stöd för `@media (prefers-reduced-motion: reduce)`.
- **Ljust & mörkt tema**: CSS-variabler i `:root` och `@media (prefers-color-scheme: dark)` utan JavaScript-toggle.

---

## Kodformatering (Prettier)

Koden formateras med Prettier enligt `.prettierrc` (2 mellanslag, enkla citattecken, `printWidth: 80`). Kör kontroll eller formatering med:

```bash
npm run format:check
npm run format
```

---

## Lighthouse-test (Mobil)

Kör Lighthouse i Chrome DevTools i **Mobile-läge** (efter `npm run build && npm run preview`) och verifiera målkraven:

- **Accessibility**: 100
- **Best Practices**: >= 95
- **Performance**: >= 90

> **Obs inför inlämning**: Lägg din skärmdump från körningen i `docs/lighthouse-mobile.png` och länka den här nedan:
>
> `![Lighthouse mobilresultat](docs/lighthouse-mobile.png)`

---

## AI-logg & kritisk självreflektion

### Verktyg och arbetssätt

- **Verktyg**: Google AI Studio Build-assistenten (kodgenerering och bildgenerering via inbyggda bildverktyg).
- **Process**:
  1. Först definierades sidans tema, innehållsstruktur (schema, 6 talare, 4 biljettnivåer, praktisk information med statisk karta) och visuellt system (typografi och färgtokens för ljust/mörkt tema).
  2. Därefter byggdes semantiska komponenter med React och Tailwind CSS v4, kompletterat med handskrivna CSS-selektorer och `@keyframes`-animationer.
  3. I den andra granskningsrundan stramades koden upp för att uppfylla VG-kraven: alla egna klasser flyttades in i `@layer components` med BEM-namngivning, W3C-valideringsfällor (såsom blockelement inuti `<button>`) togs bort genom ett semantiskt `<figure>` + `::after`-mönster på talarkorten, mörkt temas primärknapp fick mörk text för att klara WCAG AA-kontrast och Prettier lades till.

### Insikter & kunskapsluckor

- **HTML-semantik runt interaktiva kort**: En viktig lärdom var att lägga `<div>` eller `<h3>` inuti en `<button>` ger fel i HTML-validatorn eftersom `<button>` bara tillåter _phrasing content_. Lösningen blev att placera knappen inuti `<h3>` och låta `::after` spänna över hela kortet.
- **Kontrast i mörkt läge**: Ljus text (`#ffffff`) på en gyllene knapp (`#e5a94c`) i mörkt läge gav för låg kontrast. Genom att separera `--btn-primary-bg` och `--btn-primary-text` per tema kunde kontrastkravet (> 4.5:1) hållas i båda lägena.
- **Egen kunskapsutveckling framåt**: Inför nästa projekt vill jag öva mer på att själv skriva CSS-selektorer med `:has()` och testa skärmläsare (VoiceOver/NVDA) samt W3C-validatorn löpande under bygget snarare än i efterhand.

---

## Checklista inför Git-inlämning (manuell kontroll)

- Kontrollera att `.gitignore` är inkluderad och att inga `node_modules/` eller `.env`-filer checkas in.
- Dela upp arbetet i **minst 12 beskrivande commits** (t.ex. Conventional Commits som `feat: add semantic schedule section`, `style: refactor BEM classes into @layer components`) fördelade över **minst 4 olika dagar** så att ingen enskild commit överstiger 40 % av slutkodens rader.
- Validera HTML-utdata i W3C Nu Html Checker samt testa zoom 200 % och 300 % vid 1440 px och bredderna 320, 768, 1024 och 1440 px i webbläsaren.
