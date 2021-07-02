import React, { useState, useEffect } from 'react';
import { RootState } from 'src/store/types';
import { connect } from 'react-redux';
import { LendingStore } from 'src/store/lending/types';
import cm from './Graph.module.css';
import { LineChart } from 'src/components/new/LineChart';

const labels = ['0', '3m', '6m', '1y', '2y', '3y', '5y'];

interface YieldGraphProps {
    borrowRates: Array<string>;
    lendingRates: Array<string>;
    midRate: Array<string>;
}

type CombinedProps = YieldGraphProps & LendingStore;

const YieldGraph: React.FC<CombinedProps> = ({
    borrowRates,
    lendingRates,
    midRate,
}) => {
    const [data, setData] = useState({ datasets: [] });

    const refineArray = (array: Array<string | number>) => {
        if (!array.length) return array;

        if (array.length > 0) {
            const newArray = array.slice();
            newArray.unshift(0);
            return newArray.map((r: string | number) => +r / 100);
        }
    };

    useEffect(() => {
        let graphData = {
            labels,
            datasets: [
                {
                    label: 'Borrow',
                    data: refineArray(borrowRates),
                },
                {
                    label: 'Lend',
                    data: refineArray(lendingRates),
                },
                {
                    label: 'Mid Rate',
                    data: refineArray(midRate),
                },
            ],
        };
        setData(graphData);
    }, [borrowRates, lendingRates, midRate]);

    return (
        <div className={cm.container}>
            <LineChart data={data} showLegend />
        </div>
    );
};

const mapStateToProps = (state: RootState) => state.lending;

export default connect(mapStateToProps)(YieldGraph);
