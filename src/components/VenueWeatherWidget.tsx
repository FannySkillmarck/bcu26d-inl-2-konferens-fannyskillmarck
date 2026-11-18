import { useCallback, useEffect, useState } from 'react';
import {
  CloudSun,
  Droplets,
  RefreshCw,
  Thermometer,
  Umbrella,
  Wind,
} from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

interface WeatherCondition {
  iconBaseUri?: string;
  description?: {
    text?: string;
  };
  type?: string;
}

interface CurrentConditions {
  weatherCondition?: WeatherCondition;
  temperature?: { degrees?: number };
  feelsLikeTemperature?: { degrees?: number };
  relativeHumidity?: number;
  wind?: {
    speed?: { value?: number };
  };
  precipitation?: {
    probability?: { percent?: number };
  };
}

interface ForecastDay {
  displayDate?: {
    year?: number;
    month?: number;
    day?: number;
  };
  daytimeForecast?: {
    weatherCondition?: WeatherCondition;
    precipitation?: {
      probability?: { percent?: number };
    };
  };
  maxTemperature?: { degrees?: number };
  minTemperature?: { degrees?: number };
}

interface WeatherResponse {
  current?: CurrentConditions;
  forecastDays?: ForecastDay[];
  error?: string;
}

type WeatherStatus = 'loading' | 'ready' | 'missing_key' | 'unavailable';

function formatDayLabel(
  displayDate: ForecastDay['displayDate'],
  index: number,
  locale: string,
  todayLabel: string
): string {
  if (index === 0) return todayLabel;
  if (!displayDate?.year || !displayDate?.month || !displayDate?.day) {
    return `Day ${index + 1}`;
  }
  const date = new Date(
    Date.UTC(displayDate.year, displayDate.month - 1, displayDate.day)
  );
  return new Intl.DateTimeFormat(locale, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    timeZone: 'UTC',
  }).format(date);
}

export function VenueWeatherWidget() {
  const { language, t } = useLanguage();
  const [status, setStatus] = useState<WeatherStatus>('loading');
  const [current, setCurrent] = useState<CurrentConditions | null>(null);
  const [forecastDays, setForecastDays] = useState<ForecastDay[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadWeather = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch('/api/weather?lat=59.3204&lng=18.0558', {
        cache: 'no-store',
      });
      if (res.status === 429) {
        window.dispatchEvent(new CustomEvent('gmp-quota-exceeded'));
        setStatus('unavailable');
        return;
      }

      const data = (await res.json()) as WeatherResponse;
      if (!res.ok) {
        setStatus(data.error === 'MISSING_KEY' ? 'missing_key' : 'unavailable');
        return;
      }

      if (data.current) {
        setCurrent(data.current);
        setForecastDays(
          Array.isArray(data.forecastDays) ? data.forecastDays : []
        );
        setStatus('ready');
      } else {
        setStatus('unavailable');
      }
    } catch {
      setStatus('unavailable');
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void loadWeather();
  }, [loadWeather]);

  const locale =
    language === 'sv' ? 'sv-SE' : language === 'zh' ? 'zh-CN' : 'en-US';
  const currentTemp = current?.temperature?.degrees;
  const feelsLike = current?.feelsLikeTemperature?.degrees;
  const conditionText = current?.weatherCondition?.description?.text;
  const conditionIcon = current?.weatherCondition?.iconBaseUri
    ? `${current.weatherCondition.iconBaseUri}.svg`
    : null;
  const windKmh = current?.wind?.speed?.value;
  const humidity = current?.relativeHumidity;
  const precipPercent = current?.precipitation?.probability?.percent;

  return (
    <section
      aria-labelledby="heading-venue-weather"
      className="mt-14 rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-surface)] p-5 sm:p-7"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border-hairline)] pb-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--accent-brass)]">
            {t.weatherWidget.locationLabel}
          </p>
          <h3
            id="heading-venue-weather"
            className="typo-display mt-1 text-xl font-semibold tracking-tight text-[var(--text-primary)]"
          >
            {t.weatherWidget.heading}
          </h3>
        </div>

        <button
          type="button"
          onClick={() => void loadWeather()}
          disabled={isRefreshing}
          aria-label={t.weatherWidget.refreshAria}
          className="inline-flex min-h-[40px] items-center gap-1.5 rounded-md border border-[var(--border-hairline)] bg-[var(--bg-canvas)] px-3.5 py-1.5 text-xs font-medium text-[var(--text-primary)] hover:border-[var(--accent-brass)] transition-colors disabled:opacity-60"
        >
          <RefreshCw
            className={`h-3.5 w-3.5 shrink-0 text-[var(--accent-brass)] ${
              isRefreshing ? 'animate-spin' : ''
            }`}
            aria-hidden="true"
          />
          <span>{t.weatherWidget.refreshBtn}</span>
        </button>
      </div>

      {status === 'loading' && (
        <p className="mt-4 text-sm text-[var(--text-muted)]">
          {t.weatherWidget.loading}
        </p>
      )}

      {status === 'missing_key' && (
        <p className="mt-4 text-sm text-[var(--text-muted)]">
          {t.weatherWidget.missingKeyNotice}
        </p>
      )}

      {status === 'unavailable' && (
        <p className="mt-4 text-sm text-[var(--text-muted)]">
          {t.weatherWidget.unavailableNotice}
        </p>
      )}

      {status === 'ready' && current && (
        <div className="mt-5 grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-center">
          <div className="flex flex-wrap items-center gap-5 lg:col-span-5">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-md border border-[var(--border-hairline)] bg-[var(--bg-canvas)]">
              {conditionIcon ? (
                <img
                  src={conditionIcon}
                  alt={conditionText || ''}
                  width={44}
                  height={44}
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                  className="h-11 w-11"
                />
              ) : (
                <CloudSun
                  className="h-8 w-8 text-[var(--accent-brass)]"
                  aria-hidden="true"
                />
              )}
            </div>

            <div>
              <div className="flex items-baseline gap-2">
                <span className="typo-display typo-mono text-3xl font-semibold text-[var(--text-primary)]">
                  {typeof currentTemp === 'number'
                    ? `${Math.round(currentTemp)}°C`
                    : '—'}
                </span>
                {conditionText && (
                  <span className="text-sm font-medium text-[var(--text-muted)]">
                    {conditionText}
                  </span>
                )}
              </div>

              <dl className="mt-2.5 flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-[var(--text-muted)]">
                {typeof feelsLike === 'number' && (
                  <div className="inline-flex items-center gap-1">
                    <Thermometer
                      className="h-3.5 w-3.5 text-[var(--accent-brass)]"
                      aria-hidden="true"
                    />
                    <dt>{t.weatherWidget.feelsLike}:</dt>
                    <dd className="typo-mono font-medium text-[var(--text-primary)]">
                      {Math.round(feelsLike)}°C
                    </dd>
                  </div>
                )}
                {typeof windKmh === 'number' && (
                  <div className="inline-flex items-center gap-1">
                    <Wind
                      className="h-3.5 w-3.5 text-[var(--accent-brass)]"
                      aria-hidden="true"
                    />
                    <dt>{t.weatherWidget.windLabel}:</dt>
                    <dd className="typo-mono font-medium text-[var(--text-primary)]">
                      {Math.round(windKmh)} km/h
                    </dd>
                  </div>
                )}
                {typeof humidity === 'number' && (
                  <div className="inline-flex items-center gap-1">
                    <Droplets
                      className="h-3.5 w-3.5 text-[var(--accent-brass)]"
                      aria-hidden="true"
                    />
                    <dt>{t.weatherWidget.humidityLabel}:</dt>
                    <dd className="typo-mono font-medium text-[var(--text-primary)]">
                      {humidity}%
                    </dd>
                  </div>
                )}
                {typeof precipPercent === 'number' && (
                  <div className="inline-flex items-center gap-1">
                    <Umbrella
                      className="h-3.5 w-3.5 text-[var(--accent-brass)]"
                      aria-hidden="true"
                    />
                    <dt>{t.weatherWidget.precipLabel}:</dt>
                    <dd className="typo-mono font-medium text-[var(--text-primary)]">
                      {precipPercent}%
                    </dd>
                  </div>
                )}
              </dl>
            </div>
          </div>

          {forecastDays.length > 0 && (
            <div className="lg:col-span-7">
              <p className="text-xs font-medium text-[var(--text-muted)]">
                {t.weatherWidget.forecastHeading}
              </p>
              <ul className="mt-2.5 grid grid-cols-2 gap-2.5 sm:grid-cols-5">
                {forecastDays.slice(0, 5).map((day, idx) => {
                  const dayCondition = day.daytimeForecast?.weatherCondition;
                  const iconUrl = dayCondition?.iconBaseUri
                    ? `${dayCondition.iconBaseUri}.svg`
                    : null;
                  const maxTemp = day.maxTemperature?.degrees;
                  const minTemp = day.minTemperature?.degrees;
                  const pop =
                    day.daytimeForecast?.precipitation?.probability?.percent;
                  const dayLabel = formatDayLabel(
                    day.displayDate,
                    idx,
                    locale,
                    t.weatherWidget.todayLabel
                  );

                  return (
                    <li
                      key={`${dayLabel}-${idx}`}
                      className="flex flex-col justify-between rounded-md border border-[var(--border-hairline)] bg-[var(--bg-canvas)] p-3 text-xs"
                    >
                      <span className="font-semibold text-[var(--text-primary)] truncate">
                        {dayLabel}
                      </span>
                      <div className="my-2 flex items-center justify-between gap-2">
                        {iconUrl ? (
                          <img
                            src={iconUrl}
                            alt={dayCondition?.description?.text || ''}
                            width={28}
                            height={28}
                            className="h-7 w-7 shrink-0"
                          />
                        ) : (
                          <CloudSun
                            className="h-5 w-5 text-[var(--accent-brass)]"
                            aria-hidden="true"
                          />
                        )}
                        {typeof pop === 'number' && (
                          <span className="typo-mono text-[11px] text-[var(--text-muted)]">
                            {pop}%
                          </span>
                        )}
                      </div>
                      <p className="typo-mono text-xs text-[var(--text-primary)]">
                        {typeof maxTemp === 'number'
                          ? `${Math.round(maxTemp)}°`
                          : '—'}{' '}
                        <span className="text-[var(--text-muted)]">
                          /{' '}
                          {typeof minTemp === 'number'
                            ? `${Math.round(minTemp)}°`
                            : '—'}
                        </span>
                      </p>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
