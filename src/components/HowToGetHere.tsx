import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from 'react';
import {
  APIProvider,
  APILoadingStatus,
  AdvancedMarker,
  InfoWindow,
  Map as GoogleMap,
  Pin,
  useAdvancedMarkerRef,
  useApiLoadingStatus,
  useMap,
  useMapsLibrary,
} from '@vis.gl/react-google-maps';
import {
  Bike,
  Car,
  Footprints,
  Navigation,
  Search,
  TrainFront,
} from 'lucide-react';
import { useLanguage, type Language } from '../i18n/LanguageContext';

const MAPS_API_KEY: string =
  import.meta.env.VITE_GOOGLE_MAPS_API_KEY ||
  (typeof __GMP_FALLBACK_KEY__ !== 'undefined' ? __GMP_FALLBACK_KEY__ : '') ||
  '';

const VENUE_QUERY = 'Münchenbryggeriet, Torkel Knutssonsgatan 2, Stockholm';

const QUICK_ORIGINS = [
  'Stockholm Centralstation',
  'Slussen, Stockholm',
  'Södra station, Stockholm',
  'Stockholm Arlanda Airport',
];

type TravelModeOption = 'TRANSIT' | 'WALKING' | 'BICYCLING' | 'DRIVING';
type RouteErrorType = 'NO_ROUTE' | 'FETCH_ERROR' | null;
type VenueErrorType = 'RESOLVE_ERROR' | 'DATA_ERROR' | null;

const TRAVEL_MODE_ICONS: Array<{
  mode: TravelModeOption;
  icon: typeof TrainFront;
}> = [
  { mode: 'TRANSIT', icon: TrainFront },
  { mode: 'WALKING', icon: Footprints },
  { mode: 'BICYCLING', icon: Bike },
  { mode: 'DRIVING', icon: Car },
];

interface ResolvedVenue {
  name: string;
  address: string;
  location: google.maps.LatLngLiteral;
}

interface RouteStepSummary {
  instruction: string;
  distanceMeters: number;
}

interface RouteSummary {
  distanceMeters: number;
  durationMillis: number;
  steps: RouteStepSummary[];
}

function isQuotaError(err: unknown): boolean {
  const text = String(
    err && typeof err === 'object' && 'message' in err
      ? (err as { message?: unknown }).message
      : err
  );
  return (
    text.includes('RESOURCE_EXHAUSTED') ||
    text.includes('OVER_QUERY_LIMIT') ||
    text.includes('Quota') ||
    text.includes('429')
  );
}

function formatDuration(
  millis: number,
  hoursUnit: string,
  minutesUnit: string
): string {
  const totalMinutes = Math.max(1, Math.round(millis / 60000));
  if (totalMinutes < 60) {
    return `${totalMinutes} ${minutesUnit}`;
  }
  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  return mins > 0
    ? `${hours} ${hoursUnit} ${mins} ${minutesUnit}`
    : `${hours} ${hoursUnit}`;
}

function formatDistance(meters: number, language: Language): string {
  if (meters < 1000) {
    return `${Math.round(meters)} m`;
  }
  const km = (meters / 1000).toFixed(1);
  return `${language === 'sv' ? km.replace('.', ',') : km} km`;
}

interface RouteOverlayProps {
  venue: ResolvedVenue;
  origin: string | google.maps.LatLngLiteral;
  travelMode: TravelModeOption;
  onSummaryChange: (summary: RouteSummary | null) => void;
  onLoadingChange: (loading: boolean) => void;
  onErrorChange: (error: RouteErrorType) => void;
}

function RouteOverlay({
  venue,
  origin,
  travelMode,
  onSummaryChange,
  onLoadingChange,
  onErrorChange,
}: RouteOverlayProps) {
  const map = useMap();
  const routesLib = useMapsLibrary('routes');
  const polylinesRef = useRef<google.maps.Polyline[]>([]);
  const [markerRef, marker] = useAdvancedMarkerRef();
  const [infoOpen, setInfoOpen] = useState(false);

  useEffect(() => {
    if (!routesLib || !map || !origin) return;

    polylinesRef.current.forEach((p) => p.setMap(null));
    polylinesRef.current = [];
    onErrorChange(null);
    onLoadingChange(true);

    const request: google.maps.routes.ComputeRoutesRequest = {
      origin,
      destination: venue.location,
      travelMode: travelMode as google.maps.TravelModeString,
      fields: ['path', 'distanceMeters', 'durationMillis', 'viewport', 'legs'],
    };

    let cancelled = false;

    routesLib.Route.computeRoutes(request)
      .then(({ routes }) => {
        if (cancelled) return;
        onLoadingChange(false);

        const primaryRoute = routes?.[0];
        if (!primaryRoute) {
          onSummaryChange(null);
          onErrorChange('NO_ROUTE');
          return;
        }

        const newPolylines = primaryRoute.createPolylines();
        newPolylines.forEach((polyline) => {
          polyline.setOptions({
            strokeColor: '#854d0e',
            strokeOpacity: 0.9,
            strokeWeight: 5,
          });
          polyline.setMap(map);
        });
        polylinesRef.current = newPolylines;

        if (primaryRoute.viewport) {
          map.fitBounds(primaryRoute.viewport);
        }

        const rawSteps = primaryRoute.legs?.[0]?.steps ?? [];
        const steps: RouteStepSummary[] = rawSteps
          .filter((step) => Boolean(step.instructions))
          .slice(0, 6)
          .map((step) => ({
            instruction: step.instructions || '',
            distanceMeters: step.distanceMeters ?? 0,
          }));

        onSummaryChange({
          distanceMeters: primaryRoute.distanceMeters ?? 0,
          durationMillis: primaryRoute.durationMillis ?? 0,
          steps,
        });
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        onLoadingChange(false);
        onSummaryChange(null);
        if (isQuotaError(err)) {
          window.dispatchEvent(new CustomEvent('gmp-quota-exceeded'));
        }
        onErrorChange('FETCH_ERROR');
      });

    return () => {
      cancelled = true;
      polylinesRef.current.forEach((p) => p.setMap(null));
      polylinesRef.current = [];
    };
  }, [
    routesLib,
    map,
    origin,
    travelMode,
    venue,
    onSummaryChange,
    onLoadingChange,
    onErrorChange,
  ]);

  return (
    <>
      <AdvancedMarker
        ref={markerRef}
        position={venue.location}
        title={venue.name}
        onClick={() => setInfoOpen(true)}
      >
        <Pin background="#854d0e" borderColor="#451a03" glyphColor="#ffffff" />
      </AdvancedMarker>

      {infoOpen && marker && (
        <InfoWindow
          anchor={marker}
          maxWidth={240}
          onCloseClick={() => setInfoOpen(false)}
        >
          <div className="text-xs text-neutral-900">
            <p className="font-semibold">{venue.name}</p>
            <p className="mt-1 text-neutral-600">{venue.address}</p>
          </div>
        </InfoWindow>
      )}
    </>
  );
}

function DirectionsWorkspace() {
  const { language, t } = useLanguage();
  const placesLib = useMapsLibrary('places');
  const loadingStatus = useApiLoadingStatus();

  const [venue, setVenue] = useState<ResolvedVenue | null>(null);
  const [venueError, setVenueError] = useState<VenueErrorType>(null);

  const [originInput, setOriginInput] = useState('Stockholm Centralstation');
  const [activeOrigin, setActiveOrigin] = useState<
    string | google.maps.LatLngLiteral
  >('Stockholm Centralstation');
  const [activeOriginLabel, setActiveOriginLabel] = useState(
    'Stockholm Centralstation'
  );
  const [travelMode, setTravelMode] = useState<TravelModeOption>('TRANSIT');

  const [suggestions, setSuggestions] = useState<
    google.maps.places.AutocompleteSuggestion[]
  >([]);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const sessionTokenRef =
    useRef<google.maps.places.AutocompleteSessionToken | null>(null);

  const [routeSummary, setRouteSummary] = useState<RouteSummary | null>(null);
  const [isRouting, setIsRouting] = useState(false);
  const [routeError, setRouteError] = useState<RouteErrorType>(null);

  // Resolve venue location and address dynamically from Google Places API (New)
  useEffect(() => {
    if (!placesLib || venue) return;
    let cancelled = false;

    placesLib.Place.searchByText({
      textQuery: VENUE_QUERY,
      fields: ['displayName', 'formattedAddress', 'location'],
      maxResultCount: 1,
    })
      .then(({ places }) => {
        if (cancelled) return;
        const found = places?.[0];
        if (found?.location) {
          setVenue({
            name: found.displayName || 'Münchenbryggeriet',
            address: found.formattedAddress || VENUE_QUERY,
            location: {
              lat: found.location.lat(),
              lng: found.location.lng(),
            },
          });
        } else {
          setVenueError('RESOLVE_ERROR');
        }
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        if (isQuotaError(err)) {
          window.dispatchEvent(new CustomEvent('gmp-quota-exceeded'));
        }
        setVenueError('DATA_ERROR');
      });

    return () => {
      cancelled = true;
    };
  }, [placesLib, venue]);

  const handleOriginChange = useCallback(
    async (nextValue: string) => {
      setOriginInput(nextValue);

      if (!placesLib || nextValue.trim().length < 2) {
        setSuggestions([]);
        return;
      }

      const { AutocompleteSessionToken, AutocompleteSuggestion } = placesLib;
      if (!sessionTokenRef.current) {
        sessionTokenRef.current = new AutocompleteSessionToken();
      }

      setIsSuggesting(true);
      try {
        const res = await AutocompleteSuggestion.fetchAutocompleteSuggestions({
          input: nextValue,
          sessionToken: sessionTokenRef.current,
          includedRegionCodes: ['se'],
        });
        setSuggestions(res?.suggestions ?? []);
      } catch (err: unknown) {
        if (isQuotaError(err)) {
          window.dispatchEvent(new CustomEvent('gmp-quota-exceeded'));
        }
        setSuggestions([]);
      } finally {
        setIsSuggesting(false);
      }
    },
    [placesLib]
  );

  const handleSelectSuggestion = useCallback(
    async (suggestion: google.maps.places.AutocompleteSuggestion) => {
      if (!suggestion.placePrediction) return;
      const place = suggestion.placePrediction.toPlace();
      const displayText = suggestion.placePrediction.text.text;

      try {
        await place.fetchFields({
          fields: ['location', 'formattedAddress', 'displayName'],
        });
        sessionTokenRef.current = null;
        setSuggestions([]);
        setOriginInput(displayText);
        setActiveOriginLabel(displayText);

        if (place.location) {
          setActiveOrigin({
            lat: place.location.lat(),
            lng: place.location.lng(),
          });
        } else {
          setActiveOrigin(displayText);
        }
      } catch (err: unknown) {
        if (isQuotaError(err)) {
          window.dispatchEvent(new CustomEvent('gmp-quota-exceeded'));
        }
      }
    },
    []
  );

  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = originInput.trim();
    if (!trimmed) return;
    setSuggestions([]);
    setActiveOrigin(trimmed);
    setActiveOriginLabel(trimmed);
  };

  if (
    loadingStatus === APILoadingStatus.FAILED ||
    loadingStatus === APILoadingStatus.AUTH_FAILURE ||
    venueError
  ) {
    const errorText =
      venueError === 'RESOLVE_ERROR'
        ? t.howToGetHere.venueResolveError
        : venueError === 'DATA_ERROR'
          ? t.howToGetHere.venueDataError
          : t.howToGetHere.loadError;
    return (
      <div
        role="alert"
        className="rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-canvas)] p-6 text-sm text-[var(--text-muted)]"
      >
        {errorText}
      </div>
    );
  }

  const routeErrorText =
    routeError === 'NO_ROUTE'
      ? t.howToGetHere.noRouteError(activeOriginLabel)
      : routeError === 'FETCH_ERROR'
        ? t.howToGetHere.routeFetchError
        : null;

  return (
    <div className="directions-planner grid grid-cols-1 gap-8 lg:grid-cols-12">
      <div className="lg:col-span-5 flex flex-col justify-between gap-6">
        <div>
          <form onSubmit={handleSearchSubmit} className="relative">
            <label
              htmlFor="directions-origin-input"
              className="block text-xs font-semibold text-[var(--text-primary)]"
            >
              {t.howToGetHere.originLabel}
            </label>
            <div className="mt-2 flex gap-2">
              <div className="relative flex-1">
                <input
                  id="directions-origin-input"
                  type="text"
                  value={originInput}
                  onChange={(e) => void handleOriginChange(e.target.value)}
                  placeholder={t.howToGetHere.originPlaceholder}
                  aria-label={t.howToGetHere.originInputAria}
                  aria-autocomplete="list"
                  aria-controls="origin-suggestions-list"
                  className="w-full rounded-md border border-[var(--border-hairline)] bg-[var(--bg-canvas)] px-3.5 py-2.5 text-sm text-[var(--text-primary)] min-h-[44px]"
                />
                {suggestions.length > 0 && (
                  <ul
                    id="origin-suggestions-list"
                    role="listbox"
                    aria-label={t.howToGetHere.suggestionsAria}
                    className="directions-planner__suggestions absolute left-0 right-0 top-full z-20 mt-1 max-h-56 overflow-y-auto rounded-md border border-[var(--border-hairline)] bg-[var(--bg-surface)] shadow-lg"
                  >
                    {suggestions.map((suggestion, index) => {
                      const label = suggestion.placePrediction?.text.text ?? '';
                      if (!label) return null;
                      return (
                        <li key={`${label}-${index}`} role="option">
                          <button
                            type="button"
                            onClick={() =>
                              void handleSelectSuggestion(suggestion)
                            }
                            aria-label={t.howToGetHere.selectOriginAria(label)}
                            className="w-full px-3.5 py-2.5 text-left text-xs text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] transition-colors min-h-[40px]"
                          >
                            {label}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>

              <button
                type="submit"
                aria-label={t.howToGetHere.searchSubmitAria}
                className="btn-primary px-4 py-2 text-xs"
              >
                <Search className="h-4 w-4" aria-hidden="true" />
                <span>{t.howToGetHere.searchSubmit}</span>
              </button>
            </div>
            {isSuggesting && (
              <p className="mt-1.5 text-xs text-[var(--text-muted)]">
                {t.howToGetHere.loadingSuggestions}
              </p>
            )}
          </form>

          <div className="mt-4">
            <p className="text-xs font-medium text-[var(--text-muted)]">
              {t.howToGetHere.quickOriginsTitle}
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {QUICK_ORIGINS.map((hub) => {
                const isSelected = activeOriginLabel === hub;
                return (
                  <button
                    key={hub}
                    type="button"
                    onClick={() => {
                      setOriginInput(hub);
                      setSuggestions([]);
                      setActiveOrigin(hub);
                      setActiveOriginLabel(hub);
                    }}
                    aria-pressed={isSelected}
                    aria-label={t.howToGetHere.quickOriginAria(hub)}
                    className={`rounded-md border px-3 py-1.5 text-xs font-medium transition-colors min-h-[36px] ${
                      isSelected
                        ? 'border-[var(--accent-brass)] bg-[var(--bg-surface)] text-[var(--text-primary)]'
                        : 'border-[var(--border-hairline)] bg-[var(--bg-canvas)] text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    {hub}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-5">
            <p className="text-xs font-medium text-[var(--text-muted)]">
              {t.howToGetHere.travelModeTitle}
            </p>
            <div
              role="group"
              aria-label={t.howToGetHere.travelModeGroupAria}
              className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4"
            >
              {TRAVEL_MODE_ICONS.map(({ mode, icon: Icon }) => {
                const isActive = travelMode === mode;
                const modeCopy = t.howToGetHere.travelModes[mode];
                return (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setTravelMode(mode)}
                    aria-pressed={isActive}
                    aria-label={modeCopy.ariaLabel}
                    className={`inline-flex items-center justify-center gap-1.5 rounded-md border px-3 py-2 text-xs font-medium transition-colors min-h-[44px] ${
                      isActive
                        ? 'border-[var(--accent-brass)] bg-[var(--bg-surface)] text-[var(--text-primary)]'
                        : 'border-[var(--border-hairline)] bg-[var(--bg-canvas)] text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                    <span>{modeCopy.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div
          aria-live="polite"
          className="rounded-md border border-[var(--border-hairline)] bg-[var(--bg-canvas)] p-4"
        >
          {isRouting && (
            <p className="text-xs text-[var(--text-muted)]">
              {t.howToGetHere.calculatingRoute(activeOriginLabel)}
            </p>
          )}

          {!isRouting && routeErrorText && (
            <p className="text-xs font-medium text-[var(--error-ink)]">
              {routeErrorText}
            </p>
          )}

          {!isRouting && !routeErrorText && routeSummary && (
            <div>
              <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-[var(--border-hairline)] pb-3">
                <p className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--text-primary)]">
                  <Navigation
                    className="h-3.5 w-3.5 text-[var(--accent-brass)]"
                    aria-hidden="true"
                  />
                  <span>{t.howToGetHere.fromPrefix(activeOriginLabel)}</span>
                </p>
                <p className="typo-mono text-xs font-semibold text-[var(--accent-brass)]">
                  {formatDuration(
                    routeSummary.durationMillis,
                    t.howToGetHere.hoursUnit,
                    t.howToGetHere.minutesUnit
                  )}{' '}
                  · {formatDistance(routeSummary.distanceMeters, language)}
                </p>
              </div>

              {routeSummary.steps.length > 0 && (
                <ol className="mt-3 space-y-2 text-xs text-[var(--text-muted)]">
                  {routeSummary.steps.map((step, idx) => (
                    <li
                      key={`${step.instruction}-${idx}`}
                      className="flex items-baseline justify-between gap-3"
                    >
                      <span>
                        {idx + 1}. {step.instruction}
                      </span>
                      <span className="typo-mono shrink-0 text-[var(--text-primary)]">
                        {formatDistance(step.distanceMeters, language)}
                      </span>
                    </li>
                  ))}
                </ol>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="lg:col-span-7">
        <div className="directions-planner__map overflow-hidden rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-canvas)] h-[360px] sm:h-[420px]">
          {venue ? (
            <GoogleMap
              mapId="DEMO_MAP_ID"
              defaultCenter={venue.location}
              defaultZoom={14}
              gestureHandling="cooperative"
              internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
              style={{ width: '100%', height: '100%' }}
            >
              <RouteOverlay
                venue={venue}
                origin={activeOrigin}
                travelMode={travelMode}
                onSummaryChange={setRouteSummary}
                onLoadingChange={setIsRouting}
                onErrorChange={setRouteError}
              />
            </GoogleMap>
          ) : (
            <div className="flex h-full items-center justify-center p-6 text-sm text-[var(--text-muted)]">
              {t.howToGetHere.loadingMap}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function HowToGetHere() {
  const { t } = useLanguage();

  if (!MAPS_API_KEY) {
    return (
      <section
        id="hitta-hit"
        aria-labelledby="heading-hitta-hit"
        className="mt-14 rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-surface)] p-6"
      >
        <h3
          id="heading-hitta-hit"
          className="typo-display text-xl font-semibold text-[var(--text-primary)]"
        >
          {t.howToGetHere.heading}
        </h3>
        <p className="mt-2 text-sm text-[var(--text-muted)]">
          {t.howToGetHere.missingKeyNoticeBefore}
          <code className="typo-mono">VITE_GOOGLE_MAPS_API_KEY</code>
          {t.howToGetHere.missingKeyNoticeAfter}
        </p>
      </section>
    );
  }

  return (
    <section
      id="hitta-hit"
      aria-labelledby="heading-hitta-hit"
      className="mt-14 rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-surface)] p-5 sm:p-8"
    >
      <header className="mb-6 max-w-2xl">
        <h3
          id="heading-hitta-hit"
          className="typo-display text-2xl font-semibold tracking-tight text-[var(--text-primary)]"
        >
          {t.howToGetHere.heading}
        </h3>
        <p className="mt-1.5 text-sm leading-relaxed text-[var(--text-muted)]">
          {t.howToGetHere.intro}
        </p>
      </header>

      <APIProvider
        apiKey={MAPS_API_KEY}
        libraries={['places', 'routes', 'marker']}
        language="sv"
        region="SE"
      >
        <DirectionsWorkspace />
      </APIProvider>
    </section>
  );
}
