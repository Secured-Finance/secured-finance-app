import { CurrencyIcon, CurrencyItem } from 'src/components/atoms';
import { InfoToolTip } from 'src/components/molecules';
import { CollateralBook, useLastPrices } from 'src/hooks';
import {
    CurrencySymbol,
    ZERO_BI,
    amountFormatterFromBase,
    currencyMap,
} from 'src/utils';

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
    const { data: priceList } = useLastPrices();

    return (
        collateralBook && (
            <div className='flex h-fit w-full flex-col gap-2'>
                <div className='flex h-7 flex-row items-center gap-2 border-b border-white-10'>
                    <div className='typography-caption-2 leading-4 text-white-50'>
                        {header}
                    </div>
                    <InfoToolTip iconSize='small'>
                        {informationText}
                    </InfoToolTip>
                </div>
                {collateralBook &&
                    (
                        Object.entries(collateralBook) as [
                            CurrencySymbol,
                            bigint
                        ][]
                    )
                        .filter(([_asset, quantity]) => quantity !== ZERO_BI)
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
                                        minDecimals={
                                            currencyMap[asset].roundingDecimal
                                        }
                                        maxDecimals={
                                            currencyMap[asset].roundingDecimal
                                        }
                                    />
                                </div>
                            </div>
                        ))}
            </div>
        )
    );
};
