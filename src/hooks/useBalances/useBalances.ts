import { useSelector } from 'react-redux';
import { RootState } from 'src/store/types';
import { CurrencySymbol } from 'src/utils';
import { useERC20Balance } from './useERC20Balance';

export const zeroBalances = {
    [CurrencySymbol.ETH]: 0,
    [CurrencySymbol.WFIL]: 0,
    [CurrencySymbol.USDC]: 0,
    [CurrencySymbol.WBTC]: 0,
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
