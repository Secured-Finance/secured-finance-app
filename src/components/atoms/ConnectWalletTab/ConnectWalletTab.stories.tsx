import { ComponentMeta, ComponentStory } from '@storybook/react';
import { ConnectWalletTab } from '.';

export default {
    title: 'Atoms/ConnectWalletTab',
    component: ConnectWalletTab,
    parameters: {
        chromatic: { disableSnapshot: false },
    },
} as ComponentMeta<typeof ConnectWalletTab>;

const Template: ComponentStory<typeof ConnectWalletTab> = () => (
    <ConnectWalletTab />
);

export const Default = Template.bind({});
