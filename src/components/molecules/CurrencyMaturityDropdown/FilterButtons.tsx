import clsx from 'clsx';
import { CurrencySymbol } from 'src/utils';

export const FilterButtons = ({
    currencies,
    currentCurrency,
    isItayose,
    setCurrentCurrency,
    setIsItayose,
    isFavorites,
    setIsFavorites,
}: {
    currencies?: CurrencySymbol[];
    currentCurrency: CurrencySymbol | undefined;
    isItayose: boolean;
    setCurrentCurrency: (currency: CurrencySymbol | undefined) => void;
    setIsItayose: (value: boolean) => void;
    isFavorites: boolean;
    setIsFavorites: (value: boolean) => void;
}) => {
    const FilterBtn = ({
        onClick,
        children,
        activeCondition,
        label,
    }: {
        onClick: () => void;
        children: React.ReactNode;
        activeCondition: boolean;
        label?: string;
    }) => (
        <button
            className={clsx('typography-mobile-body-5', {
                'text-primary-300': activeCondition,
                'text-neutral-400': !activeCondition,
            })}
            onClick={onClick}
            aria-label={label}
        >
            {children}
        </button>
    );

    const handleFilterClick = (
        currency?: CurrencySymbol,
        isItayose = false,
        isFavorites = false,
    ) => {
        setCurrentCurrency(currency);
        setIsItayose(isItayose);
        setIsFavorites(isFavorites);
    };

    return (
        <div className='flex items-center gap-[13.5px]'>
            <FilterBtn
                activeCondition={!currentCurrency && !isItayose && !isFavorites}
                onClick={() => {
                    handleFilterClick();
                }}
            >
                All
            </FilterBtn>
            <FilterBtn
                activeCondition={isFavorites}
                onClick={() => handleFilterClick(undefined, false, true)}
            >
                Favorites
            </FilterBtn>
            <FilterBtn
                activeCondition={isItayose && !currentCurrency}
                onClick={() => handleFilterClick(undefined, true, false)}
                label='itayose-filter-btn'
            >
                Itayose
            </FilterBtn>
            {currencies?.map(currency => (
                <FilterBtn
                    key={`currency-${currency}`}
                    activeCondition={currentCurrency === currency}
                    onClick={() => handleFilterClick(currency, false, false)}
                    label={`${currency}-filter-btn`}
                >
                    {currency}
                </FilterBtn>
            ))}
        </div>
    );
};
