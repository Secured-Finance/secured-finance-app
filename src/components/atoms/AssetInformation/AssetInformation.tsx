import { BigNumber } from 'ethers';
import { useSelector } from 'react-redux';
import {
    CurrencyIcon,
    CurrencyItem,
    InformationPopover,
} from 'src/components/atoms';
import { CollateralBook } from 'src/hooks';
import { getPriceMap } from 'src/store/assetPrices/selectors';
import { RootState } from 'src/store/types';
import { CurrencySymbol, amountFormatterFromBase } from 'src/utils';

interface AssetInformationProps {
    header: string;
    informationText: string;
    collateralBook: CollateralBook['collateral' | 'nonCollateral'];
}

export const AssetInformation = ({
    header,
    informationText,
    collateralBook,
}: AssetInformationProps) => {
    const priceList = useSelector((state: RootState) => getPriceMap(state));
    return (
        collateralBook && (
            <div className='flex h-fit w-full flex-col gap-2'>
                <div className='flex h-7 flex-row gap-2 border-b border-white-10'>
                    <div className='typography-caption-2 leading-4 text-white-50'>
                        {header}
                    </div>
                    <div className='mt-[2px]'>
                        <InformationPopover>
                            {informationText}
                        </InformationPopover>
                    </div>
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
                                className='my-1 flex h-10 w-full flex-row items-center gap-2 border-b border-white-10 pb-4 tablet:border-none'
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
        )
    );
};
