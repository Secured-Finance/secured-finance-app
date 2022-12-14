import { Side } from '@secured-finance/sf-client/dist/secured-finance-client';
import { BigNumber, ContractTransaction } from 'ethers';
import { Option } from 'src/components/atoms';
import { Maturity } from 'src/utils/entities';
import { CurrencySymbol } from './utils';

export type MaturityOptionList = Option<Maturity>[];

export type PlaceOrderFunction = (
    ccy: CurrencySymbol,
    maturity: Maturity,
    side: Side,
    amount: BigNumber,
    unitPrice: number
) => Promise<ContractTransaction | undefined>;
