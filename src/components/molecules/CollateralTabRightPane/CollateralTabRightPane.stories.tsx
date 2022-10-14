import { ComponentMeta, ComponentStory } from '@storybook/react';
import BigNumber from 'bignumber.js';
import {
    WithAssetPrice,
    WithWalletProvider,
} from 'src/../.storybook/decorators';
import { CollateralTabRightPane } from './CollateralTabRightPane';

export default {
    title: 'Molecules/CollateralTabRightPane',
    component: CollateralTabRightPane,
    args: {
        account: 'as',
        collateralBook: {
            ccyName: 'ETH',
            collateral: new BigNumber('100000000000000000'),
            usdCollateral: new BigNumber('100000000000000000000'),
            coverage: new BigNumber('3700'),
        },
    },
    decorators: [WithAssetPrice, WithWalletProvider],
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
        collateral: new BigNumber('0'),
        usdCollateral: new BigNumber('0'),
        coverage: new BigNumber('0'), // 0%
    },
};
