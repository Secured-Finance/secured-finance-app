import { CurrencyIcon, CurrencyItem, ZCTokenIcon } from 'src/components/atoms';
import { InfoToolTip } from 'src/components/molecules';
import { formatter } from 'src/utils';
import { CurrencySymbol, currencyMap } from 'src/utils';

export interface AssetInformationValue {
    currency: CurrencySymbol;
    label: string;
    amount: number;
    price: number;
    totalPrice: number;
}

interface AssetInformationProps {
    header: string;
    informationText: string;
    values: AssetInformationValue[];
    isZC?: boolean;
}

export const AssetInformation = ({
    header,
    informationText,
    values,
    isZC,
}: AssetInformationProps) => {
    return (
        values.length > 0 && (
            <div className='flex h-fit w-full flex-col gap-2'>
                <div className='flex h-7 flex-row items-center gap-2 border-b border-white-10'>
                    <div className='typography-caption-2 leading-4 text-white-50'>
                        {header}
                    </div>
                    <InfoToolTip iconSize='small'>
                        {informationText}
                    </InfoToolTip>
                </div>
                {values.map(
                    ({ currency, label, amount, price, totalPrice }) => (
                        <div
                            className='flex h-10 w-full flex-row items-center gap-2'
                            key={label}
                        >
                            <div>
                                {isZC ? (
                                    <ZCTokenIcon ccy={currency} />
                                ) : (
                                    <CurrencyIcon ccy={currency} />
                                )}
                            </div>
                            <div className='flex w-full flex-row justify-between'>
                                <CurrencyItem
                                    ccy={currency}
                                    label={label}
                                    price={price}
                                />
                                <CurrencyItem
                                    label={formatter.ordinary(
                                        currencyMap[currency].roundingDecimal,
                                        currencyMap[currency].roundingDecimal
                                    )(amount)}
                                    ccy={currency}
                                    price={totalPrice}
                                    align='right'
                                />
                            </div>
                        </div>
                    )
                )}
            </div>
        )
    );
};
