import { RESPONSIVE_PARAMETERS } from '.storybook/constants';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import {
    withAppLayout,
    withAssetPrice,
    withChainErrorDisabled,
    withWalletBalances,
    withWalletProvider,
} from 'src/../.storybook/decorators';
import { Faucet } from './Faucet';

export default {
    title: 'Pages/Faucet',
    component: Faucet,
    args: {},
    decorators: [
        withAppLayout,
        withWalletBalances,
        withAssetPrice,
        withWalletProvider,
        withChainErrorDisabled,
    ],
    parameters: {
        ...RESPONSIVE_PARAMETERS,
        layout: 'fullscreen',
    },
} as ComponentMeta<typeof Faucet>;

const Template: ComponentStory<typeof Faucet> = () => <Faucet />;

export const Default = Template.bind({});
export const Connected = Template.bind({});
Connected.parameters = {
    connected: true,
};
