import { RESPONSIVE_PARAMETERS, VIEWPORTS } from '.storybook/constants';
import { OrderStatus } from '@secured-finance/sf-graph-client/dist/graphclients/development/.graphclient';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { BigNumber, utils } from 'ethers';
import { useState } from 'react';
import { withAssetPrice } from 'src/../.storybook/decorators';
import {
    dec22Fixture,
    efilBytes32,
    orderHistoryList,
} from 'src/stories/mocks/fixtures';
import { OrderList } from 'src/types';
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
} as ComponentMeta<typeof OrderHistoryTable>;

const Template: ComponentStory<typeof OrderHistoryTable> = args => (
    <OrderHistoryTable {...args} />
);

const PaginatedTemplate: ComponentStory<typeof OrderHistoryTable> = args => {
    const initialData = Array(20)
        .fill(null)
        .map((_, index) => ({
            orderId: index,
            currency: efilBytes32,
            side: 1,
            maturity: BigNumber.from(dec22Fixture.toString()),
            unitPrice: BigNumber.from('9800'),
            filledAmount: BigNumber.from('0'),
            amount: BigNumber.from('1000000000000000000000'),
            status: 'Open' as OrderStatus,
            createdAt: BigNumber.from('1'),
            txHash: utils.formatBytes32String('hash'),
            lendingMarket: {
                id: '1',
                isActive: true,
            },
        }));
    const [data, setData] = useState<OrderList>(initialData);

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
                            currency: efilBytes32,
                            side: 1,
                            maturity: BigNumber.from(dec22Fixture.toString()),
                            unitPrice: BigNumber.from('9800'),
                            filledAmount: BigNumber.from('0'),
                            amount: BigNumber.from('1000000000000000000000'),
                            status: 'Open' as OrderStatus,
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
