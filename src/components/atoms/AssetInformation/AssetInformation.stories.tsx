import type { Meta, StoryFn } from '@storybook/react';
import { withAssetPrice } from 'src/../.storybook/decorators';
import { AssetInformation } from '.';

export default {
    title: 'Atoms/VssetInformation',
    component: AssetInformation,
    args: {
        header: 'Collateral Assets',
        collateralBook: {
            ETH: BigInt('1200000000000000000'),
            USDC: BigInt('10000000'),
        },
        informationText: 'Only USDC and ETH are eligible as collateral.',
    },
    decorators: [withAssetPrice],
} as Meta<typeof AssetInformation>;

const Template: StoryFn<typeof AssetInformation> = args => {
    return <AssetInformation {...args} />;
};

export const Default = Template.bind({});
export const ZeroUsdcCollateral = Template.bind({});
ZeroUsdcCollateral.args = {
    collateralBook: {
        ETH: BigInt('1200000000000000000'),
        USDC: BigInt('0'),
    },
};
