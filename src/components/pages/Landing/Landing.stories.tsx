import { ComponentMeta, ComponentStory } from '@storybook/react';
import {
    WithAppLayout,
    WithAssetPrice,
    withMaturities,
    WithWalletProvider,
} from 'src/../.storybook/decorators';
import { Landing } from './Landing';

export default {
    title: 'Pages/Landing',
    component: Landing,
    args: {},
    decorators: [
        WithAppLayout,
        withMaturities,
        WithAssetPrice,
        WithWalletProvider,
    ],
} as ComponentMeta<typeof Landing>;

const Template: ComponentStory<typeof Landing> = () => {
    return <Landing />;
};

export const Default = Template.bind({});

export const ConnectedToWallet = Template.bind({});
ConnectedToWallet.parameters = {
    connected: true,
};
