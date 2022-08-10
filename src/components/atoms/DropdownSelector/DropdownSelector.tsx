import { Menu } from '@headlessui/react';
import classNames from 'classnames';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ExpandIndicator, Separator } from 'src/components/atoms';

export type Option<T = string> = {
    label: string;
    value: T;
    iconSVG?: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
};

export const DropdownSelector = <T extends string = string>({
    selected,
    optionList,
    onChange,
}: {
    selected: Option<T>;
    optionList: Readonly<Array<Option<T>>>;
    onChange: (v: T) => void;
}) => {
    const [selectedOptionValue, setSelectedOptionValue] = useState<T>(
        selected.value
    );

    const selectedOption = useMemo(
        () => optionList.find(o => o.value === selectedOptionValue),
        [optionList, selectedOptionValue]
    );

    const handleSelect = useCallback(
        (option: Option<T>) => {
            setSelectedOptionValue(option.value);
            onChange(option.value);
        },
        [onChange]
    );

    //Handle the case of the initial value
    useEffect(() => {
        if (selected.value === selectedOptionValue) {
            onChange(selected.value);
        }
    }, [onChange, selectedOptionValue, selected.label, selected.value]);

    useEffect(() => {
        if (selected.value) {
            setSelectedOptionValue(selected.value);
        }
    }, [selected.value]);

    return (
        <Menu as='div' className='flex'>
            {({ open }) => (
                <>
                    <Menu.Button>
                        <div className='flex h-10 w-36 flex-row items-center justify-between space-x-2 rounded-lg bg-black-10 px-2'>
                            {selectedOption?.iconSVG ? (
                                <span>
                                    <selectedOption.iconSVG className='h-6 w-6' />
                                </span>
                            ) : null}
                            <span className='typography-caption w-16 text-white'>
                                {selectedOption?.label}
                            </span>
                            <span
                                data-cy={`asset-expand-${selectedOption?.label}`}
                            >
                                <ExpandIndicator expanded={open} />
                            </span>
                        </div>
                    </Menu.Button>
                    <Menu.Items className='absolute flex max-h-96 w-52 flex-col overflow-y-auto rounded-lg bg-gunMetal p-2 shadow-sm'>
                        {optionList.map((asset, i) => (
                            <Menu.Item
                                key={`${asset.label}_${i}`}
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
                                            {asset.iconSVG ? (
                                                <span>
                                                    <asset.iconSVG className='h-6 w-6' />
                                                </span>
                                            ) : null}

                                            <span className='typography-button-3'>
                                                {asset.label}
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
