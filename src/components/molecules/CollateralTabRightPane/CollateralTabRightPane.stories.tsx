import { ComponentMeta, ComponentStory } from '@storybook/react';
import { BigNumber } from 'ethers';
import {
    withAssetPrice,
    withWalletProvider,
} from 'src/../.storybook/decorators';
import { CollateralTabRightPane } from './CollateralTabRightPane';

export default {
    title: 'Molecules/CollateralTabRightPane',
    component: CollateralTabRightPane,
    args: {
        account: 'as',
        collateralBook: {
            ccyName: 'ETH',
            collateral: BigNumber.from('100000000000000000'),
            usdCollateral: 100,
            coverage: BigNumber.from('3700'),
        },
    },
    decorators: [withAssetPrice, withWalletProvider],
} as ComponentMeta<typeof CollateralTabRightPane>;

const Template: ComponentStory<typeof CollateralTabRightPane> = args => {
    return <CollateralTabRightPane {...args} />;
};

export const Default = Template.bind({});
export const NotConnectedToWallet = Template.bind({});
NotConnectedToWallet.args = {
    account: null,
    collateralBook: {
        ccyName: 'ETH',
        collateral: BigNumber.from('0'),
        usdCollateral: 0,
        coverage: BigNumber.from('0'), // 0%
    },
};
