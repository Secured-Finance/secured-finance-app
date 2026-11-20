// A <meta> CSP cannot use report-uri or report-to, so violations would only
// show up in users' consoles. This listener forwards them to analytics.
// Only the origin of the blocked resource is sent: full URLs can carry
// wallet addresses or other user data in the path or query.

export type CspViolation = {
    directive: string;
    blocked: string;
    source: string;
};

const MAX_REPORTS_PER_PAGE = 10;

const toOrigin = (uri: string) => {
    if (!uri) return 'unknown';
    // 'inline', 'eval', 'data', 'blob' and similar keywords are kept as is
    if (!uri.includes('://')) return uri;
    try {
        return new URL(uri).origin;
    } catch {
        return 'invalid';
    }
};

export const toCspViolation = (
    event: Pick<
        SecurityPolicyViolationEvent,
        'effectiveDirective' | 'violatedDirective' | 'blockedURI' | 'sourceFile'
    >
): CspViolation => ({
    directive: event.effectiveDirective || event.violatedDirective,
    blocked: toOrigin(event.blockedURI),
    source: toOrigin(event.sourceFile),
});

export const reportCspViolations = (
    track: (violation: CspViolation) => void,
    target: Pick<
        Document,
        'addEventListener' | 'removeEventListener'
    > = document
) => {
    const seen = new Set<string>();

    const onViolation = (event: SecurityPolicyViolationEvent) => {
        const violation = toCspViolation(event);
        const key = `${violation.directive} ${violation.blocked}`;
        if (seen.has(key) || seen.size >= MAX_REPORTS_PER_PAGE) return;
        seen.add(key);
        track(violation);
    };

    target.addEventListener('securitypolicyviolation', onViolation);
    return () =>
        target.removeEventListener('securitypolicyviolation', onViolation);
};
