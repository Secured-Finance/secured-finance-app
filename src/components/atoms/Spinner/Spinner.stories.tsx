import type { Meta, StoryFn } from '@storybook/react';
import { Spinner } from './Spinner';

export default {
    title: 'Atoms/Spinner',
    component: Spinner,
    args: {},
} as Meta<typeof Spinner>;

const Template: StoryFn<typeof Spinner> = () => <Spinner />;

export const Default = Template.bind({});
