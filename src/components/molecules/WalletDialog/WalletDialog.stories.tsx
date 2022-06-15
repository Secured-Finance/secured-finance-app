import { ComponentMeta, ComponentStory } from '@storybook/react';
import { WalletDialog } from './WalletDialog';

export default {
    title: 'Components/Molecules/WalletDialog',
    component: WalletDialog,
    args: {
        open: true,
    },
} as ComponentMeta<typeof WalletDialog>;

const Template: ComponentStory<typeof WalletDialog> = args => (
    <WalletDialog open />
);

export const Primary = Template.bind({});
