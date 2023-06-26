import { ComponentMeta, ComponentStory } from '@storybook/react';
import { GradientBox } from './GradientBox';

export default {
    title: 'Atoms/GradientBox',
    component: GradientBox,
    args: {},
} as ComponentMeta<typeof GradientBox>;

const Template: ComponentStory<typeof GradientBox> = args => (
    <GradientBox {...args}>
        <div className='p-5 text-white'>Box</div>
    </GradientBox>
);

export const Default = Template.bind({});
export const Rectangle = Template.bind({});
Rectangle.args = {
    shape: 'rectangle',
};

export const Header = Template.bind({});
Header.args = {
    header: 'Header',
};

export const HighContrast = Template.bind({});
HighContrast.args = {
    variant: 'high-contrast',
};
