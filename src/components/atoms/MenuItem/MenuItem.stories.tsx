import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import type { Meta, StoryFn } from '@storybook/react';
import SF from 'src/assets/icons/SF-KO.svg';
import { MenuItem } from './MenuItem';

export default {
    title: 'Atoms/MenuItem',
    component: MenuItem,
    args: {
        text: 'Example',
        icon: <SF className='h-5 w-5 rounded-full ' />,
        badge: <ArrowTopRightOnSquareIcon className='h-4 w-4 text-slateGray' />,
        link: 'https://secured.finance/',
    },
} as Meta<typeof MenuItem>;

const Template: StoryFn<typeof MenuItem> = args => (
    <div>
        <MenuItem {...args} />
    </div>
);

export const Default = Template.bind({});
