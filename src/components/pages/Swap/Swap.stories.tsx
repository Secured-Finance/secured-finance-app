import { Meta, StoryFn } from '@storybook/react';
import { Swap } from './Swap';

export default {
    title: 'Pages/Swap',
    component: Swap,
    args: {},
    parameters: {
        chromatic: { delay: 8000 },
    },
} as Meta<typeof Swap>;

const Template: StoryFn<typeof Swap> = () => <Swap />;

export const Default = Template.bind({});
