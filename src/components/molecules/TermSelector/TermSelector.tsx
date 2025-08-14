import { useMemo, useState } from 'react';
import { DropdownSelector, Option } from 'src/components/atoms';

export const TermSelector = <T extends string = string>({
    options,
    selected,
    transformLabel = (v: string) => v,
    onTermChange,
}: {
    options: Array<Option<T>>;
    selected: Option<T>;
    transformLabel?: (v: string) => string;
    onTermChange?: (v: T) => void;
}) => {
    const [termValue, setTermValue] = useState(selected.value);
    const selectedTerm = useMemo(
        () => options.find(o => o.value === termValue),
        [options, termValue],
    );

    const handleTermChange = (v: T) => {
        setTermValue(v);
        if (onTermChange) {
            onTermChange(v);
        }
    };

    return (
        <div className='flex flex-col space-y-1'>
            <div className='typography-caption-2 ml-2 text-secondary7'>
                Maturity
            </div>
            <div className='flex h-14 flex-row items-center justify-between rounded-lg bg-black-20 p-2 ring-inset ring-starBlue focus-within:ring-2'>
                <DropdownSelector
                    optionList={options}
                    selected={selected}
                    onChange={handleTermChange}
                />
                <div
                    className='typography-nav-menu-default text-white-60'
                    data-testid='term-selector-transformed-value'
                >
                    {selectedTerm && transformLabel(selectedTerm.label)}
                </div>
            </div>
        </div>
    );
};
