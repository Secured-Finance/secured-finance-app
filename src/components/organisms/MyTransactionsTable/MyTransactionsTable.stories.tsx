import { ComponentMeta, ComponentStory } from '@storybook/react';
import { transactions } from 'src/stories/mocks/fixtures';
import { MyTransactionsTable } from './MyTransactionsTable';

export default {
    title: 'Organism/MyTransactionsTable',
    component: MyTransactionsTable,
    args: {
        data: transactions,
    },
} as ComponentMeta<typeof MyTransactionsTable>;

const Template: ComponentStory<typeof MyTransactionsTable> = args => (
    <MyTransactionsTable {...args} />
);

export const Default = Template.bind({});
