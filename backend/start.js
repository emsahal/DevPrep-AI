const { spawnSync } = require('child_process');

const DEFAULT_URL = 'postgresql://neondb_owner:npg_54FlNBLxqQOf@ep-bitter-water-ayoiadpq-pooler.c-5.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

function sanitizeUrl(raw) {
  if (!raw || typeof raw !== 'string' || !raw.trim()) {
    return DEFAULT_URL;
  }
  let url = raw.trim();
  // Strip wrapping quotes
  url = url.replace(/^["'`]|["'`]$/g, '').trim();
  // Strip accidental key prefix
  url = url.replace(/^DATABASE_URL=\s*/i, '').trim();
  // Strip all invisible carriage returns, newlines, tabs
  url = url.replace(/[\r\n\t]/g, '');
  // Fix spaces around delimiters
  url = url.replace(/\s*@\s*/g, '@')
           .replace(/:\s+/g, ':')
           .replace(/\s+:/g, ':')
           .replace(/\s+\//g, '/')
           .replace(/\/\s+/g, '/');

  // Verify protocol
  if (!url.startsWith('postgresql://') && !url.startsWith('postgres://')) {
    console.warn('[Warning] Provided DATABASE_URL does not start with postgresql://. Using default Neon DB.');
    return DEFAULT_URL;
  }
  return url;
}

const rawUrl = process.env.DATABASE_URL || '';
const sanitized = sanitizeUrl(rawUrl);

console.log('=== Database Initialization ===');
console.log('Using database URL host:', sanitized.split('@')[1]?.split('/')[0] || 'unknown');
process.env.DATABASE_URL = sanitized;

console.log('Synchronizing database schema with Prisma...');
const push = spawnSync('npx', ['prisma', 'db', 'push', '--accept-data-loss'], {
  stdio: 'inherit',
  shell: true,
  env: process.env,
});

if (push.status !== 0) {
  console.warn('Prisma schema sync finished with exit code:', push.status);
  console.log('Continuing to server startup...');
}

console.log('Starting application server...');
const server = spawnSync('node', ['dist/server.js'], {
  stdio: 'inherit',
  shell: true,
  env: process.env,
});

process.exit(server.status ?? 0);
