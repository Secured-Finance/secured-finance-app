import { RESPONSIVE_PARAMETERS, VIEWPORTS } from '.storybook/constants';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { useState } from 'react';
import {
    efilBytes32,
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
} as ComponentMeta<typeof MyTransactionsTable>;

const Template: ComponentStory<typeof MyTransactionsTable> = args => (
    <MyTransactionsTable {...args} />
);

export const Default = Template.bind({});

const PaginationTemplate: ComponentStory<typeof MyTransactionsTable> = args => {
    const [data, setData] = useState(args.data);

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
                                averagePrice: '0.8000', // TODO: rework the unit in the graph. This is changed only for a dirty fix
                                side: 0,
                                orderPrice: '9800',
                                createdAt: '1671859344',
                                forwardValue: '1020000000000000000000',
                                currency: efilBytes32,
                                maturity: jun23Fixture.toString(),
                            }));

                        const updatedData = [...data, ...newData];
                        setData(updatedData);
                    },
                    containerHeight: 400,
                }}
            />
        </div>
    );
};

export const PaginatedMyTransactionsTable = PaginationTemplate.bind({});
