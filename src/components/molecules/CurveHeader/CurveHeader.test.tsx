import { composeStories } from '@storybook/testing-react';
import { preloadedAssetPrices } from 'src/stories/mocks/fixtures';
import { render, screen } from 'src/test-utils.js';
import * as stories from './CurveHeader.stories';

const { Default } = composeStories(stories);

describe('CurveHeader component', () => {
    it('should render CurveHeader', async () => {
        render(<Default />);
    });

    it('should display the full name of the asset', async () => {
        render(<Default />);
        expect(screen.getByText('Filecoin')).toBeInTheDocument();
    });

    it('should display the price of the asset', async () => {
        render(<Default />, {
            preloadedState: {
                ...preloadedAssetPrices,
            },
        });
        expect(screen.getByText('$6.00')).toBeInTheDocument();
    });

    it('should display the change of the asset and round up the second decimal', async () => {
        render(<Default />, {
            preloadedState: {
                ...preloadedAssetPrices,
            },
        });
        expect(screen.getByText('-8.21%')).toBeInTheDocument();
    });

    it('should display Total Volume (Asset) and Total Volume (USD) and their values', async () => {
        render(<Default />, {
            preloadedState: {
                ...preloadedAssetPrices,
            },
        });
        expect(screen.getByText('Total Volume (Asset)')).toBeInTheDocument();
        expect(screen.getByText('657,000 EFIL')).toBeInTheDocument();
        expect(screen.getByText('Total Volume (USD)')).toBeInTheDocument();
        expect(screen.getByText('$3,942,000')).toBeInTheDocument();
    });
});
