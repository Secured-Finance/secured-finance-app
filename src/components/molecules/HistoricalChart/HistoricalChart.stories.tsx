import type { Meta, StoryFn } from '@storybook/react';
import { tradingData } from 'src/stories/mocks/historicalchart';
import { mockTransactionCandleStick } from 'src/stories/mocks/queries';
import { HistoricalChart } from '.';

export default {
    title: 'Molecules/HistoricalChart',
    component: HistoricalChart,
    args: {
        className: 'font-bold w-[600px]',
        data: tradingData,
    },
    parameters: {
        apolloClient: {
            mocks: [...mockTransactionCandleStick],
        },
    },
} as Meta<typeof HistoricalChart>;

const Template: StoryFn<typeof HistoricalChart> = args => (
    <div className='w-[600px]'>
        <HistoricalChart {...args} />
    </div>
);

export const Default = Template.bind({});
export const NoData = Template.bind({});
NoData.args = {
    data: [],
};
