import { composeStories } from '@storybook/react';
import { mockUseSF } from 'src/stories/mocks/useSFMock';
import { fireEvent, render, screen, waitFor } from 'src/test-utils.js';
import * as stories from './Itayose.stories';

const { Default } = composeStories(stories);

jest.mock('next/router', () => ({
    useRouter: jest.fn(() => ({
        pathname: '/',
        push: jest.fn(),
    })),
}));

jest.mock(
    'next/link',
    () =>
        ({ children }: { children: React.ReactNode }) =>
            children
);

const mockSecuredFinance = mockUseSF();
jest.mock('src/hooks/useSecuredFinance', () => () => mockSecuredFinance);

describe('Itayose Component', () => {
    it('should render a Itayose', async () => {
        await waitFor(() => render(<Default />));
    });

    it('should convert the amount to changed currency when the user change the currency', async () => {
        const { store } = await waitFor(() => render(<Default />));
        expect(store.getState().landingOrderForm.amount).toEqual('0');
        fireEvent.change(screen.getByRole('textbox', { name: 'Amount' }), {
            target: { value: '1' },
        });
        expect(store.getState().landingOrderForm.amount).toEqual(
            '1000000000000000000'
        );
        await waitFor(() => {
            fireEvent.click(screen.getByRole('button', { name: 'WFIL' }));
            fireEvent.click(screen.getByRole('menuitem', { name: 'USDC' }));
        });
        expect(store.getState().landingOrderForm.amount).toEqual('1000000');
        expect(screen.getByRole('textbox', { name: 'Amount' })).toHaveValue(
            '1'
        );
    });

    it('should only show the pre-order orders of the user when they are connected', async () => {
        render(<Default />);
        fireEvent.click(screen.getByRole('tab', { name: 'Open Orders' }));

        const openOrders = await screen.findAllByRole('row');
        expect(openOrders).toHaveLength(1);
    });

    describe('Dynamic orderbook depth', () => {
        it('should retrieve more data when the user select only one side of the orderbook', async () => {
            render(<Default />);
            expect(
                mockSecuredFinance.getLendOrderBook
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
            await waitFor(() =>
                expect(
                    mockSecuredFinance.getBorrowOrderBook
                ).toHaveBeenLastCalledWith(
                    expect.anything(),
                    expect.anything(),
                    26
                )
            );
        });

        it('should retrieve more data when the user select a aggregation factor', async () => {
            render(<Default />);
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
