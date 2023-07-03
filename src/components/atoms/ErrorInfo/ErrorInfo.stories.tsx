import { ComponentMeta, ComponentStory } from '@storybook/react';
import { ErrorInfo } from './ErrorInfo';

export default {
    title: 'Atoms/ErrorInfo',
    component: ErrorInfo,
    args: {
        errorMessage: 'This is an error',
        showError: true,
    },
} as ComponentMeta<typeof ErrorInfo>;

const Template: ComponentStory<typeof ErrorInfo> = args => (
    <ErrorInfo {...args} />
);

export const Default = Template.bind({});

export const LeftAlignedError = Template.bind({});
LeftAlignedError.args = {
    align: 'left',
};
