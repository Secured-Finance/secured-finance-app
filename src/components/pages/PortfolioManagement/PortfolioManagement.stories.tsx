import {
    BuyerTransactionsDocument,
    SellerTransactionsDocument,
} from '@secured-finance/sf-graph-client/dist/graphclients';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { utils } from 'ethers';
import {
    WithAppLayout,
    WithAssetPrice,
    WithWalletProvider,
} from 'src/../.storybook/decorators';
import { PortfolioManagement } from './PortfolioManagement';

const fil = utils.formatBytes32String('FIL');
const eth = utils.formatBytes32String('ETH');
const btc = utils.formatBytes32String('BTC');

export default {
    title: 'Pages/PortfolioManagement',
    component: PortfolioManagement,
    args: {},
    decorators: [WithAssetPrice, WithAppLayout, WithWalletProvider],
    parameters: {
        apolloClient: {
            mocks: [
                {
                    request: {
                        query: BuyerTransactionsDocument,
                        variables: {
                            address: '',
                        },
                    },
                    result: {
                        data: {
                            transactions: [],
                        },
                    },
                },
                {
                    request: {
                        query: SellerTransactionsDocument,
                        variables: {
                            address: '',
                        },
                    },
                    result: {
                        data: {
                            transactions: [],
                        },
                    },
                },
                {
                    request: {
                        query: BuyerTransactionsDocument,
                        variables: {
                            address:
                                '0xb98bd7c7f656290071e52d1aa617d9cb4467fd6d',
                        },
                    },

                    result: {
                        data: {
                            transactions: [
                                {
                                    currency: fil,
                                    side: '0',
                                    maturity: '1733011200',
                                    amount: '1000000000000000000000',
                                    rate: '200000',
                                },
                                {
                                    currency: btc,
                                    side: '1',
                                    maturity: '1733011200',
                                    amount: '1000000000',
                                    rate: '100000',
                                },
                            ],
                        },
                    },
                },
                {
                    request: {
                        query: SellerTransactionsDocument,
                        variables: {
                            address:
                                '0xb98bd7c7f656290071e52d1aa617d9cb4467fd6d',
                        },
                    },
                    result: {
                        data: {
                            transactions: [
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
