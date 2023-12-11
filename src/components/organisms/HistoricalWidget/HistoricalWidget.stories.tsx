import type { Meta, StoryFn } from '@storybook/react';
import { useEffect, useState } from 'react';
import {
    graphTypeOptions,
    timeScales,
} from 'src/stories/mocks/historicalchart';
import { HistoricalWidget } from './HistoricalWidget';

export default {
    title: 'Organism/HistoricalWidget',
    component: HistoricalWidget,
    args: {
        timeScales: timeScales,
        chartType: graphTypeOptions,
        data: [],
    },
    argTypes: {},
} as Meta<typeof HistoricalWidget>;

const Template: StoryFn<typeof HistoricalWidget> = args => {
    const [time, setTime] = useState('4h');
    const [graph, setGraph] = useState('VOL');
    const [data, setData] = useState([]);
    const getBSCData = async (time: string, limit = 1000) => {
        const data = await fetch(
            `https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=${time}&limit=${limit}`
        ).then(res => res.json());
        const result = data.map((item: Record<string, string>) => {
            return {
                time: item[0],
                open: item[1],
                high: item[2],
                low: item[3],
                close: item[4],
                vol: item[5],
            };
        });
        setData(result);
    };

    useEffect(() => {
        getBSCData(time);
    }, [time]);

    return (
        <div className='w-[800px]'>
            <HistoricalWidget
                {...args}
                data={data}
                selectChartType={graph}
                selectTimeScale={time}
                onChartTypeChange={(_: string, type: string) => {
                    setGraph(type);
                }}
                onTimeScanleChange={async (value: string) => {
                    setTime(value);
                }}
            />
        </div>
    );
};

export const Default = Template.bind({});
