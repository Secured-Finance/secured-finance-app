import { Menu } from '@headlessui/react';
import classNames from 'classnames';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ExpandIndicator, Separator } from 'src/components/atoms';

export type Option = {
    name: string;
    iconSVG?: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
};

export const DropdownSelector = ({
    value,
    optionList,
    onChange,
}: {
    value: Option;
    optionList: Readonly<Array<Option>>;
    onChange: (v: string) => void;
}) => {
    const [selectedOptionName, setSelectedOptionName] = useState<string>(
        value.name
    );
    const selectedOption = useMemo(
        () => optionList.find(o => o.name === selectedOptionName),
        [optionList, selectedOptionName]
    );

    const handleSelect = useCallback(
        (optionName: string) => {
            setSelectedOptionName(optionName);
            onChange(optionName);
        },
        [onChange]
    );

    // Handle the case of the initial value
    useEffect(() => {
        if (value.name === selectedOptionName) {
            onChange(value.name);
        }
    }, [onChange, selectedOptionName, value.name]);

    return (
        <Menu as='div'>
            {({ open }) => (
                <>
                    <Menu.Button>
                        <div className='flex h-10 w-42 flex-row items-center justify-between space-x-2 rounded-lg bg-black-10 px-2'>
                            {selectedOption?.iconSVG ? (
                                <span>
                                    <selectedOption.iconSVG className='h-6 w-6' />
                                </span>
                            ) : null}
                            <span className='typography-caption w-16 text-white'>
                                {selectedOption?.name}
                            </span>
                            <span>
                                <ExpandIndicator expanded={open} />
                            </span>
                        </div>
                    </Menu.Button>
                    <Menu.Items className='absolute flex max-h-96 w-52 flex-col overflow-y-auto rounded-lg bg-gunMetal p-2 shadow-sm'>
                        {optionList.map((asset, i) => (
                            <Menu.Item
                                key={asset.name}
                                as='button'
                                onClick={() => handleSelect(asset.name)}
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
                                            {asset.iconSVG ? (
                                                <span>
                                                    <asset.iconSVG className='h-6 w-6' />
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
