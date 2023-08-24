import { formatDate } from '@secured-finance/sf-core';
import { composeStories } from '@storybook/react';
import {
    mar23Fixture,
    preloadedAssetPrices,
    preloadedLendingMarkets,
} from 'src/stories/mocks/fixtures';
import { mockUseSF } from 'src/stories/mocks/useSFMock';
import { fireEvent, render, screen, waitFor } from 'src/test-utils.js';
import { CurrencyInfo, CurrencySymbol, currencyMap } from 'src/utils';
import timemachine from 'timemachine';
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

beforeAll(() => {
    timemachine.reset();
    timemachine.config({
        dateString: '2022-02-01T11:00:00.00Z',
    });
});

describe('LendingCard Component', () => {
    const preloadedState = {
        ...preloadedAssetPrices,
        ...preloadedLendingMarkets,
        wallet: {
            balances: {
                [CurrencySymbol.WFIL]: 10000,
                [CurrencySymbol.USDC]: 10000,
            },
        },
    };

    const selectEthereum = async () => {
        await waitFor(() => {
            fireEvent.click(
                screen.getByRole('button', {
                    name: DEFAULT_CHOICE.name,
                })
            );
            fireEvent.click(screen.getByRole('menuitem', { name: 'Ether' }));
        });
    };
    it('should render a LendingCard', async () => {
        await waitFor(() => render(<Default />));
    });

    it('should render the component with Borrow as the default', async () => {
        render(<Default />, { preloadedState });
        expect(
            await screen.findByTestId('place-order-button')
        ).toHaveTextContent('Borrow');
    });

    it('should show correct market rate', async () => {
        render(<Default />, { preloadedState });
        expect(await screen.findByTestId('market-rate')).toHaveTextContent(
            '1.01%'
        );
    });

    it('should open confirm order dialog when borrow button is clicked', async () => {
        await waitFor(() => render(<Default />, { preloadedState }));
        const input = screen.getByRole('textbox');
        fireEvent.change(input, { target: { value: '10' } });
        await waitFor(() => {
            fireEvent.click(screen.getByTestId('place-order-button'));
        });
        expect(screen.getByRole('dialog')).toBeInTheDocument();
        expect(screen.getByText('Confirm Order')).toBeInTheDocument();
        const button = screen.getByTestId('dialog-action-button');
        expect(button).toHaveTextContent('OK');
    });

    it('should let the user choose between ETH, Filecoin and USDC when clicking on the asset selector', async () => {
        render(<Default />);

        expect(
            await screen.findByText(DEFAULT_CHOICE.name)
        ).toBeInTheDocument();
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
        await selectEthereum();
        expect(screen.getByText('Ether')).toBeInTheDocument();
    });

    it('should display the amount inputted by the user in USD', async () => {
        await waitFor(() => render(<Default />, { preloadedState }));
        const input = screen.getByRole('textbox');
        fireEvent.change(input, { target: { value: '10' } });

        expect(
            screen.getByText(
                `~ $${preloadedAssetPrices.assetPrices.WFIL.price * 10}`
            )
        ).toBeInTheDocument();
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
        await waitFor(() => {
            fireEvent.click(screen.getByTestId('place-order-button'));
        });
        expect(screen.getByText('Confirm Order')).toBeInTheDocument();
    });

    it('should support orders with decimal amounts', async () => {
        await waitFor(() => render(<Default />, { preloadedState }));
        const input = screen.getByRole('textbox');
        fireEvent.change(input, { target: { value: '10.5' } });
        expect(
            screen.getByText(
                `~ $${preloadedAssetPrices.assetPrices.WFIL.price * 10.5}`
            )
        ).toBeInTheDocument();
    });

    it('should render a disabled button if amount is undefined or zero', async () => {
        await waitFor(() => render(<Default />, { preloadedState }));
        const input = screen.getByRole('textbox');
        expect(input).toHaveValue('');
        expect(screen.getByTestId('place-order-button')).toBeDisabled();
        await waitFor(() => {
            fireEvent.change(input, { target: { value: '10' } });
        });

        expect(screen.getByTestId('place-order-button')).not.toBeDisabled();
        await waitFor(() => {
            fireEvent.change(input, { target: { value: '0' } });
        });

        expect(screen.getByTestId('place-order-button')).toBeDisabled();
    });

    it('should render wallet source when side is lend', async () => {
        await waitFor(() => render(<Default />, { preloadedState }));
        const lendTab = screen.getByText('Lend');
        fireEvent.click(lendTab);
        expect(screen.getByText('Lending Source')).toBeInTheDocument();
        expect(screen.getByText('10,000')).toBeInTheDocument();

        const walletSourceButton = screen.getByTestId(
            'wallet-source-selector-button'
        );
        fireEvent.click(walletSourceButton);

        expect(screen.getByText('SF Vault')).toBeInTheDocument();
        const option = screen.getByTestId('option-1');
        fireEvent.click(option);
        expect(screen.getByText('100')).toBeInTheDocument();
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

    it('it should disable the action button and show error hint if amount is greater than available amount', async () => {
        await waitFor(() => render(<Default />, { preloadedState }));

        const lendTab = screen.getByText('Lend');
        fireEvent.click(lendTab);

        const input = screen.getByRole('textbox');
        fireEvent.change(input, { target: { value: '200' } });

        const button = screen.getByTestId('place-order-button');
        expect(button).not.toBeDisabled();
        expect(
            screen.queryByText('Insufficient amount in source')
        ).not.toBeInTheDocument();

        fireEvent.change(input, { target: { value: '20000' } });

        expect(button).toBeDisabled();
        expect(
            screen.queryByText('Insufficient amount in source')
        ).toBeInTheDocument();
    });
});
