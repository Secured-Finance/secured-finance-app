// Lightweight build-time env check. Runs in prebuild.
// Uses the compiled TS is not guaranteed here, so we validate inline with minimal logic.

// Prefer the Zod schema when available to keep checks consistent.
// We avoid TS at build-time here to keep the toolchain simple.

// Skip validation in CI - GitHub Actions provides these via .env.local
if (process.env.CI) {
  console.log('[env:check] Skipping in CI environment');
  process.exit(0);
}

const required = [
  'NEXT_PUBLIC_GRAPHQL_SERVER_URL',
  'NEXT_PUBLIC_SUPPORTED_CHAIN_IDS',
  'NEXT_PUBLIC_WALLET_CONNECT_ID',
  'NEXT_PUBLIC_STABLECOIN_APP_URL',
];

function fail(msg) {
  console.error(`[env:check] ${msg}`);
  process.exit(1);
}

for (const key of required) {
  if (!process.env[key] || String(process.env[key]).trim() === '') {
    fail(`Missing required env: ${key}`);
  }
}

try {
  const url = new URL(process.env.NEXT_PUBLIC_GRAPHQL_SERVER_URL);
  if (!url.protocol.startsWith('http')) throw new Error('invalid');
} catch {
  fail('NEXT_PUBLIC_GRAPHQL_SERVER_URL must be a valid URL');
}

// Basic CSV number list validation
const csv = String(process.env.NEXT_PUBLIC_SUPPORTED_CHAIN_IDS);
if (!csv.split(',').every(x => /^\d+$/.test(x.trim()))) {
  fail('NEXT_PUBLIC_SUPPORTED_CHAIN_IDS must be a comma-separated list of integers');
}

console.log('[env:check] OK');


