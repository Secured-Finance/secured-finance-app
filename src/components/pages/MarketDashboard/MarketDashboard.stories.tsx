import { ComponentMeta, ComponentStory } from '@storybook/react';
import {
    WithAppLayout,
    WithWalletProvider,
} from 'src/../.storybook/decorators';
import { MarketDashboard } from './MarketDashboard';

export default {
    title: 'Pages/MarketDashboard',
    component: MarketDashboard,
    args: {},
    decorators: [WithAppLayout, WithWalletProvider],
} as ComponentMeta<typeof MarketDashboard>;

const Template: ComponentStory<typeof MarketDashboard> = () => {
    return <MarketDashboard />;
};

export const Default = Template.bind({});

export const ConnectedToWallet = Template.bind({});
ConnectedToWallet.parameters = {
    connected: true,
};
