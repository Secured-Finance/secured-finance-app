import React from 'react';
import { Story, Meta } from '@storybook/react';

import { IconButton, IIconButton } from './';

export default {
    title: 'Components/IconButton',
    component: IconButton,
    argTypes: {
        onClick: { action: 'clicked' },
        withBackground: {
            options: [true, false],
            control: { type: 'boolean' },
        },
    },
} as Meta;

const Template: Story<IIconButton> = args => (
    <IconButton {...args}>Button</IconButton>
);

export const Default = Template.bind({});
Default.args = {
    withBackground: false,
};
