import { composeStories } from '@storybook/testing-react';
import { preloadedAssetPrices } from 'src/stories/mocks/fixtures';
import { render, screen } from 'src/test-utils.js';
import * as stories from './AssetInformation.stories';

const { Default } = composeStories(stories);

describe('test AssetInformation component', () => {
    it('should render AssetInformation', () => {
        const preloadedState = { ...preloadedAssetPrices };
        render(<Default />, { preloadedState });
        expect(screen.getByText('Collateral Assets')).toBeInTheDocument();
        expect(screen.getByText('ETH')).toBeInTheDocument();
        expect(screen.getByText('1.2 ETH')).toBeInTheDocument();

        expect(screen.getByText('USDC')).toBeInTheDocument();
        expect(screen.getByText('10 USDC')).toBeInTheDocument();
    });
});
