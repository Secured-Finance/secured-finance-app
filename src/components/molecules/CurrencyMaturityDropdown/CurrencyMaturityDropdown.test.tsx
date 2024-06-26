import { composeStories } from '@storybook/react';
import { mockUseSF } from 'src/stories/mocks/useSFMock';
import { fireEvent, render, screen, waitFor } from 'src/test-utils.js';
import * as stories from './CurrencyMaturityDropdown.stories';

const mockSecuredFinance = mockUseSF();
jest.mock('src/hooks/useSecuredFinance', () => () => mockSecuredFinance);

const { Default, ItayosePage } = composeStories(stories);

describe('CurrencyMaturityDropdown', () => {
    it('should render a selected market', () => {
        render(<Default />);

        expect(screen.getByText('WBTC-DEC2022')).toBeInTheDocument();
    });

    it('should show the dropdown when the button is clicked', () => {
        render(<Default />);
        const button = screen.getByRole('button', { name: 'WBTC-DEC2022' });
        fireEvent.click(button);

        expect(
            screen.getByLabelText('Currency Maturity Dropdown')
        ).toBeInTheDocument();
    });

    it('should not render Itayose filter in Itayose page', () => {
        render(<ItayosePage />);
        const button = screen.getByRole('button', { name: 'WBTC-DEC2022' });
        fireEvent.click(button);

        expect(
            screen.queryByLabelText('itayose-filter-btn')
        ).not.toBeInTheDocument();
    });

    it('should only show associated markets when user selects on currency filter', async () => {
        render(<Default />);
        const button = screen.getByRole('button', { name: 'WBTC-DEC2022' });
        fireEvent.click(button);

        await waitFor(() => {
            const currencyFilterBtn = screen.getByLabelText('WBTC-filter-btn');
            fireEvent.click(currencyFilterBtn);
        });

        expect(screen.queryByText('ETH-DEC2022')).not.toBeInTheDocument();
    });

    it('should filter markets based on search input', async () => {
        render(<Default />);

        const button = screen.getByRole('button', { name: 'WBTC-DEC2022' });
        fireEvent.click(button);

        const searchInput = screen.getByRole('textbox');
        fireEvent.change(searchInput, { target: { value: 'ETH' } });
        expect(searchInput.getAttribute('value')).toBe('ETH');

        expect(screen.queryByText('WBTC-JUN2023')).not.toBeInTheDocument();

        fireEvent.change(searchInput, { target: { value: 'WBTC' } });
        expect(searchInput.getAttribute('value')).toBe('WBTC');

        expect(screen.queryByText('WBTC-JUN2023')).toBeInTheDocument();
    });

    it('should render relevant message when no products are found', () => {
        render(<Default />);

        const button = screen.getByRole('button', { name: 'WBTC-DEC2022' });
        fireEvent.click(button);

        const searchInput = screen.getByRole('textbox');
        fireEvent.change(searchInput, { target: { value: 'Something' } });
        expect(searchInput.getAttribute('value')).toBe('Something');

        expect(screen.queryByText('No products found')).toBeInTheDocument();
    });
});
