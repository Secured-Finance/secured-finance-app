import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';
import Chip from './Chip';

export default {
    title: 'Components/Atoms/Chip',
    component: Chip,
    args: {
        text: 'Default Chip',
    },
} as ComponentMeta<typeof Chip>;

const Template: ComponentStory<typeof Chip> = args => <Chip {...args} />;
export const Default = Template.bind({});

export const Secondary = Template.bind({});
Secondary.args = {
    text: 'Secondary',
    variant: 'secondary',
    onClick: () => {
        // Do nothing
    },
};
