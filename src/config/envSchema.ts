import { z } from 'zod';

// Environment schema: validates environment variables at runtime.
// Order matches .env file structure for consistency.
export const EnvSchema = z.object({
    // ============ Core Configuration ============
    SF_ENV: z
        .enum(['development', 'staging', 'production'])
        .default('development'),

    // Blockchain Networks
    NEXT_PUBLIC_SUPPORTED_CHAIN_IDS: z
        .string()
        .min(1)
        .transform(s => s.split(',').map(n => parseInt(n.trim(), 10))),
    NEXT_PUBLIC_NON_SUBGRAPH_SUPPORTED_CHAIN_IDS: z
        .string()
        .optional()
        .transform(s =>
            s ? s.split(',').map(n => parseInt(n.trim(), 10)) : []
        ),

    // ============ API Endpoints ============
    NEXT_PUBLIC_GRAPHQL_SERVER_URL: z.string().url(),
    NEXT_PUBLIC_STABLECOIN_APP_URL: z.string().url(),

    // ============ Required API Keys ============
    NEXT_PUBLIC_WALLET_CONNECT_ID: z.string().min(1),

    // ============ Feature Flags ============
    NEXT_PUBLIC_USE_PACKAGE_VERSION: z
        .enum(['true', 'false'])
        .default('false')
        .transform(v => v === 'true'),
    NEXT_PUBLIC_SHOW_STABLECOIN_APP_URL: z
        .enum(['true', 'false'])
        .default('false')
        .transform(v => v === 'true'),
    NEXT_PUBLIC_REFERRAL_MESSAGE: z.string().optional(),

    // ============ Production-Injected API Keys ============
    // RPC Providers
    NEXT_PUBLIC_ALCHEMY_API_KEY: z.string().optional(),
    NEXT_PUBLIC_ANKR_API_KEY: z.string().optional(),

    // Analytics
    NEXT_PUBLIC_GOOGLE_ANALYTICS_TAG: z.string().optional(),
    NEXT_PUBLIC_AMPLITUDE_API_KEY: z.string().optional(),

    // Third-party Integrations
    NEXT_PUBLIC_SQUID_WIDGET_INTEGRATOR_ID: z.string().optional(),
    NEXT_PUBLIC_SUBGRAPH_URL_314: z.string().url().optional(),
});

export type Env = z.infer<typeof EnvSchema> & {
    NEXT_PUBLIC_SUPPORTED_CHAIN_IDS: number[];
    NEXT_PUBLIC_NON_SUBGRAPH_SUPPORTED_CHAIN_IDS?: number[];
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
