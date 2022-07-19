import { ComponentMeta, ComponentStory } from '@storybook/react';
import { WithWalletProvider } from 'src/../.storybook/decorators';
import { ConnectWalletCard } from '.';

export default {
    title: 'Atoms/ConnectWalletCard',
    component: ConnectWalletCard,
    parameters: {
        chromatic: { disableSnapshot: false },
    },
    decorators: [WithWalletProvider],
} as ComponentMeta<typeof ConnectWalletCard>;

const Template: ComponentStory<typeof ConnectWalletCard> = () => (
    <ConnectWalletCard />
);

export const Default = Template.bind({});
