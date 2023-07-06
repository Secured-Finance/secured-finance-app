import { RESPONSIVE_PARAMETERS, VIEWPORTS } from '.storybook/constants';
import { ComponentMeta, ComponentStory } from '@storybook/react';
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

export const PaginatedMyTransactions = Template.bind({});
PaginatedMyTransactions.args = {
    data: Array(30)
        .fill(null)
        .map(() => ({
            amount: '500000000000000000000',
            averagePrice: '0.8000', // TODO: rework the unit in the graph. This is changed only for a dirty fix
            side: 1,
            orderPrice: '9543',
            createdAt: '1671080520',
            forwardValue: '520000000000000000000',
            currency: efilBytes32,
            maturity: jun23Fixture.toString(),
        })),
    pagination: {
        totalData: 100,
        getMoreData: () => {
            return new Promise(resolve => {
                setTimeout(() => {
                    const data = Array(30)
                        .fill(null)
                        .map(() => ({
                            amount: '500000000000000000000',
                            averagePrice: '0.8000', // TODO: rework the unit in the graph. This is changed only for a dirty fix
                            side: 1,
                            orderPrice: '9543',
                            createdAt: '1671080520',
                            forwardValue: '520000000000000000000',
                            currency: efilBytes32,
                            maturity: jun23Fixture.toString(),
                        }));
                    resolve(data);
                }, 1000);
            });
        },
    },
};
