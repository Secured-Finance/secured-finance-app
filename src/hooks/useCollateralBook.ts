import { getCollateralVaultAddressByCcy } from '@secured-finance/sf-client/dist/utils';
import { useCollateralBookFromVault } from '@secured-finance/sf-graph-client';
import { BigNumber } from 'bignumber.js';
import { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useWallet } from 'use-wallet';
import { RootState } from '../store/types';

const ZERO_BN = new BigNumber('0');

export interface CollateralBook {
    ccyIndex: number;
    ccyName: string;
    collateral: BigNumber;
    usdCollateral: BigNumber;
    vault: string;
    locked?: BigNumber;
    usdLocked?: BigNumber;
    borrowed?: BigNumber;
    usdBorrowed?: BigNumber;
}

const emptyBook: CollateralBook = {
    ccyIndex: 0,
    ccyName: 'ETH',
    collateral: ZERO_BN,
    usdCollateral: ZERO_BN,
    vault: '',
    locked: ZERO_BN,
    usdLocked: ZERO_BN,
    borrowed: ZERO_BN,
    usdBorrowed: ZERO_BN,
};

const useCollateralBook = (account: string, ccy = 'ETH') => {
    const [collateralBook, setCollateralBook] =
        useState<CollateralBook>(emptyBook);
    const ethPrice = useSelector(
        (state: RootState) => state.assetPrices.ethereum.price
    );
    const { chainId }: { chainId: number | null } = useWallet();
    const vault = getCollateralVaultAddressByCcy(ccy, chainId);
    const { data, error } = useCollateralBookFromVault(vault, account) as any;

    if (error) {
        console.error(error);
    }

    useMemo(() => {
        if (data) {
            const ethPriceBN = new BigNumber(ethPrice);

            const colBook: CollateralBook = {
                ccyIndex: 0,
                ccyName: data.currency.shortName,
                collateral: new BigNumber(data.independentCollateral),
                usdCollateral: new BigNumber(
                    data.independentCollateral
                ).multipliedBy(ethPriceBN),
                vault: data.vault.address,
                locked: new BigNumber(data.lockedCollateral),
                usdLocked: new BigNumber(data.lockedCollateral).multipliedBy(
                    ethPriceBN
                ),
            };
            setCollateralBook(colBook);
        }
    }, [data, ethPrice]);

    return collateralBook;
};

export default useCollateralBook;
