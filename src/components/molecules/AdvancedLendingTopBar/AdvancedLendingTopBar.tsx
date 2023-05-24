import { useCallback } from 'react';
import {
    GradientBox,
    MarketTab,
    Option,
    Separator as SeparatorAtom,
} from 'src/components/atoms';
import { HorizontalAssetSelector } from 'src/components/molecules';
import { setCurrency } from 'src/store/landingOrderForm';
import { IndexOf } from 'src/types';
import { COIN_GECKO_SOURCE, CurrencySymbol, currencyMap } from 'src/utils';
import { LoanValue } from 'src/utils/entities';
import { formatLoanValue } from 'src/utils';

type ValueField = number | string;
type AdvancedLendingTopBarProp<T> = {
    selectedAsset: Option<CurrencySymbol> | undefined;
    assetList: Array<Option<CurrencySymbol>>;
    options: Array<Option<T>>;
    selected: Option<T>;
    onAssetChange?: (v: CurrencySymbol) => void;
    onTermChange?: (v: T) => void;
    lastTradeLoan?: LoanValue;
    values?: [ValueField, ValueField, ValueField, ValueField, ValueField];
};

const getValue = (
    values: AdvancedLendingTopBarProp<unknown>['values'],
    index: IndexOf<NonNullable<AdvancedLendingTopBarProp<unknown>['values']>>
) => {
    return values && values[index] ? values[index] : 0;
};

const Separator = () => (
    <SeparatorAtom orientation='vertical' color='neutral-2' />
);

export const AdvancedLendingTopBar = <T extends string = string>({
    selectedAsset,
    assetList,
    options,
    selected,
    onAssetChange,
    onTermChange,
    lastTradeLoan,
    values,
}: AdvancedLendingTopBarProp<T>) => {
    const handleTermChange = useCallback(
        (v: T) => {
            onTermChange?.(v);
        },
        [onTermChange]
    );

    const handleAssetChange = useCallback(
        (v: CurrencySymbol) => {
            setCurrency(v);
            onAssetChange?.(v);
        },
        [onAssetChange]
    );

    const lastTradePrice = lastTradeLoan
        ? Number(formatLoanValue(lastTradeLoan, 'price'))
        : 0.0;
    const lastTradeRate = lastTradeLoan
        ? `${formatLoanValue(lastTradeLoan, 'rate')} APR`
        : '0.00 % APR';

    return (
        <GradientBox shape='rectangle'>
            <div className='flex min-w-full flex-row items-stretch justify-between gap-6 px-6 py-3'>
                <div className='pr-5'>
                    <HorizontalAssetSelector
                        selectedAsset={selectedAsset}
                        assetList={assetList}
                        options={options}
                        selected={selected}
                        onAssetChange={handleAssetChange}
                        onTermChange={handleTermChange}
                    />
                </div>

                <MarketTab name={lastTradePrice} value={lastTradeRate} />
                <Separator />
                <MarketTab name='24h High' value={getValue(values, 0)} />
                <Separator />
                <MarketTab name='24h Low' value={getValue(values, 1)} />
                <Separator />
                <MarketTab name='24h Trades' value={getValue(values, 2)} />
                <Separator />
                <MarketTab name='24h Volume' value={getValue(values, 3)} />
                <Separator />
                <MarketTab
                    name={`${selectedAsset?.value} Price`}
                    value={getValue(values, 4)}
                    source={handleSource(selectedAsset?.value)}
                />
            </div>
        </GradientBox>
    );
};

const handleSource = (asset: CurrencySymbol | undefined) =>
    asset && COIN_GECKO_SOURCE.concat(currencyMap[asset].coinGeckoId);
