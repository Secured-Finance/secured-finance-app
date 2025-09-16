import { RESPONSIVE_PARAMETERS, VIEWPORTS } from '.storybook/constants';
import type { Meta, StoryFn } from '@storybook/react';
import { LiquidationProgressBar } from './LiquidationProgressBar';

export default {
    title: 'Molecules/LiquidationProgressBar',
    component: LiquidationProgressBar,
    args: {
        liquidationPercentage: 0,
        liquidationThreshold: 0,
        account: undefined,
    },
    parameters: {
        ...RESPONSIVE_PARAMETERS,
        chromatic: {
            viewports: [VIEWPORTS.MOBILE, VIEWPORTS.TABLET],
        },
    },
} as Meta<typeof LiquidationProgressBar>;

const Template: StoryFn<typeof LiquidationProgressBar> = args => (
    <LiquidationProgressBar {...args} />
);

export const NotConnectedToWallet = Template.bind({});

export const CollateralDepositedWithCoverage = Template.bind({});
CollateralDepositedWithCoverage.args = {
    liquidationPercentage: 45,
    liquidationThreshold: 80,
    account: '0x123',
};
