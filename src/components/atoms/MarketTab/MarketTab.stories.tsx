import type { Meta, StoryFn } from '@storybook/react';
import { MarketTab } from '.';

export default {
    title: 'Atoms/MarketTab',
    component: MarketTab,
    args: {
        name: '24h Volume',
        value: 10000,
    },
} as Meta<typeof MarketTab>;

const Template: StoryFn<typeof MarketTab> = args => <MarketTab {...args} />;

export const Default = Template.bind({});
