import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { QueryKeys } from 'src/hooks/queries';
import useSF from 'src/hooks/useSecuredFinance';
import { AssetPriceMap, getPriceMap } from 'src/store/assetPrices/selectors';
import { RootState } from 'src/store/types';
import {
    CurrencySymbol,
    ZERO_BI,
    amountFormatterFromBase,
    currencyMap,
    getCurrencyMapAsList,
    toCurrency,
} from 'src/utils';

export interface CollateralBook {
    collateral: Partial<Record<CurrencySymbol, bigint>>;
    nonCollateral: Partial<Record<CurrencySymbol, bigint>>;
    withdrawableCollateral: Partial<Record<CurrencySymbol, bigint>>;
    usdCollateral: number;
    usdNonCollateral: number;
    coverage: bigint;
    collateralThreshold: number;
}

export const emptyCollateralBook: CollateralBook = {
    collateral: {
        [CurrencySymbol.ETH]: ZERO_BI,
        [CurrencySymbol.USDC]: ZERO_BI,
        [CurrencySymbol.WBTC]: ZERO_BI,
    },
    nonCollateral: {
        [CurrencySymbol.WFIL]: ZERO_BI,
    },
    withdrawableCollateral: {
        [CurrencySymbol.USDC]: ZERO_BI,
        [CurrencySymbol.ETH]: ZERO_BI,
        [CurrencySymbol.WBTC]: ZERO_BI,
    },
    usdCollateral: 0,
    usdNonCollateral: 0,
    coverage: ZERO_BI,
    collateralThreshold: 0,
};

const emptyCollateralValues = {
    collateral: {
        [CurrencySymbol.ETH]: ZERO_BI,
        [CurrencySymbol.USDC]: ZERO_BI,
        [CurrencySymbol.WBTC]: ZERO_BI,
        [CurrencySymbol.WFIL]: ZERO_BI,
    },
    collateralCoverage: ZERO_BI,
};

const emptyCollateralParameters = {
    liquidationThresholdRate: ZERO_BI,
    liquidationProtocolFeeRate: ZERO_BI,
    liquidatorFeeRate: ZERO_BI,
};

export const useCollateralBook = (account: string | undefined) => {
    const securedFinance = useSF();

    const collateralCurrencyList = useMemo(
        () => getCurrencyMapAsList().filter(ccy => ccy.isCollateral),
        []
    );

    const priceList = useSelector((state: RootState) => getPriceMap(state));

    return useQuery({
        queryKey: [QueryKeys.COLLATERAL_BOOK, account],
        queryFn: async () => {
            const [
                collateralValues,
                collateralParameters,
                withdrawableCollateral,
            ] = await Promise.all([
                securedFinance?.getCollateralBook(account ?? ''),
                securedFinance?.getCollateralParameters(),
                await Promise.all(
                    collateralCurrencyList.map(async currencyInfo => {
                        const ccy = currencyInfo.symbol;
                        const withdrawableCollateral =
                            await securedFinance?.getWithdrawableCollateral(
                                toCurrency(ccy),
                                account ?? ''
                            );
                        return { [ccy]: withdrawableCollateral ?? ZERO_BI };
                    })
                ),
            ]);

            return {
                collateralValues: collateralValues ?? emptyCollateralValues,
                collateralParameters:
                    collateralParameters ?? emptyCollateralParameters,
                withdrawableCollateral: withdrawableCollateral,
            };
        },
        select: data => {
            const {
                collateralBook,
                nonCollateralBook,
                usdCollateral,
                usdNonCollateral,
            } = formatCollateral(data.collateralValues.collateral, priceList);

            const liquidationThresholdRate = Number(
                data.collateralParameters.liquidationThresholdRate
            );
            const collateralThreshold =
                liquidationThresholdRate === 0
                    ? 0
                    : 1000000 / liquidationThresholdRate;

            const withdrawableCollateral: CollateralBook['withdrawableCollateral'] =
                data.withdrawableCollateral.reduce((acc, obj) => ({
                    ...acc,
                    ...obj,
                }));

            const colBook: CollateralBook = {
                collateral: collateralBook,
                nonCollateral: nonCollateralBook,
                usdCollateral: usdCollateral,
                usdNonCollateral: usdNonCollateral,
                coverage: data.collateralValues.collateralCoverage,
                collateralThreshold: collateralThreshold,
                withdrawableCollateral: withdrawableCollateral,
            };

            return colBook;
        },
        enabled: !!securedFinance && !!account,
    });
};

const formatCollateral = (
    collateral: Record<string, bigint>,
    priceList: AssetPriceMap
) => {
    let collateralBook: CollateralBook['collateral'] = {};
    let nonCollateralBook: CollateralBook['nonCollateral'] = {};
    let usdCollateral = 0;
    let usdNonCollateral = 0;
    Object.keys(collateral)
        .sort(
            (a, b) =>
                currencyMap[a as CurrencySymbol].index -
                currencyMap[b as CurrencySymbol].index
        )
        .forEach((ccy: string) => {
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
