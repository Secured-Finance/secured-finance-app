import type { Meta, StoryFn } from '@storybook/react';
import { useState } from 'react';
import {
    graphTypeOptions,
    timeScales,
    tradingData,
} from 'src/stories/mocks/historicalchart';
import { HistoricalWidget } from './HistoricalWidget';

export default {
    title: 'Organisms/HistoricalWidget',
    component: HistoricalWidget,
    args: {
        timeScales: timeScales,
        chartType: graphTypeOptions,
        data: tradingData.map(item => {
            return {
                time: item[0],
                open: item[1],
                high: item[2],
                low: item[3],
                close: item[4],
                vol: item[5],
            };
        }),
    },
    argTypes: {},
} as Meta<typeof HistoricalWidget>;

const Template: StoryFn<typeof HistoricalWidget> = args => {
    const [time, setTime] = useState('4H');
    const [graph, setGraph] = useState('VOL');
    return (
        <HistoricalWidget
            {...args}
            selectChartType={graph}
            selectTimeScale={time}
            onChartTypeChange={(_: string, type: string) => {
                setGraph(type);
            }}
            onTimeScanleChange={(value: string) => {
                setTime(value);
            }}
        />
    );
};

export const Default = Template.bind({});
