import { getCollateralVaultAddressByCcy } from '@secured-finance/sf-client/dist/utils';
import { useCollateralBookFromVault } from '@secured-finance/sf-graph-client';
import { BigNumber } from 'bignumber.js';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/types';

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

export const useCollateralBook = (
    account: string | undefined,
    chainId: number | undefined,
    ccy = 'ETH'
) => {
    const ethPrice = useSelector(
        (state: RootState) => state.assetPrices.ethereum.price
    );

    const userAccount = useMemo(() => {
        if (account) {
            return account;
        } else {
            return '';
        }
    }, [account]);

    const chainIdNumber = useMemo(() => {
        if (chainId) {
            return chainId;
        } else {
            return 1;
        }
    }, [chainId]);

    const vault = getCollateralVaultAddressByCcy(ccy, chainIdNumber);
    const { data, error } = useCollateralBookFromVault(vault, userAccount);

    if (error) {
        console.error(error);
    }

    if (data?.collateralBooks) {
        const book = data?.collateralBooks[0];
        const ethPriceBN = new BigNumber(ethPrice);

        const colBook: CollateralBook = {
            ccyIndex: 0,
            ccyName: book.currency.shortName,
            collateral: new BigNumber(book.independentCollateral),
            usdCollateral: new BigNumber(
                book.independentCollateral
            ).multipliedBy(ethPriceBN),
            vault: book.vault.address,
            locked: new BigNumber(book.lockedCollateral),
            usdLocked: new BigNumber(book.lockedCollateral).multipliedBy(
                ethPriceBN
            ),
        };
        return colBook;
    }

    return emptyBook;
};
