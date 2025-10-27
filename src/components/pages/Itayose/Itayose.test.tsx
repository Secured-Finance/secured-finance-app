import { OrderSide } from '@secured-finance/sf-client';
import { composeStories } from '@storybook/react';
import { zeroRates } from 'src/hooks/useYieldCurveHistoricalRates/constant';
import { dec22Fixture } from 'src/stories/mocks/fixtures';
import { mockUseSF } from 'src/stories/mocks/useSFMock';
import {
    fireEvent,
    render,
    screen,
    waitFor,
    cleanupGraphQLMocks,
} from 'src/test-utils.js';
import graphqlMocks from 'src/test-utils/mockData';
import { CurrencySymbol } from 'src/utils';
import * as stories from './Itayose.stories';

const { Default } = composeStories(stories);

jest.mock('next/router', () => ({
    useRouter: jest.fn(() => ({
        pathname: '/',
        push: jest.fn(),
        query: { market: 'WBTC-DEC2024' },
    })),
}));

jest.mock(
    'next/link',
    () =>
        ({ children }: { children: React.ReactNode }) =>
            children
);

jest.mock('src/hooks/useYieldCurveHistoricalRates', () => ({
    useYieldCurveMarketRatesHistorical: jest.fn(() => ({
        historicalRates: zeroRates,
        loading: false,
    })),
}));

// Mock generated hooks to avoid GraphQL query issues
jest.mock('src/generated/subgraph', () => ({
    ...jest.requireActual('src/generated/subgraph'),
    useFilteredUserOrderHistoryQuery: jest.fn(() => ({
        data: {
            user: {
                id: '0xB98bD7C7f656290071E52D1aA617D9cB4467Fd6D',
                orders: [
                    {
                        id: 'order-1',
                        currency:
                            '0x555344430000000000000000000000000000000000000000000000000000000', // USDC
                        maturity: '1703980800',
                        side: 0, // OrderSide.LEND
                        inputUnitPrice: '960000000000000000',
                        inputAmount: '500000000000000000',
                        filledAmount: '300000000000000000',
                        status: 1, // PartiallyFilled
                        createdAt: '1671080520',
                        type: 0, // Market
                    },
                    {
                        id: 'order-2',
                        currency:
                            '0x555344430000000000000000000000000000000000000000000000000000000', // USDC
                        maturity: '1703980800',
                        side: 1, // OrderSide.BORROW
                        inputUnitPrice: '940000000000000000',
                        inputAmount: '1000000000000000000',
                        filledAmount: '0',
                        status: 0, // Open
                        createdAt: '1671080521',
                        type: 1, // Limit
                    },
                ],
            },
        },
        isLoading: false,
        error: null,
    })),
    useTransactionsHistory24HQuery: jest.fn(() => ({
        data: {
            transactionHistory: [
                {
                    id: 'transaction-1',
                    amount: '500000000000000000',
                    executionPrice: '960000000000000000',
                    side: 0,
                    currency:
                        '0x555344430000000000000000000000000000000000000000000000000000000',
                    maturity: '1703980800',
                    createdAt: '1671080520',
                    txHash: '0xabc123',
                    user: { id: '0xB98bD7C7f656290071E52D1aA617D9cB4467Fd6D' },
                },
            ],
        },
        isLoading: false,
        error: null,
    })),
}));

const preloadedState = {
    landingOrderForm: {
        currency: CurrencySymbol.WBTC,
        maturity: dec22Fixture,
        side: OrderSide.BORROW,
        amount: '0',
        unitPrice: 0,
    },
};

const mockSecuredFinance = mockUseSF();
jest.mock('src/hooks/useSecuredFinance', () => () => mockSecuredFinance);

describe('Itayose Component', () => {
    afterEach(() => {
        cleanupGraphQLMocks();
    });
    it('should render a Itayose', async () => {
        await waitFor(() =>
            render(<Default />, {
                graphqlMocks: graphqlMocks.withTransactions,
            })
        );
    });

    it.skip('should convert the amount to changed currency when the user change the currency', async () => {
        const { store } = await waitFor(() =>
            render(<Default />, {
                preloadedState,
                graphqlMocks: graphqlMocks.withTransactions,
            })
        );
        expect(store.getState().landingOrderForm.amount).toEqual('0');
        const ele = await screen.findByRole('textbox', { name: 'Size' });
        await waitFor(() => {
            fireEvent.change(ele, {
                target: { value: '1' },
            });
        });
        expect(store.getState().landingOrderForm.amount).toEqual('1');

        fireEvent.click(screen.getByRole('button', { name: 'WBTC-DEC2024' }));
        fireEvent.click(screen.getByRole('row', { name: 'WFIL-DEC2024' }));

        await waitFor(() => {
            expect(store.getState().landingOrderForm.amount).toEqual('1');
            expect(screen.getByRole('textbox', { name: 'Size' })).toHaveValue(
                '1'
            );
        });
    }, 8000);

    it('should only show the pre-order orders of the user when they are connected', async () => {
        render(<Default />, {
            apolloMocks: Default.parameters?.apolloClient.mocks,
        });
        fireEvent.click(screen.getByRole('tab', { name: 'Open Orders' }));

        const openOrders = await screen.findAllByRole('row');
        expect(openOrders).toHaveLength(1);
    });

    describe.skip('Dynamic orderbook depth', () => {
        it('should retrieve more data when the user select only one side of the orderbook', async () => {
            render(<Default />, {
                graphqlMocks: graphqlMocks.withTransactions,
            });
            expect(
                mockSecuredFinance.getLendOrderBook
            ).toHaveBeenLastCalledWith(
                expect.anything(),
                expect.anything(),
                expect.anything(),
                15
            );
            await waitFor(() =>
                fireEvent.click(
                    screen.getByRole('button', {
                        name: 'Show Only Lend Orders',
                    })
                )
            );
            await waitFor(() =>
                expect(
                    mockSecuredFinance.getBorrowOrderBook
                ).toHaveBeenLastCalledWith(
                    expect.anything(),
                    expect.anything(),
                    expect.anything(),
                    30
                )
            );
        });

        it('should retrieve more data when the user select a aggregation factor', async () => {
            render(<Default />, {
                graphqlMocks: graphqlMocks.withTransactions,
            });
            expect(
                mockSecuredFinance.getLendOrderBook
            ).toHaveBeenLastCalledWith(
                expect.anything(),
                expect.anything(),
                expect.anything(),
                15
            );
            await waitFor(() => {
                fireEvent.click(screen.getByRole('button', { name: '0.01' }));
                fireEvent.click(screen.getByRole('menuitem', { name: '1' }));
            });
            await waitFor(() =>
                expect(
                    mockSecuredFinance.getLendOrderBook
                ).toHaveBeenLastCalledWith(
                    expect.anything(),
                    expect.anything(),
                    expect.anything(),
                    1500
                )
            );
        }, 8000);
    });
});
