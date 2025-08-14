import type { Meta, StoryFn } from '@storybook/react';
import { ScriptableContext } from 'chart.js';
import { maturityOptions } from 'src/stories/mocks/fixtures';
import {
    getCurveGradient,
    options,
} from 'src/components/molecules/LineChart/constants';
import { LineChart } from './';
import { MaturityListItem } from 'src/components/organisms';

const maturityList: MaturityListItem[] = [];

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
                    segment: {
                        borderColor: ctx =>
                            getCurveGradient(
                                ctx as unknown as ScriptableContext<'line'>,
                            ),
                    },
                },
            ],
        },
        options,
        maturityList: maturityList,
        maturity: maturityOptions[0].value,
        handleChartClick: () => {},
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
                segment: {
                    borderColor: ctx =>
                        getCurveGradient(
                            ctx as unknown as ScriptableContext<'line'>,
                        ),
                },
            },
        ],
    },
};
