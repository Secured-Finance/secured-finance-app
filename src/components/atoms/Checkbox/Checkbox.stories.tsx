import type { Meta, StoryFn } from '@storybook/react';
import { Checkbox } from './Checkbox';

export default {
    title: 'Atoms/Checkbox',
    component: Checkbox,
    args: {
        children: <div className='text-white'>Check me</div>,
        value: false,
        handleToggle: () => {},
    },
} as Meta<typeof Checkbox>;

const Template: StoryFn<typeof Checkbox> = args => <Checkbox {...args} />;

export const Default = Template.bind({});
