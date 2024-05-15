import { Menu } from '@headlessui/react';
import clsx from 'clsx';
import { useCallback, useState } from 'react';
import { Option } from 'src/components/atoms';
import { CurrencyOption } from 'src/components/molecules';

export const CurrencyMaturityDropdown = <T extends string = string>({
    currencyList,
    asset = currencyList[0],
    maturityList,
    maturity = maturityList[0],
    onChange,
}: {
    currencyList: Option<T>[];
    asset?: Option<T>;
    maturityList: Option<T>[];
    maturity?: Option<T>;
    onChange: (
        currency: CurrencyOption['value'],
        maturity: Option<T>['value']
    ) => void;
}) => {
    const currencyOptions = currencyList.flatMap(ccy =>
        maturityList.map(maturity => {
            const ccyMaturity = `${ccy.label}-${maturity.label}`;
            return {
                label: ccyMaturity,
                value: ccyMaturity,
                // iconSVG: currencyMap[ccy.value].icon,
            };
        })
    );

    const [selectedOptionValue, setSelectedOptionValue] =
        useState<`${string}-${string}`>(`${asset.label}-${maturity.label}`);

    // const selectedOption = useMemo(
    //     () => optionList.find(o => o.value === selectedOptionValue),
    //     [optionList, selectedOptionValue]
    // );

    const handleSelect = useCallback(
        (option: Option<T>) => {
            if (option.value !== selectedOptionValue) {
                setSelectedOptionValue(option.value);
                // onChange(option.value);
            }
        },
        [onChange, selectedOptionValue]
    );

    // const prevSelectedValue = useRef('');
    // useEffect(() => {
    //     if (
    //         !prevSelectedValue ||
    //         prevSelectedValue.current !== selected.value
    //     ) {
    //         setSelectedOptionValue(selected.value);
    //         onChange(selected.value);
    //     }
    //     prevSelectedValue.current = selected.value;
    // }, [onChange, selectedOptionValue, selected.label, selected.value]);

    return (
        <Menu>
            <Menu.Button>{selectedOptionValue}</Menu.Button>
            <Menu.Items className='absolute left-0 top-[78px] w-full bg-neutral-800 px-4'>
                <input onChange={e => console.log(e.currentTarget.value)} />
                {currencyOptions.map((option, i) => {
                    return (
                        <Menu.Item
                            key={`${option.label}_${i}`}
                            as='button'
                            onClick={() => handleSelect(option)}
                            aria-label={option.label}
                        >
                            {({ active }) => (
                                <div>
                                    <div
                                        className={clsx(
                                            'flex flex-row items-center justify-between space-x-2 rounded-lg p-3 text-white-80',
                                            {
                                                'bg-horizonBlue': active,
                                            }
                                        )}
                                    >
                                        <div className='flex flex-row items-center justify-start space-x-2'>
                                            {option.iconSVG ? (
                                                <span role='img'>
                                                    <option.iconSVG className='h-4 w-4 tablet:h-6 tablet:w-6' />
                                                </span>
                                            ) : null}
                                            <span className='typography-button-1'>
                                                {option.label}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </Menu.Item>
                    );
                })}
            </Menu.Items>
        </Menu>
    );
};
