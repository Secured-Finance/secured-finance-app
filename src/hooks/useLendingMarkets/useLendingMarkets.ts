import { SecuredFinanceClient } from '@secured-finance/sf-client';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateLendingMarketContract } from 'src/store/availableContracts';
import { RootState } from 'src/store/types';
import { CurrencySymbol, toCurrency } from 'src/utils';

export type ContractMap = Record<string, number>;

export const useLendingMarkets = (
    ccy: CurrencySymbol,
    securedFinance: SecuredFinanceClient | undefined
) => {
    const block = useSelector(
        (state: RootState) => state.blockchain.latestBlock
    );
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchLendingMarkets = async () => {
            try {
                const lendingMarkets = await securedFinance?.getLendingMarkets(
                    toCurrency(ccy)
                );

                if (lendingMarkets && lendingMarkets.length !== 0) {
                    dispatch(
                        updateLendingMarketContract(
                            lendingMarkets.reduce<ContractMap>(
                                (acc, { name, maturity }) => ({
                                    ...acc,
                                    [name]: maturity,
                                }),
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

        fetchLendingMarkets();
    }, [ccy, securedFinance, block, dispatch]);
};
