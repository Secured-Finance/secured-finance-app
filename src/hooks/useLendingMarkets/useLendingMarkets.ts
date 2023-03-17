import { SecuredFinanceClient } from '@secured-finance/sf-client';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateLendingMarketContract } from 'src/store/availableContracts';
import { RootState } from 'src/store/types';
import { CurrencySymbol, getCurrencyMapAsList, toCurrency } from 'src/utils';
import { isPastDate } from 'src/utils/date';

type Market = {
    name: string;
    maturity: number;
    isActive: boolean;
    utcOpeningDate: number;
};
export type ContractMap = Record<string, Market>;

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
                    console.log('lendingMarkets', lendingMarkets);
                    dispatch(
                        updateLendingMarketContract(
                            lendingMarkets.reduce<ContractMap>(
                                (acc, { name, maturity, utcOpeningDate }) => {
                                    return {
                                        ...acc,
                                        [name]: {
                                            name,
                                            maturity,
                                            utcOpeningDate,
                                            isActive:
                                                isPastDate(utcOpeningDate),
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
