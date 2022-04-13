import React, { useMemo, useState } from 'react';
import { defaults, Line } from 'react-chartjs-2';
import styled from 'styled-components';
import { useRates } from 'src/hooks/useRates';
import useSF from 'src/hooks/useSecuredFinance';
import { getLendingControllerContract } from 'src/services/sdk/utils';
import theme from 'src/theme';

import { chartOptions } from './chartOptions';

const Title = styled.div`
    font-weight: 400;
    font-size: 22px;
    color: white;
`;

const labels = ['0', '3m', '6m', '1y', '2y', '3y', '5y'];

export function YieldCurve() {
    const [currencyIndex, setCurrencyIndex] = useState('FIL');
    const [lineData, setLineData] = useState({});
    const securedFinance = useSF();
    const lendingControllerContract =
        getLendingControllerContract(securedFinance);

    const borrowRates = useRates(lendingControllerContract, 0, currencyIndex);
    const lendingRates = useRates(lendingControllerContract, 1, currencyIndex);
    const midRate = useRates(lendingControllerContract, 2, currencyIndex);

    defaults.global.defaultFontColor = theme.colors.cellKey;

    const canvas: HTMLCanvasElement = document.createElement('canvas');
    const ctx: CanvasRenderingContext2D = canvas.getContext('2d');
    const blueGradient = ctx.createLinearGradient(0, 0, 0, 0);
    blueGradient.addColorStop(0, 'rgba(0, 122, 255, 0.5)');
    blueGradient.addColorStop(1, 'rgba(15, 26, 34, 0.1)');

    const yellowGradient = ctx.createLinearGradient(0, 0, 0, 0);
    yellowGradient.addColorStop(0, 'rgba(242, 109, 79, 1)');
    yellowGradient.addColorStop(1, 'rgba(15, 26, 34, 0.1)');

    const purpleGradient = ctx.createLinearGradient(0, 0, 0, 250);
    purpleGradient.addColorStop(0, 'rgba(145, 59, 175, 1)');
    purpleGradient.addColorStop(0.5, 'rgba(15, 26, 34, 0.25)');
    purpleGradient.addColorStop(1, 'rgba(15, 26, 34, 0.1)');

    const convertArray = (array: Array<any>) => {
        const newArray = array.slice();
        newArray.unshift(0);
        return newArray.map((r: any) => r / 100);
    };

    useMemo(() => {
        async function updateGraph() {
            const graphData = await {
                labels: labels,
                datasets: [
                    {
                        label: 'Borrow yield',
                        fill: true,
                        lineTension: 0.4,
                        backgroundColor: blueGradient,
                        borderColor: 'rgba(0, 122, 255, 1)',
                        radius: 0,
                        hoverRadius: 0,
                        pointHitRadius: 100,
                        data: borrowRates.length
                            ? convertArray(borrowRates)
                            : [],
                        borderWidth: 2,
                        opacity: 1,
                        hidden: false,
                    },
                    {
                        label: 'Lend yield',
                        fill: true,
                        lineTension: 0.4,
                        backgroundColor: purpleGradient,
                        borderColor: 'rgba(145, 59, 175, 1)',
                        radius: 0,
                        hoverRadius: 0,
                        pointHitRadius: 100,
                        data: lendingRates.length
                            ? convertArray(lendingRates)
                            : [],
                        borderWidth: 2,
                        opacity: 0.1,
                        hidden: false,
                    },
                    {
                        label: 'Mid Rate',
                        fill: false,
                        lineTension: 0.4,
                        backgroundColor: yellowGradient,
                        borderColor: 'rgba(242, 109, 79, 1)',
                        radius: 0,
                        hoverRadius: 0,
                        pointHitRadius: 100,
                        data: midRate.length ? convertArray(midRate) : [],
                        borderWidth: 2,
                        opacity: 1,
                        hidden: false,
                    },
                ],
            };
            setLineData(graphData);
        }
        updateGraph();
    }, [borrowRates, lendingRates, midRate, labels]);

    return (
        <StyledYieldCurveContainer>
            {/* <StyledYieldCurveInfo>
		<Title>FIL Yield Curve</Title>
		<StyledTermsContainer>
			<Terms/>
		</StyledTermsContainer>
		</StyledYieldCurveInfo> */}
            <Line data={lineData} options={chartOptions} />
        </StyledYieldCurveContainer>
    );
}

const StyledYieldCurveContainer = styled.div`
    display: flex;
    flex-direction: column;
    padding-top: ${props => props.theme.spacing[3] - 1}px;
    padding-bottom: ${props => props.theme.spacing[3] - 1}px;
    padding-left: ${props => props.theme.spacing[3] - 1}px;
    padding-right: ${props => props.theme.spacing[3] - 1}px;
`;

const StyledYieldCurveInfo = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding-top: ${props => props.theme.spacing[3]}px;
    padding-bottom: ${props => props.theme.spacing[3]}px;
    padding-left: ${props => props.theme.spacing[3]}px;
    padding-right: ${props => props.theme.spacing[3]}px;
`;

const StyledTermsContainer = styled.div`
    width: 40%;
`;
