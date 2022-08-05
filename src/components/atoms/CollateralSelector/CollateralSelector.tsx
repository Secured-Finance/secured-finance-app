import { Listbox, Transition } from '@headlessui/react';
import { Fragment, useCallback, useState } from 'react';
import Line from 'src/assets/img/Line.svg';
import { Currency } from 'src/utils';

export interface CollateralObject {
    id: number;
    asset: Currency;
    assetName: string;
    available: number;
}

interface CollateralSelectorProps {
    headerText: string;
    optionList: CollateralObject[];
    onChange: (v: CollateralObject) => void;
}

export const CollateralSelector: React.FC<CollateralSelectorProps> = ({
    headerText,
    optionList,
    onChange,
}) => {
    const [selected, setSelected] = useState(optionList[0]);
    const handleSelect = useCallback(
        (option: CollateralObject) => {
            setSelected(option);
            onChange(option);
        },
        [onChange]
    );

    return (
        <div className='flex h-20 w-full flex-col justify-between'>
            <div className='typography-caption-2 h-5 w-fit text-secondary7'>
                {headerText}
            </div>
            <div className='h-12 w-full bg-transparent'>
                <Listbox value={selected} onChange={setSelected}>
                    <div className='relative h-full'>
                        <Listbox.Button className='flex w-full cursor-default gap-2 rounded-lg border-2 border-white-40 py-3 px-4 focus:outline-none'>
                            <span className='typography-caption-2 flex h-6 min-w-[80px] items-center text-grayScale'>
                                {selected.assetName}
                            </span>
                            <span className='typography-caption-2 flex h-6 w-full max-w-[200px] items-center justify-end pr-2 text-secondary7'>
                                {selected.available} {selected.asset} Available
                            </span>
                            <Line
                                className='pointer-events-none absolute right-3 h-6 w-6'
                                aria-hidden='true'
                            ></Line>
                        </Listbox.Button>
                        <Transition
                            as={Fragment}
                            leave='transition ease-in duration-100'
                            leaveFrom='opacity-100'
                            leaveTo='opacity-0'
                        >
                            <Listbox.Options className='absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-gunMetal pt-2 focus:outline-none'>
                                {optionList.map((assetObj, personIdx) => (
                                    <Listbox.Option
                                        key={personIdx}
                                        className={({ active }) =>
                                            `relative cursor-default select-none ${
                                                personIdx !==
                                                optionList.length - 1
                                                    ? 'border-b border-moonGrey border-opacity-30'
                                                    : ''
                                            } py-4 px-4 ${
                                                active ? 'bg-starBlue' : ''
                                            }`
                                        }
                                        value={assetObj}
                                        onClick={() => handleSelect(assetObj)}
                                    >
                                        {() => (
                                            <div className='flex gap-3'>
                                                <span className='typography-caption-2 flex h-6 min-w-[100px] items-center text-grayScale'>
                                                    {assetObj.assetName}
                                                </span>
                                                <span className='typography-caption-2 flex h-6 w-full max-w-[200px] items-center justify-end text-secondary7'>
                                                    {assetObj.available}{' '}
                                                    {assetObj.asset} Available
                                                </span>
                                            </div>
                                        )}
                                    </Listbox.Option>
                                ))}
                            </Listbox.Options>
                        </Transition>
                    </div>
                </Listbox>
            </div>
        </div>
    );
};
