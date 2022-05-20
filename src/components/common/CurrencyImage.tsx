import React from 'react';
import { Currency, getCurrencyBy } from 'src/utils/currencyList';

interface CurrencySelectorProps {
    selectedCcy: Currency;
    showName?: boolean;
}

export const CurrencyImage: React.FC<CurrencySelectorProps> = ({
    selectedCcy,
    showName,
}) => {
    const { icon } = getCurrencyBy('shortName', selectedCcy);

    return (
        <span className='flex items-center'>
            <img
                width={28}
                src={icon}
                alt={`currency_${selectedCcy}`}
                data-cy='currency-image-icon'
            />
            {showName && (
                <span
                    className='ml-2 text-lightBackground'
                    data-cy='currency-image-ccy'
                >
                    {selectedCcy}
                </span>
            )}
        </span>
    );
};
