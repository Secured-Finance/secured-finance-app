import { ComponentMeta, ComponentStory } from '@storybook/react';
import { maturityOptions } from 'src/stories/mocks/fixtures';

import { options } from '../../molecules/LineChart/constants';
import { LineChart } from './';

export default {
    title: 'Molecules/LineChart',
    component: LineChart,
    chromatic: { diffThreshold: 1, delay: 2000 },
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
    parameters: {
        date: {
            tick: true,
        },
    },
} as ComponentMeta<typeof LineChart>;

const Template: ComponentStory<typeof LineChart> = args => {
    return (
        <div style={{ width: 500, height: 350 }}>
            <LineChart {...args} />
        </div>
    );
};

export const Default = Template.bind({});
