import { TooltipItem, TooltipModel } from 'chart.js';
import { useEffect } from 'react';
import { timeScaleMapping } from 'src/components/molecules/TimeScaleSelector/constants';

export const useTooltipVisibility = (
    isMaximized: boolean,
    showOnMount = false
) => {
    useEffect(() => {
        const tooltips = [
            document.getElementById('chart-tooltip-line'),
            document.getElementById('chart-tooltip-bar'),
        ];
        tooltips.forEach(tooltip => {
            if (tooltip) {
                tooltip.style.opacity = showOnMount ? '1' : '0';
            }
        });
        document.body.style.overflow = isMaximized ? 'hidden' : 'scroll';
    }, [isMaximized, showOnMount]);
};

export function createTooltipElement(
    id: string,
    minWidth: string,
    isMaximised: boolean
): HTMLDivElement {
    let tooltipEl = document.getElementById(id) as HTMLDivElement | null;

    if (!tooltipEl) {
        tooltipEl = document.createElement('div');
        tooltipEl.id = id;
        document.body.appendChild(tooltipEl);
    }

    tooltipEl.classList.remove('p-2', 'p-3', 'text-xs', 'text-sm');
    tooltipEl.classList.add(
        'border',
        'border-neutral-400',
        'bg-neutral-900',
        'bg-opacity-60',
        `${isMaximised ? 'p-3' : 'p-2'}`,
        'rounded-[10px]',
        'text-neutral-300',
        `${isMaximised ? 'text-sm' : 'text-xs'}`,
        'absolute',
        'ml-[-40px]',
        `desktop:min-w-[${minWidth}px]`,
        `w-[${Number(minWidth) - 20}px]`,
        'pointer-events-none',
        'whitespace-nowrap'
    );

    return tooltipEl;
}

export const generateTooltipContent = (
    tooltip: TooltipModel<'line'>,
    selectedTimeScales: { label: string; value: string }[]
) => {
    const lineContentEl = document.createElement('div');
    const barContentEl = document.createElement('div');

    const timeScaleOrder = ['30M', '1H', '4H', '1D', '3D', '1W', '1MTH'];
    const currentYieldDataPoint = tooltip.dataPoints[0];
    const otherDataPoints = tooltip.dataPoints.slice(1);
    const sortedDataPoints = otherDataPoints.sort((a, b) => {
        const scaleA = selectedTimeScales[a.datasetIndex].label;
        const scaleB = selectedTimeScales[b.datasetIndex].label;
        return timeScaleOrder.indexOf(scaleA) - timeScaleOrder.indexOf(scaleB);
    });

    const orderedDataPoints = [currentYieldDataPoint, ...sortedDataPoints];

    orderedDataPoints.forEach((dataPoint: TooltipItem<'line'>, i: number) => {
        const scale = selectedTimeScales[dataPoint.datasetIndex];
        if (!scale) return;

        const formattedValue = Number(
            dataPoint.formattedValue.replace(/,/g, '')
        );

        // Line content
        const lineRow = document.createElement('div');
        lineRow.classList.add('flex', 'justify-between', 'gap-8');

        const lineLabel = document.createElement('span');
        lineLabel.classList.add('text-neutral-300', 'font-numerical');
        lineLabel.textContent =
            scale.label === 'Current Yield'
                ? 'Current APR:'
                : `${timeScaleMapping[scale.label]} Ago:`;

        const lineValue = document.createElement('span');
        lineValue.classList.add('text-neutral-50', 'font-numerical');
        lineValue.textContent = `${formattedValue.toFixed(2)}%`;

        lineRow.appendChild(lineLabel);
        lineRow.appendChild(lineValue);
        lineContentEl.appendChild(lineRow);

        // Bar content
        if (i !== 0) {
            const value =
                Number(tooltip.dataPoints[0].formattedValue.replace(/,/g, '')) -
                formattedValue;

            const barRow = document.createElement('div');
            barRow.classList.add('flex', 'justify-between', 'gap-4');

            const barLabel = document.createElement('span');
            barLabel.classList.add('text-neutral-300', 'font-numerical');
            barLabel.textContent = `vs ${timeScaleMapping[scale.label]}:`;

            const barValue = document.createElement('span');
            barValue.classList.add('font-numerical');
            barValue.classList.add(
                value < 0 ? 'text-[#FF9FAE]' : 'text-[#AAE8B0]'
            );
            barValue.textContent = `${value >= 0 ? '+' : '-'}${value.toFixed(
                2
            )}%`;

            barRow.appendChild(barLabel);
            barRow.appendChild(barValue);
            barContentEl.appendChild(barRow);
        }
    });

    return { lineContent: lineContentEl, barContent: barContentEl };
};

export const cloneAndAppend = (
    element: HTMLElement | null,
    refToUse: React.RefObject<HTMLDivElement>,
    clonedElements: HTMLElement[]
) => {
    if (!element || !refToUse.current) return;

    const clonedTooltip = element.cloneNode(true) as HTMLElement;
    refToUse.current.appendChild(clonedTooltip);
    clonedElements.push(clonedTooltip);

    const { top: origTop, left: origLeft } = element.getBoundingClientRect();
    const { top: parentTop, left: parentLeft } =
        refToUse.current.getBoundingClientRect();

    clonedTooltip.style.position = 'absolute';
    clonedTooltip.style.top = `${origTop - parentTop}px`;
    clonedTooltip.style.left = `${origLeft - parentLeft + 40}px`;
    clonedTooltip.style.opacity = '0';
};

export const positionElement = (el: HTMLElement, left: number, top: number) => {
    el.style.opacity = '1';
    el.style.left = `${left}px`;
    el.style.top = `${top}px`;
};
