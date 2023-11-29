import { composeStories } from '@storybook/react';
import { emptyTransaction } from 'src/stories/mocks/queries';
import { mockUseSF } from 'src/stories/mocks/useSFMock';
import { fireEvent, render, screen, waitFor, within } from 'src/test-utils.js';
import * as stories from './AdvancedLending.stories';

const { Default, ConnectedToWallet, Delisted } = composeStories(stories);

const mockSecuredFinance = mockUseSF();
jest.mock('src/hooks/useSecuredFinance', () => () => mockSecuredFinance);

describe.skip('Advanced Lending Component', () => {
    it.skip('should convert the amount to new currency when the user change the currency', async () => {
        const { store } = await waitFor(() =>
            render(<ConnectedToWallet />, {
                apolloMocks: Default.parameters?.apolloClient.mocks,
            })
        );
        expect(store.getState().landingOrderForm.amount).toEqual('0');
        await waitFor(() =>
            fireEvent.input(screen.getByRole('textbox', { name: 'Amount' }), {
                target: { value: '1' },
            })
        );
        expect(store.getState().landingOrderForm.amount).toEqual(
            '1000000000000000000'
        );
        fireEvent.click(screen.getByRole('button', { name: 'WFIL' }));
        fireEvent.click(screen.getByRole('menuitem', { name: 'USDC' }));
        await waitFor(() => {
            expect(store.getState().landingOrderForm.amount).toEqual('1000000');
            expect(screen.getByRole('textbox', { name: 'Amount' })).toHaveValue(
                '1'
            );
        });
    });

    it('should not reset the amount when the user change the maturity', async () => {
        const { store } = await waitFor(() =>
            render(<ConnectedToWallet />, {
                apolloMocks: Default.parameters?.apolloClient.mocks,
            })
        );
        expect(store.getState().landingOrderForm.amount).toEqual('0');
        await waitFor(() =>
            fireEvent.input(screen.getByRole('textbox', { name: 'Amount' }), {
                target: { value: '1' },
            })
        );
        expect(store.getState().landingOrderForm.amount).toEqual(
            '1000000000000000000'
        );
        fireEvent.click(screen.getByRole('button', { name: 'DEC22' }));
        fireEvent.click(screen.getByText('MAR23'));
        await waitFor(() => {
            expect(store.getState().landingOrderForm.amount).toEqual(
                '1000000000000000000'
            );
            expect(screen.getByRole('textbox', { name: 'Amount' })).toHaveValue(
                '1'
            );
        });
    });

    it('should show the maturity as a date for the selected maturity', async () => {
        render(<Default />, {
            apolloMocks: Default.parameters?.apolloClient.mocks,
        });
        expect(
            await screen.findByRole('button', { name: 'DEC22' })
        ).toBeInTheDocument();
        expect(screen.getByText('Maturity Dec 1, 2022')).toBeInTheDocument();
    });

    it('should display the last trades in the top bar', async () => {
        render(<Default />, {
            apolloMocks: Default.parameters?.apolloClient.mocks,
        });

        expect(
            await within(
                await screen.findByLabelText('Current Market')
            ).findByText('98.01')
        ).toBeInTheDocument();

        expect(
            within(screen.getByLabelText('24h High')).getByText('90.00')
        ).toBeInTheDocument();
        expect(
            within(screen.getByLabelText('24h Low')).getByText('80.00')
        ).toBeInTheDocument();
        expect(
            within(screen.getByLabelText('24h Trades')).getByText('2')
        ).toBeInTheDocument();
        expect(
            within(screen.getByLabelText('24h Volume')).getByText('0')
        ).toBeInTheDocument();
    });

    it.skip('should display the opening unit price as the only trade if there is no last trades', async () => {
        await waitFor(() =>
            render(<Default />, {
                apolloMocks: emptyTransaction as never,
            })
        );
        expect(
            await within(
                await screen.findByLabelText('Current Market')
            ).findByText('97.01')
        ).toBeInTheDocument();
        expect(screen.getByText('Opening Price')).toBeInTheDocument();

        expect(
            within(screen.getByLabelText('24h High')).getByText('0.00')
        ).toBeInTheDocument();
        expect(
            within(screen.getByLabelText('24h Low')).getByText('0.00')
        ).toBeInTheDocument();
        expect(
            within(screen.getByLabelText('24h Trades')).getByText(0)
        ).toBeInTheDocument();
        expect(
            within(screen.getByLabelText('24h Volume')).getByText('-')
        ).toBeInTheDocument();
    });

    it.skip('should only show the orders of the user related to orderbook', async () => {
        await waitFor(() =>
            render(<ConnectedToWallet />, {
                apolloMocks: Default.parameters?.apolloClient.mocks,
            })
        );
        await waitFor(() =>
            fireEvent.click(screen.getByRole('tab', { name: 'Open Orders' }))
        );
        expect(
            within(screen.getByTestId('open-order-table')).queryAllByRole('row')
        ).toHaveLength(2);
    });

    it('should display disclaimer if a currency is being delisted', () => {
        render(<Delisted />, {
            apolloMocks: Default.parameters?.apolloClient.mocks,
        });
        expect(screen.getByText('WFIL will be delisted')).toBeInTheDocument();
    });

    it('should not display disclaimer if no currency is being delisted', () => {
        render(<Default />, {
            apolloMocks: Default.parameters?.apolloClient.mocks,
        });
        expect(
            screen.queryByText('WFIL will be delisted')
        ).not.toBeInTheDocument();
    });

    describe('Dynamic orderbook depth', () => {
        it('should retrieve more data when the user select only one side of the orderbook', async () => {
            await waitFor(() =>
                render(<Default />, {
                    apolloMocks: Default.parameters?.apolloClient.mocks,
                })
            );
            expect(
                mockSecuredFinance.getBorrowOrderBook
            ).toHaveBeenLastCalledWith(
                expect.anything(),
                expect.anything(),
                13
            );
            await waitFor(() =>
                fireEvent.click(
                    screen.getByRole('button', {
                        name: 'Show Only Lend Orders',
                    })
                )
            );
            expect(
                mockSecuredFinance.getBorrowOrderBook
            ).toHaveBeenLastCalledWith(
                expect.anything(),
                expect.anything(),
                26
            );
        });

        it('should retrieve more data when the user select a aggregation factor', async () => {
            await waitFor(() =>
                render(<Default />, {
                    apolloMocks: Default.parameters?.apolloClient.mocks,
                })
            );
            expect(
                mockSecuredFinance.getLendOrderBook
            ).toHaveBeenLastCalledWith(
                expect.anything(),
                expect.anything(),
                13
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
                    1300
                )
            );
        });
    });
});
