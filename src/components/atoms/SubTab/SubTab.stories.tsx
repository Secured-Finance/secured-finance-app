import type { Meta, StoryFn } from '@storybook/react';
import { SubTab } from '.';

export default {
    title: 'Atoms/SubTab',
    component: SubTab,
    args: {
        text: 'Tab label',
        active: true,
    },
    parameters: {
        viewport: {
            disable: true,
        },
    },
} as Meta<typeof SubTab>;

const Template: StoryFn<typeof SubTab> = args => (
    <div className='max-w-[175px]'>
        <SubTab {...args} />
    </div>
);

export const Default = Template.bind({});
