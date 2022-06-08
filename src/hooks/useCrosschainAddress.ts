import { useCrosschainAddressById } from '@secured-finance/sf-graph-client';
import { CrosschainAddress } from '@secured-finance/sf-graph-client/dist/generated';
import { useMemo, useState } from 'react';
import { getCurrencyBy } from 'src/utils';

export const useCrosschainAddressByChainId = (user: string, ccy: string) => {
    const [crosschainAddress, setCrosschainAddress] =
        useState<CrosschainAddress>();

    const currency = getCurrencyBy('shortName', ccy);

    const { data, error } = useCrosschainAddressById(user, currency.chainId);

    if (error) {
        console.error(error);
    }

    useMemo(() => {
        if (data) {
            setCrosschainAddress(data);
        }
    }, [data]);

    return crosschainAddress;
};
