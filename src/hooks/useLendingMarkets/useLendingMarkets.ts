import { SecuredFinanceClient } from '@secured-finance/sf-client';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateLendingMarketContract } from 'src/store/availableContracts';
import { RootState } from 'src/store/types';
import { CurrencySymbol, getCurrencyMapAsList, toCurrency } from 'src/utils';
import { isPastDate } from 'src/utils/date';

const PRE_OPEN_TIME = 60 * 60 * 48 * 1000; // 2 days

export type LendingMarket = {
    name: string;
    maturity: number;
    isActive: boolean;
    utcOpeningDate: number;
    midUnitPrice: number;
    preOpenDate: number;
    openingUnitPrice: number;
    isReady: boolean;
    isOpened: boolean;
    isMatured: boolean;
    isPreOrderPeriod: boolean;
    isItayosePeriod: boolean;
};
export type ContractMap = Record<number, LendingMarket>;

export const useLendingMarkets = (
    securedFinance: SecuredFinanceClient | undefined
) => {
    const block = useSelector(
        (state: RootState) => state.blockchain.latestBlock
    );
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchLendingMarkets = async (ccy: CurrencySymbol) => {
            const names: string[] = [];
            try {
                const lendingMarkets = await securedFinance?.getLendingMarkets(
                    toCurrency(ccy)
                );

                if (lendingMarkets && lendingMarkets.length !== 0) {
                    dispatch(
                        updateLendingMarketContract(
                            lendingMarkets.reduce<ContractMap>(
                                (
                                    acc,
                                    {
                                        name,
                                        maturity,
                                        openingDate,
                                        midUnitPrice,
                                        openingUnitPrice,
                                        isReady,
                                        isOpened,
                                        isMatured,
                                        isPreOrderPeriod,
                                        isItayosePeriod,
                                    }
                                ) => {
                                    if (names.includes(name)) {
                                        // If the name already exists in the accumulator
                                        // Increment the name by appending a number
                                        let i = 1;
                                        while (names.includes(`${name}-${i}`)) {
                                            i++;
                                        }
                                        name = `${name}-${i}`;
                                    }
                                    names.push(name);

                                    return {
                                        ...acc,
                                        [maturity.toNumber()]: {
                                            name,
                                            maturity: maturity.toNumber(),
                                            utcOpeningDate:
                                                openingDate.toNumber(),
                                            isActive: isPastDate(
                                                openingDate.toNumber()
                                            ),
                                            midUnitPrice:
                                                midUnitPrice.toNumber(),
                                            openingUnitPrice:
                                                openingUnitPrice.toNumber(),
                                            preOpenDate:
                                                openingDate.toNumber() -
                                                PRE_OPEN_TIME,
                                            isReady,
                                            isOpened,
                                            isMatured,
                                            isPreOrderPeriod,
                                            isItayosePeriod,
                                        },
                                    };
                                },
                                {}
                            ),

                            ccy
                        )
                    );
                }
            } catch (e) {
                console.error(e);
            }
        };
        for (const currency of getCurrencyMapAsList()) {
            fetchLendingMarkets(currency.symbol);
        }
    }, [securedFinance, block, dispatch]);
};
