import { Menu } from '@headlessui/react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/outline';
import classNames from 'classnames';
import { SVGProps, useCallback, useEffect, useState } from 'react';
import { Separator } from '../Separator/Separator';

export type Option = {
    name: string;
    Icon?: (props: SVGProps<SVGSVGElement>) => JSX.Element;
};

export const DropdownSelector = ({
    optionList,
    onChange,
}: {
    optionList: Array<Option>;
    onChange: (v: string) => void;
}) => {
    const [selectedOption, setSelectedOption] = useState<Option>(optionList[0]);

    const handleSelect = useCallback(
        (option: Option) => {
            setSelectedOption(option);
        },
        [setSelectedOption]
    );

    useEffect(() => {
        onChange(selectedOption.name);
    }, [onChange, selectedOption.name]);

    return (
        <Menu as='div'>
            {({ open }) => (
                <>
                    <Menu.Button>
                        <div className='flex h-10 flex-row items-center rounded-lg bg-black-10 px-2'>
                            {selectedOption.Icon ? (
                                <span>
                                    <selectedOption.Icon className='h-6 w-6' />
                                </span>
                            ) : null}
                            <span className='typography-button-3 mx-3 text-white'>
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
                    <Menu.Items className='absolute flex max-h-96 w-52 flex-col overflow-y-auto rounded-lg bg-gunMetal p-2 shadow-sm'>
                        {optionList.map((asset, i) => (
                            <Menu.Item
                                key={asset.name}
                                as='button'
                                onClick={() => handleSelect(asset)}
                            >
                                {({ active }) => (
                                    <div>
                                        <div
                                            className={classNames(
                                                'flex flex-row justify-start space-x-4 rounded-lg p-2 text-white-80',
                                                {
                                                    'bg-horizonBlue': active,
                                                }
                                            )}
                                        >
                                            {asset.Icon ? (
                                                <span>
                                                    <asset.Icon className='h-6 w-6' />
                                                </span>
                                            ) : null}

                                            <span className='typography-button-3'>
                                                {asset.name}
                                            </span>
                                        </div>
                                        {i !== optionList.length - 1 ? (
                                            <div className='py-2'>
                                                <Separator />
                                            </div>
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
