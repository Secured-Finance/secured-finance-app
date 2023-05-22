import { ComponentMeta, ComponentStory } from '@storybook/react';
import { within } from '@storybook/testing-library';
import {
    withAppLayout,
    withAssetPrice,
    withMaturities,
    withWalletBalances,
    withWalletProvider,
} from 'src/../.storybook/decorators';
import { mobileParameters, tabletParameters } from 'src/../.storybook/preview';
import { mockTrades, mockUserHistory } from 'src/stories/mocks/queries';
import { Landing } from './Landing';

export default {
    title: 'Pages/Landing',
    component: Landing,
    chromatic: { pauseAnimationAtEnd: true },
    decorators: [
        withAppLayout,
        withMaturities,
        withAssetPrice,
        withWalletBalances,
        withWalletProvider,
    ],
    parameters: {
        apolloClient: {
            mocks: [...mockUserHistory, ...mockTrades],
        },
    },
} as ComponentMeta<typeof Landing>;

const Template: ComponentStory<typeof Landing> = () => {
    return <Landing />;
};

export const Default = Template.bind({});
export const MobileDefault = Template.bind({});
MobileDefault.parameters = mobileParameters;

export const TabletDefault = Template.bind({});
TabletDefault.parameters = tabletParameters;

export const ConnectedToWallet = Template.bind({});
ConnectedToWallet.parameters = {
    connected: true,
    chromatic: { viewPort: [390, 768, 1024] },
};

export const AdvancedView = Template.bind({});
AdvancedView.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    canvas.getByText('Advanced').click();
};

export const MyOrders = Template.bind({});
MyOrders.parameters = {
    connected: true,
};

MyOrders.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    canvas.getByText('Advanced').click();
    canvas.getByText('My Orders').click();
};
