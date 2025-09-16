import { RESPONSIVE_PARAMETERS, VIEWPORTS } from '.storybook/constants';
import type { Meta, StoryFn } from '@storybook/react';
import { CollateralProgressBar } from './CollateralProgressBar';
import { FINANCIAL_CONSTANTS } from 'src/config/constants';

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
    totalCollateralInUSD: FINANCIAL_CONSTANTS.PERCENTAGE_DIVISOR,
    availableToBorrow: 80,
    liquidationThreshold: 80,
    account: '0x123',
};

export const CollateralDepositedWithCoverage = Template.bind({});
CollateralDepositedWithCoverage.args = {
    collateralCoverage: 3700, // Raw basis points, will be converted to 37%
    totalCollateralInUSD: FINANCIAL_CONSTANTS.PERCENTAGE_DIVISOR,
    availableToBorrow: 43,
    liquidationThreshold: 80,
    account: '0x123',
};
