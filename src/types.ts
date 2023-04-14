import { OrderSide, WalletSource } from '@secured-finance/sf-client';
import queries from '@secured-finance/sf-graph-client/dist/graphclients';
import { BigNumber, ContractTransaction } from 'ethers';
import { Option } from 'src/components/atoms';
import { Maturity } from 'src/utils/entities';
import { CurrencySymbol } from './utils';

export type MaturityOptionList = Option<Maturity>[];

export type PlaceOrderFunction = (
    ccy: CurrencySymbol,
    maturity: Maturity,
    side: OrderSide,
    amount: BigNumber,
    sourceWallet: WalletSource,
    unitPrice?: number
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
export type TradeHistory = User['transactions'];
export type DailyVolumes = DailyVolumesQuery['dailyVolumes'];

export interface ColorFormat {
    color?: 'neutral' | 'positive' | 'negative';
}

export type IndexOf<T extends unknown[]> = Exclude<
    keyof T,
    keyof unknown[]
> extends `${infer I extends number}`
    ? I
    : never;
