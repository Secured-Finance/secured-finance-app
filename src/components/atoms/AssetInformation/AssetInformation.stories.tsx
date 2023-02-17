import { ComponentMeta, ComponentStory } from '@storybook/react';
import { BigNumber } from 'ethers';
import { withAssetPrice } from 'src/../.storybook/decorators';
import { AssetInformation } from '.';

export default {
    title: 'Atoms/AssetInformation',
    component: AssetInformation,
    args: {
        header: 'Collateral Assets',
        collateralBook: {
            ETH: BigNumber.from('1200000000000000000'),
            USDC: BigNumber.from('10000000'),
        },
    },
    decorators: [withAssetPrice],
} as ComponentMeta<typeof AssetInformation>;

const Template: ComponentStory<typeof AssetInformation> = args => {
    return <AssetInformation {...args} />;
};

export const Default = Template.bind({});
export const ZeroUsdcCollateral = Template.bind({});
ZeroUsdcCollateral.args = {
    collateralBook: {
        ETH: BigNumber.from('1200000000000000000'),
        USDC: BigNumber.from('0'),
    },
};
