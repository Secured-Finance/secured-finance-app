import assert from 'assert';

export const setUpSecuredFinanceSkd = () => {
    const NEXT_PUBLIC_ETHEREUM_NETWORK =
        process.env.NEXT_PUBLIC_ETHEREUM_NETWORK;
    assert(
        NEXT_PUBLIC_ETHEREUM_NETWORK,
        'NEXT_PUBLIC_ETHEREUM_NETWORK is not set'
    );

    return NEXT_PUBLIC_ETHEREUM_NETWORK;
};
