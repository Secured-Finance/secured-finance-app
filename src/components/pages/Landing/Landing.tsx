import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { LendingCard, YieldChart } from 'src/components/organisms';
import {
    OrderSide,
    RateType,
    useCollateralBook,
    usePlaceOrder,
    useRates,
} from 'src/hooks';
import { selectLandingOrderForm } from 'src/store/landingOrderForm';
import { RootState } from 'src/store/types';
import { Rate } from 'src/utils';
import { Maturity } from 'src/utils/entities';
import { useWallet } from 'use-wallet';

export const Landing = () => {
    const { account } = useWallet();
    const { placeOrder } = usePlaceOrder();
    const { currency, maturity, side } = useSelector((state: RootState) =>
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

    const rates = useRates(
        currency,
        side === OrderSide.Borrow ? RateType.Borrow : RateType.Lend,
        maturity
    );

    const marketRate = useMemo(() => {
        if (!rates) {
            return new Rate(0);
        }

        const rate =
            rates[
                Object.values(lendingContracts).indexOf(maturity.getMaturity())
            ];
        if (!rate) {
            return new Rate(0);
        }

        return rate;
    }, [rates, lendingContracts, maturity]);

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
                    onPlaceOrder={placeOrder}
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
        </div>
    );
};
