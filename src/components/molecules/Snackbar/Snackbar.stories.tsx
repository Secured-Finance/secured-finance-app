import type { Meta, StoryFn } from '@storybook/react';
import { Snackbar } from './Snackbar';
import { SnackbarVariants } from './types';
export default {
    title: 'Molecules/Snackbar',
    component: Snackbar,
    args: {
        title: 'Alert title',
        message:
            'Interactively monetize corporate alignments and fully tested niche markets. ',
        show: true,
    },
} as Meta<typeof Snackbar>;

const Template: StoryFn<typeof Snackbar> = args => <Snackbar {...args} />;

export const Default = Template.bind({});

export const Blue = Template.bind({});
Blue.args = {
    variant: SnackbarVariants.Blue,
};

export const Success = Template.bind({});
Success.args = {
    variant: SnackbarVariants.Success,
};

export const Alert = Template.bind({});
Alert.args = {
    variant: SnackbarVariants.Alert,
};

export const Neutral = Template.bind({});
Neutral.args = {
    variant: SnackbarVariants.Neutral,
};
