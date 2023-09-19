import { RESPONSIVE_PARAMETERS, VIEWPORTS } from '.storybook/constants';
import { useState } from 'react';
import type { Meta, StoryFn } from '@storybook/react';
import {
    wfilBytes32,
    jun23Fixture,
    transactions,
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
        .map(_ => ({
            amount: '1000000000000000000000',
            averagePrice: '0.8000',
            side: 0,
            orderPrice: '9800',
            createdAt: '1671859344',
            feeInFV: '3213742117851706893',
            forwardValue: '1020000000000000000000',
            currency: wfilBytes32,
            maturity: jun23Fixture.toString(),
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
                            .map(_ => ({
                                amount: '1000000000000000000000',
                                averagePrice: '0.8000',
                                side: 0,
                                orderPrice: '9800',
                                createdAt: '1671859344',
                                feeInFV: '3213742117851706893',
                                forwardValue: '1020000000000000000000',
                                currency: wfilBytes32,
                                maturity: jun23Fixture.toString(),
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
