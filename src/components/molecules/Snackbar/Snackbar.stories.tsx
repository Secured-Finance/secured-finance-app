import type { Meta, StoryFn } from '@storybook/react';
import { useState } from 'react';
import { Button } from 'src/components/atoms';
import { Snackbar } from './Snackbar';
import { SnackbarVariants } from './types';

export default {
    title: 'Molecules/Snackbar',
    component: Snackbar,
    args: {
        title: 'Alert title',
        message:
            'Interactively monetize corporate alignments and fully tested niche markets.',
        duration: 50000,
    },
} as Meta<typeof Snackbar>;

const Template: StoryFn<typeof Snackbar> = args => {
    const [open, setOpen] = useState<boolean>(false);

    return (
        <div>
            <Button onClick={() => setOpen(true)}>Open</Button>
            <Snackbar {...args} open={open} handleOpen={setOpen} />
        </div>
    );
};

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
