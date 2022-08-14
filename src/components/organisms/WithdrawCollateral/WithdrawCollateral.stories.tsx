import { ComponentMeta, ComponentStory } from '@storybook/react';
import BigNumber from 'bignumber.js';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
    WithAssetPrice,
    WithWalletProvider,
} from 'src/../.storybook/decorators';
import { updateLatestBlock } from 'src/store/blockchain';
import { WithdrawCollateral } from './WithdrawCollateral';

export default {
    title: 'Organism/WithdrawCollateral',
    component: WithdrawCollateral,
    args: {
        isOpen: true,
        onClose: () => {},
        collateralBook: {
            ccyIndex: 0,
            ccyName: 'ETH',
            collateral: new BigNumber('100000000000000000'),
            usdCollateral: new BigNumber('200030000000000000000'),
            locked: new BigNumber('5000000000000000000'),
            usdLocked: new BigNumber('50000000000000000000'),
        },
    },
    decorators: [WithWalletProvider, WithAssetPrice],
    parameters: {
        chromatic: { disableSnapshot: false },
    },
} as ComponentMeta<typeof WithdrawCollateral>;

const Template: ComponentStory<typeof WithdrawCollateral> = args => {
    const dispatch = useDispatch();
    useEffect(() => {
        setTimeout(() => dispatch(updateLatestBlock(12345)), 100);
    }, [dispatch]);
    return <WithdrawCollateral {...args} />;
};

export const Default = Template.bind({});
