import { composeStories } from '@storybook/react';
import { emptyTransaction } from 'src/stories/mocks/queries';
import { mockUseSF } from 'src/stories/mocks/useSFMock';
import { fireEvent, render, screen, waitFor, within } from 'src/test-utils.js';
import * as stories from './AdvancedLending.stories';

const { Default, ConnectedToWallet } = composeStories(stories);

const mockSecuredFinance = mockUseSF();
jest.mock('src/hooks/useSecuredFinance', () => () => mockSecuredFinance);

describe.skip('Advanced Lending Component', () => {
    it('should convert the amount to new currency when the user change the currency', async () => {
        const { store } = await waitFor(() =>
            render(<Default />, {
                apolloMocks: Default.parameters?.apolloClient.mocks,
            })
        );
        expect(store.getState().landingOrderForm.amount).toEqual('0');
        fireEvent.change(screen.getByRole('textbox', { name: 'Amount' }), {
            target: { value: '1' },
        });
        expect(store.getState().landingOrderForm.amount).toEqual(
            '1000000000000000000'
        );
        fireEvent.click(screen.getByRole('button', { name: 'Filecoin' }));
        fireEvent.click(screen.getByRole('menuitem', { name: 'USDC' }));
        expect(store.getState().landingOrderForm.amount).toEqual('1000000');
        expect(screen.getByRole('textbox', { name: 'Amount' })).toHaveValue(
            '1'
        );
    });

    it.skip('should not reset the amount when the user change the maturity', async () => {
        const { store } = await waitFor(() =>
            render(<Default />, {
                apolloMocks: Default.parameters?.apolloClient.mocks,
            })
        );
        expect(store.getState().landingOrderForm.amount).toEqual('0');
        fireEvent.change(screen.getByRole('textbox', { name: 'Amount' }), {
            target: { value: '1' },
        });
        expect(store.getState().landingOrderForm.amount).toEqual(
            '1000000000000000000'
        );
        fireEvent.click(screen.getByRole('button', { name: 'DEC22' }));
        fireEvent.click(screen.getByText('MAR23'));
        expect(store.getState().landingOrderForm.amount).toEqual(
            '1000000000000000000'
        );
        expect(screen.getByRole('textbox', { name: 'Amount' })).toHaveValue(
            '1'
        );
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
                screen.getByLabelText('Last Trade Analytics')
            ).findByText('80.00')
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

    it('should display the opening unit price as the only trade if there is no last trades', async () => {
        await waitFor(() =>
            render(<Default />, {
                apolloMocks: emptyTransaction as never,
            })
        );
        expect(
            await within(
                screen.getByLabelText('Last Trade Analytics')
            ).findByText('97.10')
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

    it('should only show the orders of the user related to orderbook', async () => {
        await waitFor(() =>
            render(<ConnectedToWallet />, {
                apolloMocks: Default.parameters?.apolloClient.mocks,
            })
        );
        fireEvent.click(screen.getByRole('tab', { name: 'Open Orders' }));

        const openOrders = await screen.findAllByRole('row');
        expect(openOrders).toHaveLength(1);
    });
});
