import { RESPONSIVE_PARAMETERS, VIEWPORTS } from '.storybook/constants';
import type { Meta, StoryFn } from '@storybook/react';
import { CollateralProgressBar } from './CollateralProgressBar';

export default {
    title: 'Molecules/CollateralProgressBar',
    component: CollateralProgressBar,
    args: {
        collateralCoverage: 0,
        totalCollateralInUSD: 0,
        liquidationThreshold: 0,
        availableToBorrow: 0,
        account: undefined,
    },
    parameters: {
        ...RESPONSIVE_PARAMETERS,
        chromatic: {
            viewports: [VIEWPORTS.MOBILE, VIEWPORTS.TABLET],
        },
    },
} as Meta<typeof CollateralProgressBar>;

const Template: StoryFn<typeof CollateralProgressBar> = args => (
    <CollateralProgressBar {...args} />
);

export const NotConnectedToWallet = Template.bind({});

export const ZeroCollateral = Template.bind({});
ZeroCollateral.args = {
    collateralCoverage: 0,
    totalCollateralInUSD: 0,
    availableToBorrow: 0,
    liquidationThreshold: 80,
    account: '0x123',
};

export const CollateralDepositedZeroCoverage = Template.bind({});
CollateralDepositedZeroCoverage.args = {
    collateralCoverage: 0,
    totalCollateralInUSD: 100,
    availableToBorrow: 80,
    liquidationThreshold: 80,
    account: '0x123',
};

export const CollateralDepositedWithCoverage = Template.bind({});
CollateralDepositedWithCoverage.args = {
    collateralCoverage: 37,
    totalCollateralInUSD: 100,
    availableToBorrow: 43,
    liquidationThreshold: 80,
    account: '0x123',
};
