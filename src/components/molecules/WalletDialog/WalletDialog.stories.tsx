import { ComponentMeta, ComponentStory } from '@storybook/react';
import { WalletDialog } from './WalletDialog';

export default {
    title: 'Components/Molecules/WalletDialog',
    component: WalletDialog,
    args: {
        isOpen: true,
        onClose: () => {},
    },
} as ComponentMeta<typeof WalletDialog>;

const Template: ComponentStory<typeof WalletDialog> = args => (
    <WalletDialog {...args} />
);

export const Primary = Template.bind({});
