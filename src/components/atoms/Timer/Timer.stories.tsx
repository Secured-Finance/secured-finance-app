import { Meta, StoryFn } from '@storybook/react';
import { Timer } from './Timer';

export default {
    title: 'Atoms/Timer',
    component: Timer,
    args: {
        targetTime: 0,
    },
} as Meta<typeof Timer>;

const Template: StoryFn<typeof Timer> = args => {
    args.targetTime = Date.now() + 10 * 60 * 60 * 1000;
    return <Timer {...args} />;
};

export const Default = Template.bind({});

export const WithText = Template.bind({});
WithText.args = {
    text: 'Timer',
};
