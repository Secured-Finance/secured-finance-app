import { composeStories } from '@storybook/react';
import { mockUseSF } from 'src/stories/mocks/useSFMock';
import { fireEvent, render, screen, waitFor } from 'src/test-utils.js';
import * as stories from './CurrencyMaturityDropdown.stories';

const mockSecuredFinance = mockUseSF();
jest.mock('src/hooks/useSecuredFinance', () => () => mockSecuredFinance);

const { Default } = composeStories(stories);

describe('CurrencyMaturityDropdown', () => {
    it('should render a selected market', () => {
        render(<Default />, {
            apolloMocks: Default.parameters?.apolloClient.mocks,
        });

        expect(screen.getByText('WBTC-DEC2022')).toBeInTheDocument();
    });

    it('should show the dropdown when the button is clicked', () => {
        render(<Default />, {
            apolloMocks: Default.parameters?.apolloClient.mocks,
        });
        const button = screen.getByRole('button', { name: 'WBTC-DEC2022' });
        fireEvent.click(button);

        expect(
            screen.getByLabelText('Currency Maturity Dropdown')
        ).toBeInTheDocument();
    });

    it('should only show associated markets when user selects on currency filter', async () => {
        render(<Default />, {
            apolloMocks: Default.parameters?.apolloClient.mocks,
        });
        const button = screen.getByRole('button', { name: 'WBTC-DEC2022' });
        fireEvent.click(button);

        await waitFor(() => {
            const currencyFilterBtn = screen.getByLabelText('WBTC-filter-btn');
            fireEvent.click(currencyFilterBtn);
        });

        expect(screen.queryByText('ETH-DEC2022')).not.toBeInTheDocument();
    });

    it('should filter markets based on search input', async () => {
        render(<Default />, {
            apolloMocks: Default.parameters?.apolloClient.mocks,
        });

        const button = screen.getByRole('button', { name: 'WBTC-DEC2022' });
        fireEvent.click(button);

        const searchInput = screen.getByRole('textbox');
        fireEvent.change(searchInput, { target: { value: 'ETH' } });
        expect(searchInput.getAttribute('value')).toBe('ETH');

        expect(screen.queryByText('WBTC-JUN2023')).not.toBeInTheDocument();

        fireEvent.change(searchInput, { target: { value: 'WBTC' } });
        expect(searchInput.getAttribute('value')).toBe('WBTC');

        await waitFor(() => {
            expect(screen.getByText('WBTC-JUN2023')).toBeInTheDocument();
        });
    });

    it('should render relevant message when no products are found', () => {
        render(<Default />, {
            apolloMocks: Default.parameters?.apolloClient.mocks,
        });

        const button = screen.getByRole('button', { name: 'WBTC-DEC2022' });
        fireEvent.click(button);

        const searchInput = screen.getByRole('textbox');
        fireEvent.change(searchInput, { target: { value: 'Something' } });
        expect(searchInput.getAttribute('value')).toBe('Something');

        expect(screen.getByText('No products found')).toBeInTheDocument();
    });

    it('should toggle favourite button when clicked', async () => {
        render(<Default />, {
            apolloMocks: Default.parameters?.apolloClient.mocks,
        });

        const button = screen.getByRole('button', { name: 'WBTC-DEC2022' });
        fireEvent.click(button);

        await waitFor(() => {
            const favouriteBtn = screen.getByLabelText(
                'Add WBTC-DEC2022 to favorites'
            );
            expect(favouriteBtn).toBeInTheDocument();
            fireEvent.click(favouriteBtn);
        });

        expect(
            screen.getByLabelText('Remove WBTC-DEC2022 from favorites')
        ).toBeInTheDocument();
    }, 8000);
});
