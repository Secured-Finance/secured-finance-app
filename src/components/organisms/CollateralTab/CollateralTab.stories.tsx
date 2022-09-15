import { ComponentMeta, ComponentStory } from '@storybook/react';
import BigNumber from 'bignumber.js';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
    WithAssetPrice,
    WithWalletProvider,
} from 'src/../.storybook/decorators';
import { updateLatestBlock } from 'src/store/blockchain';
import { CollateralTab } from './CollateralTab';

export default {
    title: 'Organism/CollateralTab',
    component: CollateralTab,
    args: {
        collateralBook: {
            ccyIndex: 0,
            ccyName: 'ETH',
            collateral: new BigNumber('100000000000000000'),
            usdCollateral: new BigNumber('200030000000000000000'),
            locked: new BigNumber('5000000000000000000'),
            coverage: new BigNumber('80'),
        },
    },
    decorators: [WithWalletProvider, WithAssetPrice],
} as ComponentMeta<typeof CollateralTab>;

const Template: ComponentStory<typeof CollateralTab> = args => {
    const dispatch = useDispatch();
    useEffect(() => {
        setTimeout(() => dispatch(updateLatestBlock(12345)), 100);
    }, [dispatch]);
    return <CollateralTab {...args} />;
};

export const Default = Template.bind({});
export const ConnectedToWallet = Template.bind({});
ConnectedToWallet.parameters = {
    connected: true,
};
