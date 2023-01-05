import { BigNumber } from 'ethers';
import { useSelector } from 'react-redux';
import { CurrencyIcon, CurrencyItem } from 'src/components/atoms';
import { getPriceMap } from 'src/store/assetPrices/selectors';
import { RootState } from 'src/store/types';
import { amountFormatterFromBase, CurrencySymbol } from 'src/utils';

interface AssetInformationProps {
    header: string;
    collateralBook: Partial<Record<CurrencySymbol, BigNumber>>;
}

export const AssetInformation = ({
    header,
    collateralBook,
}: AssetInformationProps) => {
    const priceList = useSelector((state: RootState) => getPriceMap(state));
    return (
        <div className='flex h-fit w-full flex-col gap-3'>
            <div className='typography-caption-3 h-[26px] w-full border-b border-white-10 text-white-50'>
                {header}
            </div>
            {collateralBook &&
                Object.entries(collateralBook).map(([asset, quantity]) => (
                    <div
                        className='flex h-10 w-full flex-row items-center gap-3'
                        key={asset}
                    >
                        <div>
                            <CurrencyIcon ccy={asset as CurrencySymbol} />
                        </div>
                        <div className='flex w-full flex-row justify-between'>
                            <CurrencyItem
                                ccy={asset as CurrencySymbol}
                                price={priceList[asset as CurrencySymbol]}
                            />
                            <CurrencyItem
                                amount={amountFormatterFromBase[
                                    asset as CurrencySymbol
                                ](quantity)}
                                ccy={asset as CurrencySymbol}
                                price={priceList[asset as CurrencySymbol]}
                                align='right'
                            />
                        </div>
                    </div>
                ))}
        </div>
    );
};
