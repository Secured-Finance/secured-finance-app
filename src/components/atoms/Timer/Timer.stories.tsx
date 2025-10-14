import { Meta, StoryFn } from '@storybook/react';
import { Timer } from './Timer';
import { FINANCIAL_CONSTANTS } from 'src/config/constants';

export default {
    title: 'Atoms/Timer',
    component: Timer,
    args: {
        targetTime: 0,
    },
} as Meta<typeof Timer>;

const Template: StoryFn<typeof Timer> = args => {
    args.targetTime =
        Date.now() + 10 * 60 * 60 * FINANCIAL_CONSTANTS.POINTS_K_THRESHOLD;
    return <Timer {...args} />;
};

export const Default = Template.bind({});

export const WithText = Template.bind({});
WithText.args = {
    text: 'Timer',
};
