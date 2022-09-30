import {
    BuyerTransactionTableDocument,
    SellerTransactionTableDocument,
} from '@secured-finance/sf-graph-client/dist/graphclients';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { utils } from 'ethers';
import {
    WithAppLayout,
    WithWalletProvider,
} from 'src/../.storybook/decorators';
import { PortfolioManagement } from './PortfolioManagement';

const fil = utils.formatBytes32String('FIL');
const eth = utils.formatBytes32String('ETH');

export default {
    title: 'Pages/PortfolioManagement',
    component: PortfolioManagement,
    args: {},
    decorators: [WithAppLayout, WithWalletProvider],
    parameters: {
        apolloClient: {
            mocks: [
                {
                    request: {
                        query: BuyerTransactionTableDocument,
                        variables: {
                            address: '',
                        },
                    },
                    result: {
                        data: {
                            transactionTables: [],
                        },
                    },
                },
                {
                    request: {
                        query: SellerTransactionTableDocument,
                        variables: {
                            address: '',
                        },
                    },
                    result: {
                        data: {
                            transactionTables: [],
                        },
                    },
                },
                {
                    request: {
                        query: BuyerTransactionTableDocument,
                        variables: {
                            address:
                                '0xb98bd7c7f656290071e52d1aa617d9cb4467fd6d',
                        },
                    },

                    result: {
                        data: {
                            transactionTables: [
                                {
                                    currency: fil,
                                    side: '0',
                                    maturity: '1733011200',
                                    amount: '1000000000000000000000',
                                    rate: '200000',
                                },
                            ],
                        },
                    },
                },
                {
                    request: {
                        query: SellerTransactionTableDocument,
                        variables: {
                            address:
                                '0xb98bd7c7f656290071e52d1aa617d9cb4467fd6d',
                        },
                    },
                    result: {
                        data: {
                            transactionTables: [
                                {
                                    currency: eth,
                                    side: '1',
                                    maturity: '1709251200',
                                    amount: '100000000000000000000',
                                    rate: '50000',
                                },
                            ],
                        },
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
