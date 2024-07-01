import type { Meta, StoryFn } from '@storybook/react';
import { ConnectWalletDialog } from './ConnectWalletDialog';

export default {
    title: 'Organism/ConnectWalletDialog',
    component: ConnectWalletDialog,
    args: {
        isOpen: true,
        onClose: () => {},
    },
} as Meta<typeof ConnectWalletDialog>;

const Template: StoryFn<typeof ConnectWalletDialog> = args => {
    return <ConnectWalletDialog {...args} />;
};

export const Default = Template.bind({});
