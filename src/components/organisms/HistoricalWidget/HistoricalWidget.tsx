import classNames from 'classnames';
import { RadioButton } from 'src/components/atoms';
import {
    HistoricalChart,
    TradingData,
} from 'src/components/molecules/HistoricalChart';

type TOpions = { label: string; value: string };

interface THistoricalWidgetProps {
    className?: string;
    timeScales: TOpions[];
    chartType: TOpions[];
    data: TradingData[];
    selectTimeScale: string;
    selectChartType: string;
    onTimeScanleChange: (value: string, type: string) => void;
    onChartTypeChange: (value: string, type: string) => void;
}

export const HistoricalWidget = ({
    className,
    timeScales,
    selectTimeScale,
    chartType,
    data,
    selectChartType,
    onTimeScanleChange,
    onChartTypeChange,
}: THistoricalWidgetProps) => {
    return (
        <div
            className={classNames({
                className,
            })}
        >
            <div className='flex justify-between border-b border-t border-neutral-2 bg-[#292D3F99] p-4'>
                <RadioButton
                    options={timeScales}
                    value={selectTimeScale}
                    onChange={(time: string) =>
                        onTimeScanleChange(time, selectChartType)
                    }
                />
                <RadioButton
                    options={chartType}
                    value={selectChartType}
                    onChange={(type: string) =>
                        onChartTypeChange(selectTimeScale, type)
                    }
                />
            </div>
            <HistoricalChart data={data} />
        </div>
    );
};
