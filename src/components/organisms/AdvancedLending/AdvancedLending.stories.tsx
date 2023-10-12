import { RESPONSIVE_PARAMETERS } from '.storybook/constants';
import { withAssetPrice, withWalletProvider } from '.storybook/decorators';
import type { Meta, StoryFn } from '@storybook/react';
import { within } from '@storybook/testing-library';
import { defaultDelistedStatusMap } from 'src/hooks';
import {
    collateralBook80,
    maturityOptions,
    yieldCurveRates,
} from 'src/stories/mocks/fixtures';
import { mockTrades } from 'src/stories/mocks/queries';
import { CurrencySymbol } from 'src/utils';
import { AdvancedLending } from './AdvancedLending';

export default {
    title: 'Organism/AdvancedLending',
    component: AdvancedLending,
    args: {
        collateralBook: collateralBook80,
        maturitiesOptionList: maturityOptions,
        rates: yieldCurveRates,
        marketPrice: 9917,
        currencyDelistedStatusMap: defaultDelistedStatusMap,
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
    decorators: [withAssetPrice, withWalletProvider],
} as Meta<typeof AdvancedLending>;

const Template: StoryFn<typeof AdvancedLending> = args => {
    return <AdvancedLending {...args} />;
};

export const Default = Template.bind({});

export const ConnectedToWallet = Template.bind({});
ConnectedToWallet.parameters = {
    connected: true,
};

export const OpenOrdersConnectedToWallet = Template.bind({});
OpenOrdersConnectedToWallet.parameters = {
    connected: true,
};
OpenOrdersConnectedToWallet.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    canvas.getByRole('button', { name: 'DEC22' }).click();
    canvas.getByRole('menuitem', { name: 'JUN23' }).click();
};

export const Delisted = Template.bind({});
Delisted.args = {
    currencyDelistedStatusMap: {
        ...defaultDelistedStatusMap,
        [CurrencySymbol.WFIL]: true,
    },
};
