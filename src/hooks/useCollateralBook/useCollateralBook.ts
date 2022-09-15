import { BigNumber } from 'bignumber.js';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import useSF from 'src/hooks/useSecuredFinance';
import { selectEthereumBalance } from 'src/store/ethereumWallet';
import { currencyMap, CurrencySymbol, toCurrency } from 'src/utils';
import { RootState } from '../../store/types';

const ZERO_BN = new BigNumber('0');

export interface CollateralBook {
    ccyIndex: number;
    ccyName: string;
    collateral: BigNumber;
    usdCollateral: BigNumber;
    locked: BigNumber;
    coverage: BigNumber;
}

const emptyBook: CollateralBook = {
    ccyIndex: 0,
    ccyName: 'ETH',
    collateral: ZERO_BN,
    usdCollateral: ZERO_BN,
    locked: ZERO_BN,
    coverage: ZERO_BN,
};

export const useCollateralBook = (
    account: string | null,
    ccy = CurrencySymbol.ETH
) => {
    const [collateralBook, setCollateralBook] = useState(emptyBook);
    const securedFinance = useSF();
    const ethPrice = useSelector(
        (state: RootState) => state.assetPrices.ethereum.price
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
            const { collateralAmount, collateralCoverage } =
                await securedFinance.getCollateralBook(
                    account,
                    toCurrency(ccy)
                );

            setCollateralBook({
                ccyIndex: currencyMap[ccy].indexCcy,
                ccyName: ccy,
                collateral: new BigNumber(collateralAmount.toString()),
                usdCollateral: new BigNumber(
                    collateralAmount.toString()
                ).multipliedBy(ethPrice),
                locked: new BigNumber(collateralCoverage.toString()),
                coverage: new BigNumber(collateralCoverage.toString()),
            });
        };
        getCollateralBook();
    }, [account, ccy, securedFinance, ethPrice, balance]);

    return collateralBook;
};
