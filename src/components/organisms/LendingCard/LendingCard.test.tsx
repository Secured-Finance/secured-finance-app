import { composeStories } from '@storybook/testing-react';
import { mockUseSF } from 'src/stories/mocks/useSFMock';
import { fireEvent, render, screen, waitFor } from 'src/test-utils.js';
import * as stories from './LendingCard.stories';

const { Default, PendingTransaction } = composeStories(stories);

const mockSecuredFinance = mockUseSF();
jest.mock('src/hooks/useSecuredFinance', () => () => mockSecuredFinance);

describe('LendingCard Component', () => {
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
            expect(onPlaceOrder).toHaveBeenCalledWith(
                'Ethereum',
                'Sep 2022',
                0,
                0,
                0
            )
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
            expect(onPlaceOrder).toHaveBeenCalledWith(
                'Filecoin',
                'Sep 2022',
                0,
                10,
                0
            )
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
});
