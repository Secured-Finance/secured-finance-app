import clsx from 'clsx';
import { CurrencySymbol } from 'src/utils';

export const FilterButtons = ({
    currencies,
    currentCurrency,
    isItayose,
    setCurrentCurrency,
    setIsItayose,
    isItayosePage,
    isFavourites,
    setIsFavourites,
}: {
    currencies?: CurrencySymbol[];
    currentCurrency: CurrencySymbol | undefined;
    isItayose: boolean;
    setCurrentCurrency: (currency: CurrencySymbol | undefined) => void;
    setIsItayose: (value: boolean) => void;
    isItayosePage: boolean;
    isFavourites: boolean;
    setIsFavourites: (value: boolean) => void;
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

    return (
        <div className='flex items-center gap-[13.5px]'>
            <FilterBtn
                activeCondition={
                    !currentCurrency && !isItayose && !isFavourites
                }
                onClick={() => {
                    setCurrentCurrency(undefined);
                    setIsItayose(false);
                    setIsFavourites(false);
                }}
            >
                All
            </FilterBtn>
            <FilterBtn
                activeCondition={isFavourites}
                onClick={() => {
                    setCurrentCurrency(undefined);
                    setIsItayose(false);
                    setIsFavourites(true);
                }}
            >
                Favourites
            </FilterBtn>
            {!isItayosePage && (
                <FilterBtn
                    activeCondition={isItayose}
                    onClick={() => {
                        setCurrentCurrency(undefined);
                        setIsItayose(true);
                        setIsFavourites(false);
                    }}
                    label='itayose-filter-btn'
                >
                    Itayose
                </FilterBtn>
            )}
            {currencies?.map(currency => (
                <FilterBtn
                    key={`currency-${currency}`}
                    activeCondition={currentCurrency === currency}
                    onClick={() => {
                        setCurrentCurrency(currency);
                        setIsItayose(false);
                        setIsFavourites(false);
                    }}
                    label={`${currency}-filter-btn`}
                >
                    {currency}
                </FilterBtn>
            ))}
        </div>
    );
};
