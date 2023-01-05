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
            collateral: {
                ETH: BigNumber.from('1000000000000000000'),
                USDC: BigNumber.from('10000000'),
            },
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
        collateral: {
            ETH: BigNumber.from('0'),
            USDC: BigNumber.from('0'),
        },
        usdCollateral: 0,
        coverage: BigNumber.from('0'), // 0%
    },
};
