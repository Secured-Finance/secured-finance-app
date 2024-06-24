import { composeStories } from '@storybook/react';
import { fireEvent, render, screen } from 'src/test-utils.js';
import * as stories from './CurrencyMaturityDropdown.stories';

const { Default } = composeStories(stories);

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
});
