import { useState } from 'react';
import { DropdownSelector, Option } from 'src/components/atoms';

export const TermSelector = ({
    options,
    transform = (v: string) => v,
    onTermChange,
}: {
    options: Array<Option>;
    transform?: (v: string) => string;
    onTermChange?: (v: string) => void;
}) => {
    const [term, setTerm] = useState('');

    const handleTermChange = (v: string) => {
        setTerm(v);
        if (onTermChange) {
            onTermChange(v);
        }
    };

    return (
        <div className='flex flex-col items-start justify-start space-y-2'>
            <label className='typography-caption ml-2 text-planetaryPurple'>
                Loan Term
            </label>
            <div className='flex h-14 w-72 flex-row items-center justify-between rounded-lg bg-black-20 py-2 pl-2 pr-4 focus-within:ring'>
                <div>
                    <DropdownSelector
                        optionList={options}
                        onChange={handleTermChange}
                    />
                </div>
                <div
                    className='typography-caption text-white-60'
                    data-testid='term-selector-transformed-value'
                >
                    {transform(term)}
                </div>
            </div>
        </div>
    );
};
