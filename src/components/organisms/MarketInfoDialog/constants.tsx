import ETH from 'src/assets/icons/bonds/ETH.svg';
import FIL from 'src/assets/icons/bonds/FIL.svg';
import USDC from 'src/assets/icons/bonds/USDC.svg';
import WBTC from 'src/assets/icons/bonds/WBTC.svg';
import { CurrencySymbol } from 'src/utils';

export const mapCurrencyToIcon = (
    currency?: CurrencySymbol | undefined
): JSX.Element | undefined => {
    switch (currency) {
        case CurrencySymbol.USDC || CurrencySymbol.aUSDC:
            return <USDC />;
        case CurrencySymbol.ETH || CurrencySymbol.WETHe:
            return <ETH />;
        case CurrencySymbol.FIL ||
            CurrencySymbol.tFIL ||
            CurrencySymbol.WFIL ||
            CurrencySymbol.axlFIL ||
            CurrencySymbol.iFIL:
            return <FIL />;
        case CurrencySymbol.WBTC || CurrencySymbol.BTCb:
            return <WBTC />;
        default:
            return undefined;
    }
};
