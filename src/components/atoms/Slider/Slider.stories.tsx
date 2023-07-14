import type { Meta, StoryFn } from '@storybook/react';
import { Slider } from '.';

export default {
    title: 'Atoms/Slider',
    component: Slider,
    args: {
        onChange: () => {},
    },
} as Meta<typeof Slider>;

const Template: StoryFn<typeof Slider> = args => {
    return (
        <div className='w-80'>
            <Slider {...args} />
        </div>
    );
};

export const Default = Template.bind({});
