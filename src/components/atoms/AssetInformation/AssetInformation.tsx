import { BigNumber } from 'ethers';
import { useSelector } from 'react-redux';
import { CurrencyIcon, CurrencyItem } from 'src/components/atoms';
import { CollateralBook } from 'src/hooks';
import { getPriceMap } from 'src/store/assetPrices/selectors';
import { RootState } from 'src/store/types';
import { amountFormatterFromBase, CurrencySymbol } from 'src/utils';

interface AssetInformationProps {
    header: string;
    collateralBook: CollateralBook['collateral'];
}

export const AssetInformation = ({
    header,
    collateralBook,
}: AssetInformationProps) => {
    const priceList = useSelector((state: RootState) => getPriceMap(state));
    return (
        <div className='flex h-fit w-full flex-col gap-2'>
            <div className='typography-caption-3 h-[26px] w-full border-b border-white-10 text-white-50'>
                {header}
            </div>
            {collateralBook &&
                (
                    Object.entries(collateralBook) as [
                        CurrencySymbol,
                        BigNumber
                    ][]
                )
                    .filter(([_asset, quantity]) => !quantity.isZero())
                    .map(([asset, quantity]) => (
                        <div
                            className='flex h-10 w-full flex-row items-center gap-2'
                            key={asset}
                        >
                            <div>
                                <CurrencyIcon ccy={asset} />
                            </div>
                            <div className='flex w-full flex-row justify-between'>
                                <CurrencyItem
                                    ccy={asset}
                                    price={priceList[asset]}
                                />
                                <CurrencyItem
                                    amount={amountFormatterFromBase[asset](
                                        quantity
                                    )}
                                    ccy={asset}
                                    price={priceList[asset]}
                                    align='right'
                                />
                            </div>
                        </div>
                    ))}
        </div>
    );
};
