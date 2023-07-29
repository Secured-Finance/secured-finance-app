import { Menu } from '@headlessui/react';
import classNames from 'classnames';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ExpandIndicator, Separator } from 'src/components/atoms';
import { SvgIcon } from 'src/types';

export type Option<T = string> = {
    label: string;
    value: T;
    iconSVG?: SvgIcon;
};

const DefaultButton = ({
    selectedOption,
    open,
}: {
    selectedOption: Option<string> | undefined;
    open: boolean;
}) => {
    return (
        <div className='flex h-10 w-36 flex-row items-center justify-between space-x-2 rounded-lg bg-white-5 px-2'>
            {selectedOption?.iconSVG ? (
                <span>
                    <selectedOption.iconSVG className='h-6 w-6' />
                </span>
            ) : null}
            <span className='typography-caption w-16 text-white'>
                {selectedOption?.label}
            </span>
            <span data-cy={`asset-expand-${selectedOption?.label}`}>
                <ExpandIndicator expanded={open} />
            </span>
        </div>
    );
};

const FillWidthButton = ({
    selectedOption,
    open,
}: {
    selectedOption: Option<string> | undefined;
    open: boolean;
}) => {
    return (
        <div className='flex h-10 w-full flex-row items-center justify-between space-x-2 rounded-lg bg-white-5 px-2'>
            {selectedOption?.iconSVG ? (
                <span>
                    <selectedOption.iconSVG className='h-6 w-6' />
                </span>
            ) : null}
            <span className='typography-caption text-white'>
                {selectedOption?.label}
            </span>
            <span data-cy={`asset-expand-${selectedOption?.label}`}>
                <ExpandIndicator expanded={open} />
            </span>
        </div>
    );
};

const RoundedExpandButton = ({
    selectedOption,
    open,
}: {
    selectedOption: Option<string> | undefined;
    open: boolean;
}) => {
    return (
        <div className='flex flex-row items-center gap-3'>
            {selectedOption?.iconSVG ? (
                <div>
                    <selectedOption.iconSVG className='h-6 w-6' />
                </div>
            ) : null}
            <span className='typography-body-1 text-neutral-8'>
                {selectedOption?.label}
            </span>
            <div className='flex rounded-[32px] border-2 border-neutral-3 p-2'>
                <ExpandIndicator expanded={open} variant='opaque' />
            </div>
        </div>
    );
};

const NoLabelButton = ({ open }: { open: boolean }) => {
    return (
        <div className='flex rounded-[32px] border-2 border-neutral-3 p-2'>
            <ExpandIndicator expanded={open} variant='opaque' />
        </div>
    );
};

export const DropdownSelector = <T extends string = string>({
    optionList,
    selected = optionList[0],
    onChange,
    variant = 'default',
}: {
    optionList: Readonly<Array<Option<T>>>;
    selected?: Option<T>;
    onChange: (v: T) => void;
    variant?: 'default' | 'roundedExpandButton' | 'noLabel' | 'fullWidth';
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
        <Menu as='div' className='relative'>
            {({ open }) => (
                <>
                    <Menu.Button
                        className={classNames({
                            'w-full': variant === 'fullWidth',
                        })}
                    >
                        {() => {
                            switch (variant) {
                                case 'default':
                                    return (
                                        <DefaultButton
                                            selectedOption={selectedOption}
                                            open={open}
                                        />
                                    );
                                case 'roundedExpandButton':
                                    return (
                                        <RoundedExpandButton
                                            selectedOption={selectedOption}
                                            open={open}
                                        />
                                    );
                                case 'noLabel':
                                    return <NoLabelButton open={open} />;
                                case 'fullWidth':
                                    return (
                                        <FillWidthButton
                                            open={open}
                                            selectedOption={selectedOption}
                                        />
                                    );
                            }
                        }}
                    </Menu.Button>
                    <Menu.Items
                        className={classNames(
                            'scrollbar absolute z-50 mt-2 flex flex-col overflow-y-auto rounded-lg bg-gunMetal p-2 shadow-sm',
                            {
                                'right-0': variant === 'noLabel',
                                'max-h-[196px] w-52 tablet:max-h-60':
                                    variant !== 'fullWidth',
                                'w-full': variant === 'fullWidth',
                            }
                        )}
                    >
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
                                                'flex flex-row items-center justify-start space-x-4 rounded-lg p-2 text-white-80',
                                                {
                                                    'bg-horizonBlue': active,
                                                }
                                            )}
                                        >
                                            {asset.iconSVG ? (
                                                <span>
                                                    <asset.iconSVG className='h-4 w-4 tablet:h-6 tablet:w-6' />
                                                </span>
                                            ) : null}

                                            <span className='typography-button-1'>
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
