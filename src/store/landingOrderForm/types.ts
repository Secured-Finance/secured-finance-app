import { OrderSide, WalletSource } from '@secured-finance/sf-client';
import { ViewType } from 'src/components/atoms';
import { OrderType } from 'src/types';
import { CurrencySymbol } from 'src/utils';

export interface LandingOrderFormStore {
    currency: CurrencySymbol;
    maturity: number;
    side: OrderSide;
    amount: string;
    unitPrice: string | undefined;
    orderType: OrderType;
    lastView: ViewType;
    sourceAccount: WalletSource;
    isBorrowedCollateral: boolean;
}

export const defaultLandingOrderFormStore: LandingOrderFormStore = {
    currency: CurrencySymbol.USDC,
    maturity: 0,
    side: OrderSide.LEND,
    amount: '',
    unitPrice: undefined,
    orderType: OrderType.MARKET,
    lastView: 'Advanced',
    sourceAccount: WalletSource.SF_VAULT,
    isBorrowedCollateral: false,
};
