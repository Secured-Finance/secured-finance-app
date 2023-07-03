import { formatDate } from '@secured-finance/sf-core';
import { composeStories } from '@storybook/testing-react';
import {
    dec22Fixture,
    mar23Fixture,
    preloadedAssetPrices,
    preloadedLendingMarkets,
} from 'src/stories/mocks/fixtures';
import { mockUseSF } from 'src/stories/mocks/useSFMock';
import { fireEvent, render, screen, waitFor } from 'src/test-utils.js';
import { CurrencyInfo, CurrencySymbol, Rate, currencyMap } from 'src/utils';
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
    const preloadedState = {
        ...preloadedAssetPrices,
        ...preloadedLendingMarkets,
        wallet: {
            balances: { [CurrencySymbol.EFIL]: 10000 },
        },
    };

    const selectEthereum = () => {
        fireEvent.click(
            screen.getByRole('button', {
                name: DEFAULT_CHOICE.name,
            })
        );
        fireEvent.click(screen.getByRole('menuitem', { name: 'Ether' }));
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
    it('should show correct market rate', async () => {
        await waitFor(() => render(<Default />, { preloadedState }));
        expect(screen.getByTestId('market-rate')).toHaveTextContent('1.00%');
    });

    it('should open confirm order dialog when borrow button is clicked', async () => {
        await waitFor(() => render(<Default />, { preloadedState }));
        const input = screen.getByRole('textbox');
        fireEvent.change(input, { target: { value: '10' } });
        fireEvent.click(screen.getByTestId('place-order-button'));
        expect(screen.getByRole('dialog')).toBeInTheDocument();
        expect(screen.getByText('Confirm Order')).toBeInTheDocument();
        const button = screen.getByTestId('dialog-action-button');
        expect(button).toHaveTextContent('OK');
    });

    it('should let the user choose between ETH, Filecoin and USDC when clicking on the asset selector', async () => {
        await waitFor(() => render(<Default />));

        expect(screen.getByText(DEFAULT_CHOICE.name)).toBeInTheDocument();
        expect(screen.queryByText('USDC')).not.toBeInTheDocument();
        expect(screen.queryByText('Ethereum')).not.toBeInTheDocument();
        fireEvent.click(
            screen.getByRole('button', {
                name: 'Filecoin',
            })
        );

        expect(
            screen.getByRole('menuitem', { name: 'USDC' })
        ).toBeInTheDocument();
        expect(
            screen.getByRole('menuitem', { name: 'Filecoin' })
        ).toBeInTheDocument();
        expect(
            screen.getByRole('menuitem', { name: 'Ether' })
        ).toBeInTheDocument();
    });

    it('should switch to Ethereum when selecting it from the option', async () => {
        await waitFor(() => render(<Default />));
        selectEthereum();
        expect(screen.getByText('Ether')).toBeInTheDocument();
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
        const rate = LoanValue.fromApr(
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
        const input = screen.getByRole('textbox');
        fireEvent.change(input, { target: { value: '10' } });
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

    it('should render a disabled button if amount is zero', async () => {
        await waitFor(() => render(<Default />, { preloadedState }));
        const input = screen.getByRole('textbox');
        expect(input).toHaveValue('');
        expect(screen.getByTestId('place-order-button')).toBeDisabled();
    });

    it('should render wallet source when side is lend', async () => {
        await waitFor(() => render(<Default />, { preloadedState }));
        const lendTab = screen.getByText('Lend');
        fireEvent.click(lendTab);
        expect(screen.getByText('Lending Source')).toBeInTheDocument();
        expect(screen.getByText('10,000 EFIL')).toBeInTheDocument();

        const walletSourceButton = screen.getByTestId(
            'wallet-source-selector-button'
        );
        fireEvent.click(walletSourceButton);

        expect(screen.getByText('SF Vault')).toBeInTheDocument();
        const option = screen.getByTestId('option-1');
        fireEvent.click(option);
        expect(screen.getByText('100 EFIL')).toBeInTheDocument();
    });

    it('should show Collateral Usage and Available to Borrow only in Borrow order', async () => {
        await waitFor(() => render(<Default />, { preloadedState }));
        expect(screen.queryByText('Available to borrow')).toBeInTheDocument();
        expect(screen.queryByText('Collateral Usage')).toBeInTheDocument();
        const lendTab = screen.getByText('Lend');
        fireEvent.click(lendTab);
        expect(
            screen.queryByText('Available to borrow')
        ).not.toBeInTheDocument();
        expect(screen.queryByText('Collateral Usage')).not.toBeInTheDocument();
    });
});
