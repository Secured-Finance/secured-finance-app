import { ComponentMeta, ComponentStory } from '@storybook/react';
import { activeOrders } from 'src/stories/mocks/fixtures';
import { OpenOrderTable } from './OpenOrderTable';

export default {
    title: 'Organism/OpenOrderTable',
    component: OpenOrderTable,
    args: {
        data: activeOrders,
    },
} as ComponentMeta<typeof OpenOrderTable>;

const Template: ComponentStory<typeof OpenOrderTable> = args => (
    <OpenOrderTable {...args} />
);

export const Default = Template.bind({});
