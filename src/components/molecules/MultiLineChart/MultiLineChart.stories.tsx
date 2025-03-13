import type { Meta, StoryFn } from '@storybook/react';
import { options } from 'src/components/molecules/MultiLineChart/constants';
import { MaturityListItem } from 'src/components/organisms';
import { maturityOptions } from 'src/stories/mocks/fixtures';
import { MultiLineChart } from '.';

const maturityList: MaturityListItem[] = [];

export default {
    title: 'Molecules/MultiLineChart',
    component: MultiLineChart,
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
                    data: [10, 0, 20, 0, 40, 0, 30, 0],
                    segment: {
                        borderColor: '#3f53d3',
                    },
                },
                {
                    label: 'Borrow',
                    data: [3, 0, 0, 0, 10, 0, 10, 0],
                    segment: {
                        borderColor: '#09a8b7',
                    },
                },
            ],
        },
        options,
        maturityList: maturityList,
        maturity: maturityOptions[0].value,
        handleChartClick: () => {},
    },
} as Meta<typeof MultiLineChart>;

const Template: StoryFn<typeof MultiLineChart> = args => {
    return (
        <div style={{ width: 500, height: 350 }}>
            <MultiLineChart {...args} />
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
