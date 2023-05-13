import { ComponentMeta, ComponentStory } from '@storybook/react';
import { MarketDashboardTable } from './MarketDashboardTable';

export default {
    title: 'Molecules/MarketDashboardTable',
    component: MarketDashboardTable,
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
} as ComponentMeta<typeof MarketDashboardTable>;

const Template: ComponentStory<typeof MarketDashboardTable> = args => (
    <MarketDashboardTable {...args} />
);

export const Default = Template.bind({});
