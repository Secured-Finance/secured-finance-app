import { Meta, StoryFn } from '@storybook/react';
import { Alert } from './Alert';
import { FIGMA_STORYBOOK_LINK } from './constants';
import { AlertSeverity } from './types';

export default {
    title: 'Molecules/Alert',
    component: Alert,
    args: {
        title: 'Alert',
        severity: AlertSeverity.Info,
    },
    argTypes: {
        subtitle: { control: 'text' },
        severity: { control: 'radio', options: Object.values(AlertSeverity) },
    },
    parameters: {
        viewport: {
            disable: true,
        },
        design: {
            type: 'figma',
            url: FIGMA_STORYBOOK_LINK,
        },
    },
} as Meta<typeof Alert>;

const Template: StoryFn<typeof Alert> = args => <Alert {...args} />;

export const Info = Template.bind({});

export const Error = Template.bind({});
Error.args = {
    severity: AlertSeverity.Error,
};

export const Warning = Template.bind({});
Warning.args = {
    severity: AlertSeverity.Warning,
};

export const Success = Template.bind({});
Success.args = {
    severity: AlertSeverity.Success,
};

export const WithSubtitle = Template.bind({});
WithSubtitle.args = {
    title: 'Alert',
    subtitle:
        'Interactively monetize corporate alignments and fully tested niche markets.',
};
