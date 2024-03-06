import type { Meta, StoryFn } from '@storybook/react';
import { tradingData } from 'src/stories/mocks/historicalchart';
import { HistoricalChart } from '.';

export default {
    title: 'Molecules/HistoricalChart',
    component: HistoricalChart,
    args: {
        className: 'font-bold w-[600px]',
        data: tradingData,
    },
} as Meta<typeof HistoricalChart>;

const Template: StoryFn<typeof HistoricalChart> = args => (
    <HistoricalChart {...args} />
);

export const Default = Template.bind({});
export const NoData = Template.bind({});
NoData.args = {
    data: [],
};
