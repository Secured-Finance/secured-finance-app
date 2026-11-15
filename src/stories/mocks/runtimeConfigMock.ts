import { RuntimeConfig } from 'src/utils';

let runtimeConfig: RuntimeConfig = {};

// Sets the config served for NEXT_PUBLIC_RUNTIME_CONFIG_URL (see .env.test).
// Reset to an empty config after every test in setupTests.js.
export const mockRuntimeConfig = (config: RuntimeConfig) => {
    runtimeConfig = config;
};

export const resetRuntimeConfigMock = () => {
    runtimeConfig = {};
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
