import type { Meta, StoryFn } from '@storybook/react';
import { tradingData } from 'src/stories/mocks/historicalchart';
import { HistoricalChart } from '.';

const renderData = tradingData.map(item => {
    return {
        time: item[0],
        open: item[1],
        high: item[2],
        low: item[3],
        close: item[4],
        vol: item[5],
    };
});

export default {
    title: 'Molecules/HistoricalChart',
    component: HistoricalChart,
    args: {
        className: 'font-bold w-[800px]',
        data: renderData,
    },
} as Meta<typeof HistoricalChart>;

const Template: StoryFn<typeof HistoricalChart> = args => (
    <HistoricalChart {...args} />
);

export const Default = Template.bind({});
