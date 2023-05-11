import { ComponentMeta, ComponentStory } from '@storybook/react';
import {
    openOrderHistoryList,
    orderHistoryList,
} from 'src/stories/mocks/fixtures';
import { OpenOrderTable } from './OpenOrderTable';

export default {
    title: 'Organism/OpenOrderTable',
    component: OpenOrderTable,
    args: {
        data: orderHistoryList,
    },
} as ComponentMeta<typeof OpenOrderTable>;

const Template: ComponentStory<typeof OpenOrderTable> = args => (
    <OpenOrderTable {...args} />
);

export const Default = Template.bind({});
export const SortContract = Template.bind({});
SortContract.args = {
    data: openOrderHistoryList,
};
