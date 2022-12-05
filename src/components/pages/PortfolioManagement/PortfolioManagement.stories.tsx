import { TransactionHistoryDocument } from '@secured-finance/sf-graph-client/dist/graphclients';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { BigNumber, utils } from 'ethers';
import {
    WithAppLayout,
    WithAssetPrice,
    WithMockDate,
    WithWalletProvider,
} from 'src/../.storybook/decorators';
import { TradeHistory } from 'src/hooks';
import { PortfolioManagement } from './PortfolioManagement';

const fil = utils.formatBytes32String('FIL');
const eth = utils.formatBytes32String('ETH');
const btc = utils.formatBytes32String('BTC');

const transactions: TradeHistory = [
    {
        id: '0x123',
        amount: '1000000000000000000000',
        averagePrice: BigNumber.from(8000),
        side: 0,
        orderPrice: 100000,
        createdAt: 123,
        blockNumber: 123,
        taker: '0x123',
        forwardValue: 100000,
        txHash: '0x123',
        currency: fil,
        maturity: BigNumber.from(1733011200),
    },
    {
        id: '0x123',
        amount: '1000000000',
        averagePrice: BigNumber.from(9000),
        side: 1,
        orderPrice: 100000,
        createdAt: 123,
        blockNumber: 123,
        taker: '0x123',
        forwardValue: 100000,
        txHash: '0x123',
        currency: btc,
        maturity: BigNumber.from(1733011200),
    },
    {
        id: '0x123',
        amount: '1000000000',
        averagePrice: BigNumber.from(9000),
        side: 1,
        orderPrice: 100000,
        createdAt: 123,
        blockNumber: 123,
        taker: '0x123',
        forwardValue: 100000,
        txHash: '0x123',
        currency: eth,
        maturity: BigNumber.from(1733011200),
    },
];

export default {
    title: 'Pages/PortfolioManagement',
    component: PortfolioManagement,
    args: {},
    decorators: [
        WithMockDate,
        WithAssetPrice,
        WithAppLayout,
        WithWalletProvider,
    ],
    parameters: {
        date: new Date('2022-12-01T11:00:00.00Z'),
        apolloClient: {
            mocks: [
                {
                    request: {
                        query: TransactionHistoryDocument,
                        variables: {
                            address: '',
                            awaitRefetchQueries: true,
                        },
                    },
                    result: {
                        data: {
                            transactions: [],
                        },
                    },
                    newData: () => {
                        return {
                            data: {
                                transactions: [],
                            },
                        };
                    },
                },
                {
                    request: {
                        query: TransactionHistoryDocument,
                        variables: {
                            address:
                                '0xb98bd7c7f656290071e52d1aa617d9cb4467fd6d',
                            awaitRefetchQueries: true,
                        },
                    },

                    result: {
                        data: {
                            transactions: transactions,
                        },
                    },
                    newData: () => {
                        return {
                            data: {
                                transactions: transactions,
                            },
                        };
                    },
                },
            ],
        },
    },
} as ComponentMeta<typeof PortfolioManagement>;

const Template: ComponentStory<typeof PortfolioManagement> = () => (
    <PortfolioManagement />
);

export const Default = Template.bind({});

export const ConnectedToWallet = Template.bind({});
ConnectedToWallet.parameters = {
    connected: true,
};
