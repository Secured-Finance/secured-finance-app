import { Token } from '@secured-finance/sf-core';
import { useQueries } from '@tanstack/react-query';
import { BigNumber } from 'ethers';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { QueryKeys } from 'src/hooks/queries';
import useSF from 'src/hooks/useSecuredFinance';
import { RootState } from 'src/store/types';
import {
    CurrencySymbol,
    ZERO_BN,
    amountFormatterFromBase,
    getCurrencyMapAsList,
} from 'src/utils';

export const zeroBalances = {
    [CurrencySymbol.ETH]: 0,
    [CurrencySymbol.WFIL]: 0,
    [CurrencySymbol.USDC]: 0,
    [CurrencySymbol.WBTC]: 0,
};

export const useERC20Balance = (address: string | undefined) => {
    const securedFinance = useSF();
    const tokens = useMemo(
        () => getCurrencyMapAsList().filter(ccy => ccy.toCurrency().isToken),
        []
    );

    return useQueries({
        queries: tokens.map(token => {
            return {
                queryKey: [QueryKeys.TOKEN_BALANCE, token.symbol, address],
                queryFn: async () => {
                    const balance = await securedFinance?.getERC20Balance(
                        token.toCurrency() as Token,
                        address ?? ''
                    );
                    return balance ?? ZERO_BN;
                },
                select: (balance: BigNumber) => {
                    return [
                        token.symbol,
                        amountFormatterFromBase[token.symbol](balance),
                    ];
                },
                enabled: !!securedFinance && !!address,
            };
        }),
    });
};

export const useBalances = () => {
    const balances: Record<CurrencySymbol, number> = { ...zeroBalances };

    const { address, ethBalance } = useSelector(
        (state: RootState) => state.wallet
    );

    const balanceQueriesResults = useERC20Balance(address);
    balances[CurrencySymbol.ETH] = ethBalance;
    balanceQueriesResults.forEach(value => {
        if (value.data) {
            balances[value.data[0] as CurrencySymbol] = value.data[1] as number;
        }
    });

    return balances;
};

export const useCollateralBalances = () => {
    const result: Partial<Record<CurrencySymbol, number>> = {};
    const balances = useBalances();

    const collateralCurrencies = useMemo(
        () => getCurrencyMapAsList().filter(ccy => ccy.isCollateral),
        []
    );
    collateralCurrencies.forEach(
        ccy => (result[ccy.symbol] = balances[ccy.symbol])
    );

    return result;
};
