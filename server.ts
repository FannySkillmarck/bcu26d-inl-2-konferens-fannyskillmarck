import 'dotenv/config';
import express, { type Request, type Response } from 'express';
import fs from 'node:fs/promises';
import fsSync from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

interface AttendeeState {
  count: number;
  capacity: number;
  updatedAt: string;
}

const PORT = 3000;
const DEFAULT_CAPACITY = 320;
const INITIAL_REGISTERED_COUNT = 248;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, '.data');
const DATA_FILE = path.join(DATA_DIR, 'attendees.json');

let stateCache: AttendeeState | null = null;
let writeQueue: Promise<AttendeeState> = Promise.resolve({
  count: INITIAL_REGISTERED_COUNT,
  capacity: DEFAULT_CAPACITY,
  updatedAt: new Date().toISOString(),
});

const sseClients = new Set<Response>();

async function ensureState(): Promise<AttendeeState> {
  if (stateCache) return stateCache;

  try {
    const raw = await fs.readFile(DATA_FILE, 'utf-8');
    const parsed = JSON.parse(raw) as Partial<AttendeeState>;
    if (
      typeof parsed.count === 'number' &&
      typeof parsed.capacity === 'number' &&
      typeof parsed.updatedAt === 'string'
    ) {
      stateCache = {
        count: Math.max(0, Math.min(parsed.capacity, Math.floor(parsed.count))),
        capacity: parsed.capacity,
        updatedAt: parsed.updatedAt,
      };
      return stateCache;
    }
  } catch {
    // Initialize baseline state below when data file does not exist yet
  }

  const initialState: AttendeeState = {
    count: INITIAL_REGISTERED_COUNT,
    capacity: DEFAULT_CAPACITY,
    updatedAt: new Date().toISOString(),
  };

  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(initialState, null, 2), 'utf-8');
  stateCache = initialState;
  return stateCache;
}

function broadcastAttendeeState(state: AttendeeState): void {
  const payload = `data: ${JSON.stringify(state)}\n\n`;
  for (const client of sseClients) {
    client.write(payload);
  }
}

function incrementAttendeeCount(quantity: number): Promise<AttendeeState> {
  writeQueue = writeQueue.then(async () => {
    const current = await ensureState();
    const safeQuantity = Math.max(1, Math.min(10, Math.floor(quantity)));
    const nextState: AttendeeState = {
      count: Math.min(current.capacity, current.count + safeQuantity),
      capacity: current.capacity,
      updatedAt: new Date().toISOString(),
    };

    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(DATA_FILE, JSON.stringify(nextState, null, 2), 'utf-8');
    stateCache = nextState;
    broadcastAttendeeState(nextState);
    return nextState;
  });

  return writeQueue;
}

async function startServer(): Promise<void> {
  await ensureState();

  const app = express();
  app.use(express.json());

  app.get('/api/attendees', async (_req: Request, res: Response) => {
    try {
      const state = await ensureState();
      res.setHeader('Cache-Control', 'no-store');
      res.json(state);
    } catch {
      res.status(500).json({ error: 'Unable to load attendee count' });
    }
  });

  app.post('/api/attendees/register', async (req: Request, res: Response) => {
    try {
      const body = req.body as { quantity?: unknown } | undefined;
      const rawQty = Number(body?.quantity ?? 1);
      const quantity = Number.isFinite(rawQty) ? Math.floor(rawQty) : 1;

      if (quantity < 1 || quantity > 10) {
        res.status(400).json({ error: 'Quantity must be between 1 and 10' });
        return;
      }

      const updated = await incrementAttendeeCount(quantity);
      res.json(updated);
    } catch {
      res.status(500).json({ error: 'Unable to update attendee count' });
    }
  });

  app.get('/api/attendees/stream', async (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders?.();

    const current = await ensureState();
    res.write(`data: ${JSON.stringify(current)}\n\n`);
    sseClients.add(res);

    const keepAlive = setInterval(() => {
      res.write(': keepalive\n\n');
    }, 25000);

    req.on('close', () => {
      clearInterval(keepAlive);
      sseClients.delete(res);
    });
  });

  app.get('/api/weather', async (req: Request, res: Response) => {
    const mapsKey =
      process.env.GOOGLE_MAPS_API_KEY ||
      process.env.VITE_GOOGLE_MAPS_API_KEY ||
      '';

    if (!mapsKey) {
      res.status(503).json({ error: 'MISSING_KEY' });
      return;
    }

    const latRaw = Number(req.query.lat ?? 59.3204);
    const lngRaw = Number(req.query.lng ?? 18.0558);
    const lat = Number.isFinite(latRaw) ? latRaw : 59.3204;
    const lng = Number.isFinite(lngRaw) ? lngRaw : 18.0558;

    const currentUrl = new URL(
      'https://weather.googleapis.com/v1/currentConditions:lookup'
    );
    currentUrl.searchParams.set('key', mapsKey);
    currentUrl.searchParams.set('location.latitude', String(lat));
    currentUrl.searchParams.set('location.longitude', String(lng));
    currentUrl.searchParams.set('unitsSystem', 'METRIC');

    const forecastUrl = new URL(
      'https://weather.googleapis.com/v1/forecast/days:lookup'
    );
    forecastUrl.searchParams.set('key', mapsKey);
    forecastUrl.searchParams.set('location.latitude', String(lat));
    forecastUrl.searchParams.set('location.longitude', String(lng));
    forecastUrl.searchParams.set('days', '5');
    forecastUrl.searchParams.set('pageSize', '5');
    forecastUrl.searchParams.set('unitsSystem', 'METRIC');

    const headers: Record<string, string> = {
      'X-Goog-Maps-Solution-ID': 'gmp_mcp_codeassist_v1_aistudio',
    };
    const referer = req.get('referer');
    if (referer) {
      headers['Referer'] = referer;
    }

    try {
      const [currentRes, forecastRes] = await Promise.all([
        fetch(currentUrl.toString(), { method: 'GET', headers }),
        fetch(forecastUrl.toString(), { method: 'GET', headers }),
      ]);

      if (currentRes.status === 429 || forecastRes.status === 429) {
        res.status(429).json({ error: 'QUOTA_EXCEEDED' });
        return;
      }

      const currentJson = (await currentRes.json()) as Record<string, unknown>;
      const forecastJson = (await forecastRes.json()) as Record<
        string,
        unknown
      >;

      const currentErrStatus = (
        currentJson.error as { status?: string } | undefined
      )?.status;
      const forecastErrStatus = (
        forecastJson.error as { status?: string } | undefined
      )?.status;

      if (
        currentErrStatus === 'RESOURCE_EXHAUSTED' ||
        forecastErrStatus === 'RESOURCE_EXHAUSTED'
      ) {
        res.status(429).json({ error: 'QUOTA_EXCEEDED' });
        return;
      }

      if (!currentRes.ok) {
        res.status(currentRes.status).json({ error: 'WEATHER_UNAVAILABLE' });
        return;
      }

      res.setHeader('Cache-Control', 'no-store');
      res.json({
        current: currentJson,
        forecastDays: Array.isArray(forecastJson.forecastDays)
          ? forecastJson.forecastDays
          : [],
      });
    } catch {
      res.status(502).json({ error: 'WEATHER_UNAVAILABLE' });
    }
  });

  const isProduction =
    process.env.NODE_ENV === 'production' ||
    (process.env.npm_lifecycle_event === 'start' &&
      fsSync.existsSync(path.join(__dirname, 'dist', 'index.html')));

  if (isProduction) {
    const distDir = path.join(__dirname, 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Stjärnfall 2027 server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
