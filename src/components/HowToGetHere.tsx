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
  BedDouble,
  Bike,
  Car,
  ExternalLink,
  Footprints,
  MapPin,
  Navigation,
  Search,
  Star,
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

type WorkspaceTab = 'directions' | 'hotels';
type TravelModeOption = 'TRANSIT' | 'WALKING' | 'BICYCLING' | 'DRIVING';
type RouteErrorType = 'NO_ROUTE' | 'FETCH_ERROR' | null;
type VenueErrorType = 'RESOLVE_ERROR' | 'DATA_ERROR' | null;
type HotelRadiusOption = 500 | 1000 | 2000;
type HotelRatingOption = 0 | 4 | 4.5;

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

interface HotelResult {
  id: string;
  name: string;
  address: string;
  location: google.maps.LatLngLiteral;
  rating: number | null;
  userRatingCount: number | null;
  googleMapsUri: string | null;
  distanceMeters: number;
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

function haversineMeters(
  a: google.maps.LatLngLiteral,
  b: google.maps.LatLngLiteral
): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const r = 6371000;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const sinLat = Math.sin(dLat / 2);
  const sinLng = Math.sin(dLng / 2);
  const h =
    sinLat * sinLat +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * sinLng * sinLng;
  return 2 * r * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
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

interface HotelMarkerItemProps {
  hotel: HotelResult;
  isSelected: boolean;
  onSelect: () => void;
  onCloseInfo: () => void;
  openMapsLabel: string;
}

function HotelMarkerItem({
  hotel,
  isSelected,
  onSelect,
  onCloseInfo,
  openMapsLabel,
}: HotelMarkerItemProps) {
  const [markerRef, marker] = useAdvancedMarkerRef();

  return (
    <>
      <AdvancedMarker
        ref={markerRef}
        position={hotel.location}
        title={hotel.name}
        zIndex={isSelected ? 20 : 5}
        onClick={onSelect}
      >
        <Pin
          background={isSelected ? '#b45309' : '#1e293b'}
          borderColor={isSelected ? '#451a03' : '#0f172a'}
          glyphColor="#ffffff"
          scale={isSelected ? 1.15 : 0.95}
        />
      </AdvancedMarker>

      {isSelected && marker && (
        <InfoWindow anchor={marker} maxWidth={250} onCloseClick={onCloseInfo}>
          <div className="text-xs text-neutral-900">
            <p className="font-semibold">{hotel.name}</p>
            {hotel.address && (
              <p className="mt-1 text-neutral-600">{hotel.address}</p>
            )}
            {hotel.rating !== null && (
              <p className="mt-1 font-medium text-amber-800">
                ★ {hotel.rating.toFixed(1)}
                {hotel.userRatingCount !== null
                  ? ` (${hotel.userRatingCount})`
                  : ''}
              </p>
            )}
            {hotel.googleMapsUri && (
              <a
                href={hotel.googleMapsUri}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1.5 inline-block font-semibold text-amber-900 underline"
              >
                {openMapsLabel}
              </a>
            )}
          </div>
        </InfoWindow>
      )}
    </>
  );
}

interface HotelsOverlayProps {
  venue: ResolvedVenue;
  hotels: HotelResult[];
  selectedHotelId: string | null;
  onSelectHotel: (id: string | null) => void;
  openMapsLabel: string;
  venuePinTitle: string;
}

function HotelsOverlay({
  venue,
  hotels,
  selectedHotelId,
  onSelectHotel,
  openMapsLabel,
  venuePinTitle,
}: HotelsOverlayProps) {
  const map = useMap();
  const coreLib = useMapsLibrary('core');
  const [venueMarkerRef, venueMarker] = useAdvancedMarkerRef();
  const [venueInfoOpen, setVenueInfoOpen] = useState(false);

  useEffect(() => {
    if (!map || !coreLib) return;
    if (hotels.length === 0) {
      map.panTo(venue.location);
      map.setZoom(14);
      return;
    }

    const bounds = new coreLib.LatLngBounds();
    bounds.extend(venue.location);
    hotels.forEach((h) => bounds.extend(h.location));
    map.fitBounds(bounds, 64);
  }, [map, coreLib, venue.location, hotels]);

  useEffect(() => {
    if (!map || !selectedHotelId) return;
    const match = hotels.find((h) => h.id === selectedHotelId);
    if (match) {
      map.panTo(match.location);
    }
  }, [map, hotels, selectedHotelId]);

  return (
    <>
      <AdvancedMarker
        ref={venueMarkerRef}
        position={venue.location}
        title={venuePinTitle}
        zIndex={30}
        onClick={() => {
          onSelectHotel(null);
          setVenueInfoOpen(true);
        }}
      >
        <Pin background="#854d0e" borderColor="#451a03" glyphColor="#ffffff" />
      </AdvancedMarker>

      {venueInfoOpen && venueMarker && (
        <InfoWindow
          anchor={venueMarker}
          maxWidth={240}
          onCloseClick={() => setVenueInfoOpen(false)}
        >
          <div className="text-xs text-neutral-900">
            <p className="font-semibold">{venue.name}</p>
            <p className="mt-1 text-neutral-600">{venue.address}</p>
          </div>
        </InfoWindow>
      )}

      {hotels.map((hotel) => (
        <HotelMarkerItem
          key={hotel.id}
          hotel={hotel}
          isSelected={hotel.id === selectedHotelId}
          onSelect={() => {
            setVenueInfoOpen(false);
            onSelectHotel(hotel.id);
          }}
          onCloseInfo={() => onSelectHotel(null)}
          openMapsLabel={openMapsLabel}
        />
      ))}
    </>
  );
}

function DirectionsWorkspace() {
  const { language, t } = useLanguage();
  const placesLib = useMapsLibrary('places');
  const geometryLib = useMapsLibrary('geometry');
  const loadingStatus = useApiLoadingStatus();

  const [activeTab, setActiveTab] = useState<WorkspaceTab>('directions');
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

  // Nearby hotels state
  const [hotelQuery, setHotelQuery] = useState('');
  const [hotelRadius, setHotelRadius] = useState<HotelRadiusOption>(1000);
  const [hotelMinRating, setHotelMinRating] = useState<HotelRatingOption>(0);
  const [hotels, setHotels] = useState<HotelResult[]>([]);
  const [selectedHotelId, setSelectedHotelId] = useState<string | null>(null);
  const [isSearchingHotels, setIsSearchingHotels] = useState(false);
  const [hotelError, setHotelError] = useState(false);
  const [hasSearchedHotels, setHasSearchedHotels] = useState(false);

  // Resolve venue location and address dynamically from Google Places API (New)
  useEffect(() => {
    if (!placesLib || venue) return;
    let cancelled = false;

    placesLib.Place.searchByText({
      textQuery: VENUE_QUERY,
      fields: ['displayName', 'formattedAddress', 'location'],
      maxResultCount: 1,
      internalUsageAttributionIds: ['gmp_mcp_codeassist_v1_aistudio'],
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

  const runHotelSearch = useCallback(
    async (
      queryText: string,
      radiusMeters: HotelRadiusOption,
      minRatingValue: HotelRatingOption
    ) => {
      if (!placesLib || !venue) return;

      setIsSearchingHotels(true);
      setHotelError(false);
      setSelectedHotelId(null);

      const gmpLang = language === 'zh' ? 'zh-CN' : language;
      const fields = [
        'id',
        'displayName',
        'formattedAddress',
        'location',
        'rating',
        'userRatingCount',
        'googleMapsURI',
      ];

      try {
        const trimmed = queryText.trim();
        const response = trimmed
          ? await placesLib.Place.searchByText({
              textQuery: `${trimmed} hotel Stockholm`,
              fields,
              includedType: 'lodging',
              locationBias: {
                center: venue.location,
                radius: radiusMeters,
              },
              minRating: minRatingValue > 0 ? minRatingValue : undefined,
              maxResultCount: 8,
              language: gmpLang,
              region: 'se',
              internalUsageAttributionIds: ['gmp_mcp_codeassist_v1_aistudio'],
            })
          : await placesLib.Place.searchNearby({
              fields,
              locationRestriction: {
                center: venue.location,
                radius: radiusMeters,
              },
              includedPrimaryTypes: ['hotel', 'lodging'],
              maxResultCount: 8,
              rankPreference: placesLib.SearchNearbyRankPreference.DISTANCE,
              language: gmpLang,
              region: 'se',
              internalUsageAttributionIds: ['gmp_mcp_codeassist_v1_aistudio'],
            });

        const rawPlaces = response?.places ?? [];
        const mapped: HotelResult[] = rawPlaces
          .filter((place) => Boolean(place.location))
          .filter((place) =>
            minRatingValue > 0 ? (place.rating ?? 0) >= minRatingValue : true
          )
          .map((place) => {
            const loc = {
              lat: place.location!.lat(),
              lng: place.location!.lng(),
            };
            const dist = geometryLib?.spherical
              ? geometryLib.spherical.computeDistanceBetween(
                  venue.location,
                  loc
                )
              : haversineMeters(venue.location, loc);

            return {
              id: place.id,
              name: place.displayName || 'Hotel',
              address: place.formattedAddress || '',
              location: loc,
              rating: typeof place.rating === 'number' ? place.rating : null,
              userRatingCount:
                typeof place.userRatingCount === 'number'
                  ? place.userRatingCount
                  : null,
              googleMapsUri: place.googleMapsURI || null,
              distanceMeters: dist,
            };
          })
          .sort((a, b) => a.distanceMeters - b.distanceMeters);

        setHotels(mapped);
        setHasSearchedHotels(true);
        if (mapped[0]) {
          setSelectedHotelId(mapped[0].id);
        }
      } catch (err: unknown) {
        if (isQuotaError(err)) {
          window.dispatchEvent(new CustomEvent('gmp-quota-exceeded'));
        }
        setHotels([]);
        setHotelError(true);
      } finally {
        setIsSearchingHotels(false);
      }
    },
    [placesLib, geometryLib, venue, language]
  );

  useEffect(() => {
    if (
      activeTab === 'hotels' &&
      venue &&
      placesLib &&
      !hasSearchedHotels &&
      !isSearchingHotels
    ) {
      void runHotelSearch(hotelQuery, hotelRadius, hotelMinRating);
    }
  }, [
    activeTab,
    venue,
    placesLib,
    hasSearchedHotels,
    isSearchingHotels,
    runHotelSearch,
    hotelQuery,
    hotelRadius,
    hotelMinRating,
  ]);

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

  const handleHotelSubmit = (e: FormEvent) => {
    e.preventDefault();
    void runHotelSearch(hotelQuery, hotelRadius, hotelMinRating);
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
          <div
            role="tablist"
            aria-label={t.howToGetHere.tabGroupAria}
            className="mb-5 inline-flex w-full items-center gap-1 rounded-md border border-[var(--border-hairline)] bg-[var(--bg-subtle)] p-1"
          >
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'directions'}
              onClick={() => setActiveTab('directions')}
              className={`flex-1 inline-flex items-center justify-center gap-1.5 rounded px-3 py-2 text-xs font-semibold transition-colors min-h-[40px] ${
                activeTab === 'directions'
                  ? 'bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-xs'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              <Navigation className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              <span>{t.howToGetHere.tabDirections}</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'hotels'}
              onClick={() => setActiveTab('hotels')}
              className={`flex-1 inline-flex items-center justify-center gap-1.5 rounded px-3 py-2 text-xs font-semibold transition-colors min-h-[40px] ${
                activeTab === 'hotels'
                  ? 'bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-xs'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              <BedDouble className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              <span>{t.howToGetHere.tabHotels}</span>
            </button>
          </div>

          {activeTab === 'directions' ? (
            <>
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
                          const label =
                            suggestion.placePrediction?.text.text ?? '';
                          if (!label) return null;
                          return (
                            <li key={`${label}-${index}`} role="option">
                              <button
                                type="button"
                                onClick={() =>
                                  void handleSelectSuggestion(suggestion)
                                }
                                aria-label={t.howToGetHere.selectOriginAria(
                                  label
                                )}
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
                        <Icon
                          className="h-3.5 w-3.5 shrink-0"
                          aria-hidden="true"
                        />
                        <span>{modeCopy.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          ) : (
            <div>
              <form onSubmit={handleHotelSubmit}>
                <label
                  htmlFor="hotel-search-input"
                  className="block text-xs font-semibold text-[var(--text-primary)]"
                >
                  {t.howToGetHere.hotelSearchLabel}
                </label>
                <div className="mt-2 flex gap-2">
                  <input
                    id="hotel-search-input"
                    type="text"
                    value={hotelQuery}
                    onChange={(e) => setHotelQuery(e.target.value)}
                    placeholder={t.howToGetHere.hotelSearchPlaceholder}
                    aria-label={t.howToGetHere.hotelSearchAria}
                    className="min-w-0 flex-1 rounded-md border border-[var(--border-hairline)] bg-[var(--bg-canvas)] px-3.5 py-2.5 text-sm text-[var(--text-primary)] min-h-[44px]"
                  />
                  <button
                    type="submit"
                    className="btn-primary px-4 py-2 text-xs"
                  >
                    <Search className="h-4 w-4" aria-hidden="true" />
                    <span>{t.howToGetHere.hotelSearchBtn}</span>
                  </button>
                </div>
              </form>

              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-medium text-[var(--text-muted)]">
                    {t.howToGetHere.hotelRadiusLabel}
                  </p>
                  <div className="mt-1.5 flex gap-1.5">
                    {([500, 1000, 2000] as const).map((r) => {
                      const active = hotelRadius === r;
                      return (
                        <button
                          key={r}
                          type="button"
                          onClick={() => {
                            setHotelRadius(r);
                            void runHotelSearch(hotelQuery, r, hotelMinRating);
                          }}
                          aria-pressed={active}
                          className={`flex-1 rounded-md border px-2 py-1.5 text-xs font-medium transition-colors min-h-[36px] ${
                            active
                              ? 'border-[var(--accent-brass)] bg-[var(--bg-surface)] text-[var(--text-primary)]'
                              : 'border-[var(--border-hairline)] bg-[var(--bg-canvas)] text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                          }`}
                        >
                          {formatDistance(r, language)}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="hotel-min-rating"
                    className="block text-xs font-medium text-[var(--text-muted)]"
                  >
                    {t.howToGetHere.hotelRatingLabel}
                  </label>
                  <select
                    id="hotel-min-rating"
                    value={hotelMinRating}
                    onChange={(e) => {
                      const nextRating = Number(
                        e.target.value
                      ) as HotelRatingOption;
                      setHotelMinRating(nextRating);
                      void runHotelSearch(hotelQuery, hotelRadius, nextRating);
                    }}
                    className="mt-1.5 w-full rounded-md border border-[var(--border-hairline)] bg-[var(--bg-canvas)] px-3 py-1.5 text-xs font-medium text-[var(--text-primary)] min-h-[36px]"
                  >
                    <option value={0}>{t.howToGetHere.hotelRatingAny}</option>
                    <option value={4}>4.0+ ★</option>
                    <option value={4.5}>4.5+ ★</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        <div
          aria-live="polite"
          className="rounded-md border border-[var(--border-hairline)] bg-[var(--bg-canvas)] p-4"
        >
          {activeTab === 'directions' ? (
            <>
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
                      <span>
                        {t.howToGetHere.fromPrefix(activeOriginLabel)}
                      </span>
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
            </>
          ) : (
            <>
              {isSearchingHotels && (
                <p className="text-xs text-[var(--text-muted)]">
                  {t.howToGetHere.hotelSearching}
                </p>
              )}

              {!isSearchingHotels && hotelError && (
                <p className="text-xs font-medium text-[var(--error-ink)]">
                  {t.howToGetHere.hotelError}
                </p>
              )}

              {!isSearchingHotels &&
                !hotelError &&
                hasSearchedHotels &&
                hotels.length === 0 && (
                  <p className="text-xs text-[var(--text-muted)]">
                    {t.howToGetHere.hotelEmpty}
                  </p>
                )}

              {!isSearchingHotels && !hotelError && hotels.length > 0 && (
                <ul className="max-h-64 space-y-2.5 overflow-y-auto pr-1">
                  {hotels.map((hotel) => {
                    const isSelected = hotel.id === selectedHotelId;
                    return (
                      <li
                        key={hotel.id}
                        className={`rounded-md border p-3 text-xs transition-colors ${
                          isSelected
                            ? 'border-[var(--accent-brass)] bg-[var(--bg-surface)]'
                            : 'border-[var(--border-hairline)] bg-[var(--bg-surface)]/70'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="font-semibold text-[var(--text-primary)]">
                              {hotel.name}
                            </p>
                            {hotel.address && (
                              <p className="mt-0.5 text-[var(--text-muted)]">
                                {hotel.address}
                              </p>
                            )}
                          </div>
                          <span className="typo-mono shrink-0 text-[11px] font-medium text-[var(--accent-brass)]">
                            {t.howToGetHere.hotelDistanceFromVenue(
                              formatDistance(hotel.distanceMeters, language)
                            )}
                          </span>
                        </div>

                        <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2">
                          {hotel.rating !== null ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[var(--text-primary)]">
                              <Star
                                className="h-3.5 w-3.5 fill-current text-[var(--accent-brass)]"
                                aria-hidden="true"
                              />
                              <span className="typo-mono">
                                {hotel.rating.toFixed(1)}
                              </span>
                              {hotel.userRatingCount !== null && (
                                <span className="text-[var(--text-muted)]">
                                  ·{' '}
                                  {t.howToGetHere.hotelReviewsCount(
                                    hotel.userRatingCount
                                  )}
                                </span>
                              )}
                            </span>
                          ) : (
                            <span />
                          )}

                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              onClick={() => setSelectedHotelId(hotel.id)}
                              className="inline-flex min-h-[32px] items-center gap-1 font-semibold text-[var(--accent-brass)] hover:underline"
                            >
                              <MapPin
                                className="h-3 w-3 shrink-0"
                                aria-hidden="true"
                              />
                              <span>{t.howToGetHere.hotelShowOnMap}</span>
                            </button>

                            {hotel.googleMapsUri && (
                              <a
                                href={hotel.googleMapsUri}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex min-h-[32px] items-center gap-1 font-medium text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                              >
                                <span>{t.howToGetHere.hotelOpenMaps}</span>
                                <ExternalLink
                                  className="h-3 w-3 shrink-0"
                                  aria-hidden="true"
                                />
                              </a>
                            )}
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </>
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
              {activeTab === 'directions' ? (
                <RouteOverlay
                  venue={venue}
                  origin={activeOrigin}
                  travelMode={travelMode}
                  onSummaryChange={setRouteSummary}
                  onLoadingChange={setIsRouting}
                  onErrorChange={setRouteError}
                />
              ) : (
                <HotelsOverlay
                  venue={venue}
                  hotels={hotels}
                  selectedHotelId={selectedHotelId}
                  onSelectHotel={setSelectedHotelId}
                  openMapsLabel={t.howToGetHere.hotelOpenMaps}
                  venuePinTitle={t.howToGetHere.hotelVenuePinTitle}
                />
              )}
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
        className="mt-8 rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-surface)] p-6"
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
      className="mt-8 rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-surface)] p-5 sm:p-8"
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
        libraries={['places', 'routes', 'marker', 'geometry']}
        language="sv"
        region="SE"
      >
        <DirectionsWorkspace />
      </APIProvider>
    </section>
  );
}
