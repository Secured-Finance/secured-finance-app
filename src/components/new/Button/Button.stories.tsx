import { Story, Meta } from '@storybook/react';

import { Button, IButton } from './';

export default {
    title: 'Components/Button',
    component: Button,
    argTypes: { onClick: { action: 'clicked' } },
} as Meta;

const Template: Story<IButton> = args => <Button {...args}>Button</Button>;

export const Default = Template.bind({});
Default.args = {
    outline: false,
    disabled: false,
};

export const Outlined = Template.bind({});
Outlined.args = {
    outline: true,
    disabled: false,
};
