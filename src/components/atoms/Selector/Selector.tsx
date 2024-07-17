import { Listbox, Transition } from '@headlessui/react';
import { Fragment, useEffect, useState } from 'react';
import { ExpandIndicator } from '../ExpandIndicator';

export type OptionInfo = {
    label: string;
    value: string | number;
    note?: string;
    icon?: JSX.Element;
};

interface SelectorProps {
    headerText: string;
    optionList: OptionInfo[];
    selectedOption?: OptionInfo;
    onChange: (v: OptionInfo) => void;
    testid?: string;
}

export const Selector = ({
    headerText,
    optionList,
    onChange,
    selectedOption,
    testid = 'main',
}: SelectorProps) => {
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
                <Listbox
                    value={selected}
                    onChange={(v: OptionInfo) => setSelected(v)}
                >
                    {({ open }) => (
                        <>
                            <div className='relative h-full'>
                                <Listbox.Button
                                    className='flex w-full cursor-default items-center gap-2 rounded-lg border-2 border-white-40 py-3 pl-4 pr-8 focus:outline-none'
                                    data-testid={`${testid}-selector-button`}
                                >
                                    <span className='typography-caption-2 flex h-6 items-center justify-end text-secondary7'>
                                        {selected.icon}
                                    </span>
                                    <span className='typography-caption-2 flex h-6 min-w-[110px] items-center text-left text-grayScale'>
                                        {selected.label}
                                    </span>
                                    <span className='typography-caption-2 flex h-6 w-full max-w-[200px] items-center justify-end text-right text-secondary7'>
                                        {selected.note}
                                    </span>
                                    {/* <span className='typography-caption-2 flex h-6 items-center justify-end pr-3 text-secondary7'>
                                        {selected.icon}
                                    </span> */}
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
                                    <Listbox.Options className='absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-gunMetal pt-2 focus:outline-none'>
                                        {optionList.map((assetObj, index) => (
                                            <Listbox.Option
                                                key={assetObj.value}
                                                data-testid={`${testid}-option-${assetObj.value}`}
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
                                                        <span className='typography-caption-2 flex h-6 min-w-[120px] items-center text-left text-grayScale'>
                                                            {assetObj.label}
                                                        </span>
                                                        <span className='typography-caption-2 flex h-6 w-full max-w-[200px] items-center justify-end text-right text-secondary7'>
                                                            {assetObj.note}
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
