import React, { useState, useEffect } from 'react';
import { RootState } from 'src/store/types';
import { connect } from 'react-redux';
import { LendingStore } from 'src/store/lending/types';
import cm from './Graph.module.scss';
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

    let canvas: HTMLCanvasElement = document.createElement("canvas");
	let ctx: CanvasRenderingContext2D = canvas.getContext("2d");
	var blueGradient = ctx.createLinearGradient(0, 0, 0, 0);
	blueGradient.addColorStop(0, "rgba(0, 122, 255, 0.5)");
	blueGradient.addColorStop(1, "rgba(15, 26, 34, 0.1)");
	
	var yellowGradient = ctx.createLinearGradient(0, 0, 0, 0);
	yellowGradient.addColorStop(0, "rgba(242, 109, 79, 1)");
	yellowGradient.addColorStop(1, "rgba(15, 26, 34, 0.1)");
	
	var purpleGradient = ctx.createLinearGradient(0, 0, 0, 100);
	purpleGradient.addColorStop(0, "rgba(145, 59, 175, 1)");
	purpleGradient.addColorStop(1, "rgba(15, 26, 34, 0.1)");

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
					fill: true,
					lineTension: 0.4,
					backgroundColor: blueGradient,
					borderColor: "rgba(0, 122, 255, 1)",
					radius: 0,
					hoverRadius: 0,
					pointHitRadius: 100,
                    data: refineArray(borrowRates),
					borderWidth: 2,
					opacity: 1,
					hidden: false,
                },
                {
                    label: "Lend",
					fill: true,
					lineTension: 0.4,
					backgroundColor: purpleGradient,
					borderColor: "rgba(145, 59, 175, 1)",
					radius: 0,
					hoverRadius: 0,
					pointHitRadius: 100,
                    data: refineArray(lendingRates),
					borderWidth: 2,
					opacity: 0.1,
					hidden: false,
                },
                {
					label: "Mid Rate",
					fill: false,
					lineTension: 0.4,
					backgroundColor: yellowGradient,
					borderColor: "rgba(242, 109, 79, 1)",
					radius: 0,
					hoverRadius: 0,
					pointHitRadius: 100,
                    data: refineArray(midRate),
					borderWidth: 2,
					opacity: 1,
					hidden: false,
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
