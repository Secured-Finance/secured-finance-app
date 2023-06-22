import { OrderSide, WalletSource } from '@secured-finance/sf-client';
import queries from '@secured-finance/sf-graph-client/dist/graphclients';
import { OrderStatus } from '@secured-finance/sf-graph-client/dist/graphclients/development/.graphclient';
import { BigNumber, ContractTransaction } from 'ethers';
import { Option } from 'src/components/atoms';
import { Maturity } from 'src/utils/entities';
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
    amount: BigNumber,
    unitPrice: number,
    sourceWallet: WalletSource
) => Promise<ContractTransaction | undefined>;

type UserHistoryQuery = Awaited<
    ReturnType<
        Awaited<ReturnType<typeof queries.getBuiltGraphSDK>['UserHistory']>
    >
>;
type DailyVolumesQuery = Awaited<
    ReturnType<
        Awaited<ReturnType<typeof queries.getBuiltGraphSDK>['DailyVolumes']>
    >
>;

export type TradesQuery = Awaited<
    ReturnType<Awaited<ReturnType<typeof queries.getBuiltGraphSDK>['Trades']>>
>;

type User = NonNullable<UserHistoryQuery['user']>;
export type OrderList = User['orders'];
export type Order = OrderList[0];
export type TradeHistory = User['transactions'];
export type DailyVolumes = DailyVolumesQuery['dailyVolumes'];
export type Trades = TradesQuery['transactions'];

export interface ColorFormat {
    color?: 'neutral' | 'positive' | 'negative';
}

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

export const Filled: OrderStatus = 'Filled';
export const Open: OrderStatus = 'Open';
export const PartiallyFilled: OrderStatus = 'PartiallyFilled';
export const Cancelled: OrderStatus = 'Cancelled';
export const Expired: OrderStatus = 'Expired';
