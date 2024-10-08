import { composeStories } from '@storybook/react';
import { render, screen } from 'src/test-utils.js';
import * as stories from './MarketInfoDialog.stories';

const { Default } = composeStories(stories);

describe('MarketInfoDialog Component', () => {
    it('renders the dialog when isOpen is true', () => {
        render(<Default />);
        expect(screen.getByText('Details')).toBeInTheDocument();
    });

    it('displays correct currency and maturity date', () => {
        render(<Default />);
        expect(screen.getByText('WFIL')).toBeInTheDocument();
        expect(screen.getByText('Dec 1, 2022')).toBeInTheDocument();
    });

    it('shows correct last price and APR', () => {
        render(<Default />);
        expect(screen.getByText('80.00')).toBeInTheDocument();
    });

    it('displays correct 24h stats', () => {
        render(<Default />);
        expect(screen.getByText('98.99')).toBeInTheDocument();
        expect(screen.getByText('94.57')).toBeInTheDocument();
    });

    it('shows correct currency price with external link', () => {
        render(<Default />);
        expect(screen.getByText('520 WFIL')).toBeInTheDocument();
        expect(screen.getByRole('link')).toHaveAttribute('target', '_blank');
    });
});
