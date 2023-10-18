import { CurrencyOption } from 'src/components/molecules';
import { getCurrencyMapAsList } from './currencyList';

export const getCurrencyMapAsOptions = () => {
    return getCurrencyMapAsList().map<CurrencyOption>(({ symbol }) => ({
        value: symbol,
        label: symbol,
    }));
};
