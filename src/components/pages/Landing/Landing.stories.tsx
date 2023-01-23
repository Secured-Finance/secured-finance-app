import { ComponentMeta, ComponentStory } from '@storybook/react';
import { within } from '@storybook/testing-library';
import {
    withAppLayout,
    withAssetPrice,
    withMaturities,
    withWalletProvider,
} from 'src/../.storybook/decorators';
import { mockOrderHistory } from 'src/stories/mocks/queries';
import { Landing } from './Landing';

export default {
    title: 'Pages/Landing',
    component: Landing,
    chromatic: { pauseAnimationAtEnd: true, diffThreshold: 1 },
    args: {},
    decorators: [
        withAppLayout,
        withMaturities,
        withAssetPrice,
        withWalletProvider,
    ],
    parameters: {
        apolloClient: {
            mocks: [...mockOrderHistory],
        },
    },
    play: async () => {
        await new Promise(resolve => setTimeout(resolve, 5000));
    },
} as ComponentMeta<typeof Landing>;

const Template: ComponentStory<typeof Landing> = args => {
    return <Landing {...args} />;
};

export const Default = Template.bind({});

export const ConnectedToWallet = Template.bind({});
ConnectedToWallet.parameters = {
    connected: true,
};

export const AdvancedView = Template.bind({});
AdvancedView.args = {
    initialView: 'Advanced',
};

export const MyOrders = Template.bind({});
MyOrders.parameters = {
    connected: true,
};
MyOrders.args = {
    initialView: 'Advanced',
};
MyOrders.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    canvas.getByText('My Orders').click();
};
