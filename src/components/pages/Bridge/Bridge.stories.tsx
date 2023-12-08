import { Meta, StoryFn } from '@storybook/react';
import { Bridge } from './Bridge';

export default {
    title: 'Pages/Bridge',
    component: Bridge,
    args: {},
    parameters: {
        chromatic: { delay: 8000 },
    },
} as Meta<typeof Bridge>;

const Template: StoryFn<typeof Bridge> = () => <Bridge />;

export const Default = Template.bind({});
