import type { Meta, StoryFn } from '@storybook/react';
import { CollateralManagementConciseTab } from '.';
import { FINANCIAL_CONSTANTS } from 'src/config/constants';

export default {
    title: 'Atoms/CollateralManagementConciseTab',
    component: CollateralManagementConciseTab,
    args: {
        collateralCoverage: FINANCIAL_CONSTANTS.ZERO,
        totalCollateralInUSD: FINANCIAL_CONSTANTS.PERCENTAGE_DIVISOR,
        collateralThreshold: FINANCIAL_CONSTANTS.ZERO,
        liquidationThreshold: FINANCIAL_CONSTANTS.ZERO,
        account: undefined,
    },
} as Meta<typeof CollateralManagementConciseTab>;

const Template: StoryFn<typeof CollateralManagementConciseTab> = args => (
    <CollateralManagementConciseTab {...args} />
);

export const NotConnectedToWallet = Template.bind({});

export const ZeroCollateral = Template.bind({});
ZeroCollateral.args = {
    collateralCoverage: FINANCIAL_CONSTANTS.ZERO,
    availableToBorrow: FINANCIAL_CONSTANTS.ZERO,
    liquidationThreshold: 80,
    account: '0x123',
    totalCollateralInUSD: FINANCIAL_CONSTANTS.ZERO,
};

export const CollateralDepositedZeroCoverage = Template.bind({});
CollateralDepositedZeroCoverage.args = {
    collateralCoverage: FINANCIAL_CONSTANTS.ZERO,
    availableToBorrow: 80,
    liquidationThreshold: 80,
    account: '0x123',
};

export const CollateralDepositedWithCoverage = Template.bind({});
CollateralDepositedWithCoverage.args = {
    collateralCoverage: 37,
    availableToBorrow: 43,
    liquidationThreshold: 80,
    account: '0x123',
};
