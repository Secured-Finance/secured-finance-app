import { RuntimeConfig } from 'src/utils';

// Default runtime config for every story and test. Alerts are left out so they
// only render where a story or test sets one.
export const initialRuntimeConfig: RuntimeConfig = {
    referralMessage:
        'Join the @Secured_Fi Points Program!\n\nSign up through the link below and receive 50 points as a welcome gift!\n\n%URL%?ref=%REF%',
};

let runtimeConfig: RuntimeConfig = initialRuntimeConfig;

// Overrides fields of the config served for NEXT_PUBLIC_RUNTIME_CONFIG_URL (see .env.test).
// Reset to initialRuntimeConfig after every test in setupTests.js.
export const mockRuntimeConfig = (config: RuntimeConfig) => {
    runtimeConfig = { ...initialRuntimeConfig, ...config };
};

export const resetRuntimeConfigMock = () => {
    runtimeConfig = initialRuntimeConfig;
};

// Installed as global.fetch before every test in setupTests.js
export const runtimeConfigFetch = async (url: RequestInfo | URL) => {
    if (url !== process.env.NEXT_PUBLIC_RUNTIME_CONFIG_URL) {
        throw new Error(`Unexpected fetch in test: ${url}`);
    }
    return {
        ok: true,
        status: 200,
        json: async () => runtimeConfig,
    } as Response;
};
