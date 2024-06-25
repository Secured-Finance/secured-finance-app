import { composeStories } from '@storybook/react';
import { fireEvent, render, screen } from 'src/test-utils.js';
import * as stories from './CurrencyMaturityDropdown.stories';

const { Default, ItayosePage, OpenedDropdown } = composeStories(stories);

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

    it.skip('should only show associated currencies when user selects on currency filter', async () => {
        render(<OpenedDropdown />);

        const currencyFilterBtn = screen.getByRole('button', {
            name: 'WBTC-filter-btn',
        });
        fireEvent.click(currencyFilterBtn);

        expect(screen.queryByText('ETH-DEC2022')).not.toBeInTheDocument();
    });
});
