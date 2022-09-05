import { ComponentMeta, ComponentStory } from '@storybook/react';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { WithAssetPrice } from 'src/../.storybook/decorators';
import { updateLatestBlock } from 'src/store/blockchain';
import { ActiveTradeTable } from './ActiveTradeTable';

const tradeData = [
    {
        position: 'Borrow',
        contract: 'FIL-DEC2022',
        apy: 0.2,
        notional: 2000,
        currency: 'FIL',
        presentValue: 2000,
        dayToMaturity: 120,
        forwardValue: 150,
    },
    {
        position: 'Lend',
        contract: 'ETH-SEP2023',
        apy: 0.1,
        notional: 1000,
        currency: 'ETH',
        presentValue: 1000,
        dayToMaturity: 100,
        forwardValue: 1000,
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
