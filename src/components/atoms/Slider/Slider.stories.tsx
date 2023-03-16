import { ComponentMeta, ComponentStory } from '@storybook/react';
import { Slider } from '.';

export default {
    title: 'Atoms/Slider',
    component: Slider,
    args: {
        onChange: () => {},
    },
} as ComponentMeta<typeof Slider>;

const Template: ComponentStory<typeof Slider> = args => {
    return (
        <div className='mt-10 w-80'>
            <Slider {...args} />
        </div>
    );
};

export const Default = Template.bind({});
