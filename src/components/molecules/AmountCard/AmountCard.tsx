import clsx from 'clsx';
import { currencyMap, prefixTilde, formatter } from 'src/utils';
import { Amount } from 'src/utils/entities';
import { FINANCIAL_CONSTANTS } from 'src/config/constants';

export const AmountCard = ({
    amount,
    price,
}: {
    amount: Amount;
    price: number;
}) => {
    const formattedValue = formatter.ordinary(
        FINANCIAL_CONSTANTS.ZERO_DECIMALS,
        FINANCIAL_CONSTANTS.AMOUNT_DECIMALS
    )(amount.value);
    const formattedValueInUSD = formatter.usd(
        amount.value * price,
        FINANCIAL_CONSTANTS.ZERO_DECIMALS
    );
    return (
        <div className='mb-3 grid w-full grid-cols-2 justify-around'>
            <div className='col-span-1 grid items-center justify-start'>
                <span className='typography-button-3 leading-6 text-white'>
                    {amount.currency}
                </span>
                <span className='typography-caption-3 text-white-60'>
                    {currencyMap[amount.currency].longName}
                </span>
            </div>
            <div className='col-span-1 grid items-center justify-end'>
                <span
                    className={clsx(
                        'flex justify-end font-semibold text-white',
                        {
                            'typography-body-2': formattedValue.length > 10,
                            'typography-button-3 leading-6':
                                formattedValue.length <= 10,
                        }
                    )}
                >
                    {formattedValue}
                </span>
                <div className='typography-caption-3 text-right text-white-60'>
                    {prefixTilde(formattedValueInUSD)}
                </div>
            </div>
        </div>
    );
};
