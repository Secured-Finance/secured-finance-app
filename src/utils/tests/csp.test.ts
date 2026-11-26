import { buildContentSecurityPolicy } from '../csp';

const options = {
    isNextDev: false,
    rpcUrls: [
        'https://eth.merkle.io',
        'https://api.node.glif.io/rpc/v1',
        'https://arb1.arbitrum.io/rpc',
    ],
    serviceUrls: ['https://point-api.secured.finance/graphql', undefined],
    inlineScriptHashes: ['abc123='],
};

const directive = (policy: string, name: string) => {
    const entry = policy.split('; ').find(d => d.startsWith(`${name} `));
    return entry ? entry.split(' ').slice(1) : [];
};

describe('buildContentSecurityPolicy', () => {
    const policy = buildContentSecurityPolicy(options);

    it('should only allow listed hosts in connect-src', () => {
        const sources = directive(policy, 'connect-src');

        expect(sources).not.toContain('https:');
        expect(sources).not.toContain('wss:');
        expect(sources).not.toContain('*');
        expect(sources).toContain("'self'");
    });

    it('should allow the rpc and service endpoints by origin', () => {
        const sources = directive(policy, 'connect-src');

        expect(sources).toContain('https://eth.merkle.io');
        expect(sources).toContain('https://api.node.glif.io');
        expect(sources).toContain('https://arb1.arbitrum.io');
        expect(sources).toContain('https://point-api.secured.finance');
        expect(sources).not.toContain('https://arb1.arbitrum.io/rpc');
        expect(sources).not.toContain('https://api.node.glif.io/rpc/v1');
    });

    it('should allow the wallet, subgraph and analytics hosts the app uses', () => {
        const sources = directive(policy, 'connect-src');

        expect(sources).toEqual(
            expect.arrayContaining([
                'https://*.g.alchemy.com',
                'https://rpc.ankr.com',
                'https://api.studio.thegraph.com',
                'https://api.goldsky.com',
                'wss://relay.walletconnect.org',
                'https://api.web3modal.org',
                'https://pulse.walletconnect.org',
                'wss://www.walletlink.org',
                'https://*.amplitude.com',
                'https://*.google-analytics.com',
            ])
        );
    });

    it('should not allow inline scripts or eval in production', () => {
        const sources = directive(policy, 'script-src');

        expect(sources).toContain("'self'");
        expect(sources).toContain("'sha256-abc123='");
        expect(sources).not.toContain("'unsafe-inline'");
        expect(sources).not.toContain("'unsafe-eval'");
    });

    it('should relax the policy for next dev only', () => {
        const dev = buildContentSecurityPolicy({
            ...options,
            isNextDev: true,
        });

        expect(directive(dev, 'script-src')).toContain("'unsafe-eval'");
        expect(directive(dev, 'connect-src')).toContain('ws://localhost:*');
        expect(directive(policy, 'connect-src')).not.toContain(
            'ws://localhost:*'
        );
    });

    it('should skip endpoints that are missing or not https', () => {
        const result = buildContentSecurityPolicy({
            ...options,
            rpcUrls: ['http://insecure.example.com', 'not a url'],
            serviceUrls: [undefined, ''],
        });
        const baseline = buildContentSecurityPolicy({
            ...options,
            rpcUrls: [],
            serviceUrls: [],
        });

        expect(directive(result, 'connect-src')).toEqual(
            directive(baseline, 'connect-src')
        );
    });

    it('should not list a source twice', () => {
        const sources = directive(policy, 'connect-src');

        expect(new Set(sources).size).toEqual(sources.length);
    });

    it('should leave out the directives a meta tag cannot carry', () => {
        expect(policy).not.toContain('frame-ancestors');
        expect(policy).not.toContain('report-uri');
        expect(directive(policy, 'sandbox')).toEqual([]);
    });

    it('should lock down frames, plugins, base and forms', () => {
        expect(directive(policy, 'frame-src')).toContain(
            'https://studio.squidrouter.com'
        );
        expect(directive(policy, 'object-src')).toEqual(["'none'"]);
        expect(directive(policy, 'base-uri')).toEqual(["'self'"]);
        expect(directive(policy, 'form-action')).toEqual(["'self'"]);
    });

    it('should load gtag.js only from www.googletagmanager.com', () => {
        const sources = directive(policy, 'script-src');

        expect(sources).toContain('https://www.googletagmanager.com');
        expect(sources).not.toContain('https://*.googletagmanager.com');
    });

    it('should upgrade insecure requests outside development', () => {
        const dev = buildContentSecurityPolicy({
            ...options,
            isNextDev: true,
        });

        expect(policy.split('; ')).toContain('upgrade-insecure-requests');
        expect(dev.split('; ')).not.toContain('upgrade-insecure-requests');
    });
});
