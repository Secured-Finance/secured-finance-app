import { RESPONSIVE_PARAMETERS, VIEWPORTS } from '.storybook/constants';
import type { Meta, StoryFn } from '@storybook/react';
import { BigNumber, utils } from 'ethers';
import { useState } from 'react';
import { withAssetPrice } from 'src/../.storybook/decorators';
import {
    dec22Fixture,
    orderHistoryList,
    wfilBytes32,
} from 'src/stories/mocks/fixtures';
import { OrderHistoryList } from 'src/types';
import { OrderHistoryTable } from './OrderHistoryTable';

export default {
    title: 'Organism/OrderHistoryTable',
    component: OrderHistoryTable,
    args: {
        data: orderHistoryList,
    },
    parameters: {
        ...RESPONSIVE_PARAMETERS,
        chromatic: {
            viewports: [VIEWPORTS.MOBILE, VIEWPORTS.TABLET, VIEWPORTS.LAPTOP],
        },
    },
    decorators: [withAssetPrice],
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
            maturity: BigNumber.from(dec22Fixture.toString()),
            inputUnitPrice: BigNumber.from('9800'),
            filledAmount: BigNumber.from('0'),
            inputAmount: BigNumber.from('1000000000000000000000'),
            status: 'Open' as const,
            type: 'Limit' as const,
            createdAt: BigNumber.from('1'),
            txHash: utils.formatBytes32String('hash'),
            lendingMarket: {
                id: '1',
                isActive: true,
            },
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
                            maturity: BigNumber.from(dec22Fixture.toString()),
                            inputUnitPrice: BigNumber.from('9800'),
                            filledAmount: BigNumber.from('0'),
                            inputAmount: BigNumber.from(
                                '1000000000000000000000'
                            ),
                            status: 'Open' as const,
                            type: 'Limit' as const,
                            createdAt: BigNumber.from('1'),
                            txHash: utils.formatBytes32String('hash'),
                            lendingMarket: {
                                id: '1',
                                isActive: true,
                            },
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
