import { Menu } from '@headlessui/react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/outline';
import { SVGProps, useCallback, useState } from 'react';

export type Option = {
    name: string;
    Icon?: (props: SVGProps<SVGSVGElement>) => JSX.Element;
};

export const DropdownSelector = ({
    optionList,
}: {
    optionList: Array<Option>;
}) => {
    const [selectedOption, setSelectedOption] = useState<Option>(optionList[0]);

    const handleSelect = useCallback(
        (option: Option) => {
            setSelectedOption(option);
        },
        [setSelectedOption]
    );

    return (
        <Menu as='div' className=''>
            {({ open }) => (
                <>
                    <Menu.Button>
                        <div className='flex h-10 flex-row items-center rounded-lg bg-black-10 px-2'>
                            {selectedOption.Icon ? (
                                <span className=''>
                                    {
                                        <selectedOption.Icon className='h-6 w-6' />
                                    }
                                </span>
                            ) : null}
                            <span className='typography-button3 mx-3 text-white'>
                                {selectedOption.name}
                            </span>
                            <span>
                                {open ? (
                                    <ChevronDownIcon
                                        className='h-6 w-6 text-white'
                                        data-testid='chevron-down-icon'
                                    />
                                ) : (
                                    <ChevronUpIcon
                                        className='h-6 w-6 text-white'
                                        data-testid='chevron-up-icon'
                                    />
                                )}
                            </span>
                        </div>
                    </Menu.Button>
                    <Menu.Items className='flex max-h-96 max-w-md flex-col overflow-y-auto rounded-lg bg-universeBlue shadow-sm'>
                        {optionList.map((asset, i) => (
                            <Menu.Item
                                key={asset.name}
                                as='button'
                                onClick={() => handleSelect(asset)}
                            >
                                {({ active }) => (
                                    <div className='mx-8'>
                                        <div
                                            className={`${
                                                active && 'bg-nebulaTeal'
                                            }  flex flex-row items-end justify-start space-x-6 rounded-lg bg-universeBlue py-6 text-white`}
                                        >
                                            {asset.Icon ? (
                                                <span>
                                                    <asset.Icon className='h-6 w-6' />
                                                </span>
                                            ) : null}

                                            <span className='typography-button3'>
                                                {asset.name}
                                            </span>
                                        </div>
                                        {i !== optionList.length - 1 ? (
                                            <div className='border-b border-moonGrey border-opacity-30' />
                                        ) : null}
                                    </div>
                                )}
                            </Menu.Item>
                        ))}
                    </Menu.Items>
                </>
            )}
        </Menu>
    );
};
