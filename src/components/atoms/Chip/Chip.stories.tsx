import type { Meta, StoryFn } from '@storybook/react';
import { Chip } from './Chip';

export default {
    title: 'Atoms/Chip',
    component: Chip,
    args: {
        label: 'Borrow',
    },
    argTypes: {
        label: {
            control: {
                type: 'select',
                options: ['Borrow', 'Lend'],
            },
        },
    },
} as Meta<typeof Chip>;

const Template: StoryFn<typeof Chip> = args => <Chip {...args} />;

export const Default = Template.bind({});
