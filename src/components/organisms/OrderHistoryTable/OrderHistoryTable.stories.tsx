import { RESPONSIVE_PARAMETERS, VIEWPORTS } from '.storybook/constants';
import { toBytes32 } from '@secured-finance/sf-graph-client';
import type { Meta, StoryFn } from '@storybook/react';
import { useState } from 'react';
import {
    dec22Fixture,
    mappedOrderHistoryList,
    wfilBytes32,
} from 'src/stories/mocks/fixtures';
import { OrderHistoryList, OrderType } from 'src/types';
import { OrderHistoryTable } from './OrderHistoryTable';

export default {
    title: 'Organism/OrderHistoryTable',
    component: OrderHistoryTable,
    args: {
        data: mappedOrderHistoryList,
    },
    parameters: {
        ...RESPONSIVE_PARAMETERS,
        chromatic: {
            viewports: [VIEWPORTS.MOBILE, VIEWPORTS.TABLET, VIEWPORTS.LAPTOP],
        },
    },
} as Meta<typeof OrderHistoryTable>;

const Template: StoryFn<typeof OrderHistoryTable> = args => (
    <OrderHistoryTable {...args} />
);

const PaginatedTemplate: StoryFn<typeof OrderHistoryTable> = args => {
    const initialData = Array(20)
        .fill(null)
        .map((_, index) => ({
            orderId: index,
            currency: wfilBytes32,
            side: 1,
            maturity: BigInt(dec22Fixture.toString()),
            inputUnitPrice: BigInt('9800'),
            filledAmount: BigInt('0'),
            inputAmount: BigInt('1000000000000000000000'),
            status: 'Open' as const,
            type: OrderType.LIMIT,
            createdAt: BigInt('1'),
            txHash: toBytes32('hash'),
            lendingMarket: {
                id: '1',
                isActive: true,
            },
            user: {
                id: '0xB98bD7C7f656290071E52D1aA617D9cB4467Fd6D',
            },
            isCircuitBreakerTriggered: false,
        }));
    const [data, setData] = useState<OrderHistoryList>(initialData);

    return (
        <OrderHistoryTable
            {...args}
            data={data}
            pagination={{
                totalData: 100,
                getMoreData: () => {
                    const newData = Array(20)
                        .fill(null)
                        .map((_, index) => ({
                            orderId: index,
                            currency: wfilBytes32,
                            side: 1,
                            maturity: BigInt(dec22Fixture.toString()),
                            inputUnitPrice: BigInt('9800'),
                            filledAmount: BigInt('0'),
                            inputAmount: BigInt('1000000000000000000000'),
                            status: 'Open' as const,
                            type: OrderType.LIMIT,
                            createdAt: BigInt('1'),
                            txHash: toBytes32('hash'),
                            lendingMarket: {
                                id: '1',
                                isActive: true,
                            },
                            user: {
                                id: '0xB98bD7C7f656290071E52D1aA617D9cB4467Fd6D',
                            },
                            isCircuitBreakerTriggered: false,
                        }));

                    const updatedData = [...data, ...newData];
                    setData(updatedData);
                },
                containerHeight: false,
            }}
        />
    );
};

export const Default = Template.bind({});
export const WithPagination = PaginatedTemplate.bind({});
