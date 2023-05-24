import { ComponentMeta, ComponentStory } from '@storybook/react';
import { HeaderTable } from './HeaderTable';

export default {
    title: 'Molecules/HeaderTable',
    component: HeaderTable,
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
    parameters: {
        delay: 3000,
    },
} as ComponentMeta<typeof HeaderTable>;

const Template: ComponentStory<typeof HeaderTable> = args => (
    <HeaderTable {...args} />
);

export const Default = Template.bind({});
