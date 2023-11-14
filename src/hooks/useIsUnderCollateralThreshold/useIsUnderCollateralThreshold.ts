import { OrderSide } from '@secured-finance/sf-client';
import { UserAccount } from 'src/types';
import { CurrencySymbol } from 'src/utils';
import { useMarket } from '../useLendingMarkets';
import { usePositions } from '../usePositions';

export const useIsUnderCollateralThreshold = (
    address: UserAccount,
    currency: CurrencySymbol,
    maturity: number,
    price: number,
    side: OrderSide
) => {
    const market = useMarket(currency, maturity);
    const { data: position } = usePositions(address, [currency]);

    if (!market || !address) return false;
    if (side === OrderSide.LEND) return false;

    return (
        price < market.currentMinDebtUnitPrice &&
        (market.isPreOrderPeriod || // show warning if pre-order period whatever the user position
            (!market.isPreOrderPeriod &&
                position?.lendCurrencies.has(currency)))
    );
};
