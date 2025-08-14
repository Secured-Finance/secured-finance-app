import { z } from 'zod';

// Minimal environment schema: validate presence and basic types.
// Keep this small; add keys as needed. This does not generate values, only checks.
export const EnvSchema = z.object({
    NEXT_PUBLIC_GRAPHQL_SERVER_URL: z.string().url(),
    NEXT_PUBLIC_SUPPORTED_CHAIN_IDS: z
        .string()
        .min(1)
        .transform(s => s.split(',').map(n => parseInt(n.trim(), 10))),
    NEXT_PUBLIC_WALLET_CONNECT_ID: z.string().min(1),
    NEXT_PUBLIC_ALCHEMY_API_KEY: z.string().optional(),
    NEXT_PUBLIC_ANKR_API_KEY: z.string().optional(),
    NEXT_PUBLIC_AMPLITUDE_API_KEY: z.string().optional(),
    NEXT_PUBLIC_GOOGLE_ANALYTICS_TAG: z.string().optional(),
    NEXT_PUBLIC_STABLECOIN_APP_URL: z.string().url(),
    NEXT_PUBLIC_SHOW_STABLECOIN_APP_URL: z
        .enum(['true', 'false'])
        .default('false')
        .transform(v => v === 'true'),
    NEXT_PUBLIC_USE_PACKAGE_VERSION: z
        .enum(['true', 'false'])
        .default('false')
        .transform(v => v === 'true'),
    NEXT_PUBLIC_REFERRAL_MESSAGE: z.string().optional(),
    NEXT_PUBLIC_SUBGRAPH_URL_314: z.string().url().optional(),
    SF_ENV: z
        .enum(['development', 'staging', 'production'])
        .default('development'),
    COMMIT_HASH: z.string().optional(),
});

export type Env = z.infer<typeof EnvSchema> & {
    NEXT_PUBLIC_SUPPORTED_CHAIN_IDS: number[];
};

export function parseEnv(input: NodeJS.ProcessEnv): Env {
    const result = EnvSchema.safeParse(input);
    if (!result.success) {
        // Flatten and print helpful messages, fail fast
        const errors = result.error.flatten().fieldErrors;
        // eslint-disable-next-line no-console
        console.error('Invalid environment variables:', errors);
        throw new Error('Environment validation failed. See errors above.');
    }
    return result.data as Env;
}


