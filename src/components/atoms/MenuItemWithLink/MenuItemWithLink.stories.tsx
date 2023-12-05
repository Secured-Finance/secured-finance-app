import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import type { Meta, StoryFn } from '@storybook/react';
import SF from 'src/assets/icons/SF-KO.svg';
import { MenuItemWithLink } from './MenuItemWithLink';

export default {
    title: 'Atoms/MenuItemWithLink',
    component: MenuItemWithLink,
    args: {
        text: 'Example',
        icon: <SF className='h-5 w-5 rounded-full ' />,
        badge: <ArrowTopRightOnSquareIcon className='h-4 w-4 text-slateGray' />,
        link: 'https://secured.finance/',
    },
} as Meta<typeof MenuItemWithLink>;

const Template: StoryFn<typeof MenuItemWithLink> = args => (
    <MenuItemWithLink {...args} />
);

export const Default = Template.bind({});
