import * as analytics from '@amplitude/analytics-browser';
import { composeStories } from '@storybook/react';
import { mockUseSF } from 'src/stories/mocks/useSFMock';
import { fireEvent, render, screen, waitFor } from 'src/test-utils.js';
import { ButtonEvents, ButtonProperties } from 'src/utils';

import * as stories from './AdvancedLending.stories';

const { Default, ConnectedToWallet, OpenOrdersConnectedToWallet } =
    composeStories(stories);

const mockSecuredFinance = mockUseSF();
jest.mock('src/hooks/useSecuredFinance', () => () => mockSecuredFinance);

beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
});

afterEach(() => {
    jest.restoreAllMocks();
});

describe('Advance Lending with Itayose', () => {
    it('should not show disclaimer for maximum open order limit if user has less than 20 open orders', async () => {
        await waitFor(() =>
            render(<OpenOrdersConnectedToWallet />, {
                apolloMocks: Default.parameters?.apolloClient.mocks,
            })
        );
        const btn = screen.getAllByRole('button', { name: 'WFIL-DEC2022' });
        fireEvent.click(btn[0]);

        await waitFor(() => {
            expect(
                screen.getByRole('row', { name: 'USDC-DEC2022' })
            ).toBeInTheDocument();
        });

        fireEvent.click(screen.getByRole('row', { name: 'USDC-DEC2022' }));

        await waitFor(() =>
            expect(
                screen.queryByText(
                    'You will not be able to place additional orders as you currently have the maximum number of 20 orders. Please wait for your order to be filled or cancel existing orders before adding more.'
                )
            ).not.toBeInTheDocument()
        );
    }, 8000);

    it('should retrieve more data when the user select only one side of the orderbook', async () => {
        await waitFor(() => render(<Default />));
        expect(mockSecuredFinance.getBorrowOrderBook).toHaveBeenLastCalledWith(
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
        expect(mockSecuredFinance.getBorrowOrderBook).toHaveBeenLastCalledWith(
            expect.anything(),
            expect.anything(),
            expect.anything(),
            30
        );
    });

    it('should retrieve more data when the user select a aggregation factor', async () => {
        await waitFor(() => render(<Default />));
        expect(mockSecuredFinance.getLendOrderBook).toHaveBeenLastCalledWith(
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
    });

    it('should display the last trades in the top bar', async () => {
        render(<Default />);

        expect(screen.getByText('Maturity Dec 1, 2022')).toBeInTheDocument();

        expect(screen.getAllByText('Mark Price')[0]).toBeInTheDocument();
        expect(screen.getAllByText('--.--')[0]).toBeInTheDocument();

        expect(screen.getAllByText('Last Price')[0]).toBeInTheDocument();
        expect(screen.getAllByText('0.00')[0]).toBeInTheDocument();
    });

    it('should show the maturity as a date for the selected maturity', async () => {
        render(<Default />);
        const btn = await screen.findAllByRole('button', {
            name: 'WFIL-DEC2022',
        });
        expect(btn[0]).toBeInTheDocument();
    });

    it('should not display disclaimer if no currency is being delisted', () => {
        render(<Default />);
        expect(
            screen.queryByText('WFIL will be delisted')
        ).not.toBeInTheDocument();
    });

    it('should only show the orders of the user related to orderbook', async () => {
        await waitFor(() => render(<ConnectedToWallet />));
        fireEvent.click(screen.getByRole('tab', { name: 'Open Orders' }));

        expect(await screen.findAllByTestId('Open Orders')).toHaveLength(1);
    });

    it('should display the opening unit price as the only trade if there is no last trades', async () => {
        await waitFor(() => render(<Default />));
        expect(screen.getByText('Maturity Dec 1, 2022')).toBeInTheDocument();

        expect(screen.getAllByText('Mark Price')[1]).toBeInTheDocument();
        expect(screen.getAllByText('--.--')[1]).toBeInTheDocument();

        expect(screen.getAllByText('0.00')[1]).toBeInTheDocument();
    });

    it('should not reset the amount and emit TERM_CHANGE and CURRENCY_CHANGE event when the user change the maturity', async () => {
        const track = jest.spyOn(analytics, 'track');
        const { store } = await waitFor(() => render(<ConnectedToWallet />));
        expect(store.getState().landingOrderForm.amount).toEqual('');

        await waitFor(() =>
            fireEvent.input(screen.getByRole('textbox', { name: 'Size' }), {
                target: { value: '1' },
            })
        );

        await waitFor(() => {
            fireEvent.click(
                screen.getByRole('button', { name: /ETH-DEC2022/ })
            );
            fireEvent.click(screen.getByText('ETH-MAR2023'));
        });

        expect(track).toHaveBeenCalledWith(ButtonEvents.TERM_CHANGE, {
            [ButtonProperties.TERM]: 'MAR2023',
        });
        expect(track).toHaveBeenCalledWith(ButtonEvents.CURRENCY_CHANGE, {
            [ButtonProperties.CURRENCY]: 'ETH',
        });
    });
});
