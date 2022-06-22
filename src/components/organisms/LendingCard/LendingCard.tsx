import { RadioGroup } from '@headlessui/react';
import classNames from 'classnames';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Button } from 'src/components/atoms';
import { AssetSelector, TermSelector } from 'src/components/molecules';
import { RootState } from 'src/store/types';
import { currencyList } from 'src/utils';

export const LendingCard = () => {
    const [market, setMarket] = useState<'Lend' | 'Borrow'>('Lend');
    const optionList = [
        { name: 'Sep 2022' },
        { name: 'Dec 2022' },
        { name: 'Mar 2023' },
        { name: 'Jun 2023' },
        { name: 'Sep 2023' },
        { name: 'Dec 2023' },
        { name: 'Mar 2024' },
        { name: 'Jun 2024' },
        { name: 'Sep 2024' },
        { name: 'Dec 2024' },
    ];

    const shortNames: Record<string, string> = {
        Bitcoin: 'BTC',
        Ethereum: 'ETH',
        Filecoin: 'FIL',
        USDC: 'USDC',
        'USD Tether': 'USDT',
    };

    const {
        filecoin: { price: filecoinPrice },
        ethereum: { price: ethereumPrice },
        usdc: { price: usdcPrice },
    } = useSelector((state: RootState) => state.assetPrices);

    const priceList: Record<string, number> = {
        Ethereum: ethereumPrice,
        Filecoin: filecoinPrice,
        USDC: usdcPrice,
    };
    return (
        <div className='w-80 flex-col space-y-6 rounded-lg border border-neutral bg-transparent pb-4 shadow-2xl'>
            <RadioGroup
                value={market}
                onChange={setMarket}
                as='div'
                className='flex flex-row'
            >
                <RadioGroup.Option value='Borrow' as='div' className='w-1/2'>
                    {({ checked }) => (
                        <RadioGroup.Label
                            className={classNames('w-full', {
                                'ring ring-red': checked,
                            })}
                        >
                            <Button fullWidth>Borrow</Button>
                        </RadioGroup.Label>
                    )}
                </RadioGroup.Option>
                <RadioGroup.Option value='Lend' as='div' className='w-1/2'>
                    {({ checked }) => (
                        <RadioGroup.Label
                            className={classNames('w-full', {
                                'ring ring-red': checked,
                            })}
                        >
                            <Button fullWidth>Lend</Button>
                        </RadioGroup.Label>
                    )}
                </RadioGroup.Option>
            </RadioGroup>

            <div className='flex flex-col items-stretch justify-center space-y-4 px-4'>
                <div className='typography-body-2 flex flex-col text-center text-white-50'>
                    <span>16.23%</span>
                    <span>Fixed Rate APY</span>
                </div>
                <div className='flex self-center'>
                    <AssetSelector
                        options={currencyList}
                        transform={(v: string) => shortNames[v]}
                        priceList={priceList}
                    />
                </div>
                <div className='flex self-center'>
                    <TermSelector options={optionList} />
                </div>
                <div className='flex flex-row items-stretch justify-between'>
                    <div className='flex-col'>
                        <div className='typography-caption-2 text-planetaryPurple'>
                            Available to borrow
                        </div>
                        <div className='typography-caption font-bold  text-white'>
                            --
                        </div>
                    </div>
                    <div className='flex-col'>
                        <div className='typography-caption-2 text-planetaryPurple'>
                            Collateral Usage
                        </div>
                        <div className='typography-caption font-bold text-white'>
                            --
                        </div>
                    </div>
                </div>
                <div className='flex'>
                    <Button fullWidth>{market}</Button>
                </div>
            </div>
        </div>
    );
};
