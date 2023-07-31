import { RESPONSIVE_PARAMETERS } from '.storybook/constants';
import {
    withAssetPrice,
    withFullPage,
    withMarketPrice,
    withMaturities,
    withWalletProvider,
} from '.storybook/decorators';
import type { Meta, StoryFn } from '@storybook/react';
import { within } from '@storybook/testing-library';
import {
    collateralBook80,
    maturityOptions,
    yieldCurveRates,
} from 'src/stories/mocks/fixtures';
import { mockTrades } from 'src/stories/mocks/queries';
import timemachine from 'timemachine';
import { AdvancedLending } from './AdvancedLending';

export default {
    title: 'Organism/AdvancedLending',
    component: AdvancedLending,
    args: {
        collateralBook: collateralBook80,
        maturitiesOptionList: maturityOptions,
        rates: yieldCurveRates,
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
        withMarketPrice,
    ],
} as Meta<typeof AdvancedLending>;

const Template: StoryFn<typeof AdvancedLending> = args => {
    timemachine.config({
        dateString: '2022-02-01T11:00:00.00Z',
    });
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
