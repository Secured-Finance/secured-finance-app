import { SecuredFinanceClient } from '@secured-finance/sf-client';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateLendingMarketContract } from 'src/store/availableContracts';
import { RootState } from 'src/store/types';
import { CurrencySymbol, getCurrencyMapAsList, toCurrency } from 'src/utils';
import { isPastDate } from 'src/utils/date';

export type LendingMarket = {
    name: string;
    maturity: number;
    isActive: boolean;
    utcOpeningDate: number;
    midUnitPrice: number;
};
export type ContractMap = Record<string, LendingMarket>;

export const useLendingMarkets = (
    securedFinance: SecuredFinanceClient | undefined
) => {
    const block = useSelector(
        (state: RootState) => state.blockchain.latestBlock
    );
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchLendingMarkets = async (ccy: CurrencySymbol) => {
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
                                        utcOpeningDate,
                                        midUnitPrice,
                                    }
                                ) => {
                                    if (acc[name]) {
                                        // If the name already exists in the accumulator
                                        // Increment the name by appending a number
                                        let i = 1;
                                        while (acc[`${name}-${i}`]) {
                                            i++;
                                        }
                                        name = `${name}-${i}`;
                                    }

                                    return {
                                        ...acc,
                                        [name]: {
                                            name,
                                            maturity,
                                            utcOpeningDate,
                                            isActive:
                                                isPastDate(utcOpeningDate),
                                            midUnitPrice:
                                                midUnitPrice.toNumber(),
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
