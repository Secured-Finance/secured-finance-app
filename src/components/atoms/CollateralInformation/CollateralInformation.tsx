import { useSelector } from 'react-redux';
import { CurrencyIcon, CurrencyItem } from 'src/components/atoms';
import { getPriceMap } from 'src/store/assetPrices/selectors';
import { RootState } from 'src/store/types';
import { CurrencySymbol, currencyMap } from 'src/utils';

export interface CollateralInformationProps {
    asset: CurrencySymbol;
    quantity: number;
}

export const CollateralInformation = ({
    asset,
    quantity,
}: CollateralInformationProps) => {
    const priceList = useSelector((state: RootState) => getPriceMap(state));
    const price = priceList[asset];

    return (
        <div className='flex h-11 w-full flex-row gap-5'>
            <CurrencyIcon ccy={asset} />
            <div className='flex w-full flex-row justify-between'>
                <CurrencyItem ccy={asset} />
                <CurrencyItem
                    amount={quantity}
                    ccy={asset}
                    price={price}
                    align='right'
                    maxDecimals={currencyMap[asset].roundingDecimal}
                />
            </div>
        </div>
    );
};
