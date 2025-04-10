import type { Meta, StoryFn } from '@storybook/react';
import { Rate } from 'src/utils';
import BarChart from './BarChart';
import { options } from './constants';

const ratesArr = [
    10444.01, 12320.02, 24330.015, 33260.018, 22320.02, 12340.022, 11230.025,
];
const ratesArr2 = [
    1110.01, 14230.02, 3330.015, 2360.018, 320.02, 1230.022, 1140.025,
];
const ratesArr3 = [2320.01, 11341.02, 0.015, 0.018, 0.02, 0.022, 0.025];

export default {
    title: 'Molecules/BarChart',
    component: BarChart,
    args: {
        rates: [
            ratesArr.map(value => new Rate(value)),
            ratesArr2.map(value => new Rate(value)),
            ratesArr3.map(value => new Rate(value)),
        ],
        maturityList: ['MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP'],
        options,
    },
} as Meta<typeof BarChart>;

const Template: StoryFn<typeof BarChart> = args => {
    return (
        <div className='h-[400px] w-[800px]'>
            <BarChart {...args} />
        </div>
    );
};

export const Default = Template.bind({});
export const EmptyData = Template.bind({});
EmptyData.args = {
    rates: [],
};
