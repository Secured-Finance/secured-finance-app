import { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { SimpleAdvancedSelector, ViewType } from 'src/components/atoms';
import {
    AdvancedLending,
    LendingCard,
    YieldChart,
} from 'src/components/organisms';
import { OrderSide, RateType, useCollateralBook, useRates } from 'src/hooks';
import { RootState } from 'src/store/types';
import { Rate } from 'src/utils';
import { useWallet } from 'use-wallet';

export const Landing = () => {
    const { account } = useWallet();
    const [view, setView] = useState('Simple');
    const { currency, side, maturity } = useSelector(
        (state: RootState) => state.landingOrderForm
    );
    const lendingContracts = useSelector(
        (state: RootState) => state.availableContracts.lendingMarkets[currency]
    );

    const collateralBook = useCollateralBook(account);

    const optionList = Object.entries(lendingContracts).map(o => ({
        label: o[0],
        value: o[1],
    }));

    const rates = useRates(
        currency,
        side === OrderSide.Borrow ? RateType.Borrow : RateType.Lend
    );

    const marketRate = useMemo(() => {
        if (!rates) {
            return new Rate(0);
        }

        const rate = rates[Object.values(lendingContracts).indexOf(maturity)];
        if (!rate) {
            return new Rate(0);
        }

        return rate;
    }, [rates, lendingContracts, maturity]);

    return (
        <div
            className='flex flex-col gap-16 px-40 pt-12'
            role='main'
            data-cy='lending-page'
        >
            <div className='flex h-16 justify-between border-b-[0.5px] border-panelStroke'>
                <span className='font-secondary text-lg font-light leading-7 text-white'>
                    OTC Lending
                </span>
                <SimpleAdvancedSelector
                    handleClick={v => setView(v)}
                    text={view as ViewType}
                />
            </div>
            {view === 'Simple' ? (
                <div className='flex flex-row items-center justify-center'>
                    <LendingCard
                        collateralBook={collateralBook}
                        marketRate={marketRate}
                        maturitiesOptionList={optionList}
                    />
                    <YieldChart
                        asset={currency}
                        isBorrow={side === OrderSide.Borrow}
                        rates={rates}
                        maturitiesOptionList={optionList}
                    />
                </div>
            ) : (
                <AdvancedLending
                    collateralBook={collateralBook}
                    marketRate={marketRate}
                    maturitiesOptionList={optionList}
                />
            )}
        </div>
    );
};
