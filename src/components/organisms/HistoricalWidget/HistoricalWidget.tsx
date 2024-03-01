import clsx from 'clsx';
import { RadioButton } from 'src/components/atoms';
import {
    HistoricalChart,
    ITradingData,
} from 'src/components/molecules/HistoricalChart';
import { HistoricalDataIntervals } from 'src/types';

type TOptions = { label: string; value: string };

interface THistoricalWidgetProps {
    className?: string;
    // timeScales: TOptions[];
    chartType: TOptions[];
    data: ITradingData[];
    selectedTimeScale: string;
    selectChartType: string;
    onTimeScaleChange: (value: string) => void;
    onChartTypeChange: (value: string, type: string) => void;
}

const timeScales = Object.entries(HistoricalDataIntervals).map(interval => ({
    label: interval[0],
    value: interval[1],
}));

export const HistoricalWidget = ({
    className,
    // timeScales,
    selectedTimeScale,
    chartType,
    data,
    selectChartType,
    onTimeScaleChange,
    onChartTypeChange,
}: THistoricalWidgetProps) => {
    return (
        <div
            className={clsx({
                className,
            })}
        >
            <div className='flex justify-between border-b border-t border-neutral-2 bg-[#292D3F99] px-4 py-2'>
                <RadioButton
                    options={timeScales}
                    value={selectedTimeScale}
                    onChange={(time: string) => onTimeScaleChange(time)}
                />
                {/* <RadioButton
                    options={chartType}
                    value={selectChartType}
                    onChange={(type: string) =>
                        onChartTypeChange(selectTimeScale, type)
                    }
                /> */}
            </div>
            <HistoricalChart data={data} />
        </div>
    );
};
