// Content Security Policy for the app, rendered as a <meta> tag by _document.tsx.
//
// Production is served from IPFS through Filebase, which cannot set response
// headers, so the page has to carry the policy itself. A meta tag cannot carry
// frame-ancestors, report-uri or sandbox: framing protection still needs a
// response header (public/_headers sets it on Cloudflare previews).
//
// The browser blocks every host that is not listed here. When the app starts
// talking to a new service, add its host to the matching group below. There is
// no report-only mode for a meta policy, so check the console on a preview.
//
// This file is not exported from src/utils/index.ts on purpose: only
// _document.tsx needs it.

// https://docs.reown.com/advanced/security/content-security-policy
const WALLET_CONNECT_CONNECT = [
    'https://rpc.walletconnect.com',
    'https://rpc.walletconnect.org',
    'https://relay.walletconnect.com',
    'https://relay.walletconnect.org',
    'wss://relay.walletconnect.com',
    'wss://relay.walletconnect.org',
    'https://pulse.walletconnect.com',
    'https://pulse.walletconnect.org',
    'https://api.web3modal.com',
    'https://api.web3modal.org',
    'https://keys.walletconnect.com',
    'https://keys.walletconnect.org',
    'https://notify.walletconnect.com',
    'https://notify.walletconnect.org',
    'https://echo.walletconnect.com',
    'https://echo.walletconnect.org',
    'https://push.walletconnect.com',
    'https://push.walletconnect.org',
];

const WALLET_CONNECT_FRAMES = [
    'https://verify.walletconnect.com',
    'https://verify.walletconnect.org',
    'https://secure.walletconnect.com',
    'https://secure.walletconnect.org',
];

// Coinbase Wallet SDK, bundled with the wallet modal
const COINBASE_WALLET = [
    'https://*.coinbase.com',
    'https://www.walletlink.org',
    'wss://www.walletlink.org',
];

// Keyed RPC providers used in _app.tsx. The public fallback RPC of each
// supported chain is passed in through `rpcUrls`.
const RPC_PROVIDERS = ['https://*.g.alchemy.com', 'https://rpc.ankr.com'];

// Subgraph hosts used by @secured-finance/sf-graph-client
const SUBGRAPHS = [
    'https://api.studio.thegraph.com',
    'https://api.goldsky.com',
];

const ANALYTICS = [
    'https://*.amplitude.com',
    'https://*.google-analytics.com',
    'https://*.analytics.google.com',
    'https://*.googletagmanager.com',
];

const SQUID_WIDGET = 'https://studio.squidrouter.com';

// SHA-256 of the empty string
const EMPTY_SHA256 = '47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU=';

export type ContentSecurityPolicyOptions = {
    // next dev needs eval for fast refresh and talks to localhost
    isDevelopment: boolean;
    // Public RPC endpoints of the supported chains
    rpcUrls: string[];
    // Endpoints set through env (points API, custom subgraph, ...)
    serviceUrls: (string | undefined)[];
    // Base64 SHA-256 hashes of the inline scripts the app renders
    inlineScriptHashes: string[];
};

const toOrigin = (url: string | undefined) => {
    if (!url) return undefined;
    try {
        const { protocol, origin } = new URL(url);
        return ['https:', 'wss:'].includes(protocol) ? origin : undefined;
    } catch {
        return undefined;
    }
};

const unique = (sources: (string | undefined)[]) =>
    Array.from(new Set(sources.filter((s): s is string => !!s)));

export const buildContentSecurityPolicy = ({
    isDevelopment,
    rpcUrls,
    serviceUrls,
    inlineScriptHashes,
}: ContentSecurityPolicyOptions): string => {
    const directives: Record<string, (string | undefined)[]> = {
        'default-src': ["'self'"],
        'script-src': [
            "'self'",
            ...inlineScriptHashes.map(hash => `'sha256-${hash}'`),
            'https://*.googletagmanager.com',
            isDevelopment ? "'unsafe-eval'" : undefined,
        ],
        'style-src': [
            "'self'",
            "'unsafe-inline'",
            'https://fonts.googleapis.com',
        ],
        'font-src': [
            "'self'",
            'https://fonts.gstatic.com',
            'https://fonts.reown.com',
        ],
        'img-src': ["'self'", 'data:', 'blob:', 'https:'],
        'connect-src': [
            "'self'",
            'data:',
            'blob:',
            'https://*.secured.finance',
            ...serviceUrls.map(toOrigin),
            ...RPC_PROVIDERS,
            ...rpcUrls.map(toOrigin),
            ...SUBGRAPHS,
            ...WALLET_CONNECT_CONNECT,
            ...COINBASE_WALLET,
            ...ANALYTICS,
            ...(isDevelopment
                ? ['http://localhost:*', 'ws://localhost:*']
                : []),
        ],
        'frame-src': ["'self'", SQUID_WIDGET, ...WALLET_CONNECT_FRAMES],
        // The wallet modal renders buttons with an empty ontouchstart=""
        // attribute. This allows an empty inline handler and nothing else.
        'script-src-attr': ["'unsafe-hashes'", `'sha256-${EMPTY_SHA256}'`],
        'worker-src': ["'self'", 'blob:'],
        'object-src': ["'none'"],
        'base-uri': ["'self'"],
        'form-action': ["'self'"],
    };

    return Object.entries(directives)
        .map(([name, sources]) => `${name} ${unique(sources).join(' ')}`)
        .join('; ');
};
