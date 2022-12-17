import { ComponentMeta, ComponentStory } from '@storybook/react';
import { withWalletProvider } from 'src/../.storybook/decorators';
import { WalletDialog } from './WalletDialog';

export default {
    title: 'Organism/WalletDialog',
    component: WalletDialog,
    args: {
        isOpen: true,
        onClose: () => {},
    },
    decorators: [withWalletProvider],
} as ComponentMeta<typeof WalletDialog>;

const Template: ComponentStory<typeof WalletDialog> = args => (
    <WalletDialog {...args} />
);

export const Primary = Template.bind({});
