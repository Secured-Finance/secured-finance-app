import { composeStories } from '@storybook/testing-react';
import { preloadedAssetPrices } from 'src/stories/mocks/fixtures';
import { render, screen } from 'src/test-utils.js';
import * as stories from './CurveHeader.stories';

const { Default } = composeStories(stories);

describe('CurveHeader component', () => {
    const preloadedState = { ...preloadedAssetPrices };

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
        expect(screen.getByText('$6.00')).toBeInTheDocument();
    });

    it('should display the change of the asset and round up the second decimal', () => {
        render(<Default />, { preloadedState });
        expect(screen.getByText('-8.21%')).toBeInTheDocument();
    });
});
