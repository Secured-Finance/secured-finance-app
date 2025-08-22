import { useQuery } from '@tanstack/react-query';
import { useCollateralCurrencies, useLastPrices } from 'src/hooks';
import { QueryKeys } from 'src/hooks/queries';
import useSF from 'src/hooks/useSecuredFinance';
import { AssetPriceMap } from 'src/types';
import {
    CollateralCalculator,
    CurrencySymbol,
    ZERO_BI,
    amountFormatterFromBase,
    currencyMap,
    divide,
    toCurrency,
} from 'src/utils';

export interface CollateralBook {
    collateral: Partial<Record<CurrencySymbol, bigint>>;
    nonCollateral: Partial<Record<CurrencySymbol, bigint>>;
    withdrawableCollateral: Partial<Record<CurrencySymbol, bigint>>;
    usdCollateral: number;
    usdAvailableToBorrow: number;
    usdNonCollateral: number;
    coverage: number;
    collateralThreshold: number;
    totalPresentValue: number;
}

const DIVIDER = 100000000;

export const emptyCollateralBook: CollateralBook = {
    collateral: {
        [CurrencySymbol.ETH]: ZERO_BI,
        [CurrencySymbol.USDC]: ZERO_BI,
        [CurrencySymbol.WBTC]: ZERO_BI,
    },
    nonCollateral: {
        [CurrencySymbol.WFIL]: ZERO_BI,
        [CurrencySymbol.axlFIL]: ZERO_BI,
    },
    withdrawableCollateral: {
        [CurrencySymbol.USDC]: ZERO_BI,
        [CurrencySymbol.ETH]: ZERO_BI,
        [CurrencySymbol.WBTC]: ZERO_BI,
    },
    usdCollateral: 0,
    usdAvailableToBorrow: 0,
    usdNonCollateral: 0,
    coverage: 0,
    collateralThreshold: 0,
    totalPresentValue: 0,
};

const emptyCollateralValues = {
    collateral: {
        [CurrencySymbol.ETH]: ZERO_BI,
        [CurrencySymbol.USDC]: ZERO_BI,
        [CurrencySymbol.WBTC]: ZERO_BI,
        [CurrencySymbol.WFIL]: ZERO_BI,
        [CurrencySymbol.axlFIL]: ZERO_BI,
    },
    collateralCoverage: ZERO_BI,
    totalCollateralAmount: ZERO_BI,
    totalUnusedCollateralAmount: ZERO_BI,
};

const emptyCollateralParameters = {
    liquidationThresholdRate: ZERO_BI,
    liquidationProtocolFeeRate: ZERO_BI,
    liquidatorFeeRate: ZERO_BI,
};

export const useCollateralBook = (account: string | undefined) => {
    const securedFinance = useSF();

    const { data: collateralCurrencyList = [] } = useCollateralCurrencies();
    const { data: priceList } = useLastPrices();

    return useQuery({
        queryKey: [QueryKeys.COLLATERAL_BOOK, account, collateralCurrencyList],
        queryFn: async () => {
            const [
                collateralValues,
                collateralParameters,
                totalPresentValue,
                withdrawableCollateral,
            ] = await Promise.all([
                securedFinance?.tokenVault.getCollateralBook(account ?? ''),
                securedFinance?.tokenVault.getCollateralParameters(),
                securedFinance?.getTotalPresentValueInBaseCurrency(
                    account ?? ''
                ),
                await Promise.all(
                    collateralCurrencyList.map(async ccy => {
                        const withdrawableCollateral =
                            await securedFinance?.tokenVault.getWithdrawableCollateral(
                                toCurrency(ccy),
                                account ?? ''
                            );
                        return {
                            [ccy]: withdrawableCollateral ?? ZERO_BI,
                        };
                    })
                ),
            ]);

            return {
                collateralValues: collateralValues ?? emptyCollateralValues,
                collateralParameters:
                    collateralParameters ?? emptyCollateralParameters,
                withdrawableCollateral: withdrawableCollateral,
                totalPresentValue: totalPresentValue ?? 0,
            };
        },
        select: data => {
            const { collateralBook, nonCollateralBook, usdNonCollateral } =
                formatCollateral(data.collateralValues.collateral, priceList);

            const collateralThreshold =
                CollateralCalculator.calculateCollateralThreshold(
                    data.collateralParameters.liquidationThresholdRate
                );

            const withdrawableCollateral: CollateralBook['withdrawableCollateral'] =
                data.withdrawableCollateral.reduce((acc, obj) => ({
                    ...acc,
                    ...obj,
                }));
            const usdCollateral = divide(
                data.collateralValues.totalCollateralAmount,
                DIVIDER,
                8
            );
            const usdUnusedCollateral = divide(
                data.collateralValues.totalUnusedCollateralAmount,
                DIVIDER,
                8
            );
            const coverage = data.collateralValues.collateralCoverage;

            const colBook: CollateralBook = {
                collateral: collateralBook,
                nonCollateral: nonCollateralBook,
                usdCollateral: usdCollateral,
                usdAvailableToBorrow:
                    CollateralCalculator.calculateAvailableToBorrow(
                        usdCollateral,
                        usdUnusedCollateral,
                        coverage,
                        collateralThreshold
                    ),
                usdNonCollateral: usdNonCollateral,
                coverage: CollateralCalculator.toNumber(coverage),
                collateralThreshold: collateralThreshold,
                withdrawableCollateral: withdrawableCollateral,
                totalPresentValue: divide(data.totalPresentValue, DIVIDER, 8),
            };

            return colBook;
        },
        enabled:
            !!securedFinance && !!account && collateralCurrencyList.length > 0,
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
