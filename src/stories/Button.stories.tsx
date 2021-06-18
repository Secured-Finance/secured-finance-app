import React from 'react';
import { Story, Meta } from '@storybook/react';

import { Button, IButton } from 'src/components/new/Button';

export default {
    title: 'Example/Button',
    component: Button,
} as Meta;

const Template: Story<IButton> = args => <Button {...args}>Button</Button>;

export const Default = Template.bind({});

export const Outlined = Template.bind({});
Outlined.args = {
    outline: true,
};
