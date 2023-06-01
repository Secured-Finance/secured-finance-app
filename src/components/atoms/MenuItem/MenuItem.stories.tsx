import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import SF from 'src/assets/icons/SF-KO.svg';
import { MenuItem } from './MenuItem';

export default {
    title: 'Atoms/MenuItem',
    component: MenuItem,
    args: {
        text: 'Example',
        icon: <SF className='h-6 w-6 rounded-full ' />,
        badge: <ArrowTopRightOnSquareIcon className='h-4 w-4 text-slateGray' />,
        link: 'https://secured.finance/',
    },
} as ComponentMeta<typeof MenuItem>;

const Template: ComponentStory<typeof MenuItem> = args => (
    <div>
        <MenuItem {...args} />
    </div>
);

export const Default = Template.bind({});
