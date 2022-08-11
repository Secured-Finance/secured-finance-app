import { ComponentMeta, ComponentStory } from '@storybook/react';
import BigNumber from 'bignumber.js';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
    WithAssetPrice,
    WithWalletProvider,
} from 'src/../.storybook/decorators';
import { updateLatestBlock } from 'src/store/blockchain';
import { CollateralTabLeftPane } from './CollateralTabLeftPane';

export default {
    title: 'Molecules/CollateralTabLeftPane',
    component: CollateralTabLeftPane,
    args: {
        account: 'as',
        onClick: () => {},
        collateralBook: {
            ccyIndex: 0,
            ccyName: 'ETH',
            collateral: new BigNumber('100000000000000000'),
            usdCollateral: new BigNumber('200030000000000000000'),
            locked: new BigNumber('5000000000000000000'),
            usdLocked: new BigNumber('50000000000000000000'),
        },
    },
    decorators: [WithAssetPrice, WithWalletProvider],
    parameters: {
        chromatic: { disableSnapshot: false },
    },
} as ComponentMeta<typeof CollateralTabLeftPane>;

const Template: ComponentStory<typeof CollateralTabLeftPane> = args => {
    const dispatch = useDispatch();
    useEffect(() => {
        setTimeout(() => dispatch(updateLatestBlock(12345)), 100);
    }, [dispatch]);
    return (
        <div className='h-[412px]'>
            <CollateralTabLeftPane {...args} />
        </div>
    );
};

export const Default = Template.bind({});

export const NotConnectedToWallet = Template.bind({});
NotConnectedToWallet.args = {
    account: null,
    onClick: () => {},
};
