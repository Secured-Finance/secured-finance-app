import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { LendingCard, YieldChart } from 'src/components/organisms';
import { OrderSide, useCollateralBook, usePlaceOrder } from 'src/hooks';
import { useRates } from 'src/hooks/useRates';
import { RootState } from 'src/store/types';
import { Currency, termMap } from 'src/utils';
import { useWallet } from 'use-wallet';

export const Landing = () => {
    const { account, chainId } = useWallet();
    const { placeOrder } = usePlaceOrder();
    const collateralBook = useCollateralBook(
        account ? account : '',
        chainId ? chainId : 1
    );

    const { currency, side, term } = useSelector(
        (state: RootState) => state.landingOrderForm
    );

    const rates = useRates(Currency.FIL, side === OrderSide.Lend ? 1 : 0);
    const marketRate = useMemo(() => {
        if (!rates) {
            return 0;
        }
        return rates[Object.keys(termMap).indexOf(term)];
    }, [rates, term]);

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
                    decentralization via Web3
                </h2>
            </div>
            <div className='flex flex-row items-center justify-center'>
                <LendingCard
                    onPlaceOrder={placeOrder}
                    collateralBook={collateralBook}
                    marketRate={marketRate}
                />
                <YieldChart
                    asset={currency}
                    isBorrow={side === 1}
                    rates={rates}
                />
            </div>
        </div>
    );
};
