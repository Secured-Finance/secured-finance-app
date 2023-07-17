import type { Meta, StoryFn } from '@storybook/react';
import { PercentageSelector } from '.';

export default {
    title: 'Molecules/PercentageSelector',
    component: PercentageSelector,
    args: {
        onClick: () => {},
    },
} as Meta<typeof PercentageSelector>;

const Template: StoryFn<typeof PercentageSelector> = args => (
    <PercentageSelector {...args} />
);

export const Default = Template.bind({});
