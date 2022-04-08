import React from 'react';
import { connect } from 'react-redux';
import { Page } from 'src/components/new/Page';
import { useRates } from 'src/hooks/useRates';
import useSF from 'src/hooks/useSecuredFinance';
import { getLendingControllerContract } from 'src/services/sdk/utils';
import { LendingStore } from 'src/store/lending';
import { RootState } from 'src/store/types';
import { ChartInfo } from './components/ChartInfo';
import YieldGraph from './components/Graph';
import { PlaceOrder } from './components/PlaceOrder';
// import PlaceOrderObsolete from './components/PlaceOrderObsolete';

const Lending = ({ selectedCcy }: LendingStore) => {
    const securedFinance = useSF();
    const lendingController = getLendingControllerContract(securedFinance);
    const borrowRates = useRates(lendingController, 0, selectedCcy);
    const lendingRates = useRates(lendingController, 1, selectedCcy);
    const midRate = useRates(lendingController, 2, selectedCcy);

    return (
        <Page id='lending-page'>
            <div className='flex flex-grow justify-between space-x-4 pt-8'>
                <div className='flex flex-col'>
                    <ChartInfo />
                    <YieldGraph
                        borrowRates={borrowRates}
                        lendingRates={lendingRates}
                        midRate={midRate}
                    />
                </div>
                <PlaceOrder
                    borrowRates={lendingRates}
                    lendingRates={borrowRates}
                />

                {/*<PlaceOrderObsolete*/}
                {/*    borrowRates={borrowRates}*/}
                {/*    lendingRates={lendingRates}*/}
                {/*/>*/}
            </div>
        </Page>
    );
};

const mapStateToProps = (state: RootState) => state.lending;

export default connect(mapStateToProps)(Lending);
