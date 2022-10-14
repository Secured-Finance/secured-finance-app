import { ComponentMeta, ComponentStory } from '@storybook/react';
import BigNumber from 'bignumber.js';
import {
    WithAssetPrice,
    WithWalletProvider,
} from 'src/../.storybook/decorators';
import { CollateralTab } from './CollateralTab';

export default {
    title: 'Organism/CollateralTab',
    component: CollateralTab,
    args: {
        collateralBook: {
            ccyName: 'ETH',
            collateral: new BigNumber('0'),
            usdCollateral: new BigNumber('0'),
            coverage: new BigNumber('0'), // 0%
        },
    },
    decorators: [WithWalletProvider, WithAssetPrice],
} as ComponentMeta<typeof CollateralTab>;

const Template: ComponentStory<typeof CollateralTab> = args => {
    return <CollateralTab {...args} />;
};

export const Default = Template.bind({});
export const ConnectedToWallet = Template.bind({});
ConnectedToWallet.parameters = {
    connected: true,
};

ConnectedToWallet.args = {
    collateralBook: {
        ccyName: 'ETH',
        collateral: new BigNumber('100000000000000000'),
        usdCollateral: new BigNumber('200030000000000000000'),
        coverage: new BigNumber('7000'), // 70%
    },
};
