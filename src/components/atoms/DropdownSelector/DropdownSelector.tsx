import { Menu } from '@headlessui/react';
import classNames from 'classnames';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ExpandIndicator, Separator } from 'src/components/atoms';

export type Option<T = string> = {
    label: string;
    value: T;
    iconSVG?: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
};

const ButtonV1 = ({
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

const ButtonV2 = ({
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

const ButtonV3 = ({ open }: { open: boolean }) => {
    return (
        <div className='flex rounded-[32px] border-2 border-neutral-3 p-2'>
            <ExpandIndicator expanded={open} variant='opaque' />
        </div>
    );
};

export const DropdownSelector = <T extends string = string>({
    selected,
    optionList,
    onChange,
    buttonVersion = 'v1',
}: {
    selected: Option<T>;
    optionList: Readonly<Array<Option<T>>>;
    onChange: (v: T) => void;
    buttonVersion?: 'v1' | 'v2' | 'v3';
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
                    <Menu.Button>
                        {() => {
                            switch (buttonVersion) {
                                case 'v1':
                                    return (
                                        <ButtonV1
                                            selectedOption={selectedOption}
                                            open={open}
                                        />
                                    );
                                case 'v2':
                                    return (
                                        <ButtonV2
                                            selectedOption={selectedOption}
                                            open={open}
                                        />
                                    );
                                case 'v3':
                                    return <ButtonV3 open={open} />;
                            }
                        }}
                    </Menu.Button>
                    <Menu.Items
                        className={`scrollbar absolute z-10 mt-2 flex max-h-60 w-52 flex-col overflow-y-auto rounded-lg bg-gunMetal p-2 shadow-sm ${
                            buttonVersion === 'v3' ? 'right-0' : ''
                        }`}
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
                                                    <asset.iconSVG className='h-6 w-6' />
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
