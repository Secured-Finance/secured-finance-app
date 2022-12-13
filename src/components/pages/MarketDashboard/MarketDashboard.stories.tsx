import { ComponentMeta, ComponentStory } from '@storybook/react';
import {
    withAppLayout,
    withAssetPrice,
    withMaturities,
    withWalletProvider,
} from 'src/../.storybook/decorators';
import { MarketDashboard } from './MarketDashboard';

export default {
    title: 'Pages/MarketDashboard',
    component: MarketDashboard,
    chromatic: { pauseAnimationAtEnd: true },
    args: {},
    parameters: { date: { tick: true } },
    decorators: [
        withAppLayout,
        withMaturities,
        withAssetPrice,
        withWalletProvider,
    ],
} as ComponentMeta<typeof MarketDashboard>;

const Template: ComponentStory<typeof MarketDashboard> = () => {
    return <MarketDashboard />;
};

export const Default = Template.bind({});

export const ConnectedToWallet = Template.bind({});
ConnectedToWallet.parameters = {
    connected: true,
};
