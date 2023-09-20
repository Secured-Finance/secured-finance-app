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

export const GreenMarketTab = Template.bind({});
GreenMarketTab.args = {
    name: '7977.00',
    value: '25.00% APR',
    variant: 'green-name',
    label: 'Green Market Tab',
};

export const GrayMarketTab = Template.bind({});
GrayMarketTab.args = {
    name: '7977.00',
    value: '25.00% APR',
    variant: 'gray-name',
    label: 'Gray Market Tab',
};
