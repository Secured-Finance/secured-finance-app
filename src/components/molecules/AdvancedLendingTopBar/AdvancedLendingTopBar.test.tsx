import { composeStories } from '@storybook/testing-react';
import { render, screen } from 'src/test-utils.js';
import * as stories from './AdvancedLendingTopBar.stories';

const { Default, Values } = composeStories(stories);

describe('AdvancedLendingTopBar Component', () => {
    it('should render a default AdvancedLendingTopBar', () => {
        render(<Default />);

        expect(
            screen.getByRole('button', { name: 'Wrapped Bitcoin' })
        ).toBeInTheDocument();
        expect(screen.getByText('Maturity Dec 1, 2022')).toBeInTheDocument();

        expect(screen.getByText('24h High')).toBeInTheDocument();
        expect(screen.getByText('24h Low')).toBeInTheDocument();
        expect(screen.getByText('24h Trades')).toBeInTheDocument();
        expect(screen.getByText('24h Volume')).toBeInTheDocument();
        expect(screen.getAllByText('0')).toHaveLength(5);
    });

    it('should render the values on the AdvancedLendingTopBar', () => {
        render(<Values />);

        expect(screen.getByText('26.16')).toBeInTheDocument();
        expect(screen.getByText('24.2')).toBeInTheDocument();
        expect(screen.getByText('894')).toBeInTheDocument();
        expect(screen.getByText('10,000,000')).toBeInTheDocument();
        expect(screen.getByText('23000')).toBeInTheDocument();
    });

    it('should compute the midPrice and display it', () => {
        render(<Values />, {
            preloadedState: {
                analytics: { midPrice: 9800 },
            },
        });

        expect(screen.getByText('98.00')).toBeInTheDocument();
        expect(screen.getByText('2.05% APR')).toBeInTheDocument();
    });

    it('should render source link for the selected asset', () => {
        render(<Default />);

        expect(
            screen.getByRole('button', { name: 'Wrapped Bitcoin' })
        ).toBeInTheDocument();
        const source = screen.getByRole('link');
        expect(source).toBeInTheDocument();
        expect(source).toHaveAttribute(
            'href',
            'https://www.coingecko.com/en/coins/wrapped-bitcoin'
        );
    });
});
