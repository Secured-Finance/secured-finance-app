import { useMemo } from 'react';
import { Maturity } from 'src/utils/entities';
import { ContractMap, LendingMarket } from '../useLendingMarkets';

const passThrough = () => true;
const emptyOption = {
    label: '',
    value: new Maturity(0),
};

export const useMaturityOptions = (
    lendingMarkets: ContractMap,
    filterFn: (market: LendingMarket) => unknown = passThrough
) => {
    return useMemo(() => {
        const optionList = Object.entries(lendingMarkets)
            .filter(o => filterFn(o[1]))
            .map(o => ({
                label: o[1].name,
                value: new Maturity(o[1].maturity),
            }));
        return optionList.length ? optionList : [emptyOption];
    }, [filterFn, lendingMarkets]);
};
