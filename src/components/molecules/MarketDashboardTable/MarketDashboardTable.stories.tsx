import { ComponentMeta, ComponentStory } from '@storybook/react';
import { MarketDashboardTable } from './MarketDashboardTable';

export default {
    title: 'Molecules/MarketDashboardTable',
    component: MarketDashboardTable,
    args: {
        values: ['$560M', '$485M', '$1.2B', '4'],
    },
} as ComponentMeta<typeof MarketDashboardTable>;

const Template: ComponentStory<typeof MarketDashboardTable> = args => (
    <MarketDashboardTable {...args} />
);

export const Default = Template.bind({});

export const NoWalletConnected = Template.bind({});
NoWalletConnected.args = {
    values: [],
};
