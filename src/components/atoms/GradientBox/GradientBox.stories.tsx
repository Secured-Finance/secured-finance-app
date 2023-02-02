import { ComponentMeta, ComponentStory } from '@storybook/react';
import { GradientBox } from './GradientBox';

export default {
    title: 'Atoms/GradientBox',
    component: GradientBox,
    args: {},
} as ComponentMeta<typeof GradientBox>;

const Template: ComponentStory<typeof GradientBox> = () => (
    <GradientBox>
        <div className='text-white'>Box</div>
    </GradientBox>
);

export const Default = Template.bind({});
