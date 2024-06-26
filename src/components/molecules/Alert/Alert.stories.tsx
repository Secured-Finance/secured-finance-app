import { RESPONSIVE_PARAMETERS, VIEWPORTS } from '.storybook/constants';
import { Meta, StoryFn } from '@storybook/react';
import { Alert } from './Alert';
import { FIGMA_STORYBOOK_LINK } from './constants';
import { AlertSeverity } from './types';

export default {
    title: 'Molecules/Alert',
    component: Alert,
    args: {
        title: 'Alert',
    },
    argTypes: {
        subtitle: { control: 'text' },
        severity: { control: 'radio', options: Object.values(AlertSeverity) },
    },
    parameters: {
        ...RESPONSIVE_PARAMETERS,
        chromatic: {
            viewports: [VIEWPORTS.MOBILE, VIEWPORTS.DESKTOP],
        },
        design: {
            type: 'figma',
            url: FIGMA_STORYBOOK_LINK,
        },
    },
} as Meta<typeof Alert>;

const Template: StoryFn<typeof Alert> = args => <Alert {...args} />;

export const Default = Template.bind({});

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

export const Basic = Template.bind({});
Basic.args = {
    severity: AlertSeverity.Basic,
    isShowCloseButton: false,
    title: 'Welcome! Please deposit funds to enable trading.',
};

export const WithSubtitle = Template.bind({});
WithSubtitle.args = {
    title: 'Alert',
    subtitle:
        'Interactively monetize corporate alignments and fully tested niche markets.',
};
