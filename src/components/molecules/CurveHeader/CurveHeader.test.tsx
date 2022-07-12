import { composeStories } from '@storybook/testing-react';
import { render, screen } from 'src/test-utils.js';
import * as stories from './CurveHeader.stories';

const { Default } = composeStories(stories);

describe('CurveHeader component', () => {
    const preloadedState = {
        assetPrices: {
            filecoin: {
                price: 5.87,
                change: -8.208519783216566,
            },
            ethereum: {
                price: 2000.34,
                change: 0.5162466489453748,
            },
            usdc: {
                price: 1.002,
                change: 0.042530768538486696,
            },
        },
    };

    it('should render CurveHeader', () => {
        render(<Default />);
    });

    it('should display the full name of the asset', () => {
        render(<Default />);
        expect(screen.getByText('Filecoin')).toBeInTheDocument();
    });

    it('should display the price of the asset', () => {
        render(<Default />, {
            preloadedState,
        });
        expect(screen.getByText('$5.87')).toBeInTheDocument();
    });

    it('should display the change of the asset and round up the second decimal', () => {
        render(<Default />, { preloadedState });
        expect(screen.getByText('-8.21%')).toBeInTheDocument();
    });
});
