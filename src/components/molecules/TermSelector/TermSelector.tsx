import { useMemo, useState } from 'react';
import { DropdownSelector, Option } from 'src/components/atoms';

export const TermSelector = <TermType extends string = string>({
    options,
    selected,
    transformLabel = (v: string) => v,
    onTermChange,
}: {
    options: Array<Option<TermType>>;
    selected: Option<TermType>;
    transformLabel?: (v: string) => string;
    onTermChange?: (v: TermType) => void;
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
        <div className='flex flex-col items-start justify-start space-y-2'>
            <div className='typography-caption ml-2 text-planetaryPurple'>
                Loan Term
            </div>
            <div className='flex h-14 w-72 flex-row items-center justify-between rounded-lg bg-black-20 py-2 pl-2 pr-4 focus-within:ring'>
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
