import { ComponentMeta, ComponentStory } from '@storybook/react';
import { BigNumber } from 'ethers';
import {
    withAssetPrice,
    withWalletProvider,
} from 'src/../.storybook/decorators';
import { CollateralTabLeftPane } from './CollateralTabLeftPane';

export default {
    title: 'Molecules/CollateralTabLeftPane',
    component: CollateralTabLeftPane,
    args: {
        account: 'as',
        onClick: () => {},
        collateralBook: {
            ccyName: 'ETH',
            collateral: BigNumber.from('100000000000000000'),
            usdCollateral: 200.03,
            coverage: BigNumber.from('80'),
        },
    },
    decorators: [withAssetPrice, withWalletProvider],
} as ComponentMeta<typeof CollateralTabLeftPane>;

const Template: ComponentStory<typeof CollateralTabLeftPane> = args => {
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
