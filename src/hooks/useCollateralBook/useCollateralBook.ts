import { BigNumber } from 'bignumber.js';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import useSF from 'src/hooks/useSecuredFinance';
import { getAssetPrice } from 'src/store/assetPrices/selectors';
import { selectEthereumBalance } from 'src/store/ethereumWallet';
import { CurrencySymbol } from 'src/utils';
import { RootState } from '../../store/types';

const ZERO_BN = new BigNumber('0');

export interface CollateralBook {
    ccyName: string;
    collateral: BigNumber;
    usdCollateral: BigNumber;
    coverage: BigNumber;
}

const emptyBook: CollateralBook = {
    ccyName: 'ETH',
    collateral: ZERO_BN,
    usdCollateral: ZERO_BN,
    coverage: ZERO_BN,
};

export const useCollateralBook = (
    account: string | null,
    ccy = CurrencySymbol.ETH
) => {
    const [collateralBook, setCollateralBook] = useState(emptyBook);
    const securedFinance = useSF();
    const ethPrice = useSelector((state: RootState) =>
        getAssetPrice(CurrencySymbol.ETH)(state)
    );
    const balance = useSelector((state: RootState) =>
        selectEthereumBalance(state)
    );
    useEffect(() => {
        if (!securedFinance || !account) {
            return;
        }

        // TODO: this is not taking care of what are really those numbers. This needs to be fixed
        const getCollateralBook = async () => {
            const { collateralAmount, collateralCoverage } = {
                collateralAmount: '0',
                collateralCoverage: '0',
            };

            setCollateralBook({
                ccyName: ccy,
                collateral: new BigNumber(collateralAmount.toString()),
                usdCollateral: new BigNumber(
                    collateralAmount.toString()
                ).multipliedBy(ethPrice),
                coverage: new BigNumber(collateralCoverage.toString()),
                // 0% collateral not used
                // 100% collateral used BigNumber(10000)
            });
        };
        getCollateralBook();
    }, [account, ccy, securedFinance, ethPrice, balance]);

    return collateralBook;
};
