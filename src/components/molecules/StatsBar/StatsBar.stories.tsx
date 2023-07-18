import { RESPONSIVE_PARAMETERS, VIEWPORTS } from '.storybook/constants';
import type { Meta, StoryFn } from '@storybook/react';
import { StatsBar } from './StatsBar';

export default {
    title: 'Molecules/StatsBar',
    component: StatsBar,
    args: {
        values: [
            {
                name: 'Digital Assets',
                value: '4',
            },
            {
                name: 'Total Value Locked',
                value: '1.2B',
            },
            {
                name: 'Total Volume',
                value: '356M',
            },
            {
                name: 'Total Users',
                value: '900K',
            },
        ],
    },
    parameters: {
        ...RESPONSIVE_PARAMETERS,
        chromatic: {
            delay: 3000,
            viewports: [VIEWPORTS.MOBILE, VIEWPORTS.TABLET],
        },
    },
} as Meta<typeof StatsBar>;

const Template: StoryFn<typeof StatsBar> = args => <StatsBar {...args} />;

export const Default = Template.bind({});
