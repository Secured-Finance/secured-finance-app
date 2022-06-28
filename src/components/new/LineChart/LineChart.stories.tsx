import { Meta, Story } from '@storybook/react';
import { LineChart, LineChartProps } from './';
import { options } from './constants';

export default {
    title: 'Components/LineChart',
    component: LineChart,
} as Meta;

const Template: Story<LineChartProps> = args => (
    <div style={{ width: 700 }}>
        <LineChart {...args} />
    </div>
);
export const Default = Template.bind({});
Default.args = {
    title: 'Yield Curve',
    data: {
        labels: [
            'SEP22',
            'DEC22',
            'MAR23',
            'JUN23',
            'SEP23',
            'DEC23',
            'MAR24',
            'JUN24',
        ],
        datasets: [
            {
                label: 'Borrow',
                data: [50, 34, 27.37, 22.29, 18, 14.22, 10.81, 7.667],
            },
            // {
            //     label: 'Lend',
            //     data: [0, 9.2, 10.2, 11.2, 12.2, 14, 15.4],
            // },
            // {
            //     label: 'Spread',
            //     data: [0, 8.1, 9.1, 10.1, 11.1, 13.5, 15.2],
            // },
        ],
    },
    options,
    style: {},
    showLegend: false,
};
