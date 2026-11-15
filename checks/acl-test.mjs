import { createServer } from 'node:http';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const home = await mkdtemp(join(tmpdir(), 'memo-acl-'));
process.env.DSH_HOME = home;

const mod = await import(pathToFileURL('D:/deepseek/memo-calendar/index.js').href);

async function boot(connection) {
  let route;
  const ctx = {
    effect(fn) { const d = fn(); return () => { if (typeof d === 'function') d(); }; },
    webServer: { register(r) { route = r; return () => {}; } },
    logger: { warn() {} },
    get(name) { return name === 'connection' ? connection : undefined; },
    connection,
  };
  mod.apply(ctx);
  const server = createServer((req, res) => { route.handler(req, res); });
  await new Promise((r) => server.listen(0, '127.0.0.1', r));
  const base = `http://127.0.0.1:${server.address().port}/memo-calendar/state`;
  return { server, base, close: () => new Promise((r) => server.close(r)) };
}

const ok = [];
const fail = [];
const check = (name, cond) => { (cond ? ok : fail).push(name); console.log(cond ? 'PASS' : 'FAIL', name); };

// ── 1. connection service mounted: it decides ────────────────────────
{
  const seen = [];
  const bind = await boot({
    requestRejection({ headers }) {
      seen.push(headers['x-token'] ?? '(none)');
      return headers['x-token'] === 'good' ? undefined : 401;
    },
  });
  const denied = await fetch(bind.base);
  check('connection: no token -> 401', denied.status === 401);
  const deniedBody = await denied.json();
  check('connection: denial leaks nothing', deniedBody.error === 'unauthorized' && !('notes' in deniedBody));

  const deniedPut = await fetch(bind.base, { method: 'PUT', body: '{"notes":[]}', headers: { 'content-type': 'application/json' } });
  check('connection: unauthenticated PUT -> 401', deniedPut.status === 401);

  const allowed = await fetch(bind.base, { headers: { 'x-token': 'good' } });
  check('connection: valid token -> 200', allowed.status === 200);

  const put = await fetch(bind.base, {
    method: 'PUT',
    headers: { 'x-token': 'good', 'content-type': 'application/json' },
    body: JSON.stringify({ notes: [{ id: 'a', date: '2026-11-15', text: 'via acl', color: 'mint' }] }),
  });
  check('connection: authenticated PUT -> 200', put.status === 200);
  const back = await (await fetch(bind.base, { headers: { 'x-token': 'good' } })).json();
  check('connection: write round-trips', back.notes.length === 1 && back.notes[0].text === 'via acl');
  check('connection: service was consulted for every request', seen.length === 5);
  await bind.close();
}

// ── 2. service that throws: fail closed ─────────────────────────────
{
  const bind = await boot({ requestRejection() { throw new Error('boom'); } });
  const r = await fetch(bind.base);
  check('throwing service: fails closed (401)', r.status === 401);
  await bind.close();
}

// ── 3. no connection service: loopback + same-origin fallback ───────
{
  const bind = await boot(undefined);
  const plain = await fetch(bind.base);
  check('no service: loopback GET admitted', plain.status === 200);

  const cross = await fetch(bind.base, { headers: { 'sec-fetch-site': 'cross-site' } });
  check('no service: cross-site -> 401', cross.status === 401);

  const badOrigin = await fetch(bind.base, { headers: { origin: 'https://evil.example' } });
  check('no service: foreign origin -> 401', badOrigin.status === 401);

  const nullOrigin = await fetch(bind.base, { headers: { origin: 'null' } });
  check('no service: null origin -> 401', nullOrigin.status === 401);

  const sameOrigin = await fetch(bind.base, { headers: { origin: bind.base.replace('/memo-calendar/state', '') } });
  check('no service: same origin -> 200', sameOrigin.status === 200);
  await bind.close();
}

// ── 4. accepted write still lands on disk ───────────────────────────
{
  const raw = await readFile(join(home, 'memo-calendar', 'notes.json'), 'utf8');
  const parsed = JSON.parse(raw);
  check('file: authenticated write persisted', parsed.notes.length === 1 && parsed.notes[0].date === '2026-11-15');
}

await rm(home, { recursive: true, force: true });
console.log(`\n${ok.length} passed, ${fail.length} failed`);
if (fail.length) { console.log('failed:', fail.join(', ')); process.exit(1); }
console.log('ACL OK');