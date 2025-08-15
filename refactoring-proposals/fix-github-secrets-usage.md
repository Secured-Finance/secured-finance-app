# GitHub Secrets vs Variables Usage Policy

## Current Pattern (Actually Consistent!)

The current usage follows a clear policy:

**In secrets:**

- ALCHEMY_API_KEY (API key)
- AMPLITUDE_API_KEY (API key)
- ANKR_API_KEY (API key)
- SQUID_WIDGET_INTEGRATOR_ID (API integration ID)

**In vars:**

- GOOGLE_ANALYTICS_TAG (public tracking ID)
- GRAPHQL_SERVER_URL (public endpoint)
- SUPPORTED_CHAIN_IDS (configuration)
- All other non-sensitive config

## The Policy

**Use `secrets` for:**

- API keys (even if domain-restricted)
- Integration tokens/IDs that could be abused
- Anything that looks like a credential

**Use `vars` for:**

- Public URLs and endpoints
- Feature flags (true/false)
- Chain IDs and network config
- Display messages
- Public tracking IDs (like GA)

## Why This Makes Sense

Even though `NEXT_PUBLIC_*` variables are visible in the browser:

1. **Security theater matters** - API keys in logs look unprofessional
2. **Defense in depth** - Domain restriction + hidden from logs
3. **Audit compliance** - Many orgs require API keys in secrets
4. **Clear intent** - Marks them as "sensitive" even if public

## Exception: Google Analytics

GOOGLE_ANALYTICS_TAG is in `vars` (not `secrets`) because:

- It's meant to be public (appears in HTML)
- Not an API key, just a tracking ID
- No rate limits or abuse potential

## Note on COMMIT_HASH

COMMIT_HASH should NOT be in:

- `.env` files
- `envSchema.ts` validation
- GitHub secrets/variables

It's auto-generated at build time in `next.config.js` from git history.
