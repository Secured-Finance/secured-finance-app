import type { Meta, StoryFn } from '@storybook/react';
import NotificationIcon from 'src/assets/icons/notification-icon.svg';
import { Badge } from './Badge';

const badgeContent = (
    <NotificationIcon className='h-5 w-5' data-testid='notificationIcon' />
);

export default {
    title: 'Atoms/Badge',
    component: Badge,
    args: {
        children: badgeContent,
        badgeCount: 5,
    },
} as Meta<typeof Badge>;

const Template: StoryFn<typeof Badge> = args => {
    return <Badge {...args} />;
};

export const Default = Template.bind({});
