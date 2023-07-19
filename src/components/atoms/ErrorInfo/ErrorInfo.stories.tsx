import type { Meta, StoryFn } from '@storybook/react';
import { ErrorInfo } from './ErrorInfo';

export default {
    title: 'Atoms/ErrorInfo',
    component: ErrorInfo,
    args: {
        errorMessage: 'This is an error',
        showError: true,
    },
} as Meta<typeof ErrorInfo>;

const Template: StoryFn<typeof ErrorInfo> = args => <ErrorInfo {...args} />;

export const Default = Template.bind({});

export const LeftAlignedError = Template.bind({});
LeftAlignedError.args = {
    align: 'left',
};
