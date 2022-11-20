import { ComponentMeta, ComponentStory } from '@storybook/react';
import { WithAssetPrice } from 'src/../.storybook/decorators';
import { Slider } from '.';

export default {
    title: 'Atoms/Slider',
    component: Slider,
    args: {
        onChange: () => {},
    },
    decorators: [WithAssetPrice],
} as ComponentMeta<typeof Slider>;

const Template: ComponentStory<typeof Slider> = args => {
    return (
        <div className='w-80'>
            <Slider {...args} />
        </div>
    );
};

export const Default = Template.bind({});
