import { withSnackbar } from '.storybook/decorators';
import type { Meta, StoryFn } from '@storybook/react';
import { Snackbar } from './Snackbar';

export default {
    title: 'Molecules/Snackbar',
    component: Snackbar,
    decorators: [withSnackbar],
} as Meta<typeof Snackbar>;

const Template: StoryFn<typeof Snackbar> = args => <Snackbar {...args} />;

export const Default = Template.bind({});
