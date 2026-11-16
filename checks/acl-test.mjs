import { createServer } from 'node:http';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const home = await mkdtemp(join(tmpdir(), 'memo-acl-'));
process.env.DSH_HOME = home;

const mod = await import(pathToFileURL('D:/deepseek/memo-calendar/index.js').href);

const PORT_HOLDER = {};

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
  const port = server.address().port;
  PORT_HOLDER.port = port;
  return {
    port,
    base: `http://127.0.0.1:${port}/memo-calendar/state`,
    origin: `http://127.0.0.1:${port}`,
    close: () => new Promise((r) => server.close(r)),
  };
}

const ok = [];
const bad = [];
const check = (name, cond) => { (cond ? ok : bad).push(name); console.log(cond ? 'PASS' : 'FAIL', name); };

// ── A. connection service mounted and admitting ───────────────────────
{
  const seen = [];
  const b = await boot({
    requestRejection({ headers }) {
      seen.push(headers['x-token'] ?? '(none)');
      return headers['x-token'] === 'good' ? undefined : 401;
    },
  });
  const noToken = await fetch(b.base);
  check('A1 service rejects -> 401', noToken.status === 401);
  const body = await noToken.json();
  check('A2 401 body leaks no document', body.error === 'unauthorized' && !('notes' in body));

  const good = await fetch(b.base, { headers: { 'x-token': 'good' } });
  check('A3 service admits -> 200', good.status === 200);

  const put = await fetch(b.base, {
    method: 'PUT',
    headers: { 'x-token': 'good', 'content-type': 'application/json' },
    body: JSON.stringify({ notes: [{ id: 'a', date: '2026-11-16', text: 'via acl', color: 'mint' }] }),
  });
  check('A4 authenticated PUT -> 200', put.status === 200);
  const back = await (await fetch(b.base, { headers: { 'x-token': 'good' } })).json();
  check('A5 write round-trips', back.notes.length === 1 && back.notes[0].text === 'via acl');
  check('A6 service consulted every request', seen.length === 4);

  // A service that rejects must still let the local fence admit a genuine
  // same-origin browser call — that is the shipped bridge's contract: the
  // service is a shortcut, not a hard gate.
  const fb = await fetch(b.base, { headers: { 'sec-fetch-site': 'same-origin', origin: b.origin } });
  check('A7 rejected-by-service falls back to local fence (same-origin) -> 200', fb.status === 200);
  await b.close();
}

// ── B. service that throws: must not admit on the exception ──────────
{
  const b = await boot({ requestRejection() { throw new Error('boom'); } });
  const cross = await fetch(b.base, { headers: { 'sec-fetch-site': 'cross-site', origin: 'https://evil.example' } });
  check('B1 throwing service + cross-site -> 401', cross.status === 401);
  // A bare non-browser caller carries no same-origin marker, so the local fence
  // refuses it. This matches the shipped bridges, which require the marker.
  const plain = await fetch(b.base);
  check('B2 throwing service + bare caller -> 401 (no same-origin marker)', plain.status === 401);
  const marked = await fetch(b.base, { headers: { 'sec-fetch-site': 'same-origin', origin: b.origin } });
  check('B3 throwing service + same-origin marker -> 200', marked.status === 200);
  await b.close();
}

// ── C. no connection service: loopback fence ─────────────────────────
{
  const b = await boot(undefined);
  check('C1 bare caller -> 401 (no same-origin marker)', (await fetch(b.base)).status === 401);

  check('C2 cross-site -> 401',
    (await fetch(b.base, { headers: { 'sec-fetch-site': 'cross-site' } })).status === 401);

  check('C3 foreign origin -> 401',
    (await fetch(b.base, { headers: { origin: 'https://evil.example' } })).status === 401);

  check('C4 null origin -> 401',
    (await fetch(b.base, { headers: { origin: 'null' } })).status === 401);

  check('C5 same-origin -> 200',
    (await fetch(b.base, { headers: { 'sec-fetch-site': 'same-origin', origin: b.origin } })).status === 200);

  check('C6 same-site (not cross) with matching origin -> 200',
    (await fetch(b.base, { headers: { 'sec-fetch-site': 'same-site', origin: b.origin } })).status === 200);

  check('C7 forwarded host is not loopback-trusted -> 401',
    (await fetch(b.base, { headers: { 'x-forwarded-host': 'attacker.example' } })).status === 401);

  check('C8 browser auth cookie marker -> 200',
    (await fetch(b.base, { headers: { cookie: 'dsh-auth-abc=1' } })).status === 200);

  check('C9 unrelated cookie alone -> 401',
    (await fetch(b.base, { headers: { cookie: 'theme=dark' } })).status === 401);

  const put = await fetch(b.base, {
    method: 'PUT',
    headers: { 'sec-fetch-site': 'same-origin', 'content-type': 'application/json' },
    body: JSON.stringify({ notes: [{ id: 'z', date: '2026-11-17', text: 'local fence write', color: 'sky' }] }),
  });
  check('C10 same-origin PUT -> 200', put.status === 200);

  const crossPut = await fetch(b.base, {
    method: 'PUT', headers: { 'sec-fetch-site': 'cross-site', 'content-type': 'application/json' },
    body: JSON.stringify({ notes: [] }),
  });
  check('C11 cross-site PUT -> 401 (cannot wipe notes)', crossPut.status === 401);
  await b.close();
}

// ── D. the document on disk ──────────────────────────────────────────
{
  const parsed = JSON.parse(await readFile(join(home, 'memo-calendar', 'notes.json'), 'utf8'));
  check('D1 last accepted write persisted', parsed.notes.some((n) => n.text === 'local fence write'));
  check('D2 the cross-site wipe did not land', parsed.notes.length === 1);
}

await rm(home, { recursive: true, force: true });
console.log(`\n${ok.length} passed, ${bad.length} failed`);
if (bad.length) { console.log('failed:', bad.join(', ')); process.exit(1); }
console.log('ACL OK');