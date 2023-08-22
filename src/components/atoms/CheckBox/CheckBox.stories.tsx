import type { Meta, StoryFn } from '@storybook/react';
import { CheckBox } from './CheckBox';

export default {
    title: 'Atoms/CheckBox',
    component: CheckBox,
    args: {
        children: <div className='text-white'>Check me</div>,
        handleToggle: () => {},
    },
} as Meta<typeof CheckBox>;

const Template: StoryFn<typeof CheckBox> = args => <CheckBox {...args} />;

export const Default = Template.bind({});
