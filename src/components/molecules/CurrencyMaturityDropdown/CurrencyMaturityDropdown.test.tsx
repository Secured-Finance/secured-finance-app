import { composeStories } from '@storybook/react';
import { mockUseSF } from 'src/stories/mocks/useSFMock';
import {
    fireEvent,
    render,
    screen,
    waitFor,
    cleanupGraphQLMocks,
} from 'src/test-utils.js';
import graphqlMocks from 'src/test-utils/mockData';
import * as stories from './CurrencyMaturityDropdown.stories';

const mockSecuredFinance = mockUseSF();
jest.mock('src/hooks/useSecuredFinance', () => () => mockSecuredFinance);

const { Default } = composeStories(stories);

const openDropdown = () => {
    const button = screen.getByRole('button', { name: 'WBTC-DEC2022' });
    fireEvent.click(button);
};

describe('CurrencyMaturityDropdown', () => {
    afterEach(() => {
        cleanupGraphQLMocks();
    });

    it('should render a selected market', () => {
        render(<Default />, {
            graphqlMocks: graphqlMocks.withTransactions,
        });

        expect(screen.getByText('WBTC-DEC2022')).toBeInTheDocument();
    });

    it('should show the dropdown when the button is clicked', () => {
        render(<Default />, {
            graphqlMocks: graphqlMocks.withTransactions,
        });
        openDropdown();

        expect(
            screen.getByLabelText('Currency Maturity Dropdown')
        ).toBeInTheDocument();
    });

    it('should only show associated markets when user selects on currency filter', async () => {
        render(<Default />, {
            graphqlMocks: graphqlMocks.withTransactions,
        });
        openDropdown();

        await waitFor(() => {
            const currencyFilterBtn = screen.getByLabelText('WBTC-filter-btn');
            fireEvent.click(currencyFilterBtn);
        });

        expect(screen.queryByText('ETH-DEC2022')).not.toBeInTheDocument();
    });

    it('should filter markets based on search input', async () => {
        render(<Default />, {
            graphqlMocks: graphqlMocks.withTransactions,
        });

        openDropdown();

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
            graphqlMocks: graphqlMocks.withTransactions,
        });

        const button = screen.getByRole('button', { name: 'WBTC-DEC2022' });
        fireEvent.click(button);

        const searchInput = screen.getByRole('textbox');
        fireEvent.change(searchInput, { target: { value: 'Something' } });
        expect(searchInput.getAttribute('value')).toBe('Something');

        expect(screen.getByText('No products found')).toBeInTheDocument();
    });

    it.skip('should toggle favourite button when clicked', async () => {
        render(<Default />, {
            graphqlMocks: graphqlMocks.withTransactions,
        });

        openDropdown();

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
    });

    it.skip('should sort the markets by APR', async () => {
        render(<Default />, {
            graphqlMocks: graphqlMocks.withTransactions,
        });

        openDropdown();

        const sortByAPR = screen.getByRole('columnheader', { name: 'APR' });
        expect(sortByAPR).toBeInTheDocument();

        await waitFor(() => {
            expect(
                screen.getByRole('heading', { name: 'WBTC-DEC2022' })
            ).toBeInTheDocument();
        });

        const table = await screen.findByRole('grid');
        const tbody = table.querySelector('tbody');

        const getTopRow = () => tbody?.querySelectorAll('tr')[0];

        expect(getTopRow()).toHaveTextContent('WBTC-DEC2022');

        fireEvent.click(sortByAPR);

        await waitFor(
            () => {
                expect(getTopRow()).toHaveTextContent('WBTC-SEP2024');
            },
            { timeout: 500 }
        );
    }, 8000);

    it.skip('should sort the markets by volume', async () => {
        render(<Default />, {
            graphqlMocks: graphqlMocks.withTransactions,
        });

        openDropdown();

        const sortByVol = screen.getByRole('columnheader', { name: 'Volume' });
        expect(sortByVol).toBeInTheDocument();

        await waitFor(() => {
            expect(
                screen.getByRole('heading', { name: 'WBTC-DEC2022' })
            ).toBeInTheDocument();
        });

        const table = await screen.findByRole('grid');
        const tbody = table.querySelector('tbody');

        const getTopRow = () => tbody?.querySelectorAll('tr')[0];

        expect(getTopRow()).not.toHaveTextContent('$3,942,000');

        fireEvent.click(sortByVol);
        fireEvent.click(sortByVol);

        await waitFor(
            () => {
                expect(getTopRow()).toHaveTextContent('$3,942,000');
            },
            { timeout: 500 }
        );
    }, 8000);
});
