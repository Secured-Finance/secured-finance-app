import { Listbox, Transition } from '@headlessui/react';
import { Fragment, useEffect, useState } from 'react';
import { CollateralInfo, FORMAT_DIGITS, PriceFormatter } from 'src/utils';
import { ExpandIndicator } from '../ExpandIndicator';

interface CollateralSelectorProps {
    headerText: string;
    optionList: CollateralInfo[];
    selectedOption?: CollateralInfo;
    onChange: (v: CollateralInfo) => void;
}

const formatOption = (availableAmount: number, name: string) => {
    return `${PriceFormatter.formatOrdinary(
        availableAmount,
        FORMAT_DIGITS.ZERO,
        FORMAT_DIGITS.AMOUNT
    )} ${name} Available`;
};

export const CollateralSelector = ({
    headerText,
    optionList,
    onChange,
    selectedOption,
}: CollateralSelectorProps) => {
    const [selected, setSelected] = useState(selectedOption ?? optionList[0]);

    useEffect(() => {
        onChange(selected);
    }, [selected, onChange]);

    return (
        <div className='flex h-20 w-full flex-col justify-between'>
            <div className='typography-caption-2 h-5 w-fit text-secondary7'>
                {headerText}
            </div>
            <div className='h-12 w-full bg-transparent'>
                <Listbox value={selected} onChange={setSelected}>
                    {({ open }) => (
                        <>
                            <div className='relative h-full'>
                                <Listbox.Button
                                    className='flex w-full cursor-default items-center gap-2 rounded-lg border-2 border-white-40 px-4 py-3 focus:outline-none'
                                    data-testid='collateral-selector-button'
                                >
                                    <span className='typography-caption-2 flex h-6 min-w-[80px] items-center text-grayScale'>
                                        {selected.name}
                                    </span>
                                    <span className='typography-caption-2 flex h-6 w-full max-w-[200px] items-center justify-end pr-2 text-secondary7'>
                                        {formatOption(
                                            selected.available,
                                            selected.name
                                        )}
                                    </span>
                                    <div className='absolute right-3'>
                                        <ExpandIndicator
                                            expanded={open}
                                            variant='opaque'
                                        />
                                    </div>
                                </Listbox.Button>
                                <Transition
                                    as={Fragment}
                                    leave='transition ease-in duration-100'
                                    leaveFrom='opacity-100'
                                    leaveTo='opacity-0'
                                >
                                    <Listbox.Options className='absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-gunMetal pt-2 focus:outline-none'>
                                        {optionList.map((assetObj, index) => (
                                            <Listbox.Option
                                                key={index}
                                                data-testid={`option-${index}`}
                                                className={({ active }) =>
                                                    `relative cursor-default select-none ${
                                                        index !==
                                                        optionList.length - 1
                                                            ? 'border-b border-white-5'
                                                            : ''
                                                    } px-4 py-4 ${
                                                        active
                                                            ? 'bg-starBlue'
                                                            : ''
                                                    }`
                                                }
                                                value={assetObj}
                                            >
                                                {() => (
                                                    <div className='flex gap-3'>
                                                        <span className='typography-caption-2 flex h-6 min-w-[100px] items-center text-grayScale'>
                                                            {assetObj.name}
                                                        </span>
                                                        <span className='typography-caption-2 flex h-6 w-full max-w-[200px] items-center justify-end text-secondary7'>
                                                            {formatOption(
                                                                assetObj.available,
                                                                assetObj.name
                                                            )}
                                                        </span>
                                                    </div>
                                                )}
                                            </Listbox.Option>
                                        ))}
                                    </Listbox.Options>
                                </Transition>
                            </div>
                        </>
                    )}
                </Listbox>
            </div>
        </div>
    );
};
