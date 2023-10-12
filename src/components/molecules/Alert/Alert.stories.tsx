import { Meta, StoryFn } from '@storybook/react';
import { Alert } from './Alert';

const message = (
    <p className='text-white'>
        Itayose market for WFIL-SEP2025 is now open until June 13, 2023. Place
        Order Now
    </p>
);
export default {
    title: 'Molecules/Alert',
    component: Alert,
    args: {
        severity: 'info',
        children: message,
    },
} as Meta<typeof Alert>;

const Template: StoryFn<typeof Alert> = args => <Alert {...args} />;

export const Default = Template.bind({});

export const Error = Template.bind({});
Error.args = {
    severity: 'error',
};

export const Warning = Template.bind({});
Error.args = {
    severity: 'warning',
};

export const Outlined = Template.bind({});
Outlined.args = {
    severity: 'warning',
    variant: 'outlined',
};
