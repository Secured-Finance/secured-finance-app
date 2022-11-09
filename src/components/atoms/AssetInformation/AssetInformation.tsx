import { useSelector } from 'react-redux';
import { CurrencyIcon, CurrencyItem } from 'src/components/atoms';
import { getPriceMap } from 'src/store/assetPrices/selectors';
import { RootState } from 'src/store/types';
import { CurrencySymbol } from 'src/utils';

interface AssetInformationProps {
    header: string;
    asset: CurrencySymbol;
    quantity: number;
}

export const AssetInformation = ({
    header,
    asset,
    quantity,
}: AssetInformationProps) => {
    const priceList = useSelector((state: RootState) => getPriceMap(state));
    const price = priceList[asset];

    return (
        <div className='flex h-fit w-[216px] flex-col gap-2'>
            <div className='typography-caption-3 h-[26px] w-full border-b border-white-10 text-white-50'>
                {header}
            </div>
            <div className='flex h-10 w-full flex-row items-center gap-3'>
                <div>
                    <CurrencyIcon ccy={asset} />
                </div>
                <div className='flex w-full flex-row justify-between'>
                    <CurrencyItem ccy={asset} price={price} />
                    <CurrencyItem
                        amount={quantity}
                        ccy={asset}
                        price={price}
                        align='right'
                    />
                </div>
            </div>
        </div>
    );
};
