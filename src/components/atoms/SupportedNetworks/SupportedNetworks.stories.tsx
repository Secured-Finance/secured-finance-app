import { Meta, StoryFn } from '@storybook/react';
import { SupportedNetworks } from './SupportedNetworks';

export default {
    title: 'Atoms/SupportedNetworks',
    component: SupportedNetworks,
    args: {},
} as Meta<typeof SupportedNetworks>;

const Template: StoryFn<typeof SupportedNetworks> = () => (
    <div className='text-white'>
        <SupportedNetworks />
    </div>
);

export const Default = Template.bind({});
