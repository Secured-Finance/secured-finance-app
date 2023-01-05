import { ComponentMeta, ComponentStory } from '@storybook/react';
import { BigNumber } from 'ethers';
import {
    withAssetPrice,
    withWalletProvider,
} from 'src/../.storybook/decorators';
import { CollateralTab } from './CollateralTab';

export default {
    title: 'Organism/CollateralTab',
    component: CollateralTab,
    args: {
        collateralBook: {
            collateral: {
                ETH: BigNumber.from('0'),
                USDC: BigNumber.from('0'),
            },
            usdCollateral: 0,
            coverage: BigNumber.from('0'), // 0%
        },
    },
    decorators: [withWalletProvider, withAssetPrice],
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
        collateral: {
            ETH: BigNumber.from('1000000000000000000'),
            USDC: BigNumber.from('10000000'),
        },
        usdCollateral: 200.03,
        coverage: BigNumber.from('7000'), // 70%
    },
};
