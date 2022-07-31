import assert from 'assert';

export const setUpSecuredFinanceSkd = () => {
    const { NEXT_PUBLIC_ETHEREUM_NETWORK, SF_ENV } = process.env;
    assert(
        NEXT_PUBLIC_ETHEREUM_NETWORK,
        'NEXT_PUBLIC_ETHEREUM_NETWORK is not set'
    );

    return {
        network: NEXT_PUBLIC_ETHEREUM_NETWORK,
        sfEnv: SF_ENV,
    };
};
