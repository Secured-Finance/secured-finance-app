import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { defaults, Line } from 'react-chartjs-2';
import { useRates } from 'src/hooks/useRates';
import theme from 'src/theme';
import styled from 'styled-components';
import { chartOptions } from './chartOptions';

const labels = ['0', '3m', '6m', '1y', '2y', '3y', '5y'];

const useHasChanged = <T extends Array<unknown>>(val: T) => {
    const prevVal = usePrevious(val);

    return !(
        prevVal &&
        val &&
        prevVal.length === val.length &&
        prevVal.every((v, i) => v === val[i])
    );
};

const usePrevious = <T extends Array<unknown>>(value: T) => {
    const ref = useRef<T>();
    useEffect(() => {
        ref.current = value;
    });
    return ref.current;
};

export function YieldCurve() {
    const [lineData, setLineData] = useState({});

    const borrowRates = useRates('FIL', 0);
    const lendingRates = useRates('FIL', 1);
    const midRate = useRates('FIL', 2);

    const hasAnyRatesChanged = useHasChanged([
        ...borrowRates,
        ...lendingRates,
        ...midRate,
    ]);

    const canvas = useRef(document.createElement('canvas'));

    const [blueGradient, yellowGradient, purpleGradient] = useMemo(() => {
        defaults.global.defaultFontColor = theme.colors.cellKey;
        canvas.current.id = 'yieldCurve';
        const ctx: CanvasRenderingContext2D = canvas.current.getContext('2d');
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

        return [blueGradient, yellowGradient, purpleGradient];
    }, []);

    const blueRef = useRef(blueGradient);
    const yellowRef = useRef(yellowGradient);
    const purpleRef = useRef(purpleGradient);

    const convertArray = useCallback((array: Array<number>) => {
        if (array.length === 0) {
            return [];
        }

        const newArray = array.slice();
        newArray.unshift(0);
        return newArray.map(r => r / 100);
    }, []);

    const graphData = useMemo(() => {
        return {
            labels: labels,
            datasets: [
                {
                    label: 'Borrow yield',
                    fill: true,
                    lineTension: 0.4,
                    backgroundColor: blueRef.current,
                    borderColor: 'rgba(0, 122, 255, 1)',
                    radius: 0,
                    hoverRadius: 0,
                    pointHitRadius: 100,
                    data: convertArray(borrowRates),
                    borderWidth: 2,
                    opacity: 1,
                    hidden: false,
                },
                {
                    label: 'Lend yield',
                    fill: true,
                    lineTension: 0.4,
                    backgroundColor: purpleRef.current,
                    borderColor: 'rgba(145, 59, 175, 1)',
                    radius: 0,
                    hoverRadius: 0,
                    pointHitRadius: 100,
                    data: convertArray(lendingRates),
                    borderWidth: 2,
                    opacity: 0.1,
                    hidden: false,
                },
                {
                    label: 'Mid Rate',
                    fill: false,
                    lineTension: 0.4,
                    backgroundColor: yellowRef.current,
                    borderColor: 'rgba(242, 109, 79, 1)',
                    radius: 0,
                    hoverRadius: 0,
                    pointHitRadius: 100,
                    data: convertArray(midRate),
                    borderWidth: 2,
                    opacity: 1,
                    hidden: false,
                },
            ],
        };
    }, [borrowRates, convertArray, lendingRates, midRate]);

    useEffect(() => {
        if (hasAnyRatesChanged) {
            setLineData(graphData);
        }
    }, [graphData, hasAnyRatesChanged]);

    return (
        <StyledYieldCurveContainer>
            {lineData ? <Line data={lineData} options={chartOptions} /> : null}
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
