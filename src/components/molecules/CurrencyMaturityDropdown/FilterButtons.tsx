import clsx from 'clsx';
import { CurrencySymbol } from 'src/utils';

export const FilterButtons = ({
    currencies,
    currentCurrency,
    isItayose,
    setCurrentCurrency,
    setIsItayose,
}: {
    currencies?: CurrencySymbol[];
    currentCurrency: CurrencySymbol | undefined;
    isItayose: boolean;
    setCurrentCurrency: (currency: CurrencySymbol | undefined) => void;
    setIsItayose: (value: boolean) => void;
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
                activeCondition={!currentCurrency && !isItayose}
                onClick={() => {
                    setCurrentCurrency(undefined);
                    setIsItayose(false);
                }}
            >
                All
            </FilterBtn>
            <FilterBtn
                activeCondition={isItayose && !currentCurrency}
                onClick={() => {
                    setCurrentCurrency(undefined);
                    setIsItayose(true);
                }}
                label='itayose-filter-btn'
            >
                Itayose
            </FilterBtn>
            {currencies?.map(currency => (
                <FilterBtn
                    key={`currency-${currency}`}
                    activeCondition={currentCurrency === currency}
                    onClick={() => {
                        setCurrentCurrency(currency);
                        setIsItayose(false);
                    }}
                    label={`${currency}-filter-btn`}
                >
                    {currency}
                </FilterBtn>
            ))}
        </div>
    );
};
