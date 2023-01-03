import { ComponentMeta, ComponentStory } from '@storybook/react';
import { BigNumber } from 'ethers';
import { dec22Fixture } from 'src/stories/mocks/fixtures';
import { OrderHistoryTable } from './OrderHistoryTable';

export default {
    title: 'Organism/OrderHistoryTable',
    component: OrderHistoryTable,
    args: {
        data: [
            {
                id: '1',
                orderId: BigNumber.from('1'),
                originalOrderId: BigNumber.from('1'),
                maker: '0x0000000000000000000000000000000000000000',
                currency:
                    '0x4554480000000000000000000000000000000000000000000000000000000000',
                side: 1,
                maturity: BigNumber.from(dec22Fixture.toString()),
                unitPrice: BigNumber.from('9800'),
                amount: BigNumber.from('1'),
                status: 'Filled',
                createdAt: BigNumber.from('1'),
                blockNumber: BigNumber.from('1'),
                txHash: '1',
            },
            {
                id: '2',
                orderId: BigNumber.from('1'),
                originalOrderId: BigNumber.from('1'),
                maker: '0x0000000000000000000000000000000000000000',
                currency:
                    '0x4554480000000000000000000000000000000000000000000000000000000000',
                side: 1,
                maturity: BigNumber.from(dec22Fixture.toString()),
                unitPrice: BigNumber.from('9600'),
                amount: BigNumber.from('1'),
                status: 'Open',
                createdAt: BigNumber.from('1'),
                blockNumber: BigNumber.from('1'),
                txHash: '1',
            },
            {
                id: '3',
                orderId: BigNumber.from('1'),
                originalOrderId: BigNumber.from('1'),
                maker: '0x0000000000000000000000000000000000000000',
                currency:
                    '0x4554480000000000000000000000000000000000000000000000000000000000',
                side: 0,
                maturity: BigNumber.from(dec22Fixture.toString()),
                unitPrice: BigNumber.from('9800'),
                amount: BigNumber.from('1'),
                status: 'Filled',
                createdAt: BigNumber.from('1'),
                blockNumber: BigNumber.from('1'),
                txHash: '1',
            },
        ],
    },
} as ComponentMeta<typeof OrderHistoryTable>;

const Template: ComponentStory<typeof OrderHistoryTable> = args => (
    <OrderHistoryTable {...args} />
);

export const Default = Template.bind({});
