import { OrderSide, WalletSource } from '@secured-finance/sf-client';
import { ViewType } from 'src/components/atoms';
import { OrderType } from 'src/types';
import { CurrencySymbol } from 'src/utils';
import { dec22Fixture } from './fixtures';

export const initialStore = {
    blockchain: {
        chainId: 11155111,
        chainError: false,
        testnetEnabled: true,
        isChainIdDetected: true,
        latestBlock: 0,
        lastActionTimestamp: 0,
    },
    landingOrderForm: {
        currency: CurrencySymbol.WFIL,
        maturity: dec22Fixture.toNumber(),
        side: OrderSide.BORROW,
        amount: '',
        unitPrice: undefined as string | undefined,
        orderType: OrderType.MARKET,
        lastView: 'Simple' as ViewType,
        sourceAccount: WalletSource.SF_VAULT,
        isBorrowedCollateral: false,
    },
    wallet: {
        address: '0x1',
        balance: '0',
    },
    lastError: { lastMessage: null },
    ui: { walletDialogOpen: false },
};

export const mockStore = { getState: () => initialStore };
