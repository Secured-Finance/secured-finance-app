# Fix GitHub Secrets vs Variables Usage

## Current Issue

API keys are stored in GitHub Secrets even though they're exposed to the browser via `NEXT_PUBLIC_*` prefix. This is misleading.

## Current Usage (Incorrect)

**In secrets (should be vars):**
- ALCHEMY_API_KEY
- AMPLITUDE_API_KEY  
- ANKR_API_KEY
- SQUID_WIDGET_INTEGRATOR_ID

**In vars (correct):**
- GOOGLE_ANALYTICS_TAG
- GRAPHQL_SERVER_URL
- SUPPORTED_CHAIN_IDS
- etc.

## Recommendation

Move ALL `NEXT_PUBLIC_*` injected values to GitHub Variables (not Secrets) because:

1. They're visible in the browser anyway (NEXT_PUBLIC_ prefix)
2. Using "secrets" is misleading - implies they're hidden
3. Variables are easier to debug (visible in logs)
4. Clearer mental model: secrets = server-side only

## Migration Steps

In GitHub repository settings:

1. Copy values from Secrets to Variables:
   - ALCHEMY_API_KEY → Variables
   - AMPLITUDE_API_KEY → Variables
   - ANKR_API_KEY → Variables
   - SQUID_WIDGET_INTEGRATOR_ID → Variables

2. Update `.github/workflows/build.yml`:
   ```yaml
   # Change from:
   NEXT_PUBLIC_ALCHEMY_API_KEY=${{ secrets.ALCHEMY_API_KEY }}
   
   # To:
   NEXT_PUBLIC_ALCHEMY_API_KEY=${{ vars.ALCHEMY_API_KEY }}
   ```

3. Delete the old secrets after confirming vars work

## Note on COMMIT_HASH

COMMIT_HASH should NOT be in:
- `.env` files
- `envSchema.ts` validation
- GitHub secrets/variables

It's auto-generated at build time in `next.config.js` from git history.