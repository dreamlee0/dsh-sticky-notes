/**
 * Host half of the memo-calendar bundle.
 *
 * The memo board renders entirely in the Web UI, but its data needs a home that
 * outlives one browser origin (the Desktop Host binds a new loopback port per
 * launch, so localStorage alone would lose notes on restart). This half owns
 * one small JSON file and exposes it over a named Web route:
 *
 *   GET  /memo-calendar/state  -> { notes: [...] | null, updatedAt }
 *   PUT  /memo-calendar/state  <- { notes: [...], updatedAt? }
 *
 * The Client keeps a localStorage copy for instant paint and falls back to it
 * whenever the route is unavailable, so the board still works in compositions
 * without a Web carrier.
 *
 * ACCESS CONTROL. A `webServer.register` route gets no admission check from the
 * carrier, so a page open in the same browser could otherwise read and rewrite
 * the notes cross-site. Every request therefore passes `ctx.connection.
 * requestRejection` first — the Host/Origin fence plus the authority-bound
 * `dsh-auth-*` browser session — and falls back to a loopback-only fence when
 * the composition mounts no connection service.
 */
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import { homedir } from 'node:os';
import { dirname, join } from 'node:path';

/** Services required to mount the route. */
export const inject = ['webServer'];

/** Exact route path owned by this plugin. */
const ROUTE_PATH = '/memo-calendar/state';
/** Hard cap for one state document (notes are small text records). */
const MAX_BODY_BYTES = 4 * 1024 * 1024;
/** Hard cap for the number of stored notes. */
const MAX_NOTES = 5000;

const COLORS = new Set(['pink', 'mint', 'lemon', 'sky', 'lilac']);

/**
 * The Host connection service, narrowed to the one check this route needs.
 * Declared structurally rather than imported: the package is a browser-side
 * dependency this Host half has no reason to resolve.
 */
function connectionOf(ctx) {
  const service = (typeof ctx.get === 'function' ? ctx.get('connection') : undefined) ?? ctx.connection;
  return service && typeof service.requestRejection === 'function' ? service : undefined;
}

/** Loopback literals, so a missing connection service still fails closed. */
function isLoopbackAddress(address) {
  if (typeof address !== 'string') return false;
  const a = address.replace(/^::ffff:/i, '');
  return a === '::1' || /^127\./.test(a) || a === 'localhost';
}

/** Loopback hostname, for the Host header rather than the socket. */
function isLoopbackHostname(hostname) {
  const h = String(hostname).toLowerCase();
  return h === 'localhost' || h === '::1' || /^127\./.test(h);
}

/** A browser-signed request, or one that at least declares a same-origin site. */
function browserSameOriginMarker(req) {
  if (req.headers['sec-fetch-site'] === 'same-origin') return true;
  if (typeof req.headers.origin === 'string') return true;
  const cookie = req.headers.cookie;
  return typeof cookie === 'string' && /(?:^|;\s*)dsh-auth-/.test(cookie);
}

/** Loopback socket, loopback Host, and no cross-site claim. */
function isLoopbackRequest(req) {
  if (!isLoopbackAddress(req.socket?.remoteAddress)) return false;
  if (req.headers['x-forwarded-host'] !== undefined || req.headers['x-forwarded-for'] !== undefined) return false;
  const host = req.headers.host;
  if (typeof host !== 'string') return false;
  let hostUrl;
  try {
    hostUrl = new URL('http://' + host);
  } catch {
    return false;
  }
  if (!isLoopbackHostname(hostUrl.hostname)) return false;
  if (req.headers['sec-fetch-site'] === 'cross-site') return false;
  const origin = req.headers.origin;
  if (origin === undefined) return true;
  if (origin === 'null') return false;
  try {
    return new URL(origin).host === hostUrl.host;
  } catch {
    return false;
  }
}

/**
 * True only when the request may touch the notes document.
 *
 * Two layers, in this order — the same shape the shipped bridges use:
 *
 * 1. The Host `connection` service, whenever it is mounted. It owns the
 *    Host/Origin fence and the authority-bound signed browser session, which is
 *    what a reverse-proxied or TLS-terminated deployment is admitted through.
 *    `undefined` means it admits the request.
 * 2. The fallback fence, unchanged for deployments without the service and for
 *    direct clients the service does not admit: a browser same-origin marker,
 *    then loopback socket + loopback Host and no cross-site claim.
 *
 * A request that clears neither is refused, so a cross-site page can never read
 * or rewrite the notes even though `webServer.register` does not fence it.
 */
function isAdmitted(ctx, req) {
  const connection = connectionOf(ctx);
  if (connection) {
    try {
      if (connection.requestRejection({ headers: req.headers }) === undefined) return true;
    } catch {
      // A service that throws has not vouched for the caller; fall through to
      // the local fence rather than admitting on an exception.
    }
  }
  if (!browserSameOriginMarker(req)) return false;
  return isLoopbackRequest(req);
}

/** Resolve the Harness home the same way the rest of the Harness does. */
function resolveHome(env = process.env) {
  const configured = env.DSH_HOME;
  if (typeof configured === 'string' && configured.trim().length > 0) return configured.trim();
  return join(homedir(), '.dsh');
}

/** Absolute path of the notes document. */
function statePath(env = process.env) {
  return join(resolveHome(env), 'memo-calendar', 'notes.json');
}

/** Accept only the note fields the board understands; the Client normalizes too. */
function cleanNotes(input) {
  if (!Array.isArray(input)) return [];
  const out = [];
  const seen = new Set();
  for (const raw of input.slice(0, MAX_NOTES)) {
    if (!raw || typeof raw !== 'object') continue;
    if (typeof raw.date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(raw.date)) continue;
    const id = typeof raw.id === 'string' && raw.id ? raw.id.slice(0, 64) : `n${out.length}`;
    if (seen.has(id)) continue;
    seen.add(id);
    out.push({
      id,
      date: raw.date,
      time: typeof raw.time === 'string' && /^\d{2}:\d{2}$/.test(raw.time) ? raw.time : '',
      text: typeof raw.text === 'string' ? raw.text.slice(0, 2000) : '',
      color: COLORS.has(raw.color) ? raw.color : 'pink',
      done: raw.done === true,
      completedAt: Number.isFinite(raw.completedAt) && raw.completedAt > 0 ? raw.completedAt : 0,
      createdAt: Number.isFinite(raw.createdAt) ? raw.createdAt : Date.now(),
    });
  }
  return out;
}

async function readState(file) {
  try {
    const parsed = JSON.parse(await readFile(file, 'utf8'));
    if (!parsed || !Array.isArray(parsed.notes)) return null;
    return {
      notes: cleanNotes(parsed.notes),
      updatedAt: Number.isFinite(parsed.updatedAt) ? parsed.updatedAt : 0,
    };
  } catch (error) {
    return null;
  }
}

/** Write through a sibling temp file so a crash never truncates the document. */
async function writeState(file, value) {
  await mkdir(dirname(file), { recursive: true });
  const tmp = `${file}.${process.pid}.tmp`;
  await writeFile(tmp, JSON.stringify(value), 'utf8');
  await rename(tmp, file);
}

function sendJson(res, status, payload) {
  if (res.writableEnded || res.destroyed) return;
  const body = JSON.stringify(payload);
  res.writeHead(status, {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store',
    'content-length': Buffer.byteLength(body),
  });
  res.end(body);
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    req.on('data', (chunk) => {
      size += chunk.length;
      if (size > MAX_BODY_BYTES) {
        reject(new Error('payload too large'));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
}

async function handleStateRequest(req, res, file) {
  const method = req.method || 'GET';
  if (method === 'GET') {
    const state = await readState(file);
    sendJson(res, 200, state ? { notes: state.notes, updatedAt: state.updatedAt } : { notes: null, updatedAt: 0 });
    return;
  }
  if (method === 'PUT' || method === 'POST') {
    let parsed;
    try {
      parsed = JSON.parse(await readBody(req));
    } catch (error) {
      const tooLarge = error instanceof Error && error.message === 'payload too large';
      sendJson(res, tooLarge ? 413 : 400, { error: tooLarge ? 'payload too large' : 'invalid JSON body' });
      return;
    }
    const notes = cleanNotes(parsed && parsed.notes);
    const updatedAt = Date.now();
    await writeState(file, { v: 1, updatedAt, notes });
    sendJson(res, 200, { ok: true, count: notes.length, updatedAt });
    return;
  }
  res.setHeader('allow', 'GET, PUT');
  sendJson(res, 405, { error: 'method not allowed' });
}

/** Mount the state route for the lifetime of this plugin entry. */
export function apply(ctx) {
  const file = statePath();
  ctx.effect(
    () => ctx.webServer.register({
      kind: 'exact',
      path: ROUTE_PATH,
      handler: async (req, res) => {
        // Admission first: an unauthenticated caller learns nothing about the
        // document, not even whether it exists.
        if (!isAdmitted(ctx, req)) {
          sendJson(res, 401, { error: 'unauthorized' });
          return;
        }
        try {
          await handleStateRequest(req, res, file);
        } catch (error) {
          ctx.logger?.warn?.(`[memo-calendar] state route failed: ${String(error)}`);
          sendJson(res, 500, { error: 'state unavailable' });
        }
      },
    }),
    'memo-calendar: state route',
  );
}
