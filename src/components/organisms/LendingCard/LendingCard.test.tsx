import { composeStories } from '@storybook/testing-react';
import { BigNumber } from 'ethers';
import { OrderSide } from 'src/hooks';
import { preloadedAssetPrices } from 'src/stories/mocks/fixtures';
import { mockUseSF } from 'src/stories/mocks/useSFMock';
import { fireEvent, render, screen, waitFor } from 'src/test-utils.js';
import { CurrencyInfo, currencyMap, CurrencySymbol } from 'src/utils';
import * as stories from './LendingCard.stories';

const { Default, PendingTransaction } = composeStories(stories);

const mockSecuredFinance = mockUseSF();
jest.mock('src/hooks/useSecuredFinance', () => () => mockSecuredFinance);

const DEFAULT_CHOICE = Object.values(currencyMap).reduce<CurrencyInfo>(
    (acc, ccy) => {
        if (acc.index < ccy.index) {
            return acc;
        }
        return ccy;
    },
    { ...currencyMap.ETH }
);

describe('LendingCard Component', () => {
    const preloadedState = { ...preloadedAssetPrices };

    const selectEthereum = () => {
        fireEvent.click(
            screen.getByRole('button', {
                name: DEFAULT_CHOICE.name,
            })
        );
        fireEvent.click(screen.getByText('Ethereum'));
    };
    it('should render a LendingCard', () => {
        render(<Default />);
    });

    it('should render the component with Borrow as the default', () => {
        render(<Default />);
        expect(screen.getByTestId('place-order-button')).toHaveTextContent(
            'Borrow'
        );
    });

    it('should let the user choose between ETH, FIL and USDC when clicking on the asset selector', () => {
        render(<Default />);
        expect(screen.getAllByText(DEFAULT_CHOICE.name)).toHaveLength(1);
        expect(screen.queryByText('USDC')).not.toBeInTheDocument();
        expect(screen.queryByText('Ethereum')).not.toBeInTheDocument();
        fireEvent.click(
            screen.getByRole('button', {
                name: 'Filecoin',
            })
        );
        expect(screen.getAllByText('Filecoin')).toHaveLength(2);
        expect(screen.getByText('USDC')).toBeInTheDocument();
        expect(screen.getByText('Ethereum')).toBeInTheDocument();
    });

    it('should switch to Ethereum when selecting it from the option', () => {
        render(<Default />);
        selectEthereum();
        expect(screen.getByText('Ethereum')).toBeInTheDocument();
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
                DEFAULT_CHOICE.symbol,
                BigNumber.from(1),
                OrderSide.Borrow,
                BigNumber.from(0),
                100
            )
        );
    });

    it('should call the onPlaceOrder function with the argument selected asset and amount when clicking on the action button', async () => {
        const onPlaceOrder = jest.fn();
        render(<Default onPlaceOrder={onPlaceOrder} />);
        selectEthereum();
        const input = screen.getByRole('textbox');
        fireEvent.change(input, { target: { value: '10' } });
        fireEvent.click(screen.getByTestId('place-order-button'));

        await waitFor(() =>
            expect(onPlaceOrder).toHaveBeenCalledWith(
                CurrencySymbol.ETH,
                BigNumber.from(1),
                OrderSide.Borrow,
                currencyMap.FIL.toBaseUnit(10),
                100
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

    it('should display the amount inputted by the user in USD', () => {
        render(<Default />, { preloadedState });
        const input = screen.getByRole('textbox');
        fireEvent.change(input, { target: { value: '10' } });

        expect(
            screen.getByText(
                `~ ${preloadedAssetPrices.assetPrices.FIL.price * 10} USD`
            )
        ).toBeInTheDocument();
    });

    it('should display the rate from the prop', () => {
        render(<Default marketRate={2000} />);
        expect(screen.getByText('0.2%')).toBeInTheDocument();
    });

    it('should transform the contract label to a date', () => {
        render(<Default />);
        fireEvent.click(
            screen.getByRole('button', {
                name: 'MAR22',
            })
        );
        fireEvent.click(screen.getByText('MAR23'));
        expect(screen.getByText('Mar 1, 2023')).toBeInTheDocument();
    });
});
