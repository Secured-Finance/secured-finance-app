import type { Meta, StoryFn } from '@storybook/react';
import { Separator } from './Separator';

export default {
    title: 'Atoms/Separator',
    component: Separator,
    args: {},
    argTypes: {
        color: {
            control: 'select',
            options: [
                'neutral-2',
                'neutral-3',
                'moonGrey',
                'white-10',
                'default',
            ],
        },
        orientation: {
            control: 'select',
            options: ['horizontal', 'vertical'],
        },
    },
} as Meta<typeof Separator>;

const Template: StoryFn<typeof Separator> = args => <Separator {...args} />;

export const Default = Template.bind({});
export const Primary = Template.bind({});
Primary.args = {
    color: 'moonGrey',
    orientation: 'vertical',
};
