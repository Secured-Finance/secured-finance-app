import type { Meta, StoryFn } from '@storybook/react';
import { CurrencySymbol } from 'src/utils';
import { AssetInformation } from '.';
import { FINANCIAL_CONSTANTS } from 'src/config/constants';

export default {
    title: 'Atoms/AssetInformation',
    component: AssetInformation,
    args: {
        header: 'Collateral Assets',
        values: [
            {
                currency: CurrencySymbol.ETH,
                label: CurrencySymbol.ETH,
                amount: 1.2,
                price: 123,
                totalPrice: 1234,
            },
            {
                currency: CurrencySymbol.USDC,
                label: CurrencySymbol.USDC,
                amount: FINANCIAL_CONSTANTS.POINTS_K_THRESHOLD,
                price: 1.01,
                totalPrice: 1010,
            },
        ],
        informationText: 'Only USDC and ETH are eligible as collateral.',
    },
} as Meta<typeof AssetInformation>;

const Template: StoryFn<typeof AssetInformation> = args => {
    return <AssetInformation {...args} />;
};

export const Default = Template.bind({});
export const ZeroUsdcCollateral = Template.bind({});
ZeroUsdcCollateral.args = {
    values: [
        {
            currency: CurrencySymbol.ETH,
            label: CurrencySymbol.ETH,
            amount: 1.2,
            price: 123,
            totalPrice: 1234,
        },
    ],
};

export const ZCToken = Template.bind({});
ZCToken.args = {
    isZC: true,
};
