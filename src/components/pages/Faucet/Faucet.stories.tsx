import { RESPONSIVE_PARAMETERS } from '.storybook/constants';
import type { Meta, StoryFn } from '@storybook/react';
import {
    WithGraphClient,
    withAppLayout,
    withBalance,
    withWalletProvider,
} from 'src/../.storybook/decorators';
import { Faucet } from './Faucet';

export default {
    title: 'Pages/Faucet',
    component: Faucet,
    args: {},
    decorators: [
        withAppLayout,
        withBalance,
        withWalletProvider,
        WithGraphClient,
    ],
    parameters: {
        ...RESPONSIVE_PARAMETERS,
        layout: 'fullscreen',
    },
} as Meta<typeof Faucet>;

const Template: StoryFn<typeof Faucet> = () => <Faucet />;

export const Default = Template.bind({});
export const Connected = Template.bind({});
Connected.parameters = {
    connected: true,
};
