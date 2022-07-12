import { composeStories } from '@storybook/testing-react';
import { mockUseSF } from 'src/stories/mocks/useSFMock';
import { fireEvent, render, screen, waitFor } from 'src/test-utils.js';
import * as stories from './LendingCard.stories';

const { Default, PendingTransaction } = composeStories(stories);

const mockSecuredFinance = mockUseSF();
jest.mock('src/hooks/useSecuredFinance', () => () => mockSecuredFinance);

describe('LendingCard Component', () => {
    const preloadedState = {
        assetPrices: {
            filecoin: {
                price: 5.87,
                change: -8.208519783216566,
            },
            ethereum: {
                price: 2000.34,
                change: 0.5162466489453748,
            },
            usdc: {
                price: 1.002,
                change: 0.042530768538486696,
            },
        },
    };

    const selectFilecoin = () => {
        fireEvent.click(
            screen.getByRole('button', {
                name: 'Ethereum',
            })
        );
        fireEvent.click(screen.getByText('Filecoin'));
    };
    it('should render a LendingCard', () => {
        render(<Default />);
    });

    it('should render the component with Borrow as the default', () => {
        render(<Default />);
        expect(screen.getByText('Borrow')).toBeInTheDocument();
    });

    it('should let the user choose between ETH, FIL and USDC when clicking on the asset selector', () => {
        render(<Default />);
        expect(screen.getAllByText('Ethereum')).toHaveLength(1);
        expect(screen.queryByText('USDC')).not.toBeInTheDocument();
        expect(screen.queryByText('Filecoin')).not.toBeInTheDocument();
        fireEvent.click(
            screen.getByRole('button', {
                name: 'Ethereum',
            })
        );
        expect(screen.getAllByText('Ethereum')).toHaveLength(2);
        expect(screen.getByText('USDC')).toBeInTheDocument();
        expect(screen.getByText('Filecoin')).toBeInTheDocument();
    });

    it('should switch to Filecoin when selecting it from the option', () => {
        render(<Default />);
        selectFilecoin();
        expect(screen.getByText('Filecoin')).toBeInTheDocument();
    });

    it('should disable the action button when the transaction is pending', () => {
        render(<PendingTransaction />);
        const button = screen.getByTestId('place-order-button');
        expect(button).not.toBeDisabled();
        fireEvent.click(button);

        expect(screen.getByTestId('place-order-button')).toBeDisabled();
    });

    it('should call the onPlaceOrder with the initial value when click on the action button', async () => {
        const onPlaceOrder = jest.fn();
        render(<Default onPlaceOrder={onPlaceOrder} />);
        const button = screen.getByTestId('place-order-button');
        fireEvent.click(button);
        await waitFor(() =>
            expect(onPlaceOrder).toHaveBeenCalledWith('ETH', '3M', 0, 0, 100)
        );
    });

    it('should call the onPlaceOrder function with the argument selected asset and amount when clicking on the action button', async () => {
        const onPlaceOrder = jest.fn();
        render(<Default onPlaceOrder={onPlaceOrder} />);
        selectFilecoin();
        const input = screen.getByRole('textbox');
        fireEvent.change(input, { target: { value: '10' } });
        fireEvent.click(screen.getByTestId('place-order-button'));

        await waitFor(() =>
            expect(onPlaceOrder).toHaveBeenCalledWith('FIL', '3M', 0, 10, 100)
        );
    });

    it('should write an error in the store if onPlaceOrder throw an error', async () => {
        const onPlaceOrder = jest.fn(() => {
            throw new Error('This is an error');
        });
        const { store } = render(<Default onPlaceOrder={onPlaceOrder} />);
        fireEvent.click(screen.getByTestId('place-order-button'));
        await waitFor(() =>
            expect(store.getState().lastError.lastMessage).toEqual(
                'This is an error'
            )
        );
    });

    it('should display the amount inputted by the user in USD', () => {
        render(<Default />, { preloadedState });
        const input = screen.getByRole('textbox');
        fireEvent.change(input, { target: { value: '10' } });
        expect(screen.getByText('~ 20,003.4 USD')).toBeInTheDocument();
    });

    it('should display the rate from the prop', () => {
        render(<Default marketRate={20} />);
        expect(screen.getByText('0.2 %')).toBeInTheDocument();
    });

    it('should select the term from the store', () => {
        render(<Default />, {
            preloadedState: {
                landingOrderForm: { term: '1Y' },
            },
        });
        expect(screen.getAllByText('1 Year')).toHaveLength(2);
    });

    it.skip('should be mounted with a default rate', () => {
        render(<Default />);
        expect(screen.getByText('0 %')).toBeInTheDocument();
    });

    it.skip('should update the rate when changing the term', () => {
        render(<Default />);
        fireEvent.click(screen.getByText('1 Year'));
        expect(screen.getByText('20 %')).toBeInTheDocument();
    });

    it.skip('should update the rate when changing the asset', () => {
        render(<Default />);
        fireEvent.click(screen.getByText('Ethereum'));
        expect(screen.getByText('0 %')).toBeInTheDocument();
    });
});
