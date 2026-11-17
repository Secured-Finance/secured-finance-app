// Operational config fetched at runtime from NEXT_PUBLIC_RUNTIME_CONFIG_URL.
// It is the only source for these values: anything missing, blank or not yet
// loaded resolves to an empty string, and empty values render nothing.
// Use the hook's status to tell "not loaded" apart from "loaded and empty".
export type RuntimeConfig = {
    incidentAlert?: { message?: string; link?: string };
    reopeningAlert?: { message?: string; link?: string };
    pauseAlert?: { message?: string };
    referralMessage?: string;
};

export type ResolvedRuntimeConfig = {
    incidentAlert: { message: string; link: string };
    reopeningAlert: { message: string; link: string };
    pauseAlert: { message: string };
    referralMessage: string;
};

const FETCH_TIMEOUT_MS = 5000;

const isObject = (value: unknown): value is Record<string, unknown> =>
    typeof value === 'object' && value !== null && !Array.isArray(value);

const invalid = (field: string, expected: string) =>
    new Error(`Invalid runtime config: ${field} must be ${expected}`);

// An absent field resolves to empty. A field of the wrong type invalidates the
// whole config, so a malformed file is handled like a failed fetch.
const readObject = (value: unknown, field: string) => {
    if (value === undefined) return undefined;
    if (!isObject(value)) throw invalid(field, 'an object');
    return value;
};

// Trimmed so a whitespace-only value counts as empty and renders nothing
const readString = (value: unknown, field: string) => {
    if (value === undefined) return undefined;
    if (typeof value !== 'string') throw invalid(field, 'a string');
    return value.trim();
};

// Where the incident and reopening banners may link to. Add new ones here on purpose.
// Anyone can post on X and Medium (and get a <user>.medium.com subdomain), so those
// are limited to our own account and publication. pathPrefix is lowercase, no trailing slash.
const ALLOWED_LINKS: {
    host: string;
    subdomains?: boolean;
    pathPrefix?: string;
}[] = [
    { host: 'secured.finance', subdomains: true },
    { host: 'x.com', pathPrefix: '/secured_fi' },
    { host: 'twitter.com', pathPrefix: '/secured_fi' },
    { host: 'medium.com', pathPrefix: '/secured-finance' },
];

// Links come from a remote file, so only https links to the places above are kept.
// A rejected link is dropped and the banner still shows its message.
const pickLink = (raw: string | undefined) => {
    if (!raw) return raw;
    try {
        const url = new URL(raw);
        // user@host links are only there to mislead
        if (url.protocol !== 'https:' || url.username || url.password) {
            return undefined;
        }
        const host = url.hostname.toLowerCase();
        const path = url.pathname.toLowerCase();
        const allowed = ALLOWED_LINKS.some(
            ({ host: h, subdomains, pathPrefix }) =>
                (host === h || (!!subdomains && host.endsWith(`.${h}`))) &&
                (!pathPrefix ||
                    path === pathPrefix ||
                    path.startsWith(`${pathPrefix}/`))
        );
        return allowed ? url.href : undefined;
    } catch {
        return undefined;
    }
};

const readAlert = (value: unknown, field: string) => {
    const alert = readObject(value, field);
    if (!alert) return undefined;
    return {
        message: readString(alert.message, `${field}.message`),
        link: pickLink(readString(alert.link, `${field}.link`)),
    };
};

// Throws on a malformed file instead of dropping fields, so a bad value can't
// silently clear a notice such as the pause alert
export const parseRuntimeConfig = (raw: unknown): RuntimeConfig => {
    if (!isObject(raw)) throw invalid('the config', 'an object');

    const pauseAlert = readObject(raw.pauseAlert, 'pauseAlert');

    return {
        incidentAlert: readAlert(raw.incidentAlert, 'incidentAlert'),
        reopeningAlert: readAlert(raw.reopeningAlert, 'reopeningAlert'),
        pauseAlert: pauseAlert && {
            message: readString(pauseAlert.message, 'pauseAlert.message'),
        },
        referralMessage: readString(raw.referralMessage, 'referralMessage'),
    };
};

export const fetchRuntimeConfig = async (
    url: string
): Promise<RuntimeConfig> => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

    try {
        const response = await fetch(url, {
            cache: 'no-cache',
            signal: controller.signal,
        });
        if (!response.ok) {
            throw new Error(
                `Failed to fetch runtime config: ${response.status}`
            );
        }
        return parseRuntimeConfig(await response.json());
    } finally {
        clearTimeout(timeout);
    }
};

export const resolveRuntimeConfig = (
    remote?: RuntimeConfig
): ResolvedRuntimeConfig => ({
    incidentAlert: {
        message: remote?.incidentAlert?.message ?? '',
        link: remote?.incidentAlert?.link ?? '',
    },
    reopeningAlert: {
        message: remote?.reopeningAlert?.message ?? '',
        link: remote?.reopeningAlert?.link ?? '',
    },
    pauseAlert: {
        message: remote?.pauseAlert?.message ?? '',
    },
    referralMessage: remote?.referralMessage ?? '',
});
