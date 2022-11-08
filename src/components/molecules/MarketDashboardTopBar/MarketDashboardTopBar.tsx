import { useMemo, useState } from 'react';
import {
    DropdownSelector,
    MarketTab,
    Option,
    Separator,
} from 'src/components/atoms';
import { CurrencySymbol } from 'src/utils';

const getValue = (values: number[] | undefined, index: number) => {
    return values && values[index] ? values[index] : 0;
};

export const MarketDashboardTopBar = <TermType extends string = string>({
    asset,
    options,
    selected,
    transformLabel = (v: string) => v,
    onTermChange,
    values,
}: {
    asset: CurrencySymbol;
    options: Array<Option<TermType>>;
    selected: Option<TermType>;
    transformLabel?: (v: string) => string;
    onTermChange?: (v: TermType) => void;
    values?: number[];
}) => {
    const [termValue, setTermValue] = useState(selected.value);
    const selectedTerm = useMemo(
        () => options.find(o => o.value === termValue),
        [options, termValue]
    );

    const handleTermChange = (v: TermType) => {
        setTermValue(v);
        if (onTermChange) {
            onTermChange(v);
        }
    };

    return (
        <div className='h-fit w-full'>
            <div className='h-1 w-full bg-starBlue'></div>
            <div className='flex flex-row border-l border-r border-b border-white-10 bg-gradient-to-b from-[rgba(106,118,177,0.1)] via-[rgba(106,118,177,0)] to-black-20'>
                <div className='flex w-[350px] flex-col gap-1 px-6 pt-5 pb-7'>
                    <div className='flex h-fit flex-row items-center justify-between'>
                        <div className='typography-body-1 text-neutral-8'>
                            {`${asset}-${selectedTerm?.label}`}
                        </div>
                        <DropdownSelector
                            optionList={options}
                            onChange={handleTermChange}
                            variant='noLabel'
                            selected={selected}
                        />
                    </div>
                    <div className='typography-caption-2 text-neutral-4'>
                        {`Zero-coupon loan expires ${
                            selectedTerm && transformLabel(selectedTerm.label)
                        }`}
                    </div>
                </div>
                <Separator orientation='vertical' color='white-10'></Separator>
                <div className='flex flex-grow flex-row gap-6 pt-6 pb-8 pl-10'>
                    <MarketTab name={0.7977} value={'25.00% APY'} />
                    <Separator orientation='vertical' color='neutral-2' />
                    <MarketTab name='24h High' value={getValue(values, 0)} />
                    <Separator orientation='vertical' color='neutral-2' />
                    <MarketTab name='24h Low' value={getValue(values, 1)} />
                    <Separator orientation='vertical' color='neutral-2' />
                    <MarketTab name='24h Trades' value={getValue(values, 2)} />
                    <Separator orientation='vertical' color='neutral-2' />
                    <MarketTab name='24h Volume' value={getValue(values, 3)} />
                </div>
            </div>
        </div>
    );
};
