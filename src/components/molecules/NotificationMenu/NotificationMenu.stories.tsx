import type { Meta, StoryFn } from '@storybook/react';
import { NotificationMenu } from './NotificationMenu';

const notifications = Array(5).fill(
    'Your position in has been liquidated due to insufficient collateral'
);

export default {
    title: 'Molecules/NotificationMenu',
    component: NotificationMenu,
    args: {
        notifications: notifications,
    },
} as Meta<typeof NotificationMenu>;

const Template: StoryFn<typeof NotificationMenu> = args => (
    <NotificationMenu {...args} />
);

export const Default = Template.bind({});
