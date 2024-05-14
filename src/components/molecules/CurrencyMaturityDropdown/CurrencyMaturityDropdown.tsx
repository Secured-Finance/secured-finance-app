import { Menu } from '@headlessui/react';
import clsx from 'clsx';
import {
    // DelistingChip,
    Option,
} from 'src/components/atoms';
import { CurrencyOption } from 'src/components/molecules';
// import { useCurrencyDelistedStatus } from 'src/hooks';
import { currencyMap } from 'src/utils';

export const CurrencyMaturityDropdown = <T extends string = string>({
    currencyList,
    asset = currencyList[0],
    maturityList,
    maturity = maturityList[0],
    onChange,
}: {
    currencyList: CurrencyOption[];
    asset?: CurrencyOption;
    maturityList: Option<T>[];
    maturity?: Option<T>;
    onChange: (v: CurrencyOption['value']) => void;
}) => {
    // const isDelisted = useCurrencyDelistedStatus().data;

    const currencyOptions = currencyList.map(o => ({
        ...o,
        iconSVG: currencyMap[o.value].icon,
        maturities: maturityList,
        // ...(isDelisted.has(o.value) ? { chip: <DelistingChip /> } : {}),
    }));

    console.log(currencyOptions);

    return (
        <div onChange={() => onChange(asset.value)}>
            <Menu>
                {currencyOptions.map((asset, i) => {
                    console.log(asset);

                    return (
                        <Menu.Item
                            key={`${asset.label}_${i}`}
                            as='button'
                            // onClick={() => handleSelect(asset)}
                            aria-label={asset.label}
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
                                            {asset.iconSVG ? (
                                                <span role='img'>
                                                    <asset.iconSVG className='h-4 w-4 tablet:h-6 tablet:w-6' />
                                                </span>
                                            ) : null}
                                            <span className='typography-button-1'>
                                                {asset.label}
                                            </span>
                                        </div>

                                        {asset.chip ? (
                                            <span>{asset.chip}</span>
                                        ) : null}
                                    </div>
                                </div>
                            )}
                        </Menu.Item>
                    );
                })}
            </Menu>
            {asset.value}-{maturity.label}
        </div>
    );
};
