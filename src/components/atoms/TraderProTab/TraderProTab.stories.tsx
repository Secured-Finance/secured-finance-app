import type { Meta, StoryFn } from '@storybook/react';
import { TraderProTab } from './';

export default {
    title: 'Atoms/TraderProTab',
    component: TraderProTab,
    args: {
        text: 'Trader Pro',
        onClick: () => {},
    },
} as Meta<typeof TraderProTab>;

const Template: StoryFn<typeof TraderProTab> = args => (
    <TraderProTab {...args} />
);

export const Default = Template.bind({});
