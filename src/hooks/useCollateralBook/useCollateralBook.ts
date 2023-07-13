import { BigNumber } from 'ethers';
import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import useSF from 'src/hooks/useSecuredFinance';
import { AssetPriceMap, getPriceMap } from 'src/store/assetPrices/selectors';
import { selectAllBalances } from 'src/store/wallet';
import {
    CurrencySymbol,
    amountFormatterFromBase,
    currencyMap,
    getCurrencyMapAsList,
    toCurrency,
} from 'src/utils';
import { RootState } from '../../store/types';

const ZERO_BN = BigNumber.from('0');

export interface CollateralBook {
    collateral: Partial<Record<CurrencySymbol, BigNumber>>;
    nonCollateral: Partial<Record<CurrencySymbol, BigNumber>>;
    withdrawableCollateral: Partial<Record<CurrencySymbol, BigNumber>>;
    usdCollateral: number;
    usdNonCollateral: number;
    coverage: BigNumber;
    collateralThreshold: number;
    fetched: boolean;
}

const emptyBook: CollateralBook = {
    collateral: {
        [CurrencySymbol.ETH]: ZERO_BN,
        [CurrencySymbol.USDC]: ZERO_BN,
    },
    nonCollateral: {
        [CurrencySymbol.EFIL]: ZERO_BN,
        [CurrencySymbol.WBTC]: ZERO_BN,
    },
    withdrawableCollateral: {
        [CurrencySymbol.USDC]: ZERO_BN,
        [CurrencySymbol.ETH]: ZERO_BN,
    },
    usdCollateral: 0,
    usdNonCollateral: 0,
    coverage: ZERO_BN,
    collateralThreshold: 0,
    fetched: false,
};

export const useCollateralBook = (account: string | undefined) => {
    const [collateralBook, setCollateralBook] = useState(emptyBook);
    const securedFinance = useSF();

    const { ETH: ethBalance, USDC: usdcBalance } = useSelector(
        (state: RootState) => selectAllBalances(state)
    );

    const priceList = useSelector((state: RootState) => getPriceMap(state));

    const getCollateralBook = useCallback(async () => {
        if (!securedFinance || !account) {
            return;
        }

        const { collateral, collateralCoverage } =
            await securedFinance.getCollateralBook(account);

        const { liquidationThresholdRate } =
            await securedFinance.getCollateralParameters();

        const getWithdrawableCollateral = async () => {
            let withdrawableCollateral: Partial<
                Record<CurrencySymbol, BigNumber>
            > = {};
            const currencyList = getCurrencyMapAsList().filter(
                ccy => ccy.isCollateral
            );

            await Promise.all(
                currencyList.map(async currencyInfo => {
                    const ccy = currencyInfo.symbol;
                    const collateral =
                        await securedFinance.getWithdrawableCollateral(
                            toCurrency(ccy),
                            account
                        );

                    withdrawableCollateral = {
                        ...withdrawableCollateral,
                        [ccy]: collateral,
                    };
                })
            );
            return withdrawableCollateral;
        };

        const collateralThreshold =
            liquidationThresholdRate && !liquidationThresholdRate.isZero()
                ? 1000000 / liquidationThresholdRate.toNumber()
                : 0;

        const {
            collateralBook,
            nonCollateralBook,
            usdCollateral,
            usdNonCollateral,
        } = formatCollateral(collateral, priceList);

        setCollateralBook({
            collateral: collateralBook,
            nonCollateral: nonCollateralBook,
            usdCollateral: usdCollateral,
            usdNonCollateral: usdNonCollateral,
            coverage: collateralCoverage,
            collateralThreshold: collateralThreshold,
            withdrawableCollateral: await getWithdrawableCollateral(),
            fetched: true,

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
    }, [getCollateralBook]);

    return collateralBook;
};

const formatCollateral = (
    collateral: Record<string, BigNumber>,
    priceList: AssetPriceMap
) => {
    let collateralBook: CollateralBook['collateral'] = {};
    let nonCollateralBook: CollateralBook['nonCollateral'] = {};
    let usdCollateral = 0;
    let usdNonCollateral = 0;
    Object.keys(collateral).forEach((ccy: string) => {
        const currency = ccy as CurrencySymbol;
        const amount = collateral[ccy];
        const usdValue =
            amountFormatterFromBase[currency](amount) * priceList[currency];

        if (currencyMap[currency].isCollateral) {
            collateralBook = {
                ...collateralBook,
                [currency]: amount,
            };
            usdCollateral += usdValue;
        } else {
            nonCollateralBook = {
                ...nonCollateralBook,
                [currency]: amount,
            };
            usdNonCollateral += usdValue;
        }
    });

    return {
        collateralBook,
        nonCollateralBook,
        usdCollateral,
        usdNonCollateral,
    };
};
