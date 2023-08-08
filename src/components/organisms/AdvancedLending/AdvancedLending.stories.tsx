import { RESPONSIVE_PARAMETERS } from '.storybook/constants';
import {
    withAssetPrice,
    withFullPage,
    withMaturities,
    withWalletProvider,
} from '.storybook/decorators';
import type { Meta, StoryFn } from '@storybook/react';
import { within } from '@storybook/testing-library';
import { collateralBook80, maturityOptions } from 'src/stories/mocks/fixtures';
import { mockTrades } from 'src/stories/mocks/queries';
import { AdvancedLending } from './AdvancedLending';

export default {
    title: 'Organism/AdvancedLending',
    component: AdvancedLending,
    args: {
        collateralBook: collateralBook80,
        maturitiesOptionList: maturityOptions,
        marketPrice: 9917,
    },
    parameters: {
        apolloClient: {
            mocks: [...mockTrades],
        },
        ...RESPONSIVE_PARAMETERS,
        chromatic: {
            ...RESPONSIVE_PARAMETERS.chromatic,
            delay: 5000,
        },
    },
    decorators: [
        withFullPage,
        withAssetPrice,
        withMaturities,
        withWalletProvider,
    ],
} as Meta<typeof AdvancedLending>;

const Template: StoryFn<typeof AdvancedLending> = args => {
    return <AdvancedLending {...args} />;
};

export const Default = Template.bind({});

export const ConnectedToWallet = Template.bind({});
ConnectedToWallet.parameters = {
    connected: true,
};

export const MyOrders = Template.bind({});
MyOrders.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    canvas.getByTestId('My Orders').click();
};

export const MyOrdersConnectedToWallet = Template.bind({});
MyOrdersConnectedToWallet.parameters = {
    connected: true,
};
MyOrdersConnectedToWallet.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    canvas.getByTestId('My Orders').click();
};
