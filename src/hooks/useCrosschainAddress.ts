import { useCrosschainAddressById } from '@secured-finance/sf-graph-client';
import { CrosschainAddress } from '@secured-finance/sf-graph-client/dist/.graphclient';
import { useMemo, useState } from 'react';
import { Currency, currencyMap } from 'src/utils';

export const useCrosschainAddressByChainId = (user: string, ccy: Currency) => {
    const [crosschainAddress, setCrosschainAddress] =
        useState<CrosschainAddress>();

    const currency = currencyMap[ccy];

    const { data, error } = useCrosschainAddressById(user, currency.chainId);

    if (error) {
        console.error(error);
    }

    useMemo(() => {
        if (data?.crosschainAddress) {
            setCrosschainAddress(
                data.crosschainAddress as unknown as CrosschainAddress
            );
        }
    }, [data]);

    return crosschainAddress;
};
