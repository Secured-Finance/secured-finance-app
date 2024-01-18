import type { Meta, StoryFn } from '@storybook/react';
import { withWalletProvider } from 'src/../.storybook/decorators';
import { NetworkSelector } from './NetworkSelector';

export default {
    title: 'Molecules/NetworkSelector',
    component: NetworkSelector,
    args: {
        networkName: 'Sepolia',
    },
    argTypes: {
        networkName: { control: 'text' },
    },
    decorators: [withWalletProvider],
} as Meta<typeof NetworkSelector>;

const Template: StoryFn<typeof NetworkSelector> = args => (
    <div className='flex justify-end'>
        <NetworkSelector {...args} />
    </div>
);

export const Default = Template.bind({});
