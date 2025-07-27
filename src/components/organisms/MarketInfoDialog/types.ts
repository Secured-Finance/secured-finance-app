import { CurrentMarket, DailyMarketInfo, Volume24Hour } from 'src/types';
import { CurrencySymbol } from 'src/utils';
import { LoanValue } from 'src/utils/entities';

export interface MarketInfoDialogProps {
    isOpen: boolean;
    onClose: () => void;
    currency: CurrencySymbol;
    currentMarket?: CurrentMarket;
    currencyPrice: string;
    marketInfo?: DailyMarketInfo;
    volumeInfo?: Volume24Hour;
    lastLoanValue?: LoanValue;
}
