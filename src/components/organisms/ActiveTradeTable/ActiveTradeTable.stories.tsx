import { ComponentMeta, ComponentStory } from '@storybook/react';
import { BigNumber } from 'ethers';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { WithAssetPrice } from 'src/../.storybook/decorators';
import { updateLatestBlock } from 'src/store/blockchain';
import { Rate } from 'src/utils';
import { ActiveTradeTable } from './ActiveTradeTable';

const rate1 = new Rate(25000);
const rate2 = new Rate(18000);
const tradeData = [
    {
        position: 'Borrow',
        contract: 'FIL-DEC2022',
        apy: rate1,
        notional: BigNumber.from('2000000000000000000000'),
        currency: 'FIL',
        presentValue: BigNumber.from('2000000000000000000000'),
        dayToMaturity: 120,
        forwardValue: BigNumber.from('1500000000000000000000'),
    },
    {
        position: 'Lend',
        contract: 'ETH-SEP2023',
        apy: rate2,
        notional: BigNumber.from('1000000000000000000000'),
        currency: 'ETH',
        presentValue: BigNumber.from('1000000000000000000000'),
        dayToMaturity: 100,
        forwardValue: BigNumber.from('1000000000000000000000'),
    },
];

export default {
    title: 'Organism/ActiveTradeTable',
    component: ActiveTradeTable,
    args: {
        data: tradeData,
    },
    decorators: [WithAssetPrice],
} as ComponentMeta<typeof ActiveTradeTable>;

const Template: ComponentStory<typeof ActiveTradeTable> = args => {
    const dispatch = useDispatch();
    useEffect(() => {
        setTimeout(() => dispatch(updateLatestBlock(12345)), 100);
    }, [dispatch]);
    return <ActiveTradeTable {...args} />;
};

export const Default = Template.bind({});
