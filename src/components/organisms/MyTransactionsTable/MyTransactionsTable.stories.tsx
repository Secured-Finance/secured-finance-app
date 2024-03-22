import { RESPONSIVE_PARAMETERS, VIEWPORTS } from '.storybook/constants';
import type { Meta, StoryFn } from '@storybook/react';
import { useState } from 'react';
import {
    jun23Fixture,
    transactions,
    wfilBytes32,
} from 'src/stories/mocks/fixtures';
import { MyTransactionsTable } from './MyTransactionsTable';

export default {
    title: 'Organism/MyTransactionsTable',
    component: MyTransactionsTable,
    args: {
        data: transactions,
    },
    parameters: {
        ...RESPONSIVE_PARAMETERS,
        chromatic: {
            viewports: [VIEWPORTS.MOBILE, VIEWPORTS.TABLET, VIEWPORTS.LAPTOP],
        },
    },
} as Meta<typeof MyTransactionsTable>;

const Template: StoryFn<typeof MyTransactionsTable> = args => (
    <MyTransactionsTable {...args} />
);

export const Default = Template.bind({});

const PaginationTemplate: StoryFn<typeof MyTransactionsTable> = args => {
    const initialData = Array(20)
        .fill(null)
        .map((_, index) => ({
            id: index.toString(),
            amount: '1000000000000000000000',
            averagePrice: '0.8000',
            side: 0,
            executionPrice: '9800',
            createdAt: '1671859344',
            feeInFV: '3213742117851706893',
            futureValue: '1020000000000000000000',
            currency: wfilBytes32,
            maturity: jun23Fixture.toString(),
            user: {
                id: '0xB98bD7C7f656290071E52D1aA617D9cB4467Fd6D',
            },
        }));
    const [data, setData] = useState(initialData);

    return (
        <div className='text-white'>
            <MyTransactionsTable
                {...args}
                data={data}
                pagination={{
                    totalData: 100,
                    getMoreData: () => {
                        const newData = Array(20)
                            .fill(null)
                            .map((_, index) => ({
                                id: (data.length + index).toString(),
                                amount: '1000000000000000000000',
                                averagePrice: '0.8000',
                                side: 0,
                                executionPrice: '9800',
                                createdAt: '1671859344',
                                feeInFV: '3213742117851706893',
                                futureValue: '1020000000000000000000',
                                currency: wfilBytes32,
                                maturity: jun23Fixture.toString(),
                                user: {
                                    id: '0xB98bD7C7f656290071E52D1aA617D9cB4467Fd6D',
                                },
                            }));

                        const updatedData = [...data, ...newData];
                        setData(updatedData);
                    },
                    containerHeight: false,
                }}
            />
        </div>
    );
};

export const WithPagination = PaginationTemplate.bind({});
WithPagination.parameters = {
    chromatic: {
        viewports: [VIEWPORTS.TABLET, VIEWPORTS.LAPTOP],
    },
};
