import { useBilateralPositionFromVault } from '@secured-finance/sf-graph-client';
import { useMemo, useState } from 'react';
import { DEFAULT_COLLATERAL_VAULT } from 'src/utils';

export const useBilateralCollateralPosition = (
    user: string,
    counterparty: string,
    ccyName: string
) => {
    const [bilateralPosition, setBilateralPosition] = useState({});

    const { data, error } = useBilateralPositionFromVault(
        DEFAULT_COLLATERAL_VAULT,
        user,
        counterparty,
        ccyName
    );

    if (error) {
        console.error(error);
    }

    useMemo(() => {
        if (data?.collateralVaultPosition) {
            setBilateralPosition(data.collateralVaultPosition);
        }
    }, [data]);

    return bilateralPosition;
};
