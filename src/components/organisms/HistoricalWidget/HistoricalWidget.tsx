import clsx from 'clsx';
import { RadioButton } from 'src/components/atoms';
import {
    HistoricalChart,
    ITradingData,
} from 'src/components/molecules/HistoricalChart';

type TOptions = { label: string; value: string };

interface THistoricalWidgetProps {
    className?: string;
    timeScales: TOptions[];
    chartType: TOptions[];
    data: ITradingData[];
    selectTimeScale: string;
    selectChartType: string;
    onTimeScaleChange: (value: string, type: string) => void;
    onChartTypeChange: (value: string, type: string) => void;
}

export const HistoricalWidget = ({
    className,
    timeScales,
    selectTimeScale,
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
            <div className='flex justify-between border-b border-t border-neutral-2 bg-[#292D3F99] p-4'>
                <RadioButton
                    options={timeScales}
                    value={selectTimeScale}
                    onChange={(time: string) =>
                        onTimeScaleChange(time, selectChartType)
                    }
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
