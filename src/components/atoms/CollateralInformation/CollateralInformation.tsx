import { CurrencyIcon, CurrencyItem } from 'src/components/atoms';
import { useLastPrices } from 'src/hooks';
import { CurrencySymbol, currencyMap } from 'src/utils';

export interface CollateralInformationProps {
    asset: CurrencySymbol;
    quantity: bigint;
}

export const CollateralInformation = ({
    asset,
    quantity,
}: CollateralInformationProps) => {
    const { data: priceList } = useLastPrices();

    return (
        <div className='flex h-11 w-full flex-row gap-5'>
            <CurrencyIcon ccy={asset} />
            <div className='flex w-full flex-row justify-between'>
                <CurrencyItem ccy={asset} />
                <CurrencyItem
                    amount={quantity}
                    ccy={asset}
                    price={priceList[asset]}
                    align='right'
                    minDecimals={currencyMap[asset].roundingDecimal}
                    maxDecimals={currencyMap[asset].roundingDecimal}
                />
            </div>
        </div>
    );
};
