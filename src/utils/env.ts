import assert from 'assert';

export const getEnvVariable = <T extends string | number>(env: string) => {
    const value = process.env[env];
    assert(value, `${env} is not set`);
    if (!Number.isNaN(Number(value))) {
        return Number(value) as T;
    }
    return value as T;
};

export const getRpcEndpoint = () => {
    const NEXT_PUBLIC_ETHEREUM_NETWORK =
        process.env.NEXT_PUBLIC_ETHEREUM_NETWORK;
    const NEXT_PUBLIC_ALCHEMY_API_KEY = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY;
    assert(
        NEXT_PUBLIC_ETHEREUM_NETWORK,
        'NEXT_PUBLIC_ETHEREUM_NETWORK is not set'
    );
    assert(
        NEXT_PUBLIC_ALCHEMY_API_KEY,
        'NEXT_PUBLIC_ALCHEMY_API_KEY is not set'
    );

    return `https://eth-${NEXT_PUBLIC_ETHEREUM_NETWORK}.g.alchemy.com/v2/${NEXT_PUBLIC_ALCHEMY_API_KEY}`;
};
