import { BigNumber } from 'ethers';
import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import useSF from 'src/hooks/useSecuredFinance';
import { AssetPriceMap, getPriceMap } from 'src/store/assetPrices/selectors';
import { amountFormatterFromBase, CurrencySymbol } from 'src/utils';
import { RootState } from '../../store/types';

const ZERO_BN = BigNumber.from('0');

export interface CollateralBook {
    collateral: Partial<Record<CurrencySymbol, BigNumber>>;
    usdCollateral: number;
    coverage: BigNumber;
}

const emptyBook: CollateralBook = {
    collateral: {
        [CurrencySymbol.ETH]: ZERO_BN,
        [CurrencySymbol.USDC]: ZERO_BN,
    },
    usdCollateral: 0,
    coverage: ZERO_BN,
};

export const useCollateralBook = (account: string | null) => {
    const [collateralBook, setCollateralBook] = useState(emptyBook);
    const securedFinance = useSF();

    const { ethBalance, usdcBalance } = useSelector(
        (state: RootState) => state.wallet
    );

    const priceList = useSelector((state: RootState) => getPriceMap(state));

    const getCollateralBook = useCallback(async () => {
        if (!securedFinance || !account) {
            return;
        }

        const { collateral, collateralCoverage } =
            await securedFinance.getCollateralBook(account);

        const { collateralBook, usdCollateral } = formatCollateral(
            collateral,
            priceList
        );

        setCollateralBook({
            collateral: collateralBook,
            usdCollateral: usdCollateral,
            coverage: collateralCoverage,
            // 0% collateral not used
            // 100% collateral used BigNumber(10000)
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        account,
        securedFinance,
        ethBalance,
        usdcBalance,
        priceList.ETH,
        priceList.USDC,
    ]);

    useEffect(() => {
        getCollateralBook();
        return () => {
            setCollateralBook(emptyBook);
        };
    }, [getCollateralBook]);

    return collateralBook;
};

const formatCollateral = (
    collateral: Record<string, BigNumber>,
    priceList: AssetPriceMap
) => {
    let collateralBook: Partial<Record<CurrencySymbol, BigNumber>> = {};
    let usdCollateral = 0;
    Object.keys(collateral).forEach((ccy: string) => {
        const currency = ccy as CurrencySymbol;
        collateralBook = {
            ...collateralBook,
            [currency]: collateral[ccy] ?? BigNumber.from(0),
        };
        usdCollateral +=
            amountFormatterFromBase[currency](collateral[currency]) *
            priceList[currency];
    });

    return {
        collateralBook,
        usdCollateral,
    };
};
