import { Story, Meta } from '@storybook/react';

import { TextButton, ITextButton } from './';

export default {
    title: 'Components/TextButton',
    component: TextButton,
    argTypes: { onClick: { action: 'clicked' } },
} as Meta;

const Template: Story<ITextButton> = args => (
    <TextButton {...args}>Button</TextButton>
);

export const Default = Template.bind({});
Default.args = {};

export const TwoLinedButton: Story<ITextButton> = args => (
    <div style={{ width: 74 }}>
        <TextButton {...args}>Two lines text</TextButton>
    </div>
);
TwoLinedButton.args = {};
