import { ComponentMeta, ComponentStory } from '@storybook/react';

import { withWalletProvider } from 'src/../.storybook/decorators';
import { MenuItem } from './MenuItem';
import SF from 'src/assets/icons/SF-KO.svg';
import { ExternalLinkIcon } from '@heroicons/react/outline';

export default {
    title: 'Atoms/MenuItem',
    component: MenuItem,
    args: {
        text: 'Example',
        icon: <SF className='h-6 w-6 rounded-full ' />,
        badge: <ExternalLinkIcon className='h-4 w-4 text-slateGray' />,
        link: 'https://secured.finance/',
    },
    decorators: [withWalletProvider],
} as ComponentMeta<typeof MenuItem>;

const Template: ComponentStory<typeof MenuItem> = args => (
    <div className='ml-[1000px]'>
        <MenuItem {...args} />
    </div>
);

export const Default = Template.bind({});
