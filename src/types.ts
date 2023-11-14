import { OrderSide, WalletSource } from '@secured-finance/sf-client';
import queries from '@secured-finance/sf-graph-client/dist/graphclients';
import { Option } from 'src/components/atoms';
import { Maturity } from 'src/utils/entities';
import { Hex } from 'viem';
import { useAccount } from 'wagmi';
import { CurrencySymbol } from './utils';

export type SvgIcon = React.ForwardRefExoticComponent<
    React.PropsWithoutRef<React.SVGProps<SVGSVGElement>> & {
        title?: string;
        titleId?: string;
    } & React.RefAttributes<SVGSVGElement>
>;

export type MaturityOptionList = Option<Maturity>[];

export type PlaceOrderFunction = (
    ccy: CurrencySymbol,
    maturity: Maturity,
    side: OrderSide,
    amount: bigint,
    unitPrice: number,
    sourceWallet: WalletSource
) => Promise<Hex | undefined>;

type UserOrderHistoryQuery = Awaited<
    ReturnType<
        Awaited<ReturnType<typeof queries.getBuiltGraphSDK>['UserOrderHistory']>
    >
>;

type UserTransactionHistoryQuery = Awaited<
    ReturnType<
        Awaited<
            ReturnType<
                typeof queries.getBuiltGraphSDK
            >['UserTransactionHistory']
        >
    >
>;
type DailyVolumesQuery = Awaited<
    ReturnType<
        Awaited<ReturnType<typeof queries.getBuiltGraphSDK>['DailyVolumes']>
    >
>;

type TransactionsQuery = Awaited<
    ReturnType<
        Awaited<
            ReturnType<typeof queries.getBuiltGraphSDK>['TransactionHistory']
        >
    >
>;

export type OrderHistoryList = NonNullable<
    UserOrderHistoryQuery['user']
>['orders'];
export type Order = OrderHistoryList[0];
export type TradeHistory = NonNullable<
    UserTransactionHistoryQuery['user']
>['transactions'];
export type DailyVolumes = DailyVolumesQuery['dailyVolumes'];
export type TransactionList = TransactionsQuery['transactionHistory'];

export interface ColorFormat {
    color?: 'neutral' | 'positive' | 'negative';
}

export type Alignment = 'left' | 'center' | 'right';

export type IndexOf<T extends unknown[]> = Exclude<
    keyof T,
    keyof unknown[]
> extends `${infer I extends number}`
    ? I
    : never;

export type MarketPhase = 'Closed' | 'PreOrder' | 'Itayose' | 'Open';

export enum OrderType {
    MARKET = 'Market',
    LIMIT = 'Limit',
}

export const OrderTypeOptions = [OrderType.LIMIT, OrderType.MARKET];

export const OrderSideMap = Object.freeze({
    [OrderSide.LEND]: 'Lend',
    [OrderSide.BORROW]: 'Borrow',
});

export type Wallet = 'MetaMask' | 'WalletConnect';

export type UserAccount = ReturnType<typeof useAccount>['address'];
