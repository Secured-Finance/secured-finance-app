// Operational config fetched at runtime from NEXT_PUBLIC_RUNTIME_CONFIG_URL.
// It is the only source for these values: anything missing, blank or not yet
// loaded resolves to an empty string, and empty values render nothing.
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

// Trimmed so a whitespace-only value counts as empty and renders nothing
const pickString = (value: unknown) =>
    typeof value === 'string' ? value.trim() : undefined;

const pickAlert = (value: unknown) => {
    if (!isObject(value)) return undefined;
    return { message: pickString(value.message), link: pickString(value.link) };
};

// Drops any field with an unexpected type so a malformed file can't break the UI
export const parseRuntimeConfig = (raw: unknown): RuntimeConfig => {
    if (!isObject(raw)) return {};

    const pauseAlert = isObject(raw.pauseAlert)
        ? { message: pickString(raw.pauseAlert.message) }
        : undefined;

    return {
        incidentAlert: pickAlert(raw.incidentAlert),
        reopeningAlert: pickAlert(raw.reopeningAlert),
        pauseAlert,
        referralMessage: pickString(raw.referralMessage),
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
