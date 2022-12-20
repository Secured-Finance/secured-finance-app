import { ComponentMeta, ComponentStory } from '@storybook/react';
import { OrderHistoryTable } from './OrderHistoryTable';

export default {
    title: 'Atoms/TradeHistoryTable',
    component: OrderHistoryTable,
    args: {
        data: [],
    },
} as ComponentMeta<typeof OrderHistoryTable>;

const Template: ComponentStory<typeof OrderHistoryTable> = args => (
    <OrderHistoryTable {...args} />
);

export const Default = Template.bind({});
