import type { Meta, StoryFn } from '@storybook/react';
import { maturityOptions } from 'src/stories/mocks/fixtures';
import { options } from '../../molecules/LineChart/constants';
import { LineChart } from './';

export default {
    title: 'Molecules/LineChart',
    component: LineChart,
    chromatic: { pauseAnimationAtEnd: true },
    args: {
        data: {
            labels: [
                'DEC22',
                'MAR23',
                'JUN23',
                'SEP23',
                'DEC23',
                'MAR24',
                'JUN24',
                'SEP24',
            ],
            datasets: [
                {
                    label: 'Borrow',
                    data: [50, 34, 27.37, 22.29, 18, 14.22, 10.81, 8.2],
                },
            ],
        },
        options,
        maturitiesOptionList: maturityOptions,
        maturity: maturityOptions[0].value,
    },
} as Meta<typeof LineChart>;

const Template: StoryFn<typeof LineChart> = args => {
    return (
        <div style={{ width: 500, height: 350 }}>
            <LineChart {...args} />
        </div>
    );
};

export const Default = Template.bind({});
export const Loading = Template.bind({});
Loading.args = {
    data: {
        labels: [
            'DEC22',
            'MAR23',
            'JUN23',
            'SEP23',
            'DEC23',
            'MAR24',
            'JUN24',
            'SEP24',
        ],
        datasets: [
            {
                label: 'Borrow',
                data: [],
            },
        ],
    },
};

export const ZeroCurve = Template.bind({});
ZeroCurve.args = {
    data: {
        labels: [
            'DEC22',
            'MAR23',
            'JUN23',
            'SEP23',
            'DEC23',
            'MAR24',
            'JUN24',
            'SEP24',
        ],
        datasets: [
            {
                label: 'Borrow',
                data: [0, 0, 0, 0, 0, 0, 0, 0],
            },
        ],
    },
};
