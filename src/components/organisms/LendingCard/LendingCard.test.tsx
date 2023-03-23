import { formatDate } from '@secured-finance/sf-core';
import { composeStories } from '@storybook/testing-react';
import {
    dec22Fixture,
    mar23Fixture,
    preloadedAssetPrices,
} from 'src/stories/mocks/fixtures';
import { mockUseSF } from 'src/stories/mocks/useSFMock';
import { fireEvent, render, screen, waitFor } from 'src/test-utils.js';
import { CurrencyInfo, currencyMap, Rate } from 'src/utils';
import { LoanValue } from 'src/utils/entities';
import * as stories from './LendingCard.stories';

const { Default } = composeStories(stories);

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
    it('should render a LendingCard', async () => {
        await waitFor(() => render(<Default />));
    });

    it('should render the component with Borrow as the default', async () => {
        await waitFor(() => render(<Default />, { preloadedState }));
        expect(screen.getByTestId('place-order-button')).toHaveTextContent(
            'Borrow'
        );
    });

    it('should open confirm order dialog when borrow button is clicked', async () => {
        await waitFor(() => render(<Default />, { preloadedState }));

        fireEvent.click(screen.getByTestId('place-order-button'));

        expect(screen.getByRole('dialog')).toBeInTheDocument();
        expect(screen.getByText('Confirm Order')).toBeInTheDocument();

        const button = screen.getByTestId('dialog-action-button');
        expect(button).toHaveTextContent('OK');
    });

    it('should let the user choose between ETH, EFIL and USDC when clicking on the asset selector', async () => {
        await waitFor(() => render(<Default />));

        expect(screen.getAllByText(DEFAULT_CHOICE.name)).toHaveLength(2);
        expect(screen.queryByText('USDC')).not.toBeInTheDocument();
        expect(screen.queryByText('Ethereum')).not.toBeInTheDocument();
        fireEvent.click(
            screen.getByRole('button', {
                name: 'EFIL',
            })
        );
        expect(screen.getAllByText('EFIL')).toHaveLength(3);
        expect(screen.getByText('USDC')).toBeInTheDocument();
        expect(screen.getByText('Ethereum')).toBeInTheDocument();
    });

    it('should switch to Ethereum when selecting it from the option', async () => {
        await waitFor(() => render(<Default />));
        selectEthereum();
        expect(screen.getByText('Ethereum')).toBeInTheDocument();
    });

    it('should display the amount inputted by the user in USD', async () => {
        await waitFor(() => render(<Default />, { preloadedState }));
        const input = screen.getByRole('textbox');
        fireEvent.change(input, { target: { value: '10' } });

        expect(
            screen.getByText(
                `~ ${preloadedAssetPrices.assetPrices.EFIL.price * 10} USD`
            )
        ).toBeInTheDocument();
    });

    it('should display the rate from the prop', async () => {
        const rate = LoanValue.fromApy(
            new Rate(20000),
            dec22Fixture.toNumber()
        );
        await waitFor(() => render(<Default marketValue={rate} />));
        expect(screen.getByText('2.00%')).toBeInTheDocument();
    });

    it('should transform the contract label to a date', async () => {
        await waitFor(() => render(<Default />));
        fireEvent.click(
            screen.getByRole('button', {
                name: 'DEC22',
            })
        );
        fireEvent.click(screen.getByText('MAR23'));
        const dateWithTimezone = formatDate(mar23Fixture.toNumber());
        expect(screen.getByText(dateWithTimezone)).toBeInTheDocument();
    });

    it('should open the confirm order dialog to place a market order when the borrow button is clicked', async () => {
        await waitFor(() => render(<Default />, { preloadedState }));
        fireEvent.click(screen.getByTestId('place-order-button'));
        expect(screen.getByText('Confirm Order')).toBeInTheDocument();
        expect(screen.getByText('Market Order')).toBeInTheDocument();
    });

    it('should support orders with decimal amounts', async () => {
        await waitFor(() => render(<Default />, { preloadedState }));
        const input = screen.getByRole('textbox');
        fireEvent.change(input, { target: { value: '10.5' } });
        expect(
            screen.getByText(
                `~ ${preloadedAssetPrices.assetPrices.EFIL.price * 10.5} USD`
            )
        ).toBeInTheDocument();
    });
});
