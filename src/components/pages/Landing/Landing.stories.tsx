import { ComponentMeta, ComponentStory } from '@storybook/react';
import {
    withAppLayout,
    withAssetPrice,
    withMaturities,
    withWalletProvider,
} from 'src/../.storybook/decorators';
import { Landing } from './Landing';

export default {
    title: 'Pages/Landing',
    component: Landing,
    args: {},
    decorators: [
        withAppLayout,
        withMaturities,
        withAssetPrice,
        withWalletProvider,
    ],
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
