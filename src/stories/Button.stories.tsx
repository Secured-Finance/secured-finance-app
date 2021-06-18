import React from 'react';
import { Story, Meta } from '@storybook/react';

import { Button, IButton } from 'src/components/new/Button';

export default {
    title: 'Components/Button',
    component: Button,
    argTypes: { onClick: { action: 'clicked' } },
} as Meta;

const Template: Story<IButton> = args => <Button {...args}>Button</Button>;

export const Default = Template.bind({});
Default.args = {
    outline: false,
};

export const Outlined = Template.bind({});
Outlined.args = {
    outline: true,
};
