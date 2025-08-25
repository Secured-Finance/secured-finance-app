import { composeStories } from '@storybook/react';
import { render, screen } from 'src/test-utils.js';
import * as stories from './AdvancedLendingTopBar.stories';

const { Default } = composeStories(stories);

describe('AdvancedLendingTopBar Component', () => {
    it('should render a AdvancedLendingTopBar with the values', () => {
        render(<Default />, {
            apolloMocks: Default.parameters?.apolloClient.mocks,
        });

        expect(
            screen.getByRole('button', { name: 'WFIL-DEC2022' })
        ).toBeInTheDocument();
        expect(screen.getByText('Maturity Dec 1, 2022')).toBeInTheDocument();

        expect(screen.getByText('Mark Price')).toBeInTheDocument();
        expect(screen.getByText('80.00')).toBeInTheDocument();

        expect(screen.getByText('Last Price')).toBeInTheDocument();
        expect(screen.getByText('--.--')).toBeInTheDocument();

        expect(screen.getByText('WFIL Price')).toBeInTheDocument();
        expect(screen.getByText('$7')).toBeInTheDocument();
    });

    it('should render source link for the selected asset', () => {
        render(<Default />, {
            apolloMocks: Default.parameters?.apolloClient.mocks,
        });

        expect(
            screen.getByRole('button', { name: 'WFIL-DEC2022' })
        ).toBeInTheDocument();
        const source = screen.getByRole('link');
        expect(source).toBeInTheDocument();
        expect(source).toHaveAttribute(
            'href',
            'https://www.coingecko.com/en/coins/filecoin'
        );
    });
});
