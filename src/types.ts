import { OrderSide } from '@secured-finance/sf-client';
import { UserHistoryQuery } from '@secured-finance/sf-graph-client/dist/graphclient';

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
    unitPrice?: number
) => Promise<ContractTransaction | undefined>;

type User = NonNullable<UserHistoryQuery['user']>;
export type OrderList = User['orders'];
export type TradeHistory = User['transactions'];

export interface ColorFormat {
    color?: 'neutral' | 'positive' | 'negative';
}

export type IndexOf<T extends unknown[]> = Exclude<
    keyof T,
    keyof unknown[]
> extends `${infer I extends number}`
    ? I
    : never;
