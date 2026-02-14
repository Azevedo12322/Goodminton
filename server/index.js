import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;
const DATA_DIR = process.env.DATA_PATH || path.join(process.cwd(), 'data');
const STATE_FILE = path.join(DATA_DIR, 'state.json');
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '';

app.use(express.json({ limit: '1mb' }));

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

const STORAGE_IS_PERSISTENT = process.env.DATA_PATH === '/data';

app.post('/api/admin/verify', (req, res) => {
  const raw = req.headers['x-admin-password'] || req.body?.password || '';
  const password = (typeof raw === 'string' ? raw : '').trim();
  const expected = (ADMIN_PASSWORD || '').trim();
  if (!expected) {
    return res.status(503).json({ error: 'Admin password not configured on server' });
  }
  if (password !== expected) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  res.json({ ok: true });
});

app.get('/api/state', (req, res) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  res.set('X-Storage-Persistent', STORAGE_IS_PERSISTENT ? 'true' : 'false');
  try {
    ensureDataDir();
    if (!fs.existsSync(STATE_FILE)) {
      return res.status(404).json({ error: 'No state file yet' });
    }
    const raw = fs.readFileSync(STATE_FILE, 'utf8');
    const data = JSON.parse(raw);
    res.json(data);
  } catch (err) {
    console.error('GET /api/state', err);
    res.status(500).json({ error: 'Failed to read state' });
  }
});

app.post('/api/state', (req, res) => {
  const raw = req.headers['x-admin-password'] || req.body?.adminPassword || '';
  const password = (typeof raw === 'string' ? raw : '').trim();
  const expected = (ADMIN_PASSWORD || '').trim();
  if (!expected || password !== expected) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const body = req.body?.tournament ?? req.body;
  if (!body || !Array.isArray(body.players) || !Array.isArray(body.matches)) {
    return res.status(400).json({ error: 'Invalid state: need players and matches arrays' });
  }
  body._serverSavedAt = new Date().toISOString();
  try {
    ensureDataDir();
    fs.writeFileSync(STATE_FILE, JSON.stringify(body, null, 2), 'utf8');
    res.json({ ok: true });
  } catch (err) {
    console.error('POST /api/state', err);
    res.status(500).json({ error: 'Failed to write state' });
  }
});

const distPath = path.join(__dirname, '..', 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT} (DATA_PATH=${DATA_DIR})`);
});
