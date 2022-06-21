import { ComponentMeta, ComponentStory } from '@storybook/react';
import { Separator } from './Separator';

export default {
    title: 'Atoms/Separator',
    component: Separator,
    args: {},
} as ComponentMeta<typeof Separator>;

const Template: ComponentStory<typeof Separator> = args => <Separator />;

export const Default = Template.bind({});
