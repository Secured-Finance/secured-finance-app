import { useBilateralPositionFromVault } from '@secured-finance/sf-graph-client';
import { useMemo, useState } from 'react';
import { DEFAULT_COLLATERAL_VAULT } from 'src/utils';

export const useBilateralCollateralPosition = (
    user: string,
    counterparty: string,
    ccyName: string
) => {
    const [bilateralPosition, setBilateralPosition] = useState({});

    const position = useBilateralPositionFromVault(
        DEFAULT_COLLATERAL_VAULT,
        user,
        counterparty,
        ccyName
    );

    useMemo(() => {
        if (position) {
            setBilateralPosition(position);
        }
    }, [position]);

    return bilateralPosition;
};
