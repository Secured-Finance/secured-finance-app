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
        [options, termValue]
    );

    const handleTermChange = (v: T) => {
        setTermValue(v);
        if (onTermChange) {
            onTermChange(v);
        }
    };

    return (
        <div className='flex flex-col items-start justify-start space-y-2'>
            <div className='typography-caption-2 ml-2 text-planetaryPurple'>
                Maturity
            </div>
            <div className='flex h-14 w-72 flex-row items-center justify-between rounded-lg bg-black-20 py-2 pl-2 pr-4 ring-starBlue focus-within:ring'>
                <div>
                    <DropdownSelector
                        optionList={options}
                        selected={selected}
                        onChange={handleTermChange}
                    />
                </div>
                <div
                    className='typography-caption text-white-60'
                    data-testid='term-selector-transformed-value'
                >
                    {selectedTerm && transformLabel(selectedTerm.label)}
                </div>
            </div>
        </div>
    );
};
