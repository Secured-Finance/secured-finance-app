import { withToaster } from '.storybook/decorators';
import type { Meta, StoryFn } from '@storybook/react';
import { within } from '@storybook/testing-library';
import { Button } from 'src/components/atoms';
import { useToast } from 'src/components/ui/use-toast';
import { Snackbar } from './Snackbar';
import { SnackbarVariants } from './types';

const TEMP_DURATION = 100000;

export default {
    title: 'Molecules/Snackbar',
    component: Snackbar,
    args: {
        title: 'Alert title',
        message:
            'Interactively monetize corporate alignments and fully tested niche markets.',
        variant: SnackbarVariants.Alert,
    },
    decorators: [withToaster],
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        canvas.getByRole('button', { name: 'Show Snackbar' }).click();
    },
} as Meta<typeof Snackbar>;

const Template: StoryFn<typeof Snackbar> = args => {
    const { toast } = useToast();

    return (
        <Button
            onClick={() =>
                toast({
                    title: args.title as string,
                    description: args.message,
                    variant: args.variant,
                    duration: TEMP_DURATION,
                })
            }
        >
            Show Snackbar
        </Button>
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
