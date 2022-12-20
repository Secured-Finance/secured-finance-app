import { OrderSide } from '@secured-finance/sf-client';
import {
    OrderHistoryQuery,
    TransactionHistoryQuery,
} from '@secured-finance/sf-graph-client/dist/graphclients';

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

export type Order = OrderHistoryQuery['orders'];
export type TradeHistory = TransactionHistoryQuery['transactions'];
