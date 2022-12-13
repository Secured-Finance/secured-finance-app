import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { LendingCard, YieldChart } from 'src/components/organisms';
import {
    OrderSide,
    RateType,
    useCollateralBook,
    useLoanValues,
} from 'src/hooks';
import { selectLandingOrderForm } from 'src/store/landingOrderForm';
import { RootState } from 'src/store/types';
import { LoanValue, Maturity } from 'src/utils/entities';
import { useWallet } from 'use-wallet';

export const Landing = () => {
    const { account } = useWallet();
    const { currency, side, maturity } = useSelector((state: RootState) =>
        selectLandingOrderForm(state.landingOrderForm)
    );
    const lendingContracts = useSelector(
        (state: RootState) => state.availableContracts.lendingMarkets[currency]
    );

    const collateralBook = useCollateralBook(account);

    const optionList = Object.entries(lendingContracts).map(o => ({
        label: o[0],
        value: new Maturity(o[1]),
    }));

    const unitPrices = useLoanValues(
        currency,
        side === OrderSide.Borrow ? RateType.Borrow : RateType.Lend,
        maturity
    );

    const marketValue = useMemo(() => {
        if (!unitPrices) {
            return LoanValue.ZERO;
        }

        const value =
            unitPrices[
                Object.values(lendingContracts).indexOf(maturity.toNumber())
            ];
        if (!value) {
            return LoanValue.ZERO;
        }

        return value;
    }, [unitPrices, lendingContracts, maturity]);

    return (
        <div
            className='flex-col items-center space-y-20 py-20'
            role='main'
            data-cy='lending-page'
        >
            <div className='flex flex-col items-center justify-center space-y-5 text-center'>
                <h1 className='typography-headline-1 text-white'>
                    Interbank-grade Lending <br />
                    Now Democratized
                </h1>
                <h2 className='typography-body-2 w-1/3 text-white-80'>
                    An elegant open-market digital asset lending solution
                    offering interoperability with traditional banking and
                    decentralization via&nbsp;Web3
                </h2>
            </div>
            <div className='flex flex-row items-center justify-center'>
                <LendingCard
                    collateralBook={collateralBook}
                    marketRate={marketValue.apy}
                    maturitiesOptionList={optionList}
                />
                <YieldChart
                    asset={currency}
                    isBorrow={side === OrderSide.Borrow}
                    rates={unitPrices.map(v => v.apy)}
                    maturitiesOptionList={optionList}
                />
            </div>
        </div>
    );
};
